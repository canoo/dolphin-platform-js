"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');

var UNKNOWN      = 0;
var BASIC_TYPE   = 1;
var DOLPHIN_BEAN = 2;

var ClassRepository = require('../../src/classrepo.js').ClassRepository;


describe('ClassRepository primitive properties', function() {

    var dolphin = {
        findPresentationModelById: function() {}
    };
    var classRepo = null;
    var classModel = null;

    beforeEach(function() {
        classRepo = new ClassRepository(dolphin);
        classModel = {
            id: 'ComplexClass',
            attributes: [
                { propertyName: 'booleanProperty', onValueChange: function() {} },
                { propertyName: 'floatProperty', onValueChange: function() {} },
                { propertyName: 'integerProperty', onValueChange: function() {} },
                { propertyName: 'stringProperty', onValueChange: function() {} }
            ]
        };
        classRepo.registerClass(classModel);
    });



    it('should initialize', sinon.test(function() {
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                { propertyName: 'booleanProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} },
                { propertyName: 'floatProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} },
                { propertyName: 'integerProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} },
                { propertyName: 'stringProperty', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean = classRepo.load(beanModel);
        expect(bean.booleanProperty).to.be.null;
        expect(bean.floatProperty).to.be.null;
        expect(bean.integerProperty).to.be.null;
        expect(bean.stringProperty).to.be.null;
    }));

    it('can be set from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);

        classModel = {
            id: 'TypedComplexClass',
            attributes: [
                { propertyName: 'booleanProperty', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: BASIC_TYPE}) },
                { propertyName: 'floatProperty', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: BASIC_TYPE}) },
                { propertyName: 'integerProperty', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: BASIC_TYPE}) },
                { propertyName: 'stringProperty', onValueChange: sinon.stub().yields({oldValue: UNKNOWN, newValue: BASIC_TYPE}) }
            ]
        };
        classRepo.registerClass(classModel);
        var beanModel = {
            presentationModelType: 'TypedComplexClass',
            attributes: [
                {
                    propertyName: 'booleanProperty',
                    tag: opendolphin.Tag.value(),
                    onValueChange: this.stub().yields({oldValue: null, newValue: true})
                },
                {
                    propertyName: 'floatProperty',
                    tag: opendolphin.Tag.value(),
                    onValueChange: this.stub().yields({oldValue: null, newValue: 3.1415})
                },
                {
                    propertyName: 'integerProperty',
                    tag: opendolphin.Tag.value(),
                    onValueChange: this.stub().yields({oldValue: null, newValue: 42})
                },
                {
                    propertyName: 'stringProperty',
                    tag: opendolphin.Tag.value(),
                    onValueChange: this.stub().yields({oldValue: null, newValue: "Hello World"})
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        sinon.assert.callCount(onBeanUpdateHandler, 4);
        sinon.assert.calledWith(onBeanUpdateHandler, 'TypedComplexClass', bean, 'booleanProperty', true, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'TypedComplexClass', bean, 'floatProperty', 3.1415, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'TypedComplexClass', bean, 'integerProperty', 42, null);
        sinon.assert.calledWith(onBeanUpdateHandler, 'TypedComplexClass', bean, 'stringProperty', "Hello World", null);
    }));

    it('boolean can be set from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'booleanProperty',
            tag: opendolphin.Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                expect(newValue).to.be.true;
                done();
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('booleanProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'booleanProperty', true);
    }));

    it('float can be set from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'floatProperty',
            tag: opendolphin.Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                expect(newValue).to.be.closeTo(2.7182, 1e-6);
                done();
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('floatProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'floatProperty', 2.7182);
    }));

    it('integer can be set from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'integerProperty',
            tag: opendolphin.Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                expect(newValue).to.equal(4711);
                done();
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('integerProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'integerProperty', 4711);
    }));

    it('string can be set from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'stringProperty',
            tag: opendolphin.Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                expect(newValue).to.equal("Good Bye!");
                done();
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('stringProperty').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'stringProperty', "Good Bye!");
    }));
});


