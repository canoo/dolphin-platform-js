(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/_core').Map;

},{"../modules/_core":18,"../modules/es6.map":72,"../modules/es6.object.to-string":73,"../modules/es6.string.iterator":76,"../modules/es7.map.to-json":77,"../modules/web.dom.iterable":79}],2:[function(_dereq_,module,exports){
'use strict';

_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
module.exports = _dereq_('../modules/_core').Promise;

},{"../modules/_core":18,"../modules/es6.object.to-string":73,"../modules/es6.promise":74,"../modules/es6.string.iterator":76,"../modules/web.dom.iterable":79}],3:[function(_dereq_,module,exports){
'use strict';

_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
module.exports = _dereq_('../modules/_core').Set;

},{"../modules/_core":18,"../modules/es6.object.to-string":73,"../modules/es6.set":75,"../modules/es6.string.iterator":76,"../modules/es7.set.to-json":78,"../modules/web.dom.iterable":79}],4:[function(_dereq_,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],5:[function(_dereq_,module,exports){
"use strict";

module.exports = function () {/* empty */};

},{}],6:[function(_dereq_,module,exports){
'use strict';

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

},{}],7:[function(_dereq_,module,exports){
'use strict';

var isObject = _dereq_('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":36}],8:[function(_dereq_,module,exports){
'use strict';

var forOf = _dereq_('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":26}],9:[function(_dereq_,module,exports){
'use strict';

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_('./_to-iobject'),
    toLength = _dereq_('./_to-length'),
    toIndex = _dereq_('./_to-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this),
        length = toLength(O.length),
        index = toIndex(fromIndex, length),
        value;
    // Array#includes uses SameValueZero equality algorithm
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      if (value != value) return true;
      // Array#toIndex ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

},{"./_to-index":62,"./_to-iobject":64,"./_to-length":65}],10:[function(_dereq_,module,exports){
'use strict';

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = _dereq_('./_ctx'),
    IObject = _dereq_('./_iobject'),
    toObject = _dereq_('./_to-object'),
    toLength = _dereq_('./_to-length'),
    asc = _dereq_('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1,
      IS_FILTER = TYPE == 2,
      IS_SOME = TYPE == 3,
      IS_EVERY = TYPE == 4,
      IS_FIND_INDEX = TYPE == 6,
      NO_HOLES = TYPE == 5 || IS_FIND_INDEX,
      create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this),
        self = IObject(O),
        f = ctx(callbackfn, that, 3),
        length = toLength(self.length),
        index = 0,
        result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined,
        val,
        res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":12,"./_ctx":19,"./_iobject":33,"./_to-length":65,"./_to-object":66}],11:[function(_dereq_,module,exports){
'use strict';

var isObject = _dereq_('./_is-object'),
    isArray = _dereq_('./_is-array'),
    SPECIES = _dereq_('./_wks')('species');

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
  }return C === undefined ? Array : C;
};

},{"./_is-array":35,"./_is-object":36,"./_wks":69}],12:[function(_dereq_,module,exports){
'use strict';

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = _dereq_('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":11}],13:[function(_dereq_,module,exports){
'use strict';

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof'),
    TAG = _dereq_('./_wks')('toStringTag')
// ES3 wrong here
,
    ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
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

},{"./_cof":14,"./_wks":69}],14:[function(_dereq_,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],15:[function(_dereq_,module,exports){
'use strict';

var dP = _dereq_('./_object-dp').f,
    create = _dereq_('./_object-create'),
    redefineAll = _dereq_('./_redefine-all'),
    ctx = _dereq_('./_ctx'),
    anInstance = _dereq_('./_an-instance'),
    defined = _dereq_('./_defined'),
    forOf = _dereq_('./_for-of'),
    $iterDefine = _dereq_('./_iter-define'),
    step = _dereq_('./_iter-step'),
    setSpecies = _dereq_('./_set-species'),
    DESCRIPTORS = _dereq_('./_descriptors'),
    fastKey = _dereq_('./_meta').fastKey,
    SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key),
      entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = this,
            entry = getEntry(that, key);
        if (entry) {
          var next = entry.n,
              prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */) {
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3),
            entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function get() {
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key),
        prev,
        index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key, // <- key
        v: value, // <- value
        p: prev = that._l, // <- previous entry
        n: undefined, // <- next entry
        r: false // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = iterated; // target
      this._k = kind; // kind
      this._l = undefined; // previous
    }, function () {
      var that = this,
          kind = that._k,
          entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry
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

},{"./_an-instance":6,"./_ctx":19,"./_defined":20,"./_descriptors":21,"./_for-of":26,"./_iter-define":39,"./_iter-step":41,"./_meta":44,"./_object-create":46,"./_object-dp":47,"./_redefine-all":53,"./_set-species":55}],16:[function(_dereq_,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof'),
    from = _dereq_('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":8,"./_classof":13}],17:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    $export = _dereq_('./_export'),
    meta = _dereq_('./_meta'),
    fails = _dereq_('./_fails'),
    hide = _dereq_('./_hide'),
    redefineAll = _dereq_('./_redefine-all'),
    forOf = _dereq_('./_for-of'),
    anInstance = _dereq_('./_an-instance'),
    isObject = _dereq_('./_is-object'),
    setToStringTag = _dereq_('./_set-to-string-tag'),
    dP = _dereq_('./_object-dp').f,
    each = _dereq_('./_array-methods')(0),
    DESCRIPTORS = _dereq_('./_descriptors');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME],
      C = Base,
      ADDER = IS_MAP ? 'set' : 'add',
      proto = C && C.prototype,
      O = {};
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
    if ('size' in proto) dP(C.prototype, 'size', {
      get: function get() {
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

},{"./_an-instance":6,"./_array-methods":10,"./_descriptors":21,"./_export":24,"./_fails":25,"./_for-of":26,"./_global":27,"./_hide":29,"./_is-object":36,"./_meta":44,"./_object-dp":47,"./_redefine-all":53,"./_set-to-string-tag":56}],18:[function(_dereq_,module,exports){
'use strict';

var core = module.exports = { version: '2.4.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],19:[function(_dereq_,module,exports){
'use strict';

// optional / simple context binding
var aFunction = _dereq_('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":4}],20:[function(_dereq_,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],21:[function(_dereq_,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":25}],22:[function(_dereq_,module,exports){
'use strict';

var isObject = _dereq_('./_is-object'),
    document = _dereq_('./_global').document
// in old IE typeof document.createElement is 'object'
,
    is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":27,"./_is-object":36}],23:[function(_dereq_,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],24:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    core = _dereq_('./_core'),
    ctx = _dereq_('./_ctx'),
    hide = _dereq_('./_hide'),
    PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F,
      IS_GLOBAL = type & $export.G,
      IS_STATIC = type & $export.S,
      IS_PROTO = type & $export.P,
      IS_BIND = type & $export.B,
      IS_WRAP = type & $export.W,
      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
      expProto = exports[PROTOTYPE],
      target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
      key,
      own,
      out;
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
    : IS_WRAP && target[key] == out ? function (C) {
      var F = function F(a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0:
              return new C();
            case 1:
              return new C(a);
            case 2:
              return new C(a, b);
          }return new C(a, b, c);
        }return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
      // make static versions for prototype methods
    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

},{"./_core":18,"./_ctx":19,"./_global":27,"./_hide":29}],25:[function(_dereq_,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],26:[function(_dereq_,module,exports){
'use strict';

var ctx = _dereq_('./_ctx'),
    call = _dereq_('./_iter-call'),
    isArrayIter = _dereq_('./_is-array-iter'),
    anObject = _dereq_('./_an-object'),
    toLength = _dereq_('./_to-length'),
    getIterFn = _dereq_('./core.get-iterator-method'),
    BREAK = {},
    RETURN = {};
var _exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () {
    return iterable;
  } : getIterFn(iterable),
      f = ctx(fn, that, entries ? 2 : 1),
      index = 0,
      length,
      step,
      iterator,
      result;
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
_exports.BREAK = BREAK;
_exports.RETURN = RETURN;

},{"./_an-object":7,"./_ctx":19,"./_is-array-iter":34,"./_iter-call":37,"./_to-length":65,"./core.get-iterator-method":70}],27:[function(_dereq_,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],28:[function(_dereq_,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],29:[function(_dereq_,module,exports){
'use strict';

var dP = _dereq_('./_object-dp'),
    createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":21,"./_object-dp":47,"./_property-desc":52}],30:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./_global').document && document.documentElement;

},{"./_global":27}],31:[function(_dereq_,module,exports){
'use strict';

module.exports = !_dereq_('./_descriptors') && !_dereq_('./_fails')(function () {
  return Object.defineProperty(_dereq_('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":21,"./_dom-create":22,"./_fails":25}],32:[function(_dereq_,module,exports){
"use strict";

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};

},{}],33:[function(_dereq_,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":14}],34:[function(_dereq_,module,exports){
'use strict';

// check on default Array iterator
var Iterators = _dereq_('./_iterators'),
    ITERATOR = _dereq_('./_wks')('iterator'),
    ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":42,"./_wks":69}],35:[function(_dereq_,module,exports){
'use strict';

// 7.2.2 IsArray(argument)
var cof = _dereq_('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":14}],36:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],37:[function(_dereq_,module,exports){
'use strict';

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

var create = _dereq_('./_object-create'),
    descriptor = _dereq_('./_property-desc'),
    setToStringTag = _dereq_('./_set-to-string-tag'),
    IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":29,"./_object-create":46,"./_property-desc":52,"./_set-to-string-tag":56,"./_wks":69}],39:[function(_dereq_,module,exports){
'use strict';

var LIBRARY = _dereq_('./_library'),
    $export = _dereq_('./_export'),
    redefine = _dereq_('./_redefine'),
    hide = _dereq_('./_hide'),
    has = _dereq_('./_has'),
    Iterators = _dereq_('./_iterators'),
    $iterCreate = _dereq_('./_iter-create'),
    setToStringTag = _dereq_('./_set-to-string-tag'),
    getPrototypeOf = _dereq_('./_object-gpo'),
    ITERATOR = _dereq_('./_wks')('iterator'),
    BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
,
    FF_ITERATOR = '@@iterator',
    KEYS = 'keys',
    VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator',
      DEF_VALUES = DEFAULT == VALUES,
      VALUES_BUG = false,
      proto = Base.prototype,
      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
      $default = $native || getMethod(DEFAULT),
      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
      methods,
      key,
      IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
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

},{"./_export":24,"./_has":28,"./_hide":29,"./_iter-create":38,"./_iterators":42,"./_library":43,"./_object-gpo":49,"./_redefine":54,"./_set-to-string-tag":56,"./_wks":69}],40:[function(_dereq_,module,exports){
'use strict';

var ITERATOR = _dereq_('./_wks')('iterator'),
    SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7],
        iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":69}],41:[function(_dereq_,module,exports){
"use strict";

module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],42:[function(_dereq_,module,exports){
"use strict";

module.exports = {};

},{}],43:[function(_dereq_,module,exports){
"use strict";

module.exports = true;

},{}],44:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var META = _dereq_('./_uid')('meta'),
    isObject = _dereq_('./_is-object'),
    has = _dereq_('./_has'),
    setDesc = _dereq_('./_object-dp').f,
    id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_dereq_('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function setMeta(it) {
  setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {} // weak collections IDs
    } });
};
var fastKey = function fastKey(it, create) {
  // return primitive with prefix
  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
    // return object ID
  }return it[META].i;
};
var getWeak = function getWeak(it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
    // return hash weak collections IDs
  }return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function onFreeze(it) {
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

},{"./_fails":25,"./_has":28,"./_is-object":36,"./_object-dp":47,"./_uid":68}],45:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    macrotask = _dereq_('./_task').set,
    Observer = global.MutationObserver || global.WebKitMutationObserver,
    process = global.process,
    Promise = global.Promise,
    isNode = _dereq_('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true,
        node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function notify() {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function notify() {
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
    }last = task;
  };
};

},{"./_cof":14,"./_global":27,"./_task":61}],46:[function(_dereq_,module,exports){
'use strict';

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = _dereq_('./_an-object'),
    dPs = _dereq_('./_object-dps'),
    enumBugKeys = _dereq_('./_enum-bug-keys'),
    IE_PROTO = _dereq_('./_shared-key')('IE_PROTO'),
    Empty = function Empty() {/* empty */},
    PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _dereq_('./_dom-create')('iframe'),
      i = enumBugKeys.length,
      lt = '<',
      gt = '>',
      iframeDocument;
  iframe.style.display = 'none';
  _dereq_('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":30,"./_object-dps":48,"./_shared-key":57}],47:[function(_dereq_,module,exports){
'use strict';

var anObject = _dereq_('./_an-object'),
    IE8_DOM_DEFINE = _dereq_('./_ie8-dom-define'),
    toPrimitive = _dereq_('./_to-primitive'),
    dP = Object.defineProperty;

exports.f = _dereq_('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_ie8-dom-define":31,"./_to-primitive":67}],48:[function(_dereq_,module,exports){
'use strict';

var dP = _dereq_('./_object-dp'),
    anObject = _dereq_('./_an-object'),
    getKeys = _dereq_('./_object-keys');

module.exports = _dereq_('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties),
      length = keys.length,
      i = 0,
      P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

},{"./_an-object":7,"./_descriptors":21,"./_object-dp":47,"./_object-keys":51}],49:[function(_dereq_,module,exports){
'use strict';

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = _dereq_('./_has'),
    toObject = _dereq_('./_to-object'),
    IE_PROTO = _dereq_('./_shared-key')('IE_PROTO'),
    ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

},{"./_has":28,"./_shared-key":57,"./_to-object":66}],50:[function(_dereq_,module,exports){
'use strict';

var has = _dereq_('./_has'),
    toIObject = _dereq_('./_to-iobject'),
    arrayIndexOf = _dereq_('./_array-includes')(false),
    IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object),
      i = 0,
      result = [],
      key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

},{"./_array-includes":9,"./_has":28,"./_shared-key":57,"./_to-iobject":64}],51:[function(_dereq_,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = _dereq_('./_object-keys-internal'),
    enumBugKeys = _dereq_('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":50}],52:[function(_dereq_,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],53:[function(_dereq_,module,exports){
'use strict';

var hide = _dereq_('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];else hide(target, key, src[key]);
  }return target;
};

},{"./_hide":29}],54:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./_hide');

},{"./_hide":29}],55:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    core = _dereq_('./_core'),
    dP = _dereq_('./_object-dp'),
    DESCRIPTORS = _dereq_('./_descriptors'),
    SPECIES = _dereq_('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

},{"./_core":18,"./_descriptors":21,"./_global":27,"./_object-dp":47,"./_wks":69}],56:[function(_dereq_,module,exports){
'use strict';

var def = _dereq_('./_object-dp').f,
    has = _dereq_('./_has'),
    TAG = _dereq_('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":28,"./_object-dp":47,"./_wks":69}],57:[function(_dereq_,module,exports){
'use strict';

var shared = _dereq_('./_shared')('keys'),
    uid = _dereq_('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":58,"./_uid":68}],58:[function(_dereq_,module,exports){
'use strict';

var global = _dereq_('./_global'),
    SHARED = '__core-js_shared__',
    store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":27}],59:[function(_dereq_,module,exports){
'use strict';

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = _dereq_('./_an-object'),
    aFunction = _dereq_('./_a-function'),
    SPECIES = _dereq_('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor,
      S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":4,"./_an-object":7,"./_wks":69}],60:[function(_dereq_,module,exports){
'use strict';

var toInteger = _dereq_('./_to-integer'),
    defined = _dereq_('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that)),
        i = toInteger(pos),
        l = s.length,
        a,
        b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":20,"./_to-integer":63}],61:[function(_dereq_,module,exports){
'use strict';

var ctx = _dereq_('./_ctx'),
    invoke = _dereq_('./_invoke'),
    html = _dereq_('./_html'),
    cel = _dereq_('./_dom-create'),
    global = _dereq_('./_global'),
    process = global.process,
    setTask = global.setImmediate,
    clearTask = global.clearImmediate,
    MessageChannel = global.MessageChannel,
    counter = 0,
    queue = {},
    ONREADYSTATECHANGE = 'onreadystatechange',
    defer,
    channel,
    port;
var run = function run() {
  var id = +this;
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function listener(event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [],
        i = 1;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }queue[++counter] = function () {
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
    defer = function defer(id) {
      process.nextTick(ctx(run, id, 1));
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
    defer = function defer(id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":14,"./_ctx":19,"./_dom-create":22,"./_global":27,"./_html":30,"./_invoke":32}],62:[function(_dereq_,module,exports){
'use strict';

var toInteger = _dereq_('./_to-integer'),
    max = Math.max,
    min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":63}],63:[function(_dereq_,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil,
    floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],64:[function(_dereq_,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject'),
    defined = _dereq_('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":20,"./_iobject":33}],65:[function(_dereq_,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer'),
    min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":63}],66:[function(_dereq_,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":20}],67:[function(_dereq_,module,exports){
'use strict';

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

},{"./_is-object":36}],68:[function(_dereq_,module,exports){
'use strict';

var id = 0,
    px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],69:[function(_dereq_,module,exports){
'use strict';

var store = _dereq_('./_shared')('wks'),
    uid = _dereq_('./_uid'),
    _Symbol = _dereq_('./_global').Symbol,
    USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":27,"./_shared":58,"./_uid":68}],70:[function(_dereq_,module,exports){
'use strict';

var classof = _dereq_('./_classof'),
    ITERATOR = _dereq_('./_wks')('iterator'),
    Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":13,"./_core":18,"./_iterators":42,"./_wks":69}],71:[function(_dereq_,module,exports){
'use strict';

var addToUnscopables = _dereq_('./_add-to-unscopables'),
    step = _dereq_('./_iter-step'),
    Iterators = _dereq_('./_iterators'),
    toIObject = _dereq_('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t,
      kind = this._k,
      index = this._i++;
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

},{"./_add-to-unscopables":5,"./_iter-define":39,"./_iter-step":41,"./_iterators":42,"./_to-iobject":64}],72:[function(_dereq_,module,exports){
'use strict';

var strong = _dereq_('./_collection-strong');

// 23.1 Map Objects
module.exports = _dereq_('./_collection')('Map', function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":17,"./_collection-strong":15}],73:[function(_dereq_,module,exports){
"use strict";

},{}],74:[function(_dereq_,module,exports){
'use strict';

var LIBRARY = _dereq_('./_library'),
    global = _dereq_('./_global'),
    ctx = _dereq_('./_ctx'),
    classof = _dereq_('./_classof'),
    $export = _dereq_('./_export'),
    isObject = _dereq_('./_is-object'),
    aFunction = _dereq_('./_a-function'),
    anInstance = _dereq_('./_an-instance'),
    forOf = _dereq_('./_for-of'),
    speciesConstructor = _dereq_('./_species-constructor'),
    task = _dereq_('./_task').set,
    microtask = _dereq_('./_microtask')(),
    PROMISE = 'Promise',
    TypeError = global.TypeError,
    process = global.process,
    $Promise = global[PROMISE],
    process = global.process,
    isNode = classof(process) == 'process',
    empty = function empty() {/* empty */},
    Internal,
    GenericPromiseCapability,
    Wrapper;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1),
        FakePromise = (promise.constructor = {})[_dereq_('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var sameConstructor = function sameConstructor(a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function newPromiseCapability(C) {
  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};
var perform = function perform(exec) {
  try {
    exec();
  } catch (e) {
    return { error: e };
  }
};
var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v,
        ok = promise._s == 1,
        i = 0;
    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail,
          resolve = reaction.resolve,
          reject = reaction.reject,
          domain = reaction.domain,
          result,
          then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
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
    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function onUnhandled(promise) {
  task.call(global, function () {
    var value = promise._v,
        abrupt,
        handler,
        console;
    if (isUnhandled(promise)) {
      abrupt = perform(function () {
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
    }promise._a = undefined;
    if (abrupt) throw abrupt.error;
  });
};
var isUnhandled = function isUnhandled(promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c,
      i = 0,
      reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  }return true;
};
var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function $resolve(value) {
  var promise = this,
      then;
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
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
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
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function PromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
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
    var capability = newPromiseCapability(this),
        $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    var capability = newPromiseCapability(this),
        $$resolve = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        resolve = capability.resolve,
        reject = capability.reject;
    var abrupt = perform(function () {
      var values = [],
          index = 0,
          remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++,
            alreadyCalled = false;
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
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        reject = capability.reject;
    var abrupt = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  }
});

},{"./_a-function":4,"./_an-instance":6,"./_classof":13,"./_core":18,"./_ctx":19,"./_export":24,"./_for-of":26,"./_global":27,"./_is-object":36,"./_iter-detect":40,"./_library":43,"./_microtask":45,"./_redefine-all":53,"./_set-species":55,"./_set-to-string-tag":56,"./_species-constructor":59,"./_task":61,"./_wks":69}],75:[function(_dereq_,module,exports){
'use strict';

var strong = _dereq_('./_collection-strong');

// 23.2 Set Objects
module.exports = _dereq_('./_collection')('Set', function (get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":17,"./_collection-strong":15}],76:[function(_dereq_,module,exports){
'use strict';

var $at = _dereq_('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t,
      index = this._i,
      point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":39,"./_string-at":60}],77:[function(_dereq_,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Map', { toJSON: _dereq_('./_collection-to-json')('Map') });

},{"./_collection-to-json":16,"./_export":24}],78:[function(_dereq_,module,exports){
'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Set', { toJSON: _dereq_('./_collection-to-json')('Set') });

},{"./_collection-to-json":16,"./_export":24}],79:[function(_dereq_,module,exports){
'use strict';

_dereq_('./es6.array.iterator');
var global = _dereq_('./_global'),
    hide = _dereq_('./_hide'),
    Iterators = _dereq_('./_iterators'),
    TO_STRING_TAG = _dereq_('./_wks')('toStringTag');

for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
  var NAME = collections[i],
      Collection = global[NAME],
      proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":27,"./_hide":29,"./_iterators":42,"./_wks":69,"./es6.array.iterator":71}],80:[function(_dereq_,module,exports){

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

},{}],81:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attribute = function Attribute() {
  _classCallCheck(this, Attribute);
};

exports.default = Attribute;


Attribute.QUALIFIER_PROPERTY = "qualifier";
Attribute.VALUE = "value";

},{}],82:[function(_dereq_,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventBus = _dereq_("./EventBus");

var _EventBus2 = _interopRequireDefault(_EventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientAttribute = function () {
    function ClientAttribute(propertyName, qualifier, value) {
        _classCallCheck(this, ClientAttribute);

        this.propertyName = propertyName;
        this.id = "" + ClientAttribute.clientAttributeInstanceCount++ + "C";
        this.valueChangeBus = new _EventBus2.default();
        this.qualifierChangeBus = new _EventBus2.default();
        this.setValue(value);
        this.setQualifier(qualifier);
    }

    _createClass(ClientAttribute, [{
        key: "copy",
        value: function copy() {
            var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
            return result;
        }
    }, {
        key: "setPresentationModel",
        value: function setPresentationModel(presentationModel) {
            if (this.presentationModel) {
                alert("You can not set a presentation model for an attribute that is already bound.");
            }
            this.presentationModel = presentationModel;
        }
    }, {
        key: "getPresentationModel",
        value: function getPresentationModel() {
            return this.presentationModel;
        }
    }, {
        key: "getValue",
        value: function getValue() {
            return this.value;
        }
    }, {
        key: "setValue",
        value: function setValue(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value == verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
        }
    }, {
        key: "setQualifier",
        value: function setQualifier(newQualifier) {
            if (this.qualifier == newQualifier) return;
            var oldQualifier = this.qualifier;
            this.qualifier = newQualifier;
            this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
        }
    }, {
        key: "getQualifier",
        value: function getQualifier() {
            return this.qualifier;
        }
    }, {
        key: "onValueChange",
        value: function onValueChange(eventHandler) {
            this.valueChangeBus.onEvent(eventHandler);
            eventHandler({ "oldValue": this.value, "newValue": this.value });
        }
    }, {
        key: "onQualifierChange",
        value: function onQualifierChange(eventHandler) {
            this.qualifierChangeBus.onEvent(eventHandler);
        }
    }, {
        key: "syncWith",
        value: function syncWith(sourceAttribute) {
            if (sourceAttribute) {
                this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
                this.setValue(sourceAttribute.value);
            }
        }
    }], [{
        key: "checkValue",
        value: function checkValue(value) {
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
            if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result === "undefined" ? "undefined" : _typeof(result)) > -1 || result instanceof Date) {
                ok = true;
            }
            if (!ok) {
                throw new Error("Attribute values of this type are not allowed: " + (typeof value === "undefined" ? "undefined" : _typeof(value)));
            }
            return result;
        }
    }]);

    return ClientAttribute;
}();

ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;

},{"./EventBus":90}],83:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CommandBatcher = _dereq_('./CommandBatcher');

var _codec = _dereq_('./codec');

var _codec2 = _interopRequireDefault(_codec);

var _ClientPresentationModel = _dereq_('./ClientPresentationModel');

var _ClientPresentationModel2 = _interopRequireDefault(_ClientPresentationModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.commandBatcher = new _CommandBatcher.BlindCommandBatcher(true, maxBatchSize);
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
            var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
            var commands = cmdsAndHandlers.map(function (cah) {
                return cah.command;
            });
            this.transmitter.transmit(commands, function (response) {
                //console.log("server response: [" + response.map(it => it.id).join(", ") + "] ");
                var touchedPMs = [];
                response.forEach(function (command) {
                    var touched = _this.handle(command);
                    if (touched) touchedPMs.push(touched);
                });
                if (callback) {
                    callback.onFinished(touchedPMs); // todo: make them unique?
                }
                // recursive call: fetch the next in line but allow a bit of slack such that
                // document events can fire, rendering is done and commands can batch up
                setTimeout(function () {
                    return _this.doSendNext();
                }, _this.slackMS);
            });
        }
    }, {
        key: 'handle',
        value: function handle(command) {
            if (command.id == "DeletePresentationModel") {
                return this.handleDeletePresentationModelCommand(command);
            } else if (command.id == "CreatePresentationModel") {
                return this.handleCreatePresentationModelCommand(command);
            } else if (command.id == "ValueChanged") {
                return this.handleValueChangedCommand(command);
            } else if (command.id == "AttributeMetadataChanged") {
                return this.handleAttributeMetadataChangedCommand(command);
            } else {
                console.log("Cannot handle, unknown command " + command);
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
            var clientPm = new _ClientPresentationModel2.default(serverCommand.pmId, serverCommand.pmType);
            clientPm.addAttributes(attributes);
            if (serverCommand.clientSideOnly) {
                clientPm.clientSideOnly = true;
            }
            this.clientDolphin.getClientModelStore().add(clientPm);
            this.clientDolphin.updatePresentationModelQualifier(clientPm);
            return clientPm;
        }
    }, {
        key: 'handleValueChangedCommand',
        value: function handleValueChangedCommand(serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                console.log("attribute with id " + serverCommand.attributeId + " not found, cannot update to new value " + serverCommand.newValue);
                return null;
            }
            if (clientAttribute.getValue() == serverCommand.newValue) {
                //console.log("nothing to do. new value == old value");
                return null;
            }
            clientAttribute.setValue(serverCommand.newValue);
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

},{"./ClientPresentationModel":86,"./CommandBatcher":88,"./codec":98}],84:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClientAttribute = _dereq_('./ClientAttribute');

var _ClientAttribute2 = _interopRequireDefault(_ClientAttribute);

var _ClientPresentationModel = _dereq_('./ClientPresentationModel');

var _ClientPresentationModel2 = _interopRequireDefault(_ClientPresentationModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            return new _ClientAttribute2.default(propertyName, qualifier, value);
        }
    }, {
        key: 'presentationModel',
        value: function presentationModel(id, type) {
            var model = new _ClientPresentationModel2.default(id, type);

            for (var _len = arguments.length, attributes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                attributes[_key - 2] = arguments[_key];
            }

            if (attributes && attributes.length > 0) {
                attributes.forEach(function (attribute) {
                    model.addAttribute(attribute);
                });
            }
            this.getClientModelStore().add(model);
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
            this.clientConnector.setPushListener(pushCommand);
            this.clientConnector.setReleaseCommand(releaseCommand);
            this.clientConnector.setPushEnabled(true);
            this.clientConnector.listen();
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

},{"./ClientAttribute":82,"./ClientPresentationModel":86}],85:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Attribute = _dereq_('./Attribute');

var _Attribute2 = _interopRequireDefault(_Attribute);

var _changeAttributeMetadataCommand = _dereq_('./commands/changeAttributeMetadataCommand');

var _changeAttributeMetadataCommand2 = _interopRequireDefault(_changeAttributeMetadataCommand);

var _createPresentationModelCommand = _dereq_('./commands/createPresentationModelCommand');

var _createPresentationModelCommand2 = _interopRequireDefault(_createPresentationModelCommand);

var _presentationModelDeletedCommand = _dereq_('./commands/presentationModelDeletedCommand');

var _presentationModelDeletedCommand2 = _interopRequireDefault(_presentationModelDeletedCommand);

var _EventBus = _dereq_('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _valueChangedCommand = _dereq_('./commands/valueChangedCommand');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

var _constants = _dereq_('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientModelStore = function () {
    function ClientModelStore(clientDolphin) {
        _classCallCheck(this, ClientModelStore);

        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new _EventBus2.default();
    }

    _createClass(ClientModelStore, [{
        key: 'getClientDolphin',
        value: function getClientDolphin() {
            return this.clientDolphin;
        }
    }, {
        key: 'registerModel',
        value: function registerModel(model) {
            var _this = this;

            if (model.clientSideOnly) {
                return;
            }
            var connector = this.clientDolphin.getClientConnector();
            var createPMCommand = new _createPresentationModelCommand2.default(model);
            connector.send(createPMCommand, null);
            model.getAttributes().forEach(function (attribute) {
                _this.registerAttribute(attribute);
            });
        }
    }, {
        key: 'registerAttribute',
        value: function registerAttribute(attribute) {
            var _this2 = this;

            this.addAttributeById(attribute);
            if (attribute.getQualifier()) {
                this.addAttributeByQualifier(attribute);
            }
            // whenever an attribute changes its value, the server needs to be notified
            // and all other attributes with the same qualifier are given the same value
            attribute.onValueChange(function (evt) {
                var valueChangeCommand = new _valueChangedCommand2.default(attribute.id, evt.newValue);
                _this2.clientDolphin.getClientConnector().send(valueChangeCommand, null);
                if (attribute.getQualifier()) {
                    var attrs = _this2.findAttributesByFilter(function (attr) {
                        return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                    });
                    attrs.forEach(function (attr) {
                        attr.setValue(attribute.getValue());
                    });
                }
            });
            attribute.onQualifierChange(function (evt) {
                var changeAttrMetadataCmd = new _changeAttributeMetadataCommand2.default(attribute.id, _Attribute2.default.QUALIFIER_PROPERTY, evt.newValue);
                _this2.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
            });
        }
    }, {
        key: 'add',
        value: function add(model) {
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
                this.registerModel(model);
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
                this.clientDolphin.getClientConnector().send(new _presentationModelDeletedCommand2.default(model.id), null);
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

},{"./Attribute":81,"./EventBus":90,"./commands/changeAttributeMetadataCommand":101,"./commands/createPresentationModelCommand":105,"./commands/presentationModelDeletedCommand":109,"./commands/valueChangedCommand":111,"./constants":113}],86:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventBus = _dereq_('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.invalidBus = new _EventBus2.default();
        this.dirtyValueChangeBus = new _EventBus2.default();
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

},{"./EventBus":90}],87:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright 2016 Canoo Engineering AG.
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

/*jslint browserify: true */

var _utils = _dereq_('./utils.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Codec = function () {
    function Codec() {
        _classCallCheck(this, Codec);
    }

    _createClass(Codec, null, [{
        key: 'encodeCreatePresentationModelCommand',
        value: function encodeCreatePresentationModelCommand(command) {
            return {
                'p': command.pmId,
                't': command.pmType,
                'a': command.attributes.map(function (attribute) {
                    var result = {
                        'n': attribute.propertyName,
                        'i': attribute.id
                    };
                    if ((0, _utils.exists)(attribute.value)) {
                        result.v = attribute.value;
                    }
                    return result;
                }),
                'id': 'CreatePresentationModel'
            };
        }
    }, {
        key: 'decodeCreatePresentationModelCommand',
        value: function decodeCreatePresentationModelCommand(command) {
            return {
                'id': 'CreatePresentationModel',
                'className': "org.opendolphin.core.comm.CreatePresentationModelCommand",
                'clientSideOnly': false,
                'pmId': command.p,
                'pmType': command.t,
                'attributes': command.a.map(function (attribute) {
                    return {
                        'propertyName': attribute.n,
                        'id': attribute.i,
                        'value': (0, _utils.exists)(attribute.v) ? attribute.v : null,
                        'qualifier': null
                    };
                })
            };
        }
    }, {
        key: 'encodeValueChangedCommand',
        value: function encodeValueChangedCommand(command) {
            var result = {
                'a': command.attributeId
            };
            if ((0, _utils.exists)(command.oldValue)) {
                result.o = command.oldValue;
            }
            if ((0, _utils.exists)(command.newValue)) {
                result.n = command.newValue;
            }
            result.id = 'ValueChanged';
            return result;
        }
    }, {
        key: 'decodeValueChangedCommand',
        value: function decodeValueChangedCommand(command) {
            return {
                'id': 'ValueChanged',
                'className': "org.opendolphin.core.comm.ValueChangedCommand",
                'attributeId': command.a,
                'oldValue': (0, _utils.exists)(command.o) ? command.o : null,
                'newValue': (0, _utils.exists)(command.n) ? command.n : null
            };
        }
    }, {
        key: 'encode',
        value: function encode(commands) {
            var self = this;
            return JSON.stringify(commands.map(function (command) {
                if (command.id === 'CreatePresentationModel') {
                    return self.encodeCreatePresentationModelCommand(command);
                } else if (command.id === 'ValueChanged') {
                    return self.encodeValueChangedCommand(command);
                }
                return command;
            }));
        }
    }, {
        key: 'decode',
        value: function decode(transmitted) {
            var self = this;
            if (typeof transmitted === 'string') {
                return JSON.parse(transmitted).map(function (command) {
                    if (command.id === 'CreatePresentationModel') {
                        return self.decodeCreatePresentationModelCommand(command);
                    } else if (command.id === 'ValueChanged') {
                        return self.decodeValueChangedCommand(command);
                    }
                    return command;
                });
            } else {
                return transmitted;
            }
        }
    }]);

    return Codec;
}();

exports.default = Codec;

},{"./utils.js":119}],88:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BlindCommandBatcher = exports.NoCommandBatcher = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _valueChangedCommand = _dereq_('./commands/valueChangedCommand');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NoCommandBatcher = exports.NoCommandBatcher = function () {
    function NoCommandBatcher() {
        _classCallCheck(this, NoCommandBatcher);
    }

    _createClass(NoCommandBatcher, [{
        key: 'batch',
        value: function batch(queue) {
            return [queue.shift()];
        }
    }]);

    return NoCommandBatcher;
}();

var BlindCommandBatcher = exports.BlindCommandBatcher = function () {
    /** folding: whether we should try folding ValueChangedCommands */
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
            var n = Math.min(queue.length, this.maxBatchSize);
            for (var counter = 0; counter < n; counter++) {
                var candidate = queue.shift();
                if (this.folding && candidate.command instanceof _valueChangedCommand2.default && !candidate.handler) {
                    var canCmd = candidate.command;
                    if (batch.length > 0 && batch[batch.length - 1].command instanceof _valueChangedCommand2.default) {
                        var batchCmd = batch[batch.length - 1].command;
                        if (canCmd.attributeId == batchCmd.attributeId) {
                            batchCmd.newValue = canCmd.newValue;
                        } else {
                            batch.push(candidate); // we cannot merge, so batch the candidate
                        }
                    } else {
                        batch.push(candidate); // we cannot merge, so batch the candidate
                    }
                } else {
                    batch.push(candidate);
                }
                if (candidate.handler || candidate.command['className'] == "org.opendolphin.core.comm.EmptyNotification" // or unknown client side effect
                ) {
                        break; // leave the loop
                    }
            }
            return batch;
        }
    }]);

    return BlindCommandBatcher;
}();

},{"./commands/valueChangedCommand":111}],89:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClientConnector = _dereq_('./ClientConnector');

var _ClientConnector2 = _interopRequireDefault(_ClientConnector);

var _ClientDolphin = _dereq_('./ClientDolphin');

var _ClientDolphin2 = _interopRequireDefault(_ClientDolphin);

var _ClientModelStore = _dereq_('./ClientModelStore');

var _ClientModelStore2 = _interopRequireDefault(_ClientModelStore);

var _HttpTransmitter = _dereq_('./HttpTransmitter');

var _HttpTransmitter2 = _interopRequireDefault(_HttpTransmitter);

var _NoTransmitter = _dereq_('./NoTransmitter');

var _NoTransmitter2 = _interopRequireDefault(_NoTransmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            console.log("OpenDolphin js found");
            var clientDolphin = new _ClientDolphin2.default();
            var transmitter;
            if (this.url_ != null && this.url_.length > 0) {
                transmitter = new _HttpTransmitter2.default(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
            } else {
                transmitter = new _NoTransmitter2.default();
            }
            clientDolphin.setClientConnector(new _ClientConnector2.default(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
            clientDolphin.setClientModelStore(new _ClientModelStore2.default(clientDolphin));
            console.log("ClientDolphin initialized");
            return clientDolphin;
        }
    }]);

    return DolphinBuilder;
}();

exports.default = DolphinBuilder;

},{"./ClientConnector":83,"./ClientDolphin":84,"./ClientModelStore":85,"./HttpTransmitter":91,"./NoTransmitter":92}],90:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

},{}],91:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Codec = _dereq_("./Codec");

var _Codec2 = _interopRequireDefault(_Codec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.codec = new _Codec2.default();
        if (reset) {
            console.log('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
            this.invalidate();
        }
    }

    _createClass(HttpTransmitter, [{
        key: "transmit",
        value: function transmit(commands, onDone) {
            var _this = this;

            this.http.onerror = function () {
                _this.handleError('onerror', "");
                onDone([]);
            };
            this.http.onreadystatechange = function () {
                if (_this.http.readyState == _this.HttpCodes.finished) {
                    if (_this.http.status == _this.HttpCodes.success) {
                        var responseText = _this.http.responseText;
                        if (responseText.trim().length > 0) {
                            try {
                                var responseCommands = _this.codec.decode(responseText);
                                onDone(responseCommands);
                            } catch (err) {
                                console.log("Error occurred parsing responseText: ", err);
                                console.log("Incorrect responseText: ", responseText);
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
            this.http.send(this.codec.encode(commands));
        }
    }, {
        key: "setHeaders",
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
        key: "handleError",
        value: function handleError(kind, message) {
            var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
            if (this.errorHandler) {
                this.errorHandler(errorEvent);
            } else {
                console.log("Error occurred: ", errorEvent);
            }
        }
    }, {
        key: "signal",
        value: function signal(command) {
            this.sig.open('POST', this.url, true);
            this.setHeaders(this.sig);
            this.sig.send(this.codec.encode([command]));
        }
    }, {
        key: "invalidate",
        value: function invalidate() {
            this.http.open('POST', this.url + 'invalidate?', false);
            this.http.send();
        }
    }]);

    return HttpTransmitter;
}();

exports.default = HttpTransmitter;

},{"./Codec":87}],92:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

},{}],93:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dolphin = dolphin;
exports.makeDolphin = makeDolphin;

var _DolphinBuilder = _dereq_('./DolphinBuilder');

var _DolphinBuilder2 = _interopRequireDefault(_DolphinBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dolphin(url, reset) {
    var slackMS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}

function makeDolphin() {
    return new _DolphinBuilder2.default();
}

},{"./DolphinBuilder":89}],94:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = _dereq_('../bower_components/core.js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BeanManager = function () {
    function BeanManager(classRepository) {
        _classCallCheck(this, BeanManager);

        (0, _utils2.checkMethod)('BeanManager(classRepository)');
        (0, _utils2.checkParam)(classRepository, 'classRepository');

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
                        console.warn('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                    }
                });
            }
            self.allAddedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanAdded-handler', e);
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
                        console.warn('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                    }
                });
            }
            self.allRemovedHandlers.forEach(function (handler) {
                try {
                    handler(bean);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanRemoved-handler', e);
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
                        console.warn('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                    }
                });
            }
            self.allUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onBeanUpdate-handler', e);
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
                        console.warn('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                    }
                });
            }
            self.allArrayUpdatedHandlers.forEach(function (handler) {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch (e) {
                    console.warn('An exception occurred while calling a general onArrayUpdate-handler', e);
                }
            });
        });
    }

    _createClass(BeanManager, [{
        key: 'notifyBeanChange',
        value: function notifyBeanChange(bean, propertyName, newValue) {
            (0, _utils2.checkMethod)('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');

            return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
        }
    }, {
        key: 'notifyArrayChange',
        value: function notifyArrayChange(bean, propertyName, index, count, removedElements) {
            (0, _utils2.checkMethod)('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');
            (0, _utils2.checkParam)(index, 'index');
            (0, _utils2.checkParam)(count, 'count');
            (0, _utils2.checkParam)(removedElements, 'removedElements');

            this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
        }
    }, {
        key: 'isManaged',
        value: function isManaged(bean) {
            (0, _utils2.checkMethod)('BeanManager.isManaged(bean)');
            (0, _utils2.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.isManaged() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'create',
        value: function create(type) {
            (0, _utils2.checkMethod)('BeanManager.create(type)');
            (0, _utils2.checkParam)(type, 'type');

            // TODO: Implement dolphin.create() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'add',
        value: function add(type, bean) {
            (0, _utils2.checkMethod)('BeanManager.add(type, bean)');
            (0, _utils2.checkParam)(type, 'type');
            (0, _utils2.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.add() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'addAll',
        value: function addAll(type, collection) {
            (0, _utils2.checkMethod)('BeanManager.addAll(type, collection)');
            (0, _utils2.checkParam)(type, 'type');
            (0, _utils2.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.addAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'remove',
        value: function remove(bean) {
            (0, _utils2.checkMethod)('BeanManager.remove(bean)');
            (0, _utils2.checkParam)(bean, 'bean');

            // TODO: Implement dolphin.remove() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeAll',
        value: function removeAll(collection) {
            (0, _utils2.checkMethod)('BeanManager.removeAll(collection)');
            (0, _utils2.checkParam)(collection, 'collection');

            // TODO: Implement dolphin.removeAll() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'removeIf',
        value: function removeIf(predicate) {
            (0, _utils2.checkMethod)('BeanManager.removeIf(predicate)');
            (0, _utils2.checkParam)(predicate, 'predicate');

            // TODO: Implement dolphin.removeIf() [DP-7]
            throw new Error("Not implemented yet");
        }
    }, {
        key: 'onAdded',
        value: function onAdded(type, eventHandler) {
            var self = this;
            if (!(0, _utils.exists)(eventHandler)) {
                eventHandler = type;
                (0, _utils2.checkMethod)('BeanManager.onAdded(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allAddedHandlers = self.allAddedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onAdded(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

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
                (0, _utils2.checkMethod)('BeanManager.onRemoved(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allRemovedHandlers = self.allRemovedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onRemoved(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

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
                (0, _utils2.checkMethod)('BeanManager.onBeanUpdate(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onBeanUpdate(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

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
                (0, _utils2.checkMethod)('BeanManager.onArrayUpdate(eventHandler)');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
                return {
                    unsubscribe: function unsubscribe() {
                        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function (value) {
                            return value !== eventHandler;
                        });
                    }
                };
            } else {
                (0, _utils2.checkMethod)('BeanManager.onArrayUpdate(type, eventHandler)');
                (0, _utils2.checkParam)(type, 'type');
                (0, _utils2.checkParam)(eventHandler, 'eventHandler');

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

},{"../bower_components/core.js/library/fn/map":1,"./utils":119,"./utils.js":119}],95:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = _dereq_('../bower_components/core.js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _constants = _dereq_('./constants');

var consts = _interopRequireWildcard(_constants);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var blocked = null;

var ClassRepository = function () {
    function ClassRepository(dolphin) {
        _classCallCheck(this, ClassRepository);

        (0, _utils2.checkMethod)('ClassRepository(dolphin)');
        (0, _utils2.checkParam)(dolphin, 'dolphin');

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
                        console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
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
            (0, _utils2.checkMethod)('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');

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
            (0, _utils2.checkMethod)('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
            (0, _utils2.checkParam)(bean, 'bean');
            (0, _utils2.checkParam)(propertyName, 'propertyName');
            (0, _utils2.checkParam)(index, 'index');
            (0, _utils2.checkParam)(count, 'count');
            (0, _utils2.checkParam)(removedElements, 'removedElements');

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
            (0, _utils2.checkMethod)('ClassRepository.onBeanAdded(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.beanAddedHandlers.push(handler);
        }
    }, {
        key: 'onBeanRemoved',
        value: function onBeanRemoved(handler) {
            (0, _utils2.checkMethod)('ClassRepository.onBeanRemoved(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.beanRemovedHandlers.push(handler);
        }
    }, {
        key: 'onBeanUpdate',
        value: function onBeanUpdate(handler) {
            (0, _utils2.checkMethod)('ClassRepository.onBeanUpdate(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.propertyUpdateHandlers.push(handler);
        }
    }, {
        key: 'onArrayUpdate',
        value: function onArrayUpdate(handler) {
            (0, _utils2.checkMethod)('ClassRepository.onArrayUpdate(handler)');
            (0, _utils2.checkParam)(handler, 'handler');
            this.arrayUpdateHandlers.push(handler);
        }
    }, {
        key: 'registerClass',
        value: function registerClass(model) {
            (0, _utils2.checkMethod)('ClassRepository.registerClass(model)');
            (0, _utils2.checkParam)(model, 'model');

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
            (0, _utils2.checkMethod)('ClassRepository.unregisterClass(model)');
            (0, _utils2.checkParam)(model, 'model');
            this.classes['delete'](model.id);
        }
    }, {
        key: 'load',
        value: function load(model) {
            (0, _utils2.checkMethod)('ClassRepository.load(model)');
            (0, _utils2.checkParam)(model, 'model');

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
                                console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
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
                    console.warn('An exception occurred while calling an onBeanAdded-handler', e);
                }
            });
            return bean;
        }
    }, {
        key: 'unload',
        value: function unload(model) {
            (0, _utils2.checkMethod)('ClassRepository.unload(model)');
            (0, _utils2.checkParam)(model, 'model');

            var bean = this.beanFromDolphin.get(model.id);
            this.beanFromDolphin['delete'](model.id);
            this.beanToDolphin['delete'](bean);
            this.classInfos['delete'](model.id);
            if ((0, _utils.exists)(bean)) {
                this.beanRemovedHandlers.forEach(function (handler) {
                    try {
                        handler(model.presentationModelType, bean);
                    } catch (e) {
                        console.warn('An exception occurred while calling an onBeanRemoved-handler', e);
                    }
                });
            }
            return bean;
        }
    }, {
        key: 'spliceListEntry',
        value: function spliceListEntry(model) {
            (0, _utils2.checkMethod)('ClassRepository.spliceListEntry(model)');
            (0, _utils2.checkParam)(model, 'model');

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

},{"../bower_components/core.js/library/fn/map":1,"./constants":113,"./utils":119,"./utils.js":119}],96:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OpenDolphin = _dereq_('./OpenDolphin.js');

var _OpenDolphin2 = _interopRequireDefault(_OpenDolphin);

var _utils = _dereq_('./utils');

var _connector = _dereq_('./connector.js');

var _connector2 = _interopRequireDefault(_connector);

var _beanmanager = _dereq_('./beanmanager.js');

var _beanmanager2 = _interopRequireDefault(_beanmanager);

var _classrepo = _dereq_('./classrepo.js');

var _classrepo2 = _interopRequireDefault(_classrepo);

var _controllermanager = _dereq_('./controllermanager.js');

var _controllermanager2 = _interopRequireDefault(_controllermanager);

var _clientcontext = _dereq_('./clientcontext.js');

var _clientcontext2 = _interopRequireDefault(_clientcontext);

var _platformHttpTransmitter = _dereq_('./platformHttpTransmitter.js');

var _platformHttpTransmitter2 = _interopRequireDefault(_platformHttpTransmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientContextFactory = function () {
    function ClientContextFactory() {
        _classCallCheck(this, ClientContextFactory);
    }

    _createClass(ClientContextFactory, [{
        key: 'create',
        value: function create(url, config) {
            (0, _utils.checkMethod)('connect(url, config)');
            (0, _utils.checkParam)(url, 'url');
            console.log('Creating client context ' + url + '    ' + JSON.stringify(config));

            var builder = _OpenDolphin2.default.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
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
            return clientContext;
        }
    }]);

    return ClientContextFactory;
}();

exports.default = ClientContextFactory;

},{"./OpenDolphin.js":93,"./beanmanager.js":94,"./classrepo.js":95,"./clientcontext.js":97,"./connector.js":112,"./controllermanager.js":114,"./platformHttpTransmitter.js":117,"./utils":119}],97:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _commandFactory = _dereq_('./commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientContext = function () {
    function ClientContext(dolphin, beanManager, controllerManager, connector) {
        _classCallCheck(this, ClientContext);

        (0, _utils2.checkMethod)('ClientContext(dolphin, beanManager, controllerManager, connector)');
        (0, _utils2.checkParam)(dolphin, 'dolphin');
        (0, _utils2.checkParam)(beanManager, 'beanManager');
        (0, _utils2.checkParam)(controllerManager, 'controllerManager');
        (0, _utils2.checkParam)(connector, 'connector');

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
            (0, _utils2.checkMethod)('ClientContext.createController(name)');
            (0, _utils2.checkParam)(name, 'name');

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

},{"../bower_components/core.js/library/fn/promise":2,"./commandFactory":99,"./utils":119,"./utils.js":119,"emitter-component":80}],98:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright 2016 Canoo Engineering AG.
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

/*jslint browserify: true */

var _utils = _dereq_('./utils.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Codec = function () {
    function Codec() {
        _classCallCheck(this, Codec);
    }

    _createClass(Codec, null, [{
        key: 'encodeCreatePresentationModelCommand',
        value: function encodeCreatePresentationModelCommand(command) {
            return {
                'p': command.pmId,
                't': command.pmType,
                'a': command.attributes.map(function (attribute) {
                    var result = {
                        'n': attribute.propertyName,
                        'i': attribute.id
                    };
                    if ((0, _utils.exists)(attribute.value)) {
                        result.v = attribute.value;
                    }
                    return result;
                }),
                'id': 'CreatePresentationModel'
            };
        }
    }, {
        key: 'decodeCreatePresentationModelCommand',
        value: function decodeCreatePresentationModelCommand(command) {
            return {
                'id': 'CreatePresentationModel',
                'className': "org.opendolphin.core.comm.CreatePresentationModelCommand",
                'clientSideOnly': false,
                'pmId': command.p,
                'pmType': command.t,
                'attributes': command.a.map(function (attribute) {
                    return {
                        'propertyName': attribute.n,
                        'id': attribute.i,
                        'value': (0, _utils.exists)(attribute.v) ? attribute.v : null,
                        'qualifier': null
                    };
                })
            };
        }
    }, {
        key: 'encodeValueChangedCommand',
        value: function encodeValueChangedCommand(command) {
            var result = {
                'a': command.attributeId
            };
            if ((0, _utils.exists)(command.oldValue)) {
                result.o = command.oldValue;
            }
            if ((0, _utils.exists)(command.newValue)) {
                result.n = command.newValue;
            }
            result.id = 'ValueChanged';
            return result;
        }
    }, {
        key: 'decodeValueChangedCommand',
        value: function decodeValueChangedCommand(command) {
            return {
                'id': 'ValueChanged',
                'className': "org.opendolphin.core.comm.ValueChangedCommand",
                'attributeId': command.a,
                'oldValue': (0, _utils.exists)(command.o) ? command.o : null,
                'newValue': (0, _utils.exists)(command.n) ? command.n : null
            };
        }
    }, {
        key: 'encode',
        value: function encode(commands) {
            var self = this;
            return JSON.stringify(commands.map(function (command) {
                if (command.id === 'CreatePresentationModel') {
                    return self.encodeCreatePresentationModelCommand(command);
                } else if (command.id === 'ValueChanged') {
                    return self.encodeValueChangedCommand(command);
                }
                return command;
            }));
        }
    }, {
        key: 'decode',
        value: function decode(transmitted) {
            var self = this;
            if (typeof transmitted === 'string') {
                return JSON.parse(transmitted).map(function (command) {
                    if (command.id === 'CreatePresentationModel') {
                        return self.decodeCreatePresentationModelCommand(command);
                    } else if (command.id === 'ValueChanged') {
                        return self.decodeValueChangedCommand(command);
                    }
                    return command;
                });
            } else {
                return transmitted;
            }
        }
    }]);

    return Codec;
}();

exports.default = Codec;

},{"./utils.js":119}],99:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _createContextCommand = _dereq_('./commands/createContextCommand.js');

var _createContextCommand2 = _interopRequireDefault(_createContextCommand);

var _createControllerCommand = _dereq_('./commands/createControllerCommand.js');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _callActionCommand = _dereq_('./commands/callActionCommand.js');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

var _destroyControllerCommand = _dereq_('./commands/destroyControllerCommand.js');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _destroyContextCommand = _dereq_('./commands/destroyContextCommand.js');

var _destroyContextCommand2 = _interopRequireDefault(_destroyContextCommand);

var _startLongPollCommand = _dereq_('./commands/startLongPollCommand.js');

var _startLongPollCommand2 = _interopRequireDefault(_startLongPollCommand);

var _interruptLongPollCommand = _dereq_('./commands/interruptLongPollCommand.js');

var _interruptLongPollCommand2 = _interopRequireDefault(_interruptLongPollCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            return new _createControllerCommand2.default(controllerName, parentControllerId);
        }
    }, {
        key: 'createCallActionCommand',
        value: function createCallActionCommand(controllerid, actionName, params) {
            return new _callActionCommand2.default(controllerid, actionName, params);
        }
    }, {
        key: 'createDestroyControllerCommand',
        value: function createDestroyControllerCommand(controllerId) {
            return new _destroyControllerCommand2.default(controllerId);
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
    }]);

    return CommandFactory;
}();

exports.default = CommandFactory;

},{"./commands/callActionCommand.js":100,"./commands/createContextCommand.js":103,"./commands/createControllerCommand.js":104,"./commands/destroyContextCommand.js":106,"./commands/destroyControllerCommand.js":107,"./commands/interruptLongPollCommand.js":108,"./commands/startLongPollCommand.js":110}],100:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CallActionCommand = function CallActionCommand(controllerid, actionName, params) {
    _classCallCheck(this, CallActionCommand);

    (0, _utils.checkMethod)('CreateControllerCommand.invoke(controllerid, actionName, params)');
    (0, _utils.checkParam)(controllerid, 'controllerid');
    (0, _utils.checkParam)(actionName, 'actionName');

    this.id = 'CallAction';
    this.c = controllerid;
    this.n = actionName;
    this.p = params;
};

exports.default = CallActionCommand;

},{"../utils":119}],101:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChangeAttributeMetadataCommand = function ChangeAttributeMetadataCommand(attributeId, metadataName, value) {
    _classCallCheck(this, ChangeAttributeMetadataCommand);

    this.id = 'ChangeAttributeMetadata';

    this.attributeId = attributeId;
    this.metadataName = metadataName;
    this.value = value;
};

exports.default = ChangeAttributeMetadataCommand;

},{}],102:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DOLPHIN_PLATFORM_PREFIX = exports.DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var CREATE_CONTEXT_COMMAND_NAME = exports.CREATE_CONTEXT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'initClientContext';
var DESTROY_CONTEXT_COMMAND_NAME = exports.DESTROY_CONTEXT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'disconnectClientContext';
var CREATE_CONTROLLER_COMMAND_NAME = exports.CREATE_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'registerController';
var DESTROY_CONTROLLER_COMMAND_NAME = exports.DESTROY_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'destroyController';
var CALL_CONTROLLER_ACTION_COMMAND_NAME = exports.CALL_CONTROLLER_ACTION_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
var START_LONG_POLL_COMMAND_NAME = exports.START_LONG_POLL_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'longPoll';
var INTERRUPT_LONG_POLL_COMMAND_NAME = exports.INTERRUPT_LONG_POLL_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'release';

},{}],103:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreateContextCommand = function CreateContextCommand() {
    _classCallCheck(this, CreateContextCommand);

    (0, _utils.checkMethod)('CreateContextCommand.invoke()');
    this.id = 'CreateContext';
};

exports.default = CreateContextCommand;

},{"../utils":119}],104:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreateControllerCommand = function CreateControllerCommand(controllerName, parentControllerId) {
    _classCallCheck(this, CreateControllerCommand);

    (0, _utils.checkMethod)('CreateControllerCommand.invoke(controllerName, parentControllerId)');
    (0, _utils.checkParam)(controllerName, 'controllerName');

    this.id = 'CreateController';
    this.n = controllerName;
    this.p = parentControllerId;
};

exports.default = CreateControllerCommand;

},{"../utils":119}],105:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreatePresentationModelCommand = function CreatePresentationModelCommand(presentationModel) {
    _classCallCheck(this, CreatePresentationModelCommand);

    this.id = "CreatePresentationModel";

    this.attributes = [];
    this.clientSideOnly = false;
    this.pmId = presentationModel.id;
    this.pmType = presentationModel.presentationModelType;
    var attrs = this.attributes;
    presentationModel.getAttributes().forEach(function (attr) {
        attrs.push({
            propertyName: attr.propertyName,
            id: attr.id,
            qualifier: attr.getQualifier(),
            value: attr.getValue()
        });
    });
};

