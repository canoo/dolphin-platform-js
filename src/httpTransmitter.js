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


import { OnSuccessHandler, Transmitter } from '../opendolphin/build/ClientConnector';
import { encode, decode } from './codec';
import { exists } from './utils';


const FINISHED = 4;
const SUCCESS = 200;
const REQUEST_TIMEOUT = 408;

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

export default class HttpTransmitter {

    constructor(url) {
        this.url = url;

        this.http = new XMLHttpRequest();
        this.http.withCredentials = true;
        this.http.onerror = () => this.emit('error', new Error('HttpTransmitter: Network error'));

        this.sig  = new XMLHttpRequest();
        this.sig.withCredentials = true;
        this.sig.onerror = () => this.emit('error', new Error('HttpTransmitter: Network error'));

        this.sig.onreadystatechange = () => {
            if (this.sig.readyState === FINISHED){
                switch (this.sig.status) {
                    case SUCCESS: {
                        const currentClientId = this.sig.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                        if (exists(currentClientId)) {
                            if (exists(this.clientId) && this.clientId !== currentClientId) {
                                this.emit('error', new Error('HttpTransmitter: ClientId of the response did not match'));
                            }
                            this.clientId = currentClientId;
                        } else {
                            this.emit('error', new Error('HttpTransmitter: Server did not send a clientId'));
                        }
                        break;
                    }
                    case REQUEST_TIMEOUT: {
                        this.emit('error', new Error('HttpTransmitter: REQUEST_TIMEOUT'));
                        break;
                    }
                    default: {
                        this.emit('error', new Error('HttpTransmitter: HTTP Status != 200 (' + this.sig.status + ')'));
                        break;
                    }
                }
            }
        };

    }

    transmit(commands, onDone) {

        this.http.onreadystatechange = () => {
            if (this.http.readyState === FINISHED){
                switch (this.http.status) {
                    case SUCCESS:
                    {
                        const currentClientId = this.http.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                        if (exists(currentClientId)) {
                            if (exists(this.clientId) && this.clientId !== currentClientId) {
                                this.emit('error', new Error('HttpTransmitter: ClientId of the response did not match'));
                                onDone([]);
                            }
                            this.clientId = currentClientId;
                        } else {
                            this.emit('error', new Error('HttpTransmitter: Server did not send a clientId'));
                        }
                        const responseText = this.http.responseText;
                        if (responseText.trim().length > 0) {
                            try {
                                const responseCommands = decode(responseText);
                                onDone(responseCommands);
                            } catch (err) {
                                this.emit('error', new Error('HttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')'));
                                onDone([]);
                            }
                        } else {
                            this.emit('error', new Error('HttpTransmitter: Empty response'));
                            onDone([]);
                        }
                        break;
                    }
                    case REQUEST_TIMEOUT:
                    {
                        this.emit('error', new Error('HttpTransmitter: REQUEST_TIMEOUT'));
                        break;
                    }
                    default:
                    {
                        this.emit('error', new Error('HttpTransmitter: HTTP Status != 200 (' + this.http.status + ')'));
                        break;
                    }
                }
            }
        };

        this.http.open('POST', this.url);
        if (exists(this.clientId)) {
            this.http.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, this.clientId);
        }
        if ('overrideMimeType' in this.http) {
            this.http.overrideMimeType('application/json; charset=UTF-8');
        }
        this.http.send(encode(commands));

    }

    signal(command) {
        this.sig.open('POST', this.url);
        if (exists(this.clientId)) {
            this.sig.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, this.clientId);
        }
        this.sig.send(encode([command]));
    }

    static invalidate() {
        throw new Error('HttpTransmitter.invalidate() has been deprecated');
    }

    static reset() {
        throw new Error('HttpTransmitter.reset() has been deprecated');
    }
}

Emitter(HttpTransmitter.prototype);
