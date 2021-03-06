'use strict';
import fs from 'fs'
import util from 'util'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
//import {modeMiddleware} from "./modes";
//import promise from 'redux-promise';
//import createLogger from 'redux-logger'; //Not Compatable with serverside

import reducers from './reducers'

let data_folder = __dirname + '/../data/';

const loggerMiddleware = ({ dispatch, getState }) => {
  	return next => action =>{
  		util.log("Before State: "+JSON.stringify(getState(), (k, v) => {if(k != "socket") return v}))
  		util.log("Dispatch: "+util.inspect(action, {showHidden: false, depth: null}))
	  	let r = next(action)
  		util.log("After State: "+JSON.stringify(getState(), (k, v) => {if(k != "socket") return v}))
	    return r
	}
}

//const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(
		thunk
		,loggerMiddleware
	)(createStore);
const store = createStoreWithMiddleware(reducers);
//const store = createStore(reducers)

/**
 * return the data store
 */
export function getStore()
{
	return store;
}

/**
 * The dispatch method by itself
 */
export var dispatch = store.dispatch.bind(store);

/**
 * The getState method by itself
 */
export var getState = store.getState.bind(store);

/**
 * load the MOTD for the intro screen
 * @return string
 */
export function loadMotd()
{
	var motd = fs.readFileSync(data_folder + 'motd').toString('utf8');
	return motd;
}