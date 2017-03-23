import Command from './Command'
import CommandConstants from "./CommandConstants";

export default class CreateControllerCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = CommandConstants.CREATE_CONTROLLER_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.CreateControllerCommand";
    }
}
