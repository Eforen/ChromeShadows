'use strict';
import { combineReducers } from 'redux'
import connections from './connection.reducers'
import players from './player.reducers'

export default combineReducers({
  connections,
  players
})