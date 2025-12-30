<template>
	<view class="page-header" :style="{ backgroundImage: backgroundImageStyle }">
		<view class="header-left" v-if="showBack">
			<view class="back-btn" @click="handleBack">
				<text class="back-icon">←</text>
			</view>
		</view>
		<view class="header-center">
			<text class="title">{{ title }}</text>
			<text v-if="subtitle" class="subtitle">{{ subtitle }}</text>
		</view>
		<view class="header-right">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PageHeader',
	props: {
		title: {
			type: String,
			default: ''
		},
		subtitle: {
			type: String,
			default: ''
		},
		showBack: {
			type: Boolean,
			default: true
		},
		backgroundImage: {
			type: String,
			default: ''
		}
	},
	computed: {
		backgroundImageStyle() {
			return this.backgroundImage ? `url(${this.backgroundImage})` : '';
		}
	},
	methods: {
		handleBack() {
			const pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1,
					fail: this.relaunchHome
				});
				return;
			}
			this.relaunchHome();
		},
		relaunchHome() {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		}
	}
};
</script>

<style scoped>
.page-header {
	padding: 32rpx 36rpx 28rpx;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	background: linear-gradient(135deg, #f0f8f3 0%, #f7fbf8 100%);
	background-size: cover;
	background-position: center;
	border-bottom-left-radius: 36rpx;
	border-bottom-right-radius: 36rpx;
	box-shadow: 0 8rpx 30rpx rgba(31, 80, 55, 0.08);
}

.header-left,
.header-right {
	width: auto;
	display: flex;
	align-items: center;
	justify-content: center;
}

.header-center {
	flex: 1;
	text-align: left;
	padding-left: 20rpx;
}

.back-btn {
	width: 72rpx;
	height: 72rpx;
	border-radius: 36rpx;
	background-color: #ffffff;
	border: 2rpx solid #e2efe7;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 6rpx 20rpx rgba(31, 80, 55, 0.08);
}

.back-icon {
	font-size: 34rpx;
	color: #1f7a4d;
}

.title {
	font-size: 38rpx;
	font-weight: 600;
	color: #1f2933;
}

.subtitle {
	margin-top: 8rpx;
	font-size: 26rpx;
	color: #64748b;
}
</style>


