'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var ReactContent = React.createClass({
    /**
     * props用于组件接受外部参数, 需要设置给state
     * @return {[type]} [description]
     */
    getInitialState: function() {
        var data = this.props.store.getState();
        return { data: data['hello'] };
    },

    /**
     * 默认的生命周期函数，生命周期图示如下
     * http://upload-images.jianshu.io/upload_images/326507-281c610cec06a015.png
     * @return {[type]} [description]
     */
    componentDidMount: function() {
        var self = this;
        $.get(this.props.getUrl, function(result) {
            var lastGist = result[0];
            // console.log(result);
            // if (this.isMounted()) {
            // this.setState({
            //   username: lastGist.owner.login,
            //   lastGistUrl: lastGist.html_url
            // });
            // }
        }.bind(this));

        var store = this.props.store;

        function handleChange() {
            self.setState({ data: store.getState()['hello'] });
        }

        let unsubscribe = store.subscribe(handleChange);
        // unsubscribe();
    },

    change: function() {
        var hello = this.props.store.getState()['hello'];
        
        hello.name = 'ouven';
        hello.address = 'ouven-address';
        this.props.store.dispatch({
            type: 'hello',
            data: hello
        });
        this.setState({ data: this.props.store.getState()['hello'] });
    },

    render: function() {
        // 不能并行写两个元素，只能放一层元素里面嵌套
        return (<div><ul><li>name:{this.state.data.name}</li><li>address:{this.state.data.address}</li></ul><button onClick={this.change}>按钮</button></div>);
    },

    ajaxData: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ data: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
});

ReactContent['init'] =  function(store) {
    ReactDOM.render(
        // <ReactContent url="/api/comments" /> // 从服务端获取数据
        <ReactContent store={ store } getUrl = "http://127.0.0.1:8086/org_rank.html" /> ,
        document.getElementById('testHello')
    );
}

module.exports = ReactContent;
