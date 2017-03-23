import Command from './Command'

export default class InterruptLongPollCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'InterruptLongPollCommand';
        this.className = "com.canoo.dolphin.impl.commands.InterruptLongPollCommand";
    }
}
