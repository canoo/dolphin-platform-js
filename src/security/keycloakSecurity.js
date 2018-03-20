import { exists, checkMethod, checkParam } from '../utils';
import { KeycloakConnection } from './keycloakConnection';
import { KeycloakFunctions } from './keycloakFunctions';
import { SecurityHttpClientInterceptor } from './securityHttpClientInterceptor';

class KeycloakSecurity {

    constructor() {
        this.connection = new KeycloakConnection();
        this.functions = new KeycloakFunctions();
        this.interceptor = new SecurityHttpClientInterceptor();
        this.directConnection = false;
        this.authEndpoint = '/openid-connect';
        this.appName = '';
    }

    withDirectConnection() {
        this.directConnection = true;
        return this;
    }

    withAppName(appName) {
        this.appName = appName;
        return this;
    }

    withAuthEndpoint(authEndpoint) {
        this.authEndpoint = authEndpoint;
        return this;
    }

    login(user, password) {
        let connection;
        let content;
        
        if (this.directConnection) {
            connection = this.connection.createDirectConnection(this.authEndpoint);
            content = 'client_id=' + this.appName + '&username=' + user + '&password=' + password + '&grant_type=password';
        } else {
            connection = this.connection.createServerProxyConnection(this.authEndpoint);
            content = 'username=' + user + '&password=' + password + '&grant_type=password';
        }
        const self = this;
        return new Promise((resolve, reject) => {
            this.functions.receiveToken(connection, content)
            .then((result) => {
                self.token = result;
                this.interceptor.setToken(result.access_token);
                resolve();
            })
            .catch((error) => reject(error));
        });
    }

    logout() {
        const self = this;
        return new Promise((resolve) => {
            delete self.token;
            self.interceptor.setToken(null);
            resolve();
        });
    }

    isAuthorized() {
        return exists(this.token);
    }

    initServiceProvider(platformClient) {
        checkMethod('initServiceProvider');
        checkParam(platformClient, 'platformClient');
        platformClient.getService('HttpClientInterceptor').addRequestInterceptor(this.interceptor);
    }
}

export { KeycloakSecurity };
