import CreateContextCommand from './commands/createContextCommand.js';
import CreateControllerCommand from './commands/createControllerCommand.js';
import CallActionCommand from './commands/callActionCommand.js';
import DestroyControllerCommand from './commands/destroyControllerCommand.js';
import DestroyContextCommand from './commands/destroyContextCommand.js';
import StartLongPollCommand from './commands/startLongPollCommand.js';
import InterruptLongPollCommand from './commands/interruptLongPollCommand.js';
import CreatePresentationModelCommand from './commands/createPresentationModelCommand.js';
import DeletePresentationModelCommand from './commands/deletePresentationModelCommand.js';
import PresentationModelDeletedCommand from './commands/presentationModelDeletedCommand.js';
import ValueChangedCommand from './commands/valueChangedCommand.js';
import ChangeAttributeMetadataCommand from './commands/changeAttributeMetadataCommand.js';
import AttributeMetadataChangedCommand from './commands/attributeMetadataChangedCommand.js';


export default class CommandFactory {

    static createCreateContextCommand() {
        return new CreateContextCommand();
    }

    static createCreateControllerCommand(controllerName, parentControllerId) {
        return new CreateControllerCommand(controllerName, parentControllerId);
    }

    static createCallActionCommand(controllerid, actionName, params) {
        return new CallActionCommand(controllerid, actionName, params);
    }

    static createDestroyControllerCommand(controllerId) {
        return new DestroyControllerCommand(controllerId);
    }

    static createDestroyContextCommand() {
        return new DestroyContextCommand();
    }

    static createStartLongPollCommand() {
        return new StartLongPollCommand();
    }

    static createInterruptLongPollCommand() {
        return new InterruptLongPollCommand();
    }

    static createCreatePresentationModelCommand(presentationModel) {
        return new CreatePresentationModelCommand(presentationModel);
    }

    static createDeletePresentationModelCommand(pmId) {
        return new DeletePresentationModelCommand(pmId);
    }

    static createPresentationModelDeletedCommand(pmId) {
        return new PresentationModelDeletedCommand(pmId);
    }

    static createValueChangedCommand(attributeId, newValue) {
        return new ValueChangedCommand(attributeId, newValue);
    }

    static createChangeAttributeMetadataCommand(attributeId, metadataName, value) {
        return new ChangeAttributeMetadataCommand(attributeId, metadataName, value);
    }

    static createAttributeMetadataChangedCommand(attributeId, metadataName, value) {
        return new AttributeMetadataChangedCommand(attributeId, metadataName, value);
    }
}