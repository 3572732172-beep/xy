/**
 * 图片上传工具
 * 支持上传到服务器并返回URL
 */

import request, { BASE_URL } from './request.js';

/**
 * 上传单张图片
 * @param {String} filePath 本地文件路径
 * @returns {Promise<String>} 图片URL
 */
function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + '/api/upload/image',
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': 'Bearer ' + (uni.getStorageSync('token') || '')
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data.url);
          } else {
            reject(new Error(data.msg || '上传失败'));
          }
        } catch (e) {
          reject(new Error('解析响应失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 批量上传图片
 * @param {Array<String>} filePaths 本地文件路径数组
 * @returns {Promise<Array<String>>} 图片URL数组
 */
async function uploadImages(filePaths) {
  const uploadPromises = filePaths.map(path => uploadImage(path));
  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('批量上传失败', error);
    throw error;
  }
}

export default {
  uploadImage,
  uploadImages
};

