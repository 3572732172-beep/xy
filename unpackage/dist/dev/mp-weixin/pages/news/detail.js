"use strict";
const common_vendor = require("../../common/vendor.js");
const common_htmlParser = require("../../common/html-parser.js");
const _sfc_main = {
  data() {
    return {
      banner: {},
      content: [],
      comments: []
    };
  },
  onShareAppMessage() {
    return {
      title: this.banner.title || "案例详情",
      path: "/pages/news/detail?query=" + encodeURIComponent(JSON.stringify(this.banner))
    };
  },
  onLoad(options) {
    let queryParam = options.query || options;
    if (typeof queryParam === "string") {
      this.load(queryParam);
    } else if (queryParam && typeof queryParam === "object") {
      this.banner = queryParam;
      common_vendor.index.setNavigationBarTitle({
        title: this.banner.title || "案例详情"
      });
      this.getDetail();
      this.loadComments();
    } else {
      common_vendor.index.__f__("error", "at pages/news/detail.nvue:92", "未获取到有效参数", options);
      common_vendor.index.showToast({
        title: "参数错误",
        icon: "none"
      });
    }
  },
  methods: {
    load(e) {
      if (!e) {
        common_vendor.index.__f__("error", "at pages/news/detail.nvue:102", "参数为空");
        return;
      }
      let p = e;
      try {
        p = decodeURIComponent(p);
        if (p.includes("%")) {
          try {
            p = decodeURIComponent(p);
          } catch (e2) {
          }
        }
      } catch (decodeError) {
        common_vendor.index.__f__("error", "at pages/news/detail.nvue:120", "参数解码失败:", decodeError);
        p = e;
      }
      try {
        this.banner = JSON.parse(p);
      } catch (parseError) {
        common_vendor.index.__f__("error", "at pages/news/detail.nvue:128", "JSON解析失败:", parseError);
        common_vendor.index.__f__("error", "at pages/news/detail.nvue:129", "原始参数:", e);
        common_vendor.index.__f__("error", "at pages/news/detail.nvue:130", "解码后参数:", p);
        common_vendor.index.showToast({
          title: "数据解析失败",
          icon: "none"
        });
        this.banner = {
          title: "加载失败",
          image_url: "",
          source: "",
          datetime: ""
        };
      }
      common_vendor.index.setNavigationBarTitle({
        title: this.banner.title || "案例详情"
      });
      this.getDetail();
      this.loadComments();
    },
    getDetail() {
      if (this.banner.content) {
        const nodes2 = common_htmlParser.parseHtml(this.banner.content);
        this.content = nodes2;
        return;
      }
      const content = this.generateCaseContent(this.banner);
      const nodes = common_htmlParser.parseHtml(content);
      this.content = nodes;
    },
    generateCaseContent(banner) {
      const title = banner.title || "";
      const master = banner.source || "专业电工";
      const date = banner.datetime || "";
      let content = `<h2>${title}</h2>`;
      content += `<p><strong>施工师傅：</strong>${master}</p>`;
      content += `<p><strong>案例时间：</strong>${date}</p>`;
      content += `<hr/>`;
      if (title.includes("电路改造") || title.includes("用电改造")) {
        content += `<p>本案例详细记录了${master}为客户进行电路改造的完整过程。</p>`;
        content += `<h3>一、现场情况</h3>`;
        content += `<p>客户反映家中电路老化，经常出现跳闸、电压不稳等问题。经过现场检测，发现主要问题包括电路容量不足、电线老化、配电箱配置不合理等。</p>`;
        content += `<h3>二、改造方案</h3>`;
        content += `<p>1. 更换全部室内电线，使用国标铜线</p>`;
        content += `<p>2. 升级配电箱，增加漏电保护器</p>`;
        content += `<p>3. 重新规划电路布局，合理分配负载</p>`;
        content += `<p>4. 增加插座数量，满足现代生活需求</p>`;
        content += `<h3>三、施工过程</h3>`;
        content += `<p>${master}严格按照国家电气施工规范，确保施工质量和安全。整个改造过程历时3天，期间保持与客户的良好沟通。</p>`;
        content += `<h3>四、改造效果</h3>`;
        content += `<p>改造完成后，电路运行稳定，未再出现跳闸现象。客户对改造效果非常满意，称赞${master}专业细致，施工规范。</p>`;
      } else if (title.includes("维修") || title.includes("故障")) {
        content += `<p>本案例详细记录了${master}为客户排除电路故障的完整过程。</p>`;
        content += `<h3>一、故障现象</h3>`;
        content += `<p>客户反映家中电路出现异常，具体表现为频繁跳闸、电器无法正常工作等。</p>`;
        content += `<h3>二、故障诊断</h3>`;
        content += `<p>${master}使用专业工具进行检测，快速定位故障原因。通过系统排查，发现是电路短路/接触不良/过载等问题。</p>`;
        content += `<h3>三、维修方案</h3>`;
        content += `<p>根据故障原因，${master}制定了针对性的维修方案，确保彻底解决问题。</p>`;
        content += `<h3>四、维修效果</h3>`;
        content += `<p>维修完成后，电路恢复正常，客户对${master}的专业技能和服务态度表示高度认可。</p>`;
      } else if (title.includes("维护") || title.includes("保养")) {
        content += `<p>本案例详细记录了${master}为客户进行电器维护的完整过程。</p>`;
        content += `<h3>一、维护需求</h3>`;
        content += `<p>客户希望定期对家中电器进行维护保养，延长使用寿命，确保安全运行。</p>`;
        content += `<h3>二、维护内容</h3>`;
        content += `<p>${master}对客户家中的电器进行了全面检查，包括电路连接、绝缘性能、接地情况等。</p>`;
        content += `<h3>三、维护建议</h3>`;
        content += `<p>${master}向客户提供了专业的维护建议，帮助客户建立正确的用电习惯。</p>`;
        content += `<h3>四、维护效果</h3>`;
        content += `<p>经过维护，电器运行更加稳定，客户对${master}的专业服务表示满意。</p>`;
      } else {
        content += `<p>本案例详细记录了${master}为客户提供专业电工服务的完整过程。</p>`;
        content += `<h3>一、客户需求</h3>`;
        content += `<p>客户遇到了用电相关问题，需要专业电工提供解决方案。</p>`;
        content += `<h3>二、解决方案</h3>`;
        content += `<p>${master}根据客户的具体情况，制定了专业的解决方案，确保问题得到彻底解决。</p>`;
        content += `<h3>三、服务过程</h3>`;
        content += `<p>${master}严格按照规范操作，确保施工质量和安全，期间与客户保持良好沟通。</p>`;
        content += `<h3>四、服务效果</h3>`;
        content += `<p>服务完成后，客户对${master}的专业技能和服务态度表示高度认可，问题得到圆满解决。</p>`;
      }
      return content;
    },
    /**
     * 客户评论（示例静态数据，可替换为接口返回）
     */
    loadComments() {
      this.comments = [
        {
          name: "王先生",
          date: "2024-01-18",
          content: "师傅很专业，沟通顺畅，施工规范，改造后再也没跳闸。"
        },
        {
          name: "李女士",
          date: "2024-01-12",
          content: "响应很快，现场检查细致，给了很多安全用电的建议。"
        },
        {
          name: "陈老板",
          date: "2024-01-05",
          content: "商铺用电改造一次到位，验收顺利，后续还会合作。"
        }
      ];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.banner.image_url,
    b: common_vendor.t($data.banner.title),
    c: common_vendor.t($data.banner.source),
    d: common_vendor.t($data.banner.datetime),
    e: $data.content,
    f: $data.comments && $data.comments.length
  }, $data.comments && $data.comments.length ? {
    g: common_vendor.f($data.comments, (item, idx, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.date),
        c: common_vendor.t(item.content),
        d: idx
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/detail.js.map
