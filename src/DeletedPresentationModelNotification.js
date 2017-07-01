"use strict";
const Command_1 = require('./Command');
class DeletedPresentationModelNotification extends Command_1.default {
    constructor(pmId) {
        super();
        this.pmId = pmId;
        this.id = 'DeletedPresentationModel';
        this.className = "org.opendolphin.core.comm.DeletedPresentationModelNotification";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeletedPresentationModelNotification;

//# sourceMappingURL=DeletedPresentationModelNotification.js.map
