<template>
	<div class="v-cutter" :style="{height: wrapHeight}">
		<div ref="container" class="v-cutter-container">
			<img class="v-cutter-img" ref="image" :src="imageSrc" :style="imgStyle" alt="">
			<div ref="leftMask" class="left-mask" :style="leftMaskStyle"></div>
			<div ref="rightMask" class="right-mask" :style="rightMaskStyle"></div>
			<div ref="topMask" class="top-mask" :style="topMaskStyle"></div>
			<div ref="bottomMask" class="bottom-mask" :style="bottomMaskStyle"></div>
			<div ref="cutterBox" class="cutter-box" :style="cutterBoxStyle">
				<span class="lt"></span>
				<span class="rt"></span>
				<span class="lb"></span>
				<span class="rb"></span>
			</div>
			<div v-if="rotatable" ref="rotate" class="rotate"></div>
		</div>
		<div class="v-cutter-setting">
			<span ref="cancel">取消</span>
			<span ref="restore" class="disabled">还原</span>
			<span ref="submit">完成</span>
		</div>
	</div>
</template>
<script>
import checkProps from './mixins/checkProps'
const windowH = window.innerHeight
export default {
	name: 'Cutter',
	moduleName: 'Cutter',
	mixins: [checkProps],
	props: {
		imageSrc: {
			type: String,
		},
		scalable: {
			type: Boolean,
			default: true,
		},
		zoomable: {
			type: Boolean,
			default: true,
		},
		rotatable: {
			type: Boolean,
			default: true,
		},
		restorale: {
			type: Boolean,
			default: true,
		},
		cutBoxResizable: {
			type: Boolean,
			default: true,
		},
		outputType: {
			type: String,
			default: 'png',
		},
		cutterWidth: {
			type: String,
			default: '6rem',
		},
		cutterHeight: {
			type: String,
			default: '6rem',
		},
		minCutWidth: {
			type: String,
			default: '0.32rem',
		},
		minCutHeight: {
			type: String,
			default: '0.32rem',
		},
		maxScaleRatio: {
			type: Number,
			default: 10,
		},
		maxZoomRatio: {
			type: Number,
			default: 0.1,
		},
		ratio: {
			type: Number,
			default: 1.2,
		},
		wrapHeight: {
			type: String,
			default: windowH + 'px',
		},
		useRem: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			originImgWidth: 0,
			originImgHeight: 0,
			remToPx: parseFloat(document.documentElement.style.fontSize),
			minCutWidthPx: 0,
			minCutHeightPx: 0,
			cutterHeightPx: 0,
			cutterWidthPx: 0,
			wrapHeightPx: 0,
			cutterLeft: 0,
            cutterTop: 0,
            bg: 'rgba(255, 255, 255, .2)',
			backgroundColor: 'transparent',
			imgLeft: 0,
			imgTop: 0,
			imgWidth: 0,
            imgHeight: 0,
		}
	},
	computed: {
		cutterBoxStyle() {
			let {cutterWidthPx, cutterHeightPx, cutterLeft, cutterTop} = this
			return {width: cutterWidthPx + 'px', height: cutterHeightPx + 'px', left: cutterLeft + 'px', top: cutterTop + 'px'}
		},
		leftMaskStyle() {
			let {backgroundColor, cutterLeft} = this
			return {width: cutterLeft + 'px', backgroundColor}
		},
		rightMaskStyle() {
			let {backgroundColor, cutterLeft, cutterWidthPx, containerWidth} = this
			return {width: containerWidth - cutterLeft - cutterWidthPx + 'px', backgroundColor}
		},
		bottomMaskStyle() {
			let {backgroundColor, cutterHeightPx, cutterWidthPx, containerHeight, cutterTop, cutterLeft} = this
			return {width: cutterWidthPx + 'px', backgroundColor, height: containerHeight - cutterTop - cutterHeightPx + 'px', left: cutterLeft + 'px'}
		},
		topMaskStyle() {
			let {backgroundColor, cutterWidthPx, cutterLeft, cutterTop} = this
			return {backgroundColor, left: cutterLeft + 'px', width: cutterWidthPx + 'px', height: cutterTop + 'px'}
		},
		imgStyle() {
			let {imgLeft, imgTop, imgWidth, imgHeight} = this
			return {top: imgTop + 'px', left: imgLeft + 'px', width: imgWidth + 'px', height: imgHeight + 'px'}
		},
	},
	methods: {
		isRem(val) {
			return /^\d+(\.\d+)*rem$/.test(val)
		},
		isPx(val) {
			return /^\d+(\.\d+)*px$/.test(val)
		},
		isEmpty(val) {
			return val === null || val === undefined || val === ''
		},
		toFixed(value, decimal = 2) {
			return parseFloat(value.toFixed(decimal))
		},
		init() {
			let {container} = this.$refs
			let containerHeight = container.offsetHeight
			let containerWidth = container.offsetWidth
			this.containerHeight = containerHeight
			this.containerWidth = containerWidth
			this.initMaskStyle()
			this.setImgStyle()
		},
		initMaskStyle() {
			let {cutterWidthPx, cutterHeightPx, containerHeight, containerWidth} = this
			let cutterLeft = this.toFixed((containerWidth - cutterWidthPx) / 2)
			let cutterTop = this.toFixed((containerHeight - cutterHeightPx) / 2)
			this.setMaskStyle({cutterLeft, cutterTop, cutterWidthPx, cutterHeightPx})
		},
		setMaskStyle({cutterLeft, cutterTop, cutterWidthPx, cutterHeightPx}) {
			this.cutterLeft = cutterLeft
			this.cutterTop = cutterTop
			this.cutterWidthPx = cutterWidthPx
			this.cutterHeightPx = cutterHeightPx
		},
		setImgStyle() {
			let {image} = this.$refs
			image.onload = () => {
				let originImgWidth = image.naturalWidth
				let originImgHeight = image.naturalHeight
				this.originImgWidth = originImgWidth
				this.originImgHeight = originImgHeight
				this.adjustImageSize()
				let {imgHeight, imgWidth, containerWidth, containerHeight} = this
				this.imgTop = this.toFixed((containerHeight - imgHeight) / 2)
				this.imgLeft = this.toFixed((containerWidth - imgWidth) / 2)
			}
		},
		adjustImageSize() {
			let {cutterWidthPx, cutterHeightPx, originImgWidth, originImgHeight} = this
			let imgRatio = originImgWidth / originImgHeight
			let cutterRatio = cutterWidthPx / cutterHeightPx
			let imgWidth = cutterWidthPx
			let imgHeight = cutterHeightPx
			if (imgRatio > cutterRatio) {
				imgWidth = imgHeight * imgRatio
			} else {
				imgHeight = imgWidth / imgRatio
			}
			this.imgHeight = this.toFixed(imgHeight)
			this.imgWidth = this.toFixed(imgWidth)
		},
	},
	async created() {
		await this.checkProps()
		this.$nextTick(() => {
			this.init()
		})
	},
}
</script>
<style lang="scss">
$settingHeight: 1rem;
.v-cutter {
	margin: 0;
	box-sizing: border-box;
	padding: 0 0 $settingHeight 0;
	position: relative;
	background: #000;
	.v-cutter-container {
		height: 100%;
		position: relative;
		overflow: hidden;
		.cutter-box,
		.left-mask,
		.right-mask,
		.bottom-mask,
		.top-mask,
		.v-cutter-img {
			position: absolute;
			transition: all 0.3s;
		}
		.v-cutter-img {
			max-width: none;
		}
		.left-mask {
			left: 0;
			height: 100%;
		}
		.right-mask {
			right: 0;
			height: 100%;
		}
		.bottom-mask {
			bottom: 0;
		}
		.top-mask {
			top: 0;
		}
		.cutter-box {
			box-sizing: border-box;
			border: 0.03rem solid #fff;
			span {
				position: absolute;
				display: block;
				border: 0.04rem solid #fff;
				height: 0.4rem;
				width: 0.4rem;
				&.lt {
					border-right: none;
					border-bottom: none;
					left: -0.06rem;
					top: -0.06rem;
				}
				&.rt {
					border-left: none;
					border-bottom: none;
					right: -0.06rem;
					top: -0.06rem;
				}
				&.lb {
					border-top: none;
					border-right: none;
					left: -0.06rem;
					bottom: -0.06rem;
				}
				&.rb {
					border-top: none;
					border-left: none;
					right: -0.06rem;
					bottom: -0.06rem;
				}
			}
		}
	}
	.v-cutter-setting {
		position: absolute;
		bottom: 0;
		width: 100%;
		color: #fff;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 0.3rem;
		line-height: $settingHeight;
		border-top: 0.02rem solid #4e4c4c;
		font-size: 0.28rem;
		span {
			&.disabled {
				color: rgba(255, 255, 255, 0.3);
			}
		}
	}
}
</style>