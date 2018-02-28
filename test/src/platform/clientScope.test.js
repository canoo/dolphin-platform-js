/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import sinon from 'sinon';
import sinonTest from 'sinon-test'
sinon.test = sinonTest(sinon);

import { PlatformClient } from '../../../src/platform/platformClient';
import { register as registerHttp } from '../../../src/http';
import { register as registerClientScope } from '../../../src/platform/clientScope';

describe('ClientScope', function() {

    const headerName = 'dolphin_platform_intern_dolphinClientId';

    before(function() {
        if (!PlatformClient.hasService('HttpClient')) {
            registerHttp(PlatformClient);
        }

        if (!PlatformClient.hasService('ClientScope')) {
            registerClientScope(PlatformClient);
            PlatformClient.init();
        }
    });

    it('ClientScope is an object and service', function() {
        const found = PlatformClient.hasService('ClientScope');
        const clientScope = PlatformClient.getService('ClientScope');

        // then:
        expect(found).to.be.true;
        expect(clientScope).to.exist;
    });

    it('ClientScope handleResponse and handleRequest', sinon.test(function() {
        const clientScope = PlatformClient.getService('ClientScope');

        const response = {
            url: 'https://www.example.com:8080/dolphin',
            getResponseHeader: function() {}
        }
        const request = {
            url: 'https://www.example.com:8080/dolphin',
            setRequestHeader: function() {}
        }
        sinon.spy(request, 'setRequestHeader');
        sinon.stub(response, 'getResponseHeader').callsFake(function() { return 'abcdefg' });

        clientScope.handleResponse(response);
        clientScope.handleRequest(request);

        expect(response.getResponseHeader.calledOnce).to.be.true;
        expect(request.setRequestHeader.calledWithMatch(headerName, 'abcdefg')).to.be.true;

    }));

    it('ClientScope handleResponse with different client Id', sinon.test(function() {
        const clientScope = PlatformClient.getService('ClientScope');

        const response = {
            url: 'https://www.example.com:8080/dolphin',
            getResponseHeader: function() {}
        }

        let result = 'abcdefg';
        sinon.stub(response, 'getResponseHeader').callsFake(function() { return result });
        clientScope.handleResponse(response);
        result = '12345';
        let message = null;
        try {
            clientScope.handleResponse(response);
        } catch (error) {
            message = error.message;
            
        }
        expect(message).to.be.equals('Client Id does not match!');
        

    }));

});