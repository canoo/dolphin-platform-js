import { RequestBuilder } from './requestBuilder';
import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE } from './constants';
class HttpClient {

    request(url, method, timeoutValue) {
        const timeout = timeoutValue || 5000;
        const configuration = {
            url, method, timeout
        }
        this.requestBuilder = new RequestBuilder(configuration);
        return this.requestBuilder;
    }

    get(url, timeout) {
        return this.request(url, HTTP_GET, timeout);
    }

    post(url, timeout) {
        return this.request(url, HTTP_POST, timeout);
    }

    put(url, timeout) {
        return this.request(url, HTTP_PUT), timeout;
    }

    delete(url, timeout) {
        return this.request(url, HTTP_DELETE, timeout);
    }
}

export { HttpClient }