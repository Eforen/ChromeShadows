'use strict';
import util from 'util'
import colorize from "colorize"
import {getID, getSocket} from "../fetchers/connections.fetcher";
import {procMsg, procModeChange} from "../modes";
import {dispatch, getState, getStore} from '../data';
import {types} from '../types/connections.types';

import telnetFlags from '../telnetFlags'

export function newCom(socket) {
	util.log("attempting new connection term=%s %dx%d",
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
	//util.log("MSG: New From #"+connectionID+" = "+util.inspect(msg, {showHidden: false, depth: null}))
	util.log("MSG: New From #%d: %s", connectionID, msg)
	connectionID = getID(connectionID)
	let action = {
		type: types.MSG,
		id: connectionID,
		msg: msg
	}
	return dispatch( (dispatch, getState) =>  {
		dispatch(action)
		return Promise.resolve()
	}).then(()=>{
		procMsg(action, dispatch, getState)
	}).catch((e)=>{
		setTimeout(()=>{throw e});
	})
}

export function close(connectionID) {
	connectionID = getID(connectionID)
	util.log("END Con#%d!", connectionID);
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
	).catch((e)=>{
		setTimeout(()=>{throw e});
	})
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

export function echoOff(connectionID) {
	connectionID = getID(connectionID)

	/*
	 * Turn off echoing (specific to telnet client)
	void echo_off(struct descriptor_data *d)
	{
	  char off_string[] =
	    {
	      (char) IAC,
	      (char) WILL,
	      (char) TELOPT_ECHO,
	      (char) 0,
	    };

	  SEND_TO_Q(off_string, d);
	}
	 */
	//console.log("efwtf")
  	//console.log("efwtf State: "+JSON.stringify(getStore().getState(), (k, v) => {if(k != "socket") return v}))
	//Com.Connections.getSocket(connectionID).telnetCommand(telnetFlags.WILL, telnetFlags.OPT_ECHO)
	console.log("DONT ECHO #"+connectionID)
	getSocket(connectionID).telnetCommand(telnetFlags.WILL, telnetFlags.OPT_ECHO)
	//getSocket(connectionID).telnetCommand(telnetFlags.DONT, telnetFlags.OPT_ECHO)
	//console.log("efwtf2")
}

export function echoOn(connectionID) {
	connectionID = getID(connectionID)
	/*
	 * Turn on echoing (specific to telnet client)
	void echo_on(struct descriptor_data *d)
	{
	  char on_string[] =
	    {
	      (char) IAC,
	      (char) WONT,
	      (char) TELOPT_ECHO,
	      (char) TELOPT_NAOFFD,
	      (char) TELOPT_NAOCRD,
	      (char) 0,
	    };

	  SEND_TO_Q(on_string, d);
	}
	 */
	//console.trace("OMG WTF Trace")
	//console.log("enwtf")
	console.log("DO ECHO #"+connectionID)
	getSocket(connectionID).telnetCommand(telnetFlags.WONT, [telnetFlags.OPT_ECHO, telnetFlags.OPT_NAOFFD, telnetFlags.OPT_NAOCRD])
	//getSocket(connectionID).telnetCommand(telnetFlags.DO, telnetFlags.OPT_ECHO)
	//console.log("enwtf2")
}