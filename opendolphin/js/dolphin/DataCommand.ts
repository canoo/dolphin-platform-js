import Command from './Command'


export default class DataCommand extends Command{

    className:string;

    constructor(public data:any) {
        super();
        this.id = "Data";
        this.className ="org.opendolphin.core.comm.DataCommand";
    }

}
