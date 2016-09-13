var React = require('react');
var ReactDOM = require('react-dom');

var reactContent = React.createClass({
  	render: function() {
    	return <div id="reactContent">my name is {this.props.name}</div>;
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
