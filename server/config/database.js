/**
 * 数据库连接配置
 * 默认使用 MySQL，可通过环境变量切换到 SQLite
 * DB_TYPE=sqlite | mysql
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
} else {
  // 如果都不存在，尝试默认的 dotenv 加载
  require('dotenv').config();
}

const DB_TYPE = process.env.DB_TYPE || 'mysql'; // sqlite | mysql
let db = null;
let mysqlPool = null;

if (DB_TYPE === 'mysql') {
  // 使用 MySQL（需要先安装依赖：npm install mysql2）
  const mysql = require('mysql2/promise');

  mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'xydianan',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  });

  console.log('[DB] 使用 MySQL 作为数据库');
  
  // MySQL模式下，尝试初始化表（如果不存在）
  initMySQLTables();
} else {
  // 默认：SQLite，本地开发方便
  const sqlite3 = require('sqlite3').verbose();

  const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/xydianan.db');

  // 确保数据目录存在
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // 创建数据库连接
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('SQLite 数据库连接失败:', err.message);
    } else {
      console.log('SQLite 数据库连接成功:', DB_PATH);
      initTables();
    }
  });
}

/**
 * 初始化MySQL数据表
 */
async function initMySQLTables() {
  try {
    const connection = await mysqlPool.getConnection();
    try {
      // 检查表是否存在，如果不存在则创建
      const [tables] = await connection.query('SHOW TABLES LIKE ?', ['users']);
      if (tables.length === 0) {
        console.log('[DB] 检测到表不存在，开始初始化MySQL表结构...');
        // 这里可以调用初始化脚本，或者直接执行建表语句
        // 为了简化，我们只记录日志，建议手动运行 init-mysql-tables.js
        console.log('[DB] 请运行 npm run init-mysql 或 node server/scripts/init-mysql-tables.js 初始化表结构');
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('[DB] MySQL表初始化检查失败:', err.message);
    // 不阻止应用启动，允许后续手动初始化
  }
}

/**
 * 初始化数据表（SQLite）
 */
function initTables() {
  // 仅在 SQLite 场景下自动建表；MySQL 请使用脚本或迁移工具初始化
  if (DB_TYPE === 'mysql') {
    return;
  }
  // 用户表（增加 wechat_openid 字段用于微信登录）
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    avatar TEXT,
    wechat_openid TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 需求表
  db.run(`CREATE TABLE IF NOT EXISTS demands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_type INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    power_kw REAL,
    address TEXT NOT NULL,
    lng REAL NOT NULL,
    lat REAL NOT NULL,
    photos TEXT,
    status INTEGER DEFAULT 1,
    offline_local_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // 师傅表
  db.run(`CREATE TABLE IF NOT EXISTS masters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    rating REAL DEFAULT 5.0,
    order_count INTEGER DEFAULT 0,
    tags TEXT,
    service_area TEXT,
    lng REAL,
    lat REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 报价表
  db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    demand_id INTEGER NOT NULL,
    master_id INTEGER NOT NULL,
    total_price REAL NOT NULL,
    material_price REAL DEFAULT 0,
    labor_price REAL DEFAULT 0,
    other_price REAL DEFAULT 0,
    work_days INTEGER,
    warranty_months INTEGER DEFAULT 12,
    materials TEXT,
    distance REAL,
    status INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (demand_id) REFERENCES demands(id),
    FOREIGN KEY (master_id) REFERENCES masters(id)
  )`);

  // 订单表（master_id 和 quote_id 允许为 NULL，因为订单可能在匹配前创建）
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT UNIQUE NOT NULL,
    demand_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    master_id INTEGER,
    quote_id INTEGER,
    total_price REAL NOT NULL,
    warranty_months INTEGER DEFAULT 12,
    status INTEGER DEFAULT 1,
    contract_url TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (demand_id) REFERENCES demands(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (master_id) REFERENCES masters(id),
    FOREIGN KEY (quote_id) REFERENCES quotes(id)
  )`);

  console.log('数据表初始化完成');
}

/**
 * 执行查询（返回 Promise）
 */
async function query(sql, params = []) {
  if (DB_TYPE === 'mysql') {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  }

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * 执行单条查询（返回 Promise）
 */
async function queryOne(sql, params = []) {
  if (DB_TYPE === 'mysql') {
    const rows = await query(sql, params);
    return rows[0] || null;
  }

  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * 执行插入/更新（返回 Promise）
 */
async function run(sql, params = []) {
  if (DB_TYPE === 'mysql') {
    const [result] = await mysqlPool.execute(sql, params);
    return { lastID: result.insertId, changes: result.affectedRows };
  }

  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

module.exports = {
  db,
  query,
  queryOne,
  run
};


