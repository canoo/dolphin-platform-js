import {checkMethod} from '../utils';

export default class CreateContextCommand {

    constructor() {
        checkMethod('CreateContextCommand.invoke()');
        this.id = 'CreateContext';
    }

}