//import { List, Map } from 'immutable';
//import { expect } from 'chai';


//let expect = require('chai').expect;
import chai from 'chai';
//import chaiImmutable from 'chai-immutable';

//chai.use(chaiImmutable);
let expect = chai.expect;


//import SocketsModule from '../sockets';
import {
	getNextSocketID,
	getSocket,
	getSocketCon,
	addSocket, 
	setSocketConnection, 
	__RewireAPI__ as SocketsModuleRewireAPI
} from '../sockets';
import sinon from 'sinon'

let placeholder = {}
describe('Core > Sockets', () => {
	beforeEach(()=>{

        placeholder.testObjData = [];
        placeholder.testObjData[0] = "Test Socket Data 0"
        placeholder.testObjData[1] = "Test Socket Data 1"
        placeholder.testObjData[3] = "Test Socket Data 3"
        placeholder.testObjData[5] = "Test Socket Data 5"
        placeholder.testObjData[6] = "Test Socket Data 6"
        SocketsModuleRewireAPI.__Rewire__("socketObj", placeholder.testObjData)

		placeholder.testConData = [];
        placeholder.testConData[0] = -1
        placeholder.testConData[1] = -1
        placeholder.testConData[3] = 4
        placeholder.testConData[5] = -1
        placeholder.testConData[6] = 7

		//console.log(placeholder.testConData)
        SocketsModuleRewireAPI.__Rewire__("socketConnection", placeholder.testConData)

        //setNextID(7)
        SocketsModuleRewireAPI.__Rewire__("nextSocket", 7)
        expect(getNextSocketID()).to.equal(7)

        //placeholder.console = {
        //    log: sinon.spy()
        //}
        //ConnectionModule.__set__("console", placeholder.console)
        //ConnectionModuleRewireAPI.__Rewire__("util", placeholder.console)
    })
	it('getSocket', (done) => {
		expect(getSocket(5)).to.equal("Test Socket Data 5")
        done()
    })
	it('getSocketCon', (done) => {
		expect(getSocketCon(3)).to.equal(4)
        done()
    })
	it('addSocket', (done) => {
		expect(addSocket("Test 7")).to.equal(7)
		//expect(getSocket(7)).to.equal("Test 7")
		//expect(getSocketCon(7)).to.equal(-1)
		//console.log(placeholder.testObjData)
		expect(placeholder.testObjData[7]).to.equal("Test 7")
		expect(placeholder.testConData[7]).to.equal(-1)

		expect(addSocket("Test 8", 62)).to.equal(8)
		//expect(getSocket(8)).to.equal("Test 8")
		//expect(getSocketCon(8)).to.equal(62)
		expect(placeholder.testObjData[8]).to.equal("Test 8")
		expect(placeholder.testConData[8]).to.equal(62)
        done()
    })
	it('setSocketConnection', (done) => {
		expect(setSocketConnection(3)).to.equal(4)
		//console.log(placeholder.testConData)
		//expect(getSocketCon(3)).to.equal(-1)
		expect(placeholder.testConData[3]).to.equal(-1)
		//console.log(placeholder.testConData)
		expect(setSocketConnection(3, 8)).to.equal(-1)
		//expect(getSocketCon(3)).to.equal(8)
		expect(placeholder.testConData[3]).to.equal(8)
		//console.log(placeholder.testConData)
		expect(setSocketConnection(3)).to.equal(8)
		//expect(getSocketCon(3)).to.equal(-1)
		expect(placeholder.testConData[3]).to.equal(-1)

		//console.log(placeholder.testConData)
		//Test another number once to be safe
		expect(setSocketConnection(6, 62)).to.equal(7)
		expect(placeholder.testConData[6]).to.equal(62)
        done()
    })
})