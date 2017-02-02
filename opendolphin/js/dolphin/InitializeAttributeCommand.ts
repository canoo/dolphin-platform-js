import Command from './Command'


export default class InitializeAttributeCommand extends Command {


    className:string;

    constructor(public pmId:string, public pmType:string, public propertyName:string, public qualifier:string, public newValue:any) {
        super();
        this.id = 'InitializeAttribute';
        this.className = "org.opendolphin.core.comm.InitializeAttributeCommand";
    }
}
