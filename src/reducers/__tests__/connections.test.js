import { List, Map } from 'immutable';
//import { expect } from 'chai';
let expect = require('chai').expect;
import ConnectionModule from '../connections';
import {connections, setNextID, getNextID, __RewireAPI__ as ConnectionModuleRewireAPI} from '../connections';
import {types} from '../../types/connections'
//import rewire from 'rewire'
//let rewire = require("rewire");
import sinon from 'sinon'


describe('reducers', () => {
    let placeholder = {}
    beforeEach(()=>{
        //console.log("Testing this "+typeof(placeholder))
        placeholder.testData = [];
        placeholder.testData[0] = {
            id: 0,
            socket: {
                ConnectionID:0,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }
        placeholder.testData[1] = {
            id: 1,
            socket: {
                ConnectionID:1,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }
        placeholder.testData[3] = {
            id: 3,
            socket: {
                ConnectionID:3,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }
        placeholder.testData[5] = {
            id: 5,
            socket: {
                ConnectionID:5,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }
        placeholder.testData[6] = {
            id: 6,
            socket: {
                ConnectionID:6,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }

        Object.freeze(placeholder.testData)
        setNextID(7)
        expect(getNextID()).to.equal(7)

        placeholder.console = {
            log: sinon.spy()
        }
        //ConnectionModule.__set__("console", placeholder.console)
        ConnectionModuleRewireAPI.__Rewire__("console", placeholder.console)
    })
    describe('connections', () => {
        it('Insure new adds a new connection correctly and counts correctly.', (done) => {
            const action = {
                type: types.NEW,
                socket: { marker:"Socket Mockup" }
            }
            const state = connections(placeholder.testData, action);
            expect(state[7]).to.deep.equal({
                id: 7,
                socket: { marker:"Socket Mockup", ConnectionID: 7 }, 
                mode:"none", 
                state: "init", 
                vars:{}
            })
            expect(getNextID()).to.equal(8)
            done()
        })
        it('INTERRUPT', (done) => {
            const action = {
                type: types.INTERRUPT,
                id: 3
            }
            const state = connections(placeholder.testData, action);
            expect(state[3] == placeholder.testData[3]).to.be.true
            expect(getNextID()).to.equal(7)

            //expect(placeholder.console.log.calledOnce).to.be.true
            expect(placeholder.console.log.calledWith("INTR! on Connection #3")).to.be.true

            done()
        })
        /*
        it('MSG', (done) => {
            throw "Not Writen"
            done()
        })
        it('CLOSE', (done) => {
            throw "Not Writen"
            done()
        })
        it('RESIZE', (done) => {
            throw "Not Writen"
            done()
        })
        it('MODE_CHANGE', (done) => {
            throw "Not Writen"
            done()
        })
        it('STATE_CHANGE', (done) => {
            throw "Not Writen"
            done()
        })
        it('VAR_CHANGE', (done) => {
            throw "Not Writen"
            done()
        })
        it('VAR_CLEAR', (done) => {
            throw "Not Writen"
            done()
        })
        */
    });
});