/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';

import { HTTP_GET, HTTP_POST, HTTP_DELETE, HTTP_PUT } from '../../../src/http/constants';

describe('HTTP Method Names', function() {

    it('GET', function() {
        expect(HTTP_GET).to.be.equal('GET');
    });

    it('POST', function() {
        expect(HTTP_POST).to.be.equal('POST');
    });

    it('DELETE', function() {
        expect(HTTP_DELETE).to.be.equal('DELETE');
    });

    it('PUT', function() {
        expect(HTTP_PUT).to.be.equal('PUT');
    });

});