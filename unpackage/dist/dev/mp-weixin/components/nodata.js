"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
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
    this.isIOS = common_vendor.index.getSystemInfoSync().platform === "ios";
    common_vendor.index.onNetworkStatusChange((res) => {
      this.isConnected = res.isConnected;
      this.networkType = res.networkType;
    });
    common_vendor.index.getNetworkType({
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
        common_vendor.index.__f__("log", "at components/nodata.nvue:70", "StateUnknown");
      } else if (state == 2) {
        result = 1;
        common_vendor.index.__f__("log", "at components/nodata.nvue:73", "已经开启了互联网权限:NotRestricted");
      } else if (state == 1) {
        result = 2;
        common_vendor.index.__f__("log", "at components/nodata.nvue:76", "Restricted");
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.textTypes[$data.networkType]),
    b: $data.networkType != "none"
  }, $data.networkType != "none" ? {
    c: common_vendor.o((...args) => $options.retry && $options.retry(...args))
  } : {}, {
    d: $data.networkType == "none"
  }, $data.networkType == "none" ? {
    e: common_vendor.o((...args) => $options.openSettings && $options.openSettings(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/nodata.js.map
