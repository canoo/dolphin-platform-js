class HttpResponse {

    constructor(status, content, headers) {
        this.status = status;
        this.content = content;
        const headerArray = headers.trim().split(/[\r\n]+/);
        this.headers = {};
        for (let i = 0; i < headerArray.length; i++) {
            const line = headerArray[i];
            const parts = line.split(': ');
            const header = parts.shift();
            const value = parts.join(': ');
            this.headers[header] = value;
        }
    }

    getContent() {
        return this.content;
    }

    getStatus() {
        return this.status;
    }

    getHeaders() {
        return this.headerObj;
    }

    getHeaderByName(name) {
        return this.headerObj[name];
    }

}

export { HttpResponse }