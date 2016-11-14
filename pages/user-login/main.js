/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */

var userForm = require('login-form');

var tpl = require('./index.tpl');
var Component = require('comBase');

var component = new Component($('body'), tpl);

component.extend({

    init: function() {
        this._renderData();
    },

    _renderData: function() {
        this._ajaxData();
        this._initComponent();
        this._bindEvent();

    },
    _ajaxData: function() {
        var self = this;
        $.ajax({
            url: '../mock/indexPage.json',
            type: 'get',
            dataType: 'json',
            data: {},
            success: function(data){
                self._initComponent(data.result);
                self._bindEvent();
            },
            error: function(msg){
                dialog.init();
            }
        });
    },

    _initComponent: function(data) {
        userForm.init();
    },

    _bindEvent: function(data) {

    }
});


module.exports = component;