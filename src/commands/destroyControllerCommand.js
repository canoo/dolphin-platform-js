import {checkMethod} from '../utils';
import {checkParam} from '../utils';

export default class DestroyControllerCommand {

    constructor(controllerId) {
        checkMethod('DestroyControllerCommand(controllerId)');
        checkParam(controllerId, 'controllerId');

        this.id = 'DestroyController';
        this.c = controllerId;
    }

}