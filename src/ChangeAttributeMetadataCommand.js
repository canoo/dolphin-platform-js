"use strict";
const Command_1 = require('./Command');
class ChangeAttributeMetadataCommand extends Command_1.default {
    constructor(attributeId, metadataName, value) {
        super();
        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
        this.id = 'ChangeAttributeMetadata';
        this.className = "org.opendolphin.core.comm.ChangeAttributeMetadataCommand";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChangeAttributeMetadataCommand;

//# sourceMappingURL=ChangeAttributeMetadataCommand.js.map
