import {LoggerFactory} from './logger';

export default class RemotingErrorHandler {

    constructor() {
        this.logger = LoggerFactory.getLogger('RemotingErrorHandler');
    }

    onError(error) {
        this.logger.error(error);
    }

}