/**
 * 订单管理路由
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { query, queryOne, run } = require('../config/database');
const { success, error } = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

/**
 * 创建订单
 * POST /api/order/create
 */
router.post('/create', authenticate, async (req, res) => {
  try {
    const { quote_id, warranty_months } = req.body;
    const userId = req.user.id;
    
    if (!quote_id) {
      return res.json(error('缺少报价ID'));
    }
    
    // 获取报价信息
    const quote = await queryOne(
      `SELECT q.*, d.user_id as demand_user_id, d.id as demand_id
       FROM quotes q
       JOIN demands d ON q.demand_id = d.id
       WHERE q.id = ? AND q.status = 1`,
      [quote_id]
    );
    
    if (!quote) {
      return res.json(error('报价不存在或已失效'));
    }
    
    // 验证需求是否属于当前用户
    if (quote.demand_user_id !== userId) {
      return res.json(error('无权操作此需求'));
    }
    
    // 生成订单号
    const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // 创建订单
    const result = await run(
      `INSERT INTO orders (order_no, demand_id, user_id, master_id, quote_id, total_price, warranty_months, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [orderNo, quote.demand_id, userId, quote.master_id, quote_id, quote.total_price, warranty_months || 12]
    );
    
    // 更新报价状态为已接单
    await run('UPDATE quotes SET status = 2 WHERE id = ?', [quote_id]);
    
    res.json(success({
      id: result.lastID,
      order_no: orderNo
    }));
  } catch (err) {
    console.error('创建订单失败:', err);
    res.json(error('创建订单失败，请稍后重试'));
  }
});

/**
 * 获取订单列表
 * GET /api/order/list?role=user&page=1&page_size=10&status=1,2,3
 */
router.get('/list', authenticate, async (req, res) => {
  try {
    const { role = 'user', page = 1, page_size = 10, status } = req.query;
    const userId = req.user.id;
    
    let sql = `
      SELECT o.*, 
             COALESCE(d.title, '需求标题') as demand_title, 
             COALESCE(d.service_type, 1) as service_type, 
             COALESCE(d.address, '') as address, 
             COALESCE(m.name, '待匹配师傅') as master_name, 
             COALESCE(m.avatar, '') as master_avatar
      FROM orders o
      LEFT JOIN demands d ON o.demand_id = d.id
      LEFT JOIN masters m ON o.master_id = m.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // 根据角色筛选
    if (role === 'user') {
      sql += ' AND o.user_id = ?';
      params.push(userId);
    } else if (role === 'master') {
      sql += ' AND o.master_id = ?';
      params.push(userId);
    }
    
    // 状态筛选
    if (status) {
      const statusList = status.split(',').map(s => parseInt(s));
      sql += ' AND o.status IN (' + statusList.map(() => '?').join(',') + ')';
      params.push(...statusList);
    }
    
    sql += ' ORDER BY o.created_at DESC';
    
    // 获取总数
    const countResult = await queryOne(
      sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as count FROM'),
      params
    );
    const total = countResult ? countResult.count : 0;
    
    // 分页
    const start = (parseInt(page) - 1) * parseInt(page_size);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(page_size), start);
    
    const orders = await query(sql, params);
    
    const orderList = orders.map(order => ({
      id: order.id,
      order_no: order.order_no,
      demand_title: order.demand_title,
      service_type: order.service_type,
      address: order.address,
      master_name: order.master_name,
      master_avatar: order.master_avatar || '',
      total_price: order.total_price,
      status: order.status,
      created_at: order.created_at
    }));
    
    res.json(success({
      list: orderList,
      total: total,
      page: parseInt(page),
      page_size: parseInt(page_size)
    }));
  } catch (err) {
    console.error('获取订单列表失败:', err);
    res.json(error('获取订单列表失败，请稍后重试'));
  }
});

/**
 * 获取订单详情
 * GET /api/order/detail?order_id=xxx
 */
