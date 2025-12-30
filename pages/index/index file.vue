<template>
	<view class="home" :class="{ 'large-font': largeFontMode }">
		<view class="status-bar"></view>
		<view class="top-bar">
			<view class="location" @click="chooseRegion">
				<text class="city">{{ currentRegion }}</text>
				<text class="arrow">▼</text>
			</view>
			<view class="top-actions">
				<view class="dot-icon">
					<text>···</text>
				</view>
				<image class="avatar" src="/static/center.png" mode="aspectFill" @click="viewSettings" />
			</view>
		</view>

		<view class="search-bar">
			<input class="search-input" v-model="searchKeyword" placeholder="搜索需求、订单或服务" confirm-type="search"
				@confirm="handleSearch" />
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>

		<view class="hero-card">
			<image class="hero-bg" src="/static/sybgc_compressed.png" mode="aspectFill" />
			<view class="hero-mask"></view>
		</view>

		<view class="entry-cards">
			<view class="entry-card" v-for="card in primaryEntries" :key="card.id" @click="handleEntry(card.action)">
				<text class="entry-icon">{{ card.icon }}</text>
				<view>
					<text class="entry-title">{{ card.title }}</text>
					<text class="entry-desc">{{ card.desc }}</text>
				</view>
				<uni-icons type="right" size="18" color="#C7C7CC"></uni-icons>
			</view>
		</view>

		<view class="service-grid">
			<view class="service-item" v-for="item in serviceGrid" :key="item.id" @click="handleEntry(item.action)">
				<view class="service-icon">{{ item.icon }}</view>
				<text class="service-label">{{ item.label }}</text>
			</view>
		</view>

		<view class="stats-panel">
			<view class="stat-item">
				<text class="stat-value">{{ stats.ongoingOrders }}</text>
				<text class="stat-label">进行中订单</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ stats.finishedOrders }}</text>
				<text class="stat-label">已完成订单</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ stats.draftCount }}</text>
				<text class="stat-label">草稿箱</text>
			</view>
		</view>

		<view class="notice-card">
			<view>
				<text class="notice-title">尊享专业服务</text>
				<text class="notice-desc">持证电工 · 一对一客服 · 施工可视化</text>
			</view>
			<button class="notice-btn" @click="createDemand">立即体验</button>
		</view>


		<service-float />
	</view>
</template>

