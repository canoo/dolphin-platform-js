import Command from './Command'


export default class SwitchPresentationModelCommand extends Command {

    className:string;

    constructor(public pmId:string, public sourcePmId:string) {
        super();
        this.id = 'SwitchPresentationModel';
        this.className = "org.opendolphin.core.comm.SwitchPresentationModelCommand";
    }
}
