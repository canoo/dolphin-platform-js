/*jslint browserify: true, mocha: true, expr: true */
"use strict";

var expect = require('chai').expect;

var Codec = require('../../src/codec.js');
var encode = Codec.encode;
var decode = Codec.decode;



describe('encode', function() {

    it('should encode an empty array', function() {
        var json = encode([]);
        expect(json).to.equal('[]');
    });

    it('should encode single CreatePresentationModelCommand', function() {
        var command = createCPMCommand();
        var json = encode([command]);
        expect(json).to.equal('[' + createCPMCommandString() + ']');
    });

    it('should encode single ValueChangedCommand with nulls', function() {
        var command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": null,
            "newValue": null
        };
        var json = encode([command]);
        expect(json).to.equal('[{"a":"3357S","id":"ValueChanged"}]');
    });

    it('should encode single ValueChangedCommand with Strings', function() {
        var command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": "Hello World",
            "newValue": "Good Bye"
        };
        var json = encode([command]);
        expect(json).to.equal('[{"a":"3357S","o":"Hello World","n":"Good Bye","id":"ValueChanged"}]');
    });

    it('should encode single ValueChangedCommand with ints', function() {
        var command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": 41,
            "newValue": 42
        };
        var json = encode([command]);
        expect(json).to.equal('[{"a":"3357S","o":41,"n":42,"id":"ValueChanged"}]');
    });

    it('should encode single ValueChangedCommand with floating points', function() {
        var command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": 3.1415,
            "newValue": 2.7182
        };
        var json = encode([command]);
        expect(json).to.equal('[{"a":"3357S","o":3.1415,"n":2.7182,"id":"ValueChanged"}]');
    });

    it('should encode single ValueChangedCommand with booleans', function() {
        var command = {
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": true,
            "newValue": false
        };
        var json = encode([command]);
        expect(json).to.equal('[{"a":"3357S","o":true,"n":false,"id":"ValueChanged"}]');
    });

    it('should encode single NamedCommand', function() {
        var command = createNamedCommand();
        var json = encode([command]);
        expect(json).to.equal('[' + createNamedCommandString() + ']');
    });

    it('should encode two custom codec commands', function() {
        var command = createCPMCommand();
        var json = encode([command, command]);
        var expected = createCPMCommandString();
        expect(json).to.equal('[' + expected + ',' + expected + ']');
    });

    it('should encode two standard codec commands', function() {
        var command = createNamedCommand();
        var json = encode([command, command]);
        var expected = createNamedCommandString();
        expect(json).to.equal('[' + expected + ',' + expected + ']');
    });

    it('should encode custom codec command and standard codec command', function() {
        var customCodecCommand = createCPMCommand();
        var standardCodecCommand = createNamedCommand();
        var json = encode([customCodecCommand, standardCodecCommand]);
        var customCodecCommandString = createCPMCommandString();
        var standardCodecCommandString = createNamedCommandString();
        expect(json).to.equal('[' + customCodecCommandString + ',' + standardCodecCommandString + ']');
    });

    it('should encode custom codec command and standard codec command', function() {
        var standardCodecCommand = createNamedCommand();
        var customCodecCommand = createCPMCommand();
        var json = encode([standardCodecCommand, customCodecCommand]);
        var standardCodecCommandString = createNamedCommandString();
        var customCodecCommandString = createCPMCommandString();
        expect(json).to.equal('[' + standardCodecCommandString + ',' + customCodecCommandString + ']');
    });
});



