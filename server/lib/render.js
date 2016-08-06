'use strict';

const views = require('co-views');

/**
 * 这里开发环境使用dev目录开发，发布环境使用pages模板，区分开发和上线目录
 * @param  {[type]} ctx  [description]
 * @param  {[type]} path [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const render = function(ctx, path, data) {
	let tplPath;
	// 如果是本地则使用dev环境目录，否则使用page的构建目录
	if (ctx.hostname === '127.0.0.1' || ctx.hostname === 'localhost') {
		tplPath = '/../dev/';
	} else {
		tplPath = '/../pages';
	}

	return views(__dirname + tplPath, {
		map: {
			html: 'swig'
		}
	})(path, data);
}

module.exports = render;