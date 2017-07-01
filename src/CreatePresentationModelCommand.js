"use strict";
const Command_1 = require('./Command');
class CreatePresentationModelCommand extends Command_1.default {
    constructor(presentationModel) {
        super();
        this.attributes = [];
        this.clientSideOnly = false;
        this.id = "CreatePresentationModel";
        this.className = "org.opendolphin.core.comm.CreatePresentationModelCommand";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreatePresentationModelCommand;

//# sourceMappingURL=CreatePresentationModelCommand.js.map
