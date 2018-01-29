(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
_dereq_('../modules/es7.map.of');
_dereq_('../modules/es7.map.from');
module.exports = _dereq_('../modules/_core').Map;

},{"../modules/_core":18,"../modules/es6.map":78,"../modules/es6.object.to-string":79,"../modules/es6.string.iterator":82,"../modules/es7.map.from":83,"../modules/es7.map.of":84,"../modules/es7.map.to-json":85,"../modules/web.dom.iterable":91}],2:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
_dereq_('../modules/es7.promise.finally');
_dereq_('../modules/es7.promise.try');
module.exports = _dereq_('../modules/_core').Promise;

},{"../modules/_core":18,"../modules/es6.object.to-string":79,"../modules/es6.promise":80,"../modules/es6.string.iterator":82,"../modules/es7.promise.finally":86,"../modules/es7.promise.try":87,"../modules/web.dom.iterable":91}],3:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
_dereq_('../modules/es7.set.of');
_dereq_('../modules/es7.set.from');
module.exports = _dereq_('../modules/_core').Set;

},{"../modules/_core":18,"../modules/es6.object.to-string":79,"../modules/es6.set":81,"../modules/es6.string.iterator":82,"../modules/es7.set.from":88,"../modules/es7.set.of":89,"../modules/es7.set.to-json":90,"../modules/web.dom.iterable":91}],4:[function(_dereq_,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],5:[function(_dereq_,module,exports){
module.exports = function () { /* empty */ };

},{}],6:[function(_dereq_,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],7:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":36}],8:[function(_dereq_,module,exports){
var forOf = _dereq_('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":26}],9:[function(_dereq_,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_('./_to-iobject');
var toLength = _dereq_('./_to-length');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":67,"./_to-iobject":69,"./_to-length":70}],10:[function(_dereq_,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = _dereq_('./_ctx');
var IObject = _dereq_('./_iobject');
var toObject = _dereq_('./_to-object');
var toLength = _dereq_('./_to-length');
var asc = _dereq_('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":12,"./_ctx":19,"./_iobject":33,"./_to-length":70,"./_to-object":71}],11:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var isArray = _dereq_('./_is-array');
var SPECIES = _dereq_('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":35,"./_is-object":36,"./_wks":75}],12:[function(_dereq_,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = _dereq_('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":11}],13:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof');
var TAG = _dereq_('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":14,"./_wks":75}],14:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],15:[function(_dereq_,module,exports){
'use strict';
var dP = _dereq_('./_object-dp').f;
var create = _dereq_('./_object-create');
var redefineAll = _dereq_('./_redefine-all');
var ctx = _dereq_('./_ctx');
var anInstance = _dereq_('./_an-instance');
var forOf = _dereq_('./_for-of');
var $iterDefine = _dereq_('./_iter-define');
var step = _dereq_('./_iter-step');
var setSpecies = _dereq_('./_set-species');
var DESCRIPTORS = _dereq_('./_descriptors');
var fastKey = _dereq_('./_meta').fastKey;
var validate = _dereq_('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
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
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":6,"./_ctx":19,"./_descriptors":21,"./_for-of":26,"./_iter-define":39,"./_iter-step":41,"./_meta":44,"./_object-create":47,"./_object-dp":48,"./_redefine-all":56,"./_set-species":60,"./_validate-collection":74}],16:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof');
var from = _dereq_('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":8,"./_classof":13}],17:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var $export = _dereq_('./_export');
var meta = _dereq_('./_meta');
var fails = _dereq_('./_fails');
var hide = _dereq_('./_hide');
var redefineAll = _dereq_('./_redefine-all');
var forOf = _dereq_('./_for-of');
var anInstance = _dereq_('./_an-instance');
var isObject = _dereq_('./_is-object');
var setToStringTag = _dereq_('./_set-to-string-tag');
var dP = _dereq_('./_object-dp').f;
var each = _dereq_('./_array-methods')(0);
var DESCRIPTORS = _dereq_('./_descriptors');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":6,"./_array-methods":10,"./_descriptors":21,"./_export":24,"./_fails":25,"./_for-of":26,"./_global":27,"./_hide":29,"./_is-object":36,"./_meta":44,"./_object-dp":48,"./_redefine-all":56,"./_set-to-string-tag":61}],18:[function(_dereq_,module,exports){
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],19:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":4}],20:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],21:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":25}],22:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var document = _dereq_('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":27,"./_is-object":36}],23:[function(_dereq_,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],24:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var ctx = _dereq_('./_ctx');
var hide = _dereq_('./_hide');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
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
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
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

},{"./_core":18,"./_ctx":19,"./_global":27,"./_hide":29}],25:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],26:[function(_dereq_,module,exports){
var ctx = _dereq_('./_ctx');
var call = _dereq_('./_iter-call');
var isArrayIter = _dereq_('./_is-array-iter');
var anObject = _dereq_('./_an-object');
var toLength = _dereq_('./_to-length');
var getIterFn = _dereq_('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":7,"./_ctx":19,"./_is-array-iter":34,"./_iter-call":37,"./_to-length":70,"./core.get-iterator-method":76}],27:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],28:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],29:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp');
var createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":21,"./_object-dp":48,"./_property-desc":55}],30:[function(_dereq_,module,exports){
var document = _dereq_('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":27}],31:[function(_dereq_,module,exports){
module.exports = !_dereq_('./_descriptors') && !_dereq_('./_fails')(function () {
  return Object.defineProperty(_dereq_('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":21,"./_dom-create":22,"./_fails":25}],32:[function(_dereq_,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
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
  } return fn.apply(that, args);
};

},{}],33:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":14}],34:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators = _dereq_('./_iterators');
var ITERATOR = _dereq_('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":42,"./_wks":75}],35:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":14}],36:[function(_dereq_,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],37:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":7}],38:[function(_dereq_,module,exports){
'use strict';
var create = _dereq_('./_object-create');
var descriptor = _dereq_('./_property-desc');
var setToStringTag = _dereq_('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":29,"./_object-create":47,"./_property-desc":55,"./_set-to-string-tag":61,"./_wks":75}],39:[function(_dereq_,module,exports){
'use strict';
var LIBRARY = _dereq_('./_library');
var $export = _dereq_('./_export');
var redefine = _dereq_('./_redefine');
var hide = _dereq_('./_hide');
var has = _dereq_('./_has');
var Iterators = _dereq_('./_iterators');
var $iterCreate = _dereq_('./_iter-create');
var setToStringTag = _dereq_('./_set-to-string-tag');
var getPrototypeOf = _dereq_('./_object-gpo');
var ITERATOR = _dereq_('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":24,"./_has":28,"./_hide":29,"./_iter-create":38,"./_iterators":42,"./_library":43,"./_object-gpo":50,"./_redefine":57,"./_set-to-string-tag":61,"./_wks":75}],40:[function(_dereq_,module,exports){
var ITERATOR = _dereq_('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":75}],41:[function(_dereq_,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],42:[function(_dereq_,module,exports){
module.exports = {};

},{}],43:[function(_dereq_,module,exports){
module.exports = true;

},{}],44:[function(_dereq_,module,exports){
var META = _dereq_('./_uid')('meta');
var isObject = _dereq_('./_is-object');
var has = _dereq_('./_has');
var setDesc = _dereq_('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_dereq_('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":25,"./_has":28,"./_is-object":36,"./_object-dp":48,"./_uid":73}],45:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var macrotask = _dereq_('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = _dereq_('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":14,"./_global":27,"./_task":66}],46:[function(_dereq_,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = _dereq_('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":4}],47:[function(_dereq_,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = _dereq_('./_an-object');
var dPs = _dereq_('./_object-dps');
var enumBugKeys = _dereq_('./_enum-bug-keys');
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _dereq_('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _dereq_('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":30,"./_object-dps":49,"./_shared-key":62}],48:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var IE8_DOM_DEFINE = _dereq_('./_ie8-dom-define');
var toPrimitive = _dereq_('./_to-primitive');
var dP = Object.defineProperty;

exports.f = _dereq_('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_ie8-dom-define":31,"./_to-primitive":72}],49:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp');
var anObject = _dereq_('./_an-object');
var getKeys = _dereq_('./_object-keys');

module.exports = _dereq_('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_object-dp":48,"./_object-keys":52}],50:[function(_dereq_,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = _dereq_('./_has');
var toObject = _dereq_('./_to-object');
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":28,"./_shared-key":62,"./_to-object":71}],51:[function(_dereq_,module,exports){
var has = _dereq_('./_has');
var toIObject = _dereq_('./_to-iobject');
var arrayIndexOf = _dereq_('./_array-includes')(false);
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":9,"./_has":28,"./_shared-key":62,"./_to-iobject":69}],52:[function(_dereq_,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = _dereq_('./_object-keys-internal');
var enumBugKeys = _dereq_('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":51}],53:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],54:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var isObject = _dereq_('./_is-object');
var newPromiseCapability = _dereq_('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":7,"./_is-object":36,"./_new-promise-capability":46}],55:[function(_dereq_,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],56:[function(_dereq_,module,exports){
var hide = _dereq_('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":29}],57:[function(_dereq_,module,exports){
module.exports = _dereq_('./_hide');

},{"./_hide":29}],58:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = _dereq_('./_export');
var aFunction = _dereq_('./_a-function');
var ctx = _dereq_('./_ctx');
var forOf = _dereq_('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":4,"./_ctx":19,"./_export":24,"./_for-of":26}],59:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = _dereq_('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":24}],60:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var dP = _dereq_('./_object-dp');
var DESCRIPTORS = _dereq_('./_descriptors');
var SPECIES = _dereq_('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":18,"./_descriptors":21,"./_global":27,"./_object-dp":48,"./_wks":75}],61:[function(_dereq_,module,exports){
var def = _dereq_('./_object-dp').f;
var has = _dereq_('./_has');
var TAG = _dereq_('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":28,"./_object-dp":48,"./_wks":75}],62:[function(_dereq_,module,exports){
var shared = _dereq_('./_shared')('keys');
var uid = _dereq_('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":63,"./_uid":73}],63:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":27}],64:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = _dereq_('./_an-object');
var aFunction = _dereq_('./_a-function');
var SPECIES = _dereq_('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":4,"./_an-object":7,"./_wks":75}],65:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer');
var defined = _dereq_('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":20,"./_to-integer":68}],66:[function(_dereq_,module,exports){
var ctx = _dereq_('./_ctx');
var invoke = _dereq_('./_invoke');
var html = _dereq_('./_html');
var cel = _dereq_('./_dom-create');
var global = _dereq_('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_dereq_('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":14,"./_ctx":19,"./_dom-create":22,"./_global":27,"./_html":30,"./_invoke":32}],67:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":68}],68:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],69:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject');
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":20,"./_iobject":33}],70:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":68}],71:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":20}],72:[function(_dereq_,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = _dereq_('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":36}],73:[function(_dereq_,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],74:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":36}],75:[function(_dereq_,module,exports){
var store = _dereq_('./_shared')('wks');
var uid = _dereq_('./_uid');
var Symbol = _dereq_('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":27,"./_shared":63,"./_uid":73}],76:[function(_dereq_,module,exports){
var classof = _dereq_('./_classof');
var ITERATOR = _dereq_('./_wks')('iterator');
var Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":13,"./_core":18,"./_iterators":42,"./_wks":75}],77:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./_add-to-unscopables');
var step = _dereq_('./_iter-step');
var Iterators = _dereq_('./_iterators');
var toIObject = _dereq_('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":5,"./_iter-define":39,"./_iter-step":41,"./_iterators":42,"./_to-iobject":69}],78:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');
var validate = _dereq_('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = _dereq_('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":17,"./_collection-strong":15,"./_validate-collection":74}],79:[function(_dereq_,module,exports){

},{}],80:[function(_dereq_,module,exports){
'use strict';
var LIBRARY = _dereq_('./_library');
var global = _dereq_('./_global');
var ctx = _dereq_('./_ctx');
var classof = _dereq_('./_classof');
var $export = _dereq_('./_export');
var isObject = _dereq_('./_is-object');
var aFunction = _dereq_('./_a-function');
var anInstance = _dereq_('./_an-instance');
var forOf = _dereq_('./_for-of');
var speciesConstructor = _dereq_('./_species-constructor');
var task = _dereq_('./_task').set;
var microtask = _dereq_('./_microtask')();
var newPromiseCapabilityModule = _dereq_('./_new-promise-capability');
var perform = _dereq_('./_perform');
var promiseResolve = _dereq_('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_dereq_('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _dereq_('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
_dereq_('./_set-to-string-tag')($Promise, PROMISE);
_dereq_('./_set-species')(PROMISE);
Wrapper = _dereq_('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":4,"./_an-instance":6,"./_classof":13,"./_core":18,"./_ctx":19,"./_export":24,"./_for-of":26,"./_global":27,"./_is-object":36,"./_iter-detect":40,"./_library":43,"./_microtask":45,"./_new-promise-capability":46,"./_perform":53,"./_promise-resolve":54,"./_redefine-all":56,"./_set-species":60,"./_set-to-string-tag":61,"./_species-constructor":64,"./_task":66,"./_wks":75}],81:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');
var validate = _dereq_('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = _dereq_('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":17,"./_collection-strong":15,"./_validate-collection":74}],82:[function(_dereq_,module,exports){
'use strict';
var $at = _dereq_('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":39,"./_string-at":65}],83:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
_dereq_('./_set-collection-from')('Map');

},{"./_set-collection-from":58}],84:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
_dereq_('./_set-collection-of')('Map');

},{"./_set-collection-of":59}],85:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Map', { toJSON: _dereq_('./_collection-to-json')('Map') });

},{"./_collection-to-json":16,"./_export":24}],86:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = _dereq_('./_export');
var core = _dereq_('./_core');
var global = _dereq_('./_global');
var speciesConstructor = _dereq_('./_species-constructor');
var promiseResolve = _dereq_('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":18,"./_export":24,"./_global":27,"./_promise-resolve":54,"./_species-constructor":64}],87:[function(_dereq_,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = _dereq_('./_export');
var newPromiseCapability = _dereq_('./_new-promise-capability');
var perform = _dereq_('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":24,"./_new-promise-capability":46,"./_perform":53}],88:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
_dereq_('./_set-collection-from')('Set');

},{"./_set-collection-from":58}],89:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
_dereq_('./_set-collection-of')('Set');

},{"./_set-collection-of":59}],90:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Set', { toJSON: _dereq_('./_collection-to-json')('Set') });

},{"./_collection-to-json":16,"./_export":24}],91:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var global = _dereq_('./_global');
var hide = _dereq_('./_hide');
var Iterators = _dereq_('./_iterators');
var TO_STRING_TAG = _dereq_('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":27,"./_hide":29,"./_iterators":42,"./_wks":75,"./es6.array.iterator":77}],92:[function(_dereq_,module,exports){

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

},{}],93:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Attribute = function Attribute() {
  _classCallCheck(this, Attribute);
};

exports.default = Attribute;

Attribute.QUALIFIER_PROPERTY = "qualifier";
Attribute.VALUE = "value";

},{}],94:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _map = _dereq_('core-js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var BeanManager = function () {
    function BeanManager(classRepository) {
        _classCallCheck(this, BeanManager);

        (0, _utils.checkMethod)('BeanManager(classRepository)');
        (0, _utils.checkParam)(classRepository, 'classRepository');

        this.classRepository = classRepository;
        this.addedHandlers = new _map2.default();
        this.removedHandlers = new _map2.default();
        this.updatedHandlers = new _map2.default();
        this.arrayUpdatedHandlers = new _map2.default();
        this.allAddedHandlers = [];
        this.allRemovedHandlers = [];
        this.allUpdatedHandlers = [];
        this.allArrayUpdatedHandlers = [];

        var self = this;
        this.classRepository.onBeanAdded(function (type, bean) {
            var handlerList = self.addedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                    }
                });
            }
            self.allAddedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanAdded-handler', e);
                }
            });
        });
        this.classRepository.onBeanRemoved(function (type, bean) {
            var handlerList = self.removedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                    }
                });
            }
            self.allRemovedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanRemoved-handler', e);
                }
            });
        });
        this.classRepository.onBeanUpdate(function (type, bean, propertyName, newValue, oldValue) {
            var handlerList = self.updatedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean, propertyName, newValue, oldValue);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                    }
                });
            }
            self.allUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanUpdate-handler', e);
                }
            });
        });
        this.classRepository.onArrayUpdate(function (type, bean, propertyName, index, count, newElements) {
            var handlerList = self.arrayUpdatedHandlers.get(type);
            if ((0, _utils.exists)(handlerList)) {
                handlerList.forEach(function (handler) {
                    try {
                        handler(bean, propertyName, index, count, newElements);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                    }
                });
            }
            self.allArrayUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onArrayUpdate-handler', e);
                }
            });
        });
    }

    _createClass(BeanManager, [{
        key: 'notifyBeanChange',
        value: function notifyBeanChange(bean, propertyName, newValue) {
            (0, _utils.checkMethod)('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');

            return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
        }
    }, {
        key: 'notifyArrayChange',
        value: function notifyArrayChange(bean, propertyName, index, count, removedElements) {
            (0, _utils.checkMethod)('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');
            (0, _utils.checkParam)(index, 'index');
            (0, _utils.checkParam)(count, 'count');
            (0, _utils.checkParam)(removedElements, 'removedElements');

            this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
        }
    }, {
        key: 'isManaged',
        value: function isManaged(bean) {
            (0, _utils.checkMethod)('BeanManager.isManaged(bean)');
            (0, _utils.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.isManaged() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'create',
        value: function create(type) {
            (0, _utils.checkMethod)('BeanManager.create(type)');
            (0, _utils.checkParam)(type, 'type');

            // TODO: Implement dolphin.create() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'add',
        value: function add(type, bean) {
            (0, _utils.checkMethod)('BeanManager.add(type, bean)');
            (0, _utils.checkParam)(type, 'type');
            (0, _utils.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.add() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'addAll',
        value: function addAll(type, collection) {
            (0, _utils.checkMethod)('BeanManager.addAll(type, collection)');
            (0, _utils.checkParam)(type, 'type');
            (0, _utils.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.addAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'remove',
        value: function remove(bean) {
            (0, _utils.checkMethod)('BeanManager.remove(bean)');
            (0, _utils.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.remove() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeAll',
        value: function removeAll(collection) {
            (0, _utils.checkMethod)('BeanManager.removeAll(collection)');
            (0, _utils.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.removeAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeIf',
        value: function removeIf(predicate) {
            (0, _utils.checkMethod)('BeanManager.removeIf(predicate)');
            (0, _utils.checkParam)(predicate, 'predicate');

            // TODO: Implement dolphin.removeIf() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'onAdded',
        value: function onAdded(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils.checkMethod)('BeanManager.onAdded(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allAddedHandlers = self.allAddedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onAdded(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.addedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.addedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.addedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.addedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }, {
        key: 'onRemoved',
        value: function onRemoved(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils.checkMethod)('BeanManager.onRemoved(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allRemovedHandlers = self.allRemovedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onRemoved(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.removedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.removedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.removedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.removedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }, {
        key: 'onBeanUpdate',
        value: function onBeanUpdate(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils.checkMethod)('BeanManager.onBeanUpdate(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onBeanUpdate(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.updatedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.updatedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.updatedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.updatedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }, {
        key: 'onArrayUpdate',
        value: function onArrayUpdate(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils.checkMethod)('BeanManager.onArrayUpdate(eventHandler)');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils.checkMethod)('BeanManager.onArrayUpdate(type, eventHandler)');
                (0, _utils.checkParam)(type, 'type');
                (0, _utils.checkParam)(eventHandler, 'eventHandler');

                var handlerList = self.arrayUpdatedHandlers.get(type);
                if (!(0, _utils.exists)(handlerList)) {
                    handlerList = [];
                }
                self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
                return {
                    unsubscribe: function unsubscribe() {
                        var handlerList = self.arrayUpdatedHandlers.get(type);
                        if ((0, _utils.exists)(handlerList)) {
                            self.arrayUpdatedHandlers.set(type, handlerList.filter(function (value) {
                                return value !== eventHandler;
                            }));
                        }
                    }
                };
            }
        }
    }]);

    return BeanManager;
}();

exports.default = BeanManager;

BeanManager.LOGGER = _logging.LoggerFactory.getLogger('BeanManager');

},{"./logging":130,"./utils":137,"core-js/library/fn/map":1}],95:[function(_dereq_,module,exports){
'use strict';

var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
};

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _map = _dereq_('core-js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _constants = _dereq_('./constants');

var consts = _interopRequireWildcard(_constants);

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var blocked = null;

var ClassRepository = function () {
    function ClassRepository(dolphin) {
        _classCallCheck(this, ClassRepository);

        (0, _utils.checkMethod)('ClassRepository(dolphin)');
        (0, _utils.checkParam)(dolphin, 'dolphin');

        this.dolphin = dolphin;
        this.classes = new _map2.default();
        this.beanFromDolphin = new _map2.default();
        this.beanToDolphin = new _map2.default();
        this.classInfos = new _map2.default();
        this.beanAddedHandlers = [];
        this.beanRemovedHandlers = [];
        this.propertyUpdateHandlers = [];
        this.arrayUpdateHandlers = [];
    }

    _createClass(ClassRepository, [{
        key: 'fixType',
        value: function fixType(type, value) {
            switch (type) {
                case consts.BYTE:
                case consts.SHORT:
                case consts.INT:
                case consts.LONG:
                    return parseInt(value);
                case consts.FLOAT:
                case consts.DOUBLE:
                    return parseFloat(value);
                case consts.BOOLEAN:
                    return 'true' === String(value).toLowerCase();
                case consts.STRING:
                case consts.ENUM:
                    return String(value);
                default:
                    return value;
            }
        }
    }, {
        key: 'fromDolphin',
        value: function fromDolphin(classRepository, type, value) {
            if (!(0, _utils.exists)(value)) {
                return null;
            }
            switch (type) {
                case consts.DOLPHIN_BEAN:
                    return classRepository.beanFromDolphin.get(String(value));
                case consts.DATE:
                    return new Date(String(value));
                case consts.CALENDAR:
                    return new Date(String(value));
                case consts.LOCAL_DATE_FIELD_TYPE:
                    return new Date(String(value));
                case consts.LOCAL_DATE_TIME_FIELD_TYPE:
                    return new Date(String(value));
                case consts.ZONED_DATE_TIME_FIELD_TYPE:
                    return new Date(String(value));
                default:
                    return this.fixType(type, value);
            }
        }
    }, {
        key: 'toDolphin',
        value: function toDolphin(classRepository, type, value) {
            if (!(0, _utils.exists)(value)) {
                return null;
            }
            switch (type) {
                case consts.DOLPHIN_BEAN:
                    return classRepository.beanToDolphin.get(value);
                case consts.DATE:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.CALENDAR:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.LOCAL_DATE_FIELD_TYPE:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.LOCAL_DATE_TIME_FIELD_TYPE:
                    return value instanceof Date ? value.toISOString() : value;
                case consts.ZONED_DATE_TIME_FIELD_TYPE:
                    return value instanceof Date ? value.toISOString() : value;
                default:
                    return this.fixType(type, value);
            }
        }
    }, {
        key: 'sendListSplice',
        value: function sendListSplice(classRepository, modelId, propertyName, from, to, newElements) {
            var dolphin = classRepository.dolphin;
            var model = dolphin.findPresentationModelById(modelId);
            var self = this;
            if ((0, _utils.exists)(model)) {
                var classInfo = classRepository.classes.get(model.presentationModelType);
                var type = classInfo[propertyName];
                if ((0, _utils.exists)(type)) {

                    var attributes = [dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'), dolphin.attribute('source', null, modelId), dolphin.attribute('attribute', null, propertyName), dolphin.attribute('from', null, from), dolphin.attribute('to', null, to), dolphin.attribute('count', null, newElements.length)];
                    newElements.forEach(function (element, index) {
                        attributes.push(dolphin.attribute(index.toString(), null, self.toDolphin(classRepository, type, element)));
                    });
                    dolphin.presentationModel.apply(dolphin, [null, '@DP:LS@'].concat(attributes));
                }
            }
        }
    }, {
        key: 'validateList',
        value: function validateList(classRepository, type, bean, propertyName) {
            var list = bean[propertyName];
            if (!(0, _utils.exists)(list)) {
                classRepository.propertyUpdateHandlers.forEach(function (handler) {
                    try {
                        handler(type, bean, propertyName, [], undefined);
                    } catch (e) {
                        ClassRepository.LOGGER.error('An exception occurred while calling an onBeanUpdate-handler', e);
                    }
                });
            }
        }
    }, {
        key: 'block',
        value: function block(bean, propertyName) {
            if ((0, _utils.exists)(blocked)) {
                throw new Error('Trying to create a block while another block exists');
            }
            blocked = {
                bean: bean,
                propertyName: propertyName
            };
        }
    }, {
        key: 'isBlocked',
        value: function isBlocked(bean, propertyName) {
            return (0, _utils.exists)(blocked) && blocked.bean === bean && blocked.propertyName === propertyName;
        }
    }, {
        key: 'unblock',
        value: function unblock() {
            blocked = null;
        }
    }, {
        key: 'notifyBeanChange',
        value: function notifyBeanChange(bean, propertyName, newValue) {
            (0, _utils.checkMethod)('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');

            var modelId = this.beanToDolphin.get(bean);
            if ((0, _utils.exists)(modelId)) {
                var model = this.dolphin.findPresentationModelById(modelId);
                if ((0, _utils.exists)(model)) {
                    var classInfo = this.classes.get(model.presentationModelType);
                    var type = classInfo[propertyName];
                    var attribute = model.findAttributeByPropertyName(propertyName);
                    if ((0, _utils.exists)(type) && (0, _utils.exists)(attribute)) {
                        var oldValue = attribute.getValue();
                        attribute.setValue(this.toDolphin(this, type, newValue));
                        return this.fromDolphin(this, type, oldValue);
                    }
                }
            }
        }
    }, {
        key: 'notifyArrayChange',
        value: function notifyArrayChange(bean, propertyName, index, count, removedElements) {
            (0, _utils.checkMethod)('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils.checkParam)(bean, 'bean');
            (0, _utils.checkParam)(propertyName, 'propertyName');
            (0, _utils.checkParam)(index, 'index');
            (0, _utils.checkParam)(count, 'count');
            (0, _utils.checkParam)(removedElements, 'removedElements');

            if (this.isBlocked(bean, propertyName)) {
                return;
            }
            var modelId = this.beanToDolphin.get(bean);
            var array = bean[propertyName];
            if ((0, _utils.exists)(modelId) && (0, _utils.exists)(array)) {
                var removedElementsCount = Array.isArray(removedElements) ? removedElements.length : 0;
                this.sendListSplice(this, modelId, propertyName, index, index + removedElementsCount, array.slice(index, index + count));
            }
        }
    }, {
        key: 'onBeanAdded',
        value: function onBeanAdded(handler) {
            (0, _utils.checkMethod)('ClassRepository.onBeanAdded(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.beanAddedHandlers.push(handler);
        }
    }, {
        key: 'onBeanRemoved',
        value: function onBeanRemoved(handler) {
            (0, _utils.checkMethod)('ClassRepository.onBeanRemoved(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.beanRemovedHandlers.push(handler);
        }
    }, {
        key: 'onBeanUpdate',
        value: function onBeanUpdate(handler) {
            (0, _utils.checkMethod)('ClassRepository.onBeanUpdate(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.propertyUpdateHandlers.push(handler);
        }
    }, {
        key: 'onArrayUpdate',
        value: function onArrayUpdate(handler) {
            (0, _utils.checkMethod)('ClassRepository.onArrayUpdate(handler)');
            (0, _utils.checkParam)(handler, 'handler');
            this.arrayUpdateHandlers.push(handler);
        }
    }, {
        key: 'registerClass',
        value: function registerClass(model) {
            (0, _utils.checkMethod)('ClassRepository.registerClass(model)');
            (0, _utils.checkParam)(model, 'model');

            if (this.classes.has(model.id)) {
                return;
            }

            var classInfo = {};
            model.attributes.filter(function (attribute) {
                return attribute.propertyName.search(/^@/) < 0;
            }).forEach(function (attribute) {
                classInfo[attribute.propertyName] = attribute.value;
            });
            this.classes.set(model.id, classInfo);
        }
    }, {
        key: 'unregisterClass',
        value: function unregisterClass(model) {
            (0, _utils.checkMethod)('ClassRepository.unregisterClass(model)');
            (0, _utils.checkParam)(model, 'model');
            this.classes['delete'](model.id);
        }
    }, {
        key: 'load',
        value: function load(model) {
            (0, _utils.checkMethod)('ClassRepository.load(model)');
            (0, _utils.checkParam)(model, 'model');

            var self = this;
            var classInfo = this.classes.get(model.presentationModelType);
            var bean = {};
            model.attributes.filter(function (attribute) {
                return attribute.propertyName.search(/^@/) < 0;
            }).forEach(function (attribute) {
                bean[attribute.propertyName] = null;
                attribute.onValueChange(function (event) {
                    if (event.oldValue !== event.newValue) {
                        var oldValue = self.fromDolphin(self, classInfo[attribute.propertyName], event.oldValue);
                        var newValue = self.fromDolphin(self, classInfo[attribute.propertyName], event.newValue);
                        self.propertyUpdateHandlers.forEach(function (handler) {
                            try {
                                handler(model.presentationModelType, bean, attribute.propertyName, newValue, oldValue);
                            } catch (e) {
                                ClassRepository.LOGGER.error('An exception occurred while calling an onBeanUpdate-handler', e);
                            }
                        });
                    }
                });
            });
            this.beanFromDolphin.set(model.id, bean);
            this.beanToDolphin.set(bean, model.id);
            this.classInfos.set(model.id, classInfo);
            this.beanAddedHandlers.forEach(function (handler) {
                try {
                    handler(model.presentationModelType, bean);
                } catch (e) {
                    ClassRepository.LOGGER.error('An exception occurred while calling an onBeanAdded-handler', e);
                }
            });
            return bean;
        }
    }, {
        key: 'unload',
        value: function unload(model) {
            (0, _utils.checkMethod)('ClassRepository.unload(model)');
            (0, _utils.checkParam)(model, 'model');

            var bean = this.beanFromDolphin.get(model.id);
            this.beanFromDolphin['delete'](model.id);
            this.beanToDolphin['delete'](bean);
            this.classInfos['delete'](model.id);
            if ((0, _utils.exists)(bean)) {
                this.beanRemovedHandlers.forEach(function (handler) {
                    try {
                        handler(model.presentationModelType, bean);
                    } catch (e) {
                        ClassRepository.LOGGER.error('An exception occurred while calling an onBeanRemoved-handler', e);
                    }
                });
            }
            return bean;
        }
    }, {
        key: 'spliceListEntry',
        value: function spliceListEntry(model) {
            (0, _utils.checkMethod)('ClassRepository.spliceListEntry(model)');
            (0, _utils.checkParam)(model, 'model');

            var source = model.findAttributeByPropertyName('source');
            var attribute = model.findAttributeByPropertyName('attribute');
            var from = model.findAttributeByPropertyName('from');
            var to = model.findAttributeByPropertyName('to');
            var count = model.findAttributeByPropertyName('count');

            if ((0, _utils.exists)(source) && (0, _utils.exists)(attribute) && (0, _utils.exists)(from) && (0, _utils.exists)(to) && (0, _utils.exists)(count)) {
                var classInfo = this.classInfos.get(source.value);
                var bean = this.beanFromDolphin.get(source.value);
                if ((0, _utils.exists)(bean) && (0, _utils.exists)(classInfo)) {
                    var type = model.presentationModelType;
                    //var entry = fromDolphin(this, classInfo[attribute.value], element.value);
                    this.validateList(this, type, bean, attribute.value);
                    var newElements = [],
                        element = null;
                    for (var i = 0; i < count.value; i++) {
                        element = model.findAttributeByPropertyName(i.toString());
                        if (!(0, _utils.exists)(element)) {
                            throw new Error("Invalid list modification update received");
                        }
                        newElements.push(this.fromDolphin(this, classInfo[attribute.value], element.value));
                    }
                    try {
                        this.block(bean, attribute.value);
                        this.arrayUpdateHandlers.forEach(function (handler) {
                            try {
                                handler(type, bean, attribute.value, from.value, to.value - from.value, newElements);
                            } catch (e) {
                                ClassRepository.LOGGER.error('An exception occurred while calling an onArrayUpdate-handler', e);
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
    }, {
        key: 'mapParamToDolphin',
        value: function mapParamToDolphin(param) {
            if (!(0, _utils.exists)(param)) {
                return param;
            }
            var type = typeof param === 'undefined' ? 'undefined' : _typeof(param);
            if (type === 'object') {
                if (param instanceof Date) {
                    return param.toISOString();
                } else {
                    var value = this.beanToDolphin.get(param);
                    if ((0, _utils.exists)(value)) {
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
    }, {
        key: 'mapDolphinToBean',
        value: function mapDolphinToBean(value) {
            return this.fromDolphin(this, consts.DOLPHIN_BEAN, value);
        }
    }]);

    return ClassRepository;
}();

exports.default = ClassRepository;

ClassRepository.LOGGER = _logging.LoggerFactory.getLogger('ClassRepository');

},{"./constants":122,"./logging":130,"./utils":137,"core-js/library/fn/map":1}],96:[function(_dereq_,module,exports){
'use strict';

var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
};

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventBus = _dereq_('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ClientAttribute = function () {
    function ClientAttribute(propertyName, qualifier, value) {
        _classCallCheck(this, ClientAttribute);

        this.propertyName = propertyName;
        this.id = "" + ClientAttribute.clientAttributeInstanceCount++ + "C";
        this.valueChangeBus = new _eventBus2.default();
        this.qualifierChangeBus = new _eventBus2.default();
        this.setValue(value);
        this.setQualifier(qualifier);
    }

    _createClass(ClientAttribute, [{
        key: 'copy',
        value: function copy() {
            var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
            return result;
        }
    }, {
        key: 'setPresentationModel',
        value: function setPresentationModel(presentationModel) {
            if (this.presentationModel) {
                throw new Error("You can not set a presentation model for an attribute that is already bound.");
            }
            this.presentationModel = presentationModel;
        }
    }, {
        key: 'getPresentationModel',
        value: function getPresentationModel() {
            return this.presentationModel;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.value;
        }
    }, {
        key: 'setValueFromServer',
        value: function setValueFromServer(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value === verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': false });
        }
    }, {
        key: 'setValue',
        value: function setValue(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value === verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': true });
        }
    }, {
        key: 'setQualifier',
        value: function setQualifier(newQualifier) {
            if (this.qualifier === newQualifier) return;
            var oldQualifier = this.qualifier;
            this.qualifier = newQualifier;
            this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
            this.valueChangeBus.trigger({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
        }
    }, {
        key: 'getQualifier',
        value: function getQualifier() {
            return this.qualifier;
        }
    }, {
        key: 'onValueChange',
        value: function onValueChange(eventHandler) {
            this.valueChangeBus.onEvent(eventHandler);
            eventHandler({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
        }
    }, {
        key: 'onQualifierChange',
        value: function onQualifierChange(eventHandler) {
            this.qualifierChangeBus.onEvent(eventHandler);
        }
    }, {
        key: 'syncWith',
        value: function syncWith(sourceAttribute) {
            if (sourceAttribute) {
                this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
                this.setValue(sourceAttribute.value);
            }
        }
    }], [{
        key: 'checkValue',
        value: function checkValue(value) {
            if (value == null || typeof value === 'undefined') {
                return null;
            }
            var result = value;
            if (result instanceof String || result instanceof Boolean || result instanceof Number) {
                result = value.valueOf();
            }
            if (result instanceof ClientAttribute) {
                ClientAttribute.LOGGER.warn("An Attribute may not itself contain an attribute as a value. Assuming you forgot to call value.");
                result = this.checkValue(value.value);
            }
            var ok = false;
            if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result === 'undefined' ? 'undefined' : _typeof(result)) > -1 || result instanceof Date) {
                ok = true;
            }
            if (!ok) {
                throw new Error("Attribute values of this type are not allowed: " + (typeof value === 'undefined' ? 'undefined' : _typeof(value)));
            }
            return result;
        }
    }]);

    return ClientAttribute;
}();

exports.default = ClientAttribute;

ClientAttribute.LOGGER = _logging.LoggerFactory.getLogger('ClientAttribute');
ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;

},{"./eventBus":127,"./logging":130}],97:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandBatcher = _dereq_('./commandBatcher');

var _commandBatcher2 = _interopRequireDefault(_commandBatcher);

var _codec = _dereq_('./commands/codec');

var _codec2 = _interopRequireDefault(_codec);

var _clientPresentationModel = _dereq_('./clientPresentationModel');

var _clientPresentationModel2 = _interopRequireDefault(_clientPresentationModel);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ClientConnector = function () {
    function ClientConnector(transmitter, clientDolphin) {
        var slackMS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var maxBatchSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 50;

        _classCallCheck(this, ClientConnector);

        this.commandQueue = [];
        this.currentlySending = false;
        this.pushEnabled = false;
        this.waiting = false;
        this.transmitter = transmitter;
        this.clientDolphin = clientDolphin;
        this.slackMS = slackMS;
        this.codec = new _codec2.default();
        this.commandBatcher = new _commandBatcher2.default(true, maxBatchSize);
    }

    _createClass(ClientConnector, [{
        key: 'setCommandBatcher',
        value: function setCommandBatcher(newBatcher) {
            this.commandBatcher = newBatcher;
        }
    }, {
        key: 'setPushEnabled',
        value: function setPushEnabled(enabled) {
            this.pushEnabled = enabled;
        }
    }, {
        key: 'setPushListener',
        value: function setPushListener(newListener) {
            this.pushListener = newListener;
        }
    }, {
        key: 'setReleaseCommand',
        value: function setReleaseCommand(newCommand) {
            this.releaseCommand = newCommand;
        }
    }, {
        key: 'send',
        value: function send(command, onFinished) {
            this.commandQueue.push({ command: command, handler: onFinished });
            if (this.currentlySending) {
                this.release(); // there is not point in releasing if we do not send atm
                return;
            }
            this.doSendNext();
        }
    }, {
        key: 'doSendNext',
        value: function doSendNext() {
            var _this = this;

            if (this.commandQueue.length < 1) {
                if (this.pushEnabled) {
                    this.enqueuePushCommand();
                } else {
                    this.currentlySending = false;
                    return;
                }
            }
            this.currentlySending = true;
            var cmdsAndHandlers = this.commandBatcher.batch(this.commandQueue);

            if (cmdsAndHandlers.length > 0) {
                var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
                var commands = cmdsAndHandlers.map(function (cah) {
                    return cah.command;
                });
                this.transmitter.transmit(commands, function (response) {
                    var touchedPMs = [];
                    response.forEach(function (command) {
                        var touched = _this.handle(command);
                        if (touched) touchedPMs.push(touched);
                    });
                    if (callback) {
                        callback.onFinished(touchedPMs); // todo: make them unique?
                    }
                    setTimeout(function () {
                        return _this.doSendNext();
                    }, _this.slackMS);
                });
            } else {
                setTimeout(function () {
                    return _this.doSendNext();
                }, this.slackMS);
            }
        }
    }, {
        key: 'handle',
        value: function handle(command) {
            if (command.id === "DeletePresentationModel") {
                return this.handleDeletePresentationModelCommand(command);
            } else if (command.id === "CreatePresentationModel") {
                return this.handleCreatePresentationModelCommand(command);
            } else if (command.id === "ValueChanged") {
                return this.handleValueChangedCommand(command);
            } else if (command.id === "AttributeMetadataChanged") {
                return this.handleAttributeMetadataChangedCommand(command);
            } else {
                ClientConnector.LOGGER.error("Cannot handle, unknown command " + command);
            }
            return null;
        }
    }, {
        key: 'handleDeletePresentationModelCommand',
        value: function handleDeletePresentationModelCommand(serverCommand) {
            var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
            if (!model) return null;
            this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
            return model;
        }
    }, {
        key: 'handleCreatePresentationModelCommand',
        value: function handleCreatePresentationModelCommand(serverCommand) {
            var _this2 = this;

            if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
                throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
            }
            var attributes = [];
            serverCommand.attributes.forEach(function (attr) {
                var clientAttribute = _this2.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value);
                if (attr.id && attr.id.match(".*S$")) {
                    clientAttribute.id = attr.id;
                }
                attributes.push(clientAttribute);
            });
            var clientPm = new _clientPresentationModel2.default(serverCommand.pmId, serverCommand.pmType);
            clientPm.addAttributes(attributes);
            if (serverCommand.clientSideOnly) {
                clientPm.clientSideOnly = true;
            }
            this.clientDolphin.getClientModelStore().add(clientPm, false);
            this.clientDolphin.updatePresentationModelQualifier(clientPm);
            return clientPm;
        }
    }, {
        key: 'handleValueChangedCommand',
        value: function handleValueChangedCommand(serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                ClientConnector.LOGGER.error("attribute with id " + serverCommand.attributeId + " not found, cannot update to new value " + serverCommand.newValue);
                return null;
            }
            if (clientAttribute.getValue() === serverCommand.newValue) {
                return null;
            }
            clientAttribute.setValueFromServer(serverCommand.newValue);
            return null;
        }
    }, {
        key: 'handleAttributeMetadataChangedCommand',
        value: function handleAttributeMetadataChangedCommand(serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) return null;
            clientAttribute[serverCommand.metadataName] = serverCommand.value;
            return null;
        }
    }, {
        key: 'listen',
        value: function listen() {
            if (!this.pushEnabled) return;
            if (this.waiting) return;
            // todo: how to issue a warning if no pushListener is set?
            if (!this.currentlySending) {
                this.doSendNext();
            }
        }
    }, {
        key: 'enqueuePushCommand',
        value: function enqueuePushCommand() {
            var me = this;
            this.waiting = true;
            this.commandQueue.push({
                command: this.pushListener,
                handler: {
                    onFinished: function onFinished() {
                        me.waiting = false;
                    },
                    onFinishedData: null
                }
            });
        }
    }, {
        key: 'release',
        value: function release() {
            if (!this.waiting) return;
            this.waiting = false;
            // todo: how to issue a warning if no releaseCommand is set?
            this.transmitter.signal(this.releaseCommand);
        }
    }]);

    return ClientConnector;
}();

exports.default = ClientConnector;

ClientConnector.LOGGER = _logging.LoggerFactory.getLogger('ClientConnector');

},{"./clientPresentationModel":101,"./commandBatcher":103,"./commands/codec":104,"./logging":130}],98:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ClientContextFactory = exports.createClientContext = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}(); /* Copyright 2015 Canoo Engineering AG.
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

var _constants = _dereq_('./constants');

var _openDolphin = _dereq_('./openDolphin.js');

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

var _connector = _dereq_('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _beanmanager = _dereq_('./beanmanager');

var _beanmanager2 = _interopRequireDefault(_beanmanager);

var _classrepo = _dereq_('./classrepo');

var _classrepo2 = _interopRequireDefault(_classrepo);

var _controllermanager = _dereq_('./controllermanager');

var _controllermanager2 = _interopRequireDefault(_controllermanager);

var _clientcontext = _dereq_('./clientcontext');

var _clientcontext2 = _interopRequireDefault(_clientcontext);

var _platformHttpTransmitter = _dereq_('./platformHttpTransmitter');

var _platformHttpTransmitter2 = _interopRequireDefault(_platformHttpTransmitter);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ClientContextFactory = function () {
    function ClientContextFactory() {
        _classCallCheck(this, ClientContextFactory);
    }

    _createClass(ClientContextFactory, [{
        key: 'create',
        value: function create(url, config) {
            (0, _utils.checkMethod)('connect(url, config)');
            (0, _utils.checkParam)(url, 'url');
            ClientContextFactory.LOGGER.info('Dolphin Platform Version:', _constants.DOLPHIN_PLATFORM_VERSION);
            ClientContextFactory.LOGGER.debug('Creating client context', url, config);

            var builder = (0, _openDolphin.makeDolphin)().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
            if ((0, _utils.exists)(config)) {
                if ((0, _utils.exists)(config.errorHandler)) {
                    builder.errorHandler(config.errorHandler);
                }
                if ((0, _utils.exists)(config.headersInfo) && Object.keys(config.headersInfo).length > 0) {
                    builder.headersInfo(config.headersInfo);
                }
            }

            var dolphin = builder.build();

            var transmitter = new _platformHttpTransmitter2.default(url, config);
            transmitter.on('error', function (error) {
                clientContext.emit('error', error);
            });
            dolphin.clientConnector.transmitter = transmitter;

            var classRepository = new _classrepo2.default(dolphin);
            var beanManager = new _beanmanager2.default(classRepository);
            var connector = new _connector2.default(url, dolphin, classRepository, config);
            var controllerManager = new _controllermanager2.default(dolphin, classRepository, connector);

            var clientContext = new _clientcontext2.default(dolphin, beanManager, controllerManager, connector);

            ClientContextFactory.LOGGER.debug('clientContext created with', clientContext);

            return clientContext;
        }
    }]);

    return ClientContextFactory;
}();

ClientContextFactory.LOGGER = _logging.LoggerFactory.getLogger('ClientContextFactory');

var createClientContext = new ClientContextFactory().create;

exports.createClientContext = createClientContext;
exports.ClientContextFactory = ClientContextFactory;

},{"./beanmanager":94,"./classrepo":95,"./clientcontext":102,"./connector":121,"./constants":122,"./controllermanager":123,"./logging":130,"./openDolphin.js":134,"./platformHttpTransmitter":135,"./utils":137}],99:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _clientAttribute = _dereq_('./clientAttribute');

var _clientAttribute2 = _interopRequireDefault(_clientAttribute);

var _clientPresentationModel = _dereq_('./clientPresentationModel');

var _clientPresentationModel2 = _interopRequireDefault(_clientPresentationModel);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ClientDolphin = function () {
    function ClientDolphin() {
        _classCallCheck(this, ClientDolphin);
    }

    _createClass(ClientDolphin, [{
        key: 'setClientConnector',
        value: function setClientConnector(clientConnector) {
            this.clientConnector = clientConnector;
        }
    }, {
        key: 'getClientConnector',
        value: function getClientConnector() {
            return this.clientConnector;
        }
    }, {
        key: 'send',
        value: function send(command, onFinished) {
            this.clientConnector.send(command, onFinished);
        }
    }, {
        key: 'attribute',
        value: function attribute(propertyName, qualifier, value) {
            return new _clientAttribute2.default(propertyName, qualifier, value);
        }
    }, {
        key: 'presentationModel',
        value: function presentationModel(id, type) {
            var model = new _clientPresentationModel2.default(id, type);

            for (var _len = arguments.length, attributes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                attributes[_key - 2] = arguments[_key];
            }

            if (attributes && attributes.length > 0) {
                attributes.forEach(function (attribute) {
                    model.addAttribute(attribute);
                });
            }
            this.getClientModelStore().add(model, true);
            return model;
        }
    }, {
        key: 'setClientModelStore',
        value: function setClientModelStore(clientModelStore) {
            this.clientModelStore = clientModelStore;
        }
    }, {
        key: 'getClientModelStore',
        value: function getClientModelStore() {
            return this.clientModelStore;
        }
    }, {
        key: 'listPresentationModelIds',
        value: function listPresentationModelIds() {
            return this.getClientModelStore().listPresentationModelIds();
        }
    }, {
        key: 'listPresentationModels',
        value: function listPresentationModels() {
            return this.getClientModelStore().listPresentationModels();
        }
    }, {
        key: 'findAllPresentationModelByType',
        value: function findAllPresentationModelByType(presentationModelType) {
            return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
        }
    }, {
        key: 'getAt',
        value: function getAt(id) {
            return this.findPresentationModelById(id);
        }
    }, {
        key: 'findPresentationModelById',
        value: function findPresentationModelById(id) {
            return this.getClientModelStore().findPresentationModelById(id);
        }
    }, {
        key: 'deletePresentationModel',
        value: function deletePresentationModel(modelToDelete) {
            this.getClientModelStore().deletePresentationModel(modelToDelete, true);
        }
    }, {
        key: 'updatePresentationModelQualifier',
        value: function updatePresentationModelQualifier(presentationModel) {
            var _this = this;

            presentationModel.getAttributes().forEach(function (sourceAttribute) {
                _this.updateAttributeQualifier(sourceAttribute);
            });
        }
    }, {
        key: 'updateAttributeQualifier',
        value: function updateAttributeQualifier(sourceAttribute) {
            if (!sourceAttribute.getQualifier()) return;
            var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
            attributes.forEach(function (targetAttribute) {
                targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
            });
        }
    }, {
        key: 'startPushListening',
        value: function startPushListening(pushCommand, releaseCommand) {
            var _this2 = this;

            this.clientConnector.setPushListener(pushCommand);
            this.clientConnector.setReleaseCommand(releaseCommand);
            this.clientConnector.setPushEnabled(true);

            setTimeout(function () {
                _this2.clientConnector.listen();
            }, 0);
        }
    }, {
        key: 'stopPushListening',
        value: function stopPushListening() {
            this.clientConnector.setPushEnabled(false);
        }
    }]);

    return ClientDolphin;
}();

exports.default = ClientDolphin;

},{"./clientAttribute":96,"./clientPresentationModel":101}],100:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _attribute = _dereq_('./attribute');

var _attribute2 = _interopRequireDefault(_attribute);

var _eventBus = _dereq_('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _commandFactory = _dereq_('./commands/commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _constants = _dereq_('./constants');

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ClientModelStore = function () {
    function ClientModelStore(clientDolphin) {
        _classCallCheck(this, ClientModelStore);

        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new _eventBus2.default();
    }

    _createClass(ClientModelStore, [{
        key: 'getClientDolphin',
        value: function getClientDolphin() {
            return this.clientDolphin;
        }
    }, {
        key: 'registerAttribute',
        value: function registerAttribute(attribute) {
            var _this = this;

            this.addAttributeById(attribute);
            if (attribute.getQualifier()) {
                this.addAttributeByQualifier(attribute);
            }
            // whenever an attribute changes its value, the server needs to be notified
            // and all other attributes with the same qualifier are given the same value
            attribute.onValueChange(function (evt) {
                if (evt.newValue !== evt.oldValue && evt.sendToServer === true) {
                    var command = _commandFactory2.default.createValueChangedCommand(attribute.id, evt.newValue);
                    _this.clientDolphin.getClientConnector().send(command, null);
                }

                if (attribute.getQualifier()) {
                    var attrs = _this.findAttributesByFilter(function (attr) {
                        return attr !== attribute && attr.getQualifier() === attribute.getQualifier();
                    });
                    attrs.forEach(function (attr) {
                        attr.setValue(attribute.getValue());
                    });
                }
            });
            attribute.onQualifierChange(function (evt) {
                _this.clientDolphin.getClientConnector().send(_commandFactory2.default.createChangeAttributeMetadataCommand(attribute.id, _attribute2.default.QUALIFIER_PROPERTY, evt.newValue), null);
            });
        }
    }, {
        key: 'add',
        value: function add(model) {
            var _this2 = this;

            var sendToServer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!model) {
                return false;
            }
            if (this.presentationModels.has(model.id)) {
                ClientModelStore.LOGGER.error("There already is a PM with id " + model.id);
            }
            var added = false;
            if (!this.presentationModels.has(model.id)) {
                this.presentationModels.set(model.id, model);
                this.addPresentationModelByType(model);

                if (sendToServer) {
                    var connector = this.clientDolphin.getClientConnector();
                    connector.send(_commandFactory2.default.createCreatePresentationModelCommand(model), null);
                }

                model.getAttributes().forEach(function (attribute) {
                    _this2.registerAttribute(attribute);
                });
                this.modelStoreChangeBus.trigger({ 'eventType': _constants.ADDED_TYPE, 'clientPresentationModel': model });
                added = true;
            }
            return added;
        }
    }, {
        key: 'remove',
        value: function remove(model) {
            var _this3 = this;

            if (!model) {
                return false;
            }
            var removed = false;
            if (this.presentationModels.has(model.id)) {
                this.removePresentationModelByType(model);
                this.presentationModels.delete(model.id);
                model.getAttributes().forEach(function (attribute) {
                    _this3.removeAttributeById(attribute);
                    if (attribute.getQualifier()) {
                        _this3.removeAttributeByQualifier(attribute);
                    }
                });
                this.modelStoreChangeBus.trigger({ 'eventType': _constants.REMOVED_TYPE, 'clientPresentationModel': model });
                removed = true;
            }
            return removed;
        }
    }, {
        key: 'findAttributesByFilter',
        value: function findAttributesByFilter(filter) {
            var matches = [];
            this.presentationModels.forEach(function (model) {
                model.getAttributes().forEach(function (attr) {
                    if (filter(attr)) {
                        matches.push(attr);
                    }
                });
            });
            return matches;
        }
    }, {
        key: 'addPresentationModelByType',
        value: function addPresentationModelByType(model) {
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
    }, {
        key: 'removePresentationModelByType',
        value: function removePresentationModelByType(model) {
            if (!model || !model.presentationModelType) {
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
    }, {
        key: 'listPresentationModelIds',
        value: function listPresentationModelIds() {
            var result = [];
            var iter = this.presentationModels.keys();
            var next = iter.next();
            while (!next.done) {
                result.push(next.value);
                next = iter.next();
            }
            return result;
        }
    }, {
        key: 'listPresentationModels',
        value: function listPresentationModels() {
            var result = [];
            var iter = this.presentationModels.values();
            var next = iter.next();
            while (!next.done) {
                result.push(next.value);
                next = iter.next();
            }
            return result;
        }
    }, {
        key: 'findPresentationModelById',
        value: function findPresentationModelById(id) {
            return this.presentationModels.get(id);
        }
    }, {
        key: 'findAllPresentationModelByType',
        value: function findAllPresentationModelByType(type) {
            if (!type || !this.presentationModelsPerType.has(type)) {
                return [];
            }
            return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
        }
    }, {
        key: 'deletePresentationModel',
        value: function deletePresentationModel(model, notify) {
            if (!model) {
                return;
            }
            if (this.containsPresentationModel(model.id)) {
                this.remove(model);
                if (!notify || model.clientSideOnly) {
                    return;
                }
                this.clientDolphin.getClientConnector().send(_commandFactory2.default.createPresentationModelDeletedCommand(model.id), null);
            }
        }
    }, {
        key: 'containsPresentationModel',
        value: function containsPresentationModel(id) {
            return this.presentationModels.has(id);
        }
    }, {
        key: 'addAttributeById',
        value: function addAttributeById(attribute) {
            if (!attribute || this.attributesPerId.has(attribute.id)) {
                return;
            }
            this.attributesPerId.set(attribute.id, attribute);
        }
    }, {
        key: 'removeAttributeById',
        value: function removeAttributeById(attribute) {
            if (!attribute || !this.attributesPerId.has(attribute.id)) {
                return;
            }
            this.attributesPerId.delete(attribute.id);
        }
    }, {
        key: 'findAttributeById',
        value: function findAttributeById(id) {
            return this.attributesPerId.get(id);
        }
    }, {
        key: 'addAttributeByQualifier',
        value: function addAttributeByQualifier(attribute) {
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
    }, {
        key: 'removeAttributeByQualifier',
        value: function removeAttributeByQualifier(attribute) {
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
    }, {
        key: 'findAllAttributesByQualifier',
        value: function findAllAttributesByQualifier(qualifier) {
            if (!qualifier || !this.attributesPerQualifier.has(qualifier)) {
                return [];
            }
            return this.attributesPerQualifier.get(qualifier).slice(0); // slice is used to clone the array
        }
    }, {
        key: 'onModelStoreChange',
        value: function onModelStoreChange(eventHandler) {
            this.modelStoreChangeBus.onEvent(eventHandler);
        }
    }, {
        key: 'onModelStoreChangeForType',
        value: function onModelStoreChangeForType(presentationModelType, eventHandler) {
            this.modelStoreChangeBus.onEvent(function (pmStoreEvent) {
                if (pmStoreEvent.clientPresentationModel.presentationModelType == presentationModelType) {
                    eventHandler(pmStoreEvent);
                }
            });
        }
    }]);

    return ClientModelStore;
}();

exports.default = ClientModelStore;

ClientModelStore.LOGGER = _logging.LoggerFactory.getLogger('ClientModelStore');

},{"./attribute":93,"./commands/commandFactory":107,"./constants":122,"./eventBus":127,"./logging":130}],101:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventBus = _dereq_('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var presentationModelInstanceCount = 0; // todo dk: consider making this static in class

var ClientPresentationModel = function () {
    function ClientPresentationModel(id, presentationModelType) {
        _classCallCheck(this, ClientPresentationModel);

        this.id = id;
        this.presentationModelType = presentationModelType;
        this.attributes = [];
        this.clientSideOnly = false;
        this.dirty = false;
        if (typeof id !== 'undefined' && id != null) {
            this.id = id;
        } else {
            this.id = (presentationModelInstanceCount++).toString();
        }
        this.invalidBus = new _eventBus2.default();
        this.dirtyValueChangeBus = new _eventBus2.default();
    }
    // todo dk: align with Java version: move to ClientDolphin and auto-add to model store
    /** a copy constructor for anything but IDs. Per default, copies are client side only, no automatic update applies. */

    _createClass(ClientPresentationModel, [{
        key: 'copy',
        value: function copy() {
            var result = new ClientPresentationModel(null, this.presentationModelType);
            result.clientSideOnly = true;
            this.getAttributes().forEach(function (attribute) {
                var attributeCopy = attribute.copy();
                result.addAttribute(attributeCopy);
            });
            return result;
        }
        //add array of attributes

    }, {
        key: 'addAttributes',
        value: function addAttributes(attributes) {
            var _this = this;

            if (!attributes || attributes.length < 1) return;
            attributes.forEach(function (attr) {
                _this.addAttribute(attr);
            });
        }
    }, {
        key: 'addAttribute',
        value: function addAttribute(attribute) {
            var _this2 = this;

            if (!attribute || this.attributes.indexOf(attribute) > -1) {
                return;
            }
            if (this.findAttributeByPropertyName(attribute.propertyName)) {
                throw new Error("There already is an attribute with property name: " + attribute.propertyName + " in presentation model with id: " + this.id);
            }
            if (attribute.getQualifier() && this.findAttributeByQualifier(attribute.getQualifier())) {
                throw new Error("There already is an attribute with qualifier: " + attribute.getQualifier() + " in presentation model with id: " + this.id);
            }
            attribute.setPresentationModel(this);
            this.attributes.push(attribute);
            attribute.onValueChange(function () {
                _this2.invalidBus.trigger({ source: _this2 });
            });
        }
    }, {
        key: 'onInvalidated',
        value: function onInvalidated(handleInvalidate) {
            this.invalidBus.onEvent(handleInvalidate);
        }
        /** returns a copy of the internal state */

    }, {
        key: 'getAttributes',
        value: function getAttributes() {
            return this.attributes.slice(0);
        }
    }, {
        key: 'getAt',
        value: function getAt(propertyName) {
            return this.findAttributeByPropertyName(propertyName);
        }
    }, {
        key: 'findAllAttributesByPropertyName',
        value: function findAllAttributesByPropertyName(propertyName) {
            var result = [];
            if (!propertyName) return null;
            this.attributes.forEach(function (attribute) {
                if (attribute.propertyName == propertyName) {
                    result.push(attribute);
                }
            });
            return result;
        }
    }, {
        key: 'findAttributeByPropertyName',
        value: function findAttributeByPropertyName(propertyName) {
            if (!propertyName) return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].propertyName == propertyName) {
                    return this.attributes[i];
                }
            }
            return null;
        }
    }, {
        key: 'findAttributeByQualifier',
        value: function findAttributeByQualifier(qualifier) {
            if (!qualifier) return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].getQualifier() == qualifier) {
                    return this.attributes[i];
                }
            }
            return null;
        }
    }, {
        key: 'findAttributeById',
        value: function findAttributeById(id) {
            if (!id) return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].id == id) {
                    return this.attributes[i];
                }
            }
            return null;
        }
    }, {
        key: 'syncWith',
        value: function syncWith(sourcePresentationModel) {
            this.attributes.forEach(function (targetAttribute) {
                var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName);
                if (sourceAttribute) {
                    targetAttribute.syncWith(sourceAttribute);
                }
            });
        }
    }]);

    return ClientPresentationModel;
}();

exports.default = ClientPresentationModel;

},{"./eventBus":127}],102:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _promise = _dereq_('core-js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _commandFactory = _dereq_('./commands/commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _utils = _dereq_('./utils');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ClientContext = function () {
    function ClientContext(dolphin, beanManager, controllerManager, connector) {
        _classCallCheck(this, ClientContext);

        (0, _utils.checkMethod)('ClientContext(dolphin, beanManager, controllerManager, connector)');
        (0, _utils.checkParam)(dolphin, 'dolphin');
        (0, _utils.checkParam)(beanManager, 'beanManager');
        (0, _utils.checkParam)(controllerManager, 'controllerManager');
        (0, _utils.checkParam)(connector, 'connector');

        this.dolphin = dolphin;
        this.beanManager = beanManager;
        this._controllerManager = controllerManager;
        this._connector = connector;
        this.connectionPromise = null;
        this.isConnected = false;
    }

    _createClass(ClientContext, [{
        key: 'connect',
        value: function connect() {
            var self = this;
            this.connectionPromise = new _promise2.default(function (resolve) {
                self._connector.connect();
                self._connector.invoke(_commandFactory2.default.createCreateContextCommand()).then(function () {
                    self.isConnected = true;
                    resolve();
                });
            });
            return this.connectionPromise;
        }
    }, {
        key: 'onConnect',
        value: function onConnect() {
            if ((0, _utils.exists)(this.connectionPromise)) {
                if (!this.isConnected) {
                    return this.connectionPromise;
                } else {
                    return new _promise2.default(function (resolve) {
                        resolve();
                    });
                }
            } else {
                return this.connect();
            }
        }
    }, {
        key: 'createController',
        value: function createController(name) {
            (0, _utils.checkMethod)('ClientContext.createController(name)');
            (0, _utils.checkParam)(name, 'name');

            return this._controllerManager.createController(name);
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            var self = this;
            this.dolphin.stopPushListening();
            return new _promise2.default(function (resolve) {
                self._controllerManager.destroy().then(function () {
                    self._connector.invoke(_commandFactory2.default.createDestroyContextCommand());
                    self.dolphin = null;
                    self.beanManager = null;
                    self._controllerManager = null;
                    self._connector = null;
                    resolve();
                });
            });
        }
    }]);

    return ClientContext;
}();

exports.default = ClientContext;

(0, _emitterComponent2.default)(ClientContext.prototype);

},{"./commands/commandFactory":107,"./utils":137,"core-js/library/fn/promise":2,"emitter-component":92}],103:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('./commands/commandConstants');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var BlindCommandBatcher = function () {
    function BlindCommandBatcher() {
        var folding = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var maxBatchSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

        _classCallCheck(this, BlindCommandBatcher);

        this.folding = folding;
        this.maxBatchSize = maxBatchSize;
    }

    _createClass(BlindCommandBatcher, [{
        key: 'batch',
        value: function batch(queue) {
            var batch = [];
            var batchLength = 0;
            while (queue[batchLength] && batchLength <= this.maxBatchSize) {
                var element = queue[batchLength];
                batchLength++;
                if (this.folding) {
                    if (element.command.id == _commandConstants.VALUE_CHANGED_COMMAND_ID && batch.length > 0 && batch[batch.length - 1].command.id == _commandConstants.VALUE_CHANGED_COMMAND_ID && element.command.attributeId == batch[batch.length - 1].command.attributeId) {
                        //merge ValueChange for same value
                        batch[batch.length - 1].command.newValue = element.command.newValue;
                    } else if (element.command.id == _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID) {
                        //We do not need it...
                    } else {
                        batch.push(element);
                    }
                } else {
                    batch.push(element);
                }
                if (element.handler) {
                    break;
                }
            }
            queue.splice(0, batchLength);
            return batch;
        }
    }]);

    return BlindCommandBatcher;
}();

exports.default = BlindCommandBatcher;

},{"./commands/commandConstants":106}],104:[function(_dereq_,module,exports){
'use strict';

var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
};

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _utils = _dereq_('../utils');

var _constants = _dereq_('../constants');

var _commandConstants = _dereq_('./commandConstants');

var _valueChangedCommand = _dereq_('./impl/valueChangedCommand');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

var _attributeMetadataChangedCommand = _dereq_('./impl/attributeMetadataChangedCommand');

var _attributeMetadataChangedCommand2 = _interopRequireDefault(_attributeMetadataChangedCommand);

var _callActionCommand = _dereq_('./impl/callActionCommand');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

var _changeAttributeMetadataCommand = _dereq_('./impl/changeAttributeMetadataCommand');

var _changeAttributeMetadataCommand2 = _interopRequireDefault(_changeAttributeMetadataCommand);

var _createContextCommand = _dereq_('./impl/createContextCommand');

var _createContextCommand2 = _interopRequireDefault(_createContextCommand);

var _createControllerCommand = _dereq_('./impl/createControllerCommand');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _createPresentationModelCommand = _dereq_('./impl/createPresentationModelCommand');

var _createPresentationModelCommand2 = _interopRequireDefault(_createPresentationModelCommand);

var _deletePresentationModelCommand = _dereq_('./impl/deletePresentationModelCommand');

var _deletePresentationModelCommand2 = _interopRequireDefault(_deletePresentationModelCommand);

var _destroyContextCommand = _dereq_('./impl/destroyContextCommand');

var _destroyContextCommand2 = _interopRequireDefault(_destroyContextCommand);

var _destroyControllerCommand = _dereq_('./impl/destroyControllerCommand');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _interruptLongPollCommand = _dereq_('./impl/interruptLongPollCommand');

var _interruptLongPollCommand2 = _interopRequireDefault(_interruptLongPollCommand);

var _presentationModelDeletedCommand = _dereq_('./impl/presentationModelDeletedCommand');

var _presentationModelDeletedCommand2 = _interopRequireDefault(_presentationModelDeletedCommand);

var _startLongPollCommand = _dereq_('./impl/startLongPollCommand');

var _startLongPollCommand2 = _interopRequireDefault(_startLongPollCommand);

var _codecError = _dereq_('./codecError');

var _codecError2 = _interopRequireDefault(_codecError);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Codec = function () {
    function Codec() {
        _classCallCheck(this, Codec);
    }

    _createClass(Codec, null, [{
        key: '_encodeAttributeMetadataChangedCommand',
        value: function _encodeAttributeMetadataChangedCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeAttributeMetadataChangedCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.attributeId, "command.attributeId");
            (0, _utils.checkParam)(command.metadataName, "command.metadataName");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;
            jsonCommand[_commandConstants.ATTRIBUTE_ID] = command.attributeId;
            jsonCommand[_commandConstants.NAME] = command.metadataName;
            jsonCommand[_commandConstants.VALUE] = command.value;
            return jsonCommand;
        }
    }, {
        key: '_decodeAttributeMetadataChangedCommand',
        value: function _decodeAttributeMetadataChangedCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeAttributeMetadataChangedCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");

            var command = new _attributeMetadataChangedCommand2.default();
            command.attributeId = jsonCommand[_commandConstants.ATTRIBUTE_ID];
            command.metadataName = jsonCommand[_commandConstants.NAME];
            command.value = jsonCommand[_commandConstants.VALUE];
            return command;
        }
    }, {
        key: '_encodeCallActionCommand',
        value: function _encodeCallActionCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeCallActionCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.controllerid, "command.controllerid");
            (0, _utils.checkParam)(command.actionName, "command.actionName");
            (0, _utils.checkParam)(command.params, "command.params");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CALL_ACTION_COMMAND_ID;
            jsonCommand[_commandConstants.CONTROLLER_ID] = command.controllerid;
            jsonCommand[_commandConstants.NAME] = command.actionName;
            jsonCommand[_commandConstants.PARAMS] = command.params.map(function (param) {
                var result = {};
                result[_commandConstants.NAME] = param.name;
                if ((0, _utils.exists)(param.value)) {
                    result[_commandConstants.VALUE] = param.value;
                }
                return result;
            });
            return jsonCommand;
        }
    }, {
        key: '_decodeCallActionCommand',
        value: function _decodeCallActionCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeCallActionCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PARAMS], "jsonCommand[PARAMS]");

            var command = new _callActionCommand2.default();
            command.controllerid = jsonCommand[_commandConstants.CONTROLLER_ID];
            command.actionName = jsonCommand[_commandConstants.NAME];
            //TODO: Für die Params sollten wir eine Klasse bereitstellen
            command.params = jsonCommand[_commandConstants.PARAMS].map(function (param) {
                return {
                    'name': param[_commandConstants.NAME],
                    'value': (0, _utils.exists)(param[_commandConstants.VALUE]) ? param[_commandConstants.VALUE] : null
                };
            });
            return command;
        }
    }, {
        key: '_encodeChangeAttributeMetadataCommand',
        value: function _encodeChangeAttributeMetadataCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeChangeAttributeMetadataCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.attributeId, "command.attributeId");
            (0, _utils.checkParam)(command.metadataName, "command.metadataName");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID;
            jsonCommand[_commandConstants.ATTRIBUTE_ID] = command.attributeId;
            jsonCommand[_commandConstants.NAME] = command.metadataName;
            jsonCommand[_commandConstants.VALUE] = command.value;
            return jsonCommand;
        }
    }, {
        key: '_decodeChangeAttributeMetadataCommand',
        value: function _decodeChangeAttributeMetadataCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeChangeAttributeMetadataCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");

            var command = new _changeAttributeMetadataCommand2.default();
            command.attributeId = jsonCommand[_commandConstants.ATTRIBUTE_ID];
            command.metadataName = jsonCommand[_commandConstants.NAME];
            command.value = jsonCommand[_commandConstants.VALUE];
            return command;
        }
    }, {
        key: '_encodeCreateContextCommand',
        value: function _encodeCreateContextCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeCreateContextCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CREATE_CONTEXT_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeCreateContextCommand',
        value: function _decodeCreateContextCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeCreateContextCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _createContextCommand2.default();
            return command;
        }
    }, {
        key: '_encodeCreateControllerCommand',
        value: function _encodeCreateControllerCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeCreateControllerCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.controllerName, "command.controllerName");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CREATE_CONTROLLER_COMMAND_ID;
            jsonCommand[_commandConstants.NAME] = command.controllerName;
            jsonCommand[_commandConstants.CONTROLLER_ID] = command.parentControllerId;
            return jsonCommand;
        }
    }, {
        key: '_decodeCreateControllerCommand',
        value: function _decodeCreateControllerCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeCreateControllerCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.NAME], "jsonCommand[NAME]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");

            var command = new _createControllerCommand2.default();
            command.controllerName = jsonCommand[_commandConstants.NAME];
            command.parentControllerId = jsonCommand[_commandConstants.CONTROLLER_ID];
            return command;
        }
    }, {
        key: '_encodeCreatePresentationModelCommand',
        value: function _encodeCreatePresentationModelCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeCreatePresentationModelCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.pmId, "command.pmId");
            (0, _utils.checkParam)(command.pmType, "command.pmType");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID;
            jsonCommand[_commandConstants.PM_ID] = command.pmId;
            jsonCommand[_commandConstants.PM_TYPE] = command.pmType;
            jsonCommand[_commandConstants.PM_ATTRIBUTES] = command.attributes.map(function (attribute) {
                var result = {};
                result[_commandConstants.NAME] = attribute.propertyName;
                result[_commandConstants.ATTRIBUTE_ID] = attribute.id;
                if ((0, _utils.exists)(attribute.value)) {
                    result[_commandConstants.VALUE] = attribute.value;
                }
                return result;
            });
            return jsonCommand;
        }
    }, {
        key: '_decodeCreatePresentationModelCommand',
        value: function _decodeCreatePresentationModelCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeCreatePresentationModelCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_ID], "jsonCommand[PM_ID]");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_TYPE], "jsonCommand[PM_TYPE]");

            var command = new _createPresentationModelCommand2.default();
            command.pmId = jsonCommand[_commandConstants.PM_ID];
            command.pmType = jsonCommand[_commandConstants.PM_TYPE];

            //TODO: Für die Attribute sollten wir eine Klasse bereitstellen
            command.attributes = jsonCommand[_commandConstants.PM_ATTRIBUTES].map(function (attribute) {
                return {
                    'propertyName': attribute[_commandConstants.NAME],
                    'id': attribute[_commandConstants.ATTRIBUTE_ID],
                    'value': (0, _utils.exists)(attribute[_commandConstants.VALUE]) ? attribute[_commandConstants.VALUE] : null
                };
            });
            return command;
        }
    }, {
        key: '_encodeDeletePresentationModelCommand',
        value: function _encodeDeletePresentationModelCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeDeletePresentationModelCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.pmId, "command.pmId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID;
            jsonCommand[_commandConstants.PM_ID] = command.pmId;
            return jsonCommand;
        }
    }, {
        key: '_decodeDeletePresentationModelCommand',
        value: function _decodeDeletePresentationModelCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeDeletePresentationModelCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_ID], "jsonCommand[PM_ID]");

            var command = new _deletePresentationModelCommand2.default();
            command.pmId = jsonCommand[_commandConstants.PM_ID];
            return command;
        }
    }, {
        key: '_encodeDestroyContextCommand',
        value: function _encodeDestroyContextCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeDestroyContextCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.DESTROY_CONTEXT_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeDestroyContextCommand',
        value: function _decodeDestroyContextCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeDestroyContextCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _destroyContextCommand2.default();
            return command;
        }
    }, {
        key: '_encodeDestroyControllerCommand',
        value: function _encodeDestroyControllerCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeDestroyControllerCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.controllerId, "command.controllerId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.DESTROY_CONTROLLER_COMMAND_ID;
            jsonCommand[_commandConstants.CONTROLLER_ID] = command.controllerId;
            return jsonCommand;
        }
    }, {
        key: '_decodeDestroyControllerCommand',
        value: function _decodeDestroyControllerCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeDestroyControllerCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.CONTROLLER_ID], "jsonCommand[CONTROLLER_ID]");

            var command = new _destroyControllerCommand2.default();
            command.controllerId = jsonCommand[_commandConstants.CONTROLLER_ID];
            return command;
        }
    }, {
        key: '_encodeInterruptLongPollCommand',
        value: function _encodeInterruptLongPollCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeInterruptLongPollCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeInterruptLongPollCommand',
        value: function _decodeInterruptLongPollCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeInterruptLongPollCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _interruptLongPollCommand2.default();
            return command;
        }
    }, {
        key: '_encodePresentationModelDeletedCommand',
        value: function _encodePresentationModelDeletedCommand(command) {
            (0, _utils.checkMethod)("Codec._encodePresentationModelDeletedCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.pmId, "command.pmId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID;
            jsonCommand[_commandConstants.PM_ID] = command.pmId;
            return jsonCommand;
        }
    }, {
        key: '_decodePresentationModelDeletedCommand',
        value: function _decodePresentationModelDeletedCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodePresentationModelDeletedCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.PM_ID], "jsonCommand[PM_ID]");

            var command = new _presentationModelDeletedCommand2.default();
            command.pmId = jsonCommand[_commandConstants.PM_ID];
            return command;
        }
    }, {
        key: '_encodeStartLongPollCommand',
        value: function _encodeStartLongPollCommand(command) {
            (0, _utils.checkMethod)("Codec._encodeStartLongPollCommand");
            (0, _utils.checkParam)(command, "command");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.START_LONG_POLL_COMMAND_ID;
            return jsonCommand;
        }
    }, {
        key: '_decodeStartLongPollCommand',
        value: function _decodeStartLongPollCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec._decodeStartLongPollCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");

            var command = new _startLongPollCommand2.default();
            return command;
        }
    }, {
        key: '_encodeValueChangedCommand',
        value: function _encodeValueChangedCommand(command) {
            (0, _utils.checkMethod)("Codec.encodeValueChangedCommand");
            (0, _utils.checkParam)(command, "command");
            (0, _utils.checkParam)(command.attributeId, "command.attributeId");

            var jsonCommand = {};
            jsonCommand[_commandConstants.ID] = _commandConstants.VALUE_CHANGED_COMMAND_ID;
            jsonCommand[_commandConstants.ATTRIBUTE_ID] = command.attributeId;
            if ((0, _utils.exists)(command.newValue)) {
                jsonCommand[_commandConstants.VALUE] = command.newValue;
            }
            return jsonCommand;
        }
    }, {
        key: '_decodeValueChangedCommand',
        value: function _decodeValueChangedCommand(jsonCommand) {
            (0, _utils.checkMethod)("Codec.decodeValueChangedCommand");
            (0, _utils.checkParam)(jsonCommand, "jsonCommand");
            (0, _utils.checkParam)(jsonCommand[_commandConstants.ATTRIBUTE_ID], "jsonCommand[ATTRIBUTE_ID]");

            var command = new _valueChangedCommand2.default();
            command.attributeId = jsonCommand[_commandConstants.ATTRIBUTE_ID];
            if ((0, _utils.exists)(jsonCommand[_commandConstants.VALUE])) {
                command.newValue = jsonCommand[_commandConstants.VALUE];
            } else {
                command.newValue = null;
            }
            return command;
        }
    }, {
        key: 'encode',
        value: function encode(commands) {
            (0, _utils.checkMethod)("Codec.encode");
            (0, _utils.checkParam)(commands, "commands");

            var self = this;
            return JSON.stringify(commands.map(function (command) {
                if (command.id === _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID) {
                    return self._encodeAttributeMetadataChangedCommand(command);
                } else if (command.id === _commandConstants.CALL_ACTION_COMMAND_ID) {
                    return self._encodeCallActionCommand(command);
                } else if (command.id === _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID) {
                    return self._encodeChangeAttributeMetadataCommand(command);
                } else if (command.id === _commandConstants.CREATE_CONTEXT_COMMAND_ID) {
                    return self._encodeCreateContextCommand(command);
                } else if (command.id === _commandConstants.CREATE_CONTROLLER_COMMAND_ID) {
                    return self._encodeCreateControllerCommand(command);
                } else if (command.id === _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID) {
                    return self._encodeCreatePresentationModelCommand(command);
                } else if (command.id === _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID) {
                    return self._encodeDeletePresentationModelCommand(command);
                } else if (command.id === _commandConstants.DESTROY_CONTEXT_COMMAND_ID) {
                    return self._encodeDestroyContextCommand(command);
                } else if (command.id === _commandConstants.DESTROY_CONTROLLER_COMMAND_ID) {
                    return self._encodeDestroyControllerCommand(command);
                } else if (command.id === _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID) {
                    return self._encodeInterruptLongPollCommand(command);
                } else if (command.id === _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID) {
                    return self._encodePresentationModelDeletedCommand(command);
                } else if (command.id === _commandConstants.START_LONG_POLL_COMMAND_ID) {
                    return self._encodeStartLongPollCommand(command);
                } else if (command.id === _commandConstants.VALUE_CHANGED_COMMAND_ID) {
                    return self._encodeValueChangedCommand(command);
                } else {
                    throw new _codecError2.default('Command of type ' + command.id + ' can not be handled');
                }
            }));
        }
    }, {
        key: 'decode',
        value: function decode(transmitted) {
            (0, _utils.checkMethod)("Codec.decode");
            (0, _utils.checkParam)(transmitted, "transmitted");

            if ((typeof transmitted === 'undefined' ? 'undefined' : _typeof(transmitted)) === _constants.JS_STRING_TYPE) {
                var self = this;
                return JSON.parse(transmitted).map(function (command) {
                    if (command.id === _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID) {
                        return self._decodeAttributeMetadataChangedCommand(command);
                    } else if (command.id === _commandConstants.CALL_ACTION_COMMAND_ID) {
                        return self._decodeCallActionCommand(command);
                    } else if (command.id === _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID) {
                        return self._decodeChangeAttributeMetadataCommand(command);
                    } else if (command.id === _commandConstants.CREATE_CONTEXT_COMMAND_ID) {
                        return self._decodeCreateContextCommand(command);
                    } else if (command.id === _commandConstants.CREATE_CONTROLLER_COMMAND_ID) {
                        return self._decodeCreateControllerCommand(command);
                    } else if (command.id === _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID) {
                        return self._decodeCreatePresentationModelCommand(command);
                    } else if (command.id === _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID) {
                        return self._decodeDeletePresentationModelCommand(command);
                    } else if (command.id === _commandConstants.DESTROY_CONTEXT_COMMAND_ID) {
                        return self._decodeDestroyContextCommand(command);
                    } else if (command.id === _commandConstants.DESTROY_CONTROLLER_COMMAND_ID) {
                        return self._decodeDestroyControllerCommand(command);
                    } else if (command.id === _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID) {
                        return self._decodeInterruptLongPollCommand(command);
                    } else if (command.id === _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID) {
                        return self._decodePresentationModelDeletedCommand(command);
                    } else if (command.id === _commandConstants.START_LONG_POLL_COMMAND_ID) {
                        return self._decodeStartLongPollCommand(command);
                    } else if (command.id === _commandConstants.VALUE_CHANGED_COMMAND_ID) {
                        return self._decodeValueChangedCommand(command);
                    } else {
                        throw new _codecError2.default('Command of type ' + command.id + ' can not be handled');
                    }
                });
            } else {
                throw new _codecError2.default('Can not decode data that is not of type string');
            }
        }
    }]);

    return Codec;
}();

