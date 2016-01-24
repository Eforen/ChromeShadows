import {getState as state} from '../data';

export function getID(Con){
	console.log("WTF: "+Con)
	if(typeof(Con)=="number")
		return Con
	if(typeof(Con.ConnectionID)=="function")
		return Con.ConnectionID
	if(Con.socket && Con.socket.ConnectionID)
		return Con.socket.ConnectionID
	throw new error("Invalid Connection")
}

export function getMode(Connection){
	Connection = getID(Connection)
	if(state().connections[Connection]){
		return state().connections[Connection].mode
	}
	return "none"
}

export function getState(Connection){
	Connection = getID(Connection)
	return state().connections[Connection]? state().connections[Connection].state : "init"
}

export function getSocket(Connection){
	Connection = getID(Connection)
	return state().connections[Connection]? state().connections[Connection].socket : null
}