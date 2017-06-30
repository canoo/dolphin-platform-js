"use strict";
const EventBus_1 = require('./EventBus');
class ClientAttribute {
    constructor(propertyName, qualifier, value) {
        this.propertyName = propertyName;
        this.id = "" + (ClientAttribute.clientAttributeInstanceCount++) + "C";
        this.valueChangeBus = new EventBus_1.default();
        this.qualifierChangeBus = new EventBus_1.default();
        this.setValue(value);
        this.setQualifier(qualifier);
    }
    /** a copy constructor with new id and no presentation model */
    copy() {
        var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
        return result;
    }
    setPresentationModel(presentationModel) {
        if (this.presentationModel) {
            alert("You can not set a presentation model for an attribute that is already bound.");
        }
        this.presentationModel = presentationModel;
    }
    getPresentationModel() {
        return this.presentationModel;
    }
    getValue() {
        return this.value;
    }
    setValue(newValue) {
        var verifiedValue = ClientAttribute.checkValue(newValue);
        if (this.value == verifiedValue)
            return;
        var oldValue = this.value;
        this.value = verifiedValue;
        this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
    }
    setQualifier(newQualifier) {
        if (this.qualifier == newQualifier)
            return;
        var oldQualifier = this.qualifier;
        this.qualifier = newQualifier;
        this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
    }
    getQualifier() {
        return this.qualifier;
    }
    static checkValue(value) {
        if (value == null || value == undefined) {
            return null;
        }
        var result = value;
        if (result instanceof String || result instanceof Boolean || result instanceof Number) {
            result = value.valueOf();
        }
        if (result instanceof ClientAttribute) {
            console.log("An Attribute may not itself contain an attribute as a value. Assuming you forgot to call value.");
            result = this.checkValue(value.value);
        }
        var ok = false;
        if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result) > -1 || result instanceof Date) {
            ok = true;
        }
        if (!ok) {
            throw new Error("Attribute values of this type are not allowed: " + typeof value);
        }
        return result;
    }
    onValueChange(eventHandler) {
        this.valueChangeBus.onEvent(eventHandler);
        eventHandler({ "oldValue": this.value, "newValue": this.value });
    }
    onQualifierChange(eventHandler) {
        this.qualifierChangeBus.onEvent(eventHandler);
    }
    syncWith(sourceAttribute) {
        if (sourceAttribute) {
            this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
            this.setValue(sourceAttribute.value);
        }
    }
}
ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;
exports.ClientAttribute = ClientAttribute;

//# sourceMappingURL=ClientAttribute.js.map
