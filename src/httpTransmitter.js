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

import { OnSuccessHandler, Transmitter } from '../opendolphin/build/ClientConnector';
import { Codec } from './codec';
import Command from '../opendolphin/build/Command';
import SignalCommand from '../opendolphin/build/SignalCommand';


const FINISHED = 4;
const SUCCESS = 200;

export default class HttpTransmitter {

    constructor(url, errorHandler = null) {
        this.url = url;
        this.charset = 'UTF-8';
        this.errorHandler = errorHandler;
        this.http = new XMLHttpRequest();
        this.sig  = new XMLHttpRequest();
        if ('withCredentials' in this.http) { // browser supports CORS
            this.http.withCredentials = true; // NOTE: doing this for non CORS requests has no impact
            this.sig.withCredentials = true;
        }
        // NOTE: Browser might support CORS partially so we simply try to use 'this.http' for CORS requests instead of forbidding it
        // NOTE: XDomainRequest for IE 8, IE 9 not supported by dolphin because XDomainRequest does not support cookies in CORS requests (which are needed for the JSESSIONID cookie)

        this.codec = Codec;
    }

    transmit(commands, onDone) {

        this.http.onerror = () => {
            this.handleError('onerror', '');
            onDone([]);
        };

        this.http.onreadystatechange = () => {
            if (this.http.readyState === FINISHED){
                if(this.http.status === SUCCESS) {
                    const responseText = this.http.responseText;
                    if (responseText.trim().length > 0) {
                        try {
                            const responseCommands = this.codec.decode(responseText);
                            onDone(responseCommands);
                        } catch (err) {
                            console.log('Error occurred parsing responseText: ', err);
                            console.log('Incorrect responseText: ', responseText);
                            this.handleError('application', 'HttpTransmitter: Incorrect responseText: ' + responseText);
                            onDone([]);
                        }
                    }
                    else {
                        this.handleError('application', 'HttpTransmitter: empty responseText');
                        onDone([]);
                    }
                }
                else {
                    this.handleError('application', 'HttpTransmitter: HTTP Status != 200');
                    onDone([]);
                }
            }
        };

        this.http.open('POST', this.url, true);
        if ('overrideMimeType' in this.http) {
            this.http.overrideMimeType('application/json; charset=' + this.charset ); // todo make injectable
        }
        this.http.send(this.codec.encode(commands));

    }

    handleError(kind, message) {
        const errorEvent = {
            kind,
            url: this.url,
            httpStatus: this.http.status,
            message
        };
        if (this.errorHandler) {
            this.errorHandler(errorEvent);
        } else {
            console.log('Error occurred: ', errorEvent);
        }
    }

    signal(command) {
        this.sig.open('POST', this.url, true);
        this.sig.send(this.codec.encode([command]));
    }

    // Deprecated ! Use 'reset(OnSuccessHandler) instead
    static invalidate() {
        throw new Error('HttpTransmitter.invalidate() has been deprecated');
    }

    static reset() {
        throw new Error('HttpTransmitter.reset() has been deprecated');
    }

}
