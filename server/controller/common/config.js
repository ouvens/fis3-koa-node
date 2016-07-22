'use strict';

const jsSHA = require('jssha');
const coRequest = require("co-request");

const APP_ID = 'wx80792921613f141d';
const SECRET = 'c053bd3e1d2bb098f3ce46e2c4552698';

// 改掉后需要去掉
const oAuthHeader = {
	Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjU3MjA3YzdmNzBlMWUifQ.eyJpc3MiOiJhcGkueGlhb2RhbzM2MC5jb20iLCJqdGkiOiI1NzIwN2M3ZjcwZTFlIiwiaWF0IjoxNDYxNzQ2ODE1LCJleHAiOjE0OTMyODI4MTUsIm1pZCI6OTU0ODMsInBsYXRmb3JtIjozLCJ0b2tlbl90eXBlIjoiQmVhcmVyIn0._DWpwiqvTbaYNhbGC4qQT_iIW63XR72OWY-iEPXNeSw'
};

/**
 * 获取公用的header信息
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
const getAuthHeader = function(ctx) {
	if (ctx.session['token_type'] && ctx.session['access_token']) {
		return {
			Authorization: ctx.session.token_type + ' ' + ctx.session.access_token
		}
	} else {
		return {
			Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjU3MjA3YzdmNzBlMWUifQ.eyJpc3MiOiJhcGkueGlhb2RhbzM2MC5jb20iLCJqdGkiOiI1NzIwN2M3ZjcwZTFlIiwiaWF0IjoxNDYxNzQ2ODE1LCJleHAiOjE0OTMyODI4MTUsIm1pZCI6OTU0ODMsInBsYXRmb3JtIjozLCJ0b2tlbl90eXBlIjoiQmVhcmVyIn0._DWpwiqvTbaYNhbGC4qQT_iIW63XR72OWY-iEPXNeSw'
		}
	}
}

/**
 * 获取微信分享签名api
 * @param {[type]} ctx           [description]
 * @yield {[type]} [description]
 */
const getWxJsConfig = function*(ctx) {

		let tokenRes, token, ticketRes, ticket, url, noncestr, appid, timestamp, signature, wxJsConfig;

		tokenRes = yield coRequest({
			url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APP_ID + '&secret=' + SECRET,
			method: 'get'
		});

		token = tokenRes.body && (JSON.parse(tokenRes.body)).access_token || '';

		ticketRes = yield coRequest({
			url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi',
			method: 'get'
		});

		ticket = ticketRes.body && JSON.parse(ticketRes.body).ticket || '';

		url = 'http://' + ctx.host + ctx.originalUrl;

		noncestr = _createNonceStr();
		timestamp = _createTimeStamp();
		signature = _calcSignature(ticket, noncestr, timestamp, url);

		wxJsConfig = {
			nonceStr: noncestr,
			appid: APP_ID,
			timestamp: timestamp,
			signature: signature,
			url: url
		};

		// 创建noncestr
		function _createNonceStr() {
			return Math.random().toString(36).substr(2, 15);
		};

		// 创建timestamp
		function _createTimeStamp() {
			return parseInt(new Date().getTime() / 1000) + '';
		}

		// 计算签名方法
		function _calcSignature(ticket, noncestr, ts, url) {
			var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + ts + '&url=' + url;
			let shaObj = new jsSHA('SHA-1', 'TEXT');
			shaObj.update(str);

			return shaObj.getHash('HEX');
		}

		return wxJsConfig;
	}
	//todo getOldPath

/**
 * 获取新API域名地址路径
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
const getPath = function(ctx) {
	let path;
	if (ctx.hostname === 'www.xiaodao360.com') {
		path = 'http://api.xiaodao360.com';
	} else {
		path = 'http://test.xiaodao360.cn';
	}
	return path;
};

/**
 * 旧接口域名地址
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
const getOldPath = function(ctx) {
	let path;
	if (ctx.hostname === 'm.xiaodao360.com') {
		path = 'http://www.xiaodao360.com';
	} else {
		path = 'http://test.xiaodao360.cn';
	}
	return path;
};
/**
 * 获取cookie域名
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
const getDomain = function(ctx) {
	let domain;
	if (ctx.hostname !== 'm.xiaodao360.com') {
		domain = 'xiaodao360.cn';
	} else {
		domain = 'xiaodao360.com';
	}
	return domain;
};

/**
 * 获取APP应用申请的配置
 * @type {Object}
 */
const AppConfig = {
	'platform': 3,
	'client_key': '241eee72f987526954281241bbeb7c39',
	'device_id': 'node'
};

/**
 * 选择要在php站点中登录的轻社团
 * @param {[object]} ctx           [description]
 * @param {[string]} oid           轻社团id
 * @yield {[type]} [description]
 */
const chooseOrg = function*(ctx, oid) {
	let chooseOrg = coRequest({
		url: 'http://' + ctx.hostname + '/organization/choose_org',
		method: 'post',
		form: {
			oid: oid
		},
		headers: {
			'Cookie': ctx.session['phpCookie'].join(';').trim(),
		}
	});
	return chooseOrg;
}

module.exports = {
	oAuthHeader: oAuthHeader,
	getWxJsConfig: getWxJsConfig,
	getPath: getPath,
	AppConfig: AppConfig,
	getDomain: getDomain,
	getAuthHeader: getAuthHeader,
	chooseOrg: chooseOrg,
	getOldPath: getOldPath
}