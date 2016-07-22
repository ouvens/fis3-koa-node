/**
 * nodejs端web开发常见工具类
 */

'use strict';

let debug = {};

debug.log = function(ctx, log) {
	let logType = typeof log;
	log = logType === 'object' ? JSON.stringify(log) : log;
	ctx.body = (ctx.body || '') + log;
	// ctx.body += '<script>console.log(' + log + ');<script>';
}

module.exports = debug;