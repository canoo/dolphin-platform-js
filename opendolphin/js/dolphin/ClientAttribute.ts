import { ClientPresentationModel } from './ClientPresentationModel'
import EventBus from './EventBus'


export interface ValueChangedEvent {
    oldValue;
    newValue;
}

export class ClientAttribute {
    private static SUPPORTED_VALUE_TYPES:string[] = ["string", "number", "boolean"];
    static clientAttributeInstanceCount : number = 0;
    id                          : string;
    private value               : any;
    private qualifier           : string;
    private presentationModel   : ClientPresentationModel;
    private valueChangeBus      : EventBus<ValueChangedEvent>;
    private qualifierChangeBus  : EventBus<ValueChangedEvent>;

    constructor(public propertyName:string, qualifier:string, value:any) {
        this.id = "" + (ClientAttribute.clientAttributeInstanceCount++) + "C";
        this.valueChangeBus = new EventBus();
        this.qualifierChangeBus = new EventBus();
        this.setValue(value);
        this.setQualifier(qualifier);
    }

    /** a copy constructor with new id and no presentation model */
    copy() {
        var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
        return result;
    }

    setPresentationModel(presentationModel:ClientPresentationModel) {
        if (this.presentationModel) {
            alert("You can not set a presentation model for an attribute that is already bound.");
        }
        this.presentationModel = presentationModel;
    }

    getPresentationModel():ClientPresentationModel {
        return this.presentationModel;
    }

    getValue():any {
        return this.value;
    }

    setValue(newValue) {
        var verifiedValue = ClientAttribute.checkValue(newValue);
        if (this.value == verifiedValue) return;
        var oldValue = this.value;
        this.value = verifiedValue;
        this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
    }

    setQualifier(newQualifier) {
        if (this.qualifier == newQualifier) return;
        var oldQualifier = this.qualifier;
        this.qualifier = newQualifier;
        this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
    }

    getQualifier(): string{
        return this.qualifier;
    }

    static checkValue(value:any) : any {
        if (value == null || value == undefined) {
            return null;
        }
        var result = value;
        if (result instanceof String || result instanceof Boolean || result instanceof Number) {
            result = value.valueOf();
        }
        if (result instanceof ClientAttribute) {
            console.log("An Attribute may not itself contain an attribute as a value. Assuming you forgot to call value.")
            result = this.checkValue((<ClientAttribute>value).value);
        }
        var ok:boolean = false;
        if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result) > -1 || result instanceof Date) {
            ok = true;
        }
        if (!ok) {
            throw new Error("Attribute values of this type are not allowed: " + typeof value);
        }
        return result;
    }

    onValueChange(eventHandler:(event:ValueChangedEvent) => void) {
        this.valueChangeBus.onEvent(eventHandler);
        eventHandler({"oldValue": this.value, "newValue": this.value});
    }

    onQualifierChange(eventHandler:(event:ValueChangedEvent) => void) {
        this.qualifierChangeBus.onEvent(eventHandler);
    }

    syncWith(sourceAttribute:ClientAttribute) {
        if (sourceAttribute) {
            this.setQualifier(sourceAttribute.getQualifier());     // sequence is important
            this.setValue(sourceAttribute.value);
            // syncing propertyName is not needed since they must be identical anyway
        }
    }
}
