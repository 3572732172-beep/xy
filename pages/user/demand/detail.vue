<template>
	<view class="container" :class="{ 'large-font': largeFontMode }">
		<page-header
			title="需求详情"
			subtitle="查看您的用电改造需求"
		/>
		<view class="demand-card">
			<view class="demand-header">
				<view class="status-badge" :class="'status-' + demandData.status">
					{{ getStatusText(demandData.status) }}
				</view>
				<text class="demand-title">{{ demandData.title }}</text>
			</view>
			
			<view class="demand-info">
				<view class="info-item">
					<text class="info-label">场景类型：</text>
					<text class="info-value">{{ getSceneText(demandData.service_type) }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">功率需求：</text>
					<text class="info-value">{{ demandData.power_kw }} kW</text>
				</view>
				<view class="info-item">
					<text class="info-label">施工地址：</text>
					<text class="info-value">{{ demandData.address }}</text>
				</view>
			</view>
			
			<view class="demand-description">
				<text class="desc-label">详细描述：</text>
				<text class="desc-content">{{ demandData.description }}</text>
			</view>
			
			<view class="demand-photos" v-if="demandData.photos && demandData.photos.length > 0">
				<image 
					v-for="(photo, index) in demandData.photos" 
					:key="index"
					:src="photo" 
					class="photo-item"
					mode="aspectFill"
					@click="previewPhoto(index)"
				/>
			</view>
		</view>
		
		<view class="action-section" v-if="demandData.status === 1">
			<button class="btn btn-primary" @click="viewQuotes">查看报价</button>
			<button class="btn btn-secondary" @click="viewMasters">匹配师傅</button>
		</view>
		
		<view class="quote-section" v-if="quotes.length > 0">
			<view class="section-title">收到的报价</view>
			<view 
				class="quote-item" 
				v-for="quote in quotes" 
				:key="quote.id"
				@click="viewQuoteDetail(quote)"
			>
				<view class="quote-header">
					<text class="master-name">{{ quote.master_name }}</text>
					<text class="quote-price">¥{{ quote.total_price }}</text>
				</view>
				<view class="quote-info">
					<text class="quote-distance">距离 {{ quote.distance }}km</text>
					<text class="quote-rating">评分 {{ quote.rating }}/5.0</text>
				</view>
			</view>
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
			demandId: null,
			demandData: {},
			quotes: [],
			largeFontMode: false
		};
	},
	onLoad(options) {
		if (options.id) {
			this.demandId = options.id;
			this.loadDemandDetail();
			this.loadQuotes();
		}
		
		this.largeFontMode = userStore.state.largeFontMode;
	},
	methods: {
		/**
		 * 加载需求详情
		 */
		async loadDemandDetail() {
			try {
				this.demandData = await request.get('/api/demand/detail', {
					id: this.demandId
				});
			} catch (error) {
				console.error('加载需求详情失败', error);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			}
		},
		
		/**
		 * 加载报价列表
		 */
		async loadQuotes() {
			try {
				const result = await request.get('/api/demand/quote/list', {
					demand_id: this.demandId
				});
				this.quotes = result.list || [];
			} catch (error) {
				console.error('加载报价列表失败', error);
			}
		},
		
		/**
		 * 获取状态文本
		 */
		getStatusText(status) {
			const statusMap = {
				1: '待报价',
				2: '已报价',
				3: '已接单',
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
		 * 预览照片
		 */
		previewPhoto(index) {
			uni.previewImage({
				current: index,
				urls: this.demandData.photos
			});
		},
		
		/**
		 * 查看报价
		 */
		viewQuotes() {
			uni.navigateTo({
				url: `/pages/user/match/quotes?demand_id=${this.demandId}`
			});
		},
		
		/**
		 * 匹配师傅
		 */
		viewMasters() {
			uni.navigateTo({
				url: `/pages/user/match/masters?demand_id=${this.demandId}`
			});
		},
		
		/**
		 * 查看报价详情
		 */
		viewQuoteDetail(quote) {
			uni.navigateTo({
				url: `/pages/user/match/quote-detail?quote_id=${quote.id}`
			});
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

.demand-card {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.demand-header {
	margin-bottom: 20rpx;
}

.status-badge {
	display: inline-block;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	margin-bottom: 10rpx;
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

.demand-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-top: 10rpx;
}

.demand-info {
	margin-bottom: 20rpx;
}

.info-item {
	display: flex;
	margin-bottom: 10rpx;
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

.demand-description {
	margin-bottom: 20rpx;
}

.desc-label {
	font-size: 28rpx;
	color: #666;
	display: block;
	margin-bottom: 10rpx;
}

.desc-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}

.demand-photos {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.photo-item {
	width: 200rpx;
	height: 200rpx;
	border-radius: 8rpx;
}

.action-section {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
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

.quote-section {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.quote-item {
	padding: 20rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 8rpx;
	margin-bottom: 20rpx;
	background-color: #fafafa;
}

.quote-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.master-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.quote-price {
	font-size: 36rpx;
	font-weight: bold;
	color: #2F85FC;
}

.quote-info {
	display: flex;
	gap: 30rpx;
	font-size: 24rpx;
	color: #999;
}
</style>


