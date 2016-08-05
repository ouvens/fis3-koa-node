'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const render = require('../lib/render');
const util = require('../lib/util');
const md5 = require('../lib/md5');
const coRequest = require('co-request');
const config = require('./common/config');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');


/**
 * 用户登录页面
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const login = function*(req, res) {
	const ctx = this;
	ctx.body = yield render(ctx, 'pages/user-login', {
		session: ctx.session
	});
}

const reactController = function*(req, res) {

	let ctx = this;
	var props = {
		name: 'ouvehzhang'
	}

	var component = React.createFactory(require('../dev/component/react/react-com/main.jsx'));


	ctx.body = ReactDOMServer.renderToString(component(props));
	// ctx.body = yield render(ctx, 'pages/react', {});
}

module.exports = {
	login: login,
	react: reactController
}