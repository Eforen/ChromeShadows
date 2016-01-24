import { registerMode } from './'
import {Commanders as Com} from "../commanders";

registerMode({
    ID: "intro",
    Init: function(con) {
    	console.log("Intro: Sending init to connection #"+con)
        Com.Connections.send(con, Array(50).join("\n")+"Welcome Press enter to Continue... ")
        Com.Connections.stateChange(con, "Continue")
    },
    StateContinue: function(con, msg) {
    	console.log("Intro: Sending connection #"+con+" to login")
        dCom.Connections.changeMode(con, 'login')
    }
})