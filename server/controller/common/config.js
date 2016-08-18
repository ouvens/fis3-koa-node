'use strict';

const jsSHA = require('jssha');
const coRequest = require("co-request");

const APP_ID = 'wx80792921613f141d';
const SECRET = 'c053bd3e1d2bb098f3ce46e2c4552698';

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

/**
 * 获取新API域名地址路径
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
const getPath = function(ctx) {
	let path;
	return 'http://' + ctx.host;
};

const minifyConfig = {
	minifyJS: true,
	minifyURLs: true,
	minifyCSS: true,
	removeAttributeQuotes: false,
	removeComments: true,
	sortClassName: true,
	removeTagWhitespace: true,
	collapseInlineTagWhitespace: true,
	collapseWhitespace: true, //
	preserveLineBreaks: false, //压缩成一行，需要collapseWhitespace=true时生效
};

module.exports = {
	getPath: getPath,
	getWxJsConfig: getWxJsConfig,
	minifyConfig: minifyConfig
}