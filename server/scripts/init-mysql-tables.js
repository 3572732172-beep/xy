/**
 * MySQL数据库表初始化脚本
 * 用于创建MySQL数据库表结构
 */

const path = require('path');
const fs = require('fs');

// 尝试加载 .env 文件，如果不存在则尝试 env.config.env
const envPath = path.join(__dirname, '../.env');
const envConfigPath = path.join(__dirname, '../env.config.env');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('已加载 .env 文件');
} else if (fs.existsSync(envConfigPath)) {
  require('dotenv').config({ path: envConfigPath });
  console.log('已加载 env.config.env 文件');
  console.log('提示: 建议将 env.config.env 复制为 .env 文件');
} else {
  console.warn('警告: 未找到环境变量配置文件 (.env 或 env.config.env)');
}

const mysql = require('mysql2/promise');

async function initMySQLTables() {
  console.log('开始初始化MySQL数据表...');
  
  // 检查环境变量
  const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'xydianan'
  };
  
  console.log(`连接MySQL: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  console.log(`密码: ${dbConfig.password ? '***已设置***' : '未设置（将使用空密码）'}`);
  
  if (!dbConfig.password) {
    console.warn('警告: MYSQL_PASSWORD 未设置，将使用空密码连接');
    console.warn('如果MySQL需要密码，请在 .env 或 env.config.env 中设置 MYSQL_PASSWORD');
  }
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // 用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        avatar VARCHAR(500),
        wechat_openid VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // 需求表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS demands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service_type INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        power_kw DECIMAL(10,2),
        address VARCHAR(500) NOT NULL,
        lng DECIMAL(10,6) NOT NULL,
        lat DECIMAL(10,6) NOT NULL,
        photos TEXT,
        status INT DEFAULT 1,
        offline_local_id VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // 师傅表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS masters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        avatar VARCHAR(500),
        rating DECIMAL(3,2) DEFAULT 5.00,
        order_count INT DEFAULT 0,
        tags TEXT,
        service_area VARCHAR(200),
        lng DECIMAL(10,6),
        lat DECIMAL(10,6),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone),
        INDEX idx_rating (rating)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // 报价表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        demand_id INT NOT NULL,
        master_id INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        material_price DECIMAL(10,2) DEFAULT 0,
        labor_price DECIMAL(10,2) DEFAULT 0,
        other_price DECIMAL(10,2) DEFAULT 0,
        work_days INT,
        warranty_months INT DEFAULT 12,
        materials TEXT,
        distance DECIMAL(10,2),
        status INT DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (demand_id) REFERENCES demands(id) ON DELETE CASCADE,
        FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE CASCADE,
        INDEX idx_demand_id (demand_id),
        INDEX idx_master_id (master_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // 订单表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_no VARCHAR(50) UNIQUE NOT NULL,
        demand_id INT NOT NULL,
        user_id INT NOT NULL,
        master_id INT NULL,
        quote_id INT NULL,
        total_price DECIMAL(10,2) DEFAULT 0,
        warranty_months INT DEFAULT 12,
        status INT DEFAULT 1,
        contract_url VARCHAR(500),
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (demand_id) REFERENCES demands(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE SET NULL,
        FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
        INDEX idx_order_no (order_no),
        INDEX idx_user_id (user_id),
        INDEX idx_master_id (master_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    console.log('MySQL数据表初始化完成！');
  } catch (err) {
    console.error('初始化MySQL数据表失败:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

initMySQLTables().then(() => {
  console.log('初始化完成');
  process.exit(0);
}).catch((err) => {
  console.error('初始化失败:', err);
  process.exit(1);
});

