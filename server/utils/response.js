/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 */
function success(data = null, msg = 'ok') {
  return {
    code: 0,
    msg: msg,
    data: data
  };
}

/**
 * 错误响应
 */
function error(msg = '请求失败', code = 1) {
  return {
    code: code,
    msg: msg,
    data: null
  };
}

module.exports = {
  success,
  error
};


