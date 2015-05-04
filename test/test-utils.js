"use strict";

var expect = require('chai').expect;

var exists = require('../src/utils.js').exists;

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
});
