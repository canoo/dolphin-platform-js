/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
var DolphinBuilder_1 = require("../../js/dolphin/DolphinBuilder");
var chai_1 = require('chai');
describe('DolphinBuilderTest', function () {
    it('defaults values', function () {
        var builder = new DolphinBuilder_1.default();
        chai_1.assert.equal(builder.url_, undefined, "ERROR: url_ must be 'undefined'");
        chai_1.assert.equal(builder.reset_, false, "ERROR: reset_ must be 'false'");
        chai_1.assert.equal(builder.slackMS_, 300, "ERROR: slackMS_ must be '300'");
        chai_1.assert.equal(builder.maxBatchSize_, 50, "ERROR: maxBatchSize_ must be '50'");
        chai_1.assert.equal(builder.errorHandler_, undefined, "ERROR: errorHandler_ must be 'undefined'");
        chai_1.assert.equal(builder.supportCORS_, false, "ERROR: supportCORS_ must be 'false'");
    });
    it('url', function () {
        var url = 'http:8080//mydolphinapp';
        var builder = new DolphinBuilder_1.default().url(url);
        chai_1.assert.equal(builder.url_, url, "ERROR: url_ must be '" + url + "'");
    });
    it('reset', function () {
        var reset = true;
        var builder = new DolphinBuilder_1.default().reset(reset);
        chai_1.assert.equal(builder.reset_, reset, "ERROR: reset_ must be '" + reset + "'");
    });
    it('slackMS', function () {
        var slackMS = 400;
        var builder = new DolphinBuilder_1.default().slackMS(slackMS);
        chai_1.assert.equal(builder.slackMS_, slackMS, "ERROR: slackMS_ must be '" + slackMS + "'");
    });
    it('max batch size', function () {
        var maxBatchSize = 60;
        var builder = new DolphinBuilder_1.default().maxBatchSize(maxBatchSize);
        chai_1.assert.equal(builder.maxBatchSize_, maxBatchSize, "ERROR: maxBatchSize_ must be '" + maxBatchSize + "'");
    });
    it('support CORS', function () {
        var supportCORS = true;
        var builder = new DolphinBuilder_1.default().supportCORS(supportCORS);
        chai_1.assert.equal(builder.supportCORS_, supportCORS, "ERROR: supportCORS_ must be '" + supportCORS + "'");
    });
    it('error handler', function () {
        var errorHandler = function (evt) { };
        var builder = new DolphinBuilder_1.default().errorHandler(errorHandler);
        chai_1.assert.equal(builder.errorHandler_, errorHandler, "ERROR: errorHandler_ must be '" + errorHandler + "'");
    });
    it('built client dolphin', function () {
        var dolphin = new DolphinBuilder_1.default().build();
        chai_1.assert.notEqual(dolphin.getClientConnector(), undefined, "ERROR: dolphin.clientConnector must be initialized");
        chai_1.assert.notEqual(dolphin.getClientModelStore(), undefined, "ERROR: dolphin.clientModelStore must be initialized");
        // TODO: how to test if 'HttpTransmitter' or 'NoTransmitter' is created when 'ClientTransmitter.transmitter' is private ?
    });
});
