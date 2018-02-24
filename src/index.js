import { LoggerFactory, LogLevel } from './logging';
import { PlatformClient } from './platform/platformClient';
import { register as registerHttp } from './http';
import { register as registerClientScope } from './platform/clientScope';
import { register as registerRemotingScope } from './remoting'

registerHttp(PlatformClient);
registerClientScope(PlatformClient);
registerRemotingScope(PlatformClient);
PlatformClient.init();

const getService = PlatformClient.getService;
const hasService = PlatformClient.hasService;
const registerServiceProvider = PlatformClient.registerServiceProvider;

/* eslint-disable */
PlatformClient.LOGGER.info('Dolphin Platform Version:' , DOLPHIN_PLATFORM_VERSION);
/* eslint-enable */

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