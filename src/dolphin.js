/*jslint browserify: true */
/* global opendolphin, console, Map */
"use strict";

require('./polyfills.js');

var exists = require('./utils.js').exists;
var ClassRepository = require('./classrepo.js').ClassRepository;


exports.connect = function(url, config) {
    console.debug('Connecting to Dolphin... [' + url + ']');
    return new Dolphin(url, config);
};


var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var DOLPHIN_LIST_ADD_FROM_SERVER = '@@@ LIST_ADD_FROM_SERVER @@@';
var DOLPHIN_LIST_DEL_FROM_SERVER = '@@@ LIST_DEL_FROM_SERVER @@@';
var DOLPHIN_LIST_SET_FROM_SERVER = '@@@ LIST_SET_FROM_SERVER @@@';
var DOLPHIN_LIST_ADD_FROM_CLIENT = '@@@ LIST_ADD_FROM_CLIENT @@@';
var DOLPHIN_LIST_DEL_FROM_CLIENT = '@@@ LIST_DEL_FROM_CLIENT @@@';
var DOLPHIN_LIST_SET_FROM_CLIENT = '@@@ LIST_SET_FROM_CLIENT @@@';


function Dolphin(url, config) {
    var _this = this;
    this.dolphin = opendolphin.dolphin(url, true, 4);
    if (exists(config)) {
        if (config.serverPush) {
            this.dolphin.startPushListening('ServerPushController:longPoll', 'ServerPushController:release');
        }
    }
    this.classRepository = new ClassRepository();
    this.addedHandlers = new Map();
    this.removedHandlers = new Map();
    this.allAddedHandlers = [];
    this.allRemovedHandlers = [];

    function onModelAdded(model) {
        var type = model.presentationModelType;
        switch (type) {
            case DOLPHIN_BEAN:
                _this.classRepository.registerClass(model);
                break;
            case DOLPHIN_LIST_ADD_FROM_SERVER:
                _this.classRepository.addListEntry(model);
                _this.dolphin.getClientModelStore().deletePresentationModel(model);
                break;
            case DOLPHIN_LIST_DEL_FROM_SERVER:
                _this.classRepository.delListEntry(model);
                _this.dolphin.getClientModelStore().deletePresentationModel(model);
                break;
            case DOLPHIN_LIST_SET_FROM_SERVER:
                _this.classRepository.setListEntry(model);
                _this.dolphin.getClientModelStore().deletePresentationModel(model);
                break;
            case DOLPHIN_LIST_ADD_FROM_CLIENT:
            case DOLPHIN_LIST_DEL_FROM_CLIENT:
            case DOLPHIN_LIST_SET_FROM_CLIENT:
                // do nothing
                break;
            default:
                var bean = _this.classRepository.load(model);
                var handlerList = _this.addedHandlers.get(type);
                if (exists(handlerList)) {
                    handlerList.forEach(function(handler) {
                        handler(bean);
                    });
                }
                _this.allAddedHandlers.forEach(function(handler) {
                    handler(bean);
                });
                break;
        }
    }

    function onModelRemoved(model) {
        var type = model.presentationModelType;
        switch (type) {
            case DOLPHIN_BEAN:
                _this.classRepository.unregisterClass(model);
                break;
            case DOLPHIN_LIST_ADD_FROM_SERVER:
            case DOLPHIN_LIST_DEL_FROM_SERVER:
            case DOLPHIN_LIST_SET_FROM_SERVER:
            case DOLPHIN_LIST_ADD_FROM_CLIENT:
            case DOLPHIN_LIST_DEL_FROM_CLIENT:
            case DOLPHIN_LIST_SET_FROM_CLIENT:
                // do nothing
                break;
            default:
                var bean = _this.classRepository.unload(model);
                if (!exists(bean)) {
                    console.warn('Attempt to remove unknown bean', model);
                } else {
                    var handlerList = _this.removedHandlers.get(type);
                    if (exists(handlerList)) {
                        handlerList.forEach(function(handler) {
                            handler(bean);
                        });
                    }
                    _this.allRemovedHandlers.forEach(function(handler) {
                        handler(bean);
                    });
                }
                break;
        }

    }

    this.dolphin.getClientModelStore().onModelStoreChange(function (event) {
        var model = event.clientPresentationModel;
        if (event.eventType === opendolphin.Type.ADDED) {
            onModelAdded(model);
        } else if (event.eventType === opendolphin.Type.REMOVED) {
            onModelRemoved(model);
        }
    });
}


Dolphin.prototype.isManaged = function(bean) {
    throw "Not implemented yet";
};


Dolphin.prototype.create = function(type) {
    throw "Not implemented yet";
};


Dolphin.prototype.add = function(type, bean) {
    throw "Not implemented yet";
};


Dolphin.prototype.addAll = function(type, collection) {
    throw "Not implemented yet";
};


Dolphin.prototype.remove = function(bean) {
    throw "Not implemented yet";
};


Dolphin.prototype.removeAll = function(collection) {
    throw "Not implemented yet";
};


Dolphin.prototype.removeIf = function(predicate) {
    throw "Not implemented yet";
};


Dolphin.prototype.onAdded = function(type, eventHandler) {
    // TODO: Probably safer to use copy-on-write here
    if (!exists(eventHandler)) {
        this.allAddedHandlers.push(type);
    } else {
        var handlerList = this.addedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
            this.addedHandlers.set(type, handlerList);
        }
        handlerList.push(eventHandler);
    }

    // TODO: Return subscription
    return null;
};


Dolphin.prototype.onRemoved = function(type, eventHandler) {
    // TODO: Probably safer to use copy-on-write here
    if (!exists(eventHandler)) {
        this.allRemovedHandlers.push(type);
    } else {
        var handlerList = this.removedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
            this.removedHandlers.set(type, handlerList);
        }
        handlerList.push(eventHandler);
    }

    // TODO: Return subscription
    return null;
};


Dolphin.prototype.send = function(command, params) {
    if (exists(params)) {
        var attributes = [];
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

    // TODO: Return promise
    return null;
};
