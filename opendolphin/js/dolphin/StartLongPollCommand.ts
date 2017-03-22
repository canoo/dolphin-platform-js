import Command from './Command'

export default class StartLongPollCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'CallNamedAction';
        this.className = "com.canoo.dolphin.impl.commands.StartLongPollCommand";
    }
}
