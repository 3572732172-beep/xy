/**
 * 百度语音识别工具
 * 支持方言识别
 */

// 百度语音服务配置（请替换为实际配置）
const BAIDU_SPEECH_CONFIG = {
	APP_ID: '121196899', // 请填入您的百度 APP ID
	API_KEY: 'XLNF1v5ozxh4NPz93Iv0YLfL', // 请填入您的 API Key
	SECRET_KEY: 'OhDuVGpc92vh6H7zZsS3Zjmr9oSpW2O5' // 请填入您的 Secret Key
};

// 方言识别语言代码
const LANGUAGE_CODES = {
	普通话: '1537', // 普通话
	四川话: '1837', // 四川话
	粤语: '1637', // 粤语
	上海话: '1737', // 上海话
	闽南语: '1937', // 闽南语
	东北话: '2037', // 东北话
	河南话: '2137', // 河南话
	山东话: '2237', // 山东话
	陕西话: '2337', // 陕西话
	湖北话: '2437', // 湖北话
	湖南话: '2537', // 湖南话
	江西话: '2637', // 江西话
	安徽话: '2737' // 安徽话
};

/**
 * 获取百度 Access Token
 */
async function getAccessToken() {
	const tokenKey = 'baidu_speech_token';
	const tokenExpireKey = 'baidu_speech_token_expire';
	
	// 检查缓存的 token 是否有效
	const cachedToken = uni.getStorageSync(tokenKey);
	const expireTime = uni.getStorageSync(tokenExpireKey);
	
	if (cachedToken && expireTime && Date.now() < expireTime) {
		return cachedToken;
	}
	
	try {
		const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_SPEECH_CONFIG.API_KEY}&client_secret=${BAIDU_SPEECH_CONFIG.SECRET_KEY}`;
		
		const res = await uni.request({
			url: url,
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			}
		});
		
		if (res.data && res.data.access_token) {
			const token = res.data.access_token;
			const expiresIn = res.data.expires_in || 2592000; // 默认30天
			
			// 缓存 token（提前5分钟过期）
			uni.setStorageSync(tokenKey, token);
			uni.setStorageSync(tokenExpireKey, Date.now() + (expiresIn - 300) * 1000);
			
			return token;
		} else {
			throw new Error('获取 Access Token 失败');
		}
	} catch (error) {
		console.error('获取百度 Access Token 失败:', error);
		throw error;
	}
}

/**
 * 将语音文件转换为 Base64
 */
function fileToBase64(filePath) {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		const fs = wx.getFileSystemManager();
		fs.readFile({
			filePath: filePath,
			encoding: 'base64',
			success: (res) => {
				resolve(res.data);
			},
			fail: reject
		});
		// #endif
		
		// #ifdef H5
		// H5 环境需要先上传文件，然后转换为 base64
		uni.uploadFile({
			url: filePath,
			success: (res) => {
				resolve(res.data);
			},
			fail: reject
		});
		// #endif
		
		// #ifdef APP-PLUS
		plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
			entry.file((file) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const base64 = e.target.result.split(',')[1];
					resolve(base64);
				};
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		});
		// #endif
	});
}

/**
 * 语音识别
 * @param {String} audioPath 音频文件路径
 * @param {String} language 语言类型（默认普通话）
 * @returns {Promise<String>} 识别结果文本
 */
async function recognizeSpeech(audioPath, language = '普通话') {
	try {
		// 检查配置
		if (!BAIDU_SPEECH_CONFIG.APP_ID || !BAIDU_SPEECH_CONFIG.API_KEY || !BAIDU_SPEECH_CONFIG.SECRET_KEY) {
			throw new Error('请先配置百度语音服务参数');
		}
		
		// 获取 Access Token
		const accessToken = await getAccessToken();
		
		// 获取语言代码
		const languageCode = LANGUAGE_CODES[language] || LANGUAGE_CODES['普通话'];
		
		// 调用百度语音识别 API
		const url = `https://vop.baidu.com/server_api?dev_pid=${languageCode}&cuid=${BAIDU_SPEECH_CONFIG.APP_ID}&token=${accessToken}`;
		
		// 读取音频文件（百度语音识别需要原始 PCM 数据）
		// #ifdef MP-WEIXIN
		const fs = wx.getFileSystemManager();
		let audioData;
		try {
			audioData = fs.readFileSync(audioPath, 'binary');
			console.log('音频文件大小:', audioData ? audioData.length : 0, '字节');
			
			// 检查音频文件大小（至少需要1KB）
			if (!audioData || audioData.length < 1024) {
				throw new Error('音频文件太小，请至少录音2秒以上');
			}
		} catch (e) {
			console.error('读取音频文件失败:', e);
			throw new Error('读取音频文件失败: ' + e.message);
		}
		
		const res = await uni.request({
			url: url,
			method: 'POST',
			header: {
				'Content-Type': 'audio/pcm;rate=16000'
			},
			data: audioData
		});
		// #endif
		
		// #ifndef MP-WEIXIN
		// 其他平台需要先读取文件
		const audioBase64 = await fileToBase64(audioPath);
		// 将 base64 转换为 ArrayBuffer
		const binaryString = atob(audioBase64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		const res = await uni.request({
			url: url,
			method: 'POST',
			header: {
				'Content-Type': 'audio/pcm;rate=16000'
			},
			data: bytes.buffer
		});
		// #endif
		
		// 解析响应
		let responseData;
		if (typeof res.data === 'string') {
			try {
				responseData = JSON.parse(res.data);
			} catch (e) {
				console.error('解析响应失败:', res.data);
				throw new Error('响应解析失败: ' + res.data.substring(0, 100));
			}
		} else if (res.data && typeof res.data === 'object') {
			responseData = res.data;
		} else {
			console.error('响应格式错误:', res);
			throw new Error('响应格式错误');
		}
		
		console.log('百度API响应:', responseData);
		
		// 检查错误码
		if (responseData.err_no !== undefined && responseData.err_no !== 0) {
			const errorMsg = responseData.err_msg || '识别失败';
			const errorCode = responseData.err_no;
			console.error('百度API错误:', errorCode, errorMsg);
			throw new Error(`识别失败 (错误码: ${errorCode}): ${errorMsg}`);
		}
		
		if (responseData && responseData.result && responseData.result.length > 0) {
			return responseData.result[0];
		} else {
			const errorMsg = responseData.err_msg || '识别失败，未返回结果';
			console.error('识别失败:', responseData);
			throw new Error(errorMsg);
		}
	} catch (error) {
		console.error('语音识别失败:', error);
		throw error;
	}
}

