import { List, Map } from 'immutable';


import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);
let expect = chai.expect;


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
} from '../connections';
import {types} from '../../types/connections'
import sinon from 'sinon'
import colorize from 'colorize'

let placeholder = {}

describe('Actions > Connections', () => {
    beforeEach(()=>{
        ConnectionModuleRewireAPI.__Rewire__("nextID", 7)
        expect(getNextID()).to.equal(7)

        placeholder.console = {
            log: sinon.spy()
        }
        ConnectionModuleRewireAPI.__Rewire__("util", placeholder.console)

        placeholder.getID = sinon.spy()
        placeholder.getSocket = sinon.spy()
        
        ConnectionModuleRewireAPI.__Rewire__("getID", placeholder.getID)
        ConnectionModuleRewireAPI.__Rewire__("getSocket", placeholder.getSocket)


        placeholder.dispatch = sinon.spy()
        placeholder.getState = sinon.spy()
        placeholder.getStore = sinon.spy()

        ConnectionModuleRewireAPI.__Rewire__("dispatch", placeholder.dispatch)
        ConnectionModuleRewireAPI.__Rewire__("getState", placeholder.getState)
        ConnectionModuleRewireAPI.__Rewire__("getStore", placeholder.getStore)


        placeholder.procMsg = sinon.spy()
        placeholder.procModeChange = sinon.spy()
        
        ConnectionModuleRewireAPI.__Rewire__("procMsg", placeholder.procMsg)
        ConnectionModuleRewireAPI.__Rewire__("procModeChange", placeholder.procModeChange)
    })
    it('newCom', (done) => {
        newCom({
            term: "TestTerm",
            windowSize: [42, 69]
        }).then(()=>{
            expect(placeholder.console.log.getCall(0).args[0]).to.equal("attempting new connection term=TestTerm 42x69")
            expect(placeholder.dispatch.getCall(0).args[0]).to.equal({
                type: types.NEW,
                socket: {
                    term: "TestTerm",
                    windowSize: [42, 69]
                }
            })
            done()
        })
    })
    it('interrupt', (done) => {
        /*
        const action = {
            type: types.INTERRUPT,
            id: 3
        }
        const state = connections(placeholder.testData, action);
        expect(getNextID()).to.equal(7)

        expect(placeholder.console.log.getCall(0).args[0]).to.equal("Connection #3: INTR!")
        */

        done()
    })
    it('resize', (done) => {
        /*
        const action = {
            type: types.MSG,
            id: 3,
            msg: "yolo!\n"
        }
        const state = connections(placeholder.testData, action);
        expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("CON 3: New msg #green[yolo!]"))
        */
        done()
    })
    it('newMsg', (done) => {
        /*
        const action = {
            type: types.RESIZE,
            id: 6,
            width: 257,
            height: 823
        }
        const state = connections(placeholder.testData, action);
        expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("#grey[CON 6: resized to 257x823]"))
        */
        done()
    })
    it('close', (done) => {
        /*
        const action = {
            type: types.MODE_CHANGE,
            id: 6,
            mode: "newMode"
        }
        const state = connections(placeholder.testData, action);
        expect(state.get(6)).to.equal(Map({
            id: 6,
            socket: 4, 
            mode:"newMode", 
            state: "init", 
            vars:Map({})
        }))
        */
        done()
    })
    it('changeMode', (done) => {
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
    it('stateChange', (done) => {
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
    it('changeVar', (done) => {
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
    it('clearVar', (done) => {
    })
    it('send', (done) => {
    })
    it('echoOff', (done) => {
    })
    it('echoOn', (done) => {
    })
});