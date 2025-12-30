"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_offline = require("../../../utils/offline.js");
const store_user = require("../../../store/user.js");
const _sfc_main = {
  data() {
    return {
      draftList: [],
      largeFontMode: false
    };
  },
  onLoad() {
    this.largeFontMode = store_user.userStore.state.largeFontMode;
    this.loadDrafts();
  },
  onShow() {
    this.loadDrafts();
  },
  methods: {
    /**
     * 加载草稿列表
     */
    loadDrafts() {
      this.draftList = utils_offline.offline.draftDemand.getAll();
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
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    /**
     * 编辑草稿
     */
    editDraft(draft) {
      common_vendor.index.navigateTo({
        url: `/pages/user/demand/create?draftId=${draft.offline_local_id}`
      });
    },
    /**
     * 删除草稿
     */
    deleteDraft(draft) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除此草稿吗？",
        success: (res) => {
          if (res.confirm) {
            utils_offline.offline.draftDemand.remove(draft.offline_local_id);
            utils_offline.offline.syncQueue.remove(draft.offline_local_id);
            this.loadDrafts();
            common_vendor.index.showToast({
              title: "已删除",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.draftList, (draft, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(draft.title || "未命名需求"),
        b: common_vendor.t($options.formatTime(draft.updated_at)),
        c: common_vendor.t($options.getSceneText(draft.service_type)),
        d: draft.address
      }, draft.address ? {
        e: common_vendor.t(draft.address)
      } : {}, {
        f: common_vendor.o(($event) => $options.deleteDraft(draft), draft.offline_local_id),
        g: common_vendor.o(($event) => $options.editDraft(draft), draft.offline_local_id),
        h: draft.offline_local_id,
        i: common_vendor.o(($event) => $options.editDraft(draft), draft.offline_local_id)
      });
    }),
    b: $data.draftList.length === 0
  }, $data.draftList.length === 0 ? {} : {}, {
    c: $data.largeFontMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7d67ea83"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/demand/drafts.js.map
