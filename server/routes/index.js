'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const api = require('../controller/api');
const user = require('../controller/user');
const router = require('koa-router')();

router.get('/user_login.html', user.login); //用户登陆页
router.get('/react.html', user.react);

router.post('/api/v1/user/auth', api.userAuth); // 用户登录接口
router.get('/api/v1/user/logout', api.userLogout); // 用户退出登录接口

module.exports = router;