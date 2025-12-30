"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const store_user = require("../../../store/user.js");
const _sfc_main = {
  data() {
    return {
      demandId: null,
      quoteList: [],
      loading: false,
      largeFontMode: false
    };
  },
  onLoad(options) {
    if (options.demand_id) {
      this.demandId = options.demand_id;
      this.loadQuotes();
    }
    this.largeFontMode = store_user.userStore.state.largeFontMode;
  },
  onPullDownRefresh() {
    this.loadQuotes().finally(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  methods: {
    /**
     * 加载报价列表
     */
    async loadQuotes() {
      this.loading = true;
      try {
        const result = await utils_request.request.get("/api/demand/quote/list", {
          demand_id: this.demandId
        });
        this.quoteList = result.list || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/match/quotes.vue:96", "加载报价列表失败", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    /**
     * 查看报价详情
     */
    viewQuoteDetail(quote) {
      common_vendor.index.navigateTo({
        url: `/pages/user/match/quote-detail?quote_id=${quote.id}`
      });
    },
    /**
     * 联系师傅
     */
    contactMaster(quote) {
      common_vendor.index.makePhoneCall({
        phoneNumber: quote.master_phone
      });
    },
    /**
     * 创建订单
     */
    async createOrder(quote) {
      common_vendor.index.showModal({
        title: "确认选择",
        content: `确定选择${quote.master_name}的报价吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/api/order/create", {
                quote_id: quote.id,
                warranty_months: quote.warranty_months || 12
              });
              common_vendor.index.showToast({
                title: "订单创建成功",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.redirectTo({
                  url: `/pages/user/order/detail?order_id=${result.id}`
                });
              }, 1500);
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/user/match/quotes.vue:150", "创建订单失败", error);
            }
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.quoteList, (quote, k0, i0) => {
      return common_vendor.e({
        a: quote.master_avatar,
        b: common_vendor.t(quote.master_name),
        c: common_vendor.t(quote.rating),
        d: common_vendor.t(quote.order_count),
        e: common_vendor.t(quote.total_price),
        f: common_vendor.t(quote.distance),
        g: common_vendor.t(quote.work_days),
        h: common_vendor.t(quote.warranty_months),
        i: quote.materials && quote.materials.length > 0
      }, quote.materials && quote.materials.length > 0 ? {
        j: common_vendor.t(quote.materials.join("、"))
      } : {}, {
        k: common_vendor.o(($event) => $options.contactMaster(quote), quote.id),
        l: common_vendor.o(($event) => $options.createOrder(quote), quote.id),
        m: quote.id,
        n: common_vendor.o(($event) => $options.viewQuoteDetail(quote), quote.id)
      });
    }),
    b: !$data.loading && $data.quoteList.length === 0
  }, !$data.loading && $data.quoteList.length === 0 ? {} : {}, {
    c: $data.largeFontMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b83dda91"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/match/quotes.js.map
