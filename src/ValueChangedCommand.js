"use strict";
const Command_1 = require('./Command');
class ValueChangedCommand extends Command_1.default {
    constructor(attributeId, newValue) {
        super();
        this.attributeId = attributeId;
        this.newValue = newValue;
        this.id = "ValueChanged";
        this.className = "org.opendolphin.core.comm.ValueChangedCommand";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValueChangedCommand;

//# sourceMappingURL=ValueChangedCommand.js.map
