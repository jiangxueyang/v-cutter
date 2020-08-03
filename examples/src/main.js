import Vue from 'vue'
import app from './app.vue'
import Cutter from 'main/index.js'
Vue.config.productionTip = false
Vue.use(Cutter)
new Vue({
	render: (h) => h(app),
}).$mount('#app')
