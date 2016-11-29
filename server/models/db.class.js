'use strict';

const connectName = 'localhost/datasite';
const dbconect = require('monk')(connectName);

/*
 * monk: 数据库操作promise样例
 * 数据协议操作遵循数据库格式规范，insert为插入，find为查询，update为全量更新，remove为删除
 * var promise = this.db.insert({});
 * promise.type;
 * promise.error(function(err){});
 * promise.on('error', function(err){});
 * promise.on('success', function(doc){});
 * promise.on('complete', function(err, doc){});
 * promise.success(function(doc){});
 */

/**
 * 这里是生成器建议只用function构造类，不用class，因为操作方法都是生成器
 * const DB = require('./db.class');
 * let report = new DB('report');
 * report.find({});
 * report.insert({});
 */
function DB(dbname) {
	/**
	 * 	获取数据库名称
	 * @type {[type]}
	 */
	this.db = dbconect.get(dbname);
	/**
	 * 数据库插入操作
	 * @param {[type]} obj           [description]
	 * @yield {[type]} [description]
	 */
	this.insert = function*(data) {
		let result = yield this.db.insert(data);
		return result;
	}

	/**
	 * 数据库查询操作
	 * @param {[type]} obj           [description]
	 * @yield {[type]} [description]
	 */

	this.find = function*(obj, query) {
		let result;
		if (query) {
			result = yield this.db.find(obj, query);
		} else {
			result = yield this.db.find(obj);
		}
		return result;
	}

	/**
	 * 数据库查询单个操作
	 * @param {[type]} obj           [description]
	 * @yield {[type]} [description]
	 */
	this.findOne = function*(condition) {
		let result = yield this.db.findOne(condition);
		return result;
	}

	/**
	 * 数据库更新操作
	 * @param {[type]} obj           [description]
	 * @yield {[type]} [description]
	 */
	this.update = function*(condition, data) {
		let result = yield this.db.update(condition, data);
		return result;
	}

	/**
	 * 数据库查找并更新操作
	 * @param {[type]} obj           [description]
	 * @yield {[type]} [description]
	 */
	this.findAndModify = function*(condition, data) {
		let result = yield this.db.findAndModify(condition, data);
		return result;
	}

	/**
	 * 数据库删除满足条件记录
	 * @param {[type]} obj           [description]
	 * @yield {[type]} [description]
	 */
	this.remove = function*(condition) {
		let result = yield this.db.remove(condition);
		return result;
	}

	/**
	 * 数据库去重操作
	 * @param {[type]} condition     [description]
	 * @param {[type]} query         [description]
	 * @yield {[type]} [description]
	 */
	this.distinct = function*(condition, query) {
		let result = yield this.db.distinct(condition, query);
		return result;
	}

	/**
	 * 数据库统计操作
	 * @param {[type]} condition     [description]
	 * @param {[type]} query         [description]
	 * @yield {[type]} [description]
	 */
	this.count = function*(condition) {
		let result = yield this.db.count(condition);
		return result;
	}
}

module.exports = DB;