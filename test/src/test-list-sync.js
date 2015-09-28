"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');
var ClassRepository = require('../../src/classrepo.js').ClassRepository;
var BeanManager = require('../../src/beanmanager.js').BeanManager;


var UNKNOWN      = 0;
var BASIC_TYPE   = 1;
var DOLPHIN_BEAN = 2;


describe('List Sync primitives from OpenDolphin', function() {

    var classRepository = null;
    var beanManager = null;
    var bean = null;

    beforeEach(function() {
        var dolphin = {};

        classRepository = new ClassRepository(dolphin);
        beanManager = new BeanManager(classRepository);

        var classModel = {
            id: 'SourceClass',
            attributes: [
                { propertyName: 'primitiveList', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: BASIC_TYPE}) }
            ]
        };
        classRepository.registerClass(classModel);

        var sourceModel = {
            id: 'source_id',
            presentationModelType: 'SourceClass',
            attributes: [
                { propertyName: 'primitiveList', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ],
            findAttributeByPropertyName: function() {}
        };
        bean = classRepository.load(sourceModel);
    });



    it('should add entries', sinon.test(function() {
        var onArrayUpdateHandler = this.spy();
        beanManager.onArrayUpdate(onArrayUpdateHandler);

        var model = {
            findAttributeByPropertyName: this.stub()
        };
        var source    = { value: 'source_id' };
        var attribute = { value: 'primitiveList' };
        var pos       = { value: 0 };
        var element   = { value: 1 };
        model.findAttributeByPropertyName.withArgs('source').returns(source);
        model.findAttributeByPropertyName.withArgs('attribute').returns(attribute);
        model.findAttributeByPropertyName.withArgs('pos').returns(pos);
        model.findAttributeByPropertyName.withArgs('element').returns(element);

        classRepository.addListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 0, 0, 1);
        bean.primitiveList = [1];

        pos.value = 1;
        element.value = 2;
        classRepository.addListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 1, 0, 2);
        bean.primitiveList = [1, 2];

        element.value = 3;
        classRepository.addListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 1, 0, 3);
    }));


    it('should remove entries', sinon.test(function() {
        var onArrayUpdateHandler = this.spy();
        beanManager.onArrayUpdate(onArrayUpdateHandler);

        bean.primitiveList = [1, 2, 3];

        var model = {
            findAttributeByPropertyName: this.stub()
        };
        var source    = { value: 'source_id' };
        var attribute = { value: 'primitiveList' };
        var from      = { value: 1 };
        var to        = { value: 2 };
        model.findAttributeByPropertyName.withArgs('source').returns(source);
        model.findAttributeByPropertyName.withArgs('attribute').returns(attribute);
        model.findAttributeByPropertyName.withArgs('from').returns(from);
        model.findAttributeByPropertyName.withArgs('to').returns(to);

        classRepository.delListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 1, 1);
        bean.primitiveList = [1, 3];

        classRepository.delListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 1, 1);
        bean.primitiveList = [1];

        from.value = 0;
        to.value = 1;
        classRepository.delListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 0, 1);
    }));


    it('should update entries', sinon.test(function() {
        var onArrayUpdateHandler = this.spy();
        beanManager.onArrayUpdate(onArrayUpdateHandler);

        bean.primitiveList = [1, 2, 3];

        var model = {
            findAttributeByPropertyName: this.stub()
        };
        var source    = { value: 'source_id' };
        var attribute = { value: 'primitiveList' };
        var pos       = { value: 1 };
        var element   = { value: 42 };
        model.findAttributeByPropertyName.withArgs('source').returns(source);
        model.findAttributeByPropertyName.withArgs('attribute').returns(attribute);
        model.findAttributeByPropertyName.withArgs('pos').returns(pos);
        model.findAttributeByPropertyName.withArgs('element').returns(element);

        classRepository.setListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 1, 1, 42);
        bean.primitiveList = [1, 42, 3];

        pos.value = 2;
        element.value = 43;
        classRepository.setListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 2, 1, 43);
        bean.primitiveList = [1, 42, 43];

        pos.value = 0;
        element.value = 41;
        classRepository.setListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, bean, 'primitiveList', 0, 1, 41);
    }));

});


