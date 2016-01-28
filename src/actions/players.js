'use strict';
import util from 'util'
import fs from 'fs'
import colorize from "colorize"
import {getPID} from "../fetchers/players";
//import {procMsg, procModeChange} from "../modes";
import {dispatch, getState, getStore} from '../data';
import {types} from '../types/actions';

export function savePlayer(player) {
	let pid = getPID(player)

	dispatch({
		type: types.SAVING,
		pid: pid
	})
	return Promise((resolve, reject) => {
		let pss = getState().players[pid] //Player Save State

		fs.writeFile(__dirname + '/../../data/players/'+pss.name, JSON.Stringify(pss), (err)=>{
			if(err) {
				console.log("Player: Data Save Error...")
				console.log("[Start of Player Data Dump]"+JSON.Stringify(pss)+"[End of Player Data Dump]")
				console.log(err)
			}
		})
	});
}