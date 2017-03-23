import Command from './Command'

export default class DestroyControllerCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'DestroyControllerCommand';
        this.className = "com.canoo.dolphin.impl.commands.DestroyControllerCommand";
    }
}
