(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dolphin"] = factory();
	else
		root["dolphin"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 71);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = exists;
/* harmony export (immutable) */ __webpack_exports__["a"] = checkMethod;
/* harmony export (immutable) */ __webpack_exports__["b"] = checkParam;
var _checkMethodName;

function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}

function checkMethod(name) {
    _checkMethodName = name;
}

function checkParam(param, parameterName) {
    if(!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + _checkMethodName);
    }
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const ATTRIBUTE_METADATA_CHANGED_COMMAND_ID = 'AttributeMetadataChanged';
/* harmony export (immutable) */ __webpack_exports__["b"] = ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;

const CALL_ACTION_COMMAND_ID = 'CallAction';
/* harmony export (immutable) */ __webpack_exports__["c"] = CALL_ACTION_COMMAND_ID;

const CHANGE_ATTRIBUTE_METADATA_COMMAND_ID = 'ChangeAttributeMetadata';
/* harmony export (immutable) */ __webpack_exports__["d"] = CHANGE_ATTRIBUTE_METADATA_COMMAND_ID;

const CREATE_CONTEXT_COMMAND_ID = 'CreateContext';
/* harmony export (immutable) */ __webpack_exports__["f"] = CREATE_CONTEXT_COMMAND_ID;

const CREATE_CONTROLLER_COMMAND_ID = 'CreateController';
/* harmony export (immutable) */ __webpack_exports__["g"] = CREATE_CONTROLLER_COMMAND_ID;

const CREATE_PRESENTATION_MODEL_COMMAND_ID = 'CreatePresentationModel';
/* harmony export (immutable) */ __webpack_exports__["h"] = CREATE_PRESENTATION_MODEL_COMMAND_ID;

const DELETE_PRESENTATION_MODEL_COMMAND_ID = 'DeletePresentationModel';
/* harmony export (immutable) */ __webpack_exports__["i"] = DELETE_PRESENTATION_MODEL_COMMAND_ID;

const DESTROY_CONTEXT_COMMAND_ID = 'DestroyContext';
/* harmony export (immutable) */ __webpack_exports__["j"] = DESTROY_CONTEXT_COMMAND_ID;

const DESTROY_CONTROLLER_COMMAND_ID = 'DestroyController';
/* harmony export (immutable) */ __webpack_exports__["k"] = DESTROY_CONTROLLER_COMMAND_ID;

const INTERRUPT_LONG_POLL_COMMAND_ID = 'InterruptLongPoll';
/* harmony export (immutable) */ __webpack_exports__["m"] = INTERRUPT_LONG_POLL_COMMAND_ID;

const PRESENTATION_MODEL_DELETED_COMMAND_ID = 'PresentationModelDeleted';
/* harmony export (immutable) */ __webpack_exports__["s"] = PRESENTATION_MODEL_DELETED_COMMAND_ID;

const START_LONG_POLL_COMMAND_ID = 'StartLongPoll';
/* harmony export (immutable) */ __webpack_exports__["t"] = START_LONG_POLL_COMMAND_ID;

const VALUE_CHANGED_COMMAND_ID = 'ValueChanged';
/* harmony export (immutable) */ __webpack_exports__["v"] = VALUE_CHANGED_COMMAND_ID;


const ID = "id";
/* harmony export (immutable) */ __webpack_exports__["l"] = ID;

const ATTRIBUTE_ID = "a_id";
/* harmony export (immutable) */ __webpack_exports__["a"] = ATTRIBUTE_ID;

const PM_ID = "p_id";
/* harmony export (immutable) */ __webpack_exports__["q"] = PM_ID;

const CONTROLLER_ID = "c_id";
/* harmony export (immutable) */ __webpack_exports__["e"] = CONTROLLER_ID;

const PM_TYPE = "t";
/* harmony export (immutable) */ __webpack_exports__["r"] = PM_TYPE;

const NAME = "n";
/* harmony export (immutable) */ __webpack_exports__["n"] = NAME;

const VALUE = "v";
/* harmony export (immutable) */ __webpack_exports__["u"] = VALUE;

const PARAMS = "p";
/* harmony export (immutable) */ __webpack_exports__["o"] = PARAMS;

const PM_ATTRIBUTES = "a";
/* harmony export (immutable) */ __webpack_exports__["p"] = PM_ATTRIBUTES;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(57)('wks')
  , uid        = __webpack_require__(34)
  , Symbol     = __webpack_require__(3).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(6)
  , createDesc = __webpack_require__(54);
module.exports = __webpack_require__(8) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(10)
  , IE8_DOM_DEFINE = __webpack_require__(84)
  , toPrimitive    = __webpack_require__(85)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(19)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(29);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , core      = __webpack_require__(4)
  , ctx       = __webpack_require__(9)
  , hide      = __webpack_require__(5)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const JS_STRING_TYPE = 'string';
/* harmony export (immutable) */ __webpack_exports__["k"] = JS_STRING_TYPE;


const DOLPHIN_BEAN = 0;
/* harmony export (immutable) */ __webpack_exports__["f"] = DOLPHIN_BEAN;

const BYTE = 1;
/* harmony export (immutable) */ __webpack_exports__["c"] = BYTE;

const SHORT = 2;
/* harmony export (immutable) */ __webpack_exports__["p"] = SHORT;

const INT = 3;
/* harmony export (immutable) */ __webpack_exports__["j"] = INT;

const LONG = 4;
/* harmony export (immutable) */ __webpack_exports__["n"] = LONG;

const FLOAT = 5;
/* harmony export (immutable) */ __webpack_exports__["i"] = FLOAT;

const DOUBLE = 6;
/* harmony export (immutable) */ __webpack_exports__["g"] = DOUBLE;

const BOOLEAN = 7;
/* harmony export (immutable) */ __webpack_exports__["b"] = BOOLEAN;

const STRING = 8;
/* harmony export (immutable) */ __webpack_exports__["q"] = STRING;

const DATE = 9;
/* harmony export (immutable) */ __webpack_exports__["e"] = DATE;

const ENUM = 10;
/* harmony export (immutable) */ __webpack_exports__["h"] = ENUM;

const CALENDAR = 11;
/* harmony export (immutable) */ __webpack_exports__["d"] = CALENDAR;

const LOCAL_DATE_FIELD_TYPE = 55;
/* harmony export (immutable) */ __webpack_exports__["l"] = LOCAL_DATE_FIELD_TYPE;

const LOCAL_DATE_TIME_FIELD_TYPE = 52;
/* harmony export (immutable) */ __webpack_exports__["m"] = LOCAL_DATE_TIME_FIELD_TYPE;

const ZONED_DATE_TIME_FIELD_TYPE = 54;
/* harmony export (immutable) */ __webpack_exports__["r"] = ZONED_DATE_TIME_FIELD_TYPE;



const ADDED_TYPE = "ADDED";
/* harmony export (immutable) */ __webpack_exports__["a"] = ADDED_TYPE;

const REMOVED_TYPE = "REMOVED";
/* harmony export (immutable) */ __webpack_exports__["o"] = REMOVED_TYPE;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__impl_createContextCommand__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__impl_createControllerCommand__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__impl_callActionCommand__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__impl_destroyControllerCommand__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__impl_destroyContextCommand__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__impl_startLongPollCommand__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__impl_interruptLongPollCommand__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__impl_createPresentationModelCommand__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__impl_deletePresentationModelCommand__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__impl_presentationModelDeletedCommand__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__impl_valueChangedCommand__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__impl_changeAttributeMetadataCommand__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__impl_attributeMetadataChangedCommand__ = __webpack_require__(40);














class CommandFactory {

    static createCreateContextCommand() {
        return new __WEBPACK_IMPORTED_MODULE_0__impl_createContextCommand__["a" /* default */]();
    }

    static createCreateControllerCommand(controllerName, parentControllerId) {
        const command = new __WEBPACK_IMPORTED_MODULE_1__impl_createControllerCommand__["a" /* default */]();
        command.init(controllerName, parentControllerId);
        return command;
    }

    static createCallActionCommand(controllerid, actionName, params) {
        const command = new __WEBPACK_IMPORTED_MODULE_2__impl_callActionCommand__["a" /* default */]();
        command.init(controllerid, actionName, params);
        return command;
    }

    static createDestroyControllerCommand(controllerId) {
        const command = new __WEBPACK_IMPORTED_MODULE_3__impl_destroyControllerCommand__["a" /* default */]();
        command.init(controllerId);
        return command;
    }

    static createDestroyContextCommand() {
        return new __WEBPACK_IMPORTED_MODULE_4__impl_destroyContextCommand__["a" /* default */]();
    }

    static createStartLongPollCommand() {
        return new __WEBPACK_IMPORTED_MODULE_5__impl_startLongPollCommand__["a" /* default */]();
    }

    static createInterruptLongPollCommand() {
        return new __WEBPACK_IMPORTED_MODULE_6__impl_interruptLongPollCommand__["a" /* default */]();
    }

    static createCreatePresentationModelCommand(presentationModel) {
        const command = new __WEBPACK_IMPORTED_MODULE_7__impl_createPresentationModelCommand__["a" /* default */]();
        command.init(presentationModel);
        return command;
    }

    static createDeletePresentationModelCommand(pmId) {
        const command = new __WEBPACK_IMPORTED_MODULE_8__impl_deletePresentationModelCommand__["a" /* default */]();
        command.init(pmId);
        return command;
    }

    static createPresentationModelDeletedCommand(pmId) {
        let command = new __WEBPACK_IMPORTED_MODULE_9__impl_presentationModelDeletedCommand__["a" /* default */]();
        command.init(pmId);
        return command;
    }

    static createValueChangedCommand(attributeId, newValue) {
        let command = new __WEBPACK_IMPORTED_MODULE_10__impl_valueChangedCommand__["a" /* default */]();
        command.init(attributeId, newValue);
        return command;
    }

    static createChangeAttributeMetadataCommand(attributeId, metadataName, value) {
        let command = new __WEBPACK_IMPORTED_MODULE_11__impl_changeAttributeMetadataCommand__["a" /* default */]();
        command.init(attributeId, metadataName, value);
        return command;
    }

    static createAttributeMetadataChangedCommand(attributeId, metadataName, value) {
        let command = new __WEBPACK_IMPORTED_MODULE_12__impl_attributeMetadataChangedCommand__["a" /* default */]();
        command.init(attributeId, metadataName, value);
        return command;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CommandFactory;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SOURCE_SYSTEM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SOURCE_SYSTEM_CLIENT; });
/* unused harmony export SOURCE_SYSTEM_SERVER */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ACTION_CALL_BEAN; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(15);






const DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
const ACTION_CALL_BEAN = '@@@ CONTROLLER_ACTION_CALL_BEAN @@@';
const HIGHLANDER_BEAN = '@@@ HIGHLANDER_BEAN @@@';
const DOLPHIN_LIST_SPLICE = '@DP:LS@';
const SOURCE_SYSTEM = '@@@ SOURCE_SYSTEM @@@';
const SOURCE_SYSTEM_CLIENT = 'client';
const SOURCE_SYSTEM_SERVER = 'server';

class Connector{

