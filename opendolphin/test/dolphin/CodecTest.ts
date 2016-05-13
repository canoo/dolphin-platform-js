import AttributeCreatedNotification from "../../js/dolphin/AttributeCreatedNotification";
import AttributeMetadataChangedCommand from "../../js/dolphin/AttributeMetadataChangedCommand";
import CallNamedActionCommand from "../../js/dolphin/CallNamedActionCommand";
import ChangeAttributeMetadataCommand from "../../js/dolphin/ChangeAttributeMetadataCommand";
import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import Codec from "../../js/dolphin/Codec";
import CreatePresentationModelCommand from "../../js/dolphin/CreatePresentationModelCommand";
import GetPresentationModelCommand from "../../js/dolphin/GetPresentationModelCommand";
import DataCommand from "../../js/dolphin/DataCommand";
import DeleteAllPresentationModelsOfTypeCommand from "../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand";
import DeletedAllPresentationModelsOfTypeNotification from "../../js/dolphin/DeletedAllPresentationModelsOfTypeNotification";
import DeletedPresentationModelNotification from "../../js/dolphin/DeletedPresentationModelNotification";
import DeletePresentationModelCommand from "../../js/dolphin/DeletePresentationModelCommand";
import EmptyNotification from "../../js/dolphin/EmptyNotification";
import InitializeAttributeCommand from "../../js/dolphin/InitializeAttributeCommand";
import NamedCommand from "../../js/dolphin/NamedCommand";
import PresentationModelResetedCommand from "../../js/dolphin/PresentationModelResetedCommand";
import ResetPresentationModelCommand from "../../js/dolphin/ResetPresentationModelCommand";
import SavedPresentationModelNotification from "../../js/dolphin/SavedPresentationModelNotification";
import SignalCommand from "../../js/dolphin/SignalCommand";
import SwitchPresentationModelCommand from "../../js/dolphin/SwitchPresentationModelCommand";
import ValueChangedCommand from "../../js/dolphin/ValueChangedCommand";

import { TestClass } from "../../testrunner/tsUnit";


export default class CodecTest extends TestClass {

    testCodingCreatePresentationModel() {
        var pm = new ClientPresentationModel("MyId", "MyType");
        var clientAttribute1 = new ClientAttribute("prop1", "qual1", 0);
        var clientAttribute2 = new ClientAttribute("prop2", "qual2", 0);
        pm.addAttribute(clientAttribute1);
        pm.addAttribute(clientAttribute2);
        var createPMCommand = new CreatePresentationModelCommand(pm);

        var codec = new Codec();

        var coded = codec.encode(createPMCommand);
        var decoded = codec.decode(coded);

        this.isTrue(createPMCommand.toString() === decoded.toString());
    }

    testEmpty() {
        this.isTrue(CodecTestHelper.testSoManyCommandsEncoding(0));
    }

    testOne() {
        this.isTrue(CodecTestHelper.testSoManyCommandsEncoding(1));
    }

    testMany() {
        this.isTrue(CodecTestHelper.testSoManyCommandsEncoding(10));
    }

    testCodingCommands() {
        this.isTrue(CodecTestHelper.testCodingCommand(new AttributeCreatedNotification("pmId", "5", "prop", "äöüéàè", "qualifier", "TOOLTIP")))
        this.isTrue(CodecTestHelper.testCodingCommand(new AttributeMetadataChangedCommand("5", "name", "value")))
        this.isTrue(CodecTestHelper.testCodingCommand(new CallNamedActionCommand("some-action")))
        this.isTrue(CodecTestHelper.testCodingCommand(new CreatePresentationModelCommand(new ClientPresentationModel("MyId", "MyType"))))
        this.isTrue(CodecTestHelper.testCodingCommand(new ChangeAttributeMetadataCommand("5", "name", "value")))
        this.isTrue(CodecTestHelper.testCodingCommand(new GetPresentationModelCommand("pmId")))
        this.isTrue(CodecTestHelper.testCodingCommand(new DataCommand("test")));
        this.isTrue(CodecTestHelper.testCodingCommand(new DeleteAllPresentationModelsOfTypeCommand("type")))
        this.isTrue(CodecTestHelper.testCodingCommand(new DeletedAllPresentationModelsOfTypeNotification("type")))
        this.isTrue(CodecTestHelper.testCodingCommand(new DeletedPresentationModelNotification("pmId")))
        this.isTrue(CodecTestHelper.testCodingCommand(new DeletePresentationModelCommand("pmId")))
        this.isTrue(CodecTestHelper.testCodingCommand(new EmptyNotification()))
        this.isTrue(CodecTestHelper.testCodingCommand(new InitializeAttributeCommand("pmId", "prop", "qualifier", "value", "pmType")))
        this.isTrue(CodecTestHelper.testCodingCommand(new NamedCommand("name")))
        this.isTrue(CodecTestHelper.testCodingCommand(new PresentationModelResetedCommand("pmId")))
        this.isTrue(CodecTestHelper.testCodingCommand(new ResetPresentationModelCommand("pmId")))
        this.isTrue(CodecTestHelper.testCodingCommand(new SavedPresentationModelNotification("pmId")))
        this.isTrue(CodecTestHelper.testCodingCommand(new SignalCommand("signal")))
        this.isTrue(CodecTestHelper.testCodingCommand(new SwitchPresentationModelCommand("pmId", "sourcePmId")))
        this.isTrue(CodecTestHelper.testCodingCommand(new ValueChangedCommand("5", "oldValue", "newValue")))
    }
}

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
