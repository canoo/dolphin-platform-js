import { ClientConnector, CommandAndHandler } from './ClientConnector'
import Command from './Command'
import EmptyNotification from './EmptyNotification'
import NamedCommand from './NamedCommand'
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
        var result = [];
        this.processNext(this.maxBatchSize, queue, result); // do not batch more than this.maxBatchSize commands to avoid stack overflow on recursion.
        return result;
    }

    // recursive impl method to side-effect both queue and batch
    private processNext(maxBatchSize : number, queue : CommandAndHandler[], batch : CommandAndHandler[]) : void {
        if (queue.length < 1 || maxBatchSize < 1) return;
        var candidate = queue.shift();

        if (this.folding && candidate.command instanceof ValueChangedCommand && (!candidate.handler)) { // see whether we can merge
            var found  : ValueChangedCommand = null;
            var canCmd : ValueChangedCommand = <ValueChangedCommand> candidate.command;
            for( var i = 0; i < batch.length && found == null; i++) { // a shame there is no "find" in TS
                if (batch[i].command instanceof ValueChangedCommand) {
                    var batchCmd : ValueChangedCommand = <ValueChangedCommand> batch[i].command;
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
        if ( ! candidate.handler &&                 // handler null nor undefined: we have a blind
             ! (candidate.command['className'] == "org.opendolphin.core.comm.NamedCommand") &&     // and no unknown server side effect
             ! (candidate.command['className'] == "org.opendolphin.core.comm.EmptyNotification")   // and no unknown client side effect
           ) {
            this.processNext(maxBatchSize-1, queue, batch);         // then we can proceed with batching
        }
    }
}
