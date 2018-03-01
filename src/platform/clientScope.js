import { ServiceProvider  } from './serviceProvider';
import { parseUrl, exists } from '../utils'
import { LoggerFactory } from '../logging'

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

class ClientScope {

    constructor() {
        this.clientIds = new Map();
    }

    handleRequest(httpRequest) {
        const clientId = this.getClientId(httpRequest.url);
        if (exists(clientId)) {
            ClientScope.LOGGER.trace('Using ClientId', clientId);
            httpRequest.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, clientId);
        }
    }

    handleResponse(httpResponse) {
        const clientId = this.getClientId(httpResponse.url);
        const newClientId = httpResponse.getHeaderByName(CLIENT_ID_HTTP_HEADER_NAME);
        if (exists(clientId) && exists(newClientId) && clientId !== newClientId) {
            throw new Error('Client Id does not match!');
        }
        if (!exists(clientId) && exists(newClientId)) {
            ClientScope.LOGGER.debug('New ClientId found', newClientId);
            this.setClientId(httpResponse.url, newClientId);
        }
    }

    initServiceProvider(platformClient) {
        platformClient.getService('HttpClientInterceptor').addRequestInterceptor(this);
        platformClient.getService('HttpClientInterceptor').addResponseInterceptor(this);
    }

    getClientId(url) {
        const result = parseUrl(url);
        const key = ClientScope.calcKey(result.hostname, result.port)
        return this.clientIds.get(key);
    }

    setClientId(url, clientId) {
        const result = parseUrl(url);
        const key = ClientScope.calcKey(result.hostname, result.port)
        this.clientIds.set(key, clientId);
        ClientScope.LOGGER.trace('Setting ClientId', clientId, 'for', url, 'with key', key);
    }

}

ClientScope.calcKey = function(hostname, port) {
    return hostname + port;
}

ClientScope.LOGGER = LoggerFactory.getLogger('ClientScope');

function register(platformClient) {
    if (exists(platformClient)) {
        const clientScopeProvider = new ServiceProvider(ClientScope, 'ClientScope');

        platformClient.registerServiceProvider(clientScopeProvider);
    }
}

export { register }