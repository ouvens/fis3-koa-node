//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

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
    var cache = [],
        timeout;

    $.fn.remove = function() {
        return this.each(function() {
            if (this.parentNode) {
                if (this.tagName === 'IMG') {
                    cache.push(this)
                    this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                    if (timeout) clearTimeout(timeout)
                    timeout = setTimeout(function() {
                        cache = []
                    }, 60000)
                }
                this.parentNode.removeChild(this)
            }
        })
    }
    return $;
});
