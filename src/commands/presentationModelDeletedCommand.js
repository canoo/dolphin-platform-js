import {PRESENTATION_MODEL_DELETED_COMMAND_ID} from './commandConstants';

export default class PresentationModelDeletedCommand {
    constructor(pmId) {
        this.id = PRESENTATION_MODEL_DELETED_COMMAND_ID;

        this.pmId = pmId;
    }
}