exports.default = CreatePresentationModelCommand;

},{}],106:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DestroyContextCommand = function DestroyContextCommand() {
    _classCallCheck(this, DestroyContextCommand);

    (0, _utils.checkMethod)('DestroyContextCommand()');

    this.id = 'DestroyContext';
};

exports.default = DestroyContextCommand;

},{"../utils":119}],107:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = _dereq_('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DestroyControllerCommand = function DestroyControllerCommand(controllerId) {
    _classCallCheck(this, DestroyControllerCommand);

    (0, _utils.checkMethod)('DestroyControllerCommand(controllerId)');
    (0, _utils.checkParam)(controllerId, 'controllerId');

    this.id = 'DestroyController';
    this.c = controllerId;
};

exports.default = DestroyControllerCommand;

},{"../utils":119}],108:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('./commandConstants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InterruptLongPollCommand = function InterruptLongPollCommand() {
    _classCallCheck(this, InterruptLongPollCommand);

    this.id = _commandConstants.INTERRUPT_LONG_POLL_COMMAND_NAME;
};

exports.default = InterruptLongPollCommand;

},{"./commandConstants":102}],109:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeletedPresentationModelNotification = function DeletedPresentationModelNotification(pmId) {
    _classCallCheck(this, DeletedPresentationModelNotification);

    this.id = 'DeletedPresentationModel';

    this.pmId = pmId;
};

