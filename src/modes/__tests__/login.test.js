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

        data.Init(25)

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Sending init to connection #25")

        expect(placeholder.Com.Connections.echoOn.calledWith(25)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")
        done()
    })

    it('StateName > Valid Name', (done) => {
        expect(data.StateName).to.be.a.function

        data.StateName(25, 'name', " Tes23TeR12 ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Got Name from connection #25")

        //Name Valid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Slot me some credentials chummer! ")

        expect(placeholder.Com.Connections.changeVar.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.changeVar.getCall(0).args[1]).to.equal("name")
        expect(placeholder.Com.Connections.changeVar.getCall(0).args[2]).to.equal("yoloman")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Pass")

        expect(placeholder.Com.Players.loadPlayer.called(With("tester"))).to.be.true

        done()
    })

    it('StateName > Invalid Name (Reserved) --Not Implimented', (done) => {
        expect(data.StateName).to.be.a.function

        data.StateName(36, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Got Reserved Name from connection #36")

        //Name Valid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("That is a Reserved name and your\nstatistics do not match login rejected...\n\nAttempt Logged... \n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Sending init to connection #36")

        expect(placeholder.Com.Connections.echoOn.calledWith(25)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    }

    it('StateName > Invalid Name (Spaces)', (done) => {
        expect(data.StateName).to.be.a.function

        data.StateName(36, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Got Reserved Name from connection #36")

        //Name Valid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Spaces are not allowed in Username...\nTry again...\n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Sending init to connection #36")

        expect(placeholder.Com.Connections.echoOn.calledWith(25)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    }

    it('StateName > Invalid Name (Not Alphanumaric) {Tester Alpha!}', (done) => {
        expect(data.StateName).to.be.a.function

        data.StateName(36, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Got Reserved Name from connection #36")

        //Name Valid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Please use only letters and numbers...\nTry again...\n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Sending init to connection #36")

        expect(placeholder.Com.Connections.echoOn.calledWith(25)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    }

    it('StateName > Invalid Name (Too Short) {Tes}', (done) => {
        expect(data.StateName).to.be.a.function

        data.StateName(36, 'name', " Admin ")
        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Got Reserved Name from connection #36")

        //Name Valid
        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Usernames must be more then 6 charecters...\nTry again...\n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Login: Sending init to connection #36")

        expect(placeholder.Com.Connections.echoOn.calledWith(25)).to.be.true

        expect(placeholder.Com.Connections.send.getCall(1).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(1).args[1]).to.equal("What's your name? ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Name")

        expect(placeholder.Com.Players.loadPlayer.called()).to.be.false

        done()
    }

    it('Check the StatePass', (done) => {
        expect(data.StatePass).to.be.a.function

        data.StatePass(16,"/n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Intro: Sending connection #16 to login")

        expect(placeholder.Com.Connections.changeMode.getCall(0).args[0]).to.equal(16)
        expect(placeholder.Com.Connections.changeMode.getCall(0).args[1]).to.equal("mainmenu")
        done()
    })
})