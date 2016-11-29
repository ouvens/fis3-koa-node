'use strict';

const DB = require('./db.class');

/**
 * {
 * 	userid: string, //用户id
 * username: string, //用户姓名
 * 	pwd: string,	//用户密码token
 * 	type: number,	//用户类型，0为管理员，1为普通用户
 * 	collect: array,	//用户收藏的错误单列表记录report错误id即可
 * 	time: timestamp,//注册时间
 * }
 * @type {DB}
 */
const user = new DB('user');

module.exports = user;