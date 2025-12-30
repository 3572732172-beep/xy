"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const store_user = require("../../../store/user.js");
const utils_offline = require("../../../utils/offline.js");
const _sfc_main = {
  data() {
    return {
      tabs: [
        { value: "all", label: "全部" },
        { value: "pending", label: "进行中" },
        { value: "completed", label: "已完成" },
        { value: "cancelled", label: "已取消" }
      ],
      currentTab: "all",
      orderList: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      largeFontMode: false,
      isInitialized: false
      // 标记是否已初始化
    };
  },
  onLoad() {
    this.largeFontMode = store_user.userStore.state.largeFontMode;
    if (!store_user.userStore.state.isLoggedIn) {
      this.orderList = [];
      this.isInitialized = true;
      return;
    }
    this.loadOrders();
    common_vendor.index.$on("demandCreated", () => {
      common_vendor.index.__f__("log", "at pages/user/order/list.vue:117", "收到需求创建事件，刷新订单列表");
      if (!this.loading) {
        this.page = 1;
        this.orderList = [];
        this.hasMore = true;
        this.loadOrders();
      }
    });
  },
  onShow() {
    if (!this.isInitialized) {
      if (store_user.userStore.state.isLoggedIn && !this.loading) {
        this.loadOrders();
      }
    }
  },
  onUnload() {
    common_vendor.index.$off("demandCreated");
    this.isInitialized = false;
  },
  onPullDownRefresh() {
    if (this.loading) {
      common_vendor.index.stopPullDownRefresh();
      return;
    }
    this.page = 1;
    this.orderList = [];
    this.hasMore = true;
    this.loadOrders().finally(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  methods: {
    /**
     * 切换标签
     */
    switchTab(tab) {
      if (this.currentTab === tab || this.loading) {
        return;
      }
      this.currentTab = tab;
      this.page = 1;
      this.orderList = [];
      this.hasMore = true;
      this.loadOrders();
    },
    /**
     * 加载订单列表
     */
    async loadOrders() {
      if (this.loading) {
        common_vendor.index.__f__("log", "at pages/user/order/list.vue:173", "订单列表正在加载中，跳过重复请求");
        return;
      }
      this.loading = true;
      try {
        const params = {
          role: "user",
          page: this.page,
          page_size: this.pageSize
        };
        if (this.currentTab !== "all") {
          const statusMap = {
            "pending": [1, 2, 3],
            // 进行中：待支付、已支付、施工中
            "completed": [4],
            // 已完成
            "cancelled": [5]
            // 已取消
          };
          params.status = statusMap[this.currentTab];
        }
        const result = await utils_request.request.get("/api/order/list", params);
        if (result.list && result.list.length > 0) {
          if (this.page === 1) {
            this.orderList = result.list;
          } else {
            this.orderList = this.orderList.concat(result.list);
          }
          this.hasMore = result.list.length >= this.pageSize;
        } else {
          if (this.page === 1) {
            this.orderList = [];
          }
          this.hasMore = false;
        }
      } catch (error) {
        if (this.page === 1 && this.currentTab === "all") {
          common_vendor.index.__f__("log", "at pages/user/order/list.vue:215", "API不可用，使用模拟订单数据");
        }
        const mockOrders = this.getMockOrders();
        let filteredOrders = mockOrders;
        if (this.currentTab !== "all") {
          const statusMap = {
            "pending": [1, 2, 3],
            // 进行中
            "completed": [4],
            // 已完成
            "cancelled": [5]
            // 已取消
          };
          const targetStatuses = statusMap[this.currentTab] || [];
          filteredOrders = mockOrders.filter((order) => targetStatuses.includes(order.status));
        }
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageOrders = filteredOrders.slice(startIndex, endIndex);
        if (pageOrders.length > 0) {
          if (this.page === 1) {
            this.orderList = pageOrders;
          } else {
            this.orderList = this.orderList.concat(pageOrders);
          }
          this.hasMore = endIndex < filteredOrders.length;
        } else {
          if (this.page === 1) {
            this.orderList = [];
          }
          this.hasMore = false;
        }
      } finally {
        this.loading = false;
        this.isInitialized = true;
        if (this.page === 1) {
          common_vendor.index.$emit("orderStatusChanged");
        }
      }
    },
    /**
     * 加载本地订单（离线模式）
     */
    loadLocalOrders() {
      const localOrders = utils_offline.offline.recentOrders.getAll();
      if (localOrders.length > 0) {
        this.orderList = localOrders.slice(0, this.pageSize);
      }
    },
    /**
     * 获取模拟订单数据（用于开发测试）
     */
    getMockOrders() {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1e3;
      const oneWeek = 7 * oneDay;
      return [
        // 已完成订单
        {
          id: 1,
          order_no: "ORD" + String(now).slice(-10),
          status: 4,
          demand_title: "家庭电路改造",
          master_name: "张师傅",
          total_price: 3500,
          created_at: now - oneWeek
        },
        {
          id: 2,
          order_no: "ORD" + String(now - 1e3).slice(-10),
          status: 4,
          demand_title: "老旧线路维修",
          master_name: "李师傅",
          total_price: 1200,
          created_at: now - oneWeek - oneDay
        },
        {
          id: 3,
          order_no: "ORD" + String(now - 2e3).slice(-10),
          status: 4,
          demand_title: "智能家居电路安装",
          master_name: "王师傅",
          total_price: 2800,
          created_at: now - oneWeek - 2 * oneDay
        },
        {
          id: 4,
          order_no: "ORD" + String(now - 3e3).slice(-10),
          status: 4,
          demand_title: "配电箱升级改造",
          master_name: "刘师傅",
          total_price: 4500,
          created_at: now - 2 * oneWeek
        },
        {
          id: 5,
          order_no: "ORD" + String(now - 4e3).slice(-10),
          status: 4,
          demand_title: "厨房电路增容",
          master_name: "陈师傅",
          total_price: 2200,
          created_at: now - 2 * oneWeek - oneDay
        },
        {
          id: 6,
          order_no: "ORD" + String(now - 5e3).slice(-10),
          status: 4,
          demand_title: "卫生间防水电路改造",
          master_name: "赵师傅",
          total_price: 1800,
          created_at: now - 3 * oneWeek
        },
        {
          id: 7,
          order_no: "ORD" + String(now - 6e3).slice(-10),
          status: 4,
          demand_title: "客厅照明电路改造",
          master_name: "周师傅",
          total_price: 1500,
          created_at: now - 3 * oneWeek - oneDay
        },
        {
          id: 8,
          order_no: "ORD" + String(now - 7e3).slice(-10),
          status: 4,
          demand_title: "阳台电路安装",
          master_name: "吴师傅",
          total_price: 900,
          created_at: now - 4 * oneWeek
        },
        // 进行中订单
        {
          id: 9,
          order_no: "ORD" + String(now - 100).slice(-10),
          status: 1,
          demand_title: "卧室电路改造",
          master_name: "郑师傅",
          total_price: 2e3,
          created_at: now - 2 * oneDay
        },
        {
          id: 10,
          order_no: "ORD" + String(now - 200).slice(-10),
          status: 2,
          demand_title: "书房电路安装",
          master_name: "孙师傅",
          total_price: 1600,
          created_at: now - oneDay
        },
        {
          id: 11,
          order_no: "ORD" + String(now - 300).slice(-10),
          status: 3,
          demand_title: "车库电路改造",
          master_name: "钱师傅",
          total_price: 3e3,
          created_at: now - 3 * oneDay
        },
        // 已取消订单
        {
          id: 12,
          order_no: "ORD" + String(now - 8e3).slice(-10),
          status: 5,
          demand_title: "阳台电路安装（已取消）",
          master_name: "冯师傅",
          total_price: 1100,
          created_at: now - 5 * oneWeek
        }
      ];
    },
    /**
     * 加载更多
     */
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.page++;
        this.loadOrders();
      }
    },
    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const statusMap = {
        1: "待支付",
        2: "已支付",
        3: "施工中",
        4: "已完成",
        5: "已取消"
      };
      return statusMap[status] || "未知";
    },
    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    /**
     * 查看订单详情
     */
    viewOrderDetail(order) {
      common_vendor.index.navigateTo({
        url: `/pages/user/order/detail?order_id=${order.id}`
      });
    },
    /**
     * 取消订单
     */
    async cancelOrder(order) {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确定要取消此订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.request.post("/api/order/cancel", {
                order_id: order.id
              });
              common_vendor.index.showToast({
                title: "订单已取消",
                icon: "success"
              });
              this.page = 1;
              this.orderList = [];
              this.loadOrders();
              common_vendor.index.$emit("orderStatusChanged");
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/user/order/list.vue:466", "取消订单失败", error);
            }
          }
        }
      });
    },
    /**
     * 确认验收
     */
    async confirmOrder(order) {
      common_vendor.index.showModal({
        title: "确认验收",
        content: "确认工程已验收完成？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.request.post("/api/order/confirm", {
                order_id: order.id
              });
              common_vendor.index.showToast({
                title: "验收成功",
                icon: "success"
              });
              this.page = 1;
              this.orderList = [];
              this.loadOrders();
              common_vendor.index.$emit("orderStatusChanged");
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/user/order/list.vue:500", "确认验收失败", error);
            }
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, k0, i0) => {
      return {
        a: common_vendor.t(tab.label),
        b: tab.value,
        c: $data.currentTab === tab.value ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(tab.value), tab.value)
      };
    }),
    b: common_vendor.f($data.orderList, (order, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.order_no),
        b: common_vendor.t($options.getStatusText(order.status)),
        c: common_vendor.n("status-" + order.status),
        d: common_vendor.t(order.demand_title),
        e: common_vendor.t(order.master_name),
        f: common_vendor.t(order.total_price),
        g: common_vendor.t($options.formatTime(order.created_at)),
        h: order.status === 1
      }, order.status === 1 ? {
        i: common_vendor.o(($event) => $options.cancelOrder(order), order.id)
      } : {}, {
        j: order.status === 3
      }, order.status === 3 ? {
        k: common_vendor.o(($event) => $options.confirmOrder(order), order.id)
      } : {}, {
        l: common_vendor.o(($event) => $options.viewOrderDetail(order), order.id),
        m: order.id,
        n: common_vendor.o(($event) => $options.viewOrderDetail(order), order.id)
      });
    }),
    c: $data.hasMore
  }, $data.hasMore ? common_vendor.e({
    d: $data.loading
  }, $data.loading ? {} : {
    e: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  }) : {}, {
    f: !$data.hasMore && $data.orderList.length > 0
  }, !$data.hasMore && $data.orderList.length > 0 ? {} : {}, {
    g: !$data.loading && $data.orderList.length === 0
  }, !$data.loading && $data.orderList.length === 0 ? {} : {}, {
    h: $data.largeFontMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0f10c602"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/order/list.js.map
