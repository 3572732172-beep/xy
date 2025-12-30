"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const store_user = require("../../../store/user.js");
const _sfc_main = {
  data() {
    return {
      demandId: null,
      masterList: [],
      currentSort: "distance",
      sortOptions: [
        { value: "distance", label: "距离最近" },
        { value: "rating", label: "评分最高" },
        { value: "price", label: "价格最低" }
      ],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      showSortModal: false,
      largeFontMode: false
    };
  },
  computed: {
    sortText() {
      const option = this.sortOptions.find((opt) => opt.value === this.currentSort);
      return option ? option.label : "距离最近";
    }
  },
  onLoad(options) {
    this.demandId = options.demand_id || null;
    this.largeFontMode = store_user.userStore.state.largeFontMode;
    this.loadMasters();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.masterList = [];
    this.hasMore = true;
    this.loadMasters().finally(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  methods: {
    /**
     * 加载师傅列表
     */
    async loadMasters() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const params = {
          sort: this.currentSort,
          page: this.page,
          page_size: this.pageSize
        };
        if (this.demandId) {
          params.demand_id = this.demandId;
        }
        const result = await utils_request.request.get("/api/match/masters", params);
        if (result.list && result.list.length > 0) {
          this.masterList = this.masterList.concat(result.list);
          this.hasMore = result.list.length >= this.pageSize;
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/match/masters.vue:141", "加载师傅列表失败", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    /**
     * 选择排序方式
     */
    selectSort(sort) {
      this.currentSort = sort;
      this.showSortModal = false;
      this.page = 1;
      this.masterList = [];
      this.hasMore = true;
      this.loadMasters();
    },
    /**
     * 加载更多
     */
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.page++;
        this.loadMasters();
      }
    },
    /**
     * 查看师傅详情
     */
    viewMasterDetail(master) {
      common_vendor.index.navigateTo({
        url: `/pages/user/match/master-detail?master_id=${master.id}&demand_id=${this.demandId}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.sortText),
    b: common_vendor.o(($event) => $data.showSortModal = true),
    c: common_vendor.f($data.masterList, (master, k0, i0) => {
      return {
        a: master.avatar,
        b: common_vendor.t(master.name),
        c: common_vendor.t(master.rating),
        d: common_vendor.f(master.tags, (tag, k1, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tag
          };
        }),
        e: common_vendor.t(master.distance),
        f: common_vendor.t(master.min_price),
        g: common_vendor.t(master.max_price),
        h: master.id,
        i: common_vendor.o(($event) => $options.viewMasterDetail(master), master.id)
      };
    }),
    d: $data.hasMore
  }, $data.hasMore ? common_vendor.e({
    e: $data.loading
  }, $data.loading ? {} : {
    f: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  }) : {}, {
    g: !$data.hasMore && $data.masterList.length > 0
  }, !$data.hasMore && $data.masterList.length > 0 ? {} : {}, {
    h: !$data.loading && $data.masterList.length === 0
  }, !$data.loading && $data.masterList.length === 0 ? {} : {}, {
    i: $data.showSortModal
  }, $data.showSortModal ? {
    j: common_vendor.f($data.sortOptions, (option, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(option.label),
        b: $data.currentSort === option.value
      }, $data.currentSort === option.value ? {} : {}, {
        c: option.value,
        d: $data.currentSort === option.value ? 1 : "",
        e: common_vendor.o(($event) => $options.selectSort(option.value), option.value)
      });
    }),
    k: common_vendor.o(() => {
    }),
    l: common_vendor.o(($event) => $data.showSortModal = false)
  } : {}, {
    m: $data.largeFontMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2b5af96d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/match/masters.js.map
