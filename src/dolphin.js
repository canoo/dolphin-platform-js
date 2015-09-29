/*jslint browserify: true */
/* global Platform, opendolphin, console */
"use strict";

require('./polyfills.js');

var exists = require('./utils.js').exists;
var Connector = require('./connector.js').Connector;
var BeanManager = require('./beanmanager.js').BeanManager;
var ClassRepository = require('./classrepo.js').ClassRepository;
var ControllerFactory = require('./controllerfactory.js').ControllerManager;
var ClientContext = require('./clientcontext.js').ClientContext;



exports.connect = function(url, config) {
    var builder = opendolphin.makeDolphin().url(url).reset(false).slackMS(4);
    if (exists(config) && exists(config.errorHandler)) {
        builder.errorHandler(config.errorHandler);
    }
    var dolphin = builder.build();

    var classRepository = new ClassRepository(dolphin);
    var beanManager = new BeanManager(classRepository);
    var connector = new Connector(url, dolphin, classRepository);
    var controllerFactory = new ControllerFactory(beanManager, connector);

    return new ClientContext(dolphin, beanManager, controllerFactory);
};
