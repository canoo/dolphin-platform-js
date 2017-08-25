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

var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

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

var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

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

},{}],82:[function(_dereq_,module,exports){
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

var _map = _dereq_('../bower_components/core.js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _utils = _dereq_('./utils');

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

},{"../bower_components/core.js/library/fn/map":1,"./utils":121}],83:[function(_dereq_,module,exports){
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

var _map = _dereq_('../bower_components/core.js/library/fn/map');

var _map2 = _interopRequireDefault(_map);

var _constants = _dereq_('./constants');

var consts = _interopRequireWildcard(_constants);

var _utils = _dereq_('./utils');

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
                        console.warn('An exception occurred while calling an onBeanRemoved-handler', e);
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

},{"../bower_components/core.js/library/fn/map":1,"./constants":110,"./utils":121}],84:[function(_dereq_,module,exports){
"use strict";

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

var _eventBus = _dereq_("./eventBus");

var _eventBus2 = _interopRequireDefault(_eventBus);

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
        key: "copy",
        value: function copy() {
            var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue());
            return result;
        }
    }, {
        key: "setPresentationModel",
        value: function setPresentationModel(presentationModel) {
            if (this.presentationModel) {
                throw new Error("You can not set a presentation model for an attribute that is already bound.");
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
        key: "setValueFromServer",
        value: function setValueFromServer(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value == verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': false });
        }
    }, {
        key: "setValue",
        value: function setValue(newValue) {
            var verifiedValue = ClientAttribute.checkValue(newValue);
            if (this.value == verifiedValue) return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue, 'sendToServer': true });
        }
    }, {
        key: "setQualifier",
        value: function setQualifier(newQualifier) {
            if (this.qualifier == newQualifier) return;
            var oldQualifier = this.qualifier;
            this.qualifier = newQualifier;
            this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
            this.valueChangeBus.trigger({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
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
            eventHandler({ "oldValue": this.value, "newValue": this.value, 'sendToServer': false });
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

exports.default = ClientAttribute;

ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;

},{"./eventBus":115}],85:[function(_dereq_,module,exports){
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

},{"./clientPresentationModel":89,"./commandBatcher":91,"./commands/codec":92}],86:[function(_dereq_,module,exports){
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

var _openDolphin = _dereq_('./openDolphin.js');

var _utils = _dereq_('./utils');

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
            console.log('Creating client context ' + url + '    ' + JSON.stringify(config));

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
            return clientContext;
        }
    }]);

    return ClientContextFactory;
}();

exports.default = ClientContextFactory;

exports.ClientContextFactory = ClientContextFactory;

},{"./beanmanager":82,"./classrepo":83,"./clientcontext":90,"./connector":109,"./controllermanager":111,"./openDolphin.js":118,"./platformHttpTransmitter":119,"./utils":121}],87:[function(_dereq_,module,exports){
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

},{"./clientAttribute":84,"./clientPresentationModel":89}],88:[function(_dereq_,module,exports){
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
                if (evt.newValue != evt.oldValue && evt.sendToServer == true) {
                    var command = _commandFactory2.default.createValueChangedCommand(attribute.id, evt.newValue);
                    _this.clientDolphin.getClientConnector().send(command, null);
                }

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
                console.log("There already is a PM with id " + model.id);
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

},{"./attribute":81,"./commands/commandFactory":95,"./constants":110,"./eventBus":115}],89:[function(_dereq_,module,exports){
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

},{"./eventBus":115}],90:[function(_dereq_,module,exports){
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

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

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

},{"../bower_components/core.js/library/fn/promise":2,"./commands/commandFactory":95,"./utils":121,"emitter-component":80}],91:[function(_dereq_,module,exports){
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

},{"./commands/commandConstants":94}],92:[function(_dereq_,module,exports){
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

},{"../constants":110,"../utils":121,"./codecError":93,"./commandConstants":94,"./impl/attributeMetadataChangedCommand":96,"./impl/callActionCommand":97,"./impl/changeAttributeMetadataCommand":98,"./impl/createContextCommand":99,"./impl/createControllerCommand":100,"./impl/createPresentationModelCommand":101,"./impl/deletePresentationModelCommand":102,"./impl/destroyContextCommand":103,"./impl/destroyControllerCommand":104,"./impl/interruptLongPollCommand":105,"./impl/presentationModelDeletedCommand":106,"./impl/startLongPollCommand":107,"./impl/valueChangedCommand":108}],93:[function(_dereq_,module,exports){
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

},{}],94:[function(_dereq_,module,exports){
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

},{}],95:[function(_dereq_,module,exports){
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

},{"./impl/attributeMetadataChangedCommand":96,"./impl/callActionCommand":97,"./impl/changeAttributeMetadataCommand":98,"./impl/createContextCommand":99,"./impl/createControllerCommand":100,"./impl/createPresentationModelCommand":101,"./impl/deletePresentationModelCommand":102,"./impl/destroyContextCommand":103,"./impl/destroyControllerCommand":104,"./impl/interruptLongPollCommand":105,"./impl/presentationModelDeletedCommand":106,"./impl/startLongPollCommand":107,"./impl/valueChangedCommand":108}],96:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],97:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],98:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],99:[function(_dereq_,module,exports){
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

},{"../commandConstants":94}],100:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],101:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],102:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],103:[function(_dereq_,module,exports){
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

},{"../commandConstants":94}],104:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],105:[function(_dereq_,module,exports){
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

},{"../commandConstants":94}],106:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],107:[function(_dereq_,module,exports){
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

},{"../commandConstants":94}],108:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":94}],109:[function(_dereq_,module,exports){
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

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

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

},{"../bower_components/core.js/library/fn/promise":2,"./commands/commandFactory":95,"./constants":110,"./utils":121}],110:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

},{}],111:[function(_dereq_,module,exports){
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

var _promise = _dereq_('../bower_components/core.js/library/fn/promise');

var _promise2 = _interopRequireDefault(_promise);

var _set = _dereq_('../bower_components/core.js/library/fn/set');

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

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./commands/commandFactory.js":95,"./connector.js":109,"./controllerproxy.js":112,"./utils":121}],112:[function(_dereq_,module,exports){
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

var _set = _dereq_('../bower_components/core.js/library/fn/set');

var _set2 = _interopRequireDefault(_set);

var _utils = _dereq_('./utils');

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

},{"../bower_components/core.js/library/fn/set":3,"./utils":121}],113:[function(_dereq_,module,exports){
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
            console.log("OpenDolphin js found");
            var clientDolphin = new _clientDolphin2.default();
            var transmitter;
            if (this.url_ != null && this.url_.length > 0) {
                transmitter = new _httpTransmitter2.default(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_, this.headersInfo_);
            } else {
                transmitter = new _noTransmitter2.default();
            }
            clientDolphin.setClientConnector(new _clientConnector2.default(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
            clientDolphin.setClientModelStore(new _clientModelStore2.default(clientDolphin));
            console.log("ClientDolphin initialized");
            return clientDolphin;
        }
    }]);

    return DolphinBuilder;
}();

