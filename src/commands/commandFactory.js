import CreateContextCommand from './impl/createContextCommand.js';
import CreateControllerCommand from './impl/createControllerCommand.js';
import CallActionCommand from './impl/callActionCommand.js';
import DestroyControllerCommand from './impl/destroyControllerCommand.js';
import DestroyContextCommand from './impl/destroyContextCommand.js';
import StartLongPollCommand from './impl/startLongPollCommand.js';
import InterruptLongPollCommand from './impl/interruptLongPollCommand.js';
import CreatePresentationModelCommand from './impl/createPresentationModelCommand.js';
import DeletePresentationModelCommand from './impl/deletePresentationModelCommand.js';
import PresentationModelDeletedCommand from './impl/presentationModelDeletedCommand.js';
import ValueChangedCommand from './impl/valueChangedCommand.js';
import ChangeAttributeMetadataCommand from './impl/changeAttributeMetadataCommand.js';
import AttributeMetadataChangedCommand from './impl/attributeMetadataChangedCommand.js';

export default class CommandFactory {

    static createCreateContextCommand() {
        return new CreateContextCommand();
    }

    static createCreateControllerCommand(controllerName, parentControllerId) {
        let command = new CreateControllerCommand();
        command.init(controllerName, parentControllerId);
        return command;
    }

    static createCallActionCommand(controllerid, actionName, params) {
        let command = new CallActionCommand();
        command.init(controllerid, actionName, params);
        return command;
    }

    static createDestroyControllerCommand(controllerId) {
        let command = new DestroyControllerCommand();
        command.init(controllerId);
        return command;
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
        let command = new CreatePresentationModelCommand();
        command.init(presentationModel);
        return command;
    }

    static createDeletePresentationModelCommand(pmId) {
        let command = new DeletePresentationModelCommand();
        command.init(pmId);
        return command;
    }

    static createPresentationModelDeletedCommand(pmId) {
        let command = new PresentationModelDeletedCommand();
        command.init(pmId);
        return command;
    }

    static createValueChangedCommand(attributeId, newValue) {
        let command = new ValueChangedCommand();
        command.init(attributeId, newValue);
        return command;
    }

    static createChangeAttributeMetadataCommand(attributeId, metadataName, value) {
        let command = new ChangeAttributeMetadataCommand();
        command.init(attributeId, metadataName, value);
        return command;
    }

    static createAttributeMetadataChangedCommand(attributeId, metadataName, value) {
        let command = new AttributeMetadataChangedCommand();
        command.init(attributeId, metadataName, value);
        return command;
    }
}