export default class ValueChangedCommand {

    constructor(attributeId, newValue) {
        this.id = "ValueChanged";

        this.attributeId = attributeId;
        this.newValue = newValue;
    }
}