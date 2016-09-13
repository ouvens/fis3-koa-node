var React = require('react');
var ReactDOM = require('react-dom');

var HelloMessage = React.createClass({
  	render: function() {
    	return <div id="reactHello">Hello {this.props.name}</div>;
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

module.exports= HelloMessage;
