import { _ as _export_sfc, f as formatAppLog } from "../../_plugin-vue_export-helper.js";
import { openBlock, createElementBlock, createElementVNode, normalizeStyle, normalizeClass, toDisplayString, createCommentVNode, Fragment, renderList, withModifiers, resolveComponent, createVNode, createBlock, withCtx } from "vue";
function friendlyDate(timestamp) {
  var formats = {
    "year": "%n% 年前",
    "month": "%n% 月前",
    "day": "%n% 天前",
    "hour": "%n% 小时前",
    "minute": "%n% 分钟前",
    "second": "%n% 秒前"
  };
  var now = Date.now();
  var seconds = Math.floor((now - timestamp) / 1e3);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 30);
  var years = Math.floor(months / 12);
  var diffType = "";
  var diffValue = 0;
  if (years > 0) {
    diffType = "year";
    diffValue = years;
  } else {
    if (months > 0) {
      diffType = "month";
      diffValue = months;
    } else {
      if (days > 0) {
        diffType = "day";
        diffValue = days;
      } else {
        if (hours > 0) {
          diffType = "hour";
          diffValue = hours;
        } else {
          if (minutes > 0) {
            diffType = "minute";
            diffValue = minutes;
          } else {
            diffType = "second";
            diffValue = seconds === 0 ? seconds = 1 : seconds;
          }
        }
      }
    }
  }
  return formats[diffType].replace("%n%", diffValue);
}
const _style_0$4 = { "view": { "": { "flexDirection": "column" } }, "flex-row": { "": { "flexDirection": "row" } }, "flex-col": { "": { "flexDirection": "column" } }, "list-cell": { "": { "paddingTop": 0, "paddingRight": 15, "paddingBottom": 0, "paddingLeft": 15 } }, "uni-list-cell-hover": { "": { "backgroundColor": "#eeeeee" } }, "media-item": { "": { "position": "relative", "flex": 1, "flexDirection": "column", "paddingTop": 10, "paddingRight": 15, "paddingBottom": 10, "paddingLeft": 15 } }, "media-item-line": { "": { "position": "absolute", "left": 15, "right": 15, "bottom": 0, "height": 1, "backgroundColor": "#ebebeb" } }, "media-image-right": { "": { "flexDirection": "row" } }, "media-image-left": { "": { "flexDirection": "row-reverse" } }, "media-title": { "": { "flex": 1, "lines": 3, "textOverflow": "ellipsis", "fontSize": 15, "color": "#555555" } }, "media-title2": { "": { "flex": 1, "marginTop": 3, "lineHeight": 20 } }, "image-section": { "": { "marginTop": 10, "flexDirection": "row", "justifyContent": "space-between" } }, "image-section-right": { "": { "marginTop": 0, "marginLeft": 5, "width": 112, "height": 73 } }, "image-section-left": { "": { "marginTop": 0, "marginRight": 5, "width": 112, "height": 73 } }, "image-list1": { "": { "height": 240 } }, "image-list2": { "": { "width": 112, "height": 73 } }, "image-list3": { "": { "width": 112, "height": 73 } }, "media-info": { "": { "flexDirection": "row", "alignItems": "center" } }, "info-text": { "": { "marginRight": 10, "color": "#999999", "fontSize": 12 } }, "media-foot": { "": { "marginTop": 12, "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" } }, "close-view": { "": { "position": "relative", "alignItems": "center", "flexDirection": "row", "width": 20, "height": 15, "lineHeight": 15, "borderWidth": "1rpx", "borderStyle": "solid", "borderColor": "#aaaaaa", "borderRadius": 4, "justifyContent": "center", "textAlign": "center" } }, "close-l": { "": { "position": "absolute", "width": 9, "height": 1, "backgroundColor": "#aaaaaa" } }, "close-h": { "": { "transform": "rotate(45deg)" } }, "close-v": { "": { "transform": "rotate(-45deg)" } } };
const _sfc_main$4 = {
  props: {
    newsItem: {
      type: Object,
      default: function(e) {
        return {};
      }
    }
  },
  methods: {
    click() {
      this.$emit("click");
    },
    close(e) {
      e.stopPropagation();
      this.$emit("close");
    }
  }
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("view", {
    class: "media-item view",
    onClick: _cache[1] || (_cache[1] = (...args) => $options.click && $options.click(...args)),
    renderWhole: true
  }, [
    createElementVNode(
      "view",
      {
        class: "view",
        style: normalizeStyle({ flexDirection: $props.newsItem.article_type === 1 || $props.newsItem.article_type === 2 ? $props.newsItem.article_type === 2 ? "row" : "row-reverse" : "column" })
      },
      [
        createElementVNode(
          "u-text",
          {
            class: normalizeClass(["media-title", { "media-title2": $props.newsItem.article_type === 1 || $props.newsItem.article_type === 2 }])
          },
          toDisplayString($props.newsItem.title),
          3
          /* TEXT, CLASS */
        ),
        $props.newsItem.image_list || $props.newsItem.image_url ? (openBlock(), createElementBlock(
          "view",
          {
            key: 0,
            class: normalizeClass(["image-section flex-row", { "image-section-right": $props.newsItem.article_type === 2, "image-section-left": $props.newsItem.article_type === 1 }])
          },
          [
            $props.newsItem.image_url ? (openBlock(), createElementBlock("u-image", {
              key: 0,
              fadeShow: false,
              class: normalizeClass(["image-list1", { "image-list2": $props.newsItem.article_type === 1 || $props.newsItem.article_type === 2 }]),
              src: $props.newsItem.image_url
            }, null, 10, ["src"])) : createCommentVNode("v-if", true),
            $props.newsItem.image_list ? (openBlock(true), createElementBlock(
              Fragment,
              { key: 1 },
              renderList($props.newsItem.image_list, (source, i) => {
                return openBlock(), createElementBlock("u-image", {
                  fadeShow: false,
                  class: "image-list3",
                  src: source.url,
                  key: i
                }, null, 8, ["src"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )) : createCommentVNode("v-if", true)
          ],
          2
          /* CLASS */
        )) : createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    ),
    createElementVNode("view", { class: "media-foot flex-row" }, [
      createElementVNode("view", { class: "media-info flex-row" }, [
        createElementVNode(
          "u-text",
          { class: "info-text" },
          toDisplayString($props.newsItem.source),
          1
          /* TEXT */
        ),
        createElementVNode(
          "u-text",
          { class: "info-text" },
          toDisplayString($props.newsItem.comment_count) + "条评论",
          1
          /* TEXT */
        ),
        createElementVNode(
          "u-text",
          { class: "info-text" },
          toDisplayString($props.newsItem.datetime),
          1
          /* TEXT */
        )
      ]),
      createElementVNode("view", {
        class: "close-view",
        onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.close && $options.close(...args), ["stop"]))
      }, [
        createElementVNode("view", { class: "close-l close-h" }),
        createElementVNode("view", { class: "close-l close-v" })
      ])
    ]),
    createElementVNode("view", {
      class: "media-item-line",
      style: { "position": "absolute" }
    })
  ]);
}
const newsItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["styles", [_style_0$4]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/news-item.nvue"]]);
const _style_0$3 = { "uni-load-more": { "": { "flexDirection": "row", "height": 40, "alignItems": "center", "justifyContent": "center" } }, "uni-load-more__text": { "": { "fontSize": 15 } }, "uni-load-more__img": { "": { "width": 24, "height": 24, "marginRight": 8 } }, "uni-load-more__img--nvue": { "": { "color": "#666666" } }, "uni-load-more__img--android": { "": { "width": 24, "height": 24, "transform": "rotate(0deg)" } }, "uni-load-more__img--ios": { "": { "width": 24, "height": 24, "transform": "rotate(0deg)" } } };
const platform = uni.getSystemInfoSync().platform;
const _sfc_main$3 = {
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
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("view", {
    class: "uni-load-more",
    onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args)),
    renderWhole: true
  }, [
    $props.status === "loading" && $props.showIcon ? (openBlock(), createElementBlock(
      "loading-indicator",
      {
        key: 0,
        style: normalizeStyle({ color: $props.color }),
        animating: true,
        class: "uni-load-more__img uni-load-more__img--nvue"
      },
      null,
      4
      /* STYLE */
    )) : createCommentVNode("v-if", true),
    createElementVNode(
      "u-text",
      {
        class: "uni-load-more__text",
        style: normalizeStyle({ color: $props.color })
      },
      toDisplayString($props.status === "more" ? $props.contentText.contentdown : $props.status === "loading" ? $props.contentText.contentrefresh : $props.contentText.contentnomore),
      5
      /* TEXT, STYLE */
    )
  ]);
}
const uniLoadMore = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["styles", [_style_0$3]], ["__file", "D:/HBuilderProjects/xydianan/components/uni-load-more.vue"]]);
const _style_0$2 = { "a-i-c": { "": { "alignItems": "center" } }, "j-c-c": { "": { "justifyContent": "center" } }, "t-a-c": { "": { "textAlign": "center" } }, "nodata": { "": { "flex": 1, "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "paddingTop": 30, "paddingRight": 30, "paddingBottom": 30, "paddingLeft": 30, "backgroundColor": "#f8f8f8" } }, "nodata-content": { "": { "transform": "translateY(-50px)" } }, "text-view": { "": { "marginBottom": 40 } }, "title": { "": { "color": "#999999", "fontSize": 18 } }, "opera-view": { "": { "flexDirection": "column", "alignItems": "center", "justifyContent": "center" } }, "btn": { "": { "paddingTop": 5, "paddingRight": 10, "paddingBottom": 5, "paddingLeft": 10, "width": 128, "flexDirection": "row", "alignItems": "center", "justifyContent": "center", "textAlign": "center" } }, "btn-text": { "": { "color": "#999999", "fontSize": 15 } }, "btn-default": { "": { "borderColor": "#999999", "borderStyle": "solid", "borderWidth": 1, "borderRadius": 3 } } };
const _sfc_main$2 = {
  name: "nodata",
  data() {
    return {
      textTypes: {
        none: "暂无网络"
      },
      isConnected: false,
      networkType: "none"
    };
  },
  mounted() {
    this.isIOS = uni.getSystemInfoSync().platform === "ios";
    uni.onNetworkStatusChange((res) => {
      this.isConnected = res.isConnected;
      this.networkType = res.networkType;
    });
    uni.getNetworkType({
      success: (res) => {
        this.networkType = res.networkType;
      }
    });
  },
  methods: {
    retry() {
      this.$emit("retry");
    },
    async openSettings() {
      if (this.networkType == "none") {
        this.openSystemSettings();
        return;
      }
    },
    openAppSettings() {
      this.gotoAppSetting();
    },
    openSystemSettings() {
      if (this.isIOS) {
        this.gotoiOSSetting();
      } else {
        this.gotoAndroidSetting();
      }
    },
    network() {
      var result = null;
      var cellularData = plus.ios.newObject("CTCellularData");
      var state = cellularData.plusGetAttribute("restrictedState");
      if (state == 0) {
        result = null;
        formatAppLog("log", "at components/nodata.nvue:70", "StateUnknown");
      } else if (state == 2) {
        result = 1;
        formatAppLog("log", "at components/nodata.nvue:73", "已经开启了互联网权限:NotRestricted");
      } else if (state == 1) {
        result = 2;
        formatAppLog("log", "at components/nodata.nvue:76", "Restricted");
      }
      plus.ios.deleteObject(cellularData);
      return result;
    },
    gotoAppSetting() {
      if (this.isIOS) {
        var UIApplication = plus.ios.import("UIApplication");
        var application2 = UIApplication.sharedApplication();
        var NSURL2 = plus.ios.import("NSURL");
        var setting2 = NSURL2.URLWithString("app-settings:");
        application2.openURL(setting2);
        plus.ios.deleteObject(setting2);
        plus.ios.deleteObject(NSURL2);
        plus.ios.deleteObject(application2);
      } else {
        var Intent = plus.android.importClass("android.content.Intent");
        var Settings = plus.android.importClass("android.provider.Settings");
        var Uri = plus.android.importClass("android.net.Uri");
        var mainActivity = plus.android.runtimeMainActivity();
        var intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
        intent.setData(uri);
        mainActivity.startActivity(intent);
      }
    },
    gotoiOSSetting() {
      var UIApplication = plus.ios.import("UIApplication");
      var application2 = UIApplication.sharedApplication();
      var NSURL2 = plus.ios.import("NSURL");
      var setting2 = NSURL2.URLWithString("App-prefs:root=General");
      application2.openURL(setting2);
      plus.ios.deleteObject(setting2);
      plus.ios.deleteObject(NSURL2);
      plus.ios.deleteObject(application2);
    },
    gotoAndroidSetting() {
      var Intent = plus.android.importClass("android.content.Intent");
      var Settings = plus.android.importClass("android.provider.Settings");
      var mainActivity = plus.android.runtimeMainActivity();
      var intent = new Intent(Settings.ACTION_SETTINGS);
      mainActivity.startActivity(intent);
    }
  }
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("view", {
    class: "nodata",
    renderWhole: true
  }, [
    createElementVNode("view", { class: "nodata-content" }, [
      createElementVNode("view", { class: "text-view a-i-c j-c-c t-a-c" }, [
        createElementVNode(
          "u-text",
          { class: "title" },
          toDisplayString($data.textTypes[$data.networkType]),
          1
          /* TEXT */
        )
      ]),
      createElementVNode("view", { class: "icon-view" }),
      createElementVNode("view", { class: "opera-view" }, [
        $data.networkType != "none" ? (openBlock(), createElementBlock("view", {
          key: 0,
          class: "btn btn-default",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.retry && $options.retry(...args))
        }, [
          createElementVNode("u-text", { class: "btn-text" }, "重试")
        ])) : createCommentVNode("v-if", true),
        $data.networkType == "none" ? (openBlock(), createElementBlock("view", {
          key: 1,
          class: "btn btn-default",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.openSettings && $options.openSettings(...args))
        }, [
          createElementVNode("u-text", { class: "btn-text" }, "设置")
        ])) : createCommentVNode("v-if", true)
      ])
    ])
  ]);
}
const noData = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["styles", [_style_0$2]], ["__file", "D:/HBuilderProjects/xydianan/components/nodata.nvue"]]);
const _style_0$1 = { "no-data": { "": { "flex": 1, "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0, "zIndex": 10 } }, "page-news": { "": { "flex": 1, "flexDirection": "column", "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0 } }, "listview": { "": { "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0, "flexDirection": "column" } }, "refresh": { "": { "justifyContent": "center" } }, "refresh-view": { "": { "width": "750rpx", "height": 64, "flexDirection": "row", "flexWrap": "nowrap", "alignItems": "center", "justifyContent": "center" } }, "refresh-icon": { "": { "width": 32, "height": 32, "transitionDuration": 500, "transitionProperty": "transform", "transform": "rotate(0deg)", "transformOrigin": "15px 15px" } }, "refresh-icon-active": { "": { "transform": "rotate(180deg)" } }, "loading-icon": { "": { "width": 28, "height": 28, "marginRight": 5, "color": "#808080" } }, "loading-text": { "": { "marginLeft": 2, "fontSize": 16, "color": "#999999" } }, "loading-more": { "": { "alignItems": "center", "justifyContent": "center", "paddingTop": 14, "paddingBottom": 14, "textAlign": "center" } }, "loading-more-text": { "": { "fontSize": "28rpx", "color": "#999999" } }, "@TRANSITION": { "refresh-icon": { "duration": 500, "property": "transform" } } };
const _sfc_main$1 = {
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
      this.requestParams.time = new Date().getTime() + "";
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
      const data_list = pageData.map((caseItem, index2) => {
        const image = caseItem.image || caseImages[(startIndex + index2) % caseImages.length];
        return {
          id: this.newGuid() + (startIndex + index2),
          newsid: startIndex + index2,
          article_type: 1,
          datetime: friendlyDate(new Date(caseItem.date).getTime()),
          title: caseItem.title,
          image_url: image,
          source: caseItem.master || "专业电工",
          comment_count: Math.floor(Math.random() * 50),
          post_id: startIndex + index2,
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
        uni.$emit("updateDetail", {
          detail: encodeURIComponent(JSON.stringify(detail))
        });
      } else {
        this.navigateFlag = true;
        uni.navigateTo({
          url: "./detail?query=" + encodeURIComponent(JSON.stringify(detail)),
          success: () => {
            setTimeout(() => {
              this.navigateFlag = false;
            }, 300);
          },
          fail: (err) => {
            formatAppLog("log", "at pages/news/news-page.nvue:299", "导航失败:", err);
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
    closeItem(index2) {
      uni.showModal({
        content: "不感兴趣？",
        success: (res) => {
          if (res.confirm) {
            this.dataList.splice(index2, 1);
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
      this.$refs.list.resetLoadmore();
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
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_news_item = resolveComponent("news-item");
  const _component_no_data = resolveComponent("no-data");
  return openBlock(), createElementBlock("view", {
    class: "page-news",
    renderWhole: true
  }, [
    createElementVNode("list", { class: "listview" }, [
      createElementVNode("refresh", {
        display: $data.refreshing,
        onRefresh: _cache[0] || (_cache[0] = (...args) => $options.onrefresh && $options.onrefresh(...args)),
        onPullingdown: _cache[1] || (_cache[1] = (...args) => $options.onpullingdown && $options.onpullingdown(...args))
      }, null, 40, ["display"]),
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($data.dataList, (item, index2) => {
          return openBlock(), createElementBlock("cell", {
            key: item.id
          }, [
            createVNode(_component_news_item, {
              newsItem: item,
              onClose: ($event) => $options.closeItem(index2),
              onClick: ($event) => $options.goDetail(item)
            }, null, 8, ["newsItem", "onClose", "onClick"])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      $data.isLoading || $data.dataList.length > 4 ? (openBlock(), createElementBlock("cell", { key: 0 }, [
        createElementVNode("view", { class: "loading-more" }, [
          createElementVNode(
            "u-text",
            { class: "loading-more-text" },
            toDisplayString($data.loadingText),
            1
            /* TEXT */
          )
        ])
      ])) : createCommentVNode("v-if", true)
    ]),
    $data.isNoData ? (openBlock(), createBlock(_component_no_data, {
      key: 0,
      class: "no-data",
      onRetry: $options.loadMore
    }, null, 8, ["onRetry"])) : createCommentVNode("v-if", true)
  ]);
}
const newsPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["styles", [_style_0$1]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/news-page.nvue"]]);
const _style_0 = { "tabs": { "": { "flex": 1, "flexDirection": "column", "overflow": "hidden", "backgroundColor": "#ffffff" } }, "tab-bar": { "": { "width": "750rpx", "height": 42, "flexDirection": "row" } }, "scroll-view-indicator": { "": { "position": "relative", "height": 2, "backgroundColor": "rgba(0,0,0,0)" } }, "scroll-view-underline": { "": { "position": "absolute", "top": 0, "bottom": 0, "width": 0, "backgroundColor": "#007AFF" } }, "scroll-view-animation": { "": { "transitionDuration": 200, "transitionProperty": "left" } }, "tab-bar-line": { "": { "height": 1, "backgroundColor": "#cccccc" } }, "tab-box": { "": { "flex": 1 } }, "uni-tab-item": { "": { "flexWrap": "nowrap", "paddingLeft": 20, "paddingRight": 20 } }, "uni-tab-item-title": { "": { "color": "#555555", "fontSize": 15, "height": 40, "lineHeight": 40, "flexWrap": "nowrap" } }, "uni-tab-item-title-active": { "": { "color": "#007AFF" } }, "swiper-item": { "": { "flex": 1, "flexDirection": "column" } }, "page-item": { "": { "flex": 1, "flexDirection": "row", "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0 } }, "@TRANSITION": { "scroll-view-animation": { "duration": 200, "property": "left" } } };
const dom = weex.requireModule("dom");
const MAX_CACHE_DATA = 100;
const MAX_CACHE_PAGE = 3;
const TAB_PRELOAD_OFFSET = 1;
const _sfc_main = {
  components: {
    newsPage
  },
  data() {
    return {
      tabList: [{
        id: "tab01",
        name: "生活用电",
        newsid: 0
      }, {
        id: "tab02",
        name: "电路维修",
        newsid: 23
      }, {
        id: "tab03",
        name: "电器维护",
        newsid: 223
      }, {
        id: "tab04",
        name: "用电改造",
        newsid: 221
      }, {
        id: "tab05",
        name: "故障排除",
        newsid: 225
      }, {
        id: "tab06",
        name: "经典案例",
        newsid: 208
      }],
      tabIndex: 0,
      cacheTab: [],
      scrollInto: "",
      navigateFlag: false,
      indicatorLineLeft: 0,
      indicatorLineWidth: 0,
      isTap: false
    };
  },
  onReady() {
    this._lastTabIndex = 0;
    this.swiperWidth = 0;
    this.tabbarWidth = 0;
    this.tabListSize = {};
    this._touchTabIndex = 0;
    this.pageList = [];
    for (var i = 0; i < this.tabList.length; i++) {
      let item = this.$refs["page" + i];
      if (Array.isArray(item)) {
        this.pageList.push(item[0]);
      } else {
        this.pageList.push(item);
      }
    }
    this.switchTab(this.tabIndex);
    this.selectorQuery();
  },
  methods: {
    ontabtap(e) {
      let index2 = e.target.dataset.current || e.currentTarget.dataset.current;
      this.isTap = true;
      var currentSize = this.tabListSize[index2];
      this.updateIndicator(currentSize.left, currentSize.width);
      this._touchTabIndex = index2;
      this.switchTab(index2);
    },
    onswiperchange(e) {
    },
    onswiperscroll(e) {
      if (this.isTap) {
        return;
      }
      var offsetX = e.detail.dx;
      var preloadIndex = this._lastTabIndex;
      if (offsetX > TAB_PRELOAD_OFFSET) {
        preloadIndex++;
      } else if (offsetX < -TAB_PRELOAD_OFFSET) {
        preloadIndex--;
      }
      if (preloadIndex === this._lastTabIndex || preloadIndex < 0 || preloadIndex > this.pageList.length - 1) {
        return;
      }
      if (this.pageList[preloadIndex].dataList.length === 0) {
        this.loadTabData(preloadIndex);
      }
      var percentage = Math.abs(this.swiperWidth / offsetX);
      var currentSize = this.tabListSize[this._lastTabIndex];
      var preloadSize = this.tabListSize[preloadIndex];
      var lineL = currentSize.left + (preloadSize.left - currentSize.left) / percentage;
      var lineW = currentSize.width + (preloadSize.width - currentSize.width) / percentage;
      this.updateIndicator(lineL, lineW);
    },
    animationfinish(e) {
      let index2 = e.detail.current;
      if (this._touchTabIndex === index2) {
        this.isTap = false;
      }
      this._lastTabIndex = index2;
      this.switchTab(index2);
      this.updateIndicator(this.tabListSize[index2].left, this.tabListSize[index2].width);
    },
    selectorQuery() {
      dom.getComponentRect(this.$refs.tabbar1, (res) => {
        this.tabbarWidth = res.size.width;
      });
      dom.getComponentRect(this.$refs["swiper1"], (res) => {
        this.swiperWidth = res.size.width;
      });
      var queryTabSize = uni.createSelectorQuery().in(this);
      for (var i = 0; i < this.tabList.length; i++) {
        queryTabSize.select("#" + this.tabList[i].id).boundingClientRect();
      }
      queryTabSize.exec((rects) => {
        rects.forEach((rect) => {
          this.tabListSize[rect.dataset.id] = rect;
        });
        this.updateIndicator(this.tabListSize[this.tabIndex].left, this.tabListSize[this.tabIndex].width);
        this.switchTab(this.tabIndex);
      });
    },
    getElementSize(dom2, ref, id) {
      dom2.getComponentRect(ref, (res) => {
        this.tabListSize[id] = res.size;
      });
    },
    updateIndicator(left, width) {
      this.indicatorLineLeft = left;
      this.indicatorLineWidth = width;
    },
    switchTab(index2) {
      if (this.pageList[index2].dataList.length === 0) {
        this.loadTabData(index2);
      }
      if (this.tabIndex === index2) {
        return;
      }
      if (this.pageList[this.tabIndex].dataList.length > MAX_CACHE_DATA) {
        let isExist = this.cacheTab.indexOf(this.tabIndex);
        if (isExist < 0) {
          this.cacheTab.push(this.tabIndex);
        }
      }
      this.tabIndex = index2;
      this.scrollTabTo(index2);
      if (this.cacheTab.length > MAX_CACHE_PAGE) {
        let cacheIndex = this.cacheTab[0];
        this.clearTabData(cacheIndex);
        this.cacheTab.splice(0, 1);
      }
    },
    scrollTabTo(index2) {
      const el = this.$refs["tabitem" + index2][0];
      let offset = 0;
      if (index2 > 0) {
        offset = this.tabbarWidth / 2 - this.tabListSize[index2].width / 2;
        if (this.tabListSize[index2].right < this.tabbarWidth / 2) {
          offset = this.tabListSize[0].width;
        }
      }
      dom.scrollToElement(el, {
        offset: -offset
      });
    },
    loadTabData(index2) {
      this.pageList[index2].loadData();
    },
    clearTabData(index2) {
      this.pageList[index2].clear();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_newsPage = resolveComponent("newsPage");
  const _component_swiper_item = resolveComponent("swiper-item");
  const _component_swiper = resolveComponent("swiper");
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("view", { class: "tabs" }, [
      createElementVNode("scroll-view", {
        ref: "tabbar1",
        id: "tab-bar",
        class: "tab-bar",
        scroll: false,
        scrollX: true,
        showScrollbar: false,
        scrollIntoView: $data.scrollInto
      }, [
        createElementVNode("view", { style: { "flex-direction": "column" } }, [
          createElementVNode("view", { style: { "flex-direction": "row" } }, [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($data.tabList, (tab, index2) => {
                return openBlock(), createElementBlock("view", {
                  class: "uni-tab-item",
                  key: tab.id,
                  id: tab.id,
                  ref_for: true,
                  ref: "tabitem" + index2,
                  "data-id": index2,
                  "data-current": index2,
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.ontabtap && $options.ontabtap(...args))
                }, [
                  createElementVNode(
                    "u-text",
                    {
                      class: normalizeClass(["uni-tab-item-title", $data.tabIndex == index2 ? "uni-tab-item-title-active" : ""])
                    },
                    toDisplayString(tab.name),
                    3
                    /* TEXT, CLASS */
                  )
                ], 8, ["id", "data-id", "data-current"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          createElementVNode("view", { class: "scroll-view-indicator" }, [
            createElementVNode(
              "view",
              {
                ref: "underline",
                class: normalizeClass(["scroll-view-underline", $data.isTap ? "scroll-view-animation" : ""]),
                style: normalizeStyle({ left: $data.indicatorLineLeft + "px", width: $data.indicatorLineWidth + "px" })
              },
              null,
              6
              /* CLASS, STYLE */
            )
          ])
        ])
      ], 8, ["scrollIntoView"]),
      createElementVNode("view", { class: "tab-bar-line" }),
      createVNode(_component_swiper, {
        class: "tab-box",
        ref: "swiper1",
        current: $data.tabIndex,
        duration: 300,
        onChange: $options.onswiperchange,
        onTransition: $options.onswiperscroll,
        onAnimationfinish: $options.animationfinish,
        onOnAnimationEnd: $options.animationfinish
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($data.tabList, (page, index2) => {
              return openBlock(), createBlock(
                _component_swiper_item,
                {
                  class: "swiper-item",
                  key: index2
                },
                {
                  default: withCtx(() => [
                    createVNode(_component_newsPage, {
                      class: "page-item",
                      nid: page.newsid,
                      ref_for: true,
                      ref: "page" + index2
                    }, null, 8, ["nid"])
                  ]),
                  _: 2
                  /* DYNAMIC */
                },
                1024
                /* DYNAMIC_SLOTS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _: 1
        /* STABLE */
      }, 8, ["current", "onChange", "onTransition", "onAnimationfinish", "onOnAnimationEnd"])
    ])
  ]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/index.nvue"]]);
export {
  index as default
};
