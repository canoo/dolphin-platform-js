import { LoggerFactory } from '../logging';
import { HttpResponse } from './httpResponse';
import { HttpException } from './httpException';
class Executor {

    constructor(configuration) {
        this.configuration = configuration;
    }

    onDone(handler) {
        this._onDone = handler;
        return this;
    }

    onError(handler) {
        this._onError = handler;
        return this;
    }

    execute() {
        const self = this;
        const httpRequest = new XMLHttpRequest();
        const async = true;
        
        httpRequest.open(this.configuration.method, this.configuration.url, async);

        if (this.configuration.headers && this.configuration.headers.length > 0) {
            for (let i = 0; i < this.configuration.headers.length; i++) {
                const header = this.configuration.headers[i];
                httpRequest.setRequestHeader(header.name, header.value);
            }
            
        }

        httpRequest.timeout = this.configuration.timeout;

        if (this.configuration.responseType) {
            httpRequest.responseType = this.configuration.responseType;
        }

        httpRequest.ontimeout = function () {
            let message = this.statusText || 'Timeout occurred';
            const httpException = new HttpException(message);
            self._onError(httpException);
        }

        httpRequest.onerror = function () {
            let message = this.statusText || 'Unspecified error occured';
            const httpException = new HttpException(message);
            self._onError(httpException);
        }

        httpRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                Executor.LOGGER.trace('Request to ', self.configuration.url, 'finished with', this.status);
            }
            if (this.readyState === 4 && this.status >= 200 && this.status < 300 && typeof self._onDone === 'function') {
                // https://www.w3.org/TR/cors/#simple-response-header
                const httpResponse = new HttpResponse(this.status, this.response, this.getAllResponseHeaders());
                if (self.configuration.responseType) {
                    self._onDone(httpResponse);
                } else {
                    self._onDone(httpResponse);
                }
            } else if (this.readyState === 4 && this.status >= 300 && typeof self._onError === 'function') {
                const httpException = new HttpException(this.statusText);
                self._onError(httpException);
            }
        }

        if (this.configuration.requestBody) {
            httpRequest.send(this.configuration.requestBody);
        } else {
            httpRequest.send();
        }
        
        
    }

}

Executor.LOGGER = LoggerFactory.getLogger('Executor');

export { Executor }