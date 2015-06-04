"use strict";

var sinon = require('sinon');
var connect = require('../../src/dolphin.js').connect;

describe('Dolphin Message Distribution', sinon.test(function() {

    var onModelStoreChange = null;
    var dolphin = null;

    var clientModelStore = {
        onModelStoreChange: function(cb) { onModelStoreChange = cb; },
        deletePresentationModel: function() {}
    };

    this.stub(opendolphin, "dolphin").returns(
        {
            getClientModelStore: function() {
                return clientModelStore;
            }
        }
    );

    beforeEach(function() {
        dolphin = connect("http://localhost");
        if (typeof onModelStoreChange !== 'function') {
            throw new Error('Initialisation of opendolphin failed');
        }
    });

    afterEach(function() {
        dolphin.shutdown();
    });



    it('should call registerClass()', sinon.test(function() {
        dolphin.classRepository.registerClass = this.spy();
        var model = { presentationModelType: '@@@ DOLPHIN_BEAN @@@' };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.registerClass, model);
    }));


    it('should call unregisterClass()', sinon.test(function() {
        dolphin.classRepository.unregisterClass = this.spy();
        var model = { presentationModelType: '@@@ DOLPHIN_BEAN @@@' };

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(dolphin.classRepository.unregisterClass, model);
    }));


    it('should call load()', sinon.test(function() {
        dolphin.classRepository.load = this.stub().returns({});
        var model = { presentationModelType: 'SomeClass' };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.load, model);
    }));


    it('should call unload()', sinon.test(function() {
        dolphin.classRepository.unload = this.stub().returns({});
        var model = { presentationModelType: 'SomeClass' };

        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });

        sinon.assert.calledWith(dolphin.classRepository.unload, model);
    }));


    it('should call addListEntry()', sinon.test(function() {
        dolphin.classRepository.addListEntry = this.spy();
        this.spy(clientModelStore, "deletePresentationModel");
        var model = { presentationModelType: '@@@ LIST_ADD_FROM_SERVER @@@' };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.addListEntry, model);
        sinon.assert.calledWith(clientModelStore.deletePresentationModel, model);
    }));


    it('should call delListEntry()', sinon.test(function() {
        dolphin.classRepository.delListEntry = this.spy();
        this.spy(clientModelStore, "deletePresentationModel");
        var model = { presentationModelType: '@@@ LIST_DEL_FROM_SERVER @@@' };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.delListEntry, model);
        sinon.assert.calledWith(clientModelStore.deletePresentationModel, model);
    }));


    it('should call setListEntry()', sinon.test(function() {
        dolphin.classRepository.setListEntry = this.spy();
        this.spy(clientModelStore, "deletePresentationModel");
        var model = { presentationModelType: '@@@ LIST_SET_FROM_SERVER @@@' };

        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });

        sinon.assert.calledWith(dolphin.classRepository.setListEntry, model);
        sinon.assert.calledWith(clientModelStore.deletePresentationModel, model);
    }));
}));



