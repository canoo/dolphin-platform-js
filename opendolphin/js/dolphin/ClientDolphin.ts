import { ClientAttribute } from "./ClientAttribute";
import { ClientConnector, OnFinishedHandler, OnSuccessHandler } from "./ClientConnector";
import { ClientModelStore } from "./ClientModelStore";
import { ClientPresentationModel } from "./ClientPresentationModel";
import SignalCommand from "./SignalCommand";
import Command from "./Command";
import StartLongPollCommand from "./StartLongPollCommand";

export default class ClientDolphin {

    private clientConnector:ClientConnector;

    private clientModelStore:ClientModelStore;

    setClientConnector(clientConnector:ClientConnector) {
        this.clientConnector = clientConnector;
    }

    getClientConnector():ClientConnector {
        return this.clientConnector;
    }

    send(command:Command, onFinished:OnFinishedHandler) {
        this.clientConnector.send(command, onFinished);
    }

    reset(successHandler:OnSuccessHandler) {
        this.clientConnector.reset(successHandler);
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

    ////// push support ///////
    startPushListening(pushActionName: string, releaseActionName: string) {
        this.clientConnector.setPushListener(new StartLongPollCommand());
        this.clientConnector.setReleaseCommand(new SignalCommand(releaseActionName));
        this.clientConnector.setPushEnabled(true);
        this.clientConnector.listen();
    }
    stopPushListening() {
        this.clientConnector.setPushEnabled(false);
    }

}
