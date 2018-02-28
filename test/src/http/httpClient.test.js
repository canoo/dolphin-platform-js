/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import sinon from 'sinon';

import { HttpClient } from '../../../src/http/httpClient';
import { HttpException } from '../../../src/http/httpException';
import { HttpResponse } from '../../../src/http/httpResponse';
import { PlatformClient } from '../../../src/platform/platformClient';
import { register as registerClientScope } from '../../../src/platform/clientScope';
import { register as registerHttp } from '../../../src/http';

describe('HttpClient', function() {

    let server;

    before(function() {
        if (!PlatformClient.hasService('HttpClient')) {
            registerHttp(PlatformClient);
        }

        if (!PlatformClient.hasService('ClientScope')) {
            registerClientScope(PlatformClient);
            PlatformClient.init();
        }
    });

    beforeEach(function() {
        server = sinon.createFakeServer();
    });

    afterEach(function() {
        server.restore();
    });

    it('simple HTTP GET, without content, without result', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().withoutResult().execute().then(() => { done() });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('simple HTTP POST, without content, without result', function(done) {
        server.respondWith('POST', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.post('https://www.google.de').withoutContent().withoutResult().execute().then(() => { done() });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('simple HTTP PUT, without content, without result', function(done) {
        server.respondWith('PUT', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.put('https://www.google.de').withoutContent().withoutResult().execute().then(() => { done() });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('simple HTTP DELETE, without content, without result', function(done) {
        server.respondWith('DELETE', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.delete('https://www.google.de').withoutContent().withoutResult().execute().then(() => { done() });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestBody).not.to.exist;
    });

    it('simple HTTP GET, with content, without result', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withContent('Test').withoutResult().execute().then(() => { done() });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestBody).to.be.equal('Test');
    });

    it('simple HTTP GET, without content, with string result', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().readString().execute().then((response) => {
            expect(response).to.be.instanceOf(HttpResponse);
            expect(response.content).to.be.equal('Hallo Google!');
            expect(response.status).to.be.equal(200);
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('simple HTTP GET, without content, with object result', function(done) {
        server.respondWith('GET', 'https://www.google.de', [200, { "Content-Type": "application/json" }, '{ "message": "Hallo Google!" }']);

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().readObject().execute().then((response) => {
            expect(response).to.be.instanceOf(HttpResponse);
            expect(response.content.message).to.be.equal('Hallo Google!');
            expect(response.status).to.be.equal(200);
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('simple HTTP GET, without content, with bytes result', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().readBytes().execute().then((response) => {
            expect(response).to.be.instanceOf(HttpResponse);
            expect(response.content).to.be.instanceOf(ArrayBuffer);
            expect(response.content.byteLength).to.be.equal(13);
            expect(response.status).to.be.equal(200);
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('simple HTTP GET, without content, without result, HTTP 404', function(done) {
        server.respondWith('GET', 'https://www.google.de', [404, { }, '']);

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().withoutResult().execute().catch((exception) => {
            expect(exception).to.be.instanceOf(HttpException);
            expect(exception.status).to.be.equal(404);
            expect(exception.timedout).to.be.equal(false);
            expect(exception.message).to.be.equal('Not Found');
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('simple HTTP GET, without content, without result, with custom header', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withHeader('X-Client-Id', '12345').withoutContent().withoutResult().execute().then((response) => {
            expect(response).to.be.instanceOf(HttpResponse);
            expect(response.content).to.be.equal('Hallo Google!');
            expect(response.status).to.be.equal(200);
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestHeaders['X-Client-Id']).to.be.equal('12345');
    });

    it('simple HTTP GET, without content, without result, with multiple custom headers', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withHeader('X-Client-Id', '12345').withHeader('X-Dummy', 'abcd').withoutContent().withoutResult().execute().then((response) => {
            expect(response).to.be.instanceOf(HttpResponse);
            expect(response.content).to.be.equal('Hallo Google!');
            expect(response.status).to.be.equal(200);
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
        expect(Object.keys(server.requests[0].requestHeaders).length).to.be.equal(3);
        expect(server.requests[0].requestHeaders['X-Client-Id']).to.be.equal('12345');
        expect(server.requests[0].requestHeaders['X-Dummy']).to.be.equal('abcd');
        expect(server.requests[0].requestHeaders['Content-Type']).to.be.equal('text/plain;charset=utf-8');
    });

    it('simple HTTP GET, without content, without result, with header info', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withHeadersInfo({'X-Client-Id': '12345'}).withoutContent().withoutResult().execute().then((response) => {
            expect(response).to.be.instanceOf(HttpResponse);
            expect(response.content).to.be.equal('Hallo Google!');
            expect(response.status).to.be.equal(200);
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0].requestHeaders['X-Client-Id']).to.be.equal('12345');
    });

    it('simple HTTP GET, without content, without result, with not existing header info', function(done) {
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withHeadersInfo(null).withoutContent().withoutResult().execute().then((response) => {
            expect(response).to.be.instanceOf(HttpResponse);
            expect(response.content).to.be.equal('Hallo Google!');
            expect(response.status).to.be.equal(200);
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('HTTP GET, without content, without result, network error', function(done) {
        server.respondWith('GET', 'https://www.google.de', function(request) {
            request.error();
        });

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().withoutResult().execute().catch((exception) => {
            expect(exception).to.be.instanceOf(HttpException);
            expect(exception.status).to.be.equal(0);
            expect(exception.timedout).to.be.equal(false);
            expect(exception.message).to.be.equal('Unspecified error occured');
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('HTTP GET, without content, without result, network error with text', function(done) {
        server.respondWith('GET', 'https://www.google.de', function(request) {
            request.statusText = 'Hola!';
            request.error();
        });

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().withoutResult().execute().catch((exception) => {
            expect(exception).to.be.instanceOf(HttpException);
            expect(exception.status).to.be.equal(0);
            expect(exception.timedout).to.be.equal(false);
            expect(exception.message).to.be.equal('Hola!');
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

    it('HTTP GET, without content, without result, timeout error', function(done) {
        const clock = sinon.useFakeTimers();
        server.respondWith('GET', 'https://www.google.de', 'Hallo Google!');

        const httpClient = new HttpClient();
        httpClient.get('https://www.google.de').withoutContent().withoutResult().execute(5).catch((exception) => {
            expect(exception).to.be.instanceOf(HttpException);
            expect(exception.status).to.be.equal(0);
            expect(exception.timedout).to.be.equal(true);
            expect(exception.message).to.be.equal('Timeout occurred');
            done();
        });
        clock.tick(20000);

        expect(server.requests.length).to.be.equal(1);
        clock.restore();
    });

    it('simple HTTP GET, with client scope interceptor which stores client id', function() {
        // this test expects to be executed in a Node.JS, Mocha+JSDOM environment
        if (global.window) {
            const jdomWindow = global.window;
            global.window = {platformClient: PlatformClient};

            server.respondWith([200, { 'dolphin_platform_intern_dolphinClientId': 'abcd-efgh-ijkl-mopq'}, 'Hallo Google!']);

            const httpClient = PlatformClient.getService('HttpClient');
            httpClient.get('https://www.google.de').withoutContent().withoutResult().execute();
            server.respond();

            expect(server.requests.length).to.be.equal(1);
            expect(PlatformClient.getService('ClientScope').getClientId('https://www.google.de')).to.be.equal('abcd-efgh-ijkl-mopq');

            // Clean up
            PlatformClient.getService('ClientScope').clientIds = new Map();
            global.window = jdomWindow;
        }
        
    });

    it('simple HTTP GET, with client scope interceptor which uses client id', function() {
        // this test expects to be executed in a Node.JS, Mocha+JSDOM environment
        if (global.window) {
            const jdomWindow = global.window;
            global.window = {platformClient: PlatformClient};

            server.respondWith([200, { 'dolphin_platform_intern_dolphinClientId': 'abcd-efgh-ijkl-mopq'}, 'Hallo Google!']);

            const httpClient = PlatformClient.getService('HttpClient');
            httpClient.get('https://www.google.de').withoutContent().withoutResult().execute();
            server.respond();

            httpClient.get('https://www.google.de').withoutContent().withoutResult().execute();
            server.respond();

            expect(server.requests.length).to.be.equal(2);
            expect(server.requests[0].requestHeaders['dolphin_platform_intern_dolphinClientId']).to.not.exist;
            expect(server.requests[1].requestHeaders['dolphin_platform_intern_dolphinClientId']).to.be.equal('abcd-efgh-ijkl-mopq');

            // Clean up
            PlatformClient.getService('ClientScope').clientIds = new Map();
            global.window = jdomWindow;
        }
        
    });

});