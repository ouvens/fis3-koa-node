/**
 * @fileoverview 工具函数：cookie处理
 * @example @todo
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['zepto'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'));
    } else {
        // 浏览器全局变量(root 即 window)
        root['Cookie'] = factory(root['Zepto']);
    }

})(this, function ($) {

    var exports = {
        /**
         * @description 读取cookie
         * @public
         * @param {String} n 名称
         * @returns {String} cookie值
         * @example
         *      $.cookie.get('id_test');
         */
        get:function(n){
            var m = document.cookie.match(new RegExp( "(^| )"+n+"=([^;]*)(;|$)"));
            return !m ? "":decodeURIComponent(m[2]);
        },
        /**
         * @description 设置cookie
         * @public
         *
         * @param {String} name cookie名称
         * @param {String} value cookie值
         * @param {String} [domain = ""] 所在域名
         * @param {String} [path = "/"] 所在路径
         * @param {Number} [hour = 30] 存活时间，单位:小时
         * @example
         *      $.cookie.set('value1','cookieval',"id.qq.com","/test",24); //设置cookie
         */
        set:function(name,value,domain,path,hour){
            var expire = new Date();
            expire.setTime(expire.getTime() + (hour?3600000 * hour:30*24*60*60*1000));

            document.cookie = name + "=" + value + "; " + "expires=" + expire.toGMTString()+"; path="+ (path ? path :"/")+ "; "  + (domain ? ("domain=" + domain + ";") : "");
        },

        /**
         * @description 删除指定cookie,复写为过期 !!注意path要严格匹配， /id 不同于/id/
         * @public
         *
         * @param {String} name cookie名称
         * @param {String} [domain] 所在域
         * @param {String} [path = "/"] 所在路径
         * @example
         *      $.cookie.del('id_test'); //删除cookie
         */
        del : function(name, domain, path) {
            document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path="+ (path ? path :"/")+ "; " + (domain ? ("domain=" + domain + ";") : "");
        },
        /**
         * @description 删除所有cookie -- 这里暂时不包括目录下的cookie
         * @public
         *
         * @example
         *      $.cookie.clear(); //删除所有cookie
         */

        clear:function(){
            var rs = document.cookie.match(new RegExp("([^ ;][^;]*)(?=(=[^;]*)(;|$))", "gi"));
            // 删除所有cookie
            for (var i in rs){
                document.cookie = rs[i] + "=;expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; " ;
            }
        },
        /**
         * 获取uin，针对业务,对外开源请删除
         * @public
         *
         * @return {String} uin值
         * @example
         *      $.cookie.uin();
         */
        uin:function(){
            var u = this.get("uin");
            return !u?null:parseInt(u.substring(1, u.length),10);
        }
    };
    
    // 处理腾讯视频 播放组件 http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js 覆盖 $.cookie 的问题
    // 这是一个坑爹的设计
    // 作为一个公用的组件 为什么并且支持模块化 为什么还要 把方法挂到 $ 下
    $.reset_own_cookie = function(){
        $.cookie = exports;
    }

    $.cookie = exports;
    return exports;
});