describe('ClassRepository Dolphin Bean properties', function() {

    var dolphin = {
        findPresentationModelById: function() {}
    };
    var classRepo = null;
    var bean1 = null;
    var bean2 = null;
    var complexClassModel = null;

    beforeEach(function() {
        classRepo = new ClassRepository(dolphin);

        var simpleClassModel = {
            id: 'SimpleClass',
            attributes: [
                { propertyName: 'text', onValueChange: function() {} }
            ]
        };
        classRepo.registerClass(simpleClassModel);
        complexClassModel = {
            id: 'ComplexClass',
            attributes: [
                { propertyName: 'reference', onValueChange: function() {} }
            ]
        };
        classRepo.registerClass(complexClassModel);
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
    });



    it('should initialize', sinon.test(function() {
        var beanModel = {
            presentationModelType: 'ComplexClass',
            attributes: [
                { propertyName: 'reference', tag: opendolphin.Tag.value(), onValueChange: function() {} }
            ]
        };
        var bean = classRepo.load(beanModel);
        expect(bean.reference).to.be.null;
    }));

    it('can be set from opendolphin', sinon.test(function() {
        var onBeanUpdateHandler = this.spy();
        classRepo.onBeanUpdate(onBeanUpdateHandler);

        complexClassModel = {
            id: 'TypedComplexClass',
            attributes: [
                { propertyName: 'reference', onValueChange: this.stub().yields({oldValue: UNKNOWN, newValue: DOLPHIN_BEAN}) }
            ]
        };
        classRepo.registerClass(complexClassModel);
        var beanModel = {
            presentationModelType: 'TypedComplexClass',
            attributes: [
                {
                    propertyName: 'reference',
                    tag: opendolphin.Tag.value(),
                    onValueChange: this.stub().yields({oldValue: null, newValue: 'id1'})
                }
            ]
        };
        var bean = classRepo.load(beanModel);
        sinon.assert.calledWithExactly(onBeanUpdateHandler, 'TypedComplexClass', bean, 'reference', bean1, null);
    }));

    it('reference can be set from user', sinon.test(function(done) {
        this.stub(dolphin, 'findPresentationModelById');
        var attribute =  {
            propertyName: 'reference',
            tag: opendolphin.Tag.value(),
            onValueChange: function() {},
            setValue: function(newValue) {
                expect(newValue).to.equal('id2');
                done();
            },
            getValue: this.stub()
        };
        var beanModel = {
            id: 'myId',
            presentationModelType: 'ComplexClass',
            attributes: [ attribute ],
            findAttributeByPropertyName: this.stub().withArgs('reference').returns(attribute)
        };
        dolphin.findPresentationModelById.returns(beanModel);
        attribute.getValue.returns(null);
        var bean = classRepo.load(beanModel);
        classRepo.notifyBeanChange(bean, 'reference', bean2);
    }));

});


describe('ClassRepository.mapParamToDolphin()', function() {

    it('undefined', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin(undefined);
        expect(result).to.have.property('value', undefined);
        expect(result).to.have.property('type', UNKNOWN);
    });

    it('null', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin(null);
        expect(result).to.have.property('value', null);
        expect(result).to.have.property('type', UNKNOWN);
    });

    it('boolean true', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin(true);
        expect(result).to.have.property('value', true);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('boolean false', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin(false);
        expect(result).to.have.property('value', false);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('number 0', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin(0);
        expect(result).to.have.property('value', 0);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('number positive integer', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin(42);
        expect(result).to.have.property('value', 42);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('number negative float', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin(-0.1);
        expect(result).to.have.property('value', -0.1);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('string', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin('42');
        expect(result).to.have.property('value', '42');
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('string (empty)', function() {
        var classRepo = new ClassRepository();
        var result = classRepo.mapParamToDolphin('');
        expect(result).to.have.property('value', '');
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    // TODO Implement once it is possible to create beans on the client
    it('Dolphin Bean', function() {
    });

    it('arbitrary object', function() {
        var classRepo = new ClassRepository();
        expect(function() {classRepo.mapParamToDolphin({})}).to.throw(TypeError);
    });

    it('array', function() {
        var classRepo = new ClassRepository();
        expect(function() {classRepo.mapParamToDolphin([])}).to.throw(TypeError);
    });

    it('function', function() {
        var classRepo = new ClassRepository();
        expect(function() {classRepo.mapParamToDolphin(function() {})}).to.throw(TypeError);
    });
});
