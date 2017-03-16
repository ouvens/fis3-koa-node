/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */

var Redux = require('redux');

var store = Redux.createStore(reducer);

var reactContent = require('react-content');
var reactHello = require('react-hello');

function reducer(state={}, action) {

    if(action.type){
        state[action.type] = action.data;
    }
    return state;
};

var exports = {

    init: function() {
        this._createStore();
        this._ajaxData();
        this._initComponent();
    },

    _createStore: function(){

        for(var key in storeData){
            store.dispatch(storeData[key]);
        }
    },

    _ajaxData: function() {
        // 如果要做前端请求的渲染，则在ajax请求完成后进行初始化组件
    },

    // 重新渲染
    _initComponent: function() {
        reactContent.init(store);
        reactHello.init(store);
    }
};

module.exports = exports;