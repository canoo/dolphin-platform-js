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
var exists = require('./utils.js').exists;



function ClientContext(dolphin, beanManager, controllerManager) {
    this.dolphin = dolphin;
    this.beanManager = beanManager;
    this._controllerManager = controllerManager;
}


ClientContext.prototype.createController = function(name) {
    return this._controllerManager.createController(name);
};


ClientContext.prototype.disconnect = function() {
    // TODO: Implement ClientContext.disconnect [DP-46]
    throw new Error("Not implemented yet");
};



exports.ClientContext = ClientContext;