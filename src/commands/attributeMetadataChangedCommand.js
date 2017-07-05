import {ATTRIBUTE_METADATA_CHANGED_COMMAND_ID} from './commandConstants';

export default class AttributeMetadataChangedCommand {
    constructor(attributeId, metadataName, value) {
        this.id = ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;

        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
    }
}