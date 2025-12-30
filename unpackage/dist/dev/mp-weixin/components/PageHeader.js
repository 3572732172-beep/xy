"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "PageHeader",
  props: {
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    showBack: {
      type: Boolean,
      default: true
    },
    backgroundImage: {
      type: String,
      default: ""
    }
  },
  computed: {
    backgroundImageStyle() {
      return this.backgroundImage ? `url(${this.backgroundImage})` : "";
    }
  },
  methods: {
    handleBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          fail: this.relaunchHome
        });
        return;
      }
      this.relaunchHome();
    },
    relaunchHome() {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.showBack
  }, $props.showBack ? {
    b: common_vendor.o((...args) => $options.handleBack && $options.handleBack(...args))
  } : {}, {
    c: common_vendor.t($props.title),
    d: $props.subtitle
  }, $props.subtitle ? {
    e: common_vendor.t($props.subtitle)
  } : {}, {
    f: $options.backgroundImageStyle
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-88d55a61"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/PageHeader.js.map
