<template>
	<view class="container" :class="{ 'large-font': largeFontMode }">
		<view class="filter-bar">
			<view class="filter-item" @click="showSortModal = true">
				<text>排序：{{ sortText }}</text>
				<text class="filter-arrow">▼</text>
			</view>
		</view>
		
		<view class="master-list">
			<view 
				class="master-item" 
				v-for="master in masterList" 
				:key="master.id"
				@click="viewMasterDetail(master)"
			>
				<image :src="master.avatar" class="master-avatar" mode="aspectFill" />
				<view class="master-info">
					<view class="master-header">
						<text class="master-name">{{ master.name }}</text>
						<view class="master-rating">
							<text class="rating-star">⭐</text>
							<text class="rating-value">{{ master.rating }}</text>
						</view>
					</view>
					<view class="master-tags">
						<text class="tag" v-for="tag in master.tags" :key="tag">{{ tag }}</text>
					</view>
					<view class="master-footer">
						<text class="distance">距离 {{ master.distance }}km</text>
						<text class="price-range">报价：¥{{ master.min_price }} - ¥{{ master.max_price }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="load-more" v-if="hasMore">
			<text v-if="loading">加载中...</text>
			<text v-else @click="loadMore">加载更多</text>
		</view>
		
		<view class="no-more" v-if="!hasMore && masterList.length > 0">
			<text>没有更多了</text>
		</view>
		
		<view class="empty" v-if="!loading && masterList.length === 0">
			<text>暂无匹配的师傅</text>
		</view>
		
		<!-- 排序选择弹窗 -->
		<view class="modal" v-if="showSortModal" @click="showSortModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-title">选择排序方式</view>
				<view 
					class="sort-option" 
					v-for="option in sortOptions" 
					:key="option.value"
					:class="{ 'active': currentSort === option.value }"
					@click="selectSort(option.value)"
				>
					<text>{{ option.label }}</text>
					<text class="check-icon" v-if="currentSort === option.value">✓</text>
				</view>
			</view>
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
			masterList: [],
			currentSort: 'distance',
			sortOptions: [
				{ value: 'distance', label: '距离最近' },
				{ value: 'rating', label: '评分最高' },
				{ value: 'price', label: '价格最低' }
			],
			page: 1,
			pageSize: 10,
			hasMore: true,
			loading: false,
			showSortModal: false,
			largeFontMode: false
		};
	},
	computed: {
		sortText() {
			const option = this.sortOptions.find(opt => opt.value === this.currentSort);
			return option ? option.label : '距离最近';
		}
	},
	onLoad(options) {
		this.demandId = options.demand_id || null;
		this.largeFontMode = userStore.state.largeFontMode;
		// 即使没有demand_id也可以显示师傅列表
		this.loadMasters();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.masterList = [];
		this.hasMore = true;
		this.loadMasters().finally(() => {
			uni.stopPullDownRefresh();
		});
	},
	methods: {
		/**
		 * 加载师傅列表
		 */
		async loadMasters() {
			if (this.loading) return;
			
			this.loading = true;
			
			try {
				const params = {
					sort: this.currentSort,
					page: this.page,
					page_size: this.pageSize
				};
				// 如果有demand_id才传递
				if (this.demandId) {
					params.demand_id = this.demandId;
				}
				
				const result = await request.get('/api/match/masters', params);
				
				if (result.list && result.list.length > 0) {
					this.masterList = this.masterList.concat(result.list);
					this.hasMore = result.list.length >= this.pageSize;
				} else {
					this.hasMore = false;
				}
			} catch (error) {
				console.error('加载师傅列表失败', error);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},
		
		/**
		 * 选择排序方式
		 */
		selectSort(sort) {
			this.currentSort = sort;
			this.showSortModal = false;
			this.page = 1;
			this.masterList = [];
			this.hasMore = true;
			this.loadMasters();
		},
		
		/**
		 * 加载更多
		 */
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.page++;
				this.loadMasters();
			}
		},
		
		/**
		 * 查看师傅详情
		 */
		viewMasterDetail(master) {
			uni.navigateTo({
				url: `/pages/user/match/master-detail?master_id=${master.id}&demand_id=${this.demandId}`
			});
		}
	}
};
</script>

<style scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.filter-bar {
	background-color: #fff;
	padding: 20rpx;
	border-bottom: 2rpx solid #e0e0e0;
}

.filter-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28rpx;
	color: #333;
}

.filter-arrow {
	font-size: 24rpx;
	color: #999;
}

.master-list {
	padding: 20rpx;
}

.master-item {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
}

.master-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 20rpx;
}

.master-info {
	flex: 1;
}

.master-header {
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
}

.master-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.tag {
	padding: 6rpx 12rpx;
	background-color: #f0f0f0;
	border-radius: 6rpx;
	font-size: 24rpx;
	color: #666;
}

.master-footer {
	display: flex;
	justify-content: space-between;
	font-size: 24rpx;
	color: #999;
}

.distance {
	color: #2F85FC;
}

.price-range {
	color: #ff9800;
	font-weight: bold;
}

.load-more, .no-more, .empty {
	text-align: center;
	padding: 40rpx;
	font-size: 28rpx;
	color: #999;
}

.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal-content {
	background-color: #fff;
	border-radius: 12rpx;
	width: 600rpx;
	max-height: 80vh;
	overflow-y: auto;
}

.modal-title {
	padding: 30rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	border-bottom: 2rpx solid #e0e0e0;
}

.sort-option {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 2rpx solid #f0f0f0;
	font-size: 28rpx;
	color: #333;
}

.sort-option.active {
	color: #2F85FC;
}

.check-icon {
	color: #2F85FC;
	font-size: 32rpx;
}
</style>