exports.default = Codec;

},{"../constants":122,"../utils":137,"./codecError":105,"./commandConstants":106,"./impl/attributeMetadataChangedCommand":108,"./impl/callActionCommand":109,"./impl/changeAttributeMetadataCommand":110,"./impl/createContextCommand":111,"./impl/createControllerCommand":112,"./impl/createPresentationModelCommand":113,"./impl/deletePresentationModelCommand":114,"./impl/destroyContextCommand":115,"./impl/destroyControllerCommand":116,"./impl/interruptLongPollCommand":117,"./impl/presentationModelDeletedCommand":118,"./impl/startLongPollCommand":119,"./impl/valueChangedCommand":120}],105:[function(_dereq_,module,exports){
"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var CodecError = function (_Error) {
    _inherits(CodecError, _Error);

    function CodecError(message) {
        _classCallCheck(this, CodecError);

        return _possibleConstructorReturn(this, (CodecError.__proto__ || Object.getPrototypeOf(CodecError)).call(this, message));
    }

    return CodecError;
}(Error);

exports.default = CodecError;

},{}],106:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ATTRIBUTE_METADATA_CHANGED_COMMAND_ID = exports.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID = 'AttributeMetadataChanged';
var CALL_ACTION_COMMAND_ID = exports.CALL_ACTION_COMMAND_ID = 'CallAction';
var CHANGE_ATTRIBUTE_METADATA_COMMAND_ID = exports.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID = 'ChangeAttributeMetadata';
var CREATE_CONTEXT_COMMAND_ID = exports.CREATE_CONTEXT_COMMAND_ID = 'CreateContext';
var CREATE_CONTROLLER_COMMAND_ID = exports.CREATE_CONTROLLER_COMMAND_ID = 'CreateController';
var CREATE_PRESENTATION_MODEL_COMMAND_ID = exports.CREATE_PRESENTATION_MODEL_COMMAND_ID = 'CreatePresentationModel';
var DELETE_PRESENTATION_MODEL_COMMAND_ID = exports.DELETE_PRESENTATION_MODEL_COMMAND_ID = 'DeletePresentationModel';
var DESTROY_CONTEXT_COMMAND_ID = exports.DESTROY_CONTEXT_COMMAND_ID = 'DestroyContext';
var DESTROY_CONTROLLER_COMMAND_ID = exports.DESTROY_CONTROLLER_COMMAND_ID = 'DestroyController';
var INTERRUPT_LONG_POLL_COMMAND_ID = exports.INTERRUPT_LONG_POLL_COMMAND_ID = 'InterruptLongPoll';
var PRESENTATION_MODEL_DELETED_COMMAND_ID = exports.PRESENTATION_MODEL_DELETED_COMMAND_ID = 'PresentationModelDeleted';
var START_LONG_POLL_COMMAND_ID = exports.START_LONG_POLL_COMMAND_ID = 'StartLongPoll';
var VALUE_CHANGED_COMMAND_ID = exports.VALUE_CHANGED_COMMAND_ID = 'ValueChanged';