/**
 * 开始录音
 * @param {Object} options 录音选项
 * @returns {Promise<Object>} 录音管理器
 */
function startRecord(options = {}) {
	return new Promise((resolve, reject) => {
		const recorderManager = uni.getRecorderManager();
		
		recorderManager.onStart(() => {
			console.log('开始录音');
		});
		
		recorderManager.onError((err) => {
			console.error('录音错误:', err);
			reject(err);
		});
		
		// 录音参数
		const recordOptions = {
			duration: options.duration || 60000, // 最长60秒
			sampleRate: 16000, // 采样率
			numberOfChannels: 1, // 录音通道数
			encodeBitRate: 96000, // 编码码率
			format: 'pcm', // 音频格式（百度语音识别支持 pcm）
			frameSize: 50, // 指定帧大小
			...options
		};
		
		recorderManager.start(recordOptions);
		resolve(recorderManager);
	});
}

/**
 * 停止录音并返回文件路径
 * @param {Object} recorderManager 录音管理器
 * @returns {Promise<String>} 录音文件路径
 */
function stopRecord(recorderManager) {
	return new Promise((resolve, reject) => {
		recorderManager.onStop((res) => {
			console.log('录音结束:', res);
			resolve(res.tempFilePath);
		});
		
		recorderManager.onError((err) => {
			reject(err);
		});
		
		recorderManager.stop();
	});
}

/**
 * 录音并识别（完整流程）
 * @param {String} language 语言类型
 * @param {Function} onProgress 进度回调
 * @returns {Promise<String>} 识别结果
 */
async function recordAndRecognize(language = '普通话', onProgress) {
	try {
		// 开始录音
		if (onProgress) onProgress('开始录音...');
		const recorderManager = await startRecord();
		
		// 等待用户停止录音（这里需要外部控制）
		// 返回录音管理器，由调用方控制停止
		return recorderManager;
	} catch (error) {
		console.error('录音失败:', error);
		throw error;
	}
}

export default {
	recognizeSpeech,
	startRecord,
	stopRecord,
	recordAndRecognize,
	LANGUAGE_CODES,
	setConfig(config) {
		Object.assign(BAIDU_SPEECH_CONFIG, config);
	},
	getConfig() {
		return BAIDU_SPEECH_CONFIG;
	},
	hasConfig() {
		return !!(BAIDU_SPEECH_CONFIG.APP_ID && BAIDU_SPEECH_CONFIG.API_KEY && BAIDU_SPEECH_CONFIG.SECRET_KEY);
	}
};

