import { registerMode } from './'
import {Commanders as Com} from "../commanders";

registerMode({
    ID: "login",
    Init: function(con, dispatch) {
        Con.send("What's your name? ")
        Connections.stateChange(con, "Name")
    },
    StateName: function(con, dispatch, msg) {
        Con.send("Slot me some credentials chummer! ")
        Connections.stateChange(con, "Pass")
        //If not invalid name
        Connections.changeVar('name', msg.trim())
    },
    StatePass: function(con, dispatch, msg) {
        //if valid credentials 
        Connections.clearVar('name')
        Connections.changeMode('mainmenu')
    }
})