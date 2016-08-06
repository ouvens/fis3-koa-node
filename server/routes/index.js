'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const api = require('../controller/api');
const page = require('../controller/page');
const router = require('koa-router')();

// 默认跳转登录页或404页面
router.get('/*', page.login); //用户登陆页

// 同构样例地址，使用r=1区分前后台渲染
router.get('/org_rank.html', page.orgRank);
router.get('/org_detail.html', page.orgDetail);

router.get('/react.html', page.react);

router.post('/api/v1/user/auth', api.userAuth); // 用户登录接口
router.get('/api/v1/user/logout', api.userLogout); // 用户退出登录接口

module.exports = router;