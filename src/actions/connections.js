import util from 'util'
import colorize from "colorize"
import {getID} from "../fetchers/connections";
import {procMsg, procModeChange} from "../modes";
import {dispatch, getState} from '../data';
import {types} from '../types/connections';

export function newCom(socket) {
	console.log("attempting new connection term=%s %dx%d",
		socket.term, socket.windowSize[0], socket.windowSize[1]);
	dispatch({
		type: types.NEW,
		socket: socket
	})
	return Promise.resolve()
}

export function interrupt(connectionID){
	connectionID = getID(connectionID)
	dispatch( {
		type: types.INTERRUPT,
		id: connectionID
	})
	return Promise.resolve()
}
export function resize(connectionID, width, height){
	connectionID = getID(connectionID)
	dispatch( {
		type: types.RESIZE,
		id: connectionID,
		width: width,
		height: height
	})
	return Promise.resolve()
}

export function newMsg(connectionID, msg) {
	connectionID = getID(connectionID)
	let action = {
		type: types.MSG,
		id: connectionID,
		msg: msg
	}
	return dispatch( (dispatch, getState) =>  {
		dispatch(action)
		return Promise.resolve()
	}).then(()=>{procMsg(action, dispatch, getState)})
}

export function close(connectionID) {
	connectionID = getID(connectionID)
	console.log("END!");
	dispatch( {
		type: types.CLOSE,
		id: connectionID,
	})
	return Promise.resolve()
}

/********************
 ** Mode Handeling **
 ********************/

export function changeMode(connectionID, newMode){
	//console.log("Socket2: "+connectionID)
	//console.log(util.inspect(connectionID, {showHidden: false, depth: null}))
	//connectionID = getID(connectionID)
	//console.log(connectionID)
	connectionID = getID(connectionID)
	let action = {
		type: types.MODE_CHANGE,
		id: connectionID,
		mode: newMode
	}
	return dispatch((dispatch, getState) =>  {
		dispatch(action)
		return Promise.resolve()
	}).then(
		()=>procModeChange(action, dispatch, getState)
	)
}
export function stateChange(connectionID, newState){
	connectionID = getID(connectionID)
	let action = {
		type: types.STATE_CHANGE,
		id: connectionID,
		state: newState
	}
	util.log("Msg:" + util.inspect(action, {showHidden: false, depth: null}))
	//util.log(util.inspect(getState().connections[connectionID], {showHidden: false, depth: null}))
	dispatch( action )
	//util.log(util.inspect(getState().connections[connectionID], {showHidden: false, depth: null}))
	return Promise.resolve()
}

/******************************
 ** Connection Var Handeling **
 ******************************/
export function changeVar(connectionID, varName, value){
	connectionID = getID(connectionID)
	dispatch( {
		type: types.VAR_CHANGE,
		id: connectionID,
		name: varName,
		value: value
	})
	return Promise.resolve()
}
export function clearVar(connectionID, varName){
	connectionID = getID(connectionID)
	dispatch( {
		type: types.VAR_CLEAR,
		id: connectionID,
		name: varName
	})
	return Promise.resolve()
}

export function send(connectionID, msg){
	connectionID = getID(connectionID)
	if(getState().connections && getState().connections[connectionID]){
		getState().connections[connectionID].socket.write(msg)
		return Promise.resolve()
	}
	return Promise.reject("No Socket Found")
}