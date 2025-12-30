/**
 * 乡野电安需求端后台API服务
 * 主入口文件
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
	origin: process.env.CORS_ORIGIN || '*',
	credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

// 静态文件服务（用于上传的文件）
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, {
		recursive: true
	});
}
app.use('/uploads', express.static(uploadDir));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/demand', require('./routes/demand'));
app.use('/api/match', require('./routes/match'));
app.use('/api/demand/quote', require('./routes/quote'));
app.use('/api/order', require('./routes/order'));
app.use('/api/grab', require('./routes/grab'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/ai', require('./routes/ai'));

// 健康检查
app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		message: '乡野电安API服务运行正常'
	});
});

// 404 处理
app.use((req, res) => {
	res.status(404).json({
		code: 404,
		msg: '接口不存在',
		data: null
	});
});

// 错误处理
app.use((err, req, res, next) => {
	console.error('服务器错误:', err);
	res.status(500).json({
		code: 500,
		msg: '服务器内部错误',
		data: null
	});
});

// 启动服务器
app.listen(PORT, () => {
	console.log(`服务器运行在 http://localhost:${PORT}`);
	console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;