/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */

// var $ = require('jquery');

var tpl = require('./index.tpl');
var Component = require('comBase');

var reactContent = require('react-content');
var reactHello = require('react-hello');

var component = new Component($('body'), tpl);

component.extend({

    init: function() {
        this._renderData();
    },

    _renderData: function() {
        this._initComponent();
        this._bindEvent();
    },
    _ajaxData: function() {

    },

    _initComponent: function(data) {
        reactContent.init();
    },

    _bindEvent: function(data) {

    }
});

module.exports = component;