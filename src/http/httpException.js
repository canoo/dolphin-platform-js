class HttpException {

    constructor(message) {
        this.message = message;
    }

    getMessage() {
        return this.message;
    }

}

export { HttpException }