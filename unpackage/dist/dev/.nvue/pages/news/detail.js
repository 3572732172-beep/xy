import { f as formatAppLog, _ as _export_sfc } from "../../_plugin-vue_export-helper.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, toDisplayString, createVNode, Fragment, renderList } from "vue";
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");
var block = makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");
var inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");
var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");
var special = makeMap("script,style");
function HTMLParser(html, handler) {
  var index;
  var chars;
  var match;
  var stack = [];
  var last = html;
  stack.last = function() {
    return this[this.length - 1];
  };
  while (html) {
    chars = true;
    if (!stack.last() || !special[stack.last()]) {
      if (html.indexOf("<!--") == 0) {
        index = html.indexOf("-->");
        if (index >= 0) {
          if (handler.comment) {
            handler.comment(html.substring(4, index));
          }
          html = html.substring(index + 3);
          chars = false;
        }
      } else if (html.indexOf("</") == 0) {
        match = html.match(endTag);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(endTag, parseEndTag);
          chars = false;
        }
      } else if (html.indexOf("<") == 0) {
        match = html.match(startTag);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(startTag, parseStartTag);
          chars = false;
        }
      }
      if (chars) {
        index = html.indexOf("<");
        var text = index < 0 ? html : html.substring(0, index);
        html = index < 0 ? "" : html.substring(index);
        if (handler.chars) {
          handler.chars(text);
        }
      }
    } else {
      html = html.replace(new RegExp("([\\s\\S]*?)</" + stack.last() + "[^>]*>"), function(all, text2) {
        text2 = text2.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
        if (handler.chars) {
          handler.chars(text2);
        }
        return "";
      });
      parseEndTag("", stack.last());
    }
    if (html == last) {
      throw "Parse Error: " + html;
    }
    last = html;
  }
  parseEndTag();
  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();
    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag("", stack.last());
      }
    }
    if (closeSelf[tagName] && stack.last() == tagName) {
      parseEndTag("", tagName);
    }
    unary = empty[tagName] || !!unary;
    if (!unary) {
      stack.push(tagName);
    }
    if (handler.start) {
      var attrs = [];
      rest.replace(attr, function(match2, name) {
        var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : "";
        attrs.push({
          name,
          value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"')
          // "
        });
      });
      if (handler.start) {
        handler.start(tagName, attrs, unary);
      }
    }
  }
  function parseEndTag(tag, tagName) {
    if (!tagName) {
      var pos = 0;
    } else {
      for (var pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] == tagName) {
          break;
        }
      }
    }
    if (pos >= 0) {
      for (var i = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i]);
        }
      }
      stack.length = pos;
    }
  }
}
function makeMap(str) {
  var obj = {};
  var items = str.split(",");
  for (var i = 0; i < items.length; i++) {
    obj[items[i]] = true;
  }
  return obj;
}
function removeDOCTYPE(html) {
  return html.replace(/<\?xml.*\?>\n/, "").replace(/<!doctype.*>\n/, "").replace(/<!DOCTYPE.*>\n/, "");
}
function parseAttrs(attrs) {
  return attrs.reduce(function(pre, attr2) {
    var value = attr2.value;
    var name = attr2.name;
    if (pre[name]) {
      pre[name] = pre[name] + " " + value;
    } else {
      pre[name] = value;
    }
    return pre;
  }, {});
}
function parseHtml(html) {
  html = removeDOCTYPE(html);
  var stacks = [];
  var results = {
    node: "root",
    children: []
  };
  HTMLParser(html, {
    start: function start(tag, attrs, unary) {
      var node = {
        name: tag
      };
      if (attrs.length !== 0) {
        node.attrs = parseAttrs(attrs);
      }
      if (unary) {
        var parent = stacks[0] || results;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        stacks.unshift(node);
      }
    },
    end: function end(tag) {
      var node = stacks.shift();
      if (node.name !== tag)
        formatAppLog("error", "at common/html-parser.js:303", "invalid state: mismatch end tag");
      if (stacks.length === 0) {
        results.children.push(node);
      } else {
        var parent = stacks[0];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    chars: function chars(text) {
      var node = {
        type: "text",
        text
      };
      if (stacks.length === 0) {
        results.children.push(node);
      } else {
        var parent = stacks[0];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    },
    comment: function comment(text) {
      var node = {
        node: "comment",
        text
      };
      var parent = stacks[0];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    }
  });
  return results.children;
}
const _style_0 = { "banner": { "": { "height": 180, "position": "relative", "backgroundColor": "#cccccc", "flexDirection": "row", "overflow": "hidden" } }, "banner-img": { "": { "flex": 1 } }, "title-area": { "": { "position": "absolute", "left": 15, "right": 15, "bottom": 15, "zIndex": 11 } }, "title-text": { "": { "fontSize": 16, "fontWeight": "400", "lineHeight": 20, "lines": 2, "color": "#ffffff", "overflow": "hidden" } }, "article-meta": { "": { "paddingTop": 10, "paddingRight": 15, "paddingBottom": 10, "paddingLeft": 15, "flexDirection": "row", "alignItems": "center", "justifyContent": "flex-start" } }, "article-meta-text": { "": { "color": "#808080" } }, "article-text": { "": { "fontSize": 12, "lineHeight": 25, "marginTop": 0, "marginRight": 10, "marginBottom": 0, "marginLeft": 10 } }, "article-author": { "": { "fontSize": 15 } }, "article-time": { "": { "fontSize": 15 } }, "article-content": { "": { "fontSize": 15, "paddingTop": 0, "paddingRight": 15, "paddingBottom": 0, "paddingLeft": 15, "marginBottom": 15, "overflow": "hidden" } }, "comment-wrap": { "": { "marginTop": 0, "marginRight": 15, "marginBottom": 30, "marginLeft": 15, "paddingTop": 15, "paddingRight": 15, "paddingBottom": 15, "paddingLeft": 15, "backgroundColor": "#f7f9fb", "borderRadius": 12 } }, "section-title": { "": { "marginBottom": 12 } }, "section-title-text": { "": { "fontSize": 16, "fontWeight": "600", "color": "#333333" } }, "comment-list": { "": { "gap": "12px" } }, "comment-card": { "": { "paddingTop": 12, "paddingRight": 12, "paddingBottom": 12, "paddingLeft": 12, "backgroundColor": "#ffffff", "borderRadius": 10, "marginBottom": 10, "boxShadow": "0 4px 12px rgba(0,0,0,0.04)" } }, "comment-header": { "": { "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginBottom": 6 } }, "comment-name": { "": { "fontSize": 14, "fontWeight": "600", "color": "#2F85FC" } }, "comment-date": { "": { "fontSize": 12, "color": "#999999" } }, "comment-content": { "": { "fontSize": 14, "color": "#333333", "lineHeight": 20 } }, "comment-empty": { "": { "paddingTop": 12, "paddingRight": 0, "paddingBottom": 12, "paddingLeft": 0, "alignItems": "center", "justifyContent": "center" } }, "comment-empty-text": { "": { "fontSize": 14, "color": "#999999" } } };
function parseImgs(nodes) {
  nodes.forEach((node) => {
    if (node.name === "img" && node.attrs && node.attrs["data-img-size-val"]) {
      const sizes = node.attrs["data-img-size-val"].split(",");
      const width = uni.upx2px(720 * 0.9);
      const height = parseInt(width * (sizes[1] / sizes[0]));
      node.attrs.style = `width:${width};height:${height};`;
    }
    if (Array.isArray(node.children)) {
      parseImgs(node.children);
    }
  });
  return nodes;
}
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
      uni.setNavigationBarTitle({
        title: this.banner.title || "案例详情"
      });
      this.getDetail();
      this.loadComments();
    } else {
      formatAppLog("error", "at pages/news/detail.nvue:92", "未获取到有效参数", options);
      uni.showToast({
        title: "参数错误",
        icon: "none"
      });
    }
  },
  methods: {
    load(e) {
      if (!e) {
        formatAppLog("error", "at pages/news/detail.nvue:102", "参数为空");
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
        formatAppLog("error", "at pages/news/detail.nvue:120", "参数解码失败:", decodeError);
        p = e;
      }
      try {
        this.banner = JSON.parse(p);
      } catch (parseError) {
        formatAppLog("error", "at pages/news/detail.nvue:128", "JSON解析失败:", parseError);
        formatAppLog("error", "at pages/news/detail.nvue:129", "原始参数:", e);
        formatAppLog("error", "at pages/news/detail.nvue:130", "解码后参数:", p);
        uni.showToast({
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
      uni.setNavigationBarTitle({
        title: this.banner.title || "案例详情"
      });
      this.getDetail();
      this.loadComments();
    },
    getDetail() {
      if (this.banner.content) {
        const nodes2 = parseHtml(this.banner.content);
        parseImgs(nodes2);
        this.content = nodes2;
        return;
      }
      const content = this.generateCaseContent(this.banner);
      const nodes = parseHtml(content);
      parseImgs(nodes);
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
  const _component_rich_text = resolveComponent("rich-text");
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("view", { class: "content" }, [
      createElementVNode("view", {
        class: "banner",
        autoFocus: ""
      }, [
        createElementVNode("u-image", {
          class: "banner-img",
          src: $data.banner.image_url
        }, null, 8, ["src"]),
        createElementVNode("view", { class: "title-area" }, [
          createElementVNode(
            "u-text",
            { class: "title-text" },
            toDisplayString($data.banner.title),
            1
            /* TEXT */
          )
        ])
      ]),
      createElementVNode("view", { class: "article-meta" }, [
        createElementVNode(
          "u-text",
          { class: "article-meta-text article-author" },
          toDisplayString($data.banner.source),
          1
          /* TEXT */
        ),
        createElementVNode("u-text", { class: "article-meta-text article-text" }, "发表于"),
        createElementVNode(
          "u-text",
          { class: "article-meta-text article-time" },
          toDisplayString($data.banner.datetime),
          1
          /* TEXT */
        )
      ]),
      createElementVNode("view", { class: "article-content" }, [
        createVNode(_component_rich_text, {
          nodes: $data.content,
          style: { "font-size": "14px" }
        }, null, 8, ["nodes"])
      ]),
      createElementVNode("view", { class: "comment-wrap" }, [
        createElementVNode("view", { class: "section-title" }, [
          createElementVNode("u-text", { class: "section-title-text" }, "客户评价")
        ]),
        $data.comments && $data.comments.length ? (openBlock(), createElementBlock("view", {
          key: 0,
          class: "comment-list"
        }, [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($data.comments, (item, idx) => {
              return openBlock(), createElementBlock("view", {
                key: idx,
                class: "comment-card"
              }, [
                createElementVNode("view", { class: "comment-header" }, [
                  createElementVNode(
                    "u-text",
                    { class: "comment-name" },
                    toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  createElementVNode(
                    "u-text",
                    { class: "comment-date" },
                    toDisplayString(item.date),
                    1
                    /* TEXT */
                  )
                ]),
                createElementVNode(
                  "u-text",
                  { class: "comment-content" },
                  toDisplayString(item.content),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (openBlock(), createElementBlock("view", {
          key: 1,
          class: "comment-empty"
        }, [
          createElementVNode("u-text", { class: "comment-empty-text" }, "暂无评价")
        ]))
      ])
    ])
  ]);
}
const detail = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/detail.nvue"]]);
export {
  detail as default
};
