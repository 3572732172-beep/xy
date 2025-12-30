/**
 * 报价管理路由
 */

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const { query, queryOne } = require('../config/database');
const { success, error } = require('../utils/response');
const { calculateDistance } = require('../utils/calculateDistance');

/**
 * 获取需求的报价列表
 * GET /api/demand/quote/list?demand_id=xxx
 */
router.get('/list', optionalAuth, async (req, res) => {
  try {
    const { demand_id } = req.query;
    
    if (!demand_id) {
      return res.json(error('缺少需求ID'));
    }
    
    // 获取需求信息
    const demand = await queryOne('SELECT lng, lat FROM demands WHERE id = ?', [demand_id]);
    if (!demand) {
      return res.json(error('需求不存在'));
    }
    
    // 获取报价列表
    const quotes = await query(
      `SELECT q.*, m.name as master_name, m.avatar as master_avatar, m.rating, m.order_count, m.phone as master_phone
       FROM quotes q
       JOIN masters m ON q.master_id = m.id
       WHERE q.demand_id = ? AND q.status = 1
       ORDER BY q.created_at DESC`,
      [demand_id]
    );
    
    // 处理报价数据
    const quoteList = quotes.map(quote => {
      // 计算距离
      let distance = 0;
      if (quote.lng && quote.lat) {
        distance = calculateDistance(demand.lat, demand.lng, quote.lat, quote.lng);
      }
      
      // 解析材料清单
      let materials = [];
      if (quote.materials) {
        try {
          materials = JSON.parse(quote.materials);
        } catch (e) {
          materials = [];
        }
      }
      
      return {
        id: quote.id,
        master_id: quote.master_id,
        master_name: quote.master_name,
        master_avatar: quote.master_avatar || '',
        master_phone: quote.master_phone,
        rating: quote.rating || 5.0,
        order_count: quote.order_count || 0,
        total_price: quote.total_price,
        material_price: quote.material_price || 0,
        labor_price: quote.labor_price || 0,
        other_price: quote.other_price || 0,
        work_days: quote.work_days,
        warranty_months: quote.warranty_months || 12,
        materials: materials,
        distance: distance,
        created_at: quote.created_at
      };
    });
    
    res.json(success({
      list: quoteList,
      total: quoteList.length
    }));
  } catch (err) {
    console.error('获取报价列表失败:', err);
    res.json(error('获取报价列表失败，请稍后重试'));
  }
});

module.exports = router;


