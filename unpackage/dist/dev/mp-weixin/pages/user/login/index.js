"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user = require("../../../store/user.js");
const common_assets = require("../../../common/assets.js");
const PageHeader = () => "../../../components/PageHeader.js";
const _sfc_main = {
  components: {
    PageHeader
  },
  data() {
    return {
      submitting: false
    };
  },
  onLoad() {
    if (store_user.userStore.state.isLoggedIn) {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  },
  methods: {
    /**
     * 微信登录
     */
    async handleWechatLogin() {
      this.submitting = true;
      try {
        let userInfo = null;
        let token = null;
        try {
          const loginRes = await new Promise((resolve, reject) => {
            common_vendor.index.login({
              provider: "weixin",
              success: resolve,
              fail: reject
            });
          });
          if (loginRes.code) {
            const result = await common_vendor.index.request({
              url: "http://192.168.109.1:3000/api/auth/wechat-login",
              method: "POST",
              data: {
                code: loginRes.code,
                nickName: "微信用户",
                avatarUrl: ""
              }
            });
            if (result.data && result.data.code === 0) {
              userInfo = {
                id: result.data.data.id,
                phone: result.data.data.phone,
                name: result.data.data.name || "微信用户",
                avatar: result.data.data.avatar || ""
              };
              token = result.data.data.token;
            }
          }
          if (!userInfo || !token) {
            throw new Error("微信登录失败，使用临时账号");
          }
        } catch (error) {
          common_vendor.index.__f__("log", "at pages/user/login/index.vue:108", "使用临时账号登录", error);
          userInfo = {
            id: 1,
            phone: "13800138000",
            name: "测试用户",
            avatar: ""
          };
          token = "dev-token-" + Date.now();
        }
        store_user.userStore.setUserInfo(userInfo, token);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        }, 800);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/login/index.vue:133", "登录失败", error);
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "none"
        });
      } finally {
        this.submitting = false;
      }
    }
  }
};
if (!Array) {
  const _component_page_header = common_vendor.resolveComponent("page-header");
  _component_page_header();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.p({
      title: "欢迎回到乡野电安",
      subtitle: "一键登录，发布用电改造需求",
      showBack: true
    }),
    c: common_assets._imports_1$1,
    d: common_vendor.t($data.submitting ? "登录中..." : "使用微信登录"),
    e: $data.submitting,
    f: common_vendor.o((...args) => $options.handleWechatLogin && $options.handleWechatLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b3fa26a2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/login/index.js.map
