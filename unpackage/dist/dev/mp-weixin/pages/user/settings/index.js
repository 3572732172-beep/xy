"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user = require("../../../store/user.js");
const utils_offline = require("../../../utils/offline.js");
const _sfc_main = {
  data() {
    return {
      largeFontMode: false,
      isLoggedIn: false,
      userInfo: null,
      draftCount: 0
    };
  },
  onLoad() {
    this.loadSettings();
  },
  onShow() {
    this.draftCount = utils_offline.offline.draftDemand.getAll().length;
  },
  methods: {
    /**
     * 加载设置
     */
    loadSettings() {
      this.largeFontMode = store_user.userStore.state.largeFontMode;
      this.isLoggedIn = store_user.userStore.state.isLoggedIn;
      this.userInfo = store_user.userStore.state.userInfo;
      this.draftCount = utils_offline.offline.draftDemand.getAll().length;
    },
    /**
     * 切换大字体模式
     */
    toggleLargeFont(e) {
      store_user.userStore.toggleLargeFontMode();
      this.largeFontMode = store_user.userStore.state.largeFontMode;
      common_vendor.index.showToast({
        title: this.largeFontMode ? "已开启大字体模式" : "已关闭大字体模式",
        icon: "success"
      });
    },
    /**
     * 登录
     */
    login() {
      common_vendor.index.navigateTo({
        url: "/pages/user/login/index"
      });
    },
    /**
     * 查看草稿
     */
    viewDrafts() {
      common_vendor.index.navigateTo({
        url: "/pages/user/demand/drafts"
      });
    },
    /**
     * 清除缓存
     */
    clearCache() {
      common_vendor.index.showModal({
        title: "确认清除",
        content: "确定要清除所有缓存数据吗？",
        success: (res) => {
          if (res.confirm) {
            const drafts = utils_offline.offline.draftDemand.getAll();
            const syncedDrafts = drafts.filter((d) => {
              const queue = utils_offline.offline.syncQueue.getAll();
              return !queue.find((q) => q.local_id === d.offline_local_id);
            });
            utils_offline.offline.draftDemand.clear();
            syncedDrafts.forEach((d) => {
              utils_offline.offline.draftDemand.save(d);
            });
            common_vendor.index.showToast({
              title: "缓存已清除",
              icon: "success"
            });
            this.draftCount = utils_offline.offline.draftDemand.getAll().length;
          }
        }
      });
    },
    /**
     * 退出登录
     */
    logout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            store_user.userStore.clearUserInfo();
            this.isLoggedIn = false;
            this.userInfo = null;
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.largeFontMode,
    b: common_vendor.o((...args) => $options.toggleLargeFont && $options.toggleLargeFont(...args)),
    c: $data.userInfo
  }, $data.userInfo ? {
    d: common_vendor.t($data.userInfo.name || $data.userInfo.phone)
  } : {}, {
    e: $data.userInfo
  }, $data.userInfo ? {
    f: common_vendor.t($data.userInfo.phone)
  } : {}, {
    g: !$data.isLoggedIn
  }, !$data.isLoggedIn ? {
    h: common_vendor.o((...args) => $options.login && $options.login(...args))
  } : {}, {
    i: $data.draftCount > 0
  }, $data.draftCount > 0 ? {
    j: common_vendor.t($data.draftCount)
  } : {}, {
    k: common_vendor.o((...args) => $options.viewDrafts && $options.viewDrafts(...args)),
    l: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    m: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    n: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {}, {
    o: $data.largeFontMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-74c389c9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/settings/index.js.map
