"use strict";
const common_vendor = require("../common/vendor.js");
class UserStore {
  constructor() {
    this.state = {
      // 用户信息
      userInfo: null,
      token: "",
      isLoggedIn: false,
      // 全局设置
      largeFontMode: false,
      // 大字体模式
      fontSize: 14,
      // 基础字体大小（rpx）
      // 定位信息
      location: {
        lng: null,
        lat: null,
        address: ""
      }
    };
    this.loadFromStorage();
  }
  /**
   * 从本地存储加载
   */
  loadFromStorage() {
    try {
      const token = common_vendor.index.getStorageSync("token");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const largeFontMode = common_vendor.index.getStorageSync("largeFontMode") || false;
      const fontSize = common_vendor.index.getStorageSync("fontSize") || 14;
      if (token && userInfo) {
        this.state.token = token;
        this.state.userInfo = userInfo;
        this.state.isLoggedIn = true;
        common_vendor.index.__f__("log", "at store/user.js:46", "已恢复登录状态，用户ID:", userInfo.id);
      } else {
        if (token && !userInfo) {
          common_vendor.index.removeStorageSync("token");
          this.state.token = "";
          this.state.isLoggedIn = false;
        }
      }
      this.state.largeFontMode = largeFontMode;
      this.state.fontSize = fontSize;
      this.applyFontSize();
    } catch (e) {
      common_vendor.index.__f__("error", "at store/user.js:62", "加载本地存储失败", e);
    }
  }
  /**
   * 保存到本地存储
   */
  saveToStorage() {
    try {
      if (this.state.token) {
        common_vendor.index.setStorageSync("token", this.state.token);
      }
      if (this.state.userInfo) {
        common_vendor.index.setStorageSync("userInfo", this.state.userInfo);
      }
      common_vendor.index.setStorageSync("largeFontMode", this.state.largeFontMode);
      common_vendor.index.setStorageSync("fontSize", this.state.fontSize);
    } catch (e) {
      common_vendor.index.__f__("error", "at store/user.js:80", "保存本地存储失败", e);
    }
  }
  /**
   * 设置用户信息
   */
  setUserInfo(userInfo, token) {
    this.state.userInfo = userInfo;
    this.state.token = token;
    this.state.isLoggedIn = !!token;
    common_vendor.index.setStorageSync("token", token);
    common_vendor.index.setStorageSync("userInfo", userInfo);
    this.saveToStorage();
    common_vendor.index.__f__("log", "at store/user.js:95", "用户登录成功，已保存登录状态，用户ID:", userInfo.id);
  }
  /**
   * 清除用户信息（退出登录）
   */
  clearUserInfo() {
    this.state.userInfo = null;
    this.state.token = "";
    this.state.isLoggedIn = false;
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("userInfo");
  }
  /**
   * 切换大字体模式
   */
  toggleLargeFontMode() {
    this.state.largeFontMode = !this.state.largeFontMode;
    this.state.fontSize = this.state.largeFontMode ? 18 : 14;
    this.saveToStorage();
    this.applyFontSize();
  }
  /**
   * 设置字体大小
   */
  setFontSize(size) {
    this.state.fontSize = size;
    this.state.largeFontMode = size >= 18;
    this.saveToStorage();
    this.applyFontSize();
  }
  /**
   * 应用字体大小到全局
   */
  applyFontSize() {
  }
  /**
   * 设置定位信息
   */
  setLocation(lng, lat, address = "") {
    this.state.location = {
      lng,
      lat,
      address
    };
  }
  /**
   * 获取定位信息
   */
  getLocation() {
    return this.state.location;
  }
}
const userStore = new UserStore();
exports.userStore = userStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/user.js.map
