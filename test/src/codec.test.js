/*jslint browserify: true, mocha: true, expr: true */
/*eslint-env browser, mocha */
"use strict";

import { expect } from 'chai';
import Codec from '../../src/commands/codec.js';

function createCPMCommand() {
    return {
        "id": "CreatePresentationModel",
        "pmId": "05ee43b7-a884-4d42-9fc5-00b083664eed",
        "attributes": [
            {
                "propertyName": "@@@ SOURCE_SYSTEM @@@",
                "id": "3204S",
                "value": "server"
            },
            {
                "propertyName": "caseDetailsLabel",
                "id": "3205S",
                "value": null
            },
            {
                "propertyName": "caseIdLabel",
                "id": "3206S",
                "value": null
            },
            {
                "propertyName": "statusLabel",
                "id": "3207S",
                "value": null
            },
            {
                "propertyName": "status",
                "id": "3208S",
                "value": null
            }
        ],
        "pmType": "com.canoo.icos.casemanager.model.casedetails.CaseInfoBean"
    };
}

function createCPMCommandString() {
    return '{"id":"CreatePresentationModel","p_id":"05ee43b7-a884-4d42-9fc5-00b083664eed","t":"com.canoo.icos.casemanager.model.casedetails.CaseInfoBean","a":[{"n":"@@@ SOURCE_SYSTEM @@@","a_id":"3204S","v":"server"},{"n":"caseDetailsLabel","a_id":"3205S"},{"n":"caseIdLabel","a_id":"3206S"},{"n":"statusLabel","a_id":"3207S"},{"n":"status","a_id":"3208S"}]}'
}

describe('encode', function() {

    it('should encode an empty array', function() {
        let json = Codec.encode([]);
        expect(json).to.equal('[]');
    });

    it('should encode single CreatePresentationModelCommand', function() {
        let command = createCPMCommand();
        let jsonString = Codec.encode([command]);
        expect(jsonString).to.equal('[' + createCPMCommandString() + ']');
    });

    it('should encode single ValueChangedCommand with nulls', function() {
        let command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "oldValue": null,
            "newValue": null
        };
        let jsonString = Codec.encode([command]);
        expect(jsonString).to.equal('[{"id":"ValueChanged","a_id":"3357S"}]');
    });

    it('should encode single ValueChangedCommand with Strings', function() {
        let command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "oldValue": "Hello World",
            "newValue": "Good Bye"
        };
        let json = Codec.encode([command]);
        expect(json).to.equal('[{"id":"ValueChanged","a_id":"3357S","v":"Good Bye"}]');
    });

    it('should encode single ValueChangedCommand with ints', function() {
        let command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "oldValue": 41,
            "newValue": 42
        };
        let json = Codec.encode([command]);
        expect(json).to.equal('[{"id":"ValueChanged","a_id":"3357S","v":42}]');
    });

    it('should encode single ValueChangedCommand with floating points', function() {
        let command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "oldValue": 3.1415,
            "newValue": 2.7182
        };
        let json = Codec.encode([command]);
        expect(json).to.equal('[{"id":"ValueChanged","a_id":"3357S","v":2.7182}]');
    });

    it('should encode single ValueChangedCommand with booleans', function() {
        let command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "oldValue": true,
            "newValue": false
        };
        let json = Codec.encode([command]);
        expect(json).to.equal('[{"id":"ValueChanged","a_id":"3357S","v":false}]');
    });

    it('should encode two custom codec commands', function() {
        let command = createCPMCommand();
        let json = Codec.encode([command, command]);
        let expected = createCPMCommandString();
        expect(json).to.equal('[' + expected + ',' + expected + ']');
    });
});



describe('decode', function() {

    it('should decode an empty array', function() {
        let commands = Codec.decode('[]');

        expect(commands).to.be.empty;
    });

    it('should decode single CreatePresentationModelCommand', function() {
        let commands = Codec.decode('[' + createCPMCommandString() + ']');

        expect(commands).to.deep.equal([createCPMCommand()]);
    });

    it('should decode single ValueChangedCommand with nulls', function() {
        let commands = Codec.decode('[{"a_id":"3357S","id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "newValue": null
        }]);
    });

    it('should decode single ValueChangedCommand with Strings', function() {
        let commands = Codec.decode('[{"a_id":"3357S","v":"Good Bye","id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "newValue": "Good Bye"
        }]);
    });

    it('should decode single ValueChangedCommand with ints', function() {
        let commands = Codec.decode('[{"a_id":"3357S","v":42,"id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "newValue": 42
        }]);
    });

    it('should decode single ValueChangedCommand with floating points', function() {
        let commands = Codec.decode('[{"a_id":"3357S","v":2.7182,"id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "newValue": 2.7182
        }]);
    });

    it('should decode single ValueChangedCommand with booleans', function() {
        let commands = Codec.decode('[{"a_id":"3357S","v":false,"id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "newValue": false
        }]);
    });


    it('should decode two custom codec commands', function() {
        let customCodecCommandString = createCPMCommandString();

        let commands = Codec.decode('[' + customCodecCommandString + ',' + customCodecCommandString + ']');

        let customCodecCommand = createCPMCommand();
        expect(commands).to.deep.equal([customCodecCommand, customCodecCommand]);
    });
});