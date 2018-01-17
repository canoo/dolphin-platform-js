import  Map from 'core-js/library/fn/map';

// private methods
const LOCALS = {
    internalLog () {
        let args = Array.from(arguments);
        let func = args.shift();
        let name = args.shift();
        let logLevel = args.shift();
        func(name, logLevel.text, ...args);
    },
    loggers: new Map()
};


// public
const LogLevel = {
    NONE: { name: 'NONE', text: 'NONE ' },
    ALL: { name: 'ALL', text: 'ALL  ' },
    TRACE: { name: 'TRACE', text: 'TRACE' },
    DEBUG: { name: 'DEBUG', text: 'DEBUG' },
    INFO: { name: 'INFO', text: 'INFO ' },
    WARN: { name: 'WARN', text: 'WARN ' },
    ERROR: { name: 'ERROR', text: 'ERROR ' },
};

class Logger {

    constructor(name) {
        if (name) {
            this.name = 'DP.' + name;
        } else {
            this.name = 'DP';
        }
        this.logLevel = LogLevel.INFO;
    }

    trace() {
        if (this.isLogLevel(LogLevel.TRACE)) {
            LOCALS.internalLog(console.log, this.name, LogLevel.TRACE, ...arguments);
        }
    };

    debug() {
        if (this.isLogLevel(LogLevel.DEBUG)) {
            LOCALS.internalLog(console.debug, this.name, LogLevel.DEBUG, ...arguments);
        }
    };

    info() {
        if (this.isLogLevel(LogLevel.INFO)) {
            LOCALS.internalLog(console.log, this.name, LogLevel.INFO, ...arguments);
        }
    };

    warn() {
        if (this.isLogLevel(LogLevel.WARN)) {
            LOCALS.internalLog(console.warn, this.name, LogLevel.WARN, ...arguments);
        }
    };

    error() {
        if (this.isLogLevel(LogLevel.ERROR)) {
            LOCALS.internalLog(console.error, this.name, LogLevel.ERROR, ...arguments);
        }
    }

    getLogLevel() {
        return this.logLevel;
    }

    setLogLevel(level) {
        this.logLevel = level;
    }

    isLogLevel(level) {
        if (this.logLevel === LogLevel.NONE) {
            return false;
        }
        if (this.logLevel === LogLevel.ALL) {
            return true;
        }
        if (this.logLevel === LogLevel.TRACE) {
            return true;
        }
        if (this.logLevel === LogLevel.DEBUG && level !== LogLevel.TRACE) {
            return true;
        }
        if (this.logLevel === LogLevel.INFO && level !== LogLevel.TRACE && level !== LogLevel.DEBUG) {
            return true;
        }
        if (this.logLevel === LogLevel.WARN && level !== LogLevel.TRACE && level !== LogLevel.DEBUG && level !== LogLevel.INFO) {
            return true;
        }
        if (this.logLevel === LogLevel.ERROR && level !== LogLevel.TRACE && level !== LogLevel.DEBUG && level !== LogLevel.INFO && level !== LogLevel.WARN) {
            return true;
        }
        return false;
    }
}

class LoggerFactory {


    static getLogger(context, name) {
        if (!context) {
            return new Logger(name);
        }
        let existingLogger = LOCALS.loggers.get(context);
        if (existingLogger) {
            return existingLogger;
        }

        let logger = new Logger(name);
        LOCALS.loggers.set(context, logger);
        return logger;
    }
}



export { LoggerFactory, LogLevel };