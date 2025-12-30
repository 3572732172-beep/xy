"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isCareMode: true,
      pos: {
        x: 0,
        y: 600
      },
      isExpanded: false,
      showChat: false,
      showVisualMenu: false,
      userInput: "",
      typing: false,
      // 🆕 机器人情绪状态：normal(蓝) | danger(红) | success(绿)
      robotMood: "normal",
      loadingTimer: null,
      scrollMsgId: "",
      eyeStyle: "transform: translate(0, 0)",
      currentTime: "",
      isVoiceMode: false,
      isRecording: false,
      isVoiceFlow: false,
      diagnosisStep: 0,
      messages: [{
        role: "ai",
        type: "text",
        text: "老人家，有什么用电的事儿您尽管问我。"
      }],
      faqList: [
        {
          q: "家里突然没电了",
          key: "outage",
          a: "老人家先别慌，看看邻居家亮不亮？如果邻居家有电，可能是您家欠费了或者闸跳了。"
        },
        {
          q: "总是莫名其妙跳闸",
          key: "trip",
          a: "可能是家里大功率电器开多了，空调和电磁炉不要同时开哦。"
        },
        {
          q: "怎么手机交费？",
          key: "pay",
          a: "不麻烦哒，打开微信，点“我”-“服务”-“生活缴费”，选“电费”就行。"
        },
        {
          q: "插座冒火花/发烫",
          key: "danger",
          a: "危险！！！赶紧停用这个插座！先把插头拔了，千万别用手碰！"
        },
        {
          q: "灯泡闪烁不停",
          key: "fix",
          a: "灯泡总闪费眼睛，可能是灯头松了，等天亮了找人拧紧试试。"
        },
        {
          q: "出门要关总闸吗？",
          key: "safe",
          a: "如果您出远门好几天，关了总闸就放心。要是只出门半天，关掉空调电视就行。"
        }
      ],
      visualFaqList: [
        {
          text: "家里没电",
          icon: "⚡️",
          key: "outage",
          bgColor: "#FEF2F2",
          q: "家里突然没电了"
        },
        {
          text: "教我交费",
          icon: "📱",
          key: "pay",
          bgColor: "#ECFDF5",
          q: "我想学手机交费"
        },
        {
          text: "插座冒火",
          icon: "🔥",
          key: "danger",
          bgColor: "#FFF1F2",
          q: "插座冒烟了！"
        },
        {
          text: "跳闸了",
          icon: "🔌",
          key: "trip",
          bgColor: "#F0F9FF",
          q: "总是跳闸怎么办"
        },
        {
          text: "灯泡坏了",
          icon: "💡",
          key: "fix",
          bgColor: "#FFFBEB",
          q: "灯泡坏了怎么换"
        },
        {
          text: "呼叫子女",
          icon: "☎",
          key: "emergency",
          bgColor: "#FEE2E2",
          q: "紧急呼叫"
        }
      ]
    };
  },
  mounted() {
    this.initPosition();
  },
  onReady() {
    this.initPosition();
  },
  methods: {
    initPosition() {
      const sys = common_vendor.index.getSystemInfoSync();
      this.pos.y = sys.windowHeight - 1040;
      this.pos.x = sys.windowWidth - 700;
      this.updateTime();
    },
    updateTime() {
      const now = /* @__PURE__ */ new Date();
      this.currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    },
    handleRobotClick() {
      if (!this.isExpanded) {
        this.isExpanded = true;
        this.vibrate();
      } else {
        this.showChat = true;
        this.updateTime();
        this.scrollDown();
      }
    },
    closeChat() {
      this.showChat = false;
      this.isExpanded = false;
      this.showVisualMenu = false;
    },
    // 🆕 震动辅助函数
    vibrate() {
      common_vendor.index.vibrateShort();
    },
    // 🆕 切换模式
    toggleCareMode() {
      this.isCareMode = !this.isCareMode;
      this.vibrate();
    },
    handleClearHistory() {
      this.vibrate();
      common_vendor.index.showModal({
        title: "清空确认",
        content: "确定要清空所有聊天记录，重新开始吗？",
        confirmText: "清空",
        confirmColor: "#FF3B30",
        success: (res) => {
          if (res.confirm) {
            this.messages = [{
              role: "ai",
              type: "text",
              text: "老人家，记录已清空。有什么用电的事儿您尽管问我。"
            }];
            this.diagnosisStep = 0;
            this.isVoiceFlow = false;
            this.isRecording = false;
            this.typing = false;
            this.robotMood = "normal";
            if (this.loadingTimer)
              clearInterval(this.loadingTimer);
            common_vendor.index.showToast({
              title: "已重新开始",
              icon: "none"
            });
          }
        }
      });
    },
    scrollDown() {
      this.$nextTick(() => {
        this.scrollMsgId = "";
        this.$nextTick(() => {
          if (this.typing) {
            this.scrollMsgId = "msg-typing";
          } else {
            this.scrollMsgId = "msg-" + (this.messages.length - 1);
          }
        });
      });
    },
    toggleVoiceMode() {
      this.isVoiceMode = !this.isVoiceMode;
      this.vibrate();
    },
    startRecord() {
      this.isRecording = true;
      this.vibrate();
    },
    endRecord() {
      if (!this.isRecording)
        return;
      this.isRecording = false;
      common_vendor.index.showLoading({
        title: "语音转文字中...",
        mask: true
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        let mockText = "";
        switch (this.diagnosisStep) {
          case 0:
            mockText = "我灶屋里的灯不亮喔！";
            break;
          case 1:
            mockText = "就系灶屋里冇得电，房里都系亮地撒";
            break;
          case 2:
            mockText = "冰箱还在响，电视也能看，就系灯唔亮喔";
            break;
          case 3:
            mockText = "电表系麻个呀？我完全冇听到声音";
            break;
          default:
            mockText = "我不太清楚，你帮我看看";
        }
        this.userInput = mockText;
        this.isVoiceFlow = true;
        setTimeout(() => {
          this.onSend();
        }, 600);
      }, 800);
    },
    handleCamera() {
      common_vendor.index.showActionSheet({
        itemList: ["拍摄插座/线路", "从相册选择"],
        success: (res) => {
          this.messages.push({
            role: "user",
            type: "text",
            text: "【发送了一张照片】帮我看看这个插座安全吗？"
          });
          this.scrollDown();
          this.typing = true;
          setTimeout(() => {
            this.typing = false;
            this.robotMood = "danger";
            this.vibrate();
            this.messages.push({
              role: "ai",
              type: "report",
              result: "检测到面板焦黑、插孔变形，存在严重接触不良和过热风险！建议立即停止使用并更换。"
            });
            this.scrollDown();
          }, 1500);
        }
      });
    },
    handleQuickFix() {
      this.vibrate();
      this.messages.push({
        role: "user",
        type: "text",
        text: "立即报修"
      });
      this.scrollDown();
      this.typing = true;
      setTimeout(() => {
        this.typing = false;
        this.messages.push({
          role: "ai",
          type: "order",
          status: "pending",
          info: {
            type: "插座面板更换",
            level: "一般 (轻度隐患)",
            time: "约 20 分钟",
            desc: "经AI视觉检测，插座面板存在轻微烧蚀痕迹。为防止老化加剧，建议更换新面板。"
          }
        });
        this.scrollDown();
      }, 1e3);
    },
    onSend() {
      if (!this.userInput.trim())
        return;
      this.updateTime();
      const text = this.userInput;
      this.messages.push({
        role: "user",
        type: "text",
        text
      });
      this.userInput = "";
      this.typing = true;
      this.scrollDown();
      setTimeout(() => {
        this.typing = false;
        const dangerWords = ["火", "烟", "冒泡", "烫", "电人", "触电", "火花"];
        const isDanger = dangerWords.some((word) => text.includes(word));
        if (isDanger) {
          this.robotMood = "danger";
          this.vibrate();
          common_vendor.index.showModal({
            title: "⚠️ 紧急安全提示",
            content: "老人家，发现用电危险！请立即【离开故障房间】，千万不要用手摸！\n\n如果能看到门口的总闸，请先【拉闸断电】！需要帮您联系供电所吗？",
            confirmText: "去拉闸",
            cancelText: "呼叫供电所",
            success: (res) => {
              if (res.cancel)
                common_vendor.index.makePhoneCall({
                  phoneNumber: "95598"
                });
            }
          });
          this.messages.push({
            role: "ai",
            type: "text",
            text: "⚠️ 检测到用电风险！请保持距离，我已经为您准备了紧急联系方式。"
          });
          this.scrollDown();
          return;
        }
        if (this.isVoiceFlow || this.diagnosisStep > 0) {
          this.processVoiceDiagnosis(text);
        } else {
          this.handleNormalReply(text);
        }
        this.scrollDown();
      }, 1500);
    },
    processVoiceDiagnosis(text) {
      if (this.diagnosisStep === 0) {
        if (text.includes("灯") || text.includes("亮") || text.includes("黑")) {
          this.diagnosisStep = 1;
          this.messages.push({
            role: "ai",
            type: "text",
            text: "收到。AI正在进行故障排查。\n\n请问是全屋都没电，还是只有厨房这一个地方没电？"
          });
          return;
        }
        this.handleNormalReply(text);
        this.isVoiceFlow = false;
        return;
      }
      if (this.diagnosisStep === 1) {
        this.diagnosisStep = 2;
        this.messages.push({
          role: "ai",
          type: "text",
          text: "好的，说明主线路可能没问题。\n\n那您试试，其他的电器（比如冰箱、电视）还能正常用吗？"
        });
        return;
      }
      if (this.diagnosisStep === 2) {
        this.diagnosisStep = 3;
        this.messages.push({
          role: "ai",
          type: "text",
          text: "明白，范围缩小至照明回路。\n\n最后确认一下，您最近有没有听到电表箱“啪”的一声跳闸的声音？"
        });
        return;
      }
      if (this.diagnosisStep === 3) {
        this.typing = true;
        this.scrollDown();
        setTimeout(() => {
          this.typing = false;
          this.messages.push({
            role: "ai",
            type: "order",
            status: "pending",
            info: {
              type: "厨房照明线路故障",
              level: "中 (局部故障)",
              time: "约 30 分钟",
              desc: "根据AI多轮诊断，初步判断为灯泡老化或单路开关接触不良，非主线路故障。"
            }
          });
          this.diagnosisStep = 0;
          this.isVoiceFlow = false;
          this.scrollDown();
        }, 1e3);
        return;
      }
    },
    handleNormalReply(text) {
      if (text.includes("pay") || text.includes("交费") || text.includes("钱")) {
        this.messages.push({
          role: "ai",
          type: "text",
          text: "交电费别着急，我给您找了一个视频，您跟着做就行："
        });
        this.messages.push({
          role: "ai",
          type: "video",
          title: "手把手教您微信交电费"
        });
        return;
      }
      if (text.includes("修")) {
        this.vibrate();
        common_vendor.index.showModal({
          title: "⚠️ 安全警示",
          content: "老人家，如果要自己动手修，请务必确保：\n1. 双手干燥\n2. 脚下无积水\n3. 不要触摸裸露线头",
          confirmText: "我已确保安全",
          confirmColor: "#FF3B30",
          success: (res) => {
            if (res.confirm) {
              this._realReply(text);
            }
          }
        });
        return;
      }
      this._realReply(text);
    },
    _realReply(text) {
      let reply = "";
      const faq = this.faqList.find((f) => text.includes(f.key) || text.includes(f.q.substring(0, 2)));
      if (faq) {
        reply = faq.a;
      } else if (text.includes("灯") || text.includes("不亮")) {
        reply = "灯泡总闪费眼睛，可能是灯头松了，等天亮了找人拧紧试试。";
      } else {
        reply = "这个问题太专业了，要不您点一下那个相机图标，拍个照给我看看？或者点击“人工客服”。";
      }
      this.messages.push({
        role: "ai",
        type: "text",
        text: reply
      });
    },
    resetDiagnosis() {
      this.diagnosisStep = 0;
      this.robotMood = "normal";
      this.vibrate();
      this.messages.push({
        role: "ai",
        type: "text",
        text: "好的，我们重新开始。请告诉我您遇到了什么问题？"
      });
      this.scrollDown();
    },
    submitOrder(index) {
      common_vendor.index.showLoading({
        title: "正在呼叫..."
      });
      const masterList = [
        {
          name: "王建国师傅",
          id: "021",
          dist: "1.2km",
          time: "15分钟"
        },
        {
          name: "李强师傅",
          id: "033",
          dist: "0.8km",
          time: "8分钟"
        },
        {
          name: "王五师傅",
          id: "014",
          dist: "1.8km",
          time: "19分钟"
        },
        {
          name: "陈云师傅",
          id: "029",
          dist: "1.7km",
          time: "9分钟"
        }
      ];
      setTimeout(() => {
        common_vendor.index.hideLoading();
        if (this.messages[index]) {
          const randomIdx = Math.floor(Math.random() * masterList.length);
          const selectedMaster = masterList[randomIdx];
          if (this.$set) {
            this.$set(this.messages[index], "master", selectedMaster);
            this.$set(this.messages[index], "status", "dispatched");
          } else {
            this.messages[index].master = selectedMaster;
            this.messages[index].status = "dispatched";
          }
        }
        this.robotMood = "success";
        this.vibrate();
        common_vendor.index.showToast({
          title: "派单成功！",
          icon: "success"
        });
        this.scrollDown();
      }, 1500);
    },
    sendFaq(item) {
      this.messages.push({
        role: "user",
        type: "text",
        text: item.q
      });
      this.typing = true;
      this.scrollDown();
      setTimeout(() => {
        this.typing = false;
        if (item.a) {
          this.messages.push({
            role: "ai",
            type: "text",
            text: item.a
          });
        } else {
          this.handleNormalReply(item.key || item.q);
        }
        this.scrollDown();
      }, 800);
    },
    handleVisualClick(item) {
      this.vibrate();
      if (item.key === "emergency") {
        common_vendor.index.showModal({
          title: "⚠️ 紧急联系",
          content: "即将为您拨打紧急联系人电话 (儿子)",
          confirmText: "立即拨打",
          confirmColor: "#FF3B30",
          success: (res) => {
            if (res.confirm)
              common_vendor.index.makePhoneCall({
                phoneNumber: "13888888888"
              });
          }
        });
        return;
      }
      this.showVisualMenu = false;
      this.sendFaq(item);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n($data.robotMood),
    b: common_vendor.s($data.eyeStyle),
    c: common_vendor.n($data.robotMood),
    d: common_vendor.s($data.eyeStyle),
    e: !$data.isExpanded ? 1 : "",
    f: $data.pos.x,
    g: $data.pos.y,
    h: common_vendor.o((...args) => $options.handleRobotClick && $options.handleRobotClick(...args)),
    i: $data.showChat
  }, $data.showChat ? common_vendor.e({
    j: common_vendor.t($data.isCareMode ? "👴" : "👓"),
    k: common_vendor.t($data.isCareMode ? "大大" : "标准"),
    l: common_vendor.o((...args) => $options.toggleCareMode && $options.toggleCareMode(...args)),
    m: $data.isCareMode ? 1 : "",
    n: common_vendor.o((...args) => $options.handleClearHistory && $options.handleClearHistory(...args)),
    o: common_vendor.o(($event) => $data.showVisualMenu = true),
    p: common_vendor.o((...args) => $options.closeChat && $options.closeChat(...args)),
    q: common_vendor.t($data.diagnosisStep > 0 ? "👨‍⚕️" : "⚡️"),
    r: $data.diagnosisStep === 0
  }, $data.diagnosisStep === 0 ? {} : {
    s: common_vendor.t($data.diagnosisStep)
  }, {
    t: $data.diagnosisStep > 0 ? 1 : "",
    v: common_vendor.t($data.currentTime),
    w: common_vendor.f($data.messages, (msg, index, i0) => {
      return common_vendor.e({
        a: msg.role === "ai"
      }, msg.role === "ai" ? {} : {}, {
        b: msg.type === "text"
      }, msg.type === "text" ? common_vendor.e({
        c: common_vendor.t(msg.text),
        d: msg.role === "ai"
      }, msg.role === "ai" ? {} : {}) : msg.type === "video" ? {
        f: common_vendor.t(msg.title)
      } : msg.type === "report" ? {
        h: common_vendor.t(msg.result),
        i: common_vendor.o((...args) => $options.handleQuickFix && $options.handleQuickFix(...args), index)
      } : msg.type === "order" ? common_vendor.e({
        k: common_vendor.t(msg.status === "dispatched" ? "已接单" : "待派单"),
        l: msg.status === "dispatched" ? 1 : "",
        m: common_vendor.t(Date.now().toString().slice(-8)),
        n: common_vendor.t(msg.info.type),
        o: common_vendor.t(msg.info.level),
        p: common_vendor.n(msg.info.level.includes("轻") ? "warning" : "danger-text"),
        q: common_vendor.t(msg.info.desc),
        r: common_vendor.t(msg.info.time),
        s: msg.status === "dispatched" && msg.master
      }, msg.status === "dispatched" && msg.master ? {
        t: common_vendor.t(msg.master.name),
        v: common_vendor.t(msg.master.id),
        w: common_vendor.t(msg.master.dist),
        x: common_vendor.t(msg.master.time)
      } : {}, {
        y: msg.status !== "dispatched"
      }, msg.status !== "dispatched" ? {
        z: common_vendor.o((...args) => $options.resetDiagnosis && $options.resetDiagnosis(...args), index),
        A: common_vendor.o(($event) => $options.submitOrder(index), index)
      } : {}) : {}, {
        e: msg.type === "video",
        g: msg.type === "report",
        j: msg.type === "order",
        B: index,
        C: "msg-" + index,
        D: common_vendor.n(msg.role)
      });
    }),
    x: $data.typing
  }, $data.typing ? {} : {}, {
    y: $data.isRecording
  }, $data.isRecording ? {} : {}, {
    z: $data.scrollMsgId,
    A: common_vendor.t($data.isVoiceMode ? "⌨️" : "🎤"),
    B: common_vendor.o((...args) => $options.toggleVoiceMode && $options.toggleVoiceMode(...args)),
    C: !$data.isVoiceMode
  }, !$data.isVoiceMode ? {
    D: common_vendor.o((...args) => $options.onSend && $options.onSend(...args)),
    E: $data.userInput,
    F: common_vendor.o(($event) => $data.userInput = $event.detail.value)
  } : {
    G: common_vendor.t($data.typing ? "AI 正在思考..." : $data.isRecording ? "松开 结束" : "按住 说话"),
    H: $data.isRecording ? 1 : "",
    I: $data.typing ? 1 : "",
    J: common_vendor.o(($event) => !$data.typing && $options.startRecord()),
    K: common_vendor.o(($event) => !$data.typing && $options.endRecord())
  }, {
    L: common_vendor.o((...args) => $options.handleCamera && $options.handleCamera(...args)),
    M: !$data.isVoiceMode
  }, !$data.isVoiceMode ? {
    N: common_vendor.o((...args) => $options.onSend && $options.onSend(...args))
  } : {}, {
    O: common_vendor.o(() => {
    }),
    P: $data.showVisualMenu
  }, $data.showVisualMenu ? {
    Q: common_vendor.o(($event) => $data.showVisualMenu = false),
    R: common_vendor.f($data.visualFaqList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.icon),
        b: common_vendor.t(item.text),
        c: index,
        d: item.bgColor,
        e: common_vendor.o(($event) => $options.handleVisualClick(item), index)
      };
    }),
    S: common_vendor.o(() => {
    }),
    T: common_vendor.o(($event) => $data.showVisualMenu = false)
  } : {}, {
    U: common_vendor.o((...args) => $options.closeChat && $options.closeChat(...args))
  }) : {}, {
    V: $data.isCareMode ? 1 : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-05e1f0e2"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ServiceFloat.js.map
