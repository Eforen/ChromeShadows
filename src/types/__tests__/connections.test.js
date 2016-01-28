import {List, Map} from 'immutable';
import {expect} from 'chai';
import {types} from '../connections'
//import {setEntries, next, vote} from '../src/core';

describe('types', () => {
	describe('connections', () => {
		it('types are correct', () => {
			const typeset = {
				NEW : "CON_NEW",
				INTERRUPT : "CON_INTERRUPT",
				MSG : "CON_MSG",
				CLOSE : "CON_CLOSE",
				RESIZE : "CON_RESIZE",
				MODE_CHANGE : "MODE_CHANGE",
				STATE_CHANGE : "STATE_CHANGE",
				VAR_CHANGE : "VAR_CHANGE",
				VAR_CLEAR : "VAR_CLEAR"
			};

			expect(types).to.deep.equal(typeset)
		});
	});
});