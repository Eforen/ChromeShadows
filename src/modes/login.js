'use strict';
import util from "util"
import {Commanders as Com} from "../commanders"
import validator from "validator"

export var ID = "login"

export function StateInit(con) {
    util.log("Con %d: Login > Sending Stateinit to client", con)
    Com.Connections.echoOn(con)
    Com.Connections.send(con, "What's your name? ")
    Com.Connections.stateChange(con, "Name")
    return Promise.resolve()
}

let alphaNum = new RegExp("^[a-zA-Z0-9]+$")

export function StateName(con, msg) {
    let name = msg.toString().toLowerCase().trim()
    if(Com.Players.isReservedName(name)){
        util.log("Con %d: Login > Got Reserved Name", con)
        Com.Connections.send(con, "That is a Reserved name and your\nstatistics do not match login rejected...\n\nAttempt Logged... \n")
        StateInit(con)
        return Promise.reject("reserved")
    } else{
        if(name.indexOf(" ") >= 0){ //Has Spaces
            util.log("Con %d: Login > Got Invalid Name (Spaces)", con)
            Com.Connections.send(con, "Spaces are not allowed in Username...\nTry again...\n")
            StateInit(con)
            return Promise.reject("invalid space")
        } else if(!alphaNum.exec(name)){
            util.log("Con %d: Login > Got Invalid Name (Not Alphanumaric)", con)
            Com.Connections.send(con, "Please use only letters and numbers...\nTry again...\n")
            StateInit(con)
            return Promise.reject("invalid alphanumaric")
        } else if(name.length < 5){
            util.log("Con %d: Login > Invalid Name (Too Short)", con)
            Com.Connections.send(con, "Usernames must be more then 6 charecters...\nTry again...\n")
            StateInit(con)
            return Promise.reject("short")
        } else{
            util.log("Con %d: Login > Got Name from client", con)
            Com.Connections.echoOff(con)
            Com.Connections.send(con, "Slot me some credentials chummer! ")
            Com.Connections.stateChange(con, "Pass")
            //If not invalid name
            Com.Connections.changeVar(con, 'name', name)
            Com.Players.loadPlayer(name)
            return Promise.resolve()
        }
    }
}

export function StatePass(con, msg) {
    let name = Com.Connections.getVar(con, 'name')
    let pass = msg.toString()
    let r = new Promise((resolve, reject) => {
        Com.Players.validate(name, pass).then(()=>{
            util.log("Con %d: Login > Got Pass", con)
            //if valid credentials 
            //Com.Connections.clearVar(con, 'name')
            Com.Connections.echoOn(con)
            Com.Connections.changeMode(con, 'mainmenu')
            //Com.Connections.echoOn(con)
            resolve()
        }, (err)=>{
            switch(err){
                case 'password':
                    util.log("Con %d: Login > Entered the wrong Pass", con)
                    Com.Connections.send(con, "Sorry that user already exists and thats not the password...\n")
                    StateInit(con)
                    reject('password')
                    break
                case 'no user':
                    util.log("Con %d: Login > User does not exist offering creation...", con)
                    Com.Connections.send(con, name+" I don't know you, do you want to register [y/n]? ")
                    StateInit(con)
                    reject('no user')
                    break
                default:
                    util.log("Con %d: Login > Unknown Error", con)
                    Com.Connections.send(con, "Sorry could not log in as that user...\n")
                    StateInit(con)
                    reject('unknown error')
                    break
            }
        })
    })

    return r
}

export function StateNew(con, msg) {
    //validator
}

export function StateRegister(con, msg) {
    //validator
}