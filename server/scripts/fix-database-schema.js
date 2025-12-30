/**
 * 数据库表结构修复脚本
 * 用于修复 orders 表的 service_type 字段问题和 users 表的 phone 字段长度
 */

const path = require('path');
const fs = require('fs');

// 尝试加载 .env 文件
const envPath = path.join(__dirname, '../.env');
const envConfigPath = path.join(__dirname, '../env.config.env');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else if (fs.existsSync(envConfigPath)) {
  require('dotenv').config({ path: envConfigPath });
}

const DB_TYPE = process.env.DB_TYPE || 'mysql';
const { query, run } = require('../config/database');

async function fixDatabaseSchema() {
  console.log('开始修复数据库表结构...');
  
  try {
    if (DB_TYPE === 'mysql') {
      const dbName = process.env.MYSQL_DATABASE || 'xydianan';
      
      // 1. 修复 users 表的 phone 字段长度
      console.log('检查 users 表的 phone 字段...');
      const phoneColumn = await query(`
        SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'phone'
      `, [dbName]);
      
      if (phoneColumn.length > 0 && phoneColumn[0].CHARACTER_MAXIMUM_LENGTH < 50) {
        console.log(`phone 字段长度为 ${phoneColumn[0].CHARACTER_MAXIMUM_LENGTH}，正在扩展为 50...`);
        await run(`ALTER TABLE users MODIFY COLUMN phone VARCHAR(50) UNIQUE NOT NULL`);
        console.log('✓ 已扩展 phone 字段长度为 50');
      } else {
        console.log('✓ phone 字段长度正常');
      }
      
      // 2. 修复 orders 表的 service_type 字段
      console.log('检查 orders 表的 service_type 字段...');
      const columns = await query(`
        SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'service_type'
      `, [dbName]);
      
      if (columns.length > 0) {
        console.log('检测到 orders 表有 service_type 字段');
        
        // 检查是否有默认值
        const column = columns[0];
        if (column.IS_NULLABLE === 'NO' && !column.COLUMN_DEFAULT) {
          console.log('service_type 字段没有默认值，正在添加默认值...');
          await run(`ALTER TABLE orders MODIFY COLUMN service_type INT DEFAULT 1`);
          console.log('✓ 已为 service_type 字段添加默认值 1');
        }
        
        // 更新现有订单的 service_type（从 demands 表获取）
        console.log('正在更新现有订单的 service_type...');
        const updateResult = await run(`
          UPDATE orders o
          JOIN demands d ON o.demand_id = d.id
          SET o.service_type = d.service_type
          WHERE o.service_type IS NULL
        `);
        console.log(`✓ 已更新 ${updateResult.changes} 条订单的 service_type`);
      } else {
        console.log('orders 表没有 service_type 字段，这是正常的');
      }
    } else {
      // SQLite: 检查 orders 表结构
      const tableInfo = await query(`PRAGMA table_info(orders)`);
      const hasServiceType = tableInfo.some(col => col.name === 'service_type');
      
      if (hasServiceType) {
        console.log('检测到 orders 表有 service_type 字段');
        // SQLite 不支持直接修改列，需要重建表
        console.log('SQLite 需要手动重建表，请参考 fix-orders-table.sql');
      } else {
        console.log('orders 表没有 service_type 字段，这是正常的');
      }
    }
    
    console.log('数据库表结构修复完成！');
  } catch (err) {
    console.error('修复失败:', err);
    throw err;
  }
}

fixDatabaseSchema().then(() => {
  console.log('修复完成');
  process.exit(0);
}).catch((err) => {
  console.error('修复失败:', err);
  process.exit(1);
});
