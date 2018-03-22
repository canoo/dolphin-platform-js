import { checkMethod, checkParam, parseUrl, exists } from '../utils';
import { ServiceProvider  } from './serviceProvider';
import { LoggerFactory } from '../logging';
import { HTTP } from './constants';

class ClientScope {

    constructor() {
        this.clientIds = new Map();
    }

    handleRequest(httpRequest) {
        checkMethod('handleRequest');
        checkParam(httpRequest, 'httpRequest');
        const clientId = this.getClientId(httpRequest.url);
        if (exists(clientId)) {
            ClientScope.LOGGER.trace('Using ClientId', clientId);
            httpRequest.setRequestHeader(HTTP.HEADER_NAME.X_CLIENT_SESSION_ID, clientId);
        }
    }

    handleResponse(httpResponse) {
        checkMethod('handleResponse');
        checkParam(httpResponse, 'httpResponse');
        const clientId = this.getClientId(httpResponse.url);
        const newClientId = httpResponse.getHeaderByName(HTTP.HEADER_NAME.X_CLIENT_SESSION_ID);
        if (exists(clientId) && exists(newClientId) && clientId !== newClientId) {
            throw new Error('Client Id does not match!');
        }
        if (!exists(clientId) && exists(newClientId)) {
            ClientScope.LOGGER.debug('New ClientId found', newClientId);
            this.setClientId(httpResponse.url, newClientId);
        }
    }

    initServiceProvider(platformClient) {
        checkMethod('initServiceProvider');
        checkParam(platformClient, 'platformClient');
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