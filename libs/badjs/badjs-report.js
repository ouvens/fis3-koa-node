/* badjs-commonjs
 * author: ouvenzhang
 * description: 通用web前端错误上报
 * copyright: MIT license
 * time: 2016-01-25
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root['badjs'] = factory();
    }

})(this, function() {

    var root = root || window;
    var _error = [];
    var _config = {
        id: 0,          // 可以为业务id参数
        url: '//badjs2.qq.com/badjs',   // 上报后台的url
        combo: true,    // 是否一起上传
        ext: {},        // 额外配置信息。例如自定义版本号
        level: 4,       // 1-debug 2-info 4-error根据系统error级别去顶
        ignore: [],     // 忽略的错误
        random: 1,      // 按照一定概率上报, 这里上报的目的是定位错误，否则会造成很大的log文件
        delay: 1000,    // 延时上报
        submit: null    // 是否立即发送网络上报
    };


    /*===============================================================*/
    /*                     window.error捕获上报                      */
    /*===============================================================*/

    var origingError = root.onerror;  // 缓存原有事件，上报完成后执行
    root.onerror = function(msg, url, rowNum, colNum, error) {
        // 没有URL不上报！上报也不知道错误
        if (msg === 'Script error.' && !url) {
            // 调用tryjs捕获
            return true;
        }else{
            /**
             浏览器的异域js的onerror只能获取Script error ，如果不是Script error 则onerror上报，采用异步的方式，由于客户端强制关闭webview导致这次堵塞上报有Network Error，这里window.onerror的执行流在关闭前是必然执行的，而离开页面之后的上报对于业务来说是可丢失的，所以把这里的执行流放到异步事件去执行，脚本的异常数降低了10倍
            **/
            setTimeout(function() {
                var data = {};
                //不一定所有浏览器都支持col参数
                colNum = colNum || (window.event && window.event.errorCharacter) || 0;
                data.url = url;
                data.rowNum = rowNum;
                data.colNum = colNum;

                if (!!error && !!error.stack) {
                    //如果浏览器有堆栈信息
                    data.msg = _processStackMsg(error);
                } else if (!!arguments.callee) {
                    //尝试通过callee拿堆栈信息
                    var ext = [];
                    var fn = arguments.callee.caller,
                        c = 3;
                    //这里只拿三层堆栈信息
                    while (fn && (--c > 0)) {
                        ext.push(fn.toString());
                        if (fn === fn.caller) {
                            break; //如果有环
                        }
                        fn = fn.caller;
                    }
                    ext = ext.join(',');
                    data.msg = ext || msg;
                }

                //把data上报到后台
                report.push(data);

                // 执行原来的错误回调
                origingError && origingError.apply(root, arguments);

            }, 0);
        }

    };

    /**
     * 定义导出的report函数
     * @type {Object}
     */
    var report = {

        // 将错误推到缓存池
        push: function(msg) {
            if (Math.random() >= _config.random) {
                return report;
            }
            _error.push(_isObject(msg) ? _processError(msg) : {
                msg: msg
            });
            _reportError(false);
            return report;
        },

        // 上报错误调用入口
        report: function(msg) {
            msg && report.push(msg);
            _reportError(true);
            return report;
        },

        // 上报info信息
        info: function(msg) {
            if (!msg) {
                return report;
            }
            if (_isObject(msg)) {
                msg.level = 2;
            } else {
                msg = {
                    msg: msg,
                    level: 2
                };
            }
            report.push(msg);
            return report;
        },

        // 上报debug信息
        debug: function(msg) {
            if (!msg) {
                return report;
            }
            if (_isObject(msg)) {
                msg.level = 1;
            } else {
                msg = {
                    msg: msg,
                    level: 1
                };
            }
            report.push(msg);
            return report;
        },

        // 从error对象解析要上报的数据
        processStackMsg: _processError,

        // 初始化入口
        init: function(config) {
            // 覆盖配置
            if (_isObject(config)) {
                for (var key in config) {
                    _config[key] = config[key];
                }
            }

            // 没有设置id将不上报
            _config.report = _config.url + '?id=' + _config.id + '&from=' + encodeURIComponent(location.href) + '&ext=' + JSON.stringify(_config.ext) + '&';

            return report;
        },

        // 保留原有的事件
        __onerror__: root.onerror
    };


    /*===============================================================*/
    /*                         消息解析上报                          */
    /*===============================================================*/
    /**
     * 解析错误为要上报的键值对象
     * @param  {[type]} errObject [description]
     * @return {[type]}        [description]
     */
    function _processError(errObject) {
        try {
            if (errObject.stack) {
                var url = errObject.stack.match('https?://[^\n]+');
                url = url ? url[0] : '';
                
                var rowCols = url.match(':(\\d+):(\\d+)');
                var stack = _processStackMsg(errObject);
                
                if (!rowCols) {
                    rowCols = [0, 0, 0];
                }

                /** 返回错误信息 */
                return {
                    msg: stack,
                    rowNum: rowCols[1],
                    colNum: rowCols[2],
                    target: url.replace(rowCols[0], '')
                };
            } else {
                //ie 独有 error 对象信息，try-catch 捕获到错误信息传过来，造成没有msg
                if (errObject.name && errObject.message && errObject.description) {
                    return {
                        msg: JSON.stringify(errObject)
                    };
                }
                return errObject;
            }
        } catch (err) {
            return errObject;
        }
    };

    /**
     * 获取错误对象的栈信息
     * @param  {[type]} error [description]
     * @return {[type]}       [description]
     */
    function _processStackMsg(error) {
        var stack = error.stack.replace(/\n/g, '').split(/\bat\b/).slice(0, 5).join('@').replace(/\?[^:]+/gi, '');
        var msg = error.toString();
        if (stack.indexOf(msg) < 0) {
            stack = msg + '@' + stack;
        }
        return stack;
    };

    /**
     * 解析错误为字符串
     * @param  {[type]} error [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    function _errorToString(error, index) {
        var param = [],
            params = [],
            stringify = [];

        if (_isObject(error)) {
            error.level = error.level || _config.level;
            for (var key in error) {
                var value = error[key];
                if (!_isEmpty(value)) {
                    if (_isObject(value)) {
                        try {
                            value = JSON.stringify(value);
                        } catch (err) {
                            value = '[badjs detect value stringify error] ' + err.toString();
                        }
                    }
                    stringify.push(key + ':' + value);
                    param.push(key + '=' + encodeURIComponent(value));
                    params.push(key + '[' + index + ']=' + encodeURIComponent(value));
                }
            }
        }
        return [params.join('&'), stringify.join(','), param.join('&')];
    };

    /**
     * 提交网络请求
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    function _submit(url) {
        var _imgs = [];
        if (_config.submit) {
            _config.submit(url);
        } else {
            var _img = new Image();
            _imgs.push(_img);
            _img.src = url;
        }
    };

    /**
     * 上报错误
     * @param  {Boolean} isReoprtNow [description]
     * @return {[type]}              [description]
     */
    function _reportError(isReoprtNow) {
        var errorList = [];
        var comboTimeout = 0;

        if (!_config.report) return;

        while (_error.length) {
            var isIgnore = false;
            var error = _error.shift();
            var error_str = _errorToString(error, errorList.length);
            if (_isType(_config.ignore, 'array')) {
                for (var i = 0, l = _config.ignore.length; i < l; i++) {
                    var rule = _config.ignore[i];
                    if ( _isType(rule, 'regexp') && rule.test(error_str[1]) ||
                        _isType(rule, 'function') && rule(error, error_str[1])) {
                        isIgnore = true;
                        break;
                    }
                }
            }
            if (!isIgnore) {
                if (_config.combo) {
                    errorList.push(error_str[0]);
                } else {
                    _submit(_config.report + error_str[2] + '&_t=' + (+new Date));
                }
                _config.onReport && (_config.onReport(_config.id, error));
            }
        }

        // 合并上报
        var count = errorList.length;
        if (count) {
            var comboReport = function() {
                clearTimeout(comboTimeout);
                _submit(_config.report + errorList.join('&') + '&count=' + count + '&_t=' + (+new Date));
                comboTimeout = 0;
                errorList = [];
            };
            if (isReoprtNow) {
                comboReport(); // 立即上报
            } else if (!comboTimeout) {
                comboTimeout = setTimeout(comboReport, _config.delay); // 延迟上报
            }
        }
    };

    /*===============================================================*/
    /*                         工具函数定义                          */
    /*===============================================================*/

    /**
     * 类型判断
     */
    function _isType(object, type){
        return Object.prototype.toString.call(object).slice(8, -1).toLowerCase() === type;
    }

    /**
     * 判断是否对象
     */
    function _isObject(obj) {
        return obj && _isType(obj, 'object');
    }

    /**
     * 判断是否为空
     */
    function _isEmpty(obj) {
        return obj === null || !obj && !_isType(obj, 'number');
    }

    return report;
});