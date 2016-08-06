// 自动滚动到底部加载触发事件
/**
 * $.fn.scrollLoad(400,function(count) {
     console.log(count);
 })
 * 传入触发间隔时间和触发回调，回调带回来的是累计调用的次数
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['zepto'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'));
    } else {
        // 浏览器全局变量(root 即 window)
        root['Zepto'] = factory(root['Zepto']);
    }

})(this, function($) {

    $.fn.scrollLoad = function(time, fn) {
        var winHeight = $(window).height(); //窗口高度
        var count = 0, // 调用次数
            lock = false; // 内部防止频繁触发滚动事件

        var scrollHandler = function() {
            if (lock) {
                return;
            }
            var pageHeight = $(document).height(); //文档高度
            var scrollTop = $(window).scrollTop(); //滚动的高度
            var percent = (pageHeight - winHeight - scrollTop) / winHeight;
            if (percent < 0.02) {
                lock = true;
                fn(++count);
                setTimeout(function() {
                    lock = false;
                }, time);
            }
        };

        //定义鼠标滚动事件  
        $(window).scroll(scrollHandler);
    }
    return $.fn.scrollLoad;
});