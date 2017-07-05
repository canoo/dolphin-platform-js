import { exists } from './utils.js';
import {CREATE_PRESENTATION_MODEL_COMMAND_ID, VALUE_CHANGED_COMMAND_ID} from './commands/commandConstants';

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
            'id': CREATE_PRESENTATION_MODEL_COMMAND_ID
        };
    }

    static decodeCreatePresentationModelCommand(jsonCommand) {
        return {
            'id': CREATE_PRESENTATION_MODEL_COMMAND_ID,
            'pmId': jsonCommand.p,
            'pmType': jsonCommand.t,
            'attributes': jsonCommand.a.map((attribute) => {
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
            if (command.id === CREATE_PRESENTATION_MODEL_COMMAND_ID) {
                return self.encodeCreatePresentationModelCommand(command);
            } else if (command.id === VALUE_CHANGED_COMMAND_ID) {
                return self.encodeValueChangedCommand(command);
            }
            return command;
        }));
    }

    static decode(transmitted) {
        let self = this;
        if (typeof transmitted === 'string') {
            return JSON.parse(transmitted).map(function (command) {
                if (command.id === CREATE_PRESENTATION_MODEL_COMMAND_ID) {
                    return self.decodeCreatePresentationModelCommand(command);
                } else if (command.id === VALUE_CHANGED_COMMAND_ID) {
                    return self.decodeValueChangedCommand(command);
                }
                return command;
            });
        } else {
            return transmitted;
        }
    }
}
