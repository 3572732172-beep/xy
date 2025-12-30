<template>
	<view class="container" :class="{ 'large-font': largeFontMode }" @tap="closeSelectDropdown"
		@click="closeSelectDropdown">
		<view class="page-header-row">
			<text class="page-title">发布需求</text>
		</view>

		<view class="form-intro">
			<text class="intro-title">发布用电需求</text>
			<text class="intro-desc">请详细填写您的需求信息，我们将为您匹配最合适的专业师傅</text>
		</view>

		<view class="form-section">
			<view class="section-title">
				<text class="section-label">需求类型</text>
				<text class="section-desc">请选择您的需求类型</text>
			</view>
			<view class="select-wrapper" @tap.stop="toggleSelectDropdown" @click.stop="toggleSelectDropdown">
				<view class="select-display">
					<text class="select-text" v-if="getSelectedSceneLabel()">{{ getSelectedSceneLabel() }}</text>
					<text class="select-placeholder" v-else>请选择需求类型</text>
				</view>
				<view class="select-arrow" :class="{ 'open': showSelectDropdown }">
					<text class="arrow-icon">▼</text>
				</view>
			</view>
			<view class="select-dropdown" v-if="showSelectDropdown" @tap.stop @click.stop>
				<view class="select-option" v-for="scene in sceneTypes" :key="scene.value"
					:class="{ 'selected': formData.service_type === scene.value }" @tap.stop="selectScene(scene.value)"
					@click.stop="selectScene(scene.value)">
					<view class="option-icon">{{ getSceneIcon(scene.value) }}</view>
					<text class="option-label">{{ scene.label }}</text>
					<view class="option-check" v-if="formData.service_type === scene.value">
						<text class="check-icon">✓</text>
					</view>
				</view>
			</view>
		</view>

		<view class="form-section">
			<view class="section-title">
				<text class="section-label">需求标题</text>
				<text class="section-desc">简要描述您的需求</text>
			</view>
			<view class="input-wrapper">
				<input class="input" v-model="formData.title" :placeholder="placeholderTitle"
					:style="{ fontSize: fontSize + 'rpx' }" />
				<view class="voice-btn" @click="startVoiceInput('title')" @tap="startVoiceInput('title')"
					:class="{ 'recording': recordingType === 'title' }">
					<text class="voice-icon">{{ recordingType === 'title' ? '⏹' : '🎤' }}</text>
				</view>
			</view>
		</view>

		<view class="form-section">
			<view class="section-title">
				<text class="section-label">详细描述</text>
				<text class="section-desc">请详细描述现场情况、施工范围及期望完成时间</text>
			</view>
			<view class="textarea-wrapper">
				<textarea class="textarea" v-model="formData.description" :placeholder="placeholderDesc"
					:style="{ fontSize: (fontSize > 22 ? fontSize : 32) + 'rpx', lineHeight: '2.0' }" auto-height
					maxlength="300" />
				<view class="voice-btn" @click="startVoiceInput('description')" @tap="startVoiceInput('description')"
					:class="{ 'recording': recordingType === 'description' }">
					<text class="voice-icon">{{ recordingType === 'description' ? '⏹' : '🎤' }}</text>
				</view>
			</view>
		</view>

		<view class="form-section">
			<view class="section-title">
				<text class="section-label">功率需求</text>
				<text class="section-desc">预估功率（可选，如不确定可留空）</text>
			</view>
			<view class="power-input-wrapper">
				<input class="input power-input" type="digit" v-model="formData.power_kw" placeholder="例如 20（可选）"
					:style="{ fontSize: fontSize + 'rpx' }" />
				<text class="unit">kW</text>
			</view>
		</view>

		<view class="form-section">
			<view class="section-title">
				<text class="section-label">施工地址</text>
				<text class="section-desc">请选择或输入详细地址</text>
			</view>
			<view class="address-wrapper" @click="selectAddress">
				<text class="address-text" v-if="formData.address">{{ formData.address }}</text>
				<text class="address-placeholder" v-else>请选择或定位地址</text>
				<text class="address-icon">📍</text>
			</view>
			<view class="location-info" v-if="formData.lng && formData.lat">
				<text>定位：{{ formData.lat.toFixed(6) }}, {{ formData.lng.toFixed(6) }}</text>
			</view>
		</view>

		<view class="form-section">
			<view class="section-title">
				<text class="section-label">现场照片</text>
				<text class="section-desc">上传现场照片，帮助师傅更好地了解情况（可选）</text>
			</view>
			<view class="photo-upload">
				<view class="photo-item" v-for="(photo, index) in formData.photos" :key="index">
					<image :src="getPhotoUrl(photo)" class="photo-image" mode="aspectFill" />
					<view class="photo-delete" @click="removePhoto(index)">×</view>
					<view class="photo-ai-btn" @click="analyzePhoto(index)"
						v-if="!getPhotoAIStatus(photo, 'analyzing') && !getPhotoAIStatus(photo, 'result')">
						<text class="ai-text">智能分析</text>
					</view>
					<view class="photo-ai-loading" v-if="getPhotoAIStatus(photo, 'analyzing')">
						<text class="ai-loading-text">分析中...</text>
					</view>
				</view>
				<view class="photo-add" @click="choosePhoto" v-if="formData.photos.length < 9">
					<text class="photo-add-icon">+</text>
					<text class="photo-add-text">添加照片</text>
				</view>
			</view>

			<!-- AI分析结果展示 -->
			<view class="ai-result-section" v-if="aiAnalysisResults.length > 0">
				<view class="ai-result-title">
					<text class="ai-title-text">分析结果</text>
				</view>
				<view class="ai-result-item" v-for="(result, index) in aiAnalysisResults" :key="index">
					<view class="ai-result-header">
						<image :src="result.photoUrl" class="ai-result-photo" mode="aspectFill" />
						<view class="ai-result-info">
							<text class="ai-result-label">分析结果</text>
							<text class="ai-result-time">{{ result.time }}</text>
						</view>
					</view>
					<view class="ai-result-content">
						<view class="ai-result-desc">
							<text class="ai-desc-label">问题识别：</text>
							<text class="ai-desc-text">{{ result.analysis }}</text>
						</view>
						<view class="ai-result-solution">
							<text class="ai-solution-label">改造方案：</text>
							<text class="ai-solution-text">{{ result.solution }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="form-actions">
			<button class="btn btn-secondary" @click="saveDraft">保存草稿</button>
			<button class="btn btn-primary" @click="submitDemand" :loading="submitting">
				{{ submitting ? '提交中...' : '发布需求' }}
			</button>
		</view>

		<service-float />

		<!-- 语言选择器弹窗 -->
		<view class="language-picker-mask" v-if="showLanguagePicker" @click="closeLanguagePicker">
			<view class="language-picker" @click.stop>
				<view class="picker-header">
					<text class="picker-title">选择语言</text>
					<text class="picker-close" @click="closeLanguagePicker">×</text>
				</view>
				<scroll-view class="picker-content" scroll-y>
					<view class="picker-item" v-for="(lang, index) in languageList" :key="index"
						:class="{ 'active': selectedLanguage === lang }" @click="selectLanguage(lang)">
						<text class="picker-item-text">{{ lang }}</text>
						<text class="picker-item-check" v-if="selectedLanguage === lang">✓</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request.js';
	import offline from '@/utils/offline.js';
	import userStore from '@/store/user.js';
	import {
		reverseGeocode
	} from '@/utils/amap.js';
	import ServiceFloat from '@/components/ServiceFloat.vue';
	import baiduSpeech from '@/utils/baidu-speech.js';

	// 检查登录状态（尝试用本地存储自动恢复，避免重复弹窗）
	function checkLogin() {
		// 已登录直接通过
		if (userStore.state.isLoggedIn) {
			return true;
		}

		// 尝试从本地存储恢复
		const token = uni.getStorageSync('token');
		const userInfo = uni.getStorageSync('userInfo');
		if (token && userInfo) {
			userStore.setUserInfo(userInfo, token);
			return true;
		}

		// 仍未登录，提示跳转
		uni.showModal({
			title: '需要登录',
			content: '发布需求需要先登录，是否前往登录？',
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/user/login/index'
					});
				}
			}
		});
		return false;
	}

	export default {
		components: {
			ServiceFloat
		},
		data() {
			return {
				formData: {
					service_type: 1,
					title: '',
					description: '',
					power_kw: '',
					address: '',
					lng: null,
					lat: null,
					photos: [],
					offline_local_id: null
				},
				sceneTypes: [{
						value: 1,
						label: '生活用电改造',
						image: '/static/yd.png'
					},
					{
						value: 2,
						label: '电路维修',
						image: '/static/yd.png'
					},
					{
						value: 3,
						label: '电器维护',
						image: '/static/yd.png'
					},
					{
						value: 4,
						label: '用电故障排除',
						image: '/static/yd.png'
					}
				],
				submitting: false,
				largeFontMode: false,
				fontSize: 22,
				placeholderTitle: '例如：家里电路跳闸需要维修',
				placeholderDesc: '请详细描述用电问题、现场情况、需要维修的电器类型及期望完成时间，信息越详细越容易匹配到合适的师傅',
				recordingType: null, // 当前录音类型：'title' 或 'description'
				recorderManager: null,
				recordingTime: 0,
				recordingTimer: null,
				selectedLanguage: '普通话', // 选择的方言类型
				showLanguagePicker: false, // 是否显示语言选择器
				pendingRecordingType: null, // 待录音的类型（用于语言选择后）
				languageList: [], // 语言列表
				realTimeText: '', // 实时识别的文本
				recognizeTimer: null, // 实时识别定时器
				lastRecognizeTime: 0, // 上次识别时间
				aiAnalysisResults: [], // AI分析结果列表
				showSelectDropdown: false, // 是否显示下拉选择器
				typingTimer: null // 打字机效果定时器
			};
		},
		created() {
			// 初始化语言列表
			this.languageList = Object.keys(baiduSpeech.LANGUAGE_CODES || {});
			console.log('语言列表已初始化:', this.languageList);
		},
		onLoad(options) {
			// 检查登录状态
			if (!checkLogin()) {
				return;
			}

			// 优先从 URL 参数获取草稿 ID（兼容大小写）
			let draftId = options.draftId || options.draftid;

			// 如果没有 URL 参数，尝试从本地存储获取（用于从草稿箱跳转）
			if (!draftId) {
				draftId = uni.getStorageSync('editDraftId');
				if (draftId) {
					// 读取后清除，避免下次进入时误加载
					uni.removeStorageSync('editDraftId');
				}
			}

			if (draftId) {
				this.loadDraft(draftId);
			}

			// 加载全局设置
			this.largeFontMode = userStore.state.largeFontMode;
			this.fontSize = userStore.state.fontSize;

			// 根据场景类型初始化占位符
			this.updatePlaceholders(this.formData.service_type);

			// 获取定位
			this.getLocation();
		},
		methods: {
			/**
			 * 切换下拉选择器显示状态
			 */
			toggleSelectDropdown(e) {
				if (e) {
					e.stopPropagation();
				}
				this.showSelectDropdown = !this.showSelectDropdown;
			},

			/**
			 * 关闭下拉选择器
			 */
			closeSelectDropdown() {
				this.showSelectDropdown = false;
			},

			/**
			 * 选择场景类型
			 */
			selectScene(value) {
				this.formData.service_type = value;
				// 根据场景类型自动填充占位符
				this.updatePlaceholders(value);
				// 关闭下拉选择器
				this.showSelectDropdown = false;
			},

			/**
			 * 获取选中的场景标签
			 */
			getSelectedSceneLabel() {
				const scene = this.sceneTypes.find(s => s.value === this.formData.service_type);
				return scene ? scene.label : '';
			},

			/**
			 * 开始语音输入（模拟打字机效果）
			 */
			async startVoiceInput(type) {
				// 如果正在录音，则停止录音
				if (this.recordingType === type) {
					this.stopVoiceInput();
					return;
				}

				// 如果正在其他字段录音，先停止
				if (this.recordingType && this.recordingType !== type) {
					this.stopVoiceInput();
				}

				// 设置录音状态
				this.recordingType = type;

				// 根据类型设置默认文本
				let defaultText = '';
				if (type === 'title') {
					defaultText = '电力';
				} else if (type === 'description') {
					defaultText = '改造';
				}

				// 清空当前内容
				if (type === 'title') {
					this.formData.title = '';
				} else if (type === 'description') {
					this.formData.description = '';
				}

				// 显示录音提示
				uni.showToast({
					title: '正在录音转文字...',
					icon: 'none',
					duration: 2000
				});

				// 延迟一下再开始打字机效果，模拟录音识别时间
				setTimeout(() => {
					this.startTypingEffect(type, defaultText);
				}, 1500);
			},

			/**
			 * 打字机效果
			 */
			startTypingEffect(type, fullText) {
				const self = this;
				let index = 0;
				const speed = 150; // 每个字符的显示间隔（毫秒）

				// 清除之前的定时器
				if (self.typingTimer) {
					clearInterval(self.typingTimer);
				}

				self.typingTimer = setInterval(() => {
					if (index < fullText.length) {
						// 逐字显示
						const displayText = fullText.substring(0, index + 1);
						if (type === 'title') {
							self.formData.title = displayText;
						} else if (type === 'description') {
							self.formData.description = displayText;
						}
						index++;
					} else {
						// 完成打字
						clearInterval(self.typingTimer);
						self.typingTimer = null;
						// 停止录音状态
						self.recordingType = null;

						uni.showToast({
							title: '识别完成',
							icon: 'success',
							duration: 1000
						});
					}
				}, speed);
			},

			/**
			 * 开始录音
			 */
			async startRecording(type) {
				try {
					console.log('开始录音，类型:', type);
					this.recordingType = type;
					this.recordingTime = 0;
					this.realTimeText = ''; // 清空实时文本
					this.lastRecognizeTime = 0;

					// 保存当前输入框的内容作为初始文本
					if (type === 'title') {
						this.realTimeText = this.formData.title || '';
					} else if (type === 'description') {
						this.realTimeText = this.formData.description || '';
					}

					// 先创建录音管理器
					this.recorderManager = await baiduSpeech.startRecord({
						duration: 60000 // 最长60秒
					});

					console.log('录音管理器创建成功');

					// 开始实时识别（每4秒识别一次）
					this.startRealTimeRecognize(type);

					// 开始计时
					this.recordingTimer = setInterval(() => {
						this.recordingTime++;
						if (this.recordingTime >= 60) {
							this.stopVoiceInput();
						}
					}, 1000);

					uni.showToast({
						title: '正在录音，实时转文字中...',
						icon: 'none',
						duration: 2000
					});
				} catch (error) {
					console.error('开始录音失败:', error);
					// 清理状态
					this.recordingType = null;
					this.recorderManager = null;
					if (this.recordingTimer) {
						clearInterval(this.recordingTimer);
						this.recordingTimer = null;
					}
					if (this.recognizeTimer) {
						clearInterval(this.recognizeTimer);
						this.recognizeTimer = null;
					}
					uni.showToast({
						title: '录音失败：' + (error.message || '请检查麦克风权限'),
						icon: 'none',
						duration: 3000
					});
				}
			},

			/**
			 * 开始实时识别
			 */
			async startRealTimeRecognize(type) {
				console.log('启动实时识别，类型:', type);

				// 第一次识别：延迟5秒
				setTimeout(async () => {
					await this.performRealTimeRecognize(type);

					// 之后每5秒识别一次（确保每次都有足够的音频数据）
					this.recognizeTimer = setInterval(async () => {
						await this.performRealTimeRecognize(type);
					}, 5000);
				}, 5000); // 延迟5秒后开始第一次识别
			},

			/**
			 * 执行实时识别
			 */
			async performRealTimeRecognize(type) {
				if (!this.recorderManager || !this.recordingType || this.recordingType !== type) {
					console.log('跳过识别：录音管理器不存在或类型不匹配');
					return;
				}

				// 如果录音时间少于5秒，跳过识别（音频太短，百度API需要足够的音频数据）
				if (this.recordingTime < 5) {
					console.log('跳过识别：录音时间太短', this.recordingTime, '秒，需要至少5秒');
					return;
				}

				try {
					console.log('开始实时识别，录音时长:', this.recordingTime, '秒');

					// 保存当前录音管理器
					const currentRecorder = this.recorderManager;

					// 停止当前录音并获取音频文件
					const audioPath = await baiduSpeech.stopRecord(currentRecorder);
					console.log('录音文件路径:', audioPath);

					// 识别音频
					const result = await baiduSpeech.recognizeSpeech(audioPath, this.selectedLanguage);
					console.log('识别结果:', result);

					if (result && result.trim()) {
						// 追加识别结果
						if (this.realTimeText) {
							this.realTimeText += ' ' + result;
						} else {
							this.realTimeText = result;
						}

						// 实时更新到输入框
						if (type === 'title') {
							this.formData.title = this.realTimeText;
						} else if (type === 'description') {
							this.formData.description = this.realTimeText;
						}

						console.log('实时识别结果:', result);
						console.log('累计文本:', this.realTimeText);

						// 显示识别成功的提示
						uni.showToast({
							title: '识别中...',
							icon: 'none',
							duration: 1000
						});
					} else {
						console.log('识别结果为空');
					}

					// 重新开始录音（无缝继续）
					if (this.recordingType === type) {
						this.recorderManager = await baiduSpeech.startRecord({
							duration: 60000
						});
						console.log('录音已继续');
					}
				} catch (error) {
					console.error('实时识别失败:', error);
					console.error('错误详情:', error.message);
					if (error.stack) {
						console.error('错误堆栈:', error.stack);
					}

					// 如果是音频文件太小的问题，不显示错误，继续录音
					if (error.message && error.message.includes('太小')) {
						console.log('音频文件太小，跳过此次识别，继续录音');
						// 重新开始录音
						if (this.recordingType === type) {
							try {
								this.recorderManager = await baiduSpeech.startRecord({
									duration: 60000
								});
								console.log('录音已继续（音频太小跳过识别）');
							} catch (err) {
								console.error('重新开始录音失败:', err);
							}
						}
						return;
					}

					// 其他错误，尝试继续录音
					if (this.recordingType === type) {
						try {
							this.recorderManager = await baiduSpeech.startRecord({
								duration: 60000
							});
							console.log('录音已重新开始');
						} catch (err) {
							console.error('重新开始录音失败:', err);
							// 如果重新开始失败，停止录音
							uni.showToast({
								title: '录音中断: ' + (error.message || '请重试'),
								icon: 'none',
								duration: 2000
							});
							this.stopVoiceInput();
						}
					}
				}
			},

			/**
			 * 停止语音输入
			 */
			async stopVoiceInput() {
				// 清除打字机定时器
				if (this.typingTimer) {
					clearInterval(this.typingTimer);
					this.typingTimer = null;
				}

				// 清除录音相关定时器
				if (this.recordingTimer) {
					clearInterval(this.recordingTimer);
					this.recordingTimer = null;
				}

				if (this.recognizeTimer) {
					clearInterval(this.recognizeTimer);
					this.recognizeTimer = null;
				}

				// 重置状态
				this.recordingType = null;
				this.recorderManager = null;
				this.recordingTime = 0;
				this.realTimeText = '';
				this.lastRecognizeTime = 0;
			},

			/**
			 * 选择语言
			 */
			async selectLanguage(lang) {
				console.log('选择语言方法被调用，语言:', lang);
				this.selectedLanguage = lang;
				this.showLanguagePicker = false;
				const type = this.pendingRecordingType;
				this.pendingRecordingType = null;

				console.log('用户选择了语言:', lang, '待录音类型:', type);
				if (type) {
					try {
						console.log('准备开始录音，类型:', type);
						await this.startRecording(type);
					} catch (error) {
						console.error('开始录音失败:', error);
						uni.showToast({
							title: '启动失败：' + (error.message || '请重试'),
							icon: 'none'
						});
					}
				}
			},

			/**
			 * 关闭语言选择器
			 */
			closeLanguagePicker() {
				this.showLanguagePicker = false;
				this.pendingRecordingType = null;
			},

			/**
			 * 获取场景图标
			 */
			getSceneIcon(sceneType) {
				const icons = {
					1: '🏠',
					2: '🔧',
					3: '⚙️',
					4: '⚠️'
				};
				return icons[sceneType] || '⚡';
			},

			/**
			 * 根据场景类型更新占位符
			 */
			updatePlaceholders(sceneType) {
				const placeholders = {
					1: {
						title: '例如：家庭电路改造升级',
						desc: '请描述房屋面积、现有电路情况、需要改造的区域及期望完成时间'
					},
					2: {
						title: '例如：电路跳闸需要维修',
						desc: '请描述故障现象、发生频率、影响范围及期望维修时间'
					},
					3: {
						title: '例如：空调电路维护保养',
						desc: '请描述需要维护的电器类型、使用年限、当前问题及期望维护时间'
					},
					4: {
						title: '例如：用电故障紧急排除',
						desc: '请描述故障现象、紧急程度、已尝试的解决方法及期望响应时间'
					}
				};

				const placeholder = placeholders[sceneType] || placeholders[1];
				this.placeholderTitle = placeholder.title;
				this.placeholderDesc = placeholder.desc;
			},

			/**
			 * 返回上一页
			 */
			goBack() {
				uni.navigateBack({
					delta: 1,
					fail: () => {
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}
				});
			},

			/**
			 * 选择地址
			 */
			selectAddress() {
				uni.chooseLocation({
					success: (res) => {
						this.formData.address = res.address;
						this.formData.lng = res.longitude;
						this.formData.lat = res.latitude;

						// 保存到常用地址
						offline.userAddress.save({
							address: res.address,
							lng: res.longitude,
							lat: res.latitude
						});
					},
					fail: (err) => {
						console.error('选择地址失败', err);
						uni.showToast({
							title: '选择地址失败',
							icon: 'none'
						});
					}
				});
			},

			/**
			 * 获取定位
			 */
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: async (res) => {
						this.formData.lng = res.longitude;
						this.formData.lat = res.latitude;

						try {
							const geo = await reverseGeocode(res.longitude, res.latitude);
							if (geo.address) {
								this.formData.address = geo.address;
							} else if (!this.formData.address) {
								this.formData.address = '定位成功，地址解析失败';
							}

							if (geo.pois && geo.pois.length) {
								const poi = geo.pois[0];
								this.formData.address = poi.name ? `${geo.address || ''}（${poi.name}）` : geo
									.address;
							}
						} catch (geoErr) {
							console.error('高德逆地理编码失败', geoErr);
							const errorMsg = geoErr.message || geoErr.toString();
							// 如果是Key配置问题，给出提示
							if (errorMsg.includes('USERKEY_PLAT_NOMATCH') || errorMsg.includes('平台不匹配')) {
								console.warn(
									'请配置正确的高德地图API Key：1.使用Web服务类型Key；2.在微信小程序后台配置request合法域名：https://restapi.amap.com'
								);
							}
							if (!this.formData.address) {
								this.formData.address = '定位成功，未获取到详细地址';
							}
						}
					},
					fail: (err) => {
						console.error('获取定位失败', err);
						uni.showToast({
							title: '获取定位失败，请手动选择地址',
							icon: 'none'
						});
					}
				});
			},

			/**
			 * 选择照片
			 */
			async choosePhoto() {
				try {
					uni.chooseImage({
						count: 9 - this.formData.photos.length,
						success: async (res) => {
							uni.showLoading({
								title: '上传中...'
							});

							try {
								// 导入上传工具
								const upload = (await import('@/utils/upload.js')).default;

								// 上传图片到服务器
								const urls = await upload.uploadImages(res.tempFilePaths);

								// 添加到表单数据（添加AI分析状态）
								const photosWithAI = urls.map(url => ({
									url: url,
									aiAnalyzing: false,
									aiResult: null
								}));

								// 如果之前是字符串数组，转换为对象数组
								const existingPhotos = this.formData.photos.map(photo =>
									typeof photo === 'string' ? {
										url: photo,
										aiAnalyzing: false,
										aiResult: null
									} : photo
								);

								this.formData.photos = existingPhotos.concat(photosWithAI);

								uni.hideLoading();
								uni.showToast({
									title: '上传成功',
									icon: 'success'
								});
							} catch (error) {
								console.error('上传失败', error);
								uni.hideLoading();
								uni.showToast({
									title: '上传失败，请重试',
									icon: 'none'
								});

								// 上传失败时，使用本地路径作为备用
								const photosWithAI = res.tempFilePaths.map(path => ({
									url: path,
									aiAnalyzing: false,
									aiResult: null
								}));
								const existingPhotos = this.formData.photos.map(photo =>
									typeof photo === 'string' ? {
										url: photo,
										aiAnalyzing: false,
										aiResult: null
									} : photo
								);
								this.formData.photos = existingPhotos.concat(photosWithAI);
							}
						}
					});
				} catch (error) {
					console.error('选择图片失败', error);
				}
			},

			/**
			 * AI分析照片
			 */
			async analyzePhoto(index) {
				const photo = this.formData.photos[index];
				if (!photo) {
					return;
				}

				// 检查是否正在分析
				if (this.getPhotoAIStatus(photo, 'analyzing')) {
					return;
				}

				// 获取照片URL（兼容字符串和对象格式）
				const photoUrl = this.getPhotoUrl(photo);

				try {
					// 设置分析状态
					if (typeof photo === 'object') {
						this.$set(this.formData.photos[index], 'aiAnalyzing', true);
					} else {
						this.$set(this.formData.photos, index, {
							url: photoUrl,
							aiAnalyzing: true,
							aiResult: null
						});
					}

					uni.showLoading({
						title: 'AI分析中...'
					});

					// 调用AI分析API
					const result = await request.post('/api/ai/analyze-image', {
						imageUrl: photoUrl
					});

					uni.hideLoading();

					// 更新照片状态
					const updatedPhoto = this.formData.photos[index];
					if (typeof updatedPhoto === 'object') {
						this.$set(this.formData.photos[index], 'aiAnalyzing', false);
						this.$set(this.formData.photos[index], 'aiResult', result);
					}

					// 添加到分析结果列表
					this.aiAnalysisResults.push({
						photoUrl: photoUrl,
						analysis: result.analysis || '未识别到明显问题',
						solution: result.solution || '建议联系专业电工进行现场检查',
						time: new Date().toLocaleTimeString()
					});

					// 如果AI分析结果中有建议，自动填充到描述中
					if (result.solution && !this.formData.description) {
						this.formData.description = `AI分析建议：${result.solution}`;
					}

					uni.showToast({
						title: '分析完成',
						icon: 'success'
					});
				} catch (error) {
					console.error('AI分析失败', error);
					uni.hideLoading();

					// 重置分析状态
					const updatedPhoto = this.formData.photos[index];
					if (typeof updatedPhoto === 'object') {
						this.$set(this.formData.photos[index], 'aiAnalyzing', false);
					}

					uni.showToast({
						title: '分析失败：' + (error.message || '请重试'),
						icon: 'none'
					});
				}
			},

			/**
			 * 获取照片URL（兼容字符串和对象格式）
			 */
			getPhotoUrl(photo) {
				return typeof photo === 'string' ? photo : photo.url;
			},

			/**
			 * 获取照片AI状态
			 */
			getPhotoAIStatus(photo, type) {
				if (typeof photo === 'string') {
					return false;
				}
				if (type === 'analyzing') {
					return photo.aiAnalyzing || false;
				}
				if (type === 'result') {
					return photo.aiResult || false;
				}
				return false;
			},

			/**
			 * 删除照片
			 */
			removePhoto(index) {
				const photo = this.formData.photos[index];
				const photoUrl = this.getPhotoUrl(photo);

				// 删除对应的AI分析结果
				this.aiAnalysisResults = this.aiAnalysisResults.filter(result => result.photoUrl !== photoUrl);

				this.formData.photos.splice(index, 1);
			},

			/**
			 * 保存草稿
			 */
			saveDraft() {
				if (!this.formData.title && !this.formData.description) {
					uni.showToast({
						title: '请至少填写标题或描述',
						icon: 'none'
					});
					return;
				}

				const localId = offline.draftDemand.save(this.formData);
				this.formData.offline_local_id = localId;

				uni.showToast({
					title: '草稿已保存',
					icon: 'success'
				});

				// 保存草稿后返回上一页
				setTimeout(() => {
					uni.navigateBack({
						delta: 1,
						fail: () => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}
					});
				}, 800);
			},

			/**
			 * 加载草稿
			 */
			loadDraft(draftId) {
				const draft = offline.draftDemand.getById(draftId);
				if (draft) {
					this.formData = {
						...draft
					};
				}
			},

			/**
			 * 提交需求
			 */
			async submitDemand() {
				// 检查登录状态
				if (!checkLogin()) {
					return;
				}

				// 表单验证
				if (!this.formData.title || this.formData.title.trim() === '') {
					uni.showToast({
						title: '请输入需求标题',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.description || this.formData.description.trim() === '') {
					uni.showToast({
						title: '请输入详细描述',
						icon: 'none'
					});
					return;
				}

				// 确保 service_type 有值
				if (this.formData.service_type === undefined || this.formData.service_type === null) {
					this.formData.service_type = 1; // 默认值
				}

				// 功率需求改为可选，如果没有填写则默认为0
				if (this.formData.power_kw && parseFloat(this.formData.power_kw) < 0) {
					uni.showToast({
						title: '功率需求不能为负数',
						icon: 'none'
					});
					return;
				}

				if (!this.formData.address || !this.formData.lng || !this.formData.lat) {
					uni.showToast({
						title: '请选择施工地址',
						icon: 'none'
					});
					return;
				}

				this.submitting = true;

				try {
					// 如果有本地草稿 ID，使用同步接口
					const url = this.formData.offline_local_id ? '/api/demand/sync' : '/api/demand/create';

					// 处理照片数组（兼容对象和字符串格式）
					const photos = (this.formData.photos || []).map(photo =>
						typeof photo === 'string' ? photo : photo.url
					);

					// 保存到MySQL数据库，确保所有必要字段都存在
					const result = await request.post(url, {
						service_type: this.formData.service_type || 1,
						title: this.formData.title,
						description: this.formData.description,
						power_kw: parseFloat(this.formData.power_kw) || 0,
						address: this.formData.address,
						lng: this.formData.lng,
						lat: this.formData.lat,
						photos: photos,
						offline_local_id: this.formData.offline_local_id || null
					});

					// 提交成功
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					});

					// 删除草稿和同步队列
					if (this.formData.offline_local_id) {
						offline.draftDemand.remove(this.formData.offline_local_id);
						offline.syncQueue.remove(this.formData.offline_local_id);
					}

					// 触发全局事件，通知订单列表和首页刷新
					uni.$emit('demandCreated', {
						demandId: result.id,
						timestamp: Date.now()
					});

					// 提交成功后返回上一页（或首页）
					setTimeout(() => {
						uni.navigateBack({
							delta: 1,
							fail: () => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}
						});
					}, 1500);
				} catch (error) {
					console.error('提交需求失败', error);
					// 显示实际的错误消息
					const errorMsg = error.message || '发布失败，请稍后重试';
					uni.showModal({
						title: '提交失败',
						content: errorMsg,
						showCancel: false,
						success: () => {
							// 失败时保存为草稿
							this.saveDraft();
							offline.syncQueue.add(this.formData.offline_local_id, 'demand_create');
						}
					});
				} finally {
					this.submitting = false;
				}
			},

		}
	};
