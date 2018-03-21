import { LoggerFactory } from '../logging';
import { exists, checkMethod, checkParam } from '../utils';
import { KeycloakFunctions } from './keycloakFunctions';
import { SecurityHttpClientInterceptor } from './securityHttpClientInterceptor';
import { SECURITY } from '../platform/constants'

class KeycloakSecurity {

    constructor() {
        this.functions = new KeycloakFunctions();
        this.interceptor = new SecurityHttpClientInterceptor();
        this.directConnection = false;
        this.authEndpoint = SECURITY.AUTH_ENDPOINT;
        this.appName = null;
        this.realmName = null;
        this.intervall = null;
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

    withRealm(realmName) {
        this.realmName = realmName;
        return this;
    }

    login(user, password) {
        const { connection, content } = this.functions.createLoginConnection(this.directConnection, this.authEndpoint, this.realmName, this.appName, user, password);
        const self = this;
        return new Promise((resolve, reject) => {
            this.functions.receiveToken(connection, content)
            .then((result) => {
                if (result && result.access_token) {
                    self.token = result;
                    this.interceptor.setToken(result.access_token);
                    const sleepTime = Math.max(KeycloakSecurity.MIN_TOKEN_EXPIRES_RUN, result.expires_in - KeycloakSecurity.TOKEN_EXPIRES_DELTA);
                    self.intervall = setInterval(() => {
                        self.functions.refreshToken(self.directConnection, self.authEndpoint, self.realmName, self.appName, result.refresh_token).then((result) => {
                            self.token = result;
                            self.interceptor.setToken(result.access_token);
                        });
                    }, sleepTime);
                    resolve(result.access_token);
                } else {
                    reject('No access token found');
                }
            })
            .catch((error) => reject(error));
        });
    }

    logout() {
        const self = this;
        return new Promise((resolve) => {
            delete self.token;
            self.interceptor.setToken(null);
            self.stopRefresh();
            resolve();
        });
    }

    stopRefresh() {
        if (exists(this.intervall)) {
            clearInterval(this.intervall);
            this.intervall = null;
        }
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

KeycloakSecurity.TOKEN_EXPIRES_DELTA = 10000;
KeycloakSecurity.MIN_TOKEN_EXPIRES_RUN = 30000;

KeycloakSecurity.LOGGER = LoggerFactory.getLogger('KeycloakSecurity');

export { KeycloakSecurity };
