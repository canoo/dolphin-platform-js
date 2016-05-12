import Command from './Command'


export default class ChangeAttributeMetadataCommand extends Command {

    className:string;

    constructor(public attributeId:string, public metadataName:string, public value:any) {
        super();
        this.id = 'ChangeAttributeMetadata';
        this.className = "org.opendolphin.core.comm.ChangeAttributeMetadataCommand";
    }
}
