var util = require('util');

exports.events = {
	login: require('./events/event_login.js').login,
	createPlayer: require('./events/event_createPlayer.js').createPlayer,
	gameCommand: require('./events/event_gameCommand.js').gameCommand
}