describe('List Sync reference lists from OpenDolphin', function() {

    var beanManager = null;
    var classRepository = null;
    var sourceBean = null;
    var bean1 = null;
    var bean2 = null;
    var bean3 = null;

    beforeEach(function() {
        var dolphin = {};

        classRepository = new ClassRepository(dolphin);
        beanManager = new BeanManager(classRepository);

        var simpleClassModel = {
            id: 'SimpleClass',
            attributes: [
                { propertyName: 'text', onValueChange: function() {} }
            ]
        };
        classRepository.registerClass(simpleClassModel);
        var complexClassModel = {
            id: 'ComplexClass',
            attributes: [
                { propertyName: 'referenceList', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: DOLPHIN_BEAN}) }
            ]
        };
        classRepository.registerClass(complexClassModel);

        var sourceModel = {
            id: 'source_id',
            presentationModelType: 'ComplexClass',
            attributes: [
                { propertyName: 'referenceList', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ],
            findAttributeByPropertyName: function() {}
        };
        sourceBean = classRepository.load(sourceModel);

        var bean1Model = {
            id: 'id1',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        bean1 = classRepository.load(bean1Model);
        var bean2Model = {
            id: 'id2',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        bean2 = classRepository.load(bean2Model);
        var bean3Model = {
            id: 'id3',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        bean3 = classRepository.load(bean3Model);
    });



    it('should add entries', sinon.test(function() {
        var onArrayUpdateHandler = this.spy();
        beanManager.onArrayUpdate(onArrayUpdateHandler);

        var model = {
            findAttributeByPropertyName: this.stub()
        };
        var source    = { value: 'source_id' };
        var attribute = { value: 'referenceList' };
        var pos       = { value: 0 };
        var element   = { value: 'id1' };
        model.findAttributeByPropertyName.withArgs('source').returns(source);
        model.findAttributeByPropertyName.withArgs('attribute').returns(attribute);
        model.findAttributeByPropertyName.withArgs('pos').returns(pos);
        model.findAttributeByPropertyName.withArgs('element').returns(element);

        classRepository.addListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 0, 0, bean1);
        sourceBean.referenceList = [bean1];

        pos.value = 1;
        element.value = 'id2';
        classRepository.addListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 1, 0, bean2);
        sourceBean.referenceList = [bean1, bean2];

        element.value = 'id3';
        classRepository.addListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 1, 0, bean3);
    }));


    it('should remove entries', sinon.test(function() {
        var onArrayUpdateHandler = this.spy();
        beanManager.onArrayUpdate(onArrayUpdateHandler);

        sourceBean.referenceList = [bean1, bean2, bean3];

        var model = {
            findAttributeByPropertyName: this.stub()
        };
        var source    = { value: 'source_id' };
        var attribute = { value: 'referenceList' };
        var from      = { value: 1 };
        var to        = { value: 2 };
        model.findAttributeByPropertyName.withArgs('source').returns(source);
        model.findAttributeByPropertyName.withArgs('attribute').returns(attribute);
        model.findAttributeByPropertyName.withArgs('from').returns(from);
        model.findAttributeByPropertyName.withArgs('to').returns(to);

        classRepository.delListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 1, 1);
        sourceBean.referenceList = [bean1, bean3];

        classRepository.delListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 1, 1);
        sourceBean.referenceList = [bean1];

        from.value = 0;
        to.value = 1;
        classRepository.delListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 0, 1);
    }));


    it('should update entries', sinon.test(function() {
        var onArrayUpdateHandler = this.spy();
        beanManager.onArrayUpdate(onArrayUpdateHandler);

        sourceBean.referenceList = [bean1, bean2, bean3];
        var bean11Model = {
            id: 'id11',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean11 = classRepository.load(bean11Model);
        var bean12Model = {
            id: 'id12',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean12 = classRepository.load(bean12Model);
        var bean13Model = {
            id: 'id13',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean13 = classRepository.load(bean13Model);

        var model = {
            findAttributeByPropertyName: this.stub()
        };
        var source    = { value: 'source_id' };
        var attribute = { value: 'referenceList' };
        var pos       = { value: 1 };
        var element   = { value: 'id12' };
        model.findAttributeByPropertyName.withArgs('source').returns(source);
        model.findAttributeByPropertyName.withArgs('attribute').returns(attribute);
        model.findAttributeByPropertyName.withArgs('pos').returns(pos);
        model.findAttributeByPropertyName.withArgs('element').returns(element);

        classRepository.setListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 1, 1, bean12);
        sourceBean.referenceList = [bean1, bean12, bean3];

        pos.value = 2;
        element.value = 'id13';
        classRepository.setListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 2, 1, bean13);
        sourceBean.referenceList = [bean1, bean12, bean13];

        pos.value = 0;
        element.value = 'id11';
        classRepository.setListEntry(model);
        sinon.assert.calledWith(onArrayUpdateHandler, sourceBean, 'referenceList', 0, 1, bean11);
    }));

});
