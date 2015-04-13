import esprima from 'esprima'

class AST {
	tokens = []

	constructor(javascript) {
		this.js = javascript

		this.tokens = esprima.tokenize(this.js)
	}
}

export default AST