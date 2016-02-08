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
import * as Con from '../connection.fetchers';
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
	        getState: sinon.stub()
		}
        let data = {
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
                })
            ),
            players: List.of()
        }
        data.connections = data.connections.set(3, Map({
            id: 3,
            socket: 2, 
            mode:"none", 
            state: "init", 
            vars:Map({testVar2: "Test Value2", testVar3: "Test Value3"})
        }))
        data.connections = data.connections.set(5, Map({
            id: 5,
            socket: 3, 
            vars:Map({testVar4: "Test Value4"})
        }))
        data.connections = data.connections.set(6, Map({
            id: 6,
            socket: 4, 
            mode:"something", 
            state: "somewhere", 
            vars:Map({})
        }))
		placeholder.testData.getState.returns(data)
        ConnectionModuleRewireAPI.__Rewire__("data", placeholder.testData)

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
    	expect(Con.getID(125)).to.equal(125)
    	expect(Con.getID(674)).to.equal(674)
    	expect(Con.getID(283)).to.equal(283)
    	expect(Con.getID("8244")).to.equal(8244)
    	expect(Con.getID("6745")).to.equal(6745)
    	expect(()=>Con.getID(()=>{})).to.throw("Invalid Connection")
    	done()
    })

    it('getMode', (done) => {
    	expect(Con.getMode(1)).to.equal("none")
    	expect(Con.getMode(6)).to.equal("something")
    	expect(Con.getMode("1")).to.equal("none")
    	expect(Con.getMode("6")).to.equal("something")
    	expect(()=>Con.getMode(5)).to.throw("No mode found")
    	expect(()=>Con.getMode(-1)).to.throw("Could not find Connection")
    	expect(()=>Con.getMode(7)).to.throw("Could not find Connection")
    	expect(()=>Con.getMode(2)).to.throw("Could not find Connection")
    	done()
    })

    it('getModeState', (done) => {
    	expect(Con.getModeState(1)).to.equal("init")
    	expect(Con.getModeState(6)).to.equal("somewhere")
    	expect(Con.getModeState(8)).to.equal("init")
    	done()
    })

    it('getState', (done) => {
        expect(getState(0)).to.equal(Map({
            id: 0,
            socket: 0, 
            mode:"none", 
            state: "init", 
            vars:Map({})
        }))
        expect(getState(1)).to.equal(Map({
            id: 1,
            socket: 1, 
            mode:"none", 
            state: "init", 
            vars:Map({testVar1: "Test Value1"})
        }))
        done()
    })

    it('getSocket', (done) => {
    	placeholder.sockets.getSocket.withArgs(0).returns("s0")
    	placeholder.sockets.getSocket.withArgs(1).returns("s1")
    	placeholder.sockets.getSocket.withArgs(2).returns("s2")
    	placeholder.sockets.getSocket.withArgs(3).returns("s3")
    	placeholder.sockets.getSocket.withArgs(4).returns("s4")
    	expect(Con.getSocket(0)).to.equal("s0")
    	expect(Con.getSocket(1)).to.equal("s1")
    	expect(Con.getSocket(3)).to.equal("s2")
    	expect(Con.getSocket(5)).to.equal("s3")
    	expect(Con.getSocket(6)).to.equal("s4")
    	done()
    })

    it('getVar', (done) => {
        expect(Con.getVar).to.be.a.function
    	expect(Con.getVar(1, "testVar1")).to.equal("Test Value1")
    	expect(Con.getVar(3, "testVar2")).to.equal("Test Value2")
    	expect(Con.getVar(3, "testVar3")).to.equal("Test Value3")
    	expect(Con.getVar(5, "testVar4")).to.equal("Test Value4")
    	done()
    })

    it('isVar', (done) => {
        expect(Con.isVar).to.be.a.function
    	expect(Con.isVar(1, "testVar1")).to.be.true
    	expect(Con.isVar(3, "testVar2")).to.be.true
    	expect(Con.isVar(3, "testVar3")).to.be.true
    	expect(Con.isVar(5, "testVar4")).to.be.true
    	done()
    })
})