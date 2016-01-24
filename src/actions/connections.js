'use strict';
import util from 'util'
import colorize from "colorize"
import {getID, getSocket} from "../fetchers/connections";
import {procMsg, procModeChange} from "../modes";
import {dispatch, getState, getStore} from '../data';
import {types} from '../types/connections';

var telnetFlags = {}
telnetFlags.IAC     = 255; // interpret as command
telnetFlags.DONT    = 254; // you are not to use option
telnetFlags.DO      = 253; // please use option
telnetFlags.WONT    = 252; // I won't use option
telnetFlags.WILL    = 251; // I will use option
telnetFlags.SB      = 250; // sub-negotiation
telnetFlags.GA      = 249; // Go-ahead
telnetFlags.EL      = 248; // Erase line
telnetFlags.EC      = 247; // Erase character
telnetFlags.AYT     = 246; // Are you there?
telnetFlags.AO      = 245; // Abort output (but let prog finish)
telnetFlags.IP      = 244; // Interrupt (permanently)
telnetFlags.BREAK   = 243;
telnetFlags.DM      = 242; // Data mark
telnetFlags.NOP     = 241;
telnetFlags.SE      = 240; // End sub-negotiation
telnetFlags.EOR     = 239; // End of record (transparent mode)
telnetFlags.ABORT   = 238; // Abort process
telnetFlags.SUSP    = 237; // Suspend process
telnetFlags.EOF     = 236; // End of file
telnetFlags.SYNCH   = 242;

/* telnet options */
telnetFlags.OPT_BINARY			= 0	/* 8-bit data path */
telnetFlags.OPT_ECHO			= 1	/* echo */
telnetFlags.OPT_RCP				= 2	/* prepare to reconnect */
telnetFlags.OPT_SGA				= 3	/* suppress go ahead */
telnetFlags.OPT_NAMS			= 4	/* approximate message size */
telnetFlags.OPT_STATUS			= 5	/* give status */
telnetFlags.OPT_TM				= 6	/* timing mark */
telnetFlags.OPT_RCTE			= 7	/* remote controlled transmission and echo */
telnetFlags.OPT_NAOL 			= 8	/* negotiate about output line width */
telnetFlags.OPT_NAOP 			= 9	/* negotiate about output page size */
telnetFlags.OPT_NAOCRD			= 10	/* negotiate about CR disposition */
telnetFlags.OPT_NAOHTS			= 11	/* negotiate about horizontal tabstops */
telnetFlags.OPT_NAOHTD			= 12	/* negotiate about horizontal tab disposition */
telnetFlags.OPT_NAOFFD			= 13	/* negotiate about formfeed disposition */
telnetFlags.OPT_NAOVTS			= 14	/* negotiate about vertical tab stops */
telnetFlags.OPT_NAOVTD			= 15	/* negotiate about vertical tab disposition */
telnetFlags.OPT_NAOLFD			= 16	/* negotiate about output LF disposition */
telnetFlags.OPT_XASCII			= 17	/* extended ascic character set */
telnetFlags.OPT_LOGOUT			= 18	/* force logout */
telnetFlags.OPT_BM				= 19	/* byte macro */
telnetFlags.OPT_DET				= 20	/* data entry terminal */
telnetFlags.OPT_SUPDUP			= 21	/* supdup protocol */
telnetFlags.OPT_SUPDUPOUTPUT 	= 22	/* supdup output */
telnetFlags.OPT_SNDLOC			= 23	/* send location */
telnetFlags.OPT_TTYPE			= 24	/* terminal type */
telnetFlags.OPT_EOR				= 25	/* end or record */
telnetFlags.OPT_TUID			= 26	/* TACACS user identification */
telnetFlags.OPT_OUTMRK			= 27	/* output marking */
telnetFlags.OPT_TTYLOC			= 28	/* terminal location number */
telnetFlags.OPT_3270REGIME 		= 29	/* 3270 regime */
telnetFlags.OPT_X3PAD			= 30	/* X.3 PAD */
telnetFlags.OPT_NAWS			= 31	/* window size */
telnetFlags.OPT_TSPEED			= 32	/* terminal speed */
telnetFlags.OPT_LFLOW			= 33	/* remote flow control */
telnetFlags.OPT_EXOPL			= 255	/* extended-options-list */

telnetFlags.OPT_BINARY            = 0; // RFC 856
telnetFlags.OPT_ECHO              = 1; // RFC 857
telnetFlags.OPT_SUPPRESS_GO_AHEAD = 3; // RFC 858
telnetFlags.OPT_STATUS            = 5; // RFC 859
telnetFlags.OPT_TIMING_MARK       = 6; // RFC 860
telnetFlags.OPT_TTYPE             = 24; // RFC 930, 1091
telnetFlags.OPT_WINDOW_SIZE       = 31; // RFC 1073
telnetFlags.OPT_LINE_MODE         = 34; // RFC 1184
telnetFlags.OPT_NEW_ENVIRON       = 39; // RFC 1572
telnetFlags.OPT_COMPRESS2         = 86; // http://www.zuggsoft.com/zmud/mcp.htm

telnetFlags.TELQUAL_IS   = 0;
telnetFlags.TELQUAL_SEND = 1;

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
	console.log("MSG: New From #"+connectionID+" = "+util.inspect(msg, {showHidden: false, depth: null}))
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