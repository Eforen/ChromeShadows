import {getStore} from '../data';

export function getID(Con){
	console.log("WTF: "+Con)
	if(typeof(Con)=="number")
		return Con
	if(typeof(Con.ConnectionID)=="function")
		return Con.ConnectionID
	if(Con.socket && Con.socket.ConnectionID)
		return Con.socket.ConnectionID
}

export function getMode(Connection){
	Connection = getID(Connection)
	return getStore().getState().connections[Connection]?getStore().getState().connections[Connection].mode:"none"
}

export function getState(Connection){
	Connection = getID(Connection)
	return getStore().getState().connections[Connection]?getStore().getState().connections[Connection].state:"init"
}

export function getSocket(Connection){
	Connection = getID(Connection)
	return getStore().getState().connections[Connection]?getStore().getState().connections[Connection].socket:null
}