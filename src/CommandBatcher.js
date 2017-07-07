import ValueChangedCommand from './commands/impl/valueChangedCommand'

export class NoCommandBatcher {
    batch(queue) {
        return [queue.shift()];
    }
}

export class BlindCommandBatcher {
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
            if (this.folding && candidate.command instanceof ValueChangedCommand && (!candidate.handler)) {
                const canCmd = candidate.command;
                if (batch.length > 0 && batch[batch.length - 1].command instanceof ValueChangedCommand) {
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