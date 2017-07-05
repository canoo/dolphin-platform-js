import {DESTROY_CONTROLLER_COMMAND_ID} from './commandConstants';
import {checkMethod} from '../utils';
import {checkParam} from '../utils';

export default class DestroyControllerCommand {

    constructor(controllerId) {
        checkMethod('DestroyControllerCommand(controllerId)');
        checkParam(controllerId, 'controllerId');

        this.id = DESTROY_CONTROLLER_COMMAND_ID;
        this.c = controllerId;
    }

}