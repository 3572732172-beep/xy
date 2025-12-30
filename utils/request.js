/**
 * 统一请求封装
 * 自动注入 token，统一错误处理
 */

import userStore from '@/store/user.js';

// 小程序环境无 process 对象，这里做兼容
const ENV = typeof process !== 'undefined' && process.env ? process.env : {};

// 后端 API 地址配置
// 可在 .env.development/.env.production 中设置：
// UNI_APP_BASE_URL, UNI_APP_DEV_BASE_URL, UNI_APP_PROD_BASE_URL
const DEFAULT_DEV_URL = ENV.UNI_APP_DEV_BASE_URL || 'http://localhost:3001';
const DEFAULT_PROD_URL = ENV.UNI_APP_PROD_BASE_URL || 'http://192.168.109.1:3001';

let BASE_URL = DEFAULT_DEV_URL;

// #ifdef H5
BASE_URL = ENV.UNI_APP_BASE_URL || DEFAULT_DEV_URL;
// #endif

// #ifdef MP-WEIXIN
// 微信小程序开发环境，默认使用本地服务器
// 注意：微信小程序中 localhost 可能无法访问，请使用本机IP地址
// 如果无法访问 localhost，请修改为你的本机IP地址，如：http://192.168.1.100:3000
// 或者通过环境变量 UNI_APP_BASE_URL 设置
BASE_URL = ENV.UNI_APP_BASE_URL || DEFAULT_DEV_URL;
// #endif

// #ifndef H5
// #ifndef MP-WEIXIN
BASE_URL = ENV.UNI_APP_BASE_URL || (ENV.NODE_ENV === 'development' ? DEFAULT_DEV_URL : DEFAULT_PROD_URL);
// #endif
// #endif

// 导出 BASE_URL 供其他模块使用
export { BASE_URL };

// 请求拦截器
const requestInterceptor = (config) => {
	// 设置默认 header
	config.header = config.header || {};
	config.header['Content-Type'] = 'application/json';
	
	// 从本地存储获取 token
	const token = uni.getStorageSync('token') || '';
	if (token) {
		config.header['Authorization'] = `Bearer ${token}`;
	}
	
	return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
	const { statusCode, data } = response;
	
	// HTTP 状态码检查
	if (statusCode !== 200) {
		// 不显示 toast，静默处理，让调用方决定是否提示
		const errorMsg = `HTTP Error: ${statusCode}`;
		console.error(errorMsg);
		return Promise.reject(new Error(errorMsg));
	}
	
	// 业务状态码检查
	if (data.code !== 0) {
		// 仅在明确的权限错误时清除登录，避免误伤
		if (data.code === 401 || data.code === 403) {
			uni.removeStorageSync('token');
			uni.removeStorageSync('userInfo');
			if (userStore && userStore.clearUserInfo) {
				userStore.clearUserInfo();
			}
			console.warn('Token无效或已过期，已清除登录信息');
		}
		
		// 不显示 toast，让调用方决定如何处理错误
		// 这样可以避免在首页等页面显示错误提示
		// 减少日志输出，仅在开发环境或特定情况下输出
		const errorMsg = data.msg || '请求失败';
		// 只在非业务逻辑错误时输出详细日志（避免重复输出已知的错误）
		if (data.code !== 1) {
			console.error('API请求失败:', errorMsg);
		}
		return Promise.reject(new Error(errorMsg));
	}
	
	return data.data;
};

/**
 * 统一请求方法
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
const request = (options) => {
	return new Promise((resolve, reject) => {
		// 请求拦截
		const config = requestInterceptor({
			url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: options.header || {},
			timeout: options.timeout || 10000
		});
		
		// 发送请求
		uni.request({
			...config,
			success: (res) => {
				// 响应拦截，兼容拦截器返回值或 Promise
				Promise.resolve(responseInterceptor(res))
					.then(resolve)
					.catch(reject);
			},
			fail: (err) => {
				// 网络错误处理 - 静默失败，不显示提示
				// 避免在开发环境下输出过多错误信息
				const errorMsg = err.errMsg || '网络请求失败';
				// 只在真正的网络错误时输出（排除业务逻辑错误）
				if (errorMsg.includes('request:fail') || errorMsg.includes('timeout')) {
					console.error('网络请求失败', errorMsg);
				}
				reject(new Error(errorMsg));
			}
		});
	});
};

// 便捷方法
const get = (url, data = {}) => {
	return request({
		url,
		method: 'GET',
		data
	});
};

const post = (url, data = {}) => {
	return request({
		url,
		method: 'POST',
		data
	});
};

const put = (url, data = {}) => {
	return request({
		url,
		method: 'PUT',
		data
	});
};

const del = (url, data = {}) => {
	return request({
		url,
		method: 'DELETE',
		data
	});
};

export default {
	request,
	get,
	post,
	put,
	delete: del
};

