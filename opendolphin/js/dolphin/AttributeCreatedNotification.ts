import Command from "./Command";
import Tag from "./Tag";


export default class AttributeCreatedNotification extends Command {

    className:string;

    constructor(public pmId:string, public attributeId:string, public propertyName:string, public newValue:any, public qualifier:string, public tag:string = Tag.value()) {
        super();
        this.id = 'AttributeCreated';
        this.className = "org.opendolphin.core.comm.AttributeCreatedNotification";
    }
}
