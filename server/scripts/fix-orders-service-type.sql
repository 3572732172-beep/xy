-- 修复 orders 表的 service_type 字段问题
-- 如果 orders 表中有 service_type 字段，需要从 demands 表中获取值

-- 方案1：如果 orders 表有 service_type 字段但没有默认值，添加默认值
-- ALTER TABLE orders MODIFY COLUMN service_type INT DEFAULT 1;

-- 方案2：如果 orders 表不应该有 service_type 字段，删除它
-- ALTER TABLE orders DROP COLUMN service_type;

-- 方案3：如果 orders 表应该有 service_type 字段，从 demands 表更新现有数据
-- UPDATE orders o
-- JOIN demands d ON o.demand_id = d.id
-- SET o.service_type = d.service_type
-- WHERE o.service_type IS NULL;

-- 检查表结构（MySQL）
-- DESCRIBE orders;

-- 检查表结构（SQLite）
-- PRAGMA table_info(orders);











