var React = require('react'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li;

var MyComponent = React.createClass({

  getInitialState: function() {
    return {items: this.props.items, disabled: true}
  },

  componentDidMount: function() {
    this.setState({disabled: false})
  },

  handleClick: function() {
    this.setState({
      items: this.state.items.concat('Item ' + this.state.items.length)
    })
  },

  render: function() {

    return div(null,

    	button({onClick: this.handleClick, disabled: this.state.disabled}, 'Add Item'),

    	ul({children: this.state.items.map(function(item) {
        	return li(null, item)
      		})
   		})

    )
  },
});

module.exports = MyComponent;