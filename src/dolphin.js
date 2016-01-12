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

require('./polyfills.js');
var opendolphin = require('../libsrc/opendolphin.js');

var exists = require('./utils.js').exists;
var Connector = require('./connector.js').Connector;
var BeanManager = require('./beanmanager.js').BeanManager;
var ClassRepository = require('./classrepo.js').ClassRepository;
var ControllerManager = require('./controllermanager.js').ControllerManager;
var ClientContext = require('./clientcontext.js').ClientContext;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var INIT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'initClientContext';

exports.connect = function(url, config) {
    var builder = opendolphin.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true);
    if (exists(config) && exists(config.errorHandler)) {
        builder.errorHandler(config.errorHandler);
    }
    var dolphin = builder.build();

    var classRepository = new ClassRepository(dolphin);
    var beanManager = new BeanManager(classRepository);
    var connector = new Connector(url, dolphin, classRepository, config);
    var controllerManager = new ControllerManager(dolphin, classRepository, connector);

    var clientContext = new ClientContext(dolphin, beanManager, controllerManager);

    connector.invoke(INIT_COMMAND_NAME);

    return clientContext;
};
