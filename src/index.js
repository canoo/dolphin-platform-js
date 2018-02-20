import { provider as remotingServiceProvider } from './remoting';
import { LoggerFactory, LogLevel } from './logging';
import { getService, hasService, registerServiceProvider } from './platform/platformClient';

registerServiceProvider(remotingServiceProvider);

export { LoggerFactory, LogLevel, getService, hasService, registerServiceProvider }

// Provide dependencies as global dolphin object for backward compatibility
import { createClientContext, ClientContextFactory } from './remoting/clientContextFactory'

const LOGGER = LoggerFactory.getLogger('Deprecated:');
let showWarning = true;
function warn() {
    if (showWarning) {
        LOGGER.warn('Please do not use "dolphin" anymore, it may be removed in the next version! Use "platformClient" instead!');
        showWarning = false;
    }
}

if (window) {
    window.dolphin = {
        get ClientContextFactory() {
            warn();
            return ClientContextFactory;
        },
        get createClientContext() {
            warn();
            return createClientContext;
        },
        get LoggerFactory() {
            warn();
            return LoggerFactory;
        },
        get LogLevel() {
            warn();
            return LogLevel;
        }
    }
}