import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientConnector } from "../../js/dolphin/ClientConnector";
import ClientDolphin from "../../js/dolphin/ClientDolphin";
import { ClientModelStore } from "../../js/dolphin/ClientModelStore";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import NoTransmitter from "../../js/dolphin/NoTransmitter";

import { TestClass } from "../../testrunner/tsUnit";


export default class ClientDolphinTests extends TestClass {
    getPmFromFactoryMethod() {
        var clientDolphin:ClientDolphin = new ClientDolphin();
        var clientModelStore:ClientModelStore = new ClientModelStore(clientDolphin);
        clientDolphin.setClientModelStore(clientModelStore);
        clientDolphin.setClientConnector(new ClientConnector(new NoTransmitter(), clientDolphin));

        var pm1:ClientPresentationModel = clientDolphin.presentationModel("myId1", "myType");
        this.areIdentical(pm1.id, "myId1");
        this.areIdentical(pm1.getAttributes().length, 0);

        var ca1 = new ClientAttribute("prop1", "qual1", "val");
        var ca2 = new ClientAttribute("prop2", "qual2", "val");

        var pm2:ClientPresentationModel = clientDolphin.presentationModel("myId2", "myType", ca1, ca2);
        this.areIdentical(pm2.id, "myId2");
        this.areIdentical(pm2.getAttributes().length, 2);
    }
}
