/**
 * 需求管理路由
 */

const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const { query, queryOne, run } = require('../config/database');
const { success, error } = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

// 缓存 orders 表是否有 service_type 字段
let ordersHasServiceType = null;

/**
 * 检查 orders 表是否有 service_type 字段
 */
async function checkOrdersServiceType() {
  if (ordersHasServiceType !== null) {
    return ordersHasServiceType;
  }
  
  try {
    const DB_TYPE = process.env.DB_TYPE || 'mysql';
    if (DB_TYPE === 'mysql') {
      const result = await query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'orders' 
        AND COLUMN_NAME = 'service_type'
      `);
      ordersHasServiceType = result[0] && result[0].count > 0;
    } else {
      // SQLite
      const result = await query(`PRAGMA table_info(orders)`);
      ordersHasServiceType = result.some(col => col.name === 'service_type');
    }
  } catch (err) {
    console.warn('检查 orders 表结构失败，假设没有 service_type 字段:', err.message);
    ordersHasServiceType = false;
  }
  
  return ordersHasServiceType;
}

/**
 * 创建需求
 * POST /api/demand/create
 */
router.post('/create', authenticate, async (req, res) => {
  try {
    const { service_type, title, description, power_kw, address, lng, lat, photos, offline_local_id } = req.body;
    const userId = req.user.id;
    
    // 参数验证（service_type 可能为 0，所以需要检查 undefined 和 null）
    const finalServiceType = service_type !== undefined && service_type !== null ? service_type : 1;
    if (!title || !address || lng === undefined || lat === undefined) {
      return res.json(error('缺少必要参数'));
    }
    
    // 保存照片（JSON 字符串）
    const photosJson = photos && photos.length > 0 ? JSON.stringify(photos) : null;
    
    // 插入需求
    const result = await run(
      `INSERT INTO demands (user_id, service_type, title, description, power_kw, address, lng, lat, photos, offline_local_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [userId, finalServiceType, title, description || '', power_kw || 0, address, lng, lat, photosJson, offline_local_id || null]
    );
    
    const demandId = result.lastID;
    
    // 创建对应的订单记录（待匹配状态）
    const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
    const hasServiceType = await checkOrdersServiceType();
    
    if (hasServiceType) {
      // 如果表有 service_type 字段，包含它
      await run(
        `INSERT INTO orders (order_no, demand_id, user_id, master_id, quote_id, total_price, warranty_months, status, service_type)
         VALUES (?, ?, ?, NULL, NULL, 0, 12, 1, ?)`,
        [orderNo, demandId, userId, finalServiceType]
      );
    } else {
      // 如果表没有 service_type 字段，不包含它
      await run(
        `INSERT INTO orders (order_no, demand_id, user_id, master_id, quote_id, total_price, warranty_months, status)
         VALUES (?, ?, ?, NULL, NULL, 0, 12, 1)`,
        [orderNo, demandId, userId]
      );
    }
    
    res.json(success({
      id: demandId,
      status: 1
    }));
  } catch (err) {
    console.error('创建需求失败:', err);
    // 在开发环境显示详细错误信息，生产环境显示通用错误
    const errorMsg = process.env.NODE_ENV === 'development' 
      ? `创建需求失败: ${err.message}` 
      : '创建需求失败，请稍后重试';
    res.json(error(errorMsg));
  }
});

/**
 * 同步需求（离线同步）
 * POST /api/demand/sync
 */
router.post('/sync', authenticate, async (req, res) => {
  try {
    const { service_type, title, description, power_kw, address, lng, lat, photos, offline_local_id } = req.body;
    const userId = req.user.id;
    
    // 确保 service_type 有值
    const finalServiceType = service_type !== undefined && service_type !== null ? service_type : 1;
    
    // 检查是否已存在（通过 offline_local_id）
    let existingDemand = null;
    if (offline_local_id) {
      existingDemand = await queryOne(
        'SELECT id FROM demands WHERE offline_local_id = ? AND user_id = ?',
        [offline_local_id, userId]
      );
    }
    
    if (existingDemand) {
      // 更新现有需求
      const photosJson = photos && photos.length > 0 ? JSON.stringify(photos) : null;
      await run(
        `UPDATE demands SET service_type = ?, title = ?, description = ?, power_kw = ?, 
         address = ?, lng = ?, lat = ?, photos = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [finalServiceType, title, description || '', power_kw || 0, address, lng, lat, photosJson, existingDemand.id]
      );
      
      return res.json(success({
        id: existingDemand.id,
        status: 1
      }));
    } else {
      // 创建新需求
      const photosJson = photos && photos.length > 0 ? JSON.stringify(photos) : null;
      const result = await run(
        `INSERT INTO demands (user_id, service_type, title, description, power_kw, address, lng, lat, photos, offline_local_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [userId, finalServiceType, title, description || '', power_kw || 0, address, lng, lat, photosJson, offline_local_id || null]
      );
      
      const demandId = result.lastID;
      
      // 创建对应的订单记录（待匹配状态）
      const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
      const hasServiceType = await checkOrdersServiceType();
      
      if (hasServiceType) {
        // 如果表有 service_type 字段，包含它
        await run(
          `INSERT INTO orders (order_no, demand_id, user_id, master_id, quote_id, total_price, warranty_months, status, service_type)
           VALUES (?, ?, ?, NULL, NULL, 0, 12, 1, ?)`,
          [orderNo, demandId, userId, finalServiceType]
        );
      } else {
        // 如果表没有 service_type 字段，不包含它
        await run(
          `INSERT INTO orders (order_no, demand_id, user_id, master_id, quote_id, total_price, warranty_months, status)
           VALUES (?, ?, ?, NULL, NULL, 0, 12, 1)`,
          [orderNo, demandId, userId]
        );
      }
      
      return res.json(success({
        id: demandId,
        status: 1
      }));
    }
  } catch (err) {
    console.error('同步需求失败:', err);
    // 在开发环境显示详细错误信息，生产环境显示通用错误
    const errorMsg = process.env.NODE_ENV === 'development' 
      ? `同步需求失败: ${err.message}` 
      : '同步需求失败，请稍后重试';
    res.json(error(errorMsg));
  }
});

/**
 * 获取需求详情
 * GET /api/demand/detail?id=xxx
 */
router.get('/detail', optionalAuth, async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.json(error('缺少需求ID'));
    }
    
    const demand = await queryOne('SELECT * FROM demands WHERE id = ?', [id]);
    if (!demand) {
      return res.json(error('需求不存在'));
    }
    
    // 解析照片
    if (demand.photos) {
      try {
        demand.photos = JSON.parse(demand.photos);
      } catch (e) {
        demand.photos = [];
      }
    } else {
      demand.photos = [];
    }
    
    res.json(success(demand));
  } catch (err) {
    console.error('获取需求详情失败:', err);
    res.json(error('获取需求详情失败，请稍后重试'));
  }
});

module.exports = router;


