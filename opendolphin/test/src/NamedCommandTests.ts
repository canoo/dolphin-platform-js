/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import NamedCommand from "../../js/dolphin/NamedCommand";

import { expect } from 'chai';

describe('NamedCommandTests', () => {

    var namedCommand;
    beforeEach(() =>{
        namedCommand = new NamedCommand("CustomId");
    });

    it('id should be equal to CustomId', () => {
        expect(namedCommand.id).to.equal('CustomId');
    });

    it('className should be equal to org.opendolphin.core.comm.NamedCommand', () => {
        expect(namedCommand.className).to.equal('org.opendolphin.core.comm.NamedCommand');
    });

});
