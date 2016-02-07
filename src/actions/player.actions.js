'use strict';
import util from 'util'
import fs from 'fs'
import colorize from "colorize"
import {getPID} from "../fetchers/player.fetchers";
//import {procMsg, procModeChange} from "../modes";
import {dispatch, getState, getStore} from '../data';
import {types} from '../types/player.types';

export function savePlayer(player) {
	let pid = getPID(player)

	dispatch({
		type: types.SAVING,
		pid: pid
	})
	let pss = getState().players[pid] //Player Save State
	return Promise((resolve, reject) => {
		fs.writeFile(__dirname + '/../../data/players/'+pss.name, JSON.Stringify(pss), (err)=>{
			if(err) {
				console.log("Player: Data Save Error...")
				console.log("[Start of Player Data Dump]"+JSON.Stringify(pss)+"[End of Player Data Dump]")
				console.log(err)
				reject("Not Saved")
			}
			resolve()
		})
	}).then(()=>{
		//Success
		dispatch({
			type: types.SAVED,
			pid: pid,
			data: pss
		})
	},()=>{
		//Failure
		dispatch({
			type: types.NOT_SAVED,
			pid: pid
		})
	})
}