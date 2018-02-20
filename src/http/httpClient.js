import { RequestBuilder } from './requestBuilder';
class HttpClient {

    request(url, method) {
        const configuration = {
            url, method
        }
        this.requestBuilder = new RequestBuilder(configuration);
        return this.requestBuilder;
    }

    get(url) {
        return this.request(url, 'GET');
    }

    post(url) {
        return this.request(url, 'POST');
    }

    put(url) {
        return this.request(url, 'PUT');
    }

    delete(url) {
        return this.request(url, 'DELETE');
    }
}

export { HttpClient }