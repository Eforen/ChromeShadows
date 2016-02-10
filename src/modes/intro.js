'use strict';
import util from 'util'
import {Commanders as Com} from "../commanders";

export default function intro(register) {
    register({
        ID: "intro",
        Init: function(con) {
            util.log("Intro: Sending init to connection #"+con)
            Com.Connections.send(con, Array(50).join("\n")+"Welcome Press enter to Continue... ")
            Com.Connections.stateChange(con, "Continue")
        },
        StateContinue: function(con, msg) {
        	util.log("Intro: Sending connection #"+con+" to login")
            Com.Connections.changeMode(con, 'login')
        }
    })
}