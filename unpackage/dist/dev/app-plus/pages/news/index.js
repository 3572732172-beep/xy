"use weex:vue";

if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor
    return this.then(
      value => promise.resolve(callback()).then(() => value),
      reason => promise.resolve(callback()).then(() => {
        throw reason
      })
    )
  }
};

if (typeof uni !== 'undefined' && uni && uni.requireGlobal) {
  const global = uni.requireGlobal()
  ArrayBuffer = global.ArrayBuffer
  Int8Array = global.Int8Array
  Uint8Array = global.Uint8Array
  Uint8ClampedArray = global.Uint8ClampedArray
  Int16Array = global.Int16Array
  Uint16Array = global.Uint16Array
  Int32Array = global.Int32Array
  Uint32Array = global.Uint32Array
  Float32Array = global.Float32Array
  Float64Array = global.Float64Array
  BigInt64Array = global.BigInt64Array
  BigUint64Array = global.BigUint64Array
};


(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // vue-ns:vue
  var require_vue = __commonJS({
    "vue-ns:vue"(exports, module) {
      module.exports = Vue;
    }
  });

  // ../../../../HBuilderProjects/xydianan/unpackage/dist/dev/.nvue/_plugin-vue_export-helper.js
  var import_vue = __toESM(require_vue());
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };

  // ../../../../HBuilderProjects/xydianan/unpackage/dist/dev/.nvue/pages/news/index.js
  var import_vue2 = __toESM(require_vue());
  function friendlyDate(timestamp) {
    var formats = {
      "year": "%n% \u5E74\u524D",
      "month": "%n% \u6708\u524D",
      "day": "%n% \u5929\u524D",
      "hour": "%n% \u5C0F\u65F6\u524D",
      "minute": "%n% \u5206\u949F\u524D",
      "second": "%n% \u79D2\u524D"
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
  var _style_0$4 = { "view": { "": { "flexDirection": "column" } }, "flex-row": { "": { "flexDirection": "row" } }, "flex-col": { "": { "flexDirection": "column" } }, "list-cell": { "": { "paddingTop": 0, "paddingRight": 15, "paddingBottom": 0, "paddingLeft": 15 } }, "uni-list-cell-hover": { "": { "backgroundColor": "#eeeeee" } }, "media-item": { "": { "position": "relative", "flex": 1, "flexDirection": "column", "paddingTop": 10, "paddingRight": 15, "paddingBottom": 10, "paddingLeft": 15 } }, "media-item-line": { "": { "position": "absolute", "left": 15, "right": 15, "bottom": 0, "height": 1, "backgroundColor": "#ebebeb" } }, "media-image-right": { "": { "flexDirection": "row" } }, "media-image-left": { "": { "flexDirection": "row-reverse" } }, "media-title": { "": { "flex": 1, "lines": 3, "textOverflow": "ellipsis", "fontSize": 15, "color": "#555555" } }, "media-title2": { "": { "flex": 1, "marginTop": 3, "lineHeight": 20 } }, "image-section": { "": { "marginTop": 10, "flexDirection": "row", "justifyContent": "space-between" } }, "image-section-right": { "": { "marginTop": 0, "marginLeft": 5, "width": 112, "height": 73 } }, "image-section-left": { "": { "marginTop": 0, "marginRight": 5, "width": 112, "height": 73 } }, "image-list1": { "": { "height": 240 } }, "image-list2": { "": { "width": 112, "height": 73 } }, "image-list3": { "": { "width": 112, "height": 73 } }, "media-info": { "": { "flexDirection": "row", "alignItems": "center" } }, "info-text": { "": { "marginRight": 10, "color": "#999999", "fontSize": 12 } }, "media-foot": { "": { "marginTop": 12, "flexDirection": "row", "alignItems": "center", "justifyContent": "space-between" } }, "close-view": { "": { "position": "relative", "alignItems": "center", "flexDirection": "row", "width": 20, "height": 15, "lineHeight": 15, "borderWidth": "1rpx", "borderStyle": "solid", "borderColor": "#aaaaaa", "borderRadius": 4, "justifyContent": "center", "textAlign": "center" } }, "close-l": { "": { "position": "absolute", "width": 9, "height": 1, "backgroundColor": "#aaaaaa" } }, "close-h": { "": { "transform": "rotate(45deg)" } }, "close-v": { "": { "transform": "rotate(-45deg)" } } };
  var _sfc_main$4 = {
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
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
      class: "media-item view",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.click && $options.click(...args)),
      renderWhole: true
    }, [
      (0, import_vue2.createElementVNode)(
        "view",
        {
          class: "view",
          style: (0, import_vue2.normalizeStyle)({ flexDirection: $props.newsItem.article_type === 1 || $props.newsItem.article_type === 2 ? $props.newsItem.article_type === 2 ? "row" : "row-reverse" : "column" })
        },
        [
          (0, import_vue2.createElementVNode)(
            "u-text",
            {
              class: (0, import_vue2.normalizeClass)(["media-title", { "media-title2": $props.newsItem.article_type === 1 || $props.newsItem.article_type === 2 }])
            },
            (0, import_vue2.toDisplayString)($props.newsItem.title),
            3
            /* TEXT, CLASS */
          ),
          $props.newsItem.image_list || $props.newsItem.image_url ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)(
            "view",
            {
              key: 0,
              class: (0, import_vue2.normalizeClass)(["image-section flex-row", { "image-section-right": $props.newsItem.article_type === 2, "image-section-left": $props.newsItem.article_type === 1 }])
            },
            [
              $props.newsItem.image_url ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("u-image", {
                key: 0,
                fadeShow: false,
                class: (0, import_vue2.normalizeClass)(["image-list1", { "image-list2": $props.newsItem.article_type === 1 || $props.newsItem.article_type === 2 }]),
                src: $props.newsItem.image_url
              }, null, 10, ["src"])) : (0, import_vue2.createCommentVNode)("v-if", true),
              $props.newsItem.image_list ? ((0, import_vue2.openBlock)(true), (0, import_vue2.createElementBlock)(
                import_vue2.Fragment,
                { key: 1 },
                (0, import_vue2.renderList)($props.newsItem.image_list, (source, i) => {
                  return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("u-image", {
                    fadeShow: false,
                    class: "image-list3",
                    src: source.url,
                    key: i
                  }, null, 8, ["src"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )) : (0, import_vue2.createCommentVNode)("v-if", true)
            ],
            2
            /* CLASS */
          )) : (0, import_vue2.createCommentVNode)("v-if", true)
        ],
        4
        /* STYLE */
      ),
      (0, import_vue2.createElementVNode)("view", { class: "media-foot flex-row" }, [
        (0, import_vue2.createElementVNode)("view", { class: "media-info flex-row" }, [
          (0, import_vue2.createElementVNode)(
            "u-text",
            { class: "info-text" },
            (0, import_vue2.toDisplayString)($props.newsItem.source),
            1
            /* TEXT */
          ),
          (0, import_vue2.createElementVNode)(
            "u-text",
            { class: "info-text" },
            (0, import_vue2.toDisplayString)($props.newsItem.comment_count) + "\u6761\u8BC4\u8BBA",
            1
            /* TEXT */
          ),
          (0, import_vue2.createElementVNode)(
            "u-text",
            { class: "info-text" },
            (0, import_vue2.toDisplayString)($props.newsItem.datetime),
            1
            /* TEXT */
          )
        ]),
        (0, import_vue2.createElementVNode)("view", {
          class: "close-view",
          onClick: _cache[0] || (_cache[0] = (0, import_vue2.withModifiers)((...args) => $options.close && $options.close(...args), ["stop"]))
        }, [
          (0, import_vue2.createElementVNode)("view", { class: "close-l close-h" }),
          (0, import_vue2.createElementVNode)("view", { class: "close-l close-v" })
        ])
      ]),
      (0, import_vue2.createElementVNode)("view", {
        class: "media-item-line",
        style: { "position": "absolute" }
      })
    ]);
  }
  var newsItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["styles", [_style_0$4]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/news-item.nvue"]]);
  var _style_0$3 = { "uni-load-more": { "": { "flexDirection": "row", "height": 40, "alignItems": "center", "justifyContent": "center" } }, "uni-load-more__text": { "": { "fontSize": 15 } }, "uni-load-more__img": { "": { "width": 24, "height": 24, "marginRight": 8 } }, "uni-load-more__img--nvue": { "": { "color": "#666666" } }, "uni-load-more__img--android": { "": { "width": 24, "height": 24, "transform": "rotate(0deg)" } }, "uni-load-more__img--ios": { "": { "width": 24, "height": 24, "transform": "rotate(0deg)" } } };
  var platform = uni.getSystemInfoSync().platform;
  var _sfc_main$3 = {
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
            contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
            contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
            contentnomore: "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
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
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args)),
      renderWhole: true
    }, [
      $props.status === "loading" && $props.showIcon ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)(
        "loading-indicator",
        {
          key: 0,
          style: (0, import_vue2.normalizeStyle)({ color: $props.color }),
          animating: true,
          class: "uni-load-more__img uni-load-more__img--nvue"
        },
        null,
        4
        /* STYLE */
      )) : (0, import_vue2.createCommentVNode)("v-if", true),
      (0, import_vue2.createElementVNode)(
        "u-text",
        {
          class: "uni-load-more__text",
          style: (0, import_vue2.normalizeStyle)({ color: $props.color })
        },
        (0, import_vue2.toDisplayString)($props.status === "more" ? $props.contentText.contentdown : $props.status === "loading" ? $props.contentText.contentrefresh : $props.contentText.contentnomore),
        5
        /* TEXT, STYLE */
      )
    ]);
  }
  var uniLoadMore = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["styles", [_style_0$3]], ["__file", "D:/HBuilderProjects/xydianan/components/uni-load-more.vue"]]);
  var _style_0$2 = { "a-i-c": { "": { "alignItems": "center" } }, "j-c-c": { "": { "justifyContent": "center" } }, "t-a-c": { "": { "textAlign": "center" } }, "nodata": { "": { "flex": 1, "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "paddingTop": 30, "paddingRight": 30, "paddingBottom": 30, "paddingLeft": 30, "backgroundColor": "#f8f8f8" } }, "nodata-content": { "": { "transform": "translateY(-50px)" } }, "text-view": { "": { "marginBottom": 40 } }, "title": { "": { "color": "#999999", "fontSize": 18 } }, "opera-view": { "": { "flexDirection": "column", "alignItems": "center", "justifyContent": "center" } }, "btn": { "": { "paddingTop": 5, "paddingRight": 10, "paddingBottom": 5, "paddingLeft": 10, "width": 128, "flexDirection": "row", "alignItems": "center", "justifyContent": "center", "textAlign": "center" } }, "btn-text": { "": { "color": "#999999", "fontSize": 15 } }, "btn-default": { "": { "borderColor": "#999999", "borderStyle": "solid", "borderWidth": 1, "borderRadius": 3 } } };
  var _sfc_main$2 = {
    name: "nodata",
    data() {
      return {
        textTypes: {
          none: "\u6682\u65E0\u7F51\u7EDC"
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
      openSettings() {
        return __async(this, null, function* () {
          if (this.networkType == "none") {
            this.openSystemSettings();
            return;
          }
        });
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
          formatAppLog("log", "at components/nodata.nvue:73", "\u5DF2\u7ECF\u5F00\u542F\u4E86\u4E92\u8054\u7F51\u6743\u9650:NotRestricted");
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
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
      class: "nodata",
      renderWhole: true
    }, [
      (0, import_vue2.createElementVNode)("view", { class: "nodata-content" }, [
        (0, import_vue2.createElementVNode)("view", { class: "text-view a-i-c j-c-c t-a-c" }, [
          (0, import_vue2.createElementVNode)(
            "u-text",
            { class: "title" },
            (0, import_vue2.toDisplayString)($data.textTypes[$data.networkType]),
            1
            /* TEXT */
          )
        ]),
        (0, import_vue2.createElementVNode)("view", { class: "icon-view" }),
        (0, import_vue2.createElementVNode)("view", { class: "opera-view" }, [
          $data.networkType != "none" ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
            key: 0,
            class: "btn btn-default",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.retry && $options.retry(...args))
          }, [
            (0, import_vue2.createElementVNode)("u-text", { class: "btn-text" }, "\u91CD\u8BD5")
          ])) : (0, import_vue2.createCommentVNode)("v-if", true),
          $data.networkType == "none" ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
            key: 1,
            class: "btn btn-default",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.openSettings && $options.openSettings(...args))
          }, [
            (0, import_vue2.createElementVNode)("u-text", { class: "btn-text" }, "\u8BBE\u7F6E")
          ])) : (0, import_vue2.createCommentVNode)("v-if", true)
        ])
      ])
    ]);
  }
  var noData = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["styles", [_style_0$2]], ["__file", "D:/HBuilderProjects/xydianan/components/nodata.nvue"]]);
  var _style_0$1 = { "no-data": { "": { "flex": 1, "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0, "zIndex": 10 } }, "page-news": { "": { "flex": 1, "flexDirection": "column", "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0 } }, "listview": { "": { "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0, "flexDirection": "column" } }, "refresh": { "": { "justifyContent": "center" } }, "refresh-view": { "": { "width": "750rpx", "height": 64, "flexDirection": "row", "flexWrap": "nowrap", "alignItems": "center", "justifyContent": "center" } }, "refresh-icon": { "": { "width": 32, "height": 32, "transitionDuration": 500, "transitionProperty": "transform", "transform": "rotate(0deg)", "transformOrigin": "15px 15px" } }, "refresh-icon-active": { "": { "transform": "rotate(180deg)" } }, "loading-icon": { "": { "width": 28, "height": 28, "marginRight": 5, "color": "#808080" } }, "loading-text": { "": { "marginLeft": 2, "fontSize": 16, "color": "#999999" } }, "loading-more": { "": { "alignItems": "center", "justifyContent": "center", "paddingTop": 14, "paddingBottom": 14, "textAlign": "center" } }, "loading-more-text": { "": { "fontSize": "28rpx", "color": "#999999" } }, "@TRANSITION": { "refresh-icon": { "duration": 500, "property": "transform" } } };
  var _sfc_main$1 = {
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
        loadingText: "\u52A0\u8F7D\u4E2D...",
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
            source: caseItem.master || "\u4E13\u4E1A\u7535\u5DE5",
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
            this.refreshText = "\u5DF2\u5237\u65B0";
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
              title: "\u5BB6\u5EAD\u7535\u8DEF\u6539\u9020\u6210\u529F\u6848\u4F8B\uFF1A\u8001\u623F\u7535\u8DEF\u5168\u9762\u5347\u7EA7",
              master: "\u5F20\u5E08\u5085",
              date: "2024-01-15",
              image: "",
              content: "<p>\u5BA2\u6237\u738B\u5148\u751F\u7684\u8001\u623F\u5B50\u5EFA\u4E8E1990\u5E74\u4EE3\uFF0C\u7535\u8DEF\u8001\u5316\u4E25\u91CD\uFF0C\u7ECF\u5E38\u51FA\u73B0\u8DF3\u95F8\u3001\u7535\u538B\u4E0D\u7A33\u7B49\u95EE\u9898\u3002\u7ECF\u8FC7\u5F20\u5E08\u5085\u7684\u4E13\u4E1A\u68C0\u6D4B\uFF0C\u53D1\u73B0\u4E3B\u8981\u95EE\u9898\u5305\u62EC\uFF1A</p><p>1. \u539F\u6709\u7535\u8DEF\u5BB9\u91CF\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u6EE1\u8DB3\u73B0\u4EE3\u5BB6\u7535\u9700\u6C42</p><p>2. \u7535\u7EBF\u8001\u5316\uFF0C\u7EDD\u7F18\u5C42\u7834\u635F</p><p>3. \u914D\u7535\u7BB1\u914D\u7F6E\u4E0D\u5408\u7406\uFF0C\u7F3A\u5C11\u6F0F\u7535\u4FDD\u62A4</p><p><strong>\u6539\u9020\u65B9\u6848\uFF1A</strong></p><p>\u2022 \u66F4\u6362\u5168\u90E8\u5BA4\u5185\u7535\u7EBF\uFF0C\u4F7F\u7528\u56FD\u68072.5mm\xB2\u548C4mm\xB2\u94DC\u7EBF</p><p>\u2022 \u5347\u7EA7\u914D\u7535\u7BB1\uFF0C\u589E\u52A0\u6F0F\u7535\u4FDD\u62A4\u5668\u548C\u7A7A\u6C14\u5F00\u5173</p><p>\u2022 \u91CD\u65B0\u89C4\u5212\u7535\u8DEF\u5E03\u5C40\uFF0C\u53A8\u623F\u3001\u536B\u751F\u95F4\u5355\u72EC\u56DE\u8DEF</p><p>\u2022 \u589E\u52A0\u63D2\u5EA7\u6570\u91CF\uFF0C\u6EE1\u8DB3\u73B0\u4EE3\u751F\u6D3B\u9700\u6C42</p><p><strong>\u6539\u9020\u6548\u679C\uFF1A</strong></p><p>\u6539\u9020\u540E\uFF0C\u7535\u8DEF\u8FD0\u884C\u7A33\u5B9A\uFF0C\u672A\u518D\u51FA\u73B0\u8DF3\u95F8\u73B0\u8C61\u3002\u5BA2\u6237\u5BF9\u6539\u9020\u6548\u679C\u975E\u5E38\u6EE1\u610F\uFF0C\u79F0\u8D5E\u5F20\u5E08\u5085\u4E13\u4E1A\u7EC6\u81F4\uFF0C\u65BD\u5DE5\u89C4\u8303\u3002</p>"
            },
            {
              title: "\u519C\u6751\u81EA\u5EFA\u623F\u7528\u7535\u89C4\u5212\u6848\u4F8B\uFF1A\u5B89\u5168\u7528\u7535\u4ECE\u8BBE\u8BA1\u5F00\u59CB",
              master: "\u674E\u5E08\u5085",
              date: "2024-01-10",
              image: "",
              content: "<p>\u5BA2\u6237\u65B0\u5EFA\u81EA\u5EFA\u623F\uFF0C\u5E0C\u671B\u5728\u5EFA\u8BBE\u521D\u671F\u5C31\u505A\u597D\u7528\u7535\u89C4\u5212\u3002\u674E\u5E08\u5085\u4ECE\u8BBE\u8BA1\u9636\u6BB5\u4ECB\u5165\uFF0C\u4E3A\u5BA2\u6237\u5236\u5B9A\u4E86\u5B8C\u6574\u7684\u7528\u7535\u65B9\u6848\u3002</p><p><strong>\u89C4\u5212\u8981\u70B9\uFF1A</strong></p><p>1. \u6839\u636E\u623F\u5C4B\u9762\u79EF\u548C\u529F\u80FD\u533A\u57DF\uFF0C\u5408\u7406\u5206\u914D\u7528\u7535\u8D1F\u8377</p><p>2. \u9884\u7559\u5145\u8DB3\u7684\u63D2\u5EA7\u548C\u5F00\u5173\u4F4D\u7F6E</p><p>3. \u8BBE\u8BA1\u72EC\u7ACB\u7684\u53A8\u623F\u3001\u536B\u751F\u95F4\u7535\u8DEF\u56DE\u8DEF</p><p>4. \u8003\u8651\u672A\u6765\u667A\u80FD\u5BB6\u5C45\u8BBE\u5907\u7684\u7528\u7535\u9700\u6C42</p><p><strong>\u5B9E\u65BD\u6548\u679C\uFF1A</strong></p><p>\u623F\u5C4B\u5EFA\u6210\u540E\uFF0C\u7528\u7535\u5E03\u5C40\u5408\u7406\uFF0C\u5B89\u5168\u53EF\u9760\uFF0C\u5BA2\u6237\u5BF9\u89C4\u5212\u65B9\u6848\u975E\u5E38\u6EE1\u610F\u3002</p>"
            },
            { title: "\u5BB6\u5EAD\u7528\u7535\u589E\u5BB9\u6848\u4F8B\uFF1A\u6EE1\u8DB3\u73B0\u4EE3\u5316\u751F\u6D3B\u9700\u6C42", master: "\u738B\u5E08\u5085", date: "2024-01-05", image: "" },
            { title: "\u667A\u80FD\u5BB6\u5C45\u7535\u8DEF\u6539\u9020\u6848\u4F8B\uFF1A\u8BA9\u751F\u6D3B\u66F4\u4FBF\u6377", master: "\u5218\u5E08\u5085", date: "2023-12-28", image: "" },
            { title: "\u8001\u65E7\u5C0F\u533A\u7535\u8DEF\u5347\u7EA7\u6848\u4F8B\uFF1A\u63D0\u5347\u7528\u7535\u5B89\u5168\u6027", master: "\u9648\u5E08\u5085", date: "2023-12-20", image: "" },
            { title: "\u519C\u6751\u5BB6\u5EAD\u7528\u7535\u6807\u51C6\u5316\u6539\u9020\u6848\u4F8B", master: "\u5F20\u5E08\u5085", date: "2023-12-15", image: "" },
            { title: "\u5BB6\u5EAD\u7528\u7535\u8D1F\u8377\u8BA1\u7B97\u4E0E\u6539\u9020\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2023-12-10", image: "" },
            { title: "\u751F\u6D3B\u7528\u7535\u5B89\u5168\u9632\u62A4\u6848\u4F8B\uFF1A\u6F0F\u7535\u4FDD\u62A4\u5668\u5B89\u88C5", master: "\u738B\u5E08\u5085", date: "2023-12-05", image: "" },
            { title: "\u5BB6\u5EAD\u914D\u7535\u7BB1\u5347\u7EA7\u6539\u9020\u6848\u4F8B", master: "\u5218\u5E08\u5085", date: "2023-11-28", image: "" },
            { title: "\u519C\u6751\u5BB6\u5EAD\u7528\u7535\u6807\u51C6\u5316\u5EFA\u8BBE\u6848\u4F8B", master: "\u9648\u5E08\u5085", date: "2023-11-20", image: "" },
            { title: "\u5BB6\u5EAD\u7528\u7535\u7EBF\u8DEF\u4F18\u5316\u6848\u4F8B\uFF1A\u51CF\u5C11\u7EBF\u635F", master: "\u5F20\u5E08\u5085", date: "2023-11-15", image: "" },
            { title: "\u751F\u6D3B\u7528\u7535\u8282\u80FD\u6539\u9020\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2023-11-10", image: "" }
          ],
          // 电路维修 (23)
          23: [
            { title: "\u7535\u8DEF\u77ED\u8DEF\u6545\u969C\u6392\u9664\u6848\u4F8B\uFF1A\u5FEB\u901F\u5B9A\u4F4D\u95EE\u9898", master: "\u5F20\u5E08\u5085", date: "2024-01-12", image: "" },
            { title: "\u5BB6\u5EAD\u7535\u8DEF\u8DF3\u95F8\u95EE\u9898\u89E3\u51B3\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2024-01-08", image: "" },
            { title: "\u7535\u8DEF\u63A5\u89E6\u4E0D\u826F\u7EF4\u4FEE\u6848\u4F8B\uFF1A\u5F7B\u5E95\u89E3\u51B3\u9690\u60A3", master: "\u738B\u5E08\u5085", date: "2024-01-03", image: "" },
            { title: "\u8001\u65E7\u7EBF\u8DEF\u7EF4\u4FEE\u6848\u4F8B\uFF1A\u5EF6\u957F\u4F7F\u7528\u5BFF\u547D", master: "\u5218\u5E08\u5085", date: "2023-12-25", image: "" },
            { title: "\u7535\u8DEF\u8FC7\u8F7D\u95EE\u9898\u7EF4\u4FEE\u6848\u4F8B", master: "\u9648\u5E08\u5085", date: "2023-12-18", image: "" },
            { title: "\u7535\u8DEF\u6F0F\u7535\u6545\u969C\u6392\u67E5\u4E0E\u7EF4\u4FEE\u6848\u4F8B", master: "\u5F20\u5E08\u5085", date: "2023-12-12", image: "" },
            { title: "\u7535\u8DEF\u63A5\u5730\u6545\u969C\u7EF4\u4FEE\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2023-12-08", image: "" },
            { title: "\u7535\u8DEF\u65AD\u7EBF\u6545\u969C\u5FEB\u901F\u4FEE\u590D\u6848\u4F8B", master: "\u738B\u5E08\u5085", date: "2023-12-03", image: "" },
            { title: "\u7535\u8DEF\u8001\u5316\u7EF4\u4FEE\u6848\u4F8B\uFF1A\u5168\u9762\u68C0\u67E5\u4E0E\u66F4\u6362", master: "\u5218\u5E08\u5085", date: "2023-11-25", image: "" },
            { title: "\u7535\u8DEF\u7EF4\u4FEE\u5B89\u5168\u64CD\u4F5C\u6848\u4F8B", master: "\u9648\u5E08\u5085", date: "2023-11-18", image: "" }
          ],
          // 电器维护 (223)
          223: [
            { title: "\u7A7A\u8C03\u7535\u8DEF\u7EF4\u62A4\u6848\u4F8B\uFF1A\u5EF6\u957F\u4F7F\u7528\u5BFF\u547D", master: "\u5F20\u5E08\u5085", date: "2024-01-14", image: "" },
            { title: "\u51B0\u7BB1\u7535\u8DEF\u6545\u969C\u7EF4\u4FEE\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2024-01-09", image: "" },
            { title: "\u6D17\u8863\u673A\u7535\u8DEF\u7EF4\u62A4\u6848\u4F8B\uFF1A\u5B9A\u671F\u4FDD\u517B\u5F88\u91CD\u8981", master: "\u738B\u5E08\u5085", date: "2024-01-04", image: "" },
            { title: "\u70ED\u6C34\u5668\u7535\u8DEF\u7EF4\u62A4\u6848\u4F8B\uFF1A\u5B89\u5168\u7B2C\u4E00", master: "\u5218\u5E08\u5085", date: "2023-12-27", image: "" },
            { title: "\u7535\u89C6\u7535\u8DEF\u6545\u969C\u7EF4\u4FEE\u6848\u4F8B", master: "\u9648\u5E08\u5085", date: "2023-12-22", image: "" },
            { title: "\u7535\u996D\u7172\u7535\u8DEF\u7EF4\u62A4\u6848\u4F8B", master: "\u5F20\u5E08\u5085", date: "2023-12-17", image: "" },
            { title: "\u7535\u78C1\u7089\u7535\u8DEF\u6545\u969C\u6392\u67E5\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2023-12-13", image: "" },
            { title: "\u7535\u98CE\u6247\u7535\u8DEF\u7EF4\u62A4\u6848\u4F8B", master: "\u738B\u5E08\u5085", date: "2023-12-07", image: "" },
            { title: "\u62BD\u6CB9\u70DF\u673A\u7535\u8DEF\u7EF4\u62A4\u6848\u4F8B", master: "\u5218\u5E08\u5085", date: "2023-11-30", image: "" },
            { title: "\u5BB6\u7528\u7535\u5668\u7535\u8DEF\u7EFC\u5408\u7EF4\u62A4\u6848\u4F8B", master: "\u9648\u5E08\u5085", date: "2023-11-22", image: "" }
          ],
          // 用电改造 (221)
          221: [
            { title: "\u519C\u6751\u7528\u7535\u6539\u9020\u6848\u4F8B\uFF1A\u63D0\u5347\u4F9B\u7535\u8D28\u91CF", master: "\u5F20\u5E08\u5085", date: "2024-01-13", image: "" },
            { title: "\u8001\u65E7\u623F\u5C4B\u7528\u7535\u6539\u9020\u6848\u4F8B\uFF1A\u5168\u9762\u5347\u7EA7", master: "\u674E\u5E08\u5085", date: "2024-01-07", image: "" },
            { title: "\u5546\u4E1A\u7528\u7535\u6539\u9020\u6848\u4F8B\uFF1A\u6EE1\u8DB3\u7ECF\u8425\u9700\u6C42", master: "\u738B\u5E08\u5085", date: "2024-01-02", image: "" },
            { title: "\u5DE5\u5382\u7528\u7535\u6539\u9020\u6848\u4F8B\uFF1A\u63D0\u9AD8\u751F\u4EA7\u6548\u7387", master: "\u5218\u5E08\u5085", date: "2023-12-26", image: "" },
            { title: "\u519C\u4E1A\u7528\u7535\u6539\u9020\u6848\u4F8B\uFF1A\u652F\u6301\u73B0\u4EE3\u5316\u519C\u4E1A", master: "\u9648\u5E08\u5085", date: "2023-12-19", image: "" },
            { title: "\u7528\u7535\u6539\u9020\u89C4\u5212\u6848\u4F8B\uFF1A\u79D1\u5B66\u8BBE\u8BA1", master: "\u5F20\u5E08\u5085", date: "2023-12-14", image: "" },
            { title: "\u7528\u7535\u6539\u9020\u65BD\u5DE5\u6848\u4F8B\uFF1A\u89C4\u8303\u64CD\u4F5C", master: "\u674E\u5E08\u5085", date: "2023-12-09", image: "" },
            { title: "\u7528\u7535\u6539\u9020\u9A8C\u6536\u6848\u4F8B\uFF1A\u786E\u4FDD\u8D28\u91CF", master: "\u738B\u5E08\u5085", date: "2023-12-04", image: "" },
            { title: "\u7528\u7535\u6539\u9020\u6210\u672C\u63A7\u5236\u6848\u4F8B", master: "\u5218\u5E08\u5085", date: "2023-11-27", image: "" },
            { title: "\u7528\u7535\u6539\u9020\u5B89\u5168\u6848\u4F8B\uFF1A\u9884\u9632\u4E8B\u6545", master: "\u9648\u5E08\u5085", date: "2023-11-21", image: "" }
          ],
          // 故障排除 (225)
          225: [
            { title: "\u7535\u8DEF\u6545\u969C\u5FEB\u901F\u8BCA\u65AD\u6848\u4F8B\uFF1A\u7ECF\u9A8C\u5206\u4EAB", master: "\u5F20\u5E08\u5085", date: "2024-01-11", image: "" },
            { title: "\u7528\u7535\u6545\u969C\u6392\u67E5\u6280\u5DE7\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2024-01-06", image: "" },
            { title: "\u590D\u6742\u7535\u8DEF\u6545\u969C\u6392\u9664\u6848\u4F8B", master: "\u738B\u5E08\u5085", date: "2024-01-01", image: "" },
            { title: "\u7D27\u6025\u6545\u969C\u6392\u9664\u6848\u4F8B\uFF1A\u5FEB\u901F\u54CD\u5E94", master: "\u5218\u5E08\u5085", date: "2023-12-24", image: "" },
            { title: "\u7535\u8DEF\u6545\u969C\u9884\u9632\u6848\u4F8B\uFF1A\u5B9A\u671F\u68C0\u67E5", master: "\u9648\u5E08\u5085", date: "2023-12-16", image: "" },
            { title: "\u7528\u7535\u6545\u969C\u8BCA\u65AD\u5DE5\u5177\u4F7F\u7528\u6848\u4F8B", master: "\u5F20\u5E08\u5085", date: "2023-12-11", image: "" },
            { title: "\u6545\u969C\u6392\u9664\u5B89\u5168\u64CD\u4F5C\u6848\u4F8B", master: "\u674E\u5E08\u5085", date: "2023-12-06", image: "" },
            { title: "\u5E38\u89C1\u6545\u969C\u6392\u9664\u6848\u4F8B\u96C6\u9526", master: "\u738B\u5E08\u5085", date: "2023-11-29", image: "" },
            { title: "\u6545\u969C\u6392\u9664\u7ECF\u9A8C\u603B\u7ED3\u6848\u4F8B", master: "\u5218\u5E08\u5085", date: "2023-11-23", image: "" },
            { title: "\u6545\u969C\u6392\u9664\u6700\u4F73\u5B9E\u8DF5\u6848\u4F8B", master: "\u9648\u5E08\u5085", date: "2023-11-17", image: "" }
          ],
          // 经典案例 (208)
          208: [
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u519C\u6751\u5BB6\u5EAD\u7528\u7535\u5168\u9762\u6539\u9020", master: "\u5F20\u5E08\u5085", date: "2024-01-16", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u5927\u578B\u517B\u6B96\u573A\u7528\u7535\u89C4\u5212", master: "\u674E\u5E08\u5085", date: "2024-01-11", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u5DE5\u5382\u7528\u7535\u7CFB\u7EDF\u5347\u7EA7", master: "\u738B\u5E08\u5085", date: "2024-01-06", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u667A\u80FD\u5BB6\u5C45\u7535\u8DEF\u6539\u9020", master: "\u5218\u5E08\u5085", date: "2023-12-30", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u8001\u65E7\u5C0F\u533A\u7535\u8DEF\u5168\u9762\u5347\u7EA7", master: "\u9648\u5E08\u5085", date: "2023-12-23", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u519C\u6751\u7535\u7F51\u6539\u9020", master: "\u5F20\u5E08\u5085", date: "2023-12-18", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u5546\u4E1A\u7EFC\u5408\u4F53\u7528\u7535\u8BBE\u8BA1", master: "\u674E\u5E08\u5085", date: "2023-12-13", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u519C\u4E1A\u73B0\u4EE3\u5316\u7528\u7535\u6539\u9020", master: "\u738B\u5E08\u5085", date: "2023-12-08", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u5E94\u6025\u7528\u7535\u6545\u969C\u5904\u7406", master: "\u5218\u5E08\u5085", date: "2023-12-01", image: "" },
            { title: "\u7ECF\u5178\u6848\u4F8B\uFF1A\u7528\u7535\u5B89\u5168\u9632\u62A4\u7CFB\u7EDF\u5EFA\u8BBE", master: "\u9648\u5E08\u5085", date: "2023-11-24", image: "" }
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
              formatAppLog("log", "at pages/news/news-page.nvue:299", "\u5BFC\u822A\u5931\u8D25:", err);
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
          content: "\u4E0D\u611F\u5174\u8DA3\uFF1F",
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
        this.refreshText = "\u6B63\u5728\u5237\u65B0...";
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
          this.refreshText = "\u91CA\u653E\u7ACB\u5373\u5237\u65B0";
        } else {
          this.refreshFlag = false;
          this.refreshText = "\u4E0B\u62C9\u53EF\u4EE5\u5237\u65B0";
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
    const _component_news_item = (0, import_vue2.resolveComponent)("news-item");
    const _component_no_data = (0, import_vue2.resolveComponent)("no-data");
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
      class: "page-news",
      renderWhole: true
    }, [
      (0, import_vue2.createElementVNode)("list", { class: "listview" }, [
        (0, import_vue2.createElementVNode)("refresh", {
          display: $data.refreshing,
          onRefresh: _cache[0] || (_cache[0] = (...args) => $options.onrefresh && $options.onrefresh(...args)),
          onPullingdown: _cache[1] || (_cache[1] = (...args) => $options.onpullingdown && $options.onpullingdown(...args))
        }, null, 40, ["display"]),
        ((0, import_vue2.openBlock)(true), (0, import_vue2.createElementBlock)(
          import_vue2.Fragment,
          null,
          (0, import_vue2.renderList)($data.dataList, (item, index2) => {
            return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("cell", {
              key: item.id
            }, [
              (0, import_vue2.createVNode)(_component_news_item, {
                newsItem: item,
                onClose: ($event) => $options.closeItem(index2),
                onClick: ($event) => $options.goDetail(item)
              }, null, 8, ["newsItem", "onClose", "onClick"])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.isLoading || $data.dataList.length > 4 ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("cell", { key: 0 }, [
          (0, import_vue2.createElementVNode)("view", { class: "loading-more" }, [
            (0, import_vue2.createElementVNode)(
              "u-text",
              { class: "loading-more-text" },
              (0, import_vue2.toDisplayString)($data.loadingText),
              1
              /* TEXT */
            )
          ])
        ])) : (0, import_vue2.createCommentVNode)("v-if", true)
      ]),
      $data.isNoData ? ((0, import_vue2.openBlock)(), (0, import_vue2.createBlock)(_component_no_data, {
        key: 0,
        class: "no-data",
        onRetry: $options.loadMore
      }, null, 8, ["onRetry"])) : (0, import_vue2.createCommentVNode)("v-if", true)
    ]);
  }
  var newsPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["styles", [_style_0$1]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/news-page.nvue"]]);
  var _style_0 = { "tabs": { "": { "flex": 1, "flexDirection": "column", "overflow": "hidden", "backgroundColor": "#ffffff" } }, "tab-bar": { "": { "width": "750rpx", "height": 42, "flexDirection": "row" } }, "scroll-view-indicator": { "": { "position": "relative", "height": 2, "backgroundColor": "rgba(0,0,0,0)" } }, "scroll-view-underline": { "": { "position": "absolute", "top": 0, "bottom": 0, "width": 0, "backgroundColor": "#007AFF" } }, "scroll-view-animation": { "": { "transitionDuration": 200, "transitionProperty": "left" } }, "tab-bar-line": { "": { "height": 1, "backgroundColor": "#cccccc" } }, "tab-box": { "": { "flex": 1 } }, "uni-tab-item": { "": { "flexWrap": "nowrap", "paddingLeft": 20, "paddingRight": 20 } }, "uni-tab-item-title": { "": { "color": "#555555", "fontSize": 15, "height": 40, "lineHeight": 40, "flexWrap": "nowrap" } }, "uni-tab-item-title-active": { "": { "color": "#007AFF" } }, "swiper-item": { "": { "flex": 1, "flexDirection": "column" } }, "page-item": { "": { "flex": 1, "flexDirection": "row", "position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0 } }, "@TRANSITION": { "scroll-view-animation": { "duration": 200, "property": "left" } } };
  var dom = weex.requireModule("dom");
  var MAX_CACHE_DATA = 100;
  var MAX_CACHE_PAGE = 3;
  var TAB_PRELOAD_OFFSET = 1;
  var _sfc_main = {
    components: {
      newsPage
    },
    data() {
      return {
        tabList: [{
          id: "tab01",
          name: "\u751F\u6D3B\u7528\u7535",
          newsid: 0
        }, {
          id: "tab02",
          name: "\u7535\u8DEF\u7EF4\u4FEE",
          newsid: 23
        }, {
          id: "tab03",
          name: "\u7535\u5668\u7EF4\u62A4",
          newsid: 223
        }, {
          id: "tab04",
          name: "\u7528\u7535\u6539\u9020",
          newsid: 221
        }, {
          id: "tab05",
          name: "\u6545\u969C\u6392\u9664",
          newsid: 225
        }, {
          id: "tab06",
          name: "\u7ECF\u5178\u6848\u4F8B",
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
    const _component_newsPage = (0, import_vue2.resolveComponent)("newsPage");
    const _component_swiper_item = (0, import_vue2.resolveComponent)("swiper-item");
    const _component_swiper = (0, import_vue2.resolveComponent)("swiper");
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue2.createElementVNode)("view", { class: "tabs" }, [
        (0, import_vue2.createElementVNode)("scroll-view", {
          ref: "tabbar1",
          id: "tab-bar",
          class: "tab-bar",
          scroll: false,
          scrollX: true,
          showScrollbar: false,
          scrollIntoView: $data.scrollInto
        }, [
          (0, import_vue2.createElementVNode)("view", { style: { "flex-direction": "column" } }, [
            (0, import_vue2.createElementVNode)("view", { style: { "flex-direction": "row" } }, [
              ((0, import_vue2.openBlock)(true), (0, import_vue2.createElementBlock)(
                import_vue2.Fragment,
                null,
                (0, import_vue2.renderList)($data.tabList, (tab, index2) => {
                  return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
                    class: "uni-tab-item",
                    key: tab.id,
                    id: tab.id,
                    ref_for: true,
                    ref: "tabitem" + index2,
                    "data-id": index2,
                    "data-current": index2,
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.ontabtap && $options.ontabtap(...args))
                  }, [
                    (0, import_vue2.createElementVNode)(
                      "u-text",
                      {
                        class: (0, import_vue2.normalizeClass)(["uni-tab-item-title", $data.tabIndex == index2 ? "uni-tab-item-title-active" : ""])
                      },
                      (0, import_vue2.toDisplayString)(tab.name),
                      3
                      /* TEXT, CLASS */
                    )
                  ], 8, ["id", "data-id", "data-current"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            (0, import_vue2.createElementVNode)("view", { class: "scroll-view-indicator" }, [
              (0, import_vue2.createElementVNode)(
                "view",
                {
                  ref: "underline",
                  class: (0, import_vue2.normalizeClass)(["scroll-view-underline", $data.isTap ? "scroll-view-animation" : ""]),
                  style: (0, import_vue2.normalizeStyle)({ left: $data.indicatorLineLeft + "px", width: $data.indicatorLineWidth + "px" })
                },
                null,
                6
                /* CLASS, STYLE */
              )
            ])
          ])
        ], 8, ["scrollIntoView"]),
        (0, import_vue2.createElementVNode)("view", { class: "tab-bar-line" }),
        (0, import_vue2.createVNode)(_component_swiper, {
          class: "tab-box",
          ref: "swiper1",
          current: $data.tabIndex,
          duration: 300,
          onChange: $options.onswiperchange,
          onTransition: $options.onswiperscroll,
          onAnimationfinish: $options.animationfinish,
          onOnAnimationEnd: $options.animationfinish
        }, {
          default: (0, import_vue2.withCtx)(() => [
            ((0, import_vue2.openBlock)(true), (0, import_vue2.createElementBlock)(
              import_vue2.Fragment,
              null,
              (0, import_vue2.renderList)($data.tabList, (page, index2) => {
                return (0, import_vue2.openBlock)(), (0, import_vue2.createBlock)(
                  _component_swiper_item,
                  {
                    class: "swiper-item",
                    key: index2
                  },
                  {
                    default: (0, import_vue2.withCtx)(() => [
                      (0, import_vue2.createVNode)(_component_newsPage, {
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
  var index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/index.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/news/index";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    index.mpType = "page";
    const app = Vue.createPageApp(index, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...index.styles || []]));
    app.mount("#root");
  }
})();
