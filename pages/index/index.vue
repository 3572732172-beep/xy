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
			this.loadStats();

			uni.$on('demandCreated', () => {
				this.loadStats();
			});

			uni.$on('orderStatusChanged', () => {
				this.loadStats();
			});
		},
		onUnload() {
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
			getMockOrders() {
				const now = Date.now();
				return [{
						id: 1,
						status: 4,
						order_no: 'ORD' + String(now).slice(-10)
					},
					{
						id: 9,
						status: 1,
						order_no: 'ORD' + String(now - 100).slice(-10)
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
		/* 默认左对齐 */
		transition: all 0.3s;
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
		margin: 30rpx 0;
		height: 320rpx;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
		background-color: #fff;
	}

	.hero-card::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 24rpx;
		border: 1px solid rgba(255, 255, 255, 0.2);
		pointer-events: none;
	}

	.hero-bg {
		width: 100%;
		height: 100%;
		display: block;
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

	/* =================================================================
	   【老年模式 / 大字模式 样式覆盖】
	   只修改字体大小、间距和位置，不改变页面结构
	   ================================================================= */

	/* 1. 顶部位置右移 (解决 AI 球遮挡问题) */
	.large-font .location {
		margin-left: 140rpx;
		/* 强制往右移 */
		transform: scale(1.2);
		/* 整体放大 */
		transform-origin: left center;
	}

	/* 2. 搜索框变大 */
	.large-font .search-bar {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.large-font .search-input {
		height: 100rpx;
		/* 增高 */
		font-size: 36rpx;
		/* 字体加大 */
	}

	.large-font .search-btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		padding: 0 50rpx;
	}

	/* 3. 核心功能卡片 (发布需求/我的订单) */
	.large-font .entry-card {
		padding: 40rpx;
		/* 内边距加大 */
	}

	.large-font .entry-icon {
		font-size: 70rpx;
		/* 图标巨大 */
	}

	.large-font .entry-title {
		font-size: 44rpx;
		/* 标题巨大 */
		font-weight: 900;
		/* 加粗 */
		margin-bottom: 10rpx;
	}

	.large-font .entry-desc {
		font-size: 30rpx;
		/* 描述文字加大 */
	}

	/* 4. 九宫格服务 */
	.large-font .service-grid {
		padding: 30rpx 10rpx;
	}

	.large-font .service-item {
		padding: 30rpx 0;
	}

	.large-font .service-icon {
		width: 120rpx;
		height: 120rpx;
		font-size: 60rpx;
	}

	.large-font .service-label {
		font-size: 34rpx;
		font-weight: bold;
		margin-top: 16rpx;
	}

	/* 5. 底部统计数字 */
	.large-font .stat-value {
		font-size: 50rpx;
	}

	.large-font .stat-label {
		font-size: 30rpx;
	}

	/* 6. 底部通知栏 */
	.large-font .notice-title {
		font-size: 36rpx;
	}

	.large-font .notice-desc {
		font-size: 28rpx;
	}

	.large-font .notice-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		padding: 0 50rpx;
	}
</style>