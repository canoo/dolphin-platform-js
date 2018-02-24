/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import { exists } from '../../../src/utils';

describe('utils.exists()', function() {
    it('undefined', function() {
        expect(exists(undefined)).to.be.false;
    });

    it('null', function() {
        expect(exists(null)).to.be.false;
    });

    it('boolean', function() {
        expect(exists(false)).to.be.true;
    });

    it('number', function() {
        expect(exists(0)).to.be.true;
    });

    it('string', function() {
        expect(exists('')).to.be.true;
    });

    it('object', function() {
        expect(exists({})).to.be.true;
    });

    it('array', function() {
        expect(exists([])).to.be.true;
    });

    it('function', function() {
        expect(exists(function() {})).to.be.true;
    });
});
