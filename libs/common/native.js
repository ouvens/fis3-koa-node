/**
 * m.xiaodao360.com
 * mobile lib
 * @author yaoyoa
 * @date 2015
 */
//baidu statistics
/*var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?a0c2d815893821a3b69bfa4e694c6a32";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();*/

/**
 * YY_dialog
 */

var md5 = require('md5');

$.fn.YY_dialog = function(p) {
	var o = $(this);
	var methods = {
		caculate: function(o) {
			var dO = $(document);
			var wO = $(window);
			var result = {
				pT: parseFloat($('body').css('padding-top').replace(/px/)),
				sT: wO.scrollTop(),
				sL: wO.scrollLeft(),
				wH: wO.height(),
				wW: wO.width()
			};
			if (typeof o != 'undefined') {
				result.dW = o.width();
				result.dH = o.height();
			}
			return result;
		},
		init: function(p) {
			var sDefault = {
				width: 'auto',
				height: 'auto',
				maxWidth: 800,
				maxHeight: 600,
				draggable: false,
				close: false,
				closable: true,
				title: false,
				dragger: false,
				pack: true,
				restrict: true,
				easyClose: false,
				autoClose: false,
				autoOpen: false,
				forceCenter: false,
				zIndex: 10000,
				posX: 0,
				posY: 0,
				buttons: false,
				mask: {
					color: '#000',
					optical: 0.5
				},
				hideScroll: false,
				showClose: false,
				dialogId: false,
				'class': ''
			};
			var s = $.extend(sDefault, p);
			var dId = s.dialogId ? s.dialogId : parseInt(Math.random() * 1000000);
			s.dialogId = dId;
			o.data('YY_dialog_s', JSON.stringify(s));

			if ($('#YY_dialog_ctn_' + dId).length > 0) $('#YY_dialog_ctn_' + dId).remove();
			var d = $('<div id="YY_dialog_ctn_' + dId + '" class="YY_dialog_ctn ' + s['class'] + '"></div>');
			//o.data('dialogId',dId);

			$('body').append(d);
			d.css({
				width: s.width,
				height: s.height,
				'position': 'absolute',
				'z-index': s.zIndex,
				'display': 'none'
			});
			var c = $('<div class="YY_dialog"></div>'); //dialog内容容器
			d.append(c);
			//o.css('position','absolute');
			var oS = methods.caculate(o); //对话框原始内容对象
			//console.log(oS);
			if (s.closable && s.pack || s.showClose) {
				if (s.showClose) {
					c.append('<del></del>');
					c.children('del').click(methods.close).css({
						'z-index': s.zIndex + 1
					});
				}
				//if (typeof (s.close) == 'function') c.children('b').get(0).close = s.close;
				if (s.autoClose) {
					c.append('<s><a></a>秒后关闭</s>');
				}
			}
			if (s.pack) {
				if (s.title && s.title != '') {
					c.append('<h2>' + s.title + '</h2>');
					if (s.draggable) d.drage({
						handle: 'h2' /*,drag:s.drag,dragStart:s.dragStart,dragStop:s.dragStop*/
					});
				}
				var cC = $('<div class="YY_dialog_content"></div>');
				c.append(cC);
				cC.css({ /*'width':oS.dW,'height':oS.dH,*/ });
				if (o.length == 1) cC.append(o);
			} else {
				c.append(o.addClass('YY_dialog_content'));
			}
			o.show();
			if (typeof(s.buttons) == "object") {
				var actCtn = $('<div class="YY_dialog_action border_top"></div>');
				c.append(actCtn);
				actCtn.addClass('button_' + s.buttons.length);
				for (n in s.buttons) {
					if (s.buttons[n].name != '' && s.buttons[n].action != null) {
						var btnAttr = ' name="' + n + '"';
						if (s.buttons[n].enter_key) btnAttr = ' focus="true"';
						var btnO = $('<button' + btnAttr + '>' + s.buttons[n].name + '</button>');
						if (typeof s.buttons[n].class != 'undefined') {
							btnO.addClass(s.buttons[n].class);
						}
						if (s.buttons[n].action == 'close')
							btnO.click(methods.close);
						else
							btnO.click(s.buttons[n].action);
						actCtn.append(btnO);
					}
				}
			}
			if (s.autoOpen) methods.open();
		},
		open: function() {
			var s = o.data('YY_dialog_s');
			if (this.auto_close) {
				$('#YY_dialog_ctn_' + s.dialogId).find('s').show().find('a').html(this.auto_close);
				setTimeout($.proxy(this.autoCloseCountDown, this), 1000);
			} else {
				$('#YY_dialog_ctn_' + s.dialogId).find('s').hide();
			}

			if (s.restrict) {
				methods.showMask();
				methods.setMask();
			}
			if (s.hideScroll) {
				$('html').css({
					'position': 'relative',
					'height': $(window).height()
				});
				$('html,body').css({
					'overflow': 'hidden'
				});
				$('body').css({
					'margin-top': -$('body').scrollTop(),
					height: $(window).height() + $('body').scrollTop()
				}).scrollTop(0);
			}
			$("#YY_dialog_ctn_" + s.dialogId).show();
			//if (s.forceCenter) {
			var dS = methods.caculate($('#YY_dialog_ctn_' + s.dialogId));
			$('#YY_dialog_ctn_' + s.dialogId).css({
				position: 'fixed',
				top: '50%',
				left: '50%',
				'margin-top': (-dS.dH + dS.pT) / 2 + 'px',
				'margin-left': -dS.dW / 2 + 'px'
			});

			//					$(window).bind('resize',methods.centerDialog);
			//					$(window).bind('scroll',methods.centerDialog);
			//}

			if (this.pos_x == null) methods.centerDialog();
		},
		close: function(type) {
			var s = o.data('YY_dialog_s');
			if (s && typeof(s.close) == 'function') s.close();
			type = (typeof type == 'undefined') ? 'normal' : type;
			if (s && s.closable) {
				//s.hideSelect(false);
				$('#YY_dialog_ctn_' + s.dialogId).hide();
				$('#YY_mask').hide();
				methods.afterClose();
				methods.closeOpen();
				if (s.easyClose) {
					$(document).unbind('keydown', methods.escClose);
					$('#YY_mask').unbind('tap', methods.close);
				}
			} else {
				//alert('此对话框内的操作在完成之前对话框将无法关闭，请继续');
			}
		},
		afterClose: function() {
			var s = o.data('YY_dialog_s');
			if (s.hideScroll) {
				$('html').css({
					'position': '',
					'height': 'auto'
				});
				var st = parseInt($('body').css('margin-top').replace('px', ''));
				$('body').css({
					'margin-top': 0,
					height: 'auto'
				});
				$('html,body').css({
					'overflow': ''
				});
				$('body').scrollTop(-st);
			}
			if (s.restrict) {
				methods.setMask();
				methods.setMask();
			}
		},
		centerDialog: function() {
			var s = o.data('YY_dialog_s');
			if (typeof s == 'undefined') return false;
			var _st = $(window).scrollTop();
			var _sl = $(window).scrollLeft();

			var dO = $('#YY_dialog_ctn_' + s.dialogId);
			if (dO.length == 0 || dO.css('display') == 'none') return false;

			var dS = methods.caculate(dO),
				_top, _left;
			/*
			if (s.hideScroll){
				_top = Math.floor((dS.wH - dS.dH + dS.pT) / 2);
				_left = Math.floor((dS.wW - dS.dW) / 2);
				var mT=parseInt($('body').css('margin-top').replace(/px/,''));
				var mL=parseInt($('body').css('margin-left').replace(/px/,''));										
					_top-=mT;
				
					_left-=mL;
			}else{
				_top = Math.floor(_st + (dS.wH - dS.dH + dS.pT) / 2);
				_left = Math.floor(_sl + (dS.wW - dS.dW) / 2);
			}
			if (dS.wW<dS.dW){
				_left=0;
				_left+=_sl;
			}
			if (dS.wH<dS.dH){
				_top=0;
				_top+=_st;
			}

			dO.css({'top':_top,'left':_left});
			*/
		},
		escClose: function(e) {
			if (e.keyCode);
		},
		//show mask layer
		showMask: function() {
			var mskO = $('#YY_mask'),
				s = o.data('YY_dialog_s');
			if (mskO.length == 0) {
				mskO = $('<div id="YY_mask"></div>');
				$('body').append(mskO);
			}
			mskO.show().css({
				'cursor': 'wait',
				'top': 0,
				'left': 0,
				width: '100%',
				height: '100%',
				'z-index': (s.zIndex - 1000),
				'background': '#000',
				'position': 'fixed',
				'opacity': '0.5'
			});
			//methods.setMask();
		},
		//fix mask width , height & position
		setMask: function() {
			var s = o.data('YY_dialog_s');
			if (typeof s == 'undefined') return false;
			var wO = methods.caculate();
			var mskO = $('#YY_mask');
			//if (mskO.length==0||mskO.css('display')=='none')return false;
			if (s.easyClose) {
				$(document).bind('keydown', methods.escClose);
				$('#YY_mask').attr('title', '点击此处即可快速[关闭]对话框');
				$('#YY_mask').bind('tap', methods.close);
			}
			//mskO.css({width:wO.sL+wO.wW,height:wO.sT+wO.wH});
			mskO.css({
				width: '100%',
				height: '100%'
			});
			if (s && s.hideScroll) {
				var mT = parseInt($('body').css('margin-top').replace(/px/, ''));
				var mL = parseInt($('body').css('margin-left').replace(/px/, ''));
				if (wO.sT == 0 && mT < 0) {
					wO.sT = 0 - mT;
				}
				if (wO.sL == 0 && mL < 0) {
					wO.sL = 0 - mL;
				}
				mskO.css({
					width: wO.sL + wO.wW - $('body').css('margin-left').replace('px', ''),
					height: wO.sT + wO.wH
				});
			}
		},
		closeOpen: function() {
			$('.YY_dialog_ctn').hide();
		},
		autoCloseTimmer: function() {
			var s = o.data('YY_dialog_s');
			if (typeof this.auto_close_time == 'undefined') this.auto_close_time = this.auto_close;
			this.auto_close_time--;
			if (this.auto_close_time > 0) {
				$('#YY_dialog_ctn_' + s.dialogId).find('s a').html(this.auto_close_time);
				setTimeout($.proxy(this.auto_close_count, this), 1000);
			} else {
				this.close_dialog();
				this.auto_close_time = this.auto_close;
			}
		},
		getDialogCount: function() {
			var count = 0;
			$('.YY_dialog_ctn').each(function() {
				if ($(this).css('display') == 'block') {
					count++;
				}
			});
			return count;
		}
	};
	var method = arguments[0];
	if (methods[method]) {
		method = methods[method];
		arguments = Array.prototype.slice.call(arguments, 1);
	} else if (typeof(method) == 'object' || !method) {
		method = methods.init;
	} else {
		$.error('Method ' + method + ' does not exist on jQuery.pluginName');
		return this;
	}
	return method.apply(this, arguments);
};

