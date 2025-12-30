# 乡野电安需求端后台API服务

## 项目简介

这是"乡野电安"需求端（用户版）的后台API服务，提供RESTful API接口，对接前端应用。

## 技术栈

- Node.js + Express
- SQLite 数据库
- JWT 认证
- bcryptjs 密码加密

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置：
- `PORT`: 服务器端口（默认 3000）
- `JWT_SECRET`: JWT 密钥（生产环境请使用强密钥）
- `DB_PATH`: 数据库文件路径

### 3. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 4. 初始化测试数据（可选）

运行以下脚本创建测试数据：

```bash
node scripts/init-test-data.js
```

## API 接口文档

### 统一响应格式

```json
{
  "code": 0,      // 0表示成功，其他值表示失败
  "msg": "ok",    // 提示信息
  "data": {}      // 数据
}
```

### 认证接口

#### 用户注册
- **POST** `/api/auth/register`
- Body: `{ "phone": "13800138000", "password": "123456", "name": "张三" }`

#### 用户登录
- **POST** `/api/auth/login`
- Body: `{ "phone": "13800138000", "password": "123456" }`
- 返回: `{ "code": 0, "msg": "ok", "data": { "id": 1, "phone": "...", "token": "..." } }`

### 需求接口

#### 创建需求
- **POST** `/api/demand/create`
- Headers: `Authorization: Bearer {token}`
- Body: 
```json
{
  "service_type": 1,
  "title": "家里电表箱升级改造",
  "description": "老房子线路老化，想更换电表箱并增加几个插座。",
  "power_kw": 15.5,
  "address": "XX省XX市XX镇XX村12组",
  "lng": 116.123456,
  "lat": 39.123456,
  "photos": ["https://img.xxx.com/1.jpg"]
}
```

#### 同步需求（离线同步）
- **POST** `/api/demand/sync`
- Headers: `Authorization: Bearer {token}`
- Body: 同创建需求，增加 `offline_local_id` 字段

#### 获取需求详情
- **GET** `/api/demand/detail?id=10001`

### 匹配接口

#### 获取师傅列表
- **GET** `/api/match/masters?demand_id=10001&sort=distance&page=1&page_size=10`
- sort 可选值: `distance`（距离最近）、`rating`（评分最高）、`price`（价格最低）

### 报价接口

#### 获取报价列表
- **GET** `/api/demand/quote/list?demand_id=10001`

### 订单接口

#### 创建订单
- **POST** `/api/order/create`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "quote_id": 60001, "warranty_months": 12 }`

#### 获取订单列表
- **GET** `/api/order/list?role=user&page=1&page_size=10&status=1,2,3`
- role: `user`（用户视角）或 `master`（师傅视角）
- status: 可选，多个状态用逗号分隔

#### 获取订单详情
- **GET** `/api/order/detail?order_id=70001`

#### 支付订单
- **POST** `/api/order/pay`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "order_id": 70001 }`

#### 取消订单
- **POST** `/api/order/cancel`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "order_id": 70001 }`

#### 确认验收
- **POST** `/api/order/confirm`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "order_id": 70001 }`

## 数据库结构

- `users`: 用户表
- `demands`: 需求表
- `masters`: 师傅表
- `quotes`: 报价表
- `orders`: 订单表

## 注意事项

1. 生产环境请修改 `.env` 中的 `JWT_SECRET` 为强密钥
2. 定期备份数据库文件（`data/xydianan.db`）
3. 图片上传功能需要配置实际的文件存储服务（当前为本地存储）
4. 建议使用 Nginx 反向代理，并配置 HTTPS

## 开发说明

- 所有接口统一返回格式
- 使用 JWT 进行身份认证
- 密码使用 bcryptjs 加密存储
- 距离计算使用 Haversine 公式


