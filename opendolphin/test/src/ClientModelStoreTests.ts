/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import { ClientConnector, OnSuccessHandler, Transmitter } from "../../js/dolphin/ClientConnector";
import ClientDolphin from "../../js/dolphin/ClientDolphin";
import { ClientModelStore, Type } from "../../js/dolphin/ClientModelStore";
import { ClientPresentationModel } from "../../js/dolphin/ClientPresentationModel";
import Command from "../../js/dolphin/Command";
import { ModelStoreEvent } from "../../js/dolphin/ClientModelStore";
import SignalCommand from "../../js/dolphin/SignalCommand";

import { expect } from 'chai';


class TestTransmitter implements Transmitter {
    constructor(public clientCommands, public serverCommands) {
    }

    signal(command:SignalCommand) : void { /* do nothing */; }
    reset(successHandler:OnSuccessHandler) : void { /** do nothing */ }

    transmit(commands:Command[], onDone:(result:Command[]) => void):void {
        this.clientCommands = commands;
        onDone(this.serverCommands);
    }
}


describe('ClientModelStoreTests', () => {

    var clientDolphin:ClientDolphin;
    var clientModelStore:ClientModelStore;
    beforeEach(() =>{
        clientDolphin = new ClientDolphin();
        var serverCommand:Command[]=[];//to test
        var transmitter = new TestTransmitter(undefined, serverCommand);
        var clientConnector = new ClientConnector(transmitter,clientDolphin);
        clientModelStore = new ClientModelStore(clientDolphin);
        clientDolphin.setClientConnector(clientConnector);
        clientDolphin.setClientModelStore(clientModelStore);
    });

    it('should be abel add and remove PresentationModel', () => {

        var type:Type;
        var pm:ClientPresentationModel;
        clientModelStore.onModelStoreChange((evt:ModelStoreEvent) => {
            type = evt.eventType;
            pm = evt.clientPresentationModel;
        })

        var pm1 = new ClientPresentationModel("id1", "type");
        var pm2 = new ClientPresentationModel("id2", "type");
        clientModelStore.add(pm1);

        expect(type).to.equal(Type.ADDED);
        expect(pm).to.equal(pm1);

        clientModelStore.add(pm2);
        expect(type).to.equal(Type.ADDED);
        expect(pm).to.equal(pm2);


        var ids:string[] = clientModelStore.listPresentationModelIds();
        expect(ids.length).to.equal(2);
        expect(ids[1]).to.equal("id2");

        var pms:ClientPresentationModel[] = clientModelStore.listPresentationModels();
        expect(pms.length).to.equal(2);
        expect(pms[0]).to.equal(pm1);

        var pm = clientModelStore.findPresentationModelById("id2");
        expect(pm).to.equal(pm2);
        expect(clientModelStore.containsPresentationModel("id1")).to.be.true;

        clientModelStore.remove(pm1);
        expect(type).to.equal(Type.REMOVED);
        expect(pm).to.equal(pm1);

        var ids:string[] = clientModelStore.listPresentationModelIds();
        expect(ids.length).to.equal(1);
        expect(ids[0]).to.equal("id2");

        var pms:ClientPresentationModel[] = clientModelStore.listPresentationModels();
        expect(pms.length).to.equal(1);
        expect(pms[0]).to.equal(pm2);

        expect(clientModelStore.containsPresentationModel("id1")).to.be.false;
    });



    it('should be listen for PresentationModel changes by type', () => {

        var type:Type;
        var pm:ClientPresentationModel;
        // only listen for a specific type
        clientModelStore.onModelStoreChangeForType("type", (evt:ModelStoreEvent) => {
            type = evt.eventType;
            pm = evt.clientPresentationModel;
        })

        var pm1 = new ClientPresentationModel("id1", "type");
        var pm2 = new ClientPresentationModel("id2", "type");
        var pm3 = new ClientPresentationModel("id3", "some other type");

        clientModelStore.add(pm1);
        expect(type).to.equal(Type.ADDED);
        expect(pm).to.equal(pm1);

        clientModelStore.add(pm2);
        expect(type).to.equal(Type.ADDED);
        expect(pm).to.equal(pm2);

        clientModelStore.add(pm3);
        expect(pm).to.equal(pm2); // adding pm3 did not change the last pm !!!

        // but it is in the model store
        var ids:string[] = clientModelStore.listPresentationModelIds();
        expect(ids.length).to.equal(3);
        expect(ids[2]).to.equal("id3");

        var pms:ClientPresentationModel[] = clientModelStore.listPresentationModels();
        expect(pms.length).to.equal(3);
        expect(pms[0]).to.equal(pm1);

        var pm = clientModelStore.findPresentationModelById("id3");
        expect(pm).to.equal(pm3);
        expect(clientModelStore.containsPresentationModel("id3")).to.be.true;

        clientModelStore.remove(pm1);
        expect(type).to.equal(Type.REMOVED);
        expect(pm).to.equal(pm1);

        clientModelStore.remove(pm3); // listener ist _not_ triggered!
        expect(pm).to.equal(pm1);
    });

    it('should be add and remove PresentationModel by type', () => {

        var pm1 = new ClientPresentationModel("id1", "type");
        var pm2 = new ClientPresentationModel("id2", "type");

        clientModelStore.addPresentationModelByType(pm1);
        var pms:ClientPresentationModel[] = clientModelStore.findAllPresentationModelByType(pm1.presentationModelType);

        expect(pms.length).to.equal(1);
        expect(pms[0].id).to.equal("id1");

        clientModelStore.addPresentationModelByType(pm2);
        var pms = clientModelStore.findAllPresentationModelByType(pm1.presentationModelType);
        expect(pms.length).to.equal(2);
        expect(pms[0].id).to.equal("id1");
        expect(pms[1].id).to.equal("id2");

        clientModelStore.removePresentationModelByType(pm1);
        var pms = clientModelStore.findAllPresentationModelByType(pm1.presentationModelType);

        expect(pms.length).to.equal(1);
        expect(pms[0].id).to.equal("id2");
    });

    it('should be add and remove AttributeById', () => {

        var attr1 = new ClientAttribute("prop1", "qual1", 0);
        var attr2 = new ClientAttribute("prop2", "qual2", 0);

        clientModelStore.addAttributeById(attr1);
        clientModelStore.addAttributeById(attr2);

        var result1 = clientModelStore.findAttributeById(attr1.id);
        expect(result1).to.equal(attr1);

        var result2 = clientModelStore.findAttributeById(attr2.id);
        expect(result2).to.equal(attr2);

        clientModelStore.removeAttributeById(attr1);
        var result1 = clientModelStore.findAttributeById(attr1.id);
        expect(result1).to.equal(undefined);
    });

    it('should be add and remove ClientAttribute by qualifier', () => {

        var attr1 = new ClientAttribute("prop1", "qual1", 0);
        var attr2 = new ClientAttribute("prop2", "qual2", 0);

        var attr3 = new ClientAttribute("prop3", "qual1", 0);
        var attr4 = new ClientAttribute("prop4", "qual2", 0);


        clientModelStore.addAttributeByQualifier(attr1);
        clientModelStore.addAttributeByQualifier(attr2);
        clientModelStore.addAttributeByQualifier(attr3);
        clientModelStore.addAttributeByQualifier(attr4);

        var clientAttrs1:ClientAttribute[] = clientModelStore.findAllAttributesByQualifier("qual1");
        expect(clientAttrs1.length).to.equal(2);
        expect(clientAttrs1[0].getQualifier()).to.equal("qual1");
        expect(clientAttrs1[1].getQualifier()).to.equal("qual1");


        var clientAttrs2:ClientAttribute[] = clientModelStore.findAllAttributesByQualifier("qual2");
        expect(clientAttrs2.length).to.equal(2);
        expect(clientAttrs2[0].getQualifier()).to.equal("qual2");
        expect(clientAttrs2[1].getQualifier()).to.equal("qual2");

        clientModelStore.removeAttributeByQualifier(attr1);
        var clientAttrs1:ClientAttribute[] = clientModelStore.findAllAttributesByQualifier("qual1");
        expect(clientAttrs1.length).to.equal(1);
        expect(clientAttrs1[0].getQualifier()).to.equal("qual1");
        expect(clientAttrs1[1]).to.equal(undefined);
    });

});