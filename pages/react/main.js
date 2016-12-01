/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */


var reactContent = require('react-content');
var reactHello = require('react-hello');

var exports = {

    init: function() {
        this._initComponent();
        this._bindEvent();
    },

    _ajaxData: function() {

    },

    _initComponent: function() {
        reactContent.init();
        reactHello.init();
    },

    _bindEvent: function() {

    }
};

module.exports = exports;