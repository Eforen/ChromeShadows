import { combineReducers } from 'redux'
import colors from 'colors'

var modes = {}

require('./intro')
require('./login')
//console.log(modes)

export default function modeCatcher({ getState }) {
  return (next) => (action) => {
  	let r = next(action)
  	//TODO: Catch mode change and call Init after running the msg action

  	//TODO: Catch msg and pass into active mode
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