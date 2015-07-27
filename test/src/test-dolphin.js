"use strict";

var sinon = require('sinon');
var connect = require('../../src/dolphin.js').connect;

describe('Dolphin Message Distribution', function() {

    var onModelStoreChange = null;
    var dolphin = null;

    var clientModelStore = { onModelStoreChange: function(cb) { onModelStoreChange = cb; } };

    var clientDolphin = {
        getClientModelStore: function() { return clientModelStore; },
        deletePresentationModel: function() {}
    };


    beforeEach(sinon.test(function() {
        var openDolphinBuilder = new opendolphin.DolphinBuilder();
        this.stub(openDolphinBuilder, "build").returns(clientDolphin);
        this.stub(opendolphin, "makeDolphin").returns(openDolphinBuilder);
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
        this.spy(clientDolphin, "deletePresentationModel");
        var model = {
            presentationModelType: '@@@ LIST_ADD @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.addListEntry, model);
        sinon.assert.calledWith(clientDolphin.deletePresentationModel, model);
    }));


    it('should call delListEntry()', sinon.test(function() {
        dolphin.classRepository.delListEntry = this.spy();
        this.spy(clientDolphin, "deletePresentationModel");
        var model = {
            presentationModelType: '@@@ LIST_DEL @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.delListEntry, model);
        sinon.assert.calledWith(clientDolphin.deletePresentationModel, model);
    }));


    it('should call setListEntry()', sinon.test(function() {
        dolphin.classRepository.setListEntry = this.spy();
        this.spy(clientDolphin, "deletePresentationModel");
        var model = {
            presentationModelType: '@@@ LIST_SET @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.setListEntry, model);
        sinon.assert.calledWith(clientDolphin.deletePresentationModel, model);
    }));
});



describe('Dolphin Event Handling', function() {

    var onModelStoreChange = null;
    var dolphin = null;

    beforeEach(sinon.test(function() {
        var clientModelStore = { onModelStoreChange: function(cb) { onModelStoreChange = cb; } };
        var clientDolphin = {
            getClientModelStore: function() { return clientModelStore; }
        };
        var openDolphinBuilder = new opendolphin.DolphinBuilder();
        this.stub(openDolphinBuilder, "build").returns(clientDolphin);
        this.stub(opendolphin, "makeDolphin").returns(openDolphinBuilder);



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


    it('should not call removed onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        dolphin.onAdded('SomeClass', onAddedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.notCalled(onAddedHandler);
    }));


    it('should be able to add onAdded-handler within onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var outerOnAddedHandler = function() {
            dolphin.onAdded('SomeClass', innerOnAddedHandler);
        };

        var subscription = dolphin.onAdded('SomeClass', outerOnAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnAddedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        sinon.assert.calledWith(innerOnAddedHandler, bean);
    }));


    it('should be able to remove onAdded-handler within onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var innerSubscription = dolphin.onAdded('SomeClass', innerOnAddedHandler);
        var outerOnAddedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = dolphin.onAdded('SomeClass', outerOnAddedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnAddedHandler, bean);
        innerOnAddedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        sinon.assert.notCalled(innerOnAddedHandler);
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


    it('should not call removed generic onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        dolphin.onAdded(onAddedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.notCalled(onAddedHandler);
    }));


    it('should be able to add generic onAdded-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var outerOnAddedHandler = function() {
            dolphin.onAdded('SomeClass', innerOnAddedHandler);
        };

        var subscription = dolphin.onAdded('SomeClass', outerOnAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnAddedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        sinon.assert.calledWith(innerOnAddedHandler, bean);
    }));


    it('should be able to remove generic onAdded-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.load = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var innerSubscription = dolphin.onAdded(innerOnAddedHandler);
        var outerOnAddedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = dolphin.onAdded(outerOnAddedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnAddedHandler, bean);
        innerOnAddedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        sinon.assert.notCalled(innerOnAddedHandler);
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


    it('should not call removed onRemoved-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        dolphin.onRemoved('SomeClass', onRemovedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.notCalled(onRemovedHandler);
    }));


    it('should be able to add onRemoved-handler within onRemoved-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var outerOnRemovedHandler = function() {
            dolphin.onRemoved('SomeClass', innerOnRemovedHandler);
        };

        var subscription = dolphin.onRemoved('SomeClass', outerOnRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnRemovedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
    }));


    it('should be able to remove onRemoved-handler within onRemoved-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var innerSubscription = dolphin.onRemoved('SomeClass', innerOnRemovedHandler);
        var outerOnRemovedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = dolphin.onRemoved('SomeClass', outerOnRemovedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
        innerOnRemovedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        sinon.assert.notCalled(innerOnRemovedHandler);
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


    it('should not call removed generic onRemoved-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        dolphin.onRemoved(onRemovedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.notCalled(onRemovedHandler);
    }));


    it('should be able to add generic onRemoved-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var outerOnRemovedHandler = function() {
            dolphin.onRemoved(innerOnRemovedHandler);
        };

        var subscription = dolphin.onRemoved(outerOnRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnRemovedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
    }));


    it('should be able to remove generic onRemoved-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        dolphin.classRepository.unload = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var innerSubscription = dolphin.onRemoved(innerOnRemovedHandler);
        var outerOnRemovedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = dolphin.onRemoved(outerOnRemovedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
        innerOnRemovedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        sinon.assert.notCalled(innerOnRemovedHandler);
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
        var openDolphinBuilder = new opendolphin.DolphinBuilder();
        this.stub(openDolphinBuilder, "build").returns(clientDolphin);
        this.stub(opendolphin, "makeDolphin").returns(openDolphinBuilder);
        dolphin = connect("http://localhost");
    }));

    afterEach(function() {
        dolphin.shutdown();
    });



    it('should send command without parameters', sinon.test(function(done) {
        this.stub(clientDolphin, 'send').yieldsTo('onFinished', []);

        dolphin.send("myCommand").then(function() {
            sinon.assert.calledWith(clientDolphin.send, "myCommand");
            done();
        });
    }));


    it('should send command with one named parameter', sinon.test(function(done) {
        dolphin.classRepository.mapParamToDolphin = this.stub().withArgs(42).returns({value: 42, type: 'number'});
        var attrFactory = this.stub(clientDolphin, 'attribute');
        var sourceAttr = {};
        var attr1 = {};
        var attr2 = {};
        attrFactory.withArgs('@@@ SOURCE_SYSTEM @@@', null, 'client').returns(sourceAttr);
        attrFactory.withArgs('x', null, 42, 'VALUE').returns(attr1);
        attrFactory.withArgs('x', null, 'number', 'VALUE_TYPE').returns(attr2);
        this.spy(clientDolphin, 'presentationModel');
        this.stub(clientDolphin, 'send').yieldsTo('onFinished', []);

        dolphin.send("myCommand", {x: 42}).then(function() {
            sinon.assert.calledWith(clientDolphin.presentationModel, null, '@@@ DOLPHIN_PARAMETER @@@', sourceAttr, attr1, attr2);
            sinon.assert.calledWith(clientDolphin.send, "myCommand");
            done();
        });
    }));
});