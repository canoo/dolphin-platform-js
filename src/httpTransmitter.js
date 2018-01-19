import Codec from './commands/codec'
import {LoggerFactory} from './logger';

export default class HttpTransmitter {

    constructor(url, reset = true, charset = "UTF-8", errorHandler = null, supportCORS = false, headersInfo = null) {
        this.logger = LoggerFactory.getLogger('HttpTransmitter');

        this.url = url;
        this.charset = charset;
        this.HttpCodes = {
            finished: 4,
            success: 200
        };
        this.errorHandler = errorHandler;
        this.supportCORS = supportCORS;
        this.headersInfo = headersInfo;
        this.http = new XMLHttpRequest();
        this.sig = new XMLHttpRequest();
        if (this.supportCORS) {
            if ("withCredentials" in this.http) {
                this.http.withCredentials = true; // NOTE: doing this for non CORS requests has no impact
                this.sig.withCredentials = true;
            }
        }
        this.codec = new Codec();
        if (reset) {
            this.logger.warn('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
            this.invalidate();
        }
    }

    transmit(commands, onDone) {
        this.http.onerror = () => {
            this.handleError('onerror', "");
            onDone([]);
        };
        this.http.onreadystatechange = () => {
            if (this.http.readyState === this.HttpCodes.finished) {
                if (this.http.status === this.HttpCodes.success) {
                    let responseText = this.http.responseText;
                    if (responseText.trim().length > 0) {
                        try {
                            let responseCommands = this.codec.decode(responseText);
                            onDone(responseCommands);
                        }
                        catch (err) {
                            this.logger.error("Error occurred parsing responseText: ", err);
                            this.logger.error("Incorrect responseText: ", responseText);
                            this.handleError('application', "HttpTransmitter: Incorrect responseText: " + responseText);
                            onDone([]);
                        }
                    }
                    else {
                        this.handleError('application', "HttpTransmitter: empty responseText");
                        onDone([]);
                    }
                }
                else {
                    this.handleError('application', "HttpTransmitter: HTTP Status != 200");
                    onDone([]);
                }
            }
        };
        this.http.open('POST', this.url, true);
        this.setHeaders(this.http);
        if ("overrideMimeType" in this.http) {
            this.http.overrideMimeType("application/json; charset=" + this.charset); // todo make injectable
        }
        let encodedCommands = this.codec.encode([commands]);
        this.logger.trace('transmit', encodedCommands);
        this.http.send(encodedCommands);
    }

    setHeaders(httpReq) {
        if (this.headersInfo) {
            for (let i in this.headersInfo) {
                if (this.headersInfo.hasOwnProperty(i)) {
                    httpReq.setRequestHeader(i, this.headersInfo[i]);
                }
            }
        }
    }

    handleError(kind, message) {
        let errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
        if (this.errorHandler) {
            this.errorHandler(errorEvent);
        }
        else {
            this.logger.error("Error occurred: ", errorEvent);
        }
    }

    signal(command) {
        this.sig.open('POST', this.url, true);
        this.setHeaders(this.sig);
        let encodedCommand = this.codec.encode([command]);
        this.logger.trace('signal', encodedCommand);
        this.sig.send(encodedCommand);
    }

    invalidate() {
        this.http.open('POST', this.url + 'invalidate?', false);
        this.http.send();
    }
}