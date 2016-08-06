'use strict';
/**
 * 可以使用extends方法覆盖下列方法
 * init(data) // 初始化方法
 * _renderData(data) // 渲染数据方法
 * _bindEvent() //事件绑定
 */

var React = require('react');
var ReactDOM = require('react-dom');

console.log(React, ReactDOM);

module.exports = {
	init: function() {
		console.log('init');
	}
};