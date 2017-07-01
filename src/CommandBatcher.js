"use strict";
const ValueChangedCommand_1 = require('./ValueChangedCommand');
/** A Batcher that does no batching but merely takes the first element of the queue as the single item in the batch */
class NoCommandBatcher {
    batch(queue) {
        return [queue.shift()];
    }
}
exports.NoCommandBatcher = NoCommandBatcher;
/** A batcher that batches the blinds (commands with no callback) and optionally also folds value changes */
class BlindCommandBatcher {
    /** folding: whether we should try folding ValueChangedCommands */
    constructor(folding = true, maxBatchSize = 50) {
        this.folding = folding;
        this.maxBatchSize = maxBatchSize;
    }
    batch(queue) {
        let batch = [];
        const n = Math.min(queue.length, this.maxBatchSize);
        for (let counter = 0; counter < n; counter++) {
            const candidate = queue.shift();
            if (this.folding && candidate.command instanceof ValueChangedCommand_1.default && (!candidate.handler)) {
                const canCmd = candidate.command;
                if (batch.length > 0 && batch[batch.length - 1].command instanceof ValueChangedCommand_1.default) {
                    const batchCmd = batch[batch.length - 1].command;
                    if (canCmd.attributeId == batchCmd.attributeId) {
                        batchCmd.newValue = canCmd.newValue;
                    }
                    else {
                        batch.push(candidate); // we cannot merge, so batch the candidate
                    }
                }
                else {
                    batch.push(candidate); // we cannot merge, so batch the candidate
                }
            }
            else {
                batch.push(candidate);
            }
            if (candidate.handler ||
                (candidate.command['className'] == "org.opendolphin.core.comm.EmptyNotification") // or unknown client side effect
            ) {
                break; // leave the loop
            }
        }
        return batch;
    }
}
exports.BlindCommandBatcher = BlindCommandBatcher;

//# sourceMappingURL=CommandBatcher.js.map
