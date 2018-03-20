/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import sinon from 'sinon';
import sinonTest from 'sinon-test'
sinon.test = sinonTest(sinon);

import { PlatformClient } from '../../../src/platform/platformClient';
import { register as registerHttp } from '../../../src/http';
import { register as registerSecurity } from '../../../src/security/keycloakSecurity';

describe('KeycloakSecurity', function() {

    before(function() {
        registerHttp(PlatformClient);
        registerSecurity(PlatformClient);
        PlatformClient.init();
    });

    after(function() {
        // Clean up PlatformClient
        PlatformClient.services = new Map();
        PlatformClient.serviceProviders = new Map();
        PlatformClient.configuration = {};
    });

});