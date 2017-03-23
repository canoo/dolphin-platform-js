import Command from './Command'

export default class CreateContextCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'CreateContextCommand';
        this.className = "com.canoo.dolphin.impl.commands.CreateContextCommand";
    }
}
