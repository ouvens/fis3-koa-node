var React = require('react');
var ReactDOM = require('react-dom');

var reactContent = React.createClass({
    /**
     * props用于组件接受外部参数, 需要设置给state
     * @return {[type]} [description]
     */
    getInitialState: function() {
    	var data = this.props.data;
        return { data: data };
    },
  	render: function() {
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
  	}
});

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

module.exports = reactContent;
