import { List, Map } from 'immutable';
import { expect } from 'chai';
import connections from '../connections';
import {types} from '../../types/connections'

describe('reducers', () => {
    describe('connections', () => {
        it('NEW', (done) => {
            const action = {
                type: types.NEW,
                socket: { marker:"Socket Mockup" }
            }
            const state = [];
            Object.freeze(state)
            const nextState = connections(state, action);
            expect(nextState).to.deep.equal([{
                id: 0,
                socket: { marker:"Socket Mockup", ConnectionID: 0 }, 
                mode:"none", 
                state: "init", 
                vars:{}
            }])
            done()
        })
        it('INTERRUPT', (done) => {
            throw "Not Writen"
            done()
        })
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
    });
});