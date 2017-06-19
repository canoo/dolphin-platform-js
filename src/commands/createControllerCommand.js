import {checkMethod} from '../utils';
import {checkParam} from '../utils';

export default class CreateControllerCommand {

    constructor(controllerName, parentControllerId) {
        checkMethod('CreateControllerCommand.invoke(controllerName, parentControllerId)');
        checkParam(controllerName, 'controllerName');

        this.id = 'CreateController';
        this.n = controllerName;
        this.p = parentControllerId;
    }

}