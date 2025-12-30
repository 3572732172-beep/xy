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
      orderId: null,
      orderData: {},
      largeFontMode: false,
      progressSteps: []
    };
  },
  computed: {
    priceDetails() {
      return [
        { label: "材料费", value: this.orderData.material_price || 0 },
        { label: "人工费", value: this.orderData.labor_price || 0 },
        { label: "其他费用", value: this.orderData.other_price || 0 }
      ].filter((item) => item.value > 0);
    }
  },
  onLoad(options) {
    if (options.order_id) {
      this.orderId = options.order_id;
      this.loadOrderDetail();
    }
    this.largeFontMode = store_user.userStore.state.largeFontMode;
  },
  methods: {
    /**
     * 加载订单详情
     */
    async loadOrderDetail() {
      try {
        this.orderData = await utils_request.request.get("/api/order/detail", {
          order_id: this.orderId
        });
        this.updateProgressSteps();
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/user/order/detail.vue:149", "API请求失败，使用模拟数据", error.message);
        const mockOrder = this.getMockOrderDetail(this.orderId);
        if (mockOrder) {
          this.orderData = mockOrder;
          this.updateProgressSteps();
        } else {
          common_vendor.index.__f__("error", "at pages/user/order/detail.vue:157", "订单不存在", this.orderId);
          common_vendor.index.showToast({
            title: "订单不存在",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      }
    },
    /**
     * 获取模拟订单详情（用于开发测试）
     */
    getMockOrderDetail(orderId) {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1e3;
      const oneWeek = 7 * oneDay;
      const mockOrders = {
        1: {
          id: 1,
          order_no: "ORD" + String(now).slice(-10),
          status: 4,
          demand_title: "家庭电路改造",
          master_name: "张师傅",
          master_avatar: "/static/avatar1.png",
          master_rating: 4.8,
          master_phone: "13800138001",
          total_price: 3500,
          labor_price: 2e3,
          material_price: 1200,
          other_price: 300,
          service_type: 1,
          power_kw: 15,
          address: "北京市朝阳区xxx街道xxx号",
          created_at: now - oneWeek,
          contract_url: ""
        },
        2: {
          id: 2,
          order_no: "ORD" + String(now - 1e3).slice(-10),
          status: 4,
          demand_title: "老旧线路维修",
          master_name: "李师傅",
          master_avatar: "/static/avatar2.png",
          master_rating: 4.9,
          master_phone: "13800138002",
          total_price: 1200,
          labor_price: 800,
          material_price: 350,
          other_price: 50,
          service_type: 1,
          power_kw: 8,
          address: "北京市海淀区xxx街道xxx号",
          created_at: now - oneWeek - oneDay,
          contract_url: ""
        },
        3: {
          id: 3,
          order_no: "ORD" + String(now - 2e3).slice(-10),
          status: 4,
          demand_title: "智能家居电路安装",
          master_name: "王师傅",
          master_avatar: "/static/avatar3.png",
          master_rating: 4.7,
          master_phone: "13800138003",
          total_price: 2800,
          labor_price: 1500,
          material_price: 1e3,
          other_price: 300,
          service_type: 1,
          power_kw: 12,
          address: "北京市西城区xxx街道xxx号",
          created_at: now - oneWeek - 2 * oneDay,
          contract_url: ""
        },
        4: {
          id: 4,
          order_no: "ORD" + String(now - 3e3).slice(-10),
          status: 4,
          demand_title: "配电箱升级改造",
          master_name: "刘师傅",
          master_avatar: "/static/avatar4.png",
          master_rating: 4.9,
          master_phone: "13800138004",
          total_price: 4500,
          labor_price: 2500,
          material_price: 1800,
          other_price: 200,
          service_type: 1,
          power_kw: 20,
          address: "北京市东城区xxx街道xxx号",
          created_at: now - 2 * oneWeek,
          contract_url: ""
        },
        5: {
          id: 5,
          order_no: "ORD" + String(now - 4e3).slice(-10),
          status: 4,
          demand_title: "厨房电路增容",
          master_name: "陈师傅",
          master_avatar: "/static/avatar5.png",
          master_rating: 4.6,
          master_phone: "13800138005",
          total_price: 2200,
          labor_price: 1200,
          material_price: 900,
          other_price: 100,
          service_type: 1,
          power_kw: 10,
          address: "北京市丰台区xxx街道xxx号",
          created_at: now - 2 * oneWeek - oneDay,
          contract_url: ""
        },
        6: {
          id: 6,
          order_no: "ORD" + String(now - 5e3).slice(-10),
          status: 4,
          demand_title: "卫生间防水电路改造",
          master_name: "赵师傅",
          master_avatar: "/static/avatar6.png",
          master_rating: 4.8,
          master_phone: "13800138006",
          total_price: 1800,
          labor_price: 1e3,
          material_price: 700,
          other_price: 100,
          service_type: 1,
          power_kw: 8,
          address: "北京市石景山区xxx街道xxx号",
          created_at: now - 3 * oneWeek,
          contract_url: ""
        },
        7: {
          id: 7,
          order_no: "ORD" + String(now - 6e3).slice(-10),
          status: 4,
          demand_title: "客厅照明电路改造",
          master_name: "周师傅",
          master_avatar: "/static/avatar7.png",
          master_rating: 4.7,
          master_phone: "13800138007",
          total_price: 1500,
          labor_price: 800,
          material_price: 600,
          other_price: 100,
          service_type: 1,
          power_kw: 6,
          address: "北京市通州区xxx街道xxx号",
          created_at: now - 3 * oneWeek - oneDay,
          contract_url: ""
        },
        8: {
          id: 8,
          order_no: "ORD" + String(now - 7e3).slice(-10),
          status: 4,
          demand_title: "阳台电路安装",
          master_name: "吴师傅",
          master_avatar: "/static/avatar8.png",
          master_rating: 4.5,
          master_phone: "13800138008",
          total_price: 900,
          labor_price: 500,
          material_price: 350,
          other_price: 50,
          service_type: 1,
          power_kw: 5,
          address: "北京市昌平区xxx街道xxx号",
          created_at: now - 4 * oneWeek,
          contract_url: ""
        },
        9: {
          id: 9,
          order_no: "ORD" + String(now - 100).slice(-10),
          status: 1,
          demand_title: "卧室电路改造",
          master_name: "郑师傅",
          master_avatar: "/static/avatar9.png",
          master_rating: 4.8,
          master_phone: "13800138009",
          total_price: 2e3,
          labor_price: 1100,
          material_price: 800,
          other_price: 100,
          service_type: 1,
          power_kw: 9,
          address: "北京市大兴区xxx街道xxx号",
          created_at: now - 2 * oneDay,
          contract_url: ""
        },
        10: {
          id: 10,
          order_no: "ORD" + String(now - 200).slice(-10),
          status: 2,
          demand_title: "书房电路安装",
          master_name: "孙师傅",
          master_avatar: "/static/avatar10.png",
          master_rating: 4.9,
          master_phone: "13800138010",
          total_price: 1600,
          labor_price: 900,
          material_price: 600,
          other_price: 100,
          service_type: 1,
          power_kw: 7,
          address: "北京市房山区xxx街道xxx号",
          created_at: now - oneDay,
          contract_url: ""
        },
        11: {
          id: 11,
          order_no: "ORD" + String(now - 300).slice(-10),
          status: 3,
          demand_title: "车库电路改造",
          master_name: "钱师傅",
          master_avatar: "/static/avatar11.png",
          master_rating: 4.7,
          master_phone: "13800138011",
          total_price: 3e3,
          labor_price: 1800,
          material_price: 1100,
          other_price: 100,
          service_type: 1,
          power_kw: 16,
          address: "北京市顺义区xxx街道xxx号",
          created_at: now - 3 * oneDay,
          contract_url: ""
        },
        12: {
          id: 12,
          order_no: "ORD" + String(now - 8e3).slice(-10),
          status: 5,
          demand_title: "阳台电路安装（已取消）",
          master_name: "冯师傅",
          master_avatar: "/static/avatar12.png",
          master_rating: 4.6,
          master_phone: "13800138012",
          total_price: 1100,
          labor_price: 600,
          material_price: 450,
          other_price: 50,
          service_type: 1,
          power_kw: 6,
          address: "北京市怀柔区xxx街道xxx号",
          created_at: now - 5 * oneWeek,
          contract_url: ""
        }
      };
      return mockOrders[orderId] || null;
    },
    /**
     * 更新进度步骤
     */
    updateProgressSteps() {
      const status = this.orderData.status;
      this.progressSteps = [
        { label: "已下单", completed: status >= 1, active: status === 1 },
        { label: "已支付", completed: status >= 2, active: status === 2 },
        { label: "施工中", completed: status >= 3, active: status === 3 },
        { label: "已完成", completed: status >= 4, active: status === 4 }
      ];
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
     * 支付订单
     */
    async payOrder() {
      common_vendor.index.showModal({
        title: "确认支付",
        content: `确认支付 ¥${this.orderData.total_price} ？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.request.post("/api/order/pay", {
                order_id: this.orderId
              });
              common_vendor.index.showToast({
                title: "支付成功",
                icon: "success"
              });
              setTimeout(() => {
                this.loadOrderDetail();
              }, 1500);
              common_vendor.index.$emit("orderStatusChanged");
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/user/order/detail.vue:480", "支付失败", error);
            }
          }
        }
      });
    },
    /**
     * 取消订单
     */
    async cancelOrder() {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确定要取消此订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.request.post("/api/order/cancel", {
                order_id: this.orderId
              });
              common_vendor.index.showToast({
                title: "订单已取消",
                icon: "success"
              });
              common_vendor.index.$emit("orderStatusChanged");
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/user/order/detail.vue:514", "取消订单失败", error);
            }
          }
        }
      });
    },
    /**
     * 确认验收
     */
    async confirmOrder() {
      common_vendor.index.showModal({
        title: "确认验收",
        content: "确认工程已验收完成？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.request.post("/api/order/confirm", {
                order_id: this.orderId
              });
              common_vendor.index.showToast({
                title: "验收成功",
                icon: "success"
              });
              setTimeout(() => {
                this.loadOrderDetail();
              }, 1500);
              common_vendor.index.$emit("orderStatusChanged");
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/user/order/detail.vue:548", "确认验收失败", error);
            }
          }
        }
      });
    },
    /**
     * 联系师傅
     */
    contactMaster() {
      common_vendor.index.makePhoneCall({
        phoneNumber: this.orderData.master_phone
      });
    },
    /**
     * 查看合同
     */
    viewContract() {
      common_vendor.index.previewImage({
        urls: [this.orderData.contract_url]
      });
    },
    /**
     * 申请售后
     */
    applyAfterSale() {
      common_vendor.index.showToast({
        title: "售后功能开发中",
        icon: "none"
      });
    },
    /**
     * 查看质保
     */
    viewWarranty() {
      common_vendor.index.showModal({
        title: "质保信息",
        content: `质保期：${this.orderData.warranty_months}个月
质保开始时间：${this.formatTime(this.orderData.completed_at)}`,
        showCancel: false
      });
    },
    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
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
      title: "订单详情",
      subtitle: "掌握施工进度与报价"
    }),
    b: common_vendor.t($data.orderData.order_no),
    c: common_vendor.t($options.getStatusText($data.orderData.status)),
    d: common_vendor.n("status-" + $data.orderData.status),
    e: $data.orderData.status <= 3
  }, $data.orderData.status <= 3 ? {
    f: common_vendor.f($data.progressSteps, (step, index, i0) => {
      return {
        a: common_vendor.t(step.label),
        b: index,
        c: step.active ? 1 : "",
        d: step.completed ? 1 : ""
      };
    })
  } : {}, {
    g: common_vendor.t($data.orderData.demand_title),
    h: common_vendor.t($options.getSceneText($data.orderData.service_type)),
    i: common_vendor.t($data.orderData.power_kw),
    j: common_vendor.t($data.orderData.address),
    k: $data.orderData.master_avatar,
    l: common_vendor.t($data.orderData.master_name),
    m: common_vendor.t($data.orderData.master_rating),
    n: common_vendor.t($data.orderData.master_phone),
    o: common_vendor.o((...args) => _ctx.callMaster && _ctx.callMaster(...args)),
    p: common_vendor.f($options.priceDetails, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: common_vendor.t(item.value),
        c: index
      };
    }),
    q: common_vendor.t($data.orderData.total_price),
    r: $data.orderData.contract_url
  }, $data.orderData.contract_url ? {
    s: common_vendor.o((...args) => $options.viewContract && $options.viewContract(...args))
  } : {}, {
    t: $data.orderData.status === 1
  }, $data.orderData.status === 1 ? {
    v: common_vendor.o((...args) => $options.payOrder && $options.payOrder(...args)),
    w: common_vendor.o((...args) => $options.cancelOrder && $options.cancelOrder(...args))
  } : {}, {
    x: $data.orderData.status === 3
  }, $data.orderData.status === 3 ? {
    y: common_vendor.o((...args) => $options.confirmOrder && $options.confirmOrder(...args)),
    z: common_vendor.o((...args) => $options.contactMaster && $options.contactMaster(...args))
  } : {}, {
    A: $data.orderData.status === 4
  }, $data.orderData.status === 4 ? {
    B: common_vendor.o((...args) => $options.applyAfterSale && $options.applyAfterSale(...args)),
    C: common_vendor.o((...args) => $options.viewWarranty && $options.viewWarranty(...args))
  } : {}, {
    D: $data.largeFontMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-149c0fcf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/order/detail.js.map
