import Emitter from 'emitter-component';


import { exists } from './utils';
import { DolphinRemotingError, HttpNetworkError, DolphinSessionError, HttpResponseError } from './errors';
import Codec from './commands/codec';
import RemotingErrorHandler from './remotingErrorHandler';
import { LoggerFactory, LogLevel } from './logging';
import {VALUE_CHANGED_COMMAND_ID} from './commands/commandConstants';

const FINISHED = 4;
const SUCCESS = 200;
const REQUEST_TIMEOUT = 408;

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

export default class PlatformHttpTransmitter {

    constructor(url, config) {
        this.url = url;
        this.config = config;
        this.headersInfo = exists(config) ? config.headersInfo : null;
        let connectionConfig = exists(config) ? config.connection : null;
        this.maxRetry = exists(connectionConfig) && exists(connectionConfig.maxRetry)?connectionConfig.maxRetry: 3;
        this.timeout = exists(connectionConfig) && exists(connectionConfig.timeout)?connectionConfig.timeout: 5000;
        this.failed_attempt = 0;
    }

    _handleError(reject, error) {
        let connectionConfig = exists(this.config) ? this.config.connection : null;
        let errorHandlers = exists(connectionConfig) && exists(connectionConfig.errorHandlers)?connectionConfig.errorHandlers: [new RemotingErrorHandler()];
        errorHandlers.forEach(function(handler) {
            handler.onError(error);
        });
        reject(error);
    }

    _send(commands) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.withCredentials = true;
            http.onerror = (errorContent) => {
                PlatformHttpTransmitter.LOGGER.error('HTTP network error', errorContent);
                this._handleError(reject, new HttpNetworkError('PlatformHttpTransmitter: Network error', errorContent));
            };

            http.onreadystatechange = () => {
                if (http.readyState === FINISHED){
                    switch (http.status) {

                        case SUCCESS:
                        {
                            this.failed_attempt = 0;
                            const currentClientId = http.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                            if (exists(currentClientId)) {
                                if (exists(this.clientId) && this.clientId !== currentClientId) {
                                    this._handleError(reject, new DolphinSessionError('PlatformHttpTransmitter: ClientId of the response did not match'));
                                }
                                this.clientId = currentClientId;
                            } else {
                                this._handleError(reject, new DolphinSessionError('PlatformHttpTransmitter: Server did not send a clientId'));
                            }

                            if (PlatformHttpTransmitter.LOGGER.isLogLevelUseable(LogLevel.DEBUG) && !PlatformHttpTransmitter.LOGGER.isLogLevelUseable(LogLevel.TRACE)) {
                                try {
                                    let json = JSON.parse(http.responseText);
                                    if (json.length > 0) {
                                        PlatformHttpTransmitter.LOGGER.debug('HTTP response with SUCCESS', currentClientId, json);
                                    }
                                } catch (error) {
                                    PlatformHttpTransmitter.LOGGER.error('Response could not be parsed to JSON for logging');
                                }
                            }

                            PlatformHttpTransmitter.LOGGER.trace('HTTP response with SUCCESS', currentClientId, http.responseText);
                            resolve(http.responseText);
                            break;
                        }

                        case REQUEST_TIMEOUT:
                            PlatformHttpTransmitter.LOGGER.error('HTTP request timeout');
                            this._handleError(reject, new DolphinSessionError('PlatformHttpTransmitter: Session Timeout'));
                            break;

                        default:
                            if(this.failed_attempt <= this.maxRetry){
                                this.failed_attempt = this.failed_attempt + 1;
                            }
                            PlatformHttpTransmitter.LOGGER.error('HTTP unsupported status, with HTTP status', http.status);
                            this._handleError(reject, new HttpResponseError('PlatformHttpTransmitter: HTTP Status != 200 (' + http.status + ')'));
                            break;
                    }
                }
            };

            http.open('POST', this.url);
            if (exists(this.clientId)) {
                http.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, this.clientId);
            }

            if (exists(this.headersInfo)) {
                for (let i in this.headersInfo) {
                    if (this.headersInfo.hasOwnProperty(i)) {
                        http.setRequestHeader(i, this.headersInfo[i]);
                    }
                }
            }

            let encodedCommands = Codec.encode(commands);

            if (PlatformHttpTransmitter.LOGGER.isLogLevelUseable(LogLevel.DEBUG) && !PlatformHttpTransmitter.LOGGER.isLogLevelUseable(LogLevel.TRACE)) {
                for (let i = 0; i < commands.length; i++) {
                    let command = commands[i];
                    if (command.id === VALUE_CHANGED_COMMAND_ID) {
                        PlatformHttpTransmitter.LOGGER.debug('send', command, encodedCommands);
                    }
                }
            }

            PlatformHttpTransmitter.LOGGER.trace('send', commands, encodedCommands);
            if (this.failed_attempt > this.maxRetry) {
                setTimeout(function() {
                    http.send(encodedCommands);
                }, this.timeout);
            }else{
                http.send(encodedCommands);
            }

        });
    }

    transmit(commands, onDone) {
        this._send(commands)
            .then(responseText => {
                if (responseText.trim().length > 0) {
                    try {
                        const responseCommands = Codec.decode(responseText);
                        onDone(responseCommands);
                    } catch (err) {
                        this.emit('error', new DolphinRemotingError('PlatformHttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')'));
                        onDone([]);
                    }
                } else {
                    this.emit('error', new DolphinRemotingError('PlatformHttpTransmitter: Empty response'));
                    onDone([]);
                }
            })
            .catch(error => {
                this.emit('error', error);
                onDone([]);
            });
    }

    signal(command) {
        this._send([command])
            .catch(error => this.emit('error', error));
    }
}

PlatformHttpTransmitter.LOGGER = LoggerFactory.getLogger('PlatformHttpTransmitter');

Emitter(PlatformHttpTransmitter.prototype);
