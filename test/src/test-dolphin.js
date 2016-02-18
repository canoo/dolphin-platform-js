"use strict";

var sinon = require('sinon');
var connect = require('../../src/dolphin.js').connect;
var Connector = require('../../src/connector.js').Connector;
var BeanManager = require('../../src/beanmanager.js').BeanManager;
var ClassRepository = require('../../src/classrepo.js').ClassRepository;

describe('Dolphin Message Distribution', function() {

    var classRepository = null;
    var onModelStoreChange = null;

    var clientModelStore = { onModelStoreChange: function(cb) { onModelStoreChange = cb; } };

    var dolphin = {
        getClientModelStore: function() { return clientModelStore; },
        deletePresentationModel: function() {},
        startPushListening: function() {}
    };


    beforeEach(sinon.test(function() {
        //var openDolphinBuilder = new opendolphin.DolphinBuilder();
        //this.stub(openDolphinBuilder, "build").returns(dolphin);
        //this.stub(opendolphin, "makeDolphin").returns(openDolphinBuilder);

        classRepository = new ClassRepository(dolphin);
        new Connector('http://localhost', dolphin, classRepository);
    }));


    it('should call registerClass()', sinon.test(function() {
        classRepository.registerClass = this.spy();
        var model = {
            presentationModelType: '@@@ DOLPHIN_BEAN @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(classRepository.registerClass, model);
    }));


    it('should call unregisterClass()', sinon.test(function() {
        classRepository.unregisterClass = this.spy();
        var model = {
            presentationModelType: '@@@ DOLPHIN_BEAN @@@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(classRepository.unregisterClass, model);
    }));


    it('should call load()', sinon.test(function() {
        classRepository.load = this.stub().returns({});
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(classRepository.load, model);
    }));


    it('should call unload()', sinon.test(function() {
        classRepository.unload = this.stub().returns({});
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(classRepository.unload, model);
    }));


    it('should call spliceListEntry()', sinon.test(function() {
        classRepository.spliceListEntry = this.spy();
        this.spy(dolphin, "deletePresentationModel");
        var model = {
            presentationModelType: '@DP:LS@',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(classRepository.spliceListEntry, model);
        sinon.assert.calledWith(dolphin.deletePresentationModel, model);
    }));
});



describe('Dolphin Event Handling', function() {

    var classRepository = null;
    var beanManager = null;
    var onModelStoreChange = null;

    var clientModelStore = { onModelStoreChange: function(cb) { onModelStoreChange = cb; } };

    var dolphin = {
        getClientModelStore: function() { return clientModelStore; },
        deletePresentationModel: function() {},
        startPushListening: function() {}
    };


    beforeEach(sinon.test(function() {
        //var openDolphinBuilder = new opendolphin.DolphinBuilder();
        //this.stub(openDolphinBuilder, "build").returns(dolphin);
        //this.stub(opendolphin, "makeDolphin").returns(openDolphinBuilder);

        classRepository = new ClassRepository(dolphin);
        beanManager = new BeanManager(classRepository);
        new Connector('http://localhost', dolphin, classRepository);
    }));



    it('should call onAdded-handler for class', sinon.test(function() {
        var bean = {};
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        beanManager.onAdded('SomeClass', onAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(onAddedHandler, bean);
    }));


    it('should not call onAdded-handler for other class', sinon.test(function() {
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        beanManager.onAdded('SomeOtherClass', onAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.notCalled(onAddedHandler);
    }));


    it('should not call removed onAdded-handler', sinon.test(function() {
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        beanManager.onAdded('SomeClass', onAddedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.notCalled(onAddedHandler);
    }));


    it('should be able to add onAdded-handler within onAdded-handler', sinon.test(function() {
        var bean = {};
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var outerOnAddedHandler = function() {
            beanManager.onAdded('SomeClass', innerOnAddedHandler);
        };

        var subscription = beanManager.onAdded('SomeClass', outerOnAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnAddedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        sinon.assert.calledWith(innerOnAddedHandler, bean);
    }));


    it('should be able to remove onAdded-handler within onAdded-handler', sinon.test(function() {
        var bean = {};
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var innerSubscription = beanManager.onAdded('SomeClass', innerOnAddedHandler);
        var outerOnAddedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = beanManager.onAdded('SomeClass', outerOnAddedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnAddedHandler, bean);
        innerOnAddedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        sinon.assert.notCalled(innerOnAddedHandler);
    }));


    it('should call generic onAdded-handler', sinon.test(function() {
        var bean = {};
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        beanManager.onAdded(onAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(onAddedHandler, bean);
    }));


    it('should not call removed generic onAdded-handler', sinon.test(function() {
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onAddedHandler = this.spy();

        beanManager.onAdded(onAddedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.notCalled(onAddedHandler);
    }));


    it('should be able to add generic onAdded-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var outerOnAddedHandler = function() {
            beanManager.onAdded('SomeClass', innerOnAddedHandler);
        };

        var subscription = beanManager.onAdded('SomeClass', outerOnAddedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnAddedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
        sinon.assert.calledWith(innerOnAddedHandler, bean);
    }));


    it('should be able to remove generic onAdded-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        var model = {
            presentationModelType: 'SomeClass',
            attributes: [],
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnAddedHandler = this.spy();
        var innerSubscription = beanManager.onAdded(innerOnAddedHandler);
        var outerOnAddedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = beanManager.onAdded(outerOnAddedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnAddedHandler, bean);
        innerOnAddedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "ADDED"});
        sinon.assert.notCalled(innerOnAddedHandler);
    }));


    it('should call onRemoved-handler for class', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        beanManager.onRemoved('SomeClass', onRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(onRemovedHandler, bean);
    }));


    it('should not call onRemoved-handler for other class', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        beanManager.onRemoved('SomeOtherClass', onRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.notCalled(onRemovedHandler);
    }));


    it('should not call removed onRemoved-handler', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        beanManager.onRemoved('SomeClass', onRemovedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.notCalled(onRemovedHandler);
    }));


    it('should be able to add onRemoved-handler within onRemoved-handler', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var outerOnRemovedHandler = function() {
            beanManager.onRemoved('SomeClass', innerOnRemovedHandler);
        };

        var subscription = beanManager.onRemoved('SomeClass', outerOnRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnRemovedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
    }));


    it('should be able to remove onRemoved-handler within onRemoved-handler', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var innerSubscription = beanManager.onRemoved('SomeClass', innerOnRemovedHandler);
        var outerOnRemovedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = beanManager.onRemoved('SomeClass', outerOnRemovedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
        innerOnRemovedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        sinon.assert.notCalled(innerOnRemovedHandler);
    }));


    it('should call generic onRemoved-handler', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        beanManager.onRemoved(onRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(onRemovedHandler, bean);
    }));


    it('should not call removed generic onRemoved-handler', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var onRemovedHandler = this.spy();

        beanManager.onRemoved(onRemovedHandler).unsubscribe();
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.notCalled(onRemovedHandler);
    }));


    it('should be able to add generic onRemoved-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var outerOnRemovedHandler = function() {
            beanManager.onRemoved(innerOnRemovedHandler);
        };

        var subscription = beanManager.onRemoved(outerOnRemovedHandler);
        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        subscription.unsubscribe();
        sinon.assert.notCalled(innerOnRemovedHandler);

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
    }));


    it('should be able to remove generic onRemoved-handler within generic onAdded-handler', sinon.test(function() {
        var bean = {};
        classRepository.beanFromDolphin.get = this.stub().returns(bean);
        var model = {
            presentationModelType: 'SomeClass',
            findAttributeByPropertyName: this.stub().withArgs('@@@ SOURCE_SYSTEM @@@').returns({value: 'server'})
        };
        var innerOnRemovedHandler = this.spy();
        var innerSubscription = beanManager.onRemoved(innerOnRemovedHandler);
        var outerOnRemovedHandler = function () {
            innerSubscription.unsubscribe();
        };
        var outerSubscription = beanManager.onRemoved(outerOnRemovedHandler);

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        outerSubscription.unsubscribe();
        sinon.assert.calledWith(innerOnRemovedHandler, bean);
        innerOnRemovedHandler.reset();

        onModelStoreChange({clientPresentationModel: model, eventType: "REMOVED"});
        sinon.assert.notCalled(innerOnRemovedHandler);
    }));
});



describe('Dolphin Command', function() {

    var connector = null;
    var dolphin = null;
    var classRepository = null;

    beforeEach(sinon.test(function() {
        var clientModelStore = { onModelStoreChange: function(cb) {} };
        dolphin = {
            getClientModelStore: function() { return clientModelStore; },
            attribute: function() {},
            presentationModel: function() {},
            send: function() {},
            startPushListening: function() {}
        };

        classRepository = new ClassRepository(dolphin);
        this.server.respondImmediately = true;
        this.server.respondWith([200, {}, '']);
        connector = new Connector('http://localhost', dolphin, classRepository);
    }));


    it('should send command without parameters', sinon.test(function(done) {
        this.stub(dolphin, 'send').yieldsTo('onFinished', []);

        connector.invoke("myCommand").then(function() {
            sinon.assert.calledWith(dolphin.send, "myCommand");
            done();
        });
    }));
});