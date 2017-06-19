import {checkMethod} from '../utils';
import {checkParam} from '../utils';

export default class CallActionCommand {

    constructor(controllerid, actionName, params) {
        checkMethod('CreateControllerCommand.invoke(controllerid, actionName, params)');
        checkParam(controllerid, 'controllerid');
        checkParam(actionName, 'actionName');

        this.id = 'CallAction';
        this.c = controllerid;
        this.n = actionName;
        this.p = params;
    }

}