import { checkMethod, checkParam, exists } from '../utils'
import { LoggerFactory } from '../logging'
import { HTTP } from '../platform/constants'

class SecurityHttpClientInterceptor {

    constructor() {
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    handleRequest(httpRequest) {
        checkMethod('handleRequest');
        checkParam(httpRequest, 'httpRequest');

        if (exists(this.token)) {
            SecurityHttpClientInterceptor.LOGGER.trace('Using token', this.token);
            httpRequest.setRequestHeader(HTTP.HEADER_NAME.AUTHORIZATION, 'Bearer ' + this.token);
        }
        httpRequest.setRequestHeader(HTTP.HEADER_NAME.X_PLATFORM_SECURITY_BEARER_ONLY, 'true');
        
    }
}

SecurityHttpClientInterceptor.LOGGER = LoggerFactory.getLogger('SecurityHttpClientInterceptor');

export { SecurityHttpClientInterceptor };