import {exists, checkMethod, checkParam} from './utils.js';
import {CREATE_PRESENTATION_MODEL_COMMAND_ID, VALUE_CHANGED_COMMAND_ID, ATTRIBUTE_METADATA_CHANGED_COMMAND_ID, CALL_ACTION_COMMAND_ID} from './commands/commandConstants';
import {ID, PM_ID, PM_TYPE, PM_ATTRIBUTES, NAME, ATTRIBUTE_ID, VALUE, CONTROLLER_ID} from './commands/commandConstants';
import {CreatePresentationModelCommand} from './commands/createPresentationModelCommand';
import {ValueChangedCommand} from './commands/valueChangedCommand';
import {AttributeMetadataChangedCommand} from './commands/attributeMetadataChangedCommand';
import {CallActionCommand} from './commands/callActionCommand';


export default class Codec {

    static encodeAttributeMetadataChangedCommand(command) {
        checkMethod("Codec.encodeAttributeMetadataChangedCommand");
        checkParam(command, "command");
        checkParam(command.attributeId, "command.attributeId");
        checkParam(command.metadataName, "command.metadataName");

        let jsonCommand = {};
        jsonCommand[ID] = ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;
        jsonCommand[ATTRIBUTE_ID] = command.attributeId;
        jsonCommand[NAME] = command.metadataName;
        jsonCommand[VALUE] = command.value;
        return jsonCommand;
    }

    static encodeCallActionCommand(command) {
        checkMethod("Codec.encodeCallActionCommand");
        checkParam(command, "command");
        checkParam(command.controllerid, "command.controllerid");
        checkParam(command.actionName, "command.actionName");

        let jsonCommand = {};
        jsonCommand[ID] = CALL_ACTION_COMMAND_ID;
        jsonCommand[CONTROLLER_ID] = command.controllerid;
        jsonCommand[NAME] = command.actionName;
        return jsonCommand;
    }

    static encodeCreatePresentationModelCommand(command) {
        checkMethod("Codec.encodeCreatePresentationModelCommand");
        checkParam(command, "command");
        checkParam(command.pmId, "command.pmId");
        checkParam(command.pmType, "command.pmType");

        let jsonCommand = {};
        jsonCommand[ID] = CREATE_PRESENTATION_MODEL_COMMAND_ID;
        jsonCommand[PM_ID] = command.pmId;
        jsonCommand[PM_TYPE] = command.pmType;
        jsonCommand[PM_ATTRIBUTES] = command.attributes.map((attribute) => {
            let result = {};
            result[NAME] = attribute.propertyName;
            result[ATTRIBUTE_ID] = attribute.id;
            if (exists(attribute.value)) {
                result[VALUE] = attribute.value;
            }
            return result;
        });
        return jsonCommand;
    }

    static encodeValueChangedCommand(command) {
        checkMethod("Codec.encodeValueChangedCommand");
        checkParam(command, "command");
        checkParam(command.attributeId, "command.attributeId");

        let jsonCommand = {};
        jsonCommand[ID] = VALUE_CHANGED_COMMAND_ID;
        jsonCommand[ATTRIBUTE_ID] = command.attributeId;
        if (exists(command.newValue)) {
            jsonCommand[VALUE] = command.newValue;
        }
        return jsonCommand;
    }

    static decodeAttributeMetadataChangedCommand(jsonCommand) {
        checkMethod("Codec.decodeAttributeMetadataChangedCommand");
        checkParam(jsonCommand[ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");
        checkParam(jsonCommand[NAME], "jsonCommand[NAME]");

        let command = new AttributeMetadataChangedCommand();
        command.attributeId = jsonCommand[ATTRIBUTE_ID];
        command.metadataName = jsonCommand[NAME];
        command.value = jsonCommand[VALUE];
        return command;
    }

    static decodeCallActionCommand(jsonCommand) {
        checkMethod("Codec.decodeCallActionCommand");
        checkParam(jsonCommand[CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");
        checkParam(jsonCommand[NAME], "jsonCommand[NAME]");

        let command = new CallActionCommand();
        command.controllerid = jsonCommand[CONTROLLER_ID];
        command.actionName = jsonCommand[NAME];
        return command;
    }

    static decodeCreatePresentationModelCommand(jsonCommand) {
        checkMethod("Codec.decodeCreatePresentationModelCommand");
        checkParam(jsonCommand[PM_ID], "jsonCommand[PM_ID]");
        checkParam(jsonCommand[PM_TYPE], "jsonCommand[PM_TYPE]");

        let command = new CreatePresentationModelCommand();
        command.pmId = jsonCommand[PM_ID];
        command.pmType = jsonCommand[PM_TYPE];

        //TODO: Für die Attribute sollten wir eine Klasse bereitstellen
        command.attributes = jsonCommand[PM_ATTRIBUTES].map((attribute) => {
            return {
                'propertyName': attribute[NAME],
                'id': attribute[ATTRIBUTE_ID],
                'value': exists(attribute[VALUE]) ? attribute[VALUE] : null
            };
        });
        return command;
    }

    static decodeValueChangedCommand(jsonCommand) {
        checkMethod("Codec.decodeValueChangedCommand");
        checkParam(jsonCommand[ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");

        let command = new ValueChangedCommand();
        command.attributeId = jsonCommand[ATTRIBUTE_ID];
        if (exists(jsonCommand[VALUE])) {
            command.newValue = jsonCommand[VALUE];
        }
        return command;
    }

    static encode(commands) {
        checkMethod("Codec.encode");
        checkParam(commands, "commands");
        
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