<script>
	import userStore from '@/store/user.js';
	import request from '@/utils/request.js';
	import offline from '@/utils/offline.js';
	import ServiceFloat from '@/components/ServiceFloat.vue';

	export default {
		components: {
			ServiceFloat
		},
		data() {
			return {
				largeFontMode: false,
				userNameDisplay: '乡亲',
				currentRegion: '中部地区',
				searchKeyword: '',
				stats: {
					ongoingOrders: 0,
					finishedOrders: 0,
					draftCount: 0
				},
				primaryEntries: [{
						id: 'demand',
						title: '发布需求',
						desc: '全程托管，极速响应',
						icon: '📝',
						action: 'createDemand'
					},
					{
						id: 'order',
						title: '我的订单',
						desc: '进度查询 / 验收',
						icon: '📋',
						action: 'viewOrders'
					}
				],
				serviceGrid: [{
						id: 'draft',
						label: '草稿箱',
						icon: '🗂',
						action: 'viewDrafts'
					},
					{
						id: 'match',
						label: '匹配电工',
						icon: '👷',
						action: 'matchMaster'
					},
					{
						id: 'quote',
						label: '报价单',
						icon: '💰',
						action: 'viewQuotes'
					},
					{
						id: 'support',
						label: '在线客服',
						icon: '💬',
						action: 'contactSupport'
					},
					{
						id: 'settings',
						label: '设置',
						icon: '⚙️',
						action: 'viewSettings'
					},
					{
						id: 'about',
						label: '关于我们',
						icon: 'ℹ️',
						action: 'viewAbout'
					}
				]
			};
		},
		onShow() {
			this.largeFontMode = userStore.state.largeFontMode;
			this.initUserInfo();
			// 每次显示时都刷新统计数据，确保实时性
			this.loadStats();

			// 监听需求创建事件，自动刷新统计数据
			uni.$on('demandCreated', () => {
				this.loadStats();
			});

			// 监听订单状态变化事件，实时更新统计
			uni.$on('orderStatusChanged', () => {
				this.loadStats();
			});
		},
		onUnload() {
			// 页面卸载时移除事件监听
			uni.$off('demandCreated');
			uni.$off('orderStatusChanged');
		},
		methods: {
			initUserInfo() {
				const userInfo = userStore.state.userInfo;
				if (userInfo && (userInfo.name || userInfo.phone)) {
					this.userNameDisplay = userInfo.name || userInfo.phone;
				} else {
					this.userNameDisplay = '乡亲';
				}
			},
			async loadStats() {
				this.stats.draftCount = offline.draftDemand.getAll().length || 0;

				if (!userStore.state.isLoggedIn) {
					this.stats.ongoingOrders = 0;
					this.stats.finishedOrders = 0;
					return;
				}

				try {
					const res = await request.get('/api/order/list', {
						role: 'user',
						page: 1,
						page_size: 50
					});

					const list = res.list || [];
					let ongoing = 0;
					let finished = 0;
					list.forEach(item => {
						if (item.status === 4) {
							finished++;
						} else if (item.status !== 5) {
							ongoing++;
						}
					});
					this.stats.ongoingOrders = ongoing;
					this.stats.finishedOrders = finished;
				} catch (e) {
					// API失败时，使用模拟数据统计
					const mockOrders = this.getMockOrders();
					let ongoing = 0;
					let finished = 0;
					mockOrders.forEach(item => {
						if (item.status === 4) {
							finished++;
						} else if (item.status !== 5) {
							ongoing++;
						}
					});
					this.stats.ongoingOrders = ongoing;
					this.stats.finishedOrders = finished;
				}
			},

			/**
			 * 获取模拟订单数据（用于统计，与订单列表保持一致）
			 */
			getMockOrders() {
				const now = Date.now();
				const oneDay = 24 * 60 * 60 * 1000;
				const oneWeek = 7 * oneDay;

				return [
					// 已完成订单
					{
						id: 1,
						status: 4,
						order_no: 'ORD' + String(now).slice(-10)
					},
					{
						id: 2,
						status: 4,
						order_no: 'ORD' + String(now - 1000).slice(-10)
					},
					{
						id: 3,
						status: 4,
						order_no: 'ORD' + String(now - 2000).slice(-10)
					},
					{
						id: 4,
						status: 4,
						order_no: 'ORD' + String(now - 3000).slice(-10)
					},
					{
						id: 5,
						status: 4,
						order_no: 'ORD' + String(now - 4000).slice(-10)
					},
					{
						id: 6,
						status: 4,
						order_no: 'ORD' + String(now - 5000).slice(-10)
					},
					{
						id: 7,
						status: 4,
						order_no: 'ORD' + String(now - 6000).slice(-10)
					},
					{
						id: 8,
						status: 4,
						order_no: 'ORD' + String(now - 7000).slice(-10)
					},
					// 进行中订单
					{
						id: 9,
						status: 1,
						order_no: 'ORD' + String(now - 100).slice(-10)
					},
					{
						id: 10,
						status: 2,
						order_no: 'ORD' + String(now - 200).slice(-10)
					},
					{
						id: 11,
						status: 3,
						order_no: 'ORD' + String(now - 300).slice(-10)
					},
					// 已取消订单
					{
						id: 12,
						status: 5,
						order_no: 'ORD' + String(now - 8000).slice(-10)
					}
				];
			},
			handleSearch() {
				if (!this.searchKeyword.trim()) {
					uni.showToast({
						title: '请输入关键词',
						icon: 'none'
					});
					return;
				}
				uni.showToast({
					title: `搜索：${this.searchKeyword}`,
					icon: 'none'
				});
			},
			handleEntry(action) {
				if (typeof this[action] === 'function') {
					this[action]();
				}
			},
			createDemand() {
				uni.navigateTo({
					url: '/pages/user/demand/create'
				});
			},
			viewOrders() {
				uni.switchTab({
					url: '/pages/user/order/list'
				});
			},
			viewDrafts() {
				uni.navigateTo({
					url: '/pages/user/demand/drafts'
				});
			},
			matchMaster() {
				uni.navigateTo({
					url: '/pages/user/match/masters'
				});
			},
			viewQuotes() {
				uni.navigateTo({
					url: '/pages/user/match/quotes'
				});
			},
			viewSettings() {
				uni.navigateTo({
					url: '/pages/user/settings/index'
				});
			},
			viewAbout() {
				uni.navigateTo({
					url: '/pages/user/settings/index?tab=about'
				});
			},
			contactSupport() {
				uni.showModal({
					title: '客服支持',
					content: '拨打 400-123-4567 或添加客服微信：xydianan',
					showCancel: false
				});
			},
			chooseRegion() {
				uni.showActionSheet({
					itemList: ['中部地区', '华北地区', '西南地区'],
					success: (res) => {
						this.currentRegion = ['中部地区', '华北地区', '西南地区'][res.tapIndex];
					}
				});
			}
		}
	};
