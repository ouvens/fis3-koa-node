
/**
    indicator   boolean true    指示点
    autopaly    boolean false   自动播放
    interval    int 2000ms  自动播放间隔时间
    duration    int 300ms   切换动画过渡时间
    bounce  boolean true    反弹动画
    beforeScrollStart   function    function(){}    滑动开始前调用（参数：来源页from、切换页to）
    scrollEnd   function    function(){}    滑动结束时调用（参数：当前页 curPage）
    enable()    function    -   全局开关，开启滚动
    disable()   function    -   全局开关，禁止滚动
    refresh()   function    -   刷新当前位置
    destroy()   function    -   销毁对象
 */

var menuTpl = require('./index.tpl');


var slider = {
    $el: $('#ui-page-menu'),

    init: function (data) {
        if(window.r){
            this._renderData(data);
        }
        this._bindEvent();
    },

    _renderData: function (data) {
        this.$el.find('#ui-slider-content').html(menuTpl({pageMenu: data}));
    },

    _bindEvent: function () {

        var slider = new fz.Scroll('#ui-page-menu', {
            role: 'slider',
            indicator: true,
            autoplay: true,
            interval: 30000
        });

        slider.on('beforeScrollStart', function (from, to) {
            console.log(from, to);
        });

        slider.on('scrollEnd', function (curPage) {
            console.log(curPage);
        });
    }
};

module.exports = slider;
