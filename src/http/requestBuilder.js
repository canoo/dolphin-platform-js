import { ResponseBuilder } from './reponseBuilder';
class RequestBuilder {

    constructor(configuration) {
        this.configuration = configuration;
        this.reponseBuilder = new ResponseBuilder(configuration);
    }
    withHeader(name, value) {
        if (!this.configuration.headers) {
            this.configuration.headers = [];
        }
        this.configuration.headers.push({ name, value });
        return this;
    }

    withContent(data) {
        this.configuration.requestBody = data;
        return this.reponseBuilder;
    }

    withoutContent() {
        return this.reponseBuilder;
    }
}

export { RequestBuilder }