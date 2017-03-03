/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientPresentationModel, InvalidationEvent } from "../../js/dolphin/ClientPresentationModel";

import { assert } from 'chai';


describe('ClientPresentationModelTests', () => {

    it('create pm with automatic id', () => {
        var pm1 = new ClientPresentationModel(undefined,undefined);
        var pm2 = new ClientPresentationModel(undefined,undefined);
        assert.notEqual(pm1.id, pm2.id);
    });

    it('create pm with given id', () => {
        var pm1 = new ClientPresentationModel("MyId",undefined);
        assert.equal(pm1.id, "MyId");
    });

    it('create pm with given type', () => {
        var pm1 = new ClientPresentationModel(undefined,"MyType");
        assert.equal(pm1.presentationModelType, "MyType");
    });

    it('adding client attributes', () => {
        var pm1 = new ClientPresentationModel(undefined,undefined);
        assert.equal(pm1.getAttributes().length, 0);
        var firstAttribute = new ClientAttribute("prop", "qual", 0);
        pm1.addAttribute(firstAttribute);
        assert.equal(pm1.getAttributes().length, 1);
        assert.equal(pm1.getAttributes()[0], firstAttribute);
    });


    it('invalidate ClientPresentationModel event', () => {
        var pm1 = new ClientPresentationModel(undefined,undefined);
        var clientAttribute = new ClientAttribute("prop", "qual", 0);
        pm1.addAttribute(clientAttribute);
        var source;
        pm1.onInvalidated((event:InvalidationEvent) => {
            source=event.source;
        });
        clientAttribute.setValue("newValue");
        assert.equal(pm1,source);
    });


    it('find attribute by id', () => {
        var pm = new ClientPresentationModel(undefined,undefined);
        var ca1 = new ClientAttribute("prop1","qual1","value1");

        pm.addAttribute(ca1);
        var result = pm.findAttributeById(ca1.id);
        assert.equal(ca1,result);
        // find by invalid id
        result=pm.findAttributeById("no-such-id");
        assert.equal(result, null);
    });


    it('find attribute by qualifier', () => {
        var pm = new ClientPresentationModel(undefined,undefined);
        var ca1 = new ClientAttribute("prop1","qual1","value1");

        pm.addAttribute(ca1);
        var result = pm.findAttributeByQualifier("qual1");
        assert.equal(ca1,result);
        // find by invalid qualifier
        result=pm.findAttributeByQualifier("dummy");
        assert.equal(result, null);
    });


    it('simple copy', () => {

        var ca1 = new ClientAttribute("prop1","qual1","value1");
        var ca2 = new ClientAttribute("prop2","qual2","value2");
        var pm1 = new ClientPresentationModel("pmId","pmType");
        pm1.addAttribute(ca1);
        pm1.addAttribute(ca2);

        var pm2 = pm1.copy();
        assert.notEqual(pm1.id, pm2.id);
        assert.equal(true, pm2.clientSideOnly);

        assert.equal(pm1.presentationModelType, pm2.presentationModelType) // not sure this is a good idea
        assert.equal(pm1.getAttributes().length, pm2.getAttributes().length)
        assert.equal(pm1.getAt('prop2').getValue(), pm2.getAt('prop2').getValue()) // a spy would be nice here
    });
});
