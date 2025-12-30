/**
 * 离线存储管理
 * 使用 uni.setStorageSync / uni.getStorageSync 实现本地存储
 * 注意：SQLite 需要原生插件支持，这里先用本地存储模拟
 */

const STORAGE_KEYS = {
	DRAFT_DEMANDS: 'draft_demands', // 需求草稿列表
	SYNC_QUEUE: 'sync_queue', // 待同步队列
	USER_ADDRESSES: 'user_addresses', // 用户常用地址
	RECENT_ORDERS: 'recent_orders' // 最近订单摘要
};

/**
 * 生成本地 UUID
 */
const generateLocalId = () => {
	return 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

/**
 * 需求草稿管理
 */
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
		const index = drafts.findIndex(d => d.offline_local_id === localId);
		
		if (index >= 0) {
			drafts[index] = draft;
		} else {
			drafts.push(draft);
		}
		
		uni.setStorageSync(STORAGE_KEYS.DRAFT_DEMANDS, drafts);
		return localId;
	},
	
	/**
	 * 获取所有草稿
	 * @returns {Array}
	 */
	getAll: () => {
		try {
			return uni.getStorageSync(STORAGE_KEYS.DRAFT_DEMANDS) || [];
		} catch (e) {
			console.error('获取草稿失败', e);
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
		return drafts.find(d => d.offline_local_id === localId) || null;
	},
	
	/**
	 * 删除草稿
	 * @param {String} localId 本地草稿 ID
	 */
	remove: (localId) => {
		const drafts = draftDemand.getAll();
		const filtered = drafts.filter(d => d.offline_local_id !== localId);
		uni.setStorageSync(STORAGE_KEYS.DRAFT_DEMANDS, filtered);
	},
	
	/**
	 * 清空所有草稿
	 */
	clear: () => {
		uni.removeStorageSync(STORAGE_KEYS.DRAFT_DEMANDS);
	}
};

/**
 * 同步队列管理
 */
const syncQueue = {
	/**
	 * 添加到同步队列
	 * @param {String} localId 本地草稿 ID
	 * @param {String} type 同步类型：'demand_create' | 'demand_sync'
	 */
	add: (localId, type = 'demand_create') => {
		const queue = syncQueue.getAll();
		const exists = queue.find(item => item.local_id === localId);
		
		if (!exists) {
			queue.push({
				local_id: localId,
				type: type,
				created_at: Date.now(),
				retry_count: 0
			});
			uni.setStorageSync(STORAGE_KEYS.SYNC_QUEUE, queue);
		}
	},
	
	/**
	 * 获取所有待同步项
	 * @returns {Array}
	 */
	getAll: () => {
		try {
			return uni.getStorageSync(STORAGE_KEYS.SYNC_QUEUE) || [];
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
		const filtered = queue.filter(item => item.local_id !== localId);
		uni.setStorageSync(STORAGE_KEYS.SYNC_QUEUE, filtered);
	},
	
	/**
	 * 更新重试次数
	 * @param {String} localId 本地草稿 ID
	 */
	incrementRetry: (localId) => {
		const queue = syncQueue.getAll();
		const item = queue.find(item => item.local_id === localId);
		if (item) {
			item.retry_count = (item.retry_count || 0) + 1;
			item.updated_at = Date.now();
			uni.setStorageSync(STORAGE_KEYS.SYNC_QUEUE, queue);
		}
	}
};

/**
 * 用户地址管理
 */
const userAddress = {
	/**
	 * 保存常用地址
	 * @param {Object} address 地址信息
	 */
	save: (address) => {
		const addresses = userAddress.getAll();
		const exists = addresses.find(a => 
			a.address === address.address && 
			a.lng === address.lng && 
			a.lat === address.lat
		);
		
		if (!exists) {
			addresses.unshift({
				...address,
				created_at: Date.now()
			});
			// 最多保存 10 个
			if (addresses.length > 10) {
				addresses.pop();
			}
			uni.setStorageSync(STORAGE_KEYS.USER_ADDRESSES, addresses);
		}
	},
	
	/**
	 * 获取所有常用地址
	 * @returns {Array}
	 */
	getAll: () => {
		try {
			return uni.getStorageSync(STORAGE_KEYS.USER_ADDRESSES) || [];
		} catch (e) {
			return [];
		}
	}
};

/**
 * 订单摘要管理
 */
const recentOrders = {
	/**
	 * 保存订单摘要（用于离线查看）
	 * @param {Object} orderSummary 订单摘要
	 */
	save: (orderSummary) => {
		const orders = recentOrders.getAll();
		const exists = orders.find(o => o.order_id === orderSummary.order_id);
		
		if (exists) {
			// 更新
			const index = orders.findIndex(o => o.order_id === orderSummary.order_id);
			orders[index] = {
				...orderSummary,
				updated_at: Date.now()
			};
		} else {
			// 新增
			orders.unshift({
				...orderSummary,
				created_at: Date.now(),
				updated_at: Date.now()
			});
			// 最多保存 50 条
			if (orders.length > 50) {
				orders.pop();
			}
		}
		
		uni.setStorageSync(STORAGE_KEYS.RECENT_ORDERS, orders);
	},
	
	/**
	 * 获取所有订单摘要
	 * @returns {Array}
	 */
	getAll: () => {
		try {
			return uni.getStorageSync(STORAGE_KEYS.RECENT_ORDERS) || [];
		} catch (e) {
			return [];
		}
	}
};

/**
 * 自动同步功能
 * 当网络从无到有时，自动尝试同步本地草稿
 */
let networkStatus = 'unknown';
let syncTimer = null;

const startNetworkMonitor = () => {
	// 监听网络状态变化
	uni.onNetworkStatusChange((res) => {
		const wasOffline = networkStatus === 'none' || networkStatus === 'unknown';
		const isOnline = res.isConnected && res.networkType !== 'none';
		
		if (wasOffline && isOnline) {
			// 网络从无到有，触发同步
			triggerSync();
		}
		
		networkStatus = res.networkType;
	});
	
	// 初始化网络状态
	uni.getNetworkType({
		success: (res) => {
			networkStatus = res.networkType;
		}
	});
};

/**
 * 触发同步
 */
const triggerSync = async () => {
	const queue = syncQueue.getAll();
	if (queue.length === 0) {
		return;
	}
	
	// 使用 require 方式导入 request（避免循环依赖）
	let request;
	try {
		request = require('./request.js').default;
	} catch (e) {
		console.error('导入 request 失败', e);
		return;
	}
	
	for (const item of queue) {
		try {
			const draft = draftDemand.getById(item.local_id);
			if (!draft) {
				syncQueue.remove(item.local_id);
				continue;
			}
			
			// 调用同步接口
			const result = await request.post('/api/demand/sync', draft);
			
			// 同步成功，移除队列和草稿
			syncQueue.remove(item.local_id);
			draftDemand.remove(item.local_id);
			
			uni.showToast({
				title: '草稿同步成功',
				icon: 'success'
			});
		} catch (error) {
			// 同步失败，增加重试次数
			syncQueue.incrementRetry(item.local_id);
			console.error('同步失败', error);
		}
	}
};

// 启动网络监听
startNetworkMonitor();

export default {
	draftDemand,
	syncQueue,
	userAddress,
	recentOrders,
	triggerSync,
	generateLocalId
};

