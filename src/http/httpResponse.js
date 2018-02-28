import { exists } from '../utils';
class HttpResponse {

    constructor(status, content, headers) {
        this.status = status;
        this.content = content;
        this.headers = {};
        if (exists(headers) && typeof headers === 'string') {
            const headerArray = headers.trim().split(/[\r\n]+/);
            for (let i = 0; i < headerArray.length; i++) {
                const line = headerArray[i];
                const parts = line.split(': ');
                if (parts.length === 2) {
                    const header = parts.shift();
                    const value = parts.join(': ');
                    this.headers[header] = value;
                }
            }
        }
    }

    getContent() {
        return this.content;
    }

    getStatus() {
        return this.status;
    }

    getHeaders() {
        return this.headers;
    }

    getHeaderByName(name) {
        return this.headers[name];
    }

}

export { HttpResponse }