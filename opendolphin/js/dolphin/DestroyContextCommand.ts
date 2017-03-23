import Command from './Command'
import CommandConstants from "./CommandConstants";

export default class DestroyContextCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = CommandConstants.DESTROY_CONTEXT_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.DestroyContextCommand";
    }
}
