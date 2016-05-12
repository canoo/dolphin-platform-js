import Command from './Command'


export default class EmptyNotification extends Command{

    className:string;
    constructor(){
        super();
        this.id = "Empty";
        this.className ="org.opendolphin.core.comm.EmptyNotification";
    }

}
