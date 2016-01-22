import { registerMode } from './'

registerMode({
    ID: "login"
    Init: function(con) {
        Con.send("What's your name? ")
        ConAction.stateChange(con, "Name")
    }
    StateName: function(con, msg) {
        Con.send("Slot me some credentials chummer! ")
        ConAction.stateChange(con, "Pass")
            //If not invalid name
        ConAction.changeVar('name', msg.trim())
    }
    StatePass: function(con, msg) {
        //if valid credentials 
        ConAction.clearVar('name')
        ConAction.changeMode('mainmenu')
    }
})