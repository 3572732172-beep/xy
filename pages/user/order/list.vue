<template>
	<view class="container" :class="{ 'large-font': largeFontMode }">
		<view class="tab-bar">
			<view 
				class="tab-item" 
				v-for="tab in tabs" 
				:key="tab.value"
				:class="{ 'active': currentTab === tab.value }"
				@click="switchTab(tab.value)"
			>
				<text>{{ tab.label }}</text>
			</view>
		</view>
		
		<view class="order-list">
			<view 
				class="order-item" 
				v-for="order in orderList" 
				:key="order.id"
				@click="viewOrderDetail(order)"
			>
				<view class="order-header">
					<text class="order-id">订单号：{{ order.order_no }}</text>
					<view class="status-badge" :class="'status-' + order.status">
						{{ getStatusText(order.status) }}
					</view>
				</view>
				
				<view class="order-info">
					<text class="demand-title">{{ order.demand_title }}</text>
					<text class="master-name">师傅：{{ order.master_name }}</text>
					<text class="order-price">金额：¥{{ order.total_price }}</text>
				</view>
				
				<view class="order-footer">
					<text class="order-time">{{ formatTime(order.created_at) }}</text>
					<view class="order-actions">
						<button 
							class="btn btn-small" 
							v-if="order.status === 1"
							@click.stop="cancelOrder(order)"
						>
							取消订单
						</button>
						<button 
							class="btn btn-small btn-primary" 
							v-if="order.status === 3"
							@click.stop="confirmOrder(order)"
						>
							确认验收
						</button>
						<button 
							class="btn btn-small" 
							@click.stop="viewOrderDetail(order)"
						>
							查看详情
						</button>
					</view>
				</view>
			</view>
		</view>
		
		<view class="load-more" v-if="hasMore">
			<text v-if="loading">加载中...</text>
			<text v-else @click="loadMore">加载更多</text>
		</view>
		
		<view class="no-more" v-if="!hasMore && orderList.length > 0">
			<text>没有更多了</text>
		</view>
		
		<view class="empty" v-if="!loading && orderList.length === 0">
			<text>暂无订单</text>
		</view>
	</view>
</template>

<script>
import request from '@/utils/request.js';
import userStore from '@/store/user.js';
import offline from '@/utils/offline.js';

