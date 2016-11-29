'use strict';

const DB = require('./db.class');

/**
 * {
 * 	deviceid: string,	//设备识别码token
 * 	devicename: string,	//设备名称
 * 	type: string,		//设备类型
 * 	userid: number,		//添加设备的用户
 * }
 * @type {DB}
 */
const device = new DB('device');

module.exports = device;