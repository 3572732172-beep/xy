/**
 * 初始化测试数据脚本
 * 用于创建测试用户、师傅、需求等数据
 */

const path = require('path');
const fs = require('fs');

// 尝试加载 .env 文件，如果不存在则尝试 env.config.env
const envPath = path.join(__dirname, '../.env');
const envConfigPath = path.join(__dirname, '../env.config.env');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else if (fs.existsSync(envConfigPath)) {
  require('dotenv').config({ path: envConfigPath });
}

const bcrypt = require('bcryptjs');
const { run, query } = require('../config/database');

async function initTestData() {
  console.log('开始初始化测试数据...');
  
  try {
    // 创建测试用户
    const userPassword = await bcrypt.hash('123456', 10);
    const userResult = await run(
      'INSERT INTO users (phone, password, name) VALUES (?, ?, ?)',
      ['13800138000', userPassword, '测试用户']
    );
    console.log('创建测试用户成功，ID:', userResult.lastID);
    
    // 创建测试师傅
    const masterPassword = await bcrypt.hash('123456', 10);
    const masters = [
      {
        phone: '13900139000',
        name: '张师傅',
        rating: 4.8,
        order_count: 50,
        tags: ['生活用电', '电路维修', '经验丰富'],
        lng: 116.123456,
        lat: 39.123456
      },
      {
        phone: '13900139001',
        name: '李师傅',
        rating: 4.9,
        order_count: 80,
        tags: ['电器维护', '故障排除', '专业认证'],
        lng: 116.223456,
        lat: 39.223456
      },
      {
        phone: '13900139002',
        name: '王师傅',
        rating: 4.7,
        order_count: 65,
        tags: ['用电改造', '生活用电', '服务周到'],
        lng: 116.323456,
        lat: 39.323456
      },
      {
        phone: '13900139003',
        name: '刘师傅',
        rating: 5.0,
        order_count: 120,
        tags: ['电路维修', '电器维护', '经典案例'],
        lng: 116.423456,
        lat: 39.423456
      },
      {
        phone: '13900139004',
        name: '陈师傅',
        rating: 4.6,
        order_count: 45,
        tags: ['故障排除', '生活用电', '快速响应'],
        lng: 116.523456,
        lat: 39.523456
      }
    ];
    
    const masterIds = [];
    for (const master of masters) {
      const result = await run(
        `INSERT INTO masters (phone, password, name, avatar, rating, order_count, tags, lng, lat)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          master.phone,
          masterPassword,
          master.name,
          '',
          master.rating,
          master.order_count,
          JSON.stringify(master.tags),
          master.lng,
          master.lat
        ]
      );
      masterIds.push(result.lastID);
    }
    
    console.log('创建测试师傅成功，ID:', masterIds.join(', '));
    
    // 创建测试需求
    const demand1 = await run(
      `INSERT INTO demands (user_id, service_type, title, description, power_kw, address, lng, lat, photos, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.lastID,
        1,
        '家里电表箱升级改造',
        '老房子线路老化，想更换电表箱并增加几个插座。',
        15.5,
        'XX省XX市XX镇XX村12组',
        116.123456,
        39.123456,
        null,
        1
      ]
    );
    
    console.log('创建测试需求成功，ID:', demand1.lastID);
    
    // 创建测试报价
    const quote1 = await run(
      `INSERT INTO quotes (demand_id, master_id, total_price, material_price, labor_price, work_days, warranty_months, materials, distance, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        demand1.lastID,
        master1.lastID,
        5000,
        2000,
        3000,
        3,
        12,
        JSON.stringify(['电表箱', '电线', '插座']),
        2.5,
        1
      ]
    );
    
    const quote2 = await run(
      `INSERT INTO quotes (demand_id, master_id, total_price, material_price, labor_price, work_days, warranty_months, materials, distance, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        demand1.lastID,
        master2.lastID,
        4800,
        1800,
        3000,
        3,
        12,
        JSON.stringify(['电表箱', '电线', '插座']),
        5.2,
        1
      ]
    );
    
    console.log('创建测试报价成功，ID:', quote1.lastID, quote2.lastID);
    
    console.log('\n测试数据初始化完成！');
    console.log('\n测试账号：');
    console.log('用户: 13800138000 / 123456');
    console.log('师傅1: 13900139000 / 123456');
    console.log('师傅2: 13900139001 / 123456');
    
  } catch (err) {
    console.error('初始化测试数据失败:', err);
  }
  
  process.exit(0);
}

initTestData();


