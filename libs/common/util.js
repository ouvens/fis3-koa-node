/**
 * nodejs端web开发常见工具类
 */

'use strict';

var emptyObject = {};
var noop = function() {};

var util = {
	time: emptyObject,
	session: emptyObject,
	cookie: emptyObject,
	html: emptyObject,
	string: emptyObject,
	array: emptyObject,
	url: emptyObject
}

/**
 * util.time.format('yyyy-mm-dd hh-ii-ss', +new Date());
 * @type {[type]}
 * 传入时间戳或时间字符串，获取时间格式含有各种方式，根据yy、mm、dd、hh、ii、ss来替换匹配
 */
util.time.format = format;

/**
 * util.time.getDay(+new Date());
 * @type {[type]}
 * 获取星期值
 */
util.time.getDay = getDay;

util.html.htmlEncode = htmlEncode;
util.html.htmlDecode = htmlDecode;
util.html.toRaw = toRaw;

util.string.json2str = json2str;

util.array.inArray = inArray;
util.array.removeFromArray = removeFromArray;

util.url.getUrlParam = getUrlParam;

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
};

function format(format, timestamp) {

	timestamp = new Date(timestamp);

	var year = timestamp.getFullYear(); //获取完整的年份(4位,1970)
	var month = timestamp.getMonth() + 1 < 10 ? '0' + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1; //获取月份(0-11,0代表1月,用的时候记得加上1)
	var date = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(); //获取日(1-31)

	var hour = timestamp.getHours() < 10 ? '0' + timestamp.getHours() : timestamp.getHours(); //获取小时数(0-23)
	var minite = timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes(); //获取分钟数(0-59)
	var second = timestamp.getSeconds() < 10 ? '0' + timestamp.getSeconds() : timestamp.getSeconds(); //获取秒数(0-59)

	return format.replace(/y+/ig, year).replace(/m+/ig, month).replace(/d+/ig, date).replace(/h+/ig, hour).replace(/i+/ig, minite).replace(/s+/ig, second);
}

function formatCommentTime(t) {
	var now = parseInt(new Date().getTime() / 1000);
	if (now - t < 60) {
		s = '刚刚';
	} else if (now - t < 3600) {
		s = parseInt((now - t) / 60) + '分钟前';
	} else {
		var now = XMUtl.formatTS(new Date().getTime() / 1000);
		var des = XMUtl.formatTS(t);
		if (now[0] == des[0] && now[1] == des[1]) {
			if (now[2] == des[2]) {
				s = (now[3] - des[3]) + '小时前';
			} else if (now[2] - des[2] == 1) {
				s = '昨日 ' + des[3] + ':' + des[4];
			} else if (now[2] - des[2] == 2) {
				s = '前日 ' + des[3] + ':' + des[4];
			} else {
				s = des[0] + '-' + des[1] + '-' + des[2] + ' ' + des[3] + ':' + des[4];
			}
		} else {
			s = des[0] + '-' + des[1] + '-' + des[2] + ' ' + des[3] + ':' + des[4];
		}
	}
	return s;
}

function getDay(timestamp) {
	var Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
	return Day[timestamp.getDay()];

}

function htmlEncode(str) {
	var s = "";
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

function htmlDecode(str) {
	var s = "";
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

function toRaw(str) {
	return str.replace(/\<.+?\s*\/\>/gi, '');
}

function json2str(json) {
	var arr = [];
	for (var key in json) {
		arr.push(key + '=' + json[key]);
	}
	return arr.join('&');
}

function inArray(item, array) {
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === item) {
			return true;
		}
		return false;
	}
}

function removeFromArray(item, array) {
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === item) {
			array.splice(i, 1);
			break;
		}
	}
	return array;
}

module.exports = util;