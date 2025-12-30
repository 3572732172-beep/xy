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

  // ../../../../HBuilderProjects/xydianan/unpackage/dist/dev/.nvue/pages/news/detail.js
  var import_vue2 = __toESM(require_vue());
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
  var _style_0 = { "banner": { "": { "height": 180, "position": "relative", "backgroundColor": "#cccccc", "flexDirection": "row", "overflow": "hidden" } }, "banner-img": { "": { "flex": 1 } }, "title-area": { "": { "position": "absolute", "left": 15, "right": 15, "bottom": 15, "zIndex": 11 } }, "title-text": { "": { "fontSize": 16, "fontWeight": "400", "lineHeight": 20, "lines": 2, "color": "#ffffff", "overflow": "hidden" } }, "article-meta": { "": { "paddingTop": 10, "paddingRight": 15, "paddingBottom": 10, "paddingLeft": 15, "flexDirection": "row", "alignItems": "center", "justifyContent": "flex-start" } }, "article-meta-text": { "": { "color": "#808080" } }, "article-text": { "": { "fontSize": 12, "lineHeight": 25, "marginTop": 0, "marginRight": 10, "marginBottom": 0, "marginLeft": 10 } }, "article-author": { "": { "fontSize": 15 } }, "article-time": { "": { "fontSize": 15 } }, "article-content": { "": { "fontSize": 15, "paddingTop": 0, "paddingRight": 15, "paddingBottom": 0, "paddingLeft": 15, "marginBottom": 15, "overflow": "hidden" } }, "comment-wrap": { "": { "marginTop": 0, "marginRight": 15, "marginBottom": 30, "marginLeft": 15, "paddingTop": 15, "paddingRight": 15, "paddingBottom": 15, "paddingLeft": 15, "backgroundColor": "#f7f9fb", "borderRadius": 12 } }, "section-title": { "": { "marginBottom": 12 } }, "section-title-text": { "": { "fontSize": 16, "fontWeight": "600", "color": "#333333" } }, "comment-list": { "": { "gap": "12px" } }, "comment-card": { "": { "paddingTop": 12, "paddingRight": 12, "paddingBottom": 12, "paddingLeft": 12, "backgroundColor": "#ffffff", "borderRadius": 10, "marginBottom": 10, "boxShadow": "0 4px 12px rgba(0,0,0,0.04)" } }, "comment-header": { "": { "flexDirection": "row", "justifyContent": "space-between", "alignItems": "center", "marginBottom": 6 } }, "comment-name": { "": { "fontSize": 14, "fontWeight": "600", "color": "#2F85FC" } }, "comment-date": { "": { "fontSize": 12, "color": "#999999" } }, "comment-content": { "": { "fontSize": 14, "color": "#333333", "lineHeight": 20 } }, "comment-empty": { "": { "paddingTop": 12, "paddingRight": 0, "paddingBottom": 12, "paddingLeft": 0, "alignItems": "center", "justifyContent": "center" } }, "comment-empty-text": { "": { "fontSize": 14, "color": "#999999" } } };
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
  var _sfc_main = {
    data() {
      return {
        banner: {},
        content: [],
        comments: []
      };
    },
    onShareAppMessage() {
      return {
        title: this.banner.title || "\u6848\u4F8B\u8BE6\u60C5",
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
          title: this.banner.title || "\u6848\u4F8B\u8BE6\u60C5"
        });
        this.getDetail();
        this.loadComments();
      } else {
        formatAppLog("error", "at pages/news/detail.nvue:92", "\u672A\u83B7\u53D6\u5230\u6709\u6548\u53C2\u6570", options);
        uni.showToast({
          title: "\u53C2\u6570\u9519\u8BEF",
          icon: "none"
        });
      }
    },
    methods: {
      load(e) {
        if (!e) {
          formatAppLog("error", "at pages/news/detail.nvue:102", "\u53C2\u6570\u4E3A\u7A7A");
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
          formatAppLog("error", "at pages/news/detail.nvue:120", "\u53C2\u6570\u89E3\u7801\u5931\u8D25:", decodeError);
          p = e;
        }
        try {
          this.banner = JSON.parse(p);
        } catch (parseError) {
          formatAppLog("error", "at pages/news/detail.nvue:128", "JSON\u89E3\u6790\u5931\u8D25:", parseError);
          formatAppLog("error", "at pages/news/detail.nvue:129", "\u539F\u59CB\u53C2\u6570:", e);
          formatAppLog("error", "at pages/news/detail.nvue:130", "\u89E3\u7801\u540E\u53C2\u6570:", p);
          uni.showToast({
            title: "\u6570\u636E\u89E3\u6790\u5931\u8D25",
            icon: "none"
          });
          this.banner = {
            title: "\u52A0\u8F7D\u5931\u8D25",
            image_url: "",
            source: "",
            datetime: ""
          };
        }
        uni.setNavigationBarTitle({
          title: this.banner.title || "\u6848\u4F8B\u8BE6\u60C5"
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
        const master = banner.source || "\u4E13\u4E1A\u7535\u5DE5";
        const date = banner.datetime || "";
        let content = `<h2>${title}</h2>`;
        content += `<p><strong>\u65BD\u5DE5\u5E08\u5085\uFF1A</strong>${master}</p>`;
        content += `<p><strong>\u6848\u4F8B\u65F6\u95F4\uFF1A</strong>${date}</p>`;
        content += `<hr/>`;
        if (title.includes("\u7535\u8DEF\u6539\u9020") || title.includes("\u7528\u7535\u6539\u9020")) {
          content += `<p>\u672C\u6848\u4F8B\u8BE6\u7EC6\u8BB0\u5F55\u4E86${master}\u4E3A\u5BA2\u6237\u8FDB\u884C\u7535\u8DEF\u6539\u9020\u7684\u5B8C\u6574\u8FC7\u7A0B\u3002</p>`;
          content += `<h3>\u4E00\u3001\u73B0\u573A\u60C5\u51B5</h3>`;
          content += `<p>\u5BA2\u6237\u53CD\u6620\u5BB6\u4E2D\u7535\u8DEF\u8001\u5316\uFF0C\u7ECF\u5E38\u51FA\u73B0\u8DF3\u95F8\u3001\u7535\u538B\u4E0D\u7A33\u7B49\u95EE\u9898\u3002\u7ECF\u8FC7\u73B0\u573A\u68C0\u6D4B\uFF0C\u53D1\u73B0\u4E3B\u8981\u95EE\u9898\u5305\u62EC\u7535\u8DEF\u5BB9\u91CF\u4E0D\u8DB3\u3001\u7535\u7EBF\u8001\u5316\u3001\u914D\u7535\u7BB1\u914D\u7F6E\u4E0D\u5408\u7406\u7B49\u3002</p>`;
          content += `<h3>\u4E8C\u3001\u6539\u9020\u65B9\u6848</h3>`;
          content += `<p>1. \u66F4\u6362\u5168\u90E8\u5BA4\u5185\u7535\u7EBF\uFF0C\u4F7F\u7528\u56FD\u6807\u94DC\u7EBF</p>`;
          content += `<p>2. \u5347\u7EA7\u914D\u7535\u7BB1\uFF0C\u589E\u52A0\u6F0F\u7535\u4FDD\u62A4\u5668</p>`;
          content += `<p>3. \u91CD\u65B0\u89C4\u5212\u7535\u8DEF\u5E03\u5C40\uFF0C\u5408\u7406\u5206\u914D\u8D1F\u8F7D</p>`;
          content += `<p>4. \u589E\u52A0\u63D2\u5EA7\u6570\u91CF\uFF0C\u6EE1\u8DB3\u73B0\u4EE3\u751F\u6D3B\u9700\u6C42</p>`;
          content += `<h3>\u4E09\u3001\u65BD\u5DE5\u8FC7\u7A0B</h3>`;
          content += `<p>${master}\u4E25\u683C\u6309\u7167\u56FD\u5BB6\u7535\u6C14\u65BD\u5DE5\u89C4\u8303\uFF0C\u786E\u4FDD\u65BD\u5DE5\u8D28\u91CF\u548C\u5B89\u5168\u3002\u6574\u4E2A\u6539\u9020\u8FC7\u7A0B\u5386\u65F63\u5929\uFF0C\u671F\u95F4\u4FDD\u6301\u4E0E\u5BA2\u6237\u7684\u826F\u597D\u6C9F\u901A\u3002</p>`;
          content += `<h3>\u56DB\u3001\u6539\u9020\u6548\u679C</h3>`;
          content += `<p>\u6539\u9020\u5B8C\u6210\u540E\uFF0C\u7535\u8DEF\u8FD0\u884C\u7A33\u5B9A\uFF0C\u672A\u518D\u51FA\u73B0\u8DF3\u95F8\u73B0\u8C61\u3002\u5BA2\u6237\u5BF9\u6539\u9020\u6548\u679C\u975E\u5E38\u6EE1\u610F\uFF0C\u79F0\u8D5E${master}\u4E13\u4E1A\u7EC6\u81F4\uFF0C\u65BD\u5DE5\u89C4\u8303\u3002</p>`;
        } else if (title.includes("\u7EF4\u4FEE") || title.includes("\u6545\u969C")) {
          content += `<p>\u672C\u6848\u4F8B\u8BE6\u7EC6\u8BB0\u5F55\u4E86${master}\u4E3A\u5BA2\u6237\u6392\u9664\u7535\u8DEF\u6545\u969C\u7684\u5B8C\u6574\u8FC7\u7A0B\u3002</p>`;
          content += `<h3>\u4E00\u3001\u6545\u969C\u73B0\u8C61</h3>`;
          content += `<p>\u5BA2\u6237\u53CD\u6620\u5BB6\u4E2D\u7535\u8DEF\u51FA\u73B0\u5F02\u5E38\uFF0C\u5177\u4F53\u8868\u73B0\u4E3A\u9891\u7E41\u8DF3\u95F8\u3001\u7535\u5668\u65E0\u6CD5\u6B63\u5E38\u5DE5\u4F5C\u7B49\u3002</p>`;
          content += `<h3>\u4E8C\u3001\u6545\u969C\u8BCA\u65AD</h3>`;
          content += `<p>${master}\u4F7F\u7528\u4E13\u4E1A\u5DE5\u5177\u8FDB\u884C\u68C0\u6D4B\uFF0C\u5FEB\u901F\u5B9A\u4F4D\u6545\u969C\u539F\u56E0\u3002\u901A\u8FC7\u7CFB\u7EDF\u6392\u67E5\uFF0C\u53D1\u73B0\u662F\u7535\u8DEF\u77ED\u8DEF/\u63A5\u89E6\u4E0D\u826F/\u8FC7\u8F7D\u7B49\u95EE\u9898\u3002</p>`;
          content += `<h3>\u4E09\u3001\u7EF4\u4FEE\u65B9\u6848</h3>`;
          content += `<p>\u6839\u636E\u6545\u969C\u539F\u56E0\uFF0C${master}\u5236\u5B9A\u4E86\u9488\u5BF9\u6027\u7684\u7EF4\u4FEE\u65B9\u6848\uFF0C\u786E\u4FDD\u5F7B\u5E95\u89E3\u51B3\u95EE\u9898\u3002</p>`;
          content += `<h3>\u56DB\u3001\u7EF4\u4FEE\u6548\u679C</h3>`;
          content += `<p>\u7EF4\u4FEE\u5B8C\u6210\u540E\uFF0C\u7535\u8DEF\u6062\u590D\u6B63\u5E38\uFF0C\u5BA2\u6237\u5BF9${master}\u7684\u4E13\u4E1A\u6280\u80FD\u548C\u670D\u52A1\u6001\u5EA6\u8868\u793A\u9AD8\u5EA6\u8BA4\u53EF\u3002</p>`;
        } else if (title.includes("\u7EF4\u62A4") || title.includes("\u4FDD\u517B")) {
          content += `<p>\u672C\u6848\u4F8B\u8BE6\u7EC6\u8BB0\u5F55\u4E86${master}\u4E3A\u5BA2\u6237\u8FDB\u884C\u7535\u5668\u7EF4\u62A4\u7684\u5B8C\u6574\u8FC7\u7A0B\u3002</p>`;
          content += `<h3>\u4E00\u3001\u7EF4\u62A4\u9700\u6C42</h3>`;
          content += `<p>\u5BA2\u6237\u5E0C\u671B\u5B9A\u671F\u5BF9\u5BB6\u4E2D\u7535\u5668\u8FDB\u884C\u7EF4\u62A4\u4FDD\u517B\uFF0C\u5EF6\u957F\u4F7F\u7528\u5BFF\u547D\uFF0C\u786E\u4FDD\u5B89\u5168\u8FD0\u884C\u3002</p>`;
          content += `<h3>\u4E8C\u3001\u7EF4\u62A4\u5185\u5BB9</h3>`;
          content += `<p>${master}\u5BF9\u5BA2\u6237\u5BB6\u4E2D\u7684\u7535\u5668\u8FDB\u884C\u4E86\u5168\u9762\u68C0\u67E5\uFF0C\u5305\u62EC\u7535\u8DEF\u8FDE\u63A5\u3001\u7EDD\u7F18\u6027\u80FD\u3001\u63A5\u5730\u60C5\u51B5\u7B49\u3002</p>`;
          content += `<h3>\u4E09\u3001\u7EF4\u62A4\u5EFA\u8BAE</h3>`;
          content += `<p>${master}\u5411\u5BA2\u6237\u63D0\u4F9B\u4E86\u4E13\u4E1A\u7684\u7EF4\u62A4\u5EFA\u8BAE\uFF0C\u5E2E\u52A9\u5BA2\u6237\u5EFA\u7ACB\u6B63\u786E\u7684\u7528\u7535\u4E60\u60EF\u3002</p>`;
          content += `<h3>\u56DB\u3001\u7EF4\u62A4\u6548\u679C</h3>`;
          content += `<p>\u7ECF\u8FC7\u7EF4\u62A4\uFF0C\u7535\u5668\u8FD0\u884C\u66F4\u52A0\u7A33\u5B9A\uFF0C\u5BA2\u6237\u5BF9${master}\u7684\u4E13\u4E1A\u670D\u52A1\u8868\u793A\u6EE1\u610F\u3002</p>`;
        } else {
          content += `<p>\u672C\u6848\u4F8B\u8BE6\u7EC6\u8BB0\u5F55\u4E86${master}\u4E3A\u5BA2\u6237\u63D0\u4F9B\u4E13\u4E1A\u7535\u5DE5\u670D\u52A1\u7684\u5B8C\u6574\u8FC7\u7A0B\u3002</p>`;
          content += `<h3>\u4E00\u3001\u5BA2\u6237\u9700\u6C42</h3>`;
          content += `<p>\u5BA2\u6237\u9047\u5230\u4E86\u7528\u7535\u76F8\u5173\u95EE\u9898\uFF0C\u9700\u8981\u4E13\u4E1A\u7535\u5DE5\u63D0\u4F9B\u89E3\u51B3\u65B9\u6848\u3002</p>`;
          content += `<h3>\u4E8C\u3001\u89E3\u51B3\u65B9\u6848</h3>`;
          content += `<p>${master}\u6839\u636E\u5BA2\u6237\u7684\u5177\u4F53\u60C5\u51B5\uFF0C\u5236\u5B9A\u4E86\u4E13\u4E1A\u7684\u89E3\u51B3\u65B9\u6848\uFF0C\u786E\u4FDD\u95EE\u9898\u5F97\u5230\u5F7B\u5E95\u89E3\u51B3\u3002</p>`;
          content += `<h3>\u4E09\u3001\u670D\u52A1\u8FC7\u7A0B</h3>`;
          content += `<p>${master}\u4E25\u683C\u6309\u7167\u89C4\u8303\u64CD\u4F5C\uFF0C\u786E\u4FDD\u65BD\u5DE5\u8D28\u91CF\u548C\u5B89\u5168\uFF0C\u671F\u95F4\u4E0E\u5BA2\u6237\u4FDD\u6301\u826F\u597D\u6C9F\u901A\u3002</p>`;
          content += `<h3>\u56DB\u3001\u670D\u52A1\u6548\u679C</h3>`;
          content += `<p>\u670D\u52A1\u5B8C\u6210\u540E\uFF0C\u5BA2\u6237\u5BF9${master}\u7684\u4E13\u4E1A\u6280\u80FD\u548C\u670D\u52A1\u6001\u5EA6\u8868\u793A\u9AD8\u5EA6\u8BA4\u53EF\uFF0C\u95EE\u9898\u5F97\u5230\u5706\u6EE1\u89E3\u51B3\u3002</p>`;
        }
        return content;
      },
      /**
       * 客户评论（示例静态数据，可替换为接口返回）
       */
      loadComments() {
        this.comments = [
          {
            name: "\u738B\u5148\u751F",
            date: "2024-01-18",
            content: "\u5E08\u5085\u5F88\u4E13\u4E1A\uFF0C\u6C9F\u901A\u987A\u7545\uFF0C\u65BD\u5DE5\u89C4\u8303\uFF0C\u6539\u9020\u540E\u518D\u4E5F\u6CA1\u8DF3\u95F8\u3002"
          },
          {
            name: "\u674E\u5973\u58EB",
            date: "2024-01-12",
            content: "\u54CD\u5E94\u5F88\u5FEB\uFF0C\u73B0\u573A\u68C0\u67E5\u7EC6\u81F4\uFF0C\u7ED9\u4E86\u5F88\u591A\u5B89\u5168\u7528\u7535\u7684\u5EFA\u8BAE\u3002"
          },
          {
            name: "\u9648\u8001\u677F",
            date: "2024-01-05",
            content: "\u5546\u94FA\u7528\u7535\u6539\u9020\u4E00\u6B21\u5230\u4F4D\uFF0C\u9A8C\u6536\u987A\u5229\uFF0C\u540E\u7EED\u8FD8\u4F1A\u5408\u4F5C\u3002"
          }
        ];
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_rich_text = (0, import_vue2.resolveComponent)("rich-text");
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue2.createElementVNode)("view", { class: "content" }, [
        (0, import_vue2.createElementVNode)("view", {
          class: "banner",
          autoFocus: ""
        }, [
          (0, import_vue2.createElementVNode)("u-image", {
            class: "banner-img",
            src: $data.banner.image_url
          }, null, 8, ["src"]),
          (0, import_vue2.createElementVNode)("view", { class: "title-area" }, [
            (0, import_vue2.createElementVNode)(
              "u-text",
              { class: "title-text" },
              (0, import_vue2.toDisplayString)($data.banner.title),
              1
              /* TEXT */
            )
          ])
        ]),
        (0, import_vue2.createElementVNode)("view", { class: "article-meta" }, [
          (0, import_vue2.createElementVNode)(
            "u-text",
            { class: "article-meta-text article-author" },
            (0, import_vue2.toDisplayString)($data.banner.source),
            1
            /* TEXT */
          ),
          (0, import_vue2.createElementVNode)("u-text", { class: "article-meta-text article-text" }, "\u53D1\u8868\u4E8E"),
          (0, import_vue2.createElementVNode)(
            "u-text",
            { class: "article-meta-text article-time" },
            (0, import_vue2.toDisplayString)($data.banner.datetime),
            1
            /* TEXT */
          )
        ]),
        (0, import_vue2.createElementVNode)("view", { class: "article-content" }, [
          (0, import_vue2.createVNode)(_component_rich_text, {
            nodes: $data.content,
            style: { "font-size": "14px" }
          }, null, 8, ["nodes"])
        ]),
        (0, import_vue2.createElementVNode)("view", { class: "comment-wrap" }, [
          (0, import_vue2.createElementVNode)("view", { class: "section-title" }, [
            (0, import_vue2.createElementVNode)("u-text", { class: "section-title-text" }, "\u5BA2\u6237\u8BC4\u4EF7")
          ]),
          $data.comments && $data.comments.length ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
            key: 0,
            class: "comment-list"
          }, [
            ((0, import_vue2.openBlock)(true), (0, import_vue2.createElementBlock)(
              import_vue2.Fragment,
              null,
              (0, import_vue2.renderList)($data.comments, (item, idx) => {
                return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
                  key: idx,
                  class: "comment-card"
                }, [
                  (0, import_vue2.createElementVNode)("view", { class: "comment-header" }, [
                    (0, import_vue2.createElementVNode)(
                      "u-text",
                      { class: "comment-name" },
                      (0, import_vue2.toDisplayString)(item.name),
                      1
                      /* TEXT */
                    ),
                    (0, import_vue2.createElementVNode)(
                      "u-text",
                      { class: "comment-date" },
                      (0, import_vue2.toDisplayString)(item.date),
                      1
                      /* TEXT */
                    )
                  ]),
                  (0, import_vue2.createElementVNode)(
                    "u-text",
                    { class: "comment-content" },
                    (0, import_vue2.toDisplayString)(item.content),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
            key: 1,
            class: "comment-empty"
          }, [
            (0, import_vue2.createElementVNode)("u-text", { class: "comment-empty-text" }, "\u6682\u65E0\u8BC4\u4EF7")
          ]))
        ])
      ])
    ]);
  }
  var detail = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/HBuilderProjects/xydianan/pages/news/detail.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/news/detail";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    detail.mpType = "page";
    const app = Vue.createPageApp(detail, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...detail.styles || []]));
    app.mount("#root");
  }
})();
