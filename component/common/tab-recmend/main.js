
var listTpl = require('./index.tpl');

var tips = {
    $el: $('#ui-recmend-list'),

    init: function(data) {

        if(window.r){
            this._renderData(data);
        }
        this._bindEvent();
    },

    _renderData: function(data) {
        var self = this;
        if(self.$el.data('type')){
            self.$el.html(listTpl({tabRecmend: data}));
        }
        self.$el.next().hide();
    },

    _bindEvent: function() {

    }
}

module.exports = tips;
