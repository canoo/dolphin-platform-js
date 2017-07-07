import {exists, checkMethod, checkParam} from './utils.js';
import {CREATE_PRESENTATION_MODEL_COMMAND_ID, VALUE_CHANGED_COMMAND_ID, ATTRIBUTE_METADATA_CHANGED_COMMAND_ID, CALL_ACTION_COMMAND_ID, CHANGE_ATTRIBUTE_METADATA_COMMAND_ID, CREATE_CONTEXT_COMMAND_ID, CREATE_CONTROLLER_COMMAND_ID, DELETE_PRESENTATION_MODEL_COMMAND_ID} from './commands/commandConstants';
import {ID, PM_ID, PM_TYPE, PM_ATTRIBUTES, NAME, ATTRIBUTE_ID, VALUE, CONTROLLER_ID, PARAMS} from './commands/commandConstants';
import {ValueChangedCommand} from './commands/valueChangedCommand';
import {AttributeMetadataChangedCommand} from './commands/attributeMetadataChangedCommand';
import {CallActionCommand} from './commands/callActionCommand';
import {ChangeAttributeMetadataCommand} from './commands/changeAttributeMetadataCommand';
import {CreateContextCommand} from './commands/createContextCommand';
import {CreateControllerCommand} from './commands/createControllerCommand';
import {CreatePresentationModelCommand} from './commands/createPresentationModelCommand';
import {DeletePresentationModelCommand} from './commands/deletePresentationModelCommand';



export default class Codec {

