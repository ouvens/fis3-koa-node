'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var ReactContent = React.createClass({
    /**
     * props用于组件接受外部参数, 需要设置给state
     * @return {[type]} [description]
     */
    getInitialState: function() {
        console.log(this.props);
        return this.props;
    },

    /**
     * 默认的生命周期函数，生命周期图示如下
     * http://upload-images.jianshu.io/upload_images/326507-281c610cec06a015.png
     * @return {[type]} [description]
     */
    componentDidMount: function() {
        $.get(this.props.getUrl, function(result) {
            var lastGist = result[0];
            console.log(result);
            // if (this.isMounted()) {
            // this.setState({
            //   username: lastGist.owner.login,
            //   lastGistUrl: lastGist.html_url
            // });
            // }
        }.bind(this));
    },


    change: function(){
        this.setState({data: this.props.data1});
    },
    
    render: function() {
        // 不能并行写两个元素，只能放一层元素里面嵌套
        return (
            <ul>
                <li>name: {this.state.data.name}</li>
                <li>address: {this.state.data.address}</li>
                <button onClick={this.change}>按钮</button>
            </ul>
        );
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

module.exports = {
	init: function() {
        // 自定义的React类必须使用首字母大写方式命名
        var data = {
            name: 'XXouvenzhang',
            address: 'XXChina',
            age: '26',
            job: 'XXengineer'
        };

        var data1 = {
            name: '修改',
            address: '修改shenzhen',
            age: '修改26',
            job: '修改engineer'
        };

        ReactDOM.render(
            // <ReactContent url="/api/comments" /> // 从服务端获取数据
            <ReactContent data={data} data1={data1} getUrl="http://127.0.0.1:8086/org_rank.html"/>,
            document.getElementById('testHello')
        );
	}
};