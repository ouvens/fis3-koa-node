
/**
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

var recmendList = require('tab-recmend');
var moreList = require('tab-more');

var hasLoaded = false;
var tab = {
    $el: $('.ui-tab'),
    model: {},
    
    init: function(data) {
        this.model = data;
        if(window.r){
            this._renderData(data);
        }
        this._bindEvent();
    },

    _renderData: function(data) {
        recmendList.init(data && data.recmendList);
    },

    _bindEvent: function() {
        var self = this;
        var $tab = new fz.Scroll('.ui-tab', {
            role: 'tab',
            autoplay: false,
            interval: 3000
        });

        /* 滑动开始前 */
        $tab.on('beforeScrollStart', function(from, to) {
            // from 为当前页，to 为下一页
        })

        /* 滑动结束 */
        $tab.on('scrollEnd', function(curPage) {
            // curPage 当前页
            switch(curPage){
                case 1:
                    moreList.init(self.model && self.model.moreList);
                    break;
                case 0:
                    recmendList.init(self.model && self.model.recmendList);
                    break;
                default:
                    break;
            }
        });
    }
}

module.exports = tab;
