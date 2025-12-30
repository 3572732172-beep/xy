-- 修复 orders 表的 master_id 和 quote_id 字段，允许为 NULL
-- 适用于已存在的数据库

-- SQLite 版本（注意：SQLite 不支持直接修改列，需要重建表）
-- 如果使用 SQLite，请使用以下步骤：
-- 1. 备份数据库
-- 2. 运行以下 SQL 语句重建 orders 表

-- 创建新表
CREATE TABLE orders_new (
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
);

-- 复制数据
INSERT INTO orders_new SELECT * FROM orders;

-- 删除旧表
DROP TABLE orders;

-- 重命名新表
ALTER TABLE orders_new RENAME TO orders;

-- MySQL 版本（如果使用 MySQL，直接运行以下语句即可）
-- ALTER TABLE orders MODIFY COLUMN master_id INT NULL;
-- ALTER TABLE orders MODIFY COLUMN quote_id INT NULL;











