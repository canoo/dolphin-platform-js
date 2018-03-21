import { HTTP } from '../platform/constants'

class KeycloakFunctions {

    receiveToken(httpRequest, body) {
        return new Promise((resolve, reject) => {
            httpRequest.ontimeout = function (error) {
                reject(error);
            }

            httpRequest.onerror = function (error) {
                reject(error);
            }

            httpRequest.onreadystatechange = function () {
                if (this.readyState === HTTP.XMLHTTPREQUEST_READYSTATE.DONE && this.status === HTTP.STATUS.OK) {
                    resolve(this.response);
                } else if (this.readyState === HTTP.XMLHTTPREQUEST_READYSTATE.DONE && this.status !== HTTP.STATUS.OK) {
                    reject(this.status);
                }
            }
            
            httpRequest.send(body);
        });
    }
    
}

export { KeycloakFunctions }