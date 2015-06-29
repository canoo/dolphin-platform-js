"use strict";

var sinon = require('sinon');
var connect = require('../../src/dolphin.js').connect;

describe('Dolphin Message Distribution', function() {

    var onModelStoreChange = null;
    var dolphin = null;

    var clientModelStore = { onModelStoreChange: function(cb) { onModelStoreChange = cb; } };

    var opendolphinFacade = {
        getClientModelStore: function() { return clientModelStore; },
        deletePresentationModel: function() {}
    }


    beforeEach(sinon.test(function() {
        this.stub(opendolphin, "dolphin").returns(opendolphinFacade);
        dolphin = connect("http://localhost");
        if (typeof onModelStoreChange !== 'function') {
            throw new Error('Initialisation of opendolphin failed');
        }
    }));

    afterEach(function() {
        dolphin.shutdown();
    });



    it('should call registerClass()', sinon.test(function() {
        dolphin.classRepository.registerClass = this.spy();
        var model = {
            presentationModelType: '@@@ DOLPHIN_BEAN @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.registerClass, model);
    }));


    it('should call unregisterClass()', sinon.test(function() {
        dolphin.classRepository.unregisterClass = this.spy();
        var model = {
            presentationModelType: '@@@ DOLPHIN_BEAN @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(dolphin.classRepository.unregisterClass, model);
    }));


    it('should call load()', sinon.test(function() {
        dolphin.classRepository.load = this.stub().returns({});
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.load, model);
    }));


    it('should call unload()', sinon.test(function() {
        dolphin.classRepository.unload = this.stub().returns({});
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(dolphin.classRepository.unload, model);
    }));


    it('should call addListEntry()', sinon.test(function() {
        dolphin.classRepository.addListEntry = this.spy();
        this.spy(opendolphinFacade, "deletePresentationModel");
        var model = {
            presentationModelType: '@@@ LIST_ADD @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.addListEntry, model);
        sinon.assert.calledWith(opendolphinFacade.deletePresentationModel, model);
    }));


    it('should call delListEntry()', sinon.test(function() {
        dolphin.classRepository.delListEntry = this.spy();
        this.spy(opendolphinFacade, "deletePresentationModel");
        var model = {
            presentationModelType: '@@@ LIST_DEL @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.delListEntry, model);
        sinon.assert.calledWith(opendolphinFacade.deletePresentationModel, model);
    }));


    it('should call setListEntry()', sinon.test(function() {
        dolphin.classRepository.setListEntry = this.spy();
        this.spy(opendolphinFacade, "deletePresentationModel");
        var model = {
            presentationModelType: '@@@ LIST_SET @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.setListEntry, model);
        sinon.assert.calledWith(opendolphinFacade.deletePresentationModel, model);
    }));
});



describe('Dolphin Event Handling', function() {

    var onModelStoreChange = null;
    var dolphin = null;

    beforeEach(sinon.test(function() {
        var clientModelStore = { onModelStoreChange: function(cb) { onModelStoreChange = cb; } };
        this.stub(opendolphin, "dolphin").returns(
            {
                getClientModelStore: function() { return clientModelStore; }
            }
        );
        dolphin = connect("http://localhost");
        if (typeof onModelStoreChange !== 'function') {
            throw new Error('Initialisation of opendolphin failed');
        }
    }));

    afterEach(function() {
        dolphin.shutdown();
    });



    it('should call onAdded-handler for class', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        dolphin.onAdded('SomeClass', onAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(onAddedHandler, bean);
    }));


    it('should not call onAdded-handler for other class', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        dolphin.onAdded('SomeOtherClass', onAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.notCalled(onAddedHandler);
    }));


    it('should call generic onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        dolphin.onAdded(onAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(onAddedHandler, bean);
    }));


    it('should call onRemoved-handler for class', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        dolphin.onRemoved('SomeClass', onRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(onRemovedHandler, bean);
    }));


    it('should not call onRemoved-handler for other class', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        dolphin.onRemoved('SomeOtherClass', onRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.notCalled(onRemovedHandler);
    }));


    it('should call generic onRemoved-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        dolphin.onRemoved(onRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(onRemovedHandler, bean);
    }));
});



describe('Dolphin Command', function() {

    var dolphin = null;
    var clientDolphin = null;

    beforeEach(sinon.test(function() {
        var clientModelStore = { onModelStoreChange: function(cb) {} };
        clientDolphin = {
            getClientModelStore: function() { return clientModelStore; },
            attribute: function() {},
            presentationModel: function() {},
            send: function() {}
        };
        this.stub(opendolphin, "dolphin").returns(clientDolphin);
        dolphin = connect("http://localhost");
    }));

    afterEach(function() {
        dolphin.shutdown();
    });



    it('should send command without parameters', sinon.test(function() {
        this.spy(clientDolphin, 'send');

        dolphin.send("myCommand");

        sinon.assert.calledWith(clientDolphin.send, "myCommand");
    }));


    it('should send command with one named parameter', sinon.test(function() {
        dolphin.classRepository.mapParamToDolphin = this.stub().withArgs(42).returns({value: 42, type: 'number'});
        var attrFactory = this.stub(clientDolphin, 'attribute');
        var sourceAttr = {};
        var attr1 = {};
        var attr2 = {};
        attrFactory.withArgs('@@@ SOURCE_SYSTEM @@@', null, 'client').returns(sourceAttr);
        attrFactory.withArgs('x', null, 42, 'VALUE').returns(attr1);
        attrFactory.withArgs('x', null, 'number', 'VALUE_TYPE').returns(attr2);
        this.spy(clientDolphin, 'presentationModel');
        this.spy(clientDolphin, 'send');

        dolphin.send("myCommand", {x: 42});

        sinon.assert.calledWith(clientDolphin.presentationModel, null, '@@@ DOLPHIN_PARAMETER @@@', sourceAttr, attr1, attr2);
        sinon.assert.calledWith(clientDolphin.send, "myCommand");
    }));
});