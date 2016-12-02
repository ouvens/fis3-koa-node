/**
 * 生成Component基类，自动产生模块需要的方法
 * @param {[type]} $el [description]
 * 
 * 默认生成组件模板如下，可以使用extend扩展
 * @type {[type]}
 * 
    var tips = {
        $el: $('#orgContent'),
        init: function(data) {},
        _renderData: function(data) {},
        _bindEvent: function() {}
    }
 */
function Component(name, tpl) {

	this.name = name;

	/**
	 * 初始化
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.init = function(data) {
		if (window.r) {
			this._renderData(data);
		}
		this._bindEvent();
	};

}

/**
 * 组件继承方法
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
Component.prototype.extend = function(obj) {
	for (var item in obj) {
		this[item] = obj[item];
	}
}

module.exports = Component;