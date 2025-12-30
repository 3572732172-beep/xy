"use strict";
const common_vendor = require("../../../common/vendor.js");
const PageHeader = () => "../../../components/PageHeader.js";
const _sfc_main = {
  components: { PageHeader },
  data() {
    return {
      masterId: null,
      demandId: null
    };
  },
  onLoad(options) {
    this.masterId = options.master_id || null;
    this.demandId = options.demand_id || null;
  },
  methods: {}
};
if (!Array) {
  const _component_page_header = common_vendor.resolveComponent("page-header");
  _component_page_header();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      title: "师傅详情",
      subtitle: "查看师傅信息与匹配需求",
      showBack: true
    }),
    b: common_vendor.t($data.masterId || "未知"),
    c: common_vendor.t($data.demandId || "未关联")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-105e7eb1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/match/master-detail.js.map
