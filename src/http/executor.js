import { LoggerFactory } from '../logging'
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
        let self = this;

        let httpRequest = new XMLHttpRequest();
        
        httpRequest.open(this.configuration.method, this.configuration.url);

        if (this.configuration.headers && this.configuration.headers.length > 0) {
            for (let i = 0; i < this.configuration.headers.length; i++) {
                const header = this.configuration.headers[i];
                httpRequest.setRequestHeader(header.name, header.value);
            }
            
        }

        if (this.configuration.responseType) {
            httpRequest.responseType = this.configuration.responseType;
        }

        httpRequest.onreadystatechange = function () {
            if (this.readyState === 4) {
                Executor.LOGGER.debug('Request to ', self.configuration.url, 'finished');
            }
            if (this.readyState === 4 && this.status === 200 && typeof self._onDone === 'function') {
                if (self.configuration.responseType) {
                    self._onDone(httpRequest.response);
                } else {
                    self._onDone();
                }
            } else if (this.readyState === 4 && this.status !== 200 && typeof self._onError === 'function') {
                self._onError('error');
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