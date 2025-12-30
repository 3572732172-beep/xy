"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_user = require("./store/user.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/user/demand/create.js";
  "./pages/user/order/list.js";
  "./pages/user/settings/index.js";
  "./pages/user/demand/drafts.js";
  "./pages/user/login/index.js";
  "./pages/news/index.js";
  "./pages/news/detail.js";
  "./pages/user/match/quotes.js";
  "./pages/user/match/masters.js";
  "./pages/user/match/master-detail.js";
  "./pages/user/demand/detail.js";
  "./pages/user/order/detail.js";
  "./pages/user/chat/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    var _a;
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch - 乡野电安需求端");
    store_user.userStore.loadFromStorage();
    if (store_user.userStore.state.isLoggedIn) {
      common_vendor.index.__f__("log", "at App.vue:13", "应用启动：已恢复登录状态，用户ID:", (_a = store_user.userStore.state.userInfo) == null ? void 0 : _a.id);
    }
    this.applyFontSize();
    this.getLocation();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:60", "App Show");
    common_vendor.index.getNetworkType({
      success: (res) => {
        if (res.isConnected) {
          const offline = require("./utils/offline.js").default;
          offline.triggerSync();
        }
      }
    });
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:74", "App Hide");
  },
  methods: {
    /**
     * 应用字体大小
     */
    applyFontSize() {
      store_user.userStore.state.fontSize;
    },
    /**
     * 获取定位信息
     */
    getLocation() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          store_user.userStore.setLocation(res.longitude, res.latitude);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at App.vue:99", "获取定位失败", err);
        }
      });
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$userStore = store_user.userStore;
  app.provide("userStore", store_user.userStore);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
