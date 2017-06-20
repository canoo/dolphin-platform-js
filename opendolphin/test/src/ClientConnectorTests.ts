/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import { ClientConnector, OnSuccessHandler, Transmitter } from "../../js/dolphin/ClientConnector";
import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import ClientDolphin from "../../js/dolphin/ClientDolphin";
import { ClientModelStore } from "../../js/dolphin/ClientModelStore";
import Command from "../../js/dolphin/Command";
import DeletePresentationModelCommand from "../../js/dolphin/DeletePresentationModelCommand";
import SignalCommand from "../../js/dolphin/SignalCommand";
import ValueChangedCommand from "../../js/dolphin/ValueChangedCommand";

import { assert } from 'chai';

class TestTransmitter implements Transmitter {
    constructor(public clientCommands, public serverCommands) {
    }

    transmit(commands:Command[], onDone: (result: Command[]) => void ) : void {
        this.clientCommands = commands;
        onDone(this.serverCommands);
    }
    signal(command: SignalCommand) : void { /** do nothing */ }
    reset(successHandler:OnSuccessHandler) : void { /** do nothing */ }
}

describe('DolphinBuilderTest', () => {

    it('sending one command must call the Transmission', () => {
        var singleCommand   = new Command();
        var serverCommand:Command[]=[];
        var transmitter     = new TestTransmitter(singleCommand, serverCommand);
        var clientConnector = new ClientConnector(transmitter,null);

        clientConnector.send(singleCommand, undefined);

        assert.equal( transmitter.clientCommands.length, 1);
        assert.equal( transmitter.clientCommands[0], singleCommand);
    });

    it('sending multiple commands', () => {
        var singleCommand   = new Command();
        var serverCommand:Command[]=[];
        var lastCommand     = new Command();
        var transmitter     = new TestTransmitter(undefined, serverCommand);
        var clientConnector = new ClientConnector(transmitter,null);

        clientConnector.send(singleCommand, undefined);
        clientConnector.send(singleCommand, undefined);
        clientConnector.send(lastCommand, undefined);

        assert.equal( transmitter.clientCommands.length, 1);
        assert.equal( transmitter.clientCommands[0].id, lastCommand.id)
    });

    it('handle DeletePresentationModelCommand', () => {
        TestHelper.initialize();
        var serverCommand:DeletePresentationModelCommand = new DeletePresentationModelCommand("pmId1");

        //before calling DeletePresentationModelCommand
        var pm1 = TestHelper.clientDolphin.findPresentationModelById("pmId1");
        assert.equal(pm1.id,"pmId1");

        //call DeletePresentationModelCommand
        TestHelper.clientConnector.handle(serverCommand);
        pm1 = TestHelper.clientDolphin.findPresentationModelById("pmId1");
        assert.equal(pm1,undefined); // should be undefined

        //other PM should be unaffected
        var pm2 = TestHelper.clientDolphin.findPresentationModelById("pmId2");
        assert.equal(pm2.id,"pmId2");

        //deleting with dummyId
        serverCommand  = new DeletePresentationModelCommand("dummyId");
        var result = TestHelper.clientConnector.handle(serverCommand);
        assert.equal(result,null);// there is no pm with dummyId
    });


    it('handle ValueChangedCommand', () => {
        TestHelper.initialize();
        var serverCommand:ValueChangedCommand = new ValueChangedCommand(TestHelper.attr1.id,0,10);

        //before calling ValueChangedCommand
        var attribute = TestHelper.clientDolphin.getClientModelStore().findAttributeById(TestHelper.attr1.id);
        assert.equal(attribute.getValue, TestHelper.attr1.getValue);
        assert.equal(attribute.getValue(),0);

        //call ValueChangedCommand
        TestHelper.clientConnector.handle(serverCommand);
        attribute = TestHelper.clientDolphin.getClientModelStore().findAttributeById(TestHelper.attr1.id);
        assert.equal(attribute.getValue(), TestHelper.attr1.getValue());
        assert.equal(attribute.getValue(),10);
    });

});

class TestHelper{
    static transmitter:TestTransmitter;
    static clientDolphin:ClientDolphin;
    static clientConnector:ClientConnector;
    static clientModelStore:ClientModelStore;
    static attr1:ClientAttribute;// to access for id
    static attr3:ClientAttribute;// to access for id

    static initialize(){
        var serverCommand:Command[]=[];//to test
        this.transmitter = new TestTransmitter(undefined, serverCommand);
        this.clientDolphin = new ClientDolphin();
        this.clientConnector = new ClientConnector(this.transmitter,this.clientDolphin);
        this.clientModelStore = new ClientModelStore(this.clientDolphin);
        this.clientDolphin.setClientModelStore(this.clientModelStore);
        this.clientDolphin.setClientConnector(this.clientConnector);

        this.attr1 = new ClientAttribute("prop1", "qual1", 0);
        var attr2 = new ClientAttribute("prop2", "qual2", 0);

        this.attr3 = new ClientAttribute("prop1", "qual3", 5);
        var attr4 = new ClientAttribute("prop4", "qual4", 5);

        this.clientDolphin.presentationModel("pmId1", "pmType",this.attr1,attr2);
        this.clientDolphin.presentationModel("pmId2", "pmType",this.attr3,attr4);
    }
}
