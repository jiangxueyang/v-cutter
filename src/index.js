import Cutter from './components/cutter'
import 'regenerator-runtime/runtime'
Cutter.install = function(Vue) {
	Vue.component(Cutter.name, Cutter)
}
export default Cutter