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
import login from '../login';

//Test the code

describe('Modes > Login', () => {
    let placeholder = {}
    let data = null
    beforeEach(()=>{
        placeholder.util = {
            log: sinon.stub()
        }
        login.__Rewire__("util", placeholder.util)

        placeholder.Com = {
            Connections: {
                echoOn: sinon.stub(),
                echoOff: sinon.stub(),
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
            }
        }
        login.__Rewire__("Com", placeholder.Com)

        login((obj) => {
        	data = obj
        })

        expect(data).to.be.an.object
    })

    it('Check the Mode ID', (done) => {
        expect(data.ID).to.be.a.string
        expect(data.ID).to.equal("login")
        done()
    })

    it('Check the Init', (done) => {
        expect(data.Init).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.Init(conNum)

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
        done()
    })

    it('StateName > Valid Name', (done) => {
        expect(data.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StateName(conNum, 'name', " Tes23TeR12 ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Name from client")

        //Name Valid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Slot me some credentials chummer! ")

        expect(placeholder.Com.Connections.changeVar.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.changeVar.getCall(0).args[1]).to.equal("name")
        expect(placeholder.Com.Connections.changeVar.getCall(0).args[2]).to.equal("yoloman")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Pass")

        expect(placeholder.Com.Players.loadPlayer.called(With("tester"))).to.be.true

        done()
    })

    it('StateName > Invalid Name (Reserved) --Not Implimented', (done) => {
        expect(data.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StateName(conNum, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Reserved Name from connection #conNum")

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("That is a Reserved name and your\nstatistics do not match login rejected...\n\nAttempt Logged... \n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    })

    it('StateName > Invalid Name (Spaces)', (done) => {
        expect(data.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StateName(conNum, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Reserved Name from connection #conNum")

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Spaces are not allowed in Username...\nTry again...\n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    })

    it('StateName > Invalid Name (Not Alphanumaric) {Tester Alpha!}', (done) => {
        expect(data.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StateName(conNum, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Reserved Name from connection")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Please use only letters and numbers...\nTry again...\n")

        expect(placeholder.util.log.getCall(1).args[0]).to.equal("Con %d: Login > Sending init to client")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    })

    it('StateName > Invalid Name (Too Short) {Tes}', (done) => {
        expect(data.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StateName(conNum, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Attempted Reserved Name")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        //Name Invalid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Usernames must be more then 6 charecters...\nTry again...\n")

        expect(placeholder.util.log.getCall(1).args[0]).to.equal("Con %d: Login > Sending init to connection")
        expect(placeholder.util.log.getCall(1).args[1]).to.equal(conNum)

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    })

    it('StatePass > Valid Pass', (done) => {
        //Setup
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.callWith("tester").returns(true)
        placeholder.Com.Players.validatePassword.returns(false)
        placeholder.Com.Players.validatePassword.callWith("tester", "foobar").returns(true)

        expect(data.StatePass).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StatePass(conNum,"foobar")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Pass")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

        expect(placeholder.Com.Players.validatePassword.getCall(0).args[0]).to.equal("tester")
        expect(placeholder.Com.Players.validatePassword.getCall(0).args[1]).to.equal("foobar")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.changeMode.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.changeMode.getCall(0).args[1]).to.equal("mainmenu")
        done()
    })

    it('StatePass > Invalid Pass (User Exists)', (done) => {
        //Setup
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.callWith("tester").returns(true)
        placeholder.Com.Players.validatePassword.returns(false)
        placeholder.Com.Players.validatePassword.callWith("tester", "foobar").returns(true)

        expect(data.StatePass).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StatePass(conNum,"foobarz")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Pass from connection")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)




        expect(placeholder.Com.Players.exists.calledWith("tester")).to.be.true

        expect(placeholder.Com.Players.validatePassword.getCall(0).args[0]).to.equal("tester")
        expect(placeholder.Com.Players.validatePassword.getCall(0).args[1]).to.equal("foobarz")

        //Rerun Init
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry that user already exists and thats not the password...\n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Connections.changeMode.called()).to.be.false
        done()
    })

    it("StatePass > Invalid Pass (User Doesn't Exist)", (done) => {
        //Setup
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.callWith("tester").returns(true)
        placeholder.Com.Players.validatePassword.returns(false)
        placeholder.Com.Players.validatePassword.callWith("tester", "foobar").returns(true)

        expect(data.StatePass).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        data.StatePass(conNum,"foobarz")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Pass from connection")
        expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)




        expect(placeholder.Com.Players.exists.calledWith("tester")).to.be.true

        expect(placeholder.Com.Players.validatePassword.getCall(0).args[0]).to.equal("tester")
        expect(placeholder.Com.Players.validatePassword.getCall(0).args[1]).to.equal("foobarz")

        //Rerun Init
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry that user already exists and thats not the password...\n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Sending init to client #conNum")

        expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(conNum)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Connections.changeMode.called()).to.be.false
        done()
    })
})