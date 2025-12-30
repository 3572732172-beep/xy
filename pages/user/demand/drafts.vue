<template>
	<view class="container" :class="{ 'large-font': largeFontMode }">
		<view class="draft-list">
			<view 
				class="draft-item" 
				v-for="draft in draftList" 
				:key="draft.offline_local_id"
				@click="editDraft(draft)"
			>
				<view class="draft-header">
					<text class="draft-title">{{ draft.title || '未命名需求' }}</text>
					<text class="draft-time">{{ formatTime(draft.updated_at) }}</text>
				</view>
				<view class="draft-info">
					<text class="draft-scene">{{ getSceneText(draft.service_type) }}</text>
					<text class="draft-address" v-if="draft.address">{{ draft.address }}</text>
				</view>
				<view class="draft-actions">
					<button class="btn btn-small" @click.stop="deleteDraft(draft)">删除</button>
					<button class="btn btn-small btn-primary" @click.stop="editDraft(draft)">编辑</button>
				</view>
			</view>
		</view>
		
		<view class="empty" v-if="draftList.length === 0">
			<text>暂无草稿</text>
		</view>
	</view>
</template>

<script>
import offline from '@/utils/offline.js';
import userStore from '@/store/user.js';

export default {
	data() {
		return {
			draftList: [],
			largeFontMode: false
		};
	},
	onLoad() {
		this.largeFontMode = userStore.state.largeFontMode;
		this.loadDrafts();
	},
	onShow() {
		// 每次显示时刷新列表
		this.loadDrafts();
	},
	methods: {
		/**
		 * 加载草稿列表
		 */
		loadDrafts() {
			this.draftList = offline.draftDemand.getAll();
		},
		
		/**
		 * 获取场景文本
		 */
		getSceneText(sceneType) {
			const sceneMap = {
				1: '生活用电',
				2: '养殖棚',
				3: '加工配套',
				4: '其他'
			};
			return sceneMap[sceneType] || '未知';
		},
		
		/**
		 * 格式化时间
		 */
		formatTime(timestamp) {
			if (!timestamp) return '';
			const date = new Date(timestamp);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hour = String(date.getHours()).padStart(2, '0');
			const minute = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hour}:${minute}`;
		},
		
		/**
		 * 编辑草稿
		 */
		editDraft(draft) {
			uni.navigateTo({
				url: `/pages/user/demand/create?draftId=${draft.offline_local_id}`
			});
		},
		
		/**
		 * 删除草稿
		 */
		deleteDraft(draft) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除此草稿吗？',
				success: (res) => {
					if (res.confirm) {
						offline.draftDemand.remove(draft.offline_local_id);
						offline.syncQueue.remove(draft.offline_local_id);
						this.loadDrafts();
						
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
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding: 20rpx;
}

.draft-list {
	
}

.draft-item {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.draft-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.draft-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
}

.draft-time {
	font-size: 24rpx;
	color: #999;
}

.draft-info {
	margin-bottom: 20rpx;
}

.draft-scene {
	font-size: 28rpx;
	color: #2F85FC;
	margin-right: 20rpx;
}

.draft-address {
	font-size: 28rpx;
	color: #666;
}

.draft-actions {
	display: flex;
	gap: 20rpx;
	justify-content: flex-end;
}

.btn-small {
	padding: 10rpx 30rpx;
	font-size: 28rpx;
	border-radius: 8rpx;
	border: 2rpx solid #e0e0e0;
	background-color: #fff;
	color: #666;
}

.btn-small.btn-primary {
	background-color: #2F85FC;
	color: #fff;
	border-color: #2F85FC;
}

.empty {
	text-align: center;
	padding: 100rpx 0;
	font-size: 28rpx;
	color: #999;
}
</style>

