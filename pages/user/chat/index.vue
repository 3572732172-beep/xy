<template>
	<view class="chat-container">
		<!-- 左侧边栏 -->
		<view class="sidebar">
			<!-- Logo和标题 -->
			<view class="sidebar-header">
				<view class="logo">
					<view class="logo-circle">O</view>
				</view>
				<text class="sidebar-title">乡村用电助手</text>
			</view>
			
			<!-- 新建对话按钮 -->
			<view class="new-chat-btn" @click="createNewChat">
				<text class="new-chat-icon">+</text>
				<text class="new-chat-text">新建对话</text>
			</view>
			
			<!-- 历史记录 -->
			<view class="history-section">
				<text class="history-title">历史记录</text>
				<scroll-view class="history-list" scroll-y>
					<view 
						v-for="(item, idx) in historyList" 
						:key="idx"
						:class="['history-item-wrapper', { active: currentChatId === item.id }]"
					>
						<view 
							class="history-item"
							@click="selectChat(item.id)"
						>
							{{ item.title }}
						</view>
						<view 
							class="delete-btn" 
							@click.stop="deleteChat(item.id, idx)"
						>
							<text class="delete-icon">×</text>
						</view>
					</view>
				</scroll-view>
				<text class="history-tip">仅显示最近20条对话</text>
			</view>
		</view>
		
		<!-- 右侧主内容区 -->
		<view class="main-content">
			<!-- 顶部标题栏 -->
			<view class="content-header">
				<view class="header-left">
					<view class="back-home-btn" @click="goHome">
						<view class="back-icon-wrapper">
							<text class="back-icon">‹</text>
						</view>
						<text class="back-text">首页</text>
					</view>
					<view class="title-wrapper">
						<text class="content-title">{{ currentChatTitle }}</text>
					</view>
				</view>
				<view class="header-actions">
					<text class="action-text">{{ messageCount }}条提问</text>
					<view class="action-icon-wrapper" @click="copyContent">
						<text class="action-icon">📋</text>
					</view>
				</view>
			</view>
			
			<!-- 聊天内容区 -->
			<scroll-view 
				class="chat-content" 
				scroll-y 
				:scroll-top="scrollTop"
				scroll-with-animation
			>
				<!-- 欢迎卡片 -->
				<view v-if="messages.length === 0" class="welcome-card">
					<view class="welcome-title">
						<text class="title-text">乡村用电助手</text>
						<view class="title-underline"></view>
					</view>
					<text class="welcome-desc">提供乡村用电安全知识、应急处理和预防指导，保障用电安全。</text>
					
					<!-- 功能按钮 -->
					<view class="function-buttons">
						<view 
							:class="['func-btn', { active: activeFunc === 'knowledge' }]"
							@click="setActiveFunc('knowledge')"
						>
							安全知识
						</view>
						<view 
							:class="['func-btn', { active: activeFunc === 'emergency' }]"
							@click="setActiveFunc('emergency')"
						>
							应急处理
						</view>
						<view 
							:class="['func-btn', { active: activeFunc === 'prevention' }]"
							@click="setActiveFunc('prevention')"
						>
							预防指导
						</view>
					</view>
					
					<!-- 建议问题 -->
					<view class="suggested-questions">
						<view 
							v-for="(q, idx) in suggestedQuestions" 
							:key="idx"
							class="question-chip"
							@click="selectQuestion(q)"
						>
							{{ q }}
						</view>
					</view>
				</view>
				
				<!-- 聊天消息列表 -->
				<view v-if="messages.length > 0" class="messages-list">
					<view 
						v-for="(msg, idx) in messages" 
						:key="idx"
						:class="['message-item', msg.role]"
					>
						<view :class="['message-bubble', msg.role]">
							<text class="message-text">{{ getMessageText(msg) }}</text>
						</view>
					</view>
					
					<!-- 打字中动画 -->
					<view v-if="typing" class="message-item ai">
						<view class="message-bubble ai typing">
							<view class="typing-dots">
								<view class="dot"></view>
								<view class="dot"></view>
								<view class="dot"></view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 输入框 -->
			<view class="input-container">
				<input 
					class="chat-input" 
					v-model="inputText" 
					placeholder="请输入问题" 
					confirm-type="send"
					@confirm="handleSend"
				/>
				<view class="send-btn" @click="handleSend">
					<text class="send-icon">✈</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ChatPage',
	data() {
		return {
			currentChatId: 'chat-' + Date.now(),
			currentChatTitle: '新建对话',
			messageCount: 0,
			activeFunc: 'knowledge',
			inputText: '',
			typing: false,
			scrollTop: 0,
			typingTimer: null,
			historyList: [],
			suggestedQuestions: [
				'如何检查乡村用电安全隐患?',
				'如何正确使用漏电保护器?',
				'电气安全如何预防?'
			],
			messages: [],
			faqList: [
				{ 
					q: '如何检查乡村用电安全隐患?', 
					keywords: ['检查', '安全隐患', '安全', '隐患', '排查'],
					a: '检查乡村用电安全隐患需要从以下几个方面入手：\n1) 检查配电箱：是否有异味、发热现象，空气开关、漏电保护器动作是否灵敏；\n2) 检查线路：是否有私拉乱接、线皮破损、接头裸露等情况；\n3) 检查插座：是否松动、发热、变色、有异味；\n4) 检查设备：大功率电器是否独立回路，线径是否匹配；\n5) 检查环境：电线是否被压、被碾压，是否靠近水源等。发现异常应立即断电并联系专业电工处理。' 
				},
				{ 
					q: '如何正确使用漏电保护器?', 
					keywords: ['漏电保护器', '漏保', '漏电', '保护器'],
					a: '正确使用漏电保护器的方法：\n1) 每月按下试验按钮，确保能正常跳闸；\n2) 确认漏电保护器动作电流符合要求（一般30mA）；\n3) 如果频繁跳闸，先逐个断开设备排查漏电点；\n4) 不能随意增大动作电流或拆除漏电保护器；\n5) 定期检查漏电保护器外观，确保无损坏、无变形；\n6) 配合接地系统使用，确保接地良好。如遇异常，应请专业电工检查。' 
				},
				{ 
					q: '电气安全如何预防?', 
					keywords: ['预防', '安全', '电气安全', '如何预防'],
					a: '预防电气事故的措施包括：\n1) 定期检查：每季度检查漏电保护器，半年巡检一次线路外观；\n2) 合理用电：不超负荷用电，大功率电器独立回路；\n3) 使用合格产品：选择符合国家标准的电器设备和材料；\n4) 规范安装：由持证电工进行安装和改造；\n5) 加强教育：提高安全用电意识，掌握基本安全知识；\n6) 及时维护：发现老化、损坏的设备及时更换；\n7) 建立制度：建立用电安全管理制度，定期排查隐患。' 
				},
				{ 
					q: '频繁跳闸怎么办？', 
					keywords: ['跳闸', '频繁跳闸', '跳了'],
					a: '频繁跳闸的处理方法：\n1) 先检查是否有大功率设备同时运行导致过载；\n2) 复位空开/漏保后观察，看是否继续跳闸；\n3) 若仍跳闸，逐个断开设备排查，找出问题设备；\n4) 检查线路是否有短路、漏电情况；\n5) 检查空开容量是否匹配用电负荷；\n6) 如果自己无法排查，建议减少负载或请专业师傅排查线路漏电/短路问题。' 
				},
				{ 
					q: '插座发热/有焦味怎么办？', 
					keywords: ['插座', '发热', '焦味', '烫', '冒烟'],
					a: '插座发热或有焦味的紧急处理：\n1) 立即断电停止使用该插座；\n2) 检查是否接触不良或过载导致的；\n3) 绝对不要继续使用该插座，避免引发火灾；\n4) 尽快联系专业电工检查线路和更换插座；\n5) 检查连接的电器设备是否正常；\n6) 如果是过载导致的，减少该回路的用电负荷。' 
				},
				{ 
					q: '漏电保护器老是跳？', 
					keywords: ['漏电保护器', '漏保', '老是跳', '一直跳'],
					a: '漏电保护器频繁跳闸的排查：\n1) 可能存在漏电隐患或设备老化问题；\n2) 先逐个断开设备排查，找出导致跳闸的设备；\n3) 检查线路绝缘是否良好，是否有破损；\n4) 检查接地是否良好；\n5) 若自己无法排查，建议请专业师傅做绝缘/漏电检测；\n6) 不要随意增大动作电流或拆除漏电保护器。' 
				},
				{ 
					q: '新装电器需要单独回路吗？', 
					keywords: ['新装', '单独回路', '回路', '安装'],
					a: '新装电器的回路要求：\n1) 大功率电器（空调、热水器、烤箱、电磁炉等）建议单独回路；\n2) 每个独立回路需要配备独立的空气开关；\n3) 线径和开关容量需匹配设备功率（例如：1.5kW用2.5平方线，3kW用4平方线）；\n4) 避免多个大功率电器共用一个回路；\n5) 安装前应请专业电工评估用电负荷，合理规划电路。' 
				}
			]
		};
	},
	onLoad() {
		// 加载历史记录
		this.loadHistory();
	},
	methods: {
		createNewChat() {
			const newId = 'chat-' + Date.now();
			const newTitle = '新建对话';
			this.currentChatId = newId;
			this.currentChatTitle = newTitle;
			this.messages = [];
			this.messageCount = 0;
			this.inputText = '';
			
			// 添加到历史记录
			this.historyList.unshift({ id: newId, title: newTitle });
			if (this.historyList.length > 20) {
				this.historyList = this.historyList.slice(0, 20);
			}
			this.saveHistory();
		},
		selectChat(chatId) {
			this.currentChatId = chatId;
			const chat = this.historyList.find(item => item.id === chatId);
			if (chat) {
				this.currentChatTitle = chat.title;
				// 这里应该加载对应的聊天记录
				// 暂时清空消息，等待实际加载历史消息的逻辑
				this.messages = [];
				this.messageCount = 0;
			}
		},
		setActiveFunc(func) {
			this.activeFunc = func;
		},
		selectQuestion(question) {
			this.inputText = question;
			this.handleSend();
		},
		handleSend() {
			const text = (this.inputText || '').trim();
			if (!text) return;
			
			// 添加用户消息
			this.messages.push({ role: 'user', text, displayText: text });
			this.messageCount++;
			this.inputText = '';
			
			// 更新对话标题（如果是第一条消息）
			if (this.messages.length === 1) {
				this.currentChatTitle = text.length > 20 ? text.substring(0, 20) + '...' : text;
				let chat = this.historyList.find(item => item.id === this.currentChatId);
				if (chat) {
					chat.title = this.currentChatTitle;
				} else {
					// 如果当前聊天不在历史记录中，添加到历史记录
					chat = { id: this.currentChatId, title: this.currentChatTitle };
					this.historyList.unshift(chat);
					if (this.historyList.length > 20) {
						this.historyList = this.historyList.slice(0, 20);
					}
				}
				this.saveHistory();
			}
			
			// 显示打字动画
			this.typing = true;
			this.scrollToBottom();
			
			// 保存this引用
			const self = this;
			
			// 模拟AI回复
			setTimeout(() => {
				self.typing = false;
				const reply = self.makeAiReply(text);
				if (!reply) {
					return;
				}
				// 添加消息，初始displayText为空，会回退显示text
				const aiMessage = { role: 'ai', text: reply, displayText: '' };
				self.messages.push(aiMessage);
				const messageIndex = self.messages.length - 1; // 保存消息索引
				self.scrollToBottom();
				
				// 开始打字机效果，传入消息索引
				self.startTypingEffect(messageIndex, reply);
			}, 900 + Math.random() * 600);
		},
		makeAiReply(text) {
			const normalizedText = text.trim().toLowerCase();
			
			// 首先进行FAQ精确匹配（优先匹配）
			// 1. 完整问题匹配
			const exactMatch = this.faqList.find(item => {
				const normalizedQ = item.q.trim().toLowerCase().replace(/[？?]/g, '');
				return normalizedText === normalizedQ || normalizedText.includes(normalizedQ) || normalizedQ.includes(normalizedText);
			});
			if (exactMatch) return exactMatch.a;
			
			// 2. 关键词匹配
			const keywordMatch = this.faqList.find(item => {
				if (item.keywords && item.keywords.length > 0) {
					// 检查是否包含关键词
					return item.keywords.some(keyword => normalizedText.includes(keyword.toLowerCase()));
				}
				return false;
			});
			if (keywordMatch) return keywordMatch.a;
			
			// 3. 部分关键词匹配（从问题中提取关键词）
			const partialMatch = this.faqList.find(item => {
				const questionWords = item.q.replace(/[？?]/g, '').split(/[\s，,、]/).filter(w => w.length > 1);
				return questionWords.some(word => normalizedText.includes(word.toLowerCase()));
			});
			if (partialMatch) return partialMatch.a;
			
			// 如果匹配到特定问题，但没找到FAQ，使用通用电力自查方案
			const electricKeywords = ['电', '用电', '电力', '线路', '漏电', '跳闸', '配电', '插座', '电器', '安全', '隐患', '检查'];
			const hasElectricKeyword = electricKeywords.some(k => normalizedText.includes(k));
			if (hasElectricKeyword) {
				return [
					'电力自查方案：',
					'1) 线路与电箱：检查配电箱是否有异味/发热，空气开关、漏保动作是否灵敏；确认各回路负荷分配，避免大功率集中在同一回路；观察是否有私拉乱接、线皮破损、接头裸露，发现立即停用并重新压接或更换。',
					'2) 接地与漏保：确认主接地良好（接地线、接地排无松动、无锈蚀），卫生间/厨房/户外插座必须接地；按下漏电保护器试验键，能正常跳闸；若频繁跳闸，逐个断开设备排查漏电点。',
					'3) 插座与负载：检查插座是否松动、发热、变色、异味；避免一个插座拖多个大功率（电磁炉/热水器/空调/电饭煲等）并行；户外和潮湿场景使用防溅/防水插座，定期紧固端子螺丝。',
					'4) 设备与环境：大功率电器建议独立回路并匹配线径/空开；老旧或损坏的插排、插头及时更换；电线不可压在门缝、窗缝或被重物碾压，避免被宠物啃咬；雨天注意户外临时线路防水、防触电。',
					'5) 日常检测：每季度压测漏电保护器；半年巡检一次线路外观与接头；出现焦味/异响/发热/火花立刻断电，先排查再送电；确有隐患时，联系持证电工现场处理，避免自行带电操作。',
					'请结合现场实际执行，如有异常务必先断电，再联系专业人士。'
				].join('\n');
			}
			
			// 根据功能类型返回不同回复（兜底方案）
			const replies = {
				knowledge: [
					'乡村用电安全知识包括：定期检查电线是否老化、破损；确保电箱接地良好；使用符合国家标准的电器设备；避免私拉乱接电线；定期检查漏电保护器是否正常工作。',
					'安全用电的基本原则：不超负荷用电；不使用破损的插头、插座；不在一个插座上连接过多电器；定期检查线路和电器设备；发现异常及时断电并联系专业人员。'
				],
				emergency: [
					'遇到用电紧急情况时：1.立即切断电源；2.使用干木棒等绝缘物将电线移开；3.不要直接用手接触触电者；4.及时拨打急救电话；5.在专业人员到达前，保持现场安全。',
					'电气火灾应急处理：1.立即切断电源，拉下总开关；2.使用绝缘工具隔离电源，切勿用水扑救；3.使用不导电的灭火材料（如干沙、干粉等）；4.及时报警并说明是电气火灾；5.确保人员安全撤离到安全区域。'
				],
				prevention: [
					'预防用电事故的措施：定期检查线路和设备；安装漏电保护器；合理分配用电负荷；使用合格电器产品；加强安全用电教育；建立用电安全管理制度。',
					'预防电气事故的关键：选择合适规格的电线和开关；正确安装和使用电器；定期维护和检查；及时更换老化设备；提高安全意识和操作技能。'
				]
			};
			
			const funcReplies = replies[this.activeFunc] || replies.knowledge;
			return funcReplies[Math.floor(Math.random() * funcReplies.length)];
		},
		getMessageText(msg) {
			// 用户消息直接显示text
			if (msg.role === 'user') {
				return msg.text || '';
			}
			// AI消息：如果有displayText且不为空，显示displayText，否则显示text
			if (msg.role === 'ai') {
				return (msg.displayText && msg.displayText.length > 0) ? msg.displayText : (msg.text || '');
			}
			return msg.text || '';
		},
		copyContent() {
			uni.setClipboardData({
				data: this.messages.map(msg => `${msg.role === 'user' ? '我' : 'AI'}: ${msg.text}`).join('\n'),
				success: () => {
					uni.showToast({
						title: '已复制',
						icon: 'success'
					});
				}
			});
		},
		scrollToBottom() {
			this.$nextTick(() => {
				this.scrollTop = 99999;
			});
		},
		loadHistory() {
			const saved = uni.getStorageSync('chat-history');
			if (saved && Array.isArray(saved)) {
				this.historyList = saved;
			}
		},
		saveHistory() {
			uni.setStorageSync('chat-history', this.historyList);
		},
		goHome() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		startTypingEffect(messageIndex, fullText) {
			let charIndex = 0;
			const speed = 50; // 每个字符的显示间隔（毫秒）
			const self = this;
			
			// 清除之前的定时器
			if (self.typingTimer) {
				clearInterval(self.typingTimer);
			}
			
			// 确保消息存在
			if (!self.messages[messageIndex]) {
				return;
			}
			
			// 初始化显示文本为空
			self.$set(self.messages[messageIndex], 'displayText', '');
			
			// 使用 nextTick 确保视图更新后再开始打字
			self.$nextTick(() => {
				self.typingTimer = setInterval(() => {
					if (charIndex < fullText.length) {
						// 逐字显示
						const displayText = fullText.substring(0, charIndex + 1);
						// 使用 $set 确保响应式更新
						self.$set(self.messages[messageIndex], 'displayText', displayText);
						charIndex++;
						
						// 每显示一些字符就滚动到底部
						if (charIndex % 5 === 0) {
							self.$nextTick(() => {
								self.scrollToBottom();
							});
						}
					} else {
						// 完成打字
						clearInterval(self.typingTimer);
						self.typingTimer = null;
						// 确保最终显示完整文本
						self.$set(self.messages[messageIndex], 'displayText', fullText);
						self.$nextTick(() => {
							self.scrollToBottom();
						});
					}
				}, speed);
			});
		},
		deleteChat(chatId, index) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条对话记录吗？',
				success: (res) => {
					if (res.confirm) {
						// 如果删除的是当前对话，需要切换到其他对话
						if (this.currentChatId === chatId) {
							// 如果还有其他对话，切换到第一个
							if (this.historyList.length > 1) {
								const remainingList = this.historyList.filter(item => item.id !== chatId);
								if (remainingList.length > 0) {
									this.selectChat(remainingList[0].id);
								} else {
									// 如果没有其他对话了，创建新对话
									this.createNewChat();
								}
							} else {
								// 如果只剩一条，创建新对话
								this.createNewChat();
							}
						}
						
						// 从历史记录中删除
						this.historyList = this.historyList.filter(item => item.id !== chatId);
						this.saveHistory();
						
						uni.showToast({
							title: '已删除',
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
.chat-container {
	display: flex;
	width: 100vw;
	height: 100vh;
	background: #f5f5f5;
}

/* 左侧边栏 */
.sidebar {
	width: 260rpx;
	background: #ffffff;
	border-right: 1rpx solid #e5e5e5;
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.sidebar-header {
	padding: 32rpx 20rpx 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-bottom: 1rpx solid #f0f0f0;
}

.logo {
	margin-bottom: 16rpx;
}

.logo-circle {
	width: 48rpx;
	height: 48rpx;
	border-radius: 8rpx;
	background: #ffffff;
	border: 2rpx solid #333333;
	color: #333333;
	font-size: 36rpx;
	font-weight: 300;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	font-family: Arial, sans-serif;
	line-height: 1;
}

.logo-circle::after {
	content: '';
	position: absolute;
	width: 10rpx;
	height: 10rpx;
	background: #333333;
	border-radius: 2rpx;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.sidebar-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #333333;
	text-align: center;
	margin-top: 12rpx;
}

.new-chat-btn {
	margin: 20rpx 16rpx;
	padding: 18rpx;
	background: #ff6b9d;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
}

.new-chat-icon {
	font-size: 28rpx;
	color: #ffffff;
	font-weight: bold;
	line-height: 1;
}

.new-chat-text {
	font-size: 26rpx;
	color: #ffffff;
	font-weight: 500;
}

.history-section {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 0 20rpx;
}

.history-title {
	font-size: 24rpx;
	color: #666666;
	margin-bottom: 16rpx;
	font-weight: 600;
}

.history-list {
	flex: 1;
}

.history-item-wrapper {
	position: relative;
	margin-bottom: 6rpx;
	display: flex;
	align-items: center;
}

.history-item-wrapper.active .history-item {
	background: #ff6b9d;
	color: #ffffff;
}

.history-item {
	flex: 1;
	padding: 18rpx 16rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	color: #333333;
	background: #f8f8f8;
	transition: all 0.3s;
	line-height: 1.4;
}

.delete-btn {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 8rpx;
	border-radius: 50%;
	background: rgba(255, 107, 157, 0.1);
	transition: all 0.3s;
	opacity: 0.6;
}

.delete-btn:active {
	background: rgba(255, 107, 157, 0.2);
	opacity: 1;
	transform: scale(0.95);
}

.delete-icon {
	font-size: 32rpx;
	color: #ff6b9d;
	font-weight: bold;
	line-height: 1;
}

.history-item-wrapper.active .delete-btn {
	background: rgba(255, 255, 255, 0.2);
}

.history-item-wrapper.active .delete-icon {
	color: #ffffff;
}

.history-tip {
	font-size: 20rpx;
	color: #999999;
	margin-top: 16rpx;
	padding-bottom: 20rpx;
}

/* 右侧主内容区 */
.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	background: #ffffff;
}

.content-header {
	padding: 24rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #f0f0f0;
	background: #ffffff;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}

.header-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
	flex: 1;
	min-width: 0;
}

.back-home-btn {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 10rpx 18rpx;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border: 1rpx solid #e5e7eb;
	transition: all 0.3s ease;
	flex-shrink: 0;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.04);
}

.back-home-btn:active {
	background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
	transform: scale(0.96);
	box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.06);
}

.back-icon-wrapper {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ffffff;
	border-radius: 50%;
	box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

.back-icon {
	font-size: 32rpx;
	color: #2563eb;
	font-weight: bold;
	line-height: 1;
	margin-top: -2rpx;
}

.back-text {
	font-size: 28rpx;
	color: #374151;
	font-weight: 500;
	letter-spacing: 0.5rpx;
}

.title-wrapper {
	flex: 1;
	min-width: 0;
	overflow: hidden;
}

.content-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #111827;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	letter-spacing: -0.3rpx;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 20rpx;
	flex-shrink: 0;
}

.action-text {
	font-size: 24rpx;
	color: #6b7280;
	background: #f3f4f6;
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
}

.action-icon-wrapper {
	width: 44rpx;
	height: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #f3f4f6;
	transition: all 0.2s ease;
}

.action-icon-wrapper:active {
	background: #e5e7eb;
	transform: scale(0.95);
}

.action-icon {
	font-size: 28rpx;
	color: #6b7280;
}

.chat-content {
	flex: 1;
	padding: 40rpx;
	overflow-y: auto;
}

/* 欢迎卡片 */
.welcome-card {
	background: #ffffff;
	border-radius: 24rpx;
	padding: 48rpx 40rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 40rpx;
}

.welcome-title {
	margin-bottom: 24rpx;
}

.title-text {
	font-size: 36rpx;
	font-weight: 700;
	color: #333333;
	display: block;
	margin-bottom: 8rpx;
}

.title-underline {
	width: 120rpx;
	height: 4rpx;
	background: #ffd700;
	border-radius: 2rpx;
	margin-top: 8rpx;
}

.welcome-desc {
	font-size: 28rpx;
	color: #666666;
	line-height: 44rpx;
	margin-bottom: 32rpx;
	display: block;
}

.function-buttons {
	display: flex;
	gap: 16rpx;
	margin-bottom: 32rpx;
}

.func-btn {
	padding: 16rpx 32rpx;
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #666666;
	background: #f5f5f5;
	transition: all 0.3s;
}

.func-btn.active {
	background: #4a90e2;
	color: #ffffff;
}

.suggested-questions {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.question-chip {
	padding: 20rpx 32rpx;
	background: #f8f8f8;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #333333;
	border: 1rpx solid #e5e5e5;
	transition: all 0.3s;
}

.question-chip:active {
	background: #eeeeee;
	transform: scale(0.98);
}

/* 消息列表 */
.messages-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.message-item {
	display: flex;
	width: 100%;
}

.message-item.user {
	justify-content: flex-end;
}

.message-item.ai {
	justify-content: flex-start;
}

.message-bubble {
	max-width: 70%;
	padding: 24rpx 32rpx;
	border-radius: 16rpx;
	word-wrap: break-word;
}

.message-bubble.user {
	background: #ff6b9d;
	border-radius: 16rpx 16rpx 4rpx 16rpx;
}

.message-bubble.ai {
	background: #f5f5f5;
	border-radius: 16rpx 16rpx 16rpx 4rpx;
}

.message-text {
	font-size: 28rpx;
	line-height: 44rpx;
	color: #333333;
}

.message-bubble.user .message-text {
	color: #ffffff;
}

.typing-dots {
	display: flex;
	gap: 12rpx;
	padding: 8rpx 0;
}

.dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background: #999999;
	animation: blink 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
	animation-delay: 0.2s;
}

.dot:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes blink {
	0%, 80%, 100% {
		opacity: 0.3;
		transform: scale(0.8);
	}
	40% {
		opacity: 1;
		transform: scale(1);
	}
}

/* 输入框 */
.input-container {
	padding: 24rpx 40rpx;
	border-top: 1rpx solid #f0f0f0;
	display: flex;
	align-items: center;
	gap: 16rpx;
	background: #ffffff;
}

.chat-input {
	flex: 1;
	height: 80rpx;
	padding: 0 24rpx;
	background: #f5f5f5;
	border-radius: 40rpx;
	font-size: 28rpx;
	color: #333333;
}

.send-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #ff6b9d;
	display: flex;
	align-items: center;
	justify-content: center;
}

.send-icon {
	font-size: 36rpx;
	color: #ffffff;
}
</style>

