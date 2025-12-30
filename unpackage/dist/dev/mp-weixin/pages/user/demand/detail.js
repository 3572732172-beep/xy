"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const store_user = require("../../../store/user.js");
const PageHeader = () => "../../../components/PageHeader.js";
const _sfc_main = {
  components: {
    PageHeader
  },
  data() {
    return {
      demandId: null,
      demandData: {},
      quotes: [],
      largeFontMode: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.demandId = options.id;
      this.loadDemandDetail();
      this.loadQuotes();
    }
    this.largeFontMode = store_user.userStore.state.largeFontMode;
  },
  methods: {
    /**
     * 加载需求详情
     */
    async loadDemandDetail() {
      try {
        this.demandData = await utils_request.request.get("/api/demand/detail", {
          id: this.demandId
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/demand/detail.vue:109", "加载需求详情失败", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      }
    },
    /**
     * 加载报价列表
     */
    async loadQuotes() {
      try {
        const result = await utils_request.request.get("/api/demand/quote/list", {
          demand_id: this.demandId
        });
        this.quotes = result.list || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/demand/detail.vue:127", "加载报价列表失败", error);
      }
    },
    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const statusMap = {
        1: "待报价",
        2: "已报价",
        3: "已接单",
        4: "已完成",
        5: "已取消"
      };
      return statusMap[status] || "未知";
    },
    /**
     * 获取场景文本
     */
    getSceneText(sceneType) {
      const sceneMap = {
        1: "生活用电",
        2: "养殖棚",
        3: "加工配套",
        4: "其他"
      };
      return sceneMap[sceneType] || "未知";
    },
    /**
     * 预览照片
     */
    previewPhoto(index) {
      common_vendor.index.previewImage({
        current: index,
        urls: this.demandData.photos
      });
    },
    /**
     * 查看报价
     */
    viewQuotes() {
      common_vendor.index.navigateTo({
        url: `/pages/user/match/quotes?demand_id=${this.demandId}`
      });
    },
    /**
     * 匹配师傅
     */
    viewMasters() {
      common_vendor.index.navigateTo({
        url: `/pages/user/match/masters?demand_id=${this.demandId}`
      });
    },
    /**
     * 查看报价详情
     */
    viewQuoteDetail(quote) {
      common_vendor.index.navigateTo({
        url: `/pages/user/match/quote-detail?quote_id=${quote.id}`
      });
    }
  }
};
if (!Array) {
  const _component_page_header = common_vendor.resolveComponent("page-header");
  _component_page_header();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "需求详情",
      subtitle: "查看您的用电改造需求"
    }),
    b: common_vendor.t($options.getStatusText($data.demandData.status)),
    c: common_vendor.n("status-" + $data.demandData.status),
    d: common_vendor.t($data.demandData.title),
    e: common_vendor.t($options.getSceneText($data.demandData.service_type)),
    f: common_vendor.t($data.demandData.power_kw),
    g: common_vendor.t($data.demandData.address),
    h: common_vendor.t($data.demandData.description),
    i: $data.demandData.photos && $data.demandData.photos.length > 0
  }, $data.demandData.photos && $data.demandData.photos.length > 0 ? {
    j: common_vendor.f($data.demandData.photos, (photo, index, i0) => {
      return {
        a: index,
        b: photo,
        c: common_vendor.o(($event) => $options.previewPhoto(index), index)
      };
    })
  } : {}, {
    k: $data.demandData.status === 1
  }, $data.demandData.status === 1 ? {
    l: common_vendor.o((...args) => $options.viewQuotes && $options.viewQuotes(...args)),
    m: common_vendor.o((...args) => $options.viewMasters && $options.viewMasters(...args))
  } : {}, {
    n: $data.quotes.length > 0
  }, $data.quotes.length > 0 ? {
    o: common_vendor.f($data.quotes, (quote, k0, i0) => {
      return {
        a: common_vendor.t(quote.master_name),
        b: common_vendor.t(quote.total_price),
        c: common_vendor.t(quote.distance),
        d: common_vendor.t(quote.rating),
        e: quote.id,
        f: common_vendor.o(($event) => $options.viewQuoteDetail(quote), quote.id)
      };
    })
  } : {}, {
    p: $data.largeFontMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-19d212a2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/demand/detail.js.map
