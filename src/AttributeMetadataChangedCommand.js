"use strict";
const Command_1 = require('./Command');
class AttributeMetadataChangedCommand extends Command_1.default {
    constructor(attributeId, metadataName, value) {
        super();
        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
        this.id = 'AttributeMetadataChanged';
        this.className = "org.opendolphin.core.comm.AttributeMetadataChangedCommand";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttributeMetadataChangedCommand;

//# sourceMappingURL=AttributeMetadataChangedCommand.js.map
