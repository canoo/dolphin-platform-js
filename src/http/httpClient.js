import { RequestBuilder } from './requestBuilder';
import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE } from './constants';
class HttpClient {

    request(url, method) {
        const configuration = {
            url, method
        }
        this.requestBuilder = new RequestBuilder(configuration);
        return this.requestBuilder;
    }

    get(url) {
        return this.request(url, HTTP_GET);
    }

    post(url) {
        return this.request(url, HTTP_POST);
    }

    put(url) {
        return this.request(url, HTTP_PUT);
    }

    delete(url) {
        return this.request(url, HTTP_DELETE);
    }
}

export { HttpClient }