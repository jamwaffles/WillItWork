var React = require('react')

var App = require('../../app/index.jsx')

module.exports = function(router) {
	// Other imports go here

	// Catchall for any routes not already matched
	router.get('/', function *(next) {
		var appData = {
			path: this.path
		}

		this.body = React.renderToString(React.createElement(App, appData))
	})
}