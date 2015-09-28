/*jslint browserify: true */
/* global console */
"use strict";

require('./polyfills.js');
var Promise = require('../bower_components/core.js/library/fn/promise');
var exists = require('./utils.js').exists;



function ClientContext(dolphin, beanManager) {
    this.dolphin = dolphin;
    this.beanManager = beanManager;
}


ClientContext.prototype.createController = function(name) {
    // TODO: Implement ClientContext.createController
};


ClientContext.prototype.getBeanManager = function() {
    return this.beanManager;
};


ClientContext.prototype.disconnect = function() {
    // TODO: Implement ClientContext.disconnect [DP-46]
    throw new Error("Not implemented yet");
};


ClientContext.prototype.getDolphin = function() {
    return this.dolphin;
};



exports.ClientContext = ClientContext;