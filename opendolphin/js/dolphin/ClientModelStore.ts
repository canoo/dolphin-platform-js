import Attribute from "./Attribute";
import ChangeAttributeMetadataCommand from "./ChangeAttributeMetadataCommand";
import { ClientAttribute, ValueChangedEvent } from "./ClientAttribute";
import { ClientConnector } from "./ClientConnector";
import ClientDolphin from "./ClientDolphin";
import { ClientPresentationModel } from "./ClientPresentationModel";
import CreatePresentationModelCommand from "./CreatePresentationModelCommand";
import DeletedAllPresentationModelsOfTypeNotification from "./DeletedAllPresentationModelsOfTypeNotification";
import DeletedPresentationModelNotification from "./DeletedPresentationModelNotification";
import EventBus from "./EventBus";
import Map from "./Map";
import ValueChangedCommand from "./ValueChangedCommand";


export enum Type{
    ADDED   = <any> 'ADDED',
    REMOVED = <any> 'REMOVED'
}
export interface ModelStoreEvent {
    eventType:Type;
    clientPresentationModel:ClientPresentationModel;
}

export class ClientModelStore {

    // the indexes we maintain for fast access
    private presentationModels          : Map<string,ClientPresentationModel>;
    private presentationModelsPerType   : Map<string,ClientPresentationModel[]>;
    private attributesPerId             : Map<string,ClientAttribute>;
    private attributesPerQualifier      : Map<string,ClientAttribute[]>;

    private modelStoreChangeBus         : EventBus<ModelStoreEvent>;
    private clientDolphin               : ClientDolphin;

    constructor(clientDolphin:ClientDolphin) {

        this.clientDolphin = clientDolphin;
        this.presentationModels         = new Map<string,ClientPresentationModel>();
        this.presentationModelsPerType  = new Map<string,ClientPresentationModel[]>();
        this.attributesPerId            = new Map<string,ClientAttribute>();
        this.attributesPerQualifier     = new Map<string,ClientAttribute[]>();
        this.modelStoreChangeBus        = new EventBus();
    }

    getClientDolphin() {
        return this.clientDolphin;
    }

    registerModel(model:ClientPresentationModel) {
        if (model.clientSideOnly) {
            return;
        }
        var connector:ClientConnector = this.clientDolphin.getClientConnector();
        var createPMCommand:CreatePresentationModelCommand = new CreatePresentationModelCommand(model);
        connector.send(createPMCommand, null);
        model.getAttributes().forEach(attribute => { // todo dk: validate. Note that we work on a clone.
            this.registerAttribute(attribute);
        });
    }

    registerAttribute(attribute:ClientAttribute) {
        this.addAttributeById(attribute);
        if(attribute.getQualifier()){
            this.addAttributeByQualifier(attribute);
        }
        // whenever an attribute changes its value, the server needs to be notified
        // and all other attributes with the same qualifier are given the same value
        attribute.onValueChange((evt:ValueChangedEvent)=> {
            var valueChangeCommand:ValueChangedCommand = new ValueChangedCommand(attribute.id, evt.oldValue, evt.newValue);
            this.clientDolphin.getClientConnector().send(valueChangeCommand, null);

            if (attribute.getQualifier()) {
                var attrs = this.findAttributesByFilter((attr:ClientAttribute) => {
                    return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                })
                attrs.forEach((attr:ClientAttribute) => {
                    attr.setValue(attribute.getValue());
                })
            }
        });
        // all attributes with the same qualifier should have the same base value
        attribute.onBaseValueChange((evt:ValueChangedEvent)=> {
            var baseValueChangeCommand:ChangeAttributeMetadataCommand =
                new ChangeAttributeMetadataCommand(attribute.id, Attribute.BASE_VALUE, evt.newValue);
            this.clientDolphin.getClientConnector().send(baseValueChangeCommand, null);
            if (attribute.getQualifier()) {
                var attrs = this.findAttributesByFilter((attr:ClientAttribute) => {
                    return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                })
                attrs.forEach((attr:ClientAttribute) => {
                    attr.setBaseValue(attribute.getBaseValue());
                })
            }
        });

        attribute.onQualifierChange((evt:ValueChangedEvent)=> {
            var changeAttrMetadataCmd:ChangeAttributeMetadataCommand =
                new ChangeAttributeMetadataCommand(attribute.id, Attribute.QUALIFIER_PROPERTY, evt.newValue);
            this.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
        });

    }
    add(model:ClientPresentationModel):boolean {
        if (!model) {
            return false;
        }
        if (this.presentationModels.containsKey(model.id)) {
            console.log("There already is a PM with id " + model.id);
        }
        var added:boolean = false;
        if (!this.presentationModels.containsValue(model)) {
            this.presentationModels.put(model.id, model);
            this.addPresentationModelByType(model);
            this.registerModel(model);

            this.modelStoreChangeBus.trigger({'eventType': Type.ADDED, 'clientPresentationModel': model});
            added = true;
        }
        return added;
    }

    remove(model:ClientPresentationModel):boolean {
        if (!model) {
            return false;
        }
        var removed:boolean = false;
        if (this.presentationModels.containsValue(model)) {
            this.removePresentationModelByType(model);
            this.presentationModels.remove(model.id);
            model.getAttributes().forEach((attribute:ClientAttribute) => {
                this.removeAttributeById(attribute);
                if (attribute.getQualifier()) {
                    this.removeAttributeByQualifier(attribute);
                }
            })

            this.modelStoreChangeBus.trigger({'eventType': Type.REMOVED, 'clientPresentationModel': model});
            removed = true;
        }
        return removed;
    }