var ID = exports.ID = "id";
var ATTRIBUTE_ID = exports.ATTRIBUTE_ID = "a_id";
var PM_ID = exports.PM_ID = "p_id";
var CONTROLLER_ID = exports.CONTROLLER_ID = "c_id";
var PM_TYPE = exports.PM_TYPE = "t";
var NAME = exports.NAME = "n";
var VALUE = exports.VALUE = "v";
var PARAMS = exports.PARAMS = "p";
var PM_ATTRIBUTES = exports.PM_ATTRIBUTES = "a";

},{}],107:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _createContextCommand = _dereq_('./impl/createContextCommand');

var _createContextCommand2 = _interopRequireDefault(_createContextCommand);

var _createControllerCommand = _dereq_('./impl/createControllerCommand');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _callActionCommand = _dereq_('./impl/callActionCommand');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

var _destroyControllerCommand = _dereq_('./impl/destroyControllerCommand');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _destroyContextCommand = _dereq_('./impl/destroyContextCommand');

var _destroyContextCommand2 = _interopRequireDefault(_destroyContextCommand);

var _startLongPollCommand = _dereq_('./impl/startLongPollCommand');

var _startLongPollCommand2 = _interopRequireDefault(_startLongPollCommand);

var _interruptLongPollCommand = _dereq_('./impl/interruptLongPollCommand');

var _interruptLongPollCommand2 = _interopRequireDefault(_interruptLongPollCommand);

var _createPresentationModelCommand = _dereq_('./impl/createPresentationModelCommand');

var _createPresentationModelCommand2 = _interopRequireDefault(_createPresentationModelCommand);

var _deletePresentationModelCommand = _dereq_('./impl/deletePresentationModelCommand');

var _deletePresentationModelCommand2 = _interopRequireDefault(_deletePresentationModelCommand);

var _presentationModelDeletedCommand = _dereq_('./impl/presentationModelDeletedCommand');

var _presentationModelDeletedCommand2 = _interopRequireDefault(_presentationModelDeletedCommand);

var _valueChangedCommand = _dereq_('./impl/valueChangedCommand');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

var _changeAttributeMetadataCommand = _dereq_('./impl/changeAttributeMetadataCommand');

var _changeAttributeMetadataCommand2 = _interopRequireDefault(_changeAttributeMetadataCommand);

var _attributeMetadataChangedCommand = _dereq_('./impl/attributeMetadataChangedCommand');

var _attributeMetadataChangedCommand2 = _interopRequireDefault(_attributeMetadataChangedCommand);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CommandFactory = function () {
    function CommandFactory() {
        _classCallCheck(this, CommandFactory);
    }

    _createClass(CommandFactory, null, [{
        key: 'createCreateContextCommand',
        value: function createCreateContextCommand() {
            return new _createContextCommand2.default();
        }
    }, {
        key: 'createCreateControllerCommand',
        value: function createCreateControllerCommand(controllerName, parentControllerId) {
            var command = new _createControllerCommand2.default();
            command.init(controllerName, parentControllerId);
            return command;
        }
    }, {
        key: 'createCallActionCommand',
        value: function createCallActionCommand(controllerid, actionName, params) {
            var command = new _callActionCommand2.default();
            command.init(controllerid, actionName, params);
            return command;
        }
    }, {
        key: 'createDestroyControllerCommand',
        value: function createDestroyControllerCommand(controllerId) {
            var command = new _destroyControllerCommand2.default();
            command.init(controllerId);
            return command;
        }
    }, {
        key: 'createDestroyContextCommand',
        value: function createDestroyContextCommand() {
            return new _destroyContextCommand2.default();
        }
    }, {
        key: 'createStartLongPollCommand',
        value: function createStartLongPollCommand() {
            return new _startLongPollCommand2.default();
        }
    }, {
        key: 'createInterruptLongPollCommand',
        value: function createInterruptLongPollCommand() {
            return new _interruptLongPollCommand2.default();
        }
    }, {
        key: 'createCreatePresentationModelCommand',
        value: function createCreatePresentationModelCommand(presentationModel) {
            var command = new _createPresentationModelCommand2.default();
            command.init(presentationModel);
            return command;
        }
    }, {
        key: 'createDeletePresentationModelCommand',
        value: function createDeletePresentationModelCommand(pmId) {
            var command = new _deletePresentationModelCommand2.default();
            command.init(pmId);
            return command;
        }
    }, {
        key: 'createPresentationModelDeletedCommand',
        value: function createPresentationModelDeletedCommand(pmId) {
            var command = new _presentationModelDeletedCommand2.default();
            command.init(pmId);
            return command;
        }
    }, {
        key: 'createValueChangedCommand',
        value: function createValueChangedCommand(attributeId, newValue) {
            var command = new _valueChangedCommand2.default();
            command.init(attributeId, newValue);
            return command;
        }
    }, {
        key: 'createChangeAttributeMetadataCommand',
        value: function createChangeAttributeMetadataCommand(attributeId, metadataName, value) {
            var command = new _changeAttributeMetadataCommand2.default();
            command.init(attributeId, metadataName, value);
            return command;
        }
    }, {
        key: 'createAttributeMetadataChangedCommand',
        value: function createAttributeMetadataChangedCommand(attributeId, metadataName, value) {
            var command = new _attributeMetadataChangedCommand2.default();
            command.init(attributeId, metadataName, value);
            return command;
        }
    }]);

    return CommandFactory;
}();

exports.default = CommandFactory;

},{"./impl/attributeMetadataChangedCommand":108,"./impl/callActionCommand":109,"./impl/changeAttributeMetadataCommand":110,"./impl/createContextCommand":111,"./impl/createControllerCommand":112,"./impl/createPresentationModelCommand":113,"./impl/deletePresentationModelCommand":114,"./impl/destroyContextCommand":115,"./impl/destroyControllerCommand":116,"./impl/interruptLongPollCommand":117,"./impl/presentationModelDeletedCommand":118,"./impl/startLongPollCommand":119,"./impl/valueChangedCommand":120}],108:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var AttributeMetadataChangedCommand = function () {
    function AttributeMetadataChangedCommand() {
        _classCallCheck(this, AttributeMetadataChangedCommand);

        this.id = _commandConstants.ATTRIBUTE_METADATA_CHANGED_COMMAND_ID;
    }

    _createClass(AttributeMetadataChangedCommand, [{
        key: 'init',
        value: function init(attributeId, metadataName, value) {
            (0, _utils.checkMethod)('AttributeMetadataChangedCommand.init()');
            (0, _utils.checkParam)(attributeId, 'attributeId');
            (0, _utils.checkParam)(metadataName, 'metadataName');

            this.attributeId = attributeId;
            this.metadataName = metadataName;
            this.value = value;
        }
    }]);

    return AttributeMetadataChangedCommand;
}();

exports.default = AttributeMetadataChangedCommand;

},{"../../utils":137,"../commandConstants":106}],109:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CallActionCommand = function () {
    function CallActionCommand() {
        _classCallCheck(this, CallActionCommand);

        this.id = _commandConstants.CALL_ACTION_COMMAND_ID;
    }

    _createClass(CallActionCommand, [{
        key: 'init',
        value: function init(controllerid, actionName, params) {
            (0, _utils.checkMethod)('CreateControllerCommand.init()');
            (0, _utils.checkParam)(controllerid, 'controllerid');
            (0, _utils.checkParam)(actionName, 'actionName');

            this.controllerid = controllerid;
            this.actionName = actionName;
            this.params = params;
        }
    }]);

    return CallActionCommand;
}();

exports.default = CallActionCommand;

},{"../../utils":137,"../commandConstants":106}],110:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ChangeAttributeMetadataCommand = function () {
    function ChangeAttributeMetadataCommand() {
        _classCallCheck(this, ChangeAttributeMetadataCommand);

        this.id = _commandConstants.CHANGE_ATTRIBUTE_METADATA_COMMAND_ID;
    }

    _createClass(ChangeAttributeMetadataCommand, [{
        key: 'init',
        value: function init(attributeId, metadataName, value) {
            (0, _utils.checkMethod)('ChangeAttributeMetadataCommand.init()');
            (0, _utils.checkParam)(attributeId, 'attributeId');
            (0, _utils.checkParam)(metadataName, 'metadataName');

            this.attributeId = attributeId;
            this.metadataName = metadataName;
            this.value = value;
        }
    }]);

    return ChangeAttributeMetadataCommand;
}();

exports.default = ChangeAttributeMetadataCommand;

},{"../../utils":137,"../commandConstants":106}],111:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CreateContextCommand = function CreateContextCommand() {
    _classCallCheck(this, CreateContextCommand);

    this.id = _commandConstants.CREATE_CONTEXT_COMMAND_ID;
};

exports.default = CreateContextCommand;

},{"../commandConstants":106}],112:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CreateControllerCommand = function () {
    function CreateControllerCommand() {
        _classCallCheck(this, CreateControllerCommand);

        this.id = _commandConstants.CREATE_CONTROLLER_COMMAND_ID;
    }

    _createClass(CreateControllerCommand, [{
        key: 'init',
        value: function init(controllerName, parentControllerId) {
            (0, _utils.checkMethod)('CreateControllerCommand.init()');
            (0, _utils.checkParam)(controllerName, 'controllerName');

            this.controllerName = controllerName;
            this.parentControllerId = parentControllerId;
        }
    }]);

    return CreateControllerCommand;
}();

exports.default = CreateControllerCommand;

},{"../../utils":137,"../commandConstants":106}],113:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CreatePresentationModelCommand = function () {
    function CreatePresentationModelCommand() {
        _classCallCheck(this, CreatePresentationModelCommand);

        this.id = _commandConstants.CREATE_PRESENTATION_MODEL_COMMAND_ID;
    }

    _createClass(CreatePresentationModelCommand, [{
        key: 'init',
        value: function init(presentationModel) {
            (0, _utils.checkMethod)('CreatePresentationModelCommand.init()');
            (0, _utils.checkParam)(presentationModel, 'presentationModel');

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
    }]);

    return CreatePresentationModelCommand;
}();

exports.default = CreatePresentationModelCommand;

},{"../../utils":137,"../commandConstants":106}],114:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var DeletePresentationModelCommand = function () {
    function DeletePresentationModelCommand() {
        _classCallCheck(this, DeletePresentationModelCommand);

        this.id = _commandConstants.DELETE_PRESENTATION_MODEL_COMMAND_ID;
    }

    _createClass(DeletePresentationModelCommand, [{
        key: 'init',
        value: function init(pmId) {
            (0, _utils.checkMethod)('DeletePresentationModelCommand.init()');
            (0, _utils.checkParam)(pmId, 'pmId');

            this.pmId = pmId;
        }
    }]);

    return DeletePresentationModelCommand;
}();

exports.default = DeletePresentationModelCommand;

},{"../../utils":137,"../commandConstants":106}],115:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var DestroyContextCommand = function DestroyContextCommand() {
    _classCallCheck(this, DestroyContextCommand);

    this.id = _commandConstants.DESTROY_CONTEXT_COMMAND_ID;
};

exports.default = DestroyContextCommand;

},{"../commandConstants":106}],116:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var DestroyControllerCommand = function () {
    function DestroyControllerCommand() {
        _classCallCheck(this, DestroyControllerCommand);

        this.id = _commandConstants.DESTROY_CONTROLLER_COMMAND_ID;
    }

    _createClass(DestroyControllerCommand, [{
        key: 'init',
        value: function init(controllerId) {
            (0, _utils.checkMethod)('DestroyControllerCommand.init()');
            (0, _utils.checkParam)(controllerId, 'controllerId');

            this.controllerId = controllerId;
        }
    }]);

    return DestroyControllerCommand;
}();

exports.default = DestroyControllerCommand;

},{"../../utils":137,"../commandConstants":106}],117:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var InterruptLongPollCommand = function InterruptLongPollCommand() {
    _classCallCheck(this, InterruptLongPollCommand);

    this.id = _commandConstants.INTERRUPT_LONG_POLL_COMMAND_ID;
};

exports.default = InterruptLongPollCommand;

},{"../commandConstants":106}],118:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PresentationModelDeletedCommand = function () {
    function PresentationModelDeletedCommand() {
        _classCallCheck(this, PresentationModelDeletedCommand);

        this.id = _commandConstants.PRESENTATION_MODEL_DELETED_COMMAND_ID;
    }

    _createClass(PresentationModelDeletedCommand, [{
        key: 'init',
        value: function init(pmId) {
            (0, _utils.checkMethod)('PresentationModelDeletedCommand.init()');
            (0, _utils.checkParam)(pmId, 'pmId');

            this.pmId = pmId;
        }
    }]);

    return PresentationModelDeletedCommand;
}();

exports.default = PresentationModelDeletedCommand;

},{"../../utils":137,"../commandConstants":106}],119:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('../commandConstants');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var StartLongPollCommand = function StartLongPollCommand() {
    _classCallCheck(this, StartLongPollCommand);

    this.id = _commandConstants.START_LONG_POLL_COMMAND_ID;
};

exports.default = StartLongPollCommand;

},{"../commandConstants":106}],120:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _commandConstants = _dereq_('../commandConstants');

var _utils = _dereq_('../../utils');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ValueChangedCommand = function () {
    function ValueChangedCommand() {
        _classCallCheck(this, ValueChangedCommand);

        this.id = _commandConstants.VALUE_CHANGED_COMMAND_ID;
    }

    _createClass(ValueChangedCommand, [{
        key: 'init',
        value: function init(attributeId, newValue) {
            (0, _utils.checkMethod)('ValueChangedCommand.init()');
            (0, _utils.checkParam)(attributeId, 'attributeId');

            this.attributeId = attributeId;
            this.newValue = newValue;
        }
    }]);

    return ValueChangedCommand;
}();

