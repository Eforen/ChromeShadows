import { List, Map } from 'immutable';


import chai from 'chai';
let expect = chai.expect;

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


import ConnectionModule from '../connection.actions';

import * as telnetFlags from '../../telnetFlags'

//getSocket
//dispatch
import {
    newCom,
    interrupt,
    resize,
    newMsg,
    close,
    changeMode,
    stateChange,
    changeVar,
    clearVar,
    send,
    echoOff,
    echoOn,
    __RewireAPI__ as ConnectionModuleRewireAPI
} from '../connection.actions';
import {types} from '../../types/connection.types'
import sinon from 'sinon'
import colorize from 'colorize'

let placeholder = {}

describe('Actions > Connections', () => {
    beforeEach(()=>{
        //ConnectionModuleRewireAPI.__Rewire__("nextID", 7)
        //expect(getNextID()).to.equal(7)

        placeholder.console = {
            log: sinon.stub()
        }
        ConnectionModuleRewireAPI.__Rewire__("util", placeholder.console)

        placeholder.getID = sinon.stub()
        placeholder.getSocket = sinon.stub()
        
        ConnectionModuleRewireAPI.__Rewire__("getID", placeholder.getID)
        ConnectionModuleRewireAPI.__Rewire__("getSocket", placeholder.getSocket)

        placeholder.socket = {
            write: sinon.stub(),
            telnetCommand: sinon.stub()
        }

        placeholder.sockets = {
            getSocket: sinon.stub(),
        }
        ConnectionModuleRewireAPI.__Rewire__("sockets", placeholder.sockets)


        //placeholder.dispatch = sinon.stub()
        placeholder.getState = sinon.stub()
        placeholder.getStore = sinon.stub()
        placeholder.dispatch = sinon.spy((obj)=>{
            if(typeof(obj)=="function") return obj(placeholder.dispatch, placeholder.getState)
        })

        ConnectionModuleRewireAPI.__Rewire__("dispatch", placeholder.dispatch)
        ConnectionModuleRewireAPI.__Rewire__("getState", placeholder.getState)
        ConnectionModuleRewireAPI.__Rewire__("getStore", placeholder.getStore)


        placeholder.procMsg = sinon.stub()
        placeholder.procModeChange = sinon.stub()
        
        ConnectionModuleRewireAPI.__Rewire__("procMsg", placeholder.procMsg)
        ConnectionModuleRewireAPI.__Rewire__("procModeChange", placeholder.procModeChange)
    })
    it('newCom', (done) => {
        placeholder.sockets.getSocket.returns({
            term: "TestTerm",
            windowSize: [42, 69]
        })
        newCom(521).then(()=>{
            //expect(placeholder.console.log.getCall(0).args[0]).to.equal("attempting new connection term=TestTerm 42x69")
            expect(placeholder.sockets.getSocket.calledWith(521))
            expect(placeholder.console.log.getCall(0).args[0]).to.equal("Socket #%d: attempting new connection term=%s %dx%d")
            expect(placeholder.console.log.getCall(0).args[1]).to.equal(521)
            expect(placeholder.console.log.getCall(0).args[2]).to.equal("TestTerm")
            expect(placeholder.console.log.getCall(0).args[3]).to.equal(42)
            expect(placeholder.console.log.getCall(0).args[4]).to.equal(69)
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.NEW,
                socket: 521
            })
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('interrupt', (done) => {
        placeholder.getID.returns(3)
        interrupt(3).then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(3)
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.INTERRUPT,
                id: 3
            })
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('resize', (done) => {
        placeholder.getID.returns(6)
        resize(6, 42, 69).then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(6)
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.RESIZE,
                id: 6,
                width: 42,
                height: 69
            })
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('newMsg', (done) => {
        //Setup
        placeholder.getID.returns(23)
        //placeholder.dispatch.onCall(0).callsArgWith(0, placeholder.dispatch, placeholder.getState)
        //placeholder.dispatch.onCall(0).returns(Promise.resolve())
        //placeholder.dispatch = sinon.spy(function (obj){
        //    if(typeof(obj)=="function") return obj(placeholder.dispatch, placeholder.getState)
        //})
        //ConnectionModuleRewireAPI.__Rewire__("dispatch", placeholder.dispatch)
        //let redispatch = sinon.stub()
        //placeholder.dispatch.onCall(0).yields(redispatch, placeholder.getState)

        newMsg(23, "Yolo Bro!!!").then(()=>{
            //expect(placeholder.console.log.getCall(0).args[0]).to.equal("attempting new connection term=TestTerm 42x69")
            expect(placeholder.console.log.getCall(0).args[0]).to.equal("MSG: New From #%d: %s")
            expect(placeholder.console.log.getCall(0).args[1]).to.equal(23)
            expect(placeholder.console.log.getCall(0).args[2]).to.equal("Yolo Bro!!!")
            expect(placeholder.getID.getCall(0).args[0]).to.equal(23)
            //placeholder.yield([arg1, arg2, ...])
            let action = {
                type: types.MSG,
                id: 23,
                msg: "Yolo Bro!!!"
            }
            expect(placeholder.dispatch.getCall(1).args[0]).to.deep.equal(action)
            expect(placeholder.procMsg.getCall(0).args[0]).to.deep.equal(action)
            expect(placeholder.procMsg.getCall(0).args[1]).to.deep.equal(placeholder.dispatch)
            expect(placeholder.procMsg.getCall(0).args[2]).to.deep.equal(placeholder.getState)
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('close', (done) => {
        placeholder.getID.returns(6)
        close(6).then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(6)

            expect(placeholder.console.log.getCall(0).args[0]).to.equal("END Con#%d!")
            expect(placeholder.console.log.getCall(0).args[1]).to.equal(6)
            
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.CLOSE,
                id: 6
            })
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('changeMode', (done) => {
        placeholder.getID.returns(53)
        changeMode(53, "somenewmode").then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(53)
            //placeholder.yield([arg1, arg2, ...])
            let action = {
                type: types.MODE_CHANGE,
                id: 53,
                mode: "somenewmode"
            }
            expect(placeholder.dispatch.getCall(1).args[0]).to.deep.equal(action)
            expect(placeholder.procModeChange.getCall(0).args[0]).to.deep.equal(action)
            expect(placeholder.procModeChange.getCall(0).args[1]).to.deep.equal(placeholder.dispatch)
            expect(placeholder.procModeChange.getCall(0).args[2]).to.deep.equal(placeholder.getState)
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('stateChange', (done) => {
        placeholder.getID.returns(136)
        stateChange(136, "somenewState").then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(136)
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.STATE_CHANGE,
                id: 136,
                state: "somenewState"
            })
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('changeVar', (done) => {
        placeholder.getID.returns(621)
        changeVar(621, "someVarName", "someVarValue").then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(621)
            
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.VAR_CHANGE,
                id: 621,
                name: "someVarName",
                value: "someVarValue"
            })
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('clearVar', (done) => {
        placeholder.getID.returns(172)
        clearVar(172, "someVarName").then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(172)
            
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.VAR_CLEAR,
                id: 172,
                name: "someVarName"
            })
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
    it('send', (done) => {
        placeholder.getID.returns(7)
        placeholder.getSocket.withArgs(7).returns(placeholder.socket)

        //placeholder.getState.returns({connections:[,,,,,,,{socket:32}]})
        //placeholder.sockets.getSocket.withArgs(32).returns({write:write})
        send(7, "Some Msg about something").then(()=>{
            expect(placeholder.getID.getCall(0).args[0]).to.equal(7)

            expect(placeholder.socket.write.calledWith("Some Msg about something")).to.be.true

            done()
        })
    })
    it('echoOff', (done) => {
        //console.log(telnetFlags)

        placeholder.getID.returns(182)
        placeholder.getSocket.withArgs(182).returns(placeholder.socket)
        echoOff(182)

        expect(placeholder.getID.getCall(0).args[0]).to.equal(182)

        expect(placeholder.console.log.getCall(0).args[0]).to.equal("DONT ECHO #%d")
        expect(placeholder.console.log.getCall(0).args[1]).to.equal(182)

        expect(placeholder.getSocket.calledWith(182)).to.be.true
        expect(placeholder.socket.telnetCommand.calledWith(telnetFlags.WILL, telnetFlags.OPT_ECHO)).to.be.true

        done()
    })
    it('echoOn', (done) => {
        placeholder.getID.returns(8410)
        placeholder.getSocket.withArgs(8410).returns(placeholder.socket)
        echoOn(8410)
        
        expect(placeholder.getID.getCall(0).args[0]).to.equal(8410)

        expect(placeholder.console.log.getCall(0).args[0]).to.equal("DO ECHO #%d")
        expect(placeholder.console.log.getCall(0).args[1]).to.equal(8410)

        expect(placeholder.getSocket.calledWith(8410)).to.be.true
        expect(placeholder.socket.telnetCommand.calledWith(telnetFlags.WONT, [telnetFlags.OPT_ECHO, telnetFlags.OPT_NAOFFD, telnetFlags.OPT_NAOCRD])).to.be.true

        done()
    })
});