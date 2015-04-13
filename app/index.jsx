import React from 'react'

import { Page, Pages, NotFound } from 'react-router-component'

import Home from './controller-views/Home'

let App = React.createClass({
	render: function() {
		return (
			<html>
				<head>
					<meta charSet="utf-8" />

					<title>Will your code work?</title>

					<link rel="stylesheet" href="/public/css/style.css" />

					<script defer src="/public/js/main.js" />
				</head>

				<Pages {...this.props}>
					<Page path="/" handler={Home} />
				</Pages>
			</html>
		)
	}
})

export default App