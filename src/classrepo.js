/*jslint browserify: true */
/* global opendolphin, console, ObjectObserver */
"use strict";

// TODO: Remove ENUM
// TODO: Optimize property.fromDolphin and property.toDolphin

require('./polyfills.js');
require('../bower_components/observe-js/src/observe.js');
var Map  = require('../bower_components/core.js/library/fn/map');

var exists = require('./utils.js').exists;

var UNKNOWN = 0,
    BASIC_TYPE = 1,
    ENUM = 2,
    DOLPHIN_BEAN = 3;

function identity(value) {
    return value;
}

function setValue(property, value) {
    if (exists(value)) {
        property.type = value;
    }
}

function setValueType(repository, property, value) {
    if (!exists(value)) {
        return;
    }

    switch (value) {
        case ENUM:
            property.fromDolphin = function (ord) {
                var enumInfo = repository.enums.get(property.type);
                return exists(enumInfo) ? enumInfo.fromDolphin[ord] : null;
            };
            property.toDolphin = function (value) {
                var enumInfo = repository.enums.get(property.type);
                return exists(enumInfo) ? enumInfo.toDolphin.get(value) : null;
            };
            break;
        case DOLPHIN_BEAN:
            property.fromDolphin = function (id) {
                return repository.beanFromDolphin.get(id);
            };
            property.toDolphin = function (bean) {
                return repository.beanToDolphin.get(bean);
            };
            break;
    }
}


function modifyList(bean, attribute, from, count, newElements) {
    var list = bean[attribute];
    if (!exists(list)) {
        bean[attribute] = list = [];
    } else if (!Array.isArray(list)) {
        bean[attribute] = list = [list];
    }
    list.splice(from, count, newElements);
}


function ClassRepository() {
    this.classes = new Map();
    this.beanFromDolphin = new Map();
    this.beanToDolphin = new Map();
    this.enums = new Map();
    this.classInfos = new Map();
}


ClassRepository.prototype.registerClass = function (model) {
    var _this = this;
    if (this.classes.has(model.id)) {
        return;
    }
    console.debug('ClassRepository.registerClass', model);

    var classInfo = {};
    model.attributes.forEach(function (attribute) {
        var property = classInfo[attribute.propertyName];
        if (!exists(property)) {
            property = classInfo[attribute.propertyName] = {
                fromDolphin: identity,
                toDolphin: identity
            };
        }

        switch (attribute.tag) {
            case opendolphin.Tag.valueType():
                attribute.onValueChange(function (event) {
                    if (event.oldValue !== event.newValue) {
                        setValueType(_this, property, event.newValue);
                    }
                });
                break;
            case opendolphin.Tag.value():
                attribute.onValueChange(function (event) {
                    if (event.oldValue !== event.newValue) {
                        setValue(property, event.newValue);
                    }
                });
                break;
        }
    });
    this.classes.set(model.id, classInfo);
};


ClassRepository.prototype.registerEnum = function (model) {
    if (this.enums.has(model.id)) {
        return;
    }
    console.debug('ClassRepository.registerEnum', model);

    var enumInfoFromDolphin = [];
    var enumInfoToDolphin = new Map();
    model.attributes.forEach(function (attribute) {
        var index = parseInt(attribute.propertyName);
        enumInfoFromDolphin[index] = attribute.value;
        enumInfoToDolphin.set(attribute.value, index);
    });
    var enumInfo = {
        fromDolphin: enumInfoFromDolphin,
        toDolphin: enumInfoToDolphin
    };
    this.enums.set(model.id, enumInfo);
};


ClassRepository.prototype.unregisterClass = function (model) {
    console.debug('ClassRepository.unregisterClass', model);
    this.classes['delete'](model.id);
};


ClassRepository.prototype.unregisterEnum = function (model) {
    console.debug('ClassRepository.unregisterEnum', model);
    this.enums['delete'](model.id);
};


