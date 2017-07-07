import {ATTRIBUTE_METADATA_CHANGED_COMMAND_ID} from './commandConstants';

export default class AttributeMetadataChangedCommand {

    constructor() {
        this.id = ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;
    }

    init(attributeId, metadataName, value) {
        checkMethod('AttributeMetadataChangedCommand.init()');
        checkParam(attributeId, 'attributeId');
        checkParam(metadataName, 'metadataName');

        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
    }
}