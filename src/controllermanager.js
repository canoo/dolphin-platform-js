/*jslint browserify: true */
/* global console */
"use strict";

require('./polyfills.js');
var Promise = require('../bower_components/core.js/library/fn/promise');
var exists = require('./utils.js').exists;
var ControllerProxy = require('./controllerproxy.js').ControllerProxy;


var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var REGISTER_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'registerController';
var CALL_CONTROLLER_ACTION_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
var DESTROY_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'destroyController';

var CONTROLLER_REGISTRY_BEAN_NAME = 'com.canoo.dolphin.impl.ControllerRegistryBean';
var CONTROLLER_ACTION_CALL_BEAN_NAME = 'com.canoo.dolphin.impl.ControllerActionCallBean';
var CONTROLLER_DESTROY_BEAN_NAME = 'com.canoo.dolphin.impl.ControllerDestroyBean';


function ControllerManager(beanManager, connector) {
    this.beanManager = beanManager;
    this.connector = connector;

    var self = this;
    this.controllerRegistryBeanPromise = new Promise(function(resolve) {
        self.beanManager.onAdded(CONTROLLER_REGISTRY_BEAN_NAME, function(controllerRegistryBean) {
            resolve(controllerRegistryBean);
        });
    });
    this.controllerActionCallBeanPromise = new Promise(function(resolve) {
        self.beanManager.onAdded(CONTROLLER_ACTION_CALL_BEAN_NAME, function(controllerActionCallBean) {
            resolve(controllerActionCallBean);
        });
    });
    this.controllerDestroyBeanPromise = new Promise(function(resolve) {
        self.beanManager.onAdded(CONTROLLER_DESTROY_BEAN_NAME, function(controllerDestroyBean) {
            resolve(controllerDestroyBean);
        });
    });
}


ControllerManager.prototype.createController = function(name) {
    var self = this;
    return new Promise(function(resolve) {
        self.controllerRegistryBeanPromise.then(function(controllerRegistryBean) {
                self.beanManager.notifyBeanChange(controllerRegistryBean, 'controllerName', name);
                self.connector.invoke(REGISTER_CONTROLLER_COMMAND_NAME).then(function() {
                    resolve(new ControllerProxy(controllerRegistryBean.controllerId, controllerRegistryBean.model, self));
                });
            }
        );
    });
};


ControllerManager.prototype.invokeAction = function(controllerId, actionName, params) {
    var self = this;
    return new Promise(function(resolve) {
        self.controllerActionCallBeanPromise.then(function(controllerActionCallBean) {
                self.beanManager.notifyBeanChange(controllerActionCallBean, 'controllerId', controllerId);
                self.beanManager.notifyBeanChange(controllerActionCallBean, 'actionName', actionName);
                self.connector.invoke(CALL_CONTROLLER_ACTION_COMMAND_NAME, params).then(resolve);
            }
        );
    });
};

ControllerManager.prototype.destroyController = function(controllerId) {
    var self = this;
    return new Promise(function(resolve) {
        self.controllerDestroyBeanPromise.then(function(controllerDestroyBean) {
                self.beanManager.notifyBeanChange(controllerDestroyBean, 'controllerId', controllerId);
                self.connector.invoke(DESTROY_CONTROLLER_COMMAND_NAME).then(resolve);
            }
        );
    });
};



exports.ControllerManager = ControllerManager;
