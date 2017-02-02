import AttributeCreatedNotification from "./AttributeCreatedNotification";
import { ClientAttribute } from "./ClientAttribute";
import { ClientConnector, OnFinishedHandler, OnSuccessHandler } from "./ClientConnector";
import { ClientModelStore } from "./ClientModelStore";
import { ClientPresentationModel } from "./ClientPresentationModel";
import EmptyNotification from "./EmptyNotification";
import NamedCommand from "./NamedCommand";
import SignalCommand from "./SignalCommand";


export default class ClientDolphin {


    private clientConnector:ClientConnector;
    private clientModelStore:ClientModelStore;

    setClientConnector(clientConnector:ClientConnector) {
        this.clientConnector = clientConnector;
    }

    getClientConnector():ClientConnector {
        return this.clientConnector;
    }

    send(commandName:string, onFinished:OnFinishedHandler) {
        this.clientConnector.send(new NamedCommand(commandName), onFinished);
    }

    reset(successHandler:OnSuccessHandler) {
        this.clientConnector.reset(successHandler);
    }

    sendEmpty(onFinished:OnFinishedHandler) {
        this.clientConnector.send(new EmptyNotification(), onFinished);
    }

    // factory method for attributes
    attribute(propertyName, qualifier, value) {
        return new ClientAttribute(propertyName, qualifier, value);
    }

    // factory method for presentation models
    presentationModel(id:string, type:string, ...attributes:ClientAttribute[]) {
        var model:ClientPresentationModel = new ClientPresentationModel(id, type);
        if (attributes && attributes.length > 0) {
            attributes.forEach((attribute:ClientAttribute) => {
                model.addAttribute(attribute);
            });
        }
        this.getClientModelStore().add(model);
        return model;
    }

    setClientModelStore(clientModelStore:ClientModelStore) {
        this.clientModelStore = clientModelStore;
    }

    getClientModelStore():ClientModelStore {
        return this.clientModelStore;
    }

    listPresentationModelIds():string[] {
        return this.getClientModelStore().listPresentationModelIds();
    }

    listPresentationModels(): ClientPresentationModel[]{
        return this.getClientModelStore().listPresentationModels();
    }

    findAllPresentationModelByType(presentationModelType:string):ClientPresentationModel[] {
        return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
    }

    getAt(id:string):ClientPresentationModel {
        return this.findPresentationModelById(id);
    }

    findPresentationModelById(id:string):ClientPresentationModel {
        return this.getClientModelStore().findPresentationModelById(id);
    }
    deletePresentationModel(modelToDelete:ClientPresentationModel) {
        this.getClientModelStore().deletePresentationModel(modelToDelete, true);
    }

    deleteAllPresentationModelOfType(presentationModelType:string) {
        this.getClientModelStore().deleteAllPresentationModelOfType(presentationModelType);
    }

    updatePresentationModelQualifier(presentationModel:ClientPresentationModel):void{
        presentationModel.getAttributes().forEach( sourceAttribute =>{
            this.updateAttributeQualifier(sourceAttribute);
        });
    }

    updateAttributeQualifier(sourceAttribute:ClientAttribute):void{
        if(!sourceAttribute.getQualifier()) return;
        var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
        attributes.forEach(targetAttribute => {
            targetAttribute.setValue(sourceAttribute.getValue());        // should always have the same value
        });
    }

    addAttributeToModel(presentationModel:ClientPresentationModel, clientAttribute: ClientAttribute){
        presentationModel.addAttribute(clientAttribute);
        this.getClientModelStore().registerAttribute(clientAttribute);
        if(!presentationModel.clientSideOnly){
            this.clientConnector.send(new AttributeCreatedNotification(
                                                presentationModel.id,
                                                clientAttribute.id,
                                                clientAttribute.propertyName,
                                                clientAttribute.getValue(),
                                                clientAttribute.getQualifier()
                                                ), null);
        }
    }

    ////// push support ///////
    startPushListening(pushActionName: string, releaseActionName: string) {
        this.clientConnector.setPushListener(new NamedCommand(pushActionName));
        this.clientConnector.setReleaseCommand(new SignalCommand(releaseActionName));
        this.clientConnector.setPushEnabled(true);
        this.clientConnector.listen();
    }
    stopPushListening() {
        this.clientConnector.setPushEnabled(false);
    }

}
