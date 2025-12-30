"use strict";
const common_vendor = require("../common/vendor.js");
const STORAGE_KEYS = {
  DRAFT_DEMANDS: "draft_demands",
  // 需求草稿列表
  SYNC_QUEUE: "sync_queue",
  // 待同步队列
  USER_ADDRESSES: "user_addresses",
  // 用户常用地址
  RECENT_ORDERS: "recent_orders"
  // 最近订单摘要
};
const generateLocalId = () => {
  return "local-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
};
const draftDemand = {
  /**
   * 保存需求草稿
   * @param {Object} demandData 需求数据
   * @returns {String} 本地草稿 ID
   */
  save: (demandData) => {
    const localId = demandData.offline_local_id || generateLocalId();
    const draft = {
      ...demandData,
      offline_local_id: localId,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    const drafts = draftDemand.getAll();
    const index = drafts.findIndex((d) => d.offline_local_id === localId);
    if (index >= 0) {
      drafts[index] = draft;
    } else {
      drafts.push(draft);
    }
    common_vendor.index.setStorageSync(STORAGE_KEYS.DRAFT_DEMANDS, drafts);
    return localId;
  },
  /**
   * 获取所有草稿
   * @returns {Array}
   */
  getAll: () => {
    try {
      return common_vendor.index.getStorageSync(STORAGE_KEYS.DRAFT_DEMANDS) || [];
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/offline.js:60", "获取草稿失败", e);
      return [];
    }
  },
  /**
   * 根据 ID 获取草稿
   * @param {String} localId 本地草稿 ID
   * @returns {Object|null}
   */
  getById: (localId) => {
    const drafts = draftDemand.getAll();
    return drafts.find((d) => d.offline_local_id === localId) || null;
  },
  /**
   * 删除草稿
   * @param {String} localId 本地草稿 ID
   */
  remove: (localId) => {
    const drafts = draftDemand.getAll();
    const filtered = drafts.filter((d) => d.offline_local_id !== localId);
    common_vendor.index.setStorageSync(STORAGE_KEYS.DRAFT_DEMANDS, filtered);
  },
  /**
   * 清空所有草稿
   */
  clear: () => {
    common_vendor.index.removeStorageSync(STORAGE_KEYS.DRAFT_DEMANDS);
  }
};
const syncQueue = {
  /**
   * 添加到同步队列
   * @param {String} localId 本地草稿 ID
   * @param {String} type 同步类型：'demand_create' | 'demand_sync'
   */
  add: (localId, type = "demand_create") => {
    const queue = syncQueue.getAll();
    const exists = queue.find((item) => item.local_id === localId);
    if (!exists) {
      queue.push({
        local_id: localId,
        type,
        created_at: Date.now(),
        retry_count: 0
      });
      common_vendor.index.setStorageSync(STORAGE_KEYS.SYNC_QUEUE, queue);
    }
  },
  /**
   * 获取所有待同步项
   * @returns {Array}
   */
  getAll: () => {
    try {
      return common_vendor.index.getStorageSync(STORAGE_KEYS.SYNC_QUEUE) || [];
    } catch (e) {
      return [];
    }
  },
  /**
   * 从队列中移除
   * @param {String} localId 本地草稿 ID
   */
  remove: (localId) => {
    const queue = syncQueue.getAll();
    const filtered = queue.filter((item) => item.local_id !== localId);
    common_vendor.index.setStorageSync(STORAGE_KEYS.SYNC_QUEUE, filtered);
  },
  /**
   * 更新重试次数
   * @param {String} localId 本地草稿 ID
   */
  incrementRetry: (localId) => {
    const queue = syncQueue.getAll();
    const item = queue.find((item2) => item2.local_id === localId);
    if (item) {
      item.retry_count = (item.retry_count || 0) + 1;
      item.updated_at = Date.now();
      common_vendor.index.setStorageSync(STORAGE_KEYS.SYNC_QUEUE, queue);
    }
  }
};
const userAddress = {
  /**
   * 保存常用地址
   * @param {Object} address 地址信息
   */
  save: (address) => {
    const addresses = userAddress.getAll();
    const exists = addresses.find(
      (a) => a.address === address.address && a.lng === address.lng && a.lat === address.lat
    );
    if (!exists) {
      addresses.unshift({
        ...address,
        created_at: Date.now()
      });
      if (addresses.length > 10) {
        addresses.pop();
      }
      common_vendor.index.setStorageSync(STORAGE_KEYS.USER_ADDRESSES, addresses);
    }
  },
  /**
   * 获取所有常用地址
   * @returns {Array}
   */
  getAll: () => {
    try {
      return common_vendor.index.getStorageSync(STORAGE_KEYS.USER_ADDRESSES) || [];
    } catch (e) {
      return [];
    }
  }
};
const recentOrders = {
  /**
   * 保存订单摘要（用于离线查看）
   * @param {Object} orderSummary 订单摘要
   */
  save: (orderSummary) => {
    const orders = recentOrders.getAll();
    const exists = orders.find((o) => o.order_id === orderSummary.order_id);
    if (exists) {
      const index = orders.findIndex((o) => o.order_id === orderSummary.order_id);
      orders[index] = {
        ...orderSummary,
        updated_at: Date.now()
      };
    } else {
      orders.unshift({
        ...orderSummary,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      if (orders.length > 50) {
        orders.pop();
      }
    }
    common_vendor.index.setStorageSync(STORAGE_KEYS.RECENT_ORDERS, orders);
  },
  /**
   * 获取所有订单摘要
   * @returns {Array}
   */
  getAll: () => {
    try {
      return common_vendor.index.getStorageSync(STORAGE_KEYS.RECENT_ORDERS) || [];
    } catch (e) {
      return [];
    }
  }
};
let networkStatus = "unknown";
const startNetworkMonitor = () => {
  common_vendor.index.onNetworkStatusChange((res) => {
    const wasOffline = networkStatus === "none" || networkStatus === "unknown";
    const isOnline = res.isConnected && res.networkType !== "none";
    if (wasOffline && isOnline) {
      triggerSync();
    }
    networkStatus = res.networkType;
  });
  common_vendor.index.getNetworkType({
    success: (res) => {
      networkStatus = res.networkType;
    }
  });
};
const triggerSync = async () => {
  const queue = syncQueue.getAll();
  if (queue.length === 0) {
    return;
  }
  let request;
  try {
    request = require("./request.js").default;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/offline.js:287", "导入 request 失败", e);
    return;
  }
  for (const item of queue) {
    try {
      const draft = draftDemand.getById(item.local_id);
      if (!draft) {
        syncQueue.remove(item.local_id);
        continue;
      }
      const result = await request.post("/api/demand/sync", draft);
      syncQueue.remove(item.local_id);
      draftDemand.remove(item.local_id);
      common_vendor.index.showToast({
        title: "草稿同步成功",
        icon: "success"
      });
    } catch (error) {
      syncQueue.incrementRetry(item.local_id);
      common_vendor.index.__f__("error", "at utils/offline.js:313", "同步失败", error);
    }
  }
};
startNetworkMonitor();
const offline = {
  draftDemand,
  syncQueue,
  userAddress,
  recentOrders,
  triggerSync,
  generateLocalId
};
exports.offline = offline;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/offline.js.map
