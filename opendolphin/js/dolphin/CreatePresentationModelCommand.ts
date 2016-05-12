/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="Command.ts" />
module opendolphin {

    export class CreatePresentationModelCommand extends Command {

        pmId:string;
        className:string;
        pmType:string;
        attributes:any[] = [];
        clientSideOnly:boolean = false;

        constructor(presentationModel:ClientPresentationModel) {
            super();
            this.id = "CreatePresentationModel";
            this.className = "org.opendolphin.core.comm.CreatePresentationModelCommand";
            this.pmId = presentationModel.id;
            this.pmType = presentationModel.presentationModelType;

            var attrs = this.attributes
            presentationModel.getAttributes().forEach(function(attr) {
                attrs.push({
                    propertyName:   attr.propertyName,
                    id:             attr.id,
                    qualifier:      attr.getQualifier(),
                    value:          attr.getValue(),
                    tag:            attr.tag
                });
            });

        }
    }
}