var util = require('util'),
	localize = require('localize'),
	colorize = require('colorize');

export default function players(state = [], action) {
	switch (action.type) {
		case 'ADD_PLAYER':
			util.log(colorize.ansify("Players: Add #red[NOT IMPLIMENTED]"));
			return state
		default:
			return state
	}
}