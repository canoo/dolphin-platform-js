/// <reference path="Command.ts" />
/// <reference path="Tag.ts" />

module opendolphin {

    export class AttributeCreatedNotification extends Command {

        className:string;

        constructor(public pmId:string, public attributeId:string, public propertyName:string, public newValue:any, public qualifier:string, public tag:string = Tag.value()) {
            super();
            this.id = 'AttributeCreated';
            this.className = "org.opendolphin.core.comm.AttributeCreatedNotification";
        }
    }
}