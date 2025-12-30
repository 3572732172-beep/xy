import App from './App.vue'
import userStore from './store/user.js'

const host = 'https://api.example.com'; // 请替换为实际后端地址

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$host = host;
Vue.prototype.$userStore = userStore; // 将 store 挂载到 Vue 原型上，方便全局访问
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	
	// 将 store 挂载到 app 实例上
	app.config.globalProperties.$userStore = userStore;
	app.provide('userStore', userStore); // 使用 provide/inject 方式
	
	return {
		app
	}
}
// #endif