</script>

<style scoped>
	.container {
		padding: 0 0 140rpx;
		background: linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%);
		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
		color: #1a1a1a;
	}

	.container.large-font {
		font-size: 18rpx;
	}

	.page-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 32rpx 32rpx;
		background: #ffffff;
		border-bottom: 1rpx solid #e5e7eb;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
	}

	.back-button {
		flex-direction: row;
		align-items: center;
		padding: 10rpx 20rpx;
		border-radius: 999rpx;
		background-color: #e5f3ec;
		color: #1f7a4d;
	}

	.back-icon {
		font-size: 30rpx;
		margin-right: 6rpx;
	}

	.back-text {
		font-size: 26rpx;
	}

	.page-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #111827;
		letter-spacing: -0.5rpx;
	}

	.form-intro {
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		padding: 40rpx 32rpx;
		margin: 0;
		border-bottom: 1rpx solid #e5e7eb;
	}

	.intro-title {
		display: block;
		font-size: 32rpx;
		font-weight: 600;
		color: #111827;
		margin-bottom: 12rpx;
		letter-spacing: -0.3rpx;
	}

	.intro-desc {
		display: block;
		font-size: 26rpx;
		color: #6b7280;
		line-height: 1.6;
	}

	.form-section {
		background: #ffffff;
		padding: 36rpx 32rpx;
		margin: 0;
		border-bottom: 1rpx solid #e5e7eb;
		position: relative;
	}

	.form-section:last-of-type {
		border-bottom: none;
	}

	.form-section::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4rpx;
		background: linear-gradient(180deg, #2563eb 0%, #3b82f6 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.form-section:first-of-type::before {
		opacity: 1;
	}

	.section-title {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		margin-bottom: 24rpx;
	}

	.section-label {
		font-size: 30rpx;
		font-weight: 600;
		color: #111827;
		letter-spacing: -0.3rpx;
		position: relative;
		padding-left: 16rpx;
	}

	.section-label::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 4rpx;
		height: 20rpx;
		background: linear-gradient(180deg, #2563eb 0%, #3b82f6 100%);
		border-radius: 2rpx;
	}

	.section-desc {
		font-size: 28rpx;
		color: #6b7280;
		line-height: 1.7;
		padding-left: 16rpx;
		margin-top: 4rpx;
	}

	/* 下拉选择器样式 */
	.select-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		padding: 28rpx 28rpx;
		border: 1rpx solid #d1d5db;
		border-radius: 12rpx;
		background-color: #ffffff;
		transition: all 0.2s ease;
		cursor: pointer;
		z-index: 1;
	}

	.select-wrapper:active {
		border-color: #2563eb;
		background-color: #f9fafb;
	}

	.select-display {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.select-text {
		font-size: 32rpx;
		color: #111827;
		font-weight: 500;
	}

	.select-placeholder {
		font-size: 32rpx;
		color: #9ca3af;
	}

	.select-arrow {
		width: 32rpx;
		height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s ease;
		margin-left: 12rpx;
	}

	.select-arrow.open {
		transform: rotate(180deg);
	}

	.arrow-icon {
		font-size: 20rpx;
		color: #6b7280;
		transition: color 0.2s ease;
	}

	.select-wrapper:active .arrow-icon {
		color: #2563eb;
	}

	.select-dropdown {
		position: absolute;
		top: calc(100% + 8rpx);
		left: 0;
		right: 0;
		background: #ffffff;
		border: 1rpx solid #e5e7eb;
		border-radius: 12rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
		z-index: 999;
		max-height: 400rpx;
		overflow-y: auto;
		animation: slideDown 0.2s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.select-option {
		position: relative;
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-bottom: 1rpx solid #f3f4f6;
		transition: all 0.2s ease;
	}

	.select-option:last-child {
		border-bottom: none;
	}

	.select-option:active {
		background-color: #f9fafb;
	}

	.select-option.selected {
		background-color: #eff6ff;
	}

	.option-icon {
		font-size: 40rpx;
		margin-right: 16rpx;
	}

	.option-label {
		flex: 1;
		font-size: 32rpx;
		color: #111827;
		font-weight: 500;
	}

	.select-option.selected .option-label {
		color: #2563eb;
		font-weight: 600;
	}

	.option-check {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		background: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 12rpx;
	}

	.check-icon {
		color: #fff;
		font-size: 18rpx;
		font-weight: bold;
	}

	.input-wrapper,
	.textarea-wrapper {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 12rpx;
	}

	.input {
		flex: 1;
		padding: 28rpx 28rpx;
		border: 1.5rpx solid #e5e7eb;
		border-radius: 14rpx;
		font-size: 32rpx;
		background-color: #fafbfc;
		color: #111827;
		transition: all 0.2s ease;
		line-height: 1.6;
	}

	.textarea {
		flex: 1;
		padding: 32rpx 28rpx;
		border: 1.5rpx solid #e5e7eb;
		border-radius: 14rpx;
		font-size: 32rpx;
		background-color: #fafbfc;
		color: #111827;
		transition: all 0.2s ease;
		line-height: 2.0;
		min-height: 280rpx;
	}

	.input::placeholder {
		color: #9ca3af;
		font-size: 32rpx;
		line-height: 1.6;
	}

	.textarea::placeholder {
		color: #9ca3af;
		font-size: 32rpx;
		line-height: 2.0;
	}

	.textarea-wrapper {
		flex-direction: column;
	}

	.textarea-wrapper .textarea {
		width: 100%;
	}

	.textarea-wrapper .voice-btn {
		align-self: flex-end;
		margin-top: 16rpx;
		width: 80rpx;
		height: 80rpx;
	}

	.input:focus,
	.textarea:focus {
		border-color: #2563eb;
		background-color: #ffffff;
		box-shadow: 0 0 0 4rpx rgba(37, 99, 235, 0.08);
		outline: none;
	}


	.voice-btn {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
		border: 1.5rpx solid #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s ease;
		cursor: pointer;
		position: relative;
		z-index: 10;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.04);
	}

	.voice-btn:active {
		background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
		transform: scale(0.95);
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.08);
	}

	.voice-btn.recording {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		border-color: #ef4444;
		box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.4);
		animation: pulse 1.5s infinite;
	}

	.voice-icon {
		font-size: 32rpx;
		color: #6b7280;
	}

	.voice-btn.recording .voice-icon {
		color: #fff;
	}

	@keyframes pulse {

		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}

		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}

	.power-input-wrapper {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.power-input {
		flex: 1;
		font-size: 32rpx;
		padding: 28rpx 28rpx;
	}

	.power-input::placeholder {
		font-size: 32rpx;
	}

	.unit {
		font-size: 32rpx;
		color: #475569;
		font-weight: 600;
	}

	.address-wrapper {
		display: flex;
		align-items: center;
		padding: 28rpx 28rpx;
		border: 1.5rpx solid #e5e7eb;
		border-radius: 14rpx;
		background-color: #fafbfc;
		transition: all 0.2s ease;
	}

	.address-wrapper:active {
		border-color: #2563eb;
		background-color: #ffffff;
		box-shadow: 0 0 0 4rpx rgba(37, 99, 235, 0.08);
	}

	.address-text,
	.address-placeholder {
		flex: 1;
		font-size: 32rpx;
		color: #111827;
		line-height: 1.6;
	}

	.address-placeholder {
		color: #9ca3af;
	}

	.address-icon {
		font-size: 28rpx;
		margin-left: 12rpx;
		color: #6b7280;
	}

	.location-info {
		margin-top: 12rpx;
		display: inline-flex;
		align-items: center;
		padding: 10rpx 18rpx;
		background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
		color: #2563eb;
		font-size: 22rpx;
		border-radius: 10rpx;
		border: 1rpx solid rgba(37, 99, 235, 0.2);
	}

	.photo-upload {
		display: flex;
		flex-wrap: wrap;
		gap: 24rpx;
	}

	.photo-item,
	.photo-add {
		width: 200rpx;
		height: 200rpx;
		border-radius: 14rpx;
		overflow: hidden;
	}

	.photo-item {
		position: relative;
		border: 1.5rpx solid #e5e7eb;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
		transition: all 0.2s ease;
	}

	.photo-item:active {
		transform: scale(0.98);
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.08);
	}

	.photo-image {
		width: 100%;
		height: 100%;
	}

	.photo-delete {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		backdrop-filter: blur(4rpx);
	}

	.photo-add {
		border: 1.5rpx dashed #d1d5db;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #fafbfc;
		color: #9ca3af;
		transition: all 0.2s ease;
	}

	.photo-add:active {
		border-color: #2563eb;
		background: #eff6ff;
		color: #2563eb;
		transform: scale(0.98);
	}

	.photo-add-icon {
		font-size: 48rpx;
		margin-bottom: 8rpx;
	}

	.photo-add-text {
		font-size: 26rpx;
	}

	/* AI分析按钮样式 */
	.photo-ai-btn {
		position: absolute;
		bottom: 8rpx;
		left: 8rpx;
		right: 8rpx;
		background: rgba(37, 99, 235, 0.95);
		backdrop-filter: blur(8rpx);
		border-radius: 8rpx;
		padding: 10rpx 14rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.photo-ai-btn:active {
		background: rgba(37, 99, 235, 1);
		transform: scale(0.98);
	}

	.ai-text {
		font-size: 22rpx;
		color: #ffffff;
		font-weight: 500;
	}

	.photo-ai-loading {
		position: absolute;
		bottom: 8rpx;
		left: 8rpx;
		right: 8rpx;
		background: rgba(37, 99, 235, 0.95);
		backdrop-filter: blur(8rpx);
		border-radius: 8rpx;
		padding: 10rpx 14rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ai-loading-text {
		font-size: 22rpx;
		color: #ffffff;
		font-weight: 500;
	}

	/* AI分析结果样式 */
	.ai-result-section {
		margin-top: 24rpx;
		padding-top: 24rpx;
		border-top: 1rpx solid #e5e7eb;
	}

	.ai-result-title {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.ai-title-text {
		font-size: 28rpx;
		font-weight: 600;
		color: #111827;
	}

	.ai-result-item {
		background: #f9fafb;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 16rpx;
		border: 1rpx solid #e5e7eb;
	}

	.ai-result-header {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 20rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #e5f3ec;
	}

	.ai-result-photo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 8rpx;
		border: 1rpx solid #e5e7eb;
	}

	.ai-result-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.ai-result-label {
		font-size: 24rpx;
		font-weight: 600;
		color: #111827;
	}

	.ai-result-time {
		font-size: 22rpx;
		color: #6b7280;
	}

	.ai-result-content {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.ai-result-desc,
	.ai-result-solution {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.ai-desc-label,
	.ai-solution-label {
		font-size: 24rpx;
		font-weight: 600;
		color: #111827;
		margin-bottom: 8rpx;
	}

	.ai-desc-text,
	.ai-solution-text {
		font-size: 24rpx;
		color: #374151;
		line-height: 1.6;
		padding: 12rpx;
		background: #ffffff;
		border-radius: 8rpx;
		border-left: 2rpx solid #2563eb;
	}

	.ai-solution-text {
		border-left-color: #10b981;
	}

	.form-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		gap: 16rpx;
		padding: 20rpx 32rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		background: #ffffff;
		border-top: 1rpx solid #e5e7eb;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
		z-index: 100;
	}

	.btn {
		flex: 1;
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		border-radius: 14rpx;
		font-size: 32rpx;
		font-weight: 600;
		border: none;
		transition: all 0.2s ease;
		letter-spacing: 0.5rpx;
	}

	.btn-primary {
		color: #fff;
		background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
		box-shadow: 0 6rpx 16rpx rgba(37, 99, 235, 0.35);
	}

	.btn-primary:active {
		background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
		transform: scale(0.98);
		box-shadow: 0 4rpx 12rpx rgba(37, 99, 235, 0.25);
	}

	.btn-secondary {
		background-color: #ffffff;
		color: #374151;
		border: 1.5rpx solid #d1d5db;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}

	.btn-secondary:active {
		background-color: #f9fafb;
		border-color: #9ca3af;
		transform: scale(0.98);
	}

	/* 语言选择器样式 */
	.language-picker-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.language-picker {
		width: 600rpx;
		max-height: 80vh;
		background-color: #ffffff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
	}

	.picker-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 36rpx;
		border-bottom: 2rpx solid #e2e8f0;
		background-color: #f8fafb;
	}

	.picker-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1f2933;
	}

	.picker-close {
		font-size: 48rpx;
		color: #6b7280;
		line-height: 1;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.3s ease;
	}

	.picker-close:active {
		background-color: #e2e8f0;
	}

	.picker-content {
		max-height: 60vh;
		padding: 20rpx 0;
	}

	.picker-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 36rpx;
		border-bottom: 1rpx solid #f1f5f9;
		transition: all 0.2s ease;
	}

	.picker-item:active {
		background-color: #f8fafb;
	}

	.picker-item.active {
		background-color: #f0fdf4;
	}

	.picker-item-text {
		font-size: 30rpx;
		color: #1f2933;
	}

	.picker-item.active .picker-item-text {
		color: #1f7a4d;
		font-weight: 600;
	}

	.picker-item-check {
		font-size: 32rpx;
		color: #1f7a4d;
		font-weight: bold;
	}
</style>