import util from 'util'
import { combineReducers } from 'redux'
import colors from 'colors'
import {Commanders as Com} from "../commanders";

var modes = {}

require('./intro')
require('./login')
//console.log(modes)

export function procModeChange(action, dispatch, getState) {
	util.log("Mode:" + util.inspect(action, {showHidden: false, depth: null}))

	//TODO: Catch mode change and call Init after running the msg action
	if(action.type == Com.Connections.types.MODE_CHANGE){
		if(modes[Com.Connections.getMode(action.id)]&&Com.Connections.getState(action.id)=="init")
			modes[Com.Connections.getMode(action.id)].Init(action.id, getState, dispatch)
	}
}
export function procMsg(action, dispatch, getState) {
	util.log("Msg:" + util.inspect(action, {showHidden: false, depth: null}))
	
	//TODO: Catch msg and pass into active mode
	if(action.type == Com.Connections.types.MSG){
		if(modes[Com.Connections.getMode(action.id)]&&
			modes[Com.Connections.getMode(action.id)]["State"+Com.Connections.getState(action.id)])
			modes[Com.Connections.getMode(action.id)]["State"+Com.Connections.getState(action.id)](action.id, action.msg, getState, dispatch)
	}
}

export function registerMode(modeDescription) {
	if(modes[modeDescription.ID]){
		util.log("Modes: WARNING: Mode "+modeDescription.ID+" Already exists Overwriting Old".red)
		console.trace()
	}
	modes[modeDescription.ID] = modeDescription;
}