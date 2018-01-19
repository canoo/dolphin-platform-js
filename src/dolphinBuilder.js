import ClientConnector from './clientConnector'
import ClientDolphin from './clientDolphin'
import ClientModelStore from './clientModelStore'
import HttpTransmitter from './httpTransmitter'
import NoTransmitter from './noTransmitter'
import { LoggerFactory } from './logging';


export default class DolphinBuilder {

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
        let clientDolphin = new ClientDolphin();
        let transmitter;
        if (this.url_ != null && this.url_.length > 0) {
            transmitter = new HttpTransmitter(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
        }
        else {
            transmitter = new NoTransmitter();
        }
        clientDolphin.setClientConnector(new ClientConnector(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
        clientDolphin.setClientModelStore(new ClientModelStore(clientDolphin));
        DolphinBuilder.LOGGER.debug("ClientDolphin initialized");
        DolphinBuilder.LOGGER.debug("clientDolphin", clientDolphin);
        return clientDolphin;
    }
}

DolphinBuilder.LOGGER = LoggerFactory.getLogger('DolphinBuilder');