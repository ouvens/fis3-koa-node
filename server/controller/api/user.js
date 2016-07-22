'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const coRequest = require("co-request");
const session = require('koa-session-redis3');

const util = require('../../lib/util');

const render = require('../../lib/render');
const config = require('../common/config');

/**
 * 用户登录
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const userAuth = function*(req, res) {
	let ctx = this;
	let path = config.getPath(ctx);
	let loginObj, userInfo;
	let domain = config.getDomain(ctx);
	let oAuthHeader = config.getAuthHeader(ctx);

	ctx.request.body['platform'] = config.AppConfig.platform;
	ctx.request.body['client_key'] = config.AppConfig.client_key;
	ctx.request.body['device_id'] = config.AppConfig.device_id;

	try {
		loginObj = yield coRequest({
			url: path + '/auth/login',
			method: 'post',
			form: ctx.request.body
		});

		loginObj = JSON.parse(loginObj.body);

		/*调用轻社团登录的接口,在浏览器里设置相应的cookie,并且在session中记录这个cookie*/
		let orgLogin = yield coRequest({
			url: path + '/organization/login',
			method: 'post',
			form: {
				username: ctx.request.body.username,
				password: ctx.request.body.originPassword
			}
		});

		if (orgLogin.headers['set-cookie']) {
			ctx.session['phpCookie'] = ctx.session['phpCookie'] || [];
			orgLogin.headers['set-cookie'].forEach(function(text) {
				ctx.session['phpCookie'].push(text.split(';')[0]);
				ctx.cookies.set(text.split(';')[0].split('=')[0], text.split(';')[0].split('=')[1], {
					domain: ctx.hostname,
					path: '/'
				});
			})
		}

		if (loginObj.mid) {

			for (let item in loginObj) {
				ctx.session[item] = loginObj[item];
			}

			userInfo = yield coRequest({
				url: path + '/v1/members/' + ctx.session.mid + '?embed=school',
				method: 'get',
				headers: oAuthHeader
			});

			userInfo = JSON.parse(userInfo.body);
			ctx.session['userInfo'] = userInfo;
			ctx.cookies.set('uin', userInfo['id'], {
				domain: domain,
				path: '/'
			});
			ctx.cookies.set('mobile', userInfo['mobile'], {
				domain: domain,
				path: '/'
			});


			ctx.body = userInfo;
		} else {
			ctx.body = {
				code: 500,
				error: '用户名或密码错误'
			}

		}
	} catch (e) {
		console.log(e);
		ctx.body = {
			code: 500,
			error: '服务器请求错误'
		}
	}
}

/**
 * 用户登录
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const userLogout = function*(req, res) {
	let ctx = this;
	let path = config.getPath(ctx);
	let domain = config.getDomain(ctx);

	try {

		ctx.cookies.set('uin', '', {
			domain: domain,
			path: '/'
		});

		ctx.session = null;

		ctx.body = {
			code: 200,
			error: 'success'
		}

	} catch (e) {
		ctx.body = {
			code: 500,
			error: '服务器请求错误'
		}
	}
}

module.exports = {
	userAuth: userAuth,
	userLogout: userLogout,
	userCity: userCity,
	userSchool: userSchool,
	userInfo: userInfo,
	loginCallback: loginCallback,
	userEnroll: userEnroll
}