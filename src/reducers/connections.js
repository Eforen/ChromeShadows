import util from 'util'
import localize from 'localize'
import colorize from 'colorize'
//import localHelper from 'strings';
import { types as conType } from '../actions/connections.js';

export default function connections(state = [], action) {
	switch (action.type) {
		case conType.NEW:
			action.socket.ConnectionID = state.length;
			state = [...state, {id:action.socket.ConnectionID, socket: action.socket, state: "intro"}]
			console.log("Connection #"+action.socket.ConnectionID+": Connected...")
			//util.log(colorize.ansify("CON: New #red[NOT IMPLIMENTED]"));
			return state
		case conType.INTERRUPT:
			console.log("INTR!");
			// disconnect on CTRL-C!
			if(state[action.id]) state[action.id].socket.end();
			return state
		case conType.MSG:
			util.log(colorize.ansify("CON "+action.id+": New msg #green["+action.msg.slice(0, action.msg.length - 1)+"]"));
			return state
		case conType.RESIZE:
			util.log(colorize.ansify("#grey[CON "+action.id+": resized to "+action.width+"x"+action.height+"]"));
			return state
		case conType.CLOSE:
			return action.filter(con => index => {
				if(index == action.id) return false;
				return true;
			})
		default:
			return state
	}
}