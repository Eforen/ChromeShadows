import { registerMode } from './'
import {Commanders as Com} from "../commanders";

registerMode({
    ID: "intro",
    Init: function(con, dispatch) {
        Com.Connections.send(Con, "Welcome Press enter to Continue... ")
        Com.Connections.stateChange(con, "Continue")
    },
    StateContinue: function(con, dispatch, msg) {
        Com.Connections.changeMode(con, 'mainmenu')
    }
})