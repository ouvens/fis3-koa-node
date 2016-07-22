'use strict';
/**
 * 可以使用extends方法覆盖下列方法
 * init(data) // 初始化方法
 * _renderData(data) // 渲染数据方法
 * _bindEvent() //事件绑定
 */
var $ = require('jquery');
var Component = require('comBase');
var tpl = require('./index.tpl');
var component = new Component($('#publicHeader'), tpl);

component.extend({
	_bindEvent: function() {
		var nickname = $('input[name=nickname]').val();
		if (nickname) {
			$('.exit').show();
			$('.login').hide();
		};

		$('.login a').click(function(){
			var backUrl = encodeURIComponent(window.location.href);
			$(this).attr('href','/user_login.html?backUrl='+backUrl);
		});


		$('.exit a').click(function() {
			$.ajax({
				url: '/api/v1/user/logout',
				type: 'get',
				dataType: 'json',
				data: {

				},
				success: function(data) {

					location.reload();
				},
				error: function(msg) {
					console.log(msg);
				}
			});

		});
	}
});
module.exports = component;