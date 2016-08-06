/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */

var localAjax = require('localAjax');
var util = require('util');

var orgHeader = require('org-content');
var orgComment = require('org-comment');
var appButton = require('app-button');

var tpl = require('./index.tpl');
var Component = require('comBase');
var component = new Component($('body'), tpl);

// window.r 用于判断是否使用浏览器端拉数据渲染，有r且含有值则使用浏览器端渲染
window.r = util.url.getUrlParam('r');

component.extend({

    init: function() {
        this._renderData();
    },

    _renderData: function() {
        if (window.r) {
            this._ajaxData();
        } else {
            this._initComponent();
            this._bindEvent();
        }
    },

    _ajaxData: function() {
        var self = this;
        $.localAjax({
            url: '../mock/star.json',
            method: 'get',
            dataType: 'json',
            data: {},
            done: function(data) {
                self._initComponent(data.result);
                self._bindEvent(data.result);
            },
            fail: function(msg) {
                dialog.init();
            }
        });
    },

    _initComponent: function(data) {
        orgHeader.init(data);
        orgComment.init(data);
        appButton.init();
    },

    _bindEvent: function(data) {

        var self = this;
        var self = this;

        self.$el.on('click', '[data-href]', function() {
            window.location.href = $(this).data('href');

            // 按需异步模块测试
            /*require.async(['testMod'], function(Mod) {
                Mod.init();
            });
            require.async(['testMod1'], function(Mod) {
                Mod.init();
            });*/
        });
    }
});


module.exports = component;