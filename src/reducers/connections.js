import util from 'util'
import localize from 'localize'
import colorize from 'colorize'
//import localHelper from 'strings';
import { types as conType } from '../types/connections.js';


export default function connections(state = [], action) {
	//console.log(conType)
	switch (action.type) {
		case conType.NEW:
			action.socket.ConnectionID = state.length;
			state = [...state, {id:action.socket.ConnectionID, socket: action.socket, mode:"none", state: "init", vars:{}}]
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
		case conType.MODE_CHANGE:
			//util.log(util.inspect(action, {showHidden: false, depth: null}))
			//console.log("WTF123")
			//util.log("index="+index+" action.id="+action.id)
			return state.map((con, index) => {
				//util.log("index="+index+" action.id="+action.id)
				if(index == action.id){
					//util.log(util.inspect(con, {showHidden: false, depth: null}))
					return Object.assign({}, con, {mode:action.mode, state:"init"})
				}
				return con
			})
		case conType.STATE_CHANGE:
			return state.map(con => index => {
				if(index == action.id)
					return Object.assign({}, con, {state:action.state})
				return con
			})
		case conType.VAR_CHANGE:
			return state.map(con => index => {
				if(index == action.id)
					return Object.assign({}, con, {vars: con.vars.map(v => name => {
						if(name == action.name)
							return action.value
						return v
					})
				})
				return con
			})
		case conType.VAR_CLEAR:
			return state.map(con => index => {
				if(index == action.id)
					return Object.assign({}, con, {vars: con.vars.filter(v => index => {
						if(index == action.name) return false;
						return true;
					})
				})
				return con
			})
		default:
			return state
	}
}