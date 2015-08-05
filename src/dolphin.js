/*jslint browserify: true */
/* global Platform, opendolphin, console */
"use strict";

require('./polyfills.js');
var Map  = require('../bower_components/core.js/library/fn/map');
var Promise = require('../bower_components/core.js/library/fn/promise');

var exists = require('./utils.js').exists;
var ClassRepository = require('./classrepo.js').ClassRepository;
var NewClassRepository = require('./newclassrepo.js').ClassRepository;

var initializer;

exports.connect = function(url, config) {
    var dolphin = new Dolphin(url, true);
    finalizeOpenDolphin(dolphin, config, false);
    return dolphin;
};

exports.connect2 = function(url, config) {
    var dolphin = new Dolphin(url, false, config);

    initializer = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.withCredentials = true;

        req.onload = function() {
            if (req.status == 200) {
                finalizeOpenDolphin(dolphin, config, true);
                resolve();
            }
            else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function() {
            reject(Error("Network Error"));
        };

        req.open('POST', url + 'invalidate?');
        req.send();
    });
    return dolphin;
};


var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var DOLPHIN_LIST_ADD = '@@@ LIST_ADD @@@';
var DOLPHIN_LIST_DEL = '@@@ LIST_DEL @@@';
var DOLPHIN_LIST_SET = '@@@ LIST_SET @@@';
var SOURCE_SYSTEM = '@@@ SOURCE_SYSTEM @@@';
var SOURCE_SYSTEM_CLIENT = 'client';
var SOURCE_SYSTEM_SERVER = 'server';


function onModelAdded(dolphin, model) {
    var type = model.presentationModelType;
    switch (type) {
        case DOLPHIN_BEAN:
            dolphin.classRepository.registerClass(model);
            break;
        case DOLPHIN_LIST_ADD:
            dolphin.classRepository.addListEntry(model);
            dolphin.opendolphin.deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_DEL:
            dolphin.classRepository.delListEntry(model);
            dolphin.opendolphin.deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_SET:
            dolphin.classRepository.setListEntry(model);
            dolphin.opendolphin.deletePresentationModel(model);
            break;
        default:
            var bean = dolphin.classRepository.load(model);
            var handlerList = dolphin.addedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach(function (handler) {
                    handler(bean);
                });
            }
            dolphin.allAddedHandlers.forEach(function (handler) {
                handler(bean);
            });
            break;
    }
}

function onModelRemoved(dolphin, model) {
    var type = model.presentationModelType;
    switch (type) {
        case DOLPHIN_BEAN:
            dolphin.classRepository.unregisterClass(model);
            break;
        case DOLPHIN_LIST_ADD:
        case DOLPHIN_LIST_DEL:
        case DOLPHIN_LIST_SET:
            // do nothing
            break;
        default:
            var bean = dolphin.classRepository.unload(model);
            if (exists(bean)) {
                var handlerList = dolphin.removedHandlers.get(type);
                if (exists(handlerList)) {
                    handlerList.forEach(function(handler) {
                        handler(bean);
                    });
                }
                dolphin.allRemovedHandlers.forEach(function(handler) {
                    handler(bean);
                });
            }
            break;
    }

}