$.fn.rotate = function(p) {
	var s = {
		cycle: 1, //unit second
		interval: 0, //unit millisecond
		FPS: 20, //frames per second
		running: true,
		curFrame: 0,
		autoStart: true
	};
	s = $.extend(s, p);
	var o = $(this);
	var rotateCounter;
	var methods = {
		init: function() {
			o.data('rotate_options', s);
			methods.calc();
			if (s.autoStart) methods.start();
		},
		calc: function() {
			s.interval = parseInt(s.cycle * 1000 / s.FPS);
		},
		start: function() {
			rotateCounter = window.setInterval(methods.rotate, s.interval);
		},
		rotate: function() {
			var s = o.data('rotate_options');
			if (s && s.running) {
				var d = parseInt(360 / s.FPS) * (s.curFrame + 1);
				o.css('-webkit-transform', 'rotate(' + d + 'deg)');
				s.curFrame += 1;
				o.data('rotate_options', s);
			} else {
				window.clearInterval(rotateCounter);
			}
		},
		stop: function() {
			var s = o.data('rotate_options');
			window.clearInterval(rotateCounter);
			if (s && s.running) s.running = false;
			o.data('rotate_options', s);
		}
	};
	var method = arguments[0];
	if (methods[method]) {
		method = methods[method];
		arguments = Array.prototype.slice.call(arguments, 1);
	} else if (typeof(method) == 'object' || !method) {
		method = methods.init;
	} else {
		$.error('Method ' + method + ' does not exist on jQuery.pluginName');
		return this;
	}
	return method.apply(this, arguments);
}

/**
 * regular expression for YY_vali
 */
