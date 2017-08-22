var _checkMethodName;

export function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}

export function checkMethod(name) {
    _checkMethodName = name;
}

export function checkParam(param, parameterName) {
    if(!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + _checkMethodName);
    }
}