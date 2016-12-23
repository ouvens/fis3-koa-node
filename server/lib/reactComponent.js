'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');

/**
 * 根据开发或正式环境读取不同目录先的jsx组件
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

	/**
	 * renderToStaticMarkup不会避免前端重渲染
	 * renderToString会避免前端重渲染
	 */
	return ReactDOMServer.renderToString(componentFactory(props));
};

module.exports = {
	renderPath: renderPath
}