exports.default = ValueChangedCommand;

},{"../../utils":137,"../commandConstants":106}],121:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ACTION_CALL_BEAN = exports.SOURCE_SYSTEM_SERVER = exports.SOURCE_SYSTEM_CLIENT = exports.SOURCE_SYSTEM = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _promise = _dereq_('core-js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _utils = _dereq_('./utils');

var _commandFactory = _dereq_('./commands/commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _constants = _dereq_('./constants');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var ACTION_CALL_BEAN = '@@@ CONTROLLER_ACTION_CALL_BEAN @@@';
var HIGHLANDER_BEAN = '@@@ HIGHLANDER_BEAN @@@';
var DOLPHIN_LIST_SPLICE = '@DP:LS@';
var SOURCE_SYSTEM = '@@@ SOURCE_SYSTEM @@@';
var SOURCE_SYSTEM_CLIENT = 'client';
var SOURCE_SYSTEM_SERVER = 'server';

var Connector = function () {
    function Connector(url, dolphin, classRepository, config) {
        _classCallCheck(this, Connector);

        (0, _utils.checkMethod)('Connector(url, dolphin, classRepository, config)');
        (0, _utils.checkParam)(url, 'url');
        (0, _utils.checkParam)(dolphin, 'dolphin');
        (0, _utils.checkParam)(classRepository, 'classRepository');

        var self = this;
        this.dolphin = dolphin;
        this.config = config;
        this.classRepository = classRepository;
        this.highlanderPMResolver = function () {};
        this.highlanderPMPromise = new _promise2.default(function (resolve) {
            self.highlanderPMResolver = resolve;
        });

        dolphin.getClientModelStore().onModelStoreChange(function (event) {
            var model = event.clientPresentationModel;
            var sourceSystem = model.findAttributeByPropertyName(SOURCE_SYSTEM);
            if ((0, _utils.exists)(sourceSystem) && sourceSystem.value === SOURCE_SYSTEM_SERVER) {
                if (event.eventType === _constants.ADDED_TYPE) {
                    self.onModelAdded(model);
                } else if (event.eventType === _constants.REMOVED_TYPE) {
                    self.onModelRemoved(model);
                }
            }
        });
    }

    _createClass(Connector, [{
        key: 'connect',
        value: function connect() {
            var that = this;
            that.dolphin.startPushListening(_commandFactory2.default.createStartLongPollCommand(), _commandFactory2.default.createInterruptLongPollCommand());
        }
    }, {
        key: 'onModelAdded',
        value: function onModelAdded(model) {
            (0, _utils.checkMethod)('Connector.onModelAdded(model)');
            (0, _utils.checkParam)(model, 'model');

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
    }, {
        key: 'onModelRemoved',
        value: function onModelRemoved(model) {
            (0, _utils.checkMethod)('Connector.onModelRemoved(model)');
            (0, _utils.checkParam)(model, 'model');
            var type = model.presentationModelType;
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
    }, {
        key: 'invoke',
        value: function invoke(command) {
            (0, _utils.checkMethod)('Connector.invoke(command)');
            (0, _utils.checkParam)(command, 'command');

            var dolphin = this.dolphin;
            return new _promise2.default(function (resolve) {
                dolphin.send(command, {
                    onFinished: function onFinished() {
                        resolve();
                    }
                });
            });
        }
    }, {
        key: 'getHighlanderPM',
        value: function getHighlanderPM() {
            return this.highlanderPMPromise;
        }
    }]);

    return Connector;
}();

exports.default = Connector;
exports.SOURCE_SYSTEM = SOURCE_SYSTEM;
exports.SOURCE_SYSTEM_CLIENT = SOURCE_SYSTEM_CLIENT;
exports.SOURCE_SYSTEM_SERVER = SOURCE_SYSTEM_SERVER;
exports.ACTION_CALL_BEAN = ACTION_CALL_BEAN;

},{"./commands/commandFactory":107,"./constants":122,"./utils":137,"core-js/library/fn/promise":2}],122:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DOLPHIN_PLATFORM_VERSION = exports.DOLPHIN_PLATFORM_VERSION = "1.0.0-dolfix";

var JS_STRING_TYPE = exports.JS_STRING_TYPE = 'string';

var DOLPHIN_BEAN = exports.DOLPHIN_BEAN = 0;
var BYTE = exports.BYTE = 1;
var SHORT = exports.SHORT = 2;
var INT = exports.INT = 3;
var LONG = exports.LONG = 4;
var FLOAT = exports.FLOAT = 5;
var DOUBLE = exports.DOUBLE = 6;
var BOOLEAN = exports.BOOLEAN = 7;
var STRING = exports.STRING = 8;
var DATE = exports.DATE = 9;
var ENUM = exports.ENUM = 10;
var CALENDAR = exports.CALENDAR = 11;
var LOCAL_DATE_FIELD_TYPE = exports.LOCAL_DATE_FIELD_TYPE = 55;
var LOCAL_DATE_TIME_FIELD_TYPE = exports.LOCAL_DATE_TIME_FIELD_TYPE = 52;
var ZONED_DATE_TIME_FIELD_TYPE = exports.ZONED_DATE_TIME_FIELD_TYPE = 54;

var ADDED_TYPE = exports.ADDED_TYPE = "ADDED";
var REMOVED_TYPE = exports.REMOVED_TYPE = "REMOVED";

},{}],123:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _promise = _dereq_('core-js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _set = _dereq_('core-js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

var _controllerproxy = _dereq_('./controllerproxy.js');

var _controllerproxy2 = _interopRequireDefault(_controllerproxy);

var _commandFactory = _dereq_('./commands/commandFactory.js');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _connector = _dereq_('./connector.js');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CONTROLLER_ID = 'controllerId';
var MODEL = 'model';
var ERROR_CODE = 'errorCode';

var ControllerManager = function () {
    function ControllerManager(dolphin, classRepository, connector) {
        _classCallCheck(this, ControllerManager);

        (0, _utils.checkMethod)('ControllerManager(dolphin, classRepository, connector)');
        (0, _utils.checkParam)(dolphin, 'dolphin');
        (0, _utils.checkParam)(classRepository, 'classRepository');
        (0, _utils.checkParam)(connector, 'connector');

        this.dolphin = dolphin;
        this.classRepository = classRepository;
        this.connector = connector;
        this.controllers = new _set2.default();
    }

    _createClass(ControllerManager, [{
        key: 'createController',
        value: function createController(name) {
            return this._createController(name, null);
        }
    }, {
        key: '_createController',
        value: function _createController(name, parentControllerId) {
            (0, _utils.checkMethod)('ControllerManager.createController(name)');
            (0, _utils.checkParam)(name, 'name');

            var self = this;
            var controllerId = void 0,
                modelId = void 0,
                model = void 0,
                controller = void 0;
            return new _promise2.default(function (resolve) {
                self.connector.getHighlanderPM().then(function (highlanderPM) {
                    self.connector.invoke(_commandFactory2.default.createCreateControllerCommand(name, parentControllerId)).then(function () {
                        controllerId = highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).getValue();
                        modelId = highlanderPM.findAttributeByPropertyName(MODEL).getValue();
                        model = self.classRepository.mapDolphinToBean(modelId);
                        controller = new _controllerproxy2.default(controllerId, model, self);
                        self.controllers.add(controller);
                        resolve(controller);
                    });
                });
            });
        }
    }, {
        key: 'invokeAction',
        value: function invokeAction(controllerId, actionName, params) {
            (0, _utils.checkMethod)('ControllerManager.invokeAction(controllerId, actionName, params)');
            (0, _utils.checkParam)(controllerId, 'controllerId');
            (0, _utils.checkParam)(actionName, 'actionName');

            var self = this;
            return new _promise2.default(function (resolve, reject) {

                var attributes = [self.dolphin.attribute(_connector.SOURCE_SYSTEM, null, _connector.SOURCE_SYSTEM_CLIENT), self.dolphin.attribute(ERROR_CODE)];

                var pm = self.dolphin.presentationModel.apply(self.dolphin, [null, _connector.ACTION_CALL_BEAN].concat(attributes));

                var actionParams = [];
                if ((0, _utils.exists)(params)) {
                    for (var param in params) {
                        if (params.hasOwnProperty(param)) {
                            var value = self.classRepository.mapParamToDolphin(params[param]);
                            actionParams.push({ name: param, value: value });
                        }
                    }
                }

                self.connector.invoke(_commandFactory2.default.createCallActionCommand(controllerId, actionName, actionParams)).then(function () {
                    var isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
                    if (isError) {
                        reject(new Error("Server side ControllerAction " + actionName + " caused an error. Please see server log for details."));
                    } else {
                        resolve();
                    }
                    self.dolphin.deletePresentationModel(pm);
                });
            });
        }
    }, {
        key: 'destroyController',
        value: function destroyController(controller) {
            (0, _utils.checkMethod)('ControllerManager.destroyController(controller)');
            (0, _utils.checkParam)(controller, 'controller');

            var self = this;
            return new _promise2.default(function (resolve) {
                self.connector.getHighlanderPM().then(function (highlanderPM) {
                    self.controllers.delete(controller);
                    highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).setValue(controller.controllerId);
                    self.connector.invoke(_commandFactory2.default.createDestroyControllerCommand(controller.getId())).then(resolve);
                });
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var controllersCopy = this.controllers;
            var promises = [];
            this.controllers = new _set2.default();
            controllersCopy.forEach(function (controller) {
                try {
                    promises.push(controller.destroy());
                } catch (e) {
                    // ignore
                }
            });
            return _promise2.default.all(promises);
        }
    }]);

    return ControllerManager;
}();

exports.default = ControllerManager;

},{"./commands/commandFactory.js":107,"./connector.js":121,"./controllerproxy.js":124,"./utils":137,"core-js/library/fn/promise":2,"core-js/library/fn/set":3}],124:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _set = _dereq_('core-js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ControllerProxy = function () {
    function ControllerProxy(controllerId, model, manager) {
        _classCallCheck(this, ControllerProxy);

        (0, _utils.checkMethod)('ControllerProxy(controllerId, model, manager)');
        (0, _utils.checkParam)(controllerId, 'controllerId');
        (0, _utils.checkParam)(model, 'model');
        (0, _utils.checkParam)(manager, 'manager');

        this.controllerId = controllerId;
        this.model = model;
        this.manager = manager;
        this.destroyed = false;
        this.onDestroyedHandlers = new _set2.default();
    }

    _createClass(ControllerProxy, [{
        key: 'getModel',
        value: function getModel() {
            return this.model;
        }
    }, {
        key: 'getId',
        value: function getId() {
            return this.controllerId;
        }
    }, {
        key: 'invoke',
        value: function invoke(name, params) {
            (0, _utils.checkMethod)('ControllerProxy.invoke(name, params)');
            (0, _utils.checkParam)(name, 'name');

            if (this.destroyed) {
                throw new Error('The controller was already destroyed');
            }
            return this.manager.invokeAction(this.controllerId, name, params);
        }
    }, {
        key: 'createController',
        value: function createController(name) {
            return this.manager._createController(name, this.getId());
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _this = this;

            if (this.destroyed) {
                throw new Error('The controller was already destroyed');
            }
            this.destroyed = true;
            this.onDestroyedHandlers.forEach(function (handler) {
                try {
                    handler(_this);
                } catch (e) {
                    ControllerProxy.LOGGER.error('An exception occurred while calling an onDestroyed-handler', e);
                }
            }, this);
            return this.manager.destroyController(this);
        }
    }, {
        key: 'onDestroyed',
        value: function onDestroyed(handler) {
            (0, _utils.checkMethod)('ControllerProxy.onDestroyed(handler)');
            (0, _utils.checkParam)(handler, 'handler');

            var self = this;
            this.onDestroyedHandlers.add(handler);
            return {
                unsubscribe: function unsubscribe() {
                    self.onDestroyedHandlers.delete(handler);
                }
            };
        }
    }]);

    return ControllerProxy;
}();

exports.default = ControllerProxy;

ControllerProxy.LOGGER = _logging.LoggerFactory.getLogger('ControllerProxy');

},{"./logging":130,"./utils":137,"core-js/library/fn/set":3}],125:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _clientConnector = _dereq_('./clientConnector');

var _clientConnector2 = _interopRequireDefault(_clientConnector);

var _clientDolphin = _dereq_('./clientDolphin');

var _clientDolphin2 = _interopRequireDefault(_clientDolphin);

var _clientModelStore = _dereq_('./clientModelStore');

var _clientModelStore2 = _interopRequireDefault(_clientModelStore);

var _httpTransmitter = _dereq_('./httpTransmitter');

var _httpTransmitter2 = _interopRequireDefault(_httpTransmitter);

var _noTransmitter = _dereq_('./noTransmitter');

var _noTransmitter2 = _interopRequireDefault(_noTransmitter);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var DolphinBuilder = function () {
    function DolphinBuilder() {
        _classCallCheck(this, DolphinBuilder);

        this.reset_ = false;
        this.slackMS_ = 300;
        this.maxBatchSize_ = 50;
        this.supportCORS_ = false;
    }

    _createClass(DolphinBuilder, [{
        key: 'url',
        value: function url(_url) {
            this.url_ = _url;
            return this;
        }
    }, {
        key: 'reset',
        value: function reset(_reset) {
            this.reset_ = _reset;
            return this;
        }
    }, {
        key: 'slackMS',
        value: function slackMS(_slackMS) {
            this.slackMS_ = _slackMS;
            return this;
        }
    }, {
        key: 'maxBatchSize',
        value: function maxBatchSize(_maxBatchSize) {
            this.maxBatchSize_ = _maxBatchSize;
            return this;
        }
    }, {
        key: 'supportCORS',
        value: function supportCORS(_supportCORS) {
            this.supportCORS_ = _supportCORS;
            return this;
        }
    }, {
        key: 'errorHandler',
        value: function errorHandler(_errorHandler) {
            this.errorHandler_ = _errorHandler;
            return this;
        }
    }, {
        key: 'headersInfo',
        value: function headersInfo(_headersInfo) {
            this.headersInfo_ = _headersInfo;
            return this;
        }
    }, {
        key: 'build',
        value: function build() {
            var clientDolphin = new _clientDolphin2.default();
            var transmitter = void 0;
            if (this.url_ != null && this.url_.length > 0) {
                transmitter = new _httpTransmitter2.default(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
            } else {
                transmitter = new _noTransmitter2.default();
            }
            clientDolphin.setClientConnector(new _clientConnector2.default(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
            clientDolphin.setClientModelStore(new _clientModelStore2.default(clientDolphin));
            DolphinBuilder.LOGGER.debug("ClientDolphin initialized", clientDolphin, transmitter);
            return clientDolphin;
        }
    }]);

    return DolphinBuilder;
}();

exports.default = DolphinBuilder;

DolphinBuilder.LOGGER = _logging.LoggerFactory.getLogger('DolphinBuilder');

},{"./clientConnector":97,"./clientDolphin":99,"./clientModelStore":100,"./httpTransmitter":128,"./logging":130,"./noTransmitter":133}],126:[function(_dereq_,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var DolphinRemotingError = exports.DolphinRemotingError = function (_Error) {
  _inherits(DolphinRemotingError, _Error);

  function DolphinRemotingError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Remoting Error';
    var detail = arguments[1];

    _classCallCheck(this, DolphinRemotingError);

    var _this = _possibleConstructorReturn(this, (DolphinRemotingError.__proto__ || Object.getPrototypeOf(DolphinRemotingError)).call(this, message));

    _this.detail = detail || undefined;
    return _this;
  }

  return DolphinRemotingError;
}(Error);

var DolphinSessionError = exports.DolphinSessionError = function (_Error2) {
  _inherits(DolphinSessionError, _Error2);

  function DolphinSessionError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Session Error';

    _classCallCheck(this, DolphinSessionError);

    return _possibleConstructorReturn(this, (DolphinSessionError.__proto__ || Object.getPrototypeOf(DolphinSessionError)).call(this, message));
  }

  return DolphinSessionError;
}(Error);

var HttpResponseError = exports.HttpResponseError = function (_Error3) {
  _inherits(HttpResponseError, _Error3);

  function HttpResponseError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Http Response Error';

    _classCallCheck(this, HttpResponseError);

    return _possibleConstructorReturn(this, (HttpResponseError.__proto__ || Object.getPrototypeOf(HttpResponseError)).call(this, message));
  }

  return HttpResponseError;
}(Error);

var HttpNetworkError = exports.HttpNetworkError = function (_Error4) {
  _inherits(HttpNetworkError, _Error4);

  function HttpNetworkError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Http Network Error';

    _classCallCheck(this, HttpNetworkError);

    return _possibleConstructorReturn(this, (HttpNetworkError.__proto__ || Object.getPrototypeOf(HttpNetworkError)).call(this, message));
  }

  return HttpNetworkError;
}(Error);

},{}],127:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var EventBus = function () {
    function EventBus() {
        _classCallCheck(this, EventBus);

        this.eventHandlers = [];
    }

    _createClass(EventBus, [{
        key: "onEvent",
        value: function onEvent(eventHandler) {
            this.eventHandlers.push(eventHandler);
        }
    }, {
        key: "trigger",
        value: function trigger(event) {
            this.eventHandlers.forEach(function (handle) {
                return handle(event);
            });
        }
    }]);

    return EventBus;
}();

exports.default = EventBus;

},{}],128:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _codec = _dereq_('./commands/codec');

var _codec2 = _interopRequireDefault(_codec);

var _logging = _dereq_('./logging');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var HttpTransmitter = function () {
    function HttpTransmitter(url) {
        var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var charset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "UTF-8";
        var errorHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var supportCORS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var headersInfo = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

        _classCallCheck(this, HttpTransmitter);

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
        this.codec = new _codec2.default();
        if (reset) {
            HttpTransmitter.LOGGER.error('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
            this.invalidate();
        }
    }

    _createClass(HttpTransmitter, [{
        key: 'transmit',
        value: function transmit(commands, onDone) {
            var _this = this;

            this.http.onerror = function () {
                _this.handleError('onerror', "");
                onDone([]);
            };
            this.http.onreadystatechange = function () {
                if (_this.http.readyState === _this.HttpCodes.finished) {
                    if (_this.http.status === _this.HttpCodes.success) {
                        var responseText = _this.http.responseText;
                        if (responseText.trim().length > 0) {
                            try {
                                var responseCommands = _this.codec.decode(responseText);
                                onDone(responseCommands);
                            } catch (err) {
                                HttpTransmitter.LOGGER.error("Error occurred parsing responseText: ", err, responseText);
                                _this.handleError('application', "HttpTransmitter: Incorrect responseText: " + responseText);
                                onDone([]);
                            }
                        } else {
                            _this.handleError('application', "HttpTransmitter: empty responseText");
                            onDone([]);
                        }
                    } else {
                        _this.handleError('application', "HttpTransmitter: HTTP Status != 200");
                        onDone([]);
                    }
                }
            };
            this.http.open('POST', this.url, true);
            this.setHeaders(this.http);
            if ("overrideMimeType" in this.http) {
                this.http.overrideMimeType("application/json; charset=" + this.charset); // todo make injectable
            }
            var encodedCommands = this.codec.encode([commands]);
            HttpTransmitter.LOGGER.trace('transmitting', commands, encodedCommands);
            this.http.send(encodedCommands);
        }
    }, {
        key: 'setHeaders',
        value: function setHeaders(httpReq) {
            if (this.headersInfo) {
                for (var i in this.headersInfo) {
                    if (this.headersInfo.hasOwnProperty(i)) {
                        httpReq.setRequestHeader(i, this.headersInfo[i]);
                    }
                }
            }
        }
    }, {
        key: 'handleError',
        value: function handleError(kind, message) {
            var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
            if (this.errorHandler) {
                this.errorHandler(errorEvent);
            } else {
                HttpTransmitter.LOGGER.error("Error occurred: ", errorEvent);
            }
        }
    }, {
        key: 'signal',
        value: function signal(command) {
            this.sig.open('POST', this.url, true);
            this.setHeaders(this.sig);
            var encodedCommand = this.codec.encode([command]);
            HttpTransmitter.LOGGER.trace('signal', command, encodedCommand);
            this.sig.send(encodedCommand);
        }
    }, {
        key: 'invalidate',
        value: function invalidate() {
            this.http.open('POST', this.url + 'invalidate?', false);
            this.http.send();
        }
    }]);

    return HttpTransmitter;
}();

exports.default = HttpTransmitter;

HttpTransmitter.LOGGER = _logging.LoggerFactory.getLogger('HttpTransmitter');

},{"./commands/codec":104,"./logging":130}],129:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var LogLevel = {
    NONE: { name: 'NONE', text: '[NONE ]', level: 0 },
    ALL: { name: 'ALL', text: '[ALL  ]', level: 100 },
    TRACE: { name: 'TRACE', text: '[TRACE]', level: 5 },
    DEBUG: { name: 'DEBUG', text: '[DEBUG]', level: 4 },
    INFO: { name: 'INFO', text: '[INFO ]', level: 3 },
    WARN: { name: 'WARN', text: '[WARN ]', level: 2 },
    ERROR: { name: 'ERROR', text: '[ERROR]', level: 1 }
};

exports.LogLevel = LogLevel;

},{}],130:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerFactory = exports.LogLevel = undefined;

var _constants = _dereq_("./constants");

var _loggerfactory = _dereq_("./loggerfactory");

exports.LogLevel = _constants.LogLevel;
exports.LoggerFactory = _loggerfactory.LoggerFactory;

},{"./constants":129,"./loggerfactory":132}],131:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Logger = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _utils = _dereq_('../utils');

var _constants = _dereq_('./constants');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

// private methods
var LOCALS = {
    pad: function pad(text, size) {
        var result = '' + text;
        while (result.length < size) {
            result = '0' + result;
        }
        return result;
    },
    internalLog: function internalLog() {
        var args = Array.from(arguments);
        var func = args.shift();
        var context = args.shift();
        var logLevel = args.shift();
        var date = new Date();
        var dateString = date.getFullYear() + '-' + LOCALS.pad(date.getMonth(), 2) + '-' + LOCALS.pad(date.getDate(), 2) + ' ' + LOCALS.pad(date.getHours(), 2) + ':' + LOCALS.pad(date.getMinutes(), 2) + ':' + LOCALS.pad(date.getSeconds(), 2) + '.' + LOCALS.pad(date.getMilliseconds(), 3);
        func.apply(undefined, [dateString, logLevel.text, context].concat(_toConsumableArray(args)));
    },
    getCookie: function getCookie(name) {
        if ((0, _utils.exists)(window) && (0, _utils.exists)(window.document) && (0, _utils.exists)(window.document.cookie)) {
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }
    }
};

// public

var Logger = function () {
    function Logger(context, rootLogger) {
        _classCallCheck(this, Logger);

        this.context = context;
        this.rootLogger = rootLogger;
        var cookieLogLevel = LOCALS.getCookie('DOLPHIN_PLATFORM_' + this.context);
        switch (cookieLogLevel) {
            case 'NONE':
                this.logLevel = _constants.LogLevel.NONE;
                break;
            case 'ALL':
                this.logLevel = _constants.LogLevel.ALL;
                break;
            case 'TRACE':
                this.logLevel = _constants.LogLevel.TRACE;
                break;
            case 'DEBUG':
                this.logLevel = _constants.LogLevel.DEBUG;
                break;
            case 'INFO':
                this.logLevel = _constants.LogLevel.INFO;
                break;
            case 'WARN':
                this.logLevel = _constants.LogLevel.WARN;
                break;
            case 'ERROR':
                this.logLevel = _constants.LogLevel.ERROR;
                break;
        }
    }

    _createClass(Logger, [{
        key: 'trace',
        value: function trace() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.TRACE)) {
                LOCALS.internalLog.apply(LOCALS, [console.log, this.context, _constants.LogLevel.TRACE].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'debug',
        value: function debug() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.DEBUG)) {
                LOCALS.internalLog.apply(LOCALS, [console.log, this.context, _constants.LogLevel.DEBUG].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'info',
        value: function info() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.INFO)) {
                LOCALS.internalLog.apply(LOCALS, [console.log, this.context, _constants.LogLevel.INFO].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'warn',
        value: function warn() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.WARN)) {
                LOCALS.internalLog.apply(LOCALS, [console.warn, this.context, _constants.LogLevel.WARN].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'error',
        value: function error() {
            if ((0, _utils.exists)(console) && this.isLogLevel(_constants.LogLevel.ERROR)) {
                LOCALS.internalLog.apply(LOCALS, [console.error, this.context, _constants.LogLevel.ERROR].concat(Array.prototype.slice.call(arguments)));
            }
        }
    }, {
        key: 'getLogLevel',
        value: function getLogLevel() {
            if ((0, _utils.exists)(this.logLevel)) {
                return this.logLevel;
            } else if ((0, _utils.exists)(this.rootLogger)) {
                return this.rootLogger.getLogLevel();
            } else {
                return _constants.LogLevel.TRACE;
            }
        }
    }, {
        key: 'setLogLevel',
        value: function setLogLevel(level) {
            this.logLevel = level;
        }
    }, {
        key: 'setLogLevelByName',
        value: function setLogLevelByName(levelName) {
            if ((0, _utils.exists)(_constants.LogLevel[levelName])) {
                this.logLevel = _constants.LogLevel[levelName];
            }
        }
    }, {
        key: 'isLogLevel',
        value: function isLogLevel(level) {
            if (this.getLogLevel() === _constants.LogLevel.NONE) {
                return false;
            }
            if (this.getLogLevel() === _constants.LogLevel.ALL) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.TRACE) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.DEBUG && level !== _constants.LogLevel.TRACE) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.INFO && level !== _constants.LogLevel.TRACE && level !== _constants.LogLevel.DEBUG) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.WARN && level !== _constants.LogLevel.TRACE && level !== _constants.LogLevel.DEBUG && level !== _constants.LogLevel.INFO) {
                return true;
            }
            if (this.getLogLevel() === _constants.LogLevel.ERROR && level !== _constants.LogLevel.TRACE && level !== _constants.LogLevel.DEBUG && level !== _constants.LogLevel.INFO && level !== _constants.LogLevel.WARN) {
                return true;
            }
            return false;
        }
    }, {
        key: 'isLogLevelUseable',
        value: function isLogLevelUseable(level) {
            (0, _utils.checkParam)(level, 'level');
            if (level.level) {
                return this.getLogLevel().level >= level.level;
            } else {
                return false;
            }
        }
    }]);

    return Logger;
}();

exports.Logger = Logger;

},{"../utils":137,"./constants":129}],132:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoggerFactory = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _map = _dereq_("core-js/library/fn/map");

var _map2 = _interopRequireDefault(_map);

var _utils = _dereq_("../utils");

var _logger = _dereq_("./logger");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ROOT_LOGGER = new _logger.Logger('ROOT');

// private methods
var LOCALS = {
    loggers: new _map2.default()
};

// public

var LoggerFactory = function () {
    function LoggerFactory() {
        _classCallCheck(this, LoggerFactory);
    }

    _createClass(LoggerFactory, null, [{
        key: "getLogger",
        value: function getLogger(context) {
            if (!(0, _utils.exists)(context) || context === 'ROOT') {
                return ROOT_LOGGER;
            }
            var existingLogger = LOCALS.loggers.get(context);
            if (existingLogger) {
                return existingLogger;
            }

            var logger = new _logger.Logger(context, ROOT_LOGGER);
            LOCALS.loggers.set(context, logger);
            return logger;
        }
    }]);

    return LoggerFactory;
}();

exports.LoggerFactory = LoggerFactory;

},{"../utils":137,"./logger":131,"core-js/library/fn/map":1}],133:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var NoTransmitter = function () {
    function NoTransmitter() {
        _classCallCheck(this, NoTransmitter);
    }

    _createClass(NoTransmitter, [{
        key: "transmit",
        value: function transmit(commands, onDone) {
            // do nothing special
            onDone([]);
        }
    }, {
        key: "signal",
        value: function signal() {
            // do nothing
        }
    }, {
        key: "reset",
        value: function reset() {
            // do nothing
        }
    }]);

    return NoTransmitter;
}();

exports.default = NoTransmitter;

},{}],134:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dolphin = dolphin;
exports.makeDolphin = makeDolphin;

var _dolphinBuilder = _dereq_('./dolphinBuilder');

var _dolphinBuilder2 = _interopRequireDefault(_dolphinBuilder);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function dolphin(url, reset) {
    var slackMS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}

function makeDolphin() {
    return new _dolphinBuilder2.default();
}

},{"./dolphinBuilder":125}],135:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _utils = _dereq_('./utils');

var _errors = _dereq_('./errors');

var _codec = _dereq_('./commands/codec');

var _codec2 = _interopRequireDefault(_codec);

var _remotingErrorHandler = _dereq_('./remotingErrorHandler');

var _remotingErrorHandler2 = _interopRequireDefault(_remotingErrorHandler);

var _logging = _dereq_('./logging');

var _commandConstants = _dereq_('./commands/commandConstants');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var FINISHED = 4;
var SUCCESS = 200;
var REQUEST_TIMEOUT = 408;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var CLIENT_ID_HTTP_HEADER_NAME = DOLPHIN_PLATFORM_PREFIX + 'dolphinClientId';

var PlatformHttpTransmitter = function () {
    function PlatformHttpTransmitter(url, config) {
        _classCallCheck(this, PlatformHttpTransmitter);

        this.url = url;
        this.config = config;
        this.headersInfo = (0, _utils.exists)(config) ? config.headersInfo : null;
        var connectionConfig = (0, _utils.exists)(config) ? config.connection : null;
        this.maxRetry = (0, _utils.exists)(connectionConfig) && (0, _utils.exists)(connectionConfig.maxRetry) ? connectionConfig.maxRetry : 3;
        this.timeout = (0, _utils.exists)(connectionConfig) && (0, _utils.exists)(connectionConfig.timeout) ? connectionConfig.timeout : 5000;
        this.failed_attempt = 0;
    }

    _createClass(PlatformHttpTransmitter, [{
        key: '_handleError',
        value: function _handleError(reject, error) {
            var connectionConfig = (0, _utils.exists)(this.config) ? this.config.connection : null;
            var errorHandlers = (0, _utils.exists)(connectionConfig) && (0, _utils.exists)(connectionConfig.errorHandlers) ? connectionConfig.errorHandlers : [new _remotingErrorHandler2.default()];
            errorHandlers.forEach(function (handler) {
                handler.onError(error);
            });
            reject(error);
        }
    }, {
        key: '_send',
        value: function _send(commands) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var http = new XMLHttpRequest();
                http.withCredentials = true;
                http.onerror = function (errorContent) {
                    PlatformHttpTransmitter.LOGGER.error('HTTP network error', errorContent);
                    _this._handleError(reject, new _errors.HttpNetworkError('PlatformHttpTransmitter: Network error', errorContent));
                };

                http.onreadystatechange = function () {
                    if (http.readyState === FINISHED) {
                        switch (http.status) {

                            case SUCCESS:
                                {
                                    _this.failed_attempt = 0;
                                    var currentClientId = http.getResponseHeader(CLIENT_ID_HTTP_HEADER_NAME);
                                    if ((0, _utils.exists)(currentClientId)) {
                                        if ((0, _utils.exists)(_this.clientId) && _this.clientId !== currentClientId) {
                                            _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: ClientId of the response did not match'));
                                        }
                                        _this.clientId = currentClientId;
                                    } else {
                                        _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: Server did not send a clientId'));
                                    }

                                    if (PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.DEBUG) && !PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.TRACE)) {
                                        try {
                                            var json = JSON.parse(http.responseText);
                                            if (json.length > 0) {
                                                PlatformHttpTransmitter.LOGGER.debug('HTTP response with SUCCESS', currentClientId, json);
                                            }
                                        } catch (error) {
                                            PlatformHttpTransmitter.LOGGER.error('Response could not be parsed to JSON for logging');
                                        }
                                    }

                                    PlatformHttpTransmitter.LOGGER.trace('HTTP response with SUCCESS', currentClientId, http.responseText);
                                    resolve(http.responseText);
                                    break;
                                }

                            case REQUEST_TIMEOUT:
                                PlatformHttpTransmitter.LOGGER.error('HTTP request timeout');
                                _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: Session Timeout'));
                                break;

                            default:
                                if (_this.failed_attempt <= _this.maxRetry) {
                                    _this.failed_attempt = _this.failed_attempt + 1;
                                }
                                PlatformHttpTransmitter.LOGGER.error('HTTP unsupported status, with HTTP status', http.status);
                                _this._handleError(reject, new _errors.HttpResponseError('PlatformHttpTransmitter: HTTP Status != 200 (' + http.status + ')'));
                                break;
                        }
                    }
                };

                http.open('POST', _this.url);
                if ((0, _utils.exists)(_this.clientId)) {
                    http.setRequestHeader(CLIENT_ID_HTTP_HEADER_NAME, _this.clientId);
                }

                if ((0, _utils.exists)(_this.headersInfo)) {
                    for (var i in _this.headersInfo) {
                        if (_this.headersInfo.hasOwnProperty(i)) {
                            http.setRequestHeader(i, _this.headersInfo[i]);
                        }
                    }
                }

                var encodedCommands = _codec2.default.encode(commands);

                if (PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.DEBUG) && !PlatformHttpTransmitter.LOGGER.isLogLevelUseable(_logging.LogLevel.TRACE)) {
                    for (var _i = 0; _i < commands.length; _i++) {
                        var command = commands[_i];
                        if (command.id === _commandConstants.VALUE_CHANGED_COMMAND_ID) {
                            PlatformHttpTransmitter.LOGGER.debug('send', command, encodedCommands);
                        }
                    }
                }

                PlatformHttpTransmitter.LOGGER.trace('send', commands, encodedCommands);
                if (_this.failed_attempt > _this.maxRetry) {
                    setTimeout(function () {
                        http.send(encodedCommands);
                    }, _this.timeout);
                } else {
                    http.send(encodedCommands);
                }
            });
        }
    }, {
        key: 'transmit',
        value: function transmit(commands, onDone) {
            var _this2 = this;

            this._send(commands).then(function (responseText) {
                if (responseText.trim().length > 0) {
                    try {
                        var responseCommands = _codec2.default.decode(responseText);
                        onDone(responseCommands);
                    } catch (err) {
                        _this2.emit('error', new _errors.DolphinRemotingError('PlatformHttpTransmitter: Parse error: (Incorrect response = ' + responseText + ')'));
                        onDone([]);
                    }
                } else {
                    _this2.emit('error', new _errors.DolphinRemotingError('PlatformHttpTransmitter: Empty response'));
                    onDone([]);
                }
            }).catch(function (error) {
                _this2.emit('error', error);
                onDone([]);
            });
        }
    }, {
        key: 'signal',
        value: function signal(command) {
            var _this3 = this;

            this._send([command]).catch(function (error) {
                return _this3.emit('error', error);
            });
        }
    }]);

    return PlatformHttpTransmitter;
}();

