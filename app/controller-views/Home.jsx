import React from 'react'

import CanIUse from '../lib/CanIUse'

let HomepageController = React.createClass({
	getInitialState: function() {
		return {
			detectedFeatures: []
		}
	},

	handleTextarea: function(e) {
		let js = e.target.value

		let canIUse = new CanIUse()

		canIUse.test(js).getSupportData()

		this.setState({
			detectedFeatures: canIUse.supportData
		})
	},

	render: function() {
		return (
			<main>
				<h1>Paste me your shit</h1>

				<textarea onChange={this.handleTextarea} placeholder="Here. RIGHT HERE. NOW." />

				{this.state.detectedFeatures.length
					? <p>We found {this.state.detectedFeatures.length} features:</p>
					: null
				}

				{this.state.detectedFeatures.map(f =>
					<li>
						{f.title}
					</li>
				)}
			</main>
		)
	}
})

export default HomepageController