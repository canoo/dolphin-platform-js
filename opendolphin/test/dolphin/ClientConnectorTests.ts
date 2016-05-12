/// <reference path="../../js/dolphin/ClientConnector.ts"/>
/// <reference path="../../js/dolphin/ClientConnector.ts"/>
/// <reference path="../../js/dolphin/HttpTransmitter.ts"/>
/// <reference path="../../js/dolphin/Command.ts"/>
/// <reference path="../../js/dolphin/SignalCommand.ts"/>
/// <reference path="../../js/dolphin/ClientDolphin.ts"/>
/// <reference path="../../js/dolphin/ClientModelStore.ts"/>
/// <reference path="../../js/dolphin/ClientPresentationModel.ts"/>
/// <reference path="../../js/dolphin/ClientAttribute.ts"/>
/// <reference path="../../js/dolphin/CallNamedActionCommand.ts" />
/// <reference path="../../js/dolphin/SavedPresentationModelNotification.ts" />
/// <reference path="../../js/dolphin/InitializeAttributeCommand.ts" />
/// <reference path="../../js/dolphin/ValueChangedCommand.ts" />
/// <reference path="../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand.ts" />
/// <reference path="../../js/dolphin/DeletePresentationModelCommand.ts" />
/// <reference path="../../js/dolphin/CreatePresentationModelCommand.ts" />


module opendolphin {

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

    export class ClientConnectorTests extends tsUnit.TestClass {

        sendingOneCommandMustCallTheTransmission() {
            var singleCommand   = new Command();
            var serverCommand:Command[]=[];
            var transmitter     = new TestTransmitter(singleCommand, serverCommand)
            var clientConnector = new ClientConnector(transmitter,null);

            clientConnector.send(singleCommand, undefined)

            this.areIdentical( transmitter.clientCommands.length, 1)
            this.areIdentical( transmitter.clientCommands[0], singleCommand)
        }

        sendingMultipleCommands() {
            var singleCommand   = new Command();
            var serverCommand:Command[]=[];
            var lastCommand     = new Command();
            var transmitter     = new TestTransmitter(undefined, serverCommand)
            var clientConnector = new ClientConnector(transmitter,null);

            clientConnector.send(singleCommand, undefined)
            clientConnector.send(singleCommand, undefined)
            clientConnector.send(lastCommand, undefined)

            this.areIdentical( transmitter.clientCommands.length, 1)
            this.areIdentical( transmitter.clientCommands[0].id, lastCommand.id)
        }

        handleDeletePresentationModelCommand(){
            TestHelper.initialize();
            var serverCommand:DeletePresentationModelCommand = new DeletePresentationModelCommand("pmId1")

            //before calling DeletePresentationModelCommand
            var pm1 = TestHelper.clientDolphin.findPresentationModelById("pmId1");
            this.areIdentical(pm1.id,"pmId1");

            //call DeletePresentationModelCommand
            TestHelper.clientConnector.handle(serverCommand);
            pm1 = TestHelper.clientDolphin.findPresentationModelById("pmId1");
            this.areIdentical(pm1,undefined); // should be undefined

            //other PM should be unaffected
            var pm2 = TestHelper.clientDolphin.findPresentationModelById("pmId2");
            this.areIdentical(pm2.id,"pmId2");

            //deleting with dummyId
            serverCommand  = new DeletePresentationModelCommand("dummyId")
            var result = TestHelper.clientConnector.handle(serverCommand);
            this.areIdentical(result,null);// there is no pm with dummyId
        }

        handleDeleteAllPresentationModelOfTypeCommand(){
            TestHelper.initialize();
            var serverCommand:DeleteAllPresentationModelsOfTypeCommand = new DeleteAllPresentationModelsOfTypeCommand("pmType")

            //before calling DeleteAllPresentationModelsOfTypeCommand
            var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
            this.areIdentical(pms.length,2);

            //call DeleteAllPresentationModelsOfTypeCommand
            TestHelper.clientConnector.handle(serverCommand);
            pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
            this.areIdentical(pms.length,0); //both pm of pmType is deleted

            //initialize again
            TestHelper.initialize();
            //sending dummyType
            serverCommand = new DeleteAllPresentationModelsOfTypeCommand("dummyType")
            TestHelper.clientConnector.handle(serverCommand);
            var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
            this.areIdentical(pms.length,2);// nothing is deleted
        }

        handleValueChangedCommand(){
            TestHelper.initialize();
            var serverCommand:ValueChangedCommand = new ValueChangedCommand(TestHelper.attr1.id,0,10);

            //before calling ValueChangedCommand
            var attribute = TestHelper.clientDolphin.getClientModelStore().findAttributeById(TestHelper.attr1.id);
            this.areIdentical(attribute.getValue, TestHelper.attr1.getValue);
            this.areIdentical(attribute.getValue(),0);

            //call ValueChangedCommand
            TestHelper.clientConnector.handle(serverCommand);
            attribute = TestHelper.clientDolphin.getClientModelStore().findAttributeById(TestHelper.attr1.id);
            this.areIdentical(attribute.getValue(), TestHelper.attr1.getValue());
            this.areIdentical(attribute.getValue(),10);
        }

