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
            batch.push(element);
            batchLenght++;
            if(element.handler) {
                break;
            }
        }
        queue.splice(0, batchLenght);
        return batch;
    }
}