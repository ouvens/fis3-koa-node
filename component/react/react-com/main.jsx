var React = require('react');

var HelloMessage = React.createClass({
  	render: function() {
    	return <div>Hello {this.props.name}</div>;
  	}
});

render.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={App}/>
      <Route path="users" component={App}>
        <Route path="/user/:userId" component={App}/>
      </Route>
      <Route path="*" component={App}/>
    </Route>
  </Router>
), document.getElementById('root'))

module.exports = HelloMessage;
