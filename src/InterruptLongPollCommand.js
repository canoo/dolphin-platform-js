"use strict";
const SignalCommand_1 = require("./SignalCommand");
const CommandConstants_1 = require("./CommandConstants");
class InterruptLongPollCommand extends SignalCommand_1.default {
    constructor() {
        super(CommandConstants_1.default.INTERRUPT_LONG_POLL_COMMAND_NAME);
        this.className = "com.canoo.dolphin.impl.commands.InterruptLongPollCommand";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InterruptLongPollCommand;

//# sourceMappingURL=InterruptLongPollCommand.js.map
