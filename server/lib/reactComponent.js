'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');

/**
 * 根据开发或正式环境读取不同目录先的jsx组件，并将中划线命名的组件名转为驼峰命名，这里命名很重要
 * @param  {[type]} ctx        [当前运行环境，用于判断使用开发环境路径还是线上环境路径]
 * @param  {[type]} components [接受组件名和数据的对象]
 * @return {[type]}            [description]
 */
const render = function(ctx, component) {
	let componentObject = {},
		jsxPath;
	// 如果是本地则使用dev环境目录，否则使用page的构建目录
	if (ctx.hostname === '127.0.0.1' || ctx.hostname === 'localhost') {
		jsxPath = '../dev/component/';
	} else {
		jsxPath = '../pages/component/';
	}

	let render;
	try {
		for (let name in components) {
			let camelName = toCamelCase(name);
			render = React.createFactory(require(jsxPath + name + '/main.jsx'));
			componentObject[camelName] = ReactDOMServer.renderToString(render(components[name]));
			//React.createFactory(require('../dev/component/react/' + component + '/main.jsx'))
		}
	} catch (e) {
		console.log(e);
	}
	return componentObject;
};


/**
 * 根据开发或正式环境读取不同目录先的jsx组件，并将中划线命名的组件名转为驼峰命名，这里命名很重要
 * @param  {[type]} ctx        [当前运行环境，用于判断使用开发环境路径还是线上环境路径]
 * @param  {[type]} componentPath [接受组件路径名]
 * @param  {[type]} props 	   [组件接受的数据]
 * @return {[type]}            [description]
 */
const renderPath = function(ctx, componentPath, props) {
	let componentFactory,
		jsxPath;
	// 如果是本地则使用dev环境目录，否则使用page的构建目录
	if (ctx.hostname === '127.0.0.1' || ctx.hostname === 'localhost') {
		jsxPath = '../dev/component/';
	} else {
		jsxPath = '../pages/component/';
	}

	componentFactory = React.createFactory(require(jsxPath + componentPath));

	// renderToStaticMarkup不会避免前端重渲染
	// renderToString会避免前端重渲染
	return ReactDOMServer.renderToString(componentFactory(props));

	// let render;

	// try {
	// 	for (let name in components) {
	// 		let camelName = toCamelCase(name);
	// 		render = React.createFactory(require(jsxPath + name + '/main.jsx'));
	// 		componentObject[camelName] = ReactDOMServer.renderToString(render(components[name]));
	// 		//React.createFactory(require('../dev/component/react/' + component + '/main.jsx'))
	// 	}
	// } catch (e) {
	// 	console.log(e);
	// }
	// return componentObject;
};

/**
 * 将中划线命名转为驼峰形式命名
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
function toCamelCase(string) {
	let reg = /-(\w)/g; //通过正则找到-b  -c。默认的是匹配一次，所以要用g来全局匹配。\w指的字符。找一个-找一个字符。replace替换就是B替换-b   C替换-c。 $0代表正则，$1代表指向
	return string.replace(reg, function($0, $1) {
		return $1.toUpperCase();
	});
}

module.exports = {
	render: render,
	renderPath: renderPath
}