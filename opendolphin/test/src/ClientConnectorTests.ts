/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import { ClientConnector, OnSuccessHandler, Transmitter } from "../../js/dolphin/ClientConnector";
import { ClientAttribute } from "../../js/dolphin/ClientAttribute";
import ClientDolphin from "../../js/dolphin/ClientDolphin";
import { ClientModelStore } from "../../js/dolphin/ClientModelStore";
import Command from "../../js/dolphin/Command";
import DeleteAllPresentationModelsOfTypeCommand from "../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand";
import DeletePresentationModelCommand from "../../js/dolphin/DeletePresentationModelCommand";
import InitializeAttributeCommand from "../../js/dolphin/InitializeAttributeCommand";
import SignalCommand from "../../js/dolphin/SignalCommand";
import SwitchPresentationModelCommand from "../../js/dolphin/SwitchPresentationModelCommand";
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

    it('handle delete all PresentationModel of type command', () => {
        TestHelper.initialize();
        var serverCommand:DeleteAllPresentationModelsOfTypeCommand = new DeleteAllPresentationModelsOfTypeCommand("pmType")

        //before calling DeleteAllPresentationModelsOfTypeCommand
        var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        assert.equal(pms.length,2);

        //call DeleteAllPresentationModelsOfTypeCommand
        TestHelper.clientConnector.handle(serverCommand);
        pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        assert.equal(pms.length,0); //both pm of pmType is deleted

        //initialize again
        TestHelper.initialize();
        //sending dummyType
        serverCommand = new DeleteAllPresentationModelsOfTypeCommand("dummyType");
        TestHelper.clientConnector.handle(serverCommand);
        var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        assert.equal(pms.length,2);// nothing is deleted
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

    it('handle switch PresentationModelCommand', () => {
        TestHelper.initialize();
        var serverCommand:SwitchPresentationModelCommand = new SwitchPresentationModelCommand("pmId1","pmId2");

        //before calling SwitchPresentationModelCommand
        var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        assert.notEqual(pms[0].getAttributes()[0].getValue(), pms[1].getAttributes()[0].getValue());

        //call SwitchPresentationModelCommand
        TestHelper.clientConnector.handle(serverCommand);
        pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        // Attribute of same property ("prop1", )  should be equal
        assert.equal(pms[0].getAttributes()[0].getValue(), pms[1].getAttributes()[0].getValue());

        //other attributes should be unaffected
        assert.notEqual(pms[0].getAttributes()[1].getValue(), pms[1].getAttributes()[1].getValue());
    });

    it('handle initialize attribute command', () => {
        TestHelper.initialize();
        //new PM with existing attribute qualifier
        var serverCommand: InitializeAttributeCommand = new  InitializeAttributeCommand("newPm","newPmType","newProp","qual1","newValue");
        //before calling InitializeAttributeCommand
        var attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual1");
        assert.equal(attribute[0].getValue(), 0);
        assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 2);

        //call InitializeAttributeCommand
        TestHelper.clientConnector.handle(serverCommand);
        attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual1");
        assert.equal(attribute[0].getValue(), "newValue");// same attribute value will change
        assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 3);

        //existing PM with existing attribute qualifier
        var serverCommand: InitializeAttributeCommand = new  InitializeAttributeCommand("pmId1","pmType1","newProp","qual3","newValue");
        //before calling InitializeAttributeCommand
        var attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual3");
        assert.equal(attribute[0].getValue(), 5);
        assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 3);

        //call InitializeAttributeCommand
        TestHelper.clientConnector.handle(serverCommand);
        attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual3");
        assert.equal(attribute[0].getValue(), "newValue");// same attribute value will change
        assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 3);// no PM added
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
