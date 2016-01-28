'use strict';
var util = require('util'),
	localize = require('localize'),
	colorize = require('colorize');
import { types as pType } from '../types/players'
import { types as cType } from '../types/connections'

export default function players(state = [], action) {
	switch (action.type) {
		case pType.NEW:
			util.log(colorize.ansify("Players: Add #red[NOT IMPLIMENTED]"));
			return state
		case 'PLAYER_SET_NAME':
			util.log(colorize.ansify("Players: Set Name #red[NOT IMPLIMENTED]"));
			return state
		case pType.LOGIN:
			util.log(colorize.ansify("Players: Login #red[NOT IMPLIMENTED]"));
			return state
		case pType.SAVED:
			state
			return state
		case pType.NOT_SAVED:
			return state
		case pType.SAVING:
			return state
		case cType.CLOSE:
			//save and remove player from active player list
			return state
		default:
			return state
	}
}