exports.default = PlatformHttpTransmitter;

PlatformHttpTransmitter.LOGGER = _logging.LoggerFactory.getLogger('PlatformHttpTransmitter');

(0, _emitterComponent2.default)(PlatformHttpTransmitter.prototype);

},{"./commands/codec":104,"./commands/commandConstants":106,"./errors":126,"./logging":130,"./remotingErrorHandler":136,"./utils":137,"emitter-component":92}],136:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _logging = _dereq_('./logging');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var RemotingErrorHandler = function () {
    function RemotingErrorHandler() {
        _classCallCheck(this, RemotingErrorHandler);
    }

    _createClass(RemotingErrorHandler, [{
        key: 'onError',
        value: function onError(error) {
            RemotingErrorHandler.LOGGER.error(error);
        }
    }]);

    return RemotingErrorHandler;
}();

exports.default = RemotingErrorHandler;

RemotingErrorHandler.LOGGER = _logging.LoggerFactory.getLogger('RemotingErrorHandler');

},{"./logging":130}],137:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exists = exists;
exports.checkMethod = checkMethod;
exports.checkParam = checkParam;
var _checkMethodName;

function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}

function checkMethod(name) {
    _checkMethodName = name;
}

function checkParam(param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + _checkMethodName);
    }
}

},{}]},{},[98])(98)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL21hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWZyb20taXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW52b2tlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19tZXRhLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX25ldy1wcm9taXNlLWNhcGFiaWxpdHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wZXJmb3JtLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9taXNlLXJlc29sdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1jb2xsZWN0aW9uLWZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1jb2xsZWN0aW9uLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL192YWxpZGF0ZS1jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcubWFwLmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC5vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcubWFwLnRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnByb21pc2UuZmluYWxseS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcucHJvbWlzZS50cnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zZXQub2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvZW1pdHRlci1jb21wb25lbnQvaW5kZXguanMiLCJzcmMvYXR0cmlidXRlLmpzIiwic3JjL2JlYW5tYW5hZ2VyLmpzIiwic3JjL2NsYXNzcmVwby5qcyIsInNyYy9jbGllbnRBdHRyaWJ1dGUuanMiLCJzcmMvY2xpZW50Q29ubmVjdG9yLmpzIiwic3JjL2NsaWVudENvbnRleHRGYWN0b3J5LmpzIiwic3JjL2NsaWVudERvbHBoaW4uanMiLCJzcmMvY2xpZW50TW9kZWxTdG9yZS5qcyIsInNyYy9jbGllbnRQcmVzZW50YXRpb25Nb2RlbC5qcyIsInNyYy9jbGllbnRjb250ZXh0LmpzIiwic3JjL2NvbW1hbmRCYXRjaGVyLmpzIiwic3JjL2NvbW1hbmRzL2NvZGVjLmpzIiwic3JjL2NvbW1hbmRzL2NvZGVjRXJyb3IuanMiLCJzcmMvY29tbWFuZHMvY29tbWFuZENvbnN0YW50cy5qcyIsInNyYy9jb21tYW5kcy9jb21tYW5kRmFjdG9yeS5qcyIsInNyYy9jb21tYW5kcy9pbXBsL2F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9jYWxsQWN0aW9uQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9pbXBsL2NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9pbXBsL2NyZWF0ZUNvbnRleHRDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvY3JlYXRlQ29udHJvbGxlckNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9jcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9kZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9kZXN0cm95Q29udGV4dENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9kZXN0cm95Q29udHJvbGxlckNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9pbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9wcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvc3RhcnRMb25nUG9sbENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC92YWx1ZUNoYW5nZWRDb21tYW5kLmpzIiwic3JjL2Nvbm5lY3Rvci5qcyIsInNyYy9jb25zdGFudHMuanMiLCJzcmMvY29udHJvbGxlcm1hbmFnZXIuanMiLCJzcmMvY29udHJvbGxlcnByb3h5LmpzIiwic3JjL2RvbHBoaW5CdWlsZGVyLmpzIiwic3JjL2Vycm9ycy5qcyIsInNyYy9ldmVudEJ1cy5qcyIsInNyYy9odHRwVHJhbnNtaXR0ZXIuanMiLCJzcmMvbG9nZ2luZy9jb25zdGFudHMuanMiLCJzcmMvbG9nZ2luZy9pbmRleC5qcyIsInNyYy9sb2dnaW5nL2xvZ2dlci5qcyIsInNyYy9sb2dnaW5nL2xvZ2dlcmZhY3RvcnkuanMiLCJzcmMvbm9UcmFuc21pdHRlci5qcyIsInNyYy9vcGVuRG9scGhpbi5qcyIsInNyYy9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5qcyIsInNyYy9yZW1vdGluZ0Vycm9ySGFuZGxlci5qcyIsInNyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QU0sSUFBQSxBQUFJLE1BQU0sbUJBQUEsQUFBbUIsZ0JBQW5CLEFBQW1DLHNCQUFuRCxBQUFNLEFBQW1FLEFBQzVFLEFBQ0oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC5vZicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLk1hcDtcbiIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5wcm9taXNlLmZpbmFsbHknKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnByb21pc2UudHJ5Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5Qcm9taXNlO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnNldCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnNldC5vZicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlNldDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlciwgSVRFUkFUT1IpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGFzYyA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUWVBFLCAkY3JlYXRlKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgdmFyIGNyZWF0ZSA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBJT2JqZWN0KE8pO1xuICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgdmFsLCByZXM7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZiAoVFlQRSkge1xuICAgICAgICBpZiAoSVNfTUFQKSByZXN1bHRbaW5kZXhdID0gcmVzOyAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXMpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsKSkge1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTtcbiIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsLCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBzZXRTcGVjaWVzID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFzdEtleSA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5O1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFNJWkUgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uICh0aGF0LCBrZXkpIHtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KTtcbiAgdmFyIGVudHJ5O1xuICBpZiAoaW5kZXggIT09ICdGJykgcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yIChlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICBpZiAoZW50cnkuayA9PSBrZXkpIHJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll90ID0gTkFNRTsgICAgICAgICAvLyBjb2xsZWN0aW9uIHR5cGVcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICBmb3IgKHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSksIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZW50cnkucCkgZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm47XG4gICAgICAgICAgdmFyIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmIChuZXh0KSBuZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmICh0aGF0Ll9mID09IGVudHJ5KSB0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZiAodGhhdC5fbCA9PSBlbnRyeSkgdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGF0ID0gdW5kZWZpbmVkICovKSB7XG4gICAgICAgIHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMyk7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgd2hpbGUgKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZikge1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChERVNDUklQVE9SUykgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZSh0aGlzLCBOQU1FKVtTSVpFXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbiAodGhhdCwga2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgdmFyIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmIChlbnRyeSkge1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYgKCF0aGF0Ll9mKSB0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZiAocHJldikgcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmIChpbmRleCAhPT0gJ0YnKSB0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbiAoQywgTkFNRSwgSVNfTUFQKSB7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICAgICAgdGhpcy5fdCA9IHZhbGlkYXRlKGl0ZXJhdGVkLCBOQU1FKTsgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAgICAgICAgICAgICAgICAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBraW5kID0gdGhhdC5faztcbiAgICAgIHZhciBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYgKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpIHtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJywgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBmcm9tID0gcmVxdWlyZSgnLi9fYXJyYXktZnJvbS1pdGVyYWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSkge1xuICByZXR1cm4gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIGlmIChjbGFzc29mKHRoaXMpICE9IE5BTUUpIHRocm93IFR5cGVFcnJvcihOQU1FICsgXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7XG4gICAgcmV0dXJuIGZyb20odGhpcyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgZWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKSB7XG4gIHZhciBCYXNlID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgQyA9IEJhc2U7XG4gIHZhciBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCc7XG4gIHZhciBwcm90byA9IEMgJiYgQy5wcm90b3R5cGU7XG4gIHZhciBPID0ge307XG4gIGlmICghREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0YXJnZXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSwgJ19jJyk7XG4gICAgICB0YXJnZXQuX2MgPSBuZXcgQmFzZSgpO1xuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICBlYWNoKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcyx0b0pTT04nLnNwbGl0KCcsJyksIGZ1bmN0aW9uIChLRVkpIHtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZiAoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpIGhpZGUoQy5wcm90b3R5cGUsIEtFWSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCBLRVkpO1xuICAgICAgICBpZiAoIUlTX0FEREVSICYmIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpKSByZXR1cm4gS0VZID09ICdnZXQnID8gdW5kZWZpbmVkIDogZmFsc2U7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9jW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIElTX0FEREVSID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIElTX1dFQUsgfHwgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYsIE8pO1xuXG4gIGlmICghSVNfV0VBSykgY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuMScgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIElTX1dSQVAgPSB0eXBlICYgJGV4cG9ydC5XO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV07XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIga2V5LCBvd24sIG91dDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAob3duICYmIGtleSBpbiBleHBvcnRzKSBjb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uIChDKSB7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQykge1xuICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEMoKTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYgKElTX1BST1RPKSB7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYgKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0pIGhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xudmFyIEJSRUFLID0ge307XG52YXIgUkVUVVJOID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1IpIHtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpO1xuICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZiAoaXNBcnJheUl0ZXIoaXRlckZuKSkgZm9yIChsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTspIHtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgYXJncywgdGhhdCkge1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJncyk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSkgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRvbmUsIHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcbiIsInZhciBNRVRBID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHNldERlc2MgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGlkID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgc2V0RGVzYyhpdCwgTUVUQSwgeyB2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gfSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKSBzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogTUVUQSxcbiAgTkVFRDogZmFsc2UsXG4gIGZhc3RLZXk6IGZhc3RLZXksXG4gIGdldFdlYWs6IGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0O1xudmFyIE9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbnZhciBpc05vZGUgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZiAoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpIHBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUgKGhlYWQpIHtcbiAgICAgIGZuID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoaGVhZCkgbm90aWZ5KCk7XG4gICAgICAgIGVsc2UgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZiAoaXNOb2RlKSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG4gIH0gZWxzZSBpZiAoT2JzZXJ2ZXIpIHtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmIChQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSkge1xuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgICBpZiAobGFzdCkgbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZiAoIWhlYWQpIHtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyNS40LjEuNSBOZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcblxuZnVuY3Rpb24gUHJvbWlzZUNhcGFiaWxpdHkoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBzYWZlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICBpZiAoc2FmZSAmJiB0YXJnZXRba2V5XSkgdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9wcm9wb3NhbC1zZXRtYXAtb2Zmcm9tL1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ09MTEVDVElPTikge1xuICAkZXhwb3J0KCRleHBvcnQuUywgQ09MTEVDVElPTiwgeyBmcm9tOiBmdW5jdGlvbiBmcm9tKHNvdXJjZSAvKiAsIG1hcEZuLCB0aGlzQXJnICovKSB7XG4gICAgdmFyIG1hcEZuID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciBtYXBwaW5nLCBBLCBuLCBjYjtcbiAgICBhRnVuY3Rpb24odGhpcyk7XG4gICAgbWFwcGluZyA9IG1hcEZuICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG1hcHBpbmcpIGFGdW5jdGlvbihtYXBGbik7XG4gICAgaWYgKHNvdXJjZSA9PSB1bmRlZmluZWQpIHJldHVybiBuZXcgdGhpcygpO1xuICAgIEEgPSBbXTtcbiAgICBpZiAobWFwcGluZykge1xuICAgICAgbiA9IDA7XG4gICAgICBjYiA9IGN0eChtYXBGbiwgYXJndW1lbnRzWzJdLCAyKTtcbiAgICAgIGZvck9mKHNvdXJjZSwgZmFsc2UsIGZ1bmN0aW9uIChuZXh0SXRlbSkge1xuICAgICAgICBBLnB1c2goY2IobmV4dEl0ZW0sIG4rKykpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvck9mKHNvdXJjZSwgZmFsc2UsIEEucHVzaCwgQSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgdGhpcyhBKTtcbiAgfSB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT0xMRUNUSU9OKSB7XG4gICRleHBvcnQoJGV4cG9ydC5TLCBDT0xMRUNUSU9OLCB7IG9mOiBmdW5jdGlvbiBvZigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgQSA9IEFycmF5KGxlbmd0aCk7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSBBW2xlbmd0aF0gPSBhcmd1bWVudHNbbGVuZ3RoXTtcbiAgICByZXR1cm4gbmV3IHRoaXMoQSk7XG4gIH0gfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgQyA9IHR5cGVvZiBjb3JlW0tFWV0gPT0gJ2Z1bmN0aW9uJyA/IGNvcmVbS0VZXSA6IGdsb2JhbFtLRVldO1xuICBpZiAoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkgZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTtcbiIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgRCkge1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yO1xuICB2YXIgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4vX2h0bWwnKTtcbnZhciBjZWwgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIHNldFRhc2sgPSBnbG9iYWwuc2V0SW1tZWRpYXRlO1xudmFyIGNsZWFyVGFzayA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcbnZhciBNZXNzYWdlQ2hhbm5lbCA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbDtcbnZhciBEaXNwYXRjaCA9IGdsb2JhbC5EaXNwYXRjaDtcbnZhciBjb3VudGVyID0gMDtcbnZhciBxdWV1ZSA9IHt9O1xudmFyIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xudmFyIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgaWYgKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYgKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spIHtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbikge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGkgPSAxO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpIHtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYgKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gU3BoZXJlIChKUyBnYW1lIGVuZ2luZSkgRGlzcGF0Y2ggQVBJXG4gIH0gZWxzZSBpZiAoRGlzcGF0Y2ggJiYgRGlzcGF0Y2gubm93KSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIERpc3BhdGNoLm5vdyhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmIChNZXNzYWdlQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmIChPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSkge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFRZUEUpIHtcbiAgaWYgKCFpc09iamVjdChpdCkgfHwgaXQuX3QgIT09IFRZUEUpIHRocm93IFR5cGVFcnJvcignSW5jb21wYXRpYmxlIHJlY2VpdmVyLCAnICsgVFlQRSArICcgcmVxdWlyZWQhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBNQVAgPSAnTWFwJztcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoTUFQLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgTUFQKSwga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpO1xuIiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgbWljcm90YXNrID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xudmFyIHByb21pc2VSZXNvbHZlID0gcmVxdWlyZSgnLi9fcHJvbWlzZS1yZXNvbHZlJyk7XG52YXIgUFJPTUlTRSA9ICdQcm9taXNlJztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciAkUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXTtcbnZhciBpc05vZGUgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBJbnRlcm5hbCwgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZS5yZXNvbHZlKDEpO1xuICAgIHZhciBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICAgIGV4ZWMoZW1wdHksIGVtcHR5KTtcbiAgICB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpc1JlamVjdCkge1xuICBpZiAocHJvbWlzZS5fbikgcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciBvayA9IHByb21pc2UuX3MgPT0gMTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbDtcbiAgICAgIHZhciByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZTtcbiAgICAgIHZhciByZWplY3QgPSByZWFjdGlvbi5yZWplY3Q7XG4gICAgICB2YXIgZG9tYWluID0gcmVhY3Rpb24uZG9tYWluO1xuICAgICAgdmFyIHJlc3VsdCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgaWYgKHByb21pc2UuX2ggPT0gMikgb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhbmRsZXIgPT09IHRydWUpIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChkb21haW4pIGRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2UpIHtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoID4gaSkgcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYgKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKSBvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIHVuaGFuZGxlZCA9IGlzVW5oYW5kbGVkKHByb21pc2UpO1xuICAgIHZhciByZXN1bHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYgKHVuaGFuZGxlZCkge1xuICAgICAgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKSB7XG4gICAgICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZiAodW5oYW5kbGVkICYmIHJlc3VsdC5lKSB0aHJvdyByZXN1bHQudjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgaWYgKHByb21pc2UuX2ggPT0gMSkgcmV0dXJuIGZhbHNlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9hIHx8IHByb21pc2UuX2M7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlYWN0aW9uO1xuICB3aGlsZSAoY2hhaW4ubGVuZ3RoID4gaSkge1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZiAocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpIHJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYgKGlzTm9kZSkge1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCkge1xuICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdiB9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZiAoIXByb21pc2UuX2EpIHByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICB2YXIgdGhlbjtcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkgdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAkcmVqZWN0LmNhbGwoeyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX2EpIHRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fcykgbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbiAob25SZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIE93blByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9taXNlID0gbmV3IEludGVybmFsKCk7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xuICBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoQykge1xuICAgIHJldHVybiBDID09PSAkUHJvbWlzZSB8fCBDID09PSBXcmFwcGVyXG4gICAgICA/IG5ldyBPd25Qcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgOiBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgUHJvbWlzZTogJFByb21pc2UgfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpIHtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpO1xuICAgIHZhciAkJHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCkge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShMSUJSQVJZICYmIHRoaXMgPT09IFdyYXBwZXIgPyAkUHJvbWlzZSA6IHRoaXMsIHgpO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVzb2x2ZSA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICB2YXIgJGluZGV4ID0gaW5kZXgrKztcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIGlmIChhbHJlYWR5Q2FsbGVkKSByZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0VUID0gJ1NldCc7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFNFVCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgU0VUKSwgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy1tYXAuZnJvbVxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tZnJvbScpKCdNYXAnKTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLW1hcC5vZlxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tb2YnKSgnTWFwJyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHsgdG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJykgfSk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcm9taXNlLWZpbmFsbHlcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgcHJvbWlzZVJlc29sdmUgPSByZXF1aXJlKCcuL19wcm9taXNlLXJlc29sdmUnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlIsICdQcm9taXNlJywgeyAnZmluYWxseSc6IGZ1bmN0aW9uIChvbkZpbmFsbHkpIHtcbiAgdmFyIEMgPSBzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgY29yZS5Qcm9taXNlIHx8IGdsb2JhbC5Qcm9taXNlKTtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2Ygb25GaW5hbGx5ID09ICdmdW5jdGlvbic7XG4gIHJldHVybiB0aGlzLnRoZW4oXG4gICAgaXNGdW5jdGlvbiA/IGZ1bmN0aW9uICh4KSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmUoQywgb25GaW5hbGx5KCkpLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4geDsgfSk7XG4gICAgfSA6IG9uRmluYWxseSxcbiAgICBpc0Z1bmN0aW9uID8gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShDLCBvbkZpbmFsbHkoKSkudGhlbihmdW5jdGlvbiAoKSB7IHRocm93IGU7IH0pO1xuICAgIH0gOiBvbkZpbmFsbHlcbiAgKTtcbn0gfSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcm9taXNlLXRyeVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1Byb21pc2UnLCB7ICd0cnknOiBmdW5jdGlvbiAoY2FsbGJhY2tmbikge1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKHRoaXMpO1xuICB2YXIgcmVzdWx0ID0gcGVyZm9ybShjYWxsYmFja2ZuKTtcbiAgKHJlc3VsdC5lID8gcHJvbWlzZUNhcGFiaWxpdHkucmVqZWN0IDogcHJvbWlzZUNhcGFiaWxpdHkucmVzb2x2ZSkocmVzdWx0LnYpO1xuICByZXR1cm4gcHJvbWlzZUNhcGFiaWxpdHkucHJvbWlzZTtcbn0gfSk7XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy1zZXQuZnJvbVxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tZnJvbScpKCdTZXQnKTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLXNldC5vZlxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tb2YnKSgnU2V0Jyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1NldCcsIHsgdG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnU2V0JykgfSk7XG4iLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG52YXIgRE9NSXRlcmFibGVzID0gKCdDU1NSdWxlTGlzdCxDU1NTdHlsZURlY2xhcmF0aW9uLENTU1ZhbHVlTGlzdCxDbGllbnRSZWN0TGlzdCxET01SZWN0TGlzdCxET01TdHJpbmdMaXN0LCcgK1xuICAnRE9NVG9rZW5MaXN0LERhdGFUcmFuc2Zlckl0ZW1MaXN0LEZpbGVMaXN0LEhUTUxBbGxDb2xsZWN0aW9uLEhUTUxDb2xsZWN0aW9uLEhUTUxGb3JtRWxlbWVudCxIVE1MU2VsZWN0RWxlbWVudCwnICtcbiAgJ01lZGlhTGlzdCxNaW1lVHlwZUFycmF5LE5hbWVkTm9kZU1hcCxOb2RlTGlzdCxQYWludFJlcXVlc3RMaXN0LFBsdWdpbixQbHVnaW5BcnJheSxTVkdMZW5ndGhMaXN0LFNWR051bWJlckxpc3QsJyArXG4gICdTVkdQYXRoU2VnTGlzdCxTVkdQb2ludExpc3QsU1ZHU3RyaW5nTGlzdCxTVkdUcmFuc2Zvcm1MaXN0LFNvdXJjZUJ1ZmZlckxpc3QsU3R5bGVTaGVldExpc3QsVGV4dFRyYWNrQ3VlTGlzdCwnICtcbiAgJ1RleHRUcmFja0xpc3QsVG91Y2hMaXN0Jykuc3BsaXQoJywnKTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBET01JdGVyYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIE5BTUUgPSBET01JdGVyYWJsZXNbaV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZiAocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufVxuIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGUge1xufVxuXG5BdHRyaWJ1dGUuUVVBTElGSUVSX1BST1BFUlRZID0gXCJxdWFsaWZpZXJcIjtcbkF0dHJpYnV0ZS5WQUxVRSA9IFwidmFsdWVcIjtcbiIsImltcG9ydCAgTWFwIGZyb20gJ2NvcmUtanMvbGlicmFyeS9mbi9tYXAnO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZWFuTWFuYWdlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGFzc1JlcG9zaXRvcnkpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyKGNsYXNzUmVwb3NpdG9yeSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcblxuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5hZGRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnJlbW92ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy51cGRhdGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYWxsQWRkZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFsbFJlbW92ZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFsbFVwZGF0ZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gW107XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5BZGRlZCgodHlwZSwgYmVhbikgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQmVhbk1hbmFnZXIuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5BZGRlZC1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIEJlYW5NYW5hZ2VyLkxPR0dFUi5lcnJvcignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhbkFkZGVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhblJlbW92ZWQoKHR5cGUsIGJlYW4pID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQmVhbk1hbmFnZXIuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5SZW1vdmVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBCZWFuTWFuYWdlci5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5SZW1vdmVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhblVwZGF0ZSgodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEJlYW5NYW5hZ2VyLkxPR0dFUi5lcnJvcignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgQmVhbk1hbmFnZXIuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQXJyYXlVcGRhdGUoKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cykgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQmVhbk1hbmFnZXIuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkFycmF5VXBkYXRlLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgQmVhbk1hbmFnZXIuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5cblxuICAgIG5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG5cbiAgICBub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaW5kZXgsICdpbmRleCcpO1xuICAgICAgICBjaGVja1BhcmFtKGNvdW50LCAnY291bnQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShyZW1vdmVkRWxlbWVudHMsICdyZW1vdmVkRWxlbWVudHMnKTtcblxuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKTtcbiAgICB9XG5cblxuICAgIGlzTWFuYWdlZChiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5pc01hbmFnZWQoYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmlzTWFuYWdlZCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgY3JlYXRlKHR5cGUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmNyZWF0ZSh0eXBlKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uY3JlYXRlKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBhZGQodHlwZSwgYmVhbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkKHR5cGUsIGJlYW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmFkZEFsbCh0eXBlLCBjb2xsZWN0aW9uKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5hZGRBbGwoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZShiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmUoYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZSgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlQWxsKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZUFsbChjb2xsZWN0aW9uKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbGxlY3Rpb24sICdjb2xsZWN0aW9uJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlQWxsKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmVJZihwcmVkaWNhdGUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZUlmKHByZWRpY2F0ZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcmVkaWNhdGUsICdwcmVkaWNhdGUnKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVJZigpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgb25BZGRlZCh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQWRkZWQoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzID0gc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWRkZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvblJlbW92ZWQodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vblJlbW92ZWQoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMgPSBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMgPSBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vblJlbW92ZWQodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYucmVtb3ZlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVtb3ZlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvbkJlYW5VcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkJlYW5VcGRhdGUoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkJlYW5VcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYudXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BcnJheVVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQXJyYXlVcGRhdGUoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQXJyYXlVcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkJlYW5NYW5hZ2VyLkxPR0dFUiA9IExvZ2dlckZhY3RvcnkuZ2V0TG9nZ2VyKCdCZWFuTWFuYWdlcicpO1xuIiwiaW1wb3J0ICBNYXAgZnJvbSAnY29yZS1qcy9saWJyYXJ5L2ZuL21hcCc7XG5pbXBvcnQgKiBhcyBjb25zdHMgZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5sZXQgYmxvY2tlZCA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsYXNzUmVwb3NpdG9yeSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihkb2xwaGluKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkoZG9scGhpbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuY2xhc3NlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuRnJvbURvbHBoaW4gPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpbiA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5jbGFzc0luZm9zID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzID0gW107XG4gICAgfVxuXG4gICAgZml4VHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkJZVEU6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5TSE9SVDpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLklOVDpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPTkc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkZMT0FUOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuRE9VQkxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkJPT0xFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuICd0cnVlJyA9PT0gU3RyaW5nKHZhbHVlKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuU1RSSU5HOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuRU5VTTpcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnJvbURvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAoIWV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc1JlcG9zaXRvcnkuYmVhbkZyb21Eb2xwaGluLmdldChTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRBVEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQ0FMRU5EQVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlpPTkVEX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZml4VHlwZSh0eXBlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b0RvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAoIWV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc1JlcG9zaXRvcnkuYmVhblRvRG9scGhpbi5nZXQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuREFURTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQ0FMRU5EQVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlpPTkVEX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpeFR5cGUodHlwZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VuZExpc3RTcGxpY2UoY2xhc3NSZXBvc2l0b3J5LCBtb2RlbElkLCBwcm9wZXJ0eU5hbWUsIGZyb20sIHRvLCBuZXdFbGVtZW50cykge1xuICAgICAgICBsZXQgZG9scGhpbiA9IGNsYXNzUmVwb3NpdG9yeS5kb2xwaGluO1xuICAgICAgICBsZXQgbW9kZWwgPSBkb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQobW9kZWxJZCk7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc0luZm8gPSBjbGFzc1JlcG9zaXRvcnkuY2xhc3Nlcy5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gY2xhc3NJbmZvW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHR5cGUpKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ0BAQCBTT1VSQ0VfU1lTVEVNIEBAQCcsIG51bGwsICdjbGllbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3NvdXJjZScsIG51bGwsIG1vZGVsSWQpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnYXR0cmlidXRlJywgbnVsbCwgcHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2Zyb20nLCBudWxsLCBmcm9tKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3RvJywgbnVsbCwgdG8pLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnY291bnQnLCBudWxsLCBuZXdFbGVtZW50cy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBuZXdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goZG9scGhpbi5hdHRyaWJ1dGUoaW5kZXgudG9TdHJpbmcoKSwgbnVsbCwgc2VsZi50b0RvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCBlbGVtZW50KSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoZG9scGhpbiwgW251bGwsICdARFA6TFNAJ10uY29uY2F0KGF0dHJpYnV0ZXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhbGlkYXRlTGlzdChjbGFzc1JlcG9zaXRvcnksIHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBsZXQgbGlzdCA9IGJlYW5bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKCFleGlzdHMobGlzdCkpIHtcbiAgICAgICAgICAgIGNsYXNzUmVwb3NpdG9yeS5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgW10sIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBDbGFzc1JlcG9zaXRvcnkuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmxvY2soYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChleGlzdHMoYmxvY2tlZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGNyZWF0ZSBhIGJsb2NrIHdoaWxlIGFub3RoZXIgYmxvY2sgZXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tlZCA9IHtcbiAgICAgICAgICAgIGJlYW46IGJlYW4sXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGV4aXN0cyhibG9ja2VkKSAmJiBibG9ja2VkLmJlYW4gPT09IGJlYW4gJiYgYmxvY2tlZC5wcm9wZXJ0eU5hbWUgPT09IHByb3BlcnR5TmFtZTtcbiAgICB9XG5cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICBibG9ja2VkID0gbnVsbDtcbiAgICB9XG5cbiAgICBub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICBsZXQgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkpIHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IHRoaXMuZG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKG1vZGVsSWQpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gY2xhc3NJbmZvW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gYXR0cmlidXRlLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZSh0aGlzLnRvRG9scGhpbih0aGlzLCB0eXBlLCBuZXdWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mcm9tRG9scGhpbih0aGlzLCB0eXBlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgICAgICBsZXQgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkgJiYgZXhpc3RzKGFycmF5KSkge1xuICAgICAgICAgICAgbGV0IHJlbW92ZWRFbGVtZW50c0NvdW50ID0gQXJyYXkuaXNBcnJheShyZW1vdmVkRWxlbWVudHMpID8gcmVtb3ZlZEVsZW1lbnRzLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICB0aGlzLnNlbmRMaXN0U3BsaWNlKHRoaXMsIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgaW5kZXgsIGluZGV4ICsgcmVtb3ZlZEVsZW1lbnRzQ291bnQsIGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIGNvdW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJlYW5BZGRlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuQWRkZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25CZWFuUmVtb3ZlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQmVhblVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25BcnJheVVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZShoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyQ2xhc3MobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBpZiAodGhpcy5jbGFzc2VzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjbGFzc0luZm8gPSB7fTtcbiAgICAgICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUuc2VhcmNoKC9eQC8pIDwgMDtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzZXMuc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJDbGFzcyhtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnVucmVnaXN0ZXJDbGFzcyhtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIHRoaXMuY2xhc3Nlc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgIH1cblxuICAgIGxvYWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIGxldCBiZWFuID0ge307XG4gICAgICAgIG1vZGVsLmF0dHJpYnV0ZXMuZmlsdGVyKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwKTtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBiZWFuW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5vbGRWYWx1ZSAhPT0gZXZlbnQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4sIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2xhc3NSZXBvc2l0b3J5LkxPR0dFUi5lcnJvcignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbi5zZXQobW9kZWwuaWQsIGJlYW4pO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW4uc2V0KGJlYW4sIG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5jbGFzc0luZm9zLnNldChtb2RlbC5pZCwgY2xhc3NJbmZvKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBDbGFzc1JlcG9zaXRvcnkuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5BZGRlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYmVhbjtcbiAgICB9XG5cbiAgICB1bmxvYWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIGxldCBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5iZWFuRnJvbURvbHBoaW5bJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5iZWFuVG9Eb2xwaGluWydkZWxldGUnXShiZWFuKTtcbiAgICAgICAgdGhpcy5jbGFzc0luZm9zWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgICAgIGlmIChleGlzdHMoYmVhbikpIHtcbiAgICAgICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2xhc3NSZXBvc2l0b3J5LkxPR0dFUi5lcnJvcignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuUmVtb3ZlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlYW47XG4gICAgfVxuXG4gICAgc3BsaWNlTGlzdEVudHJ5KG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgc291cmNlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdzb3VyY2UnKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnYXR0cmlidXRlJyk7XG4gICAgICAgIGxldCBmcm9tID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdmcm9tJyk7XG4gICAgICAgIGxldCB0byA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgndG8nKTtcbiAgICAgICAgbGV0IGNvdW50ID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdjb3VudCcpO1xuXG4gICAgICAgIGlmIChleGlzdHMoc291cmNlKSAmJiBleGlzdHMoYXR0cmlidXRlKSAmJiBleGlzdHMoZnJvbSkgJiYgZXhpc3RzKHRvKSAmJiBleGlzdHMoY291bnQpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gdGhpcy5jbGFzc0luZm9zLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICAgICAgbGV0IGJlYW4gPSB0aGlzLmJlYW5Gcm9tRG9scGhpbi5nZXQoc291cmNlLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgZXhpc3RzKGNsYXNzSW5mbykpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgICAgICAvL3ZhciBlbnRyeSA9IGZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlTGlzdCh0aGlzLCB0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIGxldCBuZXdFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50LnZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3RWxlbWVudHMucHVzaCh0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxvY2soYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUsIGZyb20udmFsdWUsIHRvLnZhbHVlIC0gZnJvbS52YWx1ZSwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENsYXNzUmVwb3NpdG9yeS5MT0dHRVIuZXJyb3IoJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQXJyYXlVcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkLiBTb3VyY2UgYmVhbiB1bmtub3duLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwUGFyYW1Ub0RvbHBoaW4ocGFyYW0pIHtcbiAgICAgICAgaWYgKCFleGlzdHMocGFyYW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlb2YgcGFyYW07XG4gICAgICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KHBhcmFtKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBjYW4gYmUgdXNlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ251bWJlcicgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9ubHkgbWFuYWdlZCBEb2xwaGluIEJlYW5zIGFuZCBwcmltaXRpdmUgdHlwZXMgY2FuIGJlIHVzZWRcIik7XG4gICAgfVxuXG4gICAgbWFwRG9scGhpblRvQmVhbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tRG9scGhpbih0aGlzLCBjb25zdHMuRE9MUEhJTl9CRUFOLCB2YWx1ZSk7XG4gICAgfVxufVxuXG5DbGFzc1JlcG9zaXRvcnkuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0NsYXNzUmVwb3NpdG9yeScpO1xuIiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vZXZlbnRCdXMnO1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudEF0dHJpYnV0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpIHtcblxuICAgICAgICB0aGlzLnByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZTtcbiAgICAgICAgdGhpcy5pZCA9IFwiXCIgKyAoQ2xpZW50QXR0cmlidXRlLmNsaWVudEF0dHJpYnV0ZUluc3RhbmNlQ291bnQrKykgKyBcIkNcIjtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIocXVhbGlmaWVyKTtcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IENsaWVudEF0dHJpYnV0ZSh0aGlzLnByb3BlcnR5TmFtZSwgdGhpcy5nZXRRdWFsaWZpZXIoKSwgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBzZXRQcmVzZW50YXRpb25Nb2RlbChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGNhbiBub3Qgc2V0IGEgcHJlc2VudGF0aW9uIG1vZGVsIGZvciBhbiBhdHRyaWJ1dGUgdGhhdCBpcyBhbHJlYWR5IGJvdW5kLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsID0gcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgfVxuXG4gICAgZ2V0UHJlc2VudGF0aW9uTW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsO1xuICAgIH1cblxuICAgIGdldFZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZUZyb21TZXJ2ZXIobmV3VmFsdWUpIHtcbiAgICAgICAgbGV0IHZlcmlmaWVkVmFsdWUgPSBDbGllbnRBdHRyaWJ1dGUuY2hlY2tWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlID09PSB2ZXJpZmllZFZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmVyaWZpZWRWYWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkVmFsdWUsICduZXdWYWx1ZSc6IHZlcmlmaWVkVmFsdWUsICdzZW5kVG9TZXJ2ZXInOiBmYWxzZSB9KTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZShuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgdmVyaWZpZWRWYWx1ZSA9IENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHZlcmlmaWVkVmFsdWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2ZXJpZmllZFZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRWYWx1ZSwgJ25ld1ZhbHVlJzogdmVyaWZpZWRWYWx1ZSwgJ3NlbmRUb1NlcnZlcic6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgc2V0UXVhbGlmaWVyKG5ld1F1YWxpZmllcikge1xuICAgICAgICBpZiAodGhpcy5xdWFsaWZpZXIgPT09IG5ld1F1YWxpZmllcilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IG9sZFF1YWxpZmllciA9IHRoaXMucXVhbGlmaWVyO1xuICAgICAgICB0aGlzLnF1YWxpZmllciA9IG5ld1F1YWxpZmllcjtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFF1YWxpZmllciwgJ25ld1ZhbHVlJzogbmV3UXVhbGlmaWVyIH0pO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyBcIm9sZFZhbHVlXCI6IHRoaXMudmFsdWUsIFwibmV3VmFsdWVcIjogdGhpcy52YWx1ZSwgJ3NlbmRUb1NlcnZlcic6IGZhbHNlIH0pO1xuICAgIH1cblxuICAgIGdldFF1YWxpZmllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbGlmaWVyO1xuICAgIH1cblxuICAgIG9uVmFsdWVDaGFuZ2UoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICBldmVudEhhbmRsZXIoeyBcIm9sZFZhbHVlXCI6IHRoaXMudmFsdWUsIFwibmV3VmFsdWVcIjogdGhpcy52YWx1ZSwgJ3NlbmRUb1NlcnZlcic6IGZhbHNlIH0pO1xuICAgIH1cblxuICAgIG9uUXVhbGlmaWVyQ2hhbmdlKGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgfVxuXG4gICAgc3luY1dpdGgoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgIGlmIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7IC8vIHNlcXVlbmNlIGlzIGltcG9ydGFudFxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGNoZWNrVmFsdWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgU3RyaW5nIHx8IHJlc3VsdCBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgcmVzdWx0IGluc3RhbmNlb2YgTnVtYmVyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIENsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgQ2xpZW50QXR0cmlidXRlLkxPR0dFUi53YXJuKFwiQW4gQXR0cmlidXRlIG1heSBub3QgaXRzZWxmIGNvbnRhaW4gYW4gYXR0cmlidXRlIGFzIGEgdmFsdWUuIEFzc3VtaW5nIHlvdSBmb3Jnb3QgdG8gY2FsbCB2YWx1ZS5cIik7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmNoZWNrVmFsdWUodmFsdWUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvayA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5TVVBQT1JURURfVkFMVUVfVFlQRVMuaW5kZXhPZih0eXBlb2YgcmVzdWx0KSA+IC0xIHx8IHJlc3VsdCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRyaWJ1dGUgdmFsdWVzIG9mIHRoaXMgdHlwZSBhcmUgbm90IGFsbG93ZWQ6IFwiICsgdHlwZW9mIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuXG5DbGllbnRBdHRyaWJ1dGUuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0NsaWVudEF0dHJpYnV0ZScpO1xuQ2xpZW50QXR0cmlidXRlLlNVUFBPUlRFRF9WQUxVRV9UWVBFUyA9IFtcInN0cmluZ1wiLCBcIm51bWJlclwiLCBcImJvb2xlYW5cIl07XG5DbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCA9IDA7XG4iLCJpbXBvcnQgQmxpbmRDb21tYW5kQmF0Y2hlciBmcm9tICcuL2NvbW1hbmRCYXRjaGVyJztcbmltcG9ydCBDb2RlYyBmcm9tICcuL2NvbW1hbmRzL2NvZGVjJztcbmltcG9ydCBDbGllbnRQcmVzZW50YXRpb25Nb2RlbCBmcm9tICcuL2NsaWVudFByZXNlbnRhdGlvbk1vZGVsJ1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENvbm5lY3RvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgc2xhY2tNUyA9IDAsIG1heEJhdGNoU2l6ZSA9IDUwKSB7XG5cbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucHVzaEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHJhbnNtaXR0ZXIgPSB0cmFuc21pdHRlcjtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluID0gY2xpZW50RG9scGhpbjtcbiAgICAgICAgdGhpcy5zbGFja01TID0gc2xhY2tNUztcbiAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBDb2RlYygpO1xuICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3IEJsaW5kQ29tbWFuZEJhdGNoZXIodHJ1ZSwgbWF4QmF0Y2hTaXplKTtcbiAgICB9XG5cbiAgICBzZXRDb21tYW5kQmF0Y2hlcihuZXdCYXRjaGVyKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXdCYXRjaGVyO1xuICAgIH1cblxuICAgIHNldFB1c2hFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgfVxuXG4gICAgc2V0UHVzaExpc3RlbmVyKG5ld0xpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMucHVzaExpc3RlbmVyID0gbmV3TGlzdGVuZXI7XG4gICAgfVxuXG4gICAgc2V0UmVsZWFzZUNvbW1hbmQobmV3Q29tbWFuZCkge1xuICAgICAgICB0aGlzLnJlbGVhc2VDb21tYW5kID0gbmV3Q29tbWFuZDtcbiAgICB9XG5cbiAgICBzZW5kKGNvbW1hbmQsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaCh7IGNvbW1hbmQ6IGNvbW1hbmQsIGhhbmRsZXI6IG9uRmluaXNoZWQgfSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVNlbmRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpOyAvLyB0aGVyZSBpcyBub3QgcG9pbnQgaW4gcmVsZWFzaW5nIGlmIHdlIGRvIG5vdCBzZW5kIGF0bVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZG9TZW5kTmV4dCgpO1xuICAgIH1cblxuICAgIGRvU2VuZE5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbW1hbmRRdWV1ZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wdXNoRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5xdWV1ZVB1c2hDb21tYW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgbGV0IGNtZHNBbmRIYW5kbGVycyA9IHRoaXMuY29tbWFuZEJhdGNoZXIuYmF0Y2godGhpcy5jb21tYW5kUXVldWUpO1xuXG4gICAgICAgIGlmKGNtZHNBbmRIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgY2FsbGJhY2sgPSBjbWRzQW5kSGFuZGxlcnNbY21kc0FuZEhhbmRsZXJzLmxlbmd0aCAtIDFdLmhhbmRsZXI7XG4gICAgICAgICAgICBsZXQgY29tbWFuZHMgPSBjbWRzQW5kSGFuZGxlcnMubWFwKGNhaCA9PiB7IHJldHVybiBjYWguY29tbWFuZDsgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnRyYW5zbWl0KGNvbW1hbmRzLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdG91Y2hlZFBNcyA9IFtdO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdWNoZWQgPSB0aGlzLmhhbmRsZShjb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdWNoZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaGVkUE1zLnB1c2godG91Y2hlZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLm9uRmluaXNoZWQodG91Y2hlZFBNcyk7IC8vIHRvZG86IG1ha2UgdGhlbSB1bmlxdWU/XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kb1NlbmROZXh0KCksIHRoaXMuc2xhY2tNUyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kb1NlbmROZXh0KCksIHRoaXMuc2xhY2tNUyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGUoY29tbWFuZCkge1xuICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gXCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gXCJDcmVhdGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gXCJWYWx1ZUNoYW5nZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09PSBcIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ2xpZW50Q29ubmVjdG9yLkxPR0dFUi5lcnJvcihcIkNhbm5vdCBoYW5kbGUsIHVua25vd24gY29tbWFuZCBcIiArIGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIGxldCBtb2RlbCA9IHRoaXMuY2xpZW50RG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKHNlcnZlckNvbW1hbmQucG1JZCk7XG4gICAgICAgIGlmICghbW9kZWwpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9XG5cbiAgICBoYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICBpZiAodGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYSBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiICBrbm93biB0byB0aGUgY2xpZW50LlwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgbGV0IGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5hdHRyaWJ1dGUoYXR0ci5wcm9wZXJ0eU5hbWUsIGF0dHIucXVhbGlmaWVyLCBhdHRyLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChhdHRyLmlkICYmIGF0dHIuaWQubWF0Y2goXCIuKlMkXCIpKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50QXR0cmlidXRlLmlkID0gYXR0ci5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGNsaWVudFBtID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCwgc2VydmVyQ29tbWFuZC5wbVR5cGUpO1xuICAgICAgICBjbGllbnRQbS5hZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgICBpZiAoc2VydmVyQ29tbWFuZC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgY2xpZW50UG0uY2xpZW50U2lkZU9ubHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuYWRkKGNsaWVudFBtLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi51cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllcihjbGllbnRQbSk7XG4gICAgICAgIHJldHVybiBjbGllbnRQbTtcbiAgICB9XG5cbiAgICBoYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgbGV0IGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBDbGllbnRDb25uZWN0b3IuTE9HR0VSLmVycm9yKFwiYXR0cmlidXRlIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3QgdXBkYXRlIHRvIG5ldyB2YWx1ZSBcIiArIHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpID09PSBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjbGllbnRBdHRyaWJ1dGUuc2V0VmFsdWVGcm9tU2VydmVyKHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBoYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgbGV0IGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGNsaWVudEF0dHJpYnV0ZVtzZXJ2ZXJDb21tYW5kLm1ldGFkYXRhTmFtZV0gPSBzZXJ2ZXJDb21tYW5kLnZhbHVlO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsaXN0ZW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5wdXNoRW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyBwdXNoTGlzdGVuZXIgaXMgc2V0P1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbnF1ZXVlUHVzaENvbW1hbmQoKSB7XG4gICAgICAgIGxldCBtZSA9IHRoaXM7XG4gICAgICAgIHRoaXMud2FpdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgY29tbWFuZDogdGhpcy5wdXNoTGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVyOiB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24gKCkgeyBtZS53YWl0aW5nID0gZmFsc2U7IH0sXG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZERhdGE6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVsZWFzZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLndhaXRpbmcpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMud2FpdGluZyA9IGZhbHNlO1xuICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHJlbGVhc2VDb21tYW5kIGlzIHNldD9cbiAgICAgICAgdGhpcy50cmFuc21pdHRlci5zaWduYWwodGhpcy5yZWxlYXNlQ29tbWFuZCk7XG4gICAgfVxufVxuXG5DbGllbnRDb25uZWN0b3IuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0NsaWVudENvbm5lY3RvcicpOyIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBET0xQSElOX1BMQVRGT1JNX1ZFUlNJT04gfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge21ha2VEb2xwaGlufSBmcm9tICcuL29wZW5Eb2xwaGluLmpzJztcbmltcG9ydCB7ZXhpc3RzLCBjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBMb2dnZXJGYWN0b3J5IH0gZnJvbSAnLi9sb2dnaW5nJztcbmltcG9ydCBDb25uZWN0b3IgZnJvbSAnLi9jb25uZWN0b3InO1xuaW1wb3J0IEJlYW5NYW5hZ2VyIGZyb20gJy4vYmVhbm1hbmFnZXInO1xuaW1wb3J0IENsYXNzUmVwb3NpdG9yeSBmcm9tICcuL2NsYXNzcmVwbyc7XG5pbXBvcnQgQ29udHJvbGxlck1hbmFnZXIgZnJvbSAnLi9jb250cm9sbGVybWFuYWdlcic7XG5pbXBvcnQgQ2xpZW50Q29udGV4dCBmcm9tICcuL2NsaWVudGNvbnRleHQnO1xuaW1wb3J0IFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyIGZyb20gJy4vcGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXInO1xuXG5jbGFzcyBDbGllbnRDb250ZXh0RmFjdG9yeSB7XG5cbiAgICBjcmVhdGUodXJsLCBjb25maWcpe1xuICAgICAgICBjaGVja01ldGhvZCgnY29ubmVjdCh1cmwsIGNvbmZpZyknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh1cmwsICd1cmwnKTtcbiAgICAgICAgQ2xpZW50Q29udGV4dEZhY3RvcnkuTE9HR0VSLmluZm8oJ0RvbHBoaW4gUGxhdGZvcm0gVmVyc2lvbjonICwgRE9MUEhJTl9QTEFURk9STV9WRVJTSU9OKTtcbiAgICAgICAgQ2xpZW50Q29udGV4dEZhY3RvcnkuTE9HR0VSLmRlYnVnKCdDcmVhdGluZyBjbGllbnQgY29udGV4dCcsIHVybCwgY29uZmlnKTtcblxuICAgICAgICBsZXQgYnVpbGRlciA9IG1ha2VEb2xwaGluKCkudXJsKHVybCkucmVzZXQoZmFsc2UpLnNsYWNrTVMoNCkuc3VwcG9ydENPUlModHJ1ZSkubWF4QmF0Y2hTaXplKE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKTtcbiAgICAgICAgaWYgKGV4aXN0cyhjb25maWcpKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGNvbmZpZy5lcnJvckhhbmRsZXIpKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5lcnJvckhhbmRsZXIoY29uZmlnLmVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGNvbmZpZy5oZWFkZXJzSW5mbykgJiYgT2JqZWN0LmtleXMoY29uZmlnLmhlYWRlcnNJbmZvKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5oZWFkZXJzSW5mbyhjb25maWcuaGVhZGVyc0luZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRvbHBoaW4gPSBidWlsZGVyLmJ1aWxkKCk7XG5cbiAgICAgICAgbGV0IHRyYW5zbWl0dGVyID0gbmV3IFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyKHVybCwgY29uZmlnKTtcbiAgICAgICAgdHJhbnNtaXR0ZXIub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjbGllbnRDb250ZXh0LmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9scGhpbi5jbGllbnRDb25uZWN0b3IudHJhbnNtaXR0ZXIgPSB0cmFuc21pdHRlcjtcblxuICAgICAgICBsZXQgY2xhc3NSZXBvc2l0b3J5ID0gbmV3IENsYXNzUmVwb3NpdG9yeShkb2xwaGluKTtcbiAgICAgICAgbGV0IGJlYW5NYW5hZ2VyID0gbmV3IEJlYW5NYW5hZ2VyKGNsYXNzUmVwb3NpdG9yeSk7XG4gICAgICAgIGxldCBjb25uZWN0b3IgPSBuZXcgQ29ubmVjdG9yKHVybCwgZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25maWcpO1xuICAgICAgICBsZXQgY29udHJvbGxlck1hbmFnZXIgPSBuZXcgQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpO1xuXG4gICAgICAgIGxldCBjbGllbnRDb250ZXh0ID0gbmV3IENsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpO1xuXG4gICAgICAgIENsaWVudENvbnRleHRGYWN0b3J5LkxPR0dFUi5kZWJ1ZygnY2xpZW50Q29udGV4dCBjcmVhdGVkIHdpdGgnLCBjbGllbnRDb250ZXh0KTtcblxuICAgICAgICByZXR1cm4gY2xpZW50Q29udGV4dDtcbiAgICB9XG59XG5cbkNsaWVudENvbnRleHRGYWN0b3J5LkxPR0dFUiA9IExvZ2dlckZhY3RvcnkuZ2V0TG9nZ2VyKCdDbGllbnRDb250ZXh0RmFjdG9yeScpO1xuXG5sZXQgY3JlYXRlQ2xpZW50Q29udGV4dCA9IG5ldyBDbGllbnRDb250ZXh0RmFjdG9yeSgpLmNyZWF0ZTtcblxuZXhwb3J0IHsgY3JlYXRlQ2xpZW50Q29udGV4dCwgQ2xpZW50Q29udGV4dEZhY3RvcnkgfTsiLCJpbXBvcnQgQ2xpZW50QXR0cmlidXRlIGZyb20gJy4vY2xpZW50QXR0cmlidXRlJ1xuaW1wb3J0IENsaWVudFByZXNlbnRhdGlvbk1vZGVsIGZyb20gJy4vY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudERvbHBoaW4ge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50Q29ubmVjdG9yKGNsaWVudENvbm5lY3Rvcikge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3RvciA9IGNsaWVudENvbm5lY3RvcjtcbiAgICB9XG5cbiAgICBnZXRDbGllbnRDb25uZWN0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudENvbm5lY3RvcjtcbiAgICB9XG5cbiAgICBzZW5kKGNvbW1hbmQsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChjb21tYW5kLCBvbkZpbmlzaGVkKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2xpZW50QXR0cmlidXRlKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJlc2VudGF0aW9uTW9kZWwoaWQsIHR5cGUsIC4uLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKGlkLCB0eXBlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIG1vZGVsLmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuYWRkKG1vZGVsLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cblxuICAgIHNldENsaWVudE1vZGVsU3RvcmUoY2xpZW50TW9kZWxTdG9yZSkge1xuICAgICAgICB0aGlzLmNsaWVudE1vZGVsU3RvcmUgPSBjbGllbnRNb2RlbFN0b3JlO1xuICAgIH1cblxuICAgIGdldENsaWVudE1vZGVsU3RvcmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudE1vZGVsU3RvcmU7XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkubGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzKCk7XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVscygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKTtcbiAgICB9XG5cbiAgICBmaW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICB9XG5cbiAgICBnZXRBdChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICB9XG5cbiAgICBmaW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICB9XG5cbiAgICBkZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbFRvRGVsZXRlKSB7XG4gICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsVG9EZWxldGUsIHRydWUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVByZXNlbnRhdGlvbk1vZGVsUXVhbGlmaWVyKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIHByZXNlbnRhdGlvbk1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKHNvdXJjZUF0dHJpYnV0ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dHJpYnV0ZVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxBdHRyaWJ1dGVzQnlRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKHRhcmdldEF0dHJpYnV0ZSA9PiB7XG4gICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc2V0VmFsdWUoc291cmNlQXR0cmlidXRlLmdldFZhbHVlKCkpOyAvLyBzaG91bGQgYWx3YXlzIGhhdmUgdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhcnRQdXNoTGlzdGVuaW5nKHB1c2hDb21tYW5kLCByZWxlYXNlQ29tbWFuZCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoTGlzdGVuZXIocHVzaENvbW1hbmQpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRSZWxlYXNlQ29tbWFuZChyZWxlYXNlQ29tbWFuZCk7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKHRydWUpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IubGlzdGVuKCk7XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIHN0b3BQdXNoTGlzdGVuaW5nKCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoRW5hYmxlZChmYWxzZSk7XG4gICAgfVxufSIsImltcG9ydCBBdHRyaWJ1dGUgZnJvbSAnLi9hdHRyaWJ1dGUnXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9ldmVudEJ1cydcbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRzL2NvbW1hbmRGYWN0b3J5JztcbmltcG9ydCB7QURERURfVFlQRSwgUkVNT1ZFRF9UWVBFfSBmcm9tICcuL2NvbnN0YW50cydcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRNb2RlbFN0b3JlIHtcblxuICAgIGNvbnN0cnVjdG9yKGNsaWVudERvbHBoaW4pIHtcblxuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZCA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXMoKTtcbiAgICB9XG5cbiAgICBnZXRDbGllbnREb2xwaGluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnREb2xwaGluO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyQXR0cmlidXRlKGF0dHJpYnV0ZSkge1xuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdoZW5ldmVyIGFuIGF0dHJpYnV0ZSBjaGFuZ2VzIGl0cyB2YWx1ZSwgdGhlIHNlcnZlciBuZWVkcyB0byBiZSBub3RpZmllZFxuICAgICAgICAvLyBhbmQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgd2l0aCB0aGUgc2FtZSBxdWFsaWZpZXIgYXJlIGdpdmVuIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKChldnQpID0+IHtcbiAgICAgICAgICAgIGlmKGV2dC5uZXdWYWx1ZSAhPT0gZXZ0Lm9sZFZhbHVlICYmIGV2dC5zZW5kVG9TZXJ2ZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kID0gQ29tbWFuZEZhY3RvcnkuY3JlYXRlVmFsdWVDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGUuaWQsIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoY29tbWFuZCwgbnVsbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXR0cnMgPSB0aGlzLmZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIoKGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHIgIT09IGF0dHJpYnV0ZSAmJiBhdHRyLmdldFF1YWxpZmllcigpID09PSBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhdHRyLnNldFZhbHVlKGF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgYXR0cmlidXRlLm9uUXVhbGlmaWVyQ2hhbmdlKChldnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChhdHRyaWJ1dGUuaWQsIEF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFksIGV2dC5uZXdWYWx1ZSksIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGQobW9kZWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICBDbGllbnRNb2RlbFN0b3JlLkxPR0dFUi5lcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYSBQTSB3aXRoIGlkIFwiICsgbW9kZWwuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhZGRlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5hZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG5cbiAgICAgICAgICAgIGlmKHNlbmRUb1NlcnZlcikge1xuICAgICAgICAgICAgICAgIGxldCBjb25uZWN0b3IgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCk7XG4gICAgICAgICAgICAgICAgY29ubmVjdG9yLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKG1vZGVsKSwgbnVsbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMudHJpZ2dlcih7ICdldmVudFR5cGUnOiBBRERFRF9UWVBFLCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWRkZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5kZWxldGUobW9kZWwuaWQpO1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogUkVNT1ZFRF9UWVBFLCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIHJlbW92ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgIH1cblxuICAgIGZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIoZmlsdGVyKSB7XG4gICAgICAgIGxldCBtYXRjaGVzID0gW107XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmZvckVhY2goKG1vZGVsKSA9PiB7XG4gICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIoYXR0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGF0dHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfVxuXG4gICAgYWRkUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLnNldCh0eXBlLCBwcmVzZW50YXRpb25Nb2RlbHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHByZXNlbnRhdGlvbk1vZGVscy5pbmRleE9mKG1vZGVsKSA+IC0xKSkge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCB8fCAhKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVzZW50YXRpb25Nb2RlbHMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5zcGxpY2UocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmRlbGV0ZShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGxldCBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMua2V5cygpO1xuICAgICAgICBsZXQgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB3aGlsZSAoIW5leHQuZG9uZSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV4dC52YWx1ZSk7XG4gICAgICAgICAgICBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxzKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGxldCBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMudmFsdWVzKCk7XG4gICAgICAgIGxldCBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHdoaWxlICghbmV4dC5kb25lKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXh0LnZhbHVlKTtcbiAgICAgICAgICAgIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmdldChpZCk7XG4gICAgfVxuXG4gICAgZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgaWYgKCF0eXBlIHx8ICF0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuaGFzKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQodHlwZSkuc2xpY2UoMCk7IC8vIHNsaWNlIGlzIHVzZWQgdG8gY2xvbmUgdGhlIGFycmF5XG4gICAgfVxuXG4gICAgZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwsIG5vdGlmeSkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKG1vZGVsKTtcbiAgICAgICAgICAgIGlmICghbm90aWZ5IHx8IG1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChtb2RlbC5pZCksIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKGlkKTtcbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVCeUlkKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5oYXMoYXR0cmlidXRlLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkLnNldChhdHRyaWJ1dGUuaWQsIGF0dHJpYnV0ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIXRoaXMuYXR0cmlidXRlc1BlcklkLmhhcyhhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQuZGVsZXRlKGF0dHJpYnV0ZS5pZCk7XG4gICAgfVxuXG4gICAgZmluZEF0dHJpYnV0ZUJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlcklkLmdldChpZCk7XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuc2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSwgYXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3BsaWNlKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5kZWxldGUoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRBbGxBdHRyaWJ1dGVzQnlRdWFsaWZpZXIocXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICghcXVhbGlmaWVyIHx8ICF0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuaGFzKHF1YWxpZmllcikpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmdldChxdWFsaWZpZXIpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgIH1cblxuICAgIG9uTW9kZWxTdG9yZUNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbk1vZGVsU3RvcmVDaGFuZ2VGb3JUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KHBtU3RvcmVFdmVudCA9PiB7XG4gICAgICAgICAgICBpZiAocG1TdG9yZUV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9PSBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIocG1TdG9yZUV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5DbGllbnRNb2RlbFN0b3JlLkxPR0dFUiA9IExvZ2dlckZhY3RvcnkuZ2V0TG9nZ2VyKCdDbGllbnRNb2RlbFN0b3JlJyk7XG5cbiIsImltcG9ydCBFdmVudEJ1cyBmcm9tICcuL2V2ZW50QnVzJ1xuXG52YXIgcHJlc2VudGF0aW9uTW9kZWxJbnN0YW5jZUNvdW50ID0gMDsgLy8gdG9kbyBkazogY29uc2lkZXIgbWFraW5nIHRoaXMgc3RhdGljIGluIGNsYXNzXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFByZXNlbnRhdGlvbk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgcHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbFR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3VuZGVmaW5lZCcgJiYgaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pZCA9IChwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQrKykudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRCdXMgPSBuZXcgRXZlbnRCdXMoKTtcbiAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgfVxuICAgIC8vIHRvZG8gZGs6IGFsaWduIHdpdGggSmF2YSB2ZXJzaW9uOiBtb3ZlIHRvIENsaWVudERvbHBoaW4gYW5kIGF1dG8tYWRkIHRvIG1vZGVsIHN0b3JlXG4gICAgLyoqIGEgY29weSBjb25zdHJ1Y3RvciBmb3IgYW55dGhpbmcgYnV0IElEcy4gUGVyIGRlZmF1bHQsIGNvcGllcyBhcmUgY2xpZW50IHNpZGUgb25seSwgbm8gYXV0b21hdGljIHVwZGF0ZSBhcHBsaWVzLiAqL1xuICAgIGNvcHkoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwobnVsbCwgdGhpcy5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICByZXN1bHQuY2xpZW50U2lkZU9ubHkgPSB0cnVlO1xuICAgICAgICB0aGlzLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVDb3B5ID0gYXR0cmlidXRlLmNvcHkoKTtcbiAgICAgICAgICAgIHJlc3VsdC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlQ29weSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvL2FkZCBhcnJheSBvZiBhdHRyaWJ1dGVzXG4gICAgYWRkQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlcyB8fCBhdHRyaWJ1dGVzLmxlbmd0aCA8IDEpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkQXR0cmlidXRlKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAodGhpcy5hdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSA+IC0xKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShhdHRyaWJ1dGUucHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgYWxyZWFkeSBpcyBhbiBhdHRyaWJ1dGUgd2l0aCBwcm9wZXJ0eSBuYW1lOiBcIiArIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVcbiAgICAgICAgICAgICAgICArIFwiIGluIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkOiBcIiArIHRoaXMuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkgJiYgdGhpcy5maW5kQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgYWxyZWFkeSBpcyBhbiBhdHRyaWJ1dGUgd2l0aCBxdWFsaWZpZXI6IFwiICsgYXR0cmlidXRlLmdldFF1YWxpZmllcigpXG4gICAgICAgICAgICAgICAgKyBcIiBpbiBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZDogXCIgKyB0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGUuc2V0UHJlc2VudGF0aW9uTW9kZWwodGhpcyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZEJ1cy50cmlnZ2VyKHsgc291cmNlOiB0aGlzIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25JbnZhbGlkYXRlZChoYW5kbGVJbnZhbGlkYXRlKSB7XG4gICAgICAgIHRoaXMuaW52YWxpZEJ1cy5vbkV2ZW50KGhhbmRsZUludmFsaWRhdGUpO1xuICAgIH1cbiAgICAvKiogcmV0dXJucyBhIGNvcHkgb2YgdGhlIGludGVybmFsIHN0YXRlICovXG4gICAgZ2V0QXR0cmlidXRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy5zbGljZSgwKTtcbiAgICB9XG4gICAgZ2V0QXQocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgIH1cbiAgICBmaW5kQWxsQXR0cmlidXRlc0J5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUucHJvcGVydHlOYW1lID09IHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBmaW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKHRoaXMuYXR0cmlidXRlc1tpXS5wcm9wZXJ0eU5hbWUgPT0gcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllcihxdWFsaWZpZXIpIHtcbiAgICAgICAgaWYgKCFxdWFsaWZpZXIpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uZ2V0UXVhbGlmaWVyKCkgPT0gcXVhbGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZmluZEF0dHJpYnV0ZUJ5SWQoaWQpIHtcbiAgICAgICAgaWYgKCFpZClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlc1tpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN5bmNXaXRoKHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKCh0YXJnZXRBdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VBdHRyaWJ1dGUgPSBzb3VyY2VQcmVzZW50YXRpb25Nb2RlbC5nZXRBdCh0YXJnZXRBdHRyaWJ1dGUucHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc3luY1dpdGgoc291cmNlQXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZW1pdHRlci1jb21wb25lbnQnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnknO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udGV4dHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuTWFuYWdlciwgJ2JlYW5NYW5hZ2VyJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck1hbmFnZXIsICdjb250cm9sbGVyTWFuYWdlcicpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuYmVhbk1hbmFnZXIgPSBiZWFuTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hbmFnZXIgPSBjb250cm9sbGVyTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5jb25uZWN0KCk7XG4gICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgfVxuXG4gICAgb25Db25uZWN0KCl7XG4gICAgICAgIGlmKGV4aXN0cyh0aGlzLmNvbm5lY3Rpb25Qcm9taXNlKSl7XG4gICAgICAgICAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xsZXIobmFtZSl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbHBoaW4uc3RvcFB1c2hMaXN0ZW5pbmcoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlci5kZXN0cm95KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmJlYW5NYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5FbWl0dGVyKENsaWVudENvbnRleHQucHJvdG90eXBlKTsiLCJpbXBvcnQge1ZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCwgUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRH0gZnJvbSAnLi9jb21tYW5kcy9jb21tYW5kQ29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxpbmRDb21tYW5kQmF0Y2hlciB7XG4gICAgY29uc3RydWN0b3IoZm9sZGluZyA9IHRydWUsIG1heEJhdGNoU2l6ZSA9IDUwKSB7XG4gICAgICAgIHRoaXMuZm9sZGluZyA9IGZvbGRpbmc7XG4gICAgICAgIHRoaXMubWF4QmF0Y2hTaXplID0gbWF4QmF0Y2hTaXplO1xuICAgIH1cbiAgICBiYXRjaChxdWV1ZSkge1xuICAgICAgICBsZXQgYmF0Y2ggPSBbXTtcbiAgICAgICAgbGV0IGJhdGNoTGVuZ3RoID0gMDtcbiAgICAgICAgd2hpbGUocXVldWVbYmF0Y2hMZW5ndGhdICYmIGJhdGNoTGVuZ3RoIDw9IHRoaXMubWF4QmF0Y2hTaXplKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gcXVldWVbYmF0Y2hMZW5ndGhdO1xuICAgICAgICAgICAgYmF0Y2hMZW5ndGgrKztcbiAgICAgICAgICAgIGlmKHRoaXMuZm9sZGluZykge1xuICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuY29tbWFuZC5pZCA9PSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQgJiZcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2gubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kLmlkID09IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCAmJlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNvbW1hbmQuYXR0cmlidXRlSWQgPT0gYmF0Y2hbYmF0Y2gubGVuZ3RoIC0gMV0uY29tbWFuZC5hdHRyaWJ1dGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAvL21lcmdlIFZhbHVlQ2hhbmdlIGZvciBzYW1lIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGJhdGNoW2JhdGNoLmxlbmd0aCAtIDFdLmNvbW1hbmQubmV3VmFsdWUgPSBlbGVtZW50LmNvbW1hbmQubmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQuY29tbWFuZC5pZCA9PSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vV2UgZG8gbm90IG5lZWQgaXQuLi5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmF0Y2gucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGVsZW1lbnQuaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlLnNwbGljZSgwLCBiYXRjaExlbmd0aCk7XG4gICAgICAgIHJldHVybiBiYXRjaDtcbiAgICB9XG59IiwiaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0pTX1NUUklOR19UWVBFfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgICBDUkVBVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQsXG4gICAgVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lELFxuICAgIEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQsXG4gICAgQ0FMTF9BQ1RJT05fQ09NTUFORF9JRCxcbiAgICBDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUQsXG4gICAgQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRCxcbiAgICBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lELFxuICAgIERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCxcbiAgICBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRCxcbiAgICBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCxcbiAgICBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQsXG4gICAgUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRCxcbiAgICBTVEFSVF9MT05HX1BPTExfQ09NTUFORF9JRFxufSBmcm9tICcuL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtJRCwgUE1fSUQsIFBNX1RZUEUsIFBNX0FUVFJJQlVURVMsIE5BTUUsIEFUVFJJQlVURV9JRCwgVkFMVUUsIENPTlRST0xMRVJfSUQsIFBBUkFNU30gZnJvbSAnLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCBWYWx1ZUNoYW5nZWRDb21tYW5kIGZyb20gJy4vaW1wbC92YWx1ZUNoYW5nZWRDb21tYW5kJztcbmltcG9ydCBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kIGZyb20gJy4vaW1wbC9hdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kJztcbmltcG9ydCBDYWxsQWN0aW9uQ29tbWFuZCBmcm9tICcuL2ltcGwvY2FsbEFjdGlvbkNvbW1hbmQnO1xuaW1wb3J0IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCBmcm9tICcuL2ltcGwvY2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kJztcbmltcG9ydCBDcmVhdGVDb250ZXh0Q29tbWFuZCBmcm9tICcuL2ltcGwvY3JlYXRlQ29udGV4dENvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQnO1xuaW1wb3J0IERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCBmcm9tICcuL2ltcGwvZGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kJztcbmltcG9ydCBEZXN0cm95Q29udGV4dENvbW1hbmQgZnJvbSAnLi9pbXBsL2Rlc3Ryb3lDb250ZXh0Q29tbWFuZCc7XG5pbXBvcnQgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vaW1wbC9kZXN0cm95Q29udHJvbGxlckNvbW1hbmQnO1xuaW1wb3J0IEludGVycnVwdExvbmdQb2xsQ29tbWFuZCBmcm9tICcuL2ltcGwvaW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kJztcbmltcG9ydCBQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kIGZyb20gJy4vaW1wbC9wcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kJztcbmltcG9ydCBTdGFydExvbmdQb2xsQ29tbWFuZCBmcm9tICcuL2ltcGwvc3RhcnRMb25nUG9sbENvbW1hbmQnO1xuaW1wb3J0IENvZGVjRXJyb3IgZnJvbSAnLi9jb2RlY0Vycm9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlYyB7XG5cbiAgICBzdGF0aWMgX2VuY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuYXR0cmlidXRlSWQsIFwiY29tbWFuZC5hdHRyaWJ1dGVJZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLm1ldGFkYXRhTmFtZSwgXCJjb21tYW5kLm1ldGFkYXRhTmFtZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXSA9IGNvbW1hbmQuYXR0cmlidXRlSWQ7XG4gICAgICAgIGpzb25Db21tYW5kW05BTUVdID0gY29tbWFuZC5tZXRhZGF0YU5hbWU7XG4gICAgICAgIGpzb25Db21tYW5kW1ZBTFVFXSA9IGNvbW1hbmQudmFsdWU7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0sIFwianNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtOQU1FXSwgXCJqc29uQ29tbWFuZFtOQU1FXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuYXR0cmlidXRlSWQgPSBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdO1xuICAgICAgICBjb21tYW5kLm1ldGFkYXRhTmFtZSA9IGpzb25Db21tYW5kW05BTUVdO1xuICAgICAgICBjb21tYW5kLnZhbHVlID0ganNvbkNvbW1hbmRbVkFMVUVdO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZUNhbGxBY3Rpb25Db21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5lbmNvZGVDYWxsQWN0aW9uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5jb250cm9sbGVyaWQsIFwiY29tbWFuZC5jb250cm9sbGVyaWRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hY3Rpb25OYW1lLCBcImNvbW1hbmQuYWN0aW9uTmFtZVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLnBhcmFtcywgXCJjb21tYW5kLnBhcmFtc1wiKTtcblxuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDQUxMX0FDVElPTl9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSA9IGNvbW1hbmQuY29udHJvbGxlcmlkO1xuICAgICAgICBqc29uQ29tbWFuZFtOQU1FXSA9IGNvbW1hbmQuYWN0aW9uTmFtZTtcbiAgICAgICAganNvbkNvbW1hbmRbUEFSQU1TXSA9IGNvbW1hbmQucGFyYW1zLm1hcCgocGFyYW0pID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgIHJlc3VsdFtOQU1FXSA9IHBhcmFtLm5hbWU7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHBhcmFtLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtWQUxVRV0gPSBwYXJhbS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDYWxsQWN0aW9uQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUNhbGxBY3Rpb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdLCBcImpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BBUkFNU10sIFwianNvbkNvbW1hbmRbUEFSQU1TXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDYWxsQWN0aW9uQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmNvbnRyb2xsZXJpZCA9IGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdO1xuICAgICAgICBjb21tYW5kLmFjdGlvbk5hbWUgPSBqc29uQ29tbWFuZFtOQU1FXTtcbiAgICAgICAgLy9UT0RPOiBGw7xyIGRpZSBQYXJhbXMgc29sbHRlbiB3aXIgZWluZSBLbGFzc2UgYmVyZWl0c3RlbGxlblxuICAgICAgICBjb21tYW5kLnBhcmFtcyA9IGpzb25Db21tYW5kW1BBUkFNU10ubWFwKChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6IHBhcmFtW05BTUVdLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhwYXJhbVtWQUxVRV0pID8gcGFyYW1bVkFMVUVdIDogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5lbmNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuYXR0cmlidXRlSWQsIFwiY29tbWFuZC5hdHRyaWJ1dGVJZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLm1ldGFkYXRhTmFtZSwgXCJjb21tYW5kLm1ldGFkYXRhTmFtZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdID0gY29tbWFuZC5hdHRyaWJ1dGVJZDtcbiAgICAgICAganNvbkNvbW1hbmRbTkFNRV0gPSBjb21tYW5kLm1ldGFkYXRhTmFtZTtcbiAgICAgICAganNvbkNvbW1hbmRbVkFMVUVdID0gY29tbWFuZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0sIFwianNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtOQU1FXSwgXCJqc29uQ29tbWFuZFtOQU1FXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVJZCA9IGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF07XG4gICAgICAgIGNvbW1hbmQubWV0YWRhdGFOYW1lID0ganNvbkNvbW1hbmRbTkFNRV07XG4gICAgICAgIGNvbW1hbmQudmFsdWUgPSBqc29uQ29tbWFuZFtWQUxVRV07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNyZWF0ZUNvbnRleHRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDcmVhdGVDb250ZXh0Q29tbWFuZCgpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZW5jb2RlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuY29udHJvbGxlck5hbWUsIFwiY29tbWFuZC5jb250cm9sbGVyTmFtZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ1JFQVRFX0NPTlRST0xMRVJfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbTkFNRV0gPSBjb21tYW5kLmNvbnRyb2xsZXJOYW1lO1xuICAgICAgICBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSA9IGNvbW1hbmQucGFyZW50Q29udHJvbGxlcklkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtOQU1FXSwgXCJqc29uQ29tbWFuZFtOQU1FXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSwgXCJqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDcmVhdGVDb250cm9sbGVyQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmNvbnRyb2xsZXJOYW1lID0ganNvbkNvbW1hbmRbTkFNRV07XG4gICAgICAgIGNvbW1hbmQucGFyZW50Q29udHJvbGxlcklkID0ganNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucG1JZCwgXCJjb21tYW5kLnBtSWRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5wbVR5cGUsIFwiY29tbWFuZC5wbVR5cGVcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbUE1fSURdID0gY29tbWFuZC5wbUlkO1xuICAgICAgICBqc29uQ29tbWFuZFtQTV9UWVBFXSA9IGNvbW1hbmQucG1UeXBlO1xuICAgICAgICBqc29uQ29tbWFuZFtQTV9BVFRSSUJVVEVTXSA9IGNvbW1hbmQuYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgcmVzdWx0W05BTUVdID0gYXR0cmlidXRlLnByb3BlcnR5TmFtZTtcbiAgICAgICAgICAgIHJlc3VsdFtBVFRSSUJVVEVfSURdID0gYXR0cmlidXRlLmlkO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhhdHRyaWJ1dGUudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W1ZBTFVFXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbUE1fSURdLCBcImpzb25Db21tYW5kW1BNX0lEXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtQTV9UWVBFXSwgXCJqc29uQ29tbWFuZFtQTV9UWVBFXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5wbUlkID0ganNvbkNvbW1hbmRbUE1fSURdO1xuICAgICAgICBjb21tYW5kLnBtVHlwZSA9IGpzb25Db21tYW5kW1BNX1RZUEVdO1xuXG4gICAgICAgIC8vVE9ETzogRsO8ciBkaWUgQXR0cmlidXRlIHNvbGx0ZW4gd2lyIGVpbmUgS2xhc3NlIGJlcmVpdHN0ZWxsZW5cbiAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVzID0ganNvbkNvbW1hbmRbUE1fQVRUUklCVVRFU10ubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3Byb3BlcnR5TmFtZSc6IGF0dHJpYnV0ZVtOQU1FXSxcbiAgICAgICAgICAgICAgICAnaWQnOiBhdHRyaWJ1dGVbQVRUUklCVVRFX0lEXSxcbiAgICAgICAgICAgICAgICAndmFsdWUnOiBleGlzdHMoYXR0cmlidXRlW1ZBTFVFXSkgPyBhdHRyaWJ1dGVbVkFMVUVdIDogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZW5jb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLnBtSWQsIFwiY29tbWFuZC5wbUlkXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX0lEXSA9IGNvbW1hbmQucG1JZDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtQTV9JRF0sIFwianNvbkNvbW1hbmRbUE1fSURdXCIpO1xuXG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQucG1JZCA9IGpzb25Db21tYW5kW1BNX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVEZXN0cm95Q29udGV4dENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVEZXN0cm95Q29udGV4dENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlRGVzdHJveUNvbnRleHRDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBEZXN0cm95Q29udGV4dENvbW1hbmQoKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuY29udHJvbGxlcklkLCBcImNvbW1hbmQuY29udHJvbGxlcklkXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF0gPSBjb21tYW5kLmNvbnRyb2xsZXJJZDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSwgXCJqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5jb250cm9sbGVySWQgPSBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZVByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucG1JZCwgXCJjb21tYW5kLnBtSWRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IFBSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX0lEXSA9IGNvbW1hbmQucG1JZDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BNX0lEXSwgXCJqc29uQ29tbWFuZFtQTV9JRF1cIik7XG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLnBtSWQgPSBqc29uQ29tbWFuZFtQTV9JRF07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlU3RhcnRMb25nUG9sbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVTdGFydExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVTdGFydExvbmdQb2xsQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVTdGFydExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBTdGFydExvbmdQb2xsQ29tbWFuZCgpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuYXR0cmlidXRlSWQsIFwiY29tbWFuZC5hdHRyaWJ1dGVJZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdID0gY29tbWFuZC5hdHRyaWJ1dGVJZDtcbiAgICAgICAgaWYgKGV4aXN0cyhjb21tYW5kLm5ld1ZhbHVlKSkge1xuICAgICAgICAgICAganNvbkNvbW1hbmRbVkFMVUVdID0gY29tbWFuZC5uZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdLCBcImpzb25Db21tYW5kW0FUVFJJQlVURV9JRF1cIik7XG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgVmFsdWVDaGFuZ2VkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmF0dHJpYnV0ZUlkID0ganNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXTtcbiAgICAgICAgaWYgKGV4aXN0cyhqc29uQ29tbWFuZFtWQUxVRV0pKSB7XG4gICAgICAgICAgICBjb21tYW5kLm5ld1ZhbHVlID0ganNvbkNvbW1hbmRbVkFMVUVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tbWFuZC5uZXdWYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGVuY29kZShjb21tYW5kcykge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kcywgXCJjb21tYW5kc1wiKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShjb21tYW5kcy5tYXAoKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09PSBBVFRSSUJVVEVfTUVUQURBVEFfQ0hBTkdFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENBTExfQUNUSU9OX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQ2FsbEFjdGlvbkNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9DT05URVhUX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZVByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvZGVjRXJyb3IoJ0NvbW1hbmQgb2YgdHlwZSAnICsgY29tbWFuZC5pZCArICcgY2FuIG5vdCBiZSBoYW5kbGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlKHRyYW5zbWl0dGVkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlXCIpO1xuICAgICAgICBjaGVja1BhcmFtKHRyYW5zbWl0dGVkLCBcInRyYW5zbWl0dGVkXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdHJhbnNtaXR0ZWQgPT09IEpTX1NUUklOR19UWVBFKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0cmFuc21pdHRlZCkubWFwKGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09IEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBDQUxMX0FDVElPTl9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDYWxsQWN0aW9uQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlRGVzdHJveUNvbnRleHRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVTdGFydExvbmdQb2xsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZWNFcnJvcignQ29tbWFuZCBvZiB0eXBlICcgKyBjb21tYW5kLmlkICsgJyBjYW4gbm90IGJlIGhhbmRsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBDb2RlY0Vycm9yKCdDYW4gbm90IGRlY29kZSBkYXRhIHRoYXQgaXMgbm90IG9mIHR5cGUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZWNFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIH1cbn0iLCJleHBvcnQgY29uc3QgQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRCA9ICdBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWQnO1xuZXhwb3J0IGNvbnN0IENBTExfQUNUSU9OX0NPTU1BTkRfSUQgPSAnQ2FsbEFjdGlvbic7XG5leHBvcnQgY29uc3QgQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEID0gJ0NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhJztcbmV4cG9ydCBjb25zdCBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEID0gJ0NyZWF0ZUNvbnRleHQnO1xuZXhwb3J0IGNvbnN0IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQgPSAnQ3JlYXRlQ29udHJvbGxlcic7XG5leHBvcnQgY29uc3QgQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEID0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJztcbmV4cG9ydCBjb25zdCBERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQgPSAnRGVsZXRlUHJlc2VudGF0aW9uTW9kZWwnO1xuZXhwb3J0IGNvbnN0IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEID0gJ0Rlc3Ryb3lDb250ZXh0JztcbmV4cG9ydCBjb25zdCBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCA9ICdEZXN0cm95Q29udHJvbGxlcic7XG5leHBvcnQgY29uc3QgSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX0lEID0gJ0ludGVycnVwdExvbmdQb2xsJztcbmV4cG9ydCBjb25zdCBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEID0gJ1ByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZCc7XG5leHBvcnQgY29uc3QgU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQgPSAnU3RhcnRMb25nUG9sbCc7XG5leHBvcnQgY29uc3QgVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEID0gJ1ZhbHVlQ2hhbmdlZCc7XG5cbmV4cG9ydCBjb25zdCBJRCA9IFwiaWRcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfSUQgPSBcImFfaWRcIjtcbmV4cG9ydCBjb25zdCBQTV9JRCA9IFwicF9pZFwiO1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSUQgPSBcImNfaWRcIjtcbmV4cG9ydCBjb25zdCBQTV9UWVBFID0gXCJ0XCI7XG5leHBvcnQgY29uc3QgTkFNRSA9IFwiblwiO1xuZXhwb3J0IGNvbnN0IFZBTFVFID0gXCJ2XCI7XG5leHBvcnQgY29uc3QgUEFSQU1TID0gXCJwXCI7XG5leHBvcnQgY29uc3QgUE1fQVRUUklCVVRFUyA9IFwiYVwiOyIsImltcG9ydCBDcmVhdGVDb250ZXh0Q29tbWFuZCBmcm9tICcuL2ltcGwvY3JlYXRlQ29udGV4dENvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgQ2FsbEFjdGlvbkNvbW1hbmQgZnJvbSAnLi9pbXBsL2NhbGxBY3Rpb25Db21tYW5kJztcbmltcG9ydCBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9pbXBsL2Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgRGVzdHJveUNvbnRleHRDb21tYW5kIGZyb20gJy4vaW1wbC9kZXN0cm95Q29udGV4dENvbW1hbmQnO1xuaW1wb3J0IFN0YXJ0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9zdGFydExvbmdQb2xsQ29tbWFuZCc7XG5pbXBvcnQgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9pbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCBmcm9tICcuL2ltcGwvY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kJztcbmltcG9ydCBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgZnJvbSAnLi9pbXBsL2RlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCc7XG5pbXBvcnQgUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCBmcm9tICcuL2ltcGwvcHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCc7XG5pbXBvcnQgVmFsdWVDaGFuZ2VkQ29tbWFuZCBmcm9tICcuL2ltcGwvdmFsdWVDaGFuZ2VkQ29tbWFuZCc7XG5pbXBvcnQgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kIGZyb20gJy4vaW1wbC9jaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQnO1xuaW1wb3J0IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9pbXBsL2F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kRmFjdG9yeSB7XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlQ29udGV4dENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQ29udGV4dENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ2FsbEFjdGlvbkNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVySWQpIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGNvbnRyb2xsZXJJZCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGVzdHJveUNvbnRleHRDb21tYW5kKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0YXJ0TG9uZ1BvbGxDb21tYW5kKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChwcmVzZW50YXRpb25Nb2RlbCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocG1JZCkge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQocG1JZCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKHBtSWQpIHtcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQocG1JZCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVWYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZUlkLCBuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBWYWx1ZUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChhdHRyaWJ1dGVJZCwgbmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cbn0iLCJpbXBvcnQge0FUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGF0dHJpYnV0ZUlkLCAnYXR0cmlidXRlSWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtZXRhZGF0YU5hbWUsICdtZXRhZGF0YU5hbWUnKTtcblxuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufSIsImltcG9ydCB7Q0FMTF9BQ1RJT05fQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGxBY3Rpb25Db21tYW5kIHtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENBTExfQUNUSU9OX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcmlkLCAnY29udHJvbGxlcmlkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJpZCA9IGNvbnRyb2xsZXJpZDtcbiAgICAgICAgdGhpcy5hY3Rpb25OYW1lID0gYWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGF0dHJpYnV0ZUlkLCAnYXR0cmlidXRlSWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtZXRhZGF0YU5hbWUsICdtZXRhZGF0YU5hbWUnKTtcblxuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufSIsImltcG9ydCB7Q1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUNvbnRleHRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0NSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVDb250cm9sbGVyQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVDb250cm9sbGVyQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyTmFtZSwgJ2NvbnRyb2xsZXJOYW1lJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVyTmFtZSA9IGNvbnRyb2xsZXJOYW1lO1xuICAgICAgICB0aGlzLnBhcmVudENvbnRyb2xsZXJJZCA9IHBhcmVudENvbnRyb2xsZXJJZDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0NSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJlc2VudGF0aW9uTW9kZWwsICdwcmVzZW50YXRpb25Nb2RlbCcpO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucG1JZCA9IHByZXNlbnRhdGlvbk1vZGVsLmlkO1xuICAgICAgICB0aGlzLnBtVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSB0aGlzO1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogYXR0ci5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgaWQ6IGF0dHIuaWQsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGF0dHIuZ2V0VmFsdWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQge0RFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KHBtSWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0RlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShwbUlkLCAncG1JZCcpO1xuXG4gICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlc3Ryb3lDb250ZXh0Q29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEO1xuICAgIH1cblxufSIsImltcG9ydCB7REVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGNvbnRyb2xsZXJJZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJJZCwgJ2NvbnRyb2xsZXJJZCcpO1xuXG4gICAgICAgIHRoaXMuY29udHJvbGxlcklkID0gY29udHJvbGxlcklkO1xuICAgIH1cblxufSIsImltcG9ydCB7SU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgfVxufSIsImltcG9ydCB7UFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQocG1JZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShwbUlkLCAncG1JZCcpO1xuXG4gICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgfVxufSIsImltcG9ydCB7U1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXJ0TG9uZ1BvbGxDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWYWx1ZUNoYW5nZWRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQoYXR0cmlidXRlSWQsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdWYWx1ZUNoYW5nZWRDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGF0dHJpYnV0ZUlkLCAnYXR0cmlidXRlSWQnKTtcblxuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG59IiwiaW1wb3J0IFByb21pc2UgZnJvbSAnY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRzL2NvbW1hbmRGYWN0b3J5JztcbmltcG9ydCB7QURERURfVFlQRSwgUkVNT1ZFRF9UWVBFfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cblxuY29uc3QgRE9MUEhJTl9CRUFOID0gJ0BAQCBET0xQSElOX0JFQU4gQEBAJztcbmNvbnN0IEFDVElPTl9DQUxMX0JFQU4gPSAnQEBAIENPTlRST0xMRVJfQUNUSU9OX0NBTExfQkVBTiBAQEAnO1xuY29uc3QgSElHSExBTkRFUl9CRUFOID0gJ0BAQCBISUdITEFOREVSX0JFQU4gQEBAJztcbmNvbnN0IERPTFBISU5fTElTVF9TUExJQ0UgPSAnQERQOkxTQCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNID0gJ0BAQCBTT1VSQ0VfU1lTVEVNIEBAQCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCA9ICdjbGllbnQnO1xuY29uc3QgU09VUkNFX1NZU1RFTV9TRVJWRVIgPSAnc2VydmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdG9ye1xuXG4gICAgY29uc3RydWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yKHVybCwgZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25maWcpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odXJsLCAndXJsJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlciA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHRoaXMuaGlnaGxhbmRlclBNUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHNlbGYuaGlnaGxhbmRlclBNUmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5vbk1vZGVsU3RvcmVDaGFuZ2UoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBldmVudC5jbGllbnRQcmVzZW50YXRpb25Nb2RlbDtcbiAgICAgICAgICAgIGxldCBzb3VyY2VTeXN0ZW0gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoU09VUkNFX1NZU1RFTSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHNvdXJjZVN5c3RlbSkgJiYgc291cmNlU3lzdGVtLnZhbHVlID09PSBTT1VSQ0VfU1lTVEVNX1NFUlZFUikge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5ldmVudFR5cGUgPT09IEFEREVEX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsQWRkZWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBSRU1PVkVEX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsUmVtb3ZlZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdGhhdC5kb2xwaGluLnN0YXJ0UHVzaExpc3RlbmluZyhDb21tYW5kRmFjdG9yeS5jcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZCgpLCBDb21tYW5kRmFjdG9yeS5jcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKSk7XG4gICAgfVxuXG4gICAgb25Nb2RlbEFkZGVkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3Iub25Nb2RlbEFkZGVkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICB2YXIgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEFDVElPTl9DQUxMX0JFQU46XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5yZWdpc3RlckNsYXNzKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSElHSExBTkRFUl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxhbmRlclBNUmVzb2x2ZXIobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0xJU1RfU1BMSUNFOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnNwbGljZUxpc3RFbnRyeShtb2RlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kb2xwaGluLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkubG9hZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vZGVsUmVtb3ZlZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yLm9uTW9kZWxSZW1vdmVkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcbiAgICAgICAgbGV0IHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5yZWdpc3RlckNsYXNzKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX1NQTElDRTpcbiAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnVubG9hZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnZva2UoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yLmludm9rZShjb21tYW5kKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsICdjb21tYW5kJyk7XG5cbiAgICAgICAgdmFyIGRvbHBoaW4gPSB0aGlzLmRvbHBoaW47XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgZG9scGhpbi5zZW5kKGNvbW1hbmQsIHtcbiAgICAgICAgICAgICAgICBvbkZpbmlzaGVkOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0SGlnaGxhbmRlclBNKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgU09VUkNFX1NZU1RFTSwgU09VUkNFX1NZU1RFTV9DTElFTlQsIFNPVVJDRV9TWVNURU1fU0VSVkVSLCBBQ1RJT05fQ0FMTF9CRUFOIH07XG4iLCJleHBvcnQgY29uc3QgRE9MUEhJTl9QTEFURk9STV9WRVJTSU9OID0gXCIxLjAuMC1kb2xmaXhcIlxuXG5leHBvcnQgY29uc3QgSlNfU1RSSU5HX1RZUEUgPSAnc3RyaW5nJztcblxuZXhwb3J0IGNvbnN0IERPTFBISU5fQkVBTiA9IDA7XG5leHBvcnQgY29uc3QgQllURSA9IDE7XG5leHBvcnQgY29uc3QgU0hPUlQgPSAyO1xuZXhwb3J0IGNvbnN0IElOVCA9IDM7XG5leHBvcnQgY29uc3QgTE9ORyA9IDQ7XG5leHBvcnQgY29uc3QgRkxPQVQgPSA1O1xuZXhwb3J0IGNvbnN0IERPVUJMRSA9IDY7XG5leHBvcnQgY29uc3QgQk9PTEVBTiA9IDc7XG5leHBvcnQgY29uc3QgU1RSSU5HID0gODtcbmV4cG9ydCBjb25zdCBEQVRFID0gOTtcbmV4cG9ydCBjb25zdCBFTlVNID0gMTA7XG5leHBvcnQgY29uc3QgQ0FMRU5EQVIgPSAxMTtcbmV4cG9ydCBjb25zdCBMT0NBTF9EQVRFX0ZJRUxEX1RZUEUgPSA1NTtcbmV4cG9ydCBjb25zdCBMT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRSA9IDUyO1xuZXhwb3J0IGNvbnN0IFpPTkVEX0RBVEVfVElNRV9GSUVMRF9UWVBFID0gNTQ7XG5cblxuZXhwb3J0IGNvbnN0IEFEREVEX1RZUEUgPSBcIkFEREVEXCI7XG5leHBvcnQgY29uc3QgUkVNT1ZFRF9UWVBFID0gXCJSRU1PVkVEXCI7XG4iLCJpbXBvcnQgUHJvbWlzZSBmcm9tICdjb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQgU2V0IGZyb20nY29yZS1qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5pbXBvcnQgQ29udHJvbGxlclByb3h5IGZyb20gJy4vY29udHJvbGxlcnByb3h5LmpzJztcblxuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnkuanMnO1xuXG5cbmltcG9ydCB7IFNPVVJDRV9TWVNURU0gfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgeyBTT1VSQ0VfU1lTVEVNX0NMSUVOVCB9IGZyb20gJy4vY29ubmVjdG9yLmpzJztcbmltcG9ydCB7IEFDVElPTl9DQUxMX0JFQU4gfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5cbmNvbnN0IENPTlRST0xMRVJfSUQgPSAnY29udHJvbGxlcklkJztcbmNvbnN0IE1PREVMID0gJ21vZGVsJztcbmNvbnN0IEVSUk9SX0NPREUgPSAnZXJyb3JDb2RlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlck1hbmFnZXJ7XG5cbiAgICBjb25zdHJ1Y3Rvcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3Rvcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3RvciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmNvbm5lY3RvciA9IGNvbm5lY3RvcjtcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250cm9sbGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgbnVsbClcbiAgICB9XG5cbiAgICBfY3JlYXRlQ29udHJvbGxlcihuYW1lLCBwYXJlbnRDb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJJZCwgbW9kZWxJZCwgbW9kZWwsIGNvbnRyb2xsZXI7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuZ2V0SGlnaGxhbmRlclBNKCkudGhlbigoaGlnaGxhbmRlclBNKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKG5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVySWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsSWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKE1PREVMKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IHNlbGYuY2xhc3NSZXBvc2l0b3J5Lm1hcERvbHBoaW5Ub0JlYW4obW9kZWxJZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlclByb3h5KGNvbnRyb2xsZXJJZCwgbW9kZWwsIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnRyb2xsZXJzLmFkZChjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbnZva2VBY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmludm9rZUFjdGlvbihjb250cm9sbGVySWQsIGFjdGlvbk5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xuXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKFNPVVJDRV9TWVNURU0sIG51bGwsIFNPVVJDRV9TWVNURU1fQ0xJRU5UKSxcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKEVSUk9SX0NPREUpXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBsZXQgcG0gPSBzZWxmLmRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoc2VsZi5kb2xwaGluLCBbbnVsbCwgQUNUSU9OX0NBTExfQkVBTl0uY29uY2F0KGF0dHJpYnV0ZXMpKTtcblxuICAgICAgICAgICAgbGV0IGFjdGlvblBhcmFtcyA9IFtdO1xuICAgICAgICAgICAgaWYoZXhpc3RzKHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwYXJhbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHNlbGYuY2xhc3NSZXBvc2l0b3J5Lm1hcFBhcmFtVG9Eb2xwaGluKHBhcmFtc1twYXJhbV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUGFyYW1zLnB1c2goe25hbWU6IHBhcmFtLCB2YWx1ZTogdmFsdWV9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgYWN0aW9uUGFyYW1zKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGlzRXJyb3IgPSBwbS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoRVJST1JfQ09ERSkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiU2VydmVyIHNpZGUgQ29udHJvbGxlckFjdGlvbiBcIiArIGFjdGlvbk5hbWUgKyBcIiBjYXVzZWQgYW4gZXJyb3IuIFBsZWFzZSBzZWUgc2VydmVyIGxvZyBmb3IgZGV0YWlscy5cIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKHBtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5kZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXIsICdjb250cm9sbGVyJyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udHJvbGxlcnMuZGVsZXRlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgICAgIGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9JRCkuc2V0VmFsdWUoY29udHJvbGxlci5jb250cm9sbGVySWQpO1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlci5nZXRJZCgpKSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBsZXQgY29udHJvbGxlcnNDb3B5ID0gdGhpcy5jb250cm9sbGVycztcbiAgICAgICAgbGV0IHByb21pc2VzID0gW107XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGNvbnRyb2xsZXJzQ29weS5mb3JFYWNoKChjb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goY29udHJvbGxlci5kZXN0cm95KCkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgU2V0IGZyb20gJ2NvcmUtanMvbGlicmFyeS9mbi9zZXQnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBMb2dnZXJGYWN0b3J5IH0gZnJvbSAnLi9sb2dnaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlclByb3h5IHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5KGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBjaGVja1BhcmFtKG1hbmFnZXIsICdtYW5hZ2VyJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVySWQgPSBjb250cm9sbGVySWQ7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIGdldE1vZGVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbDtcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcklkO1xuICAgIH1cblxuICAgIGludm9rZShuYW1lLCBwYXJhbXMpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lmludm9rZShuYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRyb2xsZXIgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5pbnZva2VBY3Rpb24odGhpcy5jb250cm9sbGVySWQsIG5hbWUsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgdGhpcy5nZXRJZCgpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCl7XG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyUHJveHkuTE9HR0VSLmVycm9yKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkRlc3Ryb3llZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmRlc3Ryb3lDb250cm9sbGVyKHRoaXMpO1xuICAgIH1cblxuICAgIG9uRGVzdHJveWVkKGhhbmRsZXIpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lm9uRGVzdHJveWVkKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5hZGQoaGFuZGxlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYub25EZXN0cm95ZWRIYW5kbGVycy5kZWxldGUoaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5Db250cm9sbGVyUHJveHkuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ0NvbnRyb2xsZXJQcm94eScpO1xuIiwiaW1wb3J0IENsaWVudENvbm5lY3RvciBmcm9tICcuL2NsaWVudENvbm5lY3RvcidcbmltcG9ydCBDbGllbnREb2xwaGluIGZyb20gJy4vY2xpZW50RG9scGhpbidcbmltcG9ydCBDbGllbnRNb2RlbFN0b3JlIGZyb20gJy4vY2xpZW50TW9kZWxTdG9yZSdcbmltcG9ydCBIdHRwVHJhbnNtaXR0ZXIgZnJvbSAnLi9odHRwVHJhbnNtaXR0ZXInXG5pbXBvcnQgTm9UcmFuc21pdHRlciBmcm9tICcuL25vVHJhbnNtaXR0ZXInXG5pbXBvcnQgeyBMb2dnZXJGYWN0b3J5IH0gZnJvbSAnLi9sb2dnaW5nJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb2xwaGluQnVpbGRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXNldF8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zbGFja01TXyA9IDMwMDtcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemVfID0gNTA7XG4gICAgICAgIHRoaXMuc3VwcG9ydENPUlNfID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdXJsKHVybCkge1xuICAgICAgICB0aGlzLnVybF8gPSB1cmw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlc2V0KHJlc2V0KSB7XG4gICAgICAgIHRoaXMucmVzZXRfID0gcmVzZXQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNsYWNrTVMoc2xhY2tNUykge1xuICAgICAgICB0aGlzLnNsYWNrTVNfID0gc2xhY2tNUztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbWF4QmF0Y2hTaXplKG1heEJhdGNoU2l6ZSkge1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSBtYXhCYXRjaFNpemU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN1cHBvcnRDT1JTKHN1cHBvcnRDT1JTKSB7XG4gICAgICAgIHRoaXMuc3VwcG9ydENPUlNfID0gc3VwcG9ydENPUlM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGVycm9ySGFuZGxlcihlcnJvckhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXJfID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoZWFkZXJzSW5mbyhoZWFkZXJzSW5mbykge1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvXyA9IGhlYWRlcnNJbmZvO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgICAgbGV0IGNsaWVudERvbHBoaW4gPSBuZXcgQ2xpZW50RG9scGhpbigpO1xuICAgICAgICBsZXQgdHJhbnNtaXR0ZXI7XG4gICAgICAgIGlmICh0aGlzLnVybF8gIT0gbnVsbCAmJiB0aGlzLnVybF8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdHJhbnNtaXR0ZXIgPSBuZXcgSHR0cFRyYW5zbWl0dGVyKHRoaXMudXJsXywgdGhpcy5yZXNldF8sIFwiVVRGLThcIiwgdGhpcy5lcnJvckhhbmRsZXJfLCB0aGlzLnN1cHBvcnRDT1JTXywgdGhpcy5oZWFkZXJzSW5mb18pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNtaXR0ZXIgPSBuZXcgTm9UcmFuc21pdHRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50Q29ubmVjdG9yKG5ldyBDbGllbnRDb25uZWN0b3IodHJhbnNtaXR0ZXIsIGNsaWVudERvbHBoaW4sIHRoaXMuc2xhY2tNU18sIHRoaXMubWF4QmF0Y2hTaXplXykpO1xuICAgICAgICBjbGllbnREb2xwaGluLnNldENsaWVudE1vZGVsU3RvcmUobmV3IENsaWVudE1vZGVsU3RvcmUoY2xpZW50RG9scGhpbikpO1xuICAgICAgICBEb2xwaGluQnVpbGRlci5MT0dHRVIuZGVidWcoXCJDbGllbnREb2xwaGluIGluaXRpYWxpemVkXCIsIGNsaWVudERvbHBoaW4sIHRyYW5zbWl0dGVyKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudERvbHBoaW47XG4gICAgfVxufVxuXG5Eb2xwaGluQnVpbGRlci5MT0dHRVIgPSBMb2dnZXJGYWN0b3J5LmdldExvZ2dlcignRG9scGhpbkJ1aWxkZXInKTsiLCJleHBvcnQgY2xhc3MgRG9scGhpblJlbW90aW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnUmVtb3RpbmcgRXJyb3InLCBkZXRhaWwpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLmRldGFpbCA9IGRldGFpbCB8fCB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvbHBoaW5TZXNzaW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnU2Vzc2lvbiBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cFJlc3BvbnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnSHR0cCBSZXNwb25zZSBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ0h0dHAgTmV0d29yayBFcnJvcicpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50QnVzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBvbkV2ZW50KGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH1cblxuICAgIHRyaWdnZXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLmZvckVhY2goaGFuZGxlID0+IGhhbmRsZShldmVudCkpO1xuICAgIH1cbn0iLCJpbXBvcnQgQ29kZWMgZnJvbSAnLi9jb21tYW5kcy9jb2RlYydcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdHRwVHJhbnNtaXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IodXJsLCByZXNldCA9IHRydWUsIGNoYXJzZXQgPSBcIlVURi04XCIsIGVycm9ySGFuZGxlciA9IG51bGwsIHN1cHBvcnRDT1JTID0gZmFsc2UsIGhlYWRlcnNJbmZvID0gbnVsbCkge1xuXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmNoYXJzZXQgPSBjaGFyc2V0O1xuICAgICAgICB0aGlzLkh0dHBDb2RlcyA9IHtcbiAgICAgICAgICAgIGZpbmlzaGVkOiA0LFxuICAgICAgICAgICAgc3VjY2VzczogMjAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICB0aGlzLnN1cHBvcnRDT1JTID0gc3VwcG9ydENPUlM7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm8gPSBoZWFkZXJzSW5mbztcbiAgICAgICAgdGhpcy5odHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuc2lnID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIGlmICh0aGlzLnN1cHBvcnRDT1JTKSB7XG4gICAgICAgICAgICBpZiAoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB0aGlzLmh0dHApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHAud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTsgLy8gTk9URTogZG9pbmcgdGhpcyBmb3Igbm9uIENPUlMgcmVxdWVzdHMgaGFzIG5vIGltcGFjdFxuICAgICAgICAgICAgICAgIHRoaXMuc2lnLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBDb2RlYygpO1xuICAgICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgICAgIEh0dHBUcmFuc21pdHRlci5MT0dHRVIuZXJyb3IoJ0h0dHBUcmFuc21pdHRlci5pbnZhbGlkYXRlKCkgaXMgZGVwcmVjYXRlZC4gVXNlIENsaWVudERvbHBoaW4ucmVzZXQoT25TdWNjZXNzSGFuZGxlcikgaW5zdGVhZCcpO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cmFuc21pdChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgIHRoaXMuaHR0cC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcignb25lcnJvcicsIFwiXCIpO1xuICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5odHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmh0dHAucmVhZHlTdGF0ZSA9PT0gdGhpcy5IdHRwQ29kZXMuZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5odHRwLnN0YXR1cyA9PT0gdGhpcy5IdHRwQ29kZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VUZXh0ID0gdGhpcy5odHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVGV4dC50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VDb21tYW5kcyA9IHRoaXMuY29kZWMuZGVjb2RlKHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKHJlc3BvbnNlQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh0dHBUcmFuc21pdHRlci5MT0dHRVIuZXJyb3IoXCJFcnJvciBvY2N1cnJlZCBwYXJzaW5nIHJlc3BvbnNlVGV4dDogXCIsIGVyciwgcmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiArIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IGVtcHR5IHJlc3BvbnNlVGV4dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICB0aGlzLnNldEhlYWRlcnModGhpcy5odHRwKTtcbiAgICAgICAgaWYgKFwib3ZlcnJpZGVNaW1lVHlwZVwiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgdGhpcy5odHRwLm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVwiICsgdGhpcy5jaGFyc2V0KTsgLy8gdG9kbyBtYWtlIGluamVjdGFibGVcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5jb2RlZENvbW1hbmRzID0gdGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRzXSk7XG4gICAgICAgIEh0dHBUcmFuc21pdHRlci5MT0dHRVIudHJhY2UoJ3RyYW5zbWl0dGluZycsIGNvbW1hbmRzLCBlbmNvZGVkQ29tbWFuZHMpO1xuICAgICAgICB0aGlzLmh0dHAuc2VuZChlbmNvZGVkQ29tbWFuZHMpO1xuICAgIH1cblxuICAgIHNldEhlYWRlcnMoaHR0cFJlcSkge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLmhlYWRlcnNJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUVycm9yKGtpbmQsIG1lc3NhZ2UpIHtcbiAgICAgICAgbGV0IGVycm9yRXZlbnQgPSB7IGtpbmQ6IGtpbmQsIHVybDogdGhpcy51cmwsIGh0dHBTdGF0dXM6IHRoaXMuaHR0cC5zdGF0dXMsIG1lc3NhZ2U6IG1lc3NhZ2UgfTtcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlcihlcnJvckV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIEh0dHBUcmFuc21pdHRlci5MT0dHRVIuZXJyb3IoXCJFcnJvciBvY2N1cnJlZDogXCIsIGVycm9yRXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2lnbmFsKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5zaWcub3BlbignUE9TVCcsIHRoaXMudXJsLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKHRoaXMuc2lnKTtcbiAgICAgICAgbGV0IGVuY29kZWRDb21tYW5kID0gdGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRdKTtcbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi50cmFjZSgnc2lnbmFsJywgY29tbWFuZCwgZW5jb2RlZENvbW1hbmQpO1xuICAgICAgICB0aGlzLnNpZy5zZW5kKGVuY29kZWRDb21tYW5kKTtcbiAgICB9XG5cbiAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICB0aGlzLmh0dHAub3BlbignUE9TVCcsIHRoaXMudXJsICsgJ2ludmFsaWRhdGU/JywgZmFsc2UpO1xuICAgICAgICB0aGlzLmh0dHAuc2VuZCgpO1xuICAgIH1cbn1cblxuSHR0cFRyYW5zbWl0dGVyLkxPR0dFUiA9IExvZ2dlckZhY3RvcnkuZ2V0TG9nZ2VyKCdIdHRwVHJhbnNtaXR0ZXInKTsiLCJjb25zdCBMb2dMZXZlbCA9IHtcbiAgICBOT05FOiB7IG5hbWU6ICdOT05FJywgdGV4dDogJ1tOT05FIF0nLCBsZXZlbDogMCB9LFxuICAgIEFMTDogeyBuYW1lOiAnQUxMJywgdGV4dDogJ1tBTEwgIF0nLCBsZXZlbDogMTAwIH0sXG4gICAgVFJBQ0U6IHsgbmFtZTogJ1RSQUNFJywgdGV4dDogJ1tUUkFDRV0nLCBsZXZlbDogNSB9LFxuICAgIERFQlVHOiB7IG5hbWU6ICdERUJVRycsIHRleHQ6ICdbREVCVUddJywgbGV2ZWw6IDQgfSxcbiAgICBJTkZPOiB7IG5hbWU6ICdJTkZPJywgdGV4dDogJ1tJTkZPIF0nLCBsZXZlbDogMyB9LFxuICAgIFdBUk46IHsgbmFtZTogJ1dBUk4nLCB0ZXh0OiAnW1dBUk4gXScsIGxldmVsOiAyIH0sXG4gICAgRVJST1I6IHsgbmFtZTogJ0VSUk9SJywgdGV4dDogJ1tFUlJPUl0nLCBsZXZlbDogMSB9XG59O1xuXG5leHBvcnQgeyBMb2dMZXZlbCB9O1xuIiwiaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IExvZ2dlckZhY3RvcnkgfSBmcm9tIFwiLi9sb2dnZXJmYWN0b3J5XCI7XG5cbmV4cG9ydCB7IExvZ0xldmVsLCBMb2dnZXJGYWN0b3J5IH07IiwiaW1wb3J0IHtjaGVja1BhcmFtLCBleGlzdHN9IGZyb20gJy4uL3V0aWxzJ1xuaW1wb3J0IHsgTG9nTGV2ZWwgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuLy8gcHJpdmF0ZSBtZXRob2RzXG5jb25zdCBMT0NBTFMgPSB7XG4gICAgcGFkICh0ZXh0LCBzaXplKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAnJyArIHRleHQ7XG4gICAgICAgIHdoaWxlIChyZXN1bHQubGVuZ3RoIDwgc2l6ZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gJzAnICsgcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBpbnRlcm5hbExvZyAoKSB7XG4gICAgICAgIGxldCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICAgICAgICBsZXQgZnVuYyA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGxldCBsb2dMZXZlbCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBsZXQgZGF0ZVN0cmluZyA9ICBkYXRlLmdldEZ1bGxZZWFyKCkgKyAnLScgKyBMT0NBTFMucGFkKGRhdGUuZ2V0TW9udGgoKSwgMikgKyAnLScgKyBMT0NBTFMucGFkKGRhdGUuZ2V0RGF0ZSgpLCAyKSArICcgJyArIExPQ0FMUy5wYWQoZGF0ZS5nZXRIb3VycygpLCAyKSArICc6JyArIExPQ0FMUy5wYWQoZGF0ZS5nZXRNaW51dGVzKCksIDIpICsgJzonICsgTE9DQUxTLnBhZChkYXRlLmdldFNlY29uZHMoKSwgMikgKyAnLicgKyBMT0NBTFMucGFkKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCksIDMpO1xuICAgICAgICBmdW5jKGRhdGVTdHJpbmcsIGxvZ0xldmVsLnRleHQsIGNvbnRleHQsIC4uLmFyZ3MpO1xuXG4gICAgfSxcbiAgICBnZXRDb29raWUgKG5hbWUpIHtcbiAgICAgICAgaWYgKGV4aXN0cyh3aW5kb3cpICYmIGV4aXN0cyh3aW5kb3cuZG9jdW1lbnQpICYmIGV4aXN0cyh3aW5kb3cuZG9jdW1lbnQuY29va2llKSkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gJzsgJyArIGRvY3VtZW50LmNvb2tpZTtcbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IHZhbHVlLnNwbGl0KCc7ICcgKyBuYW1lICsgJz0nKTtcbiAgICAgICAgICAgIGlmICggcGFydHMubGVuZ3RoID09PSAyICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJ0cy5wb3AoKS5zcGxpdCgnOycpLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbi8vIHB1YmxpY1xuY2xhc3MgTG9nZ2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQsIHJvb3RMb2dnZXIpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5yb290TG9nZ2VyID0gcm9vdExvZ2dlcjtcbiAgICAgICAgbGV0IGNvb2tpZUxvZ0xldmVsID0gTE9DQUxTLmdldENvb2tpZSgnRE9MUEhJTl9QTEFURk9STV8nICsgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgc3dpdGNoIChjb29raWVMb2dMZXZlbCkge1xuICAgICAgICAgICAgY2FzZSAnTk9ORSc6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsLk5PTkU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdBTEwnOlxuICAgICAgICAgICAgICAgIHRoaXMubG9nTGV2ZWwgPSBMb2dMZXZlbC5BTEw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdUUkFDRSc6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsLlRSQUNFO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnREVCVUcnOlxuICAgICAgICAgICAgICAgIHRoaXMubG9nTGV2ZWwgPSBMb2dMZXZlbC5ERUJVRztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0lORk8nOlxuICAgICAgICAgICAgICAgIHRoaXMubG9nTGV2ZWwgPSBMb2dMZXZlbC5JTkZPO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnV0FSTic6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsLldBUk47XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdFUlJPUic6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsLkVSUk9SO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICB0cmFjZSgpIHtcbiAgICAgICAgaWYgKGV4aXN0cyhjb25zb2xlKSAmJiB0aGlzLmlzTG9nTGV2ZWwoTG9nTGV2ZWwuVFJBQ0UpKSB7XG4gICAgICAgICAgICBMT0NBTFMuaW50ZXJuYWxMb2coY29uc29sZS5sb2csIHRoaXMuY29udGV4dCwgTG9nTGV2ZWwuVFJBQ0UsIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWJ1ZygpIHtcbiAgICAgICAgaWYgKGV4aXN0cyhjb25zb2xlKSAmJiB0aGlzLmlzTG9nTGV2ZWwoTG9nTGV2ZWwuREVCVUcpKSB7XG4gICAgICAgICAgICBMT0NBTFMuaW50ZXJuYWxMb2coY29uc29sZS5sb2csIHRoaXMuY29udGV4dCwgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbmZvKCkge1xuICAgICAgICBpZiAoZXhpc3RzKGNvbnNvbGUpICYmIHRoaXMuaXNMb2dMZXZlbChMb2dMZXZlbC5JTkZPKSkge1xuICAgICAgICAgICAgTE9DQUxTLmludGVybmFsTG9nKGNvbnNvbGUubG9nLCB0aGlzLmNvbnRleHQsIExvZ0xldmVsLklORk8sIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3YXJuKCkge1xuICAgICAgICBpZiAoZXhpc3RzKGNvbnNvbGUpICYmIHRoaXMuaXNMb2dMZXZlbChMb2dMZXZlbC5XQVJOKSkge1xuICAgICAgICAgICAgTE9DQUxTLmludGVybmFsTG9nKGNvbnNvbGUud2FybiwgdGhpcy5jb250ZXh0LCBMb2dMZXZlbC5XQVJOLCAuLi5hcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJyb3IoKSB7XG4gICAgICAgIGlmIChleGlzdHMoY29uc29sZSkgJiYgdGhpcy5pc0xvZ0xldmVsKExvZ0xldmVsLkVSUk9SKSkge1xuICAgICAgICAgICAgTE9DQUxTLmludGVybmFsTG9nKGNvbnNvbGUuZXJyb3IsIHRoaXMuY29udGV4dCwgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMb2dMZXZlbCgpIHtcbiAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmxvZ0xldmVsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9nTGV2ZWw7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhpc3RzKHRoaXMucm9vdExvZ2dlcikpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvb3RMb2dnZXIuZ2V0TG9nTGV2ZWwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBMb2dMZXZlbC5UUkFDRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExvZ0xldmVsKGxldmVsKSB7XG4gICAgICAgIHRoaXMubG9nTGV2ZWwgPSBsZXZlbDtcbiAgICB9XG5cbiAgICBzZXRMb2dMZXZlbEJ5TmFtZShsZXZlbE5hbWUpIHtcbiAgICAgICAgaWYgKGV4aXN0cyhMb2dMZXZlbFtsZXZlbE5hbWVdKSkge1xuICAgICAgICAgICAgdGhpcy5sb2dMZXZlbCA9IExvZ0xldmVsW2xldmVsTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0xvZ0xldmVsKGxldmVsKSB7XG4gICAgICAgIGlmICh0aGlzLmdldExvZ0xldmVsKCkgPT09IExvZ0xldmVsLk5PTkUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRMb2dMZXZlbCgpID09PSBMb2dMZXZlbC5BTEwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldExvZ0xldmVsKCkgPT09IExvZ0xldmVsLlRSQUNFKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRMb2dMZXZlbCgpID09PSBMb2dMZXZlbC5ERUJVRyAmJiBsZXZlbCAhPT0gTG9nTGV2ZWwuVFJBQ0UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldExvZ0xldmVsKCkgPT09IExvZ0xldmVsLklORk8gJiYgbGV2ZWwgIT09IExvZ0xldmVsLlRSQUNFICYmIGxldmVsICE9PSBMb2dMZXZlbC5ERUJVRykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0TG9nTGV2ZWwoKSA9PT0gTG9nTGV2ZWwuV0FSTiAmJiBsZXZlbCAhPT0gTG9nTGV2ZWwuVFJBQ0UgJiYgbGV2ZWwgIT09IExvZ0xldmVsLkRFQlVHICYmIGxldmVsICE9PSBMb2dMZXZlbC5JTkZPKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRMb2dMZXZlbCgpID09PSBMb2dMZXZlbC5FUlJPUiAmJiBsZXZlbCAhPT0gTG9nTGV2ZWwuVFJBQ0UgJiYgbGV2ZWwgIT09IExvZ0xldmVsLkRFQlVHICYmIGxldmVsICE9PSBMb2dMZXZlbC5JTkZPICYmIGxldmVsICE9PSBMb2dMZXZlbC5XQVJOKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNMb2dMZXZlbFVzZWFibGUobGV2ZWwpIHtcbiAgICAgICAgY2hlY2tQYXJhbShsZXZlbCwgJ2xldmVsJyk7XG4gICAgICAgIGlmIChsZXZlbC5sZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TG9nTGV2ZWwoKS5sZXZlbCA+PSBsZXZlbC5sZXZlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTG9nZ2VyIH07XG4iLCJpbXBvcnQgIE1hcCBmcm9tICdjb3JlLWpzL2xpYnJhcnkvZm4vbWFwJztcbmltcG9ydCB7IGV4aXN0cyB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XG5cbmNvbnN0IFJPT1RfTE9HR0VSID0gbmV3IExvZ2dlcignUk9PVCcpO1xuXG4vLyBwcml2YXRlIG1ldGhvZHNcbmNvbnN0IExPQ0FMUyA9IHtcbiAgICBsb2dnZXJzOiBuZXcgTWFwKClcbn07XG5cblxuLy8gcHVibGljXG5jbGFzcyBMb2dnZXJGYWN0b3J5IHtcblxuICAgIHN0YXRpYyBnZXRMb2dnZXIoY29udGV4dCkge1xuICAgICAgICBpZiAoIWV4aXN0cyhjb250ZXh0KSB8fCBjb250ZXh0ID09PSAnUk9PVCcpIHtcbiAgICAgICAgICAgIHJldHVybiBST09UX0xPR0dFUjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZXhpc3RpbmdMb2dnZXIgPSBMT0NBTFMubG9nZ2Vycy5nZXQoY29udGV4dCk7XG4gICAgICAgIGlmIChleGlzdGluZ0xvZ2dlcikge1xuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nTG9nZ2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxvZ2dlciA9IG5ldyBMb2dnZXIoY29udGV4dCwgUk9PVF9MT0dHRVIpO1xuICAgICAgICBMT0NBTFMubG9nZ2Vycy5zZXQoY29udGV4dCwgbG9nZ2VyKTtcbiAgICAgICAgcmV0dXJuIGxvZ2dlcjtcbiAgICB9XG59XG5cbmV4cG9ydCB7IExvZ2dlckZhY3RvcnkgfSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vVHJhbnNtaXR0ZXIge1xuXG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nIHNwZWNpYWxcbiAgICAgICAgb25Eb25lKFtdKTtcbiAgICB9XG5cbiAgICBzaWduYWwoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH1cbn0iLCJpbXBvcnQgRG9scGhpbkJ1aWxkZXIgZnJvbSAnLi9kb2xwaGluQnVpbGRlcidcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbHBoaW4odXJsLCByZXNldCwgc2xhY2tNUyA9IDMwMCkge1xuICAgIHJldHVybiBtYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KHJlc2V0KS5zbGFja01TKHNsYWNrTVMpLmJ1aWxkKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRG9scGhpbigpIHtcbiAgICByZXR1cm4gbmV3IERvbHBoaW5CdWlsZGVyKCk7XG59IiwiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZW1pdHRlci1jb21wb25lbnQnO1xuXG5cbmltcG9ydCB7IGV4aXN0cyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRG9scGhpblJlbW90aW5nRXJyb3IsIEh0dHBOZXR3b3JrRXJyb3IsIERvbHBoaW5TZXNzaW9uRXJyb3IsIEh0dHBSZXNwb25zZUVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IENvZGVjIGZyb20gJy4vY29tbWFuZHMvY29kZWMnO1xuaW1wb3J0IFJlbW90aW5nRXJyb3JIYW5kbGVyIGZyb20gJy4vcmVtb3RpbmdFcnJvckhhbmRsZXInO1xuaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSwgTG9nTGV2ZWwgfSBmcm9tICcuL2xvZ2dpbmcnO1xuaW1wb3J0IHtWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUR9IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZENvbnN0YW50cyc7XG5cbmNvbnN0IEZJTklTSEVEID0gNDtcbmNvbnN0IFNVQ0NFU1MgPSAyMDA7XG5jb25zdCBSRVFVRVNUX1RJTUVPVVQgPSA0MDg7XG5cbmNvbnN0IERPTFBISU5fUExBVEZPUk1fUFJFRklYID0gJ2RvbHBoaW5fcGxhdGZvcm1faW50ZXJuXyc7XG5jb25zdCBDTElFTlRfSURfSFRUUF9IRUFERVJfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2RvbHBoaW5DbGllbnRJZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHVybCwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5oZWFkZXJzSW5mbyA9IGV4aXN0cyhjb25maWcpID8gY29uZmlnLmhlYWRlcnNJbmZvIDogbnVsbDtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb25Db25maWcgPSBleGlzdHMoY29uZmlnKSA/IGNvbmZpZy5jb25uZWN0aW9uIDogbnVsbDtcbiAgICAgICAgdGhpcy5tYXhSZXRyeSA9IGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnKSAmJiBleGlzdHMoY29ubmVjdGlvbkNvbmZpZy5tYXhSZXRyeSk/Y29ubmVjdGlvbkNvbmZpZy5tYXhSZXRyeTogMztcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLnRpbWVvdXQpP2Nvbm5lY3Rpb25Db25maWcudGltZW91dDogNTAwMDtcbiAgICAgICAgdGhpcy5mYWlsZWRfYXR0ZW1wdCA9IDA7XG4gICAgfVxuXG4gICAgX2hhbmRsZUVycm9yKHJlamVjdCwgZXJyb3IpIHtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb25Db25maWcgPSBleGlzdHModGhpcy5jb25maWcpID8gdGhpcy5jb25maWcuY29ubmVjdGlvbiA6IG51bGw7XG4gICAgICAgIGxldCBlcnJvckhhbmRsZXJzID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLmVycm9ySGFuZGxlcnMpP2Nvbm5lY3Rpb25Db25maWcuZXJyb3JIYW5kbGVyczogW25ldyBSZW1vdGluZ0Vycm9ySGFuZGxlcigpXTtcbiAgICAgICAgZXJyb3JIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIub25FcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgIH1cblxuICAgIF9zZW5kKGNvbW1hbmRzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICBodHRwLm9uZXJyb3IgPSAoZXJyb3JDb250ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSLmVycm9yKCdIVFRQIG5ldHdvcmsgZXJyb3InLCBlcnJvckNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IEh0dHBOZXR3b3JrRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBOZXR3b3JrIGVycm9yJywgZXJyb3JDb250ZW50KSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaHR0cC5yZWFkeVN0YXRlID09PSBGSU5JU0hFRCl7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaHR0cC5zdGF0dXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBTVUNDRVNTOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDbGllbnRJZCA9IGh0dHAuZ2V0UmVzcG9uc2VIZWFkZXIoQ0xJRU5UX0lEX0hUVFBfSEVBREVSX05BTUUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoY3VycmVudENsaWVudElkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpICYmIHRoaXMuY2xpZW50SWQgIT09IGN1cnJlbnRDbGllbnRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IENsaWVudElkIG9mIHRoZSByZXNwb25zZSBkaWQgbm90IG1hdGNoJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjdXJyZW50Q2xpZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFNlcnZlciBkaWQgbm90IHNlbmQgYSBjbGllbnRJZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSLmlzTG9nTGV2ZWxVc2VhYmxlKExvZ0xldmVsLkRFQlVHKSAmJiAhUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSLmlzTG9nTGV2ZWxVc2VhYmxlKExvZ0xldmVsLlRSQUNFKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGpzb24gPSBKU09OLnBhcnNlKGh0dHAucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIuZGVidWcoJ0hUVFAgcmVzcG9uc2Ugd2l0aCBTVUNDRVNTJywgY3VycmVudENsaWVudElkLCBqc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5lcnJvcignUmVzcG9uc2UgY291bGQgbm90IGJlIHBhcnNlZCB0byBKU09OIGZvciBsb2dnaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIudHJhY2UoJ0hUVFAgcmVzcG9uc2Ugd2l0aCBTVUNDRVNTJywgY3VycmVudENsaWVudElkLCBodHRwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShodHRwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVRVUVTVF9USU1FT1VUOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5lcnJvcignSFRUUCByZXF1ZXN0IHRpbWVvdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBEb2xwaGluU2Vzc2lvbkVycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogU2Vzc2lvbiBUaW1lb3V0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZmFpbGVkX2F0dGVtcHQgPD0gdGhpcy5tYXhSZXRyeSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSB0aGlzLmZhaWxlZF9hdHRlbXB0ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuTE9HR0VSLmVycm9yKCdIVFRQIHVuc3VwcG9ydGVkIHN0YXR1cywgd2l0aCBIVFRQIHN0YXR1cycsIGh0dHAuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwUmVzcG9uc2VFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMCAoJyArIGh0dHAuc3RhdHVzICsgJyknKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBodHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpKSB7XG4gICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FLCB0aGlzLmNsaWVudElkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmhlYWRlcnNJbmZvKSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZW5jb2RlZENvbW1hbmRzID0gQ29kZWMuZW5jb2RlKGNvbW1hbmRzKTtcblxuICAgICAgICAgICAgaWYgKFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5pc0xvZ0xldmVsVXNlYWJsZShMb2dMZXZlbC5ERUJVRykgJiYgIVBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5pc0xvZ0xldmVsVXNlYWJsZShMb2dMZXZlbC5UUkFDRSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbW1hbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21tYW5kID0gY29tbWFuZHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09PSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi5kZWJ1Zygnc2VuZCcsIGNvbW1hbmQsIGVuY29kZWRDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLkxPR0dFUi50cmFjZSgnc2VuZCcsIGNvbW1hbmRzLCBlbmNvZGVkQ29tbWFuZHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZmFpbGVkX2F0dGVtcHQgPiB0aGlzLm1heFJldHJ5KSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cC5zZW5kKGVuY29kZWRDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy50aW1lb3V0KTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGh0dHAuc2VuZChlbmNvZGVkQ29tbWFuZHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRyYW5zbWl0KGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgdGhpcy5fc2VuZChjb21tYW5kcylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlVGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVGV4dC50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VDb21tYW5kcyA9IENvZGVjLmRlY29kZShyZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKHJlc3BvbnNlQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRG9scGhpblJlbW90aW5nRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBQYXJzZSBlcnJvcjogKEluY29ycmVjdCByZXNwb25zZSA9ICcgKyByZXNwb25zZVRleHQgKyAnKScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IERvbHBoaW5SZW1vdGluZ0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogRW1wdHkgcmVzcG9uc2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2lnbmFsKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5fc2VuZChbY29tbWFuZF0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKSk7XG4gICAgfVxufVxuXG5QbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5MT0dHRVIgPSBMb2dnZXJGYWN0b3J5LmdldExvZ2dlcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXInKTtcblxuRW1pdHRlcihQbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5wcm90b3R5cGUpO1xuIiwiaW1wb3J0IHsgTG9nZ2VyRmFjdG9yeSB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90aW5nRXJyb3JIYW5kbGVyIHtcblxuICAgIG9uRXJyb3IoZXJyb3IpIHtcbiAgICAgICAgUmVtb3RpbmdFcnJvckhhbmRsZXIuTE9HR0VSLmVycm9yKGVycm9yKTtcbiAgICB9XG5cbn1cblxuUmVtb3RpbmdFcnJvckhhbmRsZXIuTE9HR0VSID0gTG9nZ2VyRmFjdG9yeS5nZXRMb2dnZXIoJ1JlbW90aW5nRXJyb3JIYW5kbGVyJyk7IiwidmFyIF9jaGVja01ldGhvZE5hbWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGlzdHMob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrTWV0aG9kKG5hbWUpIHtcbiAgICBfY2hlY2tNZXRob2ROYW1lID0gbmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUGFyYW0ocGFyYW0sIHBhcmFtZXRlck5hbWUpIHtcbiAgICBpZighZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwYXJhbWV0ZXIgJyArIHBhcmFtZXRlck5hbWUgKyAnIGlzIG1hbmRhdG9yeSBpbiAnICsgX2NoZWNrTWV0aG9kTmFtZSk7XG4gICAgfVxufSJdfQ==