regex = {
	count: /^[0-9]*[1-9][0-9]*$/,
	email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	mobile: /^1[3,4,5,7,8]{1}[0-9]{9}$/,
	nameCn: /^[\u4E00-\u9FA5]{2,4}$/,
	id: /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
	phone: /^\d{3}-\d{8}$|^\d{4}-\d{7}$/,
	pass: /^.{6,20}$/,
	title: /^.{1,30}$/,
	content: /^.[\s\S]{1,200}$/,
	content500: /^.[\s\S]{1,500}$/,
	notNull: /\S+/,
	qqno: /^[1-9][0-9]{4,11}$/,
	qq: /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^[1-9][0-9]{4,11}$)/,
	tel: /(^\d{3}-\d{8}$|^\d{4}-\d{7}$)|(^1[3,4,5,7,8]{1}[0-9]{9}$)/,
	numeric: /^\s*\d+\s*$/,
	/*/^\d+$/,*/
	account: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$|^1[3,4,5,7,8]{1}[0-9]{9}$/,
	url: new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?", "gi"),
	price: function(_keyword) {
		if (_keyword == "0" || _keyword == "0." || _keyword == "0.0" || _keyword == "0.00" || _keyword == "") {
			_keyword = "0";
			return false;
		} else {
			var index = _keyword.indexOf("0");
			var length = _keyword.length;
			if (index == 0 && length > 1) { /*0开头的数字串*/
				var reg = /^[0]{1}[.]{1}[0-9]{1,2}$/;
				if (!reg.test(_keyword)) {
					return false;
				} else {
					return true;
				}
			} else { /*非0开头的数字*/
				var reg = /^[1-9]{1}[0-9]{0,10}[.]{0,1}[0-9]{0,2}$/;
				if (!reg.test(_keyword)) {
					return false;
				} else {
					return true;
				}
			}
			return false;
		}
	}
};

/**
 * YY_vali验证插件
 * @author yaoyoa
 * @date 130116
 */
$.fn.YY_vali = function(options) {
	var obj = $(this);
	var fObj = obj.find('input[func],input[regtype],input[reg],select[reg],select[regtype],select[func],textarea[reg],textarea[regtype],textarea[func]');
	var s = $.extend({
		submitType: 'form', //
		onInit: function() {}, // Function to run when validator is initialized
		onError: function() {}, // Function to run when an error is output
		onFocus: function() {}, // Function to run each time the element is focused
		onBlur: function() {}, // Function to run each time the element is blurred
		onValiStart: function() {}, // Function to run when the form is being validated
		onValiComplete: function() {}, // Function to run when the form elements are validated completed
		onValiFailed: function() {},
		onValiSuccess: function() {}, // Function to run when the form elements are validated succeed
		onSubmit: function() {}, // Function to run when the form is ready to submit
		onAjaxSuccess: function() {}, // Function to run when the Ajax request is successed
		onAjaxError: function() {}, // Function to run when the Ajax request is error
		autoSubmit: true,
		hideScroll: true,
		submitObj: null,
		visible: false,
		autoFocus: false
	}, options);
	var checkForm = function(o) {
		if (typeof o == 'undefined' && o.find('form').length == 1)
			o = $('form');
		else if (typeof o == 'undefined' && o.find('form').length != 1)
			return false;
		if (o.get(0).tagName == 'INPUT' || o.get(0).tagName == 'SELECT' || o.get(0).tagName == 'TEXTAREA') {
			selfValidate(o);
		} else {
			var result = true;
			var errorObjs = [];
			if (s.visible) {
				//fObj=fObj.filter(':visible');
			}
			fObj.each(function() {
				var o = $(this);
				if (!o.is(':enabled')) return true;
				//只要有一项验证失败则验证结果为失败
				if (selfValidate($(this)) === false) {
					result = false;
					errorObjs.push($(this));
					s.onValiFailed();
				}
			});
			if (errorObjs.length > 0 && s.autoFocus) {
				var p = $(errorObjs[0]).parents('dl'),
					t = $(errorObjs[0]).parents('dl').find('dt');
				p = p.length == 0 ? $(errorObjs[0]).parents('li') : p;
				t = t.length == 0 ? $(errorObjs[0]).parents('li').find('span').eq(0) : t;
				$(errorObjs[0]).focus();
				var top = p.offset().top - parseInt($('body').css('padding-top').replace('px', ''));
				$(window).scrollTop(top);
				var err = $(errorObjs[0]).attr('error');
				console.log(err);
				if (err == null || err == '') {
					err = t.text().replace('*', '');
					err = '请' + (errorObjs[0][0].tagName == 'SELECT' ? '选择' : '填写') + err;
				}
				xmui.notice(err);

			} else {
				//$(errorObjs[0]).focus();
			}
			console.log('vali result' + result, errorObjs);
			return result;
		}

	};
	/**
	 * 调用正则进行验证
	 */
	var selfValidate = function(o) {
		var tagName = o.attr('name');
		if (o.attr('vali') == null || typeof o.attr('vali') == 'undefined' || o.attr('vali') == 'no' || o.attr('valiCache') == 'no') {
			if (o.attr('func') != null && typeof o.attr('func') != 'undefined' && o.attr('func') != '') {
				eval('var fun=' + o.attr('func'));
				return funCheck(o, fun);
			} else if (o.attr('reg') != null && typeof o.attr('reg') != 'undefined' && o.attr('reg') != '') {
				eval('var reg=' + o.attr('reg'));
				return regCheck(o, reg);
			} else if (o.attr('regtype') != null && typeof o.attr('regtype') != 'undefined' && o.attr('regtype') != '') {
				var regtype = o.attr('regtype');
				if (typeof(regex[regtype]) == 'function') {
					return funCheck(o, regex[regtype]);
				} else {
					return regCheck(o, regex[regtype]);
				}
			} else {
				//console.log(null);
				//无验证条件跳过验证
				return null;
			}
		} else if (o.attr('vali') == 'ok') {
			induceAction(o, 'ok');
			return true;
		}
	};
	var regCheck = function(o, r) {
		if (!r.test(o.val())) {
			induceAction(o);
			return false;
			//console.log(false);
		} else {
			induceAction(o, 'ok');
			o.attr('vali', 'ok');
			return true;
		}
	};
	var funCheck = function(o, f) {
		func_result = f.call(null, o.val());
		if (!func_result) {
			induceAction(o);
			return false;
		} else {
			induceAction(o, 'ok');
			o.attr('vali', 'ok');
			return true;
		}
	};
	/**
	 * 显示验证结果
	 */
	var induceAction = function(o, t) {
		if (typeof o == 'undefined') return false;
		if (typeof t == 'undefined') t = 'error';
		var pNode = o[0].parentNode,
			pObj;
		pObj = o.parent();
		lObj = o.parents('li');
		if (lObj.length == 0) lObj = o.parents('dl');
		var tObj = pObj.find('b');
		if (typeof o.attr('tipObj') != 'undefined' && o.attr('tipObj') != null && o.attr('tipObj') != '') tObj = $(o.attr('tipObj'));
		if (tObj.length == 0) {
			//pObj.append('<label class="text-tip"></label>');
			//var tObj=pObj.find('.text-tip');
		}
		if (pNode.tagName == 'TD') {
			pObj = $(pNode).parent('tr');
		}
		var tipTarget;
		tipTarget = pObj.find('label');

		if (tipTarget.length == 0) tipTarget = pObj.find('th');
		if (tipTarget.length == 0) tipTarget = pObj.find('td').eq(0);
		if (tipTarget.length == 0) tipTarget = pObj.find('dt');

		//var tipTargetName=tipTarget.text().replace(':','');
		pObj.removeClass('notice ok error'); //取消验证的class，避免之前的验证产生遗留
		//lObj.find('.error').removeClass('error');
		o.removeClass('notice ok error');
		lObj.removeClass('notice ok error');
		if (t == 'ok') {
			pObj.removeClass('error'); //取消验证的class，避免之前的验证产生遗留
			o.removeClass('error');
			lObj.removeClass('error');
		}
		var tipStr = o.attr(t);
		if (typeof tipStr == 'undefined' || tipStr == null || tipStr == '') {
			var act = 'input ';
			if (o[0].tagName == 'SELECT') act = 'select ';
			switch (t) {
				case 'error':
					if (!tipStr || tipStr == '') tipStr = '输入出错';
					s.onError();
					break;
				case 'notice':
					if (!tipStr || tipStr == '') tipStr = '';
					break;
				case 'ok':
					if (!tipStr || tipStr == '') tipStr = '';
					break;
			}
		}

		pObj.addClass(t);
		o.addClass(t);
		lObj.addClass(t);
		//if(tObj.length==1)tObj.html(tipStr);
		//tObj.html(tipStr);
	};
	//绑定事件
	fObj.bind('blur', function() {
		checkForm($(this));
	}).bind('focus', function() {
		//induceAction($(this), 'notice');
	}).bind('change', function() {
		$(this).attr('vali', 'no');
	});
	var autoSubmit = function() {
		if (!checkForm(obj)) return false;
		//默认ajax调用方法
		s.onValiSuccess();
		if (s.submitType == 'ajax') {
			var formData = obj.serialize();
			$.ajax({
				type: "POST",
				url: obj.attr('action'),
				cache: false,
				data: formData,
				success: s.onAjaxSuccess,
				error: s.onAjaxError
			});
			return false;
			//自定义函数
		} else if (s.submitType == 'manual') {
			s.onSubmit();
			return false;
			//原始表单提交方式
		} else if (s.submitType == 'form') {
			//do nothing
		}
		return false;
	};
	if (s.autoSubmit) {
		obj.submit(autoSubmit);
	} else {
		$(s.submitObj).click(function() {
			if (!checkForm(obj)) return false;
			s.onSubmit();
			return false;
		});
	}
};

