/* badjs-commonjs
 * author: ouvenzhang
 * description: 主要拦截捕获浏览器端的赋值，require、define、setTimeout、setInterval等事件，要求支持es5的浏览器上有效
 * copyright: MIT license
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['badjs-report'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('badjs-report'));
    } else {
        // 浏览器全局变量(root 即 window)
        root['catchError'] = factory(root['badjs']);
    }
})(this, function(badjs) {

    // utils
    var isFunction = function(fn) {
            return typeof fn === 'function';
        },

        // 内置事件注入
        inject = function(obj, props, hook) {
            var propsArr = props.split(/\s+/);
            for(var i = 0, len = propsArr.length; i < len; i++){
                var _fn = obj[i];
                obj[i] = function() {
                    var args = hook.apply(this, arguments) || arguments;
                    return _fn.apply(this, args);
                };
            }
        },

        // 监听修改属性
        modify = function(obj, props, modifier) {

            var propsArr = props.split(/\s+/);
            for(var i = 0, len = propsArr.length; i < len; i++){
                var value = obj[i];
                if (value) {
                    obj[i] = value = modifier.call(this, value);
                }
            }
        };

    // 最早的时候没有BJ_REPORT,因此把这个时候的异常存起来
    var onthrow = function(e) {
        var timeoutkey;
        /**
         * 这里语法错误走onerror，运行时错误走tryjs
         * @param  {[type]} !e._caught [description]
         * @return {[type]}            [description]
         */
        if (!e._caught) {

            var orgOnerror;
            
            if (timeoutkey) {
                clearTimeout(timeoutkey);
            } else {
                orgOnerror = window.onerror;
                window.onerror = function() {};
            }
            timeoutkey = setTimeout(function() {
                window.onerror = orgOnerror;
                orgOnerror = null;
                timeoutkey = null;
            }, 50);

            // 设置标志，顶部的throw跳过
            badjs.push(badjs.processStackMsg(e));
            e._caught = true;
        }

        throw e;
    };

    /**
     * 包装try函数
     */
    function catchError(fn) {

        // 防止多次包装
        if (!isFunction(fn) || fn.__try) {
            return fn;
        }
        // 保持一对一，要不然容易引起未知的问题
        if (fn.__tryer) {
            return fn.__tryer;
        }
        var _fn = function() {
            try {
                return fn.apply(this, arguments);
            } catch (e) {
                onthrow(e);
            }
        };
        fn.__tryer = _fn;
        _fn.__try = fn;
        _fn.__proto__ = fn;
        // _fn.__tryer -> fn -> fn.__tryer -> _fn, so set it undefined
        _fn.__tryer = undefined;

        return _fn;
    }

    /**
     * 包装参数中的函数
     */
    function catArgs() {
        return [].slice.call(arguments).map(function(fn) {
            return isFunction(fn) ? catchError(fn) : fn;
        });
    }

    /**
     * 从被包装的参数中提取出原始参数
     */
    function uncatArgs() {
        return [].slice.call(arguments).map(function(fn) {
            return isFunction(fn) && fn.__tryer ? fn.__tryer : fn;
        });
    }

    /**
     * 将catArgs, uncatArgs运用到函数上 
     */
    function funArgsFilter(filter) {
        return function(fn) {
            // 保证不重复包装
            if (!isFunction(fn) || fn.__filting) {
                return fn;
            }
            var _fn = function() {
                var args = filter.apply(this, arguments);
                return fn.apply(this, args);
            };
            _fn.__filting = fn;
            _fn.__proto__ = fn;
            return _fn;
        };
    }

    /**
     * 默认处理一些函数
     */
    inject(XMLHttpRequest.prototype, 'send', function() {
        if (this.onreadystatechange) {
            this.onreadystatechange = catchError(this.onreadystatechange);
        }
    });

    /**
     * 此处websocket部分没用到可以去掉
     * @param  {[type]} window.WebSocket [description]
     * @return {[type]}                  [description]
     */
    if (window.WebSocket) {
        inject(WebSocket.prototype, 'send', function() {
            var self = this;

            var itemArr = ['onmessage', 'onclose', 'onerror'];
            for(var i = 0, len = itemArr.length; i < len; i++){
                if (self[i]) {
                    self[i] = catchError(self[i]);
                }
            }
        });
    }

    inject(window, 'setTimeout setInterval', catArgs);

    // 打包后define require有时候会被封在函数里，需要手动暴露到window上，一般在window上
    // var define; 不可使用var定义, 会清除__defineGetter__
    modify(window, 'define require', funArgsFilter(catArgs));

    modify(window, 'Jquery Zepto', function($) {
        if ($ && $.fn) {
            modify($.fn, 'on bind', funArgsFilter(catArgs));
            modify($.fn, 'off unbind', funArgsFilter(uncatArgs));
        }
        return $;
    });

    // 手动接口
    window.badjs = badjs;
    return badjs;
});
