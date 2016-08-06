var liTpl = require('./index.tpl');

var dataList = require('data-list');
var choiceList = {
    $el : $('#select-nav'),
    init: function(data1,data2){
        this._renderData(data1,data2);
        this._bindEvent();
    },
    _renderData:function(data1,data2){
        this.$el.find('#li-list').html(liTpl({data:data1}));
        dataList.init(data2);
    },
    _bindEvent:function(){
        var elemId,$flexBox;

       // console.log(this.$el.find('.title'));
        this.$el.on('click','.title',function(e){
           // alert('start');
           //alert($(this).attr('id'));
            elemId = $(e.target).attr('id');
            $elemId = $('#'+elemId);
            $elemId.siblings().removeClass('current');
            $elemId.addClass('current');
            $flexBox = $('.flex-box');

            if ($flexBox.hasClass('show')) {
                $flexBox.removeClass('show');
            }
            if(elemId == 'list0'){
                $('#flex-box1').addClass('show');
            }
            if(elemId == 'list1'){
                $('#flex-box2').addClass('show');
            }
            if(elemId == 'list2'){
                $('#flex-box3').addClass('show');
            }
        });
        
    }
};
module.exports = choiceList;