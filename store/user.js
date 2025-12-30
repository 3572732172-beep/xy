/**
 * 用户状态管理（使用 Vuex 风格，兼容 Vue2/Vue3）
 * 管理用户信息、token、全局设置（大字体模式等）
 */

// 简单的状态管理实现（如果项目没有 Vuex/Pinia，可以用这个）
class UserStore {
	constructor() {
		this.state = {
			// 用户信息
			userInfo: null,
			token: '',
			isLoggedIn: false,
			
			// 全局设置
			largeFontMode: false, // 大字体模式
			fontSize: 14, // 基础字体大小（rpx）
			
			// 定位信息
			location: {
				lng: null,
				lat: null,
				address: ''
			}
		};
		
		// 从本地存储恢复
		this.loadFromStorage();
	}
	
	/**
	 * 从本地存储加载
	 */
	loadFromStorage() {
		try {
			const token = uni.getStorageSync('token');
			const userInfo = uni.getStorageSync('userInfo');
			const largeFontMode = uni.getStorageSync('largeFontMode') || false;
			const fontSize = uni.getStorageSync('fontSize') || 14;
			
			// 如果token和userInfo都存在，恢复登录状态
			if (token && userInfo) {
				this.state.token = token;
				this.state.userInfo = userInfo;
				this.state.isLoggedIn = true;
				console.log('已恢复登录状态，用户ID:', userInfo.id);
			} else {
				// 如果只有token没有userInfo，清除token
				if (token && !userInfo) {
					uni.removeStorageSync('token');
					this.state.token = '';
					this.state.isLoggedIn = false;
				}
			}
			
			this.state.largeFontMode = largeFontMode;
			this.state.fontSize = fontSize;
			
			// 应用字体设置
			this.applyFontSize();
		} catch (e) {
			console.error('加载本地存储失败', e);
		}
	}
	
	/**
	 * 保存到本地存储
	 */
	saveToStorage() {
		try {
			if (this.state.token) {
				uni.setStorageSync('token', this.state.token);
			}
			if (this.state.userInfo) {
				uni.setStorageSync('userInfo', this.state.userInfo);
			}
			uni.setStorageSync('largeFontMode', this.state.largeFontMode);
			uni.setStorageSync('fontSize', this.state.fontSize);
		} catch (e) {
			console.error('保存本地存储失败', e);
		}
	}
	
	/**
	 * 设置用户信息
	 */
	setUserInfo(userInfo, token) {
		this.state.userInfo = userInfo;
		this.state.token = token;
		this.state.isLoggedIn = !!token;
		// 立即保存到本地存储，确保持久化
		uni.setStorageSync('token', token);
		uni.setStorageSync('userInfo', userInfo);
		this.saveToStorage();
		console.log('用户登录成功，已保存登录状态，用户ID:', userInfo.id);
	}
	
	/**
	 * 清除用户信息（退出登录）
	 */
	clearUserInfo() {
		this.state.userInfo = null;
		this.state.token = '';
		this.state.isLoggedIn = false;
		uni.removeStorageSync('token');
		uni.removeStorageSync('userInfo');
	}
	
	/**
	 * 切换大字体模式
	 */
	toggleLargeFontMode() {
		this.state.largeFontMode = !this.state.largeFontMode;
		this.state.fontSize = this.state.largeFontMode ? 18 : 14;
		this.saveToStorage();
		this.applyFontSize();
	}
	
	/**
	 * 设置字体大小
	 */
	setFontSize(size) {
		this.state.fontSize = size;
		this.state.largeFontMode = size >= 18;
		this.saveToStorage();
		this.applyFontSize();
	}
	
	/**
	 * 应用字体大小到全局
	 */
	applyFontSize() {
		// 通过设置全局 CSS 变量或直接操作页面根元素
		// 注意：uni-app 中可以通过设置页面根元素的 font-size 来实现
		// 这里需要在 App.vue 或页面中动态应用
	}
	
	/**
	 * 设置定位信息
	 */
	setLocation(lng, lat, address = '') {
		this.state.location = {
			lng,
			lat,
			address
		};
	}
	
	/**
	 * 获取定位信息
	 */
	getLocation() {
		return this.state.location;
	}
}

// 创建单例
const userStore = new UserStore();

export default userStore;


