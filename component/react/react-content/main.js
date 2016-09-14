'use strict';
/**
 * 可以使用extends方法覆盖下列方法
 * init(data) // 初始化方法
 * _renderData(data) // 渲染数据方法
 * _bindEvent() //事件绑定
 */

var React = require('react');
var ReactDOM = require('react-dom');

var props = {
    name: 'ouvenzhang',
    address: 'China',
    age: '26',
    job: 'engineer'
};

var props2 = {
    name: 'ouven',
    address: 'China',
    age: '26',
    job: 'engineer'
};

var ReactContent = React.createClass({

    change: function(){

        // this.props.data.name = 'zhang';
        // this.props.data.address = 'wuhan';
        
        this.props.data = props;
    },
    render: function() {
        // 不能并行写两个元素，只能放一层元素里面嵌套
        return (
            <ul>
                <li>name: {this.props.data.name}</li>
                <li>address: {this.props.data.address}</li>
                <button onClick={this.change}>修改</button>
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


// 自定义的React类必须使用首字母大写方式命名
ReactDOM.render(
    <ReactContent data={props}/>,
    // <ReactContent url="/api/comments" /> // 从服务端获取数据
    document.getElementById('test')
);

// ReactDOM.render((
//   <Router history={browserHistory}>
//     <Route path="/" component={App}>
//       <Route path="about" component={App}/>
//       <Route path="users" component={App}>
//         <Route path="/user/:userId" component={App}/>
//       </Route>
//       <Route path="*" component={App}/>
//     </Route>
//   </Router>
// ), document.getElementById('root'))

module.exports = {
    init: function() {
        console.log('init');
        // console.log(React, ReactDOM);
	}
};