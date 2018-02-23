import { LoggerFactory } from '../logging';
import { HttpResponse } from './httpResponse';
import { HttpException } from './httpException';
class Executor {

    constructor(configuration) {
        this.configuration = configuration;
    }

    execute(timeout) {

        return new Promise((resolve, reject) => {
        
            const self = this;
            const httpRequest = new XMLHttpRequest();
            const async = true;
            
            httpRequest.open(this.configuration.method, this.configuration.url, async);
            httpRequest.url = this.configuration.url;
            httpRequest.method = this.configuration.method;
            httpRequest.withCredentials = true;

            if (window.platformClient) {
                const requestInterceptors = window.platformClient.getService('HttpClientInterceptor').getRequestInterceptors();
                for (let i = 0; i < requestInterceptors.length; i++) {
                    const requestInterceptor = requestInterceptors[i];
                    requestInterceptor.handleRequest(httpRequest);
                }
            
            }

            if (this.configuration.headers && this.configuration.headers.length > 0) {
                for (let i = 0; i < this.configuration.headers.length; i++) {
                    const header = this.configuration.headers[i];
                    httpRequest.setRequestHeader(header.name, header.value);
                }
                
            }

            httpRequest.timeout = timeout || 0;

            if (this.configuration.responseType) {
                httpRequest.responseType = this.configuration.responseType;
            }

            httpRequest.ontimeout = function () {
                const message = this.statusText || 'Timeout occurred';
                const httpException = new HttpException(message, this.status, true);
                reject(httpException);
            }

            httpRequest.onerror = function () {
                let message = this.statusText || 'Unspecified error occured';
                const httpException = new HttpException(message, this.status);
                reject(httpException);
            }

            httpRequest.onreadystatechange = function () {
                if (this.readyState === 4) {
                    Executor.LOGGER.trace('Request to ', self.configuration.url, 'finished with', this.status);
                }
                if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
                    // https://www.w3.org/TR/cors/#simple-response-header
                    const httpResponse = new HttpResponse(this.status, this.response, this.getAllResponseHeaders());

                    if (window.platformClient) {
                        const responseInterceptors = window.platformClient.getService('HttpClientInterceptor').getResponseInterceptors();
                        
                        for (let i = 0; i < responseInterceptors.length; i++) {
                            const responseInterceptor = responseInterceptors[i];
                            responseInterceptor.handleResponse(httpRequest);
                        }
                    
                    }

                    if (self.configuration.responseType) {
                        resolve(httpResponse);
                    } else {
                        resolve(httpResponse);
                    }
                } else if (this.readyState === 4 && this.status >= 300) {
                    const httpException = new HttpException(this.statusText, this.status);
                    reject(httpException);
                }
            }

            if (this.configuration.requestBody) {
                httpRequest.send(this.configuration.requestBody);
            } else {
                httpRequest.send();
            }
        });
        
    }

}

Executor.LOGGER = LoggerFactory.getLogger('Executor');

export { Executor }