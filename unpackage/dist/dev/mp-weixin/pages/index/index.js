"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const utils_request = require("../../utils/request.js");
const utils_offline = require("../../utils/offline.js");
const common_assets = require("../../common/assets.js");
const ServiceFloat = () => "../../components/ServiceFloat.js";
const _sfc_main = {
  components: {
    ServiceFloat
  },
  data() {
    return {
      largeFontMode: false,
      userNameDisplay: "乡亲",
      currentRegion: "中部地区",
      searchKeyword: "",
      stats: {
        ongoingOrders: 0,
        finishedOrders: 0,
        draftCount: 0
      },
      primaryEntries: [
        {
          id: "demand",
          title: "发布需求",
          desc: "全程托管，极速响应",
          icon: "📝",
          action: "createDemand"
        },
        {
          id: "order",
          title: "我的订单",
          desc: "进度查询 / 验收",
          icon: "📋",
          action: "viewOrders"
        }
      ],
      serviceGrid: [
        {
          id: "draft",
          label: "草稿箱",
          icon: "🗂",
          action: "viewDrafts"
        },
        {
          id: "match",
          label: "匹配电工",
          icon: "👷",
          action: "matchMaster"
        },
        {
          id: "quote",
          label: "报价单",
          icon: "💰",
          action: "viewQuotes"
        },
        {
          id: "support",
          label: "在线客服",
          icon: "💬",
          action: "contactSupport"
        },
        {
          id: "settings",
          label: "设置",
          icon: "⚙️",
          action: "viewSettings"
        },
        {
          id: "about",
          label: "关于我们",
          icon: "ℹ️",
          action: "viewAbout"
        }
      ]
    };
  },
  onShow() {
    this.largeFontMode = store_user.userStore.state.largeFontMode;
    this.initUserInfo();
    this.loadStats();
    common_vendor.index.$on("demandCreated", () => {
      this.loadStats();
    });
    common_vendor.index.$on("orderStatusChanged", () => {
      this.loadStats();
    });
  },
  onUnload() {
    common_vendor.index.$off("demandCreated");
    common_vendor.index.$off("orderStatusChanged");
  },
  methods: {
    initUserInfo() {
      const userInfo = store_user.userStore.state.userInfo;
      if (userInfo && (userInfo.name || userInfo.phone)) {
        this.userNameDisplay = userInfo.name || userInfo.phone;
      } else {
        this.userNameDisplay = "乡亲";
      }
    },
    async loadStats() {
      this.stats.draftCount = utils_offline.offline.draftDemand.getAll().length || 0;
      if (!store_user.userStore.state.isLoggedIn) {
        this.stats.ongoingOrders = 0;
        this.stats.finishedOrders = 0;
        return;
      }
      try {
        const res = await utils_request.request.get("/api/order/list", {
          role: "user",
          page: 1,
          page_size: 50
        });
        const list = res.list || [];
        let ongoing = 0;
        let finished = 0;
        list.forEach((item) => {
          if (item.status === 4) {
            finished++;
          } else if (item.status !== 5) {
            ongoing++;
          }
        });
        this.stats.ongoingOrders = ongoing;
        this.stats.finishedOrders = finished;
      } catch (e) {
        const mockOrders = this.getMockOrders();
        let ongoing = 0;
        let finished = 0;
        mockOrders.forEach((item) => {
          if (item.status === 4) {
            finished++;
          } else if (item.status !== 5) {
            ongoing++;
          }
        });
        this.stats.ongoingOrders = ongoing;
        this.stats.finishedOrders = finished;
      }
    },
    getMockOrders() {
      const now = Date.now();
      return [
        {
          id: 1,
          status: 4,
          order_no: "ORD" + String(now).slice(-10)
        },
        {
          id: 9,
          status: 1,
          order_no: "ORD" + String(now - 100).slice(-10)
        }
      ];
    },
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        common_vendor.index.showToast({
          title: "请输入关键词",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: `搜索：${this.searchKeyword}`,
        icon: "none"
      });
    },
    handleEntry(action) {
      if (typeof this[action] === "function") {
        this[action]();
      }
    },
    createDemand() {
      common_vendor.index.navigateTo({
        url: "/pages/user/demand/create"
      });
    },
    viewOrders() {
      common_vendor.index.switchTab({
        url: "/pages/user/order/list"
      });
    },
    viewDrafts() {
      common_vendor.index.navigateTo({
        url: "/pages/user/demand/drafts"
      });
    },
    matchMaster() {
      common_vendor.index.navigateTo({
        url: "/pages/user/match/masters"
      });
    },
    viewQuotes() {
      common_vendor.index.navigateTo({
        url: "/pages/user/match/quotes"
      });
    },
    viewSettings() {
      common_vendor.index.navigateTo({
        url: "/pages/user/settings/index"
      });
    },
    viewAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/user/settings/index?tab=about"
      });
    },
    contactSupport() {
      common_vendor.index.showModal({
        title: "客服支持",
        content: "拨打 400-123-4567 或添加客服微信：xydianan",
        showCancel: false
      });
    },
    chooseRegion() {
      common_vendor.index.showActionSheet({
        itemList: ["中部地区", "华北地区", "西南地区"],
        success: (res) => {
          this.currentRegion = ["中部地区", "华北地区", "西南地区"][res.tapIndex];
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _easycom_service_float2 = common_vendor.resolveComponent("service-float");
  (_component_uni_icons + _easycom_service_float2)();
}
const _easycom_service_float = () => "../../components/ServiceFloat.js";
if (!Math) {
  _easycom_service_float();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.currentRegion),
    b: common_vendor.o((...args) => $options.chooseRegion && $options.chooseRegion(...args)),
    c: common_assets._imports_0,
    d: common_vendor.o((...args) => $options.viewSettings && $options.viewSettings(...args)),
    e: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    f: $data.searchKeyword,
    g: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    h: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    i: common_assets._imports_1,
    j: common_vendor.f($data.primaryEntries, (card, k0, i0) => {
      return {
        a: common_vendor.t(card.icon),
        b: common_vendor.t(card.title),
        c: common_vendor.t(card.desc),
        d: "1cf27b2a-0-" + i0,
        e: card.id,
        f: common_vendor.o(($event) => $options.handleEntry(card.action), card.id)
      };
    }),
    k: common_vendor.p({
      type: "right",
      size: "18",
      color: "#C7C7CC"
    }),
    l: common_vendor.f($data.serviceGrid, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.icon),
        b: common_vendor.t(item.label),
        c: item.id,
        d: common_vendor.o(($event) => $options.handleEntry(item.action), item.id)
      };
    }),
    m: common_vendor.t($data.stats.ongoingOrders),
    n: common_vendor.t($data.stats.finishedOrders),
    o: common_vendor.t($data.stats.draftCount),
    p: common_vendor.o((...args) => $options.createDemand && $options.createDemand(...args)),
    q: $data.largeFontMode ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
