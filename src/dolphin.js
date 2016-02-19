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
var opendolphin = require('../libsrc/opendolphin.js');

var utils = require('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;
var Connector = require('./connector.js').Connector;
var BeanManager = require('./beanmanager.js').BeanManager;
var ClassRepository = require('./classrepo.js').ClassRepository;
var ControllerManager = require('./controllermanager.js').ControllerManager;
var ClientContext = require('./clientcontext.js').ClientContext;
var Codec = require('./codec.js').Codec;

exports.connect = function(url, config) {
    checkMethod('connect(url, config)');
    checkParam(url, 'url');

    var builder = opendolphin.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true);
    if (exists(config) && exists(config.errorHandler)) {
        builder.errorHandler(config.errorHandler);
    }
    var dolphin = builder.build();
    dolphin.clientConnector.transmitter.codec = Codec;

    var classRepository = new ClassRepository(dolphin);
    var beanManager = new BeanManager(classRepository);
    var connector = new Connector(url, dolphin, classRepository, config);
    var controllerManager = new ControllerManager(dolphin, classRepository, connector);

    return new ClientContext(dolphin, beanManager, controllerManager, connector);
};
