import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import { ValueChangedEvent } from "../../js/dolphin/ClientAttribute";

import { TestClass } from "../../testrunner/tsUnit";


export default class ClientAttributeTests extends TestClass {

    attributesShouldGetUniqueIds() {
        var ca1 = new ClientAttribute("prop","qual", "value");
        var ca2 = new ClientAttribute("prop","qual", "value");
        this.areNotIdentical(ca1.id, ca2.id);
    }

    valueListenersAreCalled() {
        var attr = new ClientAttribute("prop", "qual", 0);

        var spoofedOld = -1;
        var spoofedNew = -1;
        attr.onValueChange( (evt: ValueChangedEvent) => {
            spoofedOld = evt.oldValue;
            spoofedNew = evt.newValue;
        } )

        this.areIdentical(spoofedOld, 0)
        this.areIdentical(spoofedNew, 0)

        attr.setValue(1);

        this.areIdentical(spoofedOld, 0)
        this.areIdentical(spoofedNew, 1)

    }

    attributeListenersAreCalled() {
        var attr = new ClientAttribute("prop", "qual", 0);

        var spoofedOldQfr;
        var spoofedNewQfr;
        attr.onQualifierChange((evt:ValueChangedEvent) => {
            spoofedOldQfr = evt.oldValue;
            spoofedNewQfr = evt.newValue;
        })
        attr.setQualifier("qual_change");

        this.areIdentical(spoofedOldQfr, "qual")
        this.areIdentical(spoofedNewQfr, "qual_change")
    }

    valueListenersDoNotInterfere() {
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

        this.areIdentical(spoofedNew1, 1)
        this.areIdentical(spoofedNew2, 2)

    }

    checkValue() {
        //valid values
        this.areIdentical(5, ClientAttribute.checkValue(5));
        this.areIdentical(0, ClientAttribute.checkValue(0));
        this.areIdentical("test", ClientAttribute.checkValue("test"));

        var date = new Date();
        this.areIdentical(date,ClientAttribute.checkValue(date));

        var attr = new ClientAttribute("prop", "qual1", 0);
        attr.setValue(15);
        this.areIdentical(15, ClientAttribute.checkValue(attr));

        //Wrapper classes
        this.areIdentical("test", ClientAttribute.checkValue(new String("test")));
        this.areIdentical(false, ClientAttribute.checkValue(new Boolean(false)));
        this.areIdentical(15, ClientAttribute.checkValue(new Number(15)));

        //invalid values
        this.areIdentical(null, ClientAttribute.checkValue(null));
        this.areIdentical(null, ClientAttribute.checkValue(undefined)); // null is treated as undefined
        try {
            ClientAttribute.checkValue(new ClientPresentationModel(undefined, "type"))
            this.fail()
        } catch (error) {
            this.isTrue(error instanceof Error);
        }
    }

    simpleCopy() {
        var ca1 = new ClientAttribute("prop","qual","value");
        var ca2 = ca1.copy();

        this.areNotIdentical(ca1.id, ca2.id); // id must not be copied
        this.areIdentical(undefined, ca2.getPresentationModel()); // no pm must be set

        this.areIdentical(ca1.getValue(),     ca2.getValue());
        this.areIdentical(ca1.getQualifier(), ca2.getQualifier());
        this.areIdentical(ca1.propertyName,   ca2.propertyName); // todo dk: for consistency, there should be getPropertyName()
    }


}
