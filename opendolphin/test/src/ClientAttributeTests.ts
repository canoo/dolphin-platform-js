/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import { ValueChangedEvent } from "../../js/dolphin/ClientAttribute";


import { assert } from 'chai';

describe('ClientAttributeTests', () => {

    it('attributes should get uniqueIds', () => {
        var ca1 = new ClientAttribute("prop","qual", "value");
        var ca2 = new ClientAttribute("prop","qual", "value");
        assert.notEqual(ca1.id, ca2.id);
    });

    it('value listeners are called', () => {
        var attr = new ClientAttribute("prop", "qual", 0);

        var spoofedOld = -1;
        var spoofedNew = -1;
        attr.onValueChange( (evt: ValueChangedEvent) => {
            spoofedOld = evt.oldValue;
            spoofedNew = evt.newValue;
        } )

        assert.equal(spoofedOld, 0)
        assert.equal(spoofedNew, 0)

        attr.setValue(1);

        assert.equal(spoofedOld, 0)
        assert.equal(spoofedNew, 1)

    });

    it('attribute listeners are called', () => {
        var attr = new ClientAttribute("prop", "qual", 0);

        var spoofedOldQfr;
        var spoofedNewQfr;
        attr.onQualifierChange((evt:ValueChangedEvent) => {
            spoofedOldQfr = evt.oldValue;
            spoofedNewQfr = evt.newValue;
        })
        attr.setQualifier("qual_change");

        assert.equal(spoofedOldQfr, "qual")
        assert.equal(spoofedNewQfr, "qual_change")
    });

    it('value listeners do not interfere', () => {
        var attr1 = new ClientAttribute("prop", "qual1", 0);
        var attr2 = new ClientAttribute("prop", "qual2", 0);

        var spoofedNew1 = -1;
        attr1.onValueChange( (evt: ValueChangedEvent) => {
            spoofedNew1 = evt.newValue;
        } )
        attr1.setValue(1);

        var spoofedNew2 = -1;
        attr2.onValueChange( (evt: ValueChangedEvent) => {
            spoofedNew2 = evt.newValue;
        } )
        attr2.setValue(2);
        assert.equal(spoofedNew1, 1)
        assert.equal(spoofedNew2, 2)

    });

    it('check value', () => {
        //valid values
        assert.equal(5, ClientAttribute.checkValue(5));
        assert.equal(0, ClientAttribute.checkValue(0));
        assert.equal("test", ClientAttribute.checkValue("test"));

        var date = new Date();
        assert.equal(date,ClientAttribute.checkValue(date));

        var attr = new ClientAttribute("prop", "qual1", 0);
        attr.setValue(15);
        assert.equal(15, ClientAttribute.checkValue(attr));

        //Wrapper classes
        assert.equal("test", ClientAttribute.checkValue(new String("test")));
        assert.equal(false, ClientAttribute.checkValue(new Boolean(false)));
        assert.equal(15, ClientAttribute.checkValue(new Number(15)));

        //invalid values
        assert.equal(null, ClientAttribute.checkValue(null));
        assert.equal(null, ClientAttribute.checkValue(undefined)); // null is treated as undefined
        try {
            ClientAttribute.checkValue(new ClientPresentationModel(undefined, "type"))
            assert.fail();
        } catch (error) {
            assert.isTrue(error instanceof Error);
        }
    });

    it('simple copy', () => {
        var ca1 = new ClientAttribute("prop","qual","value");
        var ca2 = ca1.copy();

        assert.notEqual(ca1.id, ca2.id); // id must not be copied
        assert.equal(undefined, ca2.getPresentationModel()); // no pm must be set

        assert.equal(ca1.getValue(),     ca2.getValue());
        assert.equal(ca1.getQualifier(), ca2.getQualifier());
        assert.equal(ca1.propertyName,   ca2.propertyName); // todo dk: for consistency, there should be getPropertyName()
    });


});
