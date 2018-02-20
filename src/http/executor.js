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
        console.log(this.configuration);
    }

}

export { Executor }