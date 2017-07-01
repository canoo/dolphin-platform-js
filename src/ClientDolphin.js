"use strict";
const ClientAttribute_1 = require("./ClientAttribute");
const ClientPresentationModel_1 = require("./ClientPresentationModel");
class ClientDolphin {
    setClientConnector(clientConnector) {
        this.clientConnector = clientConnector;
    }
    getClientConnector() {
        return this.clientConnector;
    }
    send(command, onFinished) {
        this.clientConnector.send(command, onFinished);
    }
    // factory method for attributes
    attribute(propertyName, qualifier, value) {
        return new ClientAttribute_1.ClientAttribute(propertyName, qualifier, value);
    }
    // factory method for presentation models
    presentationModel(id, type, ...attributes) {
        var model = new ClientPresentationModel_1.ClientPresentationModel(id, type);
        if (attributes && attributes.length > 0) {
            attributes.forEach((attribute) => {
                model.addAttribute(attribute);
            });
        }
        this.getClientModelStore().add(model);
        return model;
    }
    setClientModelStore(clientModelStore) {
        this.clientModelStore = clientModelStore;
    }
    getClientModelStore() {
        return this.clientModelStore;
    }
    listPresentationModelIds() {
        return this.getClientModelStore().listPresentationModelIds();
    }
    listPresentationModels() {
        return this.getClientModelStore().listPresentationModels();
    }
    findAllPresentationModelByType(presentationModelType) {
        return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
    }
    getAt(id) {
        return this.findPresentationModelById(id);
    }
    findPresentationModelById(id) {
        return this.getClientModelStore().findPresentationModelById(id);
    }
    deletePresentationModel(modelToDelete) {
        this.getClientModelStore().deletePresentationModel(modelToDelete, true);
    }
    updatePresentationModelQualifier(presentationModel) {
        presentationModel.getAttributes().forEach(sourceAttribute => {
            this.updateAttributeQualifier(sourceAttribute);
        });
    }
    updateAttributeQualifier(sourceAttribute) {
        if (!sourceAttribute.getQualifier())
            return;
        var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
        attributes.forEach(targetAttribute => {
            targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
        });
    }
    ////// push support ///////
    startPushListening(pushCommand, releaseCommand) {
        this.clientConnector.setPushListener(pushCommand);
        this.clientConnector.setReleaseCommand(releaseCommand);
        this.clientConnector.setPushEnabled(true);
        this.clientConnector.listen();
    }
    stopPushListening() {
        this.clientConnector.setPushEnabled(false);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClientDolphin;

//# sourceMappingURL=ClientDolphin.js.map