    constructor(url, dolphin, classRepository, config) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('Connector(url, dolphin, classRepository, config)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(url, 'url');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(dolphin, 'dolphin');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(classRepository, 'classRepository');

        let self = this;
        this.dolphin = dolphin;
        this.config = config;
        this.classRepository = classRepository;
        this.highlanderPMResolver = function() {};
        this.highlanderPMPromise = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default.a(function(resolve) {
            self.highlanderPMResolver = resolve;
        });

        dolphin.getClientModelStore().onModelStoreChange((event) => {
            let model = event.clientPresentationModel;
            let sourceSystem = model.findAttributeByPropertyName(SOURCE_SYSTEM);
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(sourceSystem) && sourceSystem.value === SOURCE_SYSTEM_SERVER) {
                if (event.eventType === __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ADDED_TYPE */]) {
                    self.onModelAdded(model);
                } else if (event.eventType === __WEBPACK_IMPORTED_MODULE_3__constants__["o" /* REMOVED_TYPE */]) {
                    self.onModelRemoved(model);
                }
            }
        });
    }
    connect() {
        let that = this;
            that.dolphin.startPushListening(__WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createStartLongPollCommand(), __WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createInterruptLongPollCommand());
    }

    onModelAdded(model) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('Connector.onModelAdded(model)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(model, 'model');

        var type = model.presentationModelType;
        switch (type) {
            case ACTION_CALL_BEAN:
                // ignore
                break;
            case DOLPHIN_BEAN:
                this.classRepository.registerClass(model);
                break;
            case HIGHLANDER_BEAN:
                this.highlanderPMResolver(model);
                break;
            case DOLPHIN_LIST_SPLICE:
                this.classRepository.spliceListEntry(model);
                this.dolphin.deletePresentationModel(model);
                break;
            default:
                this.classRepository.load(model);
                break;
        }
    }

    onModelRemoved(model) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('Connector.onModelRemoved(model)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(model, 'model');
        let type = model.presentationModelType;
        switch (type) {
            case DOLPHIN_BEAN:
                this.classRepository.unregisterClass(model);
                break;
            case DOLPHIN_LIST_SPLICE:
                // do nothing
                break;
            default:
                this.classRepository.unload(model);
                break;
        }
    }

    invoke(command) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('Connector.invoke(command)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(command, 'command');

        var dolphin = this.dolphin;
        return new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default.a((resolve) => {
            dolphin.send(command, {
                onFinished: () => {
                    resolve();
                }
            });
        });
    }

    getHighlanderPM() {
        return this.highlanderPMPromise;
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = Connector;





/***/ }),
/* 18 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(6).f
  , has = __webpack_require__(12)
  , TAG = __webpack_require__(2)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(9)
  , call        = __webpack_require__(97)
  , isArrayIter = __webpack_require__(98)
  , anObject    = __webpack_require__(10)
  , toLength    = __webpack_require__(32)
  , getIterFn   = __webpack_require__(99)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__impl_valueChangedCommand__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__impl_attributeMetadataChangedCommand__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__impl_callActionCommand__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__impl_changeAttributeMetadataCommand__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__impl_createContextCommand__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__impl_createControllerCommand__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__impl_createPresentationModelCommand__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__impl_deletePresentationModelCommand__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__impl_destroyContextCommand__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__impl_destroyControllerCommand__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__impl_interruptLongPollCommand__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__impl_presentationModelDeletedCommand__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__impl_startLongPollCommand__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__codecError__ = __webpack_require__(76);




















class Codec {

    static _encodeAttributeMetadataChangedCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.encodeAttributeMetadataChangedCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.attributeId, "command.attributeId");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.metadataName, "command.metadataName");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["b" /* ATTRIBUTE_METADATA_CHANGED_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]] = command.attributeId;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]] = command.metadataName;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]] = command.value;
        return jsonCommand;
    }

    static _decodeAttributeMetadataChangedCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.decodeAttributeMetadataChangedCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]], "jsonCommand[ATTRIBUTE_ID]");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]], "jsonCommand[NAME]");

        let command = new __WEBPACK_IMPORTED_MODULE_4__impl_attributeMetadataChangedCommand__["a" /* default */]();
        command.attributeId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]];
        command.metadataName = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]];
        command.value = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]];
        return command;
    }

    static _encodeCallActionCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.encodeCallActionCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.controllerid, "command.controllerid");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.actionName, "command.actionName");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.params, "command.params");


        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["c" /* CALL_ACTION_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]] = command.controllerid;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]] = command.actionName;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["o" /* PARAMS */]] = command.params.map((param) => {
            let result = {};
            result[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]] = param.name;
            if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* exists */])(param.value)) {
                result[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]] = param.value;
            }
            return result;
        });
        return jsonCommand;
    }

    static _decodeCallActionCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.decodeCallActionCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]], "jsonCommand[CONTROLLER_ID]");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]], "jsonCommand[NAME]");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["o" /* PARAMS */]], "jsonCommand[PARAMS]");

        let command = new __WEBPACK_IMPORTED_MODULE_5__impl_callActionCommand__["a" /* default */]();
        command.controllerid = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]];
        command.actionName = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]];
        //TODO: Für die Params sollten wir eine Klasse bereitstellen
        command.params = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["o" /* PARAMS */]].map((param) => {
            return {
                'name': param[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]],
                'value': Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* exists */])(param[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]]) ? param[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]] : null
            };
        });
        return command;
    }

    static _encodeChangeAttributeMetadataCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.encodeChangeAttributeMetadataCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.attributeId, "command.attributeId");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.metadataName, "command.metadataName");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["d" /* CHANGE_ATTRIBUTE_METADATA_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]] = command.attributeId;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]] = command.metadataName;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]] = command.value;
        return jsonCommand;
    }

    static _decodeChangeAttributeMetadataCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.decodeChangeAttributeMetadataCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]], "jsonCommand[ATTRIBUTE_ID]");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]], "jsonCommand[NAME]");

        let command = new __WEBPACK_IMPORTED_MODULE_6__impl_changeAttributeMetadataCommand__["a" /* default */]();
        command.attributeId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]];
        command.metadataName = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]];
        command.value = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]];
        return command;
    }

    static _encodeCreateContextCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.encodeCreateContextCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["f" /* CREATE_CONTEXT_COMMAND_ID */];
        return jsonCommand;
    }

    static _decodeCreateContextCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.decodeCreateContextCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");

        let command = new __WEBPACK_IMPORTED_MODULE_7__impl_createContextCommand__["a" /* default */]();
        return command;
    }

    static _encodeCreateControllerCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._encodeCreateControllerCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.controllerName, "command.controllerName");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["g" /* CREATE_CONTROLLER_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]] = command.controllerName;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]] = command.parentControllerId;
        return jsonCommand;
    }

    static _decodeCreateControllerCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._decodeCreateControllerCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]], "jsonCommand[NAME]");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]], "jsonCommand[CONTROLLER_ID]");

        let command = new __WEBPACK_IMPORTED_MODULE_8__impl_createControllerCommand__["a" /* default */]();
        command.controllerName = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]];
        command.parentControllerId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]];
        return command;
    }

    static _encodeCreatePresentationModelCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.encodeCreatePresentationModelCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.pmId, "command.pmId");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.pmType, "command.pmType");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["h" /* CREATE_PRESENTATION_MODEL_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]] = command.pmId;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["r" /* PM_TYPE */]] = command.pmType;
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["p" /* PM_ATTRIBUTES */]] = command.attributes.map((attribute) => {
            let result = {};
            result[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]] = attribute.propertyName;
            result[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]] = attribute.id;
            if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* exists */])(attribute.value)) {
                result[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]] = attribute.value;
            }
            return result;
        });
        return jsonCommand;
    }

    static _decodeCreatePresentationModelCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.decodeCreatePresentationModelCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]], "jsonCommand[PM_ID]");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["r" /* PM_TYPE */]], "jsonCommand[PM_TYPE]");

        let command = new __WEBPACK_IMPORTED_MODULE_9__impl_createPresentationModelCommand__["a" /* default */]();
        command.pmId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]];
        command.pmType = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["r" /* PM_TYPE */]];

        //TODO: Für die Attribute sollten wir eine Klasse bereitstellen
        command.attributes = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["p" /* PM_ATTRIBUTES */]].map((attribute) => {
            return {
                'propertyName': attribute[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["n" /* NAME */]],
                'id': attribute[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]],
                'value': Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* exists */])(attribute[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]]) ? attribute[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]] : null
            };
        });
        return command;
    }

    static _encodeDeletePresentationModelCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._encodeDeletePresentationModelCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.pmId, "command.pmId");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["i" /* DELETE_PRESENTATION_MODEL_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]] = command.pmId;
        return jsonCommand;
    }

    static _decodeDeletePresentationModelCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._decodeDeletePresentationModelCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]], "jsonCommand[PM_ID]");


        let command = new __WEBPACK_IMPORTED_MODULE_10__impl_deletePresentationModelCommand__["a" /* default */]();
        command.pmId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]];
        return command;
    }

    static _encodeDestroyContextCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._encodeDestroyContextCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["j" /* DESTROY_CONTEXT_COMMAND_ID */];
        return jsonCommand;
    }

    static _decodeDestroyContextCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._decodeDestroyContextCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");

        let command = new __WEBPACK_IMPORTED_MODULE_11__impl_destroyContextCommand__["a" /* default */]();
        return command;
    }

    static _encodeDestroyControllerCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._encodeDestroyControllerCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.controllerId, "command.controllerId");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["k" /* DESTROY_CONTROLLER_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]] = command.controllerId;
        return jsonCommand;
    }

    static _decodeDestroyControllerCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._decodeDestroyControllerCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]], "jsonCommand[CONTROLLER_ID]");

        let command = new __WEBPACK_IMPORTED_MODULE_12__impl_destroyControllerCommand__["a" /* default */]();
        command.controllerId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["e" /* CONTROLLER_ID */]];
        return command;
    }

    static _encodeInterruptLongPollCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._encodeInterruptLongPollCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["m" /* INTERRUPT_LONG_POLL_COMMAND_ID */];
        return jsonCommand;
    }

    static _decodeInterruptLongPollCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._decodeInterruptLongPollCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");

        let command = new __WEBPACK_IMPORTED_MODULE_13__impl_interruptLongPollCommand__["a" /* default */]();
        return command;
    }

    static _encodePresentationModelDeletedCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._encodePresentationModelDeletedCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.pmId, "command.pmId");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["s" /* PRESENTATION_MODEL_DELETED_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]] = command.pmId;
        return jsonCommand;
    }

    static _decodePresentationModelDeletedCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._decodePresentationModelDeletedCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]], "jsonCommand[PM_ID]");

        let command = new __WEBPACK_IMPORTED_MODULE_14__impl_presentationModelDeletedCommand__["a" /* default */]();
        command.pmId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["q" /* PM_ID */]];
        return command;
    }

    static _encodeStartLongPollCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._encodeStartLongPollCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["t" /* START_LONG_POLL_COMMAND_ID */];
        return jsonCommand;
    }

    static _decodeStartLongPollCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec._decodeStartLongPollCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");

        let command = new __WEBPACK_IMPORTED_MODULE_15__impl_startLongPollCommand__["a" /* default */]();
        return command;
    }

    static _encodeValueChangedCommand(command) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.encodeValueChangedCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command, "command");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(command.attributeId, "command.attributeId");

        let jsonCommand = {};
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["l" /* ID */]] = __WEBPACK_IMPORTED_MODULE_2__commandConstants__["v" /* VALUE_CHANGED_COMMAND_ID */];
        jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]] = command.attributeId;
        if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* exists */])(command.newValue)) {
            jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]] = command.newValue;
        }
        return jsonCommand;
    }

    static _decodeValueChangedCommand(jsonCommand) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.decodeValueChangedCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand, "jsonCommand");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]], "jsonCommand[ATTRIBUTE_ID]");

        let command = new __WEBPACK_IMPORTED_MODULE_3__impl_valueChangedCommand__["a" /* default */]();
        command.attributeId = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["a" /* ATTRIBUTE_ID */]];
        if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* exists */])(jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]])) {
            command.newValue = jsonCommand[__WEBPACK_IMPORTED_MODULE_2__commandConstants__["u" /* VALUE */]];
        } else {
            command.newValue = null;
        }
        return command;
    }

    static encode(commands) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.encode");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(commands, "commands");

        let self = this;
        return JSON.stringify(commands.map((command) => {
            if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["b" /* ATTRIBUTE_METADATA_CHANGED_COMMAND_ID */]) {
                return self._encodeAttributeMetadataChangedCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["c" /* CALL_ACTION_COMMAND_ID */]) {
                return self._encodeCallActionCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["d" /* CHANGE_ATTRIBUTE_METADATA_COMMAND_ID */]) {
                return self._encodeChangeAttributeMetadataCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["f" /* CREATE_CONTEXT_COMMAND_ID */]) {
                return self._encodeCreateContextCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["g" /* CREATE_CONTROLLER_COMMAND_ID */]) {
                return self._encodeCreateControllerCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["h" /* CREATE_PRESENTATION_MODEL_COMMAND_ID */]) {
                return self._encodeCreatePresentationModelCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["i" /* DELETE_PRESENTATION_MODEL_COMMAND_ID */]) {
                return self._encodeDeletePresentationModelCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["j" /* DESTROY_CONTEXT_COMMAND_ID */]) {
                return self._encodeDestroyContextCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["k" /* DESTROY_CONTROLLER_COMMAND_ID */]) {
                return self._encodeDestroyControllerCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["m" /* INTERRUPT_LONG_POLL_COMMAND_ID */]) {
                return self._encodeInterruptLongPollCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["s" /* PRESENTATION_MODEL_DELETED_COMMAND_ID */]) {
                return self._encodePresentationModelDeletedCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["t" /* START_LONG_POLL_COMMAND_ID */]) {
                return self._encodeStartLongPollCommand(command);
            } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["v" /* VALUE_CHANGED_COMMAND_ID */]) {
                return self._encodeValueChangedCommand(command);
            } else {
                throw new __WEBPACK_IMPORTED_MODULE_16__codecError__["a" /* default */]('Command of type ' + command.id + ' can not be handled');
            }
        }));
    }

    static decode(transmitted) {
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* checkMethod */])("Codec.decode");
        Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* checkParam */])(transmitted, "transmitted");

        if (typeof transmitted === __WEBPACK_IMPORTED_MODULE_1__constants__["k" /* JS_STRING_TYPE */]) {
            let self = this;
            return JSON.parse(transmitted).map(function (command) {
                if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["b" /* ATTRIBUTE_METADATA_CHANGED_COMMAND_ID */]) {
                    return self._decodeAttributeMetadataChangedCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["c" /* CALL_ACTION_COMMAND_ID */]) {
                    return self._decodeCallActionCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["d" /* CHANGE_ATTRIBUTE_METADATA_COMMAND_ID */]) {
                    return self._decodeChangeAttributeMetadataCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["f" /* CREATE_CONTEXT_COMMAND_ID */]) {
                    return self._decodeCreateContextCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["g" /* CREATE_CONTROLLER_COMMAND_ID */]) {
                    return self._decodeCreateControllerCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["h" /* CREATE_PRESENTATION_MODEL_COMMAND_ID */]) {
                    return self._decodeCreatePresentationModelCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["i" /* DELETE_PRESENTATION_MODEL_COMMAND_ID */]) {
                    return self._decodeDeletePresentationModelCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["j" /* DESTROY_CONTEXT_COMMAND_ID */]) {
                    return self._decodeDestroyContextCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["k" /* DESTROY_CONTROLLER_COMMAND_ID */]) {
                    return self._decodeDestroyControllerCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["m" /* INTERRUPT_LONG_POLL_COMMAND_ID */]) {
                    return self._decodeInterruptLongPollCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["s" /* PRESENTATION_MODEL_DELETED_COMMAND_ID */]) {
                    return self._decodePresentationModelDeletedCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["t" /* START_LONG_POLL_COMMAND_ID */]) {
                    return self._decodeStartLongPollCommand(command);
                } else if (command.id === __WEBPACK_IMPORTED_MODULE_2__commandConstants__["v" /* VALUE_CHANGED_COMMAND_ID */]) {
                    return self._decodeValueChangedCommand(command);
                } else {
                    throw new __WEBPACK_IMPORTED_MODULE_16__codecError__["a" /* default */]('Command of type ' + command.id + ' can not be handled');
                }
            });
        } else {
            throw new __WEBPACK_IMPORTED_MODULE_16__codecError__["a" /* default */]('Can not decode data that is not of type string');
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Codec;


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EventBus {

    constructor() {
        this.eventHandlers = [];
    }

    onEvent(eventHandler) {
        this.eventHandlers.push(eventHandler);
    }

    trigger(event) {
        this.eventHandlers.forEach(handle => handle(event));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EventBus;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(35);
__webpack_require__(96);
module.exports = __webpack_require__(4).Promise;

/***/ }),
/* 25 */
/***/ (function(module, exports) {



/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(83)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(28)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(53)
  , $export        = __webpack_require__(11)
  , redefine       = __webpack_require__(86)
  , hide           = __webpack_require__(5)
  , has            = __webpack_require__(12)
  , Iterators      = __webpack_require__(13)
  , $iterCreate    = __webpack_require__(87)
  , setToStringTag = __webpack_require__(20)
  , getPrototypeOf = __webpack_require__(93)
  , ITERATOR       = __webpack_require__(2)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7)
  , document = __webpack_require__(3).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(56)
  , defined = __webpack_require__(18);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(27)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(57)('keys')
  , uid    = __webpack_require__(34);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(94);
var global        = __webpack_require__(3)
  , hide          = __webpack_require__(5)
  , Iterators     = __webpack_require__(13)
  , TO_STRING_TAG = __webpack_require__(2)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(14)
  , TAG = __webpack_require__(2)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(5);
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class ValueChangedCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["v" /* VALUE_CHANGED_COMMAND_ID */];
    }

    init(attributeId, newValue) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('ValueChangedCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(attributeId, 'attributeId');

        this.attributeId = attributeId;
        this.newValue = newValue;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ValueChangedCommand;


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class AttributeMetadataChangedCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["b" /* ATTRIBUTE_METADATA_CHANGED_COMMAND_ID */];
    }

    init(attributeId, metadataName, value) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('AttributeMetadataChangedCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(attributeId, 'attributeId');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(metadataName, 'metadataName');

        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AttributeMetadataChangedCommand;


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class CallActionCommand {
    
    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["c" /* CALL_ACTION_COMMAND_ID */];
    }

    init(controllerid, actionName, params) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('CreateControllerCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(controllerid, 'controllerid');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(actionName, 'actionName');

        this.controllerid = controllerid;
        this.actionName = actionName;
        this.params = params;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = CallActionCommand;


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class ChangeAttributeMetadataCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["d" /* CHANGE_ATTRIBUTE_METADATA_COMMAND_ID */];
    }

    init(attributeId, metadataName, value) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('ChangeAttributeMetadataCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(attributeId, 'attributeId');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(metadataName, 'metadataName');

        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ChangeAttributeMetadataCommand;


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);


class CreateContextCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["f" /* CREATE_CONTEXT_COMMAND_ID */];
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = CreateContextCommand;


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class CreateControllerCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["g" /* CREATE_CONTROLLER_COMMAND_ID */];
    }

    init(controllerName, parentControllerId) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('CreateControllerCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(controllerName, 'controllerName');

        this.controllerName = controllerName;
        this.parentControllerId = parentControllerId;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = CreateControllerCommand;


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class CreatePresentationModelCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["h" /* CREATE_PRESENTATION_MODEL_COMMAND_ID */];
    }

    init(presentationModel) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('CreatePresentationModelCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(presentationModel, 'presentationModel');

        this.attributes = [];
        this.clientSideOnly = false;
        this.pmId = presentationModel.id;
        this.pmType = presentationModel.presentationModelType;
        var command = this;
        presentationModel.getAttributes().forEach(function (attr) {
            command.attributes.push({
                propertyName: attr.propertyName,
                id: attr.id,
                value: attr.getValue()
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CreatePresentationModelCommand;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class DeletePresentationModelCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["i" /* DELETE_PRESENTATION_MODEL_COMMAND_ID */];
    }

    init(pmId) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('DeletePresentationModelCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(pmId, 'pmId');

        this.pmId = pmId;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DeletePresentationModelCommand;



/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);


class DestroyContextCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["j" /* DESTROY_CONTEXT_COMMAND_ID */];
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = DestroyContextCommand;


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class DestroyControllerCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["k" /* DESTROY_CONTROLLER_COMMAND_ID */];
    }

    init(controllerId) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('DestroyControllerCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(controllerId, 'controllerId');

        this.controllerId = controllerId;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = DestroyControllerCommand;


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);


class InterruptLongPollCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["m" /* INTERRUPT_LONG_POLL_COMMAND_ID */];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = InterruptLongPollCommand;


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class PresentationModelDeletedCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["s" /* PRESENTATION_MODEL_DELETED_COMMAND_ID */];
    }

    init(pmId) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('PresentationModelDeletedCommand.init()');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(pmId, 'pmId');

        this.pmId = pmId;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PresentationModelDeletedCommand;


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandConstants__ = __webpack_require__(1);


class StartLongPollCommand {

    constructor() {
        this.id = __WEBPACK_IMPORTED_MODULE_0__commandConstants__["t" /* START_LONG_POLL_COMMAND_ID */];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StartLongPollCommand;



/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__eventBus__ = __webpack_require__(23);


var presentationModelInstanceCount = 0; // todo dk: consider making this static in class

class ClientPresentationModel {
    constructor(id, presentationModelType) {
        this.id = id;
        this.presentationModelType = presentationModelType;
        this.attributes = [];
        this.clientSideOnly = false;
        this.dirty = false;
        if (typeof id !== 'undefined' && id != null) {
            this.id = id;
        }
        else {
            this.id = (presentationModelInstanceCount++).toString();
        }
        this.invalidBus = new __WEBPACK_IMPORTED_MODULE_0__eventBus__["a" /* default */]();
        this.dirtyValueChangeBus = new __WEBPACK_IMPORTED_MODULE_0__eventBus__["a" /* default */]();
    }
    // todo dk: align with Java version: move to ClientDolphin and auto-add to model store
    /** a copy constructor for anything but IDs. Per default, copies are client side only, no automatic update applies. */
    copy() {
        var result = new ClientPresentationModel(null, this.presentationModelType);
        result.clientSideOnly = true;
        this.getAttributes().forEach((attribute) => {
            var attributeCopy = attribute.copy();
            result.addAttribute(attributeCopy);
        });
        return result;
    }
    //add array of attributes
    addAttributes(attributes) {
        if (!attributes || attributes.length < 1)
            return;
        attributes.forEach(attr => {
            this.addAttribute(attr);
        });
    }
    addAttribute(attribute) {
        if (!attribute || (this.attributes.indexOf(attribute) > -1)) {
            return;
        }
        if (this.findAttributeByPropertyName(attribute.propertyName)) {
            throw new Error("There already is an attribute with property name: " + attribute.propertyName
                + " in presentation model with id: " + this.id);
        }
        if (attribute.getQualifier() && this.findAttributeByQualifier(attribute.getQualifier())) {
            throw new Error("There already is an attribute with qualifier: " + attribute.getQualifier()
                + " in presentation model with id: " + this.id);
        }
        attribute.setPresentationModel(this);
        this.attributes.push(attribute);
        attribute.onValueChange(() => {
            this.invalidBus.trigger({ source: this });
        });
    }
    onInvalidated(handleInvalidate) {
        this.invalidBus.onEvent(handleInvalidate);
    }
    /** returns a copy of the internal state */
    getAttributes() {
        return this.attributes.slice(0);
    }
    getAt(propertyName) {
        return this.findAttributeByPropertyName(propertyName);
    }
    findAllAttributesByPropertyName(propertyName) {
        var result = [];
        if (!propertyName)
            return null;
        this.attributes.forEach((attribute) => {
            if (attribute.propertyName == propertyName) {
                result.push(attribute);
            }
        });
        return result;
    }
    findAttributeByPropertyName(propertyName) {
        if (!propertyName)
            return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if ((this.attributes[i].propertyName == propertyName)) {
                return this.attributes[i];
            }
        }
        return null;
    }
    findAttributeByQualifier(qualifier) {
        if (!qualifier)
            return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].getQualifier() == qualifier) {
                return this.attributes[i];
            }
        }
        return null;
    }
    findAttributeById(id) {
        if (!id)
            return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].id == id) {
                return this.attributes[i];
            }
        }
        return null;
    }
    syncWith(sourcePresentationModel) {
        this.attributes.forEach((targetAttribute) => {
            var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName);
            if (sourceAttribute) {
                targetAttribute.syncWith(sourceAttribute);
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClientPresentationModel;



/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(10)
  , dPs         = __webpack_require__(88)
  , enumBugKeys = __webpack_require__(58)
  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(30)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(59).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(14);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 58 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3).document && document.documentElement;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(18);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(9)
  , invoke             = __webpack_require__(101)
  , html               = __webpack_require__(59)
  , cel                = __webpack_require__(30)
  , global             = __webpack_require__(3)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(14)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(3)
  , core        = __webpack_require__(4)
  , dP          = __webpack_require__(6)
  , DESCRIPTORS = __webpack_require__(8)
  , SPECIES     = __webpack_require__(2)('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(35);
__webpack_require__(105);
__webpack_require__(110);
module.exports = __webpack_require__(4).Map;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(6).f
  , create      = __webpack_require__(55)
  , redefineAll = __webpack_require__(38)
  , ctx         = __webpack_require__(9)
  , anInstance  = __webpack_require__(37)
  , defined     = __webpack_require__(18)
  , forOf       = __webpack_require__(21)
  , $iterDefine = __webpack_require__(28)
  , step        = __webpack_require__(61)
  , setSpecies  = __webpack_require__(63)
  , DESCRIPTORS = __webpack_require__(8)
  , fastKey     = __webpack_require__(66).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(34)('meta')
  , isObject = __webpack_require__(7)
  , has      = __webpack_require__(12)
  , setDesc  = __webpack_require__(6).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(19)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(3)
  , $export        = __webpack_require__(11)
  , meta           = __webpack_require__(66)
  , fails          = __webpack_require__(19)
  , hide           = __webpack_require__(5)
  , redefineAll    = __webpack_require__(38)
  , forOf          = __webpack_require__(21)
  , anInstance     = __webpack_require__(37)
  , isObject       = __webpack_require__(7)
  , setToStringTag = __webpack_require__(20)
  , dP             = __webpack_require__(6).f
  , each           = __webpack_require__(106)(0)
  , DESCRIPTORS    = __webpack_require__(8);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(36)
  , from    = __webpack_require__(111);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(35);
__webpack_require__(114);
__webpack_require__(115);
module.exports = __webpack_require__(4).Set;

/***/ }),
/* 70 */
/***/ (function(module, exports) {


/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createClientContext", function() { return createClientContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientContextFactory", function() { return ClientContextFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__openDolphin_js__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__connector__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__beanmanager__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classrepo__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllermanager__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__clientcontext__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__platformHttpTransmitter__ = __webpack_require__(118);
/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */










class ClientContextFactory {

    create(url, config){
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('connect(url, config)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(url, 'url');
        console.log('Creating client context '+ url +'    '+ JSON.stringify(config));

        let builder = Object(__WEBPACK_IMPORTED_MODULE_0__openDolphin_js__["a" /* makeDolphin */])().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
        if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(config)) {
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(config.errorHandler)) {
                builder.errorHandler(config.errorHandler);
            }
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(config.headersInfo) && Object.keys(config.headersInfo).length > 0) {
                builder.headersInfo(config.headersInfo);
            }
        }

        let dolphin = builder.build();

        let transmitter = new __WEBPACK_IMPORTED_MODULE_7__platformHttpTransmitter__["a" /* default */](url, config);
        transmitter.on('error', function (error) {
            clientContext.emit('error', error);
        });
        dolphin.clientConnector.transmitter = transmitter;

        let classRepository = new __WEBPACK_IMPORTED_MODULE_4__classrepo__["a" /* default */](dolphin);
        let beanManager = new __WEBPACK_IMPORTED_MODULE_3__beanmanager__["a" /* default */](classRepository);
        let connector = new __WEBPACK_IMPORTED_MODULE_2__connector__["d" /* default */](url, dolphin, classRepository, config);
        let controllerManager = new __WEBPACK_IMPORTED_MODULE_5__controllermanager__["a" /* default */](dolphin, classRepository, connector);

        let clientContext = new __WEBPACK_IMPORTED_MODULE_6__clientcontext__["a" /* default */](dolphin, beanManager, controllerManager, connector);
        return clientContext;
    }
}

let createClientContext = new ClientContextFactory().create;



/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export dolphin */
/* harmony export (immutable) */ __webpack_exports__["a"] = makeDolphin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dolphinBuilder__ = __webpack_require__(73);


function dolphin(url, reset, slackMS = 300) {
    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}

function makeDolphin() {
    return new __WEBPACK_IMPORTED_MODULE_0__dolphinBuilder__["a" /* default */]();
}

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__clientConnector__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clientDolphin__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clientModelStore__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__httpTransmitter__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__noTransmitter__ = __webpack_require__(82);







class DolphinBuilder {

    constructor() {
        this.reset_ = false;
        this.slackMS_ = 300;
        this.maxBatchSize_ = 50;
        this.supportCORS_ = false;
    }

    url(url) {
        this.url_ = url;
        return this;
    }

    reset(reset) {
        this.reset_ = reset;
        return this;
    }

    slackMS(slackMS) {
        this.slackMS_ = slackMS;
        return this;
    }

    maxBatchSize(maxBatchSize) {
        this.maxBatchSize_ = maxBatchSize;
        return this;
    }

    supportCORS(supportCORS) {
        this.supportCORS_ = supportCORS;
        return this;
    }

    errorHandler(errorHandler) {
        this.errorHandler_ = errorHandler;
        return this;
    }

    headersInfo(headersInfo) {
        this.headersInfo_ = headersInfo;
        return this;
    }

    build() {
        console.log("OpenDolphin js found");
        var clientDolphin = new __WEBPACK_IMPORTED_MODULE_1__clientDolphin__["a" /* default */]();
        var transmitter;
        if (this.url_ != null && this.url_.length > 0) {
            transmitter = new __WEBPACK_IMPORTED_MODULE_3__httpTransmitter__["a" /* default */](this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
        }
        else {
            transmitter = new __WEBPACK_IMPORTED_MODULE_4__noTransmitter__["a" /* default */]();
        }
        clientDolphin.setClientConnector(new __WEBPACK_IMPORTED_MODULE_0__clientConnector__["a" /* default */](transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
        clientDolphin.setClientModelStore(new __WEBPACK_IMPORTED_MODULE_2__clientModelStore__["a" /* default */](clientDolphin));
        console.log("ClientDolphin initialized");
        return clientDolphin;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DolphinBuilder;


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commandBatcher__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_codec__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clientPresentationModel__ = __webpack_require__(52);




class ClientConnector {

    constructor(transmitter, clientDolphin, slackMS = 0, maxBatchSize = 50) {
        this.commandQueue = [];
        this.currentlySending = false;
        this.pushEnabled = false;
        this.waiting = false;
        this.transmitter = transmitter;
        this.clientDolphin = clientDolphin;
        this.slackMS = slackMS;
        this.codec = new __WEBPACK_IMPORTED_MODULE_1__commands_codec__["a" /* default */]();
        this.commandBatcher = new __WEBPACK_IMPORTED_MODULE_0__commandBatcher__["a" /* default */](true, maxBatchSize);
    }

    setCommandBatcher(newBatcher) {
        this.commandBatcher = newBatcher;
    }

    setPushEnabled(enabled) {
        this.pushEnabled = enabled;
    }

    setPushListener(newListener) {
        this.pushListener = newListener;
    }

    setReleaseCommand(newCommand) {
        this.releaseCommand = newCommand;
    }

    send(command, onFinished) {
        this.commandQueue.push({ command: command, handler: onFinished });
        if (this.currentlySending) {
            this.release(); // there is not point in releasing if we do not send atm
            return;
        }
        this.doSendNext();
    }

    doSendNext() {
        if (this.commandQueue.length < 1) {
            if (this.pushEnabled) {
                this.enqueuePushCommand();
            }
            else {
                this.currentlySending = false;
                return;
            }
        }
        this.currentlySending = true;
        var cmdsAndHandlers = this.commandBatcher.batch(this.commandQueue);

        if(cmdsAndHandlers.length > 0) {
            var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
            var commands = cmdsAndHandlers.map(cah => { return cah.command; });
            this.transmitter.transmit(commands, (response) => {
                var touchedPMs = [];
                response.forEach((command) => {
                    var touched = this.handle(command);
                    if (touched)
                        touchedPMs.push(touched);
                });
                if (callback) {
                    callback.onFinished(touchedPMs); // todo: make them unique?
                }
                setTimeout(() => this.doSendNext(), this.slackMS);
            });
        } else {
            setTimeout(() => this.doSendNext(), this.slackMS);
        }
    }

    handle(command) {
        if (command.id == "DeletePresentationModel") {
            return this.handleDeletePresentationModelCommand(command);
        }
        else if (command.id == "CreatePresentationModel") {
            return this.handleCreatePresentationModelCommand(command);
        }
        else if (command.id == "ValueChanged") {
            return this.handleValueChangedCommand(command);
        }
        else if (command.id == "AttributeMetadataChanged") {
            return this.handleAttributeMetadataChangedCommand(command);
        }
        else {
            console.log("Cannot handle, unknown command " + command);
        }
        return null;
    }

    handleDeletePresentationModelCommand(serverCommand) {
        var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
        if (!model)
            return null;
        this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
        return model;
    }

    handleCreatePresentationModelCommand(serverCommand) {
        if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
            throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
        }
        var attributes = [];
        serverCommand.attributes.forEach((attr) => {
            var clientAttribute = this.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value);
            if (attr.id && attr.id.match(".*S$")) {
                clientAttribute.id = attr.id;
            }
            attributes.push(clientAttribute);
        });
        var clientPm = new __WEBPACK_IMPORTED_MODULE_2__clientPresentationModel__["a" /* default */](serverCommand.pmId, serverCommand.pmType);
        clientPm.addAttributes(attributes);
        if (serverCommand.clientSideOnly) {
            clientPm.clientSideOnly = true;
        }
        this.clientDolphin.getClientModelStore().add(clientPm, false);
        this.clientDolphin.updatePresentationModelQualifier(clientPm);
        return clientPm;
    }

    handleValueChangedCommand(serverCommand) {
        var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
        if (!clientAttribute) {
            console.log("attribute with id " + serverCommand.attributeId + " not found, cannot update to new value " + serverCommand.newValue);
            return null;
        }
        if (clientAttribute.getValue() == serverCommand.newValue) {
            //console.log("nothing to do. new value == old value");
            return null;
        }
        clientAttribute.setValueFromServer(serverCommand.newValue);
        return null;
    }

    handleAttributeMetadataChangedCommand(serverCommand) {
        var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
        if (!clientAttribute)
            return null;
        clientAttribute[serverCommand.metadataName] = serverCommand.value;
        return null;
    }

    listen() {
        if (!this.pushEnabled)
            return;
        if (this.waiting)
            return;
        // todo: how to issue a warning if no pushListener is set?
        if (!this.currentlySending) {
            this.doSendNext();
        }
    }

    enqueuePushCommand() {
        var me = this;
        this.waiting = true;
        this.commandQueue.push({
            command: this.pushListener,
            handler: {
                onFinished: function () { me.waiting = false; },
                onFinishedData: null
            }
        });
    }

    release() {
        if (!this.waiting)
            return;
        this.waiting = false;
        // todo: how to issue a warning if no releaseCommand is set?
        this.transmitter.signal(this.releaseCommand);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClientConnector;


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_commandConstants__ = __webpack_require__(1);


class BlindCommandBatcher {
    constructor(folding = true, maxBatchSize = 50) {
        this.folding = folding;
        this.maxBatchSize = maxBatchSize;
    }
    batch(queue) {
        let batch = [];
        let batchLength = 0;
        while(queue[batchLength] && batchLength <= this.maxBatchSize) {
            const element = queue[batchLength];
            batchLength++;
            if(this.folding) {
                if(element.command.id == __WEBPACK_IMPORTED_MODULE_0__commands_commandConstants__["v" /* VALUE_CHANGED_COMMAND_ID */] &&
                    batch.length > 0 &&
                    batch[batch.length - 1].command.id == __WEBPACK_IMPORTED_MODULE_0__commands_commandConstants__["v" /* VALUE_CHANGED_COMMAND_ID */] &&
                    element.command.attributeId == batch[batch.length - 1].command.attributeId) {
                    //merge ValueChange for same value
                    batch[batch.length - 1].command.newValue = element.command.newValue;
                } else if(element.command.id == __WEBPACK_IMPORTED_MODULE_0__commands_commandConstants__["s" /* PRESENTATION_MODEL_DELETED_COMMAND_ID */]) {
                    //We do not need it...
                } else {
                    batch.push(element);
                }
            } else {
                batch.push(element);
            }
            if(element.handler) {
                break;
            }
        }
        queue.splice(0, batchLength);
        return batch;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BlindCommandBatcher;


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class CodecError extends Error {
    constructor(message) {
        super(message);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CodecError;


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__clientAttribute__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clientPresentationModel__ = __webpack_require__(52);



class ClientDolphin {

    constructor() {
    }

    setClientConnector(clientConnector) {
        this.clientConnector = clientConnector;
    }

    getClientConnector() {
        return this.clientConnector;
    }

    send(command, onFinished) {
        this.clientConnector.send(command, onFinished);
    }

    attribute(propertyName, qualifier, value) {
        return new __WEBPACK_IMPORTED_MODULE_0__clientAttribute__["a" /* default */](propertyName, qualifier, value);
    }

    presentationModel(id, type, ...attributes) {
        var model = new __WEBPACK_IMPORTED_MODULE_1__clientPresentationModel__["a" /* default */](id, type);
        if (attributes && attributes.length > 0) {
            attributes.forEach((attribute) => {
                model.addAttribute(attribute);
            });
        }
        this.getClientModelStore().add(model, true);
        return model;
    }

    setClientModelStore(clientModelStore) {
        this.clientModelStore = clientModelStore;
    }

    getClientModelStore() {
        return this.clientModelStore;
    }

    listPresentationModelIds() {
        return this.getClientModelStore().listPresentationModelIds();
    }

    listPresentationModels() {
        return this.getClientModelStore().listPresentationModels();
    }

    findAllPresentationModelByType(presentationModelType) {
        return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
    }

    getAt(id) {
        return this.findPresentationModelById(id);
    }

    findPresentationModelById(id) {
        return this.getClientModelStore().findPresentationModelById(id);
    }

    deletePresentationModel(modelToDelete) {
        this.getClientModelStore().deletePresentationModel(modelToDelete, true);
    }

    updatePresentationModelQualifier(presentationModel) {
        presentationModel.getAttributes().forEach(sourceAttribute => {
            this.updateAttributeQualifier(sourceAttribute);
        });
    }

    updateAttributeQualifier(sourceAttribute) {
        if (!sourceAttribute.getQualifier())
            return;
        var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
        attributes.forEach(targetAttribute => {
            targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
        });
    }

    startPushListening(pushCommand, releaseCommand) {
        this.clientConnector.setPushListener(pushCommand);
        this.clientConnector.setReleaseCommand(releaseCommand);
        this.clientConnector.setPushEnabled(true);

        setTimeout(() => {
            this.clientConnector.listen();
        }, 0);
    }

    stopPushListening() {
        this.clientConnector.setPushEnabled(false);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClientDolphin;


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__eventBus__ = __webpack_require__(23);


class ClientAttribute {
    constructor(propertyName, qualifier, value) {
        this.propertyName = propertyName;
        this.id = "" + (ClientAttribute.clientAttributeInstanceCount++) + "C";
        this.valueChangeBus = new __WEBPACK_IMPORTED_MODULE_0__eventBus__["a" /* default */]();
        this.qualifierChangeBus = new __WEBPACK_IMPORTED_MODULE_0__eventBus__["a" /* default */]();
        this.setValue(value);
        this.setQualifier(qualifier);
    }

    copy() {
        var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
        return result;
    }

    setPresentationModel(presentationModel) {
        if (this.presentationModel) {
            throw new Error("You can not set a presentation model for an attribute that is already bound.");
        }
        this.presentationModel = presentationModel;
    }

    getPresentationModel() {
        return this.presentationModel;
    }

    getValue() {
        return this.value;
    }

    setValueFromServer(newValue) {
        var verifiedValue = ClientAttribute.checkValue(newValue);
        if (this.value == verifiedValue)
            return;
        var oldValue = this.value;
        this.value = verifiedValue;
        this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': false });
    }

    setValue(newValue) {
        var verifiedValue = ClientAttribute.checkValue(newValue);
        if (this.value == verifiedValue)
            return;
        var oldValue = this.value;
        this.value = verifiedValue;
        this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': true });
    }

    setQualifier(newQualifier) {
        if (this.qualifier == newQualifier)
            return;
        var oldQualifier = this.qualifier;
        this.qualifier = newQualifier;
        this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
        this.valueChangeBus.trigger({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
    }

    getQualifier() {
        return this.qualifier;
    }

    onValueChange(eventHandler) {
        this.valueChangeBus.onEvent(eventHandler);
        eventHandler({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
    }

    onQualifierChange(eventHandler) {
        this.qualifierChangeBus.onEvent(eventHandler);
    }

    syncWith(sourceAttribute) {
        if (sourceAttribute) {
            this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
            this.setValue(sourceAttribute.value);
        }
    }

    static checkValue(value) {
        if (value == null || value == undefined) {
            return null;
        }
        var result = value;
        if (result instanceof String || result instanceof Boolean || result instanceof Number) {
            result = value.valueOf();
        }
        if (result instanceof ClientAttribute) {
            console.log("An Attribute may not itself contain an attribute as a value. Assuming you forgot to call value.");
            result = this.checkValue(value.value);
        }
        var ok = false;
        if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result) > -1 || result instanceof Date) {
            ok = true;
        }
        if (!ok) {
            throw new Error("Attribute values of this type are not allowed: " + typeof value);
        }
        return result;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClientAttribute;


ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__attribute__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__eventBus__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(15);





class ClientModelStore {

    constructor(clientDolphin) {
        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new __WEBPACK_IMPORTED_MODULE_1__eventBus__["a" /* default */]();
    }

    getClientDolphin() {
        return this.clientDolphin;
    }

    registerAttribute(attribute) {
        this.addAttributeById(attribute);
        if (attribute.getQualifier()) {
            this.addAttributeByQualifier(attribute);
        }
        // whenever an attribute changes its value, the server needs to be notified
        // and all other attributes with the same qualifier are given the same value
        attribute.onValueChange((evt) => {
            if(evt.newValue != evt.oldValue && evt.sendToServer == true) {
                const command = __WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createValueChangedCommand(attribute.id, evt.newValue);
                this.clientDolphin.getClientConnector().send(command, null);
            }

            if (attribute.getQualifier()) {
                var attrs = this.findAttributesByFilter((attr) => {
                    return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                });
                attrs.forEach((attr) => {
                    attr.setValue(attribute.getValue());
                });
            }

        });
        attribute.onQualifierChange((evt) => {
            this.clientDolphin.getClientConnector().send(__WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createChangeAttributeMetadataCommand(attribute.id, __WEBPACK_IMPORTED_MODULE_0__attribute__["a" /* default */].QUALIFIER_PROPERTY, evt.newValue), null);
        });
    }

    add(model, sendToServer = true) {
        if (!model) {
            return false;
        }
        if (this.presentationModels.has(model.id)) {
            console.log("There already is a PM with id " + model.id);
        }
        var added = false;
        if (!this.presentationModels.has(model.id)) {
            this.presentationModels.set(model.id, model);
            this.addPresentationModelByType(model);

            if(sendToServer) {
                var connector = this.clientDolphin.getClientConnector();
                connector.send(__WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createCreatePresentationModelCommand(model), null);
            }

            model.getAttributes().forEach(attribute => {
                this.registerAttribute(attribute);
            });
            this.modelStoreChangeBus.trigger({ 'eventType': __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* ADDED_TYPE */], 'clientPresentationModel': model });
            added = true;
        }
        return added;
    }

    remove(model) {
        if (!model) {
            return false;
        }
        var removed = false;
        if (this.presentationModels.has(model.id)) {
            this.removePresentationModelByType(model);
            this.presentationModels.delete(model.id);
            model.getAttributes().forEach((attribute) => {
                this.removeAttributeById(attribute);
                if (attribute.getQualifier()) {
                    this.removeAttributeByQualifier(attribute);
                }
            });
            this.modelStoreChangeBus.trigger({ 'eventType': __WEBPACK_IMPORTED_MODULE_3__constants__["o" /* REMOVED_TYPE */], 'clientPresentationModel': model });
            removed = true;
        }
        return removed;
    }

    findAttributesByFilter(filter) {
        var matches = [];
        this.presentationModels.forEach((model) => {
            model.getAttributes().forEach((attr) => {
                if (filter(attr)) {
                    matches.push(attr);
                }
            });
        });
        return matches;
    }

    addPresentationModelByType(model) {
        if (!model) {
            return;
        }
        var type = model.presentationModelType;
        if (!type) {
            return;
        }
        var presentationModels = this.presentationModelsPerType.get(type);
        if (!presentationModels) {
            presentationModels = [];
            this.presentationModelsPerType.set(type, presentationModels);
        }
        if (!(presentationModels.indexOf(model) > -1)) {
            presentationModels.push(model);
        }
    }

    removePresentationModelByType(model) {
        if (!model || !(model.presentationModelType)) {
            return;
        }
        var presentationModels = this.presentationModelsPerType.get(model.presentationModelType);
        if (!presentationModels) {
            return;
        }
        if (presentationModels.length > -1) {
            presentationModels.splice(presentationModels.indexOf(model), 1);
        }
        if (presentationModels.length === 0) {
            this.presentationModelsPerType.delete(model.presentationModelType);
        }
    }

    listPresentationModelIds() {
        var result = [];
        var iter = this.presentationModels.keys();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    }

    listPresentationModels() {
        var result = [];
        var iter = this.presentationModels.values();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    }

    findPresentationModelById(id) {
        return this.presentationModels.get(id);
    }

    findAllPresentationModelByType(type) {
        if (!type || !this.presentationModelsPerType.has(type)) {
            return [];
        }
        return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
    }

    deletePresentationModel(model, notify) {
        if (!model) {
            return;
        }
        if (this.containsPresentationModel(model.id)) {
            this.remove(model);
            if (!notify || model.clientSideOnly) {
                return;
            }
            this.clientDolphin.getClientConnector().send(__WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createPresentationModelDeletedCommand(model.id), null);
        }
    }

    containsPresentationModel(id) {
        return this.presentationModels.has(id);
    }

    addAttributeById(attribute) {
        if (!attribute || this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.set(attribute.id, attribute);
    }

    removeAttributeById(attribute) {
        if (!attribute || !this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.delete(attribute.id);
    }

    findAttributeById(id) {
        return this.attributesPerId.get(id);
    }

    addAttributeByQualifier(attribute) {
        if (!attribute || !attribute.getQualifier()) {
            return;
        }
        var attributes = this.attributesPerQualifier.get(attribute.getQualifier());
        if (!attributes) {
            attributes = [];
            this.attributesPerQualifier.set(attribute.getQualifier(), attributes);
        }
        if (!(attributes.indexOf(attribute) > -1)) {
            attributes.push(attribute);
        }
    }

    removeAttributeByQualifier(attribute) {
        if (!attribute || !attribute.getQualifier()) {
            return;
        }
        var attributes = this.attributesPerQualifier.get(attribute.getQualifier());
        if (!attributes) {
            return;
        }
        if (attributes.length > -1) {
            attributes.splice(attributes.indexOf(attribute), 1);
        }
        if (attributes.length === 0) {
            this.attributesPerQualifier.delete(attribute.getQualifier());
        }
    }

    findAllAttributesByQualifier(qualifier) {
        if (!qualifier || !this.attributesPerQualifier.has(qualifier)) {
            return [];
        }
        return this.attributesPerQualifier.get(qualifier).slice(0); // slice is used to clone the array
    }

    onModelStoreChange(eventHandler) {
        this.modelStoreChangeBus.onEvent(eventHandler);
    }

    onModelStoreChangeForType(presentationModelType, eventHandler) {
        this.modelStoreChangeBus.onEvent(pmStoreEvent => {
            if (pmStoreEvent.clientPresentationModel.presentationModelType == presentationModelType) {
                eventHandler(pmStoreEvent);
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClientModelStore;




/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Attribute {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Attribute;


Attribute.QUALIFIER_PROPERTY = "qualifier";
Attribute.VALUE = "value";


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_codec__ = __webpack_require__(22);


class HttpTransmitter {

    constructor(url, reset = true, charset = "UTF-8", errorHandler = null, supportCORS = false, headersInfo = null) {
        this.url = url;
        this.charset = charset;
        this.HttpCodes = {
            finished: 4,
            success: 200
        };
        this.errorHandler = errorHandler;
        this.supportCORS = supportCORS;
        this.headersInfo = headersInfo;
        this.http = new XMLHttpRequest();
        this.sig = new XMLHttpRequest();
        if (this.supportCORS) {
            if ("withCredentials" in this.http) {
                this.http.withCredentials = true; // NOTE: doing this for non CORS requests has no impact
                this.sig.withCredentials = true;
            }
        }
        this.codec = new __WEBPACK_IMPORTED_MODULE_0__commands_codec__["a" /* default */]();
        if (reset) {
            console.log('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
            this.invalidate();
        }
    }

    transmit(commands, onDone) {
        this.http.onerror = () => {
            this.handleError('onerror', "");
            onDone([]);
        };
        this.http.onreadystatechange = () => {
            if (this.http.readyState == this.HttpCodes.finished) {
                if (this.http.status == this.HttpCodes.success) {
                    var responseText = this.http.responseText;
                    if (responseText.trim().length > 0) {
                        try {
                            var responseCommands = this.codec.decode(responseText);
                            onDone(responseCommands);
                        }
                        catch (err) {
                            console.log("Error occurred parsing responseText: ", err);
                            console.log("Incorrect responseText: ", responseText);
                            this.handleError('application', "HttpTransmitter: Incorrect responseText: " + responseText);
                            onDone([]);
                        }
                    }
                    else {
                        this.handleError('application', "HttpTransmitter: empty responseText");
                        onDone([]);
                    }
                }
                else {
                    this.handleError('application', "HttpTransmitter: HTTP Status != 200");
                    onDone([]);
                }
            }
        };
        this.http.open('POST', this.url, true);
        this.setHeaders(this.http);
        if ("overrideMimeType" in this.http) {
            this.http.overrideMimeType("application/json; charset=" + this.charset); // todo make injectable
        }
        this.http.send(this.codec.encode(commands));
    }

    setHeaders(httpReq) {
        if (this.headersInfo) {
            for (var i in this.headersInfo) {
                if (this.headersInfo.hasOwnProperty(i)) {
                    httpReq.setRequestHeader(i, this.headersInfo[i]);
                }
            }
        }
    }

    handleError(kind, message) {
        var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
        if (this.errorHandler) {
            this.errorHandler(errorEvent);
        }
        else {
            console.log("Error occurred: ", errorEvent);
        }
    }

    signal(command) {
        this.sig.open('POST', this.url, true);
        this.setHeaders(this.sig);
        this.sig.send(this.codec.encode([command]));
    }

    invalidate() {
        this.http.open('POST', this.url + 'invalidate?', false);
        this.http.send();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HttpTransmitter;


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class NoTransmitter {

    transmit(commands, onDone) {
        // do nothing special
        onDone([]);
    }

    signal() {
        // do nothing
    }

    reset() {
        // do nothing
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NoTransmitter;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(27)
  , defined   = __webpack_require__(18);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(19)(function(){
  return Object.defineProperty(__webpack_require__(30)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(7);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(55)
  , descriptor     = __webpack_require__(54)
  , setToStringTag = __webpack_require__(20)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(5)(IteratorPrototype, __webpack_require__(2)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(6)
  , anObject = __webpack_require__(10)
  , getKeys  = __webpack_require__(89);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(90)
  , enumBugKeys = __webpack_require__(58);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(12)
  , toIObject    = __webpack_require__(31)
  , arrayIndexOf = __webpack_require__(91)(false)
  , IE_PROTO     = __webpack_require__(33)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(31)
  , toLength  = __webpack_require__(32)
  , toIndex   = __webpack_require__(92);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(27)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(12)
  , toObject    = __webpack_require__(60)
  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(95)
  , step             = __webpack_require__(61)
  , Iterators        = __webpack_require__(13)
  , toIObject        = __webpack_require__(31);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(28)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(53)
  , global             = __webpack_require__(3)
  , ctx                = __webpack_require__(9)
  , classof            = __webpack_require__(36)
  , $export            = __webpack_require__(11)
  , isObject           = __webpack_require__(7)
  , aFunction          = __webpack_require__(29)
  , anInstance         = __webpack_require__(37)
  , forOf              = __webpack_require__(21)
  , speciesConstructor = __webpack_require__(100)
  , task               = __webpack_require__(62).set
  , microtask          = __webpack_require__(102)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(2)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(38)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(20)($Promise, PROMISE);
__webpack_require__(63)(PROMISE);
Wrapper = __webpack_require__(4)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(103)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(10);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(13)
  , ITERATOR   = __webpack_require__(2)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(36)
  , ITERATOR  = __webpack_require__(2)('iterator')
  , Iterators = __webpack_require__(13);
module.exports = __webpack_require__(4).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(10)
  , aFunction = __webpack_require__(29)
  , SPECIES   = __webpack_require__(2)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 101 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(3)
  , macrotask = __webpack_require__(62).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(14)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(2)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class BeanManager {
    constructor(classRepository) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager(classRepository)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(classRepository, 'classRepository');

        this.classRepository = classRepository;
        this.addedHandlers = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.removedHandlers = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.updatedHandlers = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.arrayUpdatedHandlers = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.allAddedHandlers = [];
        this.allRemovedHandlers = [];
        this.allUpdatedHandlers = [];
        this.allArrayUpdatedHandlers = [];

        let self = this;
        this.classRepository.onBeanAdded((type, bean) => {
            let handlerList = self.addedHandlers.get(type);
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                    }
                });
            }
            self.allAddedHandlers.forEach((handler) => {
                try {
                    handler(bean);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanAdded-handler', e);
                }
            });
        });
        this.classRepository.onBeanRemoved((type, bean) => {
            let handlerList = self.removedHandlers.get(type);
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                    }
                });
            }
            self.allRemovedHandlers.forEach((handler) => {
                try {
                    handler(bean);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanRemoved-handler', e);
                }
            });
        });
        this.classRepository.onBeanUpdate((type, bean, propertyName, newValue, oldValue) => {
            let handlerList = self.updatedHandlers.get(type);
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean, propertyName, newValue, oldValue);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                    }
                });
            }
            self.allUpdatedHandlers.forEach((handler) => {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanUpdate-handler', e);
                }
            });
        });
        this.classRepository.onArrayUpdate((type, bean, propertyName, index, count, newElements) => {
            let handlerList = self.arrayUpdatedHandlers.get(type);
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean, propertyName, index, count, newElements);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                    }
                });
            }
            self.allArrayUpdatedHandlers.forEach((handler) => {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onArrayUpdate-handler', e);
                }
            });
        });


    }


    notifyBeanChange(bean, propertyName, newValue) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(bean, 'bean');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(propertyName, 'propertyName');

        return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
    }


    notifyArrayChange(bean, propertyName, index, count, removedElements) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(bean, 'bean');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(propertyName, 'propertyName');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(index, 'index');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(count, 'count');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(removedElements, 'removedElements');

        this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
    }


    isManaged(bean) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.isManaged(bean)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(bean, 'bean');

        // TODO: Implement dolphin.isManaged() [DP-7]
        throw new Error("Not implemented yet");
    }


    create(type) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.create(type)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(type, 'type');

        // TODO: Implement dolphin.create() [DP-7]
        throw new Error("Not implemented yet");
    }


    add(type, bean) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.add(type, bean)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(type, 'type');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(bean, 'bean');

        // TODO: Implement dolphin.add() [DP-7]
        throw new Error("Not implemented yet");
    }


    addAll(type, collection) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.addAll(type, collection)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(type, 'type');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(collection, 'collection');

        // TODO: Implement dolphin.addAll() [DP-7]
        throw new Error("Not implemented yet");
    }


    remove(bean) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.remove(bean)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(bean, 'bean');

        // TODO: Implement dolphin.remove() [DP-7]
        throw new Error("Not implemented yet");
    }


    removeAll(collection) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.removeAll(collection)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(collection, 'collection');

        // TODO: Implement dolphin.removeAll() [DP-7]
        throw new Error("Not implemented yet");
    }


    removeIf(predicate) {
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.removeIf(predicate)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(predicate, 'predicate');

        // TODO: Implement dolphin.removeIf() [DP-7]
        throw new Error("Not implemented yet");
    }


    onAdded(type, eventHandler) {
        let self = this;
        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(eventHandler)) {
            eventHandler = type;
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onAdded(eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
            return {
                unsubscribe: function () {
                    self.allAddedHandlers = self.allAddedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onAdded(type, eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(type, 'type');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            var handlerList = self.addedHandlers.get(type);
            if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList = [];
            }
            self.addedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    var handlerList = self.addedHandlers.get(type);
                    if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                        self.addedHandlers.set(type, handlerList.filter(function (value) {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }


    onRemoved(type, eventHandler) {
        let self = this;
        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(eventHandler)) {
            eventHandler = type;
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onRemoved(eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
            return {
                unsubscribe: () => {
                    self.allRemovedHandlers = self.allRemovedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onRemoved(type, eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(type, 'type');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            var handlerList = self.removedHandlers.get(type);
            if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList = [];
            }
            self.removedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    var handlerList = self.removedHandlers.get(type);
                    if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                        self.removedHandlers.set(type, handlerList.filter((value) => {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }


    onBeanUpdate(type, eventHandler) {
        let self = this;
        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(eventHandler)) {
            eventHandler = type;
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onBeanUpdate(eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
            return {
                unsubscribe: function () {
                    self.allUpdatedHandlers = self.allUpdatedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onBeanUpdate(type, eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(type, 'type');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            var handlerList = self.updatedHandlers.get(type);
            if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList = [];
            }
            self.updatedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    var handlerList = self.updatedHandlers.get(type);
                    if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                        self.updatedHandlers.set(type, handlerList.filter((value) => {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }

    onArrayUpdate(type, eventHandler) {
        let self = this;
        if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(eventHandler)) {
            eventHandler = type;
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onArrayUpdate(eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
            return {
                unsubscribe: () => {
                    self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('BeanManager.onArrayUpdate(type, eventHandler)');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(type, 'type');
            Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(eventHandler, 'eventHandler');

            var handlerList = self.arrayUpdatedHandlers.get(type);
            if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                handlerList = [];
            }
            self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    var handlerList = self.arrayUpdatedHandlers.get(type);
                    if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(handlerList)) {
                        self.arrayUpdatedHandlers.set(type, handlerList.filter((value) => {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BeanManager;



/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(65);

// 23.1 Map Objects
module.exports = __webpack_require__(67)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(9)
  , IObject  = __webpack_require__(56)
  , toObject = __webpack_require__(60)
  , toLength = __webpack_require__(32)
  , asc      = __webpack_require__(107);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(108);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7)
  , isArray  = __webpack_require__(109)
  , SPECIES  = __webpack_require__(2)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(14);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(11);

$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(68)('Map')});

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(21);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(0);




var blocked = null;

class ClassRepository {

    constructor(dolphin) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository(dolphin)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(dolphin, 'dolphin');

        this.dolphin = dolphin;
        this.classes = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.beanFromDolphin = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.beanToDolphin = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.classInfos = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_map___default.a();
        this.beanAddedHandlers = [];
        this.beanRemovedHandlers = [];
        this.propertyUpdateHandlers = [];
        this.arrayUpdateHandlers = [];
    }

    fixType(type, value) {
        switch (type) {
            case __WEBPACK_IMPORTED_MODULE_1__constants__["c" /* BYTE */]:
            case __WEBPACK_IMPORTED_MODULE_1__constants__["p" /* SHORT */]:
            case __WEBPACK_IMPORTED_MODULE_1__constants__["j" /* INT */]:
            case __WEBPACK_IMPORTED_MODULE_1__constants__["n" /* LONG */]:
                return parseInt(value);
            case __WEBPACK_IMPORTED_MODULE_1__constants__["i" /* FLOAT */]:
            case __WEBPACK_IMPORTED_MODULE_1__constants__["g" /* DOUBLE */]:
                return parseFloat(value);
            case __WEBPACK_IMPORTED_MODULE_1__constants__["b" /* BOOLEAN */]:
                return 'true' === String(value).toLowerCase();
            case __WEBPACK_IMPORTED_MODULE_1__constants__["q" /* STRING */]:
            case __WEBPACK_IMPORTED_MODULE_1__constants__["h" /* ENUM */]:
                return String(value);
            default:
                return value;
        }
    }

    fromDolphin(classRepository, type, value) {
        if (!Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(value)) {
            return null;
        }
        switch (type) {
            case __WEBPACK_IMPORTED_MODULE_1__constants__["f" /* DOLPHIN_BEAN */]:
                return classRepository.beanFromDolphin.get(String(value));
            case __WEBPACK_IMPORTED_MODULE_1__constants__["e" /* DATE */]:
                return new Date(String(value));
            case __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* CALENDAR */]:
                return new Date(String(value));
            case __WEBPACK_IMPORTED_MODULE_1__constants__["l" /* LOCAL_DATE_FIELD_TYPE */]:
                return new Date(String(value));
            case __WEBPACK_IMPORTED_MODULE_1__constants__["m" /* LOCAL_DATE_TIME_FIELD_TYPE */]:
                return new Date(String(value));
            case __WEBPACK_IMPORTED_MODULE_1__constants__["r" /* ZONED_DATE_TIME_FIELD_TYPE */]:
                return new Date(String(value));
            default:
                return this.fixType(type, value);
        }
    }

    toDolphin(classRepository, type, value) {
        if (!Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(value)) {
            return null;
        }
        switch (type) {
            case __WEBPACK_IMPORTED_MODULE_1__constants__["f" /* DOLPHIN_BEAN */]:
                return classRepository.beanToDolphin.get(value);
            case __WEBPACK_IMPORTED_MODULE_1__constants__["e" /* DATE */]:
                return value instanceof Date ? value.toISOString() : value;
            case __WEBPACK_IMPORTED_MODULE_1__constants__["d" /* CALENDAR */]:
                return value instanceof Date ? value.toISOString() : value;
            case __WEBPACK_IMPORTED_MODULE_1__constants__["l" /* LOCAL_DATE_FIELD_TYPE */]:
                return value instanceof Date ? value.toISOString() : value;
            case __WEBPACK_IMPORTED_MODULE_1__constants__["m" /* LOCAL_DATE_TIME_FIELD_TYPE */]:
                return value instanceof Date ? value.toISOString() : value;
            case __WEBPACK_IMPORTED_MODULE_1__constants__["r" /* ZONED_DATE_TIME_FIELD_TYPE */]:
                return value instanceof Date ? value.toISOString() : value;
            default:
                return this.fixType(type, value);
        }
    }

    sendListSplice(classRepository, modelId, propertyName, from, to, newElements) {
        let dolphin = classRepository.dolphin;
        let model = dolphin.findPresentationModelById(modelId);
        let self = this;
        if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(model)) {
            let classInfo = classRepository.classes.get(model.presentationModelType);
            let type = classInfo[propertyName];
            if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(type)) {

                let attributes = [
                    dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'),
                    dolphin.attribute('source', null, modelId),
                    dolphin.attribute('attribute', null, propertyName),
                    dolphin.attribute('from', null, from),
                    dolphin.attribute('to', null, to),
                    dolphin.attribute('count', null, newElements.length)
                ];
                newElements.forEach(function (element, index) {
                    attributes.push(dolphin.attribute(index.toString(), null, self.toDolphin(classRepository, type, element)));
                });
                dolphin.presentationModel.apply(dolphin, [null, '@DP:LS@'].concat(attributes));
            }
        }
    }

    validateList(classRepository, type, bean, propertyName) {
        let list = bean[propertyName];
        if (!Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(list)) {
            classRepository.propertyUpdateHandlers.forEach(function (handler) {
                try {
                    handler(type, bean, propertyName, [], undefined);
                } catch (e) {
                    console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
                }
            });
        }
    }

    block(bean, propertyName) {
        if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(blocked)) {
            throw new Error('Trying to create a block while another block exists');
        }
        blocked = {
            bean: bean,
            propertyName: propertyName
        };
    }

    isBlocked(bean, propertyName) {
        return Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(blocked) && blocked.bean === bean && blocked.propertyName === propertyName;
    }

    unblock() {
        blocked = null;
    }

    notifyBeanChange(bean, propertyName, newValue) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(bean, 'bean');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(propertyName, 'propertyName');

        let modelId = this.beanToDolphin.get(bean);
        if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(modelId)) {
            let model = this.dolphin.findPresentationModelById(modelId);
            if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(model)) {
                let classInfo = this.classes.get(model.presentationModelType);
                let type = classInfo[propertyName];
                let attribute = model.findAttributeByPropertyName(propertyName);
                if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(type) && Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(attribute)) {
                    let oldValue = attribute.getValue();
                    attribute.setValue(this.toDolphin(this, type, newValue));
                    return this.fromDolphin(this, type, oldValue);
                }
            }
        }
    }

    notifyArrayChange(bean, propertyName, index, count, removedElements) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(bean, 'bean');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(propertyName, 'propertyName');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(index, 'index');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(count, 'count');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(removedElements, 'removedElements');

        if (this.isBlocked(bean, propertyName)) {
            return;
        }
        let modelId = this.beanToDolphin.get(bean);
        let array = bean[propertyName];
        if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(modelId) && Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(array)) {
            let removedElementsCount = Array.isArray(removedElements) ? removedElements.length : 0;
            this.sendListSplice(this, modelId, propertyName, index, index + removedElementsCount, array.slice(index, index + count));
        }
    }

    onBeanAdded(handler) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.onBeanAdded(handler)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(handler, 'handler');
        this.beanAddedHandlers.push(handler);
    }

    onBeanRemoved(handler) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.onBeanRemoved(handler)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(handler, 'handler');
        this.beanRemovedHandlers.push(handler);
    }

    onBeanUpdate(handler) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.onBeanUpdate(handler)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(handler, 'handler');
        this.propertyUpdateHandlers.push(handler);
    }

    onArrayUpdate(handler) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.onArrayUpdate(handler)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(handler, 'handler');
        this.arrayUpdateHandlers.push(handler);
    }

    registerClass(model) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.registerClass(model)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(model, 'model');

        if (this.classes.has(model.id)) {
            return;
        }

        let classInfo = {};
        model.attributes.filter(function (attribute) {
            return attribute.propertyName.search(/^@/) < 0;
        }).forEach(function (attribute) {
            classInfo[attribute.propertyName] = attribute.value;
        });
        this.classes.set(model.id, classInfo);
    }

    unregisterClass(model) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.unregisterClass(model)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(model, 'model');
        this.classes['delete'](model.id);
    }

    load(model) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.load(model)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(model, 'model');

        var self = this;
        var classInfo = this.classes.get(model.presentationModelType);
        var bean = {};
        model.attributes.filter(function (attribute) {
            return (attribute.propertyName.search(/^@/) < 0);
        }).forEach(function (attribute) {
            bean[attribute.propertyName] = null;
            attribute.onValueChange(function (event) {
                if (event.oldValue !== event.newValue) {
                    let oldValue = self.fromDolphin(self, classInfo[attribute.propertyName], event.oldValue);
                    let newValue = self.fromDolphin(self, classInfo[attribute.propertyName], event.newValue);
                    self.propertyUpdateHandlers.forEach((handler) => {
                        try {
                            handler(model.presentationModelType, bean, attribute.propertyName, newValue, oldValue);
                        } catch (e) {
                            console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
                        }
                    });
                }
            });
        });
        this.beanFromDolphin.set(model.id, bean);
        this.beanToDolphin.set(bean, model.id);
        this.classInfos.set(model.id, classInfo);
        this.beanAddedHandlers.forEach((handler) => {
            try {
                handler(model.presentationModelType, bean);
            } catch (e) {
                console.warn('An exception occurred while calling an onBeanAdded-handler', e);
            }
        });
        return bean;
    }

    unload(model) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.unload(model)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(model, 'model');

        let bean = this.beanFromDolphin.get(model.id);
        this.beanFromDolphin['delete'](model.id);
        this.beanToDolphin['delete'](bean);
        this.classInfos['delete'](model.id);
        if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(bean)) {
            this.beanRemovedHandlers.forEach((handler) => {
                try {
                    handler(model.presentationModelType, bean);
                } catch (e) {
                    console.warn('An exception occurred while calling an onBeanRemoved-handler', e);
                }
            });
        }
        return bean;
    }

    spliceListEntry(model) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ClassRepository.spliceListEntry(model)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(model, 'model');

        let source = model.findAttributeByPropertyName('source');
        let attribute = model.findAttributeByPropertyName('attribute');
        let from = model.findAttributeByPropertyName('from');
        let to = model.findAttributeByPropertyName('to');
        let count = model.findAttributeByPropertyName('count');

        if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(source) && Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(attribute) && Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(from) && Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(to) && Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(count)) {
            var classInfo = this.classInfos.get(source.value);
            var bean = this.beanFromDolphin.get(source.value);
            if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(bean) && Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(classInfo)) {
                let type = model.presentationModelType;
                //var entry = fromDolphin(this, classInfo[attribute.value], element.value);
                this.validateList(this, type, bean, attribute.value);
                var newElements = [],
                    element = null;
                for (var i = 0; i < count.value; i++) {
                    element = model.findAttributeByPropertyName(i.toString());
                    if (!Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(element)) {
                        throw new Error("Invalid list modification update received");
                    }
                    newElements.push(this.fromDolphin(this, classInfo[attribute.value], element.value));
                }
                try {
                    this.block(bean, attribute.value);
                    this.arrayUpdateHandlers.forEach((handler) => {
                        try {
                            handler(type, bean, attribute.value, from.value, to.value - from.value, newElements);
                        } catch (e) {
                            console.warn('An exception occurred while calling an onArrayUpdate-handler', e);
                        }
                    });
                } finally {
                    this.unblock();
                }
            } else {
                throw new Error("Invalid list modification update received. Source bean unknown.");
            }
        } else {
            throw new Error("Invalid list modification update received");
        }
    }

    mapParamToDolphin(param) {
        if (!Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(param)) {
            return param;
        }
        let type = typeof param;
        if (type === 'object') {
            if (param instanceof Date) {
                return param.toISOString();
            } else {
                let value = this.beanToDolphin.get(param);
                if (Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(value)) {
                    return value;
                }
                throw new TypeError("Only managed Dolphin Beans can be used");
            }
        }
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return param;
        }
        throw new TypeError("Only managed Dolphin Beans and primitive types can be used");
    }

    mapDolphinToBean(value) {
        return this.fromDolphin(this, __WEBPACK_IMPORTED_MODULE_1__constants__["f" /* DOLPHIN_BEAN */], value);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClassRepository;



/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_set__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllerproxy_js__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__commands_commandFactory_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__connector_js__ = __webpack_require__(17);













const CONTROLLER_ID = 'controllerId';
const MODEL = 'model';
const ERROR_CODE = 'errorCode';

class ControllerManager{

    constructor(dolphin, classRepository, connector){
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ControllerManager(dolphin, classRepository, connector)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(dolphin, 'dolphin');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(classRepository, 'classRepository');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(connector, 'connector');

        this.dolphin = dolphin;
        this.classRepository = classRepository;
        this.connector = connector;
        this.controllers = new __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_set___default.a();
    }

    createController(name) {
        return this._createController(name, null)
    }

    _createController(name, parentControllerId) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ControllerManager.createController(name)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(name, 'name');

        let self = this;
        let controllerId, modelId, model, controller;
        return new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default.a((resolve) => {
            self.connector.getHighlanderPM().then((highlanderPM) => {
                self.connector.invoke(__WEBPACK_IMPORTED_MODULE_4__commands_commandFactory_js__["a" /* default */].createCreateControllerCommand(name, parentControllerId)).then(() => {
                    controllerId = highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).getValue();
                    modelId = highlanderPM.findAttributeByPropertyName(MODEL).getValue();
                    model = self.classRepository.mapDolphinToBean(modelId);
                    controller = new __WEBPACK_IMPORTED_MODULE_3__controllerproxy_js__["a" /* default */](controllerId, model, self);
                    self.controllers.add(controller);
                    resolve(controller);
                });
            });
        });
    }

    invokeAction(controllerId, actionName, params) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ControllerManager.invokeAction(controllerId, actionName, params)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(controllerId, 'controllerId');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(actionName, 'actionName');

        let self = this;
        return new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default.a((resolve, reject) =>{

            let attributes = [
                self.dolphin.attribute(__WEBPACK_IMPORTED_MODULE_5__connector_js__["b" /* SOURCE_SYSTEM */], null, __WEBPACK_IMPORTED_MODULE_5__connector_js__["c" /* SOURCE_SYSTEM_CLIENT */]),
                self.dolphin.attribute(ERROR_CODE)
            ];

            let pm = self.dolphin.presentationModel.apply(self.dolphin, [null, __WEBPACK_IMPORTED_MODULE_5__connector_js__["a" /* ACTION_CALL_BEAN */]].concat(attributes));

            let actionParams = [];
            if(Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* exists */])(params)) {
                for (var param in params) {
                    if (params.hasOwnProperty(param)) {
                        let value = self.classRepository.mapParamToDolphin(params[param]);
                        actionParams.push({name: param, value: value});
                    }
                }
            }

            self.connector.invoke(__WEBPACK_IMPORTED_MODULE_4__commands_commandFactory_js__["a" /* default */].createCallActionCommand(controllerId, actionName, actionParams)).then(() => {
                let isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
                if (isError) {
                    reject(new Error("Server side ControllerAction " + actionName + " caused an error. Please see server log for details."));
                } else {
                    resolve();
                }
                self.dolphin.deletePresentationModel(pm);
            });
        });
    }

    destroyController(controller) {
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* checkMethod */])('ControllerManager.destroyController(controller)');
        Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* checkParam */])(controller, 'controller');

        let self = this;
        return new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default.a((resolve) => {
            self.connector.getHighlanderPM().then((highlanderPM) => {
                self.controllers.delete(controller);
                highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).setValue(controller.controllerId);
                self.connector.invoke(__WEBPACK_IMPORTED_MODULE_4__commands_commandFactory_js__["a" /* default */].createDestroyControllerCommand(controller.getId())).then(resolve);
            });
        });
    }

    destroy() {
        let controllersCopy = this.controllers;
        let promises = [];
        this.controllers = new __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_set___default.a();
        controllersCopy.forEach((controller) => {
            try {
                promises.push(controller.destroy());
            } catch (e) {
                // ignore
            }
        });
        return __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_promise___default.a.all(promises);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControllerManager;



/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(65);

// 23.2 Set Objects
module.exports = __webpack_require__(67)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(11);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(68)('Set')});

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_set__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



