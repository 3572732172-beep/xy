"use strict";
const common_vendor = require("../../common/vendor.js");
const common_util = require("../../common/util.js");
const newsItem = () => "./news-item.js";
const uniLoadMore = () => "../../components/uni-load-more.js";
const noData = () => "../../components/nodata.js";
const _sfc_main = {
  components: {
    uniLoadMore,
    noData,
    newsItem
  },
  props: {
    nid: {
      type: [Number, String],
      default: ""
    }
  },
  data() {
    return {
      dataList: [],
      navigateFlag: false,
      pulling: false,
      refreshing: false,
      refreshFlag: false,
      refreshText: "",
      isLoading: false,
      loadingText: "加载中...",
      isNoData: false,
      angle: 0,
      loadingMoreText: {
        contentdown: "",
        contentrefresh: "",
        contentnomore: ""
      },
      refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg=="
    };
  },
  created() {
    this.pullTimer = null;
    this.requestParams = {
      columnId: this.nid,
      minId: 0,
      pageSize: 10,
      column: "id,post_id,title,author_name,cover,published_at,comments_count"
    };
    this._isWidescreen = false;
  },
  onShow() {
    this.navigateFlag = false;
  },
  methods: {
    loadData(refresh) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.isNoData = false;
      this.requestParams.time = (/* @__PURE__ */ new Date()).getTime() + "";
      const caseData = this.getCaseDataByCategory(this.nid);
      const pageSize = 10;
      const startIndex = refresh ? 0 : this.dataList.length;
      const endIndex = startIndex + pageSize;
      const pageData = caseData.slice(startIndex, endIndex);
      const caseImages = [
        "/static/anli1 (3)_d2ace6a3-df10-4b98-9b67-6bbaf20ef73f_PhotoGrid.png",
        "/static/anli1 (4)_3770c426-4ad2-4999-a53b-e961a6a7a39a_PhotoGrid.png",
        "/static/anli1 (5)_d3d47279-48b1-44a7-a8ca-cee9a50001bb_PhotoGrid.png",
        "/static/anli1 (6)_80d321cf-a48a-4002-bafe-b4df4ec92674_PhotoGrid.png",
        "/static/anli1 (7)_56492d5f-9f01-42ad-89e4-94589ece55d2_PhotoGrid.png",
        "/static/anli1 (8)_d1bdb4f2-b067-4ddc-849a-f1da8f016ce1_PhotoGrid.png"
      ];
      this.isNoData = pageData.length <= 0 && startIndex === 0;
      const data_list = pageData.map((caseItem, index) => {
        const image = caseItem.image || caseImages[(startIndex + index) % caseImages.length];
        return {
          id: this.newGuid() + (startIndex + index),
          newsid: startIndex + index,
          article_type: 1,
          datetime: common_util.friendlyDate(new Date(caseItem.date).getTime()),
          title: caseItem.title,
          image_url: image,
          source: caseItem.master || "专业电工",
          comment_count: Math.floor(Math.random() * 50),
          post_id: startIndex + index,
          content: caseItem.content || null,
          // 添加内容字段，如果没有则详情页自动生成
          categoryId: this.nid
          // 保存分类ID
        };
      });
      if (refresh) {
        this.dataList = data_list;
        this.requestParams.minId = 0;
      } else {
        this.dataList = this.dataList.concat(data_list);
        this.requestParams.minId = this.dataList.length;
      }
      if (this.dataList.length > 0 && this._isWidescreen && this.dataList.length <= 10) {
        this.goDetail(this.dataList[0]);
      }
      setTimeout(() => {
        this.isLoading = false;
        if (refresh) {
          this.refreshing = false;
          this.refreshFlag = false;
          this.refreshText = "已刷新";
          if (this.pullTimer) {
            clearTimeout(this.pullTimer);
          }
          this.pullTimer = setTimeout(() => {
            this.pulling = false;
          }, 1e3);
        }
      }, 500);
    },
    /**
     * 根据分类获取案例数据
     */
    getCaseDataByCategory(categoryId) {
      const allCases = {
        // 生活用电 (0)
        0: [
          {
            title: "家庭电路改造成功案例：老房电路全面升级",
            master: "张师傅",
            date: "2024-01-15",
            image: "",
            content: "<p>客户王先生的老房子建于1990年代，电路老化严重，经常出现跳闸、电压不稳等问题。经过张师傅的专业检测，发现主要问题包括：</p><p>1. 原有电路容量不足，无法满足现代家电需求</p><p>2. 电线老化，绝缘层破损</p><p>3. 配电箱配置不合理，缺少漏电保护</p><p><strong>改造方案：</strong></p><p>• 更换全部室内电线，使用国标2.5mm²和4mm²铜线</p><p>• 升级配电箱，增加漏电保护器和空气开关</p><p>• 重新规划电路布局，厨房、卫生间单独回路</p><p>• 增加插座数量，满足现代生活需求</p><p><strong>改造效果：</strong></p><p>改造后，电路运行稳定，未再出现跳闸现象。客户对改造效果非常满意，称赞张师傅专业细致，施工规范。</p>"
          },
          {
            title: "农村自建房用电规划案例：安全用电从设计开始",
            master: "李师傅",
            date: "2024-01-10",
            image: "",
            content: "<p>客户新建自建房，希望在建设初期就做好用电规划。李师傅从设计阶段介入，为客户制定了完整的用电方案。</p><p><strong>规划要点：</strong></p><p>1. 根据房屋面积和功能区域，合理分配用电负荷</p><p>2. 预留充足的插座和开关位置</p><p>3. 设计独立的厨房、卫生间电路回路</p><p>4. 考虑未来智能家居设备的用电需求</p><p><strong>实施效果：</strong></p><p>房屋建成后，用电布局合理，安全可靠，客户对规划方案非常满意。</p>"
          },
          { title: "家庭用电增容案例：满足现代化生活需求", master: "王师傅", date: "2024-01-05", image: "" },
          { title: "智能家居电路改造案例：让生活更便捷", master: "刘师傅", date: "2023-12-28", image: "" },
          { title: "老旧小区电路升级案例：提升用电安全性", master: "陈师傅", date: "2023-12-20", image: "" },
          { title: "农村家庭用电标准化改造案例", master: "张师傅", date: "2023-12-15", image: "" },
          { title: "家庭用电负荷计算与改造案例", master: "李师傅", date: "2023-12-10", image: "" },
          { title: "生活用电安全防护案例：漏电保护器安装", master: "王师傅", date: "2023-12-05", image: "" },
          { title: "家庭配电箱升级改造案例", master: "刘师傅", date: "2023-11-28", image: "" },
          { title: "农村家庭用电标准化建设案例", master: "陈师傅", date: "2023-11-20", image: "" },
          { title: "家庭用电线路优化案例：减少线损", master: "张师傅", date: "2023-11-15", image: "" },
          { title: "生活用电节能改造案例", master: "李师傅", date: "2023-11-10", image: "" }
        ],
        // 电路维修 (23)
        23: [
          { title: "电路短路故障排除案例：快速定位问题", master: "张师傅", date: "2024-01-12", image: "" },
          { title: "家庭电路跳闸问题解决案例", master: "李师傅", date: "2024-01-08", image: "" },
          { title: "电路接触不良维修案例：彻底解决隐患", master: "王师傅", date: "2024-01-03", image: "" },
          { title: "老旧线路维修案例：延长使用寿命", master: "刘师傅", date: "2023-12-25", image: "" },
          { title: "电路过载问题维修案例", master: "陈师傅", date: "2023-12-18", image: "" },
          { title: "电路漏电故障排查与维修案例", master: "张师傅", date: "2023-12-12", image: "" },
          { title: "电路接地故障维修案例", master: "李师傅", date: "2023-12-08", image: "" },
          { title: "电路断线故障快速修复案例", master: "王师傅", date: "2023-12-03", image: "" },
          { title: "电路老化维修案例：全面检查与更换", master: "刘师傅", date: "2023-11-25", image: "" },
          { title: "电路维修安全操作案例", master: "陈师傅", date: "2023-11-18", image: "" }
        ],
        // 电器维护 (223)
        223: [
          { title: "空调电路维护案例：延长使用寿命", master: "张师傅", date: "2024-01-14", image: "" },
          { title: "冰箱电路故障维修案例", master: "李师傅", date: "2024-01-09", image: "" },
          { title: "洗衣机电路维护案例：定期保养很重要", master: "王师傅", date: "2024-01-04", image: "" },
          { title: "热水器电路维护案例：安全第一", master: "刘师傅", date: "2023-12-27", image: "" },
          { title: "电视电路故障维修案例", master: "陈师傅", date: "2023-12-22", image: "" },
          { title: "电饭煲电路维护案例", master: "张师傅", date: "2023-12-17", image: "" },
          { title: "电磁炉电路故障排查案例", master: "李师傅", date: "2023-12-13", image: "" },
          { title: "电风扇电路维护案例", master: "王师傅", date: "2023-12-07", image: "" },
          { title: "抽油烟机电路维护案例", master: "刘师傅", date: "2023-11-30", image: "" },
          { title: "家用电器电路综合维护案例", master: "陈师傅", date: "2023-11-22", image: "" }
        ],
        // 用电改造 (221)
        221: [
          { title: "农村用电改造案例：提升供电质量", master: "张师傅", date: "2024-01-13", image: "" },
          { title: "老旧房屋用电改造案例：全面升级", master: "李师傅", date: "2024-01-07", image: "" },
          { title: "商业用电改造案例：满足经营需求", master: "王师傅", date: "2024-01-02", image: "" },
          { title: "工厂用电改造案例：提高生产效率", master: "刘师傅", date: "2023-12-26", image: "" },
          { title: "农业用电改造案例：支持现代化农业", master: "陈师傅", date: "2023-12-19", image: "" },
          { title: "用电改造规划案例：科学设计", master: "张师傅", date: "2023-12-14", image: "" },
          { title: "用电改造施工案例：规范操作", master: "李师傅", date: "2023-12-09", image: "" },
          { title: "用电改造验收案例：确保质量", master: "王师傅", date: "2023-12-04", image: "" },
          { title: "用电改造成本控制案例", master: "刘师傅", date: "2023-11-27", image: "" },
          { title: "用电改造安全案例：预防事故", master: "陈师傅", date: "2023-11-21", image: "" }
        ],
        // 故障排除 (225)
        225: [
          { title: "电路故障快速诊断案例：经验分享", master: "张师傅", date: "2024-01-11", image: "" },
          { title: "用电故障排查技巧案例", master: "李师傅", date: "2024-01-06", image: "" },
          { title: "复杂电路故障排除案例", master: "王师傅", date: "2024-01-01", image: "" },
          { title: "紧急故障排除案例：快速响应", master: "刘师傅", date: "2023-12-24", image: "" },
          { title: "电路故障预防案例：定期检查", master: "陈师傅", date: "2023-12-16", image: "" },
          { title: "用电故障诊断工具使用案例", master: "张师傅", date: "2023-12-11", image: "" },
          { title: "故障排除安全操作案例", master: "李师傅", date: "2023-12-06", image: "" },
          { title: "常见故障排除案例集锦", master: "王师傅", date: "2023-11-29", image: "" },
          { title: "故障排除经验总结案例", master: "刘师傅", date: "2023-11-23", image: "" },
          { title: "故障排除最佳实践案例", master: "陈师傅", date: "2023-11-17", image: "" }
        ],
        // 经典案例 (208)
        208: [
          { title: "经典案例：农村家庭用电全面改造", master: "张师傅", date: "2024-01-16", image: "" },
          { title: "经典案例：大型养殖场用电规划", master: "李师傅", date: "2024-01-11", image: "" },
          { title: "经典案例：工厂用电系统升级", master: "王师傅", date: "2024-01-06", image: "" },
          { title: "经典案例：智能家居电路改造", master: "刘师傅", date: "2023-12-30", image: "" },
          { title: "经典案例：老旧小区电路全面升级", master: "陈师傅", date: "2023-12-23", image: "" },
          { title: "经典案例：农村电网改造", master: "张师傅", date: "2023-12-18", image: "" },
          { title: "经典案例：商业综合体用电设计", master: "李师傅", date: "2023-12-13", image: "" },
          { title: "经典案例：农业现代化用电改造", master: "王师傅", date: "2023-12-08", image: "" },
          { title: "经典案例：应急用电故障处理", master: "刘师傅", date: "2023-12-01", image: "" },
          { title: "经典案例：用电安全防护系统建设", master: "陈师傅", date: "2023-11-24", image: "" }
        ]
      };
      return allCases[categoryId] || allCases[0];
    },
    loadMore(e) {
      this.loadData();
    },
    clear() {
      this.dataList.length = 0;
      this.requestParams.minId = 0;
    },
    goDetail(detail) {
      if (this.navigateFlag) {
        return;
      }
      if (this._isWidescreen) {
        common_vendor.index.$emit("updateDetail", {
          detail: encodeURIComponent(JSON.stringify(detail))
        });
      } else {
        this.navigateFlag = true;
        common_vendor.index.navigateTo({
          url: "./detail?query=" + encodeURIComponent(JSON.stringify(detail)),
          success: () => {
            setTimeout(() => {
              this.navigateFlag = false;
            }, 300);
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at pages/news/news-page.nvue:299", "导航失败:", err);
            this.navigateFlag = false;
          },
          complete: () => {
            setTimeout(() => {
              this.navigateFlag = false;
            }, 500);
          }
        });
      }
    },
    closeItem(index) {
      common_vendor.index.showModal({
        content: "不感兴趣？",
        success: (res) => {
          if (res.confirm) {
            this.dataList.splice(index, 1);
          }
        }
      });
    },
    refreshData() {
      if (this.isLoading) {
        return;
      }
      this.pulling = true;
      this.refreshing = true;
      this.refreshText = "正在刷新...";
      this.loadData(true);
    },
    onrefresh(e) {
      this.refreshData();
    },
    onpullingdown(e) {
      if (this.refreshing) {
        return;
      }
      this.pulling = false;
      if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
        this.refreshFlag = true;
        this.refreshText = "释放立即刷新";
      } else {
        this.refreshFlag = false;
        this.refreshText = "下拉可以刷新";
      }
    },
    newGuid() {
      let s4 = function() {
        return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
      };
      return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
    }
  }
};
if (!Array) {
  const _component_news_item = common_vendor.resolveComponent("news-item");
  const _component_no_data = common_vendor.resolveComponent("no-data");
  (_component_news_item + _component_no_data)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.dataList, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.closeItem(index), item.id),
        b: common_vendor.o(($event) => $options.goDetail(item), item.id),
        c: "8a448673-0-" + i0,
        d: common_vendor.p({
          newsItem: item
        }),
        e: item.id
      };
    }),
    b: $data.isLoading || $data.dataList.length > 4
  }, $data.isLoading || $data.dataList.length > 4 ? {
    c: common_vendor.t($data.loadingText)
  } : {}, {
    d: common_vendor.o(($event) => $options.loadMore()),
    e: $data.isNoData
  }, $data.isNoData ? {
    f: common_vendor.o($options.loadMore)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8a448673"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/news-page.js.map
