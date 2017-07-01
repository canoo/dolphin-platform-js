import CreateContextCommand from './commands/createContextCommand.js';
import CreateControllerCommand from './commands/createControllerCommand.js';
import CallActionCommand from './commands/callActionCommand.js';
import DestroyControllerCommand from './commands/destroyControllerCommand.js';
import DestroyContextCommand from './commands/destroyContextCommand.js';


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

}