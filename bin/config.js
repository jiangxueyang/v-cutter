var path = require('path')
var fs = require('fs')
var nodeExternals = require('webpack-node-externals')
// var Components = require('../components.json');
var externals = {}
/* var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'));

 */
/* Object.keys(Components).forEach(function(key) {
  externals[`element-ui/packages/${key}`] = `element-ui/lib/${key}`;
}); */
/* 
externals['element-ui/src/locale'] = 'element-ui/lib/locale';
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/utils/${file}`] = `element-ui/lib/utils/${file}`;
});
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/mixins/${file}`] = `element-ui/lib/mixins/${file}`;
});
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/transitions/${file}`] = `element-ui/lib/transitions/${file}`;
}); */

externals = [
	Object.assign(
		{
			vue: 'vue',
		},
		externals
	),
	nodeExternals(),
]

exports.externals = externals

exports.alias = {
	main: path.resolve(__dirname, '../src'),
	examples: path.resolve(__dirname, '../examples'),
}

exports.vue = {
	root: 'Vue',
	commonjs: 'vue',
	commonjs2: 'vue',
	amd: 'vue'
}

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/
