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