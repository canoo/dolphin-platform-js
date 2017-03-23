import Command from './Command'
import CommandConstants from "./CommandConstants";

export default class DestroyControllerCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = CommandConstants.DESTROY_CONTROLLER_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.DestroyControllerCommand";
    }
}
