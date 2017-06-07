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

/*jslint browserify: true */


import { exists } from './utils.js';

export default class Codec{

    static encodeCreatePresentationModelCommand(command) {
        return {
            'p': command.pmId,
            't': command.pmType,
            'a': command.attributes.map((attribute) => {
                let result = {
                    'n': attribute.propertyName,
                    'i': attribute.id
                };
                if (exists(attribute.value)) {
                    result.v = attribute.value;
                }
                return result;
            }),
            'id': 'CreatePresentationModel'
        };
    }

    static decodeCreatePresentationModelCommand(command) {
        return {
            'id': 'CreatePresentationModel',
            'className': "org.opendolphin.core.comm.CreatePresentationModelCommand",
            'clientSideOnly': false,
            'pmId': command.p,
            'pmType': command.t,
            'attributes': command.a.map((attribute) => {
                return {
                    'propertyName': attribute.n,
                    'id': attribute.i,
                    'value': exists(attribute.v)? attribute.v : null,
                    'qualifier': null
                };
            })
        };
    }

    static encodeValueChangedCommand(command) {
        let result = {
            'a': command.attributeId
        };
        if (exists(command.oldValue)) {
            result.o = command.oldValue;
        }
        if (exists(command.newValue)) {
            result.n = command.newValue;
        }
        result.id = 'ValueChanged';
        return result;
    }

    static decodeValueChangedCommand(command) {
        return {
            'id': 'ValueChanged',
            'className': "org.opendolphin.core.comm.ValueChangedCommand",
            'attributeId': command.a,
            'oldValue': exists(command.o)? command.o : null,
            'newValue': exists(command.n)? command.n : null
        };
    }

    static encode(commands) {
        let self = this;
        return JSON.stringify(commands.map((command) => {
            if (command.id === 'CreatePresentationModel') {
                return self.encodeCreatePresentationModelCommand(command);
            } else if (command.id === 'ValueChanged') {
                return self.encodeValueChangedCommand(command);
            }
            return command;
        }));
    }

    static decode(transmitted) {
        let self = this;
        if (typeof transmitted === 'string') {
            return JSON.parse(transmitted).map(function (command) {
                if (command.id === 'CreatePresentationModel') {
                    return self.decodeCreatePresentationModelCommand(command);
                } else if (command.id === 'ValueChanged') {
                    return self.decodeValueChangedCommand(command);
                }
                return command;
            });
        } else {
            return transmitted;
        }
    }
}
