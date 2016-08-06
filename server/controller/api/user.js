'use strict';

/**
 * 用户登录模拟接口
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const userAuth = function*(req, res) {
	let ctx = this;
	try {
		ctx.body = {
			code: 200,
			result: {
				id: 10000,
				name: 'ouven'
			}
		}
	} catch (e) {
		ctx.body = {
			code: 500,
			error: '服务器请求错误'
		}
	}
}

/**
 * 用户登录模拟接口
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const userLogout = function*(req, res) {
	let ctx = this;

	try {
		ctx.body = {
			code: 200,
			result: {
				id: 10000,
				name: 'ouven'
			}
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
	userLogout: userLogout
}