var xdwm = {};

var requestHost = location.hostname === 'm.xiaodao360.com' ? 'http://m.xiaodao360.com' : 'http://m.xiaodao360.cn';

xdwm.Config = {
	Url: {
		test: {
			server: '',
			host: '',
			domain: 'm.xiaodao360.com',
			trgEvt: 'click'
		},
		product: {
			server: '',
			host: '',
			domain: 'm.xiaodao360.com',
			trgEvt: 'tap'
		},
		local: {
			server: '',
			host: '',
			domain: 'localhost',
			trgEvt: 'click'
		},
		active: 'test',
		qqLogin: '/qq/login.php',
		wxRedirect: '/mobile/index/callback/type/weixin/response_type/code/scope/snsapi_userinfo/state/STATE#wechat_redirect',
		download: '/index/android_ios.html?from=h5',
		appLink: ''
	},
	WX: {
		debug: false,
		appId: '',
		timestamp: '',
		nonceStr: '',
		signature: '',
		jsApiList: ''
	},
	ui: {
		dlBnr: true
	}
};
xdwm.State = {
	WX: false,
	QQ: false,
	iPad: false,
	iPhone: false,
	iOS: false,
	android: false,
	hasApp: false,
	iOS9: false
};
for (k in xdwm.Config.Url) {
	var url = xdwm.Config.Url[k];
	if (typeof(url) === 'object' && url.domain == window.location.host) {
		xdwm.Config.Url.active = k;
		break;
	}
}
window.XMUrl = xdwm.Config.Url[xdwm.Config.Url.active];

