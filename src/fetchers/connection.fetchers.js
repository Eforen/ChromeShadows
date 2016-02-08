'use strict';
import * as data from '../data';
import * as Sockets from "../sockets";

export function getID(Con){
	//console.log("WTF: "+Con)
	if(typeof(Con)=="number")
		return Con
	if(typeof(Con)=="string")
		return parseInt(Con)
	throw new Error("Invalid Connection")
}

export function getMode(connectionID){
	console.log(data.getState().connections)
	connectionID = getID(connectionID)
	if(data.getState().connections.has(connectionID)){
		if(data.getState().connections.hasIn(connectionID, "mode")){
			return data.getState().connections.getIn(connectionID, mode)
		}
		throw new Error("No mode found")
		return
	}
	throw new Error("Could not find Connection")
}

export function getState(Connection){
	Connection = getID(Connection)
	return data.getState().connections.has(Connection)? data.getState().connections.hasIn(Connection, "state") : "init"
}

export function getSocket(Connection){
	Connection = getID(Connection)
	if(data.getState().connections.has(Connection))
		return Sockets.getSocket(data.getState().getIn(Connection, "state"))
	throw new Error("Could not find Connection")
}