router.get('/detail', authenticate, async (req, res) => {
  try {
    const { order_id } = req.query;
    const userId = req.user.id;
    
    if (!order_id) {
      return res.json(error('缺少订单ID'));
    }
    
    const order = await queryOne(
      `SELECT o.*, d.title as demand_title, d.service_type, d.power_kw, d.address, d.photos as demand_photos,
              m.name as master_name, m.avatar as master_avatar, m.rating as master_rating, m.phone as master_phone,
              q.material_price, q.labor_price, q.other_price, q.work_days
       FROM orders o
       JOIN demands d ON o.demand_id = d.id
       JOIN masters m ON o.master_id = m.id
       JOIN quotes q ON o.quote_id = q.id
       WHERE o.id = ? AND (o.user_id = ? OR o.master_id = ?)`,
      [order_id, userId, userId]
    );
    
    if (!order) {
      return res.json(error('订单不存在或无权限查看'));
    }
    
    // 解析需求照片
    if (order.demand_photos) {
      try {
        order.demand_photos = JSON.parse(order.demand_photos);
      } catch (e) {
        order.demand_photos = [];
      }
    } else {
      order.demand_photos = [];
    }
    
    res.json(success(order));
  } catch (err) {
    console.error('获取订单详情失败:', err);
    res.json(error('获取订单详情失败，请稍后重试'));
  }
});

/**
 * 支付订单
 * POST /api/order/pay
 */
router.post('/pay', authenticate, async (req, res) => {
  try {
    const { order_id } = req.body;
    const userId = req.user.id;
    
    if (!order_id) {
      return res.json(error('缺少订单ID'));
    }
    
    // 获取订单
    const order = await queryOne('SELECT * FROM orders WHERE id = ? AND user_id = ?', [order_id, userId]);
    if (!order) {
      return res.json(error('订单不存在'));
    }
    
    if (order.status !== 1) {
      return res.json(error('订单状态不正确，无法支付'));
    }
    
    // 更新订单状态为已支付
    await run('UPDATE orders SET status = 2, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [order_id]);
    
    res.json(success({ message: '支付成功' }));
  } catch (err) {
    console.error('支付订单失败:', err);
    res.json(error('支付失败，请稍后重试'));
  }
});

/**
 * 取消订单
 * POST /api/order/cancel
 */
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const { order_id } = req.body;
    const userId = req.user.id;
    
    if (!order_id) {
      return res.json(error('缺少订单ID'));
    }
    
    // 获取订单
    const order = await queryOne('SELECT * FROM orders WHERE id = ? AND user_id = ?', [order_id, userId]);
    if (!order) {
      return res.json(error('订单不存在'));
    }
    
    if (order.status >= 4) {
      return res.json(error('订单已完成，无法取消'));
    }
    
    // 更新订单状态为已取消
    await run('UPDATE orders SET status = 5, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [order_id]);
    
    res.json(success({ message: '订单已取消' }));
  } catch (err) {
    console.error('取消订单失败:', err);
    res.json(error('取消订单失败，请稍后重试'));
  }
});

/**
 * 确认验收
 * POST /api/order/confirm
 */
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { order_id } = req.body;
    const userId = req.user.id;
    
    if (!order_id) {
      return res.json(error('缺少订单ID'));
    }
    
    // 获取订单
    const order = await queryOne('SELECT * FROM orders WHERE id = ? AND user_id = ?', [order_id, userId]);
    if (!order) {
      return res.json(error('订单不存在'));
    }
    
    if (order.status !== 3) {
      return res.json(error('订单状态不正确，无法确认验收'));
    }
    
    // 更新订单状态为已完成
    await run('UPDATE orders SET status = 4, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [order_id]);
    
    res.json(success({ message: '验收成功' }));
  } catch (err) {
    console.error('确认验收失败:', err);
    res.json(error('确认验收失败，请稍后重试'));
  }
});

module.exports = router;