//describe('Dolphin Event Handling', function() {
//
//    var onModelStoreChange = null;
//    var dolphin = null;
//
//    beforeEach(function() {
//        var clientModelStore = { onModelStoreChange: function(cb) { onModelStoreChange = cb; } };
//        var opendolphin = { getClientModelStore: function() { return clientModelStore; } };
//        var opendolphinStub = {
//            dolphin: function() { return opendolphin },
//            Type: { ADDED: "ADDED", REMOVED: "REMOVED" },
//            '@noCallThru': true
//        };
//        var classrepoStub = {
//            ClassRepository: function () { },
//            '@noCallThru': true
//        };
//
//        var dolphinjs = proxyquire('../src/dolphin.js', { 'opendolphin': opendolphinStub, './classrepo.js': classrepoStub });
//        var connect = dolphinjs.connect;
//        dolphin = connect("http://localhost");
//        if (typeof onModelStoreChange !== 'function') {
//            throw new Error('Initialisation of opendolphin failed');
//        }
//    });
//
//    afterEach(function() {
//        dolphin.shutdown();
//    });
//
//
//
//    it('should call onAdded-handler for class', sinon.test(function() {
//        var bean = {};
//        dolphin.classRepository.load = this.stub().returns(bean);
//        var model = { presentationModelType: 'SomeClass' };
//        var onAddedHandler = this.spy();
//
//        dolphin.onAdded('SomeClass', onAddedHandler);
//        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
//
//        sinon.assert.calledWith(onAddedHandler, bean);
//    }));
//
//
//    it('should not call onAdded-handler for other class', sinon.test(function() {
//        var bean = {};
//        dolphin.classRepository.load = this.stub().returns(bean);
//        var model = { presentationModelType: 'SomeClass' };
//        var onAddedHandler = this.spy();
//
//        dolphin.onAdded('SomeOtherClass', onAddedHandler);
//        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
//
//        sinon.assert.notCalled(onAddedHandler);
//    }));
//
//
//    it('should call generic onAdded-handler', sinon.test(function() {
//        var bean = {};
//        dolphin.classRepository.load = this.stub().returns(bean);
//        var model = { presentationModelType: 'SomeClass' };
//        var onAddedHandler = this.spy();
//
//        dolphin.onAdded(onAddedHandler);
//        onModelStoreChange({ clientPresentationModel: model, eventType: "ADDED" });
//
//        sinon.assert.calledWith(onAddedHandler, bean);
//    }));
//
//
//    it('should call onRemoved-handler for class', sinon.test(function() {
//        var bean = {};
//        dolphin.classRepository.unload = this.stub().returns(bean);
//        var model = { presentationModelType: 'SomeClass' };
//        var onRemovedHandler = this.spy();
//
//        dolphin.onRemoved('SomeClass', onRemovedHandler);
//        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
//
//        sinon.assert.calledWith(onRemovedHandler, bean);
//    }));
//
//
//    it('should not call onRemoved-handler for other class', sinon.test(function() {
//        var bean = {};
//        dolphin.classRepository.unload = this.stub().returns(bean);
//        var model = { presentationModelType: 'SomeClass' };
//        var onRemovedHandler = this.spy();
//
//        dolphin.onRemoved('SomeOtherClass', onRemovedHandler);
//        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
//
//        sinon.assert.notCalled(onRemovedHandler);
//    }));
//
//
//    it('should call generic onRemoved-handler', sinon.test(function() {
//        var bean = {};
//        dolphin.classRepository.unload = this.stub().returns(bean);
//        var model = { presentationModelType: 'SomeClass' };
//        var onRemovedHandler = this.spy();
//
//        dolphin.onRemoved(onRemovedHandler);
//        onModelStoreChange({ clientPresentationModel: model, eventType: "REMOVED" });
//
//        sinon.assert.calledWith(onRemovedHandler, bean);
//    }));
//});



//describe('Dolphin Command', function() {
//
//    var dolphin = null;
//    var opendolphin = null;
//
//    beforeEach(function() {
//        opendolphin = {
//            getClientModelStore: function() {
//                return {
//                    onModelStoreChange: function() {}
//                };
//            },
//            attribute: function() {},
//            presentationModel: function() {},
//            send: function() {}
//        };
//        var opendolphinStub = {
//            dolphin: function() { return opendolphin },
//            Type: { ADDED: "ADDED", REMOVED: "REMOVED" },
//            '@noCallThru': true
//        };
//
//        var classrepoStub = {
//            ClassRepository: function () { },
//            '@noCallThru': true
//        };
//
//        var dolphinjs = proxyquire('../src/dolphin.js', { 'opendolphin': opendolphinStub, './classrepo.js': classrepoStub });
//
//        var connect = dolphinjs.connect;
//        dolphin = connect("http://localhost");
//    });
//
//    afterEach(function() {
//        dolphin.shutdown();
//    });
//
//
//
//    it('should send command without parameters', sinon.test(function() {
//        this.spy(opendolphin, 'send');
//
//        dolphin.send("myCommand");
//
//        sinon.assert.calledWith(opendolphin.send, "myCommand");
//    }));
//
//
//    it('should send command with one named parameter', sinon.test(function() {
//        dolphin.classRepository.mapParamToDolphin = this.stub().withArgs(42).returns({value: 42, type: 'number'});
//        var attrFactory = this.stub(opendolphin, 'attribute');
//        var attr1 = {};
//        var attr2 = {};
//        attrFactory.withArgs('x', null, 42, 'VALUE').returns(attr1);
//        attrFactory.withArgs('x', null, 'number', 'VALUE_TYPE').returns(attr2);
//        this.spy(opendolphin, 'presentationModel');
//        this.spy(opendolphin, 'send');
//
//        dolphin.send("myCommand", {x: 42});
//
//        sinon.assert.calledWith(opendolphin.presentationModel, null, '@@@ DOLPHIN_PARAMETER @@@', attr1, attr2);
//        sinon.assert.calledWith(opendolphin.send, "myCommand");
//    }));
//});