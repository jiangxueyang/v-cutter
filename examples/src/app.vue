<template>
	<div class="app">
		<cutter :imageSrc="imageSrc"></cutter>
	</div>
</template>
<script>
export default {
    data(){
        return {
            imageSrc: require('examples/src/assets/images/bg.jpeg')
        }
    }
}
</script>
