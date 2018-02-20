class ServiceProvider {

    constructor(serviceClass, name) {
        this.serviceInstance = new serviceClass();
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getService() {
        return this.serviceInstance;
    }
}

export { ServiceProvider }