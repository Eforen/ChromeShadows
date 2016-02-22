'use strict';
import util from 'util'
import {Commanders as Com} from "../commanders";

export var ID= "intro"

export function StateInit(con) {
    util.log("Intro: Sending init to connection #"+con)
    Com.Connections.send(con, Array(50).join("\n")+"Welcome Press enter to Continue... ")
    Com.Connections.stateChange(con, "Continue")
    return Promise.resolve()
}
export function StateContinue(con, msg) {
	util.log("Intro: Sending connection #"+con+" to login")
    Com.Connections.changeMode(con, 'login')
    return Promise.resolve()
}