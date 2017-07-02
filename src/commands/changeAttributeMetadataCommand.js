export default class ChangeAttributeMetadataCommand {
    constructor(attributeId, metadataName, value) {
        this.id = 'ChangeAttributeMetadata';

        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
    }
}