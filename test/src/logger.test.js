/*jslint browserify: true, mocha: true, expr: true */
"use strict";

import { expect } from 'chai';
import sinon from 'sinon';

import { LoggerFactory, LogLevel }  from '../../src/logger';

const dateMatch = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}/;

describe('Logger', function() {

    beforeEach(function() {

    });

    it('Logger is an object', function() {
        let logger = LoggerFactory.getLogger();
        expect(logger).to.be.an('object');
    });

    it('Logger has trace function', function() {
        let logger = LoggerFactory.getLogger();
        expect(logger.trace).to.be.an('function');
    });

    it('Logger has debug function', function() {
        let logger = LoggerFactory.getLogger();
        expect(logger.debug).to.be.an('function');
    });

    it('Logger has info function', function() {
        let logger = LoggerFactory.getLogger();
        expect(logger.info).to.be.an('function');
    });

    it('Logger has warn function', function() {
        let logger = LoggerFactory.getLogger();
        expect(logger.warn).to.be.an('function');
    });

    it('Logger has error function', function() {
        let logger = LoggerFactory.getLogger();
        expect(logger.error).to.be.an('function');
    });

    it('Set log level by name', function() {
        let logger = LoggerFactory.getLogger();
        logger.setLogLevelByName('DEBUG');
        expect(logger.getLogLevel()).to.be.equal(LogLevel.DEBUG);
    });

    it('Is correct LogLevel useable', function() {
        let logger = LoggerFactory.getLogger();
        logger.setLogLevel(LogLevel.DEBUG);
        expect(logger.isLogLevelUseable(LogLevel.ERROR)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.WARN)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.INFO)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.DEBUG)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.TRACE)).to.be.false;
    });

    it('Is correct LogLevel useable', function() {
        let logger = LoggerFactory.getLogger();
        logger.setLogLevel(LogLevel.ERROR);
        expect(logger.isLogLevelUseable(LogLevel.ERROR)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.WARN)).to.be.false;
        expect(logger.isLogLevelUseable(LogLevel.INFO)).to.be.false;
        expect(logger.isLogLevelUseable(LogLevel.DEBUG)).to.be.false;
        expect(logger.isLogLevelUseable(LogLevel.TRACE)).to.be.false;
    });

    it('Is correct LogLevel useable', function() {
        let logger = LoggerFactory.getLogger();
        logger.setLogLevel(LogLevel.ALL);
        expect(logger.isLogLevelUseable(LogLevel.ERROR)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.WARN)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.INFO)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.DEBUG)).to.be.true;
        expect(logger.isLogLevelUseable(LogLevel.TRACE)).to.be.true;
    });

    it('Log debug message', sinon.test(function() {
            this.stub(console, 'log');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.DEBUG);
            logger.debug('test');
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWithMatch(dateMatch, LogLevel.DEBUG.text, /.*/, 'test')).to.be.true;
        })
    );

    it('Log info message', sinon.test(function() {
            this.stub(console, 'log');
            let logger = LoggerFactory.getLogger();
            logger.info('test');
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWithMatch(dateMatch, LogLevel.INFO.text, /.*/, 'test')).to.be.true;
        })
    );

    it('Log trace message', sinon.test(function() {
            this.stub(console, 'log');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.TRACE);
            logger.trace('test');
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWithMatch(dateMatch, LogLevel.TRACE.text, /.*/, 'test')).to.be.true;
        })
    );

    it('Log error message', sinon.test(function() {
            this.stub(console, 'error');
            let logger = LoggerFactory.getLogger();
            logger.error('test');
            expect(console.error.calledOnce).to.be.true;
            expect(console.error.calledWithMatch(dateMatch, LogLevel.ERROR.text, /.*/, 'test')).to.be.true;
        })
    );

    it('Log warn message', sinon.test(function() {
            this.stub(console, 'warn');
            let logger = LoggerFactory.getLogger();
            logger.warn('test');
            expect(console.warn.calledOnce).to.be.true;
            expect(console.warn.calledWithMatch(dateMatch, LogLevel.WARN.text, /.*/, 'test')).to.be.true;
        })
    );


    ///
    it('Do not log debug message', sinon.test(function() {
            this.stub(console, 'debug');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.INFO);
            logger.debug('test');
            expect(console.debug.calledOnce).to.be.false;
        })
    );

    it('Do not log info message', sinon.test(function() {
            this.stub(console, 'log');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.WARN)
            logger.info('test');
            expect(console.log.calledOnce).to.be.false;
        })
    );

    it('Do not log trace message', sinon.test(function() {
            this.stub(console, 'log');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.DEBUG);
            logger.trace('test');
            expect(console.log.calledOnce).to.be.false;
        })
    );

    it('Do not log error message', sinon.test(function() {
            this.stub(console, 'error');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.NONE);
            logger.error('test');
            expect(console.error.calledOnce).to.be.false;
        })
    );

    it('Do not log warn message', sinon.test(function() {
            this.stub(console, 'warn');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.ERROR);
            logger.warn('test');
            expect(console.warn.calledOnce).to.be.false;
        })
    );

    it('Do not log warn message, level set by ROOT Logger', sinon.test(function() {
            this.stub(console, 'warn');
            let rootLogger = LoggerFactory.getLogger();
            rootLogger.setLogLevel(LogLevel.ERROR);
            let logger = LoggerFactory.getLogger('someLogger');
            logger.warn('test');
            expect(console.warn.calledOnce).to.be.false;
        })
    );

    it('Log trace message set by ROOT Logger', sinon.test(function() {
            this.stub(console, 'log');
            let rootLogger = LoggerFactory.getLogger();
            rootLogger.setLogLevel(LogLevel.TRACE);
            let logger = LoggerFactory.getLogger('someLogger');
            logger.trace('test');
            expect(console.log.calledOnce).to.be.true;
            rootLogger.setLogLevel(LogLevel.INFO);
            logger.trace('test');
            expect(console.log.calledOnce).to.be.true;
        })
    );

    it('Do not log trace message set by ROOT Logger', sinon.test(function() {
            this.stub(console, 'log');
            let rootLogger = LoggerFactory.getLogger();
            rootLogger.setLogLevel(LogLevel.TRACE);
            let logger = LoggerFactory.getLogger('someLogger');
            logger.setLogLevel(LogLevel.INFO);
            logger.trace('test');
            expect(console.log.calledOnce).to.be.false;
        })
    );

    it('Do not log', sinon.test(function() {
            this.stub(console, 'warn');
            this.stub(console, 'error');
            this.stub(console, 'debug');
            this.stub(console, 'log');
            let logger = LoggerFactory.getLogger();
            logger.setLogLevel(LogLevel.NONE);
            logger.error('test');
            expect(console.error.calledOnce).to.be.false;
            logger.warn('test');
            expect(console.warn.calledOnce).to.be.false;
            logger.info('test');
            expect(console.log.calledOnce).to.be.false;
            logger.debug('test');
            expect(console.debug.calledOnce).to.be.false;
            logger.debug('trace');
            expect(console.log.calledOnce).to.be.false;
        })
    );

    it('Equal logger', function() {
        let loggerA = LoggerFactory.getLogger('one');
        let loggerB = LoggerFactory.getLogger('one');
        expect(loggerA).to.be.equals(loggerB);
    });

    it('Not equal logger', function() {
        let loggerA = LoggerFactory.getLogger('one');
        let loggerB = LoggerFactory.getLogger('two');
        expect(loggerA).not.to.be.equals(loggerB);
    });
});