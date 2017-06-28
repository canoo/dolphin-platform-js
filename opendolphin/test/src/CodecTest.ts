/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import AttributeCreatedNotification from "../../js/dolphin/AttributeCreatedNotification";
import AttributeMetadataChangedCommand from "../../js/dolphin/AttributeMetadataChangedCommand";
import CallNamedActionCommand from "../../js/dolphin/CallNamedActionCommand";
import ChangeAttributeMetadataCommand from "../../js/dolphin/ChangeAttributeMetadataCommand";
import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import Codec from "../../js/dolphin/Codec";
import CreatePresentationModelCommand from "../../js/dolphin/CreatePresentationModelCommand";
import GetPresentationModelCommand from "../../js/dolphin/GetPresentationModelCommand";
import DeleteAllPresentationModelsOfTypeCommand from "../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand";
import DeletedPresentationModelNotification from "../../js/dolphin/DeletedPresentationModelNotification";
import DeletePresentationModelCommand from "../../js/dolphin/DeletePresentationModelCommand";
import EmptyNotification from "../../js/dolphin/EmptyNotification";
import InitializeAttributeCommand from "../../js/dolphin/InitializeAttributeCommand";
import SignalCommand from "../../js/dolphin/SignalCommand";
import ValueChangedCommand from "../../js/dolphin/ValueChangedCommand";

import { expect } from 'chai';


describe('Codec Test', () => {

    it('test codec create PresentationModel', () => {

        var pm = new ClientPresentationModel("MyId", "MyType");
        var clientAttribute1 = new ClientAttribute("prop1", "qual1", 0);
        var clientAttribute2 = new ClientAttribute("prop2", "qual2", 0);
        pm.addAttribute(clientAttribute1);
        pm.addAttribute(clientAttribute2);
        var createPMCommand = new CreatePresentationModelCommand(pm);

        var codec = new Codec();

        var coded = codec.encode(createPMCommand);
        var decoded = codec.decode(coded);

        expect(createPMCommand.toString() === decoded.toString()).to.be.true;
    });

    it('test empty', () => {
        expect(CodecTestHelper.testSoManyCommandsEncoding(0)).to.be.true;
    });

    it('test one', () => {
        expect(CodecTestHelper.testSoManyCommandsEncoding(1)).to.be.true;
    });

    it('test many', () => {
        expect(CodecTestHelper.testSoManyCommandsEncoding(10)).to.be.true;
    });

    it('test coding commands', () => {

        expect(CodecTestHelper.testCodingCommand(new AttributeCreatedNotification("pmId", "5", "prop", "äöüéàè", "qualifier"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new AttributeMetadataChangedCommand("5", "name", "value"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new CallNamedActionCommand("some-action"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new CreatePresentationModelCommand(new ClientPresentationModel("MyId", "MyType")))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new ChangeAttributeMetadataCommand("5", "name", "value"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new GetPresentationModelCommand("pmId"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new DeleteAllPresentationModelsOfTypeCommand("type"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new DeletedPresentationModelNotification("pmId"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new DeletePresentationModelCommand("pmId"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new EmptyNotification())).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new InitializeAttributeCommand("pmId", "prop", "qualifier", "value", "pmType"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new SignalCommand("signal"))).to.be.true;
        expect(CodecTestHelper.testCodingCommand(new ValueChangedCommand("5", "newValue"))).to.be.true;
    });
});

class CodecTestHelper {

    static testSoManyCommandsEncoding(count:number):boolean {
        var codec:Codec = new Codec();
        var commands:AttributeCreatedNotification[] = [];

        for (var i = 0; i < count; i++) {
            commands.push(new AttributeCreatedNotification(i.toString(), "" + i * count, "prop" + i, "value" + i, null));
        }

        var coded = codec.encode(commands);
        var decoded = codec.decode(coded);

        if (commands.toString() === decoded.toString()) {
            return true;
        } else {
            return false;
        }
    }

    static testCodingCommand(command:any) {
        var codec:Codec = new Codec();
        var coded = codec.encode(command);
        var decoded = codec.decode(coded);
        if (command.toString() === decoded.toString()) {
            return true;
        } else {
            return false;
        }
    }
}
