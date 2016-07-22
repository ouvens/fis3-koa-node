/*!
 * @module validator
 * @author kael
 * @date @DATE
 * Copyright (c) 2014 kael
 * Licensed under the MIT license.
 * https://github.com/chriso/validator.js
 */
/*************************************************************************
  一、数据验证:
    // 利用正则库 验证 email
    validator.reg.email.test('name@example.com');
    // 利用提供的方法 验证 date
    validator.date('2014-5/9');
    validator.date('2014-5-9');
    validator.date(new Date);
    validator.date('' + (new Date()));

    // 使用 extend 扩展正则库
    validator.reg.extend('github', /github\.(com|io)/);
    validator.reg.github.test('github.com');

  二、表单验证
    <!-- html 结构 -->
    <div class="mod-form__line">
       <label>电子邮箱: </label>
       <!--
           设置要验证的元素
           data-pattern 指定规则用 | 分隔
           data-tips 指定focus时的提示
           data-msg 指定与pattern相对应的错误提示
       -->
       <input class="text" data-pattern="not_null|email|kael" data-tips="请填写电子邮箱" data-msg="电子邮箱不能为空|请输入正确的电子邮箱" >
    </div>

    // 使用 extend 扩展匹配规则
    validator.extend('kael', function(str){
       return str === 'kael@qq.com'
    });

    // 初始化事件绑定
    validator.init($(':input[data-pattern]'));

    // 批量验证
    validator.all($(':input[data-pattern]'));
/*************************************************************************/

/* jshint ignore:start */
var $ = require('jquery');