exports.default = DeletedPresentationModelNotification;

},{}],110:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandConstants = _dereq_('./commandConstants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StartLongPollCommand = function StartLongPollCommand() {
    _classCallCheck(this, StartLongPollCommand);

    this.id = _commandConstants.START_LONG_POLL_COMMAND_NAME;
};

exports.default = StartLongPollCommand;

},{"./commandConstants":102}],111:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueChangedCommand = function ValueChangedCommand(attributeId, newValue) {
    _classCallCheck(this, ValueChangedCommand);

    this.id = "ValueChanged";

    this.attributeId = attributeId;
    this.newValue = newValue;
};

exports.default = ValueChangedCommand;

},{}],112:[function(_dereq_,module,exports){
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

/*jslint browserify: true */
/* global console */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

var _commandFactory = _dereq_('./commandFactory');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _constants = _dereq_('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

        (0, _utils2.checkMethod)('Connector(url, dolphin, classRepository, config)');
        (0, _utils2.checkParam)(url, 'url');
        (0, _utils2.checkParam)(dolphin, 'dolphin');
        (0, _utils2.checkParam)(classRepository, 'classRepository');

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
            setTimeout(function () {
                that.dolphin.startPushListening(_commandFactory2.default.createStartLongPollCommand(), _commandFactory2.default.createInterruptLongPollCommand());
            }, 0);
        }
    }, {
        key: 'onModelAdded',
        value: function onModelAdded(model) {
            (0, _utils2.checkMethod)('Connector.onModelAdded(model)');
            (0, _utils2.checkParam)(model, 'model');

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
            (0, _utils2.checkMethod)('Connector.onModelRemoved(model)');
            (0, _utils2.checkParam)(model, 'model');
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
            (0, _utils2.checkMethod)('Connector.invoke(command)');
            (0, _utils2.checkParam)(command, 'command');

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

},{"../bower_components/core.js/library/fn/promise":2,"./commandFactory":99,"./constants":113,"./utils":119,"./utils.js":119}],113:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

},{}],114:[function(_dereq_,module,exports){
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

/*jslint browserify: true */
/* global console */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _set = _dereq_('../bower_components/core.js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

var _controllerproxy = _dereq_('./controllerproxy.js');

var _controllerproxy2 = _interopRequireDefault(_controllerproxy);

var _commandFactory = _dereq_('./commandFactory.js');

var _commandFactory2 = _interopRequireDefault(_commandFactory);

var _connector = _dereq_('./connector.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
                            actionParams.push({ n: param, v: value });
                        }
                    }
                }

                self.connector.invoke(_commandFactory2.default.createCallActionCommand(controllerId, actionName, actionParams)).then(function () {
                    var isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
                    if (isError) {
                        reject(new Error("ControllerAction caused an error"));
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

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./commandFactory.js":99,"./connector.js":112,"./controllerproxy.js":115,"./utils":119}],115:[function(_dereq_,module,exports){
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

/*jslint browserify: true */
/* global console */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = _dereq_('../bower_components/core.js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
                    console.warn('An exception occurred while calling an onDestroyed-handler', e);
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

},{"../bower_components/core.js/library/fn/set":3,"./utils":119}],116:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

},{}],117:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright 2016 Canoo Engineering AG.
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

var _emitterComponent = _dereq_('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _utils = _dereq_('./utils');

var _errors = _dereq_('./errors.js');

var _codec = _dereq_('./codec.js');

var _codec2 = _interopRequireDefault(_codec);

var _remotingErrorHandler = _dereq_('./remotingErrorHandler');

var _remotingErrorHandler2 = _interopRequireDefault(_remotingErrorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
                                    resolve(http.responseText);
                                    break;
                                }

                            case REQUEST_TIMEOUT:
                                _this._handleError(reject, new _errors.DolphinSessionError('PlatformHttpTransmitter: Session Timeout'));
                                break;

                            default:
                                if (_this.failed_attempt <= _this.maxRetry) {
                                    _this.failed_attempt = _this.failed_attempt + 1;
                                }
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
                if (_this.failed_attempt > _this.maxRetry) {
                    setTimeout(function () {
                        http.send(_codec2.default.encode(commands));
                    }, _this.timeout);
                } else {
                    http.send(_codec2.default.encode(commands));
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


(0, _emitterComponent2.default)(PlatformHttpTransmitter.prototype);

},{"./codec.js":98,"./errors.js":116,"./remotingErrorHandler":118,"./utils":119,"emitter-component":80}],118:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RemotingErrorHandler = function () {
    function RemotingErrorHandler() {
        _classCallCheck(this, RemotingErrorHandler);
    }

    _createClass(RemotingErrorHandler, [{
        key: "onError",
        value: function onError(error) {
            window.console.error(error);
        }
    }]);

    return RemotingErrorHandler;
}();

exports.default = RemotingErrorHandler;

},{}],119:[function(_dereq_,module,exports){
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

/*jslint browserify: true */
"use strict";

var checkMethodName;

var exists = function exists(object) {
    return typeof object !== 'undefined' && object !== null;
};

module.exports.exists = exists;

module.exports.checkMethod = function (name) {
    checkMethodName = name;
};

module.exports.checkParam = function (param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + checkMethodName);
    }
};

},{}]},{},[96])(96)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktbWV0aG9kcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwic3JjL0F0dHJpYnV0ZS5qcyIsInNyYy9DbGllbnRBdHRyaWJ1dGUuanMiLCJzcmMvQ2xpZW50Q29ubmVjdG9yLmpzIiwic3JjL0NsaWVudERvbHBoaW4uanMiLCJzcmMvQ2xpZW50TW9kZWxTdG9yZS5qcyIsInNyYy9DbGllbnRQcmVzZW50YXRpb25Nb2RlbC5qcyIsInNyYy9Db2RlYy5qcyIsInNyYy9Db21tYW5kQmF0Y2hlci5qcyIsInNyYy9Eb2xwaGluQnVpbGRlci5qcyIsInNyYy9FdmVudEJ1cy5qcyIsInNyYy9IdHRwVHJhbnNtaXR0ZXIuanMiLCJzcmMvTm9UcmFuc21pdHRlci5qcyIsInNyYy9PcGVuRG9scGhpbi5qcyIsInNyYy9iZWFubWFuYWdlci5qcyIsInNyYy9jbGFzc3JlcG8uanMiLCJzcmMvY2xpZW50Q29udGV4dEZhY3RvcnkuanMiLCJzcmMvY2xpZW50Y29udGV4dC5qcyIsInNyYy9jb2RlYy5qcyIsInNyYy9jb21tYW5kRmFjdG9yeS5qcyIsInNyYy9jb21tYW5kcy9jYWxsQWN0aW9uQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9jaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvY29tbWFuZENvbnN0YW50cy5qcyIsInNyYy9jb21tYW5kcy9jcmVhdGVDb250ZXh0Q29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9jcmVhdGVDb250cm9sbGVyQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9jcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvZGVzdHJveUNvbnRleHRDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9pbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvcHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9zdGFydExvbmdQb2xsQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy92YWx1ZUNoYW5nZWRDb21tYW5kLmpzIiwic3JjL2Nvbm5lY3Rvci5qcyIsInNyYy9jb25zdGFudHMuanMiLCJzcmMvY29udHJvbGxlcm1hbmFnZXIuanMiLCJzcmMvY29udHJvbGxlcnByb3h5LmpzIiwic3JjL2Vycm9ycy5qcyIsInNyYy9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5qcyIsInNyYy9yZW1vdGluZ0Vycm9ySGFuZGxlci5qcyIsInNyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsUUFBUSxpQ0FBUjtBQUNBLFFBQVEsZ0NBQVI7QUFDQSxRQUFRLDZCQUFSO0FBQ0EsUUFBUSxvQkFBUjtBQUNBLFFBQVEsNEJBQVI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxrQkFBUixFQUE0QixHQUE3Qzs7Ozs7QUNMQSxRQUFRLGlDQUFSO0FBQ0EsUUFBUSxnQ0FBUjtBQUNBLFFBQVEsNkJBQVI7QUFDQSxRQUFRLHdCQUFSO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFFBQVEsa0JBQVIsRUFBNEIsT0FBN0M7Ozs7O0FDSkEsUUFBUSxpQ0FBUjtBQUNBLFFBQVEsZ0NBQVI7QUFDQSxRQUFRLDZCQUFSO0FBQ0EsUUFBUSxvQkFBUjtBQUNBLFFBQVEsNEJBQVI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxrQkFBUixFQUE0QixHQUE3Qzs7Ozs7QUNMQSxPQUFPLE9BQVAsR0FBaUIsVUFBUyxFQUFULEVBQVk7QUFDM0IsTUFBRyxPQUFPLEVBQVAsSUFBYSxVQUFoQixFQUEyQixNQUFNLFVBQVUsS0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztJQ25LcUIsUzs7OztrQkFBQSxTOzs7QUFHckIsVUFBVSxrQkFBVixHQUErQixXQUEvQjtBQUNBLFVBQVUsS0FBVixHQUFrQixPQUFsQjs7Ozs7Ozs7O0FD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QUVNLE8sRUFBUztBQUFBOztBQUNaLGlCQUFLLEtBQUwsQ0FBVyxDQUFDLE9BQUQsQ0FBWCxFQUNLLEtBREwsQ0FDVztBQUFBLHVCQUFTLE9BQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkIsQ0FBVDtBQUFBLGFBRFg7QUFFSDs7Ozs7O2tCQS9HZ0IsdUI7OztBQWtIckIsZ0NBQVEsd0JBQXdCLFNBQWhDOzs7Ozs7Ozs7Ozs7O0lDaEpxQixvQjs7Ozs7OztnQ0FFVCxLLEVBQU87QUFDWCxtQkFBTyxPQUFQLENBQWUsS0FBZixDQUFxQixLQUFyQjtBQUNIOzs7Ozs7a0JBSmdCLG9COzs7QUNEckI7Ozs7Ozs7Ozs7Ozs7OztBQWVBO0FBQ0E7O0FBRUEsSUFBSSxlQUFKOztBQUVBLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBUyxNQUFULEVBQWlCO0FBQzFCLFdBQU8sT0FBTyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDLFdBQVcsSUFBbkQ7QUFDSCxDQUZEOztBQUlBLE9BQU8sT0FBUCxDQUFlLE1BQWYsR0FBd0IsTUFBeEI7O0FBRUEsT0FBTyxPQUFQLENBQWUsV0FBZixHQUE2QixVQUFTLElBQVQsRUFBZTtBQUN4QyxzQkFBa0IsSUFBbEI7QUFDSCxDQUZEOztBQUlBLE9BQU8sT0FBUCxDQUFlLFVBQWYsR0FBNEIsVUFBUyxLQUFULEVBQWdCLGFBQWhCLEVBQStCO0FBQ3ZELFFBQUksQ0FBQyxPQUFPLEtBQVAsQ0FBTCxFQUFvQjtBQUNoQixjQUFNLElBQUksS0FBSixDQUFVLG1CQUFtQixhQUFuQixHQUFtQyxtQkFBbkMsR0FBeUQsZUFBbkUsQ0FBTjtBQUNIO0FBQ0osQ0FKRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuTWFwOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5Qcm9taXNlOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zZXQnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnNldC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5TZXQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKXtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlciwgSVRFUkFUT1Ipe1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvck9mKGl0ZXIsIGZhbHNlLCByZXN1bHQucHVzaCwgcmVzdWx0LCBJVEVSQVRPUik7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGFzYyAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSwgJGNyZWF0ZSl7XG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVhcbiAgICAsIGNyZWF0ZSAgICAgICAgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QoJHRoaXMpXG4gICAgICAsIHNlbGYgICA9IElPYmplY3QoTylcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGlzQXJyYXkgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIFNQRUNJRVMgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCl7XG4gIHZhciBDO1xuICBpZihpc0FycmF5KG9yaWdpbmFsKSl7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKUMgPSB1bmRlZmluZWQ7XG4gICAgaWYoaXNPYmplY3QoQykpe1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZihDID09PSBudWxsKUMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59OyIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxlbmd0aCl7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59OyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgY3JlYXRlICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGFuSW5zdGFuY2UgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGRlZmluZWQgICAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpXG4gICwgZm9yT2YgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKVxuICAsIHN0ZXAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBzZXRTcGVjaWVzICA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBmYXN0S2V5ICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5XG4gICwgU0laRSAgICAgICAgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uKHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXQuX2YgPT0gZW50cnkpdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdC5fbCA9PSBlbnRyeSl0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgJ2ZvckVhY2gnKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpXG4gICAgICAgICAgLCBlbnRyeTtcbiAgICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKERFU0NSSVBUT1JTKWRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGRlZmluZWQodGhpc1tTSVpFXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxuICAgICAgLCBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZihlbnRyeSl7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZighdGhhdC5fZil0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgICAgIHRoaXMuX3QgPSBpdGVyYXRlZDsgIC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAsIGtpbmQgID0gdGhhdC5fa1xuICAgICAgICAsIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBmcm9tICAgID0gcmVxdWlyZSgnLi9fYXJyYXktZnJvbS1pdGVyYWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRvSlNPTigpe1xuICAgIGlmKGNsYXNzb2YodGhpcykgIT0gTkFNRSl0aHJvdyBUeXBlRXJyb3IoTkFNRSArIFwiI3RvSlNPTiBpc24ndCBnZW5lcmljXCIpO1xuICAgIHJldHVybiBmcm9tKHRoaXMpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBtZXRhICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKVxuICAsIGZhaWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmVBbGwgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGZvck9mICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBhbkluc3RhbmNlICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZFAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgZWFjaCAgICAgICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMClcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSBnbG9iYWxbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIGlmKCFERVNDUklQVE9SUyB8fCB0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGFyZ2V0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSwgJ19jJyk7XG4gICAgICB0YXJnZXQuX2MgPSBuZXcgQmFzZTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0YXJnZXRbQURERVJdLCB0YXJnZXQpO1xuICAgIH0pO1xuICAgIGVhY2goJ2FkZCxjbGVhcixkZWxldGUsZm9yRWFjaCxnZXQsaGFzLHNldCxrZXlzLHZhbHVlcyxlbnRyaWVzLHRvSlNPTicuc3BsaXQoJywnKSxmdW5jdGlvbihLRVkpe1xuICAgICAgdmFyIElTX0FEREVSID0gS0VZID09ICdhZGQnIHx8IEtFWSA9PSAnc2V0JztcbiAgICAgIGlmKEtFWSBpbiBwcm90byAmJiAhKElTX1dFQUsgJiYgS0VZID09ICdjbGVhcicpKWhpZGUoQy5wcm90b3R5cGUsIEtFWSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgS0VZKTtcbiAgICAgICAgaWYoIUlTX0FEREVSICYmIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpKXJldHVybiBLRVkgPT0gJ2dldCcgPyB1bmRlZmluZWQgOiBmYWxzZTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2NbS0VZXShhID09PSAwID8gMCA6IGEsIGIpO1xuICAgICAgICByZXR1cm4gSVNfQURERVIgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoJ3NpemUnIGluIHByb3RvKWRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiwgTyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjQuMCd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV1cbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDKXtcbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQztcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYoSVNfUFJPVE8pe1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0paGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKVxuICAsIEJSRUFLICAgICAgID0ge31cbiAgLCBSRVRVUk4gICAgICA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1Ipe1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbigpeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLICA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJ2YXIgSVRFUkFUT1IgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHJldHVybiB7ZG9uZTogc2FmZSA9IHRydWV9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwidmFyIE1FVEEgICAgID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKVxuICAsIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBoYXMgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgc2V0RGVzYyAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaWQgICAgICAgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24oaXQpe1xuICBzZXREZXNjKGl0LCBNRVRBLCB7dmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9fSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKXNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiAgICAgIE1FVEEsXG4gIE5FRUQ6ICAgICBmYWxzZSxcbiAgZmFzdEtleTogIGZhc3RLZXksXG4gIGdldFdlYWs6ICBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBQcm9taXNlICAgPSBnbG9iYWwuUHJvbWlzZVxuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZShoZWFkKXtcbiAgICAgIGZuICAgPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICBpZihoZWFkKW5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmKGlzTm9kZSl7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlclxuICB9IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICAgIHZhciB0b2dnbGUgPSB0cnVlXG4gICAgICAsIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpe1xuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZH07XG4gICAgaWYobGFzdClsYXN0Lm5leHQgPSB0YXNrO1xuICAgIGlmKCFoZWFkKXtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07IiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGRQcyAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIEVtcHR5ICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIFBST1RPVFlQRSAgID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGVudW1CdWdLZXlzLmxlbmd0aFxuICAgICwgbHQgICAgID0gJzwnXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcyl7XG4gIHZhciByZXN1bHQ7XG4gIGlmKE8gIT09IG51bGwpe1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzICAgPSBnZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIFA7XG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59OyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMsIHNhZmUpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpe1xuICAgIGlmKHNhZmUgJiYgdGFyZ2V0W2tleV0pdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IHR5cGVvZiBjb3JlW0tFWV0gPT0gJ2Z1bmN0aW9uJyA/IGNvcmVbS0VZXSA6IGdsb2JhbFtLRVldO1xuICBpZihERVNDUklQVE9SUyAmJiBDICYmICFDW1NQRUNJRVNdKWRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIEQpe1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yLCBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGludm9rZSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spe1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmxjell1YjJKcVpXTjBMblJ2TFhOMGNtbHVaeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNsYXNzb2YgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsICRleHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaXNPYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gICAgICAgICAgPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBhbkluc3RhbmNlICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZm9yT2YgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCB0YXNrICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgbWljcm90YXNrICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKVxuICAsIFBST01JU0UgICAgICAgICAgICA9ICdQcm9taXNlJ1xuICAsIFR5cGVFcnJvciAgICAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsICRQcm9taXNlICAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICAgICAgICAgID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBlbXB0eSAgICAgICAgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgSW50ZXJuYWwsIEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgICAgID0gJFByb21pc2UucmVzb2x2ZSgxKVxuICAgICAgLCBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24oZXhlYyl7IGV4ZWMoZW1wdHksIGVtcHR5KTsgfTtcbiAgICAvLyB1bmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgcmV0dXJuIChpc05vZGUgfHwgdHlwZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCA9PSAnZnVuY3Rpb24nKSAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2U7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyB3aXRoIGxpYnJhcnkgd3JhcHBlciBzcGVjaWFsIGNhc2VcbiAgcmV0dXJuIGEgPT09IGIgfHwgYSA9PT0gJFByb21pc2UgJiYgYiA9PT0gV3JhcHBlcjtcbn07XG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgcmV0dXJuIHNhbWVDb25zdHJ1Y3RvcigkUHJvbWlzZSwgQylcbiAgICA/IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgIDogbmV3IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG52YXIgUHJvbWlzZUNhcGFiaWxpdHkgPSBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24oJCRyZXNvbHZlLCAkJHJlamVjdCl7XG4gICAgaWYocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCAgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocHJvbWlzZSwgaXNSZWplY3Qpe1xuICBpZihwcm9taXNlLl9uKXJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgb2sgICAgPSBwcm9taXNlLl9zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgZG9tYWluICA9IHJlYWN0aW9uLmRvbWFpblxuICAgICAgICAsIHJlc3VsdCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmKGhhbmRsZXIpe1xuICAgICAgICAgIGlmKCFvayl7XG4gICAgICAgICAgICBpZihwcm9taXNlLl9oID09IDIpb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoaGFuZGxlciA9PT0gdHJ1ZSlyZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKW9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIGFicnVwdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYoYWJydXB0KXRocm93IGFicnVwdC5lcnJvcjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIGlmKHByb21pc2UuX2ggPT0gMSlyZXR1cm4gZmFsc2U7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2EgfHwgcHJvbWlzZS5fY1xuICAgICwgaSAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3Rpb24gPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0aW9uLmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0aW9uLnByb21pc2UpKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZihpc05vZGUpe1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKXtcbiAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdn0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYoIXByb21pc2UuX2EpcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHByb21pc2UgPT09IHZhbHVlKXRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7X3c6IHByb21pc2UsIF9kOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe193OiBwcm9taXNlLCBfZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciByZWFjdGlvbiAgICA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgICAgID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsICAgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9hKXRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9zKW5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwcm9taXNlICA9IG5ldyBJbnRlcm5hbDtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogJFByb21pc2V9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlamVjdCAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mICRQcm9taXNlICYmIHNhbWVDb25zdHJ1Y3Rvcih4LmNvbnN0cnVjdG9yLCB0aGlzKSlyZXR1cm4geDtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWx1ZXMgICAgPSBbXVxuICAgICAgICAsIGluZGV4ICAgICA9IDBcbiAgICAgICAgLCByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgdmFyICRpbmRleCAgICAgICAgPSBpbmRleCsrXG4gICAgICAgICAgLCBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCAgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlc1skaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ1NldCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnTWFwJywge3RvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpfSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnU2V0Jywge3RvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ1NldCcpfSk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5mb3IodmFyIGNvbGxlY3Rpb25zID0gWydOb2RlTGlzdCcsICdET01Ub2tlbkxpc3QnLCAnTWVkaWFMaXN0JywgJ1N0eWxlU2hlZXRMaXN0JywgJ0NTU1J1bGVMaXN0J10sIGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgdmFyIE5BTUUgICAgICAgPSBjb2xsZWN0aW9uc1tpXVxuICAgICwgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXVxuICAgICwgcHJvdG8gICAgICA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmKHByb3RvICYmICFwcm90b1tUT19TVFJJTkdfVEFHXSloaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXR0cmlidXRlIHtcbn1cblxuQXR0cmlidXRlLlFVQUxJRklFUl9QUk9QRVJUWSA9IFwicXVhbGlmaWVyXCI7XG5BdHRyaWJ1dGUuVkFMVUUgPSBcInZhbHVlXCI7XG4iLCJpbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cyc7XG5cbmNsYXNzIENsaWVudEF0dHJpYnV0ZSB7XG4gICAgY29uc3RydWN0b3IocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICB0aGlzLmlkID0gXCJcIiArIChDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCsrKSArIFwiQ1wiO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLnNldFF1YWxpZmllcihxdWFsaWZpZXIpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50QXR0cmlidXRlKHRoaXMucHJvcGVydHlOYW1lLCB0aGlzLmdldFF1YWxpZmllcigpLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHNldFByZXNlbnRhdGlvbk1vZGVsKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICBhbGVydChcIllvdSBjYW4gbm90IHNldCBhIHByZXNlbnRhdGlvbiBtb2RlbCBmb3IgYW4gYXR0cmlidXRlIHRoYXQgaXMgYWxyZWFkeSBib3VuZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbCA9IHByZXNlbnRhdGlvbk1vZGVsO1xuICAgIH1cblxuICAgIGdldFByZXNlbnRhdGlvbk1vZGVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbDtcbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgc2V0VmFsdWUobmV3VmFsdWUpIHtcbiAgICAgICAgdmFyIHZlcmlmaWVkVmFsdWUgPSBDbGllbnRBdHRyaWJ1dGUuY2hlY2tWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlID09IHZlcmlmaWVkVmFsdWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2ZXJpZmllZFZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRWYWx1ZSwgJ25ld1ZhbHVlJzogdmVyaWZpZWRWYWx1ZSB9KTtcbiAgICB9XG5cbiAgICBzZXRRdWFsaWZpZXIobmV3UXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICh0aGlzLnF1YWxpZmllciA9PSBuZXdRdWFsaWZpZXIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBvbGRRdWFsaWZpZXIgPSB0aGlzLnF1YWxpZmllcjtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXIgPSBuZXdRdWFsaWZpZXI7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRRdWFsaWZpZXIsICduZXdWYWx1ZSc6IG5ld1F1YWxpZmllciB9KTtcbiAgICB9XG5cbiAgICBnZXRRdWFsaWZpZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1YWxpZmllcjtcbiAgICB9XG5cbiAgICBvblZhbHVlQ2hhbmdlKGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgZXZlbnRIYW5kbGVyKHsgXCJvbGRWYWx1ZVwiOiB0aGlzLnZhbHVlLCBcIm5ld1ZhbHVlXCI6IHRoaXMudmFsdWUgfSk7XG4gICAgfVxuXG4gICAgb25RdWFsaWZpZXJDaGFuZ2UoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTsgLy8gc2VxdWVuY2UgaXMgaW1wb3J0YW50XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHNvdXJjZUF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgY2hlY2tWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFN0cmluZyB8fCByZXN1bHQgaW5zdGFuY2VvZiBCb29sZWFuIHx8IHJlc3VsdCBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWUudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBDbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW4gQXR0cmlidXRlIG1heSBub3QgaXRzZWxmIGNvbnRhaW4gYW4gYXR0cmlidXRlIGFzIGEgdmFsdWUuIEFzc3VtaW5nIHlvdSBmb3Jnb3QgdG8gY2FsbCB2YWx1ZS5cIik7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmNoZWNrVmFsdWUodmFsdWUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvayA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5TVVBQT1JURURfVkFMVUVfVFlQRVMuaW5kZXhPZih0eXBlb2YgcmVzdWx0KSA+IC0xIHx8IHJlc3VsdCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRyaWJ1dGUgdmFsdWVzIG9mIHRoaXMgdHlwZSBhcmUgbm90IGFsbG93ZWQ6IFwiICsgdHlwZW9mIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuXG5DbGllbnRBdHRyaWJ1dGUuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTID0gW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwiYm9vbGVhblwiXTtcbkNsaWVudEF0dHJpYnV0ZS5jbGllbnRBdHRyaWJ1dGVJbnN0YW5jZUNvdW50ID0gMDtcbiIsImltcG9ydCB7QmxpbmRDb21tYW5kQmF0Y2hlcn0gZnJvbSAnLi9Db21tYW5kQmF0Y2hlcic7XG5pbXBvcnQgQ29kZWMgZnJvbSAnLi9jb2RlYyc7XG5pbXBvcnQgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwgZnJvbSAnLi9DbGllbnRQcmVzZW50YXRpb25Nb2RlbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29ubmVjdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHRyYW5zbWl0dGVyLCBjbGllbnREb2xwaGluLCBzbGFja01TID0gMCwgbWF4QmF0Y2hTaXplID0gNTApIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucHVzaEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHJhbnNtaXR0ZXIgPSB0cmFuc21pdHRlcjtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluID0gY2xpZW50RG9scGhpbjtcbiAgICAgICAgdGhpcy5zbGFja01TID0gc2xhY2tNUztcbiAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBDb2RlYygpO1xuICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3IEJsaW5kQ29tbWFuZEJhdGNoZXIodHJ1ZSwgbWF4QmF0Y2hTaXplKTtcbiAgICB9XG5cbiAgICBzZXRDb21tYW5kQmF0Y2hlcihuZXdCYXRjaGVyKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXdCYXRjaGVyO1xuICAgIH1cblxuICAgIHNldFB1c2hFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgfVxuXG4gICAgc2V0UHVzaExpc3RlbmVyKG5ld0xpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMucHVzaExpc3RlbmVyID0gbmV3TGlzdGVuZXI7XG4gICAgfVxuXG4gICAgc2V0UmVsZWFzZUNvbW1hbmQobmV3Q29tbWFuZCkge1xuICAgICAgICB0aGlzLnJlbGVhc2VDb21tYW5kID0gbmV3Q29tbWFuZDtcbiAgICB9XG5cbiAgICBzZW5kKGNvbW1hbmQsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaCh7IGNvbW1hbmQ6IGNvbW1hbmQsIGhhbmRsZXI6IG9uRmluaXNoZWQgfSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVNlbmRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpOyAvLyB0aGVyZSBpcyBub3QgcG9pbnQgaW4gcmVsZWFzaW5nIGlmIHdlIGRvIG5vdCBzZW5kIGF0bVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZG9TZW5kTmV4dCgpO1xuICAgIH1cblxuICAgIGRvU2VuZE5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbW1hbmRRdWV1ZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wdXNoRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5xdWV1ZVB1c2hDb21tYW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgdmFyIGNtZHNBbmRIYW5kbGVycyA9IHRoaXMuY29tbWFuZEJhdGNoZXIuYmF0Y2godGhpcy5jb21tYW5kUXVldWUpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBjbWRzQW5kSGFuZGxlcnNbY21kc0FuZEhhbmRsZXJzLmxlbmd0aCAtIDFdLmhhbmRsZXI7XG4gICAgICAgIHZhciBjb21tYW5kcyA9IGNtZHNBbmRIYW5kbGVycy5tYXAoY2FoID0+IHsgcmV0dXJuIGNhaC5jb21tYW5kOyB9KTtcbiAgICAgICAgdGhpcy50cmFuc21pdHRlci50cmFuc21pdChjb21tYW5kcywgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VydmVyIHJlc3BvbnNlOiBbXCIgKyByZXNwb25zZS5tYXAoaXQgPT4gaXQuaWQpLmpvaW4oXCIsIFwiKSArIFwiXSBcIik7XG4gICAgICAgICAgICB2YXIgdG91Y2hlZFBNcyA9IFtdO1xuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaGVkID0gdGhpcy5oYW5kbGUoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgaWYgKHRvdWNoZWQpXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoZWRQTXMucHVzaCh0b3VjaGVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sub25GaW5pc2hlZCh0b3VjaGVkUE1zKTsgLy8gdG9kbzogbWFrZSB0aGVtIHVuaXF1ZT9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZSBjYWxsOiBmZXRjaCB0aGUgbmV4dCBpbiBsaW5lIGJ1dCBhbGxvdyBhIGJpdCBvZiBzbGFjayBzdWNoIHRoYXRcbiAgICAgICAgICAgIC8vIGRvY3VtZW50IGV2ZW50cyBjYW4gZmlyZSwgcmVuZGVyaW5nIGlzIGRvbmUgYW5kIGNvbW1hbmRzIGNhbiBiYXRjaCB1cFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmRvU2VuZE5leHQoKSwgdGhpcy5zbGFja01TKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlKGNvbW1hbmQpIHtcbiAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT0gXCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiVmFsdWVDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYW5ub3QgaGFuZGxlLCB1bmtub3duIGNvbW1hbmQgXCIgKyBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBoYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICB2YXIgbW9kZWwgPSB0aGlzLmNsaWVudERvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnBtSWQpO1xuICAgICAgICBpZiAoIW1vZGVsKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwsIHRydWUpO1xuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgfVxuXG4gICAgaGFuZGxlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGEgcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnBtSWQgKyBcIiAga25vd24gdG8gdGhlIGNsaWVudC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uYXR0cmlidXRlKGF0dHIucHJvcGVydHlOYW1lLCBhdHRyLnF1YWxpZmllciwgYXR0ci52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0ci5pZCAmJiBhdHRyLmlkLm1hdGNoKFwiLipTJFwiKSkge1xuICAgICAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5pZCA9IGF0dHIuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goY2xpZW50QXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjbGllbnRQbSA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQsIHNlcnZlckNvbW1hbmQucG1UeXBlKTtcbiAgICAgICAgY2xpZW50UG0uYWRkQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgIGNsaWVudFBtLmNsaWVudFNpZGVPbmx5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChjbGllbnRQbSk7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi51cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllcihjbGllbnRQbSk7XG4gICAgICAgIHJldHVybiBjbGllbnRQbTtcbiAgICB9XG5cbiAgICBoYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImF0dHJpYnV0ZSB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHVwZGF0ZSB0byBuZXcgdmFsdWUgXCIgKyBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSA9PSBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibm90aGluZyB0byBkby4gbmV3IHZhbHVlID09IG9sZCB2YWx1ZVwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRWYWx1ZShzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaGFuZGxlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICBpZiAoIWNsaWVudEF0dHJpYnV0ZSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBjbGllbnRBdHRyaWJ1dGVbc2VydmVyQ29tbWFuZC5tZXRhZGF0YU5hbWVdID0gc2VydmVyQ29tbWFuZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGlzdGVuKCkge1xuICAgICAgICBpZiAoIXRoaXMucHVzaEVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLndhaXRpbmcpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIHRvZG86IGhvdyB0byBpc3N1ZSBhIHdhcm5pbmcgaWYgbm8gcHVzaExpc3RlbmVyIGlzIHNldD9cbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRseVNlbmRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZG9TZW5kTmV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5xdWV1ZVB1c2hDb21tYW5kKCkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIGNvbW1hbmQ6IHRoaXMucHVzaExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlcjoge1xuICAgICAgICAgICAgICAgIG9uRmluaXNoZWQ6IGZ1bmN0aW9uICgpIHsgbWUud2FpdGluZyA9IGZhbHNlOyB9LFxuICAgICAgICAgICAgICAgIG9uRmluaXNoZWREYXRhOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbGVhc2UoKSB7XG4gICAgICAgIGlmICghdGhpcy53YWl0aW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyByZWxlYXNlQ29tbWFuZCBpcyBzZXQ/XG4gICAgICAgIHRoaXMudHJhbnNtaXR0ZXIuc2lnbmFsKHRoaXMucmVsZWFzZUNvbW1hbmQpO1xuICAgIH1cbn0iLCJpbXBvcnQgQ2xpZW50QXR0cmlidXRlIGZyb20gJy4vQ2xpZW50QXR0cmlidXRlJ1xuaW1wb3J0IENsaWVudFByZXNlbnRhdGlvbk1vZGVsIGZyb20gJy4vQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudERvbHBoaW4ge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50Q29ubmVjdG9yKGNsaWVudENvbm5lY3Rvcikge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3RvciA9IGNsaWVudENvbm5lY3RvcjtcbiAgICB9XG5cbiAgICBnZXRDbGllbnRDb25uZWN0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudENvbm5lY3RvcjtcbiAgICB9XG5cbiAgICBzZW5kKGNvbW1hbmQsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChjb21tYW5kLCBvbkZpbmlzaGVkKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2xpZW50QXR0cmlidXRlKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJlc2VudGF0aW9uTW9kZWwoaWQsIHR5cGUsIC4uLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKGlkLCB0eXBlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIG1vZGVsLmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuYWRkKG1vZGVsKTtcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cblxuICAgIHNldENsaWVudE1vZGVsU3RvcmUoY2xpZW50TW9kZWxTdG9yZSkge1xuICAgICAgICB0aGlzLmNsaWVudE1vZGVsU3RvcmUgPSBjbGllbnRNb2RlbFN0b3JlO1xuICAgIH1cblxuICAgIGdldENsaWVudE1vZGVsU3RvcmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudE1vZGVsU3RvcmU7XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkubGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzKCk7XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVscygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKTtcbiAgICB9XG5cbiAgICBmaW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICB9XG5cbiAgICBnZXRBdChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICB9XG5cbiAgICBmaW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICB9XG5cbiAgICBkZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbFRvRGVsZXRlKSB7XG4gICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsVG9EZWxldGUsIHRydWUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVByZXNlbnRhdGlvbk1vZGVsUXVhbGlmaWVyKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIHByZXNlbnRhdGlvbk1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKHNvdXJjZUF0dHJpYnV0ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dHJpYnV0ZVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxBdHRyaWJ1dGVzQnlRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKHRhcmdldEF0dHJpYnV0ZSA9PiB7XG4gICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc2V0VmFsdWUoc291cmNlQXR0cmlidXRlLmdldFZhbHVlKCkpOyAvLyBzaG91bGQgYWx3YXlzIGhhdmUgdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhcnRQdXNoTGlzdGVuaW5nKHB1c2hDb21tYW5kLCByZWxlYXNlQ29tbWFuZCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoTGlzdGVuZXIocHVzaENvbW1hbmQpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRSZWxlYXNlQ29tbWFuZChyZWxlYXNlQ29tbWFuZCk7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKHRydWUpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5saXN0ZW4oKTtcbiAgICB9XG5cbiAgICBzdG9wUHVzaExpc3RlbmluZygpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQoZmFsc2UpO1xuICAgIH1cbn0iLCJpbXBvcnQgQXR0cmlidXRlIGZyb20gJy4vQXR0cmlidXRlJ1xuaW1wb3J0IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCBmcm9tICcuL2NvbW1hbmRzL2NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCdcbmltcG9ydCBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9jcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQnXG5pbXBvcnQgRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uIGZyb20gJy4vY29tbWFuZHMvcHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCdcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJ1xuaW1wb3J0IFZhbHVlQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy92YWx1ZUNoYW5nZWRDb21tYW5kJ1xuaW1wb3J0IHtBRERFRF9UWVBFLCBSRU1PVkVEX1RZUEV9IGZyb20gJy4vY29uc3RhbnRzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRNb2RlbFN0b3JlIHtcblxuICAgIGNvbnN0cnVjdG9yKGNsaWVudERvbHBoaW4pIHtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluID0gY2xpZW50RG9scGhpbjtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllciA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50RG9scGhpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50RG9scGhpbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck1vZGVsKG1vZGVsKSB7XG4gICAgICAgIGlmIChtb2RlbC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb25uZWN0b3IgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCk7XG4gICAgICAgIHZhciBjcmVhdGVQTUNvbW1hbmQgPSBuZXcgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKG1vZGVsKTtcbiAgICAgICAgY29ubmVjdG9yLnNlbmQoY3JlYXRlUE1Db21tYW5kLCBudWxsKTtcbiAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJBdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG4gICAgICAgIHRoaXMuYWRkQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2hlbmV2ZXIgYW4gYXR0cmlidXRlIGNoYW5nZXMgaXRzIHZhbHVlLCB0aGUgc2VydmVyIG5lZWRzIHRvIGJlIG5vdGlmaWVkXG4gICAgICAgIC8vIGFuZCBhbGwgb3RoZXIgYXR0cmlidXRlcyB3aXRoIHRoZSBzYW1lIHF1YWxpZmllciBhcmUgZ2l2ZW4gdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoKGV2dCkgPT4ge1xuICAgICAgICAgICAgdmFyIHZhbHVlQ2hhbmdlQ29tbWFuZCA9IG5ldyBWYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZS5pZCwgZXZ0Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKHZhbHVlQ2hhbmdlQ29tbWFuZCwgbnVsbCk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5maW5kQXR0cmlidXRlc0J5RmlsdGVyKChhdHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRyICE9PSBhdHRyaWJ1dGUgJiYgYXR0ci5nZXRRdWFsaWZpZXIoKSA9PSBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhdHRyLnNldFZhbHVlKGF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGF0dHJpYnV0ZS5vblF1YWxpZmllckNoYW5nZSgoZXZ0KSA9PiB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlQXR0ck1ldGFkYXRhQ21kID0gbmV3IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChhdHRyaWJ1dGUuaWQsIEF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFksIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZChjaGFuZ2VBdHRyTWV0YWRhdGFDbWQsIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGQobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFscmVhZHkgaXMgYSBQTSB3aXRoIGlkIFwiICsgbW9kZWwuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhZGRlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5hZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogQURERURfVFlQRSwgJ2NsaWVudFByZXNlbnRhdGlvbk1vZGVsJzogbW9kZWwgfSk7XG4gICAgICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFkZGVkO1xuICAgIH1cblxuICAgIHJlbW92ZShtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuZGVsZXRlKG1vZGVsLmlkKTtcbiAgICAgICAgICAgIG1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ2V2ZW50VHlwZSc6IFJFTU9WRURfVFlQRSwgJ2NsaWVudFByZXNlbnRhdGlvbk1vZGVsJzogbW9kZWwgfSk7XG4gICAgICAgICAgICByZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVtb3ZlZDtcbiAgICB9XG5cbiAgICBmaW5kQXR0cmlidXRlc0J5RmlsdGVyKGZpbHRlcikge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5mb3JFYWNoKChtb2RlbCkgPT4ge1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKGF0dHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMucHVzaChhdHRyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaGVzO1xuICAgIH1cblxuICAgIGFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgaWYgKCF0eXBlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByZXNlbnRhdGlvbk1vZGVscyA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQodHlwZSk7XG4gICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWxzKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5zZXQodHlwZSwgcHJlc2VudGF0aW9uTW9kZWxzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShwcmVzZW50YXRpb25Nb2RlbHMuaW5kZXhPZihtb2RlbCkgPiAtMSkpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5wdXNoKG1vZGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwgfHwgIShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByZXNlbnRhdGlvbk1vZGVscyA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA+IC0xKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbHMuc3BsaWNlKHByZXNlbnRhdGlvbk1vZGVscy5pbmRleE9mKG1vZGVsKSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXNlbnRhdGlvbk1vZGVscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5kZWxldGUobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgaXRlciA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmtleXMoKTtcbiAgICAgICAgdmFyIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgd2hpbGUgKCFuZXh0LmRvbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5leHQudmFsdWUpO1xuICAgICAgICAgICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVscygpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgaXRlciA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLnZhbHVlcygpO1xuICAgICAgICB2YXIgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB3aGlsZSAoIW5leHQuZG9uZSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV4dC52YWx1ZSk7XG4gICAgICAgICAgICBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmaW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5nZXQoaWQpO1xuICAgIH1cblxuICAgIGZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSh0eXBlKSB7XG4gICAgICAgIGlmICghdHlwZSB8fCAhdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmhhcyh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgIH1cblxuICAgIGRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLCBub3RpZnkpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5zUHJlc2VudGF0aW9uTW9kZWwobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZShtb2RlbCk7XG4gICAgICAgICAgICBpZiAoIW5vdGlmeSB8fCBtb2RlbC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKG5ldyBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24obW9kZWwuaWQpLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnRhaW5zUHJlc2VudGF0aW9uTW9kZWwoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhpZCk7XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgdGhpcy5hdHRyaWJ1dGVzUGVySWQuaGFzKGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5zZXQoYXR0cmlidXRlLmlkLCBhdHRyaWJ1dGUpO1xuICAgIH1cblxuICAgIHJlbW92ZUF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICF0aGlzLmF0dHJpYnV0ZXNQZXJJZC5oYXMoYXR0cmlidXRlLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkLmRlbGV0ZShhdHRyaWJ1dGUuaWQpO1xuICAgIH1cblxuICAgIGZpbmRBdHRyaWJ1dGVCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5nZXQoaWQpO1xuICAgIH1cblxuICAgIGFkZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLnNldChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCksIGF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA+IC0xKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnNwbGljZShhdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZGVsZXRlKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyKHF1YWxpZmllcikge1xuICAgICAgICBpZiAoIXF1YWxpZmllciB8fCAhdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmhhcyhxdWFsaWZpZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQocXVhbGlmaWVyKS5zbGljZSgwKTsgLy8gc2xpY2UgaXMgdXNlZCB0byBjbG9uZSB0aGUgYXJyYXlcbiAgICB9XG5cbiAgICBvbk1vZGVsU3RvcmVDaGFuZ2UoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25Nb2RlbFN0b3JlQ2hhbmdlRm9yVHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMub25FdmVudChwbVN0b3JlRXZlbnQgPT4ge1xuICAgICAgICAgICAgaWYgKHBtU3RvcmVFdmVudC5jbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUgPT0gcHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRIYW5kbGVyKHBtU3RvcmVFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vRXZlbnRCdXMnXG5cbnZhciBwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQgPSAwOyAvLyB0b2RvIGRrOiBjb25zaWRlciBtYWtpbmcgdGhpcyBzdGF0aWMgaW4gY2xhc3NcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gW107XG4gICAgICAgIHRoaXMuY2xpZW50U2lkZU9ubHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIGlkICE9PSAndW5kZWZpbmVkJyAmJiBpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gKHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCsrKS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXMoKTtcbiAgICB9XG4gICAgLy8gdG9kbyBkazogYWxpZ24gd2l0aCBKYXZhIHZlcnNpb246IG1vdmUgdG8gQ2xpZW50RG9scGhpbiBhbmQgYXV0by1hZGQgdG8gbW9kZWwgc3RvcmVcbiAgICAvKiogYSBjb3B5IGNvbnN0cnVjdG9yIGZvciBhbnl0aGluZyBidXQgSURzLiBQZXIgZGVmYXVsdCwgY29waWVzIGFyZSBjbGllbnQgc2lkZSBvbmx5LCBubyBhdXRvbWF0aWMgdXBkYXRlIGFwcGxpZXMuICovXG4gICAgY29weSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChudWxsLCB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIHJlc3VsdC5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZUNvcHkgPSBhdHRyaWJ1dGUuY29weSgpO1xuICAgICAgICAgICAgcmVzdWx0LmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGVDb3B5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vYWRkIGFycmF5IG9mIGF0dHJpYnV0ZXNcbiAgICBhZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzIHx8IGF0dHJpYnV0ZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGRBdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICh0aGlzLmF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHByb3BlcnR5IG5hbWU6IFwiICsgYXR0cmlidXRlLnByb3BlcnR5TmFtZVxuICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSAmJiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHF1YWxpZmllcjogXCIgKyBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKClcbiAgICAgICAgICAgICAgICArIFwiIGluIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkOiBcIiArIHRoaXMuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZS5zZXRQcmVzZW50YXRpb25Nb2RlbCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkQnVzLnRyaWdnZXIoeyBzb3VyY2U6IHRoaXMgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkludmFsaWRhdGVkKGhhbmRsZUludmFsaWRhdGUpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkQnVzLm9uRXZlbnQoaGFuZGxlSW52YWxpZGF0ZSk7XG4gICAgfVxuICAgIC8qKiByZXR1cm5zIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgc3RhdGUgKi9cbiAgICBnZXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNsaWNlKDApO1xuICAgIH1cbiAgICBnZXRBdChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XG4gICAgfVxuICAgIGZpbmRBbGxBdHRyaWJ1dGVzQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUgPT0gcHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5hdHRyaWJ1dGVzW2ldLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKHF1YWxpZmllcikge1xuICAgICAgICBpZiAoIXF1YWxpZmllcilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlc1tpXS5nZXRRdWFsaWZpZXIoKSA9PSBxdWFsaWZpZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kQXR0cmlidXRlQnlJZChpZCkge1xuICAgICAgICBpZiAoIWlkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3luY1dpdGgoc291cmNlUHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goKHRhcmdldEF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgdmFyIHNvdXJjZUF0dHJpYnV0ZSA9IHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsLmdldEF0KHRhcmdldEF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXG5cbmltcG9ydCB7IGV4aXN0cyB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlY3tcblxuICAgIHN0YXRpYyBlbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AnOiBjb21tYW5kLnBtSWQsXG4gICAgICAgICAgICAndCc6IGNvbW1hbmQucG1UeXBlLFxuICAgICAgICAgICAgJ2EnOiBjb21tYW5kLmF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAnbic6IGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdpJzogYXR0cmlidXRlLmlkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGF0dHJpYnV0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnYgPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdpZCc6ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcsXG4gICAgICAgICAgICAnY2xhc3NOYW1lJzogXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiLFxuICAgICAgICAgICAgJ2NsaWVudFNpZGVPbmx5JzogZmFsc2UsXG4gICAgICAgICAgICAncG1JZCc6IGNvbW1hbmQucCxcbiAgICAgICAgICAgICdwbVR5cGUnOiBjb21tYW5kLnQsXG4gICAgICAgICAgICAnYXR0cmlidXRlcyc6IGNvbW1hbmQuYS5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eU5hbWUnOiBhdHRyaWJ1dGUubixcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogYXR0cmlidXRlLmksXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhhdHRyaWJ1dGUudik/IGF0dHJpYnV0ZS52IDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgJ3F1YWxpZmllcic6IG51bGxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICAnYSc6IGNvbW1hbmQuYXR0cmlidXRlSWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGV4aXN0cyhjb21tYW5kLm9sZFZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0Lm8gPSBjb21tYW5kLm9sZFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleGlzdHMoY29tbWFuZC5uZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5uID0gY29tbWFuZC5uZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuaWQgPSAnVmFsdWVDaGFuZ2VkJztcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnaWQnOiAnVmFsdWVDaGFuZ2VkJyxcbiAgICAgICAgICAgICdjbGFzc05hbWUnOiBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uVmFsdWVDaGFuZ2VkQ29tbWFuZFwiLFxuICAgICAgICAgICAgJ2F0dHJpYnV0ZUlkJzogY29tbWFuZC5hLFxuICAgICAgICAgICAgJ29sZFZhbHVlJzogZXhpc3RzKGNvbW1hbmQubyk/IGNvbW1hbmQubyA6IG51bGwsXG4gICAgICAgICAgICAnbmV3VmFsdWUnOiBleGlzdHMoY29tbWFuZC5uKT8gY29tbWFuZC5uIDogbnVsbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBlbmNvZGUoY29tbWFuZHMpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29tbWFuZHMubWFwKChjb21tYW5kKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gJ1ZhbHVlQ2hhbmdlZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5lbmNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlKHRyYW5zbWl0dGVkKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRyYW5zbWl0dGVkKS5tYXAoZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSAnVmFsdWVDaGFuZ2VkJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbWl0dGVkO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IFZhbHVlQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy92YWx1ZUNoYW5nZWRDb21tYW5kJ1xuXG5leHBvcnQgY2xhc3MgTm9Db21tYW5kQmF0Y2hlciB7XG4gICAgYmF0Y2gocXVldWUpIHtcbiAgICAgICAgcmV0dXJuIFtxdWV1ZS5zaGlmdCgpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCbGluZENvbW1hbmRCYXRjaGVyIHtcbiAgICAvKiogZm9sZGluZzogd2hldGhlciB3ZSBzaG91bGQgdHJ5IGZvbGRpbmcgVmFsdWVDaGFuZ2VkQ29tbWFuZHMgKi9cbiAgICBjb25zdHJ1Y3Rvcihmb2xkaW5nID0gdHJ1ZSwgbWF4QmF0Y2hTaXplID0gNTApIHtcbiAgICAgICAgdGhpcy5mb2xkaW5nID0gZm9sZGluZztcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemUgPSBtYXhCYXRjaFNpemU7XG4gICAgfVxuICAgIGJhdGNoKHF1ZXVlKSB7XG4gICAgICAgIGxldCBiYXRjaCA9IFtdO1xuICAgICAgICBjb25zdCBuID0gTWF0aC5taW4ocXVldWUubGVuZ3RoLCB0aGlzLm1heEJhdGNoU2l6ZSk7XG4gICAgICAgIGZvciAobGV0IGNvdW50ZXIgPSAwOyBjb3VudGVyIDwgbjsgY291bnRlcisrKSB7XG4gICAgICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9sZGluZyAmJiBjYW5kaWRhdGUuY29tbWFuZCBpbnN0YW5jZW9mIFZhbHVlQ2hhbmdlZENvbW1hbmQgJiYgKCFjYW5kaWRhdGUuaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5DbWQgPSBjYW5kaWRhdGUuY29tbWFuZDtcbiAgICAgICAgICAgICAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCAmJiBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kIGluc3RhbmNlb2YgVmFsdWVDaGFuZ2VkQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXRjaENtZCA9IGJhdGNoW2JhdGNoLmxlbmd0aCAtIDFdLmNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5DbWQuYXR0cmlidXRlSWQgPT0gYmF0Y2hDbWQuYXR0cmlidXRlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoQ21kLm5ld1ZhbHVlID0gY2FuQ21kLm5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpOyAvLyB3ZSBjYW5ub3QgbWVyZ2UsIHNvIGJhdGNoIHRoZSBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpOyAvLyB3ZSBjYW5ub3QgbWVyZ2UsIHNvIGJhdGNoIHRoZSBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FuZGlkYXRlLmhhbmRsZXIgfHxcbiAgICAgICAgICAgICAgICAoY2FuZGlkYXRlLmNvbW1hbmRbJ2NsYXNzTmFtZSddID09IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5FbXB0eU5vdGlmaWNhdGlvblwiKSAvLyBvciB1bmtub3duIGNsaWVudCBzaWRlIGVmZmVjdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIGxlYXZlIHRoZSBsb29wXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhdGNoO1xuICAgIH1cbn0iLCJpbXBvcnQgQ2xpZW50Q29ubmVjdG9yIGZyb20gJy4vQ2xpZW50Q29ubmVjdG9yJ1xuaW1wb3J0IENsaWVudERvbHBoaW4gZnJvbSAnLi9DbGllbnREb2xwaGluJ1xuaW1wb3J0IENsaWVudE1vZGVsU3RvcmUgZnJvbSAnLi9DbGllbnRNb2RlbFN0b3JlJ1xuaW1wb3J0IEh0dHBUcmFuc21pdHRlciBmcm9tICcuL0h0dHBUcmFuc21pdHRlcidcbmltcG9ydCBOb1RyYW5zbWl0dGVyIGZyb20gJy4vTm9UcmFuc21pdHRlcidcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb2xwaGluQnVpbGRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZXNldF8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zbGFja01TXyA9IDMwMDtcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemVfID0gNTA7XG4gICAgICAgIHRoaXMuc3VwcG9ydENPUlNfID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdXJsKHVybCkge1xuICAgICAgICB0aGlzLnVybF8gPSB1cmw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlc2V0KHJlc2V0KSB7XG4gICAgICAgIHRoaXMucmVzZXRfID0gcmVzZXQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNsYWNrTVMoc2xhY2tNUykge1xuICAgICAgICB0aGlzLnNsYWNrTVNfID0gc2xhY2tNUztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbWF4QmF0Y2hTaXplKG1heEJhdGNoU2l6ZSkge1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSBtYXhCYXRjaFNpemU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN1cHBvcnRDT1JTKHN1cHBvcnRDT1JTKSB7XG4gICAgICAgIHRoaXMuc3VwcG9ydENPUlNfID0gc3VwcG9ydENPUlM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGVycm9ySGFuZGxlcihlcnJvckhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXJfID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoZWFkZXJzSW5mbyhoZWFkZXJzSW5mbykge1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvXyA9IGhlYWRlcnNJbmZvO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJPcGVuRG9scGhpbiBqcyBmb3VuZFwiKTtcbiAgICAgICAgdmFyIGNsaWVudERvbHBoaW4gPSBuZXcgQ2xpZW50RG9scGhpbigpO1xuICAgICAgICB2YXIgdHJhbnNtaXR0ZXI7XG4gICAgICAgIGlmICh0aGlzLnVybF8gIT0gbnVsbCAmJiB0aGlzLnVybF8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdHJhbnNtaXR0ZXIgPSBuZXcgSHR0cFRyYW5zbWl0dGVyKHRoaXMudXJsXywgdGhpcy5yZXNldF8sIFwiVVRGLThcIiwgdGhpcy5lcnJvckhhbmRsZXJfLCB0aGlzLnN1cHBvcnRDT1JTXywgdGhpcy5oZWFkZXJzSW5mb18pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNtaXR0ZXIgPSBuZXcgTm9UcmFuc21pdHRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50Q29ubmVjdG9yKG5ldyBDbGllbnRDb25uZWN0b3IodHJhbnNtaXR0ZXIsIGNsaWVudERvbHBoaW4sIHRoaXMuc2xhY2tNU18sIHRoaXMubWF4QmF0Y2hTaXplXykpO1xuICAgICAgICBjbGllbnREb2xwaGluLnNldENsaWVudE1vZGVsU3RvcmUobmV3IENsaWVudE1vZGVsU3RvcmUoY2xpZW50RG9scGhpbikpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNsaWVudERvbHBoaW4gaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgIHJldHVybiBjbGllbnREb2xwaGluO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEJ1cyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzID0gW107XG4gICAgfVxuXG4gICAgb25FdmVudChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICB0cmlnZ2VyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5mb3JFYWNoKGhhbmRsZSA9PiBoYW5kbGUoZXZlbnQpKTtcbiAgICB9XG59IiwiaW1wb3J0IENvZGVjIGZyb20gJy4vQ29kZWMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0dHBUcmFuc21pdHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHJlc2V0ID0gdHJ1ZSwgY2hhcnNldCA9IFwiVVRGLThcIiwgZXJyb3JIYW5kbGVyID0gbnVsbCwgc3VwcG9ydENPUlMgPSBmYWxzZSwgaGVhZGVyc0luZm8gPSBudWxsKSB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmNoYXJzZXQgPSBjaGFyc2V0O1xuICAgICAgICB0aGlzLkh0dHBDb2RlcyA9IHtcbiAgICAgICAgICAgIGZpbmlzaGVkOiA0LFxuICAgICAgICAgICAgc3VjY2VzczogMjAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICB0aGlzLnN1cHBvcnRDT1JTID0gc3VwcG9ydENPUlM7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm8gPSBoZWFkZXJzSW5mbztcbiAgICAgICAgdGhpcy5odHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuc2lnID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIGlmICh0aGlzLnN1cHBvcnRDT1JTKSB7XG4gICAgICAgICAgICBpZiAoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB0aGlzLmh0dHApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHAud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTsgLy8gTk9URTogZG9pbmcgdGhpcyBmb3Igbm9uIENPUlMgcmVxdWVzdHMgaGFzIG5vIGltcGFjdFxuICAgICAgICAgICAgICAgIHRoaXMuc2lnLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBDb2RlYygpO1xuICAgICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIdHRwVHJhbnNtaXR0ZXIuaW52YWxpZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBDbGllbnREb2xwaGluLnJlc2V0KE9uU3VjY2Vzc0hhbmRsZXIpIGluc3RlYWQnKTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICB0aGlzLmh0dHAub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ29uZXJyb3InLCBcIlwiKTtcbiAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5odHRwLnJlYWR5U3RhdGUgPT0gdGhpcy5IdHRwQ29kZXMuZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5odHRwLnN0YXR1cyA9PSB0aGlzLkh0dHBDb2Rlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZVRleHQgPSB0aGlzLmh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZUNvbW1hbmRzID0gdGhpcy5jb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZCBwYXJzaW5nIHJlc3BvbnNlVGV4dDogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiwgcmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiArIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IGVtcHR5IHJlc3BvbnNlVGV4dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICB0aGlzLnNldEhlYWRlcnModGhpcy5odHRwKTtcbiAgICAgICAgaWYgKFwib3ZlcnJpZGVNaW1lVHlwZVwiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgdGhpcy5odHRwLm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVwiICsgdGhpcy5jaGFyc2V0KTsgLy8gdG9kbyBtYWtlIGluamVjdGFibGVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmh0dHAuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgIH1cblxuICAgIHNldEhlYWRlcnMoaHR0cFJlcSkge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmhlYWRlcnNJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUVycm9yKGtpbmQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGVycm9yRXZlbnQgPSB7IGtpbmQ6IGtpbmQsIHVybDogdGhpcy51cmwsIGh0dHBTdGF0dXM6IHRoaXMuaHR0cC5zdGF0dXMsIG1lc3NhZ2U6IG1lc3NhZ2UgfTtcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlcihlcnJvckV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnJvckV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNpZ25hbChjb21tYW5kKSB7XG4gICAgICAgIHRoaXMuc2lnLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh0aGlzLnNpZyk7XG4gICAgICAgIHRoaXMuc2lnLnNlbmQodGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRdKSk7XG4gICAgfVxuXG4gICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCArICdpbnZhbGlkYXRlPycsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5odHRwLnNlbmQoKTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9UcmFuc21pdHRlciB7XG5cbiAgICB0cmFuc21pdChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgc3BlY2lhbFxuICAgICAgICBvbkRvbmUoW10pO1xuICAgIH1cblxuICAgIHNpZ25hbCgpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxufSIsImltcG9ydCBEb2xwaGluQnVpbGRlciBmcm9tICcuL0RvbHBoaW5CdWlsZGVyJ1xuXG5leHBvcnQgZnVuY3Rpb24gZG9scGhpbih1cmwsIHJlc2V0LCBzbGFja01TID0gMzAwKSB7XG4gICAgcmV0dXJuIG1ha2VEb2xwaGluKCkudXJsKHVybCkucmVzZXQocmVzZXQpLnNsYWNrTVMoc2xhY2tNUykuYnVpbGQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VEb2xwaGluKCkge1xuICAgIHJldHVybiBuZXcgRG9scGhpbkJ1aWxkZXIoKTtcbn0iLCJpbXBvcnQgIE1hcCBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnO1xuaW1wb3J0IHtleGlzdHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZWFuTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoY2xhc3NSZXBvc2l0b3J5KSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlcihjbGFzc1JlcG9zaXRvcnkpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG5cbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgICAgIHRoaXMuYWRkZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMudXBkYXRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmFycmF5VXBkYXRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmFsbEFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxSZW1vdmVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxVcGRhdGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IFtdO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuQWRkZWQoKHR5cGUsIGJlYW4pID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuQWRkZWQtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5BZGRlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKCh0eXBlLCBiZWFuKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuUmVtb3ZlZC1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuUmVtb3ZlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5VcGRhdGUoKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblVwZGF0ZS1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkFycmF5VXBkYXRlKCh0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25BcnJheVVwZGF0ZS1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQXJyYXlVcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXG4gICAgfVxuXG5cbiAgICBub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpO1xuICAgIH1cblxuXG4gICAgbm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuICAgICAgICBjaGVja1BhcmFtKGluZGV4LCAnaW5kZXgnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb3VudCwgJ2NvdW50Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocmVtb3ZlZEVsZW1lbnRzLCAncmVtb3ZlZEVsZW1lbnRzJyk7XG5cbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cyk7XG4gICAgfVxuXG5cbiAgICBpc01hbmFnZWQoYmVhbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuaXNNYW5hZ2VkKGJlYW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5pc01hbmFnZWQoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGNyZWF0ZSh0eXBlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5jcmVhdGUodHlwZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmNyZWF0ZSgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgYWRkKHR5cGUsIGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmFkZCh0eXBlLCBiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5hZGQoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGFkZEFsbCh0eXBlLCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGRBbGwodHlwZSwgY29sbGVjdGlvbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbGxlY3Rpb24sICdjb2xsZWN0aW9uJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkQWxsKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmUoYmVhbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlKGJlYW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmUoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZUFsbChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmVBbGwoY29sbGVjdGlvbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb2xsZWN0aW9uLCAnY29sbGVjdGlvbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUFsbCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlSWYocHJlZGljYXRlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmVJZihwcmVkaWNhdGUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJlZGljYXRlLCAncHJlZGljYXRlJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlSWYoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIG9uQWRkZWQodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFkZGVkKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzID0gc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQWRkZWQodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFkZGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWRkZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25SZW1vdmVkKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25SZW1vdmVkKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzID0gc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzID0gc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25SZW1vdmVkKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25CZWFuVXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25CZWFuVXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25CZWFuVXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXJyYXlVcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFycmF5VXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFycmF5VXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0ICBNYXAgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vbWFwJztcbmltcG9ydCAqIGFzIGNvbnN0cyBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxudmFyIGJsb2NrZWQgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGFzc1JlcG9zaXRvcnkge1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNsYXNzZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW4gPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuY2xhc3NJbmZvcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycyA9IFtdO1xuICAgIH1cblxuICAgIGZpeFR5cGUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5CWVRFOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuU0hPUlQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5JTlQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT05HOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5GTE9BVDpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPVUJMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5CT09MRUFOOlxuICAgICAgICAgICAgICAgIHJldHVybiAndHJ1ZScgPT09IFN0cmluZyh2YWx1ZSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlNUUklORzpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkVOVU06XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZyb21Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NSZXBvc2l0b3J5LmJlYW5Gcm9tRG9scGhpbi5nZXQoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5EQVRFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkNBTEVOREFSOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5aT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpeFR5cGUodHlwZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NSZXBvc2l0b3J5LmJlYW5Ub0RvbHBoaW4uZ2V0KHZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRBVEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkNBTEVOREFSOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5aT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXhUeXBlKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmRMaXN0U3BsaWNlKGNsYXNzUmVwb3NpdG9yeSwgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBmcm9tLCB0bywgbmV3RWxlbWVudHMpIHtcbiAgICAgICAgbGV0IGRvbHBoaW4gPSBjbGFzc1JlcG9zaXRvcnkuZG9scGhpbjtcbiAgICAgICAgbGV0IG1vZGVsID0gZG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKG1vZGVsSWQpO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWwpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gY2xhc3NSZXBvc2l0b3J5LmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0eXBlKSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdAQEAgU09VUkNFX1NZU1RFTSBAQEAnLCBudWxsLCAnY2xpZW50JyksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdzb3VyY2UnLCBudWxsLCBtb2RlbElkKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG51bGwsIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdmcm9tJywgbnVsbCwgZnJvbSksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCd0bycsIG51bGwsIHRvKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2NvdW50JywgbnVsbCwgbmV3RWxlbWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGRvbHBoaW4uYXR0cmlidXRlKGluZGV4LnRvU3RyaW5nKCksIG51bGwsIHNlbGYudG9Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgZWxlbWVudCkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KGRvbHBoaW4sIFtudWxsLCAnQERQOkxTQCddLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YWxpZGF0ZUxpc3QoY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgbGV0IGxpc3QgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmICghZXhpc3RzKGxpc3QpKSB7XG4gICAgICAgICAgICBjbGFzc1JlcG9zaXRvcnkucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIFtdLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmxvY2soYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChleGlzdHMoYmxvY2tlZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGNyZWF0ZSBhIGJsb2NrIHdoaWxlIGFub3RoZXIgYmxvY2sgZXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tlZCA9IHtcbiAgICAgICAgICAgIGJlYW46IGJlYW4sXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGV4aXN0cyhibG9ja2VkKSAmJiBibG9ja2VkLmJlYW4gPT09IGJlYW4gJiYgYmxvY2tlZC5wcm9wZXJ0eU5hbWUgPT09IHByb3BlcnR5TmFtZTtcbiAgICB9XG5cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICBibG9ja2VkID0gbnVsbDtcbiAgICB9XG5cbiAgICBub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICBsZXQgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkpIHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IHRoaXMuZG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKG1vZGVsSWQpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gY2xhc3NJbmZvW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gYXR0cmlidXRlLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZSh0aGlzLnRvRG9scGhpbih0aGlzLCB0eXBlLCBuZXdWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mcm9tRG9scGhpbih0aGlzLCB0eXBlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgICAgICBsZXQgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkgJiYgZXhpc3RzKGFycmF5KSkge1xuICAgICAgICAgICAgbGV0IHJlbW92ZWRFbGVtZW50c0NvdW50ID0gQXJyYXkuaXNBcnJheShyZW1vdmVkRWxlbWVudHMpID8gcmVtb3ZlZEVsZW1lbnRzLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICB0aGlzLnNlbmRMaXN0U3BsaWNlKHRoaXMsIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgaW5kZXgsIGluZGV4ICsgcmVtb3ZlZEVsZW1lbnRzQ291bnQsIGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIGNvdW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJlYW5BZGRlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuQWRkZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25CZWFuUmVtb3ZlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQmVhblVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25BcnJheVVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZShoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyQ2xhc3MobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBpZiAodGhpcy5jbGFzc2VzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjbGFzc0luZm8gPSB7fTtcbiAgICAgICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUuc2VhcmNoKC9eQC8pIDwgMDtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzZXMuc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJDbGFzcyhtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnVucmVnaXN0ZXJDbGFzcyhtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIHRoaXMuY2xhc3Nlc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgIH1cblxuICAgIGxvYWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIHZhciBiZWFuID0ge307XG4gICAgICAgIG1vZGVsLmF0dHJpYnV0ZXMuZmlsdGVyKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwKTtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBiZWFuW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5vbGRWYWx1ZSAhPT0gZXZlbnQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4sIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluLnNldChtb2RlbC5pZCwgYmVhbik7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpbi5zZXQoYmVhbiwgbW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3Muc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGJlYW47XG4gICAgfVxuXG4gICAgdW5sb2FkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpblsnZGVsZXRlJ10oYmVhbik7XG4gICAgICAgIHRoaXMuY2xhc3NJbmZvc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgICAgICBpZiAoZXhpc3RzKGJlYW4pKSB7XG4gICAgICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuUmVtb3ZlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlYW47XG4gICAgfVxuXG4gICAgc3BsaWNlTGlzdEVudHJ5KG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgc291cmNlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdzb3VyY2UnKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnYXR0cmlidXRlJyk7XG4gICAgICAgIGxldCBmcm9tID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdmcm9tJyk7XG4gICAgICAgIGxldCB0byA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgndG8nKTtcbiAgICAgICAgbGV0IGNvdW50ID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdjb3VudCcpO1xuXG4gICAgICAgIGlmIChleGlzdHMoc291cmNlKSAmJiBleGlzdHMoYXR0cmlidXRlKSAmJiBleGlzdHMoZnJvbSkgJiYgZXhpc3RzKHRvKSAmJiBleGlzdHMoY291bnQpKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc0luZm9zLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICAgICAgdmFyIGJlYW4gPSB0aGlzLmJlYW5Gcm9tRG9scGhpbi5nZXQoc291cmNlLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgZXhpc3RzKGNsYXNzSW5mbykpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgICAgICAvL3ZhciBlbnRyeSA9IGZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlTGlzdCh0aGlzLCB0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50LnZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3RWxlbWVudHMucHVzaCh0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxvY2soYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUsIGZyb20udmFsdWUsIHRvLnZhbHVlIC0gZnJvbS52YWx1ZSwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5ibG9jaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWQuIFNvdXJjZSBiZWFuIHVua25vd24uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBQYXJhbVRvRG9scGhpbihwYXJhbSkge1xuICAgICAgICBpZiAoIWV4aXN0cyhwYXJhbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVvZiBwYXJhbTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQocGFyYW0pO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9ubHkgbWFuYWdlZCBEb2xwaGluIEJlYW5zIGNhbiBiZSB1c2VkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnbnVtYmVyJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25seSBtYW5hZ2VkIERvbHBoaW4gQmVhbnMgYW5kIHByaW1pdGl2ZSB0eXBlcyBjYW4gYmUgdXNlZFwiKTtcbiAgICB9XG5cbiAgICBtYXBEb2xwaGluVG9CZWFuKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNvbnN0cy5ET0xQSElOX0JFQU4sIHZhbHVlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgT3BlbkRvbHBoaW4gZnJvbSAnLi9PcGVuRG9scGhpbi5qcyc7XG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gJy4vY29ubmVjdG9yLmpzJztcbmltcG9ydCBCZWFuTWFuYWdlciBmcm9tICcuL2JlYW5tYW5hZ2VyLmpzJztcbmltcG9ydCBDbGFzc1JlcG9zaXRvcnkgZnJvbSAnLi9jbGFzc3JlcG8uanMnO1xuaW1wb3J0IENvbnRyb2xsZXJNYW5hZ2VyIGZyb20gJy4vY29udHJvbGxlcm1hbmFnZXIuanMnO1xuaW1wb3J0IENsaWVudENvbnRleHQgZnJvbSAnLi9jbGllbnRjb250ZXh0LmpzJztcbmltcG9ydCBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlciBmcm9tICcuL3BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udGV4dEZhY3Rvcnkge1xuXG4gICAgY3JlYXRlKHVybCwgY29uZmlnKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ2Nvbm5lY3QodXJsLCBjb25maWcpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odXJsLCAndXJsJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZyBjbGllbnQgY29udGV4dCAnKyB1cmwgKycgICAgJysgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG5cbiAgICAgICAgbGV0IGJ1aWxkZXIgPSBPcGVuRG9scGhpbi5tYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KGZhbHNlKS5zbGFja01TKDQpLnN1cHBvcnRDT1JTKHRydWUpLm1heEJhdGNoU2l6ZShOdW1iZXIuTUFYX1NBRkVfSU5URUdFUik7XG4gICAgICAgIGlmIChleGlzdHMoY29uZmlnKSkge1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhjb25maWcuZXJyb3JIYW5kbGVyKSkge1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuZXJyb3JIYW5kbGVyKGNvbmZpZy5lcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4aXN0cyhjb25maWcuaGVhZGVyc0luZm8pICYmIE9iamVjdC5rZXlzKGNvbmZpZy5oZWFkZXJzSW5mbykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuaGVhZGVyc0luZm8oY29uZmlnLmhlYWRlcnNJbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkb2xwaGluID0gYnVpbGRlci5idWlsZCgpO1xuXG4gICAgICAgIHZhciB0cmFuc21pdHRlciA9IG5ldyBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcih1cmwsIGNvbmZpZyk7XG4gICAgICAgIHRyYW5zbWl0dGVyLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY2xpZW50Q29udGV4dC5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbHBoaW4uY2xpZW50Q29ubmVjdG9yLnRyYW5zbWl0dGVyID0gdHJhbnNtaXR0ZXI7XG5cbiAgICAgICAgdmFyIGNsYXNzUmVwb3NpdG9yeSA9IG5ldyBDbGFzc1JlcG9zaXRvcnkoZG9scGhpbik7XG4gICAgICAgIHZhciBiZWFuTWFuYWdlciA9IG5ldyBCZWFuTWFuYWdlcihjbGFzc1JlcG9zaXRvcnkpO1xuICAgICAgICB2YXIgY29ubmVjdG9yID0gbmV3IENvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKTtcbiAgICAgICAgdmFyIGNvbnRyb2xsZXJNYW5hZ2VyID0gbmV3IENvbnRyb2xsZXJNYW5hZ2VyKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKTtcblxuICAgICAgICB2YXIgY2xpZW50Q29udGV4dCA9IG5ldyBDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudENvbnRleHQ7XG4gICAgfVxufSIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2VtaXR0ZXItY29tcG9uZW50JztcbmltcG9ydCBQcm9taXNlIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZEZhY3RvcnknO1xuaW1wb3J0IHtleGlzdHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250ZXh0e1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3Ipe1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3RvciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW5NYW5hZ2VyLCAnYmVhbk1hbmFnZXInKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyTWFuYWdlciwgJ2NvbnRyb2xsZXJNYW5hZ2VyJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29ubmVjdG9yLCAnY29ubmVjdG9yJyk7XG5cbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5iZWFuTWFuYWdlciA9IGJlYW5NYW5hZ2VyO1xuICAgICAgICB0aGlzLl9jb250cm9sbGVyTWFuYWdlciA9IGNvbnRyb2xsZXJNYW5hZ2VyO1xuICAgICAgICB0aGlzLl9jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvblByb21pc2UgPSBudWxsO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpe1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvblByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmNvbm5lY3QoKTtcbiAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5pbnZva2UoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ3JlYXRlQ29udGV4dENvbW1hbmQoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uUHJvbWlzZTtcbiAgICB9XG5cbiAgICBvbkNvbm5lY3QoKXtcbiAgICAgICAgaWYoZXhpc3RzKHRoaXMuY29ubmVjdGlvblByb21pc2UpKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uUHJvbWlzZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQuY3JlYXRlQ29udHJvbGxlcihuYW1lKScpO1xuICAgICAgICBjaGVja1BhcmFtKG5hbWUsICduYW1lJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRyb2xsZXJNYW5hZ2VyLmNyZWF0ZUNvbnRyb2xsZXIobmFtZSk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdCgpe1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9scGhpbi5zdG9wUHVzaExpc3RlbmluZygpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX2NvbnRyb2xsZXJNYW5hZ2VyLmRlc3Ryb3koKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZURlc3Ryb3lDb250ZXh0Q29tbWFuZCgpKTtcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuYmVhbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuX2NvbnRyb2xsZXJNYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbkVtaXR0ZXIoQ2xpZW50Q29udGV4dC5wcm90b3R5cGUpOyIsIi8qIENvcHlyaWdodCAyMDE2IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG5cblxuaW1wb3J0IHsgZXhpc3RzIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZGVje1xuXG4gICAgc3RhdGljIGVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncCc6IGNvbW1hbmQucG1JZCxcbiAgICAgICAgICAgICd0JzogY29tbWFuZC5wbVR5cGUsXG4gICAgICAgICAgICAnYSc6IGNvbW1hbmQuYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICduJzogYXR0cmlidXRlLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ2knOiBhdHRyaWJ1dGUuaWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMoYXR0cmlidXRlLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQudiA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgJ2lkJzogJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ2lkJzogJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJyxcbiAgICAgICAgICAgICdjbGFzc05hbWUnOiBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCIsXG4gICAgICAgICAgICAnY2xpZW50U2lkZU9ubHknOiBmYWxzZSxcbiAgICAgICAgICAgICdwbUlkJzogY29tbWFuZC5wLFxuICAgICAgICAgICAgJ3BtVHlwZSc6IGNvbW1hbmQudCxcbiAgICAgICAgICAgICdhdHRyaWJ1dGVzJzogY29tbWFuZC5hLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5TmFtZSc6IGF0dHJpYnV0ZS5uLFxuICAgICAgICAgICAgICAgICAgICAnaWQnOiBhdHRyaWJ1dGUuaSxcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogZXhpc3RzKGF0dHJpYnV0ZS52KT8gYXR0cmlidXRlLnYgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAncXVhbGlmaWVyJzogbnVsbFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBlbmNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICdhJzogY29tbWFuZC5hdHRyaWJ1dGVJZFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZXhpc3RzKGNvbW1hbmQub2xkVmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHQubyA9IGNvbW1hbmQub2xkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4aXN0cyhjb21tYW5kLm5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0Lm4gPSBjb21tYW5kLm5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5pZCA9ICdWYWx1ZUNoYW5nZWQnO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdpZCc6ICdWYWx1ZUNoYW5nZWQnLFxuICAgICAgICAgICAgJ2NsYXNzTmFtZSc6IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5WYWx1ZUNoYW5nZWRDb21tYW5kXCIsXG4gICAgICAgICAgICAnYXR0cmlidXRlSWQnOiBjb21tYW5kLmEsXG4gICAgICAgICAgICAnb2xkVmFsdWUnOiBleGlzdHMoY29tbWFuZC5vKT8gY29tbWFuZC5vIDogbnVsbCxcbiAgICAgICAgICAgICduZXdWYWx1ZSc6IGV4aXN0cyhjb21tYW5kLm4pPyBjb21tYW5kLm4gOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGVuY29kZShjb21tYW5kcykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShjb21tYW5kcy5tYXAoKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09PSAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZW5jb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSAnVmFsdWVDaGFuZ2VkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmVuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWNvZGUodHJhbnNtaXR0ZWQpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodHlwZW9mIHRyYW5zbWl0dGVkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodHJhbnNtaXR0ZWQpLm1hcChmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09PSAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmRlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09ICdWYWx1ZUNoYW5nZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmRlY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNtaXR0ZWQ7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgQ3JlYXRlQ29udGV4dENvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9jcmVhdGVDb250ZXh0Q29tbWFuZC5qcyc7XG5pbXBvcnQgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9jcmVhdGVDb250cm9sbGVyQ29tbWFuZC5qcyc7XG5pbXBvcnQgQ2FsbEFjdGlvbkNvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9jYWxsQWN0aW9uQ29tbWFuZC5qcyc7XG5pbXBvcnQgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vY29tbWFuZHMvZGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmpzJztcbmltcG9ydCBEZXN0cm95Q29udGV4dENvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9kZXN0cm95Q29udGV4dENvbW1hbmQuanMnO1xuaW1wb3J0IFN0YXJ0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vY29tbWFuZHMvc3RhcnRMb25nUG9sbENvbW1hbmQuanMnO1xuaW1wb3J0IEludGVycnVwdExvbmdQb2xsQ29tbWFuZCBmcm9tICcuL2NvbW1hbmRzL2ludGVycnVwdExvbmdQb2xsQ29tbWFuZC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRGYWN0b3J5IHtcblxuICAgIHN0YXRpYyBjcmVhdGVDcmVhdGVDb250ZXh0Q29tbWFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDcmVhdGVDb250ZXh0Q29tbWFuZCgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2FsbEFjdGlvbkNvbW1hbmQoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlcklkKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJJZCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZURlc3Ryb3lDb250ZXh0Q29tbWFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZXN0cm95Q29udGV4dENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RhcnRMb25nUG9sbENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpO1xuICAgIH1cbn0iLCJpbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsbEFjdGlvbkNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kLmludm9rZShjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyaWQsICdjb250cm9sbGVyaWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIHRoaXMuaWQgPSAnQ2FsbEFjdGlvbic7XG4gICAgICAgIHRoaXMuYyA9IGNvbnRyb2xsZXJpZDtcbiAgICAgICAgdGhpcy5uID0gYWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5wID0gcGFyYW1zO1xuICAgIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5pZCA9ICdDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YSc7XG5cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICB0aGlzLm1ldGFkYXRhTmFtZSA9IG1ldGFkYXRhTmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbn0iLCJleHBvcnQgY29uc3QgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbmV4cG9ydCBjb25zdCBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdpbml0Q2xpZW50Q29udGV4dCc7XG5leHBvcnQgY29uc3QgREVTVFJPWV9DT05URVhUX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2Rpc2Nvbm5lY3RDbGllbnRDb250ZXh0JztcbmV4cG9ydCBjb25zdCBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdyZWdpc3RlckNvbnRyb2xsZXInO1xuZXhwb3J0IGNvbnN0IERFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdkZXN0cm95Q29udHJvbGxlcic7XG5leHBvcnQgY29uc3QgQ0FMTF9DT05UUk9MTEVSX0FDVElPTl9DT01NQU5EX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdjYWxsQ29udHJvbGxlckFjdGlvbic7XG5leHBvcnQgY29uc3QgU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2xvbmdQb2xsJztcbmV4cG9ydCBjb25zdCBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ3JlbGVhc2UnO1xuIiwiaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVDb250ZXh0Q29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NyZWF0ZUNvbnRleHRDb21tYW5kLmludm9rZSgpJyk7XG4gICAgICAgIHRoaXMuaWQgPSAnQ3JlYXRlQ29udGV4dCc7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kLmludm9rZShjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJOYW1lLCAnY29udHJvbGxlck5hbWUnKTtcblxuICAgICAgICB0aGlzLmlkID0gJ0NyZWF0ZUNvbnRyb2xsZXInO1xuICAgICAgICB0aGlzLm4gPSBjb250cm9sbGVyTmFtZTtcbiAgICAgICAgdGhpcy5wID0gcGFyZW50Q29udHJvbGxlcklkO1xuICAgIH1cblxufSIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcihwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLmlkID0gXCJDcmVhdGVQcmVzZW50YXRpb25Nb2RlbFwiO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucG1JZCA9IHByZXNlbnRhdGlvbk1vZGVsLmlkO1xuICAgICAgICB0aGlzLnBtVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBhdHRyLnByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICBpZDogYXR0ci5pZCxcbiAgICAgICAgICAgICAgICBxdWFsaWZpZXI6IGF0dHIuZ2V0UXVhbGlmaWVyKCksXG4gICAgICAgICAgICAgICAgdmFsdWU6IGF0dHIuZ2V0VmFsdWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlc3Ryb3lDb250ZXh0Q29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Rlc3Ryb3lDb250ZXh0Q29tbWFuZCgpJyk7XG5cbiAgICAgICAgdGhpcy5pZCA9ICdEZXN0cm95Q29udGV4dCc7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVySWQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG5cbiAgICAgICAgdGhpcy5pZCA9ICdEZXN0cm95Q29udHJvbGxlcic7XG4gICAgICAgIHRoaXMuYyA9IGNvbnRyb2xsZXJJZDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0lOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9OQU1FfSBmcm9tICcuL2NvbW1hbmRDb25zdGFudHMnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX05BTUU7XG4gICAgfVxufSIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihwbUlkKSB7XG4gICAgICAgIHRoaXMuaWQgPSAnRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsJztcblxuICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgIH1cbn0iLCJpbXBvcnQge1NUQVJUX0xPTkdfUE9MTF9DT01NQU5EX05BTUV9IGZyb20gJy4vY29tbWFuZENvbnN0YW50cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhcnRMb25nUG9sbENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBTVEFSVF9MT05HX1BPTExfQ09NTUFORF9OQU1FO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFZhbHVlQ2hhbmdlZENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoYXR0cmlidXRlSWQsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBcIlZhbHVlQ2hhbmdlZFwiO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgdGhpcy5uZXdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cbn0iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUHJvbWlzZSBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlJztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRGYWN0b3J5JztcbmltcG9ydCB7QURERURfVFlQRSwgUkVNT1ZFRF9UWVBFfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cblxuY29uc3QgRE9MUEhJTl9CRUFOID0gJ0BAQCBET0xQSElOX0JFQU4gQEBAJztcbmNvbnN0IEFDVElPTl9DQUxMX0JFQU4gPSAnQEBAIENPTlRST0xMRVJfQUNUSU9OX0NBTExfQkVBTiBAQEAnO1xuY29uc3QgSElHSExBTkRFUl9CRUFOID0gJ0BAQCBISUdITEFOREVSX0JFQU4gQEBAJztcbmNvbnN0IERPTFBISU5fTElTVF9TUExJQ0UgPSAnQERQOkxTQCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNID0gJ0BAQCBTT1VSQ0VfU1lTVEVNIEBAQCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCA9ICdjbGllbnQnO1xuY29uc3QgU09VUkNFX1NZU1RFTV9TRVJWRVIgPSAnc2VydmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdG9ye1xuXG4gICAgY29uc3RydWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yKHVybCwgZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25maWcpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odXJsLCAndXJsJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlciA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHRoaXMuaGlnaGxhbmRlclBNUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHNlbGYuaGlnaGxhbmRlclBNUmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5vbk1vZGVsU3RvcmVDaGFuZ2UoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBldmVudC5jbGllbnRQcmVzZW50YXRpb25Nb2RlbDtcbiAgICAgICAgICAgIGxldCBzb3VyY2VTeXN0ZW0gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoU09VUkNFX1NZU1RFTSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHNvdXJjZVN5c3RlbSkgJiYgc291cmNlU3lzdGVtLnZhbHVlID09PSBTT1VSQ0VfU1lTVEVNX1NFUlZFUikge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5ldmVudFR5cGUgPT09IEFEREVEX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsQWRkZWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBSRU1PVkVEX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsUmVtb3ZlZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoYXQuZG9scGhpbi5zdGFydFB1c2hMaXN0ZW5pbmcoQ29tbWFuZEZhY3RvcnkuY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQoKSwgQ29tbWFuZEZhY3RvcnkuY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKCkpO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICBvbk1vZGVsQWRkZWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5vbk1vZGVsQWRkZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQUNUSU9OX0NBTExfQkVBTjpcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBISUdITEFOREVSX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlcihtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW9kZWxSZW1vdmVkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3Iub25Nb2RlbFJlbW92ZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0xJU1RfU1BMSUNFOlxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGludm9rZShjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IuaW52b2tlKGNvbW1hbmQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgJ2NvbW1hbmQnKTtcblxuICAgICAgICB2YXIgZG9scGhpbiA9IHRoaXMuZG9scGhpbjtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBkb2xwaGluLnNlbmQoY29tbWFuZCwge1xuICAgICAgICAgICAgICAgIG9uRmluaXNoZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRIaWdobGFuZGVyUE0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2U7XG4gICAgfVxufVxuXG5leHBvcnRzLlNPVVJDRV9TWVNURU0gPSBTT1VSQ0VfU1lTVEVNO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX0NMSUVOVCA9IFNPVVJDRV9TWVNURU1fQ0xJRU5UO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX1NFUlZFUiA9IFNPVVJDRV9TWVNURU1fU0VSVkVSO1xuZXhwb3J0cy5BQ1RJT05fQ0FMTF9CRUFOID0gQUNUSU9OX0NBTExfQkVBTjtcbiIsImV4cG9ydCBjb25zdCBET0xQSElOX0JFQU4gPSAwO1xuZXhwb3J0IGNvbnN0IEJZVEUgPSAxO1xuZXhwb3J0IGNvbnN0IFNIT1JUID0gMjtcbmV4cG9ydCBjb25zdCBJTlQgPSAzO1xuZXhwb3J0IGNvbnN0IExPTkcgPSA0O1xuZXhwb3J0IGNvbnN0IEZMT0FUID0gNTtcbmV4cG9ydCBjb25zdCBET1VCTEUgPSA2O1xuZXhwb3J0IGNvbnN0IEJPT0xFQU4gPSA3O1xuZXhwb3J0IGNvbnN0IFNUUklORyA9IDg7XG5leHBvcnQgY29uc3QgREFURSA9IDk7XG5leHBvcnQgY29uc3QgRU5VTSA9IDEwO1xuZXhwb3J0IGNvbnN0IENBTEVOREFSID0gMTE7XG5leHBvcnQgY29uc3QgTE9DQUxfREFURV9GSUVMRF9UWVBFID0gNTU7XG5leHBvcnQgY29uc3QgTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEUgPSA1MjtcbmV4cG9ydCBjb25zdCBaT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRSA9IDU0O1xuXG5cbmV4cG9ydCBjb25zdCBBRERFRF9UWVBFID0gXCJBRERFRFwiO1xuZXhwb3J0IGNvbnN0IFJFTU9WRURfVFlQRSA9IFwiUkVNT1ZFRFwiO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFByb21pc2UgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQgU2V0IGZyb20nLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0JztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IENvbnRyb2xsZXJQcm94eSBmcm9tICcuL2NvbnRyb2xsZXJwcm94eS5qcyc7XG5cbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRGYWN0b3J5LmpzJztcblxuXG5pbXBvcnQgeyBTT1VSQ0VfU1lTVEVNIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IHsgU09VUkNFX1NZU1RFTV9DTElFTlQgfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgeyBBQ1RJT05fQ0FMTF9CRUFOIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuXG5jb25zdCBDT05UUk9MTEVSX0lEID0gJ2NvbnRyb2xsZXJJZCc7XG5jb25zdCBNT0RFTCA9ICdtb2RlbCc7XG5jb25zdCBFUlJPUl9DT0RFID0gJ2Vycm9yQ29kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJNYW5hZ2Vye1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3Ipe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb25uZWN0b3IsICdjb25uZWN0b3InKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVDb250cm9sbGVyKG5hbWUsIG51bGwpXG4gICAgfVxuXG4gICAgX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBjb250cm9sbGVySWQsIG1vZGVsSWQsIG1vZGVsLCBjb250cm9sbGVyO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChuYW1lLCBwYXJlbnRDb250cm9sbGVySWQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcklkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbElkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShNT0RFTCkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBEb2xwaGluVG9CZWFuKG1vZGVsSWQpO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250cm9sbGVycy5hZGQoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW52b2tlQWN0aW9uKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5pbnZva2VBY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PntcblxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShTT1VSQ0VfU1lTVEVNLCBudWxsLCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCksXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShFUlJPUl9DT0RFKVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgbGV0IHBtID0gc2VsZi5kb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KHNlbGYuZG9scGhpbiwgW251bGwsIEFDVElPTl9DQUxMX0JFQU5dLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG5cbiAgICAgICAgICAgIGxldCBhY3Rpb25QYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGlmKGV4aXN0cyhwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkocGFyYW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBQYXJhbVRvRG9scGhpbihwYXJhbXNbcGFyYW1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblBhcmFtcy5wdXNoKHtuOiBwYXJhbSwgdjogdmFsdWV9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgYWN0aW9uUGFyYW1zKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGlzRXJyb3IgPSBwbS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoRVJST1JfQ09ERSkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiQ29udHJvbGxlckFjdGlvbiBjYXVzZWQgYW4gZXJyb3JcIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKHBtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5kZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXIsICdjb250cm9sbGVyJyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udHJvbGxlcnMuZGVsZXRlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgICAgIGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9JRCkuc2V0VmFsdWUoY29udHJvbGxlci5jb250cm9sbGVySWQpO1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlci5nZXRJZCgpKSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBsZXQgY29udHJvbGxlcnNDb3B5ID0gdGhpcy5jb250cm9sbGVycztcbiAgICAgICAgbGV0IHByb21pc2VzID0gW107XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGNvbnRyb2xsZXJzQ29weS5mb3JFYWNoKChjb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goY29udHJvbGxlci5kZXN0cm95KCkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgU2V0IGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJQcm94eXtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5KGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBjaGVja1BhcmFtKG1hbmFnZXIsICdtYW5hZ2VyJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVySWQgPSBjb250cm9sbGVySWQ7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIGdldE1vZGVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbDtcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcklkO1xuICAgIH1cblxuICAgIGludm9rZShuYW1lLCBwYXJhbXMpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lmludm9rZShuYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRyb2xsZXIgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5pbnZva2VBY3Rpb24odGhpcy5jb250cm9sbGVySWQsIG5hbWUsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgdGhpcy5nZXRJZCgpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCl7XG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uRGVzdHJveWVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuZGVzdHJveUNvbnRyb2xsZXIodGhpcyk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95ZWQoaGFuZGxlcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkub25EZXN0cm95ZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbkRlc3Ryb3llZEhhbmRsZXJzLmRlbGV0ZShoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRG9scGhpblJlbW90aW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnUmVtb3RpbmcgRXJyb3InLCBkZXRhaWwpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLmRldGFpbCA9IGRldGFpbCB8fCB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvbHBoaW5TZXNzaW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnU2Vzc2lvbiBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cFJlc3BvbnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnSHR0cCBSZXNwb25zZSBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ0h0dHAgTmV0d29yayBFcnJvcicpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgfVxufSIsIi8qIENvcHlyaWdodCAyMDE2IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgRW1pdHRlciBmcm9tICdlbWl0dGVyLWNvbXBvbmVudCc7XG5cblxuaW1wb3J0IHsgZXhpc3RzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBEb2xwaGluUmVtb3RpbmdFcnJvciwgSHR0cE5ldHdvcmtFcnJvciwgRG9scGhpblNlc3Npb25FcnJvciwgSHR0cFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuL2Vycm9ycy5qcyc7XG5pbXBvcnQgQ29kZWMgZnJvbSAnLi9jb2RlYy5qcyc7XG5pbXBvcnQgUmVtb3RpbmdFcnJvckhhbmRsZXIgZnJvbSAnLi9yZW1vdGluZ0Vycm9ySGFuZGxlcic7XG5cblxuY29uc3QgRklOSVNIRUQgPSA0O1xuY29uc3QgU1VDQ0VTUyA9IDIwMDtcbmNvbnN0IFJFUVVFU1RfVElNRU9VVCA9IDQwODtcblxuY29uc3QgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbmNvbnN0IENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnZG9scGhpbkNsaWVudElkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IodXJsLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvID0gZXhpc3RzKGNvbmZpZykgPyBjb25maWcuaGVhZGVyc0luZm8gOiBudWxsO1xuICAgICAgICBsZXQgY29ubmVjdGlvbkNvbmZpZyA9IGV4aXN0cyhjb25maWcpID8gY29uZmlnLmNvbm5lY3Rpb24gOiBudWxsO1xuICAgICAgICB0aGlzLm1heFJldHJ5ID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLm1heFJldHJ5KT9jb25uZWN0aW9uQ29uZmlnLm1heFJldHJ5OiAzO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcudGltZW91dCk/Y29ubmVjdGlvbkNvbmZpZy50aW1lb3V0OiA1MDAwO1xuICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gMDtcbiAgICB9XG5cbiAgICBfaGFuZGxlRXJyb3IocmVqZWN0LCBlcnJvcikge1xuICAgICAgICBsZXQgY29ubmVjdGlvbkNvbmZpZyA9IGV4aXN0cyh0aGlzLmNvbmZpZykgPyB0aGlzLmNvbmZpZy5jb25uZWN0aW9uIDogbnVsbDtcbiAgICAgICAgbGV0IGVycm9ySGFuZGxlcnMgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcuZXJyb3JIYW5kbGVycyk/Y29ubmVjdGlvbkNvbmZpZy5lcnJvckhhbmRsZXJzOiBbbmV3IFJlbW90aW5nRXJyb3JIYW5kbGVyKCldO1xuICAgICAgICBlcnJvckhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlci5vbkVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfVxuXG4gICAgX3NlbmQoY29tbWFuZHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgIGh0dHAub25lcnJvciA9IChlcnJvckNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwTmV0d29ya0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogTmV0d29yayBlcnJvcicsIGVycm9yQ29udGVudCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaHR0cC5yZWFkeVN0YXRlID09PSBGSU5JU0hFRCl7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaHR0cC5zdGF0dXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBTVUNDRVNTOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDbGllbnRJZCA9IGh0dHAuZ2V0UmVzcG9uc2VIZWFkZXIoQ0xJRU5UX0lEX0hUVFBfSEVBREVSX05BTUUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoY3VycmVudENsaWVudElkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpICYmIHRoaXMuY2xpZW50SWQgIT09IGN1cnJlbnRDbGllbnRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IENsaWVudElkIG9mIHRoZSByZXNwb25zZSBkaWQgbm90IG1hdGNoJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjdXJyZW50Q2xpZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFNlcnZlciBkaWQgbm90IHNlbmQgYSBjbGllbnRJZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShodHRwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVRVUVTVF9USU1FT1VUOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBTZXNzaW9uIFRpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5mYWlsZWRfYXR0ZW1wdCA8PSB0aGlzLm1heFJldHJ5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsZWRfYXR0ZW1wdCA9IHRoaXMuZmFpbGVkX2F0dGVtcHQgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwUmVzcG9uc2VFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMCAoJyArIGh0dHAuc3RhdHVzICsgJyknKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBodHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpKSB7XG4gICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FLCB0aGlzLmNsaWVudElkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmhlYWRlcnNJbmZvKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZmFpbGVkX2F0dGVtcHQgPiB0aGlzLm1heFJldHJ5KSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cC5zZW5kKENvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMudGltZW91dCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBodHRwLnNlbmQoQ29kZWMuZW5jb2RlKGNvbW1hbmRzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICB0aGlzLl9zZW5kKGNvbW1hbmRzKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2VUZXh0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZUNvbW1hbmRzID0gQ29kZWMuZGVjb2RlKHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBEb2xwaGluUmVtb3RpbmdFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFBhcnNlIGVycm9yOiAoSW5jb3JyZWN0IHJlc3BvbnNlID0gJyArIHJlc3BvbnNlVGV4dCArICcpJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRG9scGhpblJlbW90aW5nRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBFbXB0eSByZXNwb25zZScpKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaWduYWwoY29tbWFuZCkge1xuICAgICAgICB0aGlzLl9zZW5kKFtjb21tYW5kXSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpKTtcbiAgICB9XG59XG5cbkVtaXR0ZXIoUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlKTtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RpbmdFcnJvckhhbmRsZXIge1xuXG4gICAgb25FcnJvcihlcnJvcikge1xuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuXG59IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY2hlY2tNZXRob2ROYW1lO1xuXG52YXIgZXhpc3RzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcblxubW9kdWxlLmV4cG9ydHMuY2hlY2tNZXRob2QgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgY2hlY2tNZXRob2ROYW1lID0gbmFtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNoZWNrUGFyYW0gPSBmdW5jdGlvbihwYXJhbSwgcGFyYW1ldGVyTmFtZSkge1xuICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwYXJhbWV0ZXIgJyArIHBhcmFtZXRlck5hbWUgKyAnIGlzIG1hbmRhdG9yeSBpbiAnICsgY2hlY2tNZXRob2ROYW1lKTtcbiAgICB9XG59O1xuIl19
