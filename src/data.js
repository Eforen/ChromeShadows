import fs from 'fs'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
//import promise from 'redux-promise';
//import createLogger from 'redux-logger'; //Not Compatable with serverside

import reducers from './reducers'

let data_folder = __dirname + '/../data/';


//const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
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
 * load the MOTD for the intro screen
 * @return string
 */
export function loadMotd()
{
	var motd = fs.readFileSync(data_folder + 'motd').toString('utf8');
	return motd;
}