import { List, Map } from 'immutable';


import chai from 'chai';
let expect = chai.expect;

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import sinon from 'sinon'
import colorize from 'colorize'

//Import Code to be tested
import * as login from '../login';
let init = login.Init

//Test the code

describe('Modes > Login', () => {
    let placeholder = {}
    beforeEach(()=>{
        placeholder.util = {
            log: sinon.stub()
        }
        login.__Rewire__("util", placeholder.util)

        placeholder.Com = {
            Connections: {
                echoOn: sinon.stub(),
                echoOff: sinon.stub(),
                getVar: sinon.stub(),
                changeVar: sinon.stub(),
                clearVar: sinon.stub(),
                send: sinon.stub(),
                stateChange: sinon.stub(),
                changeMode: sinon.stub(),
            },
            Players: {
                loadPlayer: sinon.stub(),
                isPlayerLoaded: sinon.stub(),
                getPlayer: sinon.stub(),
                exists: sinon.stub(),
                validate: sinon.stub(),
                isReservedName:  sinon.stub()
            }
        }
        login.__Rewire__("Com", placeholder.Com)

        login.Init = sinon.spy(init)
        login.__Rewire__("Init", login.Init)

        expect(login).to.be.an.object
    })

    it('Check the Mode ID', (done) => {
        expect(login.ID).to.be.a.string
        expect(login.ID).to.equal("login")
        done()
    })

    it('Check the Init', (done) => {
        expect(login.Init).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        login.Init(conNum)

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
        done()
    })

    it('StateName > Valid Name', (done) => {
        //Setup
        placeholder.Com.Players.isReservedName.returns(false)

        //Test
        expect(login.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        login.StateName(conNum, " Tes23TeR1 ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Name from client")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        //Name Valid
        expect(placeholder.Com.Players.isReservedName.getCall(0).args[0]).to.equal("tes23ter1")

        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Slot me some credentials chummer! ")

        expect(placeholder.Com.Connections.changeVar.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.changeVar.getCall(0).args[1]).to.equal("name")
        expect(placeholder.Com.Connections.changeVar.getCall(0).args[2]).to.equal("tes23ter1")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Pass")

        expect(placeholder.Com.Players.loadPlayer.calledWith("tes23ter1")).to.be.true

        done()
    })

    it('StateName > Invalid Name (Reserved)', (done) => {
        //Setup
        placeholder.Com.Players.isReservedName.returns(true)

        //Test
        expect(login.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        login.StateName(conNum, " Admin ")

        expect(placeholder.Com.Players.isReservedName.getCall(0).args[0]).to.equal("admin")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Reserved Name")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("That is a Reserved name and your\nstatistics do not match login rejected...\n\nAttempt Logged... \n")

        /*
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
        */
        expect(login.Init.getCall(0).args[0]).to.equal(conNum)

        expect(placeholder.Com.Players.loadPlayer.called).to.be.false

        done()
    })

    it('StateName > Invalid Name (Spaces)', (done) => {
        //Setup
        placeholder.Com.Players.isReservedName.returns(false)

        //Test
        expect(login.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        login.StateName(conNum, " sffs eve ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Invalid Name (Spaces)")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)
        
        expect(placeholder.Com.Players.isReservedName.getCall(0).args[0]).to.equal("sffs eve")

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Spaces are not allowed in Username...\nTry again...\n")

        /*
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
        */

        expect(login.Init.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Players.loadPlayer.called).to.be.false

        done()
    })

    it('StateName > Invalid Name (Not Alphanumaric) {Tester Alpha!}', (done) => {
        //Setup
        placeholder.Com.Players.isReservedName.returns(false)

        //Test
        expect(login.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        login.StateName(conNum, " asdayolo! ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Invalid Name (Not Alphanumaric)")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        expect(placeholder.Com.Players.isReservedName.getCall(0).args[0]).to.equal("asdayolo!")

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Please use only letters and numbers...\nTry again...\n")

        /*
        expect(placeholder.util.log.getCall(1).args[0]).to.equal("Con %d: Login > Sending init to client")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
        */
        expect(login.Init.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Players.loadPlayer.called).to.be.false

        done()
    })

    it('StateName > Invalid Name (Too Short) {Tes}', (done) => {
        //Setup
        placeholder.Com.Players.isReservedName.returns(false)

        //Test
        expect(login.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        login.StateName(conNum, " Ada ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Invalid Name (Too Short)")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        expect(placeholder.Com.Players.isReservedName.getCall(0).args[0]).to.equal("ada")

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Usernames must be more then 6 charecters...\nTry again...\n")

        /*
        expect(placeholder.util.log.getCall(1).args[0]).to.equal("Con %d: Login > Sending init to connection")
        expect(placeholder.util.log.getCall(1).args[1]).to.equal(conNum)

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
         */
        expect(login.Init.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Players.loadPlayer.called).to.be.false

        done()
    })

    it('StatePass > Valid Pass', (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)

        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.resolve())
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(login.StatePass).to.be.a.function


        login.StatePass(conNum,"foobar").then(()=>{
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Pass")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobar")

            expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.changeMode.getCall(0).args[1]).to.equal("mainmenu")
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it('StatePass > Invalid Pass (User Exists)', (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)

        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("tester").returns(true)
        //placeholder.Com.Players.validate.returns()
        //placeholder.Com.Players.validate.returns(false)
        placeholder.Com.Players.validate.returns(Promise.reject("password"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("tester")

        expect(login.StatePass).to.be.a.function


        login.StatePass(conNum,"foobarz").then(()=>{
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Entered the wrong Pass")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            //expect(placeholder.Com.Players.exists.calledWith("tester")).to.be.true

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            //Rerun Init
            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry that user already exists and thats not the password...\n")


            /*
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

            expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

            expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
             */
            expect(login.Init.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it("StatePass > Invalid Pass (User Doesn't Exist)", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("no user"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(login.StatePass).to.be.a.function


        login.StatePass(conNum,"foobarz").then(()=>{
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > User does not exist offering creation...")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)




            //expect(placeholder.Com.Players.exists.calledWith("tester")).to.be.true

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            //Rerun Init
            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Tester I don't know you, do you want to register [y/n]? ")


            /*
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

            expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

            expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
             */
            expect(login.Init.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
})