/*jslint browserify: true */
/* global console */
"use strict";

require('./polyfills.js');
var Promise = require('../bower_components/core.js/library/fn/promise');
var exists = require('./utils.js').exists;



function ControllerProxy(controllerId, model, factory) {
    this.controllerId = controllerId;
    this.model = model;
    this.factory = factory;
    this.destroyed = false;
}


ControllerProxy.prototype.invoke = function(name) {
    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    return this.factory.invokeAction(this.controllerId, name);
};


ControllerProxy.prototype.destroy = function() {
    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    this.destroyed = true;
    return this.factory.destroyController(this);
};



exports.ControllerProxy = ControllerProxy;
