'use strict';
import util from 'util'
import localize from 'localize'
import colorize from 'colorize'
import { List, Map } from 'immutable';
//import localHelper from 'strings';
import { types as conType } from '../types/connection.types';
import * as Sockets from "../sockets";

var nextID = 0

export function setNextID(id) {
	nextID = id
}

export function getNextID(id) {
	return nextID
}

export function connections(state = List.of(), action) {
	//console.log("Con:"+ action.type)
	switch (action.type) {
		case conType.NEW:
			//console.log("Socket #%d: Will set con to %d", action.socket, nextID)
			//action.socket.ConnectionID = nextID;
			Sockets.setSocketConnection(action.socket, nextID)
			//state = [...state, {id:action.socket.ConnectionID, socket: action.socket, mode:"none", state: "init", vars:{}}]
			state = state.set(nextID, Map({
                id: nextID,
                socket: action.socket, 
                mode: "none", 
                state: "init", 
                vars: Map({})
            }))
			util.log("Connection #"+nextID+": Connected...")
			nextID++
			//util.log(colorize.ansify("CON: New #red[NOT IMPLIMENTED]"));
			return state
		case conType.INTERRUPT:
			util.log("Connection #"+action.id+": INTR!");
			// disconnect on CTRL-C!
			//if(state[action.id]) state[action.id].socket.write();
			//if(state[action.id]) state[action.id].socket.end();
			return state
		case conType.MSG:
			util.log(colorize.ansify("CON "+action.id+": New msg #green["+action.msg.slice(0, action.msg.length - 1)+"]"));
			return state
		case conType.RESIZE:
			util.log(colorize.ansify("#grey[CON "+action.id+": resized to "+action.width+"x"+action.height+"]"));
			return state
		case conType.CLOSE:
			return action.filter((con, index) => {
				if(index == action.id) return false;
				return true;
			})
		case conType.MODE_CHANGE:
			//console.log(state.setIn([action.id, "mode"], action.mode).setIn([action.id, "state"], "init"))
			if(state.getIn([action.id, "mode"]) != action.mode)
				return state.setIn([action.id, "mode"], action.mode).setIn([action.id, "state"], "init")
			else
				return state
			/*
			return state.map((con, index) => {
				if(index == action.id){
					return Object.assign({}, con, {mode:action.mode, state:"init"})
				}
				return con
			})
			*/
		case conType.STATE_CHANGE:
			return state.setIn([action.id, "state"], action.state)
			/*
			return state.map((con, index) => {
				if(index == action.id){
					return Object.assign({}, con, {state:action.state})
				}
				return con
			})
			*/
		case conType.VAR_CHANGE:
			return state.setIn([action.id, "vars", action.name], action.value)
			/*
			return state.map((con, index) => {
				if(index == action.id){
					let r = Object.assign({}, con)
					r.vars[action.name] = action.value
					return r
				}
				return con
			})
			*/
		case conType.VAR_CLEAR:
			return state.deleteIn([action.id, "vars", action.name])
			/*
			return state.map((con, index) => {
				if(index == action.id)
					return Object.assign({}, con, {vars: con.vars.filter(v => index => {
						if(index == action.name) return false;
						return true;
					})
				})
				return con
			})
			*/
		default:
			return state
	}
}