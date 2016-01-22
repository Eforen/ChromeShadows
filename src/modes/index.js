import { combineReducers } from 'redux'
import login from './login'

export default function logger({ getState }) {
  return (next) => (action) => {

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return next(action)
  }
}