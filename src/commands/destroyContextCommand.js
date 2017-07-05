import {DESTROY_CONTEXT_COMMAND_ID} from './commandConstants';
import {checkMethod} from '../utils';

export default class DestroyContextCommand {

    constructor() {
        checkMethod('DestroyContextCommand()');

        this.id = DESTROY_CONTEXT_COMMAND_ID;
    }

}