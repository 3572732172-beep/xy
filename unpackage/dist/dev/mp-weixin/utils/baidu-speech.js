"use strict";
const common_vendor = require("../common/vendor.js");
const BAIDU_SPEECH_CONFIG = {
  APP_ID: "121196899",
  // 请填入您的百度 APP ID
  API_KEY: "XLNF1v5ozxh4NPz93Iv0YLfL",
  // 请填入您的 API Key
  SECRET_KEY: "OhDuVGpc92vh6H7zZsS3Zjmr9oSpW2O5"
  // 请填入您的 Secret Key
};
const LANGUAGE_CODES = {
  普通话: "1537",
  // 普通话
  四川话: "1837",
  // 四川话
  粤语: "1637",
  // 粤语
  上海话: "1737",
  // 上海话
  闽南语: "1937",
  // 闽南语
  东北话: "2037",
  // 东北话
  河南话: "2137",
  // 河南话
  山东话: "2237",
  // 山东话
  陕西话: "2337",
  // 陕西话
  湖北话: "2437",
  // 湖北话
  湖南话: "2537",
  // 湖南话
  江西话: "2637",
  // 江西话
  安徽话: "2737"
  // 安徽话
};
async function getAccessToken() {
  const tokenKey = "baidu_speech_token";
  const tokenExpireKey = "baidu_speech_token_expire";
  const cachedToken = common_vendor.index.getStorageSync(tokenKey);
  const expireTime = common_vendor.index.getStorageSync(tokenExpireKey);
  if (cachedToken && expireTime && Date.now() < expireTime) {
    return cachedToken;
  }
  try {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_SPEECH_CONFIG.API_KEY}&client_secret=${BAIDU_SPEECH_CONFIG.SECRET_KEY}`;
    const res = await common_vendor.index.request({
      url,
      method: "POST",
      header: {
        "Content-Type": "application/json"
      }
    });
    if (res.data && res.data.access_token) {
      const token = res.data.access_token;
      const expiresIn = res.data.expires_in || 2592e3;
      common_vendor.index.setStorageSync(tokenKey, token);
      common_vendor.index.setStorageSync(tokenExpireKey, Date.now() + (expiresIn - 300) * 1e3);
      return token;
    } else {
      throw new Error("获取 Access Token 失败");
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/baidu-speech.js:69", "获取百度 Access Token 失败:", error);
    throw error;
  }
}
async function recognizeSpeech(audioPath, language = "普通话") {
  try {
    if (!BAIDU_SPEECH_CONFIG.APP_ID || !BAIDU_SPEECH_CONFIG.API_KEY || !BAIDU_SPEECH_CONFIG.SECRET_KEY) {
      throw new Error("请先配置百度语音服务参数");
    }
    const accessToken = await getAccessToken();
    const languageCode = LANGUAGE_CODES[language] || LANGUAGE_CODES["普通话"];
    const url = `https://vop.baidu.com/server_api?dev_pid=${languageCode}&cuid=${BAIDU_SPEECH_CONFIG.APP_ID}&token=${accessToken}`;
    const fs = common_vendor.wx$1.getFileSystemManager();
    let audioData;
    try {
      audioData = fs.readFileSync(audioPath, "binary");
      common_vendor.index.__f__("log", "at utils/baidu-speech.js:146", "音频文件大小:", audioData ? audioData.length : 0, "字节");
      if (!audioData || audioData.length < 1024) {
        throw new Error("音频文件太小，请至少录音2秒以上");
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/baidu-speech.js:153", "读取音频文件失败:", e);
      throw new Error("读取音频文件失败: " + e.message);
    }
    const res = await common_vendor.index.request({
      url,
      method: "POST",
      header: {
        "Content-Type": "audio/pcm;rate=16000"
      },
      data: audioData
    });
    let responseData;
    if (typeof res.data === "string") {
      try {
        responseData = JSON.parse(res.data);
      } catch (e) {
        common_vendor.index.__f__("error", "at utils/baidu-speech.js:192", "解析响应失败:", res.data);
        throw new Error("响应解析失败: " + res.data.substring(0, 100));
      }
    } else if (res.data && typeof res.data === "object") {
      responseData = res.data;
    } else {
      common_vendor.index.__f__("error", "at utils/baidu-speech.js:198", "响应格式错误:", res);
      throw new Error("响应格式错误");
    }
    common_vendor.index.__f__("log", "at utils/baidu-speech.js:202", "百度API响应:", responseData);
    if (responseData.err_no !== void 0 && responseData.err_no !== 0) {
      const errorMsg = responseData.err_msg || "识别失败";
      const errorCode = responseData.err_no;
      common_vendor.index.__f__("error", "at utils/baidu-speech.js:208", "百度API错误:", errorCode, errorMsg);
      throw new Error(`识别失败 (错误码: ${errorCode}): ${errorMsg}`);
    }
    if (responseData && responseData.result && responseData.result.length > 0) {
      return responseData.result[0];
    } else {
      const errorMsg = responseData.err_msg || "识别失败，未返回结果";
      common_vendor.index.__f__("error", "at utils/baidu-speech.js:216", "识别失败:", responseData);
      throw new Error(errorMsg);
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/baidu-speech.js:220", "语音识别失败:", error);
    throw error;
  }
}
function startRecord(options = {}) {
  return new Promise((resolve, reject) => {
    const recorderManager = common_vendor.index.getRecorderManager();
    recorderManager.onStart(() => {
      common_vendor.index.__f__("log", "at utils/baidu-speech.js:235", "开始录音");
    });
    recorderManager.onError((err) => {
      common_vendor.index.__f__("error", "at utils/baidu-speech.js:239", "录音错误:", err);
      reject(err);
    });
    const recordOptions = {
      duration: options.duration || 6e4,
      // 最长60秒
      sampleRate: 16e3,
      // 采样率
      numberOfChannels: 1,
      // 录音通道数
      encodeBitRate: 96e3,
      // 编码码率
      format: "pcm",
      // 音频格式（百度语音识别支持 pcm）
      frameSize: 50,
      // 指定帧大小
      ...options
    };
    recorderManager.start(recordOptions);
    resolve(recorderManager);
  });
}
function stopRecord(recorderManager) {
  return new Promise((resolve, reject) => {
    recorderManager.onStop((res) => {
      common_vendor.index.__f__("log", "at utils/baidu-speech.js:267", "录音结束:", res);
      resolve(res.tempFilePath);
    });
    recorderManager.onError((err) => {
      reject(err);
    });
    recorderManager.stop();
  });
}
async function recordAndRecognize(language = "普通话", onProgress) {
  try {
    if (onProgress)
      onProgress("开始录音...");
    const recorderManager = await startRecord();
    return recorderManager;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/baidu-speech.js:295", "录音失败:", error);
    throw error;
  }
}
const baiduSpeech = {
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
exports.baiduSpeech = baiduSpeech;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/baidu-speech.js.map
