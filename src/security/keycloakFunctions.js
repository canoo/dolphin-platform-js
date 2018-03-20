import { HTTP } from '../platform/constants'

class KeycloakFunctions {

    receiveToken(httpRequest, body) {
        return new Promise((resolve, reject) => {
            httpRequest.ontimeout = function () {
                reject();
            }

            httpRequest.onerror = function () {
                reject();
            }

            httpRequest.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === HTTP.STATUS.OK) {
                    resolve(this.response);
                } else if (this.readyState === 4 && this.status !== HTTP.STATUS.OK) {
                    reject();
                }
            }

            httpRequest.send(body);
        });
    }
    
}

export { KeycloakFunctions }