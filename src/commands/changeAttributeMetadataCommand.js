import {CHANGE_ATTRIBUTE_METADATA_COMMAND_ID} from './commandConstants';

export default class ChangeAttributeMetadataCommand {
    constructor(attributeId, metadataName, value) {
        this.id = CHANGE_ATTRIBUTE_METADATA_COMMAND_ID;

        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
    }
}