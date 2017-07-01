"use strict";
const Command_1 = require('./Command');
class DeletePresentationModelCommand extends Command_1.default {
    constructor(pmId) {
        super();
        this.pmId = pmId;
        this.id = 'DeletePresentationModel';
        this.className = "org.opendolphin.core.comm.DeletePresentationModelCommand";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeletePresentationModelCommand;

//# sourceMappingURL=DeletePresentationModelCommand.js.map
