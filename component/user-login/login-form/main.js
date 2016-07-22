'use strict';
/**
 * 可以使用extends方法覆盖下列方法
 * init(data) // 初始化方法
 * _renderData(data) // 渲染数据方法
 * _bindEvent() //事件绑定
 */

var $ = require('jquery');
var Component = require('comBase');
var md5 = require('md5');
var validator = require('validator');
var util = require('util');

var tpl = require('./index.tpl');
var placeholder = require('placeholder');

var component = new Component($('#loginForm'), tpl);

component.extend({
    _bindEvent: function() {
        var self = this;

        placeholder.init($);

        self._checkAuth();

        self.$el.on('click', '.btn-submit', function(e) {
            var isVali = validator.all($('input[data-pattern]'));

            /**
             * 判断输入逻辑
             * @param  {[type]} !isVali [description]
             * @return {[type]}         [description]
             */
            if (!isVali) {
                self.$el.find('.g-err .tips').show();
                self.$el.find('.g-succ .tips').hide();
                self.$el.find('.login-form').addClass('error-form');
                return;
            } else {
                self.$el.find('.tips').hide();
                self.$el.find('.login-form').removeClass('error-form');
            }

            var data = {
                username: self.$el.find('input[name=username]').val(),
                password: md5(self.$el.find('input[name=password]').val()),
                originPassword: self.$el.find('input[name=password]').val()
            };

            $.ajax({
                url: '/api/v1/user/auth',
                data: data,
                type: 'post',
                dataType: 'json',

                success: function(data) {
                    var backUrl = util.url.getUrlParam('backUrl');
                    if (data.id) {
                        if (backUrl) {
                            window.location.href = backUrl;
                        } else {
                            window.location.href = 'http://www.xiaodao360.com';
                        }
                    } else {
                        self.$el.find('.tips').eq(0).show().find('span').html(data.error || '服务器请求错误');
                        self.$el.find('.login-form').addClass('error-form');
                    }
                },

                error: function(e) {
                    console.log(JSON.stringify(e));
                }
            });
        }).on('keypress', '#username', function(e) {
            if (this.value.length >= 11) {
                this.value = this.value.slice(0, 10);
            }
        });
    },
    _checkAuth: function() {
        var self = this;
        if (self.$el.data('session-mid')) {
            // location.href="http://www.baidu.com";
        }
    }
})

module.exports = component;