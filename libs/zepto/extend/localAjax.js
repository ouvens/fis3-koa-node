/**
 * @author: ouvenzhang
 * @localAjax 函数，带有localstorage功能
 * @example
 * 注意回调中需要使用done，fail来处理请求成功与失败情况，原有ajax的success和error函数无效
 */
(function(root, factory) {
     if (typeof define === 'function' && define.amd) {
        // AMD
        define(['zepto', './localStorage', './md5'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'), require('./localStorage'), require('./md5'));
    } else {
        // 浏览器全局变量(root 即 window)
        root['localAjax'] = factory(root['Zepto'], root['localData'], root['md5']);
    }

})(this, function($) {

    /**
     * 结合ajax获取请求数据
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    var exports = function(opts) {

        var defaults = $.extend(opts, {
            success: function(data) {
                opts.done && opts.done(data);

                /**
                 * 延时存储数据，按照cgi的md5作为key存入localstorage
                 */
                setTimeout(function() {
                    try {
                        $.localData.set($.md5(opts.url), JSON.stringify(data));
                    } catch (e) {
                        console.info(e.msg)
                    }
                }, 3000);
            },
            error: function(msg) {
                try {

                    /**
                     * 失败时尝试获取本地数据进行渲染，按照cgi的md5作为key存入localstorage
                     */
                    var data = JSON.parse($.localData.get($.md5(opts.url)));
                    opts.done && opts.done(data);
                } catch (e) {
                    opts.fail && opts.fail(msg);
                    console.info(e.msg)
                }
            }
        });
        $.ajax(defaults);
    };

    $.localAjax = exports;
    return exports;
});