    static _encodeAttributeMetadataChangedCommand(command) {
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

    static _decodeAttributeMetadataChangedCommand(jsonCommand) {
        checkMethod("Codec.decodeAttributeMetadataChangedCommand");
        checkParam(jsonCommand, "jsonCommand");
        checkParam(jsonCommand[ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");
        checkParam(jsonCommand[NAME], "jsonCommand[NAME]");

        let command = new AttributeMetadataChangedCommand();
        command.attributeId = jsonCommand[ATTRIBUTE_ID];
        command.metadataName = jsonCommand[NAME];
        command.value = jsonCommand[VALUE];
        return command;
    }

    static _encodeCallActionCommand(command) {
        checkMethod("Codec.encodeCallActionCommand");
        checkParam(command, "command");
        checkParam(command.controllerid, "command.controllerid");
        checkParam(command.actionName, "command.actionName");
        checkParam(command.params, "command.params");


        let jsonCommand = {};
        jsonCommand[ID] = CALL_ACTION_COMMAND_ID;
        jsonCommand[CONTROLLER_ID] = command.controllerid;
        jsonCommand[NAME] = command.actionName;
        jsonCommand[PARAMS] = command.params.map((param) => {
            let result = {};
            result[NAME] = param.name;
            if (exists(param.value)) {
                result[VALUE] = param.value;
            }
            return result;
        });
        return jsonCommand;
    }

    static _decodeCallActionCommand(jsonCommand) {
        checkMethod("Codec.decodeCallActionCommand");
        checkParam(jsonCommand, "jsonCommand");
        checkParam(jsonCommand[CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");
        checkParam(jsonCommand[NAME], "jsonCommand[NAME]");
        checkParam(jsonCommand[PARAMS], "jsonCommand[PARAMS]");

        let command = new CallActionCommand();
        command.controllerid = jsonCommand[CONTROLLER_ID];
        command.actionName = jsonCommand[NAME];
        //TODO: Für die Params sollten wir eine Klasse bereitstellen
        command.params = jsonCommand[PARAMS].map((param) => {
            return {
                'name': param[NAME],
                'value': exists(param[VALUE]) ? param[VALUE] : null
            };
        });
        return command;
    }

    static _encodeChangeAttributeMetadataCommand(command) {
        checkMethod("Codec.encodeChangeAttributeMetadataCommand");
        checkParam(command, "command");
        checkParam(command.attributeId, "command.attributeId");
        checkParam(command.metadataName, "command.metadataName");

        let jsonCommand = {};
        jsonCommand[ID] = CHANGE_ATTRIBUTE_METADATA_COMMAND_ID;
        jsonCommand[ATTRIBUTE_ID] = command.attributeId;
        jsonCommand[NAME] = command.metadataName;
        jsonCommand[VALUE] = command.value;
        return jsonCommand;
    }

    static _decodeChangeAttributeMetadataCommand(jsonCommand) {
        checkMethod("Codec.decodeChangeAttributeMetadataCommand");
        checkParam(jsonCommand, "jsonCommand");
        checkParam(jsonCommand[ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");
        checkParam(jsonCommand[NAME], "jsonCommand[NAME]");

        let command = new ChangeAttributeMetadataCommand();
        command.attributeId = jsonCommand[ATTRIBUTE_ID];
        command.metadataName = jsonCommand[NAME];
        command.value = jsonCommand[VALUE];
        return command;
    }

    static _encodeCreateContextCommand(command) {
        checkMethod("Codec.encodeCreateContextCommand");
        checkParam(command, "command");

        let jsonCommand = {};
        jsonCommand[ID] = CREATE_CONTEXT_COMMAND_ID;
        return jsonCommand;
    }

    static _decodeCreateContextCommand(jsonCommand) {
        checkMethod("Codec.decodeCreateContextCommand");
        checkParam(jsonCommand, "jsonCommand");

        let command = new CreateContextCommand();
        return command;
    }

    static _encodeCreateControllerCommand(command) {
        checkMethod("Codec._encodeCreateControllerCommand");
        checkParam(command, "command");
        checkParam(command.controllerName, "command.controllerName");

        let jsonCommand = {};
        jsonCommand[ID] = CREATE_CONTROLLER_COMMAND_ID;
        jsonCommand[NAME] = command.controllerName;
        jsonCommand[CONTROLLER_ID] = command.parentControllerId;
        return jsonCommand;
    }

    static _decodeCreateControllerCommand(jsonCommand) {
        checkMethod("Codec._decodeCreateControllerCommand");
        checkParam(jsonCommand, "jsonCommand");
        checkParam(jsonCommand[NAME], "jsonCommand[NAME]");
        checkParam(jsonCommand[CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");

        let command = new CreateControllerCommand();
        command.controllerName = jsonCommand[NAME];
        command.parentControllerId = jsonCommand[CONTROLLER_ID];
        return command;
    }

    static _encodeCreatePresentationModelCommand(command) {
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

    static _decodeCreatePresentationModelCommand(jsonCommand) {
        checkMethod("Codec.decodeCreatePresentationModelCommand");
        checkParam(jsonCommand, "jsonCommand");
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

    static _encodeDeletePresentationModelCommand(command) {
        checkMethod("Codec._encodeDeletePresentationModelCommand");
        checkParam(command, "command");
        checkParam(command.pmId, "command.pmId");

        let jsonCommand = {};
        jsonCommand[ID] = DELETE_PRESENTATION_MODEL_COMMAND_ID;
        jsonCommand[PM_ID] = command.pmId;
        return jsonCommand;
    }

    static _decodeDeletePresentationModelCommand(jsonCommand) {
        checkMethod("Codec._decodeDeletePresentationModelCommand");
        checkParam(jsonCommand, "jsonCommand");
        checkParam(jsonCommand[PM_ID], "jsonCommand[PM_ID]");


        let command = new DeletePresentationModelCommand();
        command.pmId = jsonCommand[PM_ID];
        return command;
    }

    static _encodeValueChangedCommand(command) {
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

    static _decodeValueChangedCommand(jsonCommand) {
        checkMethod("Codec.decodeValueChangedCommand");
        checkParam(jsonCommand, "jsonCommand");
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
                return self._encodeCreatePresentationModelCommand(command);
            } else if (command.id === VALUE_CHANGED_COMMAND_ID) {
                return self._encodeValueChangedCommand(command);
            }
            return command;
        }));
    }

    static decode(transmitted) {
        let self = this;
        if (typeof transmitted === 'string') {
            return JSON.parse(transmitted).map(function (command) {
                if (command.id === CREATE_PRESENTATION_MODEL_COMMAND_ID) {
                    return self._decodeCreatePresentationModelCommand(command);
                } else if (command.id === VALUE_CHANGED_COMMAND_ID) {
                    return self._decodeValueChangedCommand(command);
                }
                return command;
            });
        } else {
            return transmitted;
        }
    }
}
