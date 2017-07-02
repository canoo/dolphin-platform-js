
export default class CreatePresentationModelCommand {
    constructor(presentationModel) {
        this.id = "CreatePresentationModel";

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