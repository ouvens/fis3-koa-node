'use strict';
/**
 * 中间件加载
 * @type {[type]}
 */

const render = require('../lib/render');
const util = require('../lib/util');
const md5 = require('../lib/md5');
const coRequest = require('co-request');
const config = require('./common/config');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');

var component = React.createFactory(require('./rest.jsx'));

// var contents = React.renderToString(React.createElement(component));

/**
 * 用户登录页面
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const login = function*(req, res) {
	const ctx = this;
	ctx.body = yield render(ctx, 'pages/user-login', {
		session: ctx.session
	});
}


const reactController = function*(req, res) {

	let ctx = this;
	var props = {
		items: [
			'Item 0',
			'Item 1'
		]
	}

	var DOM = React.DOM,
		body = DOM.body,
		div = DOM.div,
		script = DOM.script;

	var html = ReactDOMServer.renderToStaticMarkup(body(null,

		// The actual server-side rendering of our component occurs here, and we
		// pass our data in as `props`. This div is the same one that the client
		// will "render" into on the browser from browser.js
		div({
			id: 'content',
			dangerouslySetInnerHTML: {
				__html: ReactDOMServer.renderToString(component(props))
			}
		}),

		// The props should match on the client and server, so we stringify them
		// on the page to be available for access by the code run in browser.js
		// You could use any var name here as long as it's unique
		script({
			dangerouslySetInnerHTML: {
				__html: 'var APP_PROPS = ' + safeStringify(props) + ';'
			}
		}),

		// We'll load React from a CDN - you don't have to do this,
		// you can bundle it up or serve it locally if you like
		script({
			src: '//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react.min.js'
		}),
		script({
			src: '//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react-dom.min.js'
		}),

		// Then the browser will fetch and run the browserified bundle consisting
		// of browser.js and all its dependencies.
		// We serve this from the endpoint a few lines down.
		script({
			src: '/bundle.js'
		})
	))

	// var htmlString = ReactDOMServer.renderToString(component(props))
	// A utility function to safely escape JSON for embedding in a <script> tag
	function safeStringify(obj) {
		return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
	}

	ctx.body = yield render(ctx, 'pages/react', {});
}

module.exports = {
	login: login,
	react: reactController
}