describe('decode', function() {

    it('should decode an empty array', function() {
        var commands = decode('[]');

        expect(commands).to.be.empty;
    });

    it('should decode single CreatePresentationModelCommand', function() {
        var commands = decode('[' + createCPMCommandString() + ']');

        expect(commands).to.deep.equal([createCPMCommand()]);
    });

    it('should decode single ValueChangedCommand with nulls', function() {
        var commands = decode('[{"a":"3357S","id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": null,
            "newValue": null
        }]);
    });

    it('should decode single ValueChangedCommand with Strings', function() {
        var commands = decode('[{"a":"3357S","o":"Hello World","n":"Good Bye","id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": "Hello World",
            "newValue": "Good Bye"
        }]);
    });

    it('should decode single ValueChangedCommand with ints', function() {
        var commands = decode('[{"a":"3357S","o":41,"n":42,"id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": 41,
            "newValue": 42
        }]);
    });

    it('should decode single ValueChangedCommand with floating points', function() {
        var commands = decode('[{"a":"3357S","o":3.1415,"n":2.7182,"id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": 3.1415,
            "newValue": 2.7182
        }]);
    });

    it('should decode single ValueChangedCommand with booleans', function() {
        var commands = decode('[{"a":"3357S","o":true,"n":false,"id":"ValueChanged"}]');

        expect(commands).to.deep.equal([{
            "id": "ValueChanged",
            "attributeId": "3357S",
            "className": "org.opendolphin.core.comm.ValueChangedCommand",
            "oldValue": true,
            "newValue": false
        }]);
    });

    it('should decode single NamedCommand', function() {
        var commands = decode('[' + createNamedCommandString() + ']');

        expect(commands).to.deep.equal([createNamedCommand()]);
    });

    it('should decode two custom codec commands', function() {
        var customCodecCommandString = createCPMCommandString();

        var commands = decode('[' + customCodecCommandString + ',' + customCodecCommandString + ']');

        var customCodecCommand = createCPMCommand();
        expect(commands).to.deep.equal([customCodecCommand, customCodecCommand]);
    });

    it('should decode two standard codec commands', function() {
        var standardCodecCommandString = createNamedCommandString();

        var commands = decode('[' + standardCodecCommandString + ',' + standardCodecCommandString + ']');

        var standardCodecCommand = createNamedCommand();
        expect(commands).to.deep.equal([standardCodecCommand, standardCodecCommand]);
    });

    it('should decode custom codec command and standard codec command', function() {
        var customCodecCommandString = createCPMCommandString();
        var standardCodecCommandString = createNamedCommandString();

        var commands = decode('[' + customCodecCommandString + ',' + standardCodecCommandString + ']');

        var customCodecCommand = createCPMCommand();
        var standardCodecCommand = createNamedCommand();
        expect(commands).to.deep.equal([customCodecCommand, standardCodecCommand]);
    });

    it('should decode standard codec command and custom codec command', function() {
        var standardCodecCommandString = createNamedCommandString();
        var customCodecCommandString = createCPMCommandString();

        var commands = decode('[' + standardCodecCommandString + ',' + customCodecCommandString + ']');

        var standardCodecCommand = createNamedCommand();
        var customCodecCommand = createCPMCommand();
        expect(commands).to.deep.equal([standardCodecCommand, customCodecCommand]);
    });
});



function createCPMCommand() {
    return {
        "pmId": "05ee43b7-a884-4d42-9fc5-00b083664eed",
        "clientSideOnly": false,
        "id": "CreatePresentationModel",
        "attributes": [
            {
                "propertyName": "@@@ SOURCE_SYSTEM @@@",
                "id": "3204S",
                "qualifier": null,
                "value": "server",
                "baseValue": "server",
                "tag": "VALUE"
            },
            {
                "propertyName": "caseDetailsLabel",
                "id": "3205S",
                "qualifier": null,
                "value": null,
                "baseValue": null,
                "tag": "VALUE"
            },
            {
                "propertyName": "caseIdLabel",
                "id": "3206S",
                "qualifier": null,
                "value": null,
                "baseValue": null,
                "tag": "VALUE"
            },
            {
                "propertyName": "statusLabel",
                "id": "3207S",
                "qualifier": null,
                "value": null,
                "baseValue": null,
                "tag": "VALUE"
            },
            {
                "propertyName": "status",
                "id": "3208S",
                "qualifier": null,
                "value": null,
                "baseValue": null,
                "tag": "VALUE"
            }
        ],
        "pmType": "com.canoo.icos.casemanager.model.casedetails.CaseInfoBean",
        "className": "org.opendolphin.core.comm.CreatePresentationModelCommand"
    };
}

function createCPMCommandString() {
    return '{' +
        '"p":"05ee43b7-a884-4d42-9fc5-00b083664eed",' +
        '"t":"com.canoo.icos.casemanager.model.casedetails.CaseInfoBean",' +
        '"a":[' +
        '{' +
        '"n":"@@@ SOURCE_SYSTEM @@@",' +
        '"i":"3204S",' +
        '"v":"server"' +
        '},{' +
        '"n":"caseDetailsLabel",' +
        '"i":"3205S"' +
        '},{' +
        '"n":"caseIdLabel",' +
        '"i":"3206S"' +
        '},{' +
        '"n":"statusLabel",' +
        '"i":"3207S"' +
        '},{' +
        '"n":"status",' +
        '"i":"3208S"' +
        '}' +
        '],' +
        '"id":"CreatePresentationModel"' +
        '}';
}



function createNamedCommand() {
    return {
        "id": "dolphin_platform_intern_registerController",
        "className": "org.opendolphin.core.comm.NamedCommand"
    };
}

function createNamedCommandString() {
    return '{"id":"dolphin_platform_intern_registerController","className":"org.opendolphin.core.comm.NamedCommand"}';
}