function finalizeOpenDolphin(dolphin, config, useNewClassRepository) {
    var observeInterval = 50;
    if (exists(config)) {
        if (config.serverPush) {
            dolphin.opendolphin.startPushListening('ServerPushController:longPoll', 'ServerPushController:release');
        }
        if (config.observeInterval) {
            observeInterval = config.observeInterval;
        }
    }
    dolphin.classRepository = useNewClassRepository? new NewClassRepository(dolphin.opendolphin) : new ClassRepository();

    if (useNewClassRepository) {
        dolphin.classRepository.onBeanUpdate(function(type, bean, propertyName, newValue, oldValue) {
            var handlerList = dolphin.updatedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach(function (handler) {
                    handler(bean, propertyName, newValue, oldValue);
                });
            }
            dolphin.allUpdatedHandlers.forEach(function (handler) {
                handler(bean, propertyName, newValue, oldValue);
            });
        });
        dolphin.classRepository.onArrayUpdate(function(type, bean, propertyName, index, count, newElement) {
            var handlerList = dolphin.arrayUpdatedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach(function (handler) {
                    handler(bean, propertyName, index, count, newElement);
                });
            }
            dolphin.allArrayUpdatedHandlers.forEach(function (handler) {
                handler(bean, propertyName, index, count, newElement);
            });
        });
    } else {
        var shutdownRequested = false;
        (function loop() {
            setTimeout(function () {
                Platform.performMicrotaskCheckpoint();
                if (!shutdownRequested) {
                    loop();
                }
            }, observeInterval);
        })();
        dolphin.shutdown = function () {
            shutdownRequested = true;
        };
    }

    dolphin.opendolphin.getClientModelStore().onModelStoreChange(function (event) {
        var model = event.clientPresentationModel;
        var sourceSystem = model.findAttributeByPropertyName(SOURCE_SYSTEM);
        if (exists(sourceSystem) && sourceSystem.value === SOURCE_SYSTEM_SERVER) {
            if (event.eventType === opendolphin.Type.ADDED) {
                onModelAdded(dolphin, model);
            } else if (event.eventType === opendolphin.Type.REMOVED) {
                onModelRemoved(dolphin, model);
            }
        }
    });
    dolphin.ready = true;
}


function Dolphin(url, reset, config) {
    this.addedHandlers = new Map();
    this.removedHandlers = new Map();
    this.updatedHandlers = new Map();
    this.arrayUpdatedHandlers = new Map();
    this.allAddedHandlers = [];
    this.allRemovedHandlers = [];
    this.allUpdatedHandlers = [];
    this.allArrayUpdatedHandlers = [];
    this.ready = false;

    var builder = opendolphin.makeDolphin().url(url).reset(reset).slackMS(4);
    if (exists(config) && exists(config.errorHandler)) {
        builder.errorHandler(config.errorHandler);
    }
    this.opendolphin = builder.build();
}


Dolphin.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
};


Dolphin.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
};


Dolphin.prototype.isManaged = function(bean) {
    // TODO: Implement dolphin.isManaged() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.create = function(type) {
    // TODO: Implement dolphin.create() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.add = function(type, bean) {
    // TODO: Implement dolphin.add() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.addAll = function(type, collection) {
    // TODO: Implement dolphin.addAll() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.remove = function(bean) {
    // TODO: Implement dolphin.remove() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.removeAll = function(collection) {
    // TODO: Implement dolphin.removeAll() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.removeIf = function(predicate) {
    // TODO: Implement dolphin.removeIf() [DP-7]
    throw new Error("Not implemented yet");
};


Dolphin.prototype.onAdded = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allAddedHandlers = self.allAddedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        var handlerList = self.addedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.addedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.addedHandlers.get(type);
                if (exists(handlerList)) {
                    self.addedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


Dolphin.prototype.onRemoved = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allRemovedHandlers = self.allRemovedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        var handlerList = self.removedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.removedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.removedHandlers.get(type);
                if (exists(handlerList)) {
                    self.removedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


Dolphin.prototype.onBeanUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        var handlerList = self.updatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.updatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.updatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.updatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


Dolphin.prototype.onArrayUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.arrayUpdatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.arrayUpdatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


Dolphin.prototype.send = function(command, params) {
    if (exists(params)) {

        var attributes = [
            this.opendolphin.attribute(SOURCE_SYSTEM, null, SOURCE_SYSTEM_CLIENT)
        ];
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                var param = this.classRepository.mapParamToDolphin(params[prop]);
                attributes.push(this.opendolphin.attribute(prop, null, param.value, 'VALUE'));
                attributes.push(this.opendolphin.attribute(prop, null, param.type, 'VALUE_TYPE'));
            }
        }
        this.opendolphin.presentationModel.apply(this.opendolphin, [null, '@@@ DOLPHIN_PARAMETER @@@'].concat(attributes));
    }

    var localDolphin = this.opendolphin;
    var sendCommand = function(resolve) {
        localDolphin.send(command, { onFinished: function() {resolve();} });
    };
    var resolver = this.ready? sendCommand : function(resolve) {
        initializer.then(function() {
            sendCommand(resolve);
        });
    };
    return new Promise(resolver);
};
