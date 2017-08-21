"use strict";

var _checkMethodName;

var exists = function(object) {
    return typeof object !== 'undefined' && object !== null;
};

module.exports.exists = exists;

module.exports.checkMethod = function(name) {
    _checkMethodName = name;
};

module.exports.checkParam = function(param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + _checkMethodName);
    }
};
