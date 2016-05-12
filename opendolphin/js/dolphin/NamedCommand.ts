import Command from './Command'


export default class NamedCommand extends Command {

    className:string;

    constructor(name:string) {
        super();
        this.id = name;
        this.className = "org.opendolphin.core.comm.NamedCommand";
    }

}
