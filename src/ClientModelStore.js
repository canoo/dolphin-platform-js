/// <reference path="./core-js.d.ts" />
"use strict";
const Attribute_1 = require("./Attribute");
const ChangeAttributeMetadataCommand_1 = require("./ChangeAttributeMetadataCommand");
const CreatePresentationModelCommand_1 = require("./CreatePresentationModelCommand");
const DeletedPresentationModelNotification_1 = require("./DeletedPresentationModelNotification");
const EventBus_1 = require("./EventBus");
const ValueChangedCommand_1 = require("./ValueChangedCommand");
(function (Type) {
    Type[Type["ADDED"] = 'ADDED'] = "ADDED";
    Type[Type["REMOVED"] = 'REMOVED'] = "REMOVED";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
class ClientModelStore {
    constructor(clientDolphin) {
        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new EventBus_1.default();
    }
    getClientDolphin() {
        return this.clientDolphin;
    }
    registerModel(model) {
        if (model.clientSideOnly) {
            return;
        }
        var connector = this.clientDolphin.getClientConnector();
        var createPMCommand = new CreatePresentationModelCommand_1.default(model);
        connector.send(createPMCommand, null);
        model.getAttributes().forEach(attribute => {
            this.registerAttribute(attribute);
        });
    }
    registerAttribute(attribute) {
        this.addAttributeById(attribute);
        if (attribute.getQualifier()) {
            this.addAttributeByQualifier(attribute);
        }
        // whenever an attribute changes its value, the server needs to be notified
        // and all other attributes with the same qualifier are given the same value
        attribute.onValueChange((evt) => {
            var valueChangeCommand = new ValueChangedCommand_1.default(attribute.id, evt.newValue);
            this.clientDolphin.getClientConnector().send(valueChangeCommand, null);
            if (attribute.getQualifier()) {
                var attrs = this.findAttributesByFilter((attr) => {
                    return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                });
                attrs.forEach((attr) => {
                    attr.setValue(attribute.getValue());
                });
            }
        });
        attribute.onQualifierChange((evt) => {
            var changeAttrMetadataCmd = new ChangeAttributeMetadataCommand_1.default(attribute.id, Attribute_1.default.QUALIFIER_PROPERTY, evt.newValue);
            this.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
        });
    }
    add(model) {
        if (!model) {
            return false;
        }
        if (this.presentationModels.has(model.id)) {
            console.log("There already is a PM with id " + model.id);
        }
        var added = false;
        if (!this.presentationModels.has(model.id)) {
            this.presentationModels.set(model.id, model);
            this.addPresentationModelByType(model);
            this.registerModel(model);
            this.modelStoreChangeBus.trigger({ 'eventType': Type.ADDED, 'clientPresentationModel': model });
            added = true;
        }
        return added;
    }
    remove(model) {
        if (!model) {
            return false;
        }
        var removed = false;
        if (this.presentationModels.has(model.id)) {
            this.removePresentationModelByType(model);
            this.presentationModels.delete(model.id);
            model.getAttributes().forEach((attribute) => {
                this.removeAttributeById(attribute);
                if (attribute.getQualifier()) {
                    this.removeAttributeByQualifier(attribute);
                }
            });
            this.modelStoreChangeBus.trigger({ 'eventType': Type.REMOVED, 'clientPresentationModel': model });
            removed = true;
        }
        return removed;
    }
    findAttributesByFilter(filter) {
        var matches = [];
        this.presentationModels.forEach((model) => {
            model.getAttributes().forEach((attr) => {
                if (filter(attr)) {
                    matches.push(attr);
                }
            });
        });
        return matches;
    }
    addPresentationModelByType(model) {
        if (!model) {
            return;
        }
        var type = model.presentationModelType;
        if (!type) {
            return;
        }
        var presentationModels = this.presentationModelsPerType.get(type);
        if (!presentationModels) {
            presentationModels = [];
            this.presentationModelsPerType.set(type, presentationModels);
        }
        if (!(presentationModels.indexOf(model) > -1)) {
            presentationModels.push(model);
        }
    }
    removePresentationModelByType(model) {
        if (!model || !(model.presentationModelType)) {
            return;
        }
        var presentationModels = this.presentationModelsPerType.get(model.presentationModelType);
        if (!presentationModels) {
            return;
        }
        if (presentationModels.length > -1) {
            presentationModels.splice(presentationModels.indexOf(model), 1);
        }
        if (presentationModels.length === 0) {
            this.presentationModelsPerType.delete(model.presentationModelType);
        }
    }
    listPresentationModelIds() {
        var result = [];
        var iter = this.presentationModels.keys();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    }
    listPresentationModels() {
        var result = [];
        var iter = this.presentationModels.values();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    }
    findPresentationModelById(id) {
        return this.presentationModels.get(id);
    }
    findAllPresentationModelByType(type) {
        if (!type || !this.presentationModelsPerType.has(type)) {
            return [];
        }
        return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
    }
    deletePresentationModel(model, notify) {
        if (!model) {
            return;
        }
        if (this.containsPresentationModel(model.id)) {
            this.remove(model);
            if (!notify || model.clientSideOnly) {
                return;
            }
            this.clientDolphin.getClientConnector().send(new DeletedPresentationModelNotification_1.default(model.id), null);
        }
    }
    containsPresentationModel(id) {
        return this.presentationModels.has(id);
    }
    addAttributeById(attribute) {
        if (!attribute || this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.set(attribute.id, attribute);
    }
    removeAttributeById(attribute) {
        if (!attribute || !this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.delete(attribute.id);
    }
    findAttributeById(id) {
        return this.attributesPerId.get(id);
    }
    addAttributeByQualifier(attribute) {
        if (!attribute || !attribute.getQualifier()) {
            return;
        }
        var attributes = this.attributesPerQualifier.get(attribute.getQualifier());
        if (!attributes) {
            attributes = [];
            this.attributesPerQualifier.set(attribute.getQualifier(), attributes);
        }
        if (!(attributes.indexOf(attribute) > -1)) {
            attributes.push(attribute);
        }
    }
    removeAttributeByQualifier(attribute) {
        if (!attribute || !attribute.getQualifier()) {
            return;
        }
        var attributes = this.attributesPerQualifier.get(attribute.getQualifier());
        if (!attributes) {
            return;
        }
        if (attributes.length > -1) {
            attributes.splice(attributes.indexOf(attribute), 1);
        }
        if (attributes.length === 0) {
            this.attributesPerQualifier.delete(attribute.getQualifier());
        }
    }
    findAllAttributesByQualifier(qualifier) {
        if (!qualifier || !this.attributesPerQualifier.has(qualifier)) {
            return [];
        }
        return this.attributesPerQualifier.get(qualifier).slice(0); // slice is used to clone the array
    }
    onModelStoreChange(eventHandler) {
        this.modelStoreChangeBus.onEvent(eventHandler);
    }
    onModelStoreChangeForType(presentationModelType, eventHandler) {
        this.modelStoreChangeBus.onEvent(pmStoreEvent => {
            if (pmStoreEvent.clientPresentationModel.presentationModelType == presentationModelType) {
                eventHandler(pmStoreEvent);
            }
        });
    }
}
exports.ClientModelStore = ClientModelStore;

//# sourceMappingURL=ClientModelStore.js.map