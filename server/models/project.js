'use strict';

const DB = require('./db.class');

/**
 * {
 * 	id: number,   			//项目id,业务id
 * 	name: string,			//项目名称
 * 	userid: string,			//用户id
 * 	uri: string,			//页面地址或page地址
 * 	time: timestamp,		//添加时间
 * 	version: string,		//版本号
 * 	form: string,			//上报平台
 * 	type: string,			//上报类型
 * 	token: string,			//避免重复提交标识
 * 	domain: string,			//上报域名限制
 * }
 * @type {DB}
 */
const user = new DB('project');

module.exports = user;