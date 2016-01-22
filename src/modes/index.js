import { combineReducers } from 'redux'
import colors from 'colors'
import {Commanders as Com} from "../commanders";

var modes = {}

require('./intro')
require('./login')
//console.log(modes)

export function modeMiddleware({ dispatch, getState }) {
  	return next => action =>{
	  	let r = next(action)
	  	//TODO: Catch mode change and call Init after running the msg action
	  	if(action.type == Com.Connections.types.MODE_CHANGE){
	  		if(modes[Com.Connections.getMode(action.id)]&&Com.Connections.getState(action.id)=="init")
	  			modes[Com.Connections.getMode(action.id)].Init()
	  	}

	  	//TODO: Catch msg and pass into active mode
	  	if(action.type == Com.Connections.types.MSG){
	  		if(modes[Com.Connections.getMode(action.id)]&&
	  			modes[Com.Connections.getMode(action.id)]["State"+Com.Connections.getState(action.id)])
	  			modes[Com.Connections.getMode(action.id)]["State"+Com.Connections.getState(action.id)]()
	  	}
	    return r
	}
}

export function registerMode(modeDescription) {
	if(modes[modeDescription.ID]){
		util.log("Modes: WARNING: Mode "+modeDescription.ID+" Already exists Overwriting Old".red)
		console.trace()
	}
	modes[modeDescription.ID] = modeDescription;
}