import Command from './Command'


export default class GetPresentationModelCommand extends Command {

    className:string;

    constructor(public pmId:string) {
        super();
        this.id = 'GetPresentationModel';
        this.className = "org.opendolphin.core.comm.GetPresentationModelCommand";
    }
}