</script>

<style scoped>
	.home {
		padding: 20rpx 30rpx 180rpx;
		background-color: #f5f6fa;
		min-height: 100vh;
		box-sizing: border-box;
		font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
		color: #1f2933;
	}

	.status-bar {
		height: 40rpx;
	}

	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.location {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #333;
	}

	.city {
		font-weight: 600;
		margin-right: 8rpx;
	}

	.arrow {
		font-size: 24rpx;
		color: #999;
	}

	.top-actions {
		display: flex;
		align-items: center;
	}

	.dot-icon {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		border: 1rpx solid #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #333;
		margin-right: 20rpx;
	}

	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 0 10rpx 0 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 6rpx 20rpx rgba(47, 133, 90, 0.08);
	}

	.search-input {
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
	}

	.search-btn {
		background-color: #2f85fc;
		color: #fff;
		padding: 0 36rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
	}

	.hero-card {
		position: relative;
		border-radius: 24rpx;
		overflow: hidden;
		height: 300rpx;
		margin-bottom: 30rpx;
	}

	.hero-bg {
		width: 100%;
		height: 100%;
	}

	.entry-cards {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.entry-card {
		background-color: #fff;
		border-radius: 18rpx;
		padding: 24rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
	}

	.entry-icon {
		font-size: 46rpx;
		margin-right: 20rpx;
	}

	.entry-title {
		display: block;
		font-size: 32rpx;
		font-weight: 600;
		color: #222;
	}

	.entry-desc {
		display: block;
		font-size: 24rpx;
		color: #999;
		margin-top: 6rpx;
	}

	.entry-arrow {
		margin-left: auto;
		font-size: 32rpx;
		color: #ccc;
	}

	.service-grid {
		background-color: #fff;
		border-radius: 22rpx;
		padding: 20rpx 10rpx;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 30rpx;
	}

	.service-item {
		width: 33.33%;
		padding: 20rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12rpx;
	}

	.service-icon {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
		background: linear-gradient(145deg, #f4f9ff, #e1edff);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		color: #2f85fc;
	}

	.service-label {
		font-size: 26rpx;
		color: #333;
	}

	.stats-panel {
		display: flex;
		background-color: #fff;
		border-radius: 22rpx;
		margin-bottom: 30rpx;
	}

	.stat-item {
		flex: 1;
		padding: 24rpx 10rpx;
		text-align: center;
	}

	.stat-item+.stat-item {
		border-left: 2rpx solid #f4f4f4;
	}

	.stat-value {
		display: block;
		font-size: 36rpx;
		font-weight: 700;
		color: #2f85fc;
	}

	.stat-label {
		margin-top: 6rpx;
		font-size: 24rpx;
		color: #999;
	}

	.notice-card {
		background-color: #2f855a;
		border-radius: 22rpx;
		padding: 30rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}

	.notice-title {
		font-size: 30rpx;
		font-weight: 600;
	}

	.notice-desc {
		display: block;
		margin-top: 6rpx;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.notice-btn {
		background-color: #fff;
		color: #2f855a;
		border-radius: 40rpx;
		padding: 0 40rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 26rpx;
	}

	.hero-card {
		position: relative;
		margin: 30rpx 25rpx;
		/* 增加外边距，让卡片“呼吸”起来 */
		height: 320rpx;
		/* 统一高度 */
		border-radius: 24rpx;
		/* 大圆角是高颜值的关键 */
		overflow: hidden;
		/* 确保图片不超出圆角 */
		/* 核心属性：软阴影。它让卡片像浮在纸面上一样 */
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
		background-color: #fff;
		/* 防止图片加载前的白屏 */
	}

	.hero-bg {
		width: 100%;
		height: 100%;
		/* 保持原图比例裁剪，不拉伸变形 */
		display: block;
	}

	/* 进阶美化：给 Banner 增加一个微弱的内发光边框 */
	.hero-card::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 24rpx;
		border: 1px solid rgba(255, 255, 255, 0.2);
		/* 玻璃边框感 */
		pointer-events: none;
	}
</style>