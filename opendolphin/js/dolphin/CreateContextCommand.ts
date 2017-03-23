import Command from './Command'
import CommandConstants from "./CommandConstants";

export default class CreateContextCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = CommandConstants.CREATE_CONTEXT_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.CreateContextCommand";
    }
}
