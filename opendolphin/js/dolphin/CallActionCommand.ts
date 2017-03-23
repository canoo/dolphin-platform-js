import Command from './Command'

export default class CallActionCommand extends Command {

    className:string;

    constructor() {
        super();
        this.id = 'CallActionCommand';
        this.className = "com.canoo.dolphin.impl.commands.CallActionCommand";
    }
}