xdwm.utils = {
	routeUrl: function(u, nl) {
		if (typeof u == 'undefined') return false;
		nl = typeof nl == 'undefined' ? 0 : nl;
		return requestHost + '/mobile/route/index?nl=' + nl + '&q=' + encodeURIComponent(u);
	},
	genRnd: function() {

	},
	getStatus: function() {
		var ua = navigator.userAgent;
		if (/MicroMessenger/.test(ua)) {
			xdwm.State.WX = true;
		}
		if (/QQ/.test(ua)) {
			xdwm.State.QQ = true;
		}
		if (!!navigator.userAgent.match(/OS 9/ig)) {
			xdwm.State.iOS9 = true;
		}
		if (/iPhone/.test(ua)) {
			xdwm.State.iPhone = true;
			xdwm.State.iOS = true;
		} else if (/iPad/.test(ua)) {
			xdwm.State.iPad = true;
			xdwm.State.iOS = true;
		} else if (/Android/.test(ua)) {
			xdwm.State.android = true;
		}
		xdwm.State.aId = $('.page_ctn').attr('act_id');
		if (typeof xdwm.State.aId == 'undefined') xdwm.State.aId = XMUtl.request('id');
		xdwm.State.aType = $('.page_ctn').attr('act_type');
		if (typeof xdwm.State.aType == 'undefined') xdwm.State.aType = XMUtl.request('type');
		//app 协议url 构建
		xdwm.State.appUrl = encodeURIComponent($('body').attr('data-appurl'));
		if (typeof xdwm.State.appUrl == 'undefined') xdwm.State.appUrl = XMUtl.request('appUrl');
	},
	/*获取 url 中的 query 的值*/
	request: function(query) {
		var svalue = location.search.match(new RegExp("[\?\&]" + query + "=([^\&]*)(\&?)", "i"));
		return svalue ? svalue[1] : '';
	},
	urlDecode: function(str) {
		if (typeof str == 'undefined' || !str) return '';
		var ret = "";
		for (var i = 0; i < str.length; i++) {
			var chr = str.charAt(i);
			if (chr == "+") {
				ret += " ";
			} else if (chr == "%") {
				var asc = str.substring(i + 1, i + 3);
				if (parseInt("0x" + asc) > 0x7f) {
					ret += xdwm.utils.asc2str(parseInt("0x" + asc + str.substring(i + 4, i + 6)));
					i += 5;
				} else {
					ret += xdwm.utils.asc2str(parseInt("0x" + asc));
					i += 2;
				}
			} else {
				ret += chr;
			}
		}
		return ret;
	},
	getLen: function(str) {
		///<summary>获得字符串实际长度，中文2，英文1</summary>
		///<param name="str">要获得长度的字符串</param>
		var realLength = 0,
			len = str.length,
			charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 2;
		}
		return realLength;
	},
	getRelLen: function(str) {
		///<summary>获得字符串实际长度，中文2，英文1</summary>
		///<param name="str">要获得长度的字符串</param>
		var realLength = 0,
			len = str.length,
			charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			realLength += 1;
		}
		return realLength;
	},
	/** 
	 * js截取字符串，中英文都能用 
	 * @param str：需要截取的字符串 
	 * @param len: 需要截取的长度 
	 */
	cutStr: function(str, l) {
		var strLen = 0;
		var len = str.length;
		strCut = new String();
		for (var i = 0; i < len; i++) {
			a = str.charAt(i);
			strLen++;
			if (escape(a).length > 4) {
				//中文字符的长度经编码之后大于4  
				strLen++;
			}
			strCut = strCut.concat(a);
			if (strLen >= l) {
				strCut = strCut.concat("...");
				return strCut;
			}
		}
		//如果给定字符串小于指定长度，则返回源字符串；  
		if (strLen < l) {
			return str;
		}
	},
	asc2str: function(ascasc) {
		return String.fromCharCode(ascasc);
	},
	genId: function(l) {
		l = typeof l == 'undefined' ? 2 : l;
		var S4 = function() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			},
			result = '';
		for (var i = 0; i < l; i++) {
			result += S4();
		}
		return result;
	},
	loadImage: function(url, callback) {
		var img = new Image(); //创建一个Image对象，实现图片的预下载  
		img.src = url;

		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
			callback.call(img);
			return; // 直接返回，不用再处理onload事件  
		}
		img.onload = function() { //图片下载完毕时异步调用callback函数。  
			callback.call(img); //将回调函数的this替换为Image对象  
		};
	},
	formatTimestamp: function(s, sH) {
		sH = typeof sH == 'undefined' ? '00:00' : sH;
		var time = new Date(s.substr(0, 4), s.substr(5, 2) - 1, s.substr(8, 2), sH.substr(0, 2), sH.substr(3, 2));
		return Math.round(time.getTime() / 1000);
	},
	formatTime: function(s, all) {
		all = typeof all == 'undefined' ? false : all;
		var time = new Date(s * 1000);
		var month = XMUtl.pad(time.getMonth() + 1, 2);
		var date = XMUtl.pad(time.getDate(), 2);
		var hour = XMUtl.pad(time.getHours(), 2);
		var min = XMUtl.pad(time.getMinutes(), 2);
		var sec = XMUtl.pad(time.getSeconds(), 2);
		var result = time.getFullYear() + '-' + month + '-' + date;
		if (all && (hour != 0 || min != 0)) {
			result += ' ' + hour + ':' + min;
		}
		return result;
	},
	formatTS: function(t, p) {
		p = typeof p == 'undefined' ? true : p;
		var time = new Date(t * 1000);
		var result = [time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes()];
		if (p) {
			for (var i = 1; i < result.length; i++) {
				result[i] = XMUtl.pad(result[i], 2);
			}
		}
		return result;
	},
	formatSpokenTime: function(t) {
		var now = parseInt(new Date().getTime() / 1000);
		if (now - t < 60) {
			s = '刚刚';
		} else if (now - t < 3600) {
			s = parseInt((now - t) / 60) + '分钟前';
		} else {
			var now = XMUtl.formatTS(new Date().getTime() / 1000);
			var des = XMUtl.formatTS(t);
			if (now[0] == des[0] && now[1] == des[1]) {
				if (now[2] == des[2]) { //today
					s = (now[3] - des[3]) + '小时前';
				} else if (now[2] - des[2] == 1) {
					s = '昨日 ' + des[3] + ':' + des[4];
				} else if (now[2] - des[2] == 2) {
					s = '前日 ' + des[3] + ':' + des[4];
				} else {
					s = des[0] + '-' + des[1] + '-' + des[2] + ' ' + des[3] + ':' + des[4];
				}
			} else {
				s = des[0] + '-' + des[1] + '-' + des[2] + ' ' + des[3] + ':' + des[4];
			}
		}
		return s;
	},
	WXCfg: function(a, t, s, n, j) {
		//if (typeof wx!='object')return false;
		j = typeof j == 'undefined' ? ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] : j;
		xdwm.Config.WX = {
			debug: false,
			appId: a,
			timestamp: t,
			nonceStr: n,
			signature: s,
			jsApiList: j
		};
		wx.config(xdwm.Config.WX);
	},
	WXShare: function(t, d, l, i, s, c) {
		i = typeof i == 'undefined' ? 'http://www.xiaodao360.com/Public/mobile/images/logo_light.png' : i;
		s = typeof s == 'undefined' ? function() {} : s;
		c = typeof c == 'undefined' ? function() {} : c;
		wx.ready(function() {
			var cfg = {
				title: t,
				desc: d,
				link: l,
				imgUrl: i,
				dataUrl: '',
				type: '',
				success: s,
				cancel: c
			};
			wx.onMenuShareAppMessage(cfg);
			delete cfg.type;
			delete cfg.dataUrl;
			wx.onMenuShareTimeline(cfg);
			wx.onMenuShareQQ(cfg);
			wx.onMenuShareWeibo(cfg);
			wx.onMenuShareQZone(cfg);
		});
	},
	setCookie: function(c_name, value, expiredays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;domain=." + XMUrl.domain;
	},
	getCookie: function(Name) {
		var search = Name + "=";
		var returnvalue = "";
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) end = document.cookie.length;
				returnvalue = (document.cookie.substring(offset, end));
			}
		}
		return returnvalue;
	},
	pad: function() {
		var tbl = [];
		return function(num, n) {
			var len = n - num.toString().length;
			if (len <= 0) return num;
			if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
			return tbl[len] + num;
		}
	}(),
	testApp: function(url) {

		url = typeof url == 'undefined' ? 'xiaodao360://activity/detail/id/6021/type/0' : url;
		var timeout, t = 2000,
			hasApp = true;
		setTimeout(function() {
			if (hasApp) {
				xdwm.State.hasApp = true;
			} else {
				xdwm.State.hasApp = false;
			}
			document.body.removeChild(ifr);
		}, 2000)

		var t1 = Date.now();
		var ifr = document.createElement("iframe");
		ifr.setAttribute('src', url);
		ifr.setAttribute('style', 'display:none');
		document.body.appendChild(ifr);
		timeout = setTimeout(function() {
			var t2 = Date.now();
			if (!t1 || t2 - t1 < t + 100) {
				hasApp = false;
			}
		}, t);
	},
	dlApp: function(e) {
		var self = this,
			t1 = Date.now(),
			t = 600,
			hasApp = true,
			st = xdwm.State,
			appUrl = $('body').attr('data-appurl') || '',
			el = e && e.target || e && e.srcElememt;

		/**
		 * 这里使用data-appurl保存app的uri,否则使用url跳转
		 * @param  {[type]} appUrl [description]
		 * @return {[type]}        [description]
		 */
		if ($(self).attr('class') || $(self).attr('type') === 'button' || el && $(el).attr('type') === 'button') {
			url = appUrl || 'xiaodao360://activity/detail/id/' + xdwm.State.aId + '/type/' + xdwm.State.aType;
			var ifr = document.createElement("iframe");
			ifr.setAttribute('style', 'display:none');
			document.body.appendChild(ifr);
			ifr.setAttribute('src', url);
			if (st.WX || st.QQ) {
				var WXNotice = $('<section class="wx_notice"><p>请点击页面右上角<br/>选择【<b>在Safari中打开</b>】</p></section>');
				$('body').append(WXNotice);
				WXNotice.show();

				if (!st.iOS) WXNotice.find('b').html('在浏览器中打开');

				$('.wx_notice').on(XMUrl.trgEvt, function() {
					$(this).hide();
				});
				return false;
			}
			var timeout = setTimeout(function() {
				var t2 = Date.now();
				if (!t1 || t2 - t1 < t + 100) {
					hasApp = false;
				}
			}, t);
			setTimeout(function() {
				if (!hasApp) {
					location.href = xdwm.Config.Url.download + '&id=' + xdwm.State.aId + '&type=' + xdwm.State.aType + '&appUrl=' + encodeURIComponent($('body').attr('data-appurl'));
				}
				document.body.removeChild(ifr);
			}, 1000);
			return false;
		} else {
			window.location.href = 'http://www.xiaodao360.com/index/android_ios.html?_wv=3';
			return;
		}
	}
};
window.XMUtl = xdwm.utils;
xdwm.ui = {};
xdwm.ui.init = function() {
	xdwm.ui.showDlBnr();
};
/**
display or hide top download banner
@author yao
@param t[true] true:show,false:hide banner
@param f[false] force to set the banner, rewrite the globe conf & url conf. when banner was displayed， the close method has the highest priority
*/
xdwm.ui.showDlBnr = function(t, f, copywriting) {
	f = typeof f == 'undefined' ? false : f;
	if (typeof t != 'undefined' && t == false) {
		$('.top_download').remove();
		$('body').removeClass('top_event_3');
		return false;
	}
	if (xdwm.utils.request('inApp') == 1) {
		return false;
	} else {
		if ($('.top_download').length == 0) {
			var str = '<section class="top_download top_event_3_cont border_bottom">' +
				'<img src="http://www.xiaodao360.com/Public/mobile/images/logo_light.png"/>' +
				'<b>' + (copywriting || '校导—大学生成长社区') + '</b>' +
				'<a href="' + xdwm.Config.Url.download + '">下载APP</a>' +
				'<del>×</del>' +
				'</section>';
			$('.page_ctn').before(str);
			$('.top_event_3_cont').on(XMUrl.trgEvt, 'a', XMUtl.dlApp);
		}
		$('body').addClass('top_event_3');
	};
};

