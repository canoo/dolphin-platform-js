import { ServiceProvider  } from './serviceProvider';
import { parseUrl, exists } from '../utils'

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

class ClientScope {

    constructor() {
        this.clientIds = new Map();
    }

    handleRequest(httpRequest) {
        const result = parseUrl(httpRequest.url);
        const key = result.hostname + result.port;
        const clientId = this.clientIds.get(key);
        if (exists(clientId)) {
            httpRequest.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, clientId);
        }
    }

    handleResponse(httpRequest) {
        const result = parseUrl(httpRequest.url);
        const key = result.hostname + result.port;
        const clientId = this.clientIds.get(key);
        const newClientId = httpRequest.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
        if (exists(clientId) && exists(newClientId) && clientId !== newClientId) {
            throw new Error('Client Id does not match!');
        }
        if (exists(newClientId)) {
            this.clientIds.set(key, newClientId);
        }
    }

    initServiceProvider(platformClient) {
        platformClient.getService('HttpClientInterceptor').addRequestInterceptor(this);
        platformClient.getService('HttpClientInterceptor').addResponseInterceptor(this);
    }

}

function register(platformClient) {
    if (exists(platformClient)) {
        const clientScopeProvider = new ServiceProvider(ClientScope, 'ClientScope');

        platformClient.registerServiceProvider(clientScopeProvider);
    }
}

export { register }