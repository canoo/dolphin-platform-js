"use strict";
const Command_1 = require('./Command');
const CommandConstants_1 = require("./CommandConstants");
class StartLongPollCommand extends Command_1.default {
    constructor() {
        super();
        this.id = CommandConstants_1.default.START_LONG_POLL_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.StartLongPollCommand";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StartLongPollCommand;

//# sourceMappingURL=StartLongPollCommand.js.map
