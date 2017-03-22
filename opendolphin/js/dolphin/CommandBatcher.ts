import { CommandAndHandler } from './ClientConnector'
import ValueChangedCommand from './ValueChangedCommand'


export interface CommandBatcher {
    /** create a batch of commands from the queue and remove the batched commands from the queue */

    // adding to the queue was via push such that fifo reading needs to be via shift

    batch(queue : CommandAndHandler[]) : CommandAndHandler[];
}

/** A Batcher that does no batching but merely takes the first element of the queue as the single item in the batch */
export class NoCommandBatcher implements CommandBatcher {
    batch(queue : CommandAndHandler[]) : CommandAndHandler[] {
        return [ queue.shift() ];
    }
}

/** A batcher that batches the blinds (commands with no callback) and optionally also folds value changes */
export class BlindCommandBatcher implements CommandBatcher {

    /** folding: whether we should try folding ValueChangedCommands */
    constructor(public folding:boolean = true, public maxBatchSize : number = 50){}

    batch(queue : CommandAndHandler[]) : CommandAndHandler[] {
        let batch = [];
        const n = Math.min(queue.length, this.maxBatchSize);
        for (let counter = 0; counter < n; counter++) {
            const candidate = queue.shift();
            if (this.folding && candidate.command instanceof ValueChangedCommand && (!candidate.handler)) { // see whether we can merge
                let found: ValueChangedCommand = null;
                const canCmd: ValueChangedCommand = <ValueChangedCommand> candidate.command;
                for (let i = 0; i < batch.length && found == null; i++) { // a shame there is no "find" in TS
                    if (batch[i].command instanceof ValueChangedCommand) {
                        const batchCmd: ValueChangedCommand = <ValueChangedCommand> batch[i].command;
                        if (canCmd.attributeId == batchCmd.attributeId && batchCmd.newValue == canCmd.oldValue) {
                            found = batchCmd;
                        }
                    }
                }
                if (found) {                            // yes, we can
                    found.newValue = canCmd.newValue;   // change existing value, do not batch
                } else {
                    batch.push(candidate);              // we cannot merge, so batch the candidate
                }
            } else {
                batch.push(candidate);
            }
            if (candidate.handler ||                 // handler defined: we have a blind
                (candidate.command['className'] == "org.opendolphin.core.comm.EmptyNotification")   // or unknown client side effect
            ) {
                break; // leave the loop
            }
        }
        return batch;
    }
}
