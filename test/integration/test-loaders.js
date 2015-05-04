"use strict";

var expect = require('chai').expect;

describe('dolphin.min.js loaders', function() {

    it('CommonJS', function() {
        var dolphinCommonJS = require('../../dist/dolphin.min.js');

        expect(dolphinCommonJS.connect).to.be.a('function');
    });

    it('AMD', function() {
        var requirejs = require('../../node_modules/requirejs/bin/r.js');

        requirejs.config({
            nodeRequire: require
        });

        requirejs(['../../dist/dolphin.min.js'], function (dolphinAMD) {
            expect(dolphinAMD.connect).to.be.a('function');
        });
    });

});
