
export default class AttributeMetadataChangedCommand {
    constructor(attributeId, metadataName, value) {
        this.id = 'AttributeMetadataChanged';

        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
    }
}