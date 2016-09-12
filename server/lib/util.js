/**
 * filename: util.js
 * author: ouvenzhang
 * description: 提供常见的的工具函数集，主要包含:
 *     getDay()：获取中文星期数
 *     formatTime()：获取格式化后的时间
 *     ...
 */

'use strict';

let emptyObject = {};
let noop = function() {};

let util = {
	time: emptyObject,
	session: emptyObject,
	cookie: emptyObject,
	html: emptyObject,
	string: emptyObject,
	extend: _extend
}

/**
 * util.time.format('yyyy-mm-dd hh-ii-ss', +new Date());
 * @type {[type]}
 * 传入时间戳或时间字符串，获取时间格式含有各种方式，根据yy、mm、dd、hh、ii、ss来替换匹配
 */
util.time.format = _format;

/**
 * util.time.getDay(+new Date());
 * @type {[type]}
 * 获取星期值
 */
util.time.getDay = _getDay;

util.html.htmlEncode = _htmlEncode;
util.html.htmlDecode = _htmlDecode;
util.html.toRaw = _toRaw;

util.string.json2str = _json2str;
util.string.str2json = _str2json;

function _format(format, timestamp) {

	timestamp = timestamp < 14600000000 ? new Date(timestamp * 1000) : new Date(timestamp);

	let year = timestamp.getFullYear(); //获取完整的年份(4位,1970)
	let month = timestamp.getMonth() + 1 < 10 ? '0' + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1; //获取月份(0-11,0代表1月,用的时候记得加上1)
	let date = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(); //获取日(1-31)

	let hour = timestamp.getHours() < 10 ? '0' + timestamp.getHours() : timestamp.getHours(); //获取小时数(0-23)
	let minite = timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes(); //获取分钟数(0-59)
	let second = timestamp.getSeconds() < 10 ? '0' + timestamp.getSeconds() : timestamp.getSeconds(); //获取秒数(0-59)

	return format.replace(/y+/ig, year).replace(/m+/ig, month).replace(/d+/ig, date).replace(/h+/ig, hour).replace(/i+/ig, minite).replace(/s+/ig, second);
}

/**
 * 获取星期
 * @param  {[type]} timestamp [输入的时间戳]
 * @return {[type]}           [返回星期中文表示]
 */
function _getDay(timestamp) {
	const Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
	return Day[timestamp.getDay()];

}

function _htmlEncode(str) {
	let s = "";
	if (str.length == 0) return "";
	s = str.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/\'/g, "&#39;");
	s = s.replace(/\"/g, "&quot;");
	s = s.replace(/\n/g, "<br>");
	return s;
}

function _htmlDecode(str) {
	let s = "";
	if (str.length == 0) return "";
	s = str.replace(/&amp;/g, "&");
	s = s.replace(/&lt;/g, "<");
	s = s.replace(/&gt;/g, ">");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/&#39;/g, "\'");
	s = s.replace(/&quot;/g, "\"");
	s = s.replace(/<br>/g, "\n");
	return s;
}

function _toRaw(str) {
	return str.replace(/\<.+?\s*\/\>/gi, '');
}

function _json2str(json) {
	let arr = [];
	for (let key in json) {
		arr.push(key + '=' + json[key]);
	}
	return arr.join('&');
}

function _str2json(string) {
	let url = string; //获取url中"?"符后的字串
	let obj = {};
	let str;
	if (url && url.indexOf("?") != -1) {
		str = url.split('?')[1];
	}
	if (str) {
		let strs = str.split("&");
		for (let i = 0; i < strs.length; i++) {
			obj[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
		return obj;
	} else {
		return {}
	}
}

function _extend(oldObject, object) {
	for (let item in object) {
		oldObject[item] = object[item];
	}
	return oldObject;
}
module.exports = util;