import {BlindCommandBatcher} from './CommandBatcher';
import Codec from './commands/codec';
import ClientPresentationModel from './ClientPresentationModel'

export default class ClientConnector {

    constructor(transmitter, clientDolphin, slackMS = 0, maxBatchSize = 50) {
        this.commandQueue = [];
        this.currentlySending = false;
        this.pushEnabled = false;
        this.waiting = false;
        this.transmitter = transmitter;
        this.clientDolphin = clientDolphin;
        this.slackMS = slackMS;
        this.codec = new Codec();
        this.commandBatcher = new BlindCommandBatcher(true, maxBatchSize);
    }

    setCommandBatcher(newBatcher) {
        this.commandBatcher = newBatcher;
    }

    setPushEnabled(enabled) {
        this.pushEnabled = enabled;
    }

    setPushListener(newListener) {
        this.pushListener = newListener;
    }

    setReleaseCommand(newCommand) {
        this.releaseCommand = newCommand;
    }

    send(command, onFinished) {
        this.commandQueue.push({ command: command, handler: onFinished });
        if (this.currentlySending) {
            this.release(); // there is not point in releasing if we do not send atm
            return;
        }
        this.doSendNext();
    }

    doSendNext() {
        if (this.commandQueue.length < 1) {
            if (this.pushEnabled) {
                this.enqueuePushCommand();
            }
            else {
                this.currentlySending = false;
                return;
            }
        }
        this.currentlySending = true;
        var cmdsAndHandlers = this.commandBatcher.batch(this.commandQueue);
        var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
        var commands = cmdsAndHandlers.map(cah => { return cah.command; });
        this.transmitter.transmit(commands, (response) => {
            //console.log("server response: [" + response.map(it => it.id).join(", ") + "] ");
            var touchedPMs = [];
            response.forEach((command) => {
                var touched = this.handle(command);
                if (touched)
                    touchedPMs.push(touched);
            });
            if (callback) {
                callback.onFinished(touchedPMs); // todo: make them unique?
            }
            // recursive call: fetch the next in line but allow a bit of slack such that
            // document events can fire, rendering is done and commands can batch up
            setTimeout(() => this.doSendNext(), this.slackMS);
        });
    }

    handle(command) {
        if (command.id == "DeletePresentationModel") {
            return this.handleDeletePresentationModelCommand(command);
        }
        else if (command.id == "CreatePresentationModel") {
            return this.handleCreatePresentationModelCommand(command);
        }
        else if (command.id == "ValueChanged") {
            return this.handleValueChangedCommand(command);
        }
        else if (command.id == "AttributeMetadataChanged") {
            return this.handleAttributeMetadataChangedCommand(command);
        }
        else {
            console.log("Cannot handle, unknown command " + command);
        }
        return null;
    }

    handleDeletePresentationModelCommand(serverCommand) {
        var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
        if (!model)
            return null;
        this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
        return model;
    }

    handleCreatePresentationModelCommand(serverCommand) {
        if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
            throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
        }
        var attributes = [];
        serverCommand.attributes.forEach((attr) => {
            var clientAttribute = this.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value);
            if (attr.id && attr.id.match(".*S$")) {
                clientAttribute.id = attr.id;
            }
            attributes.push(clientAttribute);
        });
        var clientPm = new ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
        clientPm.addAttributes(attributes);
        if (serverCommand.clientSideOnly) {
            clientPm.clientSideOnly = true;
        }
        this.clientDolphin.getClientModelStore().add(clientPm);
        this.clientDolphin.updatePresentationModelQualifier(clientPm);
        return clientPm;
    }

    handleValueChangedCommand(serverCommand) {
        var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
        if (!clientAttribute) {
            console.log("attribute with id " + serverCommand.attributeId + " not found, cannot update to new value " + serverCommand.newValue);
            return null;
        }
        if (clientAttribute.getValue() == serverCommand.newValue) {
            //console.log("nothing to do. new value == old value");
            return null;
        }
        clientAttribute.setValue(serverCommand.newValue);
        return null;
    }

    handleAttributeMetadataChangedCommand(serverCommand) {
        var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
        if (!clientAttribute)
            return null;
        clientAttribute[serverCommand.metadataName] = serverCommand.value;
        return null;
    }

    listen() {
        if (!this.pushEnabled)
            return;
        if (this.waiting)
            return;
        // todo: how to issue a warning if no pushListener is set?
        if (!this.currentlySending) {
            this.doSendNext();
        }
    }

    enqueuePushCommand() {
        var me = this;
        this.waiting = true;
        this.commandQueue.push({
            command: this.pushListener,
            handler: {
                onFinished: function () { me.waiting = false; },
                onFinishedData: null
            }
        });
    }

    release() {
        if (!this.waiting)
            return;
        this.waiting = false;
        // todo: how to issue a warning if no releaseCommand is set?
        this.transmitter.signal(this.releaseCommand);
    }
}