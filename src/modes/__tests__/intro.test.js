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
import intro from '../intro';

//Test the code

describe('Modes > Intro', () => {
    let placeholder = {}
    let data = null
    beforeEach(()=>{
        placeholder.util = {
            log: sinon.stub()
        }
        intro.__Rewire__("util", placeholder.util)

        placeholder.Com = {
            Connections: {
                send: sinon.stub(),
                stateChange: sinon.stub(),
                changeMode: sinon.stub(),
            }
        }
        intro.__Rewire__("Com", placeholder.Com)

        intro((obj) => {
        	data = obj
        })

        expect(data).to.be.an.object
    })

    it('Check the Mode ID', (done) => {
        expect(data.ID).to.be.a.string
        expect(data.ID).to.equal("intro")
        done()
    })

    it('Check the Init', (done) => {
        expect(data.Init).to.be.a.function

        data.Init(25)

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Intro: Sending init to connection #25")

        expect(placeholder.Com.Connections.send.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.send.getCall(0).args[1]).to.equal(Array(50).join("\n")+"Welcome Press enter to Continue... ")

        expect(placeholder.Com.Connections.stateChange.getCall(0).args[0]).to.equal(25)
        expect(placeholder.Com.Connections.stateChange.getCall(0).args[1]).to.equal("Continue")
        done()
    })

    it('Check the StateContinue', (done) => {
        expect(data.StateContinue).to.be.a.function

        data.StateContinue(16,"/n")

        expect(placeholder.util.log.getCall(0).args[0]).to.equal("Intro: Sending connection #16 to login")

        expect(placeholder.Com.Connections.changeMode.getCall(0).args[0]).to.equal(16)
        expect(placeholder.Com.Connections.changeMode.getCall(0).args[1]).to.equal("login")
        done()
    })
})