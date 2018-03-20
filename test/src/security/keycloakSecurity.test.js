/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import sinon from 'sinon';
import sinonTest from 'sinon-test'
sinon.test = sinonTest(sinon);

import { HTTP } from '../../../src/platform/constants';
import { PlatformClient } from '../../../src/platform/platformClient';
import { register as registerHttp } from '../../../src/http';
import { register as registerSecurity } from '../../../src/security';
import { KeycloakSecurity } from '../../../src/security/keycloakSecurity'

describe('KeycloakSecurity', function() {

    let server;

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

    beforeEach(function() {
        server = sinon.createFakeServer();
    });

    afterEach(function() {
        server.restore();
    });

    it('create new instance', function() {
        const keycloakSecurity = new KeycloakSecurity();
        expect(keycloakSecurity).to.be.exist;
    });

    it('is not authorized', function() {
        const keycloakSecurity = new KeycloakSecurity();
        expect(keycloakSecurity.isAuthorized()).to.be.false;
    });

    it('correct login', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect', [200, { "Content-Type": "application/json" }, '{"access_token": "test"}']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestBody).to.be.equal('username=user&password=password&grant_type=password');
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.X_PLATFORM_SECURITY_REALM]).to.not.exist;
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.CONTENT_TYPE]).to.be.equal('text/plain;charset=utf-8');
    });

    it('invaild token response', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect', [200, { "Content-Type": "application/json" }, 'Huh?']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.login('user', 'password')
        .catch((error) => {
            expect(error).to.be.exist;
            expect(error).to.be.be.equal('No access token found');
            expect(keycloakSecurity.isAuthorized()).to.be.false;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
    });

    it('invaild token object response', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect', [200, { "Content-Type": "application/json" }, '{"foo": "bar"}']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.login('user', 'password')
        .catch((error) => {
            expect(error).to.be.exist;
            expect(error).to.be.be.equal('No access token found');
            expect(keycloakSecurity.isAuthorized()).to.be.false;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
    });

    it('HTTP status not 200', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect', [401, { "Content-Type": "application/json" }, '{"foo": "bar"}']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.login('user', 'password')
        .catch((error) => {
            expect(error).to.be.exist;
            expect(error).to.be.be.equal(401);
            expect(keycloakSecurity.isAuthorized()).to.be.false;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
    });

    it('correct login and logut', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect', [200, { "Content-Type": "application/json" }, '{"access_token": "test"}']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            keycloakSecurity.logout().then(() => {
                expect(keycloakSecurity.isAuthorized()).to.be.false;
                done();
            });
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
    });

    it('correct login with realm', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect', [200, { "Content-Type": "application/json" }, '{"access_token": "test"}']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.withRealm('dolphin-platform').login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.X_PLATFORM_SECURITY_REALM]).to.be.equal('dolphin-platform');
    });

    it('correct login with different endpoint', function(done) {
        server.respondWith(HTTP.METHOD.POST, 'http://www.example.com:9001/openid-connect', [200, { "Content-Type": "application/json" }, '{"access_token": "test"}']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.withAuthEndpoint('http://www.example.com:9001/openid-connect').login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
    });

    it('correct login with direct connection', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect/auth/realms/dolphin-platform/protocol/openid-connect/token', [200, { "Content-Type": "application/json" }, '{"access_token": "test"}']);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.withDirectConnection().withRealm('dolphin-platform').withAppName('dolphin-client').login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.X_PLATFORM_SECURITY_REALM]).to.not.exist;
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.CONTENT_TYPE]).to.be.equal('application/x-www-form-urlencoded;charset=utf-8');
        expect(server.requests[0].requestBody).to.be.equal('client_id=dolphin-client&username=user&password=password&grant_type=password');
    });

    it('error without app name', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect/auth/realms/dolphin-platform/protocol/openid-connect/token', [200, { "Content-Type": "application/json" }, '{"access_token": "test"}']);

        const keycloakSecurity = new KeycloakSecurity();
        try {
            keycloakSecurity.withDirectConnection().login('user', 'password');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.be.equal('No app name set!');
            done();
        }
    });

    it('error without app name', function(done) {
        server.respondWith(HTTP.METHOD.POST, '/openid-connect/auth/realms/dolphin-platform/protocol/openid-connect/token', [200, { "Content-Type": "application/json" }, '{"access_token": "test"}']);

        const keycloakSecurity = new KeycloakSecurity();
        try {
            keycloakSecurity.withDirectConnection().withAppName('dolphin-client').login('user', 'password');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.be.equal('The parameter realmName is mandatory in createDirectConnection');
            done();
        }
    });

});