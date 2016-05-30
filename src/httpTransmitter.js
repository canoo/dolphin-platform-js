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


const FINISHED = 4;
const SUCCESS = 200;

export default class HttpTransmitter {

    constructor(url) {
        this.url = url;

        this.http = new XMLHttpRequest();
        this.http.withCredentials = true;

        this.sig  = new XMLHttpRequest();
        this.sig.withCredentials = true;
    }

    transmit(commands, onDone) {

        this.http.onerror = () => this.emit('error', new Error('HttpTransmitter: Network error'));

        this.http.onreadystatechange = () => {
            if (this.http.readyState === FINISHED){
                if(this.http.status === SUCCESS) {
                    // TODO: Extract clientId
                    // TODO: Check sessionId
                    const responseText = this.http.responseText;
                    if (responseText.trim().length > 0) {
                        try {
                            const responseCommands = decode(responseText);
                            onDone(responseCommands);
                        } catch (err) {
                            this.emit('error', 'HttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')');
                            onDone([]);
                        }
                    } else {
                        this.emit('error', 'HttpTransmitter: Empty response');
                        onDone([]);
                    }
                } else {
                    this.emit('error', 'HttpTransmitter: HTTP Status != 200 (' + this.http.status + ')');
                    onDone([]);
                }
            }
        };

        this.http.open('POST', this.url);
        // TODO: Set clientId
        if ('overrideMimeType' in this.http) {
            this.http.overrideMimeType('application/json; charset=UTF-8');
        }
        this.http.send(encode(commands));

    }

    signal(command) {
        this.sig.open('POST', this.url);
        // TODO: Set clientId
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
