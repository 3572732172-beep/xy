<template>
	<view class="container">
		<image class="bg-image" src="/static/bgc.png" mode="aspectFill" />
		<view class="overlay"></view>
		<page-header
			title="欢迎回到乡野电安"
			subtitle="一键登录，发布用电改造需求"
			:showBack="true"
		/>
		
		<view class="login-header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="app-name">乡野电安</text>
			<text class="app-desc">需求端（用户版）</text>
		</view>
		
		<view class="login-form">
			<view class="wechat-tip">
				<text class="tip-title">微信一键登录</text>
				<text class="tip-desc">无需记密码，授权后即可安全使用</text>
			</view>
			
			<button 
				class="btn btn-primary" 
				:loading="submitting"
				@click="handleWechatLogin"
			>
				{{ submitting ? '登录中...' : '使用微信登录' }}
			</button>
		</view>
		
		<view class="login-footer">
			<text class="footer-text">登录即表示同意《用户协议》和《隐私政策》</text>
		</view>
	</view>
</template>

<script>
import userStore from '@/store/user.js';
import PageHeader from '@/components/PageHeader.vue';

export default {
	components: {
		PageHeader
	},
	data() {
		return {
			submitting: false
		};
	},
	onLoad() {
		if (userStore.state.isLoggedIn) {
			uni.switchTab({
				url: '/pages/index/index'
			});
		}
	},
	methods: {
		/**
		 * 微信登录
		 */
		async handleWechatLogin() {
			this.submitting = true;
			try {
				// 尝试调用后端登录接口
				let userInfo = null;
				let token = null;
				
				try {
					// 获取微信登录code（小程序环境）
					// #ifdef MP-WEIXIN
					const loginRes = await new Promise((resolve, reject) => {
						uni.login({
							provider: 'weixin',
							success: resolve,
							fail: reject
						});
					});
					
					if (loginRes.code) {
						const result = await uni.request({
							url: 'http://192.168.109.1:3000/api/auth/wechat-login',
							method: 'POST',
							data: {
								code: loginRes.code,
								nickName: '微信用户',
								avatarUrl: ''
							}
						});
						
						if (result.data && result.data.code === 0) {
							userInfo = {
								id: result.data.data.id,
								phone: result.data.data.phone,
								name: result.data.data.name || '微信用户',
								avatar: result.data.data.avatar || ''
							};
							token = result.data.data.token;
						}
					}
					// #endif
					
					// 如果微信登录失败，使用临时账号
					if (!userInfo || !token) {
						throw new Error('微信登录失败，使用临时账号');
					}
				} catch (error) {
					console.log('使用临时账号登录', error);
					// 临时模拟登录
					userInfo = {
						id: 1,
						phone: '13800138000',
						name: '测试用户',
						avatar: ''
					};
					token = 'dev-token-' + Date.now();
				}
				
				// 保存登录信息
				userStore.setUserInfo(userInfo, token);
				
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				});
				
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}, 800);
			} catch (error) {
				console.error('登录失败', error);
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				});
			} finally {
				this.submitting = false;
			}
		}
	}
};
</script>

<style scoped>
.container {
	min-height: 100vh;
	padding: 40rpx 32rpx 60rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	position: relative;
}

.bg-image {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45));
	z-index: 0;
}

.login-header {
	text-align: center;
	margin: 80rpx 0 60rpx;
	z-index: 1;
}

.logo {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 30rpx;
	border-radius: 24rpx;
	background-color: rgba(255, 255, 255, 0.8);
	padding: 20rpx;
}

.app-name {
	display: block;
	font-size: 48rpx;
	font-weight: bold;
	color: #e6fffa;
	margin-bottom: 10rpx;
}

.app-desc {
	display: block;
	font-size: 28rpx;
	color: rgba(230, 255, 250, 0.9);
}

.login-form {
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 24rpx;
	padding: 50rpx 40rpx;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
	z-index: 1;
}

.wechat-tip {
	margin-bottom: 40rpx;
}

.tip-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #22543d;
	margin-bottom: 10rpx;
}

.tip-desc {
	font-size: 26rpx;
	color: #5f8c6a;
}

.btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	border-radius: 12rpx;
	font-size: 32rpx;
	font-weight: bold;
	border: none;
	margin-top: 20rpx;
}

.btn-primary {
	background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
	color: #fff;
	box-shadow: 0 8rpx 20rpx rgba(56, 161, 105, 0.35);
}

.login-footer {
	text-align: center;
	margin-top: 40rpx;
	z-index: 1;
}

.footer-text {
	font-size: 24rpx;
	color: rgba(230, 255, 250, 0.85);
}
</style>

