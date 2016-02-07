import { List, Map } from 'immutable';


import chai from 'chai';
let expect = chai.expect;

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


import ConnectionModule from '../connections.actions';
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
} from '../connections.actions';
import {types} from '../../types/connections.types'
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


        //placeholder.dispatch = sinon.stub()
        placeholder.dispatch = sinon.spy((obj)=>{
            if(typeof(obj)=="function") return obj(placeholder.dispatch, placeholder.getState)
        })
        placeholder.getState = sinon.stub()
        placeholder.getStore = sinon.stub()

        ConnectionModuleRewireAPI.__Rewire__("dispatch", placeholder.dispatch)
        ConnectionModuleRewireAPI.__Rewire__("getState", placeholder.getState)
        ConnectionModuleRewireAPI.__Rewire__("getStore", placeholder.getStore)


        placeholder.procMsg = sinon.stub()
        placeholder.procModeChange = sinon.stub()
        
        ConnectionModuleRewireAPI.__Rewire__("procMsg", placeholder.procMsg)
        ConnectionModuleRewireAPI.__Rewire__("procModeChange", placeholder.procModeChange)
    })
    it('newCom', (done) => {
        newCom({
            term: "TestTerm",
            windowSize: [42, 69]
        }).then(()=>{
            //expect(placeholder.console.log.getCall(0).args[0]).to.equal("attempting new connection term=TestTerm 42x69")
            expect(placeholder.console.log.getCall(0).args[0]).to.equal("attempting new connection term=%s %dx%d")
            expect(placeholder.console.log.getCall(0).args[1]).to.equal("TestTerm")
            expect(placeholder.console.log.getCall(0).args[2]).to.equal(42)
            expect(placeholder.console.log.getCall(0).args[3]).to.equal(69)
            expect(placeholder.dispatch.getCall(0).args[0]).to.deep.equal({
                type: types.NEW,
                socket: {
                    term: "TestTerm",
                    windowSize: [42, 69]
                }
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
    it('changeMode - Not Coded', (done) => {
        /*
        const action = {
            type: types.STATE_CHANGE,
            id: 6,
            state: "newState"
        }
        const state = connections(placeholder.testData, action);
        expect(state.get(6)).to.equal(Map({
            id: 6,
            socket: 4, 
            mode:"something", 
            state: "newState", 
            vars:Map({})
        }))
        */
        done()
    })
    it('stateChange - Not Coded', (done) => {
        /*
        const action = {
            type: types.VAR_CHANGE,
            id: 6,
            name: "varName",
            value: "value"
        }
        const state = connections(placeholder.testData, action);
        expect(state.get(6)).to.equal(Map({
            id: 6,
            socket: 4, 
            mode:"something", 
            state: "somewhere", 
            vars:Map({varName: "value"})
        }))
        */
        done()
    })
    it('changeVar - Not Coded', (done) => {
        /*
        const action = {
            type: types.VAR_CLEAR,
            id: 5,
            name: "testVar"
        }
        const state = connections(placeholder.testData, action);
        expect(state.get(5)).to.equal(Map({
            id: 5,
            socket: 3, 
            mode:"none", 
            state: "init", 
            vars:Map({})
        }))
        */
        done()
    })
    it('clearVar - Not Coded', (done) => {
        done()
    })
    it('send - Not Coded', (done) => {
        done()
    })
    it('echoOff - Not Coded', (done) => {
        done()
    })
    it('echoOn - Not Coded', (done) => {
        done()
    })
});