<template>
	<view class="container" :class="{ 'care-mode': isCareMode }">

		<movable-area class="movable-area">
			<movable-view class="movable-view" :class="{ 'is-hidden': !isExpanded }" direction="all" :x="pos.x"
				:y="pos.y" @click="handleRobotClick">
				<!-- <view v-if="!isExpanded" class="tip-question">?</view> -->
				<view class="robot-helmet">
					<view class="visor-glass">
						<view class="digital-eye left blink" :class="robotMood" :style="eyeStyle"></view>
						<view class="digital-eye right blink" :class="robotMood" :style="eyeStyle"></view>
					</view>
				</view>
			</movable-view>
		</movable-area>

		<view v-if="showChat" class="modal-mask" @click="closeChat">
			<view class="chat-window" @click.stop>

				<view class="window-header">
					<view class="header-main">
						<text class="header-title">电力助手</text>
						<view class="care-switch" @click="toggleCareMode" :class="{'active': isCareMode}">
							<text class="switch-icon">{{ isCareMode ? '👴' : '👓' }}</text>
							<text>{{ isCareMode ? '大大' : '标准' }}</text>
						</view>
					</view>

					<view class="visual-btn-group">
						<view class="icon-btn-header" @click="handleClearHistory">
							<text style="font-size: 34rpx;">🗑️</text>
						</view>
						<view class="visual-entry-btn" @click="showVisualMenu = true">
							<text> ❓️ 疑难解答</text>
						</view>
						<view class="close-icon" @click="closeChat">×</view>
					</view>
				</view>

				<view class="warning-capsule" :class="{'active': diagnosisStep > 0}">
					<text class="warning-icon">{{ diagnosisStep > 0 ? '👨‍⚕️' : '⚡️' }}</text>
					<text class="warning-text" v-if="diagnosisStep === 0">出现紧急安全事故请拨打：12398</text>
					<text class="warning-text" v-else>AI正在进行第 {{ diagnosisStep }}/3 步故障排查...</text>
				</view>

				<scroll-view class="chat-main" scroll-y :scroll-into-view="scrollMsgId" scroll-with-animation>
					<view class="chat-list">
						<view class="time-stamp">{{ currentTime }}</view>

						<view v-for="(msg, index) in messages" :key="index" :id="'msg-'+index"
							:class="['msg-row', msg.role]">

							<view class="msg-avatar" v-if="msg.role === 'ai'">
								<view class="ava-fallback">👷‍️</view>
							</view>

							<view class="msg-content">
								<view v-if="msg.type === 'text'" class="msg-bubble">
									<text class="msg-text" user-select>{{ msg.text }}</text>
									<view v-if="msg.role === 'ai'" class="voice-icon-mini"></view>
								</view>

								<view v-else-if="msg.type === 'video'" class="video-bubble">
									<view class="video-header"><text>📺 {{ msg.title }}</text></view>
									<view class="video-placeholder">
										<view class="play-btn-circle">▶️</view>
										<text style="font-size: 24rpx; margin-top: 10rpx; color: #fff;">模拟视频播放</text>
									</view>
									<text class="video-desc">点击播放学习操作步骤</text>
								</view>

								<view v-else-if="msg.type === 'report'" class="report-bubble">
									<view class="report-header">🔍 AI 安全诊断报告</view>
									<view class="report-img-box">
										<text style="font-size: 60rpx;">🚫</text>
										<text>[模拟隐患照片]</text>
									</view>
									<view class="report-result">
										<text class="report-tag danger">发现隐患</text>
										<text class="report-detail">{{ msg.result }}</text>
									</view>
									<view class="report-btn" @click="handleQuickFix">立即报修</view>
								</view>

								<view v-else-if="msg.type === 'order'" class="order-ticket">
									<view class="ticket-top-decoration"></view>
									<view class="ticket-header">
										<view class="th-row">
											<text class="th-title">故障诊断工单</text>
											<text class="th-badge" :class="{'success': msg.status === 'dispatched'}">
												{{ msg.status === 'dispatched' ? '已接单' : '待派单' }}
											</text>
										</view>
										<text class="th-no">单号：{{ Date.now().toString().slice(-8) }}</text>
									</view>

									<view class="ticket-body">
										<view class="info-grid">
											<view class="ig-item">
												<text class="ig-label">故障类型</text>
												<text class="ig-val bold">{{ msg.info.type }}</text>
											</view>
											<view class="ig-item">
												<text class="ig-label">紧急程度</text>
												<text class="ig-val"
													:class="msg.info.level.includes('轻') ? 'warning' : 'danger-text'">
													{{ msg.info.level }}
												</text>
											</view>
											<view class="ig-item full">
												<text class="ig-label">AI 初步判断</text>
												<text class="ig-val">{{ msg.info.desc }}</text>
											</view>
											<view class="ig-item full">
												<text class="ig-label">预计维修耗时</text>
												<text class="ig-val">{{ msg.info.time }}</text>
											</view>
										</view>

										<view v-if="msg.status === 'dispatched' && msg.master" class="success-box">
											<text class="sb-icon">✅</text>
											<view>
												<text class="sb-title">{{ msg.master.name }} 已接单</text>
												<text class="sb-desc">工号{{ msg.master.id }} · 距离{{ msg.master.dist }} ·
													预计{{ msg.master.time }}到达</text>
											</view>
										</view>
									</view>

									<view class="ticket-footer" v-if="msg.status !== 'dispatched'">
										<view class="t-btn outline" @click="resetDiagnosis">重填</view>
										<view class="t-btn primary" @click="submitOrder(index)">一键呼叫师傅</view>
									</view>
								</view>
							</view>
						</view>

						<view v-if="typing" class="msg-row ai" id="msg-typing">
							<view class="msg-avatar">
								<view class="ava-fallback">👷‍</view>
							</view>
							<view class="msg-bubble typing-bubble">
								<view class="dot d1"></view>
								<view class="dot d2"></view>
								<view class="dot d3"></view>
							</view>
						</view>

						<view v-if="isRecording" class="recording-toast">
							<view class="wave-container">
								<view class="wave w1"></view>
								<view class="wave w2"></view>
								<view class="wave w3"></view>
								<view class="wave w4"></view>
								<view class="wave w5"></view>
							</view>
							<text class="rec-text">请说话 (手指上滑取消)</text>
						</view>

						<view style="height: 40rpx;" id="msg-bottom"></view>
					</view>
				</scroll-view>

				<view class="bottom-input-bar">
					<view class="icon-btn" @click="toggleVoiceMode">
						<text>{{ isVoiceMode ? '⌨️' : '🎤' }}</text>
					</view>
					<input v-if="!isVoiceMode" class="input-box" v-model="userInput" placeholder="问问电费或用电安全"
						confirm-type="send" @confirm="onSend" />

					<view v-else class="voice-hold-btn" :class="{'recording': isRecording, 'disabled': typing}"
						@touchstart="!typing && startRecord()" @touchend="!typing && endRecord()">
						{{ typing ? 'AI 正在思考...' : (isRecording ? '松开 结束' : '按住 说话') }}
					</view>

					<view class="icon-btn camera-btn" @click="handleCamera">
						<text>📷</text>
					</view>
					<view v-if="!isVoiceMode" class="send-btn" @click="onSend">发送</view>
				</view>
			</view>

			<view v-if="showVisualMenu" class="visual-menu-mask" @click.stop="showVisualMenu = false">
				<view class="visual-menu-card" @click.stop>
					<view class="visual-header">
						<text class="visual-title">👇 哪里有问题点哪里</text>
						<view class="visual-close" @click="showVisualMenu = false">×</view>
					</view>
					<view class="visual-grid">
						<view v-for="(item, index) in visualFaqList" :key="index" class="visual-item"
							:style="{background: item.bgColor}" @click="handleVisualClick(item)">
							<view class="v-icon">{{ item.icon }}</view>
							<text class="v-text">{{ item.text }}</text>
						</view>
					</view>
					<view class="visual-footer"><text>长辈专享 · 看图说话 · 一键呼救</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isCareMode: true,
				pos: {
					x: 0,
					y: 600
				},
				isExpanded: false,
				showChat: false,
				showVisualMenu: false,
				userInput: '',
				typing: false,

				// 🆕 机器人情绪状态：normal(蓝) | danger(红) | success(绿)
				robotMood: 'normal',

				loadingTimer: null,
				scrollMsgId: '',
				eyeStyle: 'transform: translate(0, 0)',
				currentTime: '',
				isVoiceMode: false,
				isRecording: false,
				isVoiceFlow: false,
				diagnosisStep: 0,

				messages: [{
					role: 'ai',
					type: 'text',
					text: '老人家，有什么用电的事儿您尽管问我。'
				}],

				faqList: [{
						q: '家里突然没电了',
						key: 'outage',
						a: '老人家先别慌，看看邻居家亮不亮？如果邻居家有电，可能是您家欠费了或者闸跳了。'
					},
					{
						q: '总是莫名其妙跳闸',
						key: 'trip',
						a: '可能是家里大功率电器开多了，空调和电磁炉不要同时开哦。'
					},
					{
						q: '怎么手机交费？',
						key: 'pay',
						a: '不麻烦哒，打开微信，点“我”-“服务”-“生活缴费”，选“电费”就行。'
					},
					{
						q: '插座冒火花/发烫',
						key: 'danger',
						a: '危险！！！赶紧停用这个插座！先把插头拔了，千万别用手碰！'
					},
					{
						q: '灯泡闪烁不停',
						key: 'fix',
						a: '灯泡总闪费眼睛，可能是灯头松了，等天亮了找人拧紧试试。'
					},
					{
						q: '出门要关总闸吗？',
						key: 'safe',
						a: '如果您出远门好几天，关了总闸就放心。要是只出门半天，关掉空调电视就行。'
					}
				],

				visualFaqList: [{
						text: '家里没电',
						icon: '⚡️',
						key: 'outage',
						bgColor: '#FEF2F2',
						q: '家里突然没电了'
					},
					{
						text: '教我交费',
						icon: '📱',
						key: 'pay',
						bgColor: '#ECFDF5',
						q: '我想学手机交费'
					},
					{
						text: '插座冒火',
						icon: '🔥',
						key: 'danger',
						bgColor: '#FFF1F2',
						q: '插座冒烟了！'
					},
					{
						text: '跳闸了',
						icon: '🔌',
						key: 'trip',
						bgColor: '#F0F9FF',
						q: '总是跳闸怎么办'
					},
					{
						text: '灯泡坏了',
						icon: '💡',
						key: 'fix',
						bgColor: '#FFFBEB',
						q: '灯泡坏了怎么换'
					},
					{
						text: '呼叫子女',
						icon: '☎',
						key: 'emergency',
						bgColor: '#FEE2E2',
						q: '紧急呼叫'
					}
				]
			}
		},
		mounted() {
			this.initPosition();
		},
		onReady() {
			this.initPosition();
		},
		methods: {
			initPosition() {
				const sys = uni.getSystemInfoSync();
				this.pos.y = sys.windowHeight - 1040;
				this.pos.x = sys.windowWidth - 700;
				this.updateTime();
			},
			updateTime() {
				const now = new Date();
				this.currentTime =
					`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
			},
			handleRobotClick() {
				if (!this.isExpanded) {
					this.isExpanded = true;
					this.vibrate();
				} else {
					this.showChat = true;
					this.updateTime();
					this.scrollDown();
				}
			},
			closeChat() {
				this.showChat = false;
				this.isExpanded = false;
				this.showVisualMenu = false;
			},

			// 🆕 震动辅助函数
			vibrate() {
				// #ifndef H5
				uni.vibrateShort();
				// #endif
			},

			// 🆕 切换模式
			toggleCareMode() {
				this.isCareMode = !this.isCareMode;
				this.vibrate();
			},

			handleClearHistory() {
				this.vibrate();
				uni.showModal({
					title: '清空确认',
					content: '确定要清空所有聊天记录，重新开始吗？',
					confirmText: '清空',
					confirmColor: '#FF3B30',
					success: (res) => {
						if (res.confirm) {
							this.messages = [{
								role: 'ai',
								type: 'text',
								text: '老人家，记录已清空。有什么用电的事儿您尽管问我。'
							}];
							this.diagnosisStep = 0;
							this.isVoiceFlow = false;
							this.isRecording = false;
							this.typing = false;
							this.robotMood = 'normal'; // 重置情绪
							if (this.loadingTimer) clearInterval(this.loadingTimer);
							uni.showToast({
								title: '已重新开始',
								icon: 'none'
							});
						}
					}
				});
			},

			scrollDown() {
				this.$nextTick(() => {
					this.scrollMsgId = '';
					this.$nextTick(() => {
						if (this.typing) {
							this.scrollMsgId = 'msg-typing';
						} else {
							this.scrollMsgId = 'msg-' + (this.messages.length - 1);
						}
					})
				});
			},

			toggleVoiceMode() {
				this.isVoiceMode = !this.isVoiceMode;
				this.vibrate();
			},
			startRecord() {
				this.isRecording = true;
				this.vibrate();
			},

			endRecord() {
				if (!this.isRecording) return;
				this.isRecording = false;

				uni.showLoading({
					title: '语音转文字中...',
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();

					let mockText = "";
					switch (this.diagnosisStep) {
						case 0:
							mockText = "我灶屋里的灯不亮喔！";
							break;
						case 1:
							mockText = "就系灶屋里冇得电，房里都系亮地撒";
							break;
						case 2:
							mockText = "冰箱还在响，电视也能看，就系灯唔亮喔";
							break;
						case 3:
							mockText = "电表系麻个呀？我完全冇听到声音";
							break;
						default:
							mockText = "我不太清楚，你帮我看看";
					}

					this.userInput = mockText;
					this.isVoiceFlow = true;

					setTimeout(() => {
						this.onSend();
					}, 600);

				}, 800);
			},

			handleCamera() {
				uni.showActionSheet({
					itemList: ['拍摄插座/线路', '从相册选择'],
					success: (res) => {
						this.messages.push({
							role: 'user',
							type: 'text',
							text: '【发送了一张照片】帮我看看这个插座安全吗？'
						});
						this.scrollDown();
						this.typing = true;

						setTimeout(() => {
							this.typing = false;
							// 🆕 发现隐患，眼睛变红
							this.robotMood = 'danger';
							this.vibrate();

							this.messages.push({
								role: 'ai',
								type: 'report',
								result: '检测到面板焦黑、插孔变形，存在严重接触不良和过热风险！建议立即停止使用并更换。'
							});
							this.scrollDown();
						}, 1500);
					}
				});
			},

			handleQuickFix() {
				this.vibrate();
				this.messages.push({
					role: 'user',
					type: 'text',
					text: '立即报修'
				});
				this.scrollDown();

				this.typing = true;
				setTimeout(() => {
					this.typing = false;
					this.messages.push({
						role: 'ai',
						type: 'order',
						status: 'pending',
						info: {
							type: '插座面板更换',
							level: '一般 (轻度隐患)',
							time: '约 20 分钟',
							desc: '经AI视觉检测，插座面板存在轻微烧蚀痕迹。为防止老化加剧，建议更换新面板。'
						}
					});
					this.scrollDown();
				}, 1000);
			},

			onSend() {
				if (!this.userInput.trim()) return;
				this.updateTime();
				const text = this.userInput;
				this.messages.push({
					role: 'user',
					type: 'text',
					text: text
				});
				this.userInput = '';
				this.typing = true;
				this.scrollDown();

				setTimeout(() => {
					this.typing = false;
					// --- 技能大赛专家修改：安全词库拦截 ---
					const dangerWords = ['火', '烟', '冒泡', '烫', '电人', '触电', '火花'];
					const isDanger = dangerWords.some(word => text.includes(word));

					if (isDanger) {
						this.robotMood = 'danger';
						this.vibrate();
						uni.showModal({
							title: '⚠️ 紧急安全提示',
							content: '老人家，发现用电危险！请立即【离开故障房间】，千万不要用手摸！\n\n如果能看到门口的总闸，请先【拉闸断电】！需要帮您联系供电所吗？',
							confirmText: '去拉闸',
							cancelText: '呼叫供电所',
							success: (res) => {
								if (res.cancel) uni.makePhoneCall({
									phoneNumber: '95598'
								});
							}
						});
						// 终止 AI 逻辑，不让 AI 瞎指挥
						this.messages.push({
							role: 'ai',
							type: 'text',
							text: '⚠️ 检测到用电风险！请保持距离，我已经为您准备了紧急联系方式。'
						});
						this.scrollDown();
						return;
					}

					if (this.isVoiceFlow || this.diagnosisStep > 0) {
						this.processVoiceDiagnosis(text);
					} else {
						this.handleNormalReply(text);
					}
					this.scrollDown();
				}, 1500);
			},

			processVoiceDiagnosis(text) {
				if (this.diagnosisStep === 0) {
					if (text.includes('灯') || text.includes('亮') || text.includes('黑')) {
						this.diagnosisStep = 1;
						this.messages.push({
							role: 'ai',
							type: 'text',
							text: '收到。AI正在进行故障排查。\n\n请问是全屋都没电，还是只有厨房这一个地方没电？'
						});
						return;
					}
					this.handleNormalReply(text);
					this.isVoiceFlow = false;
					return;
				}

				if (this.diagnosisStep === 1) {
					this.diagnosisStep = 2;
					this.messages.push({
						role: 'ai',
						type: 'text',
						text: '好的，说明主线路可能没问题。\n\n那您试试，其他的电器（比如冰箱、电视）还能正常用吗？'
					});
					return;
				}

				if (this.diagnosisStep === 2) {
					this.diagnosisStep = 3;
					this.messages.push({
						role: 'ai',
						type: 'text',
						text: '明白，范围缩小至照明回路。\n\n最后确认一下，您最近有没有听到电表箱“啪”的一声跳闸的声音？'
					});
					return;
				}

				if (this.diagnosisStep === 3) {
					this.typing = true;
					this.scrollDown();

					setTimeout(() => {
						this.typing = false;
						this.messages.push({
							role: 'ai',
							type: 'order',
							status: 'pending',
							info: {
								type: '厨房照明线路故障',
								level: '中 (局部故障)',
								time: '约 30 分钟',
								desc: '根据AI多轮诊断，初步判断为灯泡老化或单路开关接触不良，非主线路故障。'
							}
						});
						this.diagnosisStep = 0;
						this.isVoiceFlow = false;
						this.scrollDown();
					}, 1000);
					return;
				}
			},
			handleNormalReply(text) {
				// 1. 支付相关（保留）
				if (text.includes('pay') || text.includes('交费') || text.includes('钱')) {
					this.messages.push({
						role: 'ai',
						type: 'text',
						text: '交电费别着急，我给您找了一个视频，您跟着做就行：'
					});
					this.messages.push({
						role: 'ai',
						type: 'video',
						title: '手把手教您微信交电费',
					});
					return;
				}

				// 2. 维修/一般安全提示（精简）
				// 注意：'火'、'烫' 已经在 onSend 里被最高优先级的“安全熔		断”拦截了，这里只需要判断“修”
				if (text.includes('修')) {
					this.vibrate();
					uni.showModal({
						title: '⚠️ 安全警示',
						content: '老人家，如果要自己动手修，请务必确保：\n1. 双手干燥\n2. 脚下无积水\n3. 不要触摸裸露线头',
						confirmText: '我已确保安全',
						confirmColor: '#FF3B30',
						success: (res) => {
							if (res.confirm) {
								this._realReply(text);
							}
						}
					});
					return;
				}

				// 3. 兜底回复（保留）
				this._realReply(text);
			},

			_realReply(text) {
				let reply = '';
				const faq = this.faqList.find(f => text.includes(f.key) || text.includes(f.q.substring(0, 2)));
				if (faq) {
					reply = faq.a;
				} else if (text.includes('灯') || text.includes('不亮')) {
					reply = '灯泡总闪费眼睛，可能是灯头松了，等天亮了找人拧紧试试。';
				} else {
					reply = '这个问题太专业了，要不您点一下那个相机图标，拍个照给我看看？或者点击“人工客服”。';
				}
				this.messages.push({
					role: 'ai',
					type: 'text',
					text: reply
				});
			},

			resetDiagnosis() {
				this.diagnosisStep = 0;
				this.robotMood = 'normal';
				this.vibrate();
				this.messages.push({
					role: 'ai',
					type: 'text',
					text: '好的，我们重新开始。请告诉我您遇到了什么问题？'
				});
				this.scrollDown();
			},

			submitOrder(index) {
				uni.showLoading({
					title: '正在呼叫...'
				});

				const masterList = [{
						name: '王建国师傅',
						id: '021',
						dist: '1.2km',
						time: '15分钟'
					},
					{
						name: '李强师傅',
						id: '033',
						dist: '0.8km',
						time: '8分钟'
					},
					{
						name: '王五师傅',
						id: '014',
						dist: '1.8km',
						time: '19分钟'
					},
					{
						name: '陈云师傅',
						id: '029',
						dist: '1.7km',
						time: '9分钟'
					},
				];

				setTimeout(() => {
					uni.hideLoading();

					if (this.messages[index]) {
						const randomIdx = Math.floor(Math.random() * masterList.length);
						const selectedMaster = masterList[randomIdx];

						// 兼容 Vue 2 和 Vue 3 的写法
						if (this.$set) {
							this.$set(this.messages[index], 'master', selectedMaster);
							this.$set(this.messages[index], 'status', 'dispatched');
						} else {
							// Vue 3 环境
							this.messages[index].master = selectedMaster;
							this.messages[index].status = 'dispatched';
						}
					}

					// 🆕 接单成功，眼睛变绿
					this.robotMood = 'success';
					this.vibrate();

					uni.showToast({
						title: '派单成功！',
						icon: 'success'
					});
					this.scrollDown();
				}, 1500);
			},

			sendFaq(item) {
				this.messages.push({
					role: 'user',
					type: 'text',
					text: item.q
				});
				this.typing = true;
				this.scrollDown();
				setTimeout(() => {
					this.typing = false;
					if (item.a) {
						this.messages.push({
							role: 'ai',
							type: 'text',
							text: item.a
						});
					} else {
						this.handleNormalReply(item.key || item.q);
					}
					this.scrollDown();
				}, 800);
			},
			handleVisualClick(item) {
				this.vibrate();
				if (item.key === 'emergency') {
					uni.showModal({
						title: '⚠️ 紧急联系',
						content: '即将为您拨打紧急联系人电话 (儿子)',
						confirmText: '立即拨打',
						confirmColor: '#FF3B30',
						success: (res) => {
							if (res.confirm) uni.makePhoneCall({
								phoneNumber: '13888888888'
							});
						}
					});
					return;
				}
				this.showVisualMenu = false;
				this.sendFaq(item);
			},
		}
	}
</script>

<style scoped>
	/* 1. 基础容器 */
	.container {
		width: 100%;
	}

	.movable-area {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 9999;
		height: 100vh;
		width: 100vw;
	}

	.movable-view {
		width: 120rpx;
		height: 120rpx;
		pointer-events: auto;
		transition: all 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28);
		z-index: 10000;
	}

	.movable-view.is-hidden {
		transform: translateX(-90%) !important;
		opacity: 1.5;
	}

	/* 1. 机器人头部 */
	.robot-helmet {
		width: 100%;
		height: 100%;
		/* 改动：使用纯亮黄色，类似交通警示牌底色 */
		background: #FFD700;
		border-radius: 40% 40% 50% 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		/* 改动：去掉柔和阴影，改用硬朗的黑色投影，增加立体感 */
		box-shadow: 4rpx 8rpx 0px #000000;
		/* 改动：加粗到 6rpx 的纯黑边框，轮廓极其清晰 */
		border: 6rpx solid #000000;
		position: relative;
	}

	/* 2. 面罩区域 */
	.visor-glass {
		width: 85rpx;
		height: 42rpx;
		/* 改动：纯黑色，与黄色形成最强对比 */
		background: #000000;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		overflow: hidden;
	}

	/* 3. 眼睛 */
	.digital-eye {
		/* 改动：尺寸加大，老年人看得更清 */
		width: 18rpx;
		height: 18rpx;
		/* 改动：极亮的青色，在黑色面罩上像车灯一样 */
		background: #00FFFF;
		border-radius: 50%;
		/* 改成圆形，更聚光 */
		/* 改动：增强发光范围 */
		box-shadow: 0 0 20rpx #00FFFF;
		transition: all 0.5s;
	}

	/* 🆕 机器人情绪色 */
	.digital-eye.danger {
		background: #FF3B30;
		box-shadow: 0 0 15rpx #FF3B30;
	}

	.digital-eye.success {
		background: #34C759;
		box-shadow: 0 0 15rpx #34C759;
	}

	.blink {
		animation: eye-blink 4s infinite;
	}

	@keyframes eye-blink {

		0%,
		90%,
		100% {
			transform: scaleY(1);
		}

		95% {
			transform: scaleY(0.1);
		}
	}

	.tip-question {
		position: absolute;
		top: -10rpx;
		right: 0;
		width: 44rpx;
		height: 44rpx;
		background: rgba(0, 242, 254, 0.2);
		border: 3rpx solid #00f2fe;
		border-radius: 50%;
		color: #00f2fe;
		font-size: 26rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 20rpx rgba(0, 242, 254, 0.8);
		animation: q-float 2s infinite ease-in-out;
	}

	@keyframes q-float {

		0%,
		100% {
			transform: translateY(0);
			opacity: 0.7;
		}

		50% {
			transform: translateY(-10rpx);
			opacity: 1;
		}
	}

	/* 2. 聊天窗口 */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 10001;
		display: flex;
		align-items: flex-end;
		backdrop-filter: blur(2px);
	}

	.chat-window {
		width: 100%;
		height: 80vh;
		background: #F2F2F7;
		border-radius: 40rpx 40rpx 0 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: slide-up 0.4s ease-out;
		position: relative;
	}

	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0);
		}
	}

	/* 头部控制栏 */
	.window-header {
		padding: 30rpx;
		padding-top: calc(20rpx + var(--status-bar-height));
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-bottom: 1px solid #eee;
	}

	.header-main {
		display: flex;
		align-items: center;
		gap: 16rpx;
		flex: 1;
		overflow: hidden;
	}

	.header-title {
		font-weight: 700;
		font-size: 34rpx;
		color: #1c1c1e;
		white-space: nowrap;
	}

	.care-switch {
		font-size: 24rpx;
		color: #007aff;
		background: #E5F1FF;
		padding: 6rpx 16rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		gap: 6rpx;
		transition: all 0.3s;
		flex-shrink: 0;
	}

	.care-switch.active {
		background: #007aff;
		color: #fff;
	}

	.switch-icon {
		font-weight: bold;
		font-size: 26rpx;
	}

	.visual-btn-group {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex-shrink: 0;
	}

	.icon-btn-header {
		width: 64rpx;
		height: 64rpx;
		background: #F2F2F7;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12rpx;
	}

	.icon-btn-header:active {
		background: #E5E5EA;
	}

	.visual-entry-btn {
		background: #FF9500;
		color: white;
		padding: 10rpx 16rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 6rpx;
		box-shadow: 0 4rpx 12rpx rgba(255, 149, 0, 0.3);
	}

	.close-icon {
		font-size: 48rpx;
		color: #8e8e93;
		line-height: 1;
		padding: 0 16rpx;
	}

	/* 胶囊预警条 */
	.warning-capsule {
		margin: 20rpx 30rpx 0;
		background: #FFF1F0;
		border-radius: 20rpx;
		padding: 16rpx 24rpx;
		display: flex;
		align-items: center;
		gap: 16rpx;
		border: 1px solid #FFCCC7;
		transition: all 0.3s;
	}

	.warning-capsule.active {
		background: #E6F7FF;
		border-color: #91D5FF;
	}

	.warning-icon {
		font-size: 32rpx;
	}

	.warning-text {
		font-size: 26rpx;
		color: #FF4D4F;
		line-height: 40rpx;
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.active .warning-text {
		color: #0050B3;
	}

	/* 聊天内容区 */
	.chat-main {
		flex: 1;
		height: 0;
		padding: 0 30rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.time-stamp {
		text-align: center;
		color: #8e8e93;
		font-size: 24rpx;
		margin: 30rpx 0;
		font-weight: 500;
	}

	.msg-row {
		display: flex;
		margin-bottom: 30rpx;
		width: 100%;
	}

	.msg-row.user {
		justify-content: flex-end;
	}

	.msg-avatar {
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.ava-fallback {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 44rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.msg-bubble {
		padding: 22rpx 30rpx;
		border-radius: 36rpx;
		font-size: 34rpx;
		line-height: 1.5;
		max-width: 75%;
		position: relative;
		min-height: 80rpx;
		display: flex;
		align-items: center;
	}

	.ai .msg-bubble {
		background: #fff;
		color: #1c1c1e;
		border-bottom-left-radius: 4rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.user .msg-bubble {
		background: #007aff;
		color: #fff;
		border-bottom-right-radius: 4rpx;
	}

	.voice-icon-mini {
		font-size: 24rpx;
		margin-left: 10rpx;
		opacity: 0.5;
	}

	/* 🆕 波浪输入气泡 */
	.typing-bubble {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 30rpx 40rpx;
		background: #fff;
		border-bottom-left-radius: 4rpx;
	}

	.dot {
		width: 12rpx;
		height: 12rpx;
		background: #999;
		border-radius: 50%;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.d1 {
		animation-delay: -0.32s;
	}

	.d2 {
		animation-delay: -0.16s;
	}

	@keyframes bounce {

		0%,
		80%,
		100% {
			transform: scale(0);
		}

		40% {
			transform: scale(1);
		}
	}

	/* 视频/报告卡片 */
	.video-bubble,
	.report-bubble {
		width: 500rpx;
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
		margin-bottom: 10rpx;
	}

	.video-header,
	.report-header {
		padding: 20rpx 24rpx;
		background: #f9f9fa;
		font-size: 28rpx;
		font-weight: 600;
		color: #1c1c1e;
		border-bottom: 1px solid #eee;
	}

	.video-placeholder {
		height: 280rpx;
		background: linear-gradient(135deg, #2b2b2b, #000000);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-direction: column;
	}

	.play-btn-circle {
		width: 90rpx;
		height: 90rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(5px);
		font-size: 40rpx;
	}

	.report-img-box {
		width: 100%;
		height: 300rpx;
		background: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		flex-direction: column;
		gap: 10rpx;
	}

	.video-desc {
		padding: 16rpx;
		font-size: 24rpx;
		color: #8e8e93;
		text-align: center;
		display: block;
	}

	.report-result {
		padding: 24rpx;
	}

	.report-tag {
		background: #FFF1F0;
		color: #FF4D4F;
		font-size: 22rpx;
		padding: 6rpx 12rpx;
		border-radius: 8rpx;
		border: 1px solid #FFA39E;
		margin-right: 12rpx;
		font-weight: bold;
	}

	.report-detail {
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
	}

	.report-btn {
		margin: 0 24rpx 24rpx;
		background: #FF4D4F;
		color: #fff;
		text-align: center;
		padding: 18rpx;
		border-radius: 16rpx;
		font-size: 30rpx;
		font-weight: 600;
	}

	.report-btn:active {
		background: #D9363E;
	}

	/* 🏆 工单卡片 */
	.order-ticket {
		width: 560rpx;
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
		position: relative;
		border: 1px solid #e5e5ea;
	}

	.ticket-header {
		background: #F0F9FF;
		padding: 24rpx 30rpx;
		border-bottom: 1px dashed #BAE7FF;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.th-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #0050B3;
	}

	.th-no {
		font-size: 24rpx;
		color: #91D5FF;
		font-family: monospace;
		margin-top: 4rpx;
	}

	.th-badge {
		background: #007AFF;
		color: #fff;
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
	}

	.th-badge.success {
		background: #34C759;
	}

	.ticket-body {
		padding: 30rpx;
	}

	.ticket-top-decoration {
		height: 10rpx;
		background: repeating-linear-gradient(45deg, #007AFF, #007AFF 10px, #fff 10px, #fff 20px);
	}

	.info-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.ig-item {
		width: 45%;
		display: flex;
		flex-direction: column;
	}

	.ig-item.full {
		width: 100%;
		margin-top: 10rpx;
	}

	.ig-label {
		font-size: 26rpx;
		color: #8E8E93;
		margin-bottom: 6rpx;
	}

	.ig-val {
		font-size: 30rpx;
		color: #1C1C1E;
		font-weight: 500;
	}

	.ig-val.bold {
		font-weight: bold;
		font-size: 32rpx;
		color: #000;
	}

	.ig-val.warning {
		color: #FF9500;
		font-weight: bold;
	}

	.ig-val.danger-text {
		color: #FF3B30;
		font-weight: bold;
	}

	.success-box {
		background: #F6FFED;
		border: 1px solid #B7EB8F;
		padding: 20rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-top: 20rpx;
	}

	.sb-icon {
		font-size: 40rpx;
	}

	.sb-title {
		font-weight: bold;
		color: #389E0D;
		font-size: 30rpx;
	}

	.sb-desc {
		color: #52C41A;
		font-size: 24rpx;
		margin-top: 4rpx;
		display: block;
	}

	.ticket-footer {
		display: flex;
		border-top: 1px solid #eee;
	}

	.t-btn {
		flex: 1;
		text-align: center;
		padding: 30rpx 0;
		font-size: 32rpx;
		font-weight: 600;
	}

	.t-btn.outline {
		color: #999;
		border-right: 1px solid #eee;
		background: #FAFAFA;
	}

	.t-btn.primary {
		color: #007AFF;
		background: #fff;
	}

	/* 底部输入栏 */
	.bottom-input-bar {
		padding: 20rpx 30rpx 60rpx;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		display: flex;
		align-items: center;
		gap: 16rpx;
		border-top: 1px solid rgba(0, 0, 0, 0.05);
	}

	.input-box {
		flex: 1;
		background: #F2F2F7;
		height: 80rpx;
		border-radius: 40rpx;
		padding: 0 30rpx;
		font-size: 32rpx;
		color: #000;
	}

	.send-btn {
		color: #007AFF;
		font-weight: 600;
		padding: 0 10rpx;
		font-size: 32rpx;
	}

	.icon-btn {
		width: 70rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		background: #F2F2F7;
		border-radius: 50%;
		color: #8e8e93;
	}

	.camera-btn {
		color: #34C759;
	}

	.voice-hold-btn {
		flex: 1;
		height: 80rpx;
		background: #F2F2F7;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #1c1c1e;
		font-weight: 600;
		font-size: 30rpx;
	}

	.voice-hold-btn.recording {
		background: #e5e5ea;
		color: #007AFF;
	}

	.voice-hold-btn.disabled {
		opacity: 0.5;
		background: #ddd;
		color: #999;
	}

	/* 录音动画 */
	.recording-toast {
		width: 300rpx;
		height: 300rpx;
		background: rgba(0, 0, 0, 0.7);
		border-radius: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10005;
		backdrop-filter: blur(10px);
	}

	.wave-container {
		height: 60rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 24rpx;
	}

	.wave {
		width: 10rpx;
		background: #fff;
		border-radius: 10rpx;
		animation: wave-jump 0.6s infinite ease-in-out;
	}

	.w1 {
		animation-delay: 0s
	}

	.w2 {
		animation-delay: 0.1s
	}

	.w3 {
		animation-delay: 0.2s
	}

	.w4 {
		animation-delay: 0.3s
	}

	.w5 {
		animation-delay: 0.4s
	}

	@keyframes wave-jump {

		0%,
		100% {
			height: 16rpx;
			opacity: 0.5;
		}

		50% {
			height: 50rpx;
			opacity: 1;
		}
	}

	.rec-text {
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
	}

	/* 图解菜单 */
	.visual-menu-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 10002;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(5px);
	}

	.visual-menu-card {
		width: 90%;
		background: #fff;
		border-radius: 40rpx;
		padding: 40rpx;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
		animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes pop-in {
		from {
			transform: scale(0.9);
			opacity: 0;
		}

		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.visual-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.visual-title {
		font-size: 38rpx;
		font-weight: 700;
		color: #1c1c1e;
	}

	.visual-close {
		width: 64rpx;
		height: 64rpx;
		background: #f2f2f7;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		color: #8e8e93;
	}

	.visual-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24rpx;
		margin-bottom: 30rpx;
	}

	.visual-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 36rpx;
		border-radius: 32rpx;
		gap: 16rpx;
		transition: transform 0.1s;
	}

	.visual-item:active {
		transform: scale(0.98);
	}

	.v-icon {
		font-size: 80rpx;
	}

	.v-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #1c1c1e;
	}

	.visual-footer {
		text-align: center;
		font-size: 24rpx;
		color: #aaa;
		margin-top: 20rpx;
	}

	/* --- 关怀模式优化 --- */
	.care-mode .header-title {
		font-size: 40rpx;
	}

	.care-mode .care-switch {
		padding: 10rpx 24rpx;
		font-size: 28rpx;
	}

	.care-mode .visual-entry-btn {
		padding: 14rpx 28rpx;
		font-size: 30rpx;
	}

	/* 关怀模式文本优化 */
	.care-mode .msg-text {
		font-size: 38rpx;
		font-weight: 500;
		line-height: 1.8;
		letter-spacing: 2rpx;
	}

	.care-mode .faq-item {
		font-size: 32rpx;
		padding: 20rpx 40rpx;
	}

	.care-mode .visual-title {
		font-size: 44rpx;
	}

	.care-mode .v-text {
		font-size: 38rpx;
	}

	.care-mode .v-icon {
		font-size: 100rpx;
	}

	.care-mode .warning-text {
		font-size: 30rpx;
	}

	/* 关怀模式工单 */
	.care-mode .th-title {
		font-size: 40rpx;
	}

	.care-mode .ig-label {
		font-size: 32rpx;
	}

	.care-mode .ig-val {
		font-size: 36rpx;
	}

	.care-mode .t-btn {
		font-size: 38rpx;
		padding: 36rpx 0;
	}

	.care-mode .sb-title {
		font-size: 36rpx;
	}

	.care-mode .sb-desc {
		font-size: 30rpx;
	}
</style>