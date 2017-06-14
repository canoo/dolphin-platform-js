/* Copyright 2016 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Emitter from 'emitter-component';


import { exists } from './utils';
import { DolphinRemotingError, HttpNetworkError, DolphinSessionError, HttpResponseError } from './errors.js';
import Codec from './codec.js';
import RemotingErrorHandler from './remotingErrorHandler';


const FINISHED = 4;
const SUCCESS = 200;
const REQUEST_TIMEOUT = 408;

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

export default class HttpTransmitter {

    constructor(url, config) {
        this.url = url;
        this.headersInfo = exists(config) ? config.headersInfo : null;
        let connectionConfig = exists(config) ? config.connection : null;
        this.maxRetry = exists(connectionConfig) && exists(connectionConfig.maxRetry)?connectionConfig.maxRetry: 3;
        this.timeout = exists(connectionConfig) && exists(connectionConfig.timeout)?connectionConfig.timeout: 5000;
        this.failed_attempt = 0;
        this.errorHandler = exists(connectionConfig) && exists(connectionConfig.errorHandler)?connectionConfig.errorHandler: new RemotingErrorHandler();
    }

    _handleError(reject, error) {
        this.errorHandler.onError(error);
        reject(error);
    }

    send(commands) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.withCredentials = true;
            http.onerror = (errorContent) => {
                this._handleError(reject, new HttpNetworkError('HttpTransmitter: Network error', errorContent));
            }

            http.onreadystatechange = () => {
                if (http.readyState === FINISHED){
                    switch (http.status) {

                        case SUCCESS:
                        {
                            this.failed_attempt = 0;
                            const currentClientId = http.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                            if (exists(currentClientId)) {
                                if (exists(this.clientId) && this.clientId !== currentClientId) {
                                    this._handleError(reject, new DolphinSessionError('HttpTransmitter: ClientId of the response did not match'));
                                }
                                this.clientId = currentClientId;
                            } else {
                                this._handleError(reject, new DolphinSessionError('HttpTransmitter: Server did not send a clientId'));
                            }
                            resolve(http.responseText);
                            break;
                        }

                        case REQUEST_TIMEOUT:
                            this._handleError(reject, new DolphinSessionError('HttpTransmitter: Session Timeout'));
                            break;

                        default:
                            if(this.failed_attempt <= this.maxRetry){
                                this.failed_attempt = this.failed_attempt + 1;
                            }
                            this._handleError(reject, new HttpResponseError('HttpTransmitter: HTTP Status != 200 (' + http.status + ')'));
                            break;
                    }
                }
            };

            http.open('POST', this.url);
            if (exists(this.clientId)) {
                http.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, this.clientId);
            }

            if (exists(this.headersInfo)) {
                for (var i in this.headersInfo) {
                    if (this.headersInfo.hasOwnProperty(i)) {
                        http.setRequestHeader(i, this.headersInfo[i]);
                    }
                }
            }
            if (this.failed_attempt > this.maxRetry) {
                setTimeout(function() {
                    http.send(Codec.encode(commands));
                }, this.timeout);
            }else{
                http.send(Codec.encode(commands));
            }

        });
    }

    transmit(commands, onDone) {
        this.send(commands)
            .then(responseText => {
                if (responseText.trim().length > 0) {
                    try {
                        const responseCommands = Codec.decode(responseText);
                        onDone(responseCommands);
                    } catch (err) {
                        this.emit('error', new DolphinRemotingError('HttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')'));
                        onDone([]);
                    }
                } else {
                    this.emit('error', new DolphinRemotingError('HttpTransmitter: Empty response'));
                    onDone([]);
                }
            })
            .catch(error => {
                this.emit('error', error);
                onDone([]);
            });
    }

    signal(command) {
        this.send([command])
            .catch(error => this.emit('error', error));
    }
}

Emitter(HttpTransmitter.prototype);
