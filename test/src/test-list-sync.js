"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire =  require('proxyquire').noPreserveCache();

var UNKNOWN      = 0;
var BASIC_TYPE   = 1;
var DOLPHIN_BEAN = 2;

global.ObjectObserver = require('../../bower_components/observe-js/src/observe.js').ObjectObserver;


describe('List Sync primitives from OpenDolphin', function() {

    var classRepo = null;
    var bean = null;

    beforeEach(function() {
        var opendolphin = {
            Tag: { value: function() { return 'VALUE'} },
            '@noCallThru': true
        };

        var classrepojs = proxyquire('../src/classrepo.js', { 'opendolphin': opendolphin, 'ObjectObserver': ObjectObserver });
        classRepo = new classrepojs.ClassRepository();

        var classModel = {
            id: 'SourceClass',
            attributes: [
                { propertyName: 'primitiveList', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: BASIC_TYPE}) }
            ]
        };
        classRepo.registerClass(classModel);

        var sourceModel = {
            id: 'source_id',
            presentationModelType: 'SourceClass',
            attributes: [
                { propertyName: 'primitiveList', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ],
            findAttributeByPropertyName: function() {}
        };
        bean = classRepo.load(sourceModel);
    });



    it('should add entries', sinon.test(function() {
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

        classRepo.addListEntry(model);
        expect(bean.primitiveList).to.deep.equal([1]);

        pos.value = 1;
        element.value = 2;
        classRepo.addListEntry(model);
        expect(bean.primitiveList).to.deep.equal([1, 2]);

        element.value = 3;
        classRepo.addListEntry(model);
        expect(bean.primitiveList).to.deep.equal([1, 3, 2]);
    }));


    it('should remove entries', sinon.test(function() {
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

        classRepo.delListEntry(model);
        expect(bean.primitiveList).to.deep.equal([1, 3]);

        classRepo.delListEntry(model);
        expect(bean.primitiveList).to.deep.equal([1]);

        from.value = 0;
        to.value = 1;
        classRepo.delListEntry(model);
        expect(bean.primitiveList).to.deep.equal([]);
    }));


    it('should update entries', sinon.test(function() {
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

        classRepo.setListEntry(model);
        expect(bean.primitiveList).to.deep.equal([1, 42, 3]);

        pos.value = 2;
        element.value = 43;
        classRepo.setListEntry(model);
        expect(bean.primitiveList).to.deep.equal([1, 42, 43]);

        pos.value = 0;
        element.value = 41;
        classRepo.setListEntry(model);
        expect(bean.primitiveList).to.deep.equal([41, 42, 43]);
    }));

});


describe('List Sync reference lists from OpenDolphin', function() {

    var opendolphin;
    var classRepo = null;
    var sourceBean = null;
    var bean1 = null;
    var bean2 = null;
    var bean3 = null;

    beforeEach(function() {
        opendolphin = {
            Tag: { value: function() { return 'VALUE'} },
            '@noCallThru': true
        };

        var classrepojs = proxyquire('../src/classrepo.js', { 'opendolphin': opendolphin, 'ObjectObserver': ObjectObserver });
        classRepo = new classrepojs.ClassRepository();

        var simpleClassModel = {
            id: 'SimpleClass',
            attributes: [
                { propertyName: 'text', onValueChange: function() {} }
            ]
        };
        classRepo.registerClass(simpleClassModel);
        var complexClassModel = {
            id: 'ComplexClass',
            attributes: [
                { propertyName: 'referenceList', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: DOLPHIN_BEAN}) }
            ]
        };
        classRepo.registerClass(complexClassModel);

        var sourceModel = {
            id: 'source_id',
            presentationModelType: 'ComplexClass',
            attributes: [
                { propertyName: 'referenceList', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ],
            findAttributeByPropertyName: function() {}
        };
        sourceBean = classRepo.load(sourceModel);

        var bean1Model = {
            id: 'id1',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        bean1 = classRepo.load(bean1Model);
        var bean2Model = {
            id: 'id2',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        bean2 = classRepo.load(bean2Model);
        var bean3Model = {
            id: 'id3',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        bean3 = classRepo.load(bean3Model);
    });



    it('should add entries', sinon.test(function() {
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

        classRepo.addListEntry(model);
        expect(sourceBean.referenceList).to.deep.equal([bean1]);

        pos.value = 1;
        element.value = 'id2';
        classRepo.addListEntry(model);
        expect(sourceBean.referenceList).to.deep.equal([bean1, bean2]);

        element.value = 'id3';
        classRepo.addListEntry(model);
        expect(sourceBean.referenceList).to.deep.equal([bean1, bean3, bean2]);
    }));


    it('should remove entries', sinon.test(function() {
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

        classRepo.delListEntry(model);
        expect(sourceBean.referenceList).to.deep.equal([bean1, bean3]);

        classRepo.delListEntry(model);
        expect(sourceBean.referenceList).to.deep.equal([bean1]);

        from.value = 0;
        to.value = 1;
        classRepo.delListEntry(model);
        expect(sourceBean.referenceList).to.deep.equal([]);
    }));


    it('should update entries', sinon.test(function() {
        sourceBean.primitiveList = [bean1, bean2, bean3];
        var bean11Model = {
            id: 'id11',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean11 = classRepo.load(bean11Model);
        var bean12Model = {
            id: 'id12',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean12 = classRepo.load(bean12Model);
        var bean13Model = {
            id: 'id13',
            presentationModelType: 'SimpleClass',
            attributes: [
                { propertyName: 'textProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean13 = classRepo.load(bean13Model);

        var model = {
            findAttributeByPropertyName: this.stub()
        };
        var source    = { value: 'source_id' };
        var attribute = { value: 'referenceList' };
        var pos       = { value: 1 };
        var element   = { value: bean12 };
        model.findAttributeByPropertyName.withArgs('source').returns(source);
        model.findAttributeByPropertyName.withArgs('attribute').returns(attribute);
        model.findAttributeByPropertyName.withArgs('pos').returns(pos);
        model.findAttributeByPropertyName.withArgs('element').returns(element);

        classRepo.setListEntry(model);
        expect(sourceBean.primitiveList).to.deep.equal([bean1, bean12, bean3]);

        pos.value = 2;
        element.value = bean13;
        classRepo.setListEntry(model);
        expect(sourceBean.primitiveList).to.deep.equal([bean1, bean12, bean13]);

        pos.value = 0;
        element.value = bean11;
        classRepo.setListEntry(model);
        expect(sourceBean.primitiveList).to.deep.equal([bean11, bean12, bean13]);
    }));

});
