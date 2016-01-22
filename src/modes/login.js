import { registerMode } from './'
import {Commanders as Com} from "../commanders";

registerMode({
    ID: "login",
    Init: function(con) {
        Con.send("What's your name? ")
        Connections.stateChange(con, "Name")
    },
    StateName: function(con, msg) {
        Con.send("Slot me some credentials chummer! ")
        Connections.stateChange(con, "Pass")
        //If not invalid name
        Connections.changeVar('name', msg.trim())
    },
    StatePass: function(con, msg) {
        //if valid credentials 
        Connections.clearVar('name')
        Connections.changeMode('mainmenu')
    }
})