"use strict";
class EventBus {
    constructor() {
        this.eventHandlers = [];
    }
    onEvent(eventHandler) {
        this.eventHandlers.push(eventHandler);
    }
    trigger(event) {
        this.eventHandlers.forEach(handle => handle(event));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventBus;

//# sourceMappingURL=EventBus.js.map
