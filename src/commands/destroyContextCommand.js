import {DESTROY_CONTEXT_COMMAND_ID} from './commandConstants';
import {checkMethod} from '../utils';

export default class DestroyContextCommand {

    constructor() {
        this.id = DESTROY_CONTEXT_COMMAND_ID;
    }

}