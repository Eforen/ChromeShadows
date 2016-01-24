import { registerMode } from './'
import {Commanders as Com} from "../commanders";

registerMode({
    ID: "login",
    Init: function(con) {
        console.log("Login: Sending init to connection #"+con)
        Com.Connections.send("What's your name? ")
        Com.Connections.stateChange(con, "Name")
    },
    StateName: function(con, msg) {
        console.log("Login: Got Name from connection #"+con)
        Com.Connections.send("Slot me some credentials chummer! ")
        Connections.stateChange(con, "Pass")
        //If not invalid name
        Com.Connections.changeVar('name', msg.trim())
    },
    StatePass: function(con, msg) {
        console.log("Login: Got Pass from connection #"+con)
        //if valid credentials 
        Com.Connections.clearVar('name')
        Com.Connections.changeMode('mainmenu')
    }
})