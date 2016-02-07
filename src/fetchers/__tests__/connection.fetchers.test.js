import { List, Map } from 'immutable';


import chai from 'chai';
let expect = chai.expect;

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


import ConnectionModule from '../connection.fetchers';

import * as telnetFlags from '../../telnetFlags'

//getSocket
//dispatch
import {
    getID,
    getMode,
    getState,
    getSocket,
    __RewireAPI__ as ConnectionModuleRewireAPI
} from '../connection.fetchers';

import sinon from 'sinon'
import colorize from 'colorize'

describe('Fetchers > Connection', () => {
    let placeholder = {}

    beforeEach(()=>{
        placeholder.testData = {
        	connections: List.of(
	            Map({
	                id: 0,
	                socket: 0, 
	                mode:"none", 
	                state: "init", 
	                vars:Map({})
	            }),
	            Map({
	                id: 1,
	                socket: 1, 
	                mode:"none", 
	                state: "init", 
	                vars:Map({testVar1: "Test Value1"})
	            }),
	            null,
	            Map({
	                id: 3,
	                socket: 2, 
	                mode:"none", 
	                state: "init", 
	                vars:Map({testVar2: "Test Value2", testVar3: "Test Value3"})
	            }),
	            null,
	            Map({
	                id: 5,
	                socket: 3, 
	                vars:Map({testVar4: "Test Value4"})
	            }),
	            Map({
	                id: 6,
	                socket: 4, 
	                mode:"something", 
	                state: "somewhere", 
	                vars:Map({})
	            })
	        ),
	        players: List.of()
	    }
        ConnectionModuleRewireAPI.__Rewire__("state", placeholder.testData)

        placeholder.console = {
            log: sinon.spy()
        }
        //ConnectionModule.__set__("console", placeholder.console)
        ConnectionModuleRewireAPI.__Rewire__("util", placeholder.console)

        placeholder.sockets = {
            getNextSocketID: sinon.stub(),
            getSocket: sinon.stub(),
            getSocketCon: sinon.stub(),
            addSocket: sinon.stub(),
            setSocketConnection: sinon.stub()
        }
        ConnectionModuleRewireAPI.__Rewire__("Sockets", placeholder.sockets)
    })

    it('getID', (done) => {
    	expect(getID(125)).to.equal(125)
    	expect(getID(674)).to.equal(674)
    	expect(getID(283)).to.equal(283)
    	expect(getID("8244")).to.equal(8244)
    	expect(getID("6745")).to.equal(6745)
    	expect(getID(()=>{})).to.throw("Invalid Connection")
    	done()
    })

    it('getMode', (done) => {
    	expect(getMode(1)).to.equal("none")
    	expect(getMode(6)).to.equal("something")
    	expect(getMode("1")).to.equal("none")
    	expect(getMode("6")).to.equal("something")
    	expect(getMode(5)).to.throw("No mode found")
    	expect(getMode(-1)).to.throw("Could not find Connection")
    	expect(getMode(7)).to.throw("Could not find Connection")
    	expect(getMode(2)).to.throw("Could not find Connection")
    	done()
    })

    it('getState', (done) => {
    	expect(getState(1)).to.equal("init")
    	expect(getState(6)).to.equal("somewhere")
    	expect(getState(8)).to.equal("init")
    	done()
    })

    it('getSocket', (done) => {
    	placeholder.sockets.withArgs(0).returns("s0")
    	placeholder.sockets.withArgs(1).returns("s1")
    	placeholder.sockets.withArgs(2).returns("s2")
    	placeholder.sockets.withArgs(3).returns("s3")
    	placeholder.sockets.withArgs(4).returns("s4")
    	expect(getSocket(0)).to.equal("s0")
    	expect(getSocket(1)).to.equal("s1")
    	expect(getSocket(3)).to.equal("s2")
    	expect(getSocket(5)).to.equal("s3")
    	expect(getSocket(6)).to.equal("s4")
    	done()
    })

    it('getVar', (done) => {
    	expect(getSocket(1, "testVar1")).to.equal("Test Value1")
    	expect(getSocket(3, "testVar2")).to.equal("Test Value2")
    	expect(getSocket(3, "testVar3")).to.equal("Test Value3")
    	expect(getSocket(5, "testVar4")).to.equal("Test Value4")
    	done()
    })

    it('isVar', (done) => {
    	expect(getSocket(1, "testVar1")).to.be.true
    	expect(getSocket(3, "testVar2")).to.be.true
    	expect(getSocket(3, "testVar3")).to.be.true
    	expect(getSocket(5, "testVar4")).to.be.true
    	done()
    })
})