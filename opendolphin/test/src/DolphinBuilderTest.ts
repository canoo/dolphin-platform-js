/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import ClientDolphin from "../../js/dolphin/ClientDolphin";
import DolphinBuilder from "../../js/dolphin/DolphinBuilder";

import { assert } from 'chai';

describe('DolphinBuilderTest', () => {

    it('defaults values', () => {

        var builder = new DolphinBuilder();
        assert.equal(builder.url_, undefined, "ERROR: url_ must be 'undefined'");
        assert.equal(builder.reset_, false, "ERROR: reset_ must be 'false'");
        assert.equal(builder.slackMS_, 300, "ERROR: slackMS_ must be '300'");
        assert.equal(builder.maxBatchSize_, 50, "ERROR: maxBatchSize_ must be '50'");
        assert.equal(builder.errorHandler_, undefined, "ERROR: errorHandler_ must be 'undefined'");
        assert.equal(builder.supportCORS_, false, "ERROR: supportCORS_ must be 'false'");
    });

    it('url', () => {
        var url = 'http:8080//mydolphinapp';
        var builder = new DolphinBuilder().url(url);
        assert.equal(builder.url_, url, "ERROR: url_ must be '" + url + "'");
    });

    it('reset', () => {
        var reset = true;
        var builder = new DolphinBuilder().reset(reset);
        assert.equal(builder.reset_, reset, "ERROR: reset_ must be '" + reset + "'");
    });

    it('slackMS', () => {
        var slackMS = 400;
        var builder = new DolphinBuilder().slackMS(slackMS);
        assert.equal(builder.slackMS_, slackMS, "ERROR: slackMS_ must be '" + slackMS + "'");
    });

    it('max batch size', () => {
        var maxBatchSize = 60;
        var builder = new DolphinBuilder().maxBatchSize(maxBatchSize);
        assert.equal(builder.maxBatchSize_, maxBatchSize, "ERROR: maxBatchSize_ must be '" + maxBatchSize + "'");
    });

    it('support CORS', () => {
        var supportCORS = true;
        var builder = new DolphinBuilder().supportCORS(supportCORS);
        assert.equal(builder.supportCORS_, supportCORS, "ERROR: supportCORS_ must be '" + supportCORS + "'");
    });

    it('error handler', () => {
        var errorHandler = function(evt) { };
        var builder = new DolphinBuilder().errorHandler(errorHandler);
        assert.equal(builder.errorHandler_, errorHandler, "ERROR: errorHandler_ must be '" + errorHandler + "'");
    });

    it('built client dolphin', () => {
        var dolphin:ClientDolphin = new DolphinBuilder().build();
        assert.notEqual(dolphin.getClientConnector(), undefined, "ERROR: dolphin.clientConnector must be initialized");
        assert.notEqual(dolphin.getClientModelStore(), undefined, "ERROR: dolphin.clientModelStore must be initialized");
        // TODO: how to test if 'HttpTransmitter' or 'NoTransmitter' is created when 'ClientTransmitter.transmitter' is private ?
    });
});
