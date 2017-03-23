import Command from "./Command";

export default class AttributeCreatedNotification extends Command {

    className:string;

    constructor(public pmId:string, public attributeId:string, public propertyName:string, public newValue:any, public qualifier:string) {
        super();
        this.id = 'AttributeCreated';
        this.className = "org.opendolphin.core.comm.AttributeCreatedNotification";
    }
}
