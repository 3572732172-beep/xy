<template>
	<view class="container">
		<page-header
			title="师傅详情"
			subtitle="查看师傅信息与匹配需求"
			:showBack="true"
		/>

		<view class="card">
			<view class="row">
				<text class="label">师傅ID</text>
				<text class="value">{{ masterId || '未知' }}</text>
			</view>
			<view class="row">
				<text class="label">需求ID</text>
				<text class="value">{{ demandId || '未关联' }}</text>
			</view>
			<view class="tip">
				当前暂无详情接口，先占位避免跳转报错。
			</view>
		</view>
	</view>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue';

export default {
	components: { PageHeader },
	data() {
		return {
			masterId: null,
			demandId: null
		};
	},
	onLoad(options) {
		this.masterId = options.master_id || null;
		this.demandId = options.demand_id || null;
	},
	methods: {}
};
</script>

<style scoped>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding: 20rpx;
}

.card {
	margin-top: 20rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
}

.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12rpx 0;
}

.label {
	font-size: 28rpx;
	color: #666;
}

.value {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
}

.tip {
	margin-top: 20rpx;
	font-size: 26rpx;
	color: #999;
}
</style>



















