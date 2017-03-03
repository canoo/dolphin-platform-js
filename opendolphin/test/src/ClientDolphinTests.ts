/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientConnector } from "../../js/dolphin/ClientConnector";
import ClientDolphin from "../../js/dolphin/ClientDolphin";
import { ClientModelStore } from "../../js/dolphin/ClientModelStore";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import NoTransmitter from "../../js/dolphin/NoTransmitter";



import { expect } from 'chai';

describe('ClientDolphinTests', () => {

    var clientDolphin:ClientDolphin;
    beforeEach(() =>{
        clientDolphin = new ClientDolphin();
        var clientModelStore:ClientModelStore = new ClientModelStore(clientDolphin);
        clientDolphin.setClientModelStore(clientModelStore);
        clientDolphin.setClientConnector(new ClientConnector(new NoTransmitter(), clientDolphin));
    });

    it('Attributes length should be equal to 0', () => {

        var pm1:ClientPresentationModel = clientDolphin.presentationModel("myId1", "myType");
        expect(pm1.id).to.equal('myId1');
        expect(pm1.getAttributes().length).to.equal(0);
    });

    it('Attributes length should be equal to 2', () => {

        var ca1 = new ClientAttribute("prop1", "qual1", "val");
        var ca2 = new ClientAttribute("prop2", "qual2", "val");

        var pm2:ClientPresentationModel = clientDolphin.presentationModel("myId2", "myType", ca1, ca2);
        expect(pm2.id).to.equal('myId2');
        expect(pm2.getAttributes().length).to.equal(2);
    });

});