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
/* global console */
"use strict";

require('./polyfills.js');
var Promise = require('../bower_components/core.js/library/fn/promise');
var Set = require('../bower_components/core.js/library/fn/set');
var checkParam = require('./utils.js').checkParam;



function ControllerProxy(controllerId, model, manager) {
    checkParam(controllerId, 'controllerId');
    checkParam(model, 'model');
    checkParam(manager, 'manager');

    this.controllerId = controllerId;
    this.model = model;
    this.manager = manager;
    this.destroyed = false;
    this.destroyedHandlers = new Set();
}


ControllerProxy.prototype.invoke = function(name, params) {
    checkParam(name, 'name');

    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    return this.manager.invokeAction(this.controllerId, name, params);
};


ControllerProxy.prototype.destroy = function() {
    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    var self = this;
    this.destroyed = true;
    return new Promise(function(resolve) {
        self.manager.destroyController(self).then(function() {
            self.destroyedHandlers.forEach(function(handler) {
                try {
                    handler(self);
                } catch(e) {
                    console.warn('An exception occurred while calling an onDestroyed-handler', e);
                }
            });
            resolve();
        });
    });
};


ControllerProxy.prototype.onDestroyed = function(handler) {
    checkParam(handler, 'handler');

    var self = this;
    this.destroyedHandlers.add(handler);
    return {
        unsubscribe: function() {
            self.destroyedHandlers.delete(handler);
        }
    };
};



exports.ControllerProxy = ControllerProxy;
