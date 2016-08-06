'use strict';
/**
 * 可以使用extends方法覆盖下列方法
 * init(data) // 初始化方法
 * _renderData(data) // 渲染数据方法
 * _bindEvent()	//事件绑定
 */
var Component = require('comBase');
var tpl = require('./index.tpl');
var commentTpl = require('./comment.tpl');

var scrollLoad = require('scrollload');

var component = new Component($('#orgComment'), tpl);

component.extend({

	_bindEvent: function() {
		var self = this;
		var curCount = 0;

		scrollLoad(300, function(count) {
			if (count > curCount) {
				curCount = count;
				self._loadMoreComment(count);
			}
		});
	},


	_loadMoreComment: function(count) {
		$.localAjax({
			url: '../mock/more-comment.json',
			method: 'get',
			dataType: 'json',
			data: {
				count: count
			},
			done: function(data) {
				_renderComment(data.result);
				// self._bindEvent(data.result);
			},
			fail: function(msg) {
				dialog.init();
			}
		});

		function _renderComment(data) {

			var $el = $('#commentList');
			if (data.comment.length) {
				$el.append(commentTpl({
					data: data
				}));
			}
		}
	}
});

module.exports = component;