"use strict";
const ClientConnector_1 = require("./ClientConnector");
const ClientDolphin_1 = require("./ClientDolphin");
const ClientModelStore_1 = require("./ClientModelStore");
const HttpTransmitter_1 = require("./HttpTransmitter");
const NoTransmitter_1 = require("./NoTransmitter");
class DolphinBuilder {
    constructor() {
        this.reset_ = false;
        this.slackMS_ = 300;
        this.maxBatchSize_ = 50;
        this.supportCORS_ = false;
    }
    url(url) {
        this.url_ = url;
        return this;
    }
    reset(reset) {
        this.reset_ = reset;
        return this;
    }
    slackMS(slackMS) {
        this.slackMS_ = slackMS;
        return this;
    }
    maxBatchSize(maxBatchSize) {
        this.maxBatchSize_ = maxBatchSize;
        return this;
    }
    supportCORS(supportCORS) {
        this.supportCORS_ = supportCORS;
        return this;
    }
    errorHandler(errorHandler) {
        this.errorHandler_ = errorHandler;
        return this;
    }
    headersInfo(headersInfo) {
        this.headersInfo_ = headersInfo;
        return this;
    }
    build() {
        console.log("OpenDolphin js found");
        var clientDolphin = new ClientDolphin_1.default();
        var transmitter;
        if (this.url_ != null && this.url_.length > 0) {
            transmitter = new HttpTransmitter_1.default(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
        }
        else {
            transmitter = new NoTransmitter_1.default();
        }
        clientDolphin.setClientConnector(new ClientConnector_1.ClientConnector(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
        clientDolphin.setClientModelStore(new ClientModelStore_1.ClientModelStore(clientDolphin));
        console.log("ClientDolphin initialized");
        return clientDolphin;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DolphinBuilder;

//# sourceMappingURL=DolphinBuilder.js.map
