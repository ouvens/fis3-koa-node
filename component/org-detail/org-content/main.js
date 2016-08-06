'use strict';
/**
 * 可以使用extends方法覆盖下列方法
 * init(data) // 初始化方法
 * _renderData(data) // 渲染数据方法
 * _bindEvent()	//事件绑定
 */
var Component = require('comBase');

var tpl = require('./index.tpl');

var component = new Component($('#orgContent'), tpl);

module.exports = component;