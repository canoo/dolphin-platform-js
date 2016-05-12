/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="Command.ts" />
/// <reference path="Tag.ts" />

module opendolphin {

    export class InitializeAttributeCommand extends Command {


        className:string;

        constructor(public pmId:string, public pmType:string, public propertyName:string, public qualifier:string, public newValue:any, public tag:string = Tag.value()) {
            super();
            this.id = 'InitializeAttribute';
            this.className = "org.opendolphin.core.comm.InitializeAttributeCommand";
        }
    }
}