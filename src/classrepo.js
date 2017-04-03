/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browserify: true */
/* global Platform, console */
"use strict";

var Map = require('../bower_components/core.js/library/fn/map');
var consts = require('./constants');

var utils = require('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;

var blocked = null;

function fixType(type, value) {
    switch (type) {
        case consts.BYTE:
        case consts.SHORT:
        case consts.INT:
        case consts.LONG:
            return parseInt(value);
        case consts.FLOAT:
        case consts.DOUBLE:
            return parseFloat(value);
        case consts.BOOLEAN:
            return 'true' === String(value).toLowerCase();
        case consts.STRING:
        case consts.ENUM:
            return String(value);
        default:
            return value;
    }
}

function fromDolphin(classRepository, type, value) {
    if (! exists(value)) {
        return null;
    }
    switch (type) {
        case consts.DOLPHIN_BEAN:
            return classRepository.beanFromDolphin.get(String(value));
        case consts.DATE:
            return new Date(String(value));
        case consts.CALENDAR:
            return new Date(String(value));
        case consts.LOCAL_DATE_FIELD_TYPE:
            return new Date(String(value));
        case consts.LOCAL_DATE_TIME_FIELD_TYPE:
            return new Date(String(value));
        case consts.ZONED_DATE_TIME_FIELD_TYPE:
            return new Date(String(value));
        default:
            return fixType(type, value);
    }
}

function toDolphin(classRepository, type, value) {
    if (! exists(value)) {
        return null;
    }
    switch (type) {
        case consts.DOLPHIN_BEAN:
            return classRepository.beanToDolphin.get(value);
        case consts.DATE:
            return value instanceof Date? value.toISOString() : value;
        case consts.CALENDAR:
            return value instanceof Date? value.toISOString() : value;
        case consts.LOCAL_DATE_FIELD_TYPE:
            return value instanceof Date? value.toISOString() : value;
        case consts.LOCAL_DATE_TIME_FIELD_TYPE:
            return value instanceof Date? value.toISOString() : value;
        case consts.ZONED_DATE_TIME_FIELD_TYPE:
            return value instanceof Date? value.toISOString() : value;
        default:
            return fixType(type, value);
    }
}

function sendListSplice(classRepository, modelId, propertyName, from, to, newElements) {
    var dolphin = classRepository.dolphin;
    var model = dolphin.findPresentationModelById(modelId);
    if (exists(model)) {
        var classInfo = classRepository.classes.get(model.presentationModelType);
        var type = classInfo[propertyName];
        if (exists(type)) {

            var attributes = [
                dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'),
                dolphin.attribute('source', null, modelId),
                dolphin.attribute('attribute', null, propertyName),
                dolphin.attribute('from', null, from),
                dolphin.attribute('to', null, to),
                dolphin.attribute('count', null, newElements.length)
            ];
            newElements.forEach(function(element, index) {
                attributes.push(dolphin.attribute(index.toString(), null, toDolphin(classRepository, type, element)));
            });
            dolphin.presentationModel.apply(dolphin, [null, '@DP:LS@'].concat(attributes));
        }
    }
}

function validateList(classRepository, type, bean, propertyName) {
    var list = bean[propertyName];
    if (!exists(list)) {
        classRepository.propertyUpdateHandlers.forEach(function(handler) {
            try {
                handler(type, bean, propertyName, [], undefined);
            } catch(e) {
                console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
            }
        });
    }
}

function block(bean, propertyName) {
    if (exists(blocked)) {
        throw new Error('Trying to create a block while another block exists');
    }
    blocked = {
        bean: bean,
        propertyName: propertyName
    };
}

function isBlocked(bean, propertyName) {
    return exists(blocked) && blocked.bean === bean && blocked.propertyName === propertyName;
}

function unblock() {
    blocked = null;
}


function ClassRepository(dolphin) {
    checkMethod('ClassRepository(dolphin)');
    checkParam(dolphin, 'dolphin');

    this.dolphin = dolphin;
    this.classes = new Map();
    this.beanFromDolphin = new Map();
    this.beanToDolphin = new Map();
    this.classInfos = new Map();
    this.beanAddedHandlers = [];
    this.beanRemovedHandlers = [];
    this.propertyUpdateHandlers = [];
    this.arrayUpdateHandlers = [];
}


ClassRepository.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    checkMethod('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');

    var modelId = this.beanToDolphin.get(bean);
    if (exists(modelId)) {
        var model = this.dolphin.findPresentationModelById(modelId);
        if (exists(model)) {
            var classInfo = this.classes.get(model.presentationModelType);
            var type = classInfo[propertyName];
            var attribute = model.findAttributeByPropertyName(propertyName);
            if (exists(type) && exists(attribute)) {
                var oldValue = attribute.getValue();
                attribute.setValue(toDolphin(this, type, newValue));
                return fromDolphin(this, type, oldValue);
            }
        }
    }
};


ClassRepository.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    checkMethod('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');
    checkParam(index, 'index');
    checkParam(count, 'count');
    checkParam(removedElements, 'removedElements');

    if (isBlocked(bean, propertyName)) {
        return;
    }
    var modelId = this.beanToDolphin.get(bean);
    var array = bean[propertyName];
    if (exists(modelId) && exists(array)) {
        var removedElementsCount = Array.isArray(removedElements)? removedElements.length : 0;
        sendListSplice(this, modelId, propertyName, index, index + removedElementsCount, array.slice(index, index + count));
    }
};


ClassRepository.prototype.onBeanAdded = function(handler) {
    checkMethod('ClassRepository.onBeanAdded(handler)');
    checkParam(handler, 'handler');
    this.beanAddedHandlers.push(handler);
};


