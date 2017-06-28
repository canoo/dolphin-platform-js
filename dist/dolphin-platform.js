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
    TAG = _dereq_('./_wks')('toStringTag'
// ES3 wrong here
),
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
  : ARG ? cof(O
  // ES3 arguments fallback
  ) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
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
    : IS_BIND && own ? ctx(out, global
    // wrap global constructors for prevent change them in library
    ) : IS_WRAP && target[key] == out ? function (C) {
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

var Attribute = function () {
    function Attribute() {}
    Attribute.QUALIFIER_PROPERTY = "qualifier";
    Attribute.VALUE = "value";
    return Attribute;
}();
exports.__esModule = true;
exports["default"] = Attribute;



},{}],82:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var ChangeAttributeMetadataCommand = function (_super) {
    __extends(ChangeAttributeMetadataCommand, _super);
    function ChangeAttributeMetadataCommand(attributeId, metadataName, value) {
        _super.call(this);
        this.attributeId = attributeId;
        this.metadataName = metadataName;
        this.value = value;
        this.id = 'ChangeAttributeMetadata';
        this.className = "org.opendolphin.core.comm.ChangeAttributeMetadataCommand";
    }
    return ChangeAttributeMetadataCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = ChangeAttributeMetadataCommand;



},{"./Command":89}],83:[function(_dereq_,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var EventBus_1 = _dereq_('./EventBus');
var ClientAttribute = function () {
    function ClientAttribute(propertyName, qualifier, value) {
        this.propertyName = propertyName;
        this.id = "" + ClientAttribute.clientAttributeInstanceCount++ + "C";
        this.valueChangeBus = new EventBus_1["default"]();
        this.qualifierChangeBus = new EventBus_1["default"]();
        this.setValue(value);
        this.setQualifier(qualifier);
    }
    /** a copy constructor with new id and no presentation model */
    ClientAttribute.prototype.copy = function () {
        var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
        return result;
    };
    ClientAttribute.prototype.setPresentationModel = function (presentationModel) {
        if (this.presentationModel) {
            alert("You can not set a presentation model for an attribute that is already bound.");
        }
        this.presentationModel = presentationModel;
    };
    ClientAttribute.prototype.getPresentationModel = function () {
        return this.presentationModel;
    };
    ClientAttribute.prototype.getValue = function () {
        return this.value;
    };
    ClientAttribute.prototype.setValue = function (newValue) {
        var verifiedValue = ClientAttribute.checkValue(newValue);
        if (this.value == verifiedValue) return;
        var oldValue = this.value;
        this.value = verifiedValue;
        this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
    };
    ClientAttribute.prototype.setQualifier = function (newQualifier) {
        if (this.qualifier == newQualifier) return;
        var oldQualifier = this.qualifier;
        this.qualifier = newQualifier;
        this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
    };
    ClientAttribute.prototype.getQualifier = function () {
        return this.qualifier;
    };
    ClientAttribute.checkValue = function (value) {
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
    };
    ClientAttribute.prototype.onValueChange = function (eventHandler) {
        this.valueChangeBus.onEvent(eventHandler);
        eventHandler({ "oldValue": this.value, "newValue": this.value });
    };
    ClientAttribute.prototype.onQualifierChange = function (eventHandler) {
        this.qualifierChangeBus.onEvent(eventHandler);
    };
    ClientAttribute.prototype.syncWith = function (sourceAttribute) {
        if (sourceAttribute) {
            this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
            this.setValue(sourceAttribute.value);
        }
    };
    ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
    ClientAttribute.clientAttributeInstanceCount = 0;
    return ClientAttribute;
}();
exports.ClientAttribute = ClientAttribute;



},{"./EventBus":95}],84:[function(_dereq_,module,exports){
"use strict";

var ClientPresentationModel_1 = _dereq_("./ClientPresentationModel");
var Codec_1 = _dereq_("./Codec");
var CommandBatcher_1 = _dereq_("./CommandBatcher");
var ClientConnector = function () {
    function ClientConnector(transmitter, clientDolphin, slackMS, maxBatchSize) {
        if (slackMS === void 0) {
            slackMS = 0;
        }
        if (maxBatchSize === void 0) {
            maxBatchSize = 50;
        }
        this.commandQueue = [];
        this.currentlySending = false;
        this.pushEnabled = false;
        this.waiting = false;
        this.transmitter = transmitter;
        this.clientDolphin = clientDolphin;
        this.slackMS = slackMS;
        this.codec = new Codec_1["default"]();
        this.commandBatcher = new CommandBatcher_1.BlindCommandBatcher(true, maxBatchSize);
    }
    ClientConnector.prototype.setCommandBatcher = function (newBatcher) {
        this.commandBatcher = newBatcher;
    };
    ClientConnector.prototype.setPushEnabled = function (enabled) {
        this.pushEnabled = enabled;
    };
    ClientConnector.prototype.setPushListener = function (newListener) {
        this.pushListener = newListener;
    };
    ClientConnector.prototype.setReleaseCommand = function (newCommand) {
        this.releaseCommand = newCommand;
    };
    ClientConnector.prototype.send = function (command, onFinished) {
        this.commandQueue.push({ command: command, handler: onFinished });
        if (this.currentlySending) {
            this.release(); // there is not point in releasing if we do not send atm
            return;
        }
        this.doSendNext();
    };
    ClientConnector.prototype.doSendNext = function () {
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
    };
    ClientConnector.prototype.handle = function (command) {
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
    };
    ClientConnector.prototype.handleDeletePresentationModelCommand = function (serverCommand) {
        var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
        if (!model) return null;
        this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
        return model;
    };
    ClientConnector.prototype.handleCreatePresentationModelCommand = function (serverCommand) {
        var _this = this;
        if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
            throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
        }
        var attributes = [];
        serverCommand.attributes.forEach(function (attr) {
            var clientAttribute = _this.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value);
            if (attr.id && attr.id.match(".*S$")) {
                clientAttribute.id = attr.id;
            }
            attributes.push(clientAttribute);
        });
        var clientPm = new ClientPresentationModel_1.ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
        clientPm.addAttributes(attributes);
        if (serverCommand.clientSideOnly) {
            clientPm.clientSideOnly = true;
        }
        this.clientDolphin.getClientModelStore().add(clientPm);
        this.clientDolphin.updatePresentationModelQualifier(clientPm);
        return clientPm;
    };
    ClientConnector.prototype.handleValueChangedCommand = function (serverCommand) {
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
    };
    ClientConnector.prototype.handleAttributeMetadataChangedCommand = function (serverCommand) {
        var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
        if (!clientAttribute) return null;
        clientAttribute[serverCommand.metadataName] = serverCommand.value;
        return null;
    };
    ///////////// push support ///////////////
    ClientConnector.prototype.listen = function () {
        if (!this.pushEnabled) return;
        if (this.waiting) return;
        // todo: how to issue a warning if no pushListener is set?
        if (!this.currentlySending) {
            this.doSendNext();
        }
    };
    ClientConnector.prototype.enqueuePushCommand = function () {
        var me = this;
        this.waiting = true;
        this.commandQueue.push({
            command: this.pushListener,
            handler: {
                onFinished: function onFinished(models) {
                    me.waiting = false;
                },
                onFinishedData: null
            }
        });
    };
    ClientConnector.prototype.release = function () {
        if (!this.waiting) return;
        this.waiting = false;
        // todo: how to issue a warning if no releaseCommand is set?
        this.transmitter.signal(this.releaseCommand);
    };
    return ClientConnector;
}();
exports.ClientConnector = ClientConnector;



},{"./ClientPresentationModel":87,"./Codec":88,"./CommandBatcher":90}],85:[function(_dereq_,module,exports){
"use strict";

var ClientAttribute_1 = _dereq_("./ClientAttribute");
var ClientPresentationModel_1 = _dereq_("./ClientPresentationModel");
var ClientDolphin = function () {
    function ClientDolphin() {}
    ClientDolphin.prototype.setClientConnector = function (clientConnector) {
        this.clientConnector = clientConnector;
    };
    ClientDolphin.prototype.getClientConnector = function () {
        return this.clientConnector;
    };
    ClientDolphin.prototype.send = function (command, onFinished) {
        this.clientConnector.send(command, onFinished);
    };
    // factory method for attributes
    ClientDolphin.prototype.attribute = function (propertyName, qualifier, value) {
        return new ClientAttribute_1.ClientAttribute(propertyName, qualifier, value);
    };
    // factory method for presentation models
    ClientDolphin.prototype.presentationModel = function (id, type) {
        var attributes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            attributes[_i - 2] = arguments[_i];
        }
        var model = new ClientPresentationModel_1.ClientPresentationModel(id, type);
        if (attributes && attributes.length > 0) {
            attributes.forEach(function (attribute) {
                model.addAttribute(attribute);
            });
        }
        this.getClientModelStore().add(model);
        return model;
    };
    ClientDolphin.prototype.setClientModelStore = function (clientModelStore) {
        this.clientModelStore = clientModelStore;
    };
    ClientDolphin.prototype.getClientModelStore = function () {
        return this.clientModelStore;
    };
    ClientDolphin.prototype.listPresentationModelIds = function () {
        return this.getClientModelStore().listPresentationModelIds();
    };
    ClientDolphin.prototype.listPresentationModels = function () {
        return this.getClientModelStore().listPresentationModels();
    };
    ClientDolphin.prototype.findAllPresentationModelByType = function (presentationModelType) {
        return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);
    };
    ClientDolphin.prototype.getAt = function (id) {
        return this.findPresentationModelById(id);
    };
    ClientDolphin.prototype.findPresentationModelById = function (id) {
        return this.getClientModelStore().findPresentationModelById(id);
    };
    ClientDolphin.prototype.deletePresentationModel = function (modelToDelete) {
        this.getClientModelStore().deletePresentationModel(modelToDelete, true);
    };
    ClientDolphin.prototype.updatePresentationModelQualifier = function (presentationModel) {
        var _this = this;
        presentationModel.getAttributes().forEach(function (sourceAttribute) {
            _this.updateAttributeQualifier(sourceAttribute);
        });
    };
    ClientDolphin.prototype.updateAttributeQualifier = function (sourceAttribute) {
        if (!sourceAttribute.getQualifier()) return;
        var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
        attributes.forEach(function (targetAttribute) {
            targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
        });
    };
    ////// push support ///////
    ClientDolphin.prototype.startPushListening = function (pushCommand, releaseCommand) {
        this.clientConnector.setPushListener(pushCommand);
        this.clientConnector.setReleaseCommand(releaseCommand);
        this.clientConnector.setPushEnabled(true);
        this.clientConnector.listen();
    };
    ClientDolphin.prototype.stopPushListening = function () {
        this.clientConnector.setPushEnabled(false);
    };
    return ClientDolphin;
}();
exports.__esModule = true;
exports["default"] = ClientDolphin;



},{"./ClientAttribute":83,"./ClientPresentationModel":87}],86:[function(_dereq_,module,exports){
/// <reference path="./core-js.d.ts" />
"use strict";

var Attribute_1 = _dereq_("./Attribute");
var ChangeAttributeMetadataCommand_1 = _dereq_("./ChangeAttributeMetadataCommand");
var CreatePresentationModelCommand_1 = _dereq_("./CreatePresentationModelCommand");
var DeletedPresentationModelNotification_1 = _dereq_("./DeletedPresentationModelNotification");
var EventBus_1 = _dereq_("./EventBus");
var ValueChangedCommand_1 = _dereq_("./ValueChangedCommand");
(function (Type) {
    Type[Type["ADDED"] = 'ADDED'] = "ADDED";
    Type[Type["REMOVED"] = 'REMOVED'] = "REMOVED";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
var ClientModelStore = function () {
    function ClientModelStore(clientDolphin) {
        this.clientDolphin = clientDolphin;
        this.presentationModels = new Map();
        this.presentationModelsPerType = new Map();
        this.attributesPerId = new Map();
        this.attributesPerQualifier = new Map();
        this.modelStoreChangeBus = new EventBus_1["default"]();
    }
    ClientModelStore.prototype.getClientDolphin = function () {
        return this.clientDolphin;
    };
    ClientModelStore.prototype.registerModel = function (model) {
        var _this = this;
        if (model.clientSideOnly) {
            return;
        }
        var connector = this.clientDolphin.getClientConnector();
        var createPMCommand = new CreatePresentationModelCommand_1["default"](model);
        connector.send(createPMCommand, null);
        model.getAttributes().forEach(function (attribute) {
            _this.registerAttribute(attribute);
        });
    };
    ClientModelStore.prototype.registerAttribute = function (attribute) {
        var _this = this;
        this.addAttributeById(attribute);
        if (attribute.getQualifier()) {
            this.addAttributeByQualifier(attribute);
        }
        // whenever an attribute changes its value, the server needs to be notified
        // and all other attributes with the same qualifier are given the same value
        attribute.onValueChange(function (evt) {
            var valueChangeCommand = new ValueChangedCommand_1["default"](attribute.id, evt.newValue);
            _this.clientDolphin.getClientConnector().send(valueChangeCommand, null);
            if (attribute.getQualifier()) {
                var attrs = _this.findAttributesByFilter(function (attr) {
                    return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                });
                attrs.forEach(function (attr) {
                    attr.setValue(attribute.getValue());
                });
            }
        });
        attribute.onQualifierChange(function (evt) {
            var changeAttrMetadataCmd = new ChangeAttributeMetadataCommand_1["default"](attribute.id, Attribute_1["default"].QUALIFIER_PROPERTY, evt.newValue);
            _this.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
        });
    };
    ClientModelStore.prototype.add = function (model) {
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
            this.modelStoreChangeBus.trigger({ 'eventType': Type.ADDED, 'clientPresentationModel': model });
            added = true;
        }
        return added;
    };
    ClientModelStore.prototype.remove = function (model) {
        var _this = this;
        if (!model) {
            return false;
        }
        var removed = false;
        if (this.presentationModels.has(model.id)) {
            this.removePresentationModelByType(model);
            this.presentationModels.delete(model.id);
            model.getAttributes().forEach(function (attribute) {
                _this.removeAttributeById(attribute);
                if (attribute.getQualifier()) {
                    _this.removeAttributeByQualifier(attribute);
                }
            });
            this.modelStoreChangeBus.trigger({ 'eventType': Type.REMOVED, 'clientPresentationModel': model });
            removed = true;
        }
        return removed;
    };
    ClientModelStore.prototype.findAttributesByFilter = function (filter) {
        var matches = [];
        this.presentationModels.forEach(function (model) {
            model.getAttributes().forEach(function (attr) {
                if (filter(attr)) {
                    matches.push(attr);
                }
            });
        });
        return matches;
    };
    ClientModelStore.prototype.addPresentationModelByType = function (model) {
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
    };
    ClientModelStore.prototype.removePresentationModelByType = function (model) {
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
    };
    ClientModelStore.prototype.listPresentationModelIds = function () {
        var result = [];
        var iter = this.presentationModels.keys();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    };
    ClientModelStore.prototype.listPresentationModels = function () {
        var result = [];
        var iter = this.presentationModels.values();
        var next = iter.next();
        while (!next.done) {
            result.push(next.value);
            next = iter.next();
        }
        return result;
    };
    ClientModelStore.prototype.findPresentationModelById = function (id) {
        return this.presentationModels.get(id);
    };
    ClientModelStore.prototype.findAllPresentationModelByType = function (type) {
        if (!type || !this.presentationModelsPerType.has(type)) {
            return [];
        }
        return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
    };
    ClientModelStore.prototype.deletePresentationModel = function (model, notify) {
        if (!model) {
            return;
        }
        if (this.containsPresentationModel(model.id)) {
            this.remove(model);
            if (!notify || model.clientSideOnly) {
                return;
            }
            this.clientDolphin.getClientConnector().send(new DeletedPresentationModelNotification_1["default"](model.id), null);
        }
    };
    ClientModelStore.prototype.containsPresentationModel = function (id) {
        return this.presentationModels.has(id);
    };
    ClientModelStore.prototype.addAttributeById = function (attribute) {
        if (!attribute || this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.set(attribute.id, attribute);
    };
    ClientModelStore.prototype.removeAttributeById = function (attribute) {
        if (!attribute || !this.attributesPerId.has(attribute.id)) {
            return;
        }
        this.attributesPerId.delete(attribute.id);
    };
    ClientModelStore.prototype.findAttributeById = function (id) {
        return this.attributesPerId.get(id);
    };
    ClientModelStore.prototype.addAttributeByQualifier = function (attribute) {
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
    };
    ClientModelStore.prototype.removeAttributeByQualifier = function (attribute) {
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
    };
    ClientModelStore.prototype.findAllAttributesByQualifier = function (qualifier) {
        if (!qualifier || !this.attributesPerQualifier.has(qualifier)) {
            return [];
        }
        return this.attributesPerQualifier.get(qualifier).slice(0); // slice is used to clone the array
    };
    ClientModelStore.prototype.onModelStoreChange = function (eventHandler) {
        this.modelStoreChangeBus.onEvent(eventHandler);
    };
    ClientModelStore.prototype.onModelStoreChangeForType = function (presentationModelType, eventHandler) {
        this.modelStoreChangeBus.onEvent(function (pmStoreEvent) {
            if (pmStoreEvent.clientPresentationModel.presentationModelType == presentationModelType) {
                eventHandler(pmStoreEvent);
            }
        });
    };
    return ClientModelStore;
}();
exports.ClientModelStore = ClientModelStore;



},{"./Attribute":81,"./ChangeAttributeMetadataCommand":82,"./CreatePresentationModelCommand":92,"./DeletedPresentationModelNotification":93,"./EventBus":95,"./ValueChangedCommand":102}],87:[function(_dereq_,module,exports){
"use strict";

var EventBus_1 = _dereq_('./EventBus');
var presentationModelInstanceCount = 0; // todo dk: consider making this static in class
var ClientPresentationModel = function () {
    function ClientPresentationModel(id, presentationModelType) {
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
        this.invalidBus = new EventBus_1["default"]();
        this.dirtyValueChangeBus = new EventBus_1["default"]();
    }
    // todo dk: align with Java version: move to ClientDolphin and auto-add to model store
    /** a copy constructor for anything but IDs. Per default, copies are client side only, no automatic update applies. */
    ClientPresentationModel.prototype.copy = function () {
        var result = new ClientPresentationModel(null, this.presentationModelType);
        result.clientSideOnly = true;
        this.getAttributes().forEach(function (attribute) {
            var attributeCopy = attribute.copy();
            result.addAttribute(attributeCopy);
        });
        return result;
    };
    //add array of attributes
    ClientPresentationModel.prototype.addAttributes = function (attributes) {
        var _this = this;
        if (!attributes || attributes.length < 1) return;
        attributes.forEach(function (attr) {
            _this.addAttribute(attr);
        });
    };
    ClientPresentationModel.prototype.addAttribute = function (attribute) {
        var _this = this;
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
        attribute.onValueChange(function (evt) {
            _this.invalidBus.trigger({ source: _this });
        });
    };
    ClientPresentationModel.prototype.onInvalidated = function (handleInvalidate) {
        this.invalidBus.onEvent(handleInvalidate);
    };
    /** returns a copy of the internal state */
    ClientPresentationModel.prototype.getAttributes = function () {
        return this.attributes.slice(0);
    };
    ClientPresentationModel.prototype.getAt = function (propertyName) {
        return this.findAttributeByPropertyName(propertyName);
    };
    ClientPresentationModel.prototype.findAllAttributesByPropertyName = function (propertyName) {
        var result = [];
        if (!propertyName) return null;
        this.attributes.forEach(function (attribute) {
            if (attribute.propertyName == propertyName) {
                result.push(attribute);
            }
        });
        return result;
    };
    ClientPresentationModel.prototype.findAttributeByPropertyName = function (propertyName) {
        if (!propertyName) return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].propertyName == propertyName) {
                return this.attributes[i];
            }
        }
        return null;
    };
    ClientPresentationModel.prototype.findAttributeByQualifier = function (qualifier) {
        if (!qualifier) return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].getQualifier() == qualifier) {
                return this.attributes[i];
            }
        }
        ;
        return null;
    };
    ClientPresentationModel.prototype.findAttributeById = function (id) {
        if (!id) return null;
        for (var i = 0; i < this.attributes.length; i++) {
            if (this.attributes[i].id == id) {
                return this.attributes[i];
            }
        }
        ;
        return null;
    };
    ClientPresentationModel.prototype.syncWith = function (sourcePresentationModel) {
        this.attributes.forEach(function (targetAttribute) {
            var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName);
            if (sourceAttribute) {
                targetAttribute.syncWith(sourceAttribute);
            }
        });
    };
    return ClientPresentationModel;
}();
exports.ClientPresentationModel = ClientPresentationModel;



},{"./EventBus":95}],88:[function(_dereq_,module,exports){
"use strict";

var Codec = function () {
    function Codec() {}
    Codec.prototype.encode = function (commands) {
        return JSON.stringify(commands); // todo dk: look for possible API support for character encoding
    };
    Codec.prototype.decode = function (transmitted) {
        if (typeof transmitted == 'string') {
            return JSON.parse(transmitted);
        } else {
            return transmitted;
        }
    };
    return Codec;
}();
exports.__esModule = true;
exports["default"] = Codec;



},{}],89:[function(_dereq_,module,exports){
"use strict";

var Command = function () {
    function Command() {
        this.id = "dolphin-core-command";
    }
    return Command;
}();
exports.__esModule = true;
exports["default"] = Command;



},{}],90:[function(_dereq_,module,exports){
"use strict";

var ValueChangedCommand_1 = _dereq_('./ValueChangedCommand');
/** A Batcher that does no batching but merely takes the first element of the queue as the single item in the batch */
var NoCommandBatcher = function () {
    function NoCommandBatcher() {}
    NoCommandBatcher.prototype.batch = function (queue) {
        return [queue.shift()];
    };
    return NoCommandBatcher;
}();
exports.NoCommandBatcher = NoCommandBatcher;
/** A batcher that batches the blinds (commands with no callback) and optionally also folds value changes */
var BlindCommandBatcher = function () {
    /** folding: whether we should try folding ValueChangedCommands */
    function BlindCommandBatcher(folding, maxBatchSize) {
        if (folding === void 0) {
            folding = true;
        }
        if (maxBatchSize === void 0) {
            maxBatchSize = 50;
        }
        this.folding = folding;
        this.maxBatchSize = maxBatchSize;
    }
    BlindCommandBatcher.prototype.batch = function (queue) {
        var batch = [];
        var n = Math.min(queue.length, this.maxBatchSize);
        for (var counter = 0; counter < n; counter++) {
            var candidate = queue.shift();
            if (this.folding && candidate.command instanceof ValueChangedCommand_1["default"] && !candidate.handler) {
                var found = null;
                var canCmd = candidate.command;
                if (batch.length > 0 && batch[batch.length - 1].command instanceof ValueChangedCommand_1["default"]) {
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
    };
    return BlindCommandBatcher;
}();
exports.BlindCommandBatcher = BlindCommandBatcher;



},{"./ValueChangedCommand":102}],91:[function(_dereq_,module,exports){
"use strict";

var CommandConstants = function () {
    function CommandConstants() {}
    CommandConstants.DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
    CommandConstants.CREATE_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'initClientContext';
    CommandConstants.DESTROY_CONTEXT_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'disconnectClientContext';
    CommandConstants.CREATE_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'registerController';
    CommandConstants.DESTROY_CONTROLLER_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'destroyController';
    CommandConstants.CALL_CONTROLLER_ACTION_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
    CommandConstants.START_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'longPoll';
    CommandConstants.INTERRUPT_LONG_POLL_COMMAND_NAME = CommandConstants.DOLPHIN_PLATFORM_PREFIX + 'release';
    return CommandConstants;
}();
exports.__esModule = true;
exports["default"] = CommandConstants;



},{}],92:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var CreatePresentationModelCommand = function (_super) {
    __extends(CreatePresentationModelCommand, _super);
    function CreatePresentationModelCommand(presentationModel) {
        _super.call(this);
        this.attributes = [];
        this.clientSideOnly = false;
        this.id = "CreatePresentationModel";
        this.className = "org.opendolphin.core.comm.CreatePresentationModelCommand";
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
    }
    return CreatePresentationModelCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = CreatePresentationModelCommand;



},{"./Command":89}],93:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var DeletedPresentationModelNotification = function (_super) {
    __extends(DeletedPresentationModelNotification, _super);
    function DeletedPresentationModelNotification(pmId) {
        _super.call(this);
        this.pmId = pmId;
        this.id = 'DeletedPresentationModel';
        this.className = "org.opendolphin.core.comm.DeletedPresentationModelNotification";
    }
    return DeletedPresentationModelNotification;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = DeletedPresentationModelNotification;



},{"./Command":89}],94:[function(_dereq_,module,exports){
"use strict";

var ClientConnector_1 = _dereq_("./ClientConnector");
var ClientDolphin_1 = _dereq_("./ClientDolphin");
var ClientModelStore_1 = _dereq_("./ClientModelStore");
var HttpTransmitter_1 = _dereq_("./HttpTransmitter");
var NoTransmitter_1 = _dereq_("./NoTransmitter");
var DolphinBuilder = function () {
    function DolphinBuilder() {
        this.reset_ = false;
        this.slackMS_ = 300;
        this.maxBatchSize_ = 50;
        this.supportCORS_ = false;
    }
    DolphinBuilder.prototype.url = function (url) {
        this.url_ = url;
        return this;
    };
    DolphinBuilder.prototype.reset = function (reset) {
        this.reset_ = reset;
        return this;
    };
    DolphinBuilder.prototype.slackMS = function (slackMS) {
        this.slackMS_ = slackMS;
        return this;
    };
    DolphinBuilder.prototype.maxBatchSize = function (maxBatchSize) {
        this.maxBatchSize_ = maxBatchSize;
        return this;
    };
    DolphinBuilder.prototype.supportCORS = function (supportCORS) {
        this.supportCORS_ = supportCORS;
        return this;
    };
    DolphinBuilder.prototype.errorHandler = function (errorHandler) {
        this.errorHandler_ = errorHandler;
        return this;
    };
    DolphinBuilder.prototype.headersInfo = function (headersInfo) {
        this.headersInfo_ = headersInfo;
        return this;
    };
    DolphinBuilder.prototype.build = function () {
        console.log("OpenDolphin js found");
        var clientDolphin = new ClientDolphin_1["default"]();
        var transmitter;
        if (this.url_ != null && this.url_.length > 0) {
            transmitter = new HttpTransmitter_1["default"](this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
        } else {
            transmitter = new NoTransmitter_1["default"]();
        }
        clientDolphin.setClientConnector(new ClientConnector_1.ClientConnector(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
        clientDolphin.setClientModelStore(new ClientModelStore_1.ClientModelStore(clientDolphin));
        console.log("ClientDolphin initialized");
        return clientDolphin;
    };
    return DolphinBuilder;
}();
exports.__esModule = true;
exports["default"] = DolphinBuilder;



},{"./ClientConnector":84,"./ClientDolphin":85,"./ClientModelStore":86,"./HttpTransmitter":96,"./NoTransmitter":98}],95:[function(_dereq_,module,exports){
"use strict";

var EventBus = function () {
    function EventBus() {
        this.eventHandlers = [];
    }
    EventBus.prototype.onEvent = function (eventHandler) {
        this.eventHandlers.push(eventHandler);
    };
    EventBus.prototype.trigger = function (event) {
        this.eventHandlers.forEach(function (handle) {
            return handle(event);
        });
    };
    return EventBus;
}();
exports.__esModule = true;
exports["default"] = EventBus;



},{}],96:[function(_dereq_,module,exports){
"use strict";

var Codec_1 = _dereq_("./Codec");
var HttpTransmitter = function () {
    function HttpTransmitter(url, reset, charset, errorHandler, supportCORS, headersInfo) {
        if (reset === void 0) {
            reset = true;
        }
        if (charset === void 0) {
            charset = "UTF-8";
        }
        if (errorHandler === void 0) {
            errorHandler = null;
        }
        if (supportCORS === void 0) {
            supportCORS = false;
        }
        if (headersInfo === void 0) {
            headersInfo = null;
        }
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
        this.codec = new Codec_1["default"]();
        if (reset) {
            console.log('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');
            this.invalidate();
        }
    }
    HttpTransmitter.prototype.transmit = function (commands, onDone) {
        var _this = this;
        this.http.onerror = function (evt) {
            _this.handleError('onerror', "");
            onDone([]);
        };
        this.http.onreadystatechange = function (evt) {
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
    };
    HttpTransmitter.prototype.setHeaders = function (httpReq) {
        if (this.headersInfo) {
            for (var i in this.headersInfo) {
                if (this.headersInfo.hasOwnProperty(i)) {
                    httpReq.setRequestHeader(i, this.headersInfo[i]);
                }
            }
        }
    };
    HttpTransmitter.prototype.handleError = function (kind, message) {
        var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
        if (this.errorHandler) {
            this.errorHandler(errorEvent);
        } else {
            console.log("Error occurred: ", errorEvent);
        }
    };
    HttpTransmitter.prototype.signal = function (command) {
        this.sig.open('POST', this.url, true);
        this.setHeaders(this.sig);
        this.sig.send(this.codec.encode([command]));
    };
    // Deprecated ! Use 'reset(OnSuccessHandler) instead
    HttpTransmitter.prototype.invalidate = function () {
        this.http.open('POST', this.url + 'invalidate?', false);
        this.http.send();
    };
    return HttpTransmitter;
}();
exports.__esModule = true;
exports["default"] = HttpTransmitter;



},{"./Codec":88}],97:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SignalCommand_1 = _dereq_("./SignalCommand");
var CommandConstants_1 = _dereq_("./CommandConstants");
var InterruptLongPollCommand = function (_super) {
    __extends(InterruptLongPollCommand, _super);
    function InterruptLongPollCommand() {
        _super.call(this, CommandConstants_1["default"].INTERRUPT_LONG_POLL_COMMAND_NAME);
        this.className = "com.canoo.dolphin.impl.commands.InterruptLongPollCommand";
    }
    return InterruptLongPollCommand;
}(SignalCommand_1["default"]);
exports.__esModule = true;
exports["default"] = InterruptLongPollCommand;



},{"./CommandConstants":91,"./SignalCommand":100}],98:[function(_dereq_,module,exports){
"use strict";
/**
 * A transmitter that is not transmitting at all.
 * It may serve as a stand-in when no real transmitter is needed.
 */

var NoTransmitter = function () {
    function NoTransmitter() {}
    NoTransmitter.prototype.transmit = function (commands, onDone) {
        // do nothing special
        onDone([]);
    };
    NoTransmitter.prototype.signal = function (command) {
        // do nothing
    };
    NoTransmitter.prototype.reset = function (successHandler) {
        // do nothing
    };
    return NoTransmitter;
}();
exports.__esModule = true;
exports["default"] = NoTransmitter;



},{}],99:[function(_dereq_,module,exports){
"use strict";

var DolphinBuilder_1 = _dereq_("./DolphinBuilder");
var InterruptLongPollCommand_1 = _dereq_("./InterruptLongPollCommand");
var StartLongPollCommand_1 = _dereq_("./StartLongPollCommand");
/**
 * JS-friendly facade to avoid too many dependencies in plain JS code.
 * The name of this file is also used for the initial lookup of the
 * one javascript file that contains all the dolphin code.
 * Changing the name requires the build support and all users
 * to be updated as well.
 * Dierk Koenig
 */
// factory method for the initialized dolphin
// Deprecated ! Use 'makeDolphin() instead
function dolphin(url, reset, slackMS) {
    if (slackMS === void 0) {
        slackMS = 300;
    }
    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}
exports.dolphin = dolphin;
// factory method to build an initialized dolphin
function makeDolphin() {
    return new DolphinBuilder_1["default"]();
}
exports.makeDolphin = makeDolphin;
//Factory methods to have a better integration of ts sources in JS & es6
function createInterruptLongPollCommand() {
    return new InterruptLongPollCommand_1["default"]();
}
exports.createInterruptLongPollCommand = createInterruptLongPollCommand;
function createStartLongPollCommand() {
    return new StartLongPollCommand_1["default"]();
}
exports.createStartLongPollCommand = createStartLongPollCommand;



},{"./DolphinBuilder":94,"./InterruptLongPollCommand":97,"./StartLongPollCommand":101}],100:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var SignalCommand = function (_super) {
    __extends(SignalCommand, _super);
    function SignalCommand(name) {
        _super.call(this);
        this.id = name;
        this.className = "org.opendolphin.core.comm.SignalCommand";
    }
    return SignalCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = SignalCommand;



},{"./Command":89}],101:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var CommandConstants_1 = _dereq_("./CommandConstants");
var StartLongPollCommand = function (_super) {
    __extends(StartLongPollCommand, _super);
    function StartLongPollCommand() {
        _super.call(this);
        this.id = CommandConstants_1["default"].START_LONG_POLL_COMMAND_NAME;
        this.className = "com.canoo.dolphin.impl.commands.StartLongPollCommand";
    }
    return StartLongPollCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = StartLongPollCommand;



},{"./Command":89,"./CommandConstants":91}],102:[function(_dereq_,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = _dereq_('./Command');
var ValueChangedCommand = function (_super) {
    __extends(ValueChangedCommand, _super);
    function ValueChangedCommand(attributeId, newValue) {
        _super.call(this);
        this.attributeId = attributeId;
        this.newValue = newValue;
        this.id = "ValueChanged";
        this.className = "org.opendolphin.core.comm.ValueChangedCommand";
    }
    return ValueChangedCommand;
}(Command_1["default"]);
exports.__esModule = true;
exports["default"] = ValueChangedCommand;



},{"./Command":89}],103:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/map":1,"./utils":121,"./utils.js":121}],104:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/map":1,"./constants":115,"./utils":121,"./utils.js":121}],105:[function(_dereq_,module,exports){
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
/* global exports */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OpenDolphin = _dereq_('../opendolphin/build/OpenDolphin.js');

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


exports.ClientContextFactory = ClientContextFactory;

},{"../opendolphin/build/OpenDolphin.js":99,"./beanmanager.js":103,"./classrepo.js":104,"./clientcontext.js":106,"./connector.js":114,"./controllermanager.js":116,"./platformHttpTransmitter.js":119,"./utils":121}],106:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/promise":2,"./commandFactory":108,"./utils":121,"./utils.js":121,"emitter-component":80}],107:[function(_dereq_,module,exports){
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

},{"./utils.js":121}],108:[function(_dereq_,module,exports){
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
    }]);

    return CommandFactory;
}();

