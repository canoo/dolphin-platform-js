/*jslint browserify: true, mocha: true, expr: true */
"use strict";

import { expect } from 'chai';

import {LoggerFactory, LogLevel} from '../../../src/logging/index';
import sinon from "sinon";

describe('LoggerFactory', function() {

    it('Do not log warn message, level set by ROOT Logger', sinon.test(function() {
            // given:
            this.stub(console, 'warn');
            let rootLogger = LoggerFactory.getLogger();

            // when:
            rootLogger.setLogLevel(LogLevel.ERROR);
            let logger = LoggerFactory.getLogger('someLogger');
            logger.warn('test');

            // then:
            expect(console.warn.calledOnce).to.be.false;
        })
    );

    it('Log trace message set by ROOT Logger', sinon.test(function() {
            // given:
            this.stub(console, 'log');
            let rootLogger = LoggerFactory.getLogger();
            rootLogger.setLogLevel(LogLevel.TRACE);
            let logger = LoggerFactory.getLogger('someLogger');

            // when:
            logger.trace('test');
            rootLogger.setLogLevel(LogLevel.INFO);
            logger.trace('test');

            // then:
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledOnce).to.be.true;
        })
    );

    it('Do not log trace message set by ROOT Logger', sinon.test(function() {
            // given:
            this.stub(console, 'log');
            let rootLogger = LoggerFactory.getLogger();
            rootLogger.setLogLevel(LogLevel.TRACE);
            let logger = LoggerFactory.getLogger('someLogger');

            // when:
            logger.setLogLevel(LogLevel.INFO);
            logger.trace('test');

            // then:
            expect(console.log.calledOnce).to.be.false;
        })
    );

    it('Equal logger', function() {
        // given:
        let loggerA = LoggerFactory.getLogger('one');
        let loggerB = LoggerFactory.getLogger('one');

        // then:
        expect(loggerA).to.be.equals(loggerB);
    });

    it('Not equal logger', function() {
        // given:
        let loggerA = LoggerFactory.getLogger('one');
        let loggerB = LoggerFactory.getLogger('two');

        // then:
        expect(loggerA).not.to.be.equals(loggerB);
    });
});