import Command from './Command'


export default class CallNamedActionCommand extends Command {

    className:string;

    constructor(public actionName:string) {
        super();
        this.id = 'CallNamedAction';
        this.className = "org.opendolphin.core.comm.CallNamedActionCommand";
    }
}
