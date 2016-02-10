import { List, Map } from 'immutable';


import chai from 'chai';
let expect = chai.expect;

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


//import ConnectionModule from '../connection.actions';

//import * as telnetFlags from '../../telnetFlags'

import sinon from 'sinon'
import colorize from 'colorize'

//getSocket
//dispatch
/*
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
*/


describe('Actions > Players', () => {
    /*
    let placeholder = {}
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
    it('getPrompt', (done) => {
        expect(getPrompt).to.be.a.function
        done()
    })
    it('getCombatPrompt', (done) => {
        expect(getCombatPrompt).to.be.a.function
        done()
    })
    it('getLocation', (done) => {
        expect(getLocation).to.be.a.function
        done()
    })
    it('getSocket', (done) => {
        expect(getSocket).to.be.a.function
        done()
    })
    it('getInventory', (done) => {
        expect(getInventory).to.be.a.function
        done()
    })
    it('isInInventory', (done) => {
        expect(isInInventory).to.be.a.function
        done()
    })
    it('getAttribute', (done) => {
        expect(getAttribute).to.be.a.function
        done()
    })
    it('hasAttribute', (done) => {
        expect(hasAttribute).to.be.a.function
        done()
    })
    it('getSkills', (done) => {
        expect(getSkills).to.be.a.function
        done()
    })
    */

    /*
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    it('', (done) => {
        expect().to.be.a.function
        done()
    })
    */
});