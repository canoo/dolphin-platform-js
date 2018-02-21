import { ServiceProvider  } from './serviceProvider';

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

class ClientScope {

    constructor() {
        this.clientId = null;
    }

    handleRequest(httpRequest) {
        if (this.clientId) {
            httpRequest.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, this.clientId);
        }
    }

    handleResponse(httpRequest) {
        const newClientId = httpRequest.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
        if (newClientId) {
            this.clientId = newClientId;
        }
    }

    initServiceProvider(platformClient) {
        platformClient.getService('HttpClientInterceptor').addRequestInterceptor(this);
        platformClient.getService('HttpClientInterceptor').addResponseInterceptor(this);
    }

}

function register(platformClient) {
    if (platformClient) {
        const clientScopeProvider = new ServiceProvider(ClientScope, 'ClientScope');

        platformClient.registerServiceProvider(clientScopeProvider);
    }
}

export { register }