        handleSwitchPresentationModelCommand(){
            TestHelper.initialize();
            var serverCommand:SwitchPresentationModelCommand = new SwitchPresentationModelCommand("pmId1","pmId2");

            //before calling SwitchPresentationModelCommand
            var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
            this.areNotIdentical(pms[0].getAttributes()[0].getValue(), pms[1].getAttributes()[0].getValue());
            this.areNotIdentical(pms[0].getAttributes()[0].getBaseValue(), pms[1].getAttributes()[0].getBaseValue());

            //call SwitchPresentationModelCommand
            TestHelper.clientConnector.handle(serverCommand);
            pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
            // Both attribute of same property and tag ("prop1", "VALUE")  should be equal
            this.areIdentical(pms[0].getAttributes()[0].getValue(), pms[1].getAttributes()[0].getValue());
            this.areIdentical(pms[0].getAttributes()[0].getBaseValue(), pms[1].getAttributes()[0].getBaseValue());

            //other attributes should be unaffected
            this.areNotIdentical(pms[0].getAttributes()[1].getValue(), pms[1].getAttributes()[1].getValue());
            this.areNotIdentical(pms[0].getAttributes()[1].getBaseValue(), pms[1].getAttributes()[1].getBaseValue());
        }

        handleSavedPresentationModelNotification(){
            TestHelper.initialize();
            var serverCommand:SavedPresentationModelNotification = new SavedPresentationModelNotification("pmId1");

            //before calling SavedPresentationModelNotification
            var pm = TestHelper.clientDolphin.findPresentationModelById("pmId1");
            this.areIdentical(pm.getAttributes()[0].getValue(), pm.getAttributes()[0].getBaseValue());
            this.areIdentical(pm.getAttributes()[1].getValue(), pm.getAttributes()[1].getBaseValue());

            TestHelper.attr1.setValue(10);
            //call SavedPresentationModelNotification
            TestHelper.clientConnector.handle(serverCommand);
            pm = TestHelper.clientDolphin.findPresentationModelById("pmId1");
            this.areIdentical(pm.getAttributes()[0].getValue(), pm.getAttributes()[0].getBaseValue());
            this.areIdentical(pm.getAttributes()[1].getValue(), pm.getAttributes()[1].getBaseValue());

            this.areIdentical(pm.getAttributes()[0].getValue(),10);
            this.areIdentical(pm.getAttributes()[1].getValue(), 0);
            this.areIdentical(pm.getAttributes()[0].getBaseValue(),10);
            this.areIdentical(pm.getAttributes()[1].getBaseValue(), 0);
        }
        handlePresentationModelResetedCommand(){
            TestHelper.initialize();
            var serverCommand: PresentationModelResetedCommand = new  PresentationModelResetedCommand("pmId1");

            //before calling PresentationModelResetedCommand
            var pm = TestHelper.clientDolphin.findPresentationModelById("pmId1");
            this.areIdentical(pm.getAttributes()[0].getValue(), pm.getAttributes()[0].getBaseValue());
            this.areIdentical(pm.getAttributes()[1].getValue(), pm.getAttributes()[1].getBaseValue());

            TestHelper.attr1.setValue(10);
            //call PresentationModelResetedCommand
            TestHelper.clientConnector.handle(serverCommand);
            pm = TestHelper.clientDolphin.findPresentationModelById("pmId1");
            this.areIdentical(pm.getAttributes()[0].getValue(), pm.getAttributes()[0].getBaseValue());
            this.areIdentical(pm.getAttributes()[1].getValue(), pm.getAttributes()[1].getBaseValue());

            this.areIdentical(pm.getAttributes()[0].getValue(),0);
            this.areIdentical(pm.getAttributes()[1].getValue(), 0);
            this.areIdentical(pm.getAttributes()[0].getBaseValue(),0);
            this.areIdentical(pm.getAttributes()[1].getBaseValue(), 0);
        }
        handleInitializeAttributeCommand(){
            TestHelper.initialize();
            //new PM with existing attribute qualifier
            var serverCommand: InitializeAttributeCommand = new  InitializeAttributeCommand("newPm","newPmType","newProp","qual1","newValue");
            //before calling InitializeAttributeCommand
            var attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual1");
            this.areIdentical(attribute[0].getValue(), 0);
            this.areIdentical(TestHelper.clientDolphin.listPresentationModelIds().length, 2);

            //call InitializeAttributeCommand
            TestHelper.clientConnector.handle(serverCommand);
            attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual1");
            this.areIdentical(attribute[0].getValue(), "newValue");// same attribute value will change
            this.areIdentical(TestHelper.clientDolphin.listPresentationModelIds().length, 3);

            //existing PM with existing attribute qualifier
            var serverCommand: InitializeAttributeCommand = new  InitializeAttributeCommand("pmId1","pmType1","newProp","qual3","newValue");
            //before calling InitializeAttributeCommand
            var attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual3");
            this.areIdentical(attribute[0].getValue(), 5);
            this.areIdentical(TestHelper.clientDolphin.listPresentationModelIds().length, 3);

            //call InitializeAttributeCommand
            TestHelper.clientConnector.handle(serverCommand);
            attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual3");
            this.areIdentical(attribute[0].getValue(), "newValue");// same attribute value will change
            this.areIdentical(TestHelper.clientDolphin.listPresentationModelIds().length, 3);// no PM added
        }

    }

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
}