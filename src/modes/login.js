import { registerMode } from './'
import {Commanders as Com} from "../commanders";

registerMode({
    ID: "login",
    Init: function(con) {
        console.log("Login: Sending init to connection #"+con)
        Com.Connections.send(con, "What's your name? ")
        Com.Connections.stateChange(con, "Name")
        Com.Connections.echoOn(con)
    },
    StateName: function(con, msg) {
        console.log("Login: Got Name from connection #"+con)
        Com.Connections.send(con, "Slot me some credentials chummer! ")
        Com.Connections.echoOff(con)
        Connections.stateChange(con, "Pass")
        //If not invalid name
        Com.Connections.changeVar(con, 'name', msg.trim())
    },
    StatePass: function(con, msg) {
        console.log("Login: Got Pass from connection #"+con)
        //if valid credentials 
        Com.Connections.echoOn(con)
        Com.Connections.clearVar(con, 'name')
        Com.Connections.changeMode(con, 'mainmenu')
    }
})