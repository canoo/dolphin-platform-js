import Command from './Command'

export default class CreateControllerCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'CreateControllerCommand';
        this.className = "com.canoo.dolphin.impl.commands.CreateControllerCommand";
    }
}
