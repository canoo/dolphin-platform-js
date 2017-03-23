import Command from './Command'
import CommandConstants from "./CommandConstants";

export default class CallActionCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = CommandConstants.CALL_CONTROLLER_ACTION_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.CallActionCommand";
    }
}
