/**
 * 师傅匹配路由
 */

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const { query, queryOne } = require('../config/database');
const { success, error } = require('../utils/response');
const { calculateDistance } = require('../utils/calculateDistance');

/**
 * 获取推荐师傅列表
 * GET /api/match/masters?demand_id=xxx&sort=distance&page=1&page_size=10
 */
router.get('/masters', optionalAuth, async (req, res) => {
  try {
    const { demand_id, sort = 'distance', page = 1, page_size = 10 } = req.query;
    
    // 获取所有师傅
    const masters = await query('SELECT * FROM masters');
    
    if (masters.length === 0) {
      return res.json(success({
        list: [],
        total: 0,
        page: parseInt(page),
        page_size: parseInt(page_size)
      }));
    }
    
    // 计算距离并添加额外信息
    let demandLat = 39.9; // 默认位置（北京）
    let demandLng = 116.4;
    
    if (demand_id) {
      // 获取需求信息（包含位置）
      const demand = await queryOne('SELECT lng, lat FROM demands WHERE id = ?', [demand_id]);
      if (demand && demand.lat && demand.lng) {
        demandLat = demand.lat;
        demandLng = demand.lng;
      }
    }
    
    const mastersWithDistance = masters.map(master => {
      let distance = 0;
      if (master.lng && master.lat) {
        distance = calculateDistance(demandLat, demandLng, master.lat, master.lng);
      }
      
      // 解析 tags
      let tags = [];
      if (master.tags) {
        try {
          tags = JSON.parse(master.tags);
        } catch (e) {
          tags = [];
        }
      }
      
      return {
        id: master.id,
        name: master.name,
        avatar: master.avatar || '',
        rating: master.rating || 5.0,
        order_count: master.order_count || 0,
        tags: tags,
        distance: distance,
        min_price: 0, // 可以从历史报价中计算
        max_price: 0
      };
    });
    
    // 排序
    let sortedMasters = [...mastersWithDistance];
    if (sort === 'distance') {
      sortedMasters.sort((a, b) => a.distance - b.distance);
    } else if (sort === 'rating') {
      sortedMasters.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'price') {
      sortedMasters.sort((a, b) => a.min_price - b.min_price);
    }
    
    // 分页
    const start = (parseInt(page) - 1) * parseInt(page_size);
    const end = start + parseInt(page_size);
    const paginatedMasters = sortedMasters.slice(start, end);
    
    res.json(success({
      list: paginatedMasters,
      total: sortedMasters.length,
      page: parseInt(page),
      page_size: parseInt(page_size)
    }));
  } catch (err) {
    console.error('获取师傅列表失败:', err);
    res.json(error('获取师傅列表失败，请稍后重试'));
  }
});

module.exports = router;


