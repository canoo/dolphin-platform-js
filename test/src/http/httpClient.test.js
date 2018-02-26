/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import sinon from 'sinon';

import { HttpClient } from '../../../src/http/httpClient';
import { HttpException } from '../../../src/http/httpException';
import { HttpResponse } from '../../../src/http/httpResponse';

describe('HttpClient', function() {

    let server;

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
        httpClient.get('https://www.google.de').withoutContent().withoutResult().execute(0).catch((exception) => {
            expect(exception).to.be.instanceOf(HttpException);
            expect(exception.status).to.be.equal(0);
            expect(exception.message).to.be.equal('Unspecified error occured');
            done();
        });
        server.respond();

        expect(server.requests.length).to.be.equal(1);
    });

});