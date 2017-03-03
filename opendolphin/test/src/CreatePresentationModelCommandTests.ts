// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import CreatePresentationModelCommand from "../../js/dolphin/CreatePresentationModelCommand";

import { assert } from 'chai';


describe('CreatePresentationModelCommandTests', () => {

    it('create PresentationModelCommand with given parameter', () => {

        var pm = new ClientPresentationModel("MyId","MyType");
        var clientAttribute1 = new ClientAttribute("prop1", "qual1", 0);
        var clientAttribute2 = new ClientAttribute("prop2", "qual2", 0);
        pm.addAttribute(clientAttribute1);
        pm.addAttribute(clientAttribute2);
        var createPMCommand = new CreatePresentationModelCommand(pm);
        assert.equal(createPMCommand.id,"CreatePresentationModel");
        assert.equal(createPMCommand.className,"org.opendolphin.core.comm.CreatePresentationModelCommand");
        assert.equal(createPMCommand.pmId,"MyId");
        assert.equal(createPMCommand.pmType,"MyType");

        assert.equal(createPMCommand.attributes.length,2);
        assert.equal(createPMCommand.attributes[0].propertyName,"prop1");
        assert.equal(createPMCommand.attributes[1].propertyName,"prop2");
    });

});
