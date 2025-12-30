"use strict";
const common_vendor = require("../common/vendor.js");
const ENV = typeof process !== "undefined" && process.env ? process.env : {};
const AMAP_KEY = ENV.UNI_APP_AMAP_KEY || "026ac7e86aa913cb33597b239a2928df";
const AMAP_BASE_URL = "https://restapi.amap.com/v3";
const requestAmap = (path, params = {}) => {
  return new Promise((resolve, reject) => {
    if (!AMAP_KEY) {
      reject(new Error("未配置 UNI_APP_AMAP_KEY"));
      return;
    }
    common_vendor.index.__f__("warn", "at utils/amap.js:19", "微信小程序使用高德API需在后台配置合法域名：https://restapi.amap.com");
    common_vendor.index.request({
      url: `${AMAP_BASE_URL}/${path}`,
      method: "GET",
      data: {
        key: AMAP_KEY,
        ...params
      },
      success: ({ statusCode, data }) => {
        if (statusCode === 200 && data && data.status === "1") {
          resolve(data);
        } else {
          let msg = data && data.info ? data.info : "高德服务请求失败";
          if (data && data.info) {
            if (data.info.includes("USERKEY_PLAT_NOMATCH")) {
              msg = "API Key平台不匹配，请检查：1.确保使用的是Web服务类型的Key；2.在微信小程序后台配置request合法域名：https://restapi.amap.com";
            } else if (data.info.includes("INVALID_USER_KEY")) {
              msg = "API Key无效，请检查配置";
            } else if (data.info.includes("DAILY_QUERY_OVER_LIMIT")) {
              msg = "API调用次数超限";
            }
          }
          reject(new Error(msg));
        }
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes("request:fail")) {
          reject(new Error("请求失败，请在微信小程序后台配置request合法域名：https://restapi.amap.com"));
          return;
        }
        reject(err);
      }
    });
  });
};
const reverseGeocode = async (lng, lat) => {
  var _a, _b;
  const data = await requestAmap("geocode/regeo", {
    location: `${lng},${lat}`,
    extensions: "all",
    radius: 1e3,
    roadlevel: 1
  });
  return {
    address: ((_a = data == null ? void 0 : data.regeocode) == null ? void 0 : _a.formatted_address) || "",
    pois: ((_b = data == null ? void 0 : data.regeocode) == null ? void 0 : _b.pois) || [],
    raw: data
  };
};
exports.reverseGeocode = reverseGeocode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/amap.js.map
