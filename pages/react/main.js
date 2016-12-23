/**
 * main
 * @require './index.scss' // 无需在页面中控制 css
 */

var Redux = require('redux');

var reactContent = require('react-content');
var reactHello = require('react-hello');

const store = Redux.createStore(reducer);

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

        store.dispatch({
            type: 'content',
            data: {
                name: 'content-name-init',
                address: 'content-address-init',
                age: '26',
                job: 'content-job-init'
            }
        });

        store.dispatch({
            type: 'hello',
            data: { 
                name: 'hello-name-init',
                address: 'hello-address-init',
                age: '26',
                job: 'hello-job-init'
            }
        });

    },

    _ajaxData: function() {

    },

    _initComponent: function() {
        reactContent.init(store);
        reactHello.init(store);
    }
};

module.exports = exports;