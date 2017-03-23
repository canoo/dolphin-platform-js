import Command from './Command'
import CommandConstants from "./CommandConstants";

export default class StartLongPollCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = CommandConstants.START_LONG_POLL_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.StartLongPollCommand";
    }
}
