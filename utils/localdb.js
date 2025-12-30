/**
 * 本地数据库工具类
 * 使用 uni.setStorageSync 模拟本地数据库操作
 * 用于离线保存需求和订单数据
 */

const STORAGE_KEYS = {
	DEMANDS: 'local_demands', // 需求列表
	ORDERS: 'local_orders' // 订单列表
};

/**
 * 生成本地ID
 */
const generateId = () => {
	return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * 生成订单号
 */
const generateOrderNo = () => {
	return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
};

/**
 * 需求管理
 */
const demands = {
	/**
	 * 保存需求（创建订单）
	 * @param {Object} demandData 需求数据
	 * @returns {Object} 保存的需求和订单信息
	 */
	save: (demandData) => {
		const demandId = generateId();
		const orderNo = generateOrderNo();
		
		// 创建需求记录
		const demand = {
			id: demandId,
			user_id: demandData.user_id || 1,
			service_type: demandData.service_type || 1,
			title: demandData.title,
			description: demandData.description || '',
			power_kw: demandData.power_kw || 0,
			address: demandData.address,
			lng: demandData.lng,
			lat: demandData.lat,
			photos: demandData.photos || [],
			status: 1, // 1: 待匹配
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};
		
		// 创建订单记录
		const order = {
			id: generateId(),
			order_no: orderNo,
			demand_id: demandId,
			user_id: demand.user_id,
			master_id: null, // 待匹配
			quote_id: null,
			demand_title: demand.title,
			master_name: '待匹配师傅',
			total_price: 0, // 待报价
			status: 1, // 1: 待支付（实际是待匹配）
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};
		
		// 保存到本地存储
		const allDemands = demands.getAll();
		allDemands.push(demand);
		uni.setStorageSync(STORAGE_KEYS.DEMANDS, allDemands);
		
		const allOrders = orders.getAll();
		allOrders.unshift(order); // 新订单放在最前面
		uni.setStorageSync(STORAGE_KEYS.ORDERS, allOrders);
		
		return {
			demand,
			order
		};
	},
	
	/**
	 * 获取所有需求
	 * @returns {Array}
	 */
	getAll: () => {
		try {
			return uni.getStorageSync(STORAGE_KEYS.DEMANDS) || [];
		} catch (e) {
			console.error('获取需求列表失败', e);
			return [];
		}
	},
	
	/**
	 * 根据ID获取需求
	 * @param {String} id 需求ID
	 * @returns {Object|null}
	 */
	getById: (id) => {
		const allDemands = demands.getAll();
		return allDemands.find(d => d.id === id) || null;
	},
	
	/**
	 * 更新需求
	 * @param {String} id 需求ID
	 * @param {Object} updates 更新数据
	 */
	update: (id, updates) => {
		const allDemands = demands.getAll();
		const index = allDemands.findIndex(d => d.id === id);
		if (index >= 0) {
			allDemands[index] = {
				...allDemands[index],
				...updates,
				updated_at: new Date().toISOString()
			};
			uni.setStorageSync(STORAGE_KEYS.DEMANDS, allDemands);
		}
	},
	
	/**
	 * 删除需求
	 * @param {String} id 需求ID
	 */
	remove: (id) => {
		const allDemands = demands.getAll();
		const filtered = allDemands.filter(d => d.id !== id);
		uni.setStorageSync(STORAGE_KEYS.DEMANDS, filtered);
	}
};

/**
 * 订单管理
 */
const orders = {
	/**
	 * 获取所有订单
	 * @param {Object} options 查询选项
	 * @returns {Array}
	 */
	getAll: (options = {}) => {
		try {
			let allOrders = uni.getStorageSync(STORAGE_KEYS.ORDERS) || [];
			
			// 根据用户ID筛选
			if (options.user_id) {
				allOrders = allOrders.filter(o => o.user_id === options.user_id);
			}
			
			// 根据状态筛选
			if (options.status) {
				const statusList = Array.isArray(options.status) ? options.status : [options.status];
				allOrders = allOrders.filter(o => statusList.includes(o.status));
			}
			
			// 排序（最新的在前）
			allOrders.sort((a, b) => {
				return new Date(b.created_at) - new Date(a.created_at);
			});
			
			// 分页
			if (options.page && options.page_size) {
				const start = (options.page - 1) * options.page_size;
				const end = start + options.page_size;
				allOrders = allOrders.slice(start, end);
			}
			
			return allOrders;
		} catch (e) {
			console.error('获取订单列表失败', e);
			return [];
		}
	},
	
	/**
	 * 根据ID获取订单
	 * @param {String} id 订单ID
	 * @returns {Object|null}
	 */
	getById: (id) => {
		const allOrders = orders.getAll();
		return allOrders.find(o => o.id === id) || null;
	},
	
	/**
	 * 更新订单
	 * @param {String} id 订单ID
	 * @param {Object} updates 更新数据
	 */
	update: (id, updates) => {
		const allOrders = orders.getAll();
		const index = allOrders.findIndex(o => o.id === id);
		if (index >= 0) {
			allOrders[index] = {
				...allOrders[index],
				...updates,
				updated_at: new Date().toISOString()
			};
			uni.setStorageSync(STORAGE_KEYS.ORDERS, allOrders);
		}
	},
	
	/**
	 * 删除订单
	 * @param {String} id 订单ID
	 */
	remove: (id) => {
		const allOrders = orders.getAll();
		const filtered = allOrders.filter(o => o.id !== id);
		uni.setStorageSync(STORAGE_KEYS.ORDERS, filtered);
	}
};

export default {
	demands,
	orders,
	generateId,
	generateOrderNo
};