/**
show a notice on page buttom
@author yao
@param s msg to show
*/
xdwm.ui.notice = function(s) {
	if ($('.YY_notice').length > 0) {
		$('.YY_notice').remove();
	}
	var o = $('<dialog class="YY_notice">' + s + '</dialog>');
	$('body').append(o);
	setTimeout(function() {
		o.remove();
	}, 3000);
};
/**
show a loader animation on page
@author yao
@param p object. p.mask [true] show a mask to cover the page, p.str[...] text on the animation
*/
xdwm.ui.loader = function(p) {
	var key;
	this.s = {
		mask: true,
		autoOpen: true,
		str: '正在努力加载...'
	};
	this.s = $.extend(this.s, p);
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] == 'string') {
			key = 'str';
		} else if (typeof arguments[i] == 'function') {
			key = 'cb';
		} else if (typeof arguments[i] == 'boolean') {
			key = 't';
		}
		this.s[key] = arguments[i];
	}
	this.s.prefix = 'YY_loader_';
	this.s.dialogId = this.s.prefix + XMUtl.genId();
	if ($('#' + this.s.dialogId).length == 1) {
		$('#' + this.s.dialogId).remove();
	}

	var c = $('<div class="loader_dialog" id="' + this.s.dialogId + '">' + this.s.str + '</div>');

	var pInfo = {
		restrict: true,
		dialogId: this.s.dialogId,
		pack: false,
		closable: true,
		width: '6.25rem',
		height: '6.25rem',
		easyClose: false,
		showClose: false,
		forceCenter: true
	};
	if (typeof this.s.cb != 'undefined') pInfo.close = b;
	if (typeof this.s.str != 'undefined' && this.s.str != '') {
		c.html('<b>' + this.s.str + '</b>');
	}
	if (!this.s.mask) {
		pInfo.restrict = false;
		c.addClass('loader_bg');
	}
	$('body').append(c);
	c.YY_dialog(pInfo);
	this.openDialog = function() {
		$('#' + this.s.dialogId).YY_dialog('open');
	};
	this.open = function() {
		$('#' + this.s.dialogId).YY_dialog('open');
	};
	if (this.s.autoOpen) this.open();
	this.close = function() {
		$('#' + this.s.dialogId).YY_dialog('close');
	};
};
xdwm.ui.alert = function(p) {
	var s = {
		title: '您确定继续操作吗？',
		ok: 'close'
	};
	s.prefix = 'YY_alert';
	s.dialogId = s.prefix;
	if ($('#' + s.dialogId).length == 1) {
		$('#' + s.dialogId).remove();
	}
	if (typeof p == 'object')
		s = $.extend(s, p);
	else if (typeof p == 'string')
		s.title = p;
	var c = $('<div id="' + s.dialogId + '"></div>');

	var pInfo = {
		restrict: true,
		dialogId: s.dialogId,
		pack: false,
		'class': 'alert_dialog',
		closable: true,
		easyClose: false,
		showClose: false,
		forceCenter: true
	};
	if (typeof s.cb != 'undefined') pInfo.close = b;
	if (typeof s.title != 'undefined' && s.title != '') {
		c.html(s.title);
	}
	pInfo.buttons = [];
	if (s.cancel != null) pInfo.buttons.push({
		name: '取消',
		action: 'close'
	});
	pInfo.buttons.push({
		name: '确定',
		class: 'green',
		action: function() {
			if (s.ok != 'close') {
				s.ok();
				$('#YY_alert').YY_dialog('close');
			} else {
				$('#YY_alert').YY_dialog('close');
			}
		}
	});
	$('body').append(c);
	c.YY_dialog(pInfo);

	this.open = function() {
		$('#YY_alert').YY_dialog('open');
	};
	this.open();
	this.close = function() {
		$('#YY_alert').YY_dialog('close');
	};
};
xdwm.ui.wordCount = function(p, t) {
	this.o = p.find('textarea');
	this.p = p;
	this.t = t;
	this.max = parseInt(t.find('b').text());
	var that = this;
	this.count = function() {
		window.clearTimeout(that.autoCount);
		var len = that.o.val().length,
			s;
		var err = false;
		if (that.o.val().length <= that.max) {
			s = '还可以输入<b>' + (that.max - len) + '</b>个字';
		} else {
			s = '已经超出<b>' + (len - that.max) + '</b>个字'
		}
		if (s != t.html()) {
			that.t.html(s);
			if (err) {
				that.p.addClass('error');
			} else {
				that.o.removeClass('error');
			}
		}
		that.autoCount = window.setTimeout(that.count, 300);
	};
	//p.on('keyup', 'textarea', $.proxy(this.count, this)).on('keyup', 'textarea', $.proxy(this.count, this));
	p.on('focus', 'textarea', function() {
		that.autoCount = window.setTimeout(that.count, 300);
	}).on('blur', 'textarea', function() {
		window.clearTimeout(that.autoCount);
	});
};
xdwm.ui.datePicker = null;
xdwm.ui.initDatePicker = function(o) {
	if (o) o.attr('readonly', 'readonly').addClass('XMDateSelector');
	if (xdwm.ui.datePicker == null) {
		xdwm.ui.datePicker = new dateSelector({
			def: '1995-06-15'
		});
	}
};
xdwm.ui.timePicker = null;
//time picker callback buffer
xdwm.ui.timePickerBuffer = [];
xdwm.ui.initTimePicker = function(o, cb) {
	xdwm.ui.timePickerBuffer.push(cb);
	if (o) o.attr('readonly', 'readonly').addClass('XMTimeSelector').attr('timePickerCB', xdwm.ui.timePickerBuffer.length - 1);
	if (xdwm.ui.timePicker == null) {
		xdwm.ui.timePicker = new timeSelector();
	}
};
xdwm.ui.cityPicker = null;
xdwm.ui.cityPickerBuffer = [];
xdwm.ui.initCityPicker = function(o, cb) {
	if (typeof cb != 'undefined') xdwm.ui.cityPickerBuffer.push(cb);
	if (o) o.attr('readonly', 'readonly').addClass('XMCitySelector').attr('cityPickerCB', xdwm.ui.cityPickerBuffer.length - 1);;
	if (xdwm.ui.cityPicker == null) {
		xdwm.ui.cityPicker = new xdwm.School.selCity();
	}
};
xdwm.ui.schoolPicker = null;
xdwm.ui.schoolPickerBuffer = [];
xdwm.ui.initSchoolPicker = function(o, cb) {
	if (typeof cb != 'undefined') xdwm.ui.schoolPickerBuffer.push(cb);
	if (o) o.attr('readonly', 'readonly').addClass('XMSchoolSelector').attr('schoolPickerCB', xdwm.ui.schoolPickerBuffer.length - 1);;
	if (xdwm.ui.schoolPicker == null) {
		xdwm.ui.schoolPicker = new xdwm.School.selSchool();
	}
};
/**
show a single option select sub page
@author yao
@param data array, data to show. [{id: "1", name: "北京市"}]
@param title string, title on the page
@param cb function, trigger when click the option
@param bk function, trigger when close the option sub page
*/
xdwm.ui.selection = function(data, title, cb, bk) {
	var s = '<div class="opt_box"><h3><button type="button" class="back"></button><b>' + (title) + '</b></h3><ul>';
	for (var k in data) {
		var attr = [];
		for (var j in data[k]) {
			attr.push('XMData_' + j + '="' + data[k][j] + '"');
		}
		s += '<li ' + attr.join(' ') + '>' + data[k].name + '</li>';
	}

	s += '</ul></div>';
	var box = $(s);
	$('body').append(box);
	this.open = function() {
		$('.page_ctn').hide();
		box.show()
	};
	box.find('.opt_box li').addClass('border_top');
	this.open();
	$('body').scrollTop(0);
	box.on('click', 'li', cb).on('click', 'h3 button.back', $.proxy(function() {
		box.hide();
		$('.page_ctn').show();
		bk();
	}, this));
	this.close = function() {
		$('.page_ctn').show();
		box.hide();
	};
};

