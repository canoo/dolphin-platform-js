"use strict";
/**
 * A transmitter that is not transmitting at all.
 * It may serve as a stand-in when no real transmitter is needed.
 */
class NoTransmitter {
    transmit(commands, onDone) {
        // do nothing special
        onDone([]);
    }
    signal() {
        // do nothing
    }
    reset() {
        // do nothing
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NoTransmitter;

//# sourceMappingURL=NoTransmitter.js.map
