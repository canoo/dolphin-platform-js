import Command from './Command'


export default class PresentationModelResetedCommand extends Command {

    className:string;

    constructor(public pmId:string) {
        super();
        this.id = 'PresentationModelReseted';
        this.className = "org.opendolphin.core.comm.PresentationModelResetedCommand";
    }
}
