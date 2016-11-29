define('zepto.extend', function(require, exports, module) {

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
  
      define('touch', function(require, exports, module) {
  
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
        var touch = {},
            touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
            longTapDelay = 750,
            gesture
    
        function swipeDirection(x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >=
                Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
        }
    
        function longTap() {
            longTapTimeout = null
            if (touch.last) {
                touch.el.trigger('longTap')
                touch = {}
            }
        }
    
        function cancelLongTap() {
            if (longTapTimeout) clearTimeout(longTapTimeout)
            longTapTimeout = null
        }
    
        function cancelAll() {
            if (touchTimeout) clearTimeout(touchTimeout)
            if (tapTimeout) clearTimeout(tapTimeout)
            if (swipeTimeout) clearTimeout(swipeTimeout)
            if (longTapTimeout) clearTimeout(longTapTimeout)
            touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
            touch = {}
        }
    
        function isPrimaryTouch(event) {
            return (event.pointerType == 'touch' ||
                event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
        }
    
        function isPointerEventType(e, type) {
            return (e.type == 'pointer' + type ||
                e.type.toLowerCase() == 'mspointer' + type)
        }
    
        $(document).ready(function() {
            var now, delta, deltaX = 0,
                deltaY = 0,
                firstTouch, _isPointerType
    
            if ('MSGesture' in window) {
                gesture = new MSGesture()
                gesture.target = document.body
            }
    
            $(document)
                .bind('MSGestureEnd', function(e) {
                    var swipeDirectionFromVelocity =
                        e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                    if (swipeDirectionFromVelocity) {
                        touch.el.trigger('swipe')
                        touch.el.trigger('swipe' + swipeDirectionFromVelocity)
                    }
                })
                .on('touchstart MSPointerDown pointerdown', function(e) {
                    if ((_isPointerType = isPointerEventType(e, 'down')) &&
                        !isPrimaryTouch(e)) return
                    firstTouch = _isPointerType ? e : e.touches[0]
                    if (e.touches && e.touches.length === 1 && touch.x2) {
                        // Clear out touch movement data if we have it sticking around
                        // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                        touch.x2 = undefined
                        touch.y2 = undefined
                    }
                    now = Date.now()
                    delta = now - (touch.last || now)
                    touch.el = $('tagName' in firstTouch.target ?
                        firstTouch.target : firstTouch.target.parentNode)
                    touchTimeout && clearTimeout(touchTimeout)
                    touch.x1 = firstTouch.pageX
                    touch.y1 = firstTouch.pageY
                    if (delta > 0 && delta <= 250) touch.isDoubleTap = true
                    touch.last = now
                    longTapTimeout = setTimeout(longTap, longTapDelay)
                        // adds the current touch contact for IE gesture recognition
                    if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
                })
                .on('touchmove MSPointerMove pointermove', function(e) {
                    if ((_isPointerType = isPointerEventType(e, 'move')) &&
                        !isPrimaryTouch(e)) return
                    firstTouch = _isPointerType ? e : e.touches[0]
                    cancelLongTap()
                    touch.x2 = firstTouch.pageX
                    touch.y2 = firstTouch.pageY
    
                    deltaX += Math.abs(touch.x1 - touch.x2)
                    deltaY += Math.abs(touch.y1 - touch.y2)
                })
                .on('touchend MSPointerUp pointerup', function(e) {
                    if ((_isPointerType = isPointerEventType(e, 'up')) &&
                        !isPrimaryTouch(e)) return
                    cancelLongTap()
    
                    // swipe
                    if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                        (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))
    
                        swipeTimeout = setTimeout(function() {
                        touch.el.trigger('swipe')
                        touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                        touch = {}
                    }, 0)
    
                    // normal tap
                    else if ('last' in touch)
                    // don't fire tap when delta position changed by more than 30 pixels,
                    // for instance when moving to a point and back to origin
                        if (deltaX < 30 && deltaY < 30) {
                            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                            // ('tap' fires before 'scroll')
                            tapTimeout = setTimeout(function() {
    
                                // trigger universal 'tap' with the option to cancelTouch()
                                // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                                var event = $.Event('tap')
                                event.cancelTouch = cancelAll
                                touch.el.trigger(event)
    
                                // trigger double tap immediately
                                if (touch.isDoubleTap) {
                                    if (touch.el) touch.el.trigger('doubleTap')
                                    touch = {}
                                }
    
                                // trigger single tap after 250ms of inactivity
                                else {
                                    touchTimeout = setTimeout(function() {
                                        touchTimeout = null
                                        if (touch.el) touch.el.trigger('singleTap')
                                        touch = {}
                                    }, 250)
                                }
                            }, 0)
                        } else {
                            touch = {}
                        }
                    deltaX = deltaY = 0
    
                })
                // when the browser window loses focus,
                // for example when a modal dialog is shown,
                // cancel all ongoing events
                .on('touchcancel MSPointerCancel pointercancel', cancelAll)
    
            // scrolling the window indicates intention of the user
            // to scroll, not tap or swipe, so cancel all ongoing events
            $(window).on('scroll', cancelAll)
        });
    
        ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
            'doubleTap', 'tap', 'singleTap', 'longTap'
        ].forEach(function(eventName) {
            $.fn[eventName] = function(callback) {
                return this.on(eventName, callback)
            }
        })
    
        return $;
    });
    
  
  });
  ;
      define('localAjax', function(require, exports, module) {
  
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
            module.exports = factory(require('zepto'), require('localStorage'), require('md5'));
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
    
  
  });
  ;
      define('ajax', function(require, exports, module) {
  
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
        var jsonpID = 0,
            document = window.document,
            key,
            name,
            rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = 'application/json',
            htmlType = 'text/html',
            blankRE = /^\s*$/,
            originAnchor = document.createElement('a')
    
        originAnchor.href = window.location.href
    
        // trigger a custom event and return false if it was cancelled
        function triggerAndReturn(context, eventName, data) {
            var event = $.Event(eventName)
            $(context).trigger(event, data)
            return !event.isDefaultPrevented()
        }
    
        // trigger an Ajax "global" event
        function triggerGlobal(settings, context, eventName, data) {
            if (settings.global) return triggerAndReturn(context || document, eventName, data)
        }
    
        // Number of active Ajax requests
        $.active = 0
    
        function ajaxStart(settings) {
            if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
        }
    
        function ajaxStop(settings) {
            if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
        }
    
        // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
        function ajaxBeforeSend(xhr, settings) {
            var context = settings.context
            if (settings.beforeSend.call(context, xhr, settings) === false ||
                triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
                return false
    
            triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
        }
    
        function ajaxSuccess(data, xhr, settings, deferred) {
            var context = settings.context,
                status = 'success'
            settings.success.call(context, data, status, xhr)
            if (deferred) deferred.resolveWith(context, [data, status, xhr])
            triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
            ajaxComplete(status, xhr, settings)
        }
        // type: "timeout", "error", "abort", "parsererror"
        function ajaxError(error, type, xhr, settings, deferred) {
            var context = settings.context
            settings.error.call(context, xhr, type, error)
            if (deferred) deferred.rejectWith(context, [xhr, type, error])
            triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
            ajaxComplete(type, xhr, settings)
        }
        // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
        function ajaxComplete(status, xhr, settings) {
            var context = settings.context
            settings.complete.call(context, xhr, status)
            triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
            ajaxStop(settings)
        }
    
        // Empty function, used as default callback
        function empty() {}
    
        $.ajaxJSONP = function(options, deferred) {
            if (!('type' in options)) return $.ajax(options)
    
            var _callbackName = options.jsonpCallback,
                callbackName = ($.isFunction(_callbackName) ?
                    _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
                script = document.createElement('script'),
                originalCallback = window[callbackName],
                responseData,
                abort = function(errorType) {
                    $(script).triggerHandler('error', errorType || 'abort')
                },
                xhr = {
                    abort: abort
                },
                abortTimeout
    
            if (deferred) deferred.promise(xhr)
    
            $(script).on('load error', function(e, errorType) {
                clearTimeout(abortTimeout)
                $(script).off().remove()
    
                if (e.type == 'error' || !responseData) {
                    ajaxError(null, errorType || 'error', xhr, options, deferred)
                } else {
                    ajaxSuccess(responseData[0], xhr, options, deferred)
                }
    
                window[callbackName] = originalCallback
                if (responseData && $.isFunction(originalCallback))
                    originalCallback(responseData[0])
    
                originalCallback = responseData = undefined
            })
    
            if (ajaxBeforeSend(xhr, options) === false) {
                abort('abort')
                return xhr
            }
    
            window[callbackName] = function() {
                responseData = arguments
            }
    
            script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
            document.head.appendChild(script)
    
            if (options.timeout > 0) abortTimeout = setTimeout(function() {
                abort('timeout')
            }, options.timeout)
    
            return xhr
        }
    
        $.ajaxSettings = {
            // Default type of request
            type: 'GET',
            // Callback that is executed before request
            beforeSend: empty,
            // Callback that is executed if the request succeeds
            success: empty,
            // Callback that is executed the the server drops error
            error: empty,
            // Callback that is executed on request complete (both: error and success)
            complete: empty,
            // The context for the callbacks
            context: null,
            // Whether to trigger "global" Ajax events
            global: true,
            // Transport
            xhr: function() {
                return new window.XMLHttpRequest()
            },
            // MIME types mapping
            // IIS returns Javascript as "application/x-javascript"
            accepts: {
                script: 'text/javascript, application/javascript, application/x-javascript',
                json: jsonType,
                xml: 'application/xml, text/xml',
                html: htmlType,
                text: 'text/plain'
            },
            // Whether the request is to another domain
            crossDomain: false,
            // Default timeout
            timeout: 0,
            // Whether data should be serialized to string
            processData: true,
            // Whether the browser should be allowed to cache GET responses
            cache: true
        }
    
        function mimeToDataType(mime) {
            if (mime) mime = mime.split(';', 2)[0]
            return mime && (mime == htmlType ? 'html' :
                mime == jsonType ? 'json' :
                scriptTypeRE.test(mime) ? 'script' :
                xmlTypeRE.test(mime) && 'xml') || 'text'
        }
    
        function appendQuery(url, query) {
            if (query == '') return url
            return (url + '&' + query).replace(/[&?]{1,2}/, '?')
        }
    
        // serialize payload and append it to the URL for GET requests
        function serializeData(options) {
            if (options.processData && options.data && $.type(options.data) != "string")
                options.data = $.param(options.data, options.traditional)
            if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
                options.url = appendQuery(options.url, options.data), options.data = undefined
        }
    
        $.ajax = function(options) {
            var settings = $.extend({}, options || {}),
                deferred = $.Deferred && $.Deferred(),
                urlAnchor, hashIndex
            for (key in $.ajaxSettings)
                if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]
    
            ajaxStart(settings)
    
            if (!settings.crossDomain) {
                urlAnchor = document.createElement('a')
                urlAnchor.href = settings.url
                    // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
                urlAnchor.href = urlAnchor.href
                settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
            }
    
            if (!settings.url) settings.url = window.location.toString()
            if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
            serializeData(settings)
    
            var dataType = settings.dataType,
                hasPlaceholder = /\?.+=\?/.test(settings.url)
            if (hasPlaceholder) dataType = 'jsonp'
    
            if (settings.cache === false || (
                    (!options || options.cache !== true) &&
                    ('script' == dataType || 'jsonp' == dataType)
                ))
                settings.url = appendQuery(settings.url, '_=' + Date.now())
    
            if ('jsonp' == dataType) {
                if (!hasPlaceholder)
                    settings.url = appendQuery(settings.url,
                        settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
                return $.ajaxJSONP(settings, deferred)
            }
    
            var mime = settings.accepts[dataType],
                headers = {},
                setHeader = function(name, value) {
                    headers[name.toLowerCase()] = [name, value]
                },
                protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
                xhr = settings.xhr(),
                nativeSetHeader = xhr.setRequestHeader,
                abortTimeout
    
            if (deferred) deferred.promise(xhr)
    
            if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
            setHeader('Accept', mime || '*/*')
            if (mime = settings.mimeType || mime) {
                if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
                xhr.overrideMimeType && xhr.overrideMimeType(mime)
            }
            if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
                setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')
    
            if (settings.headers)
                for (name in settings.headers) setHeader(name, settings.headers[name])
            xhr.setRequestHeader = setHeader
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    xhr.onreadystatechange = empty
                    clearTimeout(abortTimeout)
                    var result, error = false
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                        dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
                        result = xhr.responseText
    
                        try {
                            // http://perfectionkills.com/global-eval-what-are-the-options/
                            if (dataType == 'script')(1, eval)(result)
                            else if (dataType == 'xml') result = xhr.responseXML
                            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
                        } catch (e) {
                            error = e
                        }
    
                        if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
                        else ajaxSuccess(result, xhr, settings, deferred)
                    } else {
                        ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
                    }
                }
            }
    
            if (ajaxBeforeSend(xhr, settings) === false) {
                xhr.abort()
                ajaxError(null, 'abort', xhr, settings, deferred)
                return xhr
            }
    
            if (settings.xhrFields)
                for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]
    
            var async = 'async' in settings ? settings.async : true
            xhr.open(settings.type, settings.url, async, settings.username, settings.password)
    
            for (name in headers) nativeSetHeader.apply(xhr, headers[name])
    
            if (settings.timeout > 0) abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty
                xhr.abort()
                ajaxError(null, 'timeout', xhr, settings, deferred)
            }, settings.timeout)
    
            // avoid sending empty string (#319)
            xhr.send(settings.data ? settings.data : null)
            return xhr
        }
    
        // handle optional data/success arguments
        function parseArguments(url, data, success, dataType) {
            if ($.isFunction(data)) dataType = success, success = data, data = undefined
            if (!$.isFunction(success)) dataType = success, success = undefined
            return {
                url: url,
                data: data,
                success: success,
                dataType: dataType
            }
        }
    
        $.get = function( /* url, data, success, dataType */ ) {
            return $.ajax(parseArguments.apply(null, arguments))
        }
    
        $.post = function( /* url, data, success, dataType */ ) {
            var options = parseArguments.apply(null, arguments)
            options.type = 'POST'
            return $.ajax(options)
        }
    
        $.getJSON = function( /* url, data, success */ ) {
            var options = parseArguments.apply(null, arguments)
            options.dataType = 'json'
            return $.ajax(options)
        }
    
        $.fn.load = function(url, data, success) {
            if (!this.length) return this
            var self = this,
                parts = url.split(/\s/),
                selector,
                options = parseArguments(url, data, success),
                callback = options.success
            if (parts.length > 1) options.url = parts[0], selector = parts[1]
            options.success = function(response) {
                self.html(selector ?
                    $('<div>').html(response.replace(rscript, "")).find(selector) : response)
                callback && callback.apply(self, arguments)
            }
            $.ajax(options)
            return this
        }
    
        var escape = encodeURIComponent
    
        function serialize(params, obj, traditional, scope) {
            var type, array = $.isArray(obj),
                hash = $.isPlainObject(obj)
            $.each(obj, function(key, value) {
                type = $.type(value)
                if (scope) key = traditional ? scope :
                    scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
                    // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value)
                    // recurse into nested objects
                else if (type == "array" || (!traditional && type == "object"))
                    serialize(params, value, traditional, key)
                else params.add(key, value)
            })
        }
    
        $.param = function(obj, traditional) {
            var params = []
            params.add = function(key, value) {
                if ($.isFunction(value)) value = value()
                if (value == null) value = ""
                this.push(escape(key) + '=' + escape(value))
            }
            serialize(params, obj, traditional)
            return params.join('&').replace(/%20/g, '+')
        }
    
        return $;
    });
    
  
  });
  ;
      define('gesture', function(require, exports, module) {
  
    //     Zepto.js
    //     (c) 2010-2015 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.
    
    (function(root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['zepto','./detect'], factory);
        } else if (typeof exports === 'object') {
            // Node, CommonJS之类的
            module.exports = factory(require('zepto'),require('detect'));
        } else {
            // 浏览器全局变量(root 即 window)
            root['Zepto'] = factory(root['Zepto']);
        }
    
    })(this, function($) {
      if ($.os.ios) {
        var gesture = {}, gestureTimeout
    
        function parentIfText(node){
          return 'tagName' in node ? node : node.parentNode
        }
    
        $(document).bind('gesturestart', function(e){
          var now = Date.now(), delta = now - (gesture.last || now)
          gesture.target = parentIfText(e.target)
          gestureTimeout && clearTimeout(gestureTimeout)
          gesture.e1 = e.scale
          gesture.last = now
        }).bind('gesturechange', function(e){
          gesture.e2 = e.scale
        }).bind('gestureend', function(e){
          if (gesture.e2 > 0) {
            Math.abs(gesture.e1 - gesture.e2) != 0 && $(gesture.target).trigger('pinch') &&
              $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'))
            gesture.e1 = gesture.e2 = gesture.last = 0
          } else if ('last' in gesture) {
            gesture = {}
          }
        })
    
        ;['pinch', 'pinchIn', 'pinchOut'].forEach(function(m){
          $.fn[m] = function(callback){ return this.bind(m, callback) }
        })
      }
      return $;
    });
    
  
  });
  ;
      define('md5', function(require, exports, module) {
  
    /*
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */
    
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
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
            root['md5'] = factory(root['Zepto']);
        }
    
    })(this, function($) {
        var exports = $;
        var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
        var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
        var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */
    
        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_md5(s) {
            return binl2hex(core_md5(str2binl(s), s.length * chrsz));
        }
    
        function b64_md5(s) {
            return binl2b64(core_md5(str2binl(s), s.length * chrsz));
        }
    
        function str_md5(s) {
            return binl2str(core_md5(str2binl(s), s.length * chrsz));
        }
    
        function hex_hmac_md5(key, data) {
            return binl2hex(core_hmac_md5(key, data));
        }
    
        function b64_hmac_md5(key, data) {
            return binl2b64(core_hmac_md5(key, data));
        }
    
        function str_hmac_md5(key, data) {
            return binl2str(core_hmac_md5(key, data));
        }
    
        /*
         * Perform a simple self-test to see if the VM is working
         */
        function md5_vm_test() {
            return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
        }
    
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length
         */
        function core_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
    
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
    
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
    
                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
    
                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
    
                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
    
                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
    
                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);
    
        }
    
        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }
    
        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
    
        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
    
        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
    
        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
    
        /*
         * Calculate the HMAC-MD5, of a key and some data
         */
        function core_hmac_md5(key, data) {
            var bkey = str2binl(key);
            if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
    
            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
    
            var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
            return core_md5(opad.concat(hash), 512 + 128);
        }
    
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
    
        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
    
        /*
         * Convert a string to an array of little-endian words
         * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
         */
        function str2binl(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
            return bin;
        }
    
        /*
         * Convert an array of little-endian words to a string
         */
        function binl2str(bin) {
            var str = "";
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
            return str;
        }
    
        /*
         * Convert an array of little-endian words to a hex string.
         */
        function binl2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
            }
            return str;
        }
    
        /*
         * Convert an array of little-endian words to a base-64 string
         */
        function binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }
    
        $.md5 = hex_md5;
    
        return hex_md5;
    });
    
  
  });
  ;
      define('detect', function(require, exports, module) {
  
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
        function detect(ua, platform) {
            var os = this.os = {},
                browser = this.browser = {},
                webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
                android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
                osx = !!ua.match(/\(Macintosh\; Intel /),
                ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
                ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
                iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
                webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
                win = /Win\d{2}|Windows/.test(platform),
                wp = ua.match(/Windows Phone ([\d.]+)/),
                touchpad = webos && ua.match(/TouchPad/),
                kindle = ua.match(/Kindle\/([\d.]+)/),
                silk = ua.match(/Silk\/([\d._]+)/),
                blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
                bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
                rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
                playbook = ua.match(/PlayBook/),
                chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
                firefox = ua.match(/Firefox\/([\d.]+)/),
                firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
                ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
                webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
                safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)
    
            // Todo: clean this up with a better OS/browser seperation:
            // - discern (more) between multiple browsers on android
            // - decide if kindle fire in silk mode is android or not
            // - Firefox on Android doesn't specify the Android version
            // - possibly devide in os, device and browser hashes
    
            if (browser.webkit = !!webkit) browser.version = webkit[1]
    
            if (android) os.android = true, os.version = android[2]
            if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
            if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
            if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
            if (wp) os.wp = true, os.version = wp[1]
            if (webos) os.webos = true, os.version = webos[2]
            if (touchpad) os.touchpad = true
            if (blackberry) os.blackberry = true, os.version = blackberry[2]
            if (bb10) os.bb10 = true, os.version = bb10[2]
            if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
            if (playbook) browser.playbook = true
            if (kindle) os.kindle = true, os.version = kindle[1]
            if (silk) browser.silk = true, browser.version = silk[1]
            if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
            if (chrome) browser.chrome = true, browser.version = chrome[1]
            if (firefox) browser.firefox = true, browser.version = firefox[1]
            if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
            if (ie) browser.ie = true, browser.version = ie[1]
            if (safari && (osx || os.ios || win)) {
                browser.safari = true
                if (!os.ios) browser.version = safari[1]
            }
            if (webview) browser.webview = true
    
            os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
                (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
            os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
                (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
                (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
        }
    
        detect.call($, navigator.userAgent, navigator.platform)
            // make available to unit tests
        $.__detect = detect;
        return $;
    });
    
  
  });
  ;
      define('assets', function(require, exports, module) {
  
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
    
  
  });
  ;
      define('callbacks', function(require, exports, module) {
  
    //     Zepto.js
    //     (c) 2010-2015 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.
    
    (function(root, factory) {
        if (typeof define === 'function' || typeof require === 'function' || define.amd) {
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
        // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
        // Option flags:
        //   - once: Callbacks fired at most one time.
        //   - memory: Remember the most recent context and arguments
        //   - stopOnFalse: Cease iterating over callback list
        //   - unique: Permit adding at most one instance of the same callback
        $.Callbacks = function(options) {
            options = $.extend({}, options)
    
            var memory, // Last fire value (for non-forgettable lists)
                fired, // Flag to know if list was already fired
                firing, // Flag to know if list is currently firing
                firingStart, // First callback to fire (used internally by add and fireWith)
                firingLength, // End of the loop when firing
                firingIndex, // Index of currently firing callback (modified by remove if needed)
                list = [], // Actual callback list
                stack = !options.once && [], // Stack of fire calls for repeatable lists
                fire = function(data) {
                    memory = options.memory && data
                    fired = true
                    firingIndex = firingStart || 0
                    firingStart = 0
                    firingLength = list.length
                    firing = true
                    for (; list && firingIndex < firingLength; ++firingIndex) {
                        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                            memory = false
                            break
                        }
                    }
                    firing = false
                    if (list) {
                        if (stack) stack.length && fire(stack.shift())
                        else if (memory) list.length = 0
                        else Callbacks.disable()
                    }
                },
    
                Callbacks = {
                    add: function() {
                        if (list) {
                            var start = list.length,
                                add = function(args) {
                                    $.each(args, function(_, arg) {
                                        if (typeof arg === "function") {
                                            if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                                        } else if (arg && arg.length && typeof arg !== 'string') add(arg)
                                    })
                                }
                            add(arguments)
                            if (firing) firingLength = list.length
                            else if (memory) {
                                firingStart = start
                                fire(memory)
                            }
                        }
                        return this
                    },
                    remove: function() {
                        if (list) {
                            $.each(arguments, function(_, arg) {
                                var index
                                while ((index = $.inArray(arg, list, index)) > -1) {
                                    list.splice(index, 1)
                                        // Handle firing indexes
                                    if (firing) {
                                        if (index <= firingLength) --firingLength
                                        if (index <= firingIndex) --firingIndex
                                    }
                                }
                            })
                        }
                        return this
                    },
                    has: function(fn) {
                        return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
                    },
                    empty: function() {
                        firingLength = list.length = 0
                        return this
                    },
                    disable: function() {
                        list = stack = memory = undefined
                        return this
                    },
                    disabled: function() {
                        return !list
                    },
                    lock: function() {
                        stack = undefined;
                        if (!memory) Callbacks.disable()
                        return this
                    },
                    locked: function() {
                        return !stack
                    },
                    fireWith: function(context, args) {
                        if (list && (!fired || stack)) {
                            args = args || []
                            args = [context, args.slice ? args.slice() : args]
                            if (firing) stack.push(args)
                            else fire(args)
                        }
                        return this
                    },
                    fire: function() {
                        return Callbacks.fireWith(this, arguments)
                    },
                    fired: function() {
                        return !!fired
                    }
                }
    
            return Callbacks
        }
        return $;
    });
    
  
  });
  ;
      define('cookie', function(require, exports, module) {
  
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
    
  
  });
  ;
      define('data', function(require, exports, module) {
  
    //     Zepto.js
    //     (c) 2010-2015 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.
    
    // The following code is heavily inspired by jQuery's $.fn.data()
    
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
        var data = {},
            dataAttr = $.fn.data,
            camelize = $.camelCase,
            exp = $.expando = 'Zepto' + (+new Date()),
            emptyArray = []
    
        // Get value from node:
        // 1. first try key as given,
        // 2. then try camelized key,
        // 3. fall back to reading "data-*" attribute.
        function getData(node, name) {
            var id = node[exp],
                store = id && data[id]
            if (name === undefined) return store || setData(node)
            else {
                if (store) {
                    if (name in store) return store[name]
                    var camelName = camelize(name)
                    if (camelName in store) return store[camelName]
                }
                return dataAttr.call($(node), name)
            }
        }
    
        // Store value under camelized key on node
        function setData(node, name, value) {
            var id = node[exp] || (node[exp] = ++$.uuid),
                store = data[id] || (data[id] = attributeData(node))
            if (name !== undefined) store[camelize(name)] = value
            return store
        }
    
        // Read all "data-*" attributes from a node
        function attributeData(node) {
            var store = {}
            $.each(node.attributes || emptyArray, function(i, attr) {
                if (attr.name.indexOf('data-') == 0)
                    store[camelize(attr.name.replace('data-', ''))] =
                    $.zepto.deserializeValue(attr.value)
            })
            return store
        }
    
        $.fn.data = function(name, value) {
            return value === undefined ?
                // set multiple values via object
                $.isPlainObject(name) ?
                this.each(function(i, node) {
                    $.each(name, function(key, value) {
                        setData(node, key, value)
                    })
                }) :
                // get value from first element
                (0 in this ? getData(this[0], name) : undefined) :
                // set value on all elements
                this.each(function() {
                    setData(this, name, value)
                })
        }
    
        $.fn.removeData = function(names) {
            if (typeof names == 'string') names = names.split(/\s+/)
            return this.each(function() {
                var id = this[exp],
                    store = id && data[id]
                if (store) $.each(names || store, function(key) {
                    delete store[names ? camelize(this) : key]
                })
            })
        }
    
        // Generate extended `remove` and `empty` functions
        ;
        ['remove', 'empty'].forEach(function(methodName) {
            var origFn = $.fn[methodName]
            $.fn[methodName] = function() {
                var elements = this.find('*')
                if (methodName === 'remove') elements = elements.add(this)
                elements.removeData()
                return origFn.call(this)
            }
        })
    
        return $;
    });
    
  
  });
  ;
      define('deferred', function(require, exports, module) {
  
    //     Zepto.js
    //     (c) 2010-2015 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.
    //
    //     Some code (c) 2005, 2013 jQuery Foundation, Inc. and other contributors
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
        var slice = Array.prototype.slice;
    
        function Deferred(func) {
            var tuples = [
                    // action, add listener, listener list, final state
                    ["resolve", "done", $.Callbacks({
                        once: 1,
                        memory: 1
                    }), "resolved"],
                    ["reject", "fail", $.Callbacks({
                        once: 1,
                        memory: 1
                    }), "rejected"],
                    ["notify", "progress", $.Callbacks({
                        memory: 1
                    })]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state
                    },
                    always: function() {
                        deferred.done(arguments).fail(arguments)
                        return this
                    },
                    then: function( /* fnDone [, fnFailed [, fnProgress]] */ ) {
                        var fns = arguments
                        return Deferred(function(defer) {
                            $.each(tuples, function(i, tuple) {
                                var fn = $.isFunction(fns[i]) && fns[i]
                                deferred[tuple[1]](function() {
                                    var returned = fn && fn.apply(this, arguments)
                                    if (returned && $.isFunction(returned.promise)) {
                                        returned.promise()
                                            .done(defer.resolve)
                                            .fail(defer.reject)
                                            .progress(defer.notify)
                                    } else {
                                        var context = this === promise ? defer.promise() : this,
                                            values = fn ? [returned] : arguments
                                        defer[tuple[0] + "With"](context, values)
                                    }
                                })
                            })
                            fns = null
                        }).promise()
                    },
    
                    promise: function(obj) {
                        return obj != null ? $.extend(obj, promise) : promise
                    }
                },
                deferred = {}
    
            $.each(tuples, function(i, tuple) {
                var list = tuple[2],
                    stateString = tuple[3]
    
                promise[tuple[1]] = list.add
    
                if (stateString) {
                    list.add(function() {
                        state = stateString
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock)
                }
    
                deferred[tuple[0]] = function() {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
                    return this
                }
                deferred[tuple[0] + "With"] = list.fireWith
            })
    
            promise.promise(deferred)
            if (func) func.call(deferred, deferred)
            return deferred
        }
    
        $.when = function(sub) {
            var resolveValues = slice.call(arguments),
                len = resolveValues.length,
                i = 0,
                remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
                deferred = remain === 1 ? sub : Deferred(),
                progressValues, progressContexts, resolveContexts,
                updateFn = function(i, ctx, val) {
                    return function(value) {
                        ctx[i] = this
                        val[i] = arguments.length > 1 ? slice.call(arguments) : value
                        if (val === progressValues) {
                            deferred.notifyWith(ctx, val)
                        } else if (!(--remain)) {
                            deferred.resolveWith(ctx, val)
                        }
                    }
                }
    
            if (len > 1) {
                progressValues = new Array(len)
                progressContexts = new Array(len)
                resolveContexts = new Array(len)
                for (; i < len; ++i) {
                    if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise()
                            .done(updateFn(i, resolveContexts, resolveValues))
                            .fail(deferred.reject)
                            .progress(updateFn(i, progressContexts, progressValues))
                    } else {
                        --remain
                    }
                }
            }
            if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
            return deferred.promise()
        }
    
        $.Deferred = Deferred;
        return $;
    });
    
  
  });
  ;
      define('event', function(require, exports, module) {
  
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
      var _zid = 1, undefined,
          slice = Array.prototype.slice,
          isFunction = $.isFunction,
          isString = function(obj){ return typeof obj == 'string' },
          handlers = {},
          specialEvents={},
          focusinSupported = 'onfocusin' in window,
          focus = { focus: 'focusin', blur: 'focusout' },
          hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }
    
      specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'
    
      function zid(element) {
        return element._zid || (element._zid = _zid++)
      }
      function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
          return handler
            && (!event.e  || handler.e == event.e)
            && (!event.ns || matcher.test(handler.ns))
            && (!fn       || zid(handler.fn) === zid(fn))
            && (!selector || handler.sel == selector)
        })
      }
      function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
      }
      function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
      }
    
      function eventCapture(handler, captureSetting) {
        return handler.del &&
          (!focusinSupported && (handler.e in focus)) ||
          !!captureSetting
      }
    
      function realEvent(type) {
        return hover[type] || (focusinSupported && focus[type]) || type
      }
    
      function add(element, events, fn, data, selector, delegator, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        events.split(/\s/).forEach(function(event){
          if (event == 'ready') return $(document).ready(fn)
          var handler   = parse(event)
          handler.fn    = fn
          handler.sel   = selector
          // emulate mouseenter, mouseleave
          if (handler.e in hover) fn = function(e){
            var related = e.relatedTarget
            if (!related || (related !== this && !$.contains(this, related)))
              return handler.fn.apply(this, arguments)
          }
          handler.del   = delegator
          var callback  = delegator || fn
          handler.proxy = function(e){
            e = compatible(e)
            if (e.isImmediatePropagationStopped()) return
            e.data = data
            var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
            if (result === false) e.preventDefault(), e.stopPropagation()
            return result
          }
          handler.i = set.length
          set.push(handler)
          if ('addEventListener' in element)
            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
      }
      function remove(element, events, fn, selector, capture){
        var id = zid(element)
        ;(events || '').split(/\s/).forEach(function(event){
          findHandlers(element, event, fn, selector).forEach(function(handler){
            delete handlers[id][handler.i]
          if ('removeEventListener' in element)
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
          })
        })
      }
    
      $.event = { add: add, remove: remove }
    
      $.proxy = function(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
          var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
          proxyFn._zid = zid(fn)
          return proxyFn
        } else if (isString(context)) {
          if (args) {
            args.unshift(fn[context], fn)
            return $.proxy.apply(null, args)
          } else {
            return $.proxy(fn[context], fn)
          }
        } else {
          throw new TypeError("expected function")
        }
      }
    
      $.fn.bind = function(event, data, callback){
        return this.on(event, data, callback)
      }
      $.fn.unbind = function(event, callback){
        return this.off(event, callback)
      }
      $.fn.one = function(event, selector, data, callback){
        return this.on(event, selector, data, callback, 1)
      }
    
      var returnTrue = function(){return true},
          returnFalse = function(){return false},
          ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
          eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
          }
    
      function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
          source || (source = event)
    
          $.each(eventMethods, function(name, predicate) {
            var sourceMethod = source[name]
            event[name] = function(){
              this[predicate] = returnTrue
              return sourceMethod && sourceMethod.apply(source, arguments)
            }
            event[predicate] = returnFalse
          })
    
          if (source.defaultPrevented !== undefined ? source.defaultPrevented :
              'returnValue' in source ? source.returnValue === false :
              source.getPreventDefault && source.getPreventDefault())
            event.isDefaultPrevented = returnTrue
        }
        return event
      }
    
      function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
          if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]
    
        return compatible(proxy, event)
      }
    
      $.fn.delegate = function(selector, event, callback){
        return this.on(event, selector, callback)
      }
      $.fn.undelegate = function(selector, event, callback){
        return this.off(event, selector, callback)
      }
    
      $.fn.live = function(event, callback){
        $(document.body).delegate(this.selector, event, callback)
        return this
      }
      $.fn.die = function(event, callback){
        $(document.body).undelegate(this.selector, event, callback)
        return this
      }
    
      $.fn.on = function(event, selector, data, callback, one){
        var autoRemove, delegator, $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.on(type, selector, data, fn, one)
          })
          return $this
        }
    
        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = data, data = selector, selector = undefined
        if (callback === undefined || data === false)
          callback = data, data = undefined
    
        if (callback === false) callback = returnFalse
    
        return $this.each(function(_, element){
          if (one) autoRemove = function(e){
            remove(element, e.type, callback)
            return callback.apply(this, arguments)
          }
    
          if (selector) delegator = function(e){
            var evt, match = $(e.target).closest(selector, element).get(0)
            if (match && match !== element) {
              evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
              return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
            }
          }
    
          add(element, event, callback, data, selector, delegator || autoRemove)
        })
      }
      $.fn.off = function(event, selector, callback){
        var $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.off(type, selector, fn)
          })
          return $this
        }
    
        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = selector, selector = undefined
    
        if (callback === false) callback = returnFalse
    
        return $this.each(function(){
          remove(this, event, callback, selector)
        })
      }
    
      $.fn.trigger = function(event, args){
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function(){
          // handle focus(), blur() by calling them directly
          if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
          // items in the collection might not be DOM elements
          else if ('dispatchEvent' in this) this.dispatchEvent(event)
          else $(this).triggerHandler(event, args)
        })
      }
    
      // triggers event handlers on current element just as if an event occurred,
      // doesn't trigger an actual event, doesn't bubble
      $.fn.triggerHandler = function(event, args){
        var e, result
        this.each(function(i, element){
          e = createProxy(isString(event) ? $.Event(event) : event)
          e._args = args
          e.target = element
          $.each(findHandlers(element, event.type || event), function(i, handler){
            result = handler.proxy(e)
            if (e.isImmediatePropagationStopped()) return false
          })
        })
        return result
      }
    
      // shortcut methods for `.bind(event, fn)` for each event type
      ;('focusin focusout focus blur load resize scroll unload click dblclick '+
      'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
      'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
          return (0 in arguments) ?
            this.bind(event, callback) :
            this.trigger(event)
        }
      })
    
      $.Event = function(type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
      }
      return $;
    });
    
  
  });
  ;
      define('form', function(require, exports, module) {
  
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
        $.fn.serializeArray = function() {
            var name, type, result = [],
                add = function(value) {
                    if (value.forEach) return value.forEach(add)
                    result.push({
                        name: name,
                        value: value
                    })
                }
            if (this[0]) $.each(this[0].elements, function(_, field) {
                type = field.type, name = field.name
                if (name && field.nodeName.toLowerCase() != 'fieldset' &&
                    !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
                    ((type != 'radio' && type != 'checkbox') || field.checked))
                    add($(field).val())
            })
            return result
        }
    
        $.fn.serialize = function() {
            var result = []
            this.serializeArray().forEach(function(elm) {
                result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
            })
            return result.join('&')
        }
    
        $.fn.submit = function(callback) {
            if (0 in arguments) this.bind('submit', callback)
            else if (this.length) {
                var event = $.Event('submit')
                this.eq(0).trigger(event)
                if (!event.isDefaultPrevented()) this.get(0).submit()
            }
            return this
        }
        return $;
    });
    
  
  });
  ;
      define('fx', function(require, exports, module) {
  
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
        var prefix = '',
            eventPrefix,
            vendors = {
                Webkit: 'webkit',
                Moz: '',
                O: 'o'
            },
            testEl = document.createElement('div'),
            supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
            transform,
            transitionProperty, transitionDuration, transitionTiming, transitionDelay,
            animationName, animationDuration, animationTiming, animationDelay,
            cssReset = {}
    
        function dasherize(str) {
            return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()
        }
    
        function normalizeEvent(name) {
            return eventPrefix ? eventPrefix + name : name.toLowerCase()
        }
    
        $.each(vendors, function(vendor, event) {
            if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
                prefix = '-' + vendor.toLowerCase() + '-'
                eventPrefix = event
                return false
            }
        })
    
        transform = prefix + 'transform'
        cssReset[transitionProperty = prefix + 'transition-property'] =
            cssReset[transitionDuration = prefix + 'transition-duration'] =
            cssReset[transitionDelay = prefix + 'transition-delay'] =
            cssReset[transitionTiming = prefix + 'transition-timing-function'] =
            cssReset[animationName = prefix + 'animation-name'] =
            cssReset[animationDuration = prefix + 'animation-duration'] =
            cssReset[animationDelay = prefix + 'animation-delay'] =
            cssReset[animationTiming = prefix + 'animation-timing-function'] = ''
    
        $.fx = {
            off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
            speeds: {
                _default: 400,
                fast: 200,
                slow: 600
            },
            cssPrefix: prefix,
            transitionEnd: normalizeEvent('TransitionEnd'),
            animationEnd: normalizeEvent('AnimationEnd')
        }
    
        $.fn.animate = function(properties, duration, ease, callback, delay) {
            if ($.isFunction(duration))
                callback = duration, ease = undefined, duration = undefined
            if ($.isFunction(ease))
                callback = ease, ease = undefined
            if ($.isPlainObject(duration))
                ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
            if (duration) duration = (typeof duration == 'number' ? duration :
                ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
            if (delay) delay = parseFloat(delay) / 1000
            return this.anim(properties, duration, ease, callback, delay)
        }
    
        $.fn.anim = function(properties, duration, ease, callback, delay) {
            var key, cssValues = {},
                cssProperties, transforms = '',
                that = this,
                wrappedCallback, endEvent = $.fx.transitionEnd,
                fired = false
    
            if (duration === undefined) duration = $.fx.speeds._default / 1000
            if (delay === undefined) delay = 0
            if ($.fx.off) duration = 0
    
            if (typeof properties == 'string') {
                // keyframe animation
                cssValues[animationName] = properties
                cssValues[animationDuration] = duration + 's'
                cssValues[animationDelay] = delay + 's'
                cssValues[animationTiming] = (ease || 'linear')
                endEvent = $.fx.animationEnd
            } else {
                cssProperties = []
                    // CSS transitions
                for (key in properties)
                    if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
                    else cssValues[key] = properties[key], cssProperties.push(dasherize(key))
    
                if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
                if (duration > 0 && typeof properties === 'object') {
                    cssValues[transitionProperty] = cssProperties.join(', ')
                    cssValues[transitionDuration] = duration + 's'
                    cssValues[transitionDelay] = delay + 's'
                    cssValues[transitionTiming] = (ease || 'linear')
                }
            }
    
            wrappedCallback = function(event) {
                if (typeof event !== 'undefined') {
                    if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                    $(event.target).unbind(endEvent, wrappedCallback)
                } else
                    $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout
    
                fired = true
                $(this).css(cssReset)
                callback && callback.call(this)
            }
            if (duration > 0) {
                this.bind(endEvent, wrappedCallback)
                    // transitionEnd is not always firing on older Android phones
                    // so make sure it gets fired
                setTimeout(function() {
                    if (fired) return
                    wrappedCallback.call(that)
                }, ((duration + delay) * 1000) + 25)
            }
    
            // trigger page reflow so new elements can animate
            this.size() && this.get(0).clientLeft
    
            this.css(cssValues)
    
            if (duration <= 0) setTimeout(function() {
                that.each(function() {
                    wrappedCallback.call(this)
                })
            }, 0)
    
            return this
        }
    
        testEl = null;
        return $;
    })
    
  
  });
  ;
      define('fx_methods', function(require, exports, module) {
  
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
        var document = window.document,
            docElem = document.documentElement,
            origShow = $.fn.show,
            origHide = $.fn.hide,
            origToggle = $.fn.toggle
    
        function anim(el, speed, opacity, scale, callback) {
            if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
            var props = {
                opacity: opacity
            }
            if (scale) {
                props.scale = scale
                el.css($.fx.cssPrefix + 'transform-origin', '0 0')
            }
            return el.animate(props, speed, null, callback)
        }
    
        function hide(el, speed, scale, callback) {
            return anim(el, speed, 0, scale, function() {
                origHide.call($(this))
                callback && callback.call(this)
            })
        }
    
        $.fn.show = function(speed, callback) {
            origShow.call(this)
            if (speed === undefined) speed = 0
            else this.css('opacity', 0)
            return anim(this, speed, 1, '1,1', callback)
        }
    
        $.fn.hide = function(speed, callback) {
            if (speed === undefined) return origHide.call(this)
            else return hide(this, speed, '0,0', callback)
        }
    
        $.fn.toggle = function(speed, callback) {
            if (speed === undefined || typeof speed == 'boolean')
                return origToggle.call(this, speed)
            else return this.each(function() {
                var el = $(this)
                el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
            })
        }
    
        $.fn.fadeTo = function(speed, opacity, callback) {
            return anim(this, speed, opacity, null, callback)
        }
    
        $.fn.fadeIn = function(speed, callback) {
            var target = this.css('opacity')
            if (target > 0) this.css('opacity', 0)
            else target = 1
            return origShow.call(this).fadeTo(speed, target, callback)
        }
    
        $.fn.fadeOut = function(speed, callback) {
            return hide(this, speed, null, callback)
        }
    
        $.fn.fadeToggle = function(speed, callback) {
            return this.each(function() {
                var el = $(this)
                el[
                    (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
                ](speed, callback)
            })
        }
        return $;
    });
    
  
  });
  ;
      define('localStorage', function(require, exports, module) {
  
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
    
  
  });
  ;
      define('selector', function(require, exports, module) {
  
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
        var zepto = $.zepto,
            oldQsa = zepto.qsa,
            oldMatches = zepto.matches
    
        function visible(elem) {
            elem = $(elem)
            return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
        }
    
        // Implements a subset from:
        // http://api.jquery.com/category/selectors/jquery-selector-extensions/
        //
        // Each filter function receives the current index, all nodes in the
        // considered set, and a value if there were parentheses. The value
        // of `this` is the node currently being considered. The function returns the
        // resulting node(s), null, or undefined.
        //
        // Complex selectors are not supported:
        //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
        //   ul.inner:first > li
        var filters = $.expr[':'] = {
            visible: function() {
                if (visible(this)) return this
            },
            hidden: function() {
                if (!visible(this)) return this
            },
            selected: function() {
                if (this.selected) return this
            },
            checked: function() {
                if (this.checked) return this
            },
            parent: function() {
                return this.parentNode
            },
            first: function(idx) {
                if (idx === 0) return this
            },
            last: function(idx, nodes) {
                if (idx === nodes.length - 1) return this
            },
            eq: function(idx, _, value) {
                if (idx === value) return this
            },
            contains: function(idx, _, text) {
                if ($(this).text().indexOf(text) > -1) return this
            },
            has: function(idx, _, sel) {
                if (zepto.qsa(this, sel).length) return this
            }
        }
    
        var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
            childRe = /^\s*>/,
            classTag = 'Zepto' + (+new Date())
    
        function process(sel, fn) {
            // quote the hash in `a[href^=#]` expression
            sel = sel.replace(/=#\]/g, '="#"]')
            var filter, arg, match = filterRe.exec(sel)
            if (match && match[2] in filters) {
                filter = filters[match[2]], arg = match[3]
                sel = match[1]
                if (arg) {
                    var num = Number(arg)
                    if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
                    else arg = num
                }
            }
            return fn(sel, filter, arg)
        }
    
        zepto.qsa = function(node, selector) {
            return process(selector, function(sel, filter, arg) {
                try {
                    var taggedParent
                    if (!sel && filter) sel = '*'
                    else if (childRe.test(sel))
                    // support "> *" child queries by tagging the parent node with a
                    // unique class and prepending that classname onto the selector
                        taggedParent = $(node).addClass(classTag), sel = '.' + classTag + ' ' + sel
    
                    var nodes = oldQsa(node, sel)
                } catch (e) {
                    console.error('error performing selector: %o', selector)
                    throw e
                } finally {
                    if (taggedParent) taggedParent.removeClass(classTag)
                }
                return !filter ? nodes :
                    zepto.uniq($.map(nodes, function(n, i) {
                        return filter.call(n, i, nodes, arg)
                    }))
            })
        }
    
        zepto.matches = function(node, selector) {
            return process(selector, function(sel, filter, arg) {
                return (!sel || oldMatches(node, sel)) &&
                    (!filter || filter.call(node, null, arg) === node)
            })
        }
        return $;
    });
    
  
  });
  ;
      define('stack', function(require, exports, module) {
  
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
    
  
  });
  ;
  
      return $;
  });
  

});