ClassRepository.prototype.load = function (model) {
    console.debug('ClassRepository.load():', model);
    var classInfo = this.classes.get(model.presentationModelType);
    var bean = {};
    model.attributes.filter(function (attribute) {
        return attribute.tag === opendolphin.Tag.value();
    }).forEach(function (attribute) {
        attribute.onValueChange(function (event) {
            if (event.oldValue !== event.newValue) {
                bean[attribute.propertyName] = classInfo[attribute.propertyName].fromDolphin(event.newValue);
            }
        });
    });
    var observer = new ObjectObserver(bean);
    observer.open(function (added, removed, changed) {
        Object.keys(added).forEach(function (property) {
            var attribute = model.findAttributeByPropertyName(property);
            if (exists(attribute)) {
                var value = classInfo[property].toDolphin(added[property]);
                attribute.setValue(value);
            }
        });
        Object.keys(removed).forEach(function (property) {
            var attribute = model.findAttributeByPropertyName(property);
            if (exists(attribute)) {
                attribute.setValue(null);
            }
        });
        Object.keys(changed).forEach(function (property) {
            var attribute = model.findAttributeByPropertyName(property);
            if (exists(attribute)) {
                var value = classInfo[property].toDolphin(changed[property]);
                attribute.setValue(value);
            }
        });
    });
    this.beanFromDolphin.set(model.id, bean);
    this.beanToDolphin.set(bean, model.id);
    this.classInfos.set(model.id, classInfo);
    return bean;
};


ClassRepository.prototype.unload = function(model) {
    console.debug('ClassRepository.unload():', model);
    var bean = this.beanFromDolphin.get(model.id);
    this.beanFromDolphin['delete'](model.id);
    this.beanToDolphin['delete'](bean);
    this.classInfos['delete'](model.id);
    return bean;
};


ClassRepository.prototype.addListEntry = function(model) {
    console.debug('ClassRepository.addListEntry', model);
    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var pos = model.findAttributeByPropertyName('pos');
    var element = model.findAttributeByPropertyName('element');

    if (exists(source) && exists(attribute) && exists(pos) && exists(element)) {
        var classInfo = this.classInfos.get(source.value);
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean) && exists(classInfo)) {
            var entry = classInfo[attribute.value].fromDolphin(element.value);
            modifyList(bean, attribute.value, pos.value, 0, entry);
        } else {
            console.error("Invalid list modification update received. Source bean unknown.", model);
        }
    } else {
        console.error("Invalid list modification update received", model);
    }
};


ClassRepository.prototype.delListEntry = function(model) {
    console.debug('ClassRepository.delListEntry', model);
    var source = model.findAttributeByPropertyName('source').value;
    var attribute = model.findAttributeByPropertyName('attribute').value;
    var from = model.findAttributeByPropertyName('from').value;
    var to = model.findAttributeByPropertyName('to').value;

    if (exists(source) && exists(attribute) && exists(from) && exists(to)) {
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean)) {
            modifyList(bean, attribute.value, from.value, to.value - from.value);
        } else {
            console.error("Invalid list modification update received. Source bean unknown.", model);
        }
    } else {
        console.error("Invalid list modification update received", model);
    }
};


ClassRepository.prototype.setListEntry = function(model) {
    console.debug('ClassRepository.setListEntry', model);
    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var pos = model.findAttributeByPropertyName('pos');
    var element = model.findAttributeByPropertyName('element');

    if (exists(source) && exists(attribute) && exists(pos) && exists(element)) {
        var classInfo = this.classInfos.get(source.value);
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean) && exists(classInfo)) {
            var entry = classInfo[attribute.value].fromDolphin(element.value);
            modifyList(bean, attribute.value, pos.value, 1, entry);
        } else {
            console.error("Invalid list modification update received. Source bean unknown.", model);
        }
    }else {
        console.error("Invalid list modification update received", model);
    }
};


exports.ClassRepository = ClassRepository;
