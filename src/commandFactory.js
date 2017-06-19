import DestroyControllerCommand from './commands/destroyControllerCommand.js';
import CreateControllerCommand from './commands/createControllerCommand.js';
import CallActionCommand from './commands/callActionCommand.js';

export class CommandFactory {

    static createDestroyControllerCommand(controllerId) {
        return new DestroyControllerCommand(controllerId);
    }

    static createCreateControllerCommand(controllerName, parentControllerId) {
        return new CreateControllerCommand(controllerName, parentControllerId);
    }

    static createCallActionCommand(controllerid, actionName, params) {
        return new CallActionCommand(controllerid, actionName, params);
    }
}