function Validator() {
    var validator = this.validator = {
        /** 版本号 */
        version: '0.0.1',
        /** 验证成功时的 class 名 */
        succCls: 'g-succ',
        /** 验证提示时的 class 名 */
        infoCls: 'g-info',
        /** 验证失败时的 class 名 */
        errCls: 'g-err',
        /** 验证时 非 ASCII 字符 长度 */
        notAsciiWidth: 1,
        /** 父级元素选择器, 用于设置验证结果的 class 名 */
        parentSelector: '.input-group',
        /** 验证提示选择器, 用于将验证的提示或结果展示, 没有时会自动添加 */
        resultSelector: '.field-tips',
        fieldSelector: '.f-field',
        validate_timeout: 300,
        /** 验证结果的消息内容 */
        msg: '',
        /** 可扩展的正则库 (这里默认提供的表达式可能不够严禁, 可根据需要自己扩展) */
        reg: {
            email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
            mobile: /^1\d{10}$/,
            uin: /^[1-9](\d{4,10}|\d{17})$/,
            ascii: /^[\x00-\x7F]+$/,
            asciiSingle: /[\x00-\xFF]/,
            notAscii: /[^\x00-\x7F]/,
            fullWidth: /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/,
            halfWidth: /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/,
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            integer: /^\d+$/,
            date: /^(?:20|19)\d\d([-\/\\\.])(?:0?[1-9]|1[0-2])\1(?:[012]?\d|3[01])$/,
            time: /^(?:[01]?\d|2[0-3])[:：][0-5]?\d$/,
            url: /^https?:\/\//,
            ltrim: /^\s+/,
            rtrim: /\s+$/,
            idcard: /^\d{17}(\d|X|x)$/,
            bankid: /^\d{12,21}$/,
            license: /^[A-Za-z0-9-]+$/,
            txlink: /^http:\S*\.qq\.com\/.+$/,
            matches: function(str, pattern, modifiers) {
                return (Object.prototype.toString.call(pattern) !== '[object RegExp]' ?
                    new RegExp(pattern, modifiers) : pattern).test(str);
            },
            extend: function(key, value) {
                this[key] = value;
            }
        },
        toNumber: function(str) {
            return str.replace(/\D/g, '');
        },
        toInt: function(str, radix, def) {
            return parseInt(str, radix || 10) || def || 0;
        },
        toDate: function(date, def) {
            typeof date === 'string' && (date = date.replace(/-/g, '/'));
            return validator.date(date) ? new Date(date) : def || new Date();
        },
        toDateWithOutHMS: function(date, def) {
            date = validator.toDate(date, def);
            date.setHours(0, 0, 0, 0);
            return date;
        },
        getTime: function(date, def) {
            date = validator.toDate(date);
            return date ? date.getTime() : def || +new Date();
        },
        pass: function() {
            return true;
        },
        integer: function(str) {
            return validator.reg.integer.test(str.toString());
        },
        not_null: function(str) {
            return str.length !== 0;
        },
        date_ipt: function(str) {
            return validator.reg.date.test(str.toString());
        },
        time: function(str) {
            return validator.reg.time.test(str.toString());
        },
        url: function(str) {
            return validator.reg.url.test(str.toString());
        },
        limit_number: function(str, $item) {
            var power = parseInt(str, 10);
            var min = parseInt($item.data('min'), 10);
            var max = parseInt($item.data('max'), 10);
            if (power < min || power > max) {
                validator.msg = ['请输入', min, '-', max].join('');
                return false;
            }
            return true;
        },
        str_length: function(str, notAsciiWidth) {
            str = str.toString();
            var length = 0;
            notAsciiWidth = notAsciiWidth || validator.notAsciiWidth;

            for (var i = 0, l = str.length; i < l; i++) {
                length += str.charCodeAt(i) < 128 ? 1 : notAsciiWidth;
            }

            return Math.ceil(length / notAsciiWidth);
        },
        limit: function(str, $item) {
            str = str.toString();
            if ($item.data('trim')) {
                str = $.trim(str);
            }
            var length = 0;
            var notAsciiWidth = validator.notAsciiWidth;

            for (var i = 0, l = str.length; i < l; i++) {
                length += str.charCodeAt(i) < 128 ? 1 : notAsciiWidth;
            }
            var min = parseInt($item.data('min'), 10);
            var max = parseInt($item.data('max'), 10);
            if (min && length < notAsciiWidth * min) {
                validator.msg = (max ? ['请填写', min, '-', max, '个字'] : ['请至少填写', min, '个字符']).join('');
                return false;
            }

            if (max && length > notAsciiWidth * max) {
                validator.msg = '字数超出' + Math.ceil((length - notAsciiWidth * max) / notAsciiWidth) + '个';
                return false;
            }
            return true;
        },
        limitByLength: function(str, $item) {
            var len = str.length;
            var min = parseInt($item.data('min'), 10);
            var max = parseInt($item.data('max'), 10);

            if (min && len < min) {
                validator.msg = (max ? ['请填写', min, '-', max, '个字'] : ['请至少填写', min, '个字符']).join('');
                return false;
            }

            if (max && len > max) {
                validator.msg = '字数超出' + (len - max) + '个';
                return false;
            }
            return true;
        },
        mobile: function(str) {
            return validator.reg.mobile.test(str);
        },
        idcard: function(str) {
            return validator.reg.idcard.test(str);
        },
        bankid: function(str) {
            return validator.reg.bankid.test(str.replace(/\s+/g, ''));
        },
        license: function(str) {
            return validator.reg.license.test(str);
        },
        txlink: function(str) {
            return validator.reg.txlink.test(str);
        },
        uin: function(str) {
            return validator.reg.uin.test(str);
        },
        email: function(str) {
            return validator.reg.email.test(str);
        },
        date: function(str) {
            typeof str === 'string' && (str = str.replace(/-/g, '/'));
            return !isNaN(Date.parse(str));
        },
        // http://jsperf.com/touppercase-reg
        uppercase: function(str) {
            return !validator.reg.lowercase.test(str);
        },
        lowercase: function(str) {
            return !validator.reg.uppercase.test(str);
        },
        JSON: function(str) {
            try {
                JSON.parse(str);
            } catch (err) {
                return !(err instanceof SyntaxError);
            }
            return true;
        },
        getMsgHtml: function(msg) {
            return '<i class="icon-font i-alert"></i><span>{{msg}}</span>'.replace(/{{msg}}/g, msg || '');
        },
        setSuccess: function($item) {
            if (!validator.ignore) {
                $item.closest(validator.parentSelector)
                    .removeClass(validator.errCls + ' ' + validator.infoCls)
                    .addClass(validator.succCls)
                    .find(validator.resultSelector)
                    .html(validator.getMsgHtml('', 'succ'));
            }
            validator.ignore = false;
            validator.msg = '';
            return true;
        },
        setTips: function($item) {
            $item.closest(validator.parentSelector)
                .removeClass(validator.errCls + ' ' + validator.succCls)
                .addClass(validator.infoCls)
                .find(validator.resultSelector)
                .html(validator.getMsgHtml(validator.msg || $item.data('tips'), 'tips'));
            validator.msg = '';
            return true;
        },
        setError: function($item) {
            $item.closest(validator.parentSelector)
                .removeClass(validator.infoCls + ' ' + validator.succCls)
                .addClass(validator.errCls)
                .find(validator.resultSelector)
                .html(validator.getMsgHtml(validator.msg || $item.data('msg'), 'err'));
            validator.msg = '';
            return false;
        },
        hasError: function($item) {
            var $line = $item.closest(validator.parentSelector);
            return $line.hasClass(validator.errCls);
        },
        clearValidateResult: function($item) {
            return $item.closest(validator.parentSelector)
                .removeClass(validator.errCls + ' ' + validator.succCls + ' ' + validator.infoCls);
        },
        isNeedValidate: function($item) {
            var $line = $item.closest(validator.parentSelector);
            return $line.hasClass(validator.errCls) ||
                $line.hasClass(validator.succCls) ||
                $line.hasClass(validator.infoCls);
        },
        if_not_null_then: function(str) {
            return str.length ? true : 'break';
        },
        check: function($item, notTrim, callback) {
            var result = true;
            var patterns = ($item.data('pattern') || '').toString().split('|');
            var msgs = ($item.data('msg') || '').toString().split('|');
            var val = $item.val() || $item.data('value') || '';
            if (typeof val === 'string') {
                // prefix
                switch ($item.data('prefix')) {
                    case 'number':
                        if (/\D/.test(val)) {
                            val = validator.toNumber(val);
                            $item.val(val);
                        }
                        break;
                    case 'float':
                        if (/[^\d\-\.]/.test(val)) {
                            val = val.replace(/[^\d\-\.]/g, '');
                            $item.val(val);
                        }
                        break;
                    case 'ltrim':
                        if (validator.reg.ltrim.test(val)) {
                            val = val.replace(validator.reg.ltrim, '');
                            $item.val(val);
                        }
                        break;
                }

                if (!notTrim) {
                    val = $.trim(val);
                }
            }

            for (var i = 0, l = patterns.length; i < l && result; i++) {
                var temp = patterns[i];
                if (typeof validator[temp] === 'function') {
                    validator.msg = msgs[i] ? msgs[i] : '';
                    var _result = validator[temp](val, $item);
                    result = !!_result && result;
                    var msg = $item.data('msg-' + temp);
                    msg && (validator.msg = msg);
                    if (_result === 'break'){
                        break;   
                    }
                } else {
                    // pattern为空时不做验证
                    if (temp === '' && patterns.length === 1) {
                        result = true;
                    } else {
                        result = false;
                        console.warn && console.warn('validator.' + temp + ' is undefined');
                    }
                }
            }

            callback && callback(result);

            return result;
        },
        // 校验一个表单字段是否符合规则
        // 参数：dom的jquery引用,规则名称
        checkOne: function($item, val, pattern, callback) {
            validator.msg = '';
            var result = true;
            if (typeof validator[pattern] === 'function') {
                result = validator[pattern](val, $item);
            } else {
                result = pattern === '' ? true : false;
            }
            typeof callback === 'function' && callback(result, validator.msg);
            result = result === false ? validator.msg || false : result;
            return result;
        },
        validate: function($item, notTrim) {
            var result = validator.check($item, notTrim);

            validator.noResult && (validator.msg = '');

            return validator.noResult ? result : result ? validator.setSuccess($item) : validator.setError($item);
        },
        bind: function($item) {
            if ($item.closest(validator.parentSelector).find(validator.resultSelector).length === 0) {
                var $field = $item.closest(validator.fieldSelector);
                var $msg = '<span class="' + validator.resultSelector.replace(/^\./, '') + '"></span>';
                $field.length > 0 ? $field.append($msg) : $item.after($msg);
            }
            if ($item.is(':input')) {
                var validate = function() {
                    validator.validate($item);
                };
                $item.on('keyup paste', function() { // input
                    $item.data('noinput') || validate();
                });
                $item.blur(function() {
                    $item.data('noblur') || validate();
                }).focus(function() {
                    $item.data('nofocus') || validator.setTips($item);
                });
            }
        },
        all: function(selector, noResult) {
            validator.isAll = true;
            validator.noResult = !!noResult;
            var $items = selector ? $(selector) : $('[data-pattern]').not('.nopattern, .disabled');
            var result = true;
            $items.each(function() {
                result = validator.validate($(this)) && result;
            });
            validator.isAll = false;
            validator.noResult = false;
            return result;
        },
        init: function(selector) {
            var $items = selector ? $(selector) : $(':input[data-pattern]');
            $items.each(function() {
                validator.bind($(this));
            });
        },
        extend: function(name, fn) {
            validator[name] = function() {
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(validator, args);
            };
        }
    };

    // return validator;
}

Validator.prototype.setOptions = function(options) {
    this.validator = $.extend(true, this.validator, options);
    return this;
};

$.Validator = Validator;

$.validator = (new Validator()).validator;

module.exports = $.validator;

/* jshint ignore:end */