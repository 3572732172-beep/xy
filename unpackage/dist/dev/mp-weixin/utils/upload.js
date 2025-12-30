"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("../common/vendor.js");
const utils_request = require("./request.js");
function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
      url: utils_request.BASE_URL + "/api/upload/image",
      filePath,
      name: "file",
      header: {
        "Authorization": "Bearer " + (common_vendor.index.getStorageSync("token") || "")
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data.url);
          } else {
            reject(new Error(data.msg || "上传失败"));
          }
        } catch (e) {
          reject(new Error("解析响应失败"));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
async function uploadImages(filePaths) {
  const uploadPromises = filePaths.map((path) => uploadImage(path));
  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/upload.js:52", "批量上传失败", error);
    throw error;
  }
}
const upload = {
  uploadImage,
  uploadImages
};
exports.default = upload;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/upload.js.map
