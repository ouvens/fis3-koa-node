'use strict';

const DB = require('./db.class');

/**
 * {
 * 	userAgent: string,	//用户代理浏览器为browser，Android app为android，ios app为ios，服务端为server
 * 	id: number,			//业务id
 * 	uin: string,		//上报错误用户id
 * 	device: string,   	//设备号或userAgent平台类型
 * 	domain: string,		//域名限制
 * 	from: string,		//上报错误的页面地址
 * 	url: string,		//上报错误的js文件地址
 * 	ip: string,			//用户ip
 * 	msg: string,		//上报错误信息
 * 	network: string,	//用户网络类型，2G,3G,4G或wifi
 * 	type: string,		//上报类型，bad为错误量上报，statis为统计量上报，speed为测速上报
 * 	row: number,		//上报行
 * 	col: number,		//上报列
 * 	level: number, 		//错误等级
 * 	time: timestamp,	//错误时间
 * 	count: count,		//页面错误数量
 *  version: string,	//版本号
 * 	ext: json			//其它信息
 * }
 * @type {DB}
 */

const report = new DB('report');

module.exports = report;