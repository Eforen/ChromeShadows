'use strict';
import { combineReducers } from 'redux'
import connections from './connections'
import players from './players'

export default combineReducers({
  connections,
  players
})