class ControllerProxy{

    constructor(controllerId, model, manager){
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('ControllerProxy(controllerId, model, manager)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(controllerId, 'controllerId');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(model, 'model');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(manager, 'manager');

        this.controllerId = controllerId;
        this.model = model;
        this.manager = manager;
        this.destroyed = false;
        this.onDestroyedHandlers = new __WEBPACK_IMPORTED_MODULE_0__bower_components_core_js_library_fn_set___default.a();
    }

    getModel() {
        return this.model;
    }

    getId() {
        return this.controllerId;
    }

    invoke(name, params){
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('ControllerProxy.invoke(name, params)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(name, 'name');

        if (this.destroyed) {
            throw new Error('The controller was already destroyed');
        }
        return this.manager.invokeAction(this.controllerId, name, params);
    }

    createController(name) {
        return this.manager._createController(name, this.getId());
    }

    destroy(){
        if (this.destroyed) {
            throw new Error('The controller was already destroyed');
        }
        this.destroyed = true;
        this.onDestroyedHandlers.forEach((handler) => {
            try {
                handler(this);
            } catch(e) {
                console.warn('An exception occurred while calling an onDestroyed-handler', e);
            }
        }, this);
        return this.manager.destroyController(this);
    }

    onDestroyed(handler){
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* checkMethod */])('ControllerProxy.onDestroyed(handler)');
        Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* checkParam */])(handler, 'handler');

        var self = this;
        this.onDestroyedHandlers.add(handler);
        return {
            unsubscribe: () => {
                self.onDestroyedHandlers.delete(handler);
            }
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControllerProxy;



/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_emitter_component__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_emitter_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_emitter_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_promise__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(0);





class ClientContext{

    constructor(dolphin, beanManager, controllerManager, connector){
        Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* checkMethod */])('ClientContext(dolphin, beanManager, controllerManager, connector)');
        Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* checkParam */])(dolphin, 'dolphin');
        Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* checkParam */])(beanManager, 'beanManager');
        Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* checkParam */])(controllerManager, 'controllerManager');
        Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* checkParam */])(connector, 'connector');

        this.dolphin = dolphin;
        this.beanManager = beanManager;
        this._controllerManager = controllerManager;
        this._connector = connector;
        this.connectionPromise = null;
        this.isConnected = false;
    }

    connect(){
        let self = this;
        this.connectionPromise = new __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_promise___default.a((resolve) => {
            self._connector.connect();
            self._connector.invoke(__WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createCreateContextCommand()).then(() => {
                self.isConnected = true;
                resolve();
            });
        });
        return this.connectionPromise;
    }

    onConnect(){
        if(Object(__WEBPACK_IMPORTED_MODULE_3__utils__["c" /* exists */])(this.connectionPromise)){
            if(!this.isConnected){
                return this.connectionPromise;
            }else{
                return new __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_promise___default.a((resolve) => {
                    resolve();
                });
            }
        }else{
            return this.connect();
        }
    }

    createController(name){
        Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* checkMethod */])('ClientContext.createController(name)');
        Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* checkParam */])(name, 'name');

        return this._controllerManager.createController(name);
    }

    disconnect(){
        let self = this;
        this.dolphin.stopPushListening();
        return new __WEBPACK_IMPORTED_MODULE_1__bower_components_core_js_library_fn_promise___default.a((resolve) => {
            self._controllerManager.destroy().then(() => {
                self._connector.invoke(__WEBPACK_IMPORTED_MODULE_2__commands_commandFactory__["a" /* default */].createDestroyContextCommand());
                self.dolphin = null;
                self.beanManager = null;
                self._controllerManager = null;
                self._connector = null;
                resolve();
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClientContext;


__WEBPACK_IMPORTED_MODULE_0_emitter_component___default()(ClientContext.prototype);

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_emitter_component__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_emitter_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_emitter_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__errors__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__commands_codec__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__remotingErrorHandler__ = __webpack_require__(120);









const FINISHED = 4;
const SUCCESS = 200;
const REQUEST_TIMEOUT = 408;

const DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
const CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

class PlatformHttpTransmitter {

    constructor(url, config) {
        this.url = url;
        this.config = config;
        this.headersInfo = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(config) ? config.headersInfo : null;
        let connectionConfig = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(config) ? config.connection : null;
        this.maxRetry = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(connectionConfig) && Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(connectionConfig.maxRetry)?connectionConfig.maxRetry: 3;
        this.timeout = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(connectionConfig) && Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(connectionConfig.timeout)?connectionConfig.timeout: 5000;
        this.failed_attempt = 0;
    }

    _handleError(reject, error) {
        let connectionConfig = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(this.config) ? this.config.connection : null;
        let errorHandlers = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(connectionConfig) && Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(connectionConfig.errorHandlers)?connectionConfig.errorHandlers: [new __WEBPACK_IMPORTED_MODULE_4__remotingErrorHandler__["a" /* default */]()];
        errorHandlers.forEach(function(handler) {
            handler.onError(error);
        });
        reject(error);
    }

    _send(commands) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.withCredentials = true;
            http.onerror = (errorContent) => {
                this._handleError(reject, new __WEBPACK_IMPORTED_MODULE_2__errors__["c" /* HttpNetworkError */]('PlatformHttpTransmitter: Network error', errorContent));
            }

            http.onreadystatechange = () => {
                if (http.readyState === FINISHED){
                    switch (http.status) {

                        case SUCCESS:
                        {
                            this.failed_attempt = 0;
                            const currentClientId = http.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(currentClientId)) {
                                if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(this.clientId) && this.clientId !== currentClientId) {
                                    this._handleError(reject, new __WEBPACK_IMPORTED_MODULE_2__errors__["b" /* DolphinSessionError */]('PlatformHttpTransmitter: ClientId of the response did not match'));
                                }
                                this.clientId = currentClientId;
                            } else {
                                this._handleError(reject, new __WEBPACK_IMPORTED_MODULE_2__errors__["b" /* DolphinSessionError */]('PlatformHttpTransmitter: Server did not send a clientId'));
                            }
                            resolve(http.responseText);
                            break;
                        }

                        case REQUEST_TIMEOUT:
                            this._handleError(reject, new __WEBPACK_IMPORTED_MODULE_2__errors__["b" /* DolphinSessionError */]('PlatformHttpTransmitter: Session Timeout'));
                            break;

                        default:
                            if(this.failed_attempt <= this.maxRetry){
                                this.failed_attempt = this.failed_attempt + 1;
                            }
                            this._handleError(reject, new __WEBPACK_IMPORTED_MODULE_2__errors__["d" /* HttpResponseError */]('PlatformHttpTransmitter: HTTP Status != 200 (' + http.status + ')'));
                            break;
                    }
                }
            };

            http.open('POST', this.url);
            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(this.clientId)) {
                http.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, this.clientId);
            }

            if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* exists */])(this.headersInfo)) {
                for (var i in this.headersInfo) {
                    if (this.headersInfo.hasOwnProperty(i)) {
                        http.setRequestHeader(i, this.headersInfo[i]);
                    }
                }
            }
            if (this.failed_attempt > this.maxRetry) {
                setTimeout(function() {
                    http.send(__WEBPACK_IMPORTED_MODULE_3__commands_codec__["a" /* default */].encode(commands));
                }, this.timeout);
            }else{
                http.send(__WEBPACK_IMPORTED_MODULE_3__commands_codec__["a" /* default */].encode(commands));
            }

        });
    }

    transmit(commands, onDone) {
        this._send(commands)
            .then(responseText => {
                if (responseText.trim().length > 0) {
                    try {
                        const responseCommands = __WEBPACK_IMPORTED_MODULE_3__commands_codec__["a" /* default */].decode(responseText);
                        onDone(responseCommands);
                    } catch (err) {
                        this.emit('error', new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* DolphinRemotingError */]('PlatformHttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')'));
                        onDone([]);
                    }
                } else {
                    this.emit('error', new __WEBPACK_IMPORTED_MODULE_2__errors__["a" /* DolphinRemotingError */]('PlatformHttpTransmitter: Empty response'));
                    onDone([]);
                }
            })
            .catch(error => {
                this.emit('error', error);
                onDone([]);
            });
    }

    signal(command) {
        this._send([command])
            .catch(error => this.emit('error', error));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlatformHttpTransmitter;


__WEBPACK_IMPORTED_MODULE_0_emitter_component___default()(PlatformHttpTransmitter.prototype);


/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class DolphinRemotingError extends Error {
  constructor(message = 'Remoting Error', detail) {
    super(message);
    this.detail = detail || undefined;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DolphinRemotingError;


class DolphinSessionError extends Error {
  constructor(message = 'Session Error') {
    super(message);
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = DolphinSessionError;


class HttpResponseError extends Error {
  constructor(message = 'Http Response Error') {
    super(message);
  }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = HttpResponseError;


class HttpNetworkError extends Error {
    constructor(message = 'Http Network Error') {
        super(message);
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = HttpNetworkError;


/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class RemotingErrorHandler {

    onError(error) {
        window.console.error(error);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = RemotingErrorHandler;


/***/ })
/******/ ]);
});
//# sourceMappingURL=dolphin-platform.js.map