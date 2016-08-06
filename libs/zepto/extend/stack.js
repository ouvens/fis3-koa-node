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
    $.fn.end = function() {
        return this.prevObject || $()
    }

    $.fn.andSelf = function() {
        return this.add(this.prevObject || $())
    }

    'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function(property) {
        var fn = $.fn[property]
        $.fn[property] = function() {
            var ret = fn.apply(this, arguments)
            ret.prevObject = this
            return ret
        }
    })
    return $;
});
