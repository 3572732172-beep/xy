<template>
	<view class="container" :class="{ 'large-font': largeFontMode }">
		<view class="settings-section">
			<view class="section-title">显示设置</view>
			<view class="setting-item">
				<view class="setting-info">
					<text class="setting-label">大字体模式</text>
					<text class="setting-desc">适合老年人使用，字体和按钮更大</text>
				</view>
				<switch :checked="largeFontMode" @change="toggleLargeFont" color="#2F85FC" />
			</view>
		</view>

		<view class="settings-section">
			<view class="section-title">账户信息</view>
			<view class="setting-item" v-if="userInfo">
				<text class="setting-label">用户名</text>
				<text class="setting-value">{{ userInfo.name || userInfo.phone }}</text>
			</view>
			<view class="setting-item" v-if="userInfo">
				<text class="setting-label">手机号</text>
				<text class="setting-value">{{ userInfo.phone }}</text>
			</view>
			<view class="setting-item" v-if="!isLoggedIn" @click="login">
				<text class="setting-label">登录/注册</text>
				<text class="setting-arrow">></text>
			</view>
		</view>

		<view class="settings-section">
			<view class="section-title">数据管理</view>
			<view class="setting-item" @click="viewDrafts">
				<text class="setting-label">草稿箱</text>
				<text class="setting-badge" v-if="draftCount > 0">{{ draftCount }}</text>
				<text class="setting-arrow">></text>
			</view>
			<view class="setting-item" @click="clearCache">
				<text class="setting-label">清除缓存</text>
				<text class="setting-arrow">></text>
			</view>
		</view>

		<view class="settings-section" v-if="isLoggedIn">
			<view class="setting-item logout" @click="logout">
				<text class="setting-label logout-text">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import userStore from '@/store/user.js';
	import offline from '@/utils/offline.js';

	export default {
		data() {
			return {
				largeFontMode: false,
				isLoggedIn: false,
				userInfo: null,
				draftCount: 0
			};
		},
		onLoad() {
			this.loadSettings();
		},
		onShow() {
			// 每次显示时刷新草稿数量
			this.draftCount = offline.draftDemand.getAll().length;
		},
		methods: {
			/**
			 * 加载设置
			 */
			loadSettings() {
				this.largeFontMode = userStore.state.largeFontMode;
				this.isLoggedIn = userStore.state.isLoggedIn;
				this.userInfo = userStore.state.userInfo;
				this.draftCount = offline.draftDemand.getAll().length;
			},

			/**
			 * 切换大字体模式
			 */
			toggleLargeFont(e) {
				userStore.toggleLargeFontMode();
				this.largeFontMode = userStore.state.largeFontMode;

				uni.showToast({
					title: this.largeFontMode ? '已开启大字体模式' : '已关闭大字体模式',
					icon: 'success'
				});
			},

			/**
			 * 登录
			 */
			login() {
				uni.navigateTo({
					url: '/pages/user/login/index'
				});
			},

			/**
			 * 查看草稿
			 */
			viewDrafts() {
				uni.navigateTo({
					url: '/pages/user/demand/drafts'
				});
			},

			/**
			 * 清除缓存
			 */
			clearCache() {
				uni.showModal({
					title: '确认清除',
					content: '确定要清除所有缓存数据吗？',
					success: (res) => {
						if (res.confirm) {
							// 清除草稿（保留已同步的）
							const drafts = offline.draftDemand.getAll();
							const syncedDrafts = drafts.filter(d => {
								const queue = offline.syncQueue.getAll();
								return !queue.find(q => q.local_id === d.offline_local_id);
							});
							offline.draftDemand.clear();
							syncedDrafts.forEach(d => {
								offline.draftDemand.save(d);
							});

							uni.showToast({
								title: '缓存已清除',
								icon: 'success'
							});

							this.draftCount = offline.draftDemand.getAll().length;
						}
					}
				});
			},

			/**
			 * 退出登录
			 */
			logout() {
				uni.showModal({
					title: '确认退出',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							userStore.clearUserInfo();
							this.isLoggedIn = false;
							this.userInfo = null;

							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							});
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
	}

	.settings-section {
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.section-title {
		padding: 30rpx;
		font-size: 28rpx;
		color: #999;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.setting-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.setting-item:last-child {
		border-bottom: none;
	}

	.setting-info {
		flex: 1;
	}

	.setting-label {
		font-size: 32rpx;
		color: #333;
		display: block;
		margin-bottom: 5rpx;
	}

	.setting-desc {
		font-size: 24rpx;
		color: #999;
	}

	.setting-value {
		font-size: 28rpx;
		color: #666;
	}

	.setting-arrow {
		font-size: 32rpx;
		color: #999;
		margin-left: 20rpx;
	}

	.setting-badge {
		background-color: #ff4444;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
		margin-left: 10rpx;
	}

	.logout {
		justify-content: center;
	}

	.logout-text {
		color: #ff4444;
		text-align: center;
	}
</style>