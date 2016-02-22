import { List, Map } from 'immutable';


import chai from 'chai';
let expect = chai.expect;

import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import sinon from 'sinon'
import colorize from 'colorize'

//Import Code to be tested
import * as modes from '../';


//import {Commanders as Com} from "../../commanders";
import {types} from '../../types/connection.types'

let registerMode = modes.registerMode

//Test the code

describe('Modes > Core', () => {
    let placeholder = {}
	
	function setModesList(list) {
	    placeholder.modes=list
	    modes.__Rewire__("modes", list)
	}

    beforeEach(()=>{
        placeholder.util = {
            log: sinon.stub()
        }
        modes.__Rewire__("util", placeholder.util)

        placeholder.Com = {
            Connections: {
            	types: types,
                echoOn: sinon.stub(),
                echoOff: sinon.stub(),
                getVar: sinon.stub(),
                changeVar: sinon.stub(),
                clearVar: sinon.stub(),
                send: sinon.stub(),
                stateChange: sinon.stub(),
                changeMode: sinon.stub(),
                getMode: sinon.stub(),
                getState: sinon.stub(),
            },
            Players: {
                loadPlayer: sinon.stub(),
                isPlayerLoaded: sinon.stub(),
                getPlayer: sinon.stub(),
                exists: sinon.stub(),
                validate: sinon.stub(),
                isReservedName:  sinon.stub()
            }
        }
        modes.__Rewire__("Com", placeholder.Com)

        placeholder.dispatch = sinon.stub()
        placeholder.getState = sinon.stub()

        setModesList({id:"TestMode1", StateInit: sinon.stub(), StateNum2: sinon.stub()},{id:"TestMode2", StateInit: sinon.stub(), StateNum5: sinon.stub()})

        modes.registerMode = sinon.spy(registerMode)
        modes.__Rewire__("registerMode", modes.registerMode)

        expect(modes).to.be.an.object
    })







    it('procModeChange > wrong action', (done) => {
        expect(modes.procModeChange).to.be.a.function

        let action = {
        	type: "sahdebsb",
        	id: parseInt((Math.random() * 1000), 10)
        }

        modes.procModeChange(action).then(()=>{
        	throw new Error("Successful when it should not have been.")
        }, (err)=>{
            expect(err).to.equal("wrong action")
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it('procModeChange > invalid mode', (done) => {
        //Setup
        let action = {
        	type: types.MODE_CHANGE,
        	id: parseInt((Math.random() * 1000), 10),
        	mode: "TestMode7"
        }

        placeholder.Com.Connections.getMode.returns(action.mode)
        placeholder.Com.Connections.getState.returns("init")

        //Test
        expect(modes.procModeChange).to.be.a.function

        modes.procModeChange(action).then(()=>{
        	throw new Error("Successful when it should not have been.")
        }, (err)=>{
            expect(err).to.equal("missing mode")

            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Modes: Entered an invalid mode \"%s\" ")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)
            expect(placeholder.util.log.getCall(0).args[2]).to.equal("TestMode7")
            
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it('procModeChange > state not init', (done) => {
        //Setup
        let action = {
        	type: types.MODE_CHANGE,
        	id: parseInt((Math.random() * 1000), 10),
        	mode: "TestMode1"
        }

        placeholder.Com.Connections.getMode.returns(action.mode)
        placeholder.Com.Connections.getState.returns("NotInit")

        //Test
        expect(modes.procModeChange).to.be.a.function

        modes.procModeChange(action).then(()=>{
        	throw new Error("Successful when it should not have been.")
        }, (err)=>{
            expect(err).to.equal("redundent mode call")
            expect(placeholder.modes[0].StateInit.called).to.be.false
            
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it('procModeChange > valid', (done) => {
        //Setup
        let action = {
        	type: types.MODE_CHANGE,
        	id: parseInt((Math.random() * 1000), 10),
        	mode: "TestMode1"
        }

        placeholder.Com.Connections.getMode.returns(action.mode)
        placeholder.Com.Connections.getState.returns("NotInit")

        //Test
        expect(modes.procModeChange).to.be.a.function

        modes.procModeChange(action).then(()=>{
            expect(err).to.equal("redundent mode call")
            expect(placeholder.modes[0].StateInit.called).to.be.false
            
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
/*





    it('procMsg > wrong action', (done) => {
        //Setup
        placeholder.Com.Players.isReservedName.returns(false)

        //Test
        expect(modes.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        modes.StateName(conNum, " asdayolo! ").then(()=>{}, ()=>{
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Invalid Name (Not Alphanumaric)")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.isReservedName.getCall(0).args[0]).to.equal("asdayolo!")

            //Name Invalid
            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Please use only letters and numbers...\nTry again...\n")

          
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Players.loadPlayer.called).to.be.false

            done()
        })
    })

    it('procMsg > invalid mode', (done) => {
        //Setup
        placeholder.Com.Players.isReservedName.returns(false)

        //Test
        expect(modes.StateName).to.be.a.function

        let conNum = parseInt((Math.random() * 1000), 10)

        modes.StateName(conNum, " Ada ").then(()=>{}, ()=>{
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Invalid Name (Too Short)")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.isReservedName.getCall(0).args[0]).to.equal("ada")

            //Name Invalid
            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Usernames must be more then 6 charecters...\nTry again...\n")

          
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Players.loadPlayer.called).to.be.false

            done()
        })
    })

    it('procMsg > State Method not available', (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)

        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.resolve())
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobar").then(()=>{
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Got Pass")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobar")

            expect(placeholder.Com.Connections.echoOn.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.changeMode.getCall(0).args[1]).to.equal("mainmenu")
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it('procMsg > valid', (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)

        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("tester").returns(true)
        //placeholder.Com.Players.validate.returns()
        //placeholder.Com.Players.validate.returns(false)
        placeholder.Com.Players.validate.returns(Promise.reject("password"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("tester")

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('password')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Entered the wrong Pass")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            //expect(placeholder.Com.Players.exists.calledWith("tester")).to.be.true

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry that user already exists and thats not the password...\n")

            //Rerun StateInit
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })






    it("registerMode > mode already registered", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("no user"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('no user')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > User does not exist offering creation...")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Tester I don't know you, do you want to register [y/n]? ")

            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it("registerMode > no id", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("lasdfjlaewwofvm"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('unknown error')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Unknown Error")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry could not log in as that user...\n")

            //Rerun StateInit
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it("registerMode > no init state", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("lasdfjlaewwofvm"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('unknown error')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Unknown Error")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry could not log in as that user...\n")

            //Rerun StateInit
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it("registerMode > valid", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("lasdfjlaewwofvm"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('unknown error')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Unknown Error")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry could not log in as that user...\n")

            //Rerun StateInit
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })






    it("registerAllModes > modes is not empty", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("lasdfjlaewwofvm"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('unknown error')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Unknown Error")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry could not log in as that user...\n")

            //Rerun StateInit
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it("registerAllModes > no modes in allModes", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("lasdfjlaewwofvm"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('unknown error')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Unknown Error")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry could not log in as that user...\n")

            //Rerun StateInit
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })

    it("registerAllModes > valid", (done) => {
        //Setup
        let conNum = parseInt((Math.random() * 1000), 10)
        placeholder.Com.Players.exists.returns(false)
        placeholder.Com.Players.exists.withArgs("Tester").returns(true)
        placeholder.Com.Players.validate.returns(Promise.reject("lasdfjlaewwofvm"))
        placeholder.Com.Connections.getVar.withArgs(conNum, "name").returns("Tester")
        //placeholder.Com.Players.validate.returns(false)
        //placeholder.Com.Players.validate.withArgs("tester", "foobar").returns(true)

        expect(modes.StatePass).to.be.a.function


        modes.StatePass(conNum,"foobarz").then(()=>{},(err)=>{
            expect(err).to.equal('unknown error')
            expect(placeholder.util.log.getCall(0).args[0]).to.equal("Con %d: Login > Unknown Error")
            expect(placeholder.util.log.getCall(0).args[1]).to.equal(conNum)

            expect(placeholder.Com.Players.validate.getCall(0).args[0]).to.equal("Tester")
            expect(placeholder.Com.Players.validate.getCall(0).args[1]).to.equal("foobarz")

            expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(conNum)
            expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal("Sorry could not log in as that user...\n")

            //Rerun StateInit
            expect(modes.StateInit.calledWith(conNum)).to.be.true

            expect(placeholder.Com.Connections.changeMode.calledOnce).to.be.false
            done()
        }).catch((e)=>{
            setTimeout(()=>{throw e});
        })
    })
*/
})