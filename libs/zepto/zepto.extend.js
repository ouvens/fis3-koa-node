(function(root, factory) {
    if (typeof define === 'function' || typeof require === 'function' ||  define.amd) {
        // AMD
        require(['zepto'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'));
    } else {
        // 浏览器全局变量(root 即 window)
        root['Zepto'] = root['$'] = factory(Zepto);
    }

})(this, function($) {

    __inline('./extend/touch.js');
    __inline('./extend/localAjax.js');
    __inline('./extend/ajax.js');
    __inline('./extend/gesture.js');
    __inline('./extend/md5.js');
    __inline('./extend/detect.js');
    __inline('./extend/assets.js');
    __inline('./extend/callbacks.js');
    __inline('./extend/cookie.js');
    __inline('./extend/data.js');
    __inline('./extend/deferred.js');
    __inline('./extend/event.js');
    __inline('./extend/form.js');
    __inline('./extend/fx.js');
    __inline('./extend/fx_methods.js');
    __inline('./extend/localStorage.js');
    __inline('./extend/selector.js');
    __inline('./extend/stack.js');

    return $;
});
