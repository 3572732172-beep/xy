"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "ChatPage",
  data() {
    return {
      currentChatId: "chat-" + Date.now(),
      currentChatTitle: "新建对话",
      messageCount: 0,
      activeFunc: "knowledge",
      inputText: "",
      typing: false,
      scrollTop: 0,
      typingTimer: null,
      historyList: [],
      suggestedQuestions: [
        "如何检查乡村用电安全隐患?",
        "如何正确使用漏电保护器?",
        "电气安全如何预防?"
      ],
      messages: [],
      faqList: [
        {
          q: "如何检查乡村用电安全隐患?",
          keywords: ["检查", "安全隐患", "安全", "隐患", "排查"],
          a: "检查乡村用电安全隐患需要从以下几个方面入手：\n1) 检查配电箱：是否有异味、发热现象，空气开关、漏电保护器动作是否灵敏；\n2) 检查线路：是否有私拉乱接、线皮破损、接头裸露等情况；\n3) 检查插座：是否松动、发热、变色、有异味；\n4) 检查设备：大功率电器是否独立回路，线径是否匹配；\n5) 检查环境：电线是否被压、被碾压，是否靠近水源等。发现异常应立即断电并联系专业电工处理。"
        },
        {
          q: "如何正确使用漏电保护器?",
          keywords: ["漏电保护器", "漏保", "漏电", "保护器"],
          a: "正确使用漏电保护器的方法：\n1) 每月按下试验按钮，确保能正常跳闸；\n2) 确认漏电保护器动作电流符合要求（一般30mA）；\n3) 如果频繁跳闸，先逐个断开设备排查漏电点；\n4) 不能随意增大动作电流或拆除漏电保护器；\n5) 定期检查漏电保护器外观，确保无损坏、无变形；\n6) 配合接地系统使用，确保接地良好。如遇异常，应请专业电工检查。"
        },
        {
          q: "电气安全如何预防?",
          keywords: ["预防", "安全", "电气安全", "如何预防"],
          a: "预防电气事故的措施包括：\n1) 定期检查：每季度检查漏电保护器，半年巡检一次线路外观；\n2) 合理用电：不超负荷用电，大功率电器独立回路；\n3) 使用合格产品：选择符合国家标准的电器设备和材料；\n4) 规范安装：由持证电工进行安装和改造；\n5) 加强教育：提高安全用电意识，掌握基本安全知识；\n6) 及时维护：发现老化、损坏的设备及时更换；\n7) 建立制度：建立用电安全管理制度，定期排查隐患。"
        },
        {
          q: "频繁跳闸怎么办？",
          keywords: ["跳闸", "频繁跳闸", "跳了"],
          a: "频繁跳闸的处理方法：\n1) 先检查是否有大功率设备同时运行导致过载；\n2) 复位空开/漏保后观察，看是否继续跳闸；\n3) 若仍跳闸，逐个断开设备排查，找出问题设备；\n4) 检查线路是否有短路、漏电情况；\n5) 检查空开容量是否匹配用电负荷；\n6) 如果自己无法排查，建议减少负载或请专业师傅排查线路漏电/短路问题。"
        },
        {
          q: "插座发热/有焦味怎么办？",
          keywords: ["插座", "发热", "焦味", "烫", "冒烟"],
          a: "插座发热或有焦味的紧急处理：\n1) 立即断电停止使用该插座；\n2) 检查是否接触不良或过载导致的；\n3) 绝对不要继续使用该插座，避免引发火灾；\n4) 尽快联系专业电工检查线路和更换插座；\n5) 检查连接的电器设备是否正常；\n6) 如果是过载导致的，减少该回路的用电负荷。"
        },
        {
          q: "漏电保护器老是跳？",
          keywords: ["漏电保护器", "漏保", "老是跳", "一直跳"],
          a: "漏电保护器频繁跳闸的排查：\n1) 可能存在漏电隐患或设备老化问题；\n2) 先逐个断开设备排查，找出导致跳闸的设备；\n3) 检查线路绝缘是否良好，是否有破损；\n4) 检查接地是否良好；\n5) 若自己无法排查，建议请专业师傅做绝缘/漏电检测；\n6) 不要随意增大动作电流或拆除漏电保护器。"
        },
        {
          q: "新装电器需要单独回路吗？",
          keywords: ["新装", "单独回路", "回路", "安装"],
          a: "新装电器的回路要求：\n1) 大功率电器（空调、热水器、烤箱、电磁炉等）建议单独回路；\n2) 每个独立回路需要配备独立的空气开关；\n3) 线径和开关容量需匹配设备功率（例如：1.5kW用2.5平方线，3kW用4平方线）；\n4) 避免多个大功率电器共用一个回路；\n5) 安装前应请专业电工评估用电负荷，合理规划电路。"
        }
      ]
    };
  },
  onLoad() {
    this.loadHistory();
  },
  methods: {
    createNewChat() {
      const newId = "chat-" + Date.now();
      const newTitle = "新建对话";
      this.currentChatId = newId;
      this.currentChatTitle = newTitle;
      this.messages = [];
      this.messageCount = 0;
      this.inputText = "";
      this.historyList.unshift({ id: newId, title: newTitle });
      if (this.historyList.length > 20) {
        this.historyList = this.historyList.slice(0, 20);
      }
      this.saveHistory();
    },
    selectChat(chatId) {
      this.currentChatId = chatId;
      const chat = this.historyList.find((item) => item.id === chatId);
      if (chat) {
        this.currentChatTitle = chat.title;
        this.messages = [];
        this.messageCount = 0;
      }
    },
    setActiveFunc(func) {
      this.activeFunc = func;
    },
    selectQuestion(question) {
      this.inputText = question;
      this.handleSend();
    },
    handleSend() {
      const text = (this.inputText || "").trim();
      if (!text)
        return;
      this.messages.push({ role: "user", text, displayText: text });
      this.messageCount++;
      this.inputText = "";
      if (this.messages.length === 1) {
        this.currentChatTitle = text.length > 20 ? text.substring(0, 20) + "..." : text;
        let chat = this.historyList.find((item) => item.id === this.currentChatId);
        if (chat) {
          chat.title = this.currentChatTitle;
        } else {
          chat = { id: this.currentChatId, title: this.currentChatTitle };
          this.historyList.unshift(chat);
          if (this.historyList.length > 20) {
            this.historyList = this.historyList.slice(0, 20);
          }
        }
        this.saveHistory();
      }
      this.typing = true;
      this.scrollToBottom();
      const self = this;
      setTimeout(() => {
        self.typing = false;
        const reply = self.makeAiReply(text);
        if (!reply) {
          return;
        }
        const aiMessage = { role: "ai", text: reply, displayText: "" };
        self.messages.push(aiMessage);
        const messageIndex = self.messages.length - 1;
        self.scrollToBottom();
        self.startTypingEffect(messageIndex, reply);
      }, 900 + Math.random() * 600);
    },
    makeAiReply(text) {
      const normalizedText = text.trim().toLowerCase();
      const exactMatch = this.faqList.find((item) => {
        const normalizedQ = item.q.trim().toLowerCase().replace(/[？?]/g, "");
        return normalizedText === normalizedQ || normalizedText.includes(normalizedQ) || normalizedQ.includes(normalizedText);
      });
      if (exactMatch)
        return exactMatch.a;
      const keywordMatch = this.faqList.find((item) => {
        if (item.keywords && item.keywords.length > 0) {
          return item.keywords.some((keyword) => normalizedText.includes(keyword.toLowerCase()));
        }
        return false;
      });
      if (keywordMatch)
        return keywordMatch.a;
      const partialMatch = this.faqList.find((item) => {
        const questionWords = item.q.replace(/[？?]/g, "").split(/[\s，,、]/).filter((w) => w.length > 1);
        return questionWords.some((word) => normalizedText.includes(word.toLowerCase()));
      });
      if (partialMatch)
        return partialMatch.a;
      const electricKeywords = ["电", "用电", "电力", "线路", "漏电", "跳闸", "配电", "插座", "电器", "安全", "隐患", "检查"];
      const hasElectricKeyword = electricKeywords.some((k) => normalizedText.includes(k));
      if (hasElectricKeyword) {
        return [
          "电力自查方案：",
          "1) 线路与电箱：检查配电箱是否有异味/发热，空气开关、漏保动作是否灵敏；确认各回路负荷分配，避免大功率集中在同一回路；观察是否有私拉乱接、线皮破损、接头裸露，发现立即停用并重新压接或更换。",
          "2) 接地与漏保：确认主接地良好（接地线、接地排无松动、无锈蚀），卫生间/厨房/户外插座必须接地；按下漏电保护器试验键，能正常跳闸；若频繁跳闸，逐个断开设备排查漏电点。",
          "3) 插座与负载：检查插座是否松动、发热、变色、异味；避免一个插座拖多个大功率（电磁炉/热水器/空调/电饭煲等）并行；户外和潮湿场景使用防溅/防水插座，定期紧固端子螺丝。",
          "4) 设备与环境：大功率电器建议独立回路并匹配线径/空开；老旧或损坏的插排、插头及时更换；电线不可压在门缝、窗缝或被重物碾压，避免被宠物啃咬；雨天注意户外临时线路防水、防触电。",
          "5) 日常检测：每季度压测漏电保护器；半年巡检一次线路外观与接头；出现焦味/异响/发热/火花立刻断电，先排查再送电；确有隐患时，联系持证电工现场处理，避免自行带电操作。",
          "请结合现场实际执行，如有异常务必先断电，再联系专业人士。"
        ].join("\n");
      }
      const replies = {
        knowledge: [
          "乡村用电安全知识包括：定期检查电线是否老化、破损；确保电箱接地良好；使用符合国家标准的电器设备；避免私拉乱接电线；定期检查漏电保护器是否正常工作。",
          "安全用电的基本原则：不超负荷用电；不使用破损的插头、插座；不在一个插座上连接过多电器；定期检查线路和电器设备；发现异常及时断电并联系专业人员。"
        ],
        emergency: [
          "遇到用电紧急情况时：1.立即切断电源；2.使用干木棒等绝缘物将电线移开；3.不要直接用手接触触电者；4.及时拨打急救电话；5.在专业人员到达前，保持现场安全。",
          "电气火灾应急处理：1.立即切断电源，拉下总开关；2.使用绝缘工具隔离电源，切勿用水扑救；3.使用不导电的灭火材料（如干沙、干粉等）；4.及时报警并说明是电气火灾；5.确保人员安全撤离到安全区域。"
        ],
        prevention: [
          "预防用电事故的措施：定期检查线路和设备；安装漏电保护器；合理分配用电负荷；使用合格电器产品；加强安全用电教育；建立用电安全管理制度。",
          "预防电气事故的关键：选择合适规格的电线和开关；正确安装和使用电器；定期维护和检查；及时更换老化设备；提高安全意识和操作技能。"
        ]
      };
      const funcReplies = replies[this.activeFunc] || replies.knowledge;
      return funcReplies[Math.floor(Math.random() * funcReplies.length)];
    },
    getMessageText(msg) {
      if (msg.role === "user") {
        return msg.text || "";
      }
      if (msg.role === "ai") {
        return msg.displayText && msg.displayText.length > 0 ? msg.displayText : msg.text || "";
      }
      return msg.text || "";
    },
    copyContent() {
      common_vendor.index.setClipboardData({
        data: this.messages.map((msg) => `${msg.role === "user" ? "我" : "AI"}: ${msg.text}`).join("\n"),
        success: () => {
          common_vendor.index.showToast({
            title: "已复制",
            icon: "success"
          });
        }
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 99999;
      });
    },
    loadHistory() {
      const saved = common_vendor.index.getStorageSync("chat-history");
      if (saved && Array.isArray(saved)) {
        this.historyList = saved;
      }
    },
    saveHistory() {
      common_vendor.index.setStorageSync("chat-history", this.historyList);
    },
    goHome() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    },
    startTypingEffect(messageIndex, fullText) {
      let charIndex = 0;
      const speed = 50;
      const self = this;
      if (self.typingTimer) {
        clearInterval(self.typingTimer);
      }
      if (!self.messages[messageIndex]) {
        return;
      }
      self.$set(self.messages[messageIndex], "displayText", "");
      self.$nextTick(() => {
        self.typingTimer = setInterval(() => {
          if (charIndex < fullText.length) {
            const displayText = fullText.substring(0, charIndex + 1);
            self.$set(self.messages[messageIndex], "displayText", displayText);
            charIndex++;
            if (charIndex % 5 === 0) {
              self.$nextTick(() => {
                self.scrollToBottom();
              });
            }
          } else {
            clearInterval(self.typingTimer);
            self.typingTimer = null;
            self.$set(self.messages[messageIndex], "displayText", fullText);
            self.$nextTick(() => {
              self.scrollToBottom();
            });
          }
        }, speed);
      });
    },
    deleteChat(chatId, index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条对话记录吗？",
        success: (res) => {
          if (res.confirm) {
            if (this.currentChatId === chatId) {
              if (this.historyList.length > 1) {
                const remainingList = this.historyList.filter((item) => item.id !== chatId);
                if (remainingList.length > 0) {
                  this.selectChat(remainingList[0].id);
                } else {
                  this.createNewChat();
                }
              } else {
                this.createNewChat();
              }
            }
            this.historyList = this.historyList.filter((item) => item.id !== chatId);
            this.saveHistory();
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
    a: common_vendor.o((...args) => $options.createNewChat && $options.createNewChat(...args)),
    b: common_vendor.f($data.historyList, (item, idx, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.o(($event) => $options.selectChat(item.id), idx),
        c: common_vendor.o(($event) => $options.deleteChat(item.id, idx), idx),
        d: idx,
        e: common_vendor.n({
          active: $data.currentChatId === item.id
        })
      };
    }),
    c: common_vendor.o((...args) => $options.goHome && $options.goHome(...args)),
    d: common_vendor.t($data.currentChatTitle),
    e: common_vendor.t($data.messageCount),
    f: common_vendor.o((...args) => $options.copyContent && $options.copyContent(...args)),
    g: $data.messages.length === 0
  }, $data.messages.length === 0 ? {
    h: common_vendor.n({
      active: $data.activeFunc === "knowledge"
    }),
    i: common_vendor.o(($event) => $options.setActiveFunc("knowledge")),
    j: common_vendor.n({
      active: $data.activeFunc === "emergency"
    }),
    k: common_vendor.o(($event) => $options.setActiveFunc("emergency")),
    l: common_vendor.n({
      active: $data.activeFunc === "prevention"
    }),
    m: common_vendor.o(($event) => $options.setActiveFunc("prevention")),
    n: common_vendor.f($data.suggestedQuestions, (q, idx, i0) => {
      return {
        a: common_vendor.t(q),
        b: idx,
        c: common_vendor.o(($event) => $options.selectQuestion(q), idx)
      };
    })
  } : {}, {
    o: $data.messages.length > 0
  }, $data.messages.length > 0 ? common_vendor.e({
    p: common_vendor.f($data.messages, (msg, idx, i0) => {
      return {
        a: common_vendor.t($options.getMessageText(msg)),
        b: common_vendor.n(msg.role),
        c: idx,
        d: common_vendor.n(msg.role)
      };
    }),
    q: $data.typing
  }, $data.typing ? {} : {}) : {}, {
    r: $data.scrollTop,
    s: common_vendor.o((...args) => $options.handleSend && $options.handleSend(...args)),
    t: $data.inputText,
    v: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    w: common_vendor.o((...args) => $options.handleSend && $options.handleSend(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ec1468d8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/chat/index.js.map
