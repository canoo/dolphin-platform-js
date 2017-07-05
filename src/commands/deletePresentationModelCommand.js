import {DELETE_PRESENTATION_MODEL_COMMAND_ID} from './commandConstants';

export default class DeletePresentationModelCommand {
    constructor(pmId) {
        this.id = DELETE_PRESENTATION_MODEL_COMMAND_ID;

        this.pmId = pmId;
    }
}
