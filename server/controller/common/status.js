'use strict';
const userDb = require('../../models/user');

const status = function(code, result) {
	switch (code) {
		case 404:
			return {
				code: 404,
				msg: '没有找到相关记录'
			};
		case 400:
			return {
				code: 400,
				msg: '没有相关的参数'
			};
		case 500:
			return {
				code: 500,
				msg: '服务器没有找到相关记录'
			};
			// 返回成功
		case 200:
			return {
				code: 200,
				result: result
			};
		default:
			return {
				code: 500,
				msg: '服务器返回错误'
			};
	}
};

const authCheck = function(ctx) {
	let uin = ctx.cookies.get('uin');
	let token = ctx.cookies.get('token');
	let login = 'login.html';
	let isLogin = login.indexOf(ctx.url) >= 0;

	if ((!uin || !token) && !isLogin) {
		ctx.response.redirect('login.html');
	}
}

module.exports = {
	status: status,
	authCheck: authCheck
}