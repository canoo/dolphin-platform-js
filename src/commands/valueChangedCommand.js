import {VALUE_CHANGED_COMMAND_ID} from './commandConstants';

export default class ValueChangedCommand {

    constructor() {
        this.id = VALUE_CHANGED_COMMAND_ID;
    }

    init(attributeId, newValue) {
        this.id = VALUE_CHANGED_COMMAND_ID;

        this.attributeId = attributeId;
        this.newValue = newValue;
    }
}