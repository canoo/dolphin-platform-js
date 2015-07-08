/*jslint browserify: true */
/* global Platform, opendolphin, console */
"use strict";

require('./polyfills.js');
var Map  = require('../bower_components/core.js/library/fn/map');

var exists = require('./utils.js').exists;
var ClassRepository = require('./classrepo.js').ClassRepository;


exports.connect = function(url, config) {
    return new Dolphin(url, config);
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
            dolphin.dolphin.deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_DEL:
            dolphin.classRepository.delListEntry(model);
            dolphin.dolphin.deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_SET:
            dolphin.classRepository.setListEntry(model);
            dolphin.dolphin.deletePresentationModel(model);
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



function Dolphin(url, config) {
    var _this = this;
    var observeInterval = 50;
    this.dolphin = opendolphin.dolphin(url, true, 4);
    if (exists(config)) {
        if (config.serverPush) {
            this.dolphin.startPushListening('ServerPushController:longPoll', 'ServerPushController:release');
        }
        if (config.observeInterval) {
            observeInterval = config.observeInterval;
        }
    }
    this.classRepository = new ClassRepository();
    this.addedHandlers = new Map();
    this.removedHandlers = new Map();
    this.allAddedHandlers = [];
    this.allRemovedHandlers = [];

    var shutdownRequested = false;
    (function loop(){
        setTimeout(function(){
            Platform.performMicrotaskCheckpoint();
            if (!shutdownRequested) {
                loop();
            }
        }, observeInterval);
    })();
    this.shutdown = function() {
        shutdownRequested = true;
    };

    this.dolphin.getClientModelStore().onModelStoreChange(function (event) {
        var model = event.clientPresentationModel;
        var sourceSystem = model.findAttributeByPropertyName(SOURCE_SYSTEM);
        if (exists(sourceSystem) && sourceSystem.value === SOURCE_SYSTEM_SERVER) {
            if (event.eventType === opendolphin.Type.ADDED) {
                onModelAdded(_this, model);
            } else if (event.eventType === opendolphin.Type.REMOVED) {
                onModelRemoved(_this, model);
            }
        }
    });
}


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
                })
            }
        };
    } else {
        var handlerList = self.addedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.addedHandlers.set(type, handlerList.concat(eventHandler))
        return {
            unsubscribe: function() {
                var handlerList = self.addedHandlers.get(type);
                if (exists(handlerList)) {
                    self.addedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }))
                }
            }
        }
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
                })
            }
        };
    } else {
        var handlerList = self.removedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.removedHandlers.set(type, handlerList.concat(eventHandler))
        return {
            unsubscribe: function() {
                var handlerList = self.removedHandlers.get(type);
                if (exists(handlerList)) {
                    self.removedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }))
                }
            }
        }
    }
};


Dolphin.prototype.send = function(command, params) {
    if (exists(params)) {

        var attributes = [
            this.dolphin.attribute(SOURCE_SYSTEM, null, SOURCE_SYSTEM_CLIENT)
        ];
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                var param = this.classRepository.mapParamToDolphin(params[prop]);
                attributes.push(this.dolphin.attribute(prop, null, param.value, 'VALUE'));
                attributes.push(this.dolphin.attribute(prop, null, param.type, 'VALUE_TYPE'));
            }
        }
        this.dolphin.presentationModel.apply(this.dolphin, [null, '@@@ DOLPHIN_PARAMETER @@@'].concat(attributes));
    }
    this.dolphin.send(command);

    // TODO: Return promise [DP-8]
    return null;
};
