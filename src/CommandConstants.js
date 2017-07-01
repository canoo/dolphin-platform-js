"use strict";
class CommandConstants {
}
CommandConstants.DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
CommandConstants.CREATE_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'initClientContext';
CommandConstants.DESTROY_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'disconnectClientContext';
CommandConstants.CREATE_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'registerController';
CommandConstants.DESTROY_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'destroyController';
CommandConstants.CALL_CONTROLLER_ACTION_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
CommandConstants.START_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'longPoll';
CommandConstants.INTERRUPT_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'release';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommandConstants;

//# sourceMappingURL=CommandConstants.js.map
