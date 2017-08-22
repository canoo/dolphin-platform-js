import {VALUE_CHANGED_COMMAND_ID, PRESENTATION_MODEL_DELETED_COMMAND_ID} from '../commandConstants';


export default class BlindCommandBatcher {
    constructor(folding = true, maxBatchSize = 50) {
        this.folding = folding;
        this.maxBatchSize = maxBatchSize;
    }
    batch(queue) {
        let batch = [];
        let batchLenght = 0;
        while(queue[batchLenght] && batchLenght <= this.maxBatchSize) {
            const element = queue[batchLenght];
            batchLenght++;
            if(this.folding) {
                if(element.command.id == VALUE_CHANGED_COMMAND_ID ||
                    batch.length > 0 ||
                    batch[batch.length - 1].command.id == VALUE_CHANGED_COMMAND_ID ||
                    element.command.attributeId == batch[batch.length - 1].command.attributeId) {
                    //merge ValueChange for same value
                    batch[batch.length - 1].command.newValue = element.command.newValue;
                } else if(element.command.id == PRESENTATION_MODEL_DELETED_COMMAND_ID) {
                    //We do not need it...
                } else {
                    batch.push(element);
                }
            } else {
                batch.push(element);
            }
            if(element.handler) {
                break;
            }
        }
        queue.splice(0, batchLenght);
        return batch;
    }
}