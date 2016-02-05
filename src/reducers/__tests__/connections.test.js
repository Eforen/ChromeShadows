import { List, Map } from 'immutable';
//import { expect } from 'chai';


//let expect = require('chai').expect;
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);
let expect = chai.expect;


import ConnectionModule from '../connections';
import {connections, setNextID, getNextID, __RewireAPI__ as ConnectionModuleRewireAPI} from '../connections';
import {types} from '../../types/connections'
//import rewire from 'rewire'
//let rewire = require("rewire");
import sinon from 'sinon'
import colorize from 'colorize'


describe('Reducers > Connections', () => {
    let placeholder = {}
    beforeEach(()=>{
        //console.log("Testing this "+typeof(placeholder))
        placeholder.testData = List.of(
            Map({
                id: 0,
                socket: {
                    ConnectionID:0,
                    write: sinon.stub()
                }, 
                mode:"none", 
                state: "init", 
                vars:Map({})
            }),
            Map({
                id: 1,
                socket: {
                    ConnectionID:1,
                    write: sinon.stub()
                }, 
                mode:"none", 
                state: "init", 
                vars:Map({})
            })
        )
        placeholder.testData = placeholder.testData.set(3, Map({
            id: 3,
            socket: {
                ConnectionID:3,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }))
        placeholder.testData = placeholder.testData.set(5, Map({
            id: 5,
            socket: {
                ConnectionID:5,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }))
        placeholder.testData = placeholder.testData.set(6, Map({
            id: 6,
            socket: {
                ConnectionID:6,
                write: sinon.stub()
            }, 
            mode:"none", 
            state: "init", 
            vars:{}
        }))

        /*
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
        */

        Object.freeze(placeholder.testData)
        //setNextID(7)
        ConnectionModuleRewireAPI.__Rewire__("nextID", 7)
        expect(getNextID()).to.equal(7)

        placeholder.console = {
            log: sinon.spy()
        }
        //ConnectionModule.__set__("console", placeholder.console)
        ConnectionModuleRewireAPI.__Rewire__("util", placeholder.console)
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
            //expect(placeholder.console.log.calledWith("Connection #7: Connected...")).to.be.true
            expect(placeholder.console.log.getCall(0).args[0]).to.equal("Connection #7: Connected...")
            expect(getNextID()).to.equal(8)
            done()
        })
        it('INTERRUPT', (done) => {
            const action = {
                type: types.INTERRUPT,
                id: 3
            }
            const state = connections(placeholder.testData, action);
            expect(state[3] == placeholder.testData[3]).to.be.true //Data Not Changed
            expect(getNextID()).to.equal(7)

            //expect(placeholder.console.log.calledOnce).to.be.true
            //expect(placeholder.console.log.calledWith("INTR! on Connection #3")).to.be.true
            expect(placeholder.console.log.getCall(0).args[0]).to.equal("Connection #3: INTR!")

            done()
        })
        it('MSG', (done) => {
            const action = {
                type: types.MSG,
                id: 3,
                msg: "yolo!\n"
            }
            const state = connections(placeholder.testData, action);
            expect(state[3] == placeholder.testData[3]).to.be.true //Data Not Changed
            expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("CON 3: New msg #green[yolo!]"))
            done()
        })
        /*
        it('CLOSE', (done) => {
            done()
        })
        */
        it('RESIZE', (done) => {
            const action = {
                type: types.RESIZE,
                id: 6,
                width: 257,
                height: 823
            }
            const state = connections(placeholder.testData, action);
            expect(state[6] == placeholder.testData[6]).to.be.true //Data Not Changed
            expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("#grey[CON 6: resized to 257x823]"))
            done()
        })
        it('MODE_CHANGE', (done) => {
            const action = {
                type: types.MODE_CHANGE,
                id: 6,
                mode: "newMode"
            }
            //const state = connections(placeholder.testData, action);
            //expect(state[6] == placeholder.testData[6]).to.be.true //Data Not Changed
            //expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("#grey[CON 6: resized to 257x823]"))
            done()
        })
        it('STATE_CHANGE', (done) => {
            const action = {
                type: types.STATE_CHANGE,
                id: 6,
                state: "newState"
            }
            //const state = connections(placeholder.testData, action);
            //expect(state[6] == placeholder.testData[6]).to.be.true //Data Not Changed
            //expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("#grey[CON 6: resized to 257x823]"))
            throw "Not Writen"
            done()
        })
        it('VAR_CHANGE', (done) => {
            const action = {
                type: types.VAR_CHANGE,
                id: 6,
                name: "varName",
                value: "value"
            }
            //const state = connections(placeholder.testData, action);
            //expect(state[6] == placeholder.testData[6]).to.be.true //Data Not Changed
            //expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("#grey[CON 6: resized to 257x823]"))
            throw "Not Writen"
            done()
        })
        it('VAR_CLEAR', (done) => {
            const action = {
                type: types.VAR_CLEAR,
                id: 6,
                name: "varName"
            }
            //const state = connections(placeholder.testData, action);
            //expect(state[6] == placeholder.testData[6]).to.be.true //Data Not Changed
            //expect(placeholder.console.log.getCall(0).args[0]).to.equal(colorize.ansify("#grey[CON 6: resized to 257x823]"))
            throw "Not Writen"
            done()
        })
        /*
        */
    });
});