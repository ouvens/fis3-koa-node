
/**
    scrollX boolean false   水平滚动
    scrollY boolean true    竖直滚动
    bounce  boolean true    反弹动画
    scrollTo(x, y)  function    -   滚动到具体坐标
    scrollToElement(el, time, offsetX, offsetY) function    -   滚动到具体坐标：el: 元素；time：滚动时间(ms)；offsetX：水平偏移量；offsetY：垂直偏移量。
    getComputedPosition()   function    -   返回 scroller 当前的 {x:x, y:y} 坐标轴
    enable()    function    -   全局开关，开启滚动
    disable()   function    -   全局开关，禁止滚动
    refresh()   function    -   刷新当前位置
    destroy()   function    -   销毁对象
 */
 
var scroller = {
    $el: $('.ui-tab'),

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
        var scroll = new fz.Scroll('.ui-scroller', {
            scrollY: true
        });

        // scroll.scrollTo(0, 200);

        // 若 offsetX 和 offsetY 都是 true，则滚动到元素位于屏幕中央的位置；
        scroll.scrollToElement("li:nth-child(3)", 1000, true, true);
    }
}

module.exports = scroller;
