<template>
	<view class="container" :class="{ 'large-font': largeFontMode }">
		<page-header
			title="订单详情"
			subtitle="掌握施工进度与报价"
		/>
		<view class="order-card">
			<view class="order-header">
				<text class="order-id">订单号：{{ orderData.order_no }}</text>
				<view class="status-badge" :class="'status-' + orderData.status">
					{{ getStatusText(orderData.status) }}
				</view>
			</view>
			
			<view class="progress-section" v-if="orderData.status <= 3">
				<view class="progress-title">订单进度</view>
				<view class="progress-steps">
					<view 
						class="step-item" 
						v-for="(step, index) in progressSteps" 
						:key="index"
						:class="{ 'active': step.active, 'completed': step.completed }"
					>
						<view class="step-dot"></view>
						<text class="step-label">{{ step.label }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="info-card">
			<view class="card-title">需求信息</view>
			<view class="info-item">
				<text class="info-label">需求标题：</text>
				<text class="info-value">{{ orderData.demand_title }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">场景类型：</text>
				<text class="info-value">{{ getSceneText(orderData.service_type) }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">功率需求：</text>
				<text class="info-value">{{ orderData.power_kw }} kW</text>
			</view>
			<view class="info-item">
				<text class="info-label">施工地址：</text>
				<text class="info-value">{{ orderData.address }}</text>
			</view>
		</view>
		
		<view class="info-card">
			<view class="card-title">师傅信息</view>
			<view class="master-card">
				<image :src="orderData.master_avatar" class="master-avatar" mode="aspectFill" />
				<view class="master-info">
					<text class="master-name">{{ orderData.master_name }}</text>
					<view class="master-rating">
						<text class="rating-star">⭐</text>
						<text class="rating-value">{{ orderData.master_rating }}</text>
					</view>
					<text class="master-phone" @click="callMaster">📞 {{ orderData.master_phone }}</text>
				</view>
			</view>
		</view>
		
		<view class="info-card">
			<view class="card-title">报价详情</view>
			<view class="price-item" v-for="(item, index) in priceDetails" :key="index">
				<text class="price-label">{{ item.label }}：</text>
				<text class="price-value">¥{{ item.value }}</text>
			</view>
			<view class="price-total">
				<text class="total-label">合计：</text>
				<text class="total-value">¥{{ orderData.total_price }}</text>
			</view>
		</view>
		
		<view class="info-card" v-if="orderData.contract_url">
			<view class="card-title">电子合同</view>
			<view class="contract-item" @click="viewContract">
				<text>查看合同</text>
				<text class="contract-arrow">></text>
			</view>
		</view>
		
		<view class="action-section" v-if="orderData.status === 1">
			<button class="btn btn-primary" @click="payOrder">立即支付</button>
			<button class="btn btn-secondary" @click="cancelOrder">取消订单</button>
		</view>
		
		<view class="action-section" v-if="orderData.status === 3">
			<button class="btn btn-primary" @click="confirmOrder">确认验收</button>
			<button class="btn btn-secondary" @click="contactMaster">联系师傅</button>
		</view>
		
		<view class="action-section" v-if="orderData.status === 4">
			<button class="btn btn-secondary" @click="applyAfterSale">申请售后</button>
			<button class="btn btn-secondary" @click="viewWarranty">查看质保</button>
		</view>
	</view>
</template>

<script>
import request from '@/utils/request.js';
import userStore from '@/store/user.js';
import PageHeader from '@/components/PageHeader.vue';

export default {
	components: {
		PageHeader
	},
	data() {
		return {
			orderId: null,
			orderData: {},
			largeFontMode: false,
			progressSteps: []
		};
	},
	computed: {
		priceDetails() {
			return [
				{ label: '材料费', value: this.orderData.material_price || 0 },
				{ label: '人工费', value: this.orderData.labor_price || 0 },
				{ label: '其他费用', value: this.orderData.other_price || 0 }
			].filter(item => item.value > 0);
		}
	},
	onLoad(options) {
		if (options.order_id) {
			this.orderId = options.order_id;
			this.loadOrderDetail();
		}
		
		this.largeFontMode = userStore.state.largeFontMode;
	},
	methods: {
		/**
		 * 加载订单详情
		 */
		async loadOrderDetail() {
			try {
				this.orderData = await request.get('/api/order/detail', {
					order_id: this.orderId
				});
				
				this.updateProgressSteps();
			} catch (error) {
				console.warn('API请求失败，使用模拟数据', error.message);
				
				// 使用模拟数据
				const mockOrder = this.getMockOrderDetail(this.orderId);
				if (mockOrder) {
					this.orderData = mockOrder;
					this.updateProgressSteps();
				} else {
					console.error('订单不存在', this.orderId);
					uni.showToast({
						title: '订单不存在',
						icon: 'none'
					});
					// 返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}
			}
		},
		
		/**
		 * 获取模拟订单详情（用于开发测试）
		 */
		getMockOrderDetail(orderId) {
			const now = Date.now();
			const oneDay = 24 * 60 * 60 * 1000;
			const oneWeek = 7 * oneDay;
			
			// 根据订单ID返回对应的模拟数据
			const mockOrders = {
				1: {
					id: 1,
					order_no: 'ORD' + String(now).slice(-10),
					status: 4,
					demand_title: '家庭电路改造',
					master_name: '张师傅',
					master_avatar: '/static/avatar1.png',
					master_rating: 4.8,
					master_phone: '13800138001',
					total_price: 3500.00,
					labor_price: 2000.00,
					material_price: 1200.00,
					other_price: 300.00,
					service_type: 1,
					power_kw: 15,
					address: '北京市朝阳区xxx街道xxx号',
					created_at: now - oneWeek,
					contract_url: ''
				},
				2: {
					id: 2,
					order_no: 'ORD' + String(now - 1000).slice(-10),
					status: 4,
					demand_title: '老旧线路维修',
					master_name: '李师傅',
					master_avatar: '/static/avatar2.png',
					master_rating: 4.9,
					master_phone: '13800138002',
					total_price: 1200.00,
					labor_price: 800.00,
					material_price: 350.00,
					other_price: 50.00,
					service_type: 1,
					power_kw: 8,
					address: '北京市海淀区xxx街道xxx号',
					created_at: now - oneWeek - oneDay,
					contract_url: ''
				},
				3: {
					id: 3,
					order_no: 'ORD' + String(now - 2000).slice(-10),
					status: 4,
					demand_title: '智能家居电路安装',
					master_name: '王师傅',
					master_avatar: '/static/avatar3.png',
					master_rating: 4.7,
					master_phone: '13800138003',
					total_price: 2800.00,
					labor_price: 1500.00,
					material_price: 1000.00,
					other_price: 300.00,
					service_type: 1,
					power_kw: 12,
					address: '北京市西城区xxx街道xxx号',
					created_at: now - oneWeek - 2 * oneDay,
					contract_url: ''
				},
				4: {
					id: 4,
					order_no: 'ORD' + String(now - 3000).slice(-10),
					status: 4,
					demand_title: '配电箱升级改造',
					master_name: '刘师傅',
					master_avatar: '/static/avatar4.png',
					master_rating: 4.9,
					master_phone: '13800138004',
					total_price: 4500.00,
					labor_price: 2500.00,
					material_price: 1800.00,
					other_price: 200.00,
					service_type: 1,
					power_kw: 20,
					address: '北京市东城区xxx街道xxx号',
					created_at: now - 2 * oneWeek,
					contract_url: ''
				},
				5: {
					id: 5,
					order_no: 'ORD' + String(now - 4000).slice(-10),
					status: 4,
					demand_title: '厨房电路增容',
					master_name: '陈师傅',
					master_avatar: '/static/avatar5.png',
					master_rating: 4.6,
					master_phone: '13800138005',
					total_price: 2200.00,
					labor_price: 1200.00,
					material_price: 900.00,
					other_price: 100.00,
					service_type: 1,
					power_kw: 10,
					address: '北京市丰台区xxx街道xxx号',
					created_at: now - 2 * oneWeek - oneDay,
					contract_url: ''
				},
				6: {
					id: 6,
					order_no: 'ORD' + String(now - 5000).slice(-10),
					status: 4,
					demand_title: '卫生间防水电路改造',
					master_name: '赵师傅',
					master_avatar: '/static/avatar6.png',
					master_rating: 4.8,
					master_phone: '13800138006',
					total_price: 1800.00,
					labor_price: 1000.00,
					material_price: 700.00,
					other_price: 100.00,
					service_type: 1,
					power_kw: 8,
					address: '北京市石景山区xxx街道xxx号',
					created_at: now - 3 * oneWeek,
					contract_url: ''
				},
				7: {
					id: 7,
					order_no: 'ORD' + String(now - 6000).slice(-10),
					status: 4,
					demand_title: '客厅照明电路改造',
					master_name: '周师傅',
					master_avatar: '/static/avatar7.png',
					master_rating: 4.7,
					master_phone: '13800138007',
					total_price: 1500.00,
					labor_price: 800.00,
					material_price: 600.00,
					other_price: 100.00,
					service_type: 1,
					power_kw: 6,
					address: '北京市通州区xxx街道xxx号',
					created_at: now - 3 * oneWeek - oneDay,
					contract_url: ''
				},
				8: {
					id: 8,
					order_no: 'ORD' + String(now - 7000).slice(-10),
					status: 4,
					demand_title: '阳台电路安装',
					master_name: '吴师傅',
					master_avatar: '/static/avatar8.png',
					master_rating: 4.5,
					master_phone: '13800138008',
					total_price: 900.00,
					labor_price: 500.00,
					material_price: 350.00,
					other_price: 50.00,
					service_type: 1,
					power_kw: 5,
					address: '北京市昌平区xxx街道xxx号',
					created_at: now - 4 * oneWeek,
					contract_url: ''
				},
				9: {
					id: 9,
					order_no: 'ORD' + String(now - 100).slice(-10),
					status: 1,
					demand_title: '卧室电路改造',
					master_name: '郑师傅',
					master_avatar: '/static/avatar9.png',
					master_rating: 4.8,
					master_phone: '13800138009',
					total_price: 2000.00,
					labor_price: 1100.00,
					material_price: 800.00,
					other_price: 100.00,
					service_type: 1,
					power_kw: 9,
					address: '北京市大兴区xxx街道xxx号',
					created_at: now - 2 * oneDay,
					contract_url: ''
				},
				10: {
					id: 10,
					order_no: 'ORD' + String(now - 200).slice(-10),
					status: 2,
					demand_title: '书房电路安装',
					master_name: '孙师傅',
					master_avatar: '/static/avatar10.png',
					master_rating: 4.9,
					master_phone: '13800138010',
					total_price: 1600.00,
					labor_price: 900.00,
					material_price: 600.00,
					other_price: 100.00,
					service_type: 1,
					power_kw: 7,
					address: '北京市房山区xxx街道xxx号',
					created_at: now - oneDay,
					contract_url: ''
				},
				11: {
					id: 11,
					order_no: 'ORD' + String(now - 300).slice(-10),
					status: 3,
					demand_title: '车库电路改造',
					master_name: '钱师傅',
					master_avatar: '/static/avatar11.png',
					master_rating: 4.7,
					master_phone: '13800138011',
					total_price: 3000.00,
					labor_price: 1800.00,
					material_price: 1100.00,
					other_price: 100.00,
					service_type: 1,
					power_kw: 16,
					address: '北京市顺义区xxx街道xxx号',
					created_at: now - 3 * oneDay,
					contract_url: ''
				},
				12: {
					id: 12,
					order_no: 'ORD' + String(now - 8000).slice(-10),
					status: 5,
					demand_title: '阳台电路安装（已取消）',
					master_name: '冯师傅',
					master_avatar: '/static/avatar12.png',
					master_rating: 4.6,
					master_phone: '13800138012',
					total_price: 1100.00,
					labor_price: 600.00,
					material_price: 450.00,
					other_price: 50.00,
					service_type: 1,
					power_kw: 6,
					address: '北京市怀柔区xxx街道xxx号',
					created_at: now - 5 * oneWeek,
					contract_url: ''
				}
			};
			
			return mockOrders[orderId] || null;
		},
		
		/**
		 * 更新进度步骤
		 */
		updateProgressSteps() {
			const status = this.orderData.status;
			this.progressSteps = [
				{ label: '已下单', completed: status >= 1, active: status === 1 },
				{ label: '已支付', completed: status >= 2, active: status === 2 },
				{ label: '施工中', completed: status >= 3, active: status === 3 },
				{ label: '已完成', completed: status >= 4, active: status === 4 }
			];
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
		 * 获取场景文本
		 */
		getSceneText(sceneType) {
			const sceneMap = {
				1: '生活用电',
				2: '养殖棚',
				3: '加工配套',
				4: '其他'
			};
			return sceneMap[sceneType] || '未知';
		},
		
		/**
		 * 支付订单
		 */
		async payOrder() {
			uni.showModal({
				title: '确认支付',
				content: `确认支付 ¥${this.orderData.total_price} ？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							await request.post('/api/order/pay', {
								order_id: this.orderId
							});
							
							uni.showToast({
								title: '支付成功',
								icon: 'success'
							});
							
							// 刷新订单详情
							setTimeout(() => {
								this.loadOrderDetail();
							}, 1500);
							
							// 通知首页更新统计
							uni.$emit('orderStatusChanged');
						} catch (error) {
							console.error('支付失败', error);
						}
					}
				}
			});
		},
		
		/**
		 * 取消订单
		 */
		async cancelOrder() {
			uni.showModal({
				title: '确认取消',
				content: '确定要取消此订单吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await request.post('/api/order/cancel', {
								order_id: this.orderId
							});
							
							uni.showToast({
								title: '订单已取消',
								icon: 'success'
							});
							
							// 通知首页更新统计
							uni.$emit('orderStatusChanged');
							
							// 返回订单列表
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
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
		async confirmOrder() {
			uni.showModal({
				title: '确认验收',
				content: '确认工程已验收完成？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await request.post('/api/order/confirm', {
								order_id: this.orderId
							});
							
							uni.showToast({
								title: '验收成功',
								icon: 'success'
							});
							
							// 刷新订单详情
							setTimeout(() => {
								this.loadOrderDetail();
							}, 1500);
							
							// 通知首页更新统计
							uni.$emit('orderStatusChanged');
						} catch (error) {
							console.error('确认验收失败', error);
						}
					}
				}
			});
		},
		
		/**
		 * 联系师傅
		 */
		contactMaster() {
			uni.makePhoneCall({
				phoneNumber: this.orderData.master_phone
			});
		},
		
		/**
		 * 查看合同
		 */
		viewContract() {
			uni.previewImage({
				urls: [this.orderData.contract_url]
			});
		},
		
		/**
		 * 申请售后
		 */
		applyAfterSale() {
			// 临时禁用售后功能，等待页面创建
			uni.showToast({
				title: '售后功能开发中',
				icon: 'none'
			});
			// uni.navigateTo({
			// 	url: `/pages/user/after-sale/create?order_id=${this.orderId}`
			// });
		},
		
		/**
		 * 查看质保
		 */
		viewWarranty() {
			uni.showModal({
				title: '质保信息',
				content: `质保期：${this.orderData.warranty_months}个月\n质保开始时间：${this.formatTime(this.orderData.completed_at)}`,
				showCancel: false
			});
		},
		
		/**
		 * 格式化时间
		 */
		formatTime(timestamp) {
			if (!timestamp) return '';
			const date = new Date(timestamp);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		}
	}
};
</script>

<style scoped>
.container {
	padding: 0 20rpx 20rpx;
	background-color: #f0f9f4;
	min-height: 100vh;
}

.order-card, .info-card {
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
	font-size: 28rpx;
	color: #666;
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

.progress-section {
	margin-top: 20rpx;
}

.progress-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.progress-steps {
	display: flex;
	justify-content: space-between;
}

.step-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.step-item:not(:last-child)::after {
	content: '';
	position: absolute;
	top: 15rpx;
	left: 50%;
	width: 100%;
	height: 2rpx;
	background-color: #e0e0e0;
	z-index: 0;
}

.step-item.completed:not(:last-child)::after {
	background-color: #2F85FC;
}

.step-dot {
	width: 30rpx;
	height: 30rpx;
	border-radius: 50%;
	background-color: #e0e0e0;
	border: 4rpx solid #fff;
	position: relative;
	z-index: 1;
	margin-bottom: 10rpx;
}

.step-item.active .step-dot {
	background-color: #2F85FC;
}

.step-item.completed .step-dot {
	background-color: #2F85FC;
}

.step-label {
	font-size: 24rpx;
	color: #999;
}

.step-item.active .step-label,
.step-item.completed .step-label {
	color: #333;
	font-weight: bold;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.info-item {
	display: flex;
	margin-bottom: 15rpx;
	font-size: 28rpx;
}

.info-label {
	color: #666;
	width: 160rpx;
}

.info-value {
	color: #333;
	flex: 1;
}

.master-card {
	display: flex;
	align-items: center;
}

.master-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	margin-right: 20rpx;
}

.master-info {
	flex: 1;
}

.master-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.master-rating {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.rating-star {
	font-size: 24rpx;
	margin-right: 5rpx;
}

.rating-value {
	font-size: 28rpx;
	color: #ff9800;
}

.master-phone {
	font-size: 28rpx;
	color: #2F85FC;
}

.price-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
	font-size: 28rpx;
}

.price-label {
	color: #666;
}

.price-value {
	color: #333;
	font-weight: bold;
}

.price-total {
	display: flex;
	justify-content: space-between;
	padding-top: 20rpx;
	border-top: 2rpx solid #f0f0f0;
	margin-top: 20rpx;
}

.total-label {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.total-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #2F85FC;
}

.contract-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #333;
}

.contract-arrow {
	font-size: 32rpx;
	color: #999;
}

.action-section {
	display: flex;
	gap: 20rpx;
	padding: 30rpx 0;
}

.btn {
	flex: 1;
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	border-radius: 8rpx;
	font-size: 32rpx;
	border: none;
}

.btn-primary {
	background-color: #2F85FC;
	color: #fff;
}

.btn-secondary {
	background-color: #f0f0f0;
	color: #666;
}
</style>


