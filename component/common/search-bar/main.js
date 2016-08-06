
'use strict';
var labelList = require('label-list');

var searchBar = {
    $el: $('#ui-search-bar'),
    init: function(data) {
        if(window.r){
            this._renderData(data);
        }
        this._bindEvent();
    },

    _renderData: function(data) {
        labelList.init(data);
    },

    _ajaxData: function() {

    },

    _bindEvent: function() {
        var self = this;
        this.$el.on('click', '.ui-searchbar', function(){
            self.$el.addClass('focus');
            self.$el.find('.ui-searchbar-input input').focus();
            $('#ui-label-panel').addClass('show');
        });
        this.$el.on('click', '.ui-searchbar-cancel', function(){
            self.$el.removeClass('focus');
            $('#ui-label-panel').removeClass('show');
        });
    }
}

module.exports = searchBar;