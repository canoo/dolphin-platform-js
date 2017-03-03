/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import ChangeAttributeMetadataCommand from "../../js/dolphin/ChangeAttributeMetadataCommand";

import { expect } from 'chai';

describe('ChangeAttributeMetadataCommandTests', () => {

    var changedAttrMDCommand;
    beforeEach(() =>{
        changedAttrMDCommand = new ChangeAttributeMetadataCommand("10", "MDName", 20);
    });

    it('id should  be equal to ChangeAttributeMetadata', () => {
        expect(changedAttrMDCommand.id).to.equal('ChangeAttributeMetadata');
    });

    it('className should  be equal to org.opendolphin.core.comm.ChangeAttributeMetadataCommand', () => {
        expect(changedAttrMDCommand.className).to.equal('org.opendolphin.core.comm.ChangeAttributeMetadataCommand');
    });

    it('attributeId should  be equal to 10', () => {
        expect(changedAttrMDCommand.attributeId).to.equal('10');
    });

    it('metadataName should  be equal to MDName', () => {
        expect(changedAttrMDCommand.metadataName).to.equal('MDName');
    });

    it('value should be equal to 20', () => {
        expect(changedAttrMDCommand.value).to.equal(20);
    });
});


