class Executor {

    constructor(configuration) {
        this.configuration = configuration;
    }

    execute() {
        console.log(this.configuration);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

}

export { Executor }