'use strict';
import { combineReducers } from 'redux'
import connections from './connections.reducers'
import players from './players.reducers'

export default combineReducers({
  connections,
  players
})