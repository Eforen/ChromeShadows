'use strict';
import util from "util"
import {Commanders as Com} from "../commanders";

export var ID = "login"

export function Init(con) {
    util.log("Con %d: Login > Sending init to client", con)
    Com.Connections.echoOn(con)
    Com.Connections.send(con, "What's your name? ")
    Com.Connections.stateChange(con, "Name")
}

let alphaNum = new RegExp("^[a-zA-Z0-9]+$")

export function StateName(con, msg) {
    let name = msg.toString().toLowerCase().trim()
    if(Com.Players.isReservedName(name)){
        util.log("Con %d: Login > Got Reserved Name", con)
        Com.Connections.send(con, "That is a Reserved name and your\nstatistics do not match login rejected...\n\nAttempt Logged... \n")
        Init(con)
    } else{
        if(name.indexOf(" ") >= 0){ //Has Spaces
            util.log("Con %d: Login > Got Invalid Name (Spaces)", con)
            Com.Connections.send(con, "Spaces are not allowed in Username...\nTry again...\n")
            Init(con)
        } else if(!alphaNum.exec(name)){
            util.log("Con %d: Login > Got Invalid Name (Not Alphanumaric)", con)
            Com.Connections.send(con, "Please use only letters and numbers...\nTry again...\n")
            Init(con)
        } else if(name.length < 5){
            util.log("Con %d: Login > Invalid Name (Too Short)", con)
            Com.Connections.send(con, "Usernames must be more then 6 charecters...\nTry again...\n")
            Init(con)
        } else{
            util.log("Con %d: Login > Got Name from client", con)
            Com.Connections.echoOff(con)
            Com.Connections.send(con, "Slot me some credentials chummer! ")
            Com.Connections.stateChange(con, "Pass")
            //If not invalid name
            Com.Connections.changeVar(con, 'name', name)
            Com.Players.loadPlayer(name)
        }
    }
}
export function StatePass(con, msg) {
    util.log("Login: Got Pass from connection #"+con)
    //if valid credentials 
    Com.Connections.echoOn(con)
    //Com.Connections.clearVar(con, 'name')
    Com.Connections.changeMode(con, 'mainmenu')
    Com.Connections.echoOn(con)
}