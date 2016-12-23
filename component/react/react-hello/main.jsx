'use strict';

var React = require('react');
var ReactDOM = require('react-dom');


var HelloMessage = React.createClass({
    /**
     * props用于组件接受外部参数, 需要设置给state
     * @return {[type]} [description]
     */
    getInitialState: function() {
    	var data = this.props.data;
        return { data: data };
    },

    change: function () {
    	// body...
    },

    render: function() {
        // 不能并行写两个元素，只能放一层元素里面嵌套
        return (<div><ul><li>name:{this.state.data.name}</li><li>address:{this.state.data.address}</li></ul><button onClick={this.change}>按钮</button></div>);
    }
});

module.exports = HelloMessage;
