import _ from 'lodash'

import AST from './AST'

import caniuse from './caniuse'
import caniuseKeywordMap from './caniuseKeywordMap'

class CanIUse {
	test(js) {
		let ast = new AST(js)

		let featureKeywords = Object.keys(caniuseKeywordMap)

		this.detectedFeatures = _.uniq(ast.tokens.map(t => t.value).filter(t => featureKeywords.indexOf(t) > -1))

		return this
	}

	getSupportData() {
		this.supportData = this.detectedFeatures.map(f => caniuse.data[caniuseKeywordMap[f]])

		return this
	}
}

export default CanIUse