xdwm.xmui = xdwm.ui;
xdwm.user = {
	//request login
	Login: {
		login: function(cb) {
			var e = typeof event == 'undefined' ? window.event : event;
			var o = $('.xdwm_login_dialog'),
				btn = o.find('.form button');
			btn.html('正在登录').addClass('loading').prop('disabled', true);
			data = {
				username: o.find('input').eq(0).val(),
				password: md5(o.find('input').eq(1).val())
			}

			$.ajax({
				url: '/api/v1/user/auth',
				data: data,
				type: 'post',
				hrFields: {
					withCredentials: false
				},
				crossDomain: true,
				dataType: 'json',

				beforeSend: function(xhr, settings) {
					xhr.withCredentials = false;
				},

				success: function(resp) {
					btn.removeClass('loading').html('立即登录');

					document.cookie = 'id=' + resp.id;
					window.mid = resp.id;

					if (resp.status === 0) {
						location.href = "/user_complete.html?username=" + o.find('input').eq(0).val() + '&token=' + md5(o.find('input').eq(1).val());
					}

					if (resp.id) {
						btn.html('登录成功');
						if (cb) cb();
						window.setTimeout(function() {
							btn.html('立即登录').prop('disabled', false);
							o.YY_dialog('close');
						}, 500);
					} else {
						btn.prop('disabled', false);
						if (resp.status == '-2') {
							var msg = '密码错误',
								style = 'error';
							o.find('input').eq(1).attr('class', style).siblings('b').html(msg).parent().attr('class', style);
						} else if (resp.status == '-1') {
							var msg = '帐号不存在',
								style = 'error';
							o.find('input').eq(0).attr('class', style).siblings('b').html(msg).parent().attr('class', style);
						}
					}
				}
			});
			return false;
		},
		//show login dialog
		show: function(p) {
			this.s = {
				redirectUrl: window.location.href,
				cb: function() {}
			};
			this.s = $.extend(this.s, p);
			this.s.dialogId = 'xdwm_login_dialog';
			var o = $('.' + this.s.dialogId);
			if (o.length == 0) {
				var lstr = '<div class="' + this.s.dialogId + '" id="' + this.s.dialogId + '"><del></del>' +
					'<h3 class="border_bottom">登录</h3>' +
					'<section class="form">' +
					'<p><input type="tel" placeholder="请输入手机号" regtype="mobile"/><b></b></p>' +
					'<p><input type="password" placeholder="请输入密码" regtype="notNull"/><b></b></p>' +
					'<button type="button">立即登录</button>' +
					'</section>' +
					'<section class="link">' +
					'<h4 class="border_bottom">其他方式直接登录</h4>' +
					'<a href="javascript:void(0)" class="wx"></a><a href="javascript:void(0)" class="qq"></a>' +
					'</section></div>';
				$('body').append(lstr);
				o = $('.' + this.s.dialogId);
				var cb = this.s.cb;
				o.find('.form').YY_vali({
					dialogId: this.s.dialogId,
					submitObj: o.find('button'),
					autoSubmit: false,
					submitType: 'manual',
					onSubmit: function() {
						XMuser.Login.login(cb);
					}
				});
				o.find('del').on('click', function() {
					o.YY_dialog('close');
				});
				var pInfo = {
					restrict: true,
					autoOpen: true,
					dialogId: this.s.dialogId,
					pack: false,
					'class': 'login_dialog',
					closable: true,
					easyClose: false,
					showClose: false,
					forceCenter: true
				};
				o.YY_dialog(pInfo);
				XMUtl.setCookie('get_url', this.s.redirectUrl); //define login success redirect url

				var WXCfg = xdwm.Config.WX;
				if (xdwm.State.WX) {
					if (WXCfg.appId != '') {
						o.find('.link a.wx').show().attr('href', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WXCfg.appId + '&redirect_uri=' + encodeURIComponent('http://www.xiaodao360.com' + xdwm.Config.Url.wxRedirect) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect');
					}
				} else {
					o.find('.link a.wx').hide();
				}
				o.find('.link a.qq').attr('href', requestHost + xdwm.Config.Url.qqLogin);
			} else {
				o.find('input').val('');
				o.find('.error').removeClass('error');
				o.find('b').html('');
				o.find('[vali]').removeAttr('vali');
				o.YY_dialog('open');
			}
		}
	}
};
window.XMuser = xdwm.user;

xdwm.napi = {
	Bridge: null,
	buffer: []
};
xdwm.napi.init = function() {};
xdwm.napi.send = function(m, p, c) {
	if (xdwm.napi.Bridge != null) {
		xdwm.napi.sendToNative([m, p, c]);
	} else {
		xdwm.napi.buffer.push([m, p, c]);
		console.log('set buffer');
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			if (!WebViewJavascriptBridge._messageHandler) {
				WebViewJavascriptBridge.init(function(data, responseCallback) {
					responseCallback(data);
					console.log('init');
				});
			}
			xdwm.napi.Bridge = WebViewJavascriptBridge;
			xdwm.napi.buffer.forEach(xdwm.napi.sendToNative);
			xdwm.napi.buffer = [];
		}, false)
	}
};
xdwm.napi.sendToNative = function(mpc) {
	console.log('run', mpc);
	if (typeof mpc[0] == 'undefined' || mpc[0] == '') return false;
	var p = typeof mpc[1] != 'undefined' ? mpc[1] : '';
	var c = typeof mpc[2] != 'undefined' ? mpc[2] : function() {};
	xdwm.napi.Bridge.callHandler(mpc[0], p, c);
};
xdwm.napi.share = function(d) {
	if (xdwm.napi.Bridge != null) {
		xdwm.napi.Bridge.registerHandler('getShareInfo', function(data, responseCallback) {
			responseCallback(d);
		});
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			WebViewJavascriptBridge.init(function(data, responseCallback) {
				responseCallback(data);
			});
			xdwm.napi.Bridge = WebViewJavascriptBridge;
			xdwm.napi.share(d);
		}, false);
	}
};
xdwm.napi.regHandler = function(f, c) {
	if (xdwm.napi.Bridge != null) {
		xdwm.napi.Bridge.registerHandler(f, function(data, responseCallback) {
			c();
		});
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			console.log('reg init');
			xdwm.napi.Bridge = WebViewJavascriptBridge;
			xdwm.napi.regHandler(f, c);
		}, false);
	}
};

xdwm.serverRoute = (function() {
	return location.hostname === 'm.xiaodao360.com' ? 'http://api.xiaodao.com' : 'http://test.xiaodao360.cn'
})();
//全局初始化方法
xdwm.init = function() {
	//scale page

	XMUtl.getStatus();
	xdwm.ui.init();
	xdwm.napi.init();
};

//全局初始化
xdwm.init();

module.exports = xdwm;