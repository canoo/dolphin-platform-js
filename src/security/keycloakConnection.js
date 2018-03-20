import { checkMethod, checkParam } from '../utils';
import { HTTP, RESPONSE_TYPE } from '../platform/constants'

class KeycloakConnection {

    constructor() {
    }

    createDirectConnection(authEndpoint, realmName) {
        checkMethod('createDirectConnection');
        checkParam(authEndpoint, 'authEndpoint');
        checkParam(realmName, 'realmName');

        const httpRequest = new XMLHttpRequest();
        httpRequest.open(HTTP.METHOD.POST, authEndpoint + '/auth/realms/' + realmName + '/protocol/openid-connect/token', true);
        httpRequest.setRequestHeader(HTTP.HEADER_NAME.CONTENT_TYPE,  'application/x-www-form-urlencoded');
        httpRequest.responseType = RESPONSE_TYPE.JSON;

        return httpRequest;
    }

    createServerProxyConnection(authEndpoint, realmName) {
        checkMethod('createServerProxyConnection');
        checkParam(authEndpoint, 'authEndpoint');

        const httpRequest = new XMLHttpRequest();
        httpRequest.open(HTTP.METHOD.POST, authEndpoint, true);
        httpRequest.setRequestHeader(HTTP.HEADER_NAME.CONTENT_TYPE,  'application/txt');
        httpRequest.responseType = RESPONSE_TYPE.JSON;

        if (realmName) {
            httpRequest.setRequestHeader(HTTP.HEADER_NAME.X_PLATFORM_SECURITY_REALM, realmName);
        }
        return httpRequest;
    }

}

export { KeycloakConnection }