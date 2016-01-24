'use strict';
var util = require('util'),
	localize = require('localize'),
	colorize = require('colorize');
import { types as conType } from '../types/connections'

export default function players(state = [], action) {
	switch (action.type) {
		case 'PLAYER_ADD':
			util.log(colorize.ansify("Players: Add #red[NOT IMPLIMENTED]"));
			return state
		case 'PLAYER_SET_NAME':
			util.log(colorize.ansify("Players: Set Name #red[NOT IMPLIMENTED]"));
			return state
		case 'PLAYER_LOGIN':
			util.log(colorize.ansify("Players: Login #red[NOT IMPLIMENTED]"));
			return state
		case conType.CLOSE:
			//save and remove player from active player list
			return state
		default:
			return state
	}
}