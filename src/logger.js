import  Map from 'core-js/library/fn/map';
import { exists } from './utils'

// private methods
const LOCALS = {
    internalLog () {
        let args = Array.from(arguments);
        let func = args.shift();
        let context = args.shift();
        let logLevel = args.shift();
        let date = new Date();
        let dateString =  date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();
        func(dateString, logLevel.text, context, ...args);

    },
    loggers: new Map(),
    getCookie (name) {
        if (exists(window) && exists(window.document) && exists(window.document.cookie)) {
            let value = '; ' + document.cookie;
            let parts = value.split('; ' + name + '=');
            if ( parts.length === 2 ) {
                return parts.pop().split(';').shift();
            }
        }
    }
};


// public
const LogLevel = {
    NONE: { name: 'NONE', text: '[NONE ]' },
    ALL: { name: 'ALL', text: '[ALL  ]' },
    TRACE: { name: 'TRACE', text: '[TRACE]' },
    DEBUG: { name: 'DEBUG', text: '[DEBUG]' },
    INFO: { name: 'INFO', text: '[INFO ]' },
    WARN: { name: 'WARN', text: '[WARN ]' },
    ERROR: { name: 'ERROR', text: '[ERROR]' },
};

class Logger {

    constructor(context, rootLogger) {
        this.context = context;
        this.rootLogger = rootLogger;
        let cookieLogLevel = LOCALS.getCookie('DOLPHIN_PLATFORM_' + this.context);
        switch (cookieLogLevel) {
            case 'NONE':
                this.logLevel = LogLevel.NONE;
                break;
            case 'ALL':
                this.logLevel = LogLevel.ALL;
                break;
            case 'TRACE':
                this.logLevel = LogLevel.TRACE;
                break;
            case 'DEBUG':
                this.logLevel = LogLevel.DEBUG;
                break;
            case 'INFO':
                this.logLevel = LogLevel.INFO;
                break;
            case 'WARN':
                this.logLevel = LogLevel.WARN;
                break;
            case 'ERROR':
                this.logLevel = LogLevel.ERROR;
                break;
            default:
                if (exists(this.rootLogger)) {
                    this.logLevel = this.rootLogger.getLogLevel();
                } else {
                    this.logLevel = LogLevel.INFO;
                }
                break;
        }

    }

    trace() {
        if (exists(console) && this.isLogLevel(LogLevel.TRACE)) {
            LOCALS.internalLog(console.log, this.context, LogLevel.TRACE, ...arguments);
        }
    };

    debug() {
        if (exists(console) && this.isLogLevel(LogLevel.DEBUG)) {
            LOCALS.internalLog(console.log, this.context, LogLevel.DEBUG, ...arguments);
        }
    };

    info() {
        if (exists(console) && this.isLogLevel(LogLevel.INFO)) {
            LOCALS.internalLog(console.log, this.context, LogLevel.INFO, ...arguments);
        }
    };

    warn() {
        if (exists(console) && this.isLogLevel(LogLevel.WARN)) {
            LOCALS.internalLog(console.warn, this.context, LogLevel.WARN, ...arguments);
        }
    };

    error() {
        if (exists(console) && this.isLogLevel(LogLevel.ERROR)) {
            LOCALS.internalLog(console.error, this.context, LogLevel.ERROR, ...arguments);
        }
    }

    getLogLevel() {
        return this.logLevel;
    }

    setLogLevel(level) {
        if (exists(level)) {
            this.logLevel = level;
        } else {
            this.logLevel = this.rootLogger.getLogLevel();
        }
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

const ROOT_LOGGER = new Logger('ROOT');
ROOT_LOGGER.setLogLevel(LogLevel.INFO);

class LoggerFactory {


    static getLogger(context) {
        if (!exists(context)) {
            return ROOT_LOGGER;
        }
        let existingLogger = LOCALS.loggers.get(context);
        if (existingLogger) {
            return existingLogger;
        }

        let logger = new Logger(context, ROOT_LOGGER);
        LOCALS.loggers.set(context, logger);
        return logger;
    }
}



export { LoggerFactory, LogLevel };