exports.default = CommandFactory;

},{"./commands/callActionCommand.js":109,"./commands/createContextCommand.js":110,"./commands/createControllerCommand.js":111,"./commands/destroyContextCommand.js":112,"./commands/destroyControllerCommand.js":113}],109:[function(_dereq_,module,exports){
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

},{"../utils":121}],110:[function(_dereq_,module,exports){
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

},{"../utils":121}],111:[function(_dereq_,module,exports){
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

},{"../utils":121}],112:[function(_dereq_,module,exports){
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

},{"../utils":121}],113:[function(_dereq_,module,exports){
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

},{"../utils":121}],114:[function(_dereq_,module,exports){
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

var _OpenDolphin = _dereq_('../opendolphin/build/OpenDolphin.js');

var _OpenDolphin2 = _interopRequireDefault(_OpenDolphin);

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _ClientModelStore = _dereq_('../opendolphin/build/ClientModelStore');

var _ClientModelStore2 = _interopRequireDefault(_ClientModelStore);

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

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
                if (event.eventType === _ClientModelStore2.default.Type.ADDED) {
                    self.onModelAdded(model);
                } else if (event.eventType === _ClientModelStore2.default.Type.REMOVED) {
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
                that.dolphin.startPushListening(_OpenDolphin2.default.createStartLongPollCommand(), _OpenDolphin2.default.createInterruptLongPollCommand());
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

},{"../bower_components/core.js/library/fn/promise":2,"../opendolphin/build/ClientModelStore":86,"../opendolphin/build/OpenDolphin.js":99,"./utils":121,"./utils.js":121}],115:[function(_dereq_,module,exports){
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

},{}],116:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./commandFactory.js":108,"./connector.js":114,"./controllerproxy.js":117,"./utils":121}],117:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/set":3,"./utils":121}],118:[function(_dereq_,module,exports){
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

},{}],119:[function(_dereq_,module,exports){
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

},{"./codec.js":107,"./errors.js":118,"./remotingErrorHandler":120,"./utils":121,"emitter-component":80}],120:[function(_dereq_,module,exports){
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

},{}],121:[function(_dereq_,module,exports){
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

},{}]},{},[105])(105)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktbWV0aG9kcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQXR0cmlidXRlLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQ2xpZW50QXR0cmlidXRlLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQ2xpZW50Q29ubmVjdG9yLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQ2xpZW50RG9scGhpbi5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL0NsaWVudE1vZGVsU3RvcmUuanMiLCJvcGVuZG9scGhpbi9idWlsZC9DbGllbnRQcmVzZW50YXRpb25Nb2RlbC5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL0NvZGVjLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQ29tbWFuZC5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL0NvbW1hbmRCYXRjaGVyLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQ29tbWFuZENvbnN0YW50cy5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL0NyZWF0ZUNvbnRleHRDb21tYW5kLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvRGVzdHJveUNvbnRleHRDb21tYW5kLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvRG9scGhpbkJ1aWxkZXIuanMiLCJvcGVuZG9scGhpbi9idWlsZC9FdmVudEJ1cy5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL0h0dHBUcmFuc21pdHRlci5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL0ludGVycnVwdExvbmdQb2xsQ29tbWFuZC5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL05vVHJhbnNtaXR0ZXIuanMiLCJvcGVuZG9scGhpbi9idWlsZC9PcGVuRG9scGhpbi5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL1NpZ25hbENvbW1hbmQuanMiLCJvcGVuZG9scGhpbi9idWlsZC9TdGFydExvbmdQb2xsQ29tbWFuZC5qcyIsIm9wZW5kb2xwaGluL2J1aWxkL1ZhbHVlQ2hhbmdlZENvbW1hbmQuanMiLCJzcmMvYmVhbm1hbmFnZXIuanMiLCJzcmMvY2xhc3NyZXBvLmpzIiwic3JjL2NsaWVudENvbnRleHRGYWN0b3J5LmpzIiwic3JjL2NsaWVudGNvbnRleHQuanMiLCJzcmMvY29kZWMuanMiLCJzcmMvY29tbWFuZEZhY3RvcnkuanMiLCJzcmMvY29tbWFuZHMvY2FsbEFjdGlvbkNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvY3JlYXRlQ29udHJvbGxlckNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvZGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmpzIiwic3JjL2Nvbm5lY3Rvci5qcyIsInNyYy9jb25zdGFudHMuanMiLCJzcmMvY29udHJvbGxlcm1hbmFnZXIuanMiLCJzcmMvY29udHJvbGxlcnByb3h5LmpzIiwic3JjL2Vycm9ycy5qcyIsInNyYy9wbGF0Zm9ybUh0dHBUcmFuc21pdHRlci5qcyIsInNyYy9yZW1vdGluZ0Vycm9ySGFuZGxlci5qcyIsInNyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsUUFBUSxpQ0FBUjtBQUNBLFFBQVEsZ0NBQVI7QUFDQSxRQUFRLDZCQUFSO0FBQ0EsUUFBUSxvQkFBUjtBQUNBLFFBQVEsNEJBQVI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxrQkFBUixFQUE0QixHQUE3Qzs7Ozs7QUNMQSxRQUFRLGlDQUFSO0FBQ0EsUUFBUSxn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Ozs7Ozs7Ozs7Ozs7QUFlQTtBQUNBOztBQUVBLElBQUksZUFBSjs7QUFFQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVMsTUFBVCxFQUFpQjtBQUMxQixXQUFPLE9BQU8sTUFBUCxLQUFrQixXQUFsQixJQUFpQyxXQUFXLElBQW5EO0FBQ0gsQ0FGRDs7QUFJQSxPQUFPLE9BQVAsQ0FBZSxNQUFmLEdBQXdCLE1BQXhCOztBQUVBLE9BQU8sT0FBUCxDQUFlLFdBQWYsR0FBNkIsVUFBUyxJQUFULEVBQWU7QUFDeEMsc0JBQWtCLElBQWxCO0FBQ0gsQ0FGRDs7QUFJQSxPQUFPLE9BQVAsQ0FBZSxVQUFmLEdBQTRCLFVBQVMsS0FBVCxFQUFnQixhQUFoQixFQUErQjtBQUN2RCxRQUFJLENBQUMsT0FBTyxLQUFQLENBQUwsRUFBb0I7QUFDaEIsY0FBTSxJQUFJLEtBQUosQ0FBVSxtQkFBbUIsYUFBbkIsR0FBbUMsbUJBQW5DLEdBQXlELGVBQW5FLENBQU47QUFDSDtBQUNKLENBSkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLk1hcDsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYucHJvbWlzZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuU2V0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXIsIElURVJBVE9SKXtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdCgkdGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSN0b0luZGV4IGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTsiLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBhc2MgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRZUEUsICRjcmVhdGUpe1xuICB2YXIgSVNfTUFQICAgICAgICA9IFRZUEUgPT0gMVxuICAgICwgSVNfRklMVEVSICAgICA9IFRZUEUgPT0gMlxuICAgICwgSVNfU09NRSAgICAgICA9IFRZUEUgPT0gM1xuICAgICwgSVNfRVZFUlkgICAgICA9IFRZUEUgPT0gNFxuICAgICwgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNlxuICAgICwgTk9fSE9MRVMgICAgICA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYXG4gICAgLCBjcmVhdGUgICAgICAgID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KCR0aGlzKVxuICAgICAgLCBzZWxmICAgPSBJT2JqZWN0KE8pXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMFxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkXG4gICAgICAsIHZhbCwgcmVzO1xuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZil7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZihUWVBFKXtcbiAgICAgICAgaWYoSVNfTUFQKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmKElTX0VWRVJZKXJldHVybiBmYWxzZTsgICAgICAgICAgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBpc0FycmF5ICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwpe1xuICB2YXIgQztcbiAgaWYoaXNBcnJheShvcmlnaW5hbCkpe1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSlDID0gdW5kZWZpbmVkO1xuICAgIGlmKGlzT2JqZWN0KEMpKXtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYoQyA9PT0gbnVsbClDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTsiLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsZW5ndGgpe1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGNyZWF0ZSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBhbkluc3RhbmNlICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBkZWZpbmVkICAgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKVxuICAsIGZvck9mICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJylcbiAgLCBzdGVwICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgc2V0U3BlY2llcyAgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgZmFzdEtleSAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleVxuICAsIFNJWkUgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbih0aGF0LCBrZXkpe1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcbiAgaWYoaW5kZXggIT09ICdGJylyZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcbiAgICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmKGVudHJ5KXtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cbiAgICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0Ll9mID09IGVudHJ5KXRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmKHRoYXQuX2wgPT0gZW50cnkpdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsICdmb3JFYWNoJyk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZil7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZihERVNDUklQVE9SUylkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBkZWZpbmVkKHRoaXNbU0laRV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcbiAgICAgICwgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYoZW50cnkpe1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYoIXRoYXQuX2YpdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT09ICdGJyl0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbihDLCBOQU1FLCBJU19NQVApe1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICB0aGlzLl90ID0gaXRlcmF0ZWQ7ICAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7IC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgLCBraW5kICA9IHRoYXQuX2tcbiAgICAgICAgLCBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpe1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJyAsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgZnJvbSAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWZyb20taXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICBpZihjbGFzc29mKHRoaXMpICE9IE5BTUUpdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICByZXR1cm4gZnJvbSh0aGlzKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgbWV0YSAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJylcbiAgLCBmYWlscyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lQWxsICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBmb3JPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgYW5JbnN0YW5jZSAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGRQICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGVhY2ggICAgICAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDApXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRhcmdldCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUsICdfYycpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICBlYWNoKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcyx0b0pTT04nLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSloaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsIEtFWSk7XG4gICAgICAgIGlmKCFJU19BRERFUiAmJiBJU19XRUFLICYmICFpc09iamVjdChhKSlyZXR1cm4gS0VZID09ICdnZXQnID8gdW5kZWZpbmVkIDogZmFsc2U7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9jW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIElTX0FEREVSID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKCdzaXplJyBpbiBwcm90bylkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYsIE8pO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJylcbiAgLCBCUkVBSyAgICAgICA9IHt9XG4gICwgUkVUVVJOICAgICAgPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKXtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyAgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyByZXR1cm4ge2RvbmU6IHNhZmUgPSB0cnVlfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUoaGVhZCl7XG4gICAgICBmbiAgID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgaWYoaGVhZClub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZihpc05vZGUpe1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbiAgfSBlbHNlIGlmKE9ic2VydmVyKXtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZVxuICAgICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH07XG4gIC8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4gIC8vIC0gc2V0SW1tZWRpYXRlXG4gIC8vIC0gTWVzc2FnZUNoYW5uZWxcbiAgLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuICAvLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyAtIHNldFRpbWVvdXRcbiAgfSBlbHNlIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihmbil7XG4gICAgdmFyIHRhc2sgPSB7Zm46IGZuLCBuZXh0OiB1bmRlZmluZWR9O1xuICAgIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZighaGVhZCl7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59OyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwidmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjLCBzYWZlKXtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKXtcbiAgICBpZihzYWZlICYmIHRhcmdldFtrZXldKXRhcmdldFtrZXldID0gc3JjW2tleV07XG4gICAgZWxzZSBoaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIH0gcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSlkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBTUEVDSUVTICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBpbnZva2UgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIGh0bWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2h0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbigpe1xuICB2YXIgaWQgPSArdGhpcztcbiAgaWYocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoTWVzc2FnZUNoYW5uZWwpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsIlwidXNlIHN0cmljdFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpsY3pZdWIySnFaV04wTG5SdkxYTjBjbWx1Wnk1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjbGFzc29mICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCAkZXhwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICAgICAgICAgID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGZvck9mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgdGFzayAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIG1pY3JvdGFzayAgICAgICAgICA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKClcbiAgLCBQUk9NSVNFICAgICAgICAgICAgPSAnUHJvbWlzZSdcbiAgLCBUeXBlRXJyb3IgICAgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCAkUHJvbWlzZSAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICAgICAgICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgZW1wdHkgICAgICAgICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIEludGVybmFsLCBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbigpe1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlICAgICA9ICRQcm9taXNlLnJlc29sdmUoMSlcbiAgICAgICwgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uKGV4ZWMpeyBleGVjKGVtcHR5LCBlbXB0eSk7IH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gd2l0aCBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIHJldHVybiBhID09PSBiIHx8IGEgPT09ICRQcm9taXNlICYmIGIgPT09IFdyYXBwZXI7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHJldHVybiBzYW1lQ29uc3RydWN0b3IoJFByb21pc2UsIEMpXG4gICAgPyBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICA6IG5ldyBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpO1xufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHByb21pc2UsIGlzUmVqZWN0KXtcbiAgaWYocHJvbWlzZS5fbilyZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIG9rICAgID0gcHJvbWlzZS5fcyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24ocmVhY3Rpb24pe1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbFxuICAgICAgICAsIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlXG4gICAgICAgICwgcmVqZWN0ICA9IHJlYWN0aW9uLnJlamVjdFxuICAgICAgICAsIGRvbWFpbiAgPSByZWFjdGlvbi5kb21haW5cbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spe1xuICAgICAgICAgICAgaWYocHJvbWlzZS5faCA9PSAyKW9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGhhbmRsZXIgPT09IHRydWUpcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZXhpdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZihpc1JlamVjdCAmJiAhcHJvbWlzZS5faClvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBhYnJ1cHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmKGFicnVwdCl0aHJvdyBhYnJ1cHQuZXJyb3I7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICBpZihwcm9taXNlLl9oID09IDEpcmV0dXJuIGZhbHNlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9hIHx8IHByb21pc2UuX2NcbiAgICAsIGkgICAgID0gMFxuICAgICwgcmVhY3Rpb247XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYoaXNOb2RlKXtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCl7XG4gICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3Z9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmKCFwcm9taXNlLl9hKXByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihwcm9taXNlID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge193OiBwcm9taXNlLCBfZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gICAgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rICAgICA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCAgID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fYSl0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fcylub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcHJvbWlzZSAgPSBuZXcgSW50ZXJuYWw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ICA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1Byb21pc2U6ICRQcm9taXNlfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgLy8gaW5zdGFuY2VvZiBpbnN0ZWFkIG9mIGludGVybmFsIHNsb3QgY2hlY2sgYmVjYXVzZSB3ZSBzaG91bGQgZml4IGl0IHdpdGhvdXQgcmVwbGFjZW1lbnQgbmF0aXZlIFByb21pc2UgY29yZVxuICAgIGlmKHggaW5zdGFuY2VvZiAkUHJvbWlzZSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlc29sdmUgID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgICQkcmVzb2x2ZSh4KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlc29sdmUgICAgPSBjYXBhYmlsaXR5LnJlc29sdmVcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsdWVzICAgID0gW11cbiAgICAgICAgLCBpbmRleCAgICAgPSAwXG4gICAgICAgICwgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIHZhciAkaW5kZXggICAgICAgID0gaW5kZXgrK1xuICAgICAgICAgICwgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGlmKGFscmVhZHlDYWxsZWQpcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHt0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKX0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1NldCcsIHt0b0pTT046IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKX0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn0iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBBdHRyaWJ1dGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEF0dHJpYnV0ZSgpIHtcbiAgICB9XG4gICAgQXR0cmlidXRlLlFVQUxJRklFUl9QUk9QRVJUWSA9IFwicXVhbGlmaWVyXCI7XG4gICAgQXR0cmlidXRlLlZBTFVFID0gXCJ2YWx1ZVwiO1xuICAgIHJldHVybiBBdHRyaWJ1dGU7XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQXR0cmlidXRlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1BdHRyaWJ1dGUuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgdGhpcy5tZXRhZGF0YU5hbWUgPSBtZXRhZGF0YU5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5pZCA9ICdDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YSc7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZFwiO1xuICAgIH1cbiAgICByZXR1cm4gQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kO1xufShDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEV2ZW50QnVzXzEgPSByZXF1aXJlKCcuL0V2ZW50QnVzJyk7XG52YXIgQ2xpZW50QXR0cmlidXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGllbnRBdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICB0aGlzLmlkID0gXCJcIiArIChDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCsrKSArIFwiQ1wiO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzXzFbXCJkZWZhdWx0XCJdKCk7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzXzFbXCJkZWZhdWx0XCJdKCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLnNldFF1YWxpZmllcihxdWFsaWZpZXIpO1xuICAgIH1cbiAgICAvKiogYSBjb3B5IGNvbnN0cnVjdG9yIHdpdGggbmV3IGlkIGFuZCBubyBwcmVzZW50YXRpb24gbW9kZWwgKi9cbiAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50QXR0cmlidXRlKHRoaXMucHJvcGVydHlOYW1lLCB0aGlzLmdldFF1YWxpZmllcigpLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXRQcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICAgICAgYWxlcnQoXCJZb3UgY2FuIG5vdCBzZXQgYSBwcmVzZW50YXRpb24gbW9kZWwgZm9yIGFuIGF0dHJpYnV0ZSB0aGF0IGlzIGFscmVhZHkgYm91bmQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWwgPSBwcmVzZW50YXRpb25Nb2RlbDtcbiAgICB9O1xuICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0UHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsO1xuICAgIH07XG4gICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIHZhciB2ZXJpZmllZFZhbHVlID0gQ2xpZW50QXR0cmlidXRlLmNoZWNrVmFsdWUobmV3VmFsdWUpO1xuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSB2ZXJpZmllZFZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmVyaWZpZWRWYWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkVmFsdWUsICduZXdWYWx1ZSc6IHZlcmlmaWVkVmFsdWUgfSk7XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnNldFF1YWxpZmllciA9IGZ1bmN0aW9uIChuZXdRdWFsaWZpZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucXVhbGlmaWVyID09IG5ld1F1YWxpZmllcilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG9sZFF1YWxpZmllciA9IHRoaXMucXVhbGlmaWVyO1xuICAgICAgICB0aGlzLnF1YWxpZmllciA9IG5ld1F1YWxpZmllcjtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFF1YWxpZmllciwgJ25ld1ZhbHVlJzogbmV3UXVhbGlmaWVyIH0pO1xuICAgIH07XG4gICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5nZXRRdWFsaWZpZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1YWxpZmllcjtcbiAgICB9O1xuICAgIENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgU3RyaW5nIHx8IHJlc3VsdCBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgcmVzdWx0IGluc3RhbmNlb2YgTnVtYmVyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIENsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbiBBdHRyaWJ1dGUgbWF5IG5vdCBpdHNlbGYgY29udGFpbiBhbiBhdHRyaWJ1dGUgYXMgYSB2YWx1ZS4gQXNzdW1pbmcgeW91IGZvcmdvdCB0byBjYWxsIHZhbHVlLlwiKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY2hlY2tWYWx1ZSh2YWx1ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9rID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLlNVUFBPUlRFRF9WQUxVRV9UWVBFUy5pbmRleE9mKHR5cGVvZiByZXN1bHQpID4gLTEgfHwgcmVzdWx0IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dHJpYnV0ZSB2YWx1ZXMgb2YgdGhpcyB0eXBlIGFyZSBub3QgYWxsb3dlZDogXCIgKyB0eXBlb2YgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLm9uVmFsdWVDaGFuZ2UgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICBldmVudEhhbmRsZXIoeyBcIm9sZFZhbHVlXCI6IHRoaXMudmFsdWUsIFwibmV3VmFsdWVcIjogdGhpcy52YWx1ZSB9KTtcbiAgICB9O1xuICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUub25RdWFsaWZpZXJDaGFuZ2UgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9O1xuICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc3luY1dpdGggPSBmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgIGlmIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7IC8vIHNlcXVlbmNlIGlzIGltcG9ydGFudFxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDbGllbnRBdHRyaWJ1dGUuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTID0gW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwiYm9vbGVhblwiXTtcbiAgICBDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCA9IDA7XG4gICAgcmV0dXJuIENsaWVudEF0dHJpYnV0ZTtcbn0oKSk7XG5leHBvcnRzLkNsaWVudEF0dHJpYnV0ZSA9IENsaWVudEF0dHJpYnV0ZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2xpZW50QXR0cmlidXRlLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWxfMSA9IHJlcXVpcmUoXCIuL0NsaWVudFByZXNlbnRhdGlvbk1vZGVsXCIpO1xudmFyIENvZGVjXzEgPSByZXF1aXJlKFwiLi9Db2RlY1wiKTtcbnZhciBDb21tYW5kQmF0Y2hlcl8xID0gcmVxdWlyZShcIi4vQ29tbWFuZEJhdGNoZXJcIik7XG52YXIgQ2xpZW50Q29ubmVjdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGllbnRDb25uZWN0b3IodHJhbnNtaXR0ZXIsIGNsaWVudERvbHBoaW4sIHNsYWNrTVMsIG1heEJhdGNoU2l6ZSkge1xuICAgICAgICBpZiAoc2xhY2tNUyA9PT0gdm9pZCAwKSB7IHNsYWNrTVMgPSAwOyB9XG4gICAgICAgIGlmIChtYXhCYXRjaFNpemUgPT09IHZvaWQgMCkgeyBtYXhCYXRjaFNpemUgPSA1MDsgfVxuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnNsYWNrTVMgPSBzbGFja01TO1xuICAgICAgICB0aGlzLmNvZGVjID0gbmV3IENvZGVjXzFbXCJkZWZhdWx0XCJdKCk7XG4gICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXcgQ29tbWFuZEJhdGNoZXJfMS5CbGluZENvbW1hbmRCYXRjaGVyKHRydWUsIG1heEJhdGNoU2l6ZSk7XG4gICAgfVxuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2V0Q29tbWFuZEJhdGNoZXIgPSBmdW5jdGlvbiAobmV3QmF0Y2hlcikge1xuICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3QmF0Y2hlcjtcbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2V0UHVzaEVuYWJsZWQgPSBmdW5jdGlvbiAoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLnB1c2hFbmFibGVkID0gZW5hYmxlZDtcbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2V0UHVzaExpc3RlbmVyID0gZnVuY3Rpb24gKG5ld0xpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMucHVzaExpc3RlbmVyID0gbmV3TGlzdGVuZXI7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldFJlbGVhc2VDb21tYW5kID0gZnVuY3Rpb24gKG5ld0NvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlQ29tbWFuZCA9IG5ld0NvbW1hbmQ7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoY29tbWFuZCwgb25GaW5pc2hlZCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHsgY29tbWFuZDogY29tbWFuZCwgaGFuZGxlcjogb25GaW5pc2hlZCB9KTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7IC8vIHRoZXJlIGlzIG5vdCBwb2ludCBpbiByZWxlYXNpbmcgaWYgd2UgZG8gbm90IHNlbmQgYXRtXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmRvU2VuZE5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmNvbW1hbmRRdWV1ZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wdXNoRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5xdWV1ZVB1c2hDb21tYW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgdmFyIGNtZHNBbmRIYW5kbGVycyA9IHRoaXMuY29tbWFuZEJhdGNoZXIuYmF0Y2godGhpcy5jb21tYW5kUXVldWUpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBjbWRzQW5kSGFuZGxlcnNbY21kc0FuZEhhbmRsZXJzLmxlbmd0aCAtIDFdLmhhbmRsZXI7XG4gICAgICAgIHZhciBjb21tYW5kcyA9IGNtZHNBbmRIYW5kbGVycy5tYXAoZnVuY3Rpb24gKGNhaCkgeyByZXR1cm4gY2FoLmNvbW1hbmQ7IH0pO1xuICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnRyYW5zbWl0KGNvbW1hbmRzLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXJ2ZXIgcmVzcG9uc2U6IFtcIiArIHJlc3BvbnNlLm1hcChpdCA9PiBpdC5pZCkuam9pbihcIiwgXCIpICsgXCJdIFwiKTtcbiAgICAgICAgICAgIHZhciB0b3VjaGVkUE1zID0gW107XG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoZWQgPSBfdGhpcy5oYW5kbGUoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgaWYgKHRvdWNoZWQpXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoZWRQTXMucHVzaCh0b3VjaGVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sub25GaW5pc2hlZCh0b3VjaGVkUE1zKTsgLy8gdG9kbzogbWFrZSB0aGVtIHVuaXF1ZT9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZSBjYWxsOiBmZXRjaCB0aGUgbmV4dCBpbiBsaW5lIGJ1dCBhbGxvdyBhIGJpdCBvZiBzbGFjayBzdWNoIHRoYXRcbiAgICAgICAgICAgIC8vIGRvY3VtZW50IGV2ZW50cyBjYW4gZmlyZSwgcmVuZGVyaW5nIGlzIGRvbmUgYW5kIGNvbW1hbmRzIGNhbiBiYXRjaCB1cFxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5kb1NlbmROZXh0KCk7IH0sIF90aGlzLnNsYWNrTVMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT0gXCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiVmFsdWVDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYW5ub3QgaGFuZGxlLCB1bmtub3duIGNvbW1hbmQgXCIgKyBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gdGhpcy5jbGllbnREb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgaWYgKCFtb2RlbClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH07XG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYSBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiICBrbm93biB0byB0aGUgY2xpZW50LlwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IF90aGlzLmNsaWVudERvbHBoaW4uYXR0cmlidXRlKGF0dHIucHJvcGVydHlOYW1lLCBhdHRyLnF1YWxpZmllciwgYXR0ci52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0ci5pZCAmJiBhdHRyLmlkLm1hdGNoKFwiLipTJFwiKSkge1xuICAgICAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5pZCA9IGF0dHIuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goY2xpZW50QXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjbGllbnRQbSA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbF8xLkNsaWVudFByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCwgc2VydmVyQ29tbWFuZC5wbVR5cGUpO1xuICAgICAgICBjbGllbnRQbS5hZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgICBpZiAoc2VydmVyQ29tbWFuZC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgY2xpZW50UG0uY2xpZW50U2lkZU9ubHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuYWRkKGNsaWVudFBtKTtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLnVwZGF0ZVByZXNlbnRhdGlvbk1vZGVsUXVhbGlmaWVyKGNsaWVudFBtKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudFBtO1xuICAgIH07XG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImF0dHJpYnV0ZSB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHVwZGF0ZSB0byBuZXcgdmFsdWUgXCIgKyBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSA9PSBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibm90aGluZyB0byBkby4gbmV3IHZhbHVlID09IG9sZCB2YWx1ZVwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRWYWx1ZShzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgY2xpZW50QXR0cmlidXRlW3NlcnZlckNvbW1hbmQubWV0YWRhdGFOYW1lXSA9IHNlcnZlckNvbW1hbmQudmFsdWU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgLy8vLy8vLy8vLy8vLyBwdXNoIHN1cHBvcnQgLy8vLy8vLy8vLy8vLy8vXG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5wdXNoRW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyBwdXNoTGlzdGVuZXIgaXMgc2V0P1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuZW5xdWV1ZVB1c2hDb21tYW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIGNvbW1hbmQ6IHRoaXMucHVzaExpc3RlbmVyLFxuICAgICAgICAgICAgaGFuZGxlcjoge1xuICAgICAgICAgICAgICAgIG9uRmluaXNoZWQ6IGZ1bmN0aW9uIChtb2RlbHMpIHsgbWUud2FpdGluZyA9IGZhbHNlOyB9LFxuICAgICAgICAgICAgICAgIG9uRmluaXNoZWREYXRhOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgIC8vIHRvZG86IGhvdyB0byBpc3N1ZSBhIHdhcm5pbmcgaWYgbm8gcmVsZWFzZUNvbW1hbmQgaXMgc2V0P1xuICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnNpZ25hbCh0aGlzLnJlbGVhc2VDb21tYW5kKTtcbiAgICB9O1xuICAgIHJldHVybiBDbGllbnRDb25uZWN0b3I7XG59KCkpO1xuZXhwb3J0cy5DbGllbnRDb25uZWN0b3IgPSBDbGllbnRDb25uZWN0b3I7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNsaWVudENvbm5lY3Rvci5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENsaWVudEF0dHJpYnV0ZV8xID0gcmVxdWlyZShcIi4vQ2xpZW50QXR0cmlidXRlXCIpO1xudmFyIENsaWVudFByZXNlbnRhdGlvbk1vZGVsXzEgPSByZXF1aXJlKFwiLi9DbGllbnRQcmVzZW50YXRpb25Nb2RlbFwiKTtcbnZhciBDbGllbnREb2xwaGluID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGllbnREb2xwaGluKCkge1xuICAgIH1cbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zZXRDbGllbnRDb25uZWN0b3IgPSBmdW5jdGlvbiAoY2xpZW50Q29ubmVjdG9yKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yID0gY2xpZW50Q29ubmVjdG9yO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0Q2xpZW50Q29ubmVjdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRDb25uZWN0b3I7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGNvbW1hbmQsIG9uRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChjb21tYW5kLCBvbkZpbmlzaGVkKTtcbiAgICB9O1xuICAgIC8vIGZhY3RvcnkgbWV0aG9kIGZvciBhdHRyaWJ1dGVzXG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuYXR0cmlidXRlID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IENsaWVudEF0dHJpYnV0ZV8xLkNsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpO1xuICAgIH07XG4gICAgLy8gZmFjdG9yeSBtZXRob2QgZm9yIHByZXNlbnRhdGlvbiBtb2RlbHNcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5wcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChpZCwgdHlwZSkge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXR0cmlidXRlc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9kZWwgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWxfMS5DbGllbnRQcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChtb2RlbCk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnNldENsaWVudE1vZGVsU3RvcmUgPSBmdW5jdGlvbiAoY2xpZW50TW9kZWxTdG9yZSkge1xuICAgICAgICB0aGlzLmNsaWVudE1vZGVsU3RvcmUgPSBjbGllbnRNb2RlbFN0b3JlO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0Q2xpZW50TW9kZWxTdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50TW9kZWxTdG9yZTtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKTtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgIH07XG4gICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICB9O1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKG1vZGVsVG9EZWxldGUpIHtcbiAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWxUb0RlbGV0ZSwgdHJ1ZSk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS51cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllciA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS51cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIgPSBmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxBdHRyaWJ1dGVzQnlRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7IC8vIHNob3VsZCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vLy8vLyBwdXNoIHN1cHBvcnQgLy8vLy8vL1xuICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnN0YXJ0UHVzaExpc3RlbmluZyA9IGZ1bmN0aW9uIChwdXNoQ29tbWFuZCwgcmVsZWFzZUNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaExpc3RlbmVyKHB1c2hDb21tYW5kKTtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UmVsZWFzZUNvbW1hbmQocmVsZWFzZUNvbW1hbmQpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IubGlzdGVuKCk7XG4gICAgfTtcbiAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zdG9wUHVzaExpc3RlbmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQoZmFsc2UpO1xuICAgIH07XG4gICAgcmV0dXJuIENsaWVudERvbHBoaW47XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ2xpZW50RG9scGhpbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2xpZW50RG9scGhpbi5qcy5tYXBcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2NvcmUtanMuZC50c1wiIC8+XG5cInVzZSBzdHJpY3RcIjtcbnZhciBBdHRyaWJ1dGVfMSA9IHJlcXVpcmUoXCIuL0F0dHJpYnV0ZVwiKTtcbnZhciBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZFwiKTtcbnZhciBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbnZhciBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb25fMSA9IHJlcXVpcmUoXCIuL0RlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvblwiKTtcbnZhciBFdmVudEJ1c18xID0gcmVxdWlyZShcIi4vRXZlbnRCdXNcIik7XG52YXIgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vVmFsdWVDaGFuZ2VkQ29tbWFuZFwiKTtcbihmdW5jdGlvbiAoVHlwZSkge1xuICAgIFR5cGVbVHlwZVtcIkFEREVEXCJdID0gJ0FEREVEJ10gPSBcIkFEREVEXCI7XG4gICAgVHlwZVtUeXBlW1wiUkVNT1ZFRFwiXSA9ICdSRU1PVkVEJ10gPSBcIlJFTU9WRURcIjtcbn0pKGV4cG9ydHMuVHlwZSB8fCAoZXhwb3J0cy5UeXBlID0ge30pKTtcbnZhciBUeXBlID0gZXhwb3J0cy5UeXBlO1xudmFyIENsaWVudE1vZGVsU3RvcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENsaWVudE1vZGVsU3RvcmUoY2xpZW50RG9scGhpbikge1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZCA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXNfMVtcImRlZmF1bHRcIl0oKTtcbiAgICB9XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZ2V0Q2xpZW50RG9scGhpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50RG9scGhpbjtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlZ2lzdGVyTW9kZWwgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbm5lY3RvciA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKTtcbiAgICAgICAgdmFyIGNyZWF0ZVBNQ29tbWFuZCA9IG5ldyBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRfMVtcImRlZmF1bHRcIl0obW9kZWwpO1xuICAgICAgICBjb25uZWN0b3Iuc2VuZChjcmVhdGVQTUNvbW1hbmQsIG51bGwpO1xuICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBfdGhpcy5yZWdpc3RlckF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlZ2lzdGVyQXR0cmlidXRlID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdoZW5ldmVyIGFuIGF0dHJpYnV0ZSBjaGFuZ2VzIGl0cyB2YWx1ZSwgdGhlIHNlcnZlciBuZWVkcyB0byBiZSBub3RpZmllZFxuICAgICAgICAvLyBhbmQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgd2l0aCB0aGUgc2FtZSBxdWFsaWZpZXIgYXJlIGdpdmVuIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZUNoYW5nZUNvbW1hbmQgPSBuZXcgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xW1wiZGVmYXVsdFwiXShhdHRyaWJ1dGUuaWQsIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICBfdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQodmFsdWVDaGFuZ2VDb21tYW5kLCBudWxsKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBfdGhpcy5maW5kQXR0cmlidXRlc0J5RmlsdGVyKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRyICE9PSBhdHRyaWJ1dGUgJiYgYXR0ci5nZXRRdWFsaWZpZXIoKSA9PSBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXR0cnMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICBhdHRyLnNldFZhbHVlKGF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGF0dHJpYnV0ZS5vblF1YWxpZmllckNoYW5nZShmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlQXR0ck1ldGFkYXRhQ21kID0gbmV3IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZF8xW1wiZGVmYXVsdFwiXShhdHRyaWJ1dGUuaWQsIEF0dHJpYnV0ZV8xW1wiZGVmYXVsdFwiXS5RVUFMSUZJRVJfUFJPUEVSVFksIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICBfdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoY2hhbmdlQXR0ck1ldGFkYXRhQ21kLCBudWxsKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFscmVhZHkgaXMgYSBQTSB3aXRoIGlkIFwiICsgbW9kZWwuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhZGRlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5hZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogVHlwZS5BRERFRCwgJ2NsaWVudFByZXNlbnRhdGlvbk1vZGVsJzogbW9kZWwgfSk7XG4gICAgICAgICAgICBhZGRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFkZGVkO1xuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5kZWxldGUobW9kZWwuaWQpO1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZUF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZUF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMudHJpZ2dlcih7ICdldmVudFR5cGUnOiBUeXBlLlJFTU9WRUQsICdjbGllbnRQcmVzZW50YXRpb25Nb2RlbCc6IG1vZGVsIH0pO1xuICAgICAgICAgICAgcmVtb3ZlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQXR0cmlidXRlc0J5RmlsdGVyID0gZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKGF0dHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMucHVzaChhdHRyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaGVzO1xuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLnNldCh0eXBlLCBwcmVzZW50YXRpb25Nb2RlbHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHByZXNlbnRhdGlvbk1vZGVscy5pbmRleE9mKG1vZGVsKSA+IC0xKSkge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsIHx8ICEobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmVzZW50YXRpb25Nb2RlbHMgPSB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWxzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXNlbnRhdGlvbk1vZGVscy5sZW5ndGggPiAtMSkge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnNwbGljZShwcmVzZW50YXRpb25Nb2RlbHMuaW5kZXhPZihtb2RlbCksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVzZW50YXRpb25Nb2RlbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZGVsZXRlKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgaXRlciA9IHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmtleXMoKTtcbiAgICAgICAgdmFyIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgd2hpbGUgKCFuZXh0LmRvbmUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5leHQudmFsdWUpO1xuICAgICAgICAgICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5saXN0UHJlc2VudGF0aW9uTW9kZWxzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMudmFsdWVzKCk7XG4gICAgICAgIHZhciBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHdoaWxlICghbmV4dC5kb25lKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXh0LnZhbHVlKTtcbiAgICAgICAgICAgIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuZ2V0KGlkKTtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIGlmICghdHlwZSB8fCAhdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmhhcyh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAobW9kZWwsIG5vdGlmeSkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKG1vZGVsKTtcbiAgICAgICAgICAgIGlmICghbm90aWZ5IHx8IG1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQobmV3IERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbl8xW1wiZGVmYXVsdFwiXShtb2RlbC5pZCksIG51bGwpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMoaWQpO1xuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgdGhpcy5hdHRyaWJ1dGVzUGVySWQuaGFzKGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5zZXQoYXR0cmlidXRlLmlkLCBhdHRyaWJ1dGUpO1xuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIXRoaXMuYXR0cmlidXRlc1BlcklkLmhhcyhhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQuZGVsZXRlKGF0dHJpYnV0ZS5pZCk7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzUGVySWQuZ2V0KGlkKTtcbiAgICB9O1xuICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmFkZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLnNldChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCksIGF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3BsaWNlKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5kZWxldGUoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChxdWFsaWZpZXIpIHtcbiAgICAgICAgaWYgKCFxdWFsaWZpZXIgfHwgIXRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5oYXMocXVhbGlmaWVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuZ2V0KHF1YWxpZmllcikuc2xpY2UoMCk7IC8vIHNsaWNlIGlzIHVzZWQgdG8gY2xvbmUgdGhlIGFycmF5XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5vbk1vZGVsU3RvcmVDaGFuZ2UgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgfTtcbiAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5vbk1vZGVsU3RvcmVDaGFuZ2VGb3JUeXBlID0gZnVuY3Rpb24gKHByZXNlbnRhdGlvbk1vZGVsVHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KGZ1bmN0aW9uIChwbVN0b3JlRXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChwbVN0b3JlRXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlID09IHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcihwbVN0b3JlRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBDbGllbnRNb2RlbFN0b3JlO1xufSgpKTtcbmV4cG9ydHMuQ2xpZW50TW9kZWxTdG9yZSA9IENsaWVudE1vZGVsU3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNsaWVudE1vZGVsU3RvcmUuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBFdmVudEJ1c18xID0gcmVxdWlyZSgnLi9FdmVudEJ1cycpO1xudmFyIHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCA9IDA7IC8vIHRvZG8gZGs6IGNvbnNpZGVyIG1ha2luZyB0aGlzIHN0YXRpYyBpbiBjbGFzc1xudmFyIENsaWVudFByZXNlbnRhdGlvbk1vZGVsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChpZCwgcHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbFR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3VuZGVmaW5lZCcgJiYgaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pZCA9IChwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQrKykudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRCdXMgPSBuZXcgRXZlbnRCdXNfMVtcImRlZmF1bHRcIl0oKTtcbiAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzXzFbXCJkZWZhdWx0XCJdKCk7XG4gICAgfVxuICAgIC8vIHRvZG8gZGs6IGFsaWduIHdpdGggSmF2YSB2ZXJzaW9uOiBtb3ZlIHRvIENsaWVudERvbHBoaW4gYW5kIGF1dG8tYWRkIHRvIG1vZGVsIHN0b3JlXG4gICAgLyoqIGEgY29weSBjb25zdHJ1Y3RvciBmb3IgYW55dGhpbmcgYnV0IElEcy4gUGVyIGRlZmF1bHQsIGNvcGllcyBhcmUgY2xpZW50IHNpZGUgb25seSwgbm8gYXV0b21hdGljIHVwZGF0ZSBhcHBsaWVzLiAqL1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKG51bGwsIHRoaXMucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgcmVzdWx0LmNsaWVudFNpZGVPbmx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlQ29weSA9IGF0dHJpYnV0ZS5jb3B5KCk7XG4gICAgICAgICAgICByZXN1bHQuYWRkQXR0cmlidXRlKGF0dHJpYnV0ZUNvcHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIC8vYWRkIGFycmF5IG9mIGF0dHJpYnV0ZXNcbiAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuYWRkQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghYXR0cmlidXRlcyB8fCBhdHRyaWJ1dGVzLmxlbmd0aCA8IDEpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgX3RoaXMuYWRkQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICh0aGlzLmF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpID4gLTEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHByb3BlcnR5IG5hbWU6IFwiICsgYXR0cmlidXRlLnByb3BlcnR5TmFtZVxuICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSAmJiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHF1YWxpZmllcjogXCIgKyBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKClcbiAgICAgICAgICAgICAgICArIFwiIGluIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkOiBcIiArIHRoaXMuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZS5zZXRQcmVzZW50YXRpb25Nb2RlbCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgX3RoaXMuaW52YWxpZEJ1cy50cmlnZ2VyKHsgc291cmNlOiBfdGhpcyB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUub25JbnZhbGlkYXRlZCA9IGZ1bmN0aW9uIChoYW5kbGVJbnZhbGlkYXRlKSB7XG4gICAgICAgIHRoaXMuaW52YWxpZEJ1cy5vbkV2ZW50KGhhbmRsZUludmFsaWRhdGUpO1xuICAgIH07XG4gICAgLyoqIHJldHVybnMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBzdGF0ZSAqL1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNsaWNlKDApO1xuICAgIH07XG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmdldEF0ID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKTtcbiAgICB9O1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQWxsQXR0cmlidXRlc0J5UHJvcGVydHlOYW1lID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUucHJvcGVydHlOYW1lID09IHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5hdHRyaWJ1dGVzW2ldLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQXR0cmlidXRlQnlRdWFsaWZpZXIgPSBmdW5jdGlvbiAocXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICghcXVhbGlmaWVyKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmdldFF1YWxpZmllcigpID09IHF1YWxpZmllcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBpZiAoIWlkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLnN5bmNXaXRoID0gZnVuY3Rpb24gKHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VBdHRyaWJ1dGUgPSBzb3VyY2VQcmVzZW50YXRpb25Nb2RlbC5nZXRBdCh0YXJnZXRBdHRyaWJ1dGUucHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc3luY1dpdGgoc291cmNlQXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gQ2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG59KCkpO1xuZXhwb3J0cy5DbGllbnRQcmVzZW50YXRpb25Nb2RlbCA9IENsaWVudFByZXNlbnRhdGlvbk1vZGVsO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DbGllbnRQcmVzZW50YXRpb25Nb2RlbC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENvZGVjID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb2RlYygpIHtcbiAgICB9XG4gICAgQ29kZWMucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uIChjb21tYW5kcykge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29tbWFuZHMpOyAvLyB0b2RvIGRrOiBsb29rIGZvciBwb3NzaWJsZSBBUEkgc3VwcG9ydCBmb3IgY2hhcmFjdGVyIGVuY29kaW5nXG4gICAgfTtcbiAgICBDb2RlYy5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gKHRyYW5zbWl0dGVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdHJhbnNtaXR0ZWQgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRyYW5zbWl0dGVkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc21pdHRlZDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIENvZGVjO1xufSgpKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENvZGVjO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Db2RlYy5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbW1hbmQoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBcImRvbHBoaW4tY29yZS1jb21tYW5kXCI7XG4gICAgfVxuICAgIHJldHVybiBDb21tYW5kO1xufSgpKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbW1hbmQuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBWYWx1ZUNoYW5nZWRDb21tYW5kXzEgPSByZXF1aXJlKCcuL1ZhbHVlQ2hhbmdlZENvbW1hbmQnKTtcbi8qKiBBIEJhdGNoZXIgdGhhdCBkb2VzIG5vIGJhdGNoaW5nIGJ1dCBtZXJlbHkgdGFrZXMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIHF1ZXVlIGFzIHRoZSBzaW5nbGUgaXRlbSBpbiB0aGUgYmF0Y2ggKi9cbnZhciBOb0NvbW1hbmRCYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOb0NvbW1hbmRCYXRjaGVyKCkge1xuICAgIH1cbiAgICBOb0NvbW1hbmRCYXRjaGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uIChxdWV1ZSkge1xuICAgICAgICByZXR1cm4gW3F1ZXVlLnNoaWZ0KCldO1xuICAgIH07XG4gICAgcmV0dXJuIE5vQ29tbWFuZEJhdGNoZXI7XG59KCkpO1xuZXhwb3J0cy5Ob0NvbW1hbmRCYXRjaGVyID0gTm9Db21tYW5kQmF0Y2hlcjtcbi8qKiBBIGJhdGNoZXIgdGhhdCBiYXRjaGVzIHRoZSBibGluZHMgKGNvbW1hbmRzIHdpdGggbm8gY2FsbGJhY2spIGFuZCBvcHRpb25hbGx5IGFsc28gZm9sZHMgdmFsdWUgY2hhbmdlcyAqL1xudmFyIEJsaW5kQ29tbWFuZEJhdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKiBmb2xkaW5nOiB3aGV0aGVyIHdlIHNob3VsZCB0cnkgZm9sZGluZyBWYWx1ZUNoYW5nZWRDb21tYW5kcyAqL1xuICAgIGZ1bmN0aW9uIEJsaW5kQ29tbWFuZEJhdGNoZXIoZm9sZGluZywgbWF4QmF0Y2hTaXplKSB7XG4gICAgICAgIGlmIChmb2xkaW5nID09PSB2b2lkIDApIHsgZm9sZGluZyA9IHRydWU7IH1cbiAgICAgICAgaWYgKG1heEJhdGNoU2l6ZSA9PT0gdm9pZCAwKSB7IG1heEJhdGNoU2l6ZSA9IDUwOyB9XG4gICAgICAgIHRoaXMuZm9sZGluZyA9IGZvbGRpbmc7XG4gICAgICAgIHRoaXMubWF4QmF0Y2hTaXplID0gbWF4QmF0Y2hTaXplO1xuICAgIH1cbiAgICBCbGluZENvbW1hbmRCYXRjaGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uIChxdWV1ZSkge1xuICAgICAgICB2YXIgYmF0Y2ggPSBbXTtcbiAgICAgICAgdmFyIG4gPSBNYXRoLm1pbihxdWV1ZS5sZW5ndGgsIHRoaXMubWF4QmF0Y2hTaXplKTtcbiAgICAgICAgZm9yICh2YXIgY291bnRlciA9IDA7IGNvdW50ZXIgPCBuOyBjb3VudGVyKyspIHtcbiAgICAgICAgICAgIHZhciBjYW5kaWRhdGUgPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9sZGluZyAmJiBjYW5kaWRhdGUuY29tbWFuZCBpbnN0YW5jZW9mIFZhbHVlQ2hhbmdlZENvbW1hbmRfMVtcImRlZmF1bHRcIl0gJiYgKCFjYW5kaWRhdGUuaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBjYW5DbWQgPSBjYW5kaWRhdGUuY29tbWFuZDtcbiAgICAgICAgICAgICAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCAmJiBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kIGluc3RhbmNlb2YgVmFsdWVDaGFuZ2VkQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmF0Y2hDbWQgPSBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuQ21kLmF0dHJpYnV0ZUlkID09IGJhdGNoQ21kLmF0dHJpYnV0ZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaENtZC5uZXdWYWx1ZSA9IGNhbkNtZC5uZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoLnB1c2goY2FuZGlkYXRlKTsgLy8gd2UgY2Fubm90IG1lcmdlLCBzbyBiYXRjaCB0aGUgY2FuZGlkYXRlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJhdGNoLnB1c2goY2FuZGlkYXRlKTsgLy8gd2UgY2Fubm90IG1lcmdlLCBzbyBiYXRjaCB0aGUgY2FuZGlkYXRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZS5oYW5kbGVyIHx8XG4gICAgICAgICAgICAgICAgKGNhbmRpZGF0ZS5jb21tYW5kWydjbGFzc05hbWUnXSA9PSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uRW1wdHlOb3RpZmljYXRpb25cIikgLy8gb3IgdW5rbm93biBjbGllbnQgc2lkZSBlZmZlY3RcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyBsZWF2ZSB0aGUgbG9vcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXRjaDtcbiAgICB9O1xuICAgIHJldHVybiBCbGluZENvbW1hbmRCYXRjaGVyO1xufSgpKTtcbmV4cG9ydHMuQmxpbmRDb21tYW5kQmF0Y2hlciA9IEJsaW5kQ29tbWFuZEJhdGNoZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbW1hbmRCYXRjaGVyLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29tbWFuZENvbnN0YW50cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29tbWFuZENvbnN0YW50cygpIHtcbiAgICB9XG4gICAgQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCA9ICdkb2xwaGluX3BsYXRmb3JtX2ludGVybl8nO1xuICAgIENvbW1hbmRDb25zdGFudHMuQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdpbml0Q2xpZW50Q29udGV4dCc7XG4gICAgQ29tbWFuZENvbnN0YW50cy5ERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdkaXNjb25uZWN0Q2xpZW50Q29udGV4dCc7XG4gICAgQ29tbWFuZENvbnN0YW50cy5DUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX05BTUUgPSBDb21tYW5kQ29uc3RhbnRzLkRPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ3JlZ2lzdGVyQ29udHJvbGxlcic7XG4gICAgQ29tbWFuZENvbnN0YW50cy5ERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9OQU1FID0gQ29tbWFuZENvbnN0YW50cy5ET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdkZXN0cm95Q29udHJvbGxlcic7XG4gICAgQ29tbWFuZENvbnN0YW50cy5DQUxMX0NPTlRST0xMRVJfQUNUSU9OX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnY2FsbENvbnRyb2xsZXJBY3Rpb24nO1xuICAgIENvbW1hbmRDb25zdGFudHMuU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfTkFNRSA9IENvbW1hbmRDb25zdGFudHMuRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnbG9uZ1BvbGwnO1xuICAgIENvbW1hbmRDb25zdGFudHMuSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX05BTUUgPSBDb21tYW5kQ29uc3RhbnRzLkRPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ3JlbGVhc2UnO1xuICAgIHJldHVybiBDb21tYW5kQ29uc3RhbnRzO1xufSgpKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENvbW1hbmRDb25zdGFudHM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbW1hbmRDb25zdGFudHMuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENvbW1hbmRDb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuL0NvbW1hbmRDb25zdGFudHNcIik7XG52YXIgQ3JlYXRlQ29udGV4dENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDcmVhdGVDb250ZXh0Q29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDcmVhdGVDb250ZXh0Q29tbWFuZCgpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaWQgPSBDb21tYW5kQ29uc3RhbnRzXzFbXCJkZWZhdWx0XCJdLkNSRUFURV9DT05URVhUX0NPTU1BTkRfTkFNRTtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcImNvbS5jYW5vby5kb2xwaGluLmltcGwuY29tbWFuZHMuQ3JlYXRlQ29udGV4dENvbW1hbmRcIjtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0ZUNvbnRleHRDb21tYW5kO1xufShDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBDcmVhdGVDb250ZXh0Q29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q3JlYXRlQ29udGV4dENvbW1hbmQuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaWQgPSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCI7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB0aGlzLnBtSWQgPSBwcmVzZW50YXRpb25Nb2RlbC5pZDtcbiAgICAgICAgdGhpcy5wbVR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHZhciBhdHRycyA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgIGF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogYXR0ci5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgaWQ6IGF0dHIuaWQsXG4gICAgICAgICAgICAgICAgcXVhbGlmaWVyOiBhdHRyLmdldFF1YWxpZmllcigpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyLmdldFZhbHVlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbn0oQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24ocG1JZCkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgdGhpcy5pZCA9ICdEZWxldGVkUHJlc2VudGF0aW9uTW9kZWwnO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb25cIjtcbiAgICB9XG4gICAgcmV0dXJuIERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbjtcbn0oQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24uanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIENvbW1hbmRDb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuL0NvbW1hbmRDb25zdGFudHNcIik7XG52YXIgRGVzdHJveUNvbnRleHRDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRGVzdHJveUNvbnRleHRDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIERlc3Ryb3lDb250ZXh0Q29tbWFuZCgpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaWQgPSBDb21tYW5kQ29uc3RhbnRzXzFbXCJkZWZhdWx0XCJdLkRFU1RST1lfQ09OVEVYVF9DT01NQU5EX05BTUU7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJjb20uY2Fub28uZG9scGhpbi5pbXBsLmNvbW1hbmRzLkRlc3Ryb3lDb250ZXh0Q29tbWFuZFwiO1xuICAgIH1cbiAgICByZXR1cm4gRGVzdHJveUNvbnRleHRDb21tYW5kO1xufShDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBEZXN0cm95Q29udGV4dENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURlc3Ryb3lDb250ZXh0Q29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIENsaWVudENvbm5lY3Rvcl8xID0gcmVxdWlyZShcIi4vQ2xpZW50Q29ubmVjdG9yXCIpO1xudmFyIENsaWVudERvbHBoaW5fMSA9IHJlcXVpcmUoXCIuL0NsaWVudERvbHBoaW5cIik7XG52YXIgQ2xpZW50TW9kZWxTdG9yZV8xID0gcmVxdWlyZShcIi4vQ2xpZW50TW9kZWxTdG9yZVwiKTtcbnZhciBIdHRwVHJhbnNtaXR0ZXJfMSA9IHJlcXVpcmUoXCIuL0h0dHBUcmFuc21pdHRlclwiKTtcbnZhciBOb1RyYW5zbWl0dGVyXzEgPSByZXF1aXJlKFwiLi9Ob1RyYW5zbWl0dGVyXCIpO1xudmFyIERvbHBoaW5CdWlsZGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEb2xwaGluQnVpbGRlcigpIHtcbiAgICAgICAgdGhpcy5yZXNldF8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zbGFja01TXyA9IDMwMDtcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemVfID0gNTA7XG4gICAgICAgIHRoaXMuc3VwcG9ydENPUlNfID0gZmFsc2U7XG4gICAgfVxuICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS51cmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHRoaXMudXJsXyA9IHVybDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAocmVzZXQpIHtcbiAgICAgICAgdGhpcy5yZXNldF8gPSByZXNldDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuc2xhY2tNUyA9IGZ1bmN0aW9uIChzbGFja01TKSB7XG4gICAgICAgIHRoaXMuc2xhY2tNU18gPSBzbGFja01TO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5tYXhCYXRjaFNpemUgPSBmdW5jdGlvbiAobWF4QmF0Y2hTaXplKSB7XG4gICAgICAgIHRoaXMubWF4QmF0Y2hTaXplXyA9IG1heEJhdGNoU2l6ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuc3VwcG9ydENPUlMgPSBmdW5jdGlvbiAoc3VwcG9ydENPUlMpIHtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBzdXBwb3J0Q09SUztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKGVycm9ySGFuZGxlcikge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlcl8gPSBlcnJvckhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLmhlYWRlcnNJbmZvID0gZnVuY3Rpb24gKGhlYWRlcnNJbmZvKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm9fID0gaGVhZGVyc0luZm87XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW5Eb2xwaGluIGpzIGZvdW5kXCIpO1xuICAgICAgICB2YXIgY2xpZW50RG9scGhpbiA9IG5ldyBDbGllbnREb2xwaGluXzFbXCJkZWZhdWx0XCJdKCk7XG4gICAgICAgIHZhciB0cmFuc21pdHRlcjtcbiAgICAgICAgaWYgKHRoaXMudXJsXyAhPSBudWxsICYmIHRoaXMudXJsXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBIdHRwVHJhbnNtaXR0ZXJfMVtcImRlZmF1bHRcIl0odGhpcy51cmxfLCB0aGlzLnJlc2V0XywgXCJVVEYtOFwiLCB0aGlzLmVycm9ySGFuZGxlcl8sIHRoaXMuc3VwcG9ydENPUlNfLCB0aGlzLmhlYWRlcnNJbmZvXyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBOb1RyYW5zbWl0dGVyXzFbXCJkZWZhdWx0XCJdKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRDb25uZWN0b3IobmV3IENsaWVudENvbm5lY3Rvcl8xLkNsaWVudENvbm5lY3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgdGhpcy5zbGFja01TXywgdGhpcy5tYXhCYXRjaFNpemVfKSk7XG4gICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50TW9kZWxTdG9yZShuZXcgQ2xpZW50TW9kZWxTdG9yZV8xLkNsaWVudE1vZGVsU3RvcmUoY2xpZW50RG9scGhpbikpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNsaWVudERvbHBoaW4gaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgIHJldHVybiBjbGllbnREb2xwaGluO1xuICAgIH07XG4gICAgcmV0dXJuIERvbHBoaW5CdWlsZGVyO1xufSgpKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IERvbHBoaW5CdWlsZGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Eb2xwaGluQnVpbGRlci5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIEV2ZW50QnVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFdmVudEJ1cygpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzID0gW107XG4gICAgfVxuICAgIEV2ZW50QnVzLnByb3RvdHlwZS5vbkV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMucHVzaChldmVudEhhbmRsZXIpO1xuICAgIH07XG4gICAgRXZlbnRCdXMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkgeyByZXR1cm4gaGFuZGxlKGV2ZW50KTsgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gRXZlbnRCdXM7XG59KCkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXZlbnRCdXM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUV2ZW50QnVzLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ29kZWNfMSA9IHJlcXVpcmUoXCIuL0NvZGVjXCIpO1xudmFyIEh0dHBUcmFuc21pdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSHR0cFRyYW5zbWl0dGVyKHVybCwgcmVzZXQsIGNoYXJzZXQsIGVycm9ySGFuZGxlciwgc3VwcG9ydENPUlMsIGhlYWRlcnNJbmZvKSB7XG4gICAgICAgIGlmIChyZXNldCA9PT0gdm9pZCAwKSB7IHJlc2V0ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoY2hhcnNldCA9PT0gdm9pZCAwKSB7IGNoYXJzZXQgPSBcIlVURi04XCI7IH1cbiAgICAgICAgaWYgKGVycm9ySGFuZGxlciA9PT0gdm9pZCAwKSB7IGVycm9ySGFuZGxlciA9IG51bGw7IH1cbiAgICAgICAgaWYgKHN1cHBvcnRDT1JTID09PSB2b2lkIDApIHsgc3VwcG9ydENPUlMgPSBmYWxzZTsgfVxuICAgICAgICBpZiAoaGVhZGVyc0luZm8gPT09IHZvaWQgMCkgeyBoZWFkZXJzSW5mbyA9IG51bGw7IH1cbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuY2hhcnNldCA9IGNoYXJzZXQ7XG4gICAgICAgIHRoaXMuSHR0cENvZGVzID0ge1xuICAgICAgICAgICAgZmluaXNoZWQ6IDQsXG4gICAgICAgICAgICBzdWNjZXNzOiAyMDBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIgPSBlcnJvckhhbmRsZXI7XG4gICAgICAgIHRoaXMuc3VwcG9ydENPUlMgPSBzdXBwb3J0Q09SUztcbiAgICAgICAgdGhpcy5oZWFkZXJzSW5mbyA9IGhlYWRlcnNJbmZvO1xuICAgICAgICB0aGlzLmh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5zaWcgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgaWYgKHRoaXMuc3VwcG9ydENPUlMpIHtcbiAgICAgICAgICAgIGlmIChcIndpdGhDcmVkZW50aWFsc1wiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaHR0cC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlOyAvLyBOT1RFOiBkb2luZyB0aGlzIGZvciBub24gQ09SUyByZXF1ZXN0cyBoYXMgbm8gaW1wYWN0XG4gICAgICAgICAgICAgICAgdGhpcy5zaWcud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvZGVjID0gbmV3IENvZGVjXzFbXCJkZWZhdWx0XCJdKCk7XG4gICAgICAgIGlmIChyZXNldCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0h0dHBUcmFuc21pdHRlci5pbnZhbGlkYXRlKCkgaXMgZGVwcmVjYXRlZC4gVXNlIENsaWVudERvbHBoaW4ucmVzZXQoT25TdWNjZXNzSGFuZGxlcikgaW5zdGVhZCcpO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS50cmFuc21pdCA9IGZ1bmN0aW9uIChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaHR0cC5vbmVycm9yID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgX3RoaXMuaGFuZGxlRXJyb3IoJ29uZXJyb3InLCBcIlwiKTtcbiAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaHR0cC5yZWFkeVN0YXRlID09IF90aGlzLkh0dHBDb2Rlcy5maW5pc2hlZCkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5odHRwLnN0YXR1cyA9PSBfdGhpcy5IdHRwQ29kZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VUZXh0ID0gX3RoaXMuaHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZVRleHQudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlQ29tbWFuZHMgPSBfdGhpcy5jb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZCBwYXJzaW5nIHJlc3BvbnNlVGV4dDogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiwgcmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogSW5jb3JyZWN0IHJlc3BvbnNlVGV4dDogXCIgKyByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogZW1wdHkgcmVzcG9uc2VUZXh0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICB0aGlzLnNldEhlYWRlcnModGhpcy5odHRwKTtcbiAgICAgICAgaWYgKFwib3ZlcnJpZGVNaW1lVHlwZVwiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgdGhpcy5odHRwLm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVwiICsgdGhpcy5jaGFyc2V0KTsgLy8gdG9kbyBtYWtlIGluamVjdGFibGVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmh0dHAuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgIH07XG4gICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS5zZXRIZWFkZXJzID0gZnVuY3Rpb24gKGh0dHBSZXEpIHtcbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlcnNJbmZvLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcihpLCB0aGlzLmhlYWRlcnNJbmZvW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEh0dHBUcmFuc21pdHRlci5wcm90b3R5cGUuaGFuZGxlRXJyb3IgPSBmdW5jdGlvbiAoa2luZCwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgZXJyb3JFdmVudCA9IHsga2luZDoga2luZCwgdXJsOiB0aGlzLnVybCwgaHR0cFN0YXR1czogdGhpcy5odHRwLnN0YXR1cywgbWVzc2FnZTogbWVzc2FnZSB9O1xuICAgICAgICBpZiAodGhpcy5lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyKGVycm9yRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZDogXCIsIGVycm9yRXZlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLnNpZ25hbCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgIHRoaXMuc2lnLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh0aGlzLnNpZyk7XG4gICAgICAgIHRoaXMuc2lnLnNlbmQodGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRdKSk7XG4gICAgfTtcbiAgICAvLyBEZXByZWNhdGVkICEgVXNlICdyZXNldChPblN1Y2Nlc3NIYW5kbGVyKSBpbnN0ZWFkXG4gICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmh0dHAub3BlbignUE9TVCcsIHRoaXMudXJsICsgJ2ludmFsaWRhdGU/JywgZmFsc2UpO1xuICAgICAgICB0aGlzLmh0dHAuc2VuZCgpO1xuICAgIH07XG4gICAgcmV0dXJuIEh0dHBUcmFuc21pdHRlcjtcbn0oKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIdHRwVHJhbnNtaXR0ZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUh0dHBUcmFuc21pdHRlci5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgU2lnbmFsQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vU2lnbmFsQ29tbWFuZFwiKTtcbnZhciBDb21tYW5kQ29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi9Db21tYW5kQ29uc3RhbnRzXCIpO1xudmFyIEludGVycnVwdExvbmdQb2xsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEludGVycnVwdExvbmdQb2xsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIENvbW1hbmRDb25zdGFudHNfMVtcImRlZmF1bHRcIl0uSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX05BTUUpO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwiY29tLmNhbm9vLmRvbHBoaW4uaW1wbC5jb21tYW5kcy5JbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRcIjtcbiAgICB9XG4gICAgcmV0dXJuIEludGVycnVwdExvbmdQb2xsQ29tbWFuZDtcbn0oU2lnbmFsQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1JbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQSB0cmFuc21pdHRlciB0aGF0IGlzIG5vdCB0cmFuc21pdHRpbmcgYXQgYWxsLlxuICogSXQgbWF5IHNlcnZlIGFzIGEgc3RhbmQtaW4gd2hlbiBubyByZWFsIHRyYW5zbWl0dGVyIGlzIG5lZWRlZC5cbiAqL1xudmFyIE5vVHJhbnNtaXR0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5vVHJhbnNtaXR0ZXIoKSB7XG4gICAgfVxuICAgIE5vVHJhbnNtaXR0ZXIucHJvdG90eXBlLnRyYW5zbWl0ID0gZnVuY3Rpb24gKGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyBzcGVjaWFsXG4gICAgICAgIG9uRG9uZShbXSk7XG4gICAgfTtcbiAgICBOb1RyYW5zbWl0dGVyLnByb3RvdHlwZS5zaWduYWwgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfTtcbiAgICBOb1RyYW5zbWl0dGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIChzdWNjZXNzSGFuZGxlcikge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfTtcbiAgICByZXR1cm4gTm9UcmFuc21pdHRlcjtcbn0oKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBOb1RyYW5zbWl0dGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob1RyYW5zbWl0dGVyLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRG9scGhpbkJ1aWxkZXJfMSA9IHJlcXVpcmUoXCIuL0RvbHBoaW5CdWlsZGVyXCIpO1xudmFyIENyZWF0ZUNvbnRleHRDb21tYW5kXzEgPSByZXF1aXJlKFwiLi9DcmVhdGVDb250ZXh0Q29tbWFuZFwiKTtcbnZhciBEZXN0cm95Q29udGV4dENvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0Rlc3Ryb3lDb250ZXh0Q29tbWFuZFwiKTtcbnZhciBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRfMSA9IHJlcXVpcmUoXCIuL0ludGVycnVwdExvbmdQb2xsQ29tbWFuZFwiKTtcbnZhciBTdGFydExvbmdQb2xsQ29tbWFuZF8xID0gcmVxdWlyZShcIi4vU3RhcnRMb25nUG9sbENvbW1hbmRcIik7XG4vKipcbiAqIEpTLWZyaWVuZGx5IGZhY2FkZSB0byBhdm9pZCB0b28gbWFueSBkZXBlbmRlbmNpZXMgaW4gcGxhaW4gSlMgY29kZS5cbiAqIFRoZSBuYW1lIG9mIHRoaXMgZmlsZSBpcyBhbHNvIHVzZWQgZm9yIHRoZSBpbml0aWFsIGxvb2t1cCBvZiB0aGVcbiAqIG9uZSBqYXZhc2NyaXB0IGZpbGUgdGhhdCBjb250YWlucyBhbGwgdGhlIGRvbHBoaW4gY29kZS5cbiAqIENoYW5naW5nIHRoZSBuYW1lIHJlcXVpcmVzIHRoZSBidWlsZCBzdXBwb3J0IGFuZCBhbGwgdXNlcnNcbiAqIHRvIGJlIHVwZGF0ZWQgYXMgd2VsbC5cbiAqIERpZXJrIEtvZW5pZ1xuICovXG4vLyBmYWN0b3J5IG1ldGhvZCBmb3IgdGhlIGluaXRpYWxpemVkIGRvbHBoaW5cbi8vIERlcHJlY2F0ZWQgISBVc2UgJ21ha2VEb2xwaGluKCkgaW5zdGVhZFxuZnVuY3Rpb24gZG9scGhpbih1cmwsIHJlc2V0LCBzbGFja01TKSB7XG4gICAgaWYgKHNsYWNrTVMgPT09IHZvaWQgMCkgeyBzbGFja01TID0gMzAwOyB9XG4gICAgcmV0dXJuIG1ha2VEb2xwaGluKCkudXJsKHVybCkucmVzZXQocmVzZXQpLnNsYWNrTVMoc2xhY2tNUykuYnVpbGQoKTtcbn1cbmV4cG9ydHMuZG9scGhpbiA9IGRvbHBoaW47XG4vLyBmYWN0b3J5IG1ldGhvZCB0byBidWlsZCBhbiBpbml0aWFsaXplZCBkb2xwaGluXG5mdW5jdGlvbiBtYWtlRG9scGhpbigpIHtcbiAgICByZXR1cm4gbmV3IERvbHBoaW5CdWlsZGVyXzFbXCJkZWZhdWx0XCJdKCk7XG59XG5leHBvcnRzLm1ha2VEb2xwaGluID0gbWFrZURvbHBoaW47XG4vL0ZhY3RvcnkgbWV0aG9kcyB0byBoYXZlIGEgYmV0dGVyIGludGVncmF0aW9uIG9mIHRzIHNvdXJjZXMgaW4gSlMgJiBlczZcbmZ1bmN0aW9uIGNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kKCkge1xuICAgIHJldHVybiBuZXcgQ3JlYXRlQ29udGV4dENvbW1hbmRfMVtcImRlZmF1bHRcIl0oKTtcbn1cbmV4cG9ydHMuY3JlYXRlQ3JlYXRlQ29udGV4dENvbW1hbmQgPSBjcmVhdGVDcmVhdGVDb250ZXh0Q29tbWFuZDtcbmZ1bmN0aW9uIGNyZWF0ZURlc3Ryb3lDb250ZXh0Q29tbWFuZCgpIHtcbiAgICByZXR1cm4gbmV3IERlc3Ryb3lDb250ZXh0Q29tbWFuZF8xW1wiZGVmYXVsdFwiXSgpO1xufVxuZXhwb3J0cy5jcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQgPSBjcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQ7XG5mdW5jdGlvbiBjcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRfMVtcImRlZmF1bHRcIl0oKTtcbn1cbmV4cG9ydHMuY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kID0gY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kO1xuZnVuY3Rpb24gY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgcmV0dXJuIG5ldyBTdGFydExvbmdQb2xsQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSgpO1xufVxuZXhwb3J0cy5jcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZCA9IGNyZWF0ZVN0YXJ0TG9uZ1BvbGxDb21tYW5kO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1PcGVuRG9scGhpbi5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgU2lnbmFsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNpZ25hbENvbW1hbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2lnbmFsQ29tbWFuZChuYW1lKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmlkID0gbmFtZTtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uU2lnbmFsQ29tbWFuZFwiO1xuICAgIH1cbiAgICByZXR1cm4gU2lnbmFsQ29tbWFuZDtcbn0oQ29tbWFuZF8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2lnbmFsQ29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2lnbmFsQ29tbWFuZC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgQ29tbWFuZF8xID0gcmVxdWlyZSgnLi9Db21tYW5kJyk7XG52YXIgQ29tbWFuZENvbnN0YW50c18xID0gcmVxdWlyZShcIi4vQ29tbWFuZENvbnN0YW50c1wiKTtcbnZhciBTdGFydExvbmdQb2xsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFN0YXJ0TG9uZ1BvbGxDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN0YXJ0TG9uZ1BvbGxDb21tYW5kKCkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5pZCA9IENvbW1hbmRDb25zdGFudHNfMVtcImRlZmF1bHRcIl0uU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfTkFNRTtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcImNvbS5jYW5vby5kb2xwaGluLmltcGwuY29tbWFuZHMuU3RhcnRMb25nUG9sbENvbW1hbmRcIjtcbiAgICB9XG4gICAgcmV0dXJuIFN0YXJ0TG9uZ1BvbGxDb21tYW5kO1xufShDb21tYW5kXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTdGFydExvbmdQb2xsQ29tbWFuZDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3RhcnRMb25nUG9sbENvbW1hbmQuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIENvbW1hbmRfMSA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpO1xudmFyIFZhbHVlQ2hhbmdlZENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhWYWx1ZUNoYW5nZWRDb21tYW5kLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFZhbHVlQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlSWQsIG5ld1ZhbHVlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgdGhpcy5pZCA9IFwiVmFsdWVDaGFuZ2VkXCI7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlZhbHVlQ2hhbmdlZENvbW1hbmRcIjtcbiAgICB9XG4gICAgcmV0dXJuIFZhbHVlQ2hhbmdlZENvbW1hbmQ7XG59KENvbW1hbmRfMVtcImRlZmF1bHRcIl0pKTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFZhbHVlQ2hhbmdlZENvbW1hbmQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZhbHVlQ2hhbmdlZENvbW1hbmQuanMubWFwXG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgIE1hcCBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnO1xuaW1wb3J0IHtleGlzdHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZWFuTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoY2xhc3NSZXBvc2l0b3J5KSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlcihjbGFzc1JlcG9zaXRvcnkpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG5cbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgICAgIHRoaXMuYWRkZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMudXBkYXRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmFycmF5VXBkYXRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmFsbEFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxSZW1vdmVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxVcGRhdGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IFtdO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuQWRkZWQoKHR5cGUsIGJlYW4pID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuQWRkZWQtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5BZGRlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKCh0eXBlLCBiZWFuKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbik7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuUmVtb3ZlZC1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuUmVtb3ZlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5VcGRhdGUoKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblVwZGF0ZS1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkFycmF5VXBkYXRlKCh0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpID0+IHtcbiAgICAgICAgICAgIGxldCBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25BcnJheVVwZGF0ZS1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQXJyYXlVcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXG4gICAgfVxuXG5cbiAgICBub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpO1xuICAgIH1cblxuXG4gICAgbm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuICAgICAgICBjaGVja1BhcmFtKGluZGV4LCAnaW5kZXgnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb3VudCwgJ2NvdW50Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocmVtb3ZlZEVsZW1lbnRzLCAncmVtb3ZlZEVsZW1lbnRzJyk7XG5cbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cyk7XG4gICAgfVxuXG5cbiAgICBpc01hbmFnZWQoYmVhbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuaXNNYW5hZ2VkKGJlYW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5pc01hbmFnZWQoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGNyZWF0ZSh0eXBlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5jcmVhdGUodHlwZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmNyZWF0ZSgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgYWRkKHR5cGUsIGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmFkZCh0eXBlLCBiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5hZGQoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGFkZEFsbCh0eXBlLCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGRBbGwodHlwZSwgY29sbGVjdGlvbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbGxlY3Rpb24sICdjb2xsZWN0aW9uJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkQWxsKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmUoYmVhbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlKGJlYW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmUoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZUFsbChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmVBbGwoY29sbGVjdGlvbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb2xsZWN0aW9uLCAnY29sbGVjdGlvbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUFsbCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlSWYocHJlZGljYXRlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmVJZihwcmVkaWNhdGUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJlZGljYXRlLCAncHJlZGljYXRlJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlSWYoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIG9uQWRkZWQodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFkZGVkKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzID0gc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQWRkZWQodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFkZGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWRkZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25SZW1vdmVkKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25SZW1vdmVkKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzID0gc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzID0gc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25SZW1vdmVkKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25CZWFuVXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25CZWFuVXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25CZWFuVXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXJyYXlVcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFycmF5VXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFycmF5VXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgIE1hcCBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnO1xuaW1wb3J0ICogYXMgY29uc3RzIGZyb20gJy4vY29uc3RhbnRzJztcblxuaW1wb3J0IHtleGlzdHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG52YXIgYmxvY2tlZCA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsYXNzUmVwb3NpdG9yeSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihkb2xwaGluKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkoZG9scGhpbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuY2xhc3NlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuRnJvbURvbHBoaW4gPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpbiA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5jbGFzc0luZm9zID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzID0gW107XG4gICAgfVxuXG4gICAgZml4VHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkJZVEU6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5TSE9SVDpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLklOVDpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPTkc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkZMT0FUOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuRE9VQkxFOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkJPT0xFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuICd0cnVlJyA9PT0gU3RyaW5nKHZhbHVlKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuU1RSSU5HOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuRU5VTTpcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnJvbURvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAoIWV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc1JlcG9zaXRvcnkuYmVhbkZyb21Eb2xwaGluLmdldChTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRBVEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQ0FMRU5EQVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlpPTkVEX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZml4VHlwZSh0eXBlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b0RvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAoIWV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc1JlcG9zaXRvcnkuYmVhblRvRG9scGhpbi5nZXQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuREFURTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQ0FMRU5EQVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlpPTkVEX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpeFR5cGUodHlwZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VuZExpc3RTcGxpY2UoY2xhc3NSZXBvc2l0b3J5LCBtb2RlbElkLCBwcm9wZXJ0eU5hbWUsIGZyb20sIHRvLCBuZXdFbGVtZW50cykge1xuICAgICAgICBsZXQgZG9scGhpbiA9IGNsYXNzUmVwb3NpdG9yeS5kb2xwaGluO1xuICAgICAgICBsZXQgbW9kZWwgPSBkb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQobW9kZWxJZCk7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc0luZm8gPSBjbGFzc1JlcG9zaXRvcnkuY2xhc3Nlcy5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgIGxldCB0eXBlID0gY2xhc3NJbmZvW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHR5cGUpKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ0BAQCBTT1VSQ0VfU1lTVEVNIEBAQCcsIG51bGwsICdjbGllbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3NvdXJjZScsIG51bGwsIG1vZGVsSWQpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnYXR0cmlidXRlJywgbnVsbCwgcHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2Zyb20nLCBudWxsLCBmcm9tKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3RvJywgbnVsbCwgdG8pLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnY291bnQnLCBudWxsLCBuZXdFbGVtZW50cy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBuZXdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goZG9scGhpbi5hdHRyaWJ1dGUoaW5kZXgudG9TdHJpbmcoKSwgbnVsbCwgc2VsZi50b0RvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCBlbGVtZW50KSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoZG9scGhpbiwgW251bGwsICdARFA6TFNAJ10uY29uY2F0KGF0dHJpYnV0ZXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhbGlkYXRlTGlzdChjbGFzc1JlcG9zaXRvcnksIHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBsZXQgbGlzdCA9IGJlYW5bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKCFleGlzdHMobGlzdCkpIHtcbiAgICAgICAgICAgIGNsYXNzUmVwb3NpdG9yeS5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgW10sIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBibG9jayhiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKGV4aXN0cyhibG9ja2VkKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gY3JlYXRlIGEgYmxvY2sgd2hpbGUgYW5vdGhlciBibG9jayBleGlzdHMnKTtcbiAgICAgICAgfVxuICAgICAgICBibG9ja2VkID0ge1xuICAgICAgICAgICAgYmVhbjogYmVhbixcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaXNCbG9ja2VkKGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgICAgICByZXR1cm4gZXhpc3RzKGJsb2NrZWQpICYmIGJsb2NrZWQuYmVhbiA9PT0gYmVhbiAmJiBibG9ja2VkLnByb3BlcnR5TmFtZSA9PT0gcHJvcGVydHlOYW1lO1xuICAgIH1cblxuICAgIHVuYmxvY2soKSB7XG4gICAgICAgIGJsb2NrZWQgPSBudWxsO1xuICAgIH1cblxuICAgIG5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuXG4gICAgICAgIGxldCBtb2RlbElkID0gdGhpcy5iZWFuVG9Eb2xwaGluLmdldChiZWFuKTtcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbElkKSkge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy5kb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQobW9kZWxJZCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKG1vZGVsKSkge1xuICAgICAgICAgICAgICAgIGxldCBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBjbGFzc0luZm9bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyh0eXBlKSAmJiBleGlzdHMoYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBhdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLnNldFZhbHVlKHRoaXMudG9Eb2xwaGluKHRoaXMsIHR5cGUsIG5ld1ZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb21Eb2xwaGluKHRoaXMsIHR5cGUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgICAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuICAgICAgICBjaGVja1BhcmFtKGluZGV4LCAnaW5kZXgnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb3VudCwgJ2NvdW50Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocmVtb3ZlZEVsZW1lbnRzLCAncmVtb3ZlZEVsZW1lbnRzJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNCbG9ja2VkKGJlYW4sIHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgICAgIGxldCBhcnJheSA9IGJlYW5bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbElkKSAmJiBleGlzdHMoYXJyYXkpKSB7XG4gICAgICAgICAgICBsZXQgcmVtb3ZlZEVsZW1lbnRzQ291bnQgPSBBcnJheS5pc0FycmF5KHJlbW92ZWRFbGVtZW50cykgPyByZW1vdmVkRWxlbWVudHMubGVuZ3RoIDogMDtcbiAgICAgICAgICAgIHRoaXMuc2VuZExpc3RTcGxpY2UodGhpcywgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBpbmRleCwgaW5kZXggKyByZW1vdmVkRWxlbWVudHNDb3VudCwgYXJyYXkuc2xpY2UoaW5kZXgsIGluZGV4ICsgY291bnQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQmVhbkFkZGVkKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5BZGRlZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbkJlYW5SZW1vdmVkKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25CZWFuVXBkYXRlKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5VcGRhdGUoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbkFycmF5VXBkYXRlKGhhbmRsZXIpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkFycmF5VXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJDbGFzcyhtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIGlmICh0aGlzLmNsYXNzZXMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNsYXNzSW5mbyA9IHt9O1xuICAgICAgICBtb2RlbC5hdHRyaWJ1dGVzLmZpbHRlcihmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwO1xuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3Nlcy5zZXQobW9kZWwuaWQsIGNsYXNzSW5mbyk7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckNsYXNzKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkudW5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcbiAgICAgICAgdGhpcy5jbGFzc2VzWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgfVxuXG4gICAgbG9hZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LmxvYWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGNsYXNzSW5mbyA9IHRoaXMuY2xhc3Nlcy5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgdmFyIGJlYW4gPSB7fTtcbiAgICAgICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIChhdHRyaWJ1dGUucHJvcGVydHlOYW1lLnNlYXJjaCgvXkAvKSA8IDApO1xuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGJlYW5bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Lm9sZFZhbHVlICE9PSBldmVudC5uZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBzZWxmLmZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQub2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBzZWxmLmZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQubmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbiwgYXR0cmlidXRlLnByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5iZWFuRnJvbURvbHBoaW4uc2V0KG1vZGVsLmlkLCBiZWFuKTtcbiAgICAgICAgdGhpcy5iZWFuVG9Eb2xwaGluLnNldChiZWFuLCBtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuY2xhc3NJbmZvcy5zZXQobW9kZWwuaWQsIGNsYXNzSW5mbyk7XG4gICAgICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5BZGRlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYmVhbjtcbiAgICB9XG5cbiAgICB1bmxvYWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIGxldCBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5iZWFuRnJvbURvbHBoaW5bJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5iZWFuVG9Eb2xwaGluWydkZWxldGUnXShiZWFuKTtcbiAgICAgICAgdGhpcy5jbGFzc0luZm9zWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgICAgIGlmIChleGlzdHMoYmVhbikpIHtcbiAgICAgICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5SZW1vdmVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmVhbjtcbiAgICB9XG5cbiAgICBzcGxpY2VMaXN0RW50cnkobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5zcGxpY2VMaXN0RW50cnkobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIGxldCBzb3VyY2UgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3NvdXJjZScpO1xuICAgICAgICBsZXQgYXR0cmlidXRlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdhdHRyaWJ1dGUnKTtcbiAgICAgICAgbGV0IGZyb20gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2Zyb20nKTtcbiAgICAgICAgbGV0IHRvID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCd0bycpO1xuICAgICAgICBsZXQgY291bnQgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2NvdW50Jyk7XG5cbiAgICAgICAgaWYgKGV4aXN0cyhzb3VyY2UpICYmIGV4aXN0cyhhdHRyaWJ1dGUpICYmIGV4aXN0cyhmcm9tKSAmJiBleGlzdHModG8pICYmIGV4aXN0cyhjb3VudCkpIHtcbiAgICAgICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzSW5mb3MuZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgICAgICB2YXIgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhiZWFuKSAmJiBleGlzdHMoY2xhc3NJbmZvKSkge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgICAgIC8vdmFyIGVudHJ5ID0gZnJvbURvbHBoaW4odGhpcywgY2xhc3NJbmZvW2F0dHJpYnV0ZS52YWx1ZV0sIGVsZW1lbnQudmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVMaXN0KHRoaXMsIHR5cGUsIGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0VsZW1lbnRzID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQudmFsdWU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKGkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZXhpc3RzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdFbGVtZW50cy5wdXNoKHRoaXMuZnJvbURvbHBoaW4odGhpcywgY2xhc3NJbmZvW2F0dHJpYnV0ZS52YWx1ZV0sIGVsZW1lbnQudmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9jayhiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHR5cGUsIGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSwgZnJvbS52YWx1ZSwgdG8udmFsdWUgLSBmcm9tLnZhbHVlLCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkFycmF5VXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZC4gU291cmNlIGJlYW4gdW5rbm93bi5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcFBhcmFtVG9Eb2xwaGluKHBhcmFtKSB7XG4gICAgICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0eXBlID0gdHlwZW9mIHBhcmFtO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW0udG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5iZWFuVG9Eb2xwaGluLmdldChwYXJhbSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25seSBtYW5hZ2VkIERvbHBoaW4gQmVhbnMgY2FuIGJlIHVzZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBhbmQgcHJpbWl0aXZlIHR5cGVzIGNhbiBiZSB1c2VkXCIpO1xuICAgIH1cblxuICAgIG1hcERvbHBoaW5Ub0JlYW4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbURvbHBoaW4odGhpcywgY29uc3RzLkRPTFBISU5fQkVBTiwgdmFsdWUpO1xuICAgIH1cbn1cbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuLyogZ2xvYmFsIGV4cG9ydHMgKi9cblwidXNlIHN0cmljdFwiO1xuaW1wb3J0IE9wZW5Eb2xwaGluIGZyb20gJy4uL29wZW5kb2xwaGluL2J1aWxkL09wZW5Eb2xwaGluLmpzJztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBDb25uZWN0b3IgZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IEJlYW5NYW5hZ2VyIGZyb20gJy4vYmVhbm1hbmFnZXIuanMnO1xuaW1wb3J0IENsYXNzUmVwb3NpdG9yeSBmcm9tICcuL2NsYXNzcmVwby5qcyc7XG5pbXBvcnQgQ29udHJvbGxlck1hbmFnZXIgZnJvbSAnLi9jb250cm9sbGVybWFuYWdlci5qcyc7XG5pbXBvcnQgQ2xpZW50Q29udGV4dCBmcm9tICcuL2NsaWVudGNvbnRleHQuanMnO1xuaW1wb3J0IFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyIGZyb20gJy4vcGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250ZXh0RmFjdG9yeXtcblxuICAgIGNyZWF0ZSh1cmwsIGNvbmZpZyl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdjb25uZWN0KHVybCwgY29uZmlnKScpO1xuICAgICAgICBjaGVja1BhcmFtKHVybCwgJ3VybCcpO1xuICAgICAgICBjb25zb2xlLmxvZygnQ3JlYXRpbmcgY2xpZW50IGNvbnRleHQgJysgdXJsICsnICAgICcrIEpTT04uc3RyaW5naWZ5KGNvbmZpZykpO1xuXG4gICAgICAgIGxldCBidWlsZGVyID0gT3BlbkRvbHBoaW4ubWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChmYWxzZSkuc2xhY2tNUyg0KS5zdXBwb3J0Q09SUyh0cnVlKS5tYXhCYXRjaFNpemUoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpO1xuICAgICAgICBpZiAoZXhpc3RzKGNvbmZpZykpIHtcbiAgICAgICAgICAgIGlmIChleGlzdHMoY29uZmlnLmVycm9ySGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmVycm9ySGFuZGxlcihjb25maWcuZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleGlzdHMoY29uZmlnLmhlYWRlcnNJbmZvKSAmJiBPYmplY3Qua2V5cyhjb25maWcuaGVhZGVyc0luZm8pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmhlYWRlcnNJbmZvKGNvbmZpZy5oZWFkZXJzSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZG9scGhpbiA9IGJ1aWxkZXIuYnVpbGQoKTtcblxuICAgICAgICB2YXIgdHJhbnNtaXR0ZXIgPSBuZXcgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIodXJsLCBjb25maWcpO1xuICAgICAgICB0cmFuc21pdHRlci5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNsaWVudENvbnRleHQuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2xwaGluLmNsaWVudENvbm5lY3Rvci50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuXG4gICAgICAgIHZhciBjbGFzc1JlcG9zaXRvcnkgPSBuZXcgQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pO1xuICAgICAgICB2YXIgYmVhbk1hbmFnZXIgPSBuZXcgQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KTtcbiAgICAgICAgdmFyIGNvbm5lY3RvciA9IG5ldyBDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyk7XG4gICAgICAgIHZhciBjb250cm9sbGVyTWFuYWdlciA9IG5ldyBDb250cm9sbGVyTWFuYWdlcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3Rvcik7XG5cbiAgICAgICAgdmFyIGNsaWVudENvbnRleHQgPSBuZXcgQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3Rvcik7XG4gICAgICAgIHJldHVybiBjbGllbnRDb250ZXh0O1xuICAgIH1cbn1cblxuZXhwb3J0cy5DbGllbnRDb250ZXh0RmFjdG9yeSA9IENsaWVudENvbnRleHRGYWN0b3J5O1xuXG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgT3BlbkRvbHBoaW4gZnJvbSAnLi4vb3BlbmRvbHBoaW4vYnVpbGQvT3BlbkRvbHBoaW4uanMnO1xuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZW1pdHRlci1jb21wb25lbnQnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENvbnRleHR7XG5cbiAgICBjb25zdHJ1Y3Rvcihkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3Rvcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKScpO1xuICAgICAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbk1hbmFnZXIsICdiZWFuTWFuYWdlcicpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJNYW5hZ2VyLCAnY29udHJvbGxlck1hbmFnZXInKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb25uZWN0b3IsICdjb25uZWN0b3InKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmJlYW5NYW5hZ2VyID0gYmVhbk1hbmFnZXI7XG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJNYW5hZ2VyID0gY29udHJvbGxlck1hbmFnZXI7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3RvciA9IGNvbm5lY3RvcjtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuY29ubmVjdCgpO1xuICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmludm9rZShPcGVuRG9scGhpbi5jcmVhdGVDcmVhdGVDb250ZXh0Q29tbWFuZCgpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlO1xuICAgIH1cblxuICAgIG9uQ29ubmVjdCgpe1xuICAgICAgICBpZihleGlzdHModGhpcy5jb25uZWN0aW9uUHJvbWlzZSkpe1xuICAgICAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVDb250cm9sbGVyKG5hbWUpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xpZW50Q29udGV4dC5jcmVhdGVDb250cm9sbGVyKG5hbWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fY29udHJvbGxlck1hbmFnZXIuY3JlYXRlQ29udHJvbGxlcihuYW1lKTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0KCl7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kb2xwaGluLnN0b3BQdXNoTGlzdGVuaW5nKCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fY29udHJvbGxlck1hbmFnZXIuZGVzdHJveSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5pbnZva2UoT3BlbkRvbHBoaW4uY3JlYXRlRGVzdHJveUNvbnRleHRDb21tYW5kKCkpO1xuICAgICAgICAgICAgICAgIHNlbGYuZG9scGhpbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5iZWFuTWFuYWdlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29udHJvbGxlck1hbmFnZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3RvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuRW1pdHRlcihDbGllbnRDb250ZXh0LnByb3RvdHlwZSk7IiwiLyogQ29weXJpZ2h0IDIwMTYgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblxuXG5pbXBvcnQgeyBleGlzdHMgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZWN7XG5cbiAgICBzdGF0aWMgZW5jb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwJzogY29tbWFuZC5wbUlkLFxuICAgICAgICAgICAgJ3QnOiBjb21tYW5kLnBtVHlwZSxcbiAgICAgICAgICAgICdhJzogY29tbWFuZC5hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ24nOiBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICAnaSc6IGF0dHJpYnV0ZS5pZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhhdHRyaWJ1dGUudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC52ID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAnaWQnOiAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGRlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnaWQnOiAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnLFxuICAgICAgICAgICAgJ2NsYXNzTmFtZSc6IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIixcbiAgICAgICAgICAgICdjbGllbnRTaWRlT25seSc6IGZhbHNlLFxuICAgICAgICAgICAgJ3BtSWQnOiBjb21tYW5kLnAsXG4gICAgICAgICAgICAncG1UeXBlJzogY29tbWFuZC50LFxuICAgICAgICAgICAgJ2F0dHJpYnV0ZXMnOiBjb21tYW5kLmEubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlOYW1lJzogYXR0cmlidXRlLm4sXG4gICAgICAgICAgICAgICAgICAgICdpZCc6IGF0dHJpYnV0ZS5pLFxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBleGlzdHMoYXR0cmlidXRlLnYpPyBhdHRyaWJ1dGUudiA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICdxdWFsaWZpZXInOiBudWxsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGVuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgICAgJ2EnOiBjb21tYW5kLmF0dHJpYnV0ZUlkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChleGlzdHMoY29tbWFuZC5vbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5vID0gY29tbWFuZC5vbGRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhpc3RzKGNvbW1hbmQubmV3VmFsdWUpKSB7XG4gICAgICAgICAgICByZXN1bHQubiA9IGNvbW1hbmQubmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmlkID0gJ1ZhbHVlQ2hhbmdlZCc7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ2lkJzogJ1ZhbHVlQ2hhbmdlZCcsXG4gICAgICAgICAgICAnY2xhc3NOYW1lJzogXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlZhbHVlQ2hhbmdlZENvbW1hbmRcIixcbiAgICAgICAgICAgICdhdHRyaWJ1dGVJZCc6IGNvbW1hbmQuYSxcbiAgICAgICAgICAgICdvbGRWYWx1ZSc6IGV4aXN0cyhjb21tYW5kLm8pPyBjb21tYW5kLm8gOiBudWxsLFxuICAgICAgICAgICAgJ25ld1ZhbHVlJzogZXhpc3RzKGNvbW1hbmQubik/IGNvbW1hbmQubiA6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZW5jb2RlKGNvbW1hbmRzKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGNvbW1hbmRzLm1hcCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09ICdWYWx1ZUNoYW5nZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlY29kZSh0cmFuc21pdHRlZCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICh0eXBlb2YgdHJhbnNtaXR0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0cmFuc21pdHRlZCkubWFwKGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVjb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gJ1ZhbHVlQ2hhbmdlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc21pdHRlZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9jb21tYW5kcy9kZXN0cm95Q29udHJvbGxlckNvbW1hbmQuanMnO1xuaW1wb3J0IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vY29tbWFuZHMvY3JlYXRlQ29udHJvbGxlckNvbW1hbmQuanMnO1xuaW1wb3J0IENhbGxBY3Rpb25Db21tYW5kIGZyb20gJy4vY29tbWFuZHMvY2FsbEFjdGlvbkNvbW1hbmQuanMnO1xuXG5leHBvcnQgY2xhc3MgQ29tbWFuZEZhY3Rvcnkge1xuXG4gICAgc3RhdGljIGNyZWF0ZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVySWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlcklkKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDYWxsQWN0aW9uQ29tbWFuZChjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gbmV3IENhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKTtcbiAgICB9XG59IiwiaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGxBY3Rpb25Db21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVDb250cm9sbGVyQ29tbWFuZC5pbnZva2UoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcmlkLCAnY29udHJvbGxlcmlkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICB0aGlzLmlkID0gJ0NhbGxBY3Rpb24nO1xuICAgICAgICB0aGlzLmMgPSBjb250cm9sbGVyaWQ7XG4gICAgICAgIHRoaXMubiA9IGFjdGlvbk5hbWU7XG4gICAgICAgIHRoaXMucCA9IHBhcmFtcztcbiAgICB9XG5cbn0iLCJpbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQuaW52b2tlKGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck5hbWUsICdjb250cm9sbGVyTmFtZScpO1xuXG4gICAgICAgIHRoaXMuaWQgPSAnQ3JlYXRlQ29udHJvbGxlcic7XG4gICAgICAgIHRoaXMubiA9IGNvbnRyb2xsZXJOYW1lO1xuICAgICAgICB0aGlzLnAgPSBwYXJlbnRDb250cm9sbGVySWQ7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVySWQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG5cbiAgICAgICAgdGhpcy5pZCA9ICdEZXN0cm95Q29udHJvbGxlcic7XG4gICAgICAgIHRoaXMuYyA9IGNvbnRyb2xsZXJJZDtcbiAgICB9XG5cbn0iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgT3BlbkRvbHBoaW4gZnJvbSAnLi4vb3BlbmRvbHBoaW4vYnVpbGQvT3BlbkRvbHBoaW4uanMnO1xuXG5pbXBvcnQgUHJvbWlzZSBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlJztcbmltcG9ydCBDbGllbnRNb2RlbFN0b3JlIGZyb20gJy4uL29wZW5kb2xwaGluL2J1aWxkL0NsaWVudE1vZGVsU3RvcmUnO1xuaW1wb3J0IHtleGlzdHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBET0xQSElOX0JFQU4gPSAnQEBAIERPTFBISU5fQkVBTiBAQEAnO1xuY29uc3QgQUNUSU9OX0NBTExfQkVBTiA9ICdAQEAgQ09OVFJPTExFUl9BQ1RJT05fQ0FMTF9CRUFOIEBAQCc7XG5jb25zdCBISUdITEFOREVSX0JFQU4gPSAnQEBAIEhJR0hMQU5ERVJfQkVBTiBAQEAnO1xuY29uc3QgRE9MUEhJTl9MSVNUX1NQTElDRSA9ICdARFA6TFNAJztcbmNvbnN0IFNPVVJDRV9TWVNURU0gPSAnQEBAIFNPVVJDRV9TWVNURU0gQEBAJztcbmNvbnN0IFNPVVJDRV9TWVNURU1fQ0xJRU5UID0gJ2NsaWVudCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNX1NFUlZFUiA9ICdzZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0b3J7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh1cmwsICd1cmwnKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgc2VsZi5oaWdobGFuZGVyUE1SZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLm9uTW9kZWxTdG9yZUNoYW5nZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IGV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICAgICAgbGV0IHNvdXJjZVN5c3RlbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShTT1VSQ0VfU1lTVEVNKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoc291cmNlU3lzdGVtKSAmJiBzb3VyY2VTeXN0ZW0udmFsdWUgPT09IFNPVVJDRV9TWVNURU1fU0VSVkVSKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmV2ZW50VHlwZSA9PT0gQ2xpZW50TW9kZWxTdG9yZS5UeXBlLkFEREVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYub25Nb2RlbEFkZGVkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmV2ZW50VHlwZSA9PT0gQ2xpZW50TW9kZWxTdG9yZS5UeXBlLlJFTU9WRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsUmVtb3ZlZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoYXQuZG9scGhpbi5zdGFydFB1c2hMaXN0ZW5pbmcoT3BlbkRvbHBoaW4uY3JlYXRlU3RhcnRMb25nUG9sbENvbW1hbmQoKSwgT3BlbkRvbHBoaW4uY3JlYXRlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKCkpO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICBvbk1vZGVsQWRkZWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5vbk1vZGVsQWRkZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQUNUSU9OX0NBTExfQkVBTjpcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBISUdITEFOREVSX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlcihtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW9kZWxSZW1vdmVkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3Iub25Nb2RlbFJlbW92ZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0xJU1RfU1BMSUNFOlxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGludm9rZShjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IuaW52b2tlKGNvbW1hbmQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgJ2NvbW1hbmQnKTtcblxuICAgICAgICB2YXIgZG9scGhpbiA9IHRoaXMuZG9scGhpbjtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBkb2xwaGluLnNlbmQoY29tbWFuZCwge1xuICAgICAgICAgICAgICAgIG9uRmluaXNoZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRIaWdobGFuZGVyUE0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2U7XG4gICAgfVxufVxuXG5leHBvcnRzLlNPVVJDRV9TWVNURU0gPSBTT1VSQ0VfU1lTVEVNO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX0NMSUVOVCA9IFNPVVJDRV9TWVNURU1fQ0xJRU5UO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX1NFUlZFUiA9IFNPVVJDRV9TWVNURU1fU0VSVkVSO1xuZXhwb3J0cy5BQ1RJT05fQ0FMTF9CRUFOID0gQUNUSU9OX0NBTExfQkVBTjtcbiIsImV4cG9ydCBjb25zdCBET0xQSElOX0JFQU4gPSAwO1xuZXhwb3J0IGNvbnN0IEJZVEUgPSAxO1xuZXhwb3J0IGNvbnN0IFNIT1JUID0gMjtcbmV4cG9ydCBjb25zdCBJTlQgPSAzO1xuZXhwb3J0IGNvbnN0IExPTkcgPSA0O1xuZXhwb3J0IGNvbnN0IEZMT0FUID0gNTtcbmV4cG9ydCBjb25zdCBET1VCTEUgPSA2O1xuZXhwb3J0IGNvbnN0IEJPT0xFQU4gPSA3O1xuZXhwb3J0IGNvbnN0IFNUUklORyA9IDg7XG5leHBvcnQgY29uc3QgREFURSA9IDk7XG5leHBvcnQgY29uc3QgRU5VTSA9IDEwO1xuZXhwb3J0IGNvbnN0IENBTEVOREFSID0gMTE7XG5leHBvcnQgY29uc3QgTE9DQUxfREFURV9GSUVMRF9UWVBFID0gNTU7XG5leHBvcnQgY29uc3QgTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEUgPSA1MjtcbmV4cG9ydCBjb25zdCBaT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRSA9IDU0OyIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBQcm9taXNlIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IFNldCBmcm9tJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmltcG9ydCBDb250cm9sbGVyUHJveHkgZnJvbSAnLi9jb250cm9sbGVycHJveHkuanMnO1xuXG5pbXBvcnQge0NvbW1hbmRGYWN0b3J5fSBmcm9tICcuL2NvbW1hbmRGYWN0b3J5LmpzJztcblxuXG5pbXBvcnQgeyBTT1VSQ0VfU1lTVEVNIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IHsgU09VUkNFX1NZU1RFTV9DTElFTlQgfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgeyBBQ1RJT05fQ0FMTF9CRUFOIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuXG5jb25zdCBDT05UUk9MTEVSX0lEID0gJ2NvbnRyb2xsZXJJZCc7XG5jb25zdCBNT0RFTCA9ICdtb2RlbCc7XG5jb25zdCBFUlJPUl9DT0RFID0gJ2Vycm9yQ29kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJNYW5hZ2Vye1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3Ipe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb25uZWN0b3IsICdjb25uZWN0b3InKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVDb250cm9sbGVyKG5hbWUsIG51bGwpXG4gICAgfVxuXG4gICAgX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBjb250cm9sbGVySWQsIG1vZGVsSWQsIG1vZGVsLCBjb250cm9sbGVyO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChuYW1lLCBwYXJlbnRDb250cm9sbGVySWQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcklkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbElkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShNT0RFTCkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBEb2xwaGluVG9CZWFuKG1vZGVsSWQpO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250cm9sbGVycy5hZGQoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW52b2tlQWN0aW9uKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5pbnZva2VBY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PntcblxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShTT1VSQ0VfU1lTVEVNLCBudWxsLCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCksXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShFUlJPUl9DT0RFKVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgbGV0IHBtID0gc2VsZi5kb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KHNlbGYuZG9scGhpbiwgW251bGwsIEFDVElPTl9DQUxMX0JFQU5dLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG5cbiAgICAgICAgICAgIGxldCBhY3Rpb25QYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGlmKGV4aXN0cyhwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkocGFyYW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBQYXJhbVRvRG9scGhpbihwYXJhbXNbcGFyYW1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblBhcmFtcy5wdXNoKHtuOiBwYXJhbSwgdjogdmFsdWV9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgYWN0aW9uUGFyYW1zKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGlzRXJyb3IgPSBwbS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoRVJST1JfQ09ERSkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiQ29udHJvbGxlckFjdGlvbiBjYXVzZWQgYW4gZXJyb3JcIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKHBtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5kZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXIsICdjb250cm9sbGVyJyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udHJvbGxlcnMuZGVsZXRlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgICAgIGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9JRCkuc2V0VmFsdWUoY29udHJvbGxlci5jb250cm9sbGVySWQpO1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlci5nZXRJZCgpKSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBsZXQgY29udHJvbGxlcnNDb3B5ID0gdGhpcy5jb250cm9sbGVycztcbiAgICAgICAgbGV0IHByb21pc2VzID0gW107XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGNvbnRyb2xsZXJzQ29weS5mb3JFYWNoKChjb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goY29udHJvbGxlci5kZXN0cm95KCkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG59XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgU2V0IGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJQcm94eXtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5KGNvbnRyb2xsZXJJZCwgbW9kZWwsIG1hbmFnZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBjaGVja1BhcmFtKG1hbmFnZXIsICdtYW5hZ2VyJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVySWQgPSBjb250cm9sbGVySWQ7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIGdldE1vZGVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbDtcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcklkO1xuICAgIH1cblxuICAgIGludm9rZShuYW1lLCBwYXJhbXMpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lmludm9rZShuYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRyb2xsZXIgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5pbnZva2VBY3Rpb24odGhpcy5jb250cm9sbGVySWQsIG5hbWUsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgdGhpcy5nZXRJZCgpKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCl7XG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uRGVzdHJveWVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuZGVzdHJveUNvbnRyb2xsZXIodGhpcyk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95ZWQoaGFuZGxlcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkub25EZXN0cm95ZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbkRlc3Ryb3llZEhhbmRsZXJzLmRlbGV0ZShoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRG9scGhpblJlbW90aW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnUmVtb3RpbmcgRXJyb3InLCBkZXRhaWwpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLmRldGFpbCA9IGRldGFpbCB8fCB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvbHBoaW5TZXNzaW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnU2Vzc2lvbiBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cFJlc3BvbnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnSHR0cCBSZXNwb25zZSBFcnJvcicpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSHR0cE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ0h0dHAgTmV0d29yayBFcnJvcicpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgfVxufSIsIi8qIENvcHlyaWdodCAyMDE2IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgRW1pdHRlciBmcm9tICdlbWl0dGVyLWNvbXBvbmVudCc7XG5cblxuaW1wb3J0IHsgZXhpc3RzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBEb2xwaGluUmVtb3RpbmdFcnJvciwgSHR0cE5ldHdvcmtFcnJvciwgRG9scGhpblNlc3Npb25FcnJvciwgSHR0cFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuL2Vycm9ycy5qcyc7XG5pbXBvcnQgQ29kZWMgZnJvbSAnLi9jb2RlYy5qcyc7XG5pbXBvcnQgUmVtb3RpbmdFcnJvckhhbmRsZXIgZnJvbSAnLi9yZW1vdGluZ0Vycm9ySGFuZGxlcic7XG5cblxuY29uc3QgRklOSVNIRUQgPSA0O1xuY29uc3QgU1VDQ0VTUyA9IDIwMDtcbmNvbnN0IFJFUVVFU1RfVElNRU9VVCA9IDQwODtcblxuY29uc3QgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbmNvbnN0IENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnZG9scGhpbkNsaWVudElkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IodXJsLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvID0gZXhpc3RzKGNvbmZpZykgPyBjb25maWcuaGVhZGVyc0luZm8gOiBudWxsO1xuICAgICAgICBsZXQgY29ubmVjdGlvbkNvbmZpZyA9IGV4aXN0cyhjb25maWcpID8gY29uZmlnLmNvbm5lY3Rpb24gOiBudWxsO1xuICAgICAgICB0aGlzLm1heFJldHJ5ID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLm1heFJldHJ5KT9jb25uZWN0aW9uQ29uZmlnLm1heFJldHJ5OiAzO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcudGltZW91dCk/Y29ubmVjdGlvbkNvbmZpZy50aW1lb3V0OiA1MDAwO1xuICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gMDtcbiAgICB9XG5cbiAgICBfaGFuZGxlRXJyb3IocmVqZWN0LCBlcnJvcikge1xuICAgICAgICBsZXQgY29ubmVjdGlvbkNvbmZpZyA9IGV4aXN0cyh0aGlzLmNvbmZpZykgPyB0aGlzLmNvbmZpZy5jb25uZWN0aW9uIDogbnVsbDtcbiAgICAgICAgbGV0IGVycm9ySGFuZGxlcnMgPSBleGlzdHMoY29ubmVjdGlvbkNvbmZpZykgJiYgZXhpc3RzKGNvbm5lY3Rpb25Db25maWcuZXJyb3JIYW5kbGVycyk/Y29ubmVjdGlvbkNvbmZpZy5lcnJvckhhbmRsZXJzOiBbbmV3IFJlbW90aW5nRXJyb3JIYW5kbGVyKCldO1xuICAgICAgICBlcnJvckhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlci5vbkVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfVxuXG4gICAgX3NlbmQoY29tbWFuZHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgIGh0dHAub25lcnJvciA9IChlcnJvckNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwTmV0d29ya0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogTmV0d29yayBlcnJvcicsIGVycm9yQ29udGVudCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaHR0cC5yZWFkeVN0YXRlID09PSBGSU5JU0hFRCl7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaHR0cC5zdGF0dXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBTVUNDRVNTOlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDbGllbnRJZCA9IGh0dHAuZ2V0UmVzcG9uc2VIZWFkZXIoQ0xJRU5UX0lEX0hUVFBfSEVBREVSX05BTUUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoY3VycmVudENsaWVudElkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpICYmIHRoaXMuY2xpZW50SWQgIT09IGN1cnJlbnRDbGllbnRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IENsaWVudElkIG9mIHRoZSByZXNwb25zZSBkaWQgbm90IG1hdGNoJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjdXJyZW50Q2xpZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgRG9scGhpblNlc3Npb25FcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFNlcnZlciBkaWQgbm90IHNlbmQgYSBjbGllbnRJZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShodHRwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgUkVRVUVTVF9USU1FT1VUOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBTZXNzaW9uIFRpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5mYWlsZWRfYXR0ZW1wdCA8PSB0aGlzLm1heFJldHJ5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsZWRfYXR0ZW1wdCA9IHRoaXMuZmFpbGVkX2F0dGVtcHQgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBIdHRwUmVzcG9uc2VFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMCAoJyArIGh0dHAuc3RhdHVzICsgJyknKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBodHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuY2xpZW50SWQpKSB7XG4gICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FLCB0aGlzLmNsaWVudElkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmhlYWRlcnNJbmZvKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZmFpbGVkX2F0dGVtcHQgPiB0aGlzLm1heFJldHJ5KSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cC5zZW5kKENvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMudGltZW91dCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBodHRwLnNlbmQoQ29kZWMuZW5jb2RlKGNvbW1hbmRzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICB0aGlzLl9zZW5kKGNvbW1hbmRzKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2VUZXh0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZUNvbW1hbmRzID0gQ29kZWMuZGVjb2RlKHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBEb2xwaGluUmVtb3RpbmdFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IFBhcnNlIGVycm9yOiAoSW5jb3JyZWN0IHJlc3BvbnNlID0gJyArIHJlc3BvbnNlVGV4dCArICcpJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRG9scGhpblJlbW90aW5nRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBFbXB0eSByZXNwb25zZScpKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaWduYWwoY29tbWFuZCkge1xuICAgICAgICB0aGlzLl9zZW5kKFtjb21tYW5kXSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpKTtcbiAgICB9XG59XG5cbkVtaXR0ZXIoUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlKTtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RpbmdFcnJvckhhbmRsZXIge1xuXG4gICAgb25FcnJvcihlcnJvcikge1xuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuXG59IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY2hlY2tNZXRob2ROYW1lO1xuXG52YXIgZXhpc3RzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcblxubW9kdWxlLmV4cG9ydHMuY2hlY2tNZXRob2QgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgY2hlY2tNZXRob2ROYW1lID0gbmFtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNoZWNrUGFyYW0gPSBmdW5jdGlvbihwYXJhbSwgcGFyYW1ldGVyTmFtZSkge1xuICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwYXJhbWV0ZXIgJyArIHBhcmFtZXRlck5hbWUgKyAnIGlzIG1hbmRhdG9yeSBpbiAnICsgY2hlY2tNZXRob2ROYW1lKTtcbiAgICB9XG59O1xuIl19