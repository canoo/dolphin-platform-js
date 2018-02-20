import { Executor } from './executor';
class ResponseBuilder {

    constructor(configuration) {
        this.configuration = configuration;
        this.executor = new Executor(configuration);
    }

    readBytes() {
        this.configuration.responseType = 'arraybuffer';
        return this.executor;
    }

    readString() {
        this.configuration.responseType = 'text';
        return this.executor;
    }

    readObject() {
        this.configuration.responseType = 'json';
        return this.executor;
    }

    withoutResult() {
        return this.executor;
    }
}

export { ResponseBuilder }