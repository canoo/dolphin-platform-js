"use strict";
const Command_1 = require("./Command");
class AttributeCreatedNotification extends Command_1.default {
    constructor(pmId, attributeId, propertyName, newValue, qualifier) {
        super();
        this.pmId = pmId;
        this.attributeId = attributeId;
        this.propertyName = propertyName;
        this.newValue = newValue;
        this.qualifier = qualifier;
        this.id = 'AttributeCreated';
        this.className = "org.opendolphin.core.comm.AttributeCreatedNotification";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttributeCreatedNotification;

//# sourceMappingURL=AttributeCreatedNotification.js.map
