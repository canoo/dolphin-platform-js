import Command from './Command'

export default class StartLongPollCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'StartLongPollCommand';
        this.className = "com.canoo.dolphin.impl.commands.StartLongPollCommand";
    }
}
