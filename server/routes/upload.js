/**
 * 文件上传路由
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const { success, error } = require('../utils/response');

// 配置上传目录
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 默认5MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('只支持图片格式：jpeg, jpg, png, gif, webp'));
  }
});

/**
 * 上传图片
 * POST /api/upload/image
 */
router.post('/image', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json(error('请选择要上传的图片'));
  }
  
  // 返回图片URL（根据实际部署情况调整）
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  
  res.json(success({
    url: imageUrl,
    filename: req.file.filename
  }));
});

module.exports = router;

