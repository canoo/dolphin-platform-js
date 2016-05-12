import Command from './Command'


export default class DeletePresentationModelCommand extends Command {

    className:string;

    constructor(public pmId:string) {
        super();
        this.id = 'DeletePresentationModel';
        this.className = "org.opendolphin.core.comm.DeletePresentationModelCommand";
    }
}