exports.default = DolphinBuilder;

},{"./clientConnector":85,"./clientDolphin":87,"./clientModelStore":88,"./httpTransmitter":116,"./noTransmitter":117}],114:[function(_dereq_,module,exports){
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

},{}],115:[function(_dereq_,module,exports){
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

},{}],116:[function(_dereq_,module,exports){
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

var _codec = _dereq_("./commands/codec");

var _codec2 = _interopRequireDefault(_codec);

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

},{"./commands/codec":92}],117:[function(_dereq_,module,exports){
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

},{}],118:[function(_dereq_,module,exports){
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

},{"./dolphinBuilder":113}],119:[function(_dereq_,module,exports){
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

},{"./commands/codec":92,"./errors":114,"./remotingErrorHandler":120,"./utils":121,"emitter-component":80}],120:[function(_dereq_,module,exports){
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

},{}]},{},[86])(86)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktbWV0aG9kcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwic3JjL2F0dHJpYnV0ZS5qcyIsInNyYy9iZWFubWFuYWdlci5qcyIsInNyYy9jbGFzc3JlcG8uanMiLCJzcmMvY2xpZW50QXR0cmlidXRlLmpzIiwic3JjL2NsaWVudENvbm5lY3Rvci5qcyIsInNyYy9jbGllbnRDb250ZXh0RmFjdG9yeS5qcyIsInNyYy9jbGllbnREb2xwaGluLmpzIiwic3JjL2NsaWVudE1vZGVsU3RvcmUuanMiLCJzcmMvY2xpZW50UHJlc2VudGF0aW9uTW9kZWwuanMiLCJzcmMvY2xpZW50Y29udGV4dC5qcyIsInNyYy9jb21tYW5kQmF0Y2hlci5qcyIsInNyYy9jb21tYW5kcy9jb2RlYy5qcyIsInNyYy9jb21tYW5kcy9jb2RlY0Vycm9yLmpzIiwic3JjL2NvbW1hbmRzL2NvbW1hbmRDb25zdGFudHMuanMiLCJzcmMvY29tbWFuZHMvY29tbWFuZEZhY3RvcnkuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9hdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvY2FsbEFjdGlvbkNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9jaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9jcmVhdGVDb250ZXh0Q29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9pbXBsL2NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvZGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvZGVzdHJveUNvbnRleHRDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvZGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvaW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvcHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9pbXBsL3N0YXJ0TG9uZ1BvbGxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvdmFsdWVDaGFuZ2VkQ29tbWFuZC5qcyIsInNyYy9jb25uZWN0b3IuanMiLCJzcmMvY29uc3RhbnRzLmpzIiwic3JjL2NvbnRyb2xsZXJtYW5hZ2VyLmpzIiwic3JjL2NvbnRyb2xsZXJwcm94eS5qcyIsInNyYy9kb2xwaGluQnVpbGRlci5qcyIsInNyYy9lcnJvcnMuanMiLCJzcmMvZXZlbnRCdXMuanMiLCJzcmMvaHR0cFRyYW5zbWl0dGVyLmpzIiwic3JjL25vVHJhbnNtaXR0ZXIuanMiLCJzcmMvb3BlbkRvbHBoaW4uanMiLCJzcmMvcGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuanMiLCJzcmMvcmVtb3RpbmdFcnJvckhhbmRsZXIuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLE9BQUEsQUFBTyxVQUFVLFFBQUEsQUFBUSxvQkFBekIsQUFBNkM7Ozs7O0FDTDdDLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLE9BQUEsQUFBTyxVQUFVLFFBQUEsQUFBUSxvQkFBekIsQUFBNkM7Ozs7O0FDSjdD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Q3RCOzs7QUFFTSxTQUFBLEFBQVMsV0FBVCxBQUFvQixPQUFwQixBQUEyQixlQUFlLEFBQzdDO1FBQUcsQ0FBQyxPQUFKLEFBQUksQUFBTyxRQUFRLEFBQ2Y7Y0FBTSxJQUFBLEFBQUksTUFBTSxtQkFBQSxBQUFtQixnQkFBbkIsQUFBbUMsc0JBQW5ELEFBQU0sQUFBbUUsQUFDNUUsQUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuTWFwOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5Qcm9taXNlOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zZXQnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnNldC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5TZXQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKXtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlciwgSVRFUkFUT1Ipe1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvck9mKGl0ZXIsIGZhbHNlLCByZXN1bHQucHVzaCwgcmVzdWx0LCBJVEVSQVRPUik7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGFzYyAgICAgID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSwgJGNyZWF0ZSl7XG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVhcbiAgICAsIGNyZWF0ZSAgICAgICAgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QoJHRoaXMpXG4gICAgICAsIHNlbGYgICA9IElPYmplY3QoTylcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGlzQXJyYXkgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIFNQRUNJRVMgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCl7XG4gIHZhciBDO1xuICBpZihpc0FycmF5KG9yaWdpbmFsKSl7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKUMgPSB1bmRlZmluZWQ7XG4gICAgaWYoaXNPYmplY3QoQykpe1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZihDID09PSBudWxsKUMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59OyIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxlbmd0aCl7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59OyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgY3JlYXRlICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGFuSW5zdGFuY2UgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGRlZmluZWQgICAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpXG4gICwgZm9yT2YgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKVxuICAsIHN0ZXAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBzZXRTcGVjaWVzICA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBmYXN0S2V5ICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5XG4gICwgU0laRSAgICAgICAgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uKHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXQuX2YgPT0gZW50cnkpdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdC5fbCA9PSBlbnRyeSl0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgJ2ZvckVhY2gnKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpXG4gICAgICAgICAgLCBlbnRyeTtcbiAgICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKERFU0NSSVBUT1JTKWRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGRlZmluZWQodGhpc1tTSVpFXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxuICAgICAgLCBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZihlbnRyeSl7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZighdGhhdC5fZil0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgICAgIHRoaXMuX3QgPSBpdGVyYXRlZDsgIC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAsIGtpbmQgID0gdGhhdC5fa1xuICAgICAgICAsIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBmcm9tICAgID0gcmVxdWlyZSgnLi9fYXJyYXktZnJvbS1pdGVyYWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRvSlNPTigpe1xuICAgIGlmKGNsYXNzb2YodGhpcykgIT0gTkFNRSl0aHJvdyBUeXBlRXJyb3IoTkFNRSArIFwiI3RvSlNPTiBpc24ndCBnZW5lcmljXCIpO1xuICAgIHJldHVybiBmcm9tKHRoaXMpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBtZXRhICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKVxuICAsIGZhaWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmVBbGwgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGZvck9mICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBhbkluc3RhbmNlICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZFAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgZWFjaCAgICAgICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMClcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSBnbG9iYWxbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIGlmKCFERVNDUklQVE9SUyB8fCB0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGFyZ2V0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSwgJ19jJyk7XG4gICAgICB0YXJnZXQuX2MgPSBuZXcgQmFzZTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0YXJnZXRbQURERVJdLCB0YXJnZXQpO1xuICAgIH0pO1xuICAgIGVhY2goJ2FkZCxjbGVhcixkZWxldGUsZm9yRWFjaCxnZXQsaGFzLHNldCxrZXlzLHZhbHVlcyxlbnRyaWVzLHRvSlNPTicuc3BsaXQoJywnKSxmdW5jdGlvbihLRVkpe1xuICAgICAgdmFyIElTX0FEREVSID0gS0VZID09ICdhZGQnIHx8IEtFWSA9PSAnc2V0JztcbiAgICAgIGlmKEtFWSBpbiBwcm90byAmJiAhKElTX1dFQUsgJiYgS0VZID09ICdjbGVhcicpKWhpZGUoQy5wcm90b3R5cGUsIEtFWSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgS0VZKTtcbiAgICAgICAgaWYoIUlTX0FEREVSICYmIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpKXJldHVybiBLRVkgPT0gJ2dldCcgPyB1bmRlZmluZWQgOiBmYWxzZTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2NbS0VZXShhID09PSAwID8gMCA6IGEsIGIpO1xuICAgICAgICByZXR1cm4gSVNfQURERVIgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoJ3NpemUnIGluIHByb3RvKWRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiwgTyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjQuMCd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV1cbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDKXtcbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQztcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYoSVNfUFJPVE8pe1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0paGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKVxuICAsIEJSRUFLICAgICAgID0ge31cbiAgLCBSRVRVUk4gICAgICA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1Ipe1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbigpeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLICA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJ2YXIgSVRFUkFUT1IgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHJldHVybiB7ZG9uZTogc2FmZSA9IHRydWV9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwidmFyIE1FVEEgICAgID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKVxuICAsIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBoYXMgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgc2V0RGVzYyAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaWQgICAgICAgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24oaXQpe1xuICBzZXREZXNjKGl0LCBNRVRBLCB7dmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9fSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIGlmKCFoYXMoaXQsIE1FVEEpKXtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKXNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiAgICAgIE1FVEEsXG4gIE5FRUQ6ICAgICBmYWxzZSxcbiAgZmFzdEtleTogIGZhc3RLZXksXG4gIGdldFdlYWs6ICBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBQcm9taXNlICAgPSBnbG9iYWwuUHJvbWlzZVxuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZShoZWFkKXtcbiAgICAgIGZuICAgPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICBpZihoZWFkKW5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmKGlzTm9kZSl7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlclxuICB9IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICAgIHZhciB0b2dnbGUgPSB0cnVlXG4gICAgICAsIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpe1xuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZH07XG4gICAgaWYobGFzdClsYXN0Lm5leHQgPSB0YXNrO1xuICAgIGlmKCFoZWFkKXtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07IiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGRQcyAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIEVtcHR5ICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIFBST1RPVFlQRSAgID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGVudW1CdWdLZXlzLmxlbmd0aFxuICAgICwgbHQgICAgID0gJzwnXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcyl7XG4gIHZhciByZXN1bHQ7XG4gIGlmKE8gIT09IG51bGwpe1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzICAgPSBnZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIFA7XG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59OyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMsIHNhZmUpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpe1xuICAgIGlmKHNhZmUgJiYgdGFyZ2V0W2tleV0pdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgZFAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IHR5cGVvZiBjb3JlW0tFWV0gPT0gJ2Z1bmN0aW9uJyA/IGNvcmVbS0VZXSA6IGdsb2JhbFtLRVldO1xuICBpZihERVNDUklQVE9SUyAmJiBDICYmICFDW1NQRUNJRVNdKWRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIEQpe1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yLCBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGludm9rZSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spe1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmxjell1YjJKcVpXTjBMblJ2TFhOMGNtbHVaeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNsYXNzb2YgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsICRleHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaXNPYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gICAgICAgICAgPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBhbkluc3RhbmNlICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZm9yT2YgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCB0YXNrICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgbWljcm90YXNrICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKVxuICAsIFBST01JU0UgICAgICAgICAgICA9ICdQcm9taXNlJ1xuICAsIFR5cGVFcnJvciAgICAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsICRQcm9taXNlICAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICAgICAgICAgID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBlbXB0eSAgICAgICAgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgSW50ZXJuYWwsIEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgICAgID0gJFByb21pc2UucmVzb2x2ZSgxKVxuICAgICAgLCBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24oZXhlYyl7IGV4ZWMoZW1wdHksIGVtcHR5KTsgfTtcbiAgICAvLyB1bmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgcmV0dXJuIChpc05vZGUgfHwgdHlwZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCA9PSAnZnVuY3Rpb24nKSAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2U7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyB3aXRoIGxpYnJhcnkgd3JhcHBlciBzcGVjaWFsIGNhc2VcbiAgcmV0dXJuIGEgPT09IGIgfHwgYSA9PT0gJFByb21pc2UgJiYgYiA9PT0gV3JhcHBlcjtcbn07XG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgcmV0dXJuIHNhbWVDb25zdHJ1Y3RvcigkUHJvbWlzZSwgQylcbiAgICA/IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgIDogbmV3IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG52YXIgUHJvbWlzZUNhcGFiaWxpdHkgPSBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24oJCRyZXNvbHZlLCAkJHJlamVjdCl7XG4gICAgaWYocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCAgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocHJvbWlzZSwgaXNSZWplY3Qpe1xuICBpZihwcm9taXNlLl9uKXJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgb2sgICAgPSBwcm9taXNlLl9zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgZG9tYWluICA9IHJlYWN0aW9uLmRvbWFpblxuICAgICAgICAsIHJlc3VsdCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmKGhhbmRsZXIpe1xuICAgICAgICAgIGlmKCFvayl7XG4gICAgICAgICAgICBpZihwcm9taXNlLl9oID09IDIpb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoaGFuZGxlciA9PT0gdHJ1ZSlyZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKW9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIGFicnVwdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYoYWJydXB0KXRocm93IGFicnVwdC5lcnJvcjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIGlmKHByb21pc2UuX2ggPT0gMSlyZXR1cm4gZmFsc2U7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2EgfHwgcHJvbWlzZS5fY1xuICAgICwgaSAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3Rpb24gPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0aW9uLmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0aW9uLnByb21pc2UpKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZihpc05vZGUpe1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKXtcbiAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdn0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYoIXByb21pc2UuX2EpcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHByb21pc2UgPT09IHZhbHVlKXRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7X3c6IHByb21pc2UsIF9kOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe193OiBwcm9taXNlLCBfZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciByZWFjdGlvbiAgICA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgICAgID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsICAgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9hKXRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9zKW5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwcm9taXNlICA9IG5ldyBJbnRlcm5hbDtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogJFByb21pc2V9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlamVjdCAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mICRQcm9taXNlICYmIHNhbWVDb25zdHJ1Y3Rvcih4LmNvbnN0cnVjdG9yLCB0aGlzKSlyZXR1cm4geDtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWx1ZXMgICAgPSBbXVxuICAgICAgICAsIGluZGV4ICAgICA9IDBcbiAgICAgICAgLCByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgdmFyICRpbmRleCAgICAgICAgPSBpbmRleCsrXG4gICAgICAgICAgLCBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCAgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlc1skaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ1NldCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnTWFwJywge3RvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpfSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnU2V0Jywge3RvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ1NldCcpfSk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5mb3IodmFyIGNvbGxlY3Rpb25zID0gWydOb2RlTGlzdCcsICdET01Ub2tlbkxpc3QnLCAnTWVkaWFMaXN0JywgJ1N0eWxlU2hlZXRMaXN0JywgJ0NTU1J1bGVMaXN0J10sIGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgdmFyIE5BTUUgICAgICAgPSBjb2xsZWN0aW9uc1tpXVxuICAgICwgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXVxuICAgICwgcHJvdG8gICAgICA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmKHByb3RvICYmICFwcm90b1tUT19TVFJJTkdfVEFHXSloaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXR0cmlidXRlIHtcbn1cblxuQXR0cmlidXRlLlFVQUxJRklFUl9QUk9QRVJUWSA9IFwicXVhbGlmaWVyXCI7XG5BdHRyaWJ1dGUuVkFMVUUgPSBcInZhbHVlXCI7XG4iLCJpbXBvcnQgIE1hcCBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVhbk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGNsYXNzUmVwb3NpdG9yeSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KScpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmFkZGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hbGxBZGRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsVXBkYXRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBbXTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKCh0eXBlLCBiZWFuKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZCgodHlwZSwgYmVhbikgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKCh0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZSgodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQXJyYXlVcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkFycmF5VXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgIH1cblxuXG4gICAgbm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cblxuICAgIG5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpO1xuICAgIH1cblxuXG4gICAgaXNNYW5hZ2VkKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmlzTWFuYWdlZChiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uaXNNYW5hZ2VkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBjcmVhdGUodHlwZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuY3JlYXRlKHR5cGUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5jcmVhdGUoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGFkZCh0eXBlLCBiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGQodHlwZSwgYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBhZGRBbGwodHlwZSwgY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb2xsZWN0aW9uLCAnY29sbGVjdGlvbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZEFsbCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZShiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmVBbGwoY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlQWxsKGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVBbGwoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZUlmKHByZWRpY2F0ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlSWYocHJlZGljYXRlKScpO1xuICAgICAgICBjaGVja1BhcmFtKHByZWRpY2F0ZSwgJ3ByZWRpY2F0ZScpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUlmKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBvbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFycmF5VXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCAgTWFwIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCc7XG5pbXBvcnQgKiBhcyBjb25zdHMgZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxudmFyIGJsb2NrZWQgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGFzc1JlcG9zaXRvcnkge1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNsYXNzZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW4gPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuY2xhc3NJbmZvcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycyA9IFtdO1xuICAgIH1cblxuICAgIGZpeFR5cGUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5CWVRFOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuU0hPUlQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5JTlQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT05HOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5GTE9BVDpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPVUJMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5CT09MRUFOOlxuICAgICAgICAgICAgICAgIHJldHVybiAndHJ1ZScgPT09IFN0cmluZyh2YWx1ZSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlNUUklORzpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkVOVU06XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZyb21Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NSZXBvc2l0b3J5LmJlYW5Gcm9tRG9scGhpbi5nZXQoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5EQVRFOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkNBTEVOREFSOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShTdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5aT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpeFR5cGUodHlwZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NSZXBvc2l0b3J5LmJlYW5Ub0RvbHBoaW4uZ2V0KHZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkRBVEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkNBTEVOREFSOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLkxPQ0FMX0RBVEVfVElNRV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5aT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXhUeXBlKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmRMaXN0U3BsaWNlKGNsYXNzUmVwb3NpdG9yeSwgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBmcm9tLCB0bywgbmV3RWxlbWVudHMpIHtcbiAgICAgICAgbGV0IGRvbHBoaW4gPSBjbGFzc1JlcG9zaXRvcnkuZG9scGhpbjtcbiAgICAgICAgbGV0IG1vZGVsID0gZG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKG1vZGVsSWQpO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWwpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gY2xhc3NSZXBvc2l0b3J5LmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0eXBlKSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdAQEAgU09VUkNFX1NZU1RFTSBAQEAnLCBudWxsLCAnY2xpZW50JyksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdzb3VyY2UnLCBudWxsLCBtb2RlbElkKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG51bGwsIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdmcm9tJywgbnVsbCwgZnJvbSksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCd0bycsIG51bGwsIHRvKSxcbiAgICAgICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2NvdW50JywgbnVsbCwgbmV3RWxlbWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGRvbHBoaW4uYXR0cmlidXRlKGluZGV4LnRvU3RyaW5nKCksIG51bGwsIHNlbGYudG9Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgZWxlbWVudCkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KGRvbHBoaW4sIFtudWxsLCAnQERQOkxTQCddLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YWxpZGF0ZUxpc3QoY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgbGV0IGxpc3QgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmICghZXhpc3RzKGxpc3QpKSB7XG4gICAgICAgICAgICBjbGFzc1JlcG9zaXRvcnkucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIFtdLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmxvY2soYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGlmIChleGlzdHMoYmxvY2tlZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGNyZWF0ZSBhIGJsb2NrIHdoaWxlIGFub3RoZXIgYmxvY2sgZXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tlZCA9IHtcbiAgICAgICAgICAgIGJlYW46IGJlYW4sXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGV4aXN0cyhibG9ja2VkKSAmJiBibG9ja2VkLmJlYW4gPT09IGJlYW4gJiYgYmxvY2tlZC5wcm9wZXJ0eU5hbWUgPT09IHByb3BlcnR5TmFtZTtcbiAgICB9XG5cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICBibG9ja2VkID0gbnVsbDtcbiAgICB9XG5cbiAgICBub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICBsZXQgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkpIHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IHRoaXMuZG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKG1vZGVsSWQpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gY2xhc3NJbmZvW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gYXR0cmlidXRlLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZSh0aGlzLnRvRG9scGhpbih0aGlzLCB0eXBlLCBuZXdWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mcm9tRG9scGhpbih0aGlzLCB0eXBlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm90aWZ5QXJyYXlDaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQmxvY2tlZChiZWFuLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgICAgICBsZXQgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmIChleGlzdHMobW9kZWxJZCkgJiYgZXhpc3RzKGFycmF5KSkge1xuICAgICAgICAgICAgbGV0IHJlbW92ZWRFbGVtZW50c0NvdW50ID0gQXJyYXkuaXNBcnJheShyZW1vdmVkRWxlbWVudHMpID8gcmVtb3ZlZEVsZW1lbnRzLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICB0aGlzLnNlbmRMaXN0U3BsaWNlKHRoaXMsIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgaW5kZXgsIGluZGV4ICsgcmVtb3ZlZEVsZW1lbnRzQ291bnQsIGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIGNvdW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJlYW5BZGRlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuQWRkZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25CZWFuUmVtb3ZlZChoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQmVhblVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb25BcnJheVVwZGF0ZShoYW5kbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZShoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyQ2xhc3MobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBpZiAodGhpcy5jbGFzc2VzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjbGFzc0luZm8gPSB7fTtcbiAgICAgICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUuc2VhcmNoKC9eQC8pIDwgMDtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNsYXNzZXMuc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJDbGFzcyhtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnVucmVnaXN0ZXJDbGFzcyhtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIHRoaXMuY2xhc3Nlc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgIH1cblxuICAgIGxvYWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgIHZhciBiZWFuID0ge307XG4gICAgICAgIG1vZGVsLmF0dHJpYnV0ZXMuZmlsdGVyKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwKTtcbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICBiZWFuW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5vbGRWYWx1ZSAhPT0gZXZlbnQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gc2VsZi5mcm9tRG9scGhpbihzZWxmLCBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0sIGV2ZW50Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4sIGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluLnNldChtb2RlbC5pZCwgYmVhbik7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpbi5zZXQoYmVhbiwgbW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3Muc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgICAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUsIGJlYW4pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGJlYW47XG4gICAgfVxuXG4gICAgdW5sb2FkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuYmVhblRvRG9scGhpblsnZGVsZXRlJ10oYmVhbik7XG4gICAgICAgIHRoaXMuY2xhc3NJbmZvc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgICAgICBpZiAoZXhpc3RzKGJlYW4pKSB7XG4gICAgICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuUmVtb3ZlZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlYW47XG4gICAgfVxuXG4gICAgc3BsaWNlTGlzdEVudHJ5KG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKScpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgICAgICBsZXQgc291cmNlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdzb3VyY2UnKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnYXR0cmlidXRlJyk7XG4gICAgICAgIGxldCBmcm9tID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdmcm9tJyk7XG4gICAgICAgIGxldCB0byA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgndG8nKTtcbiAgICAgICAgbGV0IGNvdW50ID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdjb3VudCcpO1xuXG4gICAgICAgIGlmIChleGlzdHMoc291cmNlKSAmJiBleGlzdHMoYXR0cmlidXRlKSAmJiBleGlzdHMoZnJvbSkgJiYgZXhpc3RzKHRvKSAmJiBleGlzdHMoY291bnQpKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc0luZm9zLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICAgICAgdmFyIGJlYW4gPSB0aGlzLmJlYW5Gcm9tRG9scGhpbi5nZXQoc291cmNlLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgZXhpc3RzKGNsYXNzSW5mbykpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgICAgICAvL3ZhciBlbnRyeSA9IGZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlTGlzdCh0aGlzLCB0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50LnZhbHVlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3RWxlbWVudHMucHVzaCh0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxvY2soYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUsIGZyb20udmFsdWUsIHRvLnZhbHVlIC0gZnJvbS52YWx1ZSwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5ibG9jaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWQuIFNvdXJjZSBiZWFuIHVua25vd24uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBQYXJhbVRvRG9scGhpbihwYXJhbSkge1xuICAgICAgICBpZiAoIWV4aXN0cyhwYXJhbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVvZiBwYXJhbTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQocGFyYW0pO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9ubHkgbWFuYWdlZCBEb2xwaGluIEJlYW5zIGNhbiBiZSB1c2VkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnbnVtYmVyJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25seSBtYW5hZ2VkIERvbHBoaW4gQmVhbnMgYW5kIHByaW1pdGl2ZSB0eXBlcyBjYW4gYmUgdXNlZFwiKTtcbiAgICB9XG5cbiAgICBtYXBEb2xwaGluVG9CZWFuKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb21Eb2xwaGluKHRoaXMsIGNvbnN0cy5ET0xQSElOX0JFQU4sIHZhbHVlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9ldmVudEJ1cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudEF0dHJpYnV0ZSB7XG4gICAgY29uc3RydWN0b3IocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICB0aGlzLmlkID0gXCJcIiArIChDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCsrKSArIFwiQ1wiO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLnNldFF1YWxpZmllcihxdWFsaWZpZXIpO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ2xpZW50QXR0cmlidXRlKHRoaXMucHJvcGVydHlOYW1lLCB0aGlzLmdldFF1YWxpZmllcigpLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHNldFByZXNlbnRhdGlvbk1vZGVsKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2FuIG5vdCBzZXQgYSBwcmVzZW50YXRpb24gbW9kZWwgZm9yIGFuIGF0dHJpYnV0ZSB0aGF0IGlzIGFscmVhZHkgYm91bmQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWwgPSBwcmVzZW50YXRpb25Nb2RlbDtcbiAgICB9XG5cbiAgICBnZXRQcmVzZW50YXRpb25Nb2RlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWw7XG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIHNldFZhbHVlRnJvbVNlcnZlcihuZXdWYWx1ZSkge1xuICAgICAgICB2YXIgdmVyaWZpZWRWYWx1ZSA9IENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gdmVyaWZpZWRWYWx1ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZlcmlmaWVkVmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFZhbHVlLCAnbmV3VmFsdWUnOiB2ZXJpZmllZFZhbHVlLCAnc2VuZFRvU2VydmVyJzogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgc2V0VmFsdWUobmV3VmFsdWUpIHtcbiAgICAgICAgdmFyIHZlcmlmaWVkVmFsdWUgPSBDbGllbnRBdHRyaWJ1dGUuY2hlY2tWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlID09IHZlcmlmaWVkVmFsdWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2ZXJpZmllZFZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRWYWx1ZSwgJ25ld1ZhbHVlJzogdmVyaWZpZWRWYWx1ZSwgJ3NlbmRUb1NlcnZlcic6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgc2V0UXVhbGlmaWVyKG5ld1F1YWxpZmllcikge1xuICAgICAgICBpZiAodGhpcy5xdWFsaWZpZXIgPT0gbmV3UXVhbGlmaWVyKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgb2xkUXVhbGlmaWVyID0gdGhpcy5xdWFsaWZpZXI7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyID0gbmV3UXVhbGlmaWVyO1xuICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkUXVhbGlmaWVyLCAnbmV3VmFsdWUnOiBuZXdRdWFsaWZpZXIgfSk7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7IFwib2xkVmFsdWVcIjogdGhpcy52YWx1ZSwgXCJuZXdWYWx1ZVwiOiB0aGlzLnZhbHVlLCAnc2VuZFRvU2VydmVyJzogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgZ2V0UXVhbGlmaWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWFsaWZpZXI7XG4gICAgfVxuXG4gICAgb25WYWx1ZUNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIGV2ZW50SGFuZGxlcih7IFwib2xkVmFsdWVcIjogdGhpcy52YWx1ZSwgXCJuZXdWYWx1ZVwiOiB0aGlzLnZhbHVlLCAnc2VuZFRvU2VydmVyJzogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgb25RdWFsaWZpZXJDaGFuZ2UoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMucXVhbGlmaWVyQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzeW5jV2l0aChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTsgLy8gc2VxdWVuY2UgaXMgaW1wb3J0YW50XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHNvdXJjZUF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgY2hlY2tWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFN0cmluZyB8fCByZXN1bHQgaW5zdGFuY2VvZiBCb29sZWFuIHx8IHJlc3VsdCBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWUudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBDbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW4gQXR0cmlidXRlIG1heSBub3QgaXRzZWxmIGNvbnRhaW4gYW4gYXR0cmlidXRlIGFzIGEgdmFsdWUuIEFzc3VtaW5nIHlvdSBmb3Jnb3QgdG8gY2FsbCB2YWx1ZS5cIik7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmNoZWNrVmFsdWUodmFsdWUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvayA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5TVVBQT1JURURfVkFMVUVfVFlQRVMuaW5kZXhPZih0eXBlb2YgcmVzdWx0KSA+IC0xIHx8IHJlc3VsdCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRyaWJ1dGUgdmFsdWVzIG9mIHRoaXMgdHlwZSBhcmUgbm90IGFsbG93ZWQ6IFwiICsgdHlwZW9mIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuXG5DbGllbnRBdHRyaWJ1dGUuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTID0gW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwiYm9vbGVhblwiXTtcbkNsaWVudEF0dHJpYnV0ZS5jbGllbnRBdHRyaWJ1dGVJbnN0YW5jZUNvdW50ID0gMDtcbiIsImltcG9ydCBCbGluZENvbW1hbmRCYXRjaGVyIGZyb20gJy4vY29tbWFuZEJhdGNoZXInO1xuaW1wb3J0IENvZGVjIGZyb20gJy4vY29tbWFuZHMvY29kZWMnO1xuaW1wb3J0IENsaWVudFByZXNlbnRhdGlvbk1vZGVsIGZyb20gJy4vY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENvbm5lY3RvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgc2xhY2tNUyA9IDAsIG1heEJhdGNoU2l6ZSA9IDUwKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnB1c2hFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMud2FpdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRyYW5zbWl0dGVyID0gdHJhbnNtaXR0ZXI7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbiA9IGNsaWVudERvbHBoaW47XG4gICAgICAgIHRoaXMuc2xhY2tNUyA9IHNsYWNrTVM7XG4gICAgICAgIHRoaXMuY29kZWMgPSBuZXcgQ29kZWMoKTtcbiAgICAgICAgdGhpcy5jb21tYW5kQmF0Y2hlciA9IG5ldyBCbGluZENvbW1hbmRCYXRjaGVyKHRydWUsIG1heEJhdGNoU2l6ZSk7XG4gICAgfVxuXG4gICAgc2V0Q29tbWFuZEJhdGNoZXIobmV3QmF0Y2hlcikge1xuICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3QmF0Y2hlcjtcbiAgICB9XG5cbiAgICBzZXRQdXNoRW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMucHVzaEVuYWJsZWQgPSBlbmFibGVkO1xuICAgIH1cblxuICAgIHNldFB1c2hMaXN0ZW5lcihuZXdMaXN0ZW5lcikge1xuICAgICAgICB0aGlzLnB1c2hMaXN0ZW5lciA9IG5ld0xpc3RlbmVyO1xuICAgIH1cblxuICAgIHNldFJlbGVhc2VDb21tYW5kKG5ld0NvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlQ29tbWFuZCA9IG5ld0NvbW1hbmQ7XG4gICAgfVxuXG4gICAgc2VuZChjb21tYW5kLCBvbkZpbmlzaGVkKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goeyBjb21tYW5kOiBjb21tYW5kLCBoYW5kbGVyOiBvbkZpbmlzaGVkIH0pO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlTZW5kaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTsgLy8gdGhlcmUgaXMgbm90IHBvaW50IGluIHJlbGVhc2luZyBpZiB3ZSBkbyBub3Qgc2VuZCBhdG1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRvU2VuZE5leHQoKTtcbiAgICB9XG5cbiAgICBkb1NlbmROZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb21tYW5kUXVldWUubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHVzaEVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVucXVldWVQdXNoQ29tbWFuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IHRydWU7XG4gICAgICAgIHZhciBjbWRzQW5kSGFuZGxlcnMgPSB0aGlzLmNvbW1hbmRCYXRjaGVyLmJhdGNoKHRoaXMuY29tbWFuZFF1ZXVlKTtcblxuICAgICAgICBpZihjbWRzQW5kSGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gY21kc0FuZEhhbmRsZXJzW2NtZHNBbmRIYW5kbGVycy5sZW5ndGggLSAxXS5oYW5kbGVyO1xuICAgICAgICAgICAgdmFyIGNvbW1hbmRzID0gY21kc0FuZEhhbmRsZXJzLm1hcChjYWggPT4geyByZXR1cm4gY2FoLmNvbW1hbmQ7IH0pO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pdHRlci50cmFuc21pdChjb21tYW5kcywgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoZWRQTXMgPSBbXTtcbiAgICAgICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKChjb21tYW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3VjaGVkID0gdGhpcy5oYW5kbGUoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3VjaGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91Y2hlZFBNcy5wdXNoKHRvdWNoZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5vbkZpbmlzaGVkKHRvdWNoZWRQTXMpOyAvLyB0b2RvOiBtYWtlIHRoZW0gdW5pcXVlP1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZG9TZW5kTmV4dCgpLCB0aGlzLnNsYWNrTVMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZG9TZW5kTmV4dCgpLCB0aGlzLnNsYWNrTVMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlKGNvbW1hbmQpIHtcbiAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT0gXCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiVmFsdWVDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYW5ub3QgaGFuZGxlLCB1bmtub3duIGNvbW1hbmQgXCIgKyBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBoYW5kbGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICB2YXIgbW9kZWwgPSB0aGlzLmNsaWVudERvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnBtSWQpO1xuICAgICAgICBpZiAoIW1vZGVsKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwsIHRydWUpO1xuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgfVxuXG4gICAgaGFuZGxlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGEgcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnBtSWQgKyBcIiAga25vd24gdG8gdGhlIGNsaWVudC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uYXR0cmlidXRlKGF0dHIucHJvcGVydHlOYW1lLCBhdHRyLnF1YWxpZmllciwgYXR0ci52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0ci5pZCAmJiBhdHRyLmlkLm1hdGNoKFwiLipTJFwiKSkge1xuICAgICAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5pZCA9IGF0dHIuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goY2xpZW50QXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjbGllbnRQbSA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQsIHNlcnZlckNvbW1hbmQucG1UeXBlKTtcbiAgICAgICAgY2xpZW50UG0uYWRkQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgIGNsaWVudFBtLmNsaWVudFNpZGVPbmx5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChjbGllbnRQbSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4udXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIoY2xpZW50UG0pO1xuICAgICAgICByZXR1cm4gY2xpZW50UG07XG4gICAgfVxuXG4gICAgaGFuZGxlVmFsdWVDaGFuZ2VkQ29tbWFuZChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICBpZiAoIWNsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdHRyaWJ1dGUgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQgKyBcIiBub3QgZm91bmQsIGNhbm5vdCB1cGRhdGUgdG8gbmV3IHZhbHVlIFwiICsgc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50QXR0cmlidXRlLmdldFZhbHVlKCkgPT0gc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm5vdGhpbmcgdG8gZG8uIG5ldyB2YWx1ZSA9PSBvbGQgdmFsdWVcIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjbGllbnRBdHRyaWJ1dGUuc2V0VmFsdWVGcm9tU2VydmVyKHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBoYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGNsaWVudEF0dHJpYnV0ZVtzZXJ2ZXJDb21tYW5kLm1ldGFkYXRhTmFtZV0gPSBzZXJ2ZXJDb21tYW5kLnZhbHVlO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsaXN0ZW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5wdXNoRW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyBwdXNoTGlzdGVuZXIgaXMgc2V0P1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbnF1ZXVlUHVzaENvbW1hbmQoKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHRoaXMud2FpdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgY29tbWFuZDogdGhpcy5wdXNoTGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVyOiB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24gKCkgeyBtZS53YWl0aW5nID0gZmFsc2U7IH0sXG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZERhdGE6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVsZWFzZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLndhaXRpbmcpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMud2FpdGluZyA9IGZhbHNlO1xuICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHJlbGVhc2VDb21tYW5kIGlzIHNldD9cbiAgICAgICAgdGhpcy50cmFuc21pdHRlci5zaWduYWwodGhpcy5yZWxlYXNlQ29tbWFuZCk7XG4gICAgfVxufSIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge21ha2VEb2xwaGlufSBmcm9tICcuL29wZW5Eb2xwaGluLmpzJztcbmltcG9ydCB7ZXhpc3RzLCBjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gJy4vY29ubmVjdG9yJztcbmltcG9ydCBCZWFuTWFuYWdlciBmcm9tICcuL2JlYW5tYW5hZ2VyJztcbmltcG9ydCBDbGFzc1JlcG9zaXRvcnkgZnJvbSAnLi9jbGFzc3JlcG8nO1xuaW1wb3J0IENvbnRyb2xsZXJNYW5hZ2VyIGZyb20gJy4vY29udHJvbGxlcm1hbmFnZXInO1xuaW1wb3J0IENsaWVudENvbnRleHQgZnJvbSAnLi9jbGllbnRjb250ZXh0JztcbmltcG9ydCBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlciBmcm9tICcuL3BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udGV4dEZhY3Rvcnkge1xuXG4gICAgY3JlYXRlKHVybCwgY29uZmlnKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ2Nvbm5lY3QodXJsLCBjb25maWcpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odXJsLCAndXJsJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZyBjbGllbnQgY29udGV4dCAnKyB1cmwgKycgICAgJysgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG5cbiAgICAgICAgbGV0IGJ1aWxkZXIgPSBtYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KGZhbHNlKS5zbGFja01TKDQpLnN1cHBvcnRDT1JTKHRydWUpLm1heEJhdGNoU2l6ZShOdW1iZXIuTUFYX1NBRkVfSU5URUdFUik7XG4gICAgICAgIGlmIChleGlzdHMoY29uZmlnKSkge1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhjb25maWcuZXJyb3JIYW5kbGVyKSkge1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuZXJyb3JIYW5kbGVyKGNvbmZpZy5lcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4aXN0cyhjb25maWcuaGVhZGVyc0luZm8pICYmIE9iamVjdC5rZXlzKGNvbmZpZy5oZWFkZXJzSW5mbykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuaGVhZGVyc0luZm8oY29uZmlnLmhlYWRlcnNJbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkb2xwaGluID0gYnVpbGRlci5idWlsZCgpO1xuXG4gICAgICAgIHZhciB0cmFuc21pdHRlciA9IG5ldyBQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcih1cmwsIGNvbmZpZyk7XG4gICAgICAgIHRyYW5zbWl0dGVyLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY2xpZW50Q29udGV4dC5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbHBoaW4uY2xpZW50Q29ubmVjdG9yLnRyYW5zbWl0dGVyID0gdHJhbnNtaXR0ZXI7XG5cbiAgICAgICAgdmFyIGNsYXNzUmVwb3NpdG9yeSA9IG5ldyBDbGFzc1JlcG9zaXRvcnkoZG9scGhpbik7XG4gICAgICAgIHZhciBiZWFuTWFuYWdlciA9IG5ldyBCZWFuTWFuYWdlcihjbGFzc1JlcG9zaXRvcnkpO1xuICAgICAgICB2YXIgY29ubmVjdG9yID0gbmV3IENvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKTtcbiAgICAgICAgdmFyIGNvbnRyb2xsZXJNYW5hZ2VyID0gbmV3IENvbnRyb2xsZXJNYW5hZ2VyKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKTtcblxuICAgICAgICB2YXIgY2xpZW50Q29udGV4dCA9IG5ldyBDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudENvbnRleHQ7XG4gICAgfVxufVxuXG5leHBvcnRzLkNsaWVudENvbnRleHRGYWN0b3J5ID0gQ2xpZW50Q29udGV4dEZhY3Rvcnk7IiwiaW1wb3J0IENsaWVudEF0dHJpYnV0ZSBmcm9tICcuL2NsaWVudEF0dHJpYnV0ZSdcbmltcG9ydCBDbGllbnRQcmVzZW50YXRpb25Nb2RlbCBmcm9tICcuL2NsaWVudFByZXNlbnRhdGlvbk1vZGVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnREb2xwaGluIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldENsaWVudENvbm5lY3RvcihjbGllbnRDb25uZWN0b3IpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IgPSBjbGllbnRDb25uZWN0b3I7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50Q29ubmVjdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRDb25uZWN0b3I7XG4gICAgfVxuXG4gICAgc2VuZChjb21tYW5kLCBvbkZpbmlzaGVkKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNlbmQoY29tbWFuZCwgb25GaW5pc2hlZCk7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IENsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpO1xuICAgIH1cblxuICAgIHByZXNlbnRhdGlvbk1vZGVsKGlkLCB0eXBlLCAuLi5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICBtb2RlbC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChtb2RlbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9XG5cbiAgICBzZXRDbGllbnRNb2RlbFN0b3JlKGNsaWVudE1vZGVsU3RvcmUpIHtcbiAgICAgICAgdGhpcy5jbGllbnRNb2RlbFN0b3JlID0gY2xpZW50TW9kZWxTdG9yZTtcbiAgICB9XG5cbiAgICBnZXRDbGllbnRNb2RlbFN0b3JlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRNb2RlbFN0b3JlO1xuICAgIH1cblxuICAgIGxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpO1xuICAgIH1cblxuICAgIGxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5saXN0UHJlc2VudGF0aW9uTW9kZWxzKCk7XG4gICAgfVxuXG4gICAgZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgfVxuXG4gICAgZ2V0QXQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgfVxuXG4gICAgZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgfVxuXG4gICAgZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWxUb0RlbGV0ZSkge1xuICAgICAgICB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbFRvRGVsZXRlLCB0cnVlKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllcihwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChzb3VyY2VBdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBdHRyaWJ1dGVRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQXR0cmlidXRlUXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIXNvdXJjZUF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCh0YXJnZXRBdHRyaWJ1dGUgPT4ge1xuICAgICAgICAgICAgdGFyZ2V0QXR0cmlidXRlLnNldFZhbHVlKHNvdXJjZUF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTsgLy8gc2hvdWxkIGFsd2F5cyBoYXZlIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXJ0UHVzaExpc3RlbmluZyhwdXNoQ29tbWFuZCwgcmVsZWFzZUNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaExpc3RlbmVyKHB1c2hDb21tYW5kKTtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UmVsZWFzZUNvbW1hbmQocmVsZWFzZUNvbW1hbmQpO1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoRW5hYmxlZCh0cnVlKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLmxpc3RlbigpO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICBzdG9wUHVzaExpc3RlbmluZygpIHtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQoZmFsc2UpO1xuICAgIH1cbn0iLCJpbXBvcnQgQXR0cmlidXRlIGZyb20gJy4vYXR0cmlidXRlJ1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vZXZlbnRCdXMnXG5pbXBvcnQgQ29tbWFuZEZhY3RvcnkgZnJvbSAnLi9jb21tYW5kcy9jb21tYW5kRmFjdG9yeSc7XG5pbXBvcnQge0FEREVEX1RZUEUsIFJFTU9WRURfVFlQRX0gZnJvbSAnLi9jb25zdGFudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudE1vZGVsU3RvcmUge1xuXG4gICAgY29uc3RydWN0b3IoY2xpZW50RG9scGhpbikge1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZCA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXMoKTtcbiAgICB9XG5cbiAgICBnZXRDbGllbnREb2xwaGluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnREb2xwaGluO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyQXR0cmlidXRlKGF0dHJpYnV0ZSkge1xuICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5SWQoYXR0cmlidXRlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdoZW5ldmVyIGFuIGF0dHJpYnV0ZSBjaGFuZ2VzIGl0cyB2YWx1ZSwgdGhlIHNlcnZlciBuZWVkcyB0byBiZSBub3RpZmllZFxuICAgICAgICAvLyBhbmQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgd2l0aCB0aGUgc2FtZSBxdWFsaWZpZXIgYXJlIGdpdmVuIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKChldnQpID0+IHtcbiAgICAgICAgICAgIGlmKGV2dC5uZXdWYWx1ZSAhPSBldnQub2xkVmFsdWUgJiYgZXZ0LnNlbmRUb1NlcnZlciA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IENvbW1hbmRGYWN0b3J5LmNyZWF0ZVZhbHVlQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlLmlkLCBldnQubmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKGNvbW1hbmQsIG51bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5maW5kQXR0cmlidXRlc0J5RmlsdGVyKChhdHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRyICE9PSBhdHRyaWJ1dGUgJiYgYXR0ci5nZXRRdWFsaWZpZXIoKSA9PSBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhdHRyLnNldFZhbHVlKGF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgYXR0cmlidXRlLm9uUXVhbGlmaWVyQ2hhbmdlKChldnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChhdHRyaWJ1dGUuaWQsIEF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFksIGV2dC5uZXdWYWx1ZSksIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGQobW9kZWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFscmVhZHkgaXMgYSBQTSB3aXRoIGlkIFwiICsgbW9kZWwuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhZGRlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5hZGRQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG5cbiAgICAgICAgICAgIGlmKHNlbmRUb1NlcnZlcikge1xuICAgICAgICAgICAgICAgIHZhciBjb25uZWN0b3IgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCk7XG4gICAgICAgICAgICAgICAgY29ubmVjdG9yLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKG1vZGVsKSwgbnVsbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMudHJpZ2dlcih7ICdldmVudFR5cGUnOiBBRERFRF9UWVBFLCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWRkZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5kZWxldGUobW9kZWwuaWQpO1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogUkVNT1ZFRF9UWVBFLCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIHJlbW92ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgIH1cblxuICAgIGZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIoZmlsdGVyKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmZvckVhY2goKG1vZGVsKSA9PiB7XG4gICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIoYXR0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGF0dHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfVxuXG4gICAgYWRkUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLnNldCh0eXBlLCBwcmVzZW50YXRpb25Nb2RlbHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHByZXNlbnRhdGlvbk1vZGVscy5pbmRleE9mKG1vZGVsKSA+IC0xKSkge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCB8fCAhKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVzZW50YXRpb25Nb2RlbHMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5zcGxpY2UocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmRlbGV0ZShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMua2V5cygpO1xuICAgICAgICB2YXIgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB3aGlsZSAoIW5leHQuZG9uZSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV4dC52YWx1ZSk7XG4gICAgICAgICAgICBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxzKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMudmFsdWVzKCk7XG4gICAgICAgIHZhciBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHdoaWxlICghbmV4dC5kb25lKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXh0LnZhbHVlKTtcbiAgICAgICAgICAgIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmdldChpZCk7XG4gICAgfVxuXG4gICAgZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgaWYgKCF0eXBlIHx8ICF0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuaGFzKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQodHlwZSkuc2xpY2UoMCk7IC8vIHNsaWNlIGlzIHVzZWQgdG8gY2xvbmUgdGhlIGFycmF5XG4gICAgfVxuXG4gICAgZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwsIG5vdGlmeSkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKG1vZGVsKTtcbiAgICAgICAgICAgIGlmICghbm90aWZ5IHx8IG1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChtb2RlbC5pZCksIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKGlkKTtcbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVCeUlkKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5oYXMoYXR0cmlidXRlLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkLnNldChhdHRyaWJ1dGUuaWQsIGF0dHJpYnV0ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIXRoaXMuYXR0cmlidXRlc1BlcklkLmhhcyhhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQuZGVsZXRlKGF0dHJpYnV0ZS5pZCk7XG4gICAgfVxuXG4gICAgZmluZEF0dHJpYnV0ZUJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlcklkLmdldChpZCk7XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuc2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSwgYXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3BsaWNlKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5kZWxldGUoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRBbGxBdHRyaWJ1dGVzQnlRdWFsaWZpZXIocXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICghcXVhbGlmaWVyIHx8ICF0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuaGFzKHF1YWxpZmllcikpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmdldChxdWFsaWZpZXIpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgIH1cblxuICAgIG9uTW9kZWxTdG9yZUNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbk1vZGVsU3RvcmVDaGFuZ2VGb3JUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KHBtU3RvcmVFdmVudCA9PiB7XG4gICAgICAgICAgICBpZiAocG1TdG9yZUV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9PSBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIocG1TdG9yZUV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9ldmVudEJ1cydcblxudmFyIHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCA9IDA7IC8vIHRvZG8gZGs6IGNvbnNpZGVyIG1ha2luZyB0aGlzIHN0YXRpYyBpbiBjbGFzc1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxUeXBlID0gcHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jbGllbnRTaWRlT25seSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2YgaWQgIT09ICd1bmRlZmluZWQnICYmIGlkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAocHJlc2VudGF0aW9uTW9kZWxJbnN0YW5jZUNvdW50KyspLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnZhbGlkQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgIH1cbiAgICAvLyB0b2RvIGRrOiBhbGlnbiB3aXRoIEphdmEgdmVyc2lvbjogbW92ZSB0byBDbGllbnREb2xwaGluIGFuZCBhdXRvLWFkZCB0byBtb2RlbCBzdG9yZVxuICAgIC8qKiBhIGNvcHkgY29uc3RydWN0b3IgZm9yIGFueXRoaW5nIGJ1dCBJRHMuIFBlciBkZWZhdWx0LCBjb3BpZXMgYXJlIGNsaWVudCBzaWRlIG9ubHksIG5vIGF1dG9tYXRpYyB1cGRhdGUgYXBwbGllcy4gKi9cbiAgICBjb3B5KCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKG51bGwsIHRoaXMucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgcmVzdWx0LmNsaWVudFNpZGVPbmx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlQ29weSA9IGF0dHJpYnV0ZS5jb3B5KCk7XG4gICAgICAgICAgICByZXN1bHQuYWRkQXR0cmlidXRlKGF0dHJpYnV0ZUNvcHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy9hZGQgYXJyYXkgb2YgYXR0cmlidXRlc1xuICAgIGFkZEF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXMgfHwgYXR0cmlidXRlcy5sZW5ndGggPCAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFkZEF0dHJpYnV0ZShhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgKHRoaXMuYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoYXR0cmlidXRlLnByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcHJvcGVydHkgbmFtZTogXCIgKyBhdHRyaWJ1dGUucHJvcGVydHlOYW1lXG4gICAgICAgICAgICAgICAgKyBcIiBpbiBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZDogXCIgKyB0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpICYmIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcXVhbGlmaWVyOiBcIiArIGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKVxuICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgYXR0cmlidXRlLnNldFByZXNlbnRhdGlvbk1vZGVsKHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRCdXMudHJpZ2dlcih7IHNvdXJjZTogdGhpcyB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uSW52YWxpZGF0ZWQoaGFuZGxlSW52YWxpZGF0ZSkge1xuICAgICAgICB0aGlzLmludmFsaWRCdXMub25FdmVudChoYW5kbGVJbnZhbGlkYXRlKTtcbiAgICB9XG4gICAgLyoqIHJldHVybnMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBzdGF0ZSAqL1xuICAgIGdldEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2xpY2UoMCk7XG4gICAgfVxuICAgIGdldEF0KHByb3BlcnR5TmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKTtcbiAgICB9XG4gICAgZmluZEFsbEF0dHJpYnV0ZXNCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCh0aGlzLmF0dHJpYnV0ZXNbaV0ucHJvcGVydHlOYW1lID09IHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kQXR0cmlidXRlQnlRdWFsaWZpZXIocXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICghcXVhbGlmaWVyKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmdldFF1YWxpZmllcigpID09IHF1YWxpZmllcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZpbmRBdHRyaWJ1dGVCeUlkKGlkKSB7XG4gICAgICAgIGlmICghaWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzeW5jV2l0aChzb3VyY2VQcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaCgodGFyZ2V0QXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICB2YXIgc291cmNlQXR0cmlidXRlID0gc291cmNlUHJlc2VudGF0aW9uTW9kZWwuZ2V0QXQodGFyZ2V0QXR0cmlidXRlLnByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICBpZiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0cmlidXRlLnN5bmNXaXRoKHNvdXJjZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBFbWl0dGVyIGZyb20gJ2VtaXR0ZXItY29tcG9uZW50JztcbmltcG9ydCBQcm9taXNlIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnknO1xuaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udGV4dHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuTWFuYWdlciwgJ2JlYW5NYW5hZ2VyJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck1hbmFnZXIsICdjb250cm9sbGVyTWFuYWdlcicpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuYmVhbk1hbmFnZXIgPSBiZWFuTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hbmFnZXIgPSBjb250cm9sbGVyTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5jb25uZWN0KCk7XG4gICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgfVxuXG4gICAgb25Db25uZWN0KCl7XG4gICAgICAgIGlmKGV4aXN0cyh0aGlzLmNvbm5lY3Rpb25Qcm9taXNlKSl7XG4gICAgICAgICAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xsZXIobmFtZSl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbHBoaW4uc3RvcFB1c2hMaXN0ZW5pbmcoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlci5kZXN0cm95KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmJlYW5NYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5FbWl0dGVyKENsaWVudENvbnRleHQucHJvdG90eXBlKTsiLCJpbXBvcnQge1ZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCwgUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRH0gZnJvbSAnLi9jb21tYW5kcy9jb21tYW5kQ29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxpbmRDb21tYW5kQmF0Y2hlciB7XG4gICAgY29uc3RydWN0b3IoZm9sZGluZyA9IHRydWUsIG1heEJhdGNoU2l6ZSA9IDUwKSB7XG4gICAgICAgIHRoaXMuZm9sZGluZyA9IGZvbGRpbmc7XG4gICAgICAgIHRoaXMubWF4QmF0Y2hTaXplID0gbWF4QmF0Y2hTaXplO1xuICAgIH1cbiAgICBiYXRjaChxdWV1ZSkge1xuICAgICAgICBsZXQgYmF0Y2ggPSBbXTtcbiAgICAgICAgbGV0IGJhdGNoTGVuZ3RoID0gMDtcbiAgICAgICAgd2hpbGUocXVldWVbYmF0Y2hMZW5ndGhdICYmIGJhdGNoTGVuZ3RoIDw9IHRoaXMubWF4QmF0Y2hTaXplKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gcXVldWVbYmF0Y2hMZW5ndGhdO1xuICAgICAgICAgICAgYmF0Y2hMZW5ndGgrKztcbiAgICAgICAgICAgIGlmKHRoaXMuZm9sZGluZykge1xuICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuY29tbWFuZC5pZCA9PSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQgJiZcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2gubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kLmlkID09IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCAmJlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNvbW1hbmQuYXR0cmlidXRlSWQgPT0gYmF0Y2hbYmF0Y2gubGVuZ3RoIC0gMV0uY29tbWFuZC5hdHRyaWJ1dGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAvL21lcmdlIFZhbHVlQ2hhbmdlIGZvciBzYW1lIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGJhdGNoW2JhdGNoLmxlbmd0aCAtIDFdLmNvbW1hbmQubmV3VmFsdWUgPSBlbGVtZW50LmNvbW1hbmQubmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQuY29tbWFuZC5pZCA9PSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vV2UgZG8gbm90IG5lZWQgaXQuLi5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmF0Y2gucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGVsZW1lbnQuaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlLnNwbGljZSgwLCBiYXRjaExlbmd0aCk7XG4gICAgICAgIHJldHVybiBiYXRjaDtcbiAgICB9XG59IiwiaW1wb3J0IHtleGlzdHMsIGNoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0pTX1NUUklOR19UWVBFfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgICBDUkVBVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQsXG4gICAgVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lELFxuICAgIEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQsXG4gICAgQ0FMTF9BQ1RJT05fQ09NTUFORF9JRCxcbiAgICBDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUQsXG4gICAgQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRCxcbiAgICBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lELFxuICAgIERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCxcbiAgICBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRCxcbiAgICBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCxcbiAgICBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQsXG4gICAgUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRCxcbiAgICBTVEFSVF9MT05HX1BPTExfQ09NTUFORF9JRFxufSBmcm9tICcuL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtJRCwgUE1fSUQsIFBNX1RZUEUsIFBNX0FUVFJJQlVURVMsIE5BTUUsIEFUVFJJQlVURV9JRCwgVkFMVUUsIENPTlRST0xMRVJfSUQsIFBBUkFNU30gZnJvbSAnLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCBWYWx1ZUNoYW5nZWRDb21tYW5kIGZyb20gJy4vaW1wbC92YWx1ZUNoYW5nZWRDb21tYW5kJztcbmltcG9ydCBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kIGZyb20gJy4vaW1wbC9hdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kJztcbmltcG9ydCBDYWxsQWN0aW9uQ29tbWFuZCBmcm9tICcuL2ltcGwvY2FsbEFjdGlvbkNvbW1hbmQnO1xuaW1wb3J0IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCBmcm9tICcuL2ltcGwvY2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kJztcbmltcG9ydCBDcmVhdGVDb250ZXh0Q29tbWFuZCBmcm9tICcuL2ltcGwvY3JlYXRlQ29udGV4dENvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQnO1xuaW1wb3J0IERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCBmcm9tICcuL2ltcGwvZGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kJztcbmltcG9ydCBEZXN0cm95Q29udGV4dENvbW1hbmQgZnJvbSAnLi9pbXBsL2Rlc3Ryb3lDb250ZXh0Q29tbWFuZCc7XG5pbXBvcnQgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vaW1wbC9kZXN0cm95Q29udHJvbGxlckNvbW1hbmQnO1xuaW1wb3J0IEludGVycnVwdExvbmdQb2xsQ29tbWFuZCBmcm9tICcuL2ltcGwvaW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kJztcbmltcG9ydCBQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kIGZyb20gJy4vaW1wbC9wcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kJztcbmltcG9ydCBTdGFydExvbmdQb2xsQ29tbWFuZCBmcm9tICcuL2ltcGwvc3RhcnRMb25nUG9sbENvbW1hbmQnO1xuaW1wb3J0IENvZGVjRXJyb3IgZnJvbSAnLi9jb2RlY0Vycm9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlYyB7XG5cbiAgICBzdGF0aWMgX2VuY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuYXR0cmlidXRlSWQsIFwiY29tbWFuZC5hdHRyaWJ1dGVJZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLm1ldGFkYXRhTmFtZSwgXCJjb21tYW5kLm1ldGFkYXRhTmFtZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXSA9IGNvbW1hbmQuYXR0cmlidXRlSWQ7XG4gICAgICAgIGpzb25Db21tYW5kW05BTUVdID0gY29tbWFuZC5tZXRhZGF0YU5hbWU7XG4gICAgICAgIGpzb25Db21tYW5kW1ZBTFVFXSA9IGNvbW1hbmQudmFsdWU7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0sIFwianNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtOQU1FXSwgXCJqc29uQ29tbWFuZFtOQU1FXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuYXR0cmlidXRlSWQgPSBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdO1xuICAgICAgICBjb21tYW5kLm1ldGFkYXRhTmFtZSA9IGpzb25Db21tYW5kW05BTUVdO1xuICAgICAgICBjb21tYW5kLnZhbHVlID0ganNvbkNvbW1hbmRbVkFMVUVdO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZUNhbGxBY3Rpb25Db21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5lbmNvZGVDYWxsQWN0aW9uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5jb250cm9sbGVyaWQsIFwiY29tbWFuZC5jb250cm9sbGVyaWRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hY3Rpb25OYW1lLCBcImNvbW1hbmQuYWN0aW9uTmFtZVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLnBhcmFtcywgXCJjb21tYW5kLnBhcmFtc1wiKTtcblxuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDQUxMX0FDVElPTl9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSA9IGNvbW1hbmQuY29udHJvbGxlcmlkO1xuICAgICAgICBqc29uQ29tbWFuZFtOQU1FXSA9IGNvbW1hbmQuYWN0aW9uTmFtZTtcbiAgICAgICAganNvbkNvbW1hbmRbUEFSQU1TXSA9IGNvbW1hbmQucGFyYW1zLm1hcCgocGFyYW0pID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgIHJlc3VsdFtOQU1FXSA9IHBhcmFtLm5hbWU7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHBhcmFtLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtWQUxVRV0gPSBwYXJhbS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDYWxsQWN0aW9uQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUNhbGxBY3Rpb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdLCBcImpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BBUkFNU10sIFwianNvbkNvbW1hbmRbUEFSQU1TXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDYWxsQWN0aW9uQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmNvbnRyb2xsZXJpZCA9IGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdO1xuICAgICAgICBjb21tYW5kLmFjdGlvbk5hbWUgPSBqc29uQ29tbWFuZFtOQU1FXTtcbiAgICAgICAgLy9UT0RPOiBGw7xyIGRpZSBQYXJhbXMgc29sbHRlbiB3aXIgZWluZSBLbGFzc2UgYmVyZWl0c3RlbGxlblxuICAgICAgICBjb21tYW5kLnBhcmFtcyA9IGpzb25Db21tYW5kW1BBUkFNU10ubWFwKChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6IHBhcmFtW05BTUVdLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhwYXJhbVtWQUxVRV0pID8gcGFyYW1bVkFMVUVdIDogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5lbmNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuYXR0cmlidXRlSWQsIFwiY29tbWFuZC5hdHRyaWJ1dGVJZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLm1ldGFkYXRhTmFtZSwgXCJjb21tYW5kLm1ldGFkYXRhTmFtZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdID0gY29tbWFuZC5hdHRyaWJ1dGVJZDtcbiAgICAgICAganNvbkNvbW1hbmRbTkFNRV0gPSBjb21tYW5kLm1ldGFkYXRhTmFtZTtcbiAgICAgICAganNvbkNvbW1hbmRbVkFMVUVdID0gY29tbWFuZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0sIFwianNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtOQU1FXSwgXCJqc29uQ29tbWFuZFtOQU1FXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVJZCA9IGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF07XG4gICAgICAgIGNvbW1hbmQubWV0YWRhdGFOYW1lID0ganNvbkNvbW1hbmRbTkFNRV07XG4gICAgICAgIGNvbW1hbmQudmFsdWUgPSBqc29uQ29tbWFuZFtWQUxVRV07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNyZWF0ZUNvbnRleHRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDcmVhdGVDb250ZXh0Q29tbWFuZCgpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZW5jb2RlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuY29udHJvbGxlck5hbWUsIFwiY29tbWFuZC5jb250cm9sbGVyTmFtZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ1JFQVRFX0NPTlRST0xMRVJfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbTkFNRV0gPSBjb21tYW5kLmNvbnRyb2xsZXJOYW1lO1xuICAgICAgICBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSA9IGNvbW1hbmQucGFyZW50Q29udHJvbGxlcklkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtOQU1FXSwgXCJqc29uQ29tbWFuZFtOQU1FXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSwgXCJqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDcmVhdGVDb250cm9sbGVyQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmNvbnRyb2xsZXJOYW1lID0ganNvbkNvbW1hbmRbTkFNRV07XG4gICAgICAgIGNvbW1hbmQucGFyZW50Q29udHJvbGxlcklkID0ganNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucG1JZCwgXCJjb21tYW5kLnBtSWRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5wbVR5cGUsIFwiY29tbWFuZC5wbVR5cGVcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbUE1fSURdID0gY29tbWFuZC5wbUlkO1xuICAgICAgICBqc29uQ29tbWFuZFtQTV9UWVBFXSA9IGNvbW1hbmQucG1UeXBlO1xuICAgICAgICBqc29uQ29tbWFuZFtQTV9BVFRSSUJVVEVTXSA9IGNvbW1hbmQuYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgcmVzdWx0W05BTUVdID0gYXR0cmlidXRlLnByb3BlcnR5TmFtZTtcbiAgICAgICAgICAgIHJlc3VsdFtBVFRSSUJVVEVfSURdID0gYXR0cmlidXRlLmlkO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhhdHRyaWJ1dGUudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W1ZBTFVFXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbUE1fSURdLCBcImpzb25Db21tYW5kW1BNX0lEXVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtQTV9UWVBFXSwgXCJqc29uQ29tbWFuZFtQTV9UWVBFXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5wbUlkID0ganNvbkNvbW1hbmRbUE1fSURdO1xuICAgICAgICBjb21tYW5kLnBtVHlwZSA9IGpzb25Db21tYW5kW1BNX1RZUEVdO1xuXG4gICAgICAgIC8vVE9ETzogRsO8ciBkaWUgQXR0cmlidXRlIHNvbGx0ZW4gd2lyIGVpbmUgS2xhc3NlIGJlcmVpdHN0ZWxsZW5cbiAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVzID0ganNvbkNvbW1hbmRbUE1fQVRUUklCVVRFU10ubWFwKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3Byb3BlcnR5TmFtZSc6IGF0dHJpYnV0ZVtOQU1FXSxcbiAgICAgICAgICAgICAgICAnaWQnOiBhdHRyaWJ1dGVbQVRUUklCVVRFX0lEXSxcbiAgICAgICAgICAgICAgICAndmFsdWUnOiBleGlzdHMoYXR0cmlidXRlW1ZBTFVFXSkgPyBhdHRyaWJ1dGVbVkFMVUVdIDogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZW5jb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLnBtSWQsIFwiY29tbWFuZC5wbUlkXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX0lEXSA9IGNvbW1hbmQucG1JZDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtQTV9JRF0sIFwianNvbkNvbW1hbmRbUE1fSURdXCIpO1xuXG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQucG1JZCA9IGpzb25Db21tYW5kW1BNX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVEZXN0cm95Q29udGV4dENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVEZXN0cm95Q29udGV4dENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlRGVzdHJveUNvbnRleHRDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBEZXN0cm95Q29udGV4dENvbW1hbmQoKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuY29udHJvbGxlcklkLCBcImNvbW1hbmQuY29udHJvbGxlcklkXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF0gPSBjb21tYW5kLmNvbnRyb2xsZXJJZDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSwgXCJqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5jb250cm9sbGVySWQgPSBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZVByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucG1JZCwgXCJjb21tYW5kLnBtSWRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IFBSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX0lEXSA9IGNvbW1hbmQucG1JZDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BNX0lEXSwgXCJqc29uQ29tbWFuZFtQTV9JRF1cIik7XG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLnBtSWQgPSBqc29uQ29tbWFuZFtQTV9JRF07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlU3RhcnRMb25nUG9sbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVTdGFydExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVTdGFydExvbmdQb2xsQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9kZWNvZGVTdGFydExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBTdGFydExvbmdQb2xsQ29tbWFuZCgpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQuYXR0cmlidXRlSWQsIFwiY29tbWFuZC5hdHRyaWJ1dGVJZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdID0gY29tbWFuZC5hdHRyaWJ1dGVJZDtcbiAgICAgICAgaWYgKGV4aXN0cyhjb21tYW5kLm5ld1ZhbHVlKSkge1xuICAgICAgICAgICAganNvbkNvbW1hbmRbVkFMVUVdID0gY29tbWFuZC5uZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdLCBcImpzb25Db21tYW5kW0FUVFJJQlVURV9JRF1cIik7XG5cbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgVmFsdWVDaGFuZ2VkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmF0dHJpYnV0ZUlkID0ganNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXTtcbiAgICAgICAgaWYgKGV4aXN0cyhqc29uQ29tbWFuZFtWQUxVRV0pKSB7XG4gICAgICAgICAgICBjb21tYW5kLm5ld1ZhbHVlID0ganNvbkNvbW1hbmRbVkFMVUVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tbWFuZC5uZXdWYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGVuY29kZShjb21tYW5kcykge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZVwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kcywgXCJjb21tYW5kc1wiKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShjb21tYW5kcy5tYXAoKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09PSBBVFRSSUJVVEVfTUVUQURBVEFfQ0hBTkdFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENBTExfQUNUSU9OX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQ2FsbEFjdGlvbkNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9DT05URVhUX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZVByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvZGVjRXJyb3IoJ0NvbW1hbmQgb2YgdHlwZSAnICsgY29tbWFuZC5pZCArICcgY2FuIG5vdCBiZSBoYW5kbGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVjb2RlKHRyYW5zbWl0dGVkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlXCIpO1xuICAgICAgICBjaGVja1BhcmFtKHRyYW5zbWl0dGVkLCBcInRyYW5zbWl0dGVkXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdHJhbnNtaXR0ZWQgPT09IEpTX1NUUklOR19UWVBFKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0cmFuc21pdHRlZCkubWFwKGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09IEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBDQUxMX0FDVElPTl9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDYWxsQWN0aW9uQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQ3JlYXRlQ29udGV4dENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlRGVzdHJveUNvbnRleHRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVTdGFydExvbmdQb2xsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZWNFcnJvcignQ29tbWFuZCBvZiB0eXBlICcgKyBjb21tYW5kLmlkICsgJyBjYW4gbm90IGJlIGhhbmRsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBDb2RlY0Vycm9yKCdDYW4gbm90IGRlY29kZSBkYXRhIHRoYXQgaXMgbm90IG9mIHR5cGUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZWNFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIH1cbn0iLCJleHBvcnQgY29uc3QgQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRCA9ICdBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWQnO1xuZXhwb3J0IGNvbnN0IENBTExfQUNUSU9OX0NPTU1BTkRfSUQgPSAnQ2FsbEFjdGlvbic7XG5leHBvcnQgY29uc3QgQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEID0gJ0NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhJztcbmV4cG9ydCBjb25zdCBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEID0gJ0NyZWF0ZUNvbnRleHQnO1xuZXhwb3J0IGNvbnN0IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQgPSAnQ3JlYXRlQ29udHJvbGxlcic7XG5leHBvcnQgY29uc3QgQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEID0gJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJztcbmV4cG9ydCBjb25zdCBERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQgPSAnRGVsZXRlUHJlc2VudGF0aW9uTW9kZWwnO1xuZXhwb3J0IGNvbnN0IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEID0gJ0Rlc3Ryb3lDb250ZXh0JztcbmV4cG9ydCBjb25zdCBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCA9ICdEZXN0cm95Q29udHJvbGxlcic7XG5leHBvcnQgY29uc3QgSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX0lEID0gJ0ludGVycnVwdExvbmdQb2xsJztcbmV4cG9ydCBjb25zdCBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEID0gJ1ByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZCc7XG5leHBvcnQgY29uc3QgU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQgPSAnU3RhcnRMb25nUG9sbCc7XG5leHBvcnQgY29uc3QgVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEID0gJ1ZhbHVlQ2hhbmdlZCc7XG5cbmV4cG9ydCBjb25zdCBJRCA9IFwiaWRcIjtcbmV4cG9ydCBjb25zdCBBVFRSSUJVVEVfSUQgPSBcImFfaWRcIjtcbmV4cG9ydCBjb25zdCBQTV9JRCA9IFwicF9pZFwiO1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSUQgPSBcImNfaWRcIjtcbmV4cG9ydCBjb25zdCBQTV9UWVBFID0gXCJ0XCI7XG5leHBvcnQgY29uc3QgTkFNRSA9IFwiblwiO1xuZXhwb3J0IGNvbnN0IFZBTFVFID0gXCJ2XCI7XG5leHBvcnQgY29uc3QgUEFSQU1TID0gXCJwXCI7XG5leHBvcnQgY29uc3QgUE1fQVRUUklCVVRFUyA9IFwiYVwiOyIsImltcG9ydCBDcmVhdGVDb250ZXh0Q29tbWFuZCBmcm9tICcuL2ltcGwvY3JlYXRlQ29udGV4dENvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgQ2FsbEFjdGlvbkNvbW1hbmQgZnJvbSAnLi9pbXBsL2NhbGxBY3Rpb25Db21tYW5kJztcbmltcG9ydCBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9pbXBsL2Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgRGVzdHJveUNvbnRleHRDb21tYW5kIGZyb20gJy4vaW1wbC9kZXN0cm95Q29udGV4dENvbW1hbmQnO1xuaW1wb3J0IFN0YXJ0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9zdGFydExvbmdQb2xsQ29tbWFuZCc7XG5pbXBvcnQgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9pbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCBmcm9tICcuL2ltcGwvY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kJztcbmltcG9ydCBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgZnJvbSAnLi9pbXBsL2RlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCc7XG5pbXBvcnQgUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCBmcm9tICcuL2ltcGwvcHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCc7XG5pbXBvcnQgVmFsdWVDaGFuZ2VkQ29tbWFuZCBmcm9tICcuL2ltcGwvdmFsdWVDaGFuZ2VkQ29tbWFuZCc7XG5pbXBvcnQgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kIGZyb20gJy4vaW1wbC9jaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQnO1xuaW1wb3J0IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9pbXBsL2F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kRmFjdG9yeSB7XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlQ29udGV4dENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQ29udGV4dENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ2FsbEFjdGlvbkNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGNvbnRyb2xsZXJpZCwgYWN0aW9uTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb250cm9sbGVySWQpIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGNvbnRyb2xsZXJJZCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGVzdHJveUNvbnRleHRDb21tYW5kKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0YXJ0TG9uZ1BvbGxDb21tYW5kKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChwcmVzZW50YXRpb25Nb2RlbCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocG1JZCkge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQocG1JZCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKHBtSWQpIHtcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQocG1JZCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVWYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZUlkLCBuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBWYWx1ZUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChhdHRyaWJ1dGVJZCwgbmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cbn0iLCJpbXBvcnQge0FUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGF0dHJpYnV0ZUlkLCAnYXR0cmlidXRlSWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtZXRhZGF0YU5hbWUsICdtZXRhZGF0YU5hbWUnKTtcblxuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufSIsImltcG9ydCB7Q0FMTF9BQ1RJT05fQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGxBY3Rpb25Db21tYW5kIHtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENBTExfQUNUSU9OX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICBjaGVja01ldGhvZCgnQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcmlkLCAnY29udHJvbGxlcmlkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJpZCA9IGNvbnRyb2xsZXJpZDtcbiAgICAgICAgdGhpcy5hY3Rpb25OYW1lID0gYWN0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGF0dHJpYnV0ZUlkLCAnYXR0cmlidXRlSWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtZXRhZGF0YU5hbWUsICdtZXRhZGF0YU5hbWUnKTtcblxuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufSIsImltcG9ydCB7Q1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUNvbnRleHRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0NSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVDb250cm9sbGVyQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChjb250cm9sbGVyTmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVDb250cm9sbGVyQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyTmFtZSwgJ2NvbnRyb2xsZXJOYW1lJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVyTmFtZSA9IGNvbnRyb2xsZXJOYW1lO1xuICAgICAgICB0aGlzLnBhcmVudENvbnRyb2xsZXJJZCA9IHBhcmVudENvbnRyb2xsZXJJZDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0NSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJlc2VudGF0aW9uTW9kZWwsICdwcmVzZW50YXRpb25Nb2RlbCcpO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNsaWVudFNpZGVPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucG1JZCA9IHByZXNlbnRhdGlvbk1vZGVsLmlkO1xuICAgICAgICB0aGlzLnBtVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgdmFyIGNvbW1hbmQgPSB0aGlzO1xuICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogYXR0ci5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgaWQ6IGF0dHIuaWQsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGF0dHIuZ2V0VmFsdWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQge0RFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KHBtSWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0RlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShwbUlkLCAncG1JZCcpO1xuXG4gICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlc3Ryb3lDb250ZXh0Q29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEO1xuICAgIH1cblxufSIsImltcG9ydCB7REVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGNvbnRyb2xsZXJJZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJJZCwgJ2NvbnRyb2xsZXJJZCcpO1xuXG4gICAgICAgIHRoaXMuY29udHJvbGxlcklkID0gY29udHJvbGxlcklkO1xuICAgIH1cblxufSIsImltcG9ydCB7SU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBJTlRFUlJVUFRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgfVxufSIsImltcG9ydCB7UFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQocG1JZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShwbUlkLCAncG1JZCcpO1xuXG4gICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgfVxufSIsImltcG9ydCB7U1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXJ0TG9uZ1BvbGxDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWYWx1ZUNoYW5nZWRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQoYXR0cmlidXRlSWQsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdWYWx1ZUNoYW5nZWRDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGF0dHJpYnV0ZUlkLCAnYXR0cmlidXRlSWQnKTtcblxuICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgIHRoaXMubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG59IiwiaW1wb3J0IFByb21pc2UgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnknO1xuaW1wb3J0IHtBRERFRF9UWVBFLCBSRU1PVkVEX1RZUEV9IGZyb20gJy4vY29uc3RhbnRzJztcblxuXG5jb25zdCBET0xQSElOX0JFQU4gPSAnQEBAIERPTFBISU5fQkVBTiBAQEAnO1xuY29uc3QgQUNUSU9OX0NBTExfQkVBTiA9ICdAQEAgQ09OVFJPTExFUl9BQ1RJT05fQ0FMTF9CRUFOIEBAQCc7XG5jb25zdCBISUdITEFOREVSX0JFQU4gPSAnQEBAIEhJR0hMQU5ERVJfQkVBTiBAQEAnO1xuY29uc3QgRE9MUEhJTl9MSVNUX1NQTElDRSA9ICdARFA6TFNAJztcbmNvbnN0IFNPVVJDRV9TWVNURU0gPSAnQEBAIFNPVVJDRV9TWVNURU0gQEBAJztcbmNvbnN0IFNPVVJDRV9TWVNURU1fQ0xJRU5UID0gJ2NsaWVudCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNX1NFUlZFUiA9ICdzZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0b3J7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh1cmwsICd1cmwnKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgc2VsZi5oaWdobGFuZGVyUE1SZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLm9uTW9kZWxTdG9yZUNoYW5nZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IGV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICAgICAgbGV0IHNvdXJjZVN5c3RlbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShTT1VSQ0VfU1lTVEVNKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoc291cmNlU3lzdGVtKSAmJiBzb3VyY2VTeXN0ZW0udmFsdWUgPT09IFNPVVJDRV9TWVNURU1fU0VSVkVSKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmV2ZW50VHlwZSA9PT0gQURERURfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxBZGRlZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5ldmVudFR5cGUgPT09IFJFTU9WRURfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxSZW1vdmVkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25uZWN0KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB0aGF0LmRvbHBoaW4uc3RhcnRQdXNoTGlzdGVuaW5nKENvbW1hbmRGYWN0b3J5LmNyZWF0ZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKCksIENvbW1hbmRGYWN0b3J5LmNyZWF0ZUludGVycnVwdExvbmdQb2xsQ29tbWFuZCgpKTtcbiAgICB9XG5cbiAgICBvbk1vZGVsQWRkZWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5vbk1vZGVsQWRkZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQUNUSU9OX0NBTExfQkVBTjpcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBISUdITEFOREVSX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlcihtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW9kZWxSZW1vdmVkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3Iub25Nb2RlbFJlbW92ZWQobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICBsZXQgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0xJU1RfU1BMSUNFOlxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGludm9rZShjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IuaW52b2tlKGNvbW1hbmQpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgJ2NvbW1hbmQnKTtcblxuICAgICAgICB2YXIgZG9scGhpbiA9IHRoaXMuZG9scGhpbjtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBkb2xwaGluLnNlbmQoY29tbWFuZCwge1xuICAgICAgICAgICAgICAgIG9uRmluaXNoZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRIaWdobGFuZGVyUE0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2U7XG4gICAgfVxufVxuXG5leHBvcnRzLlNPVVJDRV9TWVNURU0gPSBTT1VSQ0VfU1lTVEVNO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX0NMSUVOVCA9IFNPVVJDRV9TWVNURU1fQ0xJRU5UO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX1NFUlZFUiA9IFNPVVJDRV9TWVNURU1fU0VSVkVSO1xuZXhwb3J0cy5BQ1RJT05fQ0FMTF9CRUFOID0gQUNUSU9OX0NBTExfQkVBTjtcbiIsImV4cG9ydCBjb25zdCBKU19TVFJJTkdfVFlQRSA9ICdzdHJpbmcnO1xuXG5leHBvcnQgY29uc3QgRE9MUEhJTl9CRUFOID0gMDtcbmV4cG9ydCBjb25zdCBCWVRFID0gMTtcbmV4cG9ydCBjb25zdCBTSE9SVCA9IDI7XG5leHBvcnQgY29uc3QgSU5UID0gMztcbmV4cG9ydCBjb25zdCBMT05HID0gNDtcbmV4cG9ydCBjb25zdCBGTE9BVCA9IDU7XG5leHBvcnQgY29uc3QgRE9VQkxFID0gNjtcbmV4cG9ydCBjb25zdCBCT09MRUFOID0gNztcbmV4cG9ydCBjb25zdCBTVFJJTkcgPSA4O1xuZXhwb3J0IGNvbnN0IERBVEUgPSA5O1xuZXhwb3J0IGNvbnN0IEVOVU0gPSAxMDtcbmV4cG9ydCBjb25zdCBDQUxFTkRBUiA9IDExO1xuZXhwb3J0IGNvbnN0IExPQ0FMX0RBVEVfRklFTERfVFlQRSA9IDU1O1xuZXhwb3J0IGNvbnN0IExPQ0FMX0RBVEVfVElNRV9GSUVMRF9UWVBFID0gNTI7XG5leHBvcnQgY29uc3QgWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEUgPSA1NDtcblxuXG5leHBvcnQgY29uc3QgQURERURfVFlQRSA9IFwiQURERURcIjtcbmV4cG9ydCBjb25zdCBSRU1PVkVEX1RZUEUgPSBcIlJFTU9WRURcIjtcbiIsImltcG9ydCBQcm9taXNlIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IFNldCBmcm9tJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5pbXBvcnQgQ29udHJvbGxlclByb3h5IGZyb20gJy4vY29udHJvbGxlcnByb3h5LmpzJztcblxuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnkuanMnO1xuXG5cbmltcG9ydCB7IFNPVVJDRV9TWVNURU0gfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgeyBTT1VSQ0VfU1lTVEVNX0NMSUVOVCB9IGZyb20gJy4vY29ubmVjdG9yLmpzJztcbmltcG9ydCB7IEFDVElPTl9DQUxMX0JFQU4gfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5cbmNvbnN0IENPTlRST0xMRVJfSUQgPSAnY29udHJvbGxlcklkJztcbmNvbnN0IE1PREVMID0gJ21vZGVsJztcbmNvbnN0IEVSUk9SX0NPREUgPSAnZXJyb3JDb2RlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlck1hbmFnZXJ7XG5cbiAgICBjb25zdHJ1Y3Rvcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3Rvcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlcihkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbm5lY3RvciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmNvbm5lY3RvciA9IGNvbm5lY3RvcjtcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250cm9sbGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgbnVsbClcbiAgICB9XG5cbiAgICBfY3JlYXRlQ29udHJvbGxlcihuYW1lLCBwYXJlbnRDb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJJZCwgbW9kZWxJZCwgbW9kZWwsIGNvbnRyb2xsZXI7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuZ2V0SGlnaGxhbmRlclBNKCkudGhlbigoaGlnaGxhbmRlclBNKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKG5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVySWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsSWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKE1PREVMKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IHNlbGYuY2xhc3NSZXBvc2l0b3J5Lm1hcERvbHBoaW5Ub0JlYW4obW9kZWxJZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlclByb3h5KGNvbnRyb2xsZXJJZCwgbW9kZWwsIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnRyb2xsZXJzLmFkZChjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbnZva2VBY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmludm9rZUFjdGlvbihjb250cm9sbGVySWQsIGFjdGlvbk5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xuXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKFNPVVJDRV9TWVNURU0sIG51bGwsIFNPVVJDRV9TWVNURU1fQ0xJRU5UKSxcbiAgICAgICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKEVSUk9SX0NPREUpXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBsZXQgcG0gPSBzZWxmLmRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoc2VsZi5kb2xwaGluLCBbbnVsbCwgQUNUSU9OX0NBTExfQkVBTl0uY29uY2F0KGF0dHJpYnV0ZXMpKTtcblxuICAgICAgICAgICAgbGV0IGFjdGlvblBhcmFtcyA9IFtdO1xuICAgICAgICAgICAgaWYoZXhpc3RzKHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwYXJhbSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwYXJhbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHNlbGYuY2xhc3NSZXBvc2l0b3J5Lm1hcFBhcmFtVG9Eb2xwaGluKHBhcmFtc1twYXJhbV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uUGFyYW1zLnB1c2goe25hbWU6IHBhcmFtLCB2YWx1ZTogdmFsdWV9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNhbGxBY3Rpb25Db21tYW5kKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgYWN0aW9uUGFyYW1zKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGlzRXJyb3IgPSBwbS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoRVJST1JfQ09ERSkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiU2VydmVyIHNpZGUgQ29udHJvbGxlckFjdGlvbiBcIiArIGFjdGlvbk5hbWUgKyBcIiBjYXVzZWQgYW4gZXJyb3IuIFBsZWFzZSBzZWUgc2VydmVyIGxvZyBmb3IgZGV0YWlscy5cIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKHBtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5kZXN0cm95Q29udHJvbGxlcihjb250cm9sbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXIsICdjb250cm9sbGVyJyk7XG5cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udHJvbGxlcnMuZGVsZXRlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgICAgIGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9JRCkuc2V0VmFsdWUoY29udHJvbGxlci5jb250cm9sbGVySWQpO1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlci5nZXRJZCgpKSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBsZXQgY29udHJvbGxlcnNDb3B5ID0gdGhpcy5jb250cm9sbGVycztcbiAgICAgICAgbGV0IHByb21pc2VzID0gW107XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGNvbnRyb2xsZXJzQ29weS5mb3JFYWNoKChjb250cm9sbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goY29udHJvbGxlci5kZXN0cm95KCkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgU2V0IGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCc7XG5pbXBvcnQge2NoZWNrTWV0aG9kLCBjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlclByb3h5e1xuXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlcil7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obWFuYWdlciwgJ21hbmFnZXInKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJJZCA9IGNvbnRyb2xsZXJJZDtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgZ2V0TW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsO1xuICAgIH1cblxuICAgIGdldElkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVySWQ7XG4gICAgfVxuXG4gICAgaW52b2tlKG5hbWUsIHBhcmFtcyl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkuaW52b2tlKG5hbWUsIHBhcmFtcyknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmludm9rZUFjdGlvbih0aGlzLmNvbnRyb2xsZXJJZCwgbmFtZSwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb250cm9sbGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5fY3JlYXRlQ29udHJvbGxlcihuYW1lLCB0aGlzLmdldElkKCkpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKXtcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb250cm9sbGVyIHdhcyBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25EZXN0cm95ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5kZXN0cm95Q29udHJvbGxlcih0aGlzKTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3llZChoYW5kbGVyKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJQcm94eS5vbkRlc3Ryb3llZChoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMuYWRkKGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLm9uRGVzdHJveWVkSGFuZGxlcnMuZGVsZXRlKGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCBDbGllbnRDb25uZWN0b3IgZnJvbSAnLi9jbGllbnRDb25uZWN0b3InXG5pbXBvcnQgQ2xpZW50RG9scGhpbiBmcm9tICcuL2NsaWVudERvbHBoaW4nXG5pbXBvcnQgQ2xpZW50TW9kZWxTdG9yZSBmcm9tICcuL2NsaWVudE1vZGVsU3RvcmUnXG5pbXBvcnQgSHR0cFRyYW5zbWl0dGVyIGZyb20gJy4vaHR0cFRyYW5zbWl0dGVyJ1xuaW1wb3J0IE5vVHJhbnNtaXR0ZXIgZnJvbSAnLi9ub1RyYW5zbWl0dGVyJ1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbHBoaW5CdWlsZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0XyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNsYWNrTVNfID0gMzAwO1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSA1MDtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBmYWxzZTtcbiAgICB9XG5cbiAgICB1cmwodXJsKSB7XG4gICAgICAgIHRoaXMudXJsXyA9IHVybDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVzZXQocmVzZXQpIHtcbiAgICAgICAgdGhpcy5yZXNldF8gPSByZXNldDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2xhY2tNUyhzbGFja01TKSB7XG4gICAgICAgIHRoaXMuc2xhY2tNU18gPSBzbGFja01TO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtYXhCYXRjaFNpemUobWF4QmF0Y2hTaXplKSB7XG4gICAgICAgIHRoaXMubWF4QmF0Y2hTaXplXyA9IG1heEJhdGNoU2l6ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3VwcG9ydENPUlMoc3VwcG9ydENPUlMpIHtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBzdXBwb3J0Q09SUztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZXJyb3JIYW5kbGVyKGVycm9ySGFuZGxlcikge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlcl8gPSBlcnJvckhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcnNJbmZvKGhlYWRlcnNJbmZvKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm9fID0gaGVhZGVyc0luZm87XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW5Eb2xwaGluIGpzIGZvdW5kXCIpO1xuICAgICAgICB2YXIgY2xpZW50RG9scGhpbiA9IG5ldyBDbGllbnREb2xwaGluKCk7XG4gICAgICAgIHZhciB0cmFuc21pdHRlcjtcbiAgICAgICAgaWYgKHRoaXMudXJsXyAhPSBudWxsICYmIHRoaXMudXJsXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBIdHRwVHJhbnNtaXR0ZXIodGhpcy51cmxfLCB0aGlzLnJlc2V0XywgXCJVVEYtOFwiLCB0aGlzLmVycm9ySGFuZGxlcl8sIHRoaXMuc3VwcG9ydENPUlNfLCB0aGlzLmhlYWRlcnNJbmZvXyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBOb1RyYW5zbWl0dGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRDb25uZWN0b3IobmV3IENsaWVudENvbm5lY3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgdGhpcy5zbGFja01TXywgdGhpcy5tYXhCYXRjaFNpemVfKSk7XG4gICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50TW9kZWxTdG9yZShuZXcgQ2xpZW50TW9kZWxTdG9yZShjbGllbnREb2xwaGluKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50RG9scGhpbiBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudERvbHBoaW47XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBEb2xwaGluUmVtb3RpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdSZW1vdGluZyBFcnJvcicsIGRldGFpbCkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMuZGV0YWlsID0gZGV0YWlsIHx8IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9scGhpblNlc3Npb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdTZXNzaW9uIEVycm9yJykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIdHRwUmVzcG9uc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdIdHRwIFJlc3BvbnNlIEVycm9yJykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIdHRwTmV0d29ya0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UgPSAnSHR0cCBOZXR3b3JrIEVycm9yJykge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRCdXMge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycyA9IFtdO1xuICAgIH1cblxuICAgIG9uRXZlbnQoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfVxuXG4gICAgdHJpZ2dlcihldmVudCkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMuZm9yRWFjaChoYW5kbGUgPT4gaGFuZGxlKGV2ZW50KSk7XG4gICAgfVxufSIsImltcG9ydCBDb2RlYyBmcm9tICcuL2NvbW1hbmRzL2NvZGVjJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdHRwVHJhbnNtaXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IodXJsLCByZXNldCA9IHRydWUsIGNoYXJzZXQgPSBcIlVURi04XCIsIGVycm9ySGFuZGxlciA9IG51bGwsIHN1cHBvcnRDT1JTID0gZmFsc2UsIGhlYWRlcnNJbmZvID0gbnVsbCkge1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5jaGFyc2V0ID0gY2hhcnNldDtcbiAgICAgICAgdGhpcy5IdHRwQ29kZXMgPSB7XG4gICAgICAgICAgICBmaW5pc2hlZDogNCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IDIwMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlciA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SUyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICB0aGlzLmhlYWRlcnNJbmZvID0gaGVhZGVyc0luZm87XG4gICAgICAgIHRoaXMuaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLnNpZyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICBpZiAodGhpcy5zdXBwb3J0Q09SUykge1xuICAgICAgICAgICAgaWYgKFwid2l0aENyZWRlbnRpYWxzXCIgaW4gdGhpcy5odHRwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7IC8vIE5PVEU6IGRvaW5nIHRoaXMgZm9yIG5vbiBDT1JTIHJlcXVlc3RzIGhhcyBubyBpbXBhY3RcbiAgICAgICAgICAgICAgICB0aGlzLnNpZy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29kZWMgPSBuZXcgQ29kZWMoKTtcbiAgICAgICAgaWYgKHJlc2V0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSHR0cFRyYW5zbWl0dGVyLmludmFsaWRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2UgQ2xpZW50RG9scGhpbi5yZXNldChPblN1Y2Nlc3NIYW5kbGVyKSBpbnN0ZWFkJyk7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zbWl0KGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgdGhpcy5odHRwLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdvbmVycm9yJywgXCJcIik7XG4gICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaHR0cC5yZWFkeVN0YXRlID09IHRoaXMuSHR0cENvZGVzLmZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaHR0cC5zdGF0dXMgPT0gdGhpcy5IdHRwQ29kZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VUZXh0ID0gdGhpcy5odHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVGV4dC50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VDb21tYW5kcyA9IHRoaXMuY29kZWMuZGVjb2RlKHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKHJlc3BvbnNlQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXJyZWQgcGFyc2luZyByZXNwb25zZVRleHQ6IFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5jb3JyZWN0IHJlc3BvbnNlVGV4dDogXCIsIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogSW5jb3JyZWN0IHJlc3BvbnNlVGV4dDogXCIgKyByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBlbXB0eSByZXNwb25zZVRleHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBIVFRQIFN0YXR1cyAhPSAyMDBcIik7XG4gICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmh0dHAub3BlbignUE9TVCcsIHRoaXMudXJsLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKHRoaXMuaHR0cCk7XG4gICAgICAgIGlmIChcIm92ZXJyaWRlTWltZVR5cGVcIiBpbiB0aGlzLmh0dHApIHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1cIiArIHRoaXMuY2hhcnNldCk7IC8vIHRvZG8gbWFrZSBpbmplY3RhYmxlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5odHRwLnNlbmQodGhpcy5jb2RlYy5lbmNvZGUoY29tbWFuZHMpKTtcbiAgICB9XG5cbiAgICBzZXRIZWFkZXJzKGh0dHBSZXEpIHtcbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhlYWRlcnNJbmZvLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcihpLCB0aGlzLmhlYWRlcnNJbmZvW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVFcnJvcihraW5kLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBlcnJvckV2ZW50ID0geyBraW5kOiBraW5kLCB1cmw6IHRoaXMudXJsLCBodHRwU3RhdHVzOiB0aGlzLmh0dHAuc3RhdHVzLCBtZXNzYWdlOiBtZXNzYWdlIH07XG4gICAgICAgIGlmICh0aGlzLmVycm9ySGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIoZXJyb3JFdmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VycmVkOiBcIiwgZXJyb3JFdmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaWduYWwoY29tbWFuZCkge1xuICAgICAgICB0aGlzLnNpZy5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICB0aGlzLnNldEhlYWRlcnModGhpcy5zaWcpO1xuICAgICAgICB0aGlzLnNpZy5zZW5kKHRoaXMuY29kZWMuZW5jb2RlKFtjb21tYW5kXSkpO1xuICAgIH1cblxuICAgIGludmFsaWRhdGUoKSB7XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwgKyAnaW52YWxpZGF0ZT8nLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuaHR0cC5zZW5kKCk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vVHJhbnNtaXR0ZXIge1xuXG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nIHNwZWNpYWxcbiAgICAgICAgb25Eb25lKFtdKTtcbiAgICB9XG5cbiAgICBzaWduYWwoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH1cbn0iLCJpbXBvcnQgRG9scGhpbkJ1aWxkZXIgZnJvbSAnLi9kb2xwaGluQnVpbGRlcidcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbHBoaW4odXJsLCByZXNldCwgc2xhY2tNUyA9IDMwMCkge1xuICAgIHJldHVybiBtYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KHJlc2V0KS5zbGFja01TKHNsYWNrTVMpLmJ1aWxkKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRG9scGhpbigpIHtcbiAgICByZXR1cm4gbmV3IERvbHBoaW5CdWlsZGVyKCk7XG59IiwiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZW1pdHRlci1jb21wb25lbnQnO1xuXG5cbmltcG9ydCB7IGV4aXN0cyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRG9scGhpblJlbW90aW5nRXJyb3IsIEh0dHBOZXR3b3JrRXJyb3IsIERvbHBoaW5TZXNzaW9uRXJyb3IsIEh0dHBSZXNwb25zZUVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IENvZGVjIGZyb20gJy4vY29tbWFuZHMvY29kZWMnO1xuaW1wb3J0IFJlbW90aW5nRXJyb3JIYW5kbGVyIGZyb20gJy4vcmVtb3RpbmdFcnJvckhhbmRsZXInO1xuXG5cbmNvbnN0IEZJTklTSEVEID0gNDtcbmNvbnN0IFNVQ0NFU1MgPSAyMDA7XG5jb25zdCBSRVFVRVNUX1RJTUVPVVQgPSA0MDg7XG5cbmNvbnN0IERPTFBISU5fUExBVEZPUk1fUFJFRklYID0gJ2RvbHBoaW5fcGxhdGZvcm1faW50ZXJuXyc7XG5jb25zdCBDTElFTlRfSURfSFRUUF9IRUFERVJfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2RvbHBoaW5DbGllbnRJZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHVybCwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5oZWFkZXJzSW5mbyA9IGV4aXN0cyhjb25maWcpID8gY29uZmlnLmhlYWRlcnNJbmZvIDogbnVsbDtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb25Db25maWcgPSBleGlzdHMoY29uZmlnKSA/IGNvbmZpZy5jb25uZWN0aW9uIDogbnVsbDtcbiAgICAgICAgdGhpcy5tYXhSZXRyeSA9IGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnKSAmJiBleGlzdHMoY29ubmVjdGlvbkNvbmZpZy5tYXhSZXRyeSk/Y29ubmVjdGlvbkNvbmZpZy5tYXhSZXRyeTogMztcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLnRpbWVvdXQpP2Nvbm5lY3Rpb25Db25maWcudGltZW91dDogNTAwMDtcbiAgICAgICAgdGhpcy5mYWlsZWRfYXR0ZW1wdCA9IDA7XG4gICAgfVxuXG4gICAgX2hhbmRsZUVycm9yKHJlamVjdCwgZXJyb3IpIHtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb25Db25maWcgPSBleGlzdHModGhpcy5jb25maWcpID8gdGhpcy5jb25maWcuY29ubmVjdGlvbiA6IG51bGw7XG4gICAgICAgIGxldCBlcnJvckhhbmRsZXJzID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLmVycm9ySGFuZGxlcnMpP2Nvbm5lY3Rpb25Db25maWcuZXJyb3JIYW5kbGVyczogW25ldyBSZW1vdGluZ0Vycm9ySGFuZGxlcigpXTtcbiAgICAgICAgZXJyb3JIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIub25FcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgIH1cblxuICAgIF9zZW5kKGNvbW1hbmRzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICBodHRwLm9uZXJyb3IgPSAoZXJyb3JDb250ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgSHR0cE5ldHdvcmtFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IE5ldHdvcmsgZXJyb3InLCBlcnJvckNvbnRlbnQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGh0dHAucmVhZHlTdGF0ZSA9PT0gRklOSVNIRUQpe1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGh0dHAuc3RhdHVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgU1VDQ0VTUzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q2xpZW50SWQgPSBodHRwLmdldFJlc3BvbnNlSGVhZGVyKENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGN1cnJlbnRDbGllbnRJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmNsaWVudElkKSAmJiB0aGlzLmNsaWVudElkICE9PSBjdXJyZW50Q2xpZW50SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBDbGllbnRJZCBvZiB0aGUgcmVzcG9uc2UgZGlkIG5vdCBtYXRjaCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudElkID0gY3VycmVudENsaWVudElkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBTZXJ2ZXIgZGlkIG5vdCBzZW5kIGEgY2xpZW50SWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaHR0cC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFUVVFU1RfVElNRU9VVDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBEb2xwaGluU2Vzc2lvbkVycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogU2Vzc2lvbiBUaW1lb3V0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZmFpbGVkX2F0dGVtcHQgPD0gdGhpcy5tYXhSZXRyeSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSB0aGlzLmZhaWxlZF9hdHRlbXB0ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgSHR0cFJlc3BvbnNlRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBIVFRQIFN0YXR1cyAhPSAyMDAgKCcgKyBodHRwLnN0YXR1cyArICcpJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmNsaWVudElkKSkge1xuICAgICAgICAgICAgICAgIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihDTElFTlRfSURfSFRUUF9IRUFERVJfTkFNRSwgdGhpcy5jbGllbnRJZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleGlzdHModGhpcy5oZWFkZXJzSW5mbykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaGVhZGVyc0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihpLCB0aGlzLmhlYWRlcnNJbmZvW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZhaWxlZF9hdHRlbXB0ID4gdGhpcy5tYXhSZXRyeSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHAuc2VuZChDb2RlYy5lbmNvZGUoY29tbWFuZHMpKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaHR0cC5zZW5kKENvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRyYW5zbWl0KGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgdGhpcy5fc2VuZChjb21tYW5kcylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlVGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVGV4dC50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VDb21tYW5kcyA9IENvZGVjLmRlY29kZShyZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKHJlc3BvbnNlQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRG9scGhpblJlbW90aW5nRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBQYXJzZSBlcnJvcjogKEluY29ycmVjdCByZXNwb25zZSA9ICcgKyByZXNwb25zZVRleHQgKyAnKScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IERvbHBoaW5SZW1vdGluZ0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogRW1wdHkgcmVzcG9uc2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2lnbmFsKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5fc2VuZChbY29tbWFuZF0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKSk7XG4gICAgfVxufVxuXG5FbWl0dGVyKFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZSk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGluZ0Vycm9ySGFuZGxlciB7XG5cbiAgICBvbkVycm9yKGVycm9yKSB7XG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG5cbn0iLCJ2YXIgX2NoZWNrTWV0aG9kTmFtZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGV4aXN0cyhvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqZWN0ICE9PSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tNZXRob2QobmFtZSkge1xuICAgIF9jaGVja01ldGhvZE5hbWUgPSBuYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tQYXJhbShwYXJhbSwgcGFyYW1ldGVyTmFtZSkge1xuICAgIGlmKCFleGlzdHMocGFyYW0pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHBhcmFtZXRlciAnICsgcGFyYW1ldGVyTmFtZSArICcgaXMgbWFuZGF0b3J5IGluICcgKyBfY2hlY2tNZXRob2ROYW1lKTtcbiAgICB9XG59Il19
