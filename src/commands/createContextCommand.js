import {CREATE_CONTEXT_COMMAND_ID} from './commandConstants';
import {checkMethod} from '../utils';

export default class CreateContextCommand {

    constructor() {
        checkMethod('CreateContextCommand.invoke()');
        this.id = CREATE_CONTEXT_COMMAND_ID;
    }

}