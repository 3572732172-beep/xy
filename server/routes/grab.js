/**
 * 师傅抢单路由
 * 供师傅端调用，获取待抢单需求列表和抢单功能
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { query, queryOne, run } = require('../config/database');
const { success, error } = require('../utils/response');
const { calculateDistance } = require('../utils/calculateDistance');

/**
 * 获取待抢单需求列表
 * GET /api/grab/list?page=1&page_size=10&service_type=1&sort=distance
 * Headers: Authorization: Bearer {token}
 */
router.get('/list', authenticate, async (req, res) => {
  try {
    const { page = 1, page_size = 10, service_type, sort = 'distance' } = req.query;
    const masterId = req.user.id;
    
    // 获取师傅信息（用于计算距离）
    const master = await queryOne('SELECT lng, lat FROM masters WHERE id = ?', [masterId]);
    if (!master) {
      return res.json(error('师傅信息不存在'));
    }
    
    // 查询待抢单的需求（status=1 且 master_id 为 NULL 的订单）
    let sql = `
      SELECT o.id as order_id,
             o.order_no,
             o.demand_id,
             o.created_at as order_time,
             d.title,
             d.description,
             d.service_type,
             d.power_kw,
             d.address,
             d.lng,
             d.lat,
             d.photos,
             u.name as user_name,
             u.phone as user_phone
      FROM orders o
      JOIN demands d ON o.demand_id = d.id
      JOIN users u ON o.user_id = u.id
      WHERE o.status = 1 
        AND o.master_id IS NULL
    `;
    
    const params = [];
    
    // 服务类型筛选
    if (service_type) {
      sql += ' AND d.service_type = ?';
      params.push(parseInt(service_type));
    }
    
    // 获取总数
    const countResult = await queryOne(
      sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as count FROM'),
      params
    );
    const total = countResult ? countResult.count : 0;
    
    // 计算距离并排序
    const allDemands = await query(sql, params);
    
    const demandsWithDistance = allDemands.map(demand => {
      let distance = 0;
      if (master.lng && master.lat && demand.lng && demand.lat) {
        distance = calculateDistance(master.lat, master.lng, demand.lat, demand.lng);
      }
      
      // 解析照片
      let photos = [];
      if (demand.photos) {
        try {
          photos = JSON.parse(demand.photos);
        } catch (e) {
          photos = [];
        }
      }
      
      return {
        order_id: demand.order_id,
        order_no: demand.order_no,
        demand_id: demand.demand_id,
        title: demand.title,
        description: demand.description,
        service_type: demand.service_type,
        power_kw: demand.power_kw,
        address: demand.address,
        distance: parseFloat(distance.toFixed(2)),
        photos: photos,
        user_name: demand.user_name,
        user_phone: demand.user_phone,
        order_time: demand.order_time
      };
    });
    
    // 排序
    let sortedDemands = [...demandsWithDistance];
    if (sort === 'distance') {
      sortedDemands.sort((a, b) => a.distance - b.distance);
    } else if (sort === 'time') {
      sortedDemands.sort((a, b) => new Date(b.order_time) - new Date(a.order_time));
    }
    
    // 分页
    const start = (parseInt(page) - 1) * parseInt(page_size);
    const end = start + parseInt(page_size);
    const paginatedDemands = sortedDemands.slice(start, end);
    
    res.json(success({
      list: paginatedDemands,
      total: total,
      page: parseInt(page),
      page_size: parseInt(page_size)
    }));
  } catch (err) {
    console.error('获取待抢单列表失败:', err);
    res.json(error('获取待抢单列表失败，请稍后重试'));
  }
});

/**
 * 师傅抢单
 * POST /api/grab/grab
 * Headers: Authorization: Bearer {token}
 * Body: { order_id: xxx }
 */
router.post('/grab', authenticate, async (req, res) => {
  try {
    const { order_id } = req.body;
    const masterId = req.user.id;
    
    if (!order_id) {
      return res.json(error('缺少订单ID'));
    }
    
    // 检查订单是否存在且可抢
    const order = await queryOne(`
      SELECT o.*, d.title as demand_title
      FROM orders o
      JOIN demands d ON o.demand_id = d.id
      WHERE o.id = ? AND o.status = 1 AND o.master_id IS NULL
    `, [order_id]);
    
    if (!order) {
      return res.json(error('订单不存在或已被抢单'));
    }
    
    // 检查师傅是否存在
    const master = await queryOne('SELECT id FROM masters WHERE id = ?', [masterId]);
    if (!master) {
      return res.json(error('师傅信息不存在'));
    }
    
    // 更新订单，将 master_id 设置为当前师傅
    await run(
      'UPDATE orders SET master_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [masterId, order_id]
    );
    
    res.json(success({
      message: '抢单成功',
      order_id: order_id,
      demand_title: order.demand_title
    }));
  } catch (err) {
    console.error('抢单失败:', err);
    res.json(error('抢单失败，请稍后重试'));
  }
});

/**
 * 获取抢单详情
 * GET /api/grab/detail?order_id=xxx
 * Headers: Authorization: Bearer {token}
 */
router.get('/detail', authenticate, async (req, res) => {
  try {
    const { order_id } = req.query;
    
    if (!order_id) {
      return res.json(error('缺少订单ID'));
    }
    
    const order = await queryOne(`
      SELECT o.*,
             d.title,
             d.description,
             d.service_type,
             d.power_kw,
             d.address,
             d.lng,
             d.lat,
             d.photos,
             u.name as user_name,
             u.phone as user_phone
      FROM orders o
      JOIN demands d ON o.demand_id = d.id
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [order_id]);
    
    if (!order) {
      return res.json(error('订单不存在'));
    }
    
    // 解析照片
    let photos = [];
    if (order.photos) {
      try {
        photos = JSON.parse(order.photos);
      } catch (e) {
        photos = [];
      }
    }
    
    // 计算距离（如果师傅已登录）
    let distance = 0;
    const masterId = req.user.id;
    const master = await queryOne('SELECT lng, lat FROM masters WHERE id = ?', [masterId]);
    if (master && master.lng && master.lat && order.lng && order.lat) {
      distance = calculateDistance(master.lat, master.lng, order.lat, order.lng);
    }
    
    res.json(success({
      order_id: order.id,
      order_no: order.order_no,
      demand_id: order.demand_id,
      title: order.title,
      description: order.description,
      service_type: order.service_type,
      power_kw: order.power_kw,
      address: order.address,
      lng: order.lng,
      lat: order.lat,
      photos: photos,
      user_name: order.user_name,
      user_phone: order.user_phone,
      distance: parseFloat(distance.toFixed(2)),
      status: order.status,
      created_at: order.created_at
    }));
  } catch (err) {
    console.error('获取抢单详情失败:', err);
    res.json(error('获取抢单详情失败，请稍后重试'));
  }
});

module.exports = router;
