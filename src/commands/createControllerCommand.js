import {CREATE_CONTROLLER_COMMAND_ID} from './commandConstants';
import {checkMethod} from '../utils';
import {checkParam} from '../utils';

export default class CreateControllerCommand {

    constructor(controllerName, parentControllerId) {
        checkMethod('CreateControllerCommand.invoke(controllerName, parentControllerId)');
        checkParam(controllerName, 'controllerName');

        this.id = CREATE_CONTROLLER_COMMAND_ID;
        this.n = controllerName;
        this.p = parentControllerId;
    }

}