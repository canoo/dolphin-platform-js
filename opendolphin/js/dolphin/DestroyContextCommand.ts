import Command from './Command'

export default class DestroyContextCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'DestroyContextCommand';
        this.className = "com.canoo.dolphin.impl.commands.DestroyContextCommand";
    }
}