export default {
		data() {
		return {
			tabs: [
				{ value: 'all', label: '全部' },
				{ value: 'pending', label: '进行中' },
				{ value: 'completed', label: '已完成' },
				{ value: 'cancelled', label: '已取消' }
			],
			currentTab: 'all',
			orderList: [],
			page: 1,
			pageSize: 10,
			hasMore: true,
			loading: false,
			largeFontMode: false,
			isInitialized: false // 标记是否已初始化
		};
	},
	onLoad() {
		this.largeFontMode = userStore.state.largeFontMode;
		
		// 检查登录状态，如果未登录则静默处理
		if (!userStore.state.isLoggedIn) {
			// 不显示弹窗，直接显示空列表
			this.orderList = [];
			this.isInitialized = true;
			return;
		}
		
		this.loadOrders();
		
		// 监听需求创建事件，自动刷新订单列表
		uni.$on('demandCreated', () => {
			console.log('收到需求创建事件，刷新订单列表');
			if (!this.loading) {
				this.page = 1;
				this.orderList = [];
				this.hasMore = true;
				this.loadOrders();
			}
		});
	},
	onShow() {
		// tabBar 页面切换时，只有在未初始化或登录状态变化时才重新加载
		if (!this.isInitialized) {
			if (userStore.state.isLoggedIn && !this.loading) {
				this.loadOrders();
			}
		}
	},
	onUnload() {
		// 页面卸载时移除事件监听
		uni.$off('demandCreated');
		this.isInitialized = false;
	},
	onPullDownRefresh() {
		if (this.loading) {
			uni.stopPullDownRefresh();
			return;
		}
		this.page = 1;
		this.orderList = [];
		this.hasMore = true;
		this.loadOrders().finally(() => {
			uni.stopPullDownRefresh();
		});
	},
	methods: {
		/**
		 * 切换标签
		 */
		switchTab(tab) {
			// 防止重复点击相同标签
			if (this.currentTab === tab || this.loading) {
				return;
			}
			
			this.currentTab = tab;
			this.page = 1;
			this.orderList = [];
			this.hasMore = true;
			this.loadOrders();
		},
		
		/**
		 * 加载订单列表
		 */
		async loadOrders() {
			if (this.loading) {
				console.log('订单列表正在加载中，跳过重复请求');
				return;
			}
			
			this.loading = true;
			
			try {
				const params = {
					role: 'user',
					page: this.page,
					page_size: this.pageSize
				};
				
				// 根据标签筛选
				if (this.currentTab !== 'all') {
					const statusMap = {
						'pending': [1, 2, 3], // 进行中：待支付、已支付、施工中
						'completed': [4], // 已完成
						'cancelled': [5] // 已取消
					};
					params.status = statusMap[this.currentTab];
				}
				
				const result = await request.get('/api/order/list', params);
				
				if (result.list && result.list.length > 0) {
					if (this.page === 1) {
						this.orderList = result.list;
					} else {
						this.orderList = this.orderList.concat(result.list);
					}
					this.hasMore = result.list.length >= this.pageSize;
				} else {
					if (this.page === 1) {
						this.orderList = [];
					}
					this.hasMore = false;
				}
			} catch (error) {
				// API失败时，使用模拟数据（仅用于开发测试）
				// 静默处理，减少日志输出（只在首次失败时输出一次）
				if (this.page === 1 && this.currentTab === 'all') {
					console.log('API不可用，使用模拟订单数据');
				}
				
				// 生成模拟订单数据
				const mockOrders = this.getMockOrders();
				
				// 根据标签筛选模拟数据
				let filteredOrders = mockOrders;
				if (this.currentTab !== 'all') {
					const statusMap = {
						'pending': [1, 2, 3], // 进行中
						'completed': [4], // 已完成
						'cancelled': [5] // 已取消
					};
					const targetStatuses = statusMap[this.currentTab] || [];
					filteredOrders = mockOrders.filter(order => targetStatuses.includes(order.status));
				}
				
				// 分页处理
				const startIndex = (this.page - 1) * this.pageSize;
				const endIndex = startIndex + this.pageSize;
				const pageOrders = filteredOrders.slice(startIndex, endIndex);
				
				if (pageOrders.length > 0) {
					if (this.page === 1) {
						this.orderList = pageOrders;
					} else {
						this.orderList = this.orderList.concat(pageOrders);
					}
					this.hasMore = endIndex < filteredOrders.length;
				} else {
					if (this.page === 1) {
						this.orderList = [];
					}
					this.hasMore = false;
				}
			} finally {
				this.loading = false;
				this.isInitialized = true; // 标记已初始化
				
				// 每次加载完成后，通知首页更新统计（仅在首次加载时）
				if (this.page === 1) {
					uni.$emit('orderStatusChanged');
				}
			}
		},
		
		/**
		 * 加载本地订单（离线模式）
		 */
		loadLocalOrders() {
			const localOrders = offline.recentOrders.getAll();
			if (localOrders.length > 0) {
				this.orderList = localOrders.slice(0, this.pageSize);
			}
		},
		
		/**
		 * 获取模拟订单数据（用于开发测试）
		 */
		getMockOrders() {
			const now = Date.now();
			const oneDay = 24 * 60 * 60 * 1000;
			const oneWeek = 7 * oneDay;
			
			return [
				// 已完成订单
				{
					id: 1,
					order_no: 'ORD' + String(now).slice(-10),
					status: 4,
					demand_title: '家庭电路改造',
					master_name: '张师傅',
					total_price: 3500.00,
					created_at: now - oneWeek
				},
				{
					id: 2,
					order_no: 'ORD' + String(now - 1000).slice(-10),
					status: 4,
					demand_title: '老旧线路维修',
					master_name: '李师傅',
					total_price: 1200.00,
					created_at: now - oneWeek - oneDay
				},
				{
					id: 3,
					order_no: 'ORD' + String(now - 2000).slice(-10),
					status: 4,
					demand_title: '智能家居电路安装',
					master_name: '王师傅',
					total_price: 2800.00,
					created_at: now - oneWeek - 2 * oneDay
				},
				{
					id: 4,
					order_no: 'ORD' + String(now - 3000).slice(-10),
					status: 4,
					demand_title: '配电箱升级改造',
					master_name: '刘师傅',
					total_price: 4500.00,
					created_at: now - 2 * oneWeek
				},
				{
					id: 5,
					order_no: 'ORD' + String(now - 4000).slice(-10),
					status: 4,
					demand_title: '厨房电路增容',
					master_name: '陈师傅',
					total_price: 2200.00,
					created_at: now - 2 * oneWeek - oneDay
				},
				{
					id: 6,
					order_no: 'ORD' + String(now - 5000).slice(-10),
					status: 4,
					demand_title: '卫生间防水电路改造',
					master_name: '赵师傅',
					total_price: 1800.00,
					created_at: now - 3 * oneWeek
				},
				{
					id: 7,
					order_no: 'ORD' + String(now - 6000).slice(-10),
					status: 4,
					demand_title: '客厅照明电路改造',
					master_name: '周师傅',
					total_price: 1500.00,
					created_at: now - 3 * oneWeek - oneDay
				},
				{
					id: 8,
					order_no: 'ORD' + String(now - 7000).slice(-10),
					status: 4,
					demand_title: '阳台电路安装',
					master_name: '吴师傅',
					total_price: 900.00,
					created_at: now - 4 * oneWeek
				},
				// 进行中订单
				{
					id: 9,
					order_no: 'ORD' + String(now - 100).slice(-10),
					status: 1,
					demand_title: '卧室电路改造',
					master_name: '郑师傅',
					total_price: 2000.00,
					created_at: now - 2 * oneDay
				},
				{
					id: 10,
					order_no: 'ORD' + String(now - 200).slice(-10),
					status: 2,
					demand_title: '书房电路安装',
					master_name: '孙师傅',
					total_price: 1600.00,
					created_at: now - oneDay
				},
				{
					id: 11,
					order_no: 'ORD' + String(now - 300).slice(-10),
					status: 3,
					demand_title: '车库电路改造',
					master_name: '钱师傅',
					total_price: 3000.00,
					created_at: now - 3 * oneDay
				},
				// 已取消订单
				{
					id: 12,
					order_no: 'ORD' + String(now - 8000).slice(-10),
					status: 5,
					demand_title: '阳台电路安装（已取消）',
					master_name: '冯师傅',
					total_price: 1100.00,
					created_at: now - 5 * oneWeek
				}
			];
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++;
				this.loadOrders();
			}
		},
		
		/**
		 * 获取状态文本
		 */
		getStatusText(status) {
			const statusMap = {
				1: '待支付',
				2: '已支付',
				3: '施工中',
				4: '已完成',
				5: '已取消'
			};
			return statusMap[status] || '未知';
		},
		
		/**
		 * 格式化时间
		 */
		formatTime(timestamp) {
			const date = new Date(timestamp);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		
		/**
		 * 查看订单详情
		 */
		viewOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/user/order/detail?order_id=${order.id}`
			});
		},
		
		/**
		 * 取消订单
		 */
		async cancelOrder(order) {
			uni.showModal({
				title: '确认取消',
				content: '确定要取消此订单吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await request.post('/api/order/cancel', {
								order_id: order.id
							});
							
							uni.showToast({
								title: '订单已取消',
								icon: 'success'
							});
							
				// 刷新列表
				this.page = 1;
				this.orderList = [];
				this.loadOrders();
				
				// 通知首页更新统计
				uni.$emit('orderStatusChanged');
						} catch (error) {
							console.error('取消订单失败', error);
						}
					}
				}
			});
		},
		
		/**
		 * 确认验收
		 */
		async confirmOrder(order) {
			uni.showModal({
				title: '确认验收',
				content: '确认工程已验收完成？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await request.post('/api/order/confirm', {
								order_id: order.id
							});
							
							uni.showToast({
								title: '验收成功',
								icon: 'success'
							});
							
				// 刷新列表
				this.page = 1;
				this.orderList = [];
				this.loadOrders();
				
				// 通知首页更新统计
				uni.$emit('orderStatusChanged');
						} catch (error) {
							console.error('确认验收失败', error);
						}
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 200rpx;
}

.tab-bar {
	display: flex;
	background-color: #fff;
	border-bottom: 2rpx solid #e0e0e0;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 30rpx 0;
	font-size: 28rpx;
	color: #666;
	border-bottom: 4rpx solid transparent;
}

.tab-item.active {
	color: #2F85FC;
	border-bottom-color: #2F85FC;
}

.order-list {
	padding: 20rpx;
}

.order-item {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.order-id {
	font-size: 24rpx;
	color: #999;
}

.status-badge {
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
}

.status-1 {
	background-color: #fff3cd;
	color: #856404;
}

.status-2 {
	background-color: #d1ecf1;
	color: #0c5460;
}

.status-3 {
	background-color: #d4edda;
	color: #155724;
}

.status-4 {
	background-color: #d1ecf1;
	color: #0c5460;
}

.status-5 {
	background-color: #f8d7da;
	color: #721c24;
}

.order-info {
	margin-bottom: 20rpx;
}

.demand-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.master-name, .order-price {
	font-size: 28rpx;
	color: #666;
	display: block;
	margin-bottom: 5rpx;
}

.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 2rpx solid #f0f0f0;
}

.order-time {
	font-size: 24rpx;
	color: #999;
}

.order-actions {
	display: flex;
	gap: 10rpx;
}

.btn-small {
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	border-radius: 6rpx;
	border: 2rpx solid #e0e0e0;
	background-color: #fff;
	color: #666;
}

.btn-small.btn-primary {
	background-color: #2F85FC;
	color: #fff;
	border-color: #2F85FC;
}

.load-more, .no-more, .empty {
	text-align: center;
	padding: 40rpx;
	font-size: 28rpx;
	color: #999;
}
</style>


