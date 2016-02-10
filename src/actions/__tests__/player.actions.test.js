import { List, Map } from 'immutable';


import chai from 'chai';
let expect = chai.expect;

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


import ConnectionModule from '../connection.actions';

import * as telnetFlags from '../../telnetFlags'

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
    /*
    it('removePlayer', (done) => {
        expect(removePlayer).to.be.a.function
        done()
    })
    it('addPlayer', (done) => {
        expect(addPlayer).to.be.a.function
        done()
    })

    // Call on all players except for those in array
    it('Call on each', (done) => {
        expect(callEach).to.be.a.function
        done()
    })

    // Call on all players except for those in array
    it('call on each except', (done) => {
        expect(callEachExcept).to.be.a.function
        done()
    })

    // Call on all players that the condition ivaluates true for
    it('call each if', (done) => {
        expect(callEachIf).to.be.a.function
        done()
    })

    // Call on all players at location
    it('call each at', (done) => {
        expect(callEachAt).to.be.a.function //(location, callback)
        done()
    })

    // Call on all players in distance of location
    it('call each at', (done) => {
        expect(callEachAt).to.be.a.function //(location, distance, callback)
        done()
    })

    // Broadcast on all players except for those in array
    it('Broadcast on each', (done) => {
        eBroadcastt(broadcast).to.be.a.function
        done()
    })

    // Broadcast on all players except for those in array
    it('Broadcast on each except', (done) => {
        expect(broadcastExcept).to.be.a.function
        done()
    })

    // Broadcast on all players that the condition ivaluates true for
    it('Broadcast each if', (done) => {
        expect(broadcastIf).to.be.a.function
        done()
    })

    // Broadcast on all players at location
    it('Broadcast each at', (done) => {
        expect(broadcastAt).to.be.a.function //(location, callback)
        done()
    })

    // Broadcast on all players in distance of location
    it('Broadcast each at', (done) => {
        expect(broadcastAt).to.be.a.function //(location, distance, callback)
        done()
    })
    */

    /*
    it('setPrompt', (done) => {
        expect(setPrompt).to.be.a.function
        done()
    })
    it('setCombatPrompt', (done) => {
        expect(setCombatPrompt).to.be.a.function
        done()
    })
    it('setName', (done) => {
        expect(setName).to.be.a.function
        done()
    })
    it('setLocation', (done) => {
        expect(setLocation).to.be.a.function
        done()
    })
    it('setPassword', (done) => {
        expect(setPassword).to.be.a.function
        done()
    })
    it('addItem', (done) => {
        expect(addItem).to.be.a.function
        done()
    })
    it('removeItem', (done) => {
        expect(removeItem).to.be.a.function
        done()
    })
    it('setInventory', (done) => {
        expect(setInventory).to.be.a.function
        done()
    })
    it('setInCombat', (done) => {
        expect(setInCombat).to.be.a.function
        done()
    })
    it('setAttribute', (done) => {
        expect(setAttribute).to.be.a.function
        done()
    })
    it('addSkill', (done) => {
        expect(addSkill).to.be.a.function
        done()
    })
    */
});