import {VALUE_CHANGED_COMMAND_ID} from './commandConstants';

export default class ValueChangedCommand {

    constructor(attributeId, newValue) {
        this.id = VALUE_CHANGED_COMMAND_ID;

        this.attributeId = attributeId;
        this.newValue = newValue;
    }
}