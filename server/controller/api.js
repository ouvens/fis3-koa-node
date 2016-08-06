'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const userApi = require('./api/user');

module.exports = {
	userAuth: userApi.userAuth,
	userLogout: userApi.userLogout
}