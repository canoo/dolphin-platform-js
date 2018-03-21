/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import sinon from 'sinon';
import sinonTest from 'sinon-test'
sinon.test = sinonTest(sinon);

import { HTTP, SECURITY } from '../../../src/platform/constants';
import { PlatformClient } from '../../../src/platform/platformClient';
import { register as registerHttp } from '../../../src/http';
import { register as registerSecurity } from '../../../src/security';
import { KeycloakSecurity } from '../../../src/security/keycloakSecurity'

describe('Security', function() {

    let server;
    const responseHeaders = {};
    responseHeaders[HTTP.HEADER_NAME.CONTENT_TYPE] = HTTP.CONTENT_TYPE.APPLICATION_JSON;

    const validToken = '{"access_token": "test"}';
    const invalidToken = '{"foo": "bar"}';

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
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT, [HTTP.STATUS.OK, responseHeaders, validToken]);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            keycloakSecurity.stopRefresh();
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestBody).to.be.equal('username=user&password=password&grant_type=password');
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.X_PLATFORM_SECURITY_REALM]).to.not.exist;
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.CONTENT_TYPE]).to.be.equal(HTTP.CONTENT_TYPE.TEXT_PLAIN +';charset=utf-8');
    });

    it('invaild token response', function(done) {
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT, [HTTP.STATUS.OK, responseHeaders, 'Huh?']);

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
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT, [HTTP.STATUS.OK, responseHeaders, invalidToken]);

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
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT, [HTTP.STATUS.UNAUTHORIZED, responseHeaders, invalidToken]);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.login('user', 'password')
        .catch((error) => {
            expect(error).to.be.exist;
            expect(error).to.be.be.equal(HTTP.STATUS.UNAUTHORIZED);
            expect(keycloakSecurity.isAuthorized()).to.be.false;
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
    });

    it('correct login and logut', function(done) {
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT, [HTTP.STATUS.OK, responseHeaders, validToken]);

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
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT, [HTTP.STATUS.OK, responseHeaders, validToken]);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.withRealm('dolphin-platform').login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            keycloakSecurity.stopRefresh();
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.X_PLATFORM_SECURITY_REALM]).to.be.equal('dolphin-platform');
    });

    it('correct login with different endpoint', function(done) {
        server.respondWith(HTTP.METHOD.POST, 'http://www.example.com:9001/openid-connect', [HTTP.STATUS.OK, responseHeaders, validToken]);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.withAuthEndpoint('http://www.example.com:9001/openid-connect').login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            keycloakSecurity.stopRefresh();
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
    });

    it('correct login with direct connection', function(done) {
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT + '/auth/realms/dolphin-platform/protocol/openid-connect/token', [HTTP.STATUS.OK, responseHeaders, validToken]);

        const keycloakSecurity = new KeycloakSecurity();
        keycloakSecurity.withDirectConnection().withRealm('dolphin-platform').withAppName('dolphin-client').login('user', 'password')
        .then((token) => {
            expect(token).to.be.equal('test');
            expect(keycloakSecurity.isAuthorized()).to.be.true;
            keycloakSecurity.stopRefresh();
            done();
        });

        server.respond();
        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.X_PLATFORM_SECURITY_REALM]).to.not.exist;
        expect(server.requests[0].requestHeaders[HTTP.HEADER_NAME.CONTENT_TYPE]).to.be.equal(HTTP.CONTENT_TYPE.APPLICATION_X_WWW_FORM_URLENCODED + ';charset=utf-8');
        expect(server.requests[0].requestBody).to.be.equal('client_id=dolphin-client&username=user&password=password&grant_type=password');
    });

    it('error without app name', function(done) {
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT + '/auth/realms/dolphin-platform/protocol/openid-connect/token', [HTTP.STATUS.OK, responseHeaders, validToken]);

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
        server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT + '/auth/realms/dolphin-platform/protocol/openid-connect/token', [HTTP.STATUS.OK, responseHeaders, validToken]);

        const keycloakSecurity = new KeycloakSecurity();
        try {
            keycloakSecurity.withDirectConnection().withAppName('dolphin-client').login('user', 'password');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.be.equal('The parameter realmName is mandatory in createDirectConnection');
            done();
        }
    });


    it('HTTP client sends access token', function(done) {
        // this test expects to be executed in a Node.JS, Mocha+JSDOM environment
        if (global.window) {
            const jdomWindow = global.window;
            global.window = {platformClient: PlatformClient};
            server.respondWith(HTTP.METHOD.POST, SECURITY.AUTH_ENDPOINT, [HTTP.STATUS.OK, responseHeaders, validToken]);
            server.respondWith(HTTP.METHOD.GET, 'https://test-mock-server.com', 'Hallo Google!');

            const keycloakSecurity = PlatformClient.getService('Security');
            keycloakSecurity.login('user', 'password').then(() => {
                keycloakSecurity.stopRefresh();
                const httpClient = PlatformClient.getService('HttpClient');
                httpClient.get('https://test-mock-server.com').withoutContent().withoutResult().execute().then(() => { 
                    expect(server.requests.length).to.be.equal(2);
                    expect(server.requests[1].requestHeaders[HTTP.HEADER_NAME.AUTHORIZATION]).to.be.equal('Bearer test');
                    expect(server.requests[1].requestHeaders[HTTP.HEADER_NAME.X_PLATFORM_SECURITY_BEARER_ONLY]).to.be.equal('true');

                    done();
                });
                server.respond();

                global.window = jdomWindow;

            });

            server.respond();        
        }
    });
    
});