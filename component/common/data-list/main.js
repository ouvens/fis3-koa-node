var list1 = require('./list1.tpl'),
    list2 = require('./list2.tpl'),
    list3 = require('./list3.tpl');
var labelList = {
    $el: $('#container'),

    init: function(data) {

        this._renderData(data);
        this._bindEvent();
    },

    _renderData: function(data) {
        this.$el.find('#flex-box1').html(list1({data: data.list1}));
        this.$el.find('#flex-box2').html(list2({data: data.list2}));
        this.$el.find('#flex-box3').html(list3({data: data.list3}));
    },

    _bindEvent: function() {
        var elemId , rightId , $rightElem;
        this.$el.on('click','.left',function(e){
             elemId = $(e.target).attr('id');
             rightId = elemId.replace('_l','_r');
             /*$elemId = $('#'+elemId);
             $elemId.siblings().removeClass('current');
             $elemId.addClass('current');*/
             $(this).siblings().removeClass('current-li');
             $(this).addClass('current-li');
             $rightElem = $('#'+rightId);
             $rightElem.siblings().removeClass('show');
             $rightElem.addClass('show');
        });
    }
};

module.exports = labelList;