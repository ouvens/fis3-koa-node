const coRequest = require("co-request");
const util = require('./util');

const request = function(data) {
	// 默认在请求url后面添加_platform参数和__version参数
	const querystring = util.string.json2str(util.extend({
		_platform: 'pc',
		_version: '1.0.0'
	}, util.string.str2json(data.url)));
	data.url = data.url.split('?')[0] + '?' + querystring;
	return coRequest(data);
}

module.exports = request;