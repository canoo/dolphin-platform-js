/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';

import { HttpResponse } from '../../../src/http/httpResponse';

describe.only('HttpResponse', function() {

    it('getContent', function() {
        const httpResponse = new HttpResponse(200, 'Foo', '');

        expect(httpResponse.getContent()).to.be.equal('Foo');
    });

    it('getStatus', function() {
        const httpResponse = new HttpResponse(200, 'Foo', '');

        expect(httpResponse.getStatus()).to.be.equal(200);
    });

    it('getHeaders for empty string', function() {
        const httpResponse = new HttpResponse(200, 'Foo', '');

        expect(httpResponse.getHeaders()).to.be.deep.equal({});
    });

    it('Not existing headers', function() {
        const httpResponse = new HttpResponse(200, 'Foo');

        expect(httpResponse.getHeaders()).to.be.deep.equal({});
    });

    it('getHeaders for with one entry', function() {
        const httpResponse = new HttpResponse(200, 'Foo', 'Accept: */*');

        expect(httpResponse.getHeaders()).to.be.deep.equal({'Accept': '*/*'});
        expect(httpResponse.getHeaderByName('Accept')).to.be.equal('*/*');
        expect(Object.keys(httpResponse.getHeaders()).length).to.be.equal(1);
    });
    it('getHeaders for with more entry', function() {
        const httpResponse = new HttpResponse(200, 'Foo', 'Accept: */*\r\nContent-Type: text/html; charset=UTF-8');

        expect(httpResponse.getHeaders()).to.be.deep.equal({'Accept': '*/*', 'Content-Type': 'text/html; charset=UTF-8'});
        expect(httpResponse.getHeaderByName('Accept')).to.be.equal('*/*');
        expect(httpResponse.getHeaderByName('Content-Type')).to.be.equal('text/html; charset=UTF-8');
        expect(Object.keys(httpResponse.getHeaders()).length).to.be.equal(2);
    });

});