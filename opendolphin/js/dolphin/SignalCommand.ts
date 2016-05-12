import Command from './Command'


export default class SignalCommand extends Command {

    className:string;

    constructor(name:string) {
        super();
        this.id = name;
        this.className = "org.opendolphin.core.comm.SignalCommand";
    }

}
