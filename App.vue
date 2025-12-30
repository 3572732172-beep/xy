<script>
	import userStore from './store/user.js';

	export default {
		onLaunch: function() {
			console.log('App Launch - 乡野电安需求端');

			// 初始化用户 store（从本地存储恢复登录状态）
			userStore.loadFromStorage();

			// 如果已登录，验证token有效性（可选）
			if (userStore.state.isLoggedIn) {
				console.log('应用启动：已恢复登录状态，用户ID:', userStore.state.userInfo?.id);
			}

			// 应用大字体模式
			this.applyFontSize();

			// 获取定位信息
			this.getLocation();

			// #ifdef APP-NVUE
			plus.screen.lockOrientation('portrait-primary');

			let appid = plus.runtime.appid;
			if (appid && appid.toLocaleLowerCase() != "hbuilder") {
				uni.request({
					url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
					data: {
						appid: plus.runtime.appid,
						version: plus.runtime.version
					},
					success: (res) => {
						console.log('success', res);
						if (res.statusCode == 200 && res.data.isUpdate) {
							let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
							// 提醒用户更新
							uni.showModal({
								title: '更新提示',
								content: res.data.note ? res.data.note : '是否选择更新',
								success: (showResult) => {
									if (showResult.confirm) {
										plus.runtime.openURL(openUrl);
									}
								}
							})
						}
					}
				})
			}

			var domModule = weex.requireModule('dom');
			domModule.addRule('fontFace', {
				'fontFamily': "texticons",
				'src': "url('./static/text-icon.ttf')"
			});
			// #endif
		},
		onShow: function() {
			console.log('App Show');

			// 检查网络状态，触发离线同步
			uni.getNetworkType({
				success: (res) => {
					if (res.isConnected) {
						// 网络可用，尝试同步离线数据
						const offline = require('./utils/offline.js').default;
						offline.triggerSync();
					}
				}
			});
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			/**
			 * 应用字体大小
			 */
			applyFontSize() {
				const fontSize = userStore.state.fontSize;
				// 通过设置页面根元素的 font-size 来实现大字体模式
				// 注意：uni-app 中需要在页面级别应用，这里设置全局变量
				// #ifdef H5
				document.documentElement.style.fontSize = fontSize + 'px';
				// #endif
			},

			/**
			 * 获取定位信息
			 */
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						userStore.setLocation(res.longitude, res.latitude);
					},
					fail: (err) => {
						console.error('获取定位失败', err);
					}
				});
			}
		}
	}
</script>

<style>
	/*每个页面公共css */

	/* 大字体模式全局样式 */
	.large-font {
		font-size: 18px !important;
	}

	.large-font .input,
	.large-font .textarea,
	.large-font .btn {
		font-size: 18px !important;
		padding: 15px;
	}

	/* #ifndef APP-NVUE */
	.large-font .input,
	.large-font .textarea,
	.large-font .btn {
		height: auto;
		min-height: 50px;
	}

	/* #endif */

	.large-font .section-title,
	.large-font .card-title {
		font-size: 20px !important;
	}
</style>