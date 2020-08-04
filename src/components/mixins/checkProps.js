export default {
	methods: {
		checkProps() {
			return new Promise((resolve, reject) => {
                let remErrorTip = this.transferRemToPx()
                if (!this.isEmpty(remErrorTip)) {
					return reject(remErrorTip)
				}
                let cutterSizeErrorTip = this.checkCutterSize()
				if (!this.isEmpty(cutterSizeErrorTip)) {
					return reject(cutterSizeErrorTip)
                }
                resolve()
			})
        },
        transferRemToPx(){
            let {useRem, minCutWidth, minCutHeight, cutterWidth, cutterHeight, wrapHeight} = this
            let checkList = {minCutWidth, minCutHeight, cutterWidth, cutterHeight}
            let errorTip = ''
            for(let key in checkList) {
                let value = checkList[key]
                if (useRem) {
                    if (this.isRem(value)) {
                        this[`${key}Px`] = parseFloat(value) * this.remToPx
                    } else {
                        errorTip = `The value of${key} must be rem unit.`
                        break
                    }
                } else {
                    if (this.isPx(value)) {
                        this[`${key}Px`] = parseFloat(value)
                    } else {
                        errorTip = `The value of ${key} must be px unit.`
                        break
                    }
                }
            }
            if (this.isRem(wrapHeight)) {
                this.wrapHeightPx = parseFloat(wrapHeight) * this.remToPx
            } else if (this.isPx(wrapHeight)) {
                this.wrapHeightPx = parseFloat(wrapHeight)
            } else {
                errorTip = 'The value of wrapHeight must be rem or px unit.'
            }
            return errorTip
        },
        checkCutterSize(){
            let {minCutHeightPx, minCutWidthPx, cutterHeightPx, cutterWidthPx} =this
            let checkList = {minCutHeightPx, minCutWidthPx, cutterHeightPx, cutterWidthPx}
            let errorTip = ''
            for (let i in checkList) {
                let value = checkList[i]
                if (value < 1) {
                    errorTip = `The value of ${value} must be bigger than or equal to 1.`
                    break
                }
            }
            if (cutterHeightPx < minCutHeightPx) {
                errorTip = `The value of cutterHeight must be bigger than or equal to the value of minCutHeight.`
            }
            if (cutterWidthPx < minCutWidthPx) {
                errorTip = `The value of cutterWidth must be bigger than or equal to the value of minCutWidth.`
            }
            return errorTip
        }
	}
}
