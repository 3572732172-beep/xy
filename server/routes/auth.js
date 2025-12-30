/**
 * 用户认证路由
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryOne, run } = require('../config/database');
const { success, error } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// 默认延长到 30 天，减少频繁登录提示
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

/**
 * 微信登录
 * POST /api/auth/wechat-login
 * Body: { code, nickName, avatarUrl }
 * 说明：这里为了方便演示，直接使用 code 作为 openid，实际项目中需要调用微信服务器换取 openid
 */
router.post('/wechat-login', async (req, res) => {
  try {
    const { code, nickName, avatarUrl } = req.body;

    if (!code) {
      return res.json(error('缺少微信登录 code'));
    }

    // TODO: 实际项目中应通过微信接口使用 code 换取 openid，这里简化处理
    const openid = code;

    // 查询是否已有用户
    let user = await queryOne('SELECT * FROM users WHERE wechat_openid = ?', [openid]);

    if (!user) {
      // 创建新用户
      const name = nickName || '微信用户';
      const avatar = avatarUrl || '';
      const phone = 'wx_' + openid; // 占位手机号，保持唯一

      const result = await run(
        'INSERT INTO users (phone, password, name, avatar, wechat_openid) VALUES (?, ?, ?, ?, ?)',
        [phone, '', name, avatar, openid]
      );

      user = {
        id: result.lastID,
        phone,
        name,
        avatar,
        wechat_openid: openid
      };
    }

    // 生成 token
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json(success({
      id: user.id,
      phone: user.phone,
      name: user.name || '',
      avatar: user.avatar || '',
      token
    }));
  } catch (err) {
    console.error('微信登录失败:', err);
    res.json(error('微信登录失败，请稍后重试'));
  }
});

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name } = req.body;
    
    if (!phone || !password) {
      return res.json(error('手机号和密码不能为空'));
    }
    
    // 检查用户是否已存在
    const existingUser = await queryOne('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existingUser) {
      return res.json(error('该手机号已注册'));
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const result = await run(
      'INSERT INTO users (phone, password, name) VALUES (?, ?, ?)',
      [phone, hashedPassword, name || '']
    );
    
    // 生成 token
    const token = jwt.sign(
      { id: result.lastID, phone, role: 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json(success({
      id: result.lastID,
      phone,
      name: name || '',
      token
    }));
  } catch (err) {
    console.error('注册失败:', err);
    res.json(error('注册失败，请稍后重试'));
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.json(error('手机号和密码不能为空'));
    }
    
    // 查找用户
    const user = await queryOne('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!user) {
      return res.json(error('手机号或密码错误'));
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.json(error('手机号或密码错误'));
    }
    
    // 生成 token
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json(success({
      id: user.id,
      phone: user.phone,
      name: user.name || '',
      avatar: user.avatar || '',
      token
    }));
  } catch (err) {
    console.error('登录失败:', err);
    res.json(error('登录失败，请稍后重试'));
  }
});

module.exports = router;


