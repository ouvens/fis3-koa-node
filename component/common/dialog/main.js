
/**
 *  title   string  ''  浮层标题，用来填充模板
    content string  ''  浮层内容，用来填充模板
    button  array   ['确认']  浮层底部按钮的文字数组，建议不超过两个，与callback的index相互对应
    select  int 0   需要高亮的按钮索引（与button相互对应），高亮的按钮会添加类名select
    allowScroll bool    false   弹窗弹出后是否允许页面滚动
    callback    funtion function(){}    点击底部按钮后的回调函数，可以通过函数的第一个参数来获取点击的按钮索引（与button对应）
    animation   string  'pop'   弹窗弹出的动画类名，会自动为弹窗外层加上该类名
    end function    function(){}    弹窗弹出后或者消失后的回调，可以通过函数第一个参数来获取状态（'show'为弹出后，'hide'为消失后）
 */
'use strict';

var dialog = {
    $el: $('#ui-dialog'),
    init: function() {

        this._renderData();
        this._bindEvent();
    },

    _renderData: function() {
        this._ajaxData();
    },

    _ajaxData: function() {

    },

    _bindEvent: function() {
        var $dialog = this.$el.dialog('show');

        $dialog.on("dialog:action",function(e){
            alert(1)
        });
        $dialog.on("dialog:hide",function(e){
            alert(2)
        });
        var dia = $.dialog({
            title: '温馨提示',
            content: '温馨提示内容',
            button: ["确认", "取消"]
        });

    }
}

module.exports = dialog;
