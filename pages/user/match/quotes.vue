<template>
	<view class="container" :class="{ 'large-font': largeFontMode }">
		<view class="quote-list">
			<view 
				class="quote-item" 
				v-for="quote in quoteList" 
				:key="quote.id"
				@click="viewQuoteDetail(quote)"
			>
				<view class="quote-header">
					<image :src="quote.master_avatar" class="master-avatar" mode="aspectFill" />
					<view class="master-info">
						<text class="master-name">{{ quote.master_name }}</text>
						<view class="master-rating">
							<text class="rating-star">⭐</text>
							<text class="rating-value">{{ quote.rating }}</text>
							<text class="rating-count">({{ quote.order_count }}单)</text>
						</view>
					</view>
					<text class="quote-price">¥{{ quote.total_price }}</text>
				</view>
				
				<view class="quote-details">
					<view class="detail-item">
						<text class="detail-label">距离：</text>
						<text class="detail-value">{{ quote.distance }}km</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">工期：</text>
						<text class="detail-value">{{ quote.work_days }}天</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">质保：</text>
						<text class="detail-value">{{ quote.warranty_months }}个月</text>
					</view>
				</view>
				
				<view class="quote-materials" v-if="quote.materials && quote.materials.length > 0">
					<text class="materials-label">材料清单：</text>
					<text class="materials-text">{{ quote.materials.join('、') }}</text>
				</view>
				
				<view class="quote-actions">
					<button class="btn btn-secondary" @click.stop="contactMaster(quote)">联系师傅</button>
					<button class="btn btn-primary" @click.stop="createOrder(quote)">选择此报价</button>
				</view>
			</view>
		</view>
		
		<view class="empty" v-if="!loading && quoteList.length === 0">
			<text>暂无报价</text>
		</view>
	</view>
</template>

<script>
import request from '@/utils/request.js';
import userStore from '@/store/user.js';

export default {
	data() {
		return {
			demandId: null,
			quoteList: [],
			loading: false,
			largeFontMode: false
		};
	},
	onLoad(options) {
		if (options.demand_id) {
			this.demandId = options.demand_id;
			this.loadQuotes();
		}
		
		this.largeFontMode = userStore.state.largeFontMode;
	},
	onPullDownRefresh() {
		this.loadQuotes().finally(() => {
			uni.stopPullDownRefresh();
		});
	},
	methods: {
		/**
		 * 加载报价列表
		 */
		async loadQuotes() {
			this.loading = true;
			
			try {
				const result = await request.get('/api/demand/quote/list', {
					demand_id: this.demandId
				});
				
				this.quoteList = result.list || [];
			} catch (error) {
				console.error('加载报价列表失败', error);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},
		
		/**
		 * 查看报价详情
		 */
		viewQuoteDetail(quote) {
			uni.navigateTo({
				url: `/pages/user/match/quote-detail?quote_id=${quote.id}`
			});
		},
		
		/**
		 * 联系师傅
		 */
		contactMaster(quote) {
			uni.makePhoneCall({
				phoneNumber: quote.master_phone
			});
		},
		
		/**
		 * 创建订单
		 */
		async createOrder(quote) {
			uni.showModal({
				title: '确认选择',
				content: `确定选择${quote.master_name}的报价吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							const result = await request.post('/api/order/create', {
								quote_id: quote.id,
								warranty_months: quote.warranty_months || 12
							});
							
							uni.showToast({
								title: '订单创建成功',
								icon: 'success'
							});
							
							setTimeout(() => {
								uni.redirectTo({
									url: `/pages/user/order/detail?order_id=${result.id}`
								});
							}, 1500);
						} catch (error) {
							console.error('创建订单失败', error);
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
	padding: 20rpx;
}

.quote-list {
	
}

.quote-item {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.quote-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
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
}

.rating-star {
	font-size: 24rpx;
	margin-right: 5rpx;
}

.rating-value {
	font-size: 28rpx;
	color: #ff9800;
	margin-right: 10rpx;
}

.rating-count {
	font-size: 24rpx;
	color: #999;
}

.quote-price {
	font-size: 40rpx;
	font-weight: bold;
	color: #2F85FC;
}

.quote-details {
	display: flex;
	gap: 30rpx;
	margin-bottom: 20rpx;
	padding: 20rpx;
	background-color: #f5f5f5;
	border-radius: 8rpx;
}

.detail-item {
	font-size: 24rpx;
}

.detail-label {
	color: #666;
}

.detail-value {
	color: #333;
	font-weight: bold;
}

.quote-materials {
	margin-bottom: 20rpx;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 8rpx;
}

.materials-label {
	font-size: 24rpx;
	color: #666;
	margin-right: 10rpx;
}

.materials-text {
	font-size: 24rpx;
	color: #333;
}

.quote-actions {
	display: flex;
	gap: 20rpx;
}

.btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 8rpx;
	font-size: 28rpx;
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

.empty {
	text-align: center;
	padding: 100rpx 0;
	font-size: 28rpx;
	color: #999;
}
</style>