    findAttributesByFilter(filter:(atr:ClientAttribute) => boolean) {
        var matches:ClientAttribute[] = [];
        this.presentationModels.forEach((key:string, model:ClientPresentationModel) => {
            model.getAttributes().forEach((attr) => {
                if (filter(attr)) {
                    matches.push(attr);
                }
            })
        })
        return matches;
    }

    addPresentationModelByType(model:ClientPresentationModel) { // todo: check findAllPMsByType is working on an updated index
        if (!model) {
            return;
        }
        var type:string = model.presentationModelType;
        if (!type) {
            return;
        }
        var presentationModels:ClientPresentationModel[] = this.presentationModelsPerType.get(type);
        if (!presentationModels) {
            presentationModels = [];
            this.presentationModelsPerType.put(type, presentationModels);
        }
        if (!(presentationModels.indexOf(model) > -1)) {
            presentationModels.push(model);
        }
    }

    removePresentationModelByType(model:ClientPresentationModel) {
        if (!model || !(model.presentationModelType)) {
            return;
        }

        var presentationModels:ClientPresentationModel[] = this.presentationModelsPerType.get(model.presentationModelType);
        if (!presentationModels) {
            return;
        }
        if (presentationModels.length > -1) {
            presentationModels.splice(presentationModels.indexOf(model), 1);
        }
        if (presentationModels.length === 0) {
            this.presentationModelsPerType.remove(model.presentationModelType);
        }
    }

    listPresentationModelIds():string[] {
        return this.presentationModels.keySet().slice(0);
    }

    listPresentationModels():ClientPresentationModel[] {
        return this.presentationModels.values();
    }

    findPresentationModelById(id:string):ClientPresentationModel {
        return this.presentationModels.get(id);
    }

    findAllPresentationModelByType(type:string):ClientPresentationModel[] {
        if (!type || !this.presentationModelsPerType.containsKey(type)) {
            return [];
        }
        return this.presentationModelsPerType.get(type).slice(0);// slice is used to clone the array
    }

    deleteAllPresentationModelOfType(presentationModelType:string) {
        var presentationModels:ClientPresentationModel[] = this.findAllPresentationModelByType(presentationModelType);
        presentationModels.forEach(pm => {
            this.deletePresentationModel(pm, false);
        });
        this.clientDolphin.getClientConnector().send(new DeletedAllPresentationModelsOfTypeNotification(presentationModelType), undefined);
    }

    deletePresentationModel(model:ClientPresentationModel, notify:boolean) {
        if (!model) {
            return;
        }
        if (this.containsPresentationModel(model.id)) {
            this.remove(model);
            if (!notify || model.clientSideOnly) {
                return;
            }
            this.clientDolphin.getClientConnector().send(new DeletedPresentationModelNotification(model.id), null);
        }
    }

    containsPresentationModel(id:string):boolean {
        return this.presentationModels.containsKey(id);
    }

    addAttributeById(attribute:ClientAttribute) {
        if (!attribute || this.attributesPerId.containsKey(attribute.id)) {
            return
        }
        this.attributesPerId.put(attribute.id, attribute);
    }

    removeAttributeById(attribute:ClientAttribute) {
        if (!attribute || !this.attributesPerId.containsKey(attribute.id)) {
            return
        }
        this.attributesPerId.remove(attribute.id);
    }

    findAttributeById(id:string):ClientAttribute {
        return this.attributesPerId.get(id);
    }

    addAttributeByQualifier(attribute:ClientAttribute) {
        if (!attribute || !attribute.getQualifier()) {
            return;
        }
        var attributes:ClientAttribute[] = this.attributesPerQualifier.get(attribute.getQualifier());
        if (!attributes) {
            attributes = [];
            this.attributesPerQualifier.put(attribute.getQualifier(), attributes);
        }
        if (!(attributes.indexOf(attribute) > -1)) {
            attributes.push(attribute);
        }

    }

    removeAttributeByQualifier(attribute:ClientAttribute) {
        if (!attribute || !attribute.getQualifier()) {
            return;
        }
        var attributes:ClientAttribute[] = this.attributesPerQualifier.get(attribute.getQualifier());
        if (!attributes) {
            return;
        }
        if (attributes.length > -1) { // todo dk: check for proper index handling
            attributes.splice(attributes.indexOf(attribute), 1);
        }
        if (attributes.length === 0) {
            this.attributesPerQualifier.remove(attribute.getQualifier());
        }
    }

    findAllAttributesByQualifier(qualifier:string):ClientAttribute[] {
        if (!qualifier || !this.attributesPerQualifier.containsKey(qualifier)) {
            return [];
        }
        return this.attributesPerQualifier.get(qualifier).slice(0);// slice is used to clone the array
    }

    onModelStoreChange(eventHandler:(event:ModelStoreEvent) => void) {
        this.modelStoreChangeBus.onEvent(eventHandler);
    }
    onModelStoreChangeForType(presentationModelType:String, eventHandler:(event:ModelStoreEvent) => void) {
        this.modelStoreChangeBus.onEvent( pmStoreEvent => {
            if (pmStoreEvent.clientPresentationModel.presentationModelType == presentationModelType) {
                eventHandler(pmStoreEvent);
            }
        });
    }
}
