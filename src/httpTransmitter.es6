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
import { DolphinRemotingError, DolphinSessionError, HttpResponseError } from './errors.es6';
import { encode, decode } from './codec.es6';


const FINISHED = 4;
const SUCCESS = 200;
const REQUEST_TIMEOUT = 408;

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

export default class HttpTransmitter {

    constructor(url, headersInfo) {
        this.url = url;
        this.headersInfo = headersInfo;
    }

    send(commands) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.withCredentials = true;
            http.onerror = (error) => reject(new DolphinRemotingError('HttpTransmitter: Network error', error));
            http.onreadystatechange = () => {
                if (http.readyState === FINISHED){
                    switch (http.status) {
                        case SUCCESS:
                        {
                            const currentClientId = http.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                            if (exists(currentClientId)) {
                                if (exists(this.clientId) && this.clientId !== currentClientId) {
                                    reject(new DolphinSessionError('HttpTransmitter: ClientId of the response did not match'));
                                }
                                this.clientId = currentClientId;
                            } else {
                                reject(new DolphinSessionError('HttpTransmitter: Server did not send a clientId'));
                            }
                            resolve(http.responseText);
                            break;
                        }

                        case REQUEST_TIMEOUT:
                            reject(new DolphinSessionError('HttpTransmitter: Session Timeout'));
                            break;

                        default:
                            reject(new HttpResponseError('HttpTransmitter: HTTP Status != 200 (' + http.status + ')'));
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
            http.send(encode(commands));
        });
    }

    transmit(commands, onDone) {
        this.send(commands)
            .then(responseText => {
                if (responseText.trim().length > 0) {
                    try {
                        const responseCommands = decode(responseText);
                        onDone(responseCommands);
                    } catch (err) {
                        this.emit('error', new HttpResponseError('HttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')'));
                        onDone([]);
                    }
                } else {
                    this.emit('error', new HttpResponseError('HttpTransmitter: Empty response'));
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

    static reset() {
        throw new Error('HttpTransmitter.reset() has been deprecated');
    }
}

Emitter(HttpTransmitter.prototype);
