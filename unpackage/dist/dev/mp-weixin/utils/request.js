"use strict";
const common_vendor = require("../common/vendor.js");
const store_user = require("../store/user.js");
const ENV = typeof process !== "undefined" && process.env ? process.env : {};
const DEFAULT_DEV_URL = ENV.UNI_APP_DEV_BASE_URL || "http://localhost:3001";
ENV.UNI_APP_PROD_BASE_URL || "http://192.168.109.1:3001";
exports.BASE_URL = DEFAULT_DEV_URL;
exports.BASE_URL = ENV.UNI_APP_BASE_URL || DEFAULT_DEV_URL;
const requestInterceptor = (config) => {
  config.header = config.header || {};
  config.header["Content-Type"] = "application/json";
  const token = common_vendor.index.getStorageSync("token") || "";
  if (token) {
    config.header["Authorization"] = `Bearer ${token}`;
  }
  return config;
};
const responseInterceptor = (response) => {
  const { statusCode, data } = response;
  if (statusCode !== 200) {
    const errorMsg = `HTTP Error: ${statusCode}`;
    common_vendor.index.__f__("error", "at utils/request.js:63", errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
  if (data.code !== 0) {
    if (data.code === 401 || data.code === 403) {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("userInfo");
      if (store_user.userStore && store_user.userStore.clearUserInfo) {
        store_user.userStore.clearUserInfo();
      }
      common_vendor.index.__f__("warn", "at utils/request.js:76", "Token无效或已过期，已清除登录信息");
    }
    const errorMsg = data.msg || "请求失败";
    if (data.code !== 1) {
      common_vendor.index.__f__("error", "at utils/request.js:85", "API请求失败:", errorMsg);
    }
    return Promise.reject(new Error(errorMsg));
  }
  return data.data;
};
const request = (options) => {
  return new Promise((resolve, reject) => {
    const config = requestInterceptor({
      url: options.url.startsWith("http") ? options.url : exports.BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: options.header || {},
      timeout: options.timeout || 1e4
    });
    common_vendor.index.request({
      ...config,
      success: (res) => {
        Promise.resolve(responseInterceptor(res)).then(resolve).catch(reject);
      },
      fail: (err) => {
        const errorMsg = err.errMsg || "网络请求失败";
        if (errorMsg.includes("request:fail") || errorMsg.includes("timeout")) {
          common_vendor.index.__f__("error", "at utils/request.js:124", "网络请求失败", errorMsg);
        }
        reject(new Error(errorMsg));
      }
    });
  });
};
const get = (url, data = {}) => {
  return request({
    url,
    method: "GET",
    data
  });
};
const post = (url, data = {}) => {
  return request({
    url,
    method: "POST",
    data
  });
};
const put = (url, data = {}) => {
  return request({
    url,
    method: "PUT",
    data
  });
};
const del = (url, data = {}) => {
  return request({
    url,
    method: "DELETE",
    data
  });
};
const request$1 = {
  request,
  get,
  post,
  put,
  delete: del
};
exports.request = request$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
