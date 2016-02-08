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
	/*
	data.getState().connections.forEach((v,k)=>{
		console.log(k+": ")
		console.log(v)
	})
	*/
	//console.log(data.getState().connections)
	//console.log(data.getState().connections.has(connectionID))
	connectionID = getID(connectionID)
	//console.log(connectionID)
	if(connectionID >= 0 && data.getState().connections.has(connectionID) && typeof(data.getState().connections.get(connectionID))!="undefined"){
		if(data.getState().connections.get(connectionID).has("mode")){
			return data.getState().connections.get(connectionID).get("mode")
		}
		throw new Error("No mode found")
		return
	}
	throw new Error("Could not find Connection")
}

export function getState(connectionID){
	connectionID = getID(connectionID)
	return data.getState().connections.has(connectionID)
		&&
		typeof(data.getState().connections.get(connectionID))!="undefined"?
			data.getState().connections.get(connectionID).get("state") : "init"
}

export function getSocket(Connection){
	Connection = getID(Connection)
	if(data.getState().connections.has(Connection))
		return Sockets.getSocket(data.getState().connections.get(Connection).get("socket"))
	throw new Error("Could not find Connection")
}