'use strict';
import util from "util";
import { combineReducers } from 'redux'
import { connections } from './connection.reducers'
import players from './player.reducers'
//console.log(util.inspect(connections, {showHidden: false, depth: null}))

export default combineReducers({
  connections,
  players
})