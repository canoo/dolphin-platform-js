/// <reference path="Command.ts" />

module opendolphin {

    export class AttributeMetadataChangedCommand extends Command {

        className:string;

        constructor(public attributeId:string, public metadataName:string, public value:any) {
            super();
            this.id = 'AttributeMetadataChanged';
            this.className = "org.opendolphin.core.comm.AttributeMetadataChangedCommand";
        }
    }
}