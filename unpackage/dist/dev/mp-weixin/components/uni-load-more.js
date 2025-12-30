"use strict";
const common_vendor = require("../common/vendor.js");
const platform = common_vendor.index.getSystemInfoSync().platform;
const _sfc_main = {
  name: "UniLoadMore",
  props: {
    status: {
      // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
      type: String,
      default: "more"
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    iconType: {
      type: String,
      default: "auto"
    },
    color: {
      type: String,
      default: "#777777"
    },
    contentText: {
      type: Object,
      default() {
        return {
          contentdown: "上拉显示更多",
          contentrefresh: "正在加载...",
          contentnomore: "没有更多数据了"
        };
      }
    }
  },
  data() {
    return {
      platform
    };
  },
  methods: {
    onClick() {
      this.$emit("clickLoadMore", {
        detail: {
          status: this.status
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon
  }, ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? {} : $props.status === "loading" && $props.showIcon ? {} : {}, {
    b: $props.status === "loading" && $props.showIcon,
    c: common_vendor.t($props.status === "more" ? $props.contentText.contentdown : $props.status === "loading" ? $props.contentText.contentrefresh : $props.contentText.contentnomore),
    d: common_vendor.o((...args) => $options.onClick && $options.onClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a3870878"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/uni-load-more.js.map
