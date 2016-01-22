import { registerMode } from './'
import {Commanders as Com} from "../commanders";

registerMode({
    ID: "intro",
    Init: function(con) {
        Con.send("Welcome Press enter to Continue... ")
        Com.Connections.stateChange(con, "Continue")
    },
    StateContinue: function(con, msg) {
        Com.Connections.changeMode(con, 'mainmenu')
    }
})