import {CALL_ACTION_COMMAND_ID} from './commandConstants';
import {checkMethod} from '../utils';
import {checkParam} from '../utils';

export default class CallActionCommand {

    constructor(controllerid, actionName, params) {
        checkMethod('CreateControllerCommand.invoke(controllerid, actionName, params)');
        checkParam(controllerid, 'controllerid');
        checkParam(actionName, 'actionName');

        this.id = CALL_ACTION_COMMAND_ID;
        this.controllerid = controllerid;
        this.actionName = actionName;
        this.params = params;
    }

}