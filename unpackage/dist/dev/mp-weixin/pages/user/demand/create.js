"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const utils_offline = require("../../../utils/offline.js");
const store_user = require("../../../store/user.js");
const utils_amap = require("../../../utils/amap.js");
const utils_baiduSpeech = require("../../../utils/baidu-speech.js");
const ServiceFloat = () => "../../../components/ServiceFloat.js";
function checkLogin() {
  if (store_user.userStore.state.isLoggedIn) {
    return true;
  }
  const token = common_vendor.index.getStorageSync("token");
  const userInfo = common_vendor.index.getStorageSync("userInfo");
  if (token && userInfo) {
    store_user.userStore.setUserInfo(userInfo, token);
    return true;
  }
  common_vendor.index.showModal({
    title: "需要登录",
    content: "发布需求需要先登录，是否前往登录？",
    success: (res) => {
      if (res.confirm) {
        common_vendor.index.navigateTo({
          url: "/pages/user/login/index"
        });
      }
    }
  });
  return false;
}
const _sfc_main = {
  components: {
    ServiceFloat
  },
  data() {
    return {
      formData: {
        service_type: 1,
        title: "",
        description: "",
        power_kw: "",
        address: "",
        lng: null,
        lat: null,
        photos: [],
        offline_local_id: null
      },
      sceneTypes: [
        {
          value: 1,
          label: "生活用电改造",
          image: "/static/yd.png"
        },
        {
          value: 2,
          label: "电路维修",
          image: "/static/yd.png"
        },
        {
          value: 3,
          label: "电器维护",
          image: "/static/yd.png"
        },
        {
          value: 4,
          label: "用电故障排除",
          image: "/static/yd.png"
        }
      ],
      submitting: false,
      largeFontMode: false,
      fontSize: 22,
      placeholderTitle: "例如：家里电路跳闸需要维修",
      placeholderDesc: "请详细描述用电问题、现场情况、需要维修的电器类型及期望完成时间，信息越详细越容易匹配到合适的师傅",
      recordingType: null,
      // 当前录音类型：'title' 或 'description'
      recorderManager: null,
      recordingTime: 0,
      recordingTimer: null,
      selectedLanguage: "普通话",
      // 选择的方言类型
      showLanguagePicker: false,
      // 是否显示语言选择器
      pendingRecordingType: null,
      // 待录音的类型（用于语言选择后）
      languageList: [],
      // 语言列表
      realTimeText: "",
      // 实时识别的文本
      recognizeTimer: null,
      // 实时识别定时器
      lastRecognizeTime: 0,
      // 上次识别时间
      aiAnalysisResults: [],
      // AI分析结果列表
      showSelectDropdown: false,
      // 是否显示下拉选择器
      typingTimer: null
      // 打字机效果定时器
    };
  },
  created() {
    this.languageList = Object.keys(utils_baiduSpeech.baiduSpeech.LANGUAGE_CODES || {});
    common_vendor.index.__f__("log", "at pages/user/demand/create.vue:278", "语言列表已初始化:", this.languageList);
  },
  onLoad(options) {
    if (!checkLogin()) {
      return;
    }
    let draftId = options.draftId || options.draftid;
    if (!draftId) {
      draftId = common_vendor.index.getStorageSync("editDraftId");
      if (draftId) {
        common_vendor.index.removeStorageSync("editDraftId");
      }
    }
    if (draftId) {
      this.loadDraft(draftId);
    }
    this.largeFontMode = store_user.userStore.state.largeFontMode;
    this.fontSize = store_user.userStore.state.fontSize;
    this.updatePlaceholders(this.formData.service_type);
    this.getLocation();
  },
  methods: {
    /**
     * 切换下拉选择器显示状态
     */
    toggleSelectDropdown(e) {
      if (e) {
        e.stopPropagation();
      }
      this.showSelectDropdown = !this.showSelectDropdown;
    },
    /**
     * 关闭下拉选择器
     */
    closeSelectDropdown() {
      this.showSelectDropdown = false;
    },
    /**
     * 选择场景类型
     */
    selectScene(value) {
      this.formData.service_type = value;
      this.updatePlaceholders(value);
      this.showSelectDropdown = false;
    },
    /**
     * 获取选中的场景标签
     */
    getSelectedSceneLabel() {
      const scene = this.sceneTypes.find((s) => s.value === this.formData.service_type);
      return scene ? scene.label : "";
    },
    /**
     * 开始语音输入（模拟打字机效果）
     */
    async startVoiceInput(type) {
      if (this.recordingType === type) {
        this.stopVoiceInput();
        return;
      }
      if (this.recordingType && this.recordingType !== type) {
        this.stopVoiceInput();
      }
      this.recordingType = type;
      let defaultText = "";
      if (type === "title") {
        defaultText = "电力";
      } else if (type === "description") {
        defaultText = "改造";
      }
      if (type === "title") {
        this.formData.title = "";
      } else if (type === "description") {
        this.formData.description = "";
      }
      common_vendor.index.showToast({
        title: "正在录音转文字...",
        icon: "none",
        duration: 2e3
      });
      setTimeout(() => {
        this.startTypingEffect(type, defaultText);
      }, 1500);
    },
    /**
     * 打字机效果
     */
    startTypingEffect(type, fullText) {
      const self = this;
      let index = 0;
      const speed = 150;
      if (self.typingTimer) {
        clearInterval(self.typingTimer);
      }
      self.typingTimer = setInterval(() => {
        if (index < fullText.length) {
          const displayText = fullText.substring(0, index + 1);
          if (type === "title") {
            self.formData.title = displayText;
          } else if (type === "description") {
            self.formData.description = displayText;
          }
          index++;
        } else {
          clearInterval(self.typingTimer);
          self.typingTimer = null;
          self.recordingType = null;
          common_vendor.index.showToast({
            title: "识别完成",
            icon: "success",
            duration: 1e3
          });
        }
      }, speed);
    },
    /**
     * 开始录音
     */
    async startRecording(type) {
      try {
        common_vendor.index.__f__("log", "at pages/user/demand/create.vue:439", "开始录音，类型:", type);
        this.recordingType = type;
        this.recordingTime = 0;
        this.realTimeText = "";
        this.lastRecognizeTime = 0;
        if (type === "title") {
          this.realTimeText = this.formData.title || "";
        } else if (type === "description") {
          this.realTimeText = this.formData.description || "";
        }
        this.recorderManager = await utils_baiduSpeech.baiduSpeech.startRecord({
          duration: 6e4
          // 最长60秒
        });
        common_vendor.index.__f__("log", "at pages/user/demand/create.vue:457", "录音管理器创建成功");
        this.startRealTimeRecognize(type);
        this.recordingTimer = setInterval(() => {
          this.recordingTime++;
          if (this.recordingTime >= 60) {
            this.stopVoiceInput();
          }
        }, 1e3);
        common_vendor.index.showToast({
          title: "正在录音，实时转文字中...",
          icon: "none",
          duration: 2e3
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/demand/create.vue:476", "开始录音失败:", error);
        this.recordingType = null;
        this.recorderManager = null;
        if (this.recordingTimer) {
          clearInterval(this.recordingTimer);
          this.recordingTimer = null;
        }
        if (this.recognizeTimer) {
          clearInterval(this.recognizeTimer);
          this.recognizeTimer = null;
        }
        common_vendor.index.showToast({
          title: "录音失败：" + (error.message || "请检查麦克风权限"),
          icon: "none",
          duration: 3e3
        });
      }
    },
    /**
     * 开始实时识别
     */
    async startRealTimeRecognize(type) {
      common_vendor.index.__f__("log", "at pages/user/demand/create.vue:500", "启动实时识别，类型:", type);
      setTimeout(async () => {
        await this.performRealTimeRecognize(type);
        this.recognizeTimer = setInterval(async () => {
          await this.performRealTimeRecognize(type);
        }, 5e3);
      }, 5e3);
    },
    /**
     * 执行实时识别
     */
    async performRealTimeRecognize(type) {
      if (!this.recorderManager || !this.recordingType || this.recordingType !== type) {
        common_vendor.index.__f__("log", "at pages/user/demand/create.vue:518", "跳过识别：录音管理器不存在或类型不匹配");
        return;
      }
      if (this.recordingTime < 5) {
        common_vendor.index.__f__("log", "at pages/user/demand/create.vue:524", "跳过识别：录音时间太短", this.recordingTime, "秒，需要至少5秒");
        return;
      }
      try {
        common_vendor.index.__f__("log", "at pages/user/demand/create.vue:529", "开始实时识别，录音时长:", this.recordingTime, "秒");
        const currentRecorder = this.recorderManager;
        const audioPath = await utils_baiduSpeech.baiduSpeech.stopRecord(currentRecorder);
        common_vendor.index.__f__("log", "at pages/user/demand/create.vue:536", "录音文件路径:", audioPath);
        const result = await utils_baiduSpeech.baiduSpeech.recognizeSpeech(audioPath, this.selectedLanguage);
        common_vendor.index.__f__("log", "at pages/user/demand/create.vue:540", "识别结果:", result);
        if (result && result.trim()) {
          if (this.realTimeText) {
            this.realTimeText += " " + result;
          } else {
            this.realTimeText = result;
          }
          if (type === "title") {
            this.formData.title = this.realTimeText;
          } else if (type === "description") {
            this.formData.description = this.realTimeText;
          }
          common_vendor.index.__f__("log", "at pages/user/demand/create.vue:557", "实时识别结果:", result);
          common_vendor.index.__f__("log", "at pages/user/demand/create.vue:558", "累计文本:", this.realTimeText);
          common_vendor.index.showToast({
            title: "识别中...",
            icon: "none",
            duration: 1e3
          });
        } else {
          common_vendor.index.__f__("log", "at pages/user/demand/create.vue:567", "识别结果为空");
        }
        if (this.recordingType === type) {
          this.recorderManager = await utils_baiduSpeech.baiduSpeech.startRecord({
            duration: 6e4
          });
          common_vendor.index.__f__("log", "at pages/user/demand/create.vue:575", "录音已继续");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/demand/create.vue:578", "实时识别失败:", error);
        common_vendor.index.__f__("error", "at pages/user/demand/create.vue:579", "错误详情:", error.message);
        if (error.stack) {
          common_vendor.index.__f__("error", "at pages/user/demand/create.vue:581", "错误堆栈:", error.stack);
        }
        if (error.message && error.message.includes("太小")) {
          common_vendor.index.__f__("log", "at pages/user/demand/create.vue:586", "音频文件太小，跳过此次识别，继续录音");
          if (this.recordingType === type) {
            try {
              this.recorderManager = await utils_baiduSpeech.baiduSpeech.startRecord({
                duration: 6e4
              });
              common_vendor.index.__f__("log", "at pages/user/demand/create.vue:593", "录音已继续（音频太小跳过识别）");
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/user/demand/create.vue:595", "重新开始录音失败:", err);
            }
          }
          return;
        }
        if (this.recordingType === type) {
          try {
            this.recorderManager = await utils_baiduSpeech.baiduSpeech.startRecord({
              duration: 6e4
            });
            common_vendor.index.__f__("log", "at pages/user/demand/create.vue:607", "录音已重新开始");
          } catch (err) {
            common_vendor.index.__f__("error", "at pages/user/demand/create.vue:609", "重新开始录音失败:", err);
            common_vendor.index.showToast({
              title: "录音中断: " + (error.message || "请重试"),
              icon: "none",
              duration: 2e3
            });
            this.stopVoiceInput();
          }
        }
      }
    },
    /**
     * 停止语音输入
     */
    async stopVoiceInput() {
      if (this.typingTimer) {
        clearInterval(this.typingTimer);
        this.typingTimer = null;
      }
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
      if (this.recognizeTimer) {
        clearInterval(this.recognizeTimer);
        this.recognizeTimer = null;
      }
      this.recordingType = null;
      this.recorderManager = null;
      this.recordingTime = 0;
      this.realTimeText = "";
      this.lastRecognizeTime = 0;
    },
    /**
     * 选择语言
     */
    async selectLanguage(lang) {
      common_vendor.index.__f__("log", "at pages/user/demand/create.vue:655", "选择语言方法被调用，语言:", lang);
      this.selectedLanguage = lang;
      this.showLanguagePicker = false;
      const type = this.pendingRecordingType;
      this.pendingRecordingType = null;
      common_vendor.index.__f__("log", "at pages/user/demand/create.vue:661", "用户选择了语言:", lang, "待录音类型:", type);
      if (type) {
        try {
          common_vendor.index.__f__("log", "at pages/user/demand/create.vue:664", "准备开始录音，类型:", type);
          await this.startRecording(type);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/user/demand/create.vue:667", "开始录音失败:", error);
          common_vendor.index.showToast({
            title: "启动失败：" + (error.message || "请重试"),
            icon: "none"
          });
        }
      }
    },
    /**
     * 关闭语言选择器
     */
    closeLanguagePicker() {
      this.showLanguagePicker = false;
      this.pendingRecordingType = null;
    },
    /**
     * 获取场景图标
     */
    getSceneIcon(sceneType) {
      const icons = {
        1: "🏠",
        2: "🔧",
        3: "⚙️",
        4: "⚠️"
      };
      return icons[sceneType] || "⚡";
    },
    /**
     * 根据场景类型更新占位符
     */
    updatePlaceholders(sceneType) {
      const placeholders = {
        1: {
          title: "例如：家庭电路改造升级",
          desc: "请描述房屋面积、现有电路情况、需要改造的区域及期望完成时间"
        },
        2: {
          title: "例如：电路跳闸需要维修",
          desc: "请描述故障现象、发生频率、影响范围及期望维修时间"
        },
        3: {
          title: "例如：空调电路维护保养",
          desc: "请描述需要维护的电器类型、使用年限、当前问题及期望维护时间"
        },
        4: {
          title: "例如：用电故障紧急排除",
          desc: "请描述故障现象、紧急程度、已尝试的解决方法及期望响应时间"
        }
      };
      const placeholder = placeholders[sceneType] || placeholders[1];
      this.placeholderTitle = placeholder.title;
      this.placeholderDesc = placeholder.desc;
    },
    /**
     * 返回上一页
     */
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1,
        fail: () => {
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        }
      });
    },
    /**
     * 选择地址
     */
    selectAddress() {
      common_vendor.index.chooseLocation({
        success: (res) => {
          this.formData.address = res.address;
          this.formData.lng = res.longitude;
          this.formData.lat = res.latitude;
          utils_offline.offline.userAddress.save({
            address: res.address,
            lng: res.longitude,
            lat: res.latitude
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/user/demand/create.vue:757", "选择地址失败", err);
          common_vendor.index.showToast({
            title: "选择地址失败",
            icon: "none"
          });
        }
      });
    },
    /**
     * 获取定位
     */
    getLocation() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: async (res) => {
          this.formData.lng = res.longitude;
          this.formData.lat = res.latitude;
          try {
            const geo = await utils_amap.reverseGeocode(res.longitude, res.latitude);
            if (geo.address) {
              this.formData.address = geo.address;
            } else if (!this.formData.address) {
              this.formData.address = "定位成功，地址解析失败";
            }
            if (geo.pois && geo.pois.length) {
              const poi = geo.pois[0];
              this.formData.address = poi.name ? `${geo.address || ""}（${poi.name}）` : geo.address;
            }
          } catch (geoErr) {
            common_vendor.index.__f__("error", "at pages/user/demand/create.vue:790", "高德逆地理编码失败", geoErr);
            const errorMsg = geoErr.message || geoErr.toString();
            if (errorMsg.includes("USERKEY_PLAT_NOMATCH") || errorMsg.includes("平台不匹配")) {
              common_vendor.index.__f__(
                "warn",
                "at pages/user/demand/create.vue:794",
                "请配置正确的高德地图API Key：1.使用Web服务类型Key；2.在微信小程序后台配置request合法域名：https://restapi.amap.com"
              );
            }
            if (!this.formData.address) {
              this.formData.address = "定位成功，未获取到详细地址";
            }
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/user/demand/create.vue:804", "获取定位失败", err);
          common_vendor.index.showToast({
            title: "获取定位失败，请手动选择地址",
            icon: "none"
          });
        }
      });
    },
    /**
     * 选择照片
     */
    async choosePhoto() {
      try {
        common_vendor.index.chooseImage({
          count: 9 - this.formData.photos.length,
          success: async (res) => {
            common_vendor.index.showLoading({
              title: "上传中..."
            });
            try {
              const upload = (await "../../../utils/upload.js").default;
              const urls = await upload.uploadImages(res.tempFilePaths);
              const photosWithAI = urls.map((url) => ({
                url,
                aiAnalyzing: false,
                aiResult: null
              }));
              const existingPhotos = this.formData.photos.map(
                (photo) => typeof photo === "string" ? {
                  url: photo,
                  aiAnalyzing: false,
                  aiResult: null
                } : photo
              );
              this.formData.photos = existingPhotos.concat(photosWithAI);
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "上传成功",
                icon: "success"
              });
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/user/demand/create.vue:856", "上传失败", error);
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "上传失败，请重试",
                icon: "none"
              });
              const photosWithAI = res.tempFilePaths.map((path) => ({
                url: path,
                aiAnalyzing: false,
                aiResult: null
              }));
              const existingPhotos = this.formData.photos.map(
                (photo) => typeof photo === "string" ? {
                  url: photo,
                  aiAnalyzing: false,
                  aiResult: null
                } : photo
              );
              this.formData.photos = existingPhotos.concat(photosWithAI);
            }
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/demand/create.vue:881", "选择图片失败", error);
      }
    },
    /**
     * AI分析照片
     */
    async analyzePhoto(index) {
      const photo = this.formData.photos[index];
      if (!photo) {
        return;
      }
      if (this.getPhotoAIStatus(photo, "analyzing")) {
        return;
      }
      const photoUrl = this.getPhotoUrl(photo);
      try {
        if (typeof photo === "object") {
          this.$set(this.formData.photos[index], "aiAnalyzing", true);
        } else {
          this.$set(this.formData.photos, index, {
            url: photoUrl,
            aiAnalyzing: true,
            aiResult: null
          });
        }
        common_vendor.index.showLoading({
          title: "AI分析中..."
        });
        const result = await utils_request.request.post("/api/ai/analyze-image", {
          imageUrl: photoUrl
        });
        common_vendor.index.hideLoading();
        const updatedPhoto = this.formData.photos[index];
        if (typeof updatedPhoto === "object") {
          this.$set(this.formData.photos[index], "aiAnalyzing", false);
          this.$set(this.formData.photos[index], "aiResult", result);
        }
        this.aiAnalysisResults.push({
          photoUrl,
          analysis: result.analysis || "未识别到明显问题",
          solution: result.solution || "建议联系专业电工进行现场检查",
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString()
        });
        if (result.solution && !this.formData.description) {
          this.formData.description = `AI分析建议：${result.solution}`;
        }
        common_vendor.index.showToast({
          title: "分析完成",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/demand/create.vue:950", "AI分析失败", error);
        common_vendor.index.hideLoading();
        const updatedPhoto = this.formData.photos[index];
        if (typeof updatedPhoto === "object") {
          this.$set(this.formData.photos[index], "aiAnalyzing", false);
        }
        common_vendor.index.showToast({
          title: "分析失败：" + (error.message || "请重试"),
          icon: "none"
        });
      }
    },
    /**
     * 获取照片URL（兼容字符串和对象格式）
     */
    getPhotoUrl(photo) {
      return typeof photo === "string" ? photo : photo.url;
    },
    /**
     * 获取照片AI状态
     */
    getPhotoAIStatus(photo, type) {
      if (typeof photo === "string") {
        return false;
      }
      if (type === "analyzing") {
        return photo.aiAnalyzing || false;
      }
      if (type === "result") {
        return photo.aiResult || false;
      }
      return false;
    },
    /**
     * 删除照片
     */
    removePhoto(index) {
      const photo = this.formData.photos[index];
      const photoUrl = this.getPhotoUrl(photo);
      this.aiAnalysisResults = this.aiAnalysisResults.filter((result) => result.photoUrl !== photoUrl);
      this.formData.photos.splice(index, 1);
    },
    /**
     * 保存草稿
     */
    saveDraft() {
      if (!this.formData.title && !this.formData.description) {
        common_vendor.index.showToast({
          title: "请至少填写标题或描述",
          icon: "none"
        });
        return;
      }
      const localId = utils_offline.offline.draftDemand.save(this.formData);
      this.formData.offline_local_id = localId;
      common_vendor.index.showToast({
        title: "草稿已保存",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack({
          delta: 1,
          fail: () => {
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }
        });
      }, 800);
    },
    /**
     * 加载草稿
     */
    loadDraft(draftId) {
      const draft = utils_offline.offline.draftDemand.getById(draftId);
      if (draft) {
        this.formData = {
          ...draft
        };
      }
    },
    /**
     * 提交需求
     */
    async submitDemand() {
      if (!checkLogin()) {
        return;
      }
      if (!this.formData.title || this.formData.title.trim() === "") {
        common_vendor.index.showToast({
          title: "请输入需求标题",
          icon: "none"
        });
        return;
      }
      if (!this.formData.description || this.formData.description.trim() === "") {
        common_vendor.index.showToast({
          title: "请输入详细描述",
          icon: "none"
        });
        return;
      }
      if (this.formData.service_type === void 0 || this.formData.service_type === null) {
        this.formData.service_type = 1;
      }
      if (this.formData.power_kw && parseFloat(this.formData.power_kw) < 0) {
        common_vendor.index.showToast({
          title: "功率需求不能为负数",
          icon: "none"
        });
        return;
      }
      if (!this.formData.address || !this.formData.lng || !this.formData.lat) {
        common_vendor.index.showToast({
          title: "请选择施工地址",
          icon: "none"
        });
        return;
      }
      this.submitting = true;
      try {
        const url = this.formData.offline_local_id ? "/api/demand/sync" : "/api/demand/create";
        const photos = (this.formData.photos || []).map(
          (photo) => typeof photo === "string" ? photo : photo.url
        );
        const result = await utils_request.request.post(url, {
          service_type: this.formData.service_type || 1,
          title: this.formData.title,
          description: this.formData.description,
          power_kw: parseFloat(this.formData.power_kw) || 0,
          address: this.formData.address,
          lng: this.formData.lng,
          lat: this.formData.lat,
          photos,
          offline_local_id: this.formData.offline_local_id || null
        });
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        if (this.formData.offline_local_id) {
          utils_offline.offline.draftDemand.remove(this.formData.offline_local_id);
          utils_offline.offline.syncQueue.remove(this.formData.offline_local_id);
        }
        common_vendor.index.$emit("demandCreated", {
          demandId: result.id,
          timestamp: Date.now()
        });
        setTimeout(() => {
          common_vendor.index.navigateBack({
            delta: 1,
            fail: () => {
              common_vendor.index.reLaunch({
                url: "/pages/index/index"
              });
            }
          });
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/demand/create.vue:1149", "提交需求失败", error);
        const errorMsg = error.message || "发布失败，请稍后重试";
        common_vendor.index.showModal({
          title: "提交失败",
          content: errorMsg,
          showCancel: false,
          success: () => {
            this.saveDraft();
            utils_offline.offline.syncQueue.add(this.formData.offline_local_id, "demand_create");
          }
        });
      } finally {
        this.submitting = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_service_float2 = common_vendor.resolveComponent("service-float");
  _easycom_service_float2();
}
const _easycom_service_float = () => "../../../components/ServiceFloat.js";
if (!Math) {
  _easycom_service_float();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.getSelectedSceneLabel()
  }, $options.getSelectedSceneLabel() ? {
    b: common_vendor.t($options.getSelectedSceneLabel())
  } : {}, {
    c: $data.showSelectDropdown ? 1 : "",
    d: common_vendor.o((...args) => $options.toggleSelectDropdown && $options.toggleSelectDropdown(...args)),
    e: common_vendor.o((...args) => $options.toggleSelectDropdown && $options.toggleSelectDropdown(...args)),
    f: $data.showSelectDropdown
  }, $data.showSelectDropdown ? {
    g: common_vendor.f($data.sceneTypes, (scene, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.getSceneIcon(scene.value)),
        b: common_vendor.t(scene.label),
        c: $data.formData.service_type === scene.value
      }, $data.formData.service_type === scene.value ? {} : {}, {
        d: scene.value,
        e: $data.formData.service_type === scene.value ? 1 : "",
        f: common_vendor.o(($event) => $options.selectScene(scene.value), scene.value),
        g: common_vendor.o(($event) => $options.selectScene(scene.value), scene.value)
      });
    }),
    h: common_vendor.o(() => {
    }),
    i: common_vendor.o(() => {
    })
  } : {}, {
    j: $data.placeholderTitle,
    k: $data.fontSize + "rpx",
    l: $data.formData.title,
    m: common_vendor.o(($event) => $data.formData.title = $event.detail.value),
    n: common_vendor.t($data.recordingType === "title" ? "⏹" : "🎤"),
    o: common_vendor.o(($event) => $options.startVoiceInput("title")),
    p: common_vendor.o(($event) => $options.startVoiceInput("title")),
    q: $data.recordingType === "title" ? 1 : "",
    r: $data.placeholderDesc,
    s: ($data.fontSize > 22 ? $data.fontSize : 32) + "rpx",
    t: $data.formData.description,
    v: common_vendor.o(($event) => $data.formData.description = $event.detail.value),
    w: common_vendor.t($data.recordingType === "description" ? "⏹" : "🎤"),
    x: common_vendor.o(($event) => $options.startVoiceInput("description")),
    y: common_vendor.o(($event) => $options.startVoiceInput("description")),
    z: $data.recordingType === "description" ? 1 : "",
    A: $data.fontSize + "rpx",
    B: $data.formData.power_kw,
    C: common_vendor.o(($event) => $data.formData.power_kw = $event.detail.value),
    D: $data.formData.address
  }, $data.formData.address ? {
    E: common_vendor.t($data.formData.address)
  } : {}, {
    F: common_vendor.o((...args) => $options.selectAddress && $options.selectAddress(...args)),
    G: $data.formData.lng && $data.formData.lat
  }, $data.formData.lng && $data.formData.lat ? {
    H: common_vendor.t($data.formData.lat.toFixed(6)),
    I: common_vendor.t($data.formData.lng.toFixed(6))
  } : {}, {
    J: common_vendor.f($data.formData.photos, (photo, index, i0) => {
      return common_vendor.e({
        a: $options.getPhotoUrl(photo),
        b: common_vendor.o(($event) => $options.removePhoto(index), index),
        c: !$options.getPhotoAIStatus(photo, "analyzing") && !$options.getPhotoAIStatus(photo, "result")
      }, !$options.getPhotoAIStatus(photo, "analyzing") && !$options.getPhotoAIStatus(photo, "result") ? {
        d: common_vendor.o(($event) => $options.analyzePhoto(index), index)
      } : {}, {
        e: $options.getPhotoAIStatus(photo, "analyzing")
      }, $options.getPhotoAIStatus(photo, "analyzing") ? {} : {}, {
        f: index
      });
    }),
    K: $data.formData.photos.length < 9
  }, $data.formData.photos.length < 9 ? {
    L: common_vendor.o((...args) => $options.choosePhoto && $options.choosePhoto(...args))
  } : {}, {
    M: $data.aiAnalysisResults.length > 0
  }, $data.aiAnalysisResults.length > 0 ? {
    N: common_vendor.f($data.aiAnalysisResults, (result, index, i0) => {
      return {
        a: result.photoUrl,
        b: common_vendor.t(result.time),
        c: common_vendor.t(result.analysis),
        d: common_vendor.t(result.solution),
        e: index
      };
    })
  } : {}, {
    O: common_vendor.o((...args) => $options.saveDraft && $options.saveDraft(...args)),
    P: common_vendor.t($data.submitting ? "提交中..." : "发布需求"),
    Q: common_vendor.o((...args) => $options.submitDemand && $options.submitDemand(...args)),
    R: $data.submitting,
    S: $data.showLanguagePicker
  }, $data.showLanguagePicker ? {
    T: common_vendor.o((...args) => $options.closeLanguagePicker && $options.closeLanguagePicker(...args)),
    U: common_vendor.f($data.languageList, (lang, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(lang),
        b: $data.selectedLanguage === lang
      }, $data.selectedLanguage === lang ? {} : {}, {
        c: index,
        d: $data.selectedLanguage === lang ? 1 : "",
        e: common_vendor.o(($event) => $options.selectLanguage(lang), index)
      });
    }),
    V: common_vendor.o(() => {
    }),
    W: common_vendor.o((...args) => $options.closeLanguagePicker && $options.closeLanguagePicker(...args))
  } : {}, {
    X: $data.largeFontMode ? 1 : "",
    Y: common_vendor.o((...args) => $options.closeSelectDropdown && $options.closeSelectDropdown(...args)),
    Z: common_vendor.o((...args) => $options.closeSelectDropdown && $options.closeSelectDropdown(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-047632cd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/demand/create.js.map
