'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const coRequest = require("co-request");
const session = require('koa-session-redis3');
const util = require('../lib/util');

const render = require('../lib/render');
const config = require('./common/config');

const userApi = require('./api/user');
const orgApi = require('./api/organization');
const actApi = require('./api/activity');
const statusApi = require('./api/status');



module.exports = {
	userAuth: userApi.userAuth,
	userLogout: userApi.userLogout
}