import {CREATE_PRESENTATION_MODEL_COMMAND_ID} from './commandConstants';

export default class CreatePresentationModelCommand {
    constructor(presentationModel) {
        this.id = CREATE_PRESENTATION_MODEL_COMMAND_ID;

        this.attributes = [];
        this.clientSideOnly = false;
        this.pmId = presentationModel.id;
        this.pmType = presentationModel.presentationModelType;
        var attrs = this.attributes;
        presentationModel.getAttributes().forEach(function (attr) {
            attrs.push({
                propertyName: attr.propertyName,
                id: attr.id,
                qualifier: attr.getQualifier(),
                value: attr.getValue()
            });
        });
    }
}