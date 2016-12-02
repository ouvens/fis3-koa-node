'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var ReactContent = React.createClass({

    getInitialState: function() {
        var data = this.props.store.getState();
        return { data: data['content'] };
    },

    change: function(){

        // 修改本组件内容
        this.props.store.dispatch({
            type: 'content',
            data: { 
                name: 'content-update',
                address: 'content-update',
                age: 'content-update',
                job: 'content-update'
            }
        });
        this.setState({ data: this.props.store.getState()['content'] });

        this._triggerHello();
    },

    render: function() {
        // 不能并行写两个元素，只能放一层元素里面嵌套
        return (
            <div>
            <div onClick={this.change}>content组件：{this.state.data.name}</div>
            <ul>
                <li>name: {this.state.data.name}</li>
                <li>address: {this.state.data.address}</li>
                <li>job: {this.state.data.job}</li>
                <button onClick={this.change}>修改</button>
            </ul>
            </div>
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
                // console.log(this.props);
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    // 触发其它不想关组件变化
    _triggerHello: function(){

        // 修改hello组件的store
        var hello = this.props.store.getState()['hello'];
        hello.name = 'ouven';

        this.props.store.dispatch({
            type: 'hello',
            data: hello
        });
    },
});

module.exports = {
    // 所有组件init接受store
    init: function(store) {
        // 自定义的React类必须使用首字母大写方式命名
        ReactDOM.render(
            <ReactContent store={store}/>,
            // <ReactContent url="/api/comments" /> // 从服务端获取数据
            document.getElementById('test')
        );
    }
};


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