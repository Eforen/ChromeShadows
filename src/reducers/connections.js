var util = require('util'),
	localize = require('localize'),
	colorize = require('colorize');

export default function connections(state = [], action) {
	switch (action.type) {
		case 'CON_NEW':
			action.socket.ConnectionID = state.length;
			state = [...state, {socket: action.socket, state: "intro"}]
			console.log("Connection #"+action.socket.ConnectionID+": Connected...")
			//util.log(colorize.ansify("CON: New #red[NOT IMPLIMENTED]"));
			return state
		case 'CON_CONNECTED':
			util.log(colorize.ansify("Players: Add #red[NOT IMPLIMENTED]"));
			return state
		case 'CON_INTERRUPT':
			console.log("INTR!");
			// disconnect on CTRL-C!
			if(state[action.id]) state[action.id].socket.end();
			return state
		case 'CON_MSG':
			util.log(colorize.ansify("CON "+action.id+": New msg #green["+action.msg.slice(0, action.msg.length - 1)+"]"));
			return state
		case 'CON_RESIZE':
			util.log(colorize.ansify("#grey[CON "+action.id+": resized to "+action.width+"x"+action.height+"]"));
			return state
		default:
			return state
	}
}