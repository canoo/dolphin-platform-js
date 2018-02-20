import { Executor } from './executor';
class ResponseBuilder {

    constructor(configuration) {
        this.configuration = configuration;
        this.executor = new Executor(configuration);
    }

    readBytes() {
        return this.executor;
    }

    readString() {
        return this.executor;
    }

    readObject() {
        return this.executor;
    }

    withoutResult() {
        return this.executor;
    }
}

export { ResponseBuilder }