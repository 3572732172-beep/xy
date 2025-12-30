/**
 * JWT 认证中间件
 */

const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * 验证 token 中间件
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.json(error('未提供 token', 401));
  }
  
  // 移除 Bearer 前缀（兼容大小写）
  const tokenValue = authHeader.replace(/^Bearer\s+/i, '');
  
  if (!tokenValue) {
    return res.json(error('未提供 token', 401));
  }
  
  // 开发环境允许 dev-token 前缀免校验，用于临时账号
  if (process.env.NODE_ENV !== 'production' && tokenValue.startsWith('dev-token-')) {
    req.user = {
      id: 1,
      phone: 'dev-user',
      role: 'user',
      dev: true
    };
    return next();
  }
  
  try {
    const decoded = jwt.verify(tokenValue, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.json(error('token 无效或已过期', 401));
  }
}

/**
 * 可选认证（有 token 则验证，无 token 则跳过）
 */
function optionalAuth(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    req.user = null;
    return next();
  }
  
  const tokenValue = token.replace(/^Bearer\s+/i, '');
  
  // 开发环境允许 dev-token 前缀免校验
  if (process.env.NODE_ENV !== 'production' && tokenValue.startsWith('dev-token-')) {
    req.user = {
      id: 1,
      phone: 'dev-user',
      role: 'user',
      dev: true
    };
    return next();
  }
  
  try {
    const decoded = jwt.verify(tokenValue, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  
  next();
}

module.exports = {
  authenticate,
  optionalAuth
};


