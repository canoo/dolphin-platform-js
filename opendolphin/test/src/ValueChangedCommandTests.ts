// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import ValueChangedCommand from "../../js/dolphin/ValueChangedCommand";

import { expect } from 'chai';

describe('ValueChangedCommandTests', () => {

    var valueChangedCommand;
    beforeEach(() =>{
        valueChangedCommand = new ValueChangedCommand("10", 20);
    });

    it('should create ValueChangedCommand with given parameter', () => {

        expect(valueChangedCommand.id).to.equal('ValueChanged');
        expect(valueChangedCommand.className).to.equal('org.opendolphin.core.comm.ValueChangedCommand');
        expect(valueChangedCommand.attributeId).to.equal('10');
        expect(valueChangedCommand.newValue).to.equal(20);

    });
});

