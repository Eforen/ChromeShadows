import util from 'util'
import colorize from "colorize"
import {getID} from "../fetchers/connections";

export const types = {
	NEW : "CON_NEW",
	INTERRUPT : "CON_INTERRUPT",
	MSG : "CON_MSG",
	CLOSE : "CON_CLOSE",
	RESIZE : "CON_RESIZE",
	MODE_CHANGE : "MODE_CHANGE",
	STATE_CHANGE : "STATE_CHANGE",
	VAR_CHANGE : "VAR_CHANGE",
	VAR_CLEAR : "VAR_CLEAR"
}

export function newCom(socket) {
	console.log("attempting new connection term=%s %dx%d",
		socket.term, socket.windowSize[0], socket.windowSize[1]);
	return {
		type: types.NEW,
		socket: socket
	}
}

export function interrupt(connectionID){
	connectionID = getID(connectionID)
	return {
		type: types.INTERRUPT,
		id: connectionID
	}
}
export function resize(connectionID, width, height){
	connectionID = getID(connectionID)
	return {
		type: types.RESIZE,
		id: connectionID,
		width: width,
		height: height
	}
}

export function newMsg(connectionID, msg) {
	connectionID = getID(connectionID)
	return (dispatch, getState) =>  {
		getState().connections.forEach((con, index) => {
			con.socket.write(
				colorize.ansify("" + 
					(connectionID==index?"You say":(connectionID + " says")) +
					": #green["+msg.slice(0, msg.length - 1)+"]\n\r"
				)
			)
		})

		return dispatch({
			type: types.MSG,
			id: connectionID,
			msg: msg
		})
	}
}

export function close(connectionID) {
	connectionID = getID(connectionID)
	console.log("END!");
	return {
		type: types.CLOSE,
		id: connectionID,
	}
}

/********************
 ** Mode Handeling **
 ********************/

export function changeMode(connectionID, newMode){
	console.log("Socket2: "+connectionID)
	//console.log(util.inspect(connectionID, {showHidden: false, depth: null}))
	connectionID = getID(connectionID)
	console.log(connectionID)
	return {
		type: types.MODE_CHANGE,
		id: connectionID,
		mode: newMode
	}
}
export function stateChange(connectionID, newState){
	connectionID = getID(connectionID)
	return {
		type: types.STATE_CHANGE,
		id: connectionID,
		state: newState
	}
}

/******************************
 ** Connection Var Handeling **
 ******************************/
export function changeVar(connectionID, varName, value){
	connectionID = getID(connectionID)
	return {
		type: types.VAR_CHANGE,
		id: connectionID,
		name: varName,
		value: value
	}
}
export function clearVar(connectionID, varName){
	connectionID = getID(connectionID)
	return {
		type: types.VAR_CLEAR,
		id: connectionID,
		name: varName
	}
}

export function send(connectionID, msg){
	connectionID = getID(connectionID)

}