ClassRepository.prototype.onBeanRemoved = function(handler) {
    checkMethod('ClassRepository.onBeanRemoved(handler)');
    checkParam(handler, 'handler');
    this.beanRemovedHandlers.push(handler);
};


ClassRepository.prototype.onBeanUpdate = function(handler) {
    checkMethod('ClassRepository.onBeanUpdate(handler)');
    checkParam(handler, 'handler');
    this.propertyUpdateHandlers.push(handler);
};


ClassRepository.prototype.onArrayUpdate = function(handler) {
    checkMethod('ClassRepository.onArrayUpdate(handler)');
    checkParam(handler, 'handler');
    this.arrayUpdateHandlers.push(handler);
};


ClassRepository.prototype.registerClass = function (model) {
    checkMethod('ClassRepository.registerClass(model)');
    checkParam(model, 'model');

    if (this.classes.has(model.id)) {
        return;
    }

    var classInfo = {};
    model.attributes.filter(function(attribute) {
        return attribute.propertyName.search(/^@/) < 0;
    }).forEach(function (attribute) {
        classInfo[attribute.propertyName] = attribute.value;
    });
    this.classes.set(model.id, classInfo);
};


ClassRepository.prototype.unregisterClass = function (model) {
    checkMethod('ClassRepository.unregisterClass(model)');
    checkParam(model, 'model');

    this.classes['delete'](model.id);
};


ClassRepository.prototype.load = function (model) {
    checkMethod('ClassRepository.load(model)');
    checkParam(model, 'model');

    var self = this;
    var classInfo = this.classes.get(model.presentationModelType);
    var bean = {};
    model.attributes.filter(function (attribute) {
        return (attribute.propertyName.search(/^@/) < 0);
    }).forEach(function (attribute) {
        bean[attribute.propertyName] = null;
        attribute.onValueChange(function (event) {
            if (event.oldValue !== event.newValue) {
                var oldValue = fromDolphin(self, classInfo[attribute.propertyName], event.oldValue);
                var newValue = fromDolphin(self, classInfo[attribute.propertyName], event.newValue);
                self.propertyUpdateHandlers.forEach(function(handler) {
                    try {
                        handler(model.presentationModelType, bean, attribute.propertyName, newValue, oldValue);
                    } catch(e) {
                        console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
                    }
                });
            }
        });
    });
    this.beanFromDolphin.set(model.id, bean);
    this.beanToDolphin.set(bean, model.id);
    this.classInfos.set(model.id, classInfo);
    this.beanAddedHandlers.forEach(function(handler) {
        try {
            handler(model.presentationModelType, bean);
        } catch(e) {
            console.warn('An exception occurred while calling an onBeanAdded-handler', e);
        }
    });
    return bean;
};


ClassRepository.prototype.unload = function(model) {
    checkMethod('ClassRepository.unload(model)');
    checkParam(model, 'model');

    var bean = this.beanFromDolphin.get(model.id);
    this.beanFromDolphin['delete'](model.id);
    this.beanToDolphin['delete'](bean);
    this.classInfos['delete'](model.id);
    if (exists(bean)) {
        this.beanRemovedHandlers.forEach(function(handler) {
            try {
                handler(model.presentationModelType, bean);
            } catch(e) {
                console.warn('An exception occurred while calling an onBeanRemoved-handler', e);
            }
        });
    }
    return bean;
};


ClassRepository.prototype.spliceListEntry = function(model) {
    checkMethod('ClassRepository.spliceListEntry(model)');
    checkParam(model, 'model');

    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var from = model.findAttributeByPropertyName('from');
    var to = model.findAttributeByPropertyName('to');
    var count = model.findAttributeByPropertyName('count');

    if (exists(source) && exists(attribute) && exists(from) && exists(to) && exists(count)) {
        var classInfo = this.classInfos.get(source.value);
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean) && exists(classInfo)) {
            var type = model.presentationModelType;
            //var entry = fromDolphin(this, classInfo[attribute.value], element.value);
            validateList(this, type, bean, attribute.value);
            var newElements = [],
                element = null;
            for (var i = 0; i < count.value; i++) {
                element = model.findAttributeByPropertyName(i.toString());
                if (! exists(element)) {
                    throw new Error("Invalid list modification update received");
                }
                newElements.push(fromDolphin(this, classInfo[attribute.value], element.value));
            }
            try {
                block(bean, attribute.value);
                this.arrayUpdateHandlers.forEach(function (handler) {
                    try {
                        handler(type, bean, attribute.value, from.value, to.value - from.value, newElements);
                    } catch(e) {
                        console.warn('An exception occurred while calling an onArrayUpdate-handler', e);
                    }
                });
            } finally {
                unblock();
            }
        } else {
            throw new Error("Invalid list modification update received. Source bean unknown.");
        }
    } else {
        throw new Error("Invalid list modification update received");
    }
};


ClassRepository.prototype.mapParamToDolphin = function(param) {
    if (!exists(param)) {
        return param;
    }
    var type = typeof param;
    if (type === 'object') {
        if (param instanceof Date) {
            return param.toISOString();
        } else {
            var value = this.beanToDolphin.get(param);
            if (exists(value)) {
                return value;
            }
            throw new TypeError("Only managed Dolphin Beans can be used");
        }
    }
    if (type === 'string' || type === 'number' || type === 'boolean') {
        return param;
    }
    throw new TypeError("Only managed Dolphin Beans and primitive types can be used");
};


ClassRepository.prototype.mapDolphinToBean = function(value) {
    return fromDolphin(this, consts.DOLPHIN_BEAN, value);
};



exports.ClassRepository = ClassRepository;
