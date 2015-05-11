"use strict";

var expect = require('chai').expect;

var classrepo = require('../src/classrepo.js');
var ClassRepository = classrepo.ClassRepository;
var UNKNOWN = classrepo.UNKNOWN;
var BASIC_TYPE = classrepo.BASIC_TYPE;
var DOLPHIN_BEAN = classrepo.DOLPHIN_BEAN;

//describe('ClassRepository load beans from Dolphin', function() {
//    it('boolean property', function() {
//        var classModel = {
//            id: 'classModel',
//            attributes: [
//                {propertyName: 'myProperty', onValueChange: function(callback) {callback()}}
//            ]
//        };
//        //var booleanTypeProperty = clientDolphin.attribute('booleanTypeProperty', null, UNKNOWN);
//        //var numberTypeProperty = clientDolphin.attribute('numberTypeProperty', null, UNKNOWN);
//        //var stringTypeProperty = clientDolphin.attribute('stringTypeProperty', null, UNKNOWN);
//        //var objectTypeProperty = clientDolphin.attribute('objectTypeProperty', null, UNKNOWN);
//        //var unknownTypeProperty = clientDolphin.attribute('objectEypeProperty', null, UNKNOWN);
//        //var classModel = clientDolphin.presentationModel('ClassA', '@@@ DOLPHIN_BEAN @@@',
//        //    booleanTypeProperty, numberTypeProperty, stringTypeProperty, objectTypeProperty, unknownTypeProperty
//        //);
//
//        var repository = new ClassRepository();
//        repository.registerClass(classModel);
//        booleanTypeProperty.setValue(BASIC_TYPE);
//        numberTypeProperty.setValue(BASIC_TYPE);
//        stringTypeProperty.setValue(BASIC_TYPE);
//        objectTypeProperty.setValue(DOLPHIN_BEAN);
//
//        var booleanProperty = clientDolphin.attribute('booleanProperty', null, false);
//        var numberProperty = clientDolphin.attribute('numberProperty', null, 0);
//        var stringProperty = clientDolphin.attribute('stringProperty', null, '');
//        var objectProperty = clientDolphin.attribute('objectProperty', null, null);
//        var unknownProperty = clientDolphin.attribute('objectProperty', null, null);
//        var beanModel = clientDolphin.presentationModel(null, 'ClassA',
//            booleanProperty, numberProperty, stringProperty, objectProperty, unknownProperty
//        );
//
//        var bean = repository.load(beanModel);
//        expect(booleanProperty.getValue()).to.be.false;
//        expect(bean.booleanProperty).to.be.false;
//
//        booleanProperty.setValue(true);
//        expect(booleanProperty.getValue()).to.be.true;
//        expect(bean.booleanProperty).to.be.true;
//
//        bean.booleanProperty = false;
//        expect(booleanProperty.getValue()).to.be.false;
//        expect(bean.booleanProperty).to.be.false;
//    });
//
//    it('load two beans of same type', function() {
//
//    });
//
//    it('load two beans of different types', function() {
//
//    });
//});

describe('ClassRepository.mapParamToDolphin()', function() {

    it('undefined', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin(undefined);
        expect(result).to.have.property('value', undefined);
        expect(result).to.have.property('type', UNKNOWN);
    });

    it('null', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin(null);
        expect(result).to.have.property('value', null);
        expect(result).to.have.property('type', UNKNOWN);
    });

    it('boolean true', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin(true);
        expect(result).to.have.property('value', true);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('boolean false', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin(false);
        expect(result).to.have.property('value', false);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('number 0', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin(0);
        expect(result).to.have.property('value', 0);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('number positive integer', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin(42);
        expect(result).to.have.property('value', 42);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('number negative float', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin(-0.1);
        expect(result).to.have.property('value', -0.1);
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('string', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin('42');
        expect(result).to.have.property('value', '42');
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    it('string (empty)', function() {
        var repository = new ClassRepository();
        var result = repository.mapParamToDolphin('');
        expect(result).to.have.property('value', '');
        expect(result).to.have.property('type', BASIC_TYPE);
    });

    // TODO Implement once it is possible to create beans on the client
    it('Dolphin Bean', function() {
    });

    it('arbitrary object', function() {
        var repository = new ClassRepository();
        expect(repository.mapParamToDolphin.bind(repository, {})).to.throw(TypeError);
    });

    it('array', function() {
        var repository = new ClassRepository();
        expect(repository.mapParamToDolphin.bind(repository, [])).to.throw(TypeError);
    });

    it('function', function() {
        var repository = new ClassRepository();
        expect(repository.mapParamToDolphin.bind(repository, function() {})).to.throw(TypeError);
    });
});
