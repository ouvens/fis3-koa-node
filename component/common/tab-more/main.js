
/**
    content string  ''  提示内容，用来填充模板
    stayTime    int 1000    提示停留时间，过了这个时间自动隐藏，设置0则不自动隐藏
    type    string  'info'  提示类型，可选info|warn|success
    callback    funtion function(){}    回调函数，第一个参数指示回调类型，目前有两种show|hide
 */
var moreTpl = require('./index.tpl');

var tips = {
    $el: $('#ui-more-list'),

    init: function(data) {
        if(window.r){
            this._renderData(data);
        }
        this._bindEvent();
    },

    _renderData: function(data) {
        var self = this;

        if(self.$el.data('type')){
            self.$el.html(moreTpl({tabMore: data}));
        }
        self.$el.next().hide();
    },


    _bindEvent: function() {
        
    }
}

module.exports = tips;

