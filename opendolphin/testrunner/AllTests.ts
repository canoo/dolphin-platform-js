import ChangeAttributeMetadataCommandTests from "../test/dolphin/ChangeAttributeMetadataCommandTests";
import ClientAttributeTests from '../test/dolphin/ClientAttributeTests';
import ClientConnectorTests from "../test/dolphin/ClientConnectorTests";
import ClientDolphinTests from "../test/dolphin/ClientDolphinTests";
import ClientModelStoreTests from "../test/dolphin/ClientModelStoreTests";
import ClientPresentationModelTests from "../test/dolphin/ClientPresentationModelTests";
import CodecTest from "../test/dolphin/CodecTest";
import CommandBatcherTests from "../test/dolphin/CommandBatcherTests";
import CreatePresentationModelCommandTests from "../test/dolphin/CreatePresentationModelCommandTests";
import DolphinBuilderTest from "../test/dolphin/DolphinBuilderTest";
import EmptyNotificationTests from "../test/dolphin/EmptyNotificationTests";
import MapTests from "../test/dolphin/MapTests";
import NamedCommandTests from "../test/dolphin/NamedCommandTests";
import ValueChangedCommandTests from "../test/dolphin/ValueChangedCommandTests";

import { Test } from "./tsUnit";


export function testAll() {
    var test = new Test();

    // add your test class (you can call this multiple times)
    test.addTestClass(new ClientAttributeTests(), "ClientAttributeTests");
    test.addTestClass(new ClientPresentationModelTests(), "ClientPresentationModelTests");
    test.addTestClass(new NamedCommandTests(), "NamedCommandTests");
    test.addTestClass(new ValueChangedCommandTests(), "ValueChangedCommandTests");
    test.addTestClass(new ChangeAttributeMetadataCommandTests(), "ChangeAttributeMetadataCommandTests");
    test.addTestClass(new EmptyNotificationTests(), "EmptyNotificationTests");
    test.addTestClass(new CreatePresentationModelCommandTests(), "CreatePresentationModelCommandTests");
    test.addTestClass(new ClientDolphinTests(), "ClientDolphinTests");
    test.addTestClass(new ClientConnectorTests(), "ClientConnectorTests");
    test.addTestClass(new CommandBatcherTests(), "CommandBatcherTests");
    test.addTestClass(new MapTests(), "MapTests");
    test.addTestClass(new ClientModelStoreTests(), "ClientModelStoreTests");
    test.addTestClass(new CodecTest(), "CodecTest");
    test.addTestClass(new DolphinBuilderTest(), "DolphinBuilder");

    return test.run();
}
