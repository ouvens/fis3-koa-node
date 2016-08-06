/**
 * localstorage: 使用全局localData调用
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('zepto', factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'));
    } else {
        // 浏览器全局变量(root 即 window)
        root['localData'] = factory(root['Zepto']);
    }

})(this, function($) {

    var rkey = /^[0-9A-Za-z_@-]*$/;
    var store;

    function init() {
        if (typeof store == 'undefined') {
            store = window['localStorage'];
        }
        return true;
    }

    function isValidKey(key) {
        if (typeof key != 'string') {
            return false;
        }
        return rkey.test(key);
    }

    var exports = {
        set:function (key, value) {
            var success = false;
            if (isValidKey(key) && init()) {
                try {
                    value += '';
                    store.setItem(key, value);
                    success = true;
                } catch (e) {}
            }
            return success;
        },
        get:function (key) {
            if (isValidKey(key) && init()) {
                try {
                    return store.getItem(key);
                } catch (e) {}
            }
            return null;
        },
        remove:function (key) {
            if (isValidKey(key) && init()) {
                try {
                    store.removeItem(key);
                    return true;
                } catch (e) {}
            }
            return false;
        },
        clear : function () {
            if (init()) {
                try {
                    for (var o in store) {
                        store.removeItem(o);
                    }
                    return true;
                } catch (e) {}
            }
            return false;
        }
    };
    $.localData = exports;
    return exports;
});
