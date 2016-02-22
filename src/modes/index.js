'use strict';
import util from 'util'
import { combineReducers } from 'redux'
import colors from 'colors'
import {Commanders as Com} from "../commanders";
import {modes as allModes} from "./allModes";

var modes = {}

//require('./intro')
//require('./login')
//console.log(modes)

export function procModeChange(action, dispatch, getState) {
	//util.log("Mode:" + util.inspect(action, {showHidden: false, depth: null}))

	//TODO: Catch mode change and call Init after running the msg action
	if(action.type == Com.Connections.types.MODE_CHANGE){
		//util.log("wtf0 "+Com.Connections.getMode(action.id) +" "+"State"+Com.Connections.getState(action.id))
		if(modes[Com.Connections.getMode(action.id)]&&Com.Connections.getState(action.id)=="init")
			modes[Com.Connections.getMode(action.id)].StateInit(action.id, getState, dispatch)
	}
}

export function procMsg(action, dispatch, getState) {
	//util.log("Msg:" + util.inspect(action, {showHidden: false, depth: null}))
	//util.log("Msg:" + util.inspect(modes, {showHidden: false, depth: null}))
	
	//TODO: Catch msg and pass into active mode
	if(action.type == Com.Connections.types.MSG){
		//util.log("wtf1 "+Com.Connections.getMode(action.id) +" "+"State"+Com.Connections.getState(action.id))
		if(modes[Com.Connections.getMode(action.id)]&&
			modes[Com.Connections.getMode(action.id)]["State"+Com.Connections.getState(action.id)]){
			//util.log("wtf2")
				modes[Com.Connections.getMode(action.id)]["State"+Com.Connections.getState(action.id)](action.id, action.msg, getState, dispatch)
		}
	}
}

export function registerMode(modeDescription) {
	if(modes[modeDescription.ID]){
		util.log("Modes: WARNING: Mode "+modeDescription.ID+" Already exists Overwriting Old".red)
		console.trace()
	}
	modes[modeDescription.ID] = modeDescription;
}

export function registerAllModes() {
	if(modes.length === 0)
		util.log("Modes: Reloading...")
	for (var i = 0; i < allModes.length; i++) {
		registerMode(allModes[i])
	}
	util.log("Modes: %d Loaded", allModes.length)
}

registerAllModes() //Auto Load first time