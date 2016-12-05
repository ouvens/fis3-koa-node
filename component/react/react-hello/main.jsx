'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
/*
var Redux = require('redux');

const store = Redux.createStore(reducer);

function reducer(state, action) {
	state = state || {};
    if(action.type){

    	state[action.type] = action.data;
    }
    return state
};

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
});*/

var HelloMessage = React.createClass({
    /**
     * props用于组件接受外部参数, 需要设置给state
     * @return {[type]} [description]
     */
    getInitialState: function() {
    	var data = this.props.data;
        return { data: data };
    },

    /**
     * 默认的生命周期函数，生命周期图示如下
     * http://upload-images.jianshu.io/upload_images/326507-281c610cec06a015.png
     * @return {[type]} [description]
     */
    // componentDidMount: function() {
    //     var self = this;
    //     $.get(this.props.getUrl, function(result) {
    //         var lastGist = result[0];
    //         // console.log(result);
    //         // if (this.isMounted()) {
    //         // this.setState({
    //         //   username: lastGist.owner.login,
    //         //   lastGistUrl: lastGist.html_url
    //         // });
    //         // }
    //     }.bind(this));

    //     var store = this.props.store;

    //     function handleChange() {
    //         self.setState({ data: store.getState()['hello'] });
    //     }

    //     let unsubscribe = store.subscribe(handleChange);
    //     // unsubscribe();
    // },
    // 
    change: function () {
    	// body...
    },

    render: function() {
        // 不能并行写两个元素，只能放一层元素里面嵌套
        return (<div><ul><li>name:{this.state.data.name}</li><li>address:{this.state.data.address}</li></ul><button onClick={this.change}>按钮</button></div>);
    }
});

module.exports = HelloMessage;
