import SignalCommand from "./SignalCommand";
import CommandConstants from "./CommandConstants";

export default class InterruptLongPollCommand extends SignalCommand {

    className:string;

    constructor() {
        super(CommandConstants.INTERRUPT_LONG_POLL_COMMAND_NAME);
        this.className = "com.canoo.dolphin.impl.commands.InterruptLongPollCommand";
    }
}
