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

var _EventBus = _dereq_("./EventBus");

var _EventBus2 = _interopRequireDefault(_EventBus);

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

exports.default = ClientAttribute;

ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
ClientAttribute.clientAttributeInstanceCount = 0;

},{"./EventBus":89}],83:[function(_dereq_,module,exports){
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

var _CommandBatcher = _dereq_('./CommandBatcher');

var _codec = _dereq_('./commands/codec');

var _codec2 = _interopRequireDefault(_codec);

var _ClientPresentationModel = _dereq_('./ClientPresentationModel');

var _ClientPresentationModel2 = _interopRequireDefault(_ClientPresentationModel);

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

},{"./ClientPresentationModel":86,"./CommandBatcher":87,"./commands/codec":97}],84:[function(_dereq_,module,exports){
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

var _ClientAttribute = _dereq_('./ClientAttribute');

var _ClientAttribute2 = _interopRequireDefault(_ClientAttribute);

var _ClientPresentationModel = _dereq_('./ClientPresentationModel');

var _ClientPresentationModel2 = _interopRequireDefault(_ClientPresentationModel);

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

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Attribute = _dereq_('./Attribute');

var _Attribute2 = _interopRequireDefault(_Attribute);

var _EventBus = _dereq_('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _commandFactory = _dereq_('./commands/commandFactory.js');

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
            connector.send(_commandFactory2.default.createCreatePresentationModelCommand(model), null);
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
                _this2.clientDolphin.getClientConnector().send(_commandFactory2.default.createValueChangedCommand(attribute.id, evt.newValue), null);
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
                _this2.clientDolphin.getClientConnector().send(_commandFactory2.default.createChangeAttributeMetadataCommand(attribute.id, _Attribute2.default.QUALIFIER_PROPERTY, evt.newValue), null);
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

},{"./Attribute":81,"./EventBus":89,"./commands/commandFactory.js":100,"./constants":115}],86:[function(_dereq_,module,exports){
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

var _EventBus = _dereq_('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

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

},{"./EventBus":89}],87:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BlindCommandBatcher = exports.NoCommandBatcher = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _valueChangedCommand = _dereq_('./commands/impl/valueChangedCommand');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

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

},{"./commands/impl/valueChangedCommand":113}],88:[function(_dereq_,module,exports){
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

},{"./ClientConnector":83,"./ClientDolphin":84,"./ClientModelStore":85,"./HttpTransmitter":90,"./NoTransmitter":91}],89:[function(_dereq_,module,exports){
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

},{}],90:[function(_dereq_,module,exports){
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

},{"./commands/codec":97}],91:[function(_dereq_,module,exports){
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

},{}],92:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dolphin = dolphin;
exports.makeDolphin = makeDolphin;

var _DolphinBuilder = _dereq_("./DolphinBuilder");

var _DolphinBuilder2 = _interopRequireDefault(_DolphinBuilder);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function dolphin(url, reset) {
    var slackMS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

    return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
}

function makeDolphin() {
    return new _DolphinBuilder2.default();
}

},{"./DolphinBuilder":88}],93:[function(_dereq_,module,exports){
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

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

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

},{"../bower_components/core.js/library/fn/map":1,"./utils":121,"./utils.js":121}],94:[function(_dereq_,module,exports){
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

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

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

},{"../bower_components/core.js/library/fn/map":1,"./constants":115,"./utils":121,"./utils.js":121}],95:[function(_dereq_,module,exports){
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

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _OpenDolphin = _dereq_('./OpenDolphin.js');

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

            var builder = (0, _OpenDolphin.makeDolphin)().url(url).reset(false).slackMS(4).supportCORS(true).maxBatchSize(Number.MAX_SAFE_INTEGER);
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

},{"./OpenDolphin.js":92,"./beanmanager.js":93,"./classrepo.js":94,"./clientcontext.js":96,"./connector.js":114,"./controllermanager.js":116,"./platformHttpTransmitter.js":119,"./utils":121}],96:[function(_dereq_,module,exports){
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

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

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

},{"../bower_components/core.js/library/fn/promise":2,"./commands/commandFactory":100,"./utils":121,"./utils.js":121,"emitter-component":80}],97:[function(_dereq_,module,exports){
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

var _utils = _dereq_('../utils.js');

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

},{"../constants":115,"../utils.js":121,"./codecError":98,"./commandConstants":99,"./impl/attributeMetadataChangedCommand":101,"./impl/callActionCommand":102,"./impl/changeAttributeMetadataCommand":103,"./impl/createContextCommand":104,"./impl/createControllerCommand":105,"./impl/createPresentationModelCommand":106,"./impl/deletePresentationModelCommand":107,"./impl/destroyContextCommand":108,"./impl/destroyControllerCommand":109,"./impl/interruptLongPollCommand":110,"./impl/presentationModelDeletedCommand":111,"./impl/startLongPollCommand":112,"./impl/valueChangedCommand":113}],98:[function(_dereq_,module,exports){
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

},{}],99:[function(_dereq_,module,exports){
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

},{}],100:[function(_dereq_,module,exports){
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

var _createContextCommand = _dereq_('./impl/createContextCommand.js');

var _createContextCommand2 = _interopRequireDefault(_createContextCommand);

var _createControllerCommand = _dereq_('./impl/createControllerCommand.js');

var _createControllerCommand2 = _interopRequireDefault(_createControllerCommand);

var _callActionCommand = _dereq_('./impl/callActionCommand.js');

var _callActionCommand2 = _interopRequireDefault(_callActionCommand);

var _destroyControllerCommand = _dereq_('./impl/destroyControllerCommand.js');

var _destroyControllerCommand2 = _interopRequireDefault(_destroyControllerCommand);

var _destroyContextCommand = _dereq_('./impl/destroyContextCommand.js');

var _destroyContextCommand2 = _interopRequireDefault(_destroyContextCommand);

var _startLongPollCommand = _dereq_('./impl/startLongPollCommand.js');

var _startLongPollCommand2 = _interopRequireDefault(_startLongPollCommand);

var _interruptLongPollCommand = _dereq_('./impl/interruptLongPollCommand.js');

var _interruptLongPollCommand2 = _interopRequireDefault(_interruptLongPollCommand);

var _createPresentationModelCommand = _dereq_('./impl/createPresentationModelCommand.js');

var _createPresentationModelCommand2 = _interopRequireDefault(_createPresentationModelCommand);

var _deletePresentationModelCommand = _dereq_('./impl/deletePresentationModelCommand.js');

var _deletePresentationModelCommand2 = _interopRequireDefault(_deletePresentationModelCommand);

var _presentationModelDeletedCommand = _dereq_('./impl/presentationModelDeletedCommand.js');

var _presentationModelDeletedCommand2 = _interopRequireDefault(_presentationModelDeletedCommand);

var _valueChangedCommand = _dereq_('./impl/valueChangedCommand.js');

var _valueChangedCommand2 = _interopRequireDefault(_valueChangedCommand);

var _changeAttributeMetadataCommand = _dereq_('./impl/changeAttributeMetadataCommand.js');

var _changeAttributeMetadataCommand2 = _interopRequireDefault(_changeAttributeMetadataCommand);

var _attributeMetadataChangedCommand = _dereq_('./impl/attributeMetadataChangedCommand.js');

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

},{"./impl/attributeMetadataChangedCommand.js":101,"./impl/callActionCommand.js":102,"./impl/changeAttributeMetadataCommand.js":103,"./impl/createContextCommand.js":104,"./impl/createControllerCommand.js":105,"./impl/createPresentationModelCommand.js":106,"./impl/deletePresentationModelCommand.js":107,"./impl/destroyContextCommand.js":108,"./impl/destroyControllerCommand.js":109,"./impl/interruptLongPollCommand.js":110,"./impl/presentationModelDeletedCommand.js":111,"./impl/startLongPollCommand.js":112,"./impl/valueChangedCommand.js":113}],101:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],102:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],103:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],104:[function(_dereq_,module,exports){
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

},{"../commandConstants":99}],105:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],106:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],107:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],108:[function(_dereq_,module,exports){
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

},{"../commandConstants":99}],109:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],110:[function(_dereq_,module,exports){
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

},{"../commandConstants":99}],111:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],112:[function(_dereq_,module,exports){
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

},{"../commandConstants":99}],113:[function(_dereq_,module,exports){
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

},{"../../utils":121,"../commandConstants":99}],114:[function(_dereq_,module,exports){
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

var _utils = _dereq_('./utils.js');

var _utils2 = _dereq_('./utils');

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

},{"../bower_components/core.js/library/fn/promise":2,"./commands/commandFactory":100,"./constants":115,"./utils":121,"./utils.js":121}],115:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./commands/commandFactory.js":100,"./connector.js":114,"./controllerproxy.js":117,"./utils":121}],117:[function(_dereq_,module,exports){
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

},{"../bower_components/core.js/library/fn/set":3,"./utils":121}],118:[function(_dereq_,module,exports){
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

},{}],119:[function(_dereq_,module,exports){
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
}(); /* Copyright 2016 Canoo Engineering AG.
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

var _codec = _dereq_('./commands/codec.js');

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

},{"./commands/codec.js":97,"./errors.js":118,"./remotingErrorHandler":120,"./utils":121,"emitter-component":80}],120:[function(_dereq_,module,exports){
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

var _checkMethodName;

var exists = function exists(object) {
    return typeof object !== 'undefined' && object !== null;
};

module.exports.exists = exists;

module.exports.checkMethod = function (name) {
    _checkMethodName = name;
};

module.exports.checkParam = function (param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + _checkMethodName);
    }
};

},{}]},{},[95])(95)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktbWV0aG9kcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWluZGV4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwic3JjL0F0dHJpYnV0ZS5qcyIsInNyYy9DbGllbnRBdHRyaWJ1dGUuanMiLCJzcmMvQ2xpZW50Q29ubmVjdG9yLmpzIiwic3JjL0NsaWVudERvbHBoaW4uanMiLCJzcmMvQ2xpZW50TW9kZWxTdG9yZS5qcyIsInNyYy9DbGllbnRQcmVzZW50YXRpb25Nb2RlbC5qcyIsInNyYy9Db21tYW5kQmF0Y2hlci5qcyIsInNyYy9Eb2xwaGluQnVpbGRlci5qcyIsInNyYy9FdmVudEJ1cy5qcyIsInNyYy9IdHRwVHJhbnNtaXR0ZXIuanMiLCJzcmMvTm9UcmFuc21pdHRlci5qcyIsInNyYy9PcGVuRG9scGhpbi5qcyIsInNyYy9iZWFubWFuYWdlci5qcyIsInNyYy9jbGFzc3JlcG8uanMiLCJzcmMvY2xpZW50Q29udGV4dEZhY3RvcnkuanMiLCJzcmMvY2xpZW50Y29udGV4dC5qcyIsInNyYy9jb21tYW5kcy9jb2RlYy5qcyIsInNyYy9jb21tYW5kcy9jb2RlY0Vycm9yLmpzIiwic3JjL2NvbW1hbmRzL2NvbW1hbmRDb25zdGFudHMuanMiLCJzcmMvY29tbWFuZHMvY29tbWFuZEZhY3RvcnkuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9hdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvY2FsbEFjdGlvbkNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9jaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQuanMiLCJzcmMvY29tbWFuZHMvaW1wbC9jcmVhdGVDb250ZXh0Q29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9pbXBsL2NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvZGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvZGVzdHJveUNvbnRleHRDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvZGVzdHJveUNvbnRyb2xsZXJDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvaW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvcHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZC5qcyIsInNyYy9jb21tYW5kcy9pbXBsL3N0YXJ0TG9uZ1BvbGxDb21tYW5kLmpzIiwic3JjL2NvbW1hbmRzL2ltcGwvdmFsdWVDaGFuZ2VkQ29tbWFuZC5qcyIsInNyYy9jb25uZWN0b3IuanMiLCJzcmMvY29uc3RhbnRzLmpzIiwic3JjL2NvbnRyb2xsZXJtYW5hZ2VyLmpzIiwic3JjL2NvbnRyb2xsZXJwcm94eS5qcyIsInNyYy9lcnJvcnMuanMiLCJzcmMvcGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuanMiLCJzcmMvcmVtb3RpbmdFcnJvckhhbmRsZXIuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLE9BQUEsQUFBTyxVQUFVLFFBQUEsQUFBUSxvQkFBekIsQUFBNkM7Ozs7O0FDTDdDLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFBUTtBQUNSLE9BQUEsQUFBTyxVQUFVLFFBQUEsQUFBUSxvQkFBekIsQUFBNkM7Ozs7O0FDSjdDLFFBQUEsQUFBUTtBQUNSLFFBQUEsQUFB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b24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5tYXAnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5NYXA7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlByb21pc2U7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnNldCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlNldDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpe1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyLCBJVEVSQVRPUil7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yT2YoaXRlciwgZmFsc2UsIHJlc3VsdC5wdXNoLCByZXN1bHQsIElURVJBVE9SKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgYXNjICAgICAgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFLCAkY3JlYXRlKXtcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWFxuICAgICwgY3JlYXRlICAgICAgICA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpe1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdCgkdGhpcylcbiAgICAgICwgc2VsZiAgID0gSU9iamVjdChPKVxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IDBcbiAgICAgICwgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZFxuICAgICAgLCB2YWwsIHJlcztcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpe1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYoVFlQRSl7XG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaXNBcnJheSAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgU1BFQ0lFUyAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsKXtcbiAgdmFyIEM7XG4gIGlmKGlzQXJyYXkob3JpZ2luYWwpKXtcbiAgICBDID0gb3JpZ2luYWwuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZih0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpQyA9IHVuZGVmaW5lZDtcbiAgICBpZihpc09iamVjdChDKSl7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmKEMgPT09IG51bGwpQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQztcbn07IiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGVuZ3RoKXtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBjcmVhdGUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJylcbiAgLCBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgYW5JbnN0YW5jZSAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZGVmaW5lZCAgICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpXG4gICwgc3RlcCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIHNldFNwZWNpZXMgID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsIGZhc3RLZXkgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXlcbiAgLCBTSVpFICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24odGhhdCwga2V5KXtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XG4gIGlmKGluZGV4ICE9PSAnRicpcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCl7XG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZihlbnRyeSl7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKHByZXYpcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYodGhhdC5fZiA9PSBlbnRyeSl0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZih0aGF0Ll9sID09IGVudHJ5KXRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCAnZm9yRWFjaCcpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2Ype1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoREVTQ1JJUFRPUlMpZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIGZyb20gICAgPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUpe1xuICByZXR1cm4gZnVuY3Rpb24gdG9KU09OKCl7XG4gICAgaWYoY2xhc3NvZih0aGlzKSAhPSBOQU1FKXRocm93IFR5cGVFcnJvcihOQU1FICsgXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7XG4gICAgcmV0dXJuIGZyb20odGhpcyk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIG1ldGEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZUFsbCAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgZm9yT2YgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIGFuSW5zdGFuY2UgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBkUCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBlYWNoICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSyl7XG4gIHZhciBCYXNlICA9IGdsb2JhbFtOQU1FXVxuICAgICwgQyAgICAgPSBCYXNlXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcbiAgICAsIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZVxuICAgICwgTyAgICAgPSB7fTtcbiAgaWYoIURFU0NSSVBUT1JTIHx8IHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpe1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gICAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FLCAnX2MnKTtcbiAgICAgIHRhcmdldC5fYyA9IG5ldyBCYXNlO1xuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRhcmdldFtBRERFUl0sIHRhcmdldCk7XG4gICAgfSk7XG4gICAgZWFjaCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMsdG9KU09OJy5zcGxpdCgnLCcpLGZ1bmN0aW9uKEtFWSl7XG4gICAgICB2YXIgSVNfQURERVIgPSBLRVkgPT0gJ2FkZCcgfHwgS0VZID09ICdzZXQnO1xuICAgICAgaWYoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpaGlkZShDLnByb3RvdHlwZSwgS0VZLCBmdW5jdGlvbihhLCBiKXtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCBLRVkpO1xuICAgICAgICBpZighSVNfQURERVIgJiYgSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkpcmV0dXJuIEtFWSA9PSAnZ2V0JyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBJU19BRERFUiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYy5zaXplO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GLCBPKTtcblxuICBpZighSVNfV0VBSyljb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpXG4gICwgQlJFQUsgICAgICAgPSB7fVxuICAsIFJFVFVSTiAgICAgID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUil7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgcmV0dXJuIHtkb25lOiBzYWZlID0gdHJ1ZX07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgT2JzZXJ2ZXIgID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXJcbiAgLCBwcm9jZXNzICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIFByb21pc2UgICA9IGdsb2JhbC5Qcm9taXNlXG4gICwgaXNOb2RlICAgID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSlwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlKGhlYWQpe1xuICAgICAgZm4gICA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIGlmKGhlYWQpbm90aWZ5KCk7XG4gICAgICAgIGVsc2UgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYocGFyZW50KXBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYoaXNOb2RlKXtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG4gIH0gZWxzZSBpZihPYnNlcnZlcil7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWVcbiAgICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oZm4pe1xuICAgIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkfTtcbiAgICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYoIWhlYWQpe1xuICAgICAgaGVhZCA9IHRhc2s7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGxhc3QgPSB0YXNrO1xuICB9O1xufTsiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBsdCAgICAgPSAnPCdcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBkUCAgICAgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpe1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKXRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59OyIsInZhciBkUCAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpe1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgICA9IGdldEtleXMoUHJvcGVydGllcylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgUDtcbiAgd2hpbGUobGVuZ3RoID4gaSlkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07IiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbihPKXtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcil7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTsiLCJ2YXIgaGFzICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b0lPYmplY3QgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxuICAsIElFX1BST1RPICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwga2V5O1xuICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYywgc2FmZSl7XG4gIGZvcih2YXIga2V5IGluIHNyYyl7XG4gICAgaWYoc2FmZSAmJiB0YXJnZXRba2V5XSl0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciBDID0gdHlwZW9mIGNvcmVbS0VZXSA9PSAnZnVuY3Rpb24nID8gY29yZVtLRVldIDogZ2xvYmFsW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59OyIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59OyIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywgRCl7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3IsIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwidmFyIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faW52b2tlJylcbiAgLCBodG1sICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19odG1sJylcbiAgLCBjZWwgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmKE1lc3NhZ2VDaGFubmVsKXtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZihPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogICBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlOyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKCdNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKbGN6WXViMkpxWldOMExuUnZMWE4wY21sdVp5NXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2xhc3NvZiAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBpc09iamVjdCAgICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIGFuSW5zdGFuY2UgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBmb3JPZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIHRhc2sgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBtaWNyb3Rhc2sgICAgICAgICAgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKSgpXG4gICwgUFJPTUlTRSAgICAgICAgICAgID0gJ1Byb21pc2UnXG4gICwgVHlwZUVycm9yICAgICAgICAgID0gZ2xvYmFsLlR5cGVFcnJvclxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgJFByb21pc2UgICAgICAgICAgID0gZ2xvYmFsW1BST01JU0VdXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICAgICAgICAgICAgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGVtcHR5ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBJbnRlcm5hbCwgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xuXG52YXIgVVNFX05BVElWRSA9ICEhZnVuY3Rpb24oKXtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSAgICAgPSAkUHJvbWlzZS5yZXNvbHZlKDEpXG4gICAgICAsIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbihleGVjKXsgZXhlYyhlbXB0eSwgZW1wdHkpOyB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgc2FtZUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oYSwgYil7XG4gIC8vIHdpdGggbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICByZXR1cm4gYSA9PT0gYiB8fCBhID09PSAkUHJvbWlzZSAmJiBiID09PSBXcmFwcGVyO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICByZXR1cm4gc2FtZUNvbnN0cnVjdG9yKCRQcm9taXNlLCBDKVxuICAgID8gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgOiBuZXcgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbnZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbigkJHJlc29sdmUsICQkcmVqZWN0KXtcbiAgICBpZihyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ICA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCAgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn07XG52YXIgcGVyZm9ybSA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIGV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4ge2Vycm9yOiBlfTtcbiAgfVxufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbihwcm9taXNlLCBpc1JlamVjdCl7XG4gIGlmKHByb21pc2UuX24pcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBvayAgICA9IHByb21pc2UuX3MgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCBkb21haW4gID0gcmVhY3Rpb24uZG9tYWluXG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXtcbiAgICAgICAgICAgIGlmKHByb21pc2UuX2ggPT0gMilvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihoYW5kbGVyID09PSB0cnVlKXJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKXtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpe1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgYWJydXB0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UpKXtcbiAgICAgIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoaXNOb2RlKXtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pe1xuICAgICAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3Ipe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZihhYnJ1cHQpdGhyb3cgYWJydXB0LmVycm9yO1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgaWYocHJvbWlzZS5faCA9PSAxKXJldHVybiBmYWxzZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYSB8fCBwcm9taXNlLl9jXG4gICAgLCBpICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdGlvbiA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciBoYW5kbGVyO1xuICAgIGlmKGlzTm9kZSl7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnJlamVjdGlvbmhhbmRsZWQpe1xuICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92fSk7XG4gICAgfVxuICB9KTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZighcHJvbWlzZS5fYSlwcm9taXNlLl9hID0gcHJvbWlzZS5fYy5zbGljZSgpO1xuICBub3RpZnkocHJvbWlzZSwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYocHJvbWlzZSA9PT0gdmFsdWUpdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlLl92ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zID0gMTtcbiAgICAgIG5vdGlmeShwcm9taXNlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoKGUpe1xuICAgICRyZWplY3QuY2FsbCh7X3c6IHByb21pc2UsIF9kOiBmYWxzZX0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZighVVNFX05BVElWRSl7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gICRQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbCh0aGlzLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIHJlYWN0aW9uICAgID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRQcm9taXNlKSk7XG4gICAgICByZWFjdGlvbi5vayAgICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgICA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IGlzTm9kZSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX2EpdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX3Mpbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xuICBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHByb21pc2UgID0gbmV3IEludGVybmFsO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gY3R4KCRyZXNvbHZlLCBwcm9taXNlLCAxKTtcbiAgICB0aGlzLnJlamVjdCAgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiAkUHJvbWlzZX0pO1xucmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKSgkUHJvbWlzZSwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NvcmUnKVtQUk9NSVNFXTtcblxuLy8gc3RhdGljc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVqZWN0ICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKExJQlJBUlkgfHwgIVVTRV9OQVRJVkUpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgJFByb21pc2UgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpKXJldHVybiB4O1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpe1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgdmFyIHZhbHVlcyAgICA9IFtdXG4gICAgICAgICwgaW5kZXggICAgID0gMFxuICAgICAgICAsIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICB2YXIgJGluZGV4ICAgICAgICA9IGluZGV4KytcbiAgICAgICAgICAsIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkICA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlIsICdNYXAnLCB7dG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJyl9KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlIsICdTZXQnLCB7dG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnU2V0Jyl9KTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBJdGVyYXRvcnMgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbmZvcih2YXIgY29sbGVjdGlvbnMgPSBbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgaSA9IDA7IGkgPCA1OyBpKyspe1xuICB2YXIgTkFNRSAgICAgICA9IGNvbGxlY3Rpb25zW2ldXG4gICAgLCBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59IiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdHRyaWJ1dGUge1xufVxuXG5BdHRyaWJ1dGUuUVVBTElGSUVSX1BST1BFUlRZID0gXCJxdWFsaWZpZXJcIjtcbkF0dHJpYnV0ZS5WQUxVRSA9IFwidmFsdWVcIjtcbiIsImltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50QXR0cmlidXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWU7XG4gICAgICAgIHRoaXMuaWQgPSBcIlwiICsgKENsaWVudEF0dHJpYnV0ZS5jbGllbnRBdHRyaWJ1dGVJbnN0YW5jZUNvdW50KyspICsgXCJDXCI7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXMoKTtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMgPSBuZXcgRXZlbnRCdXMoKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0UXVhbGlmaWVyKHF1YWxpZmllcik7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDbGllbnRBdHRyaWJ1dGUodGhpcy5wcm9wZXJ0eU5hbWUsIHRoaXMuZ2V0UXVhbGlmaWVyKCksIHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgc2V0UHJlc2VudGF0aW9uTW9kZWwocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiWW91IGNhbiBub3Qgc2V0IGEgcHJlc2VudGF0aW9uIG1vZGVsIGZvciBhbiBhdHRyaWJ1dGUgdGhhdCBpcyBhbHJlYWR5IGJvdW5kLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsID0gcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgfVxuXG4gICAgZ2V0UHJlc2VudGF0aW9uTW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsO1xuICAgIH1cblxuICAgIGdldFZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZShuZXdWYWx1ZSkge1xuICAgICAgICB2YXIgdmVyaWZpZWRWYWx1ZSA9IENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gdmVyaWZpZWRWYWx1ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZlcmlmaWVkVmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFZhbHVlLCAnbmV3VmFsdWUnOiB2ZXJpZmllZFZhbHVlIH0pO1xuICAgIH1cblxuICAgIHNldFF1YWxpZmllcihuZXdRdWFsaWZpZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucXVhbGlmaWVyID09IG5ld1F1YWxpZmllcilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG9sZFF1YWxpZmllciA9IHRoaXMucXVhbGlmaWVyO1xuICAgICAgICB0aGlzLnF1YWxpZmllciA9IG5ld1F1YWxpZmllcjtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFF1YWxpZmllciwgJ25ld1ZhbHVlJzogbmV3UXVhbGlmaWVyIH0pO1xuICAgIH1cblxuICAgIGdldFF1YWxpZmllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbGlmaWVyO1xuICAgIH1cblxuICAgIG9uVmFsdWVDaGFuZ2UoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICBldmVudEhhbmRsZXIoeyBcIm9sZFZhbHVlXCI6IHRoaXMudmFsdWUsIFwibmV3VmFsdWVcIjogdGhpcy52YWx1ZSB9KTtcbiAgICB9XG5cbiAgICBvblF1YWxpZmllckNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN5bmNXaXRoKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNldFF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpOyAvLyBzZXF1ZW5jZSBpcyBpbXBvcnRhbnRcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoc291cmNlQXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBjaGVja1ZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgU3RyaW5nIHx8IHJlc3VsdCBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgcmVzdWx0IGluc3RhbmNlb2YgTnVtYmVyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIENsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbiBBdHRyaWJ1dGUgbWF5IG5vdCBpdHNlbGYgY29udGFpbiBhbiBhdHRyaWJ1dGUgYXMgYSB2YWx1ZS4gQXNzdW1pbmcgeW91IGZvcmdvdCB0byBjYWxsIHZhbHVlLlwiKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY2hlY2tWYWx1ZSh2YWx1ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9rID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLlNVUFBPUlRFRF9WQUxVRV9UWVBFUy5pbmRleE9mKHR5cGVvZiByZXN1bHQpID4gLTEgfHwgcmVzdWx0IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dHJpYnV0ZSB2YWx1ZXMgb2YgdGhpcyB0eXBlIGFyZSBub3QgYWxsb3dlZDogXCIgKyB0eXBlb2YgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG59XG5cbkNsaWVudEF0dHJpYnV0ZS5TVVBQT1JURURfVkFMVUVfVFlQRVMgPSBbXCJzdHJpbmdcIiwgXCJudW1iZXJcIiwgXCJib29sZWFuXCJdO1xuQ2xpZW50QXR0cmlidXRlLmNsaWVudEF0dHJpYnV0ZUluc3RhbmNlQ291bnQgPSAwO1xuIiwiaW1wb3J0IHtCbGluZENvbW1hbmRCYXRjaGVyfSBmcm9tICcuL0NvbW1hbmRCYXRjaGVyJztcbmltcG9ydCBDb2RlYyBmcm9tICcuL2NvbW1hbmRzL2NvZGVjJztcbmltcG9ydCBDbGllbnRQcmVzZW50YXRpb25Nb2RlbCBmcm9tICcuL0NsaWVudFByZXNlbnRhdGlvbk1vZGVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb25uZWN0b3Ige1xuXG4gICAgY29uc3RydWN0b3IodHJhbnNtaXR0ZXIsIGNsaWVudERvbHBoaW4sIHNsYWNrTVMgPSAwLCBtYXhCYXRjaFNpemUgPSA1MCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wdXNoRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4gPSBjbGllbnREb2xwaGluO1xuICAgICAgICB0aGlzLnNsYWNrTVMgPSBzbGFja01TO1xuICAgICAgICB0aGlzLmNvZGVjID0gbmV3IENvZGVjKCk7XG4gICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXcgQmxpbmRDb21tYW5kQmF0Y2hlcih0cnVlLCBtYXhCYXRjaFNpemUpO1xuICAgIH1cblxuICAgIHNldENvbW1hbmRCYXRjaGVyKG5ld0JhdGNoZXIpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kQmF0Y2hlciA9IG5ld0JhdGNoZXI7XG4gICAgfVxuXG4gICAgc2V0UHVzaEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLnB1c2hFbmFibGVkID0gZW5hYmxlZDtcbiAgICB9XG5cbiAgICBzZXRQdXNoTGlzdGVuZXIobmV3TGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5wdXNoTGlzdGVuZXIgPSBuZXdMaXN0ZW5lcjtcbiAgICB9XG5cbiAgICBzZXRSZWxlYXNlQ29tbWFuZChuZXdDb21tYW5kKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZUNvbW1hbmQgPSBuZXdDb21tYW5kO1xuICAgIH1cblxuICAgIHNlbmQoY29tbWFuZCwgb25GaW5pc2hlZCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHsgY29tbWFuZDogY29tbWFuZCwgaGFuZGxlcjogb25GaW5pc2hlZCB9KTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7IC8vIHRoZXJlIGlzIG5vdCBwb2ludCBpbiByZWxlYXNpbmcgaWYgd2UgZG8gbm90IHNlbmQgYXRtXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgfVxuXG4gICAgZG9TZW5kTmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZFF1ZXVlLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnB1c2hFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnF1ZXVlUHVzaENvbW1hbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSB0cnVlO1xuICAgICAgICB2YXIgY21kc0FuZEhhbmRsZXJzID0gdGhpcy5jb21tYW5kQmF0Y2hlci5iYXRjaCh0aGlzLmNvbW1hbmRRdWV1ZSk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNtZHNBbmRIYW5kbGVyc1tjbWRzQW5kSGFuZGxlcnMubGVuZ3RoIC0gMV0uaGFuZGxlcjtcbiAgICAgICAgdmFyIGNvbW1hbmRzID0gY21kc0FuZEhhbmRsZXJzLm1hcChjYWggPT4geyByZXR1cm4gY2FoLmNvbW1hbmQ7IH0pO1xuICAgICAgICB0aGlzLnRyYW5zbWl0dGVyLnRyYW5zbWl0KGNvbW1hbmRzLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXJ2ZXIgcmVzcG9uc2U6IFtcIiArIHJlc3BvbnNlLm1hcChpdCA9PiBpdC5pZCkuam9pbihcIiwgXCIpICsgXCJdIFwiKTtcbiAgICAgICAgICAgIHZhciB0b3VjaGVkUE1zID0gW107XG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKChjb21tYW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoZWQgPSB0aGlzLmhhbmRsZShjb21tYW5kKTtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2hlZClcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hlZFBNcy5wdXNoKHRvdWNoZWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5vbkZpbmlzaGVkKHRvdWNoZWRQTXMpOyAvLyB0b2RvOiBtYWtlIHRoZW0gdW5pcXVlP1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVjdXJzaXZlIGNhbGw6IGZldGNoIHRoZSBuZXh0IGluIGxpbmUgYnV0IGFsbG93IGEgYml0IG9mIHNsYWNrIHN1Y2ggdGhhdFxuICAgICAgICAgICAgLy8gZG9jdW1lbnQgZXZlbnRzIGNhbiBmaXJlLCByZW5kZXJpbmcgaXMgZG9uZSBhbmQgY29tbWFuZHMgY2FuIGJhdGNoIHVwXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZG9TZW5kTmV4dCgpLCB0aGlzLnNsYWNrTVMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGUoY29tbWFuZCkge1xuICAgICAgICBpZiAoY29tbWFuZC5pZCA9PSBcIkRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJWYWx1ZUNoYW5nZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbm5vdCBoYW5kbGUsIHVua25vd24gY29tbWFuZCBcIiArIGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY2xpZW50RG9scGhpbi5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKHNlcnZlckNvbW1hbmQucG1JZCk7XG4gICAgICAgIGlmICghbW9kZWwpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICB9XG5cbiAgICBoYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICBpZiAodGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYSBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiICBrbm93biB0byB0aGUgY2xpZW50LlwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5hdHRyaWJ1dGUoYXR0ci5wcm9wZXJ0eU5hbWUsIGF0dHIucXVhbGlmaWVyLCBhdHRyLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChhdHRyLmlkICYmIGF0dHIuaWQubWF0Y2goXCIuKlMkXCIpKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50QXR0cmlidXRlLmlkID0gYXR0ci5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGNsaWVudFBtID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCwgc2VydmVyQ29tbWFuZC5wbVR5cGUpO1xuICAgICAgICBjbGllbnRQbS5hZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgICBpZiAoc2VydmVyQ29tbWFuZC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgY2xpZW50UG0uY2xpZW50U2lkZU9ubHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuYWRkKGNsaWVudFBtKTtcbiAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLnVwZGF0ZVByZXNlbnRhdGlvbk1vZGVsUXVhbGlmaWVyKGNsaWVudFBtKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudFBtO1xuICAgIH1cblxuICAgIGhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQXR0cmlidXRlQnlJZChzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkKTtcbiAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXR0cmlidXRlIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3QgdXBkYXRlIHRvIG5ldyB2YWx1ZSBcIiArIHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpID09IHNlcnZlckNvbW1hbmQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJub3RoaW5nIHRvIGRvLiBuZXcgdmFsdWUgPT0gb2xkIHZhbHVlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50QXR0cmlidXRlLnNldFZhbHVlKHNlcnZlckNvbW1hbmQubmV3VmFsdWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBoYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgIGlmICghY2xpZW50QXR0cmlidXRlKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGNsaWVudEF0dHJpYnV0ZVtzZXJ2ZXJDb21tYW5kLm1ldGFkYXRhTmFtZV0gPSBzZXJ2ZXJDb21tYW5kLnZhbHVlO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsaXN0ZW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5wdXNoRW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMud2FpdGluZylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gdG9kbzogaG93IHRvIGlzc3VlIGEgd2FybmluZyBpZiBubyBwdXNoTGlzdGVuZXIgaXMgc2V0P1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgdGhpcy5kb1NlbmROZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbnF1ZXVlUHVzaENvbW1hbmQoKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHRoaXMud2FpdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goe1xuICAgICAgICAgICAgY29tbWFuZDogdGhpcy5wdXNoTGlzdGVuZXIsXG4gICAgICAgICAgICBoYW5kbGVyOiB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24gKCkgeyBtZS53YWl0aW5nID0gZmFsc2U7IH0sXG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZERhdGE6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVsZWFzZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLndhaXRpbmcpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMud2FpdGluZyA9IGZhbHNlO1xuICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHJlbGVhc2VDb21tYW5kIGlzIHNldD9cbiAgICAgICAgdGhpcy50cmFuc21pdHRlci5zaWduYWwodGhpcy5yZWxlYXNlQ29tbWFuZCk7XG4gICAgfVxufSIsImltcG9ydCBDbGllbnRBdHRyaWJ1dGUgZnJvbSAnLi9DbGllbnRBdHRyaWJ1dGUnXG5pbXBvcnQgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwgZnJvbSAnLi9DbGllbnRQcmVzZW50YXRpb25Nb2RlbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50RG9scGhpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRDbGllbnRDb25uZWN0b3IoY2xpZW50Q29ubmVjdG9yKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yID0gY2xpZW50Q29ubmVjdG9yO1xuICAgIH1cblxuICAgIGdldENsaWVudENvbm5lY3RvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50Q29ubmVjdG9yO1xuICAgIH1cblxuICAgIHNlbmQoY29tbWFuZCwgb25GaW5pc2hlZCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZW5kKGNvbW1hbmQsIG9uRmluaXNoZWQpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGllbnRBdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwcmVzZW50YXRpb25Nb2RlbChpZCwgdHlwZSwgLi4uYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbW9kZWwgPSBuZXcgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoaWQsIHR5cGUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgbW9kZWwuYWRkQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5hZGQobW9kZWwpO1xuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50TW9kZWxTdG9yZShjbGllbnRNb2RlbFN0b3JlKSB7XG4gICAgICAgIHRoaXMuY2xpZW50TW9kZWxTdG9yZSA9IGNsaWVudE1vZGVsU3RvcmU7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50TW9kZWxTdG9yZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50TW9kZWxTdG9yZTtcbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxJZHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5saXN0UHJlc2VudGF0aW9uTW9kZWxJZHMoKTtcbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkubGlzdFByZXNlbnRhdGlvbk1vZGVscygpO1xuICAgIH1cblxuICAgIGZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgIH1cblxuICAgIGdldEF0KGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpO1xuICAgIH1cblxuICAgIGZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpO1xuICAgIH1cblxuICAgIGRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKG1vZGVsVG9EZWxldGUpIHtcbiAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWxUb0RlbGV0ZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goc291cmNlQXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQXR0cmlidXRlUXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZUF0dHJpYnV0ZVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEFsbEF0dHJpYnV0ZXNCeVF1YWxpZmllcihzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2godGFyZ2V0QXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIHRhcmdldEF0dHJpYnV0ZS5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7IC8vIHNob3VsZCBhbHdheXMgaGF2ZSB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGFydFB1c2hMaXN0ZW5pbmcocHVzaENvbW1hbmQsIHJlbGVhc2VDb21tYW5kKSB7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hMaXN0ZW5lcihwdXNoQ29tbWFuZCk7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFJlbGVhc2VDb21tYW5kKHJlbGVhc2VDb21tYW5kKTtcbiAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQodHJ1ZSk7XG4gICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLmxpc3RlbigpO1xuICAgIH1cblxuICAgIHN0b3BQdXNoTGlzdGVuaW5nKCkge1xuICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoRW5hYmxlZChmYWxzZSk7XG4gICAgfVxufSIsImltcG9ydCBBdHRyaWJ1dGUgZnJvbSAnLi9BdHRyaWJ1dGUnXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cydcbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRzL2NvbW1hbmRGYWN0b3J5LmpzJztcbmltcG9ydCB7QURERURfVFlQRSwgUkVNT1ZFRF9UWVBFfSBmcm9tICcuL2NvbnN0YW50cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50TW9kZWxTdG9yZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGllbnREb2xwaGluKSB7XG4gICAgICAgIHRoaXMuY2xpZW50RG9scGhpbiA9IGNsaWVudERvbHBoaW47XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgIH1cblxuICAgIGdldENsaWVudERvbHBoaW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudERvbHBoaW47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJNb2RlbChtb2RlbCkge1xuICAgICAgICBpZiAobW9kZWwuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29ubmVjdG9yID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpO1xuICAgICAgICBjb25uZWN0b3Iuc2VuZChDb21tYW5kRmFjdG9yeS5jcmVhdGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQobW9kZWwpLCBudWxsKTtcbiAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJBdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG4gICAgICAgIHRoaXMuYWRkQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2hlbmV2ZXIgYW4gYXR0cmlidXRlIGNoYW5nZXMgaXRzIHZhbHVlLCB0aGUgc2VydmVyIG5lZWRzIHRvIGJlIG5vdGlmaWVkXG4gICAgICAgIC8vIGFuZCBhbGwgb3RoZXIgYXR0cmlidXRlcyB3aXRoIHRoZSBzYW1lIHF1YWxpZmllciBhcmUgZ2l2ZW4gdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoKGV2dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlVmFsdWVDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGUuaWQsIGV2dC5uZXdWYWx1ZSksIG51bGwpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuZmluZEF0dHJpYnV0ZXNCeUZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0ciAhPT0gYXR0cmlidXRlICYmIGF0dHIuZ2V0UXVhbGlmaWVyKCkgPT0gYXR0cmlidXRlLmdldFF1YWxpZmllcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGF0dHJzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXR0ci5zZXRWYWx1ZShhdHRyaWJ1dGUuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhdHRyaWJ1dGUub25RdWFsaWZpZXJDaGFuZ2UoKGV2dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGF0dHJpYnV0ZS5pZCwgQXR0cmlidXRlLlFVQUxJRklFUl9QUk9QRVJUWSwgZXZ0Lm5ld1ZhbHVlKSwgbnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZChtb2RlbCkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmhhcyhtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYWxyZWFkeSBpcyBhIFBNIHdpdGggaWQgXCIgKyBtb2RlbC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFkZGVkID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuc2V0KG1vZGVsLmlkLCBtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLmFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJNb2RlbChtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMudHJpZ2dlcih7ICdldmVudFR5cGUnOiBBRERFRF9UWVBFLCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWRkZWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlKG1vZGVsKSB7XG4gICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5kZWxldGUobW9kZWwuaWQpO1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogUkVNT1ZFRF9UWVBFLCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgIHJlbW92ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgIH1cblxuICAgIGZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIoZmlsdGVyKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmZvckVhY2goKG1vZGVsKSA9PiB7XG4gICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIoYXR0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGF0dHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfVxuXG4gICAgYWRkUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLnNldCh0eXBlLCBwcmVzZW50YXRpb25Nb2RlbHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHByZXNlbnRhdGlvbk1vZGVscy5pbmRleE9mKG1vZGVsKSA+IC0xKSkge1xuICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUobW9kZWwpIHtcbiAgICAgICAgaWYgKCFtb2RlbCB8fCAhKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVscykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmVzZW50YXRpb25Nb2RlbHMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5zcGxpY2UocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmRlbGV0ZShtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMua2V5cygpO1xuICAgICAgICB2YXIgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICB3aGlsZSAoIW5leHQuZG9uZSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV4dC52YWx1ZSk7XG4gICAgICAgICAgICBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBsaXN0UHJlc2VudGF0aW9uTW9kZWxzKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpdGVyID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMudmFsdWVzKCk7XG4gICAgICAgIHZhciBuZXh0ID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHdoaWxlICghbmV4dC5kb25lKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXh0LnZhbHVlKTtcbiAgICAgICAgICAgIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmdldChpZCk7XG4gICAgfVxuXG4gICAgZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgaWYgKCF0eXBlIHx8ICF0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuaGFzKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5nZXQodHlwZSkuc2xpY2UoMCk7IC8vIHNsaWNlIGlzIHVzZWQgdG8gY2xvbmUgdGhlIGFycmF5XG4gICAgfVxuXG4gICAgZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwsIG5vdGlmeSkge1xuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChtb2RlbC5pZCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKG1vZGVsKTtcbiAgICAgICAgICAgIGlmICghbm90aWZ5IHx8IG1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQoQ29tbWFuZEZhY3RvcnkuY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChtb2RlbC5pZCksIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuaGFzKGlkKTtcbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVCeUlkKGF0dHJpYnV0ZSkge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5oYXMoYXR0cmlidXRlLmlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkLnNldChhdHRyaWJ1dGUuaWQsIGF0dHJpYnV0ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIXRoaXMuYXR0cmlidXRlc1BlcklkLmhhcyhhdHRyaWJ1dGUuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQuZGVsZXRlKGF0dHJpYnV0ZS5pZCk7XG4gICAgfVxuXG4gICAgZmluZEF0dHJpYnV0ZUJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlcklkLmdldChpZCk7XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuc2V0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSwgYXR0cmlidXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID4gLTEpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3BsaWNlKGF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5kZWxldGUoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRBbGxBdHRyaWJ1dGVzQnlRdWFsaWZpZXIocXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICghcXVhbGlmaWVyIHx8ICF0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIuaGFzKHF1YWxpZmllcikpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLmdldChxdWFsaWZpZXIpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgIH1cblxuICAgIG9uTW9kZWxTdG9yZUNoYW5nZShldmVudEhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbk1vZGVsU3RvcmVDaGFuZ2VGb3JUeXBlKHByZXNlbnRhdGlvbk1vZGVsVHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy5vbkV2ZW50KHBtU3RvcmVFdmVudCA9PiB7XG4gICAgICAgICAgICBpZiAocG1TdG9yZUV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9PSBwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIocG1TdG9yZUV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cydcblxudmFyIHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCA9IDA7IC8vIHRvZG8gZGs6IGNvbnNpZGVyIG1ha2luZyB0aGlzIHN0YXRpYyBpbiBjbGFzc1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxUeXBlID0gcHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jbGllbnRTaWRlT25seSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2YgaWQgIT09ICd1bmRlZmluZWQnICYmIGlkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAocHJlc2VudGF0aW9uTW9kZWxJbnN0YW5jZUNvdW50KyspLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnZhbGlkQnVzID0gbmV3IEV2ZW50QnVzKCk7XG4gICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cyA9IG5ldyBFdmVudEJ1cygpO1xuICAgIH1cbiAgICAvLyB0b2RvIGRrOiBhbGlnbiB3aXRoIEphdmEgdmVyc2lvbjogbW92ZSB0byBDbGllbnREb2xwaGluIGFuZCBhdXRvLWFkZCB0byBtb2RlbCBzdG9yZVxuICAgIC8qKiBhIGNvcHkgY29uc3RydWN0b3IgZm9yIGFueXRoaW5nIGJ1dCBJRHMuIFBlciBkZWZhdWx0LCBjb3BpZXMgYXJlIGNsaWVudCBzaWRlIG9ubHksIG5vIGF1dG9tYXRpYyB1cGRhdGUgYXBwbGllcy4gKi9cbiAgICBjb3B5KCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKG51bGwsIHRoaXMucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgcmVzdWx0LmNsaWVudFNpZGVPbmx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlQ29weSA9IGF0dHJpYnV0ZS5jb3B5KCk7XG4gICAgICAgICAgICByZXN1bHQuYWRkQXR0cmlidXRlKGF0dHJpYnV0ZUNvcHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy9hZGQgYXJyYXkgb2YgYXR0cmlidXRlc1xuICAgIGFkZEF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXMgfHwgYXR0cmlidXRlcy5sZW5ndGggPCAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFkZEF0dHJpYnV0ZShhdHRyaWJ1dGUpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgKHRoaXMuYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoYXR0cmlidXRlLnByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcHJvcGVydHkgbmFtZTogXCIgKyBhdHRyaWJ1dGUucHJvcGVydHlOYW1lXG4gICAgICAgICAgICAgICAgKyBcIiBpbiBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZDogXCIgKyB0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpICYmIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcXVhbGlmaWVyOiBcIiArIGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKVxuICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgYXR0cmlidXRlLnNldFByZXNlbnRhdGlvbk1vZGVsKHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRCdXMudHJpZ2dlcih7IHNvdXJjZTogdGhpcyB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uSW52YWxpZGF0ZWQoaGFuZGxlSW52YWxpZGF0ZSkge1xuICAgICAgICB0aGlzLmludmFsaWRCdXMub25FdmVudChoYW5kbGVJbnZhbGlkYXRlKTtcbiAgICB9XG4gICAgLyoqIHJldHVybnMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBzdGF0ZSAqL1xuICAgIGdldEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2xpY2UoMCk7XG4gICAgfVxuICAgIGdldEF0KHByb3BlcnR5TmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKTtcbiAgICB9XG4gICAgZmluZEFsbEF0dHJpYnV0ZXNCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCh0aGlzLmF0dHJpYnV0ZXNbaV0ucHJvcGVydHlOYW1lID09IHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmaW5kQXR0cmlidXRlQnlRdWFsaWZpZXIocXVhbGlmaWVyKSB7XG4gICAgICAgIGlmICghcXVhbGlmaWVyKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmdldFF1YWxpZmllcigpID09IHF1YWxpZmllcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZpbmRBdHRyaWJ1dGVCeUlkKGlkKSB7XG4gICAgICAgIGlmICghaWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzeW5jV2l0aChzb3VyY2VQcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaCgodGFyZ2V0QXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICB2YXIgc291cmNlQXR0cmlidXRlID0gc291cmNlUHJlc2VudGF0aW9uTW9kZWwuZ2V0QXQodGFyZ2V0QXR0cmlidXRlLnByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICBpZiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0cmlidXRlLnN5bmNXaXRoKHNvdXJjZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBWYWx1ZUNoYW5nZWRDb21tYW5kIGZyb20gJy4vY29tbWFuZHMvaW1wbC92YWx1ZUNoYW5nZWRDb21tYW5kJ1xuXG5leHBvcnQgY2xhc3MgTm9Db21tYW5kQmF0Y2hlciB7XG4gICAgYmF0Y2gocXVldWUpIHtcbiAgICAgICAgcmV0dXJuIFtxdWV1ZS5zaGlmdCgpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCbGluZENvbW1hbmRCYXRjaGVyIHtcbiAgICAvKiogZm9sZGluZzogd2hldGhlciB3ZSBzaG91bGQgdHJ5IGZvbGRpbmcgVmFsdWVDaGFuZ2VkQ29tbWFuZHMgKi9cbiAgICBjb25zdHJ1Y3Rvcihmb2xkaW5nID0gdHJ1ZSwgbWF4QmF0Y2hTaXplID0gNTApIHtcbiAgICAgICAgdGhpcy5mb2xkaW5nID0gZm9sZGluZztcbiAgICAgICAgdGhpcy5tYXhCYXRjaFNpemUgPSBtYXhCYXRjaFNpemU7XG4gICAgfVxuICAgIGJhdGNoKHF1ZXVlKSB7XG4gICAgICAgIGxldCBiYXRjaCA9IFtdO1xuICAgICAgICBjb25zdCBuID0gTWF0aC5taW4ocXVldWUubGVuZ3RoLCB0aGlzLm1heEJhdGNoU2l6ZSk7XG4gICAgICAgIGZvciAobGV0IGNvdW50ZXIgPSAwOyBjb3VudGVyIDwgbjsgY291bnRlcisrKSB7XG4gICAgICAgICAgICBjb25zdCBjYW5kaWRhdGUgPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9sZGluZyAmJiBjYW5kaWRhdGUuY29tbWFuZCBpbnN0YW5jZW9mIFZhbHVlQ2hhbmdlZENvbW1hbmQgJiYgKCFjYW5kaWRhdGUuaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5DbWQgPSBjYW5kaWRhdGUuY29tbWFuZDtcbiAgICAgICAgICAgICAgICBpZiAoYmF0Y2gubGVuZ3RoID4gMCAmJiBiYXRjaFtiYXRjaC5sZW5ndGggLSAxXS5jb21tYW5kIGluc3RhbmNlb2YgVmFsdWVDaGFuZ2VkQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXRjaENtZCA9IGJhdGNoW2JhdGNoLmxlbmd0aCAtIDFdLmNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5DbWQuYXR0cmlidXRlSWQgPT0gYmF0Y2hDbWQuYXR0cmlidXRlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoQ21kLm5ld1ZhbHVlID0gY2FuQ21kLm5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpOyAvLyB3ZSBjYW5ub3QgbWVyZ2UsIHNvIGJhdGNoIHRoZSBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpOyAvLyB3ZSBjYW5ub3QgbWVyZ2UsIHNvIGJhdGNoIHRoZSBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FuZGlkYXRlLmhhbmRsZXIgfHxcbiAgICAgICAgICAgICAgICAoY2FuZGlkYXRlLmNvbW1hbmRbJ2NsYXNzTmFtZSddID09IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5FbXB0eU5vdGlmaWNhdGlvblwiKSAvLyBvciB1bmtub3duIGNsaWVudCBzaWRlIGVmZmVjdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIGxlYXZlIHRoZSBsb29wXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhdGNoO1xuICAgIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcbmltcG9ydCBDbGllbnRDb25uZWN0b3IgZnJvbSAnLi9DbGllbnRDb25uZWN0b3InXG5pbXBvcnQgQ2xpZW50RG9scGhpbiBmcm9tICcuL0NsaWVudERvbHBoaW4nXG5pbXBvcnQgQ2xpZW50TW9kZWxTdG9yZSBmcm9tICcuL0NsaWVudE1vZGVsU3RvcmUnXG5pbXBvcnQgSHR0cFRyYW5zbWl0dGVyIGZyb20gJy4vSHR0cFRyYW5zbWl0dGVyJ1xuaW1wb3J0IE5vVHJhbnNtaXR0ZXIgZnJvbSAnLi9Ob1RyYW5zbWl0dGVyJ1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbHBoaW5CdWlsZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlc2V0XyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNsYWNrTVNfID0gMzAwO1xuICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSA1MDtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBmYWxzZTtcbiAgICB9XG5cbiAgICB1cmwodXJsKSB7XG4gICAgICAgIHRoaXMudXJsXyA9IHVybDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVzZXQocmVzZXQpIHtcbiAgICAgICAgdGhpcy5yZXNldF8gPSByZXNldDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2xhY2tNUyhzbGFja01TKSB7XG4gICAgICAgIHRoaXMuc2xhY2tNU18gPSBzbGFja01TO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtYXhCYXRjaFNpemUobWF4QmF0Y2hTaXplKSB7XG4gICAgICAgIHRoaXMubWF4QmF0Y2hTaXplXyA9IG1heEJhdGNoU2l6ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3VwcG9ydENPUlMoc3VwcG9ydENPUlMpIHtcbiAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBzdXBwb3J0Q09SUztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZXJyb3JIYW5kbGVyKGVycm9ySGFuZGxlcikge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlcl8gPSBlcnJvckhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcnNJbmZvKGhlYWRlcnNJbmZvKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm9fID0gaGVhZGVyc0luZm87XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW5Eb2xwaGluIGpzIGZvdW5kXCIpO1xuICAgICAgICB2YXIgY2xpZW50RG9scGhpbiA9IG5ldyBDbGllbnREb2xwaGluKCk7XG4gICAgICAgIHZhciB0cmFuc21pdHRlcjtcbiAgICAgICAgaWYgKHRoaXMudXJsXyAhPSBudWxsICYmIHRoaXMudXJsXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBIdHRwVHJhbnNtaXR0ZXIodGhpcy51cmxfLCB0aGlzLnJlc2V0XywgXCJVVEYtOFwiLCB0aGlzLmVycm9ySGFuZGxlcl8sIHRoaXMuc3VwcG9ydENPUlNfLCB0aGlzLmhlYWRlcnNJbmZvXyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBOb1RyYW5zbWl0dGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRDb25uZWN0b3IobmV3IENsaWVudENvbm5lY3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgdGhpcy5zbGFja01TXywgdGhpcy5tYXhCYXRjaFNpemVfKSk7XG4gICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50TW9kZWxTdG9yZShuZXcgQ2xpZW50TW9kZWxTdG9yZShjbGllbnREb2xwaGluKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50RG9scGhpbiBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgcmV0dXJuIGNsaWVudERvbHBoaW47XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRCdXMge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycyA9IFtdO1xuICAgIH1cblxuICAgIG9uRXZlbnQoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgfVxuXG4gICAgdHJpZ2dlcihldmVudCkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMuZm9yRWFjaChoYW5kbGUgPT4gaGFuZGxlKGV2ZW50KSk7XG4gICAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuaW1wb3J0IENvZGVjIGZyb20gJy4vY29tbWFuZHMvY29kZWMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0dHBUcmFuc21pdHRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHJlc2V0ID0gdHJ1ZSwgY2hhcnNldCA9IFwiVVRGLThcIiwgZXJyb3JIYW5kbGVyID0gbnVsbCwgc3VwcG9ydENPUlMgPSBmYWxzZSwgaGVhZGVyc0luZm8gPSBudWxsKSB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmNoYXJzZXQgPSBjaGFyc2V0O1xuICAgICAgICB0aGlzLkh0dHBDb2RlcyA9IHtcbiAgICAgICAgICAgIGZpbmlzaGVkOiA0LFxuICAgICAgICAgICAgc3VjY2VzczogMjAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICB0aGlzLnN1cHBvcnRDT1JTID0gc3VwcG9ydENPUlM7XG4gICAgICAgIHRoaXMuaGVhZGVyc0luZm8gPSBoZWFkZXJzSW5mbztcbiAgICAgICAgdGhpcy5odHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuc2lnID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIGlmICh0aGlzLnN1cHBvcnRDT1JTKSB7XG4gICAgICAgICAgICBpZiAoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB0aGlzLmh0dHApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHAud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTsgLy8gTk9URTogZG9pbmcgdGhpcyBmb3Igbm9uIENPUlMgcmVxdWVzdHMgaGFzIG5vIGltcGFjdFxuICAgICAgICAgICAgICAgIHRoaXMuc2lnLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBDb2RlYygpO1xuICAgICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIdHRwVHJhbnNtaXR0ZXIuaW52YWxpZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBDbGllbnREb2xwaGluLnJlc2V0KE9uU3VjY2Vzc0hhbmRsZXIpIGluc3RlYWQnKTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNtaXQoY29tbWFuZHMsIG9uRG9uZSkge1xuICAgICAgICB0aGlzLmh0dHAub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ29uZXJyb3InLCBcIlwiKTtcbiAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5odHRwLnJlYWR5U3RhdGUgPT0gdGhpcy5IdHRwQ29kZXMuZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5odHRwLnN0YXR1cyA9PSB0aGlzLkh0dHBDb2Rlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZVRleHQgPSB0aGlzLmh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZUNvbW1hbmRzID0gdGhpcy5jb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZCBwYXJzaW5nIHJlc3BvbnNlVGV4dDogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiwgcmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiArIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IGVtcHR5IHJlc3BvbnNlVGV4dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICB0aGlzLnNldEhlYWRlcnModGhpcy5odHRwKTtcbiAgICAgICAgaWYgKFwib3ZlcnJpZGVNaW1lVHlwZVwiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgdGhpcy5odHRwLm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVwiICsgdGhpcy5jaGFyc2V0KTsgLy8gdG9kbyBtYWtlIGluamVjdGFibGVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmh0dHAuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgIH1cblxuICAgIHNldEhlYWRlcnMoaHR0cFJlcSkge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzSW5mbykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmhlYWRlcnNJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKGksIHRoaXMuaGVhZGVyc0luZm9baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUVycm9yKGtpbmQsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGVycm9yRXZlbnQgPSB7IGtpbmQ6IGtpbmQsIHVybDogdGhpcy51cmwsIGh0dHBTdGF0dXM6IHRoaXMuaHR0cC5zdGF0dXMsIG1lc3NhZ2U6IG1lc3NhZ2UgfTtcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlcihlcnJvckV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnJvckV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNpZ25hbChjb21tYW5kKSB7XG4gICAgICAgIHRoaXMuc2lnLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyh0aGlzLnNpZyk7XG4gICAgICAgIHRoaXMuc2lnLnNlbmQodGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRdKSk7XG4gICAgfVxuXG4gICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCArICdpbnZhbGlkYXRlPycsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5odHRwLnNlbmQoKTtcbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb1RyYW5zbWl0dGVyIHtcblxuICAgIHRyYW5zbWl0KGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyBzcGVjaWFsXG4gICAgICAgIG9uRG9uZShbXSk7XG4gICAgfVxuXG4gICAgc2lnbmFsKCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5pbXBvcnQgRG9scGhpbkJ1aWxkZXIgZnJvbSAnLi9Eb2xwaGluQnVpbGRlcidcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbHBoaW4odXJsLCByZXNldCwgc2xhY2tNUyA9IDMwMCkge1xuICAgIHJldHVybiBtYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KHJlc2V0KS5zbGFja01TKHNsYWNrTVMpLmJ1aWxkKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRG9scGhpbigpIHtcbiAgICByZXR1cm4gbmV3IERvbHBoaW5CdWlsZGVyKCk7XG59IiwiaW1wb3J0ICBNYXAgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vbWFwJztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVhbk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGNsYXNzUmVwb3NpdG9yeSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KScpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmFkZGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hcnJheVVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hbGxBZGRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsVXBkYXRlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBbXTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKCh0eXBlLCBiZWFuKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFkZGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuUmVtb3ZlZCgodHlwZSwgYmVhbikgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKCh0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5VcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkJlYW5VcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZSgodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQXJyYXlVcGRhdGUtaGFuZGxlciBmb3IgdHlwZScsIHR5cGUsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGEgZ2VuZXJhbCBvbkFycmF5VXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgIH1cblxuXG4gICAgbm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cblxuICAgIG5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY291bnQsICdjb3VudCcpO1xuICAgICAgICBjaGVja1BhcmFtKHJlbW92ZWRFbGVtZW50cywgJ3JlbW92ZWRFbGVtZW50cycpO1xuXG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpO1xuICAgIH1cblxuXG4gICAgaXNNYW5hZ2VkKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLmlzTWFuYWdlZChiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uaXNNYW5hZ2VkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBjcmVhdGUodHlwZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuY3JlYXRlKHR5cGUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5jcmVhdGUoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIGFkZCh0eXBlLCBiZWFuKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGQodHlwZSwgYmVhbiknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBhZGRBbGwodHlwZSwgY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb2xsZWN0aW9uLCAnY29sbGVjdGlvbicpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZEFsbCgpIFtEUC03XVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xuICAgIH1cblxuXG4gICAgcmVtb3ZlKGJlYW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZShiZWFuKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICByZW1vdmVBbGwoY29sbGVjdGlvbikge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlQWxsKGNvbGxlY3Rpb24pJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVBbGwoKSBbRFAtN11cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICB9XG5cblxuICAgIHJlbW92ZUlmKHByZWRpY2F0ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIucmVtb3ZlSWYocHJlZGljYXRlKScpO1xuICAgICAgICBjaGVja1BhcmFtKHByZWRpY2F0ZSwgJ3ByZWRpY2F0ZScpO1xuXG4gICAgICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUlmKCkgW0RQLTddXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG4gICAgfVxuXG5cbiAgICBvbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMgPSBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFkZGVkKHR5cGUsIGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycyA9IHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQmVhblVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFycmF5VXBkYXRlKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZShldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BcnJheVVwZGF0ZSh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCAgTWFwIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCc7XG5pbXBvcnQgKiBhcyBjb25zdHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG5pbXBvcnQge2V4aXN0c30gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge2NoZWNrTWV0aG9kfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tQYXJhbX0gZnJvbSAnLi91dGlscyc7XG5cbnZhciBibG9ja2VkID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xhc3NSZXBvc2l0b3J5IHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4pIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeShkb2xwaGluKScpO1xuICAgICAgICBjaGVja1BhcmFtKGRvbHBoaW4sICdkb2xwaGluJyk7XG5cbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbiA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5iZWFuVG9Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3MgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMucHJvcGVydHlVcGRhdGVIYW5kbGVycyA9IFtdO1xuICAgICAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBmaXhUeXBlKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQllURTpcbiAgICAgICAgICAgIGNhc2UgY29uc3RzLlNIT1JUOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuSU5UOlxuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9ORzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuRkxPQVQ6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET1VCTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuQk9PTEVBTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3RydWUnID09PSBTdHJpbmcodmFsdWUpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5TVFJJTkc6XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5FTlVNOlxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmcm9tRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIGlmICghZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuRnJvbURvbHBoaW4uZ2V0KFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuREFURTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5DQUxFTkRBUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoU3RyaW5nKHZhbHVlKSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXhUeXBlKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIGlmICghZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5ET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuVG9Eb2xwaGluLmdldCh2YWx1ZSk7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5EQVRFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5DQUxFTkRBUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuTE9DQUxfREFURV9GSUVMRF9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgICAgICBjYXNlIGNvbnN0cy5MT0NBTF9EQVRFX1RJTUVfRklFTERfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gdmFsdWUudG9JU09TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICAgICAgY2FzZSBjb25zdHMuWk9ORURfREFURV9USU1FX0ZJRUxEX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHZhbHVlLnRvSVNPU3RyaW5nKCkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZml4VHlwZSh0eXBlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZW5kTGlzdFNwbGljZShjbGFzc1JlcG9zaXRvcnksIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgZnJvbSwgdG8sIG5ld0VsZW1lbnRzKSB7XG4gICAgICAgIGxldCBkb2xwaGluID0gY2xhc3NSZXBvc2l0b3J5LmRvbHBoaW47XG4gICAgICAgIGxldCBtb2RlbCA9IGRvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChtb2RlbElkKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoZXhpc3RzKG1vZGVsKSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzSW5mbyA9IGNsYXNzUmVwb3NpdG9yeS5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBjbGFzc0luZm9bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkpIHtcblxuICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gW1xuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnQEBAIFNPVVJDRV9TWVNURU0gQEBAJywgbnVsbCwgJ2NsaWVudCcpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnc291cmNlJywgbnVsbCwgbW9kZWxJZCksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBudWxsLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnZnJvbScsIG51bGwsIGZyb20pLFxuICAgICAgICAgICAgICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgndG8nLCBudWxsLCB0byksXG4gICAgICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdjb3VudCcsIG51bGwsIG5ld0VsZW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIG5ld0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChkb2xwaGluLmF0dHJpYnV0ZShpbmRleC50b1N0cmluZygpLCBudWxsLCBzZWxmLnRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIGVsZW1lbnQpKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZG9scGhpbi5wcmVzZW50YXRpb25Nb2RlbC5hcHBseShkb2xwaGluLCBbbnVsbCwgJ0BEUDpMU0AnXS5jb25jYXQoYXR0cmlidXRlcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVMaXN0KGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIGxldCBsaXN0ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAoIWV4aXN0cyhsaXN0KSkge1xuICAgICAgICAgICAgY2xhc3NSZXBvc2l0b3J5LnByb3BlcnR5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBbXSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJsb2NrKGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBpZiAoZXhpc3RzKGJsb2NrZWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byBjcmVhdGUgYSBibG9jayB3aGlsZSBhbm90aGVyIGJsb2NrIGV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrZWQgPSB7XG4gICAgICAgICAgICBiZWFuOiBiZWFuLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiBleGlzdHMoYmxvY2tlZCkgJiYgYmxvY2tlZC5iZWFuID09PSBiZWFuICYmIGJsb2NrZWQucHJvcGVydHlOYW1lID09PSBwcm9wZXJ0eU5hbWU7XG4gICAgfVxuXG4gICAgdW5ibG9jaygpIHtcbiAgICAgICAgYmxvY2tlZCA9IG51bGw7XG4gICAgfVxuXG4gICAgbm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG5cbiAgICAgICAgbGV0IG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgICAgICBpZiAoZXhpc3RzKG1vZGVsSWQpKSB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLmRvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChtb2RlbElkKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMobW9kZWwpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsYXNzSW5mbyA9IHRoaXMuY2xhc3Nlcy5nZXQobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHR5cGUpICYmIGV4aXN0cyhhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IGF0dHJpYnV0ZS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuc2V0VmFsdWUodGhpcy50b0RvbHBoaW4odGhpcywgdHlwZSwgbmV3VmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnJvbURvbHBoaW4odGhpcywgdHlwZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5ub3RpZnlBcnJheUNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKScpO1xuICAgICAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaW5kZXgsICdpbmRleCcpO1xuICAgICAgICBjaGVja1BhcmFtKGNvdW50LCAnY291bnQnKTtcbiAgICAgICAgY2hlY2tQYXJhbShyZW1vdmVkRWxlbWVudHMsICdyZW1vdmVkRWxlbWVudHMnKTtcblxuICAgICAgICBpZiAodGhpcy5pc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtb2RlbElkID0gdGhpcy5iZWFuVG9Eb2xwaGluLmdldChiZWFuKTtcbiAgICAgICAgbGV0IGFycmF5ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAoZXhpc3RzKG1vZGVsSWQpICYmIGV4aXN0cyhhcnJheSkpIHtcbiAgICAgICAgICAgIGxldCByZW1vdmVkRWxlbWVudHNDb3VudCA9IEFycmF5LmlzQXJyYXkocmVtb3ZlZEVsZW1lbnRzKSA/IHJlbW92ZWRFbGVtZW50cy5sZW5ndGggOiAwO1xuICAgICAgICAgICAgdGhpcy5zZW5kTGlzdFNwbGljZSh0aGlzLCBtb2RlbElkLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBpbmRleCArIHJlbW92ZWRFbGVtZW50c0NvdW50LCBhcnJheS5zbGljZShpbmRleCwgaW5kZXggKyBjb3VudCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25CZWFuQWRkZWQoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQmVhblJlbW92ZWQoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhblJlbW92ZWQoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBvbkJlYW5VcGRhdGUoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhblVwZGF0ZShoYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgICAgIHRoaXMucHJvcGVydHlVcGRhdGVIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9uQXJyYXlVcGRhdGUoaGFuZGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQXJyYXlVcGRhdGUoaGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgICAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZWdpc3RlckNsYXNzKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkucmVnaXN0ZXJDbGFzcyhtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhc3Nlcy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2xhc3NJbmZvID0ge307XG4gICAgICAgIG1vZGVsLmF0dHJpYnV0ZXMuZmlsdGVyKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLnNlYXJjaCgvXkAvKSA8IDA7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jbGFzc2VzLnNldChtb2RlbC5pZCwgY2xhc3NJbmZvKTtcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyQ2xhc3MobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS51bnJlZ2lzdGVyQ2xhc3MobW9kZWwpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuICAgICAgICB0aGlzLmNsYXNzZXNbJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICB9XG5cbiAgICBsb2FkKG1vZGVsKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubG9hZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB2YXIgYmVhbiA9IHt9O1xuICAgICAgICBtb2RlbC5hdHRyaWJ1dGVzLmZpbHRlcihmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gKGF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUuc2VhcmNoKC9eQC8pIDwgMCk7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgYmVhblthdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IG51bGw7XG4gICAgICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQub2xkVmFsdWUgIT09IGV2ZW50Lm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHNlbGYuZnJvbURvbHBoaW4oc2VsZiwgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdLCBldmVudC5vbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IHNlbGYuZnJvbURvbHBoaW4oc2VsZiwgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdLCBldmVudC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuLCBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbi5zZXQobW9kZWwuaWQsIGJlYW4pO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW4uc2V0KGJlYW4sIG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5jbGFzc0luZm9zLnNldChtb2RlbC5pZCwgY2xhc3NJbmZvKTtcbiAgICAgICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBiZWFuO1xuICAgIH1cblxuICAgIHVubG9hZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnVubG9hZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgbGV0IGJlYW4gPSB0aGlzLmJlYW5Gcm9tRG9scGhpbi5nZXQobW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmJlYW5Gcm9tRG9scGhpblsnZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgICAgICB0aGlzLmJlYW5Ub0RvbHBoaW5bJ2RlbGV0ZSddKGJlYW4pO1xuICAgICAgICB0aGlzLmNsYXNzSW5mb3NbJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICAgICAgaWYgKGV4aXN0cyhiZWFuKSkge1xuICAgICAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiZWFuO1xuICAgIH1cblxuICAgIHNwbGljZUxpc3RFbnRyeShtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnNwbGljZUxpc3RFbnRyeShtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgbGV0IHNvdXJjZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnc291cmNlJyk7XG4gICAgICAgIGxldCBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2F0dHJpYnV0ZScpO1xuICAgICAgICBsZXQgZnJvbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnZnJvbScpO1xuICAgICAgICBsZXQgdG8gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3RvJyk7XG4gICAgICAgIGxldCBjb3VudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnY291bnQnKTtcblxuICAgICAgICBpZiAoZXhpc3RzKHNvdXJjZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkgJiYgZXhpc3RzKGZyb20pICYmIGV4aXN0cyh0bykgJiYgZXhpc3RzKGNvdW50KSkge1xuICAgICAgICAgICAgdmFyIGNsYXNzSW5mbyA9IHRoaXMuY2xhc3NJbmZvcy5nZXQoc291cmNlLnZhbHVlKTtcbiAgICAgICAgICAgIHZhciBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGJlYW4pICYmIGV4aXN0cyhjbGFzc0luZm8pKSB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgICAgICAgICAgLy92YXIgZW50cnkgPSBmcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUxpc3QodGhpcywgdHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3RWxlbWVudHMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudC52YWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoaS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFleGlzdHMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld0VsZW1lbnRzLnB1c2godGhpcy5mcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsb2NrKGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlLCBmcm9tLnZhbHVlLCB0by52YWx1ZSAtIGZyb20udmFsdWUsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQXJyYXlVcGRhdGUtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmxvY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkLiBTb3VyY2UgYmVhbiB1bmtub3duLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbGlzdCBtb2RpZmljYXRpb24gdXBkYXRlIHJlY2VpdmVkXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFwUGFyYW1Ub0RvbHBoaW4ocGFyYW0pIHtcbiAgICAgICAgaWYgKCFleGlzdHMocGFyYW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlb2YgcGFyYW07XG4gICAgICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KHBhcmFtKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBjYW4gYmUgdXNlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ251bWJlcicgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9ubHkgbWFuYWdlZCBEb2xwaGluIEJlYW5zIGFuZCBwcmltaXRpdmUgdHlwZXMgY2FuIGJlIHVzZWRcIik7XG4gICAgfVxuXG4gICAgbWFwRG9scGhpblRvQmVhbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tRG9scGhpbih0aGlzLCBjb25zdHMuRE9MUEhJTl9CRUFOLCB2YWx1ZSk7XG4gICAgfVxufVxuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG4vKiBnbG9iYWwgZXhwb3J0cyAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5pbXBvcnQge21ha2VEb2xwaGlufSBmcm9tICcuL09wZW5Eb2xwaGluLmpzJztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBDb25uZWN0b3IgZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IEJlYW5NYW5hZ2VyIGZyb20gJy4vYmVhbm1hbmFnZXIuanMnO1xuaW1wb3J0IENsYXNzUmVwb3NpdG9yeSBmcm9tICcuL2NsYXNzcmVwby5qcyc7XG5pbXBvcnQgQ29udHJvbGxlck1hbmFnZXIgZnJvbSAnLi9jb250cm9sbGVybWFuYWdlci5qcyc7XG5pbXBvcnQgQ2xpZW50Q29udGV4dCBmcm9tICcuL2NsaWVudGNvbnRleHQuanMnO1xuaW1wb3J0IFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyIGZyb20gJy4vcGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDb250ZXh0RmFjdG9yeSB7XG5cbiAgICBjcmVhdGUodXJsLCBjb25maWcpe1xuICAgICAgICBjaGVja01ldGhvZCgnY29ubmVjdCh1cmwsIGNvbmZpZyknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh1cmwsICd1cmwnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ0NyZWF0aW5nIGNsaWVudCBjb250ZXh0ICcrIHVybCArJyAgICAnKyBKU09OLnN0cmluZ2lmeShjb25maWcpKTtcblxuICAgICAgICBsZXQgYnVpbGRlciA9IG1ha2VEb2xwaGluKCkudXJsKHVybCkucmVzZXQoZmFsc2UpLnNsYWNrTVMoNCkuc3VwcG9ydENPUlModHJ1ZSkubWF4QmF0Y2hTaXplKE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKTtcbiAgICAgICAgaWYgKGV4aXN0cyhjb25maWcpKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGNvbmZpZy5lcnJvckhhbmRsZXIpKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5lcnJvckhhbmRsZXIoY29uZmlnLmVycm9ySGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGNvbmZpZy5oZWFkZXJzSW5mbykgJiYgT2JqZWN0LmtleXMoY29uZmlnLmhlYWRlcnNJbmZvKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5oZWFkZXJzSW5mbyhjb25maWcuaGVhZGVyc0luZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRvbHBoaW4gPSBidWlsZGVyLmJ1aWxkKCk7XG5cbiAgICAgICAgdmFyIHRyYW5zbWl0dGVyID0gbmV3IFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyKHVybCwgY29uZmlnKTtcbiAgICAgICAgdHJhbnNtaXR0ZXIub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjbGllbnRDb250ZXh0LmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9scGhpbi5jbGllbnRDb25uZWN0b3IudHJhbnNtaXR0ZXIgPSB0cmFuc21pdHRlcjtcblxuICAgICAgICB2YXIgY2xhc3NSZXBvc2l0b3J5ID0gbmV3IENsYXNzUmVwb3NpdG9yeShkb2xwaGluKTtcbiAgICAgICAgdmFyIGJlYW5NYW5hZ2VyID0gbmV3IEJlYW5NYW5hZ2VyKGNsYXNzUmVwb3NpdG9yeSk7XG4gICAgICAgIHZhciBjb25uZWN0b3IgPSBuZXcgQ29ubmVjdG9yKHVybCwgZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25maWcpO1xuICAgICAgICB2YXIgY29udHJvbGxlck1hbmFnZXIgPSBuZXcgQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpO1xuXG4gICAgICAgIHZhciBjbGllbnRDb250ZXh0ID0gbmV3IENsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpO1xuICAgICAgICByZXR1cm4gY2xpZW50Q29udGV4dDtcbiAgICB9XG59XG5cbmV4cG9ydHMuQ2xpZW50Q29udGV4dEZhY3RvcnkgPSBDbGllbnRDb250ZXh0RmFjdG9yeTsiLCJpbXBvcnQgRW1pdHRlciBmcm9tICdlbWl0dGVyLWNvbXBvbmVudCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlJztcbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRzL2NvbW1hbmRGYWN0b3J5JztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q29udGV4dHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShiZWFuTWFuYWdlciwgJ2JlYW5NYW5hZ2VyJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck1hbmFnZXIsICdjb250cm9sbGVyTWFuYWdlcicpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbm5lY3RvciwgJ2Nvbm5lY3RvcicpO1xuXG4gICAgICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgICAgIHRoaXMuYmVhbk1hbmFnZXIgPSBiZWFuTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hbmFnZXIgPSBjb250cm9sbGVyTWFuYWdlcjtcbiAgICAgICAgdGhpcy5fY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX2Nvbm5lY3Rvci5jb25uZWN0KCk7XG4gICAgICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKENvbW1hbmRGYWN0b3J5LmNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgfVxuXG4gICAgb25Db25uZWN0KCl7XG4gICAgICAgIGlmKGV4aXN0cyh0aGlzLmNvbm5lY3Rpb25Qcm9taXNlKSl7XG4gICAgICAgICAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvblByb21pc2U7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xsZXIobmFtZSl7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDbGllbnRDb250ZXh0LmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICAgICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3QoKXtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbHBoaW4uc3RvcFB1c2hMaXN0ZW5pbmcoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlci5kZXN0cm95KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVEZXN0cm95Q29udGV4dENvbW1hbmQoKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmJlYW5NYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyTWFuYWdlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29ubmVjdG9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5FbWl0dGVyKENsaWVudENvbnRleHQucHJvdG90eXBlKTsiLCJpbXBvcnQge2V4aXN0cywgY2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCB7SlNfU1RSSU5HX1RZUEV9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICAgIENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCxcbiAgICBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQsXG4gICAgQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRCxcbiAgICBDQUxMX0FDVElPTl9DT01NQU5EX0lELFxuICAgIENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRCxcbiAgICBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lELFxuICAgIENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQsXG4gICAgREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lELFxuICAgIERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lELFxuICAgIERFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX0lELFxuICAgIElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRCxcbiAgICBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lELFxuICAgIFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEXG59IGZyb20gJy4vY29tbWFuZENvbnN0YW50cyc7XG5pbXBvcnQge0lELCBQTV9JRCwgUE1fVFlQRSwgUE1fQVRUUklCVVRFUywgTkFNRSwgQVRUUklCVVRFX0lELCBWQUxVRSwgQ09OVFJPTExFUl9JRCwgUEFSQU1TfSBmcm9tICcuL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IFZhbHVlQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9pbXBsL3ZhbHVlQ2hhbmdlZENvbW1hbmQnO1xuaW1wb3J0IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9pbXBsL2F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQnO1xuaW1wb3J0IENhbGxBY3Rpb25Db21tYW5kIGZyb20gJy4vaW1wbC9jYWxsQWN0aW9uQ29tbWFuZCc7XG5pbXBvcnQgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kIGZyb20gJy4vaW1wbC9jaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQnO1xuaW1wb3J0IENyZWF0ZUNvbnRleHRDb21tYW5kIGZyb20gJy4vaW1wbC9jcmVhdGVDb250ZXh0Q29tbWFuZCc7XG5pbXBvcnQgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9pbXBsL2NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kJztcbmltcG9ydCBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgZnJvbSAnLi9pbXBsL2NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCc7XG5pbXBvcnQgRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIGZyb20gJy4vaW1wbC9kZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQnO1xuaW1wb3J0IERlc3Ryb3lDb250ZXh0Q29tbWFuZCBmcm9tICcuL2ltcGwvZGVzdHJveUNvbnRleHRDb21tYW5kJztcbmltcG9ydCBEZXN0cm95Q29udHJvbGxlckNvbW1hbmQgZnJvbSAnLi9pbXBsL2Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCc7XG5pbXBvcnQgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9pbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQnO1xuaW1wb3J0IFByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQgZnJvbSAnLi9pbXBsL3ByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQnO1xuaW1wb3J0IFN0YXJ0TG9uZ1BvbGxDb21tYW5kIGZyb20gJy4vaW1wbC9zdGFydExvbmdQb2xsQ29tbWFuZCc7XG5pbXBvcnQgQ29kZWNFcnJvciBmcm9tICcuL2NvZGVjRXJyb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZGVjIHtcblxuICAgIHN0YXRpYyBfZW5jb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hdHRyaWJ1dGVJZCwgXCJjb21tYW5kLmF0dHJpYnV0ZUlkXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQubWV0YWRhdGFOYW1lLCBcImNvbW1hbmQubWV0YWRhdGFOYW1lXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBBVFRSSUJVVEVfTUVUQURBVEFfQ0hBTkdFRF9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdID0gY29tbWFuZC5hdHRyaWJ1dGVJZDtcbiAgICAgICAganNvbkNvbW1hbmRbTkFNRV0gPSBjb21tYW5kLm1ldGFkYXRhTmFtZTtcbiAgICAgICAganNvbkNvbW1hbmRbVkFMVUVdID0gY29tbWFuZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXSwgXCJqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5hdHRyaWJ1dGVJZCA9IGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF07XG4gICAgICAgIGNvbW1hbmQubWV0YWRhdGFOYW1lID0ganNvbkNvbW1hbmRbTkFNRV07XG4gICAgICAgIGNvbW1hbmQudmFsdWUgPSBqc29uQ29tbWFuZFtWQUxVRV07XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ2FsbEFjdGlvbkNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNhbGxBY3Rpb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLmNvbnRyb2xsZXJpZCwgXCJjb21tYW5kLmNvbnRyb2xsZXJpZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLmFjdGlvbk5hbWUsIFwiY29tbWFuZC5hY3Rpb25OYW1lXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucGFyYW1zLCBcImNvbW1hbmQucGFyYW1zXCIpO1xuXG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IENBTExfQUNUSU9OX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdID0gY29tbWFuZC5jb250cm9sbGVyaWQ7XG4gICAgICAgIGpzb25Db21tYW5kW05BTUVdID0gY29tbWFuZC5hY3Rpb25OYW1lO1xuICAgICAgICBqc29uQ29tbWFuZFtQQVJBTVNdID0gY29tbWFuZC5wYXJhbXMubWFwKChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgcmVzdWx0W05BTUVdID0gcGFyYW0ubmFtZTtcbiAgICAgICAgICAgIGlmIChleGlzdHMocGFyYW0udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W1ZBTFVFXSA9IHBhcmFtLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUNhbGxBY3Rpb25Db21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZGVjb2RlQ2FsbEFjdGlvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF0sIFwianNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF1cIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbTkFNRV0sIFwianNvbkNvbW1hbmRbTkFNRV1cIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbUEFSQU1TXSwgXCJqc29uQ29tbWFuZFtQQVJBTVNdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENhbGxBY3Rpb25Db21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuY29udHJvbGxlcmlkID0ganNvbkNvbW1hbmRbQ09OVFJPTExFUl9JRF07XG4gICAgICAgIGNvbW1hbmQuYWN0aW9uTmFtZSA9IGpzb25Db21tYW5kW05BTUVdO1xuICAgICAgICAvL1RPRE86IEbDvHIgZGllIFBhcmFtcyBzb2xsdGVuIHdpciBlaW5lIEtsYXNzZSBiZXJlaXRzdGVsbGVuXG4gICAgICAgIGNvbW1hbmQucGFyYW1zID0ganNvbkNvbW1hbmRbUEFSQU1TXS5tYXAoKHBhcmFtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICduYW1lJzogcGFyYW1bTkFNRV0sXG4gICAgICAgICAgICAgICAgJ3ZhbHVlJzogZXhpc3RzKHBhcmFtW1ZBTFVFXSkgPyBwYXJhbVtWQUxVRV0gOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hdHRyaWJ1dGVJZCwgXCJjb21tYW5kLmF0dHJpYnV0ZUlkXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQubWV0YWRhdGFOYW1lLCBcImNvbW1hbmQubWV0YWRhdGFOYW1lXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDSEFOR0VfQVRUUklCVVRFX01FVEFEQVRBX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0gPSBjb21tYW5kLmF0dHJpYnV0ZUlkO1xuICAgICAgICBqc29uQ29tbWFuZFtOQU1FXSA9IGNvbW1hbmQubWV0YWRhdGFOYW1lO1xuICAgICAgICBqc29uQ29tbWFuZFtWQUxVRV0gPSBjb21tYW5kLnZhbHVlO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXSwgXCJqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmF0dHJpYnV0ZUlkID0ganNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXTtcbiAgICAgICAgY29tbWFuZC5tZXRhZGF0YU5hbWUgPSBqc29uQ29tbWFuZFtOQU1FXTtcbiAgICAgICAgY29tbWFuZC52YWx1ZSA9IGpzb25Db21tYW5kW1ZBTFVFXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlQ3JlYXRlQ29udGV4dENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUNyZWF0ZUNvbnRleHRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENyZWF0ZUNvbnRleHRDb21tYW5kKCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5jb250cm9sbGVyTmFtZSwgXCJjb21tYW5kLmNvbnRyb2xsZXJOYW1lXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtOQU1FXSA9IGNvbW1hbmQuY29udHJvbGxlck5hbWU7XG4gICAgICAgIGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdID0gY29tbWFuZC5wYXJlbnRDb250cm9sbGVySWQ7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW05BTUVdLCBcImpzb25Db21tYW5kW05BTUVdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdLCBcImpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuY29udHJvbGxlck5hbWUgPSBqc29uQ29tbWFuZFtOQU1FXTtcbiAgICAgICAgY29tbWFuZC5wYXJlbnRDb250cm9sbGVySWQgPSBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5wbUlkLCBcImNvbW1hbmQucG1JZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLnBtVHlwZSwgXCJjb21tYW5kLnBtVHlwZVwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtQTV9JRF0gPSBjb21tYW5kLnBtSWQ7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX1RZUEVdID0gY29tbWFuZC5wbVR5cGU7XG4gICAgICAgIGpzb25Db21tYW5kW1BNX0FUVFJJQlVURVNdID0gY29tbWFuZC5hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgICAgICAgICByZXN1bHRbTkFNRV0gPSBhdHRyaWJ1dGUucHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgcmVzdWx0W0FUVFJJQlVURV9JRF0gPSBhdHRyaWJ1dGUuaWQ7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGF0dHJpYnV0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbVkFMVUVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChqc29uQ29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLmRlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZFtQTV9JRF0sIFwianNvbkNvbW1hbmRbUE1fSURdXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BNX1RZUEVdLCBcImpzb25Db21tYW5kW1BNX1RZUEVdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLnBtSWQgPSBqc29uQ29tbWFuZFtQTV9JRF07XG4gICAgICAgIGNvbW1hbmQucG1UeXBlID0ganNvbkNvbW1hbmRbUE1fVFlQRV07XG5cbiAgICAgICAgLy9UT0RPOiBGw7xyIGRpZSBBdHRyaWJ1dGUgc29sbHRlbiB3aXIgZWluZSBLbGFzc2UgYmVyZWl0c3RlbGxlblxuICAgICAgICBjb21tYW5kLmF0dHJpYnV0ZXMgPSBqc29uQ29tbWFuZFtQTV9BVFRSSUJVVEVTXS5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAncHJvcGVydHlOYW1lJzogYXR0cmlidXRlW05BTUVdLFxuICAgICAgICAgICAgICAgICdpZCc6IGF0dHJpYnV0ZVtBVFRSSUJVVEVfSURdLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IGV4aXN0cyhhdHRyaWJ1dGVbVkFMVUVdKSA/IGF0dHJpYnV0ZVtWQUxVRV0gOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCkge1xuICAgICAgICBjaGVja01ldGhvZChcIkNvZGVjLl9lbmNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZCwgXCJjb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQucG1JZCwgXCJjb21tYW5kLnBtSWRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IERFTEVURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbUE1fSURdID0gY29tbWFuZC5wbUlkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZGVjb2RlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW1BNX0lEXSwgXCJqc29uQ29tbWFuZFtQTV9JRF1cIik7XG5cblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5wbUlkID0ganNvbkNvbW1hbmRbUE1fSURdO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZURlc3Ryb3lDb250ZXh0Q29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVEZXN0cm95Q29udGV4dENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZGVjb2RlRGVzdHJveUNvbnRleHRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IERlc3Ryb3lDb250ZXh0Q29tbWFuZCgpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZURlc3Ryb3lDb250cm9sbGVyQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5jb250cm9sbGVySWQsIFwiY29tbWFuZC5jb250cm9sbGVySWRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IERFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX0lEO1xuICAgICAgICBqc29uQ29tbWFuZFtDT05UUk9MTEVSX0lEXSA9IGNvbW1hbmQuY29udHJvbGxlcklkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZGVjb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdLCBcImpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IERlc3Ryb3lDb250cm9sbGVyQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmNvbnRyb2xsZXJJZCA9IGpzb25Db21tYW5kW0NPTlRST0xMRVJfSURdO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2VuY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG5cbiAgICAgICAgbGV0IGpzb25Db21tYW5kID0ge307XG4gICAgICAgIGpzb25Db21tYW5kW0lEXSA9IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRDtcbiAgICAgICAgcmV0dXJuIGpzb25Db21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZGVjb2RlSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZUludGVycnVwdExvbmdQb2xsQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShqc29uQ29tbWFuZCwgXCJqc29uQ29tbWFuZFwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5fZW5jb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5wbUlkLCBcImNvbW1hbmQucG1JZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRDtcbiAgICAgICAganNvbkNvbW1hbmRbUE1fSURdID0gY29tbWFuZC5wbUlkO1xuICAgICAgICByZXR1cm4ganNvbkNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZVByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmQsIFwianNvbkNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oanNvbkNvbW1hbmRbUE1fSURdLCBcImpzb25Db21tYW5kW1BNX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQucG1JZCA9IGpzb25Db21tYW5kW1BNX0lEXTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbmNvZGVTdGFydExvbmdQb2xsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2VuY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmQsIFwiY29tbWFuZFwiKTtcblxuICAgICAgICBsZXQganNvbkNvbW1hbmQgPSB7fTtcbiAgICAgICAganNvbkNvbW1hbmRbSURdID0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQ7XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKGpzb25Db21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuX2RlY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuXG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IFN0YXJ0TG9uZ1BvbGxDb21tYW5kKCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZFwiKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCBcImNvbW1hbmRcIik7XG4gICAgICAgIGNoZWNrUGFyYW0oY29tbWFuZC5hdHRyaWJ1dGVJZCwgXCJjb21tYW5kLmF0dHJpYnV0ZUlkXCIpO1xuXG4gICAgICAgIGxldCBqc29uQ29tbWFuZCA9IHt9O1xuICAgICAgICBqc29uQ29tbWFuZFtJRF0gPSBWQUxVRV9DSEFOR0VEX0NPTU1BTkRfSUQ7XG4gICAgICAgIGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0gPSBjb21tYW5kLmF0dHJpYnV0ZUlkO1xuICAgICAgICBpZiAoZXhpc3RzKGNvbW1hbmQubmV3VmFsdWUpKSB7XG4gICAgICAgICAgICBqc29uQ29tbWFuZFtWQUxVRV0gPSBjb21tYW5kLm5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqc29uQ29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RlY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoanNvbkNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kLCBcImpzb25Db21tYW5kXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGpzb25Db21tYW5kW0FUVFJJQlVURV9JRF0sIFwianNvbkNvbW1hbmRbQVRUUklCVVRFX0lEXVwiKTtcblxuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBWYWx1ZUNoYW5nZWRDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuYXR0cmlidXRlSWQgPSBqc29uQ29tbWFuZFtBVFRSSUJVVEVfSURdO1xuICAgICAgICBpZiAoZXhpc3RzKGpzb25Db21tYW5kW1ZBTFVFXSkpIHtcbiAgICAgICAgICAgIGNvbW1hbmQubmV3VmFsdWUgPSBqc29uQ29tbWFuZFtWQUxVRV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21tYW5kLm5ld1ZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZW5jb2RlKGNvbW1hbmRzKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKFwiQ29kZWMuZW5jb2RlXCIpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbW1hbmRzLCBcImNvbW1hbmRzXCIpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGNvbW1hbmRzLm1hcCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09IEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ0FMTF9BQ1RJT05fQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDYWxsQWN0aW9uQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX0NPTlRST0xMRVJfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2VuY29kZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gREVTVFJPWV9DT05URVhUX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlRGVzdHJveUNvbnRleHRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFBSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZW5jb2RlU3RhcnRMb25nUG9sbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9lbmNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29kZWNFcnJvcignQ29tbWFuZCBvZiB0eXBlICcgKyBjb21tYW5kLmlkICsgJyBjYW4gbm90IGJlIGhhbmRsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWNvZGUodHJhbnNtaXR0ZWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoXCJDb2RlYy5kZWNvZGVcIik7XG4gICAgICAgIGNoZWNrUGFyYW0odHJhbnNtaXR0ZWQsIFwidHJhbnNtaXR0ZWRcIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc21pdHRlZCA9PT0gSlNfU1RSSU5HX1RZUEUpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRyYW5zbWl0dGVkKS5tYXAoZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5pZCA9PT0gQVRUUklCVVRFX01FVEFEQVRBX0NIQU5HRURfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENBTExfQUNUSU9OX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZUNhbGxBY3Rpb25Db21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBDUkVBVEVfQ09OVEVYVF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDcmVhdGVDb250ZXh0Q29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IENSRUFURV9DT05UUk9MTEVSX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gQ1JFQVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09IERFU1RST1lfQ09OVEVYVF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVEZXN0cm95Q29udGV4dENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9JRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZGVjb2RlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kLmlkID09PSBQUkVTRU5UQVRJT05fTU9ERUxfREVMRVRFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gU1RBUlRfTE9OR19QT0xMX0NPTU1BTkRfSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RlY29kZVN0YXJ0TG9uZ1BvbGxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gVkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb2RlY0Vycm9yKCdDb21tYW5kIG9mIHR5cGUgJyArIGNvbW1hbmQuaWQgKyAnIGNhbiBub3QgYmUgaGFuZGxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IENvZGVjRXJyb3IoJ0NhbiBub3QgZGVjb2RlIGRhdGEgdGhhdCBpcyBub3Qgb2YgdHlwZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZGVjRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB9XG59IiwiZXhwb3J0IGNvbnN0IEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQgPSAnQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkJztcbmV4cG9ydCBjb25zdCBDQUxMX0FDVElPTl9DT01NQU5EX0lEID0gJ0NhbGxBY3Rpb24nO1xuZXhwb3J0IGNvbnN0IENIQU5HRV9BVFRSSUJVVEVfTUVUQURBVEFfQ09NTUFORF9JRCA9ICdDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YSc7XG5leHBvcnQgY29uc3QgQ1JFQVRFX0NPTlRFWFRfQ09NTUFORF9JRCA9ICdDcmVhdGVDb250ZXh0JztcbmV4cG9ydCBjb25zdCBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lEID0gJ0NyZWF0ZUNvbnRyb2xsZXInO1xuZXhwb3J0IGNvbnN0IENSRUFURV9QUkVTRU5UQVRJT05fTU9ERUxfQ09NTUFORF9JRCA9ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCc7XG5leHBvcnQgY29uc3QgREVMRVRFX1BSRVNFTlRBVElPTl9NT0RFTF9DT01NQU5EX0lEID0gJ0RlbGV0ZVByZXNlbnRhdGlvbk1vZGVsJztcbmV4cG9ydCBjb25zdCBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRCA9ICdEZXN0cm95Q29udGV4dCc7XG5leHBvcnQgY29uc3QgREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUQgPSAnRGVzdHJveUNvbnRyb2xsZXInO1xuZXhwb3J0IGNvbnN0IElOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRCA9ICdJbnRlcnJ1cHRMb25nUG9sbCc7XG5leHBvcnQgY29uc3QgUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRCA9ICdQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWQnO1xuZXhwb3J0IGNvbnN0IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEID0gJ1N0YXJ0TG9uZ1BvbGwnO1xuZXhwb3J0IGNvbnN0IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRCA9ICdWYWx1ZUNoYW5nZWQnO1xuXG5leHBvcnQgY29uc3QgSUQgPSBcImlkXCI7XG5leHBvcnQgY29uc3QgQVRUUklCVVRFX0lEID0gXCJhX2lkXCI7XG5leHBvcnQgY29uc3QgUE1fSUQgPSBcInBfaWRcIjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEID0gXCJjX2lkXCI7XG5leHBvcnQgY29uc3QgUE1fVFlQRSA9IFwidFwiO1xuZXhwb3J0IGNvbnN0IE5BTUUgPSBcIm5cIjtcbmV4cG9ydCBjb25zdCBWQUxVRSA9IFwidlwiO1xuZXhwb3J0IGNvbnN0IFBBUkFNUyA9IFwicFwiO1xuZXhwb3J0IGNvbnN0IFBNX0FUVFJJQlVURVMgPSBcImFcIjsiLCJpbXBvcnQgQ3JlYXRlQ29udGV4dENvbW1hbmQgZnJvbSAnLi9pbXBsL2NyZWF0ZUNvbnRleHRDb21tYW5kLmpzJztcbmltcG9ydCBDcmVhdGVDb250cm9sbGVyQ29tbWFuZCBmcm9tICcuL2ltcGwvY3JlYXRlQ29udHJvbGxlckNvbW1hbmQuanMnO1xuaW1wb3J0IENhbGxBY3Rpb25Db21tYW5kIGZyb20gJy4vaW1wbC9jYWxsQWN0aW9uQ29tbWFuZC5qcyc7XG5pbXBvcnQgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kIGZyb20gJy4vaW1wbC9kZXN0cm95Q29udHJvbGxlckNvbW1hbmQuanMnO1xuaW1wb3J0IERlc3Ryb3lDb250ZXh0Q29tbWFuZCBmcm9tICcuL2ltcGwvZGVzdHJveUNvbnRleHRDb21tYW5kLmpzJztcbmltcG9ydCBTdGFydExvbmdQb2xsQ29tbWFuZCBmcm9tICcuL2ltcGwvc3RhcnRMb25nUG9sbENvbW1hbmQuanMnO1xuaW1wb3J0IEludGVycnVwdExvbmdQb2xsQ29tbWFuZCBmcm9tICcuL2ltcGwvaW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kLmpzJztcbmltcG9ydCBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgZnJvbSAnLi9pbXBsL2NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC5qcyc7XG5pbXBvcnQgRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kIGZyb20gJy4vaW1wbC9kZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuanMnO1xuaW1wb3J0IFByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQgZnJvbSAnLi9pbXBsL3ByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQuanMnO1xuaW1wb3J0IFZhbHVlQ2hhbmdlZENvbW1hbmQgZnJvbSAnLi9pbXBsL3ZhbHVlQ2hhbmdlZENvbW1hbmQuanMnO1xuaW1wb3J0IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCBmcm9tICcuL2ltcGwvY2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kLmpzJztcbmltcG9ydCBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kIGZyb20gJy4vaW1wbC9hdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWFuZEZhY3Rvcnkge1xuXG4gICAgc3RhdGljIGNyZWF0ZUNyZWF0ZUNvbnRleHRDb21tYW5kKCkge1xuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUNvbnRleHRDb21tYW5kKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUNyZWF0ZUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXJOYW1lLCBwYXJlbnRDb250cm9sbGVySWQpIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBDcmVhdGVDb250cm9sbGVyQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDYWxsQWN0aW9uQ29tbWFuZChjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IENhbGxBY3Rpb25Db21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChjb250cm9sbGVyaWQsIGFjdGlvbk5hbWUsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVEZXN0cm95Q29udHJvbGxlckNvbW1hbmQoY29udHJvbGxlcklkKSB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKCk7XG4gICAgICAgIGNvbW1hbmQuaW5pdChjb250cm9sbGVySWQpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlRGVzdHJveUNvbnRleHRDb21tYW5kKCkge1xuICAgICAgICByZXR1cm4gbmV3IERlc3Ryb3lDb250ZXh0Q29tbWFuZCgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGFydExvbmdQb2xsQ29tbWFuZCgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQocHJlc2VudGF0aW9uTW9kZWwpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHBtSWQpIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KHBtSWQpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlUHJlc2VudGF0aW9uTW9kZWxEZWxldGVkQ29tbWFuZChwbUlkKSB7XG4gICAgICAgIGxldCBjb21tYW5kID0gbmV3IFByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KHBtSWQpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlVmFsdWVDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGVJZCwgbmV3VmFsdWUpIHtcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgVmFsdWVDaGFuZ2VkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQoYXR0cmlidXRlSWQsIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICBsZXQgY29tbWFuZCA9IG5ldyBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoKTtcbiAgICAgICAgY29tbWFuZC5pbml0KGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBuZXcgQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCgpO1xuICAgICAgICBjb21tYW5kLmluaXQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICB9XG59IiwiaW1wb3J0IHtBVFRSSUJVVEVfTUVUQURBVEFfQ0hBTkdFRF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IEFUVFJJQlVURV9NRVRBREFUQV9DSEFOR0VEX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShhdHRyaWJ1dGVJZCwgJ2F0dHJpYnV0ZUlkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obWV0YWRhdGFOYW1lLCAnbWV0YWRhdGFOYW1lJyk7XG5cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICB0aGlzLm1ldGFkYXRhTmFtZSA9IG1ldGFkYXRhTmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbn0iLCJpbXBvcnQge0NBTExfQUNUSU9OX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxsQWN0aW9uQ29tbWFuZCB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBDQUxMX0FDVElPTl9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQoY29udHJvbGxlcmlkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NyZWF0ZUNvbnRyb2xsZXJDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJpZCwgJ2NvbnRyb2xsZXJpZCcpO1xuICAgICAgICBjaGVja1BhcmFtKGFjdGlvbk5hbWUsICdhY3Rpb25OYW1lJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVyaWQgPSBjb250cm9sbGVyaWQ7XG4gICAgICAgIHRoaXMuYWN0aW9uTmFtZSA9IGFjdGlvbk5hbWU7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgIH1cblxufSIsImltcG9ydCB7Q0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gQ0hBTkdFX0FUVFJJQlVURV9NRVRBREFUQV9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShhdHRyaWJ1dGVJZCwgJ2F0dHJpYnV0ZUlkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obWV0YWRhdGFOYW1lLCAnbWV0YWRhdGFOYW1lJyk7XG5cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICB0aGlzLm1ldGFkYXRhTmFtZSA9IG1ldGFkYXRhTmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbn0iLCJpbXBvcnQge0NSRUFURV9DT05URVhUX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVDb250ZXh0Q29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IENSRUFURV9DT05URVhUX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBDUkVBVEVfQ09OVFJPTExFUl9DT01NQU5EX0lEO1xuICAgIH1cblxuICAgIGluaXQoY29udHJvbGxlck5hbWUsIHBhcmVudENvbnRyb2xsZXJJZCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ3JlYXRlQ29udHJvbGxlckNvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck5hbWUsICdjb250cm9sbGVyTmFtZScpO1xuXG4gICAgICAgIHRoaXMuY29udHJvbGxlck5hbWUgPSBjb250cm9sbGVyTmFtZTtcbiAgICAgICAgdGhpcy5wYXJlbnRDb250cm9sbGVySWQgPSBwYXJlbnRDb250cm9sbGVySWQ7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtDUkVBVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBDUkVBVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLmluaXQoKScpO1xuICAgICAgICBjaGVja1BhcmFtKHByZXNlbnRhdGlvbk1vZGVsLCAncHJlc2VudGF0aW9uTW9kZWwnKTtcblxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jbGllbnRTaWRlT25seSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBtSWQgPSBwcmVzZW50YXRpb25Nb2RlbC5pZDtcbiAgICAgICAgdGhpcy5wbVR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHZhciBjb21tYW5kID0gdGhpcztcbiAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgIGNvbW1hbmQuYXR0cmlidXRlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IGF0dHIucHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgIGlkOiBhdHRyLmlkLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyLmdldFZhbHVlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHtERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBERUxFVEVfUFJFU0VOVEFUSU9OX01PREVMX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChwbUlkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocG1JZCwgJ3BtSWQnKTtcblxuICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgIH1cbn1cbiIsImltcG9ydCB7REVTVFJPWV9DT05URVhUX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZXN0cm95Q29udGV4dENvbW1hbmQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBERVNUUk9ZX0NPTlRFWFRfQ09NTUFORF9JRDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0RFU1RST1lfQ09OVFJPTExFUl9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfSUQ7XG4gICAgfVxuXG4gICAgaW5pdChjb250cm9sbGVySWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Rlc3Ryb3lDb250cm9sbGVyQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVySWQsICdjb250cm9sbGVySWQnKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJJZCA9IGNvbnRyb2xsZXJJZDtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0lOVEVSUlVQVF9MT05HX1BPTExfQ09NTUFORF9JRH0gZnJvbSAnLi4vY29tbWFuZENvbnN0YW50cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJydXB0TG9uZ1BvbGxDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gSU5URVJSVVBUX0xPTkdfUE9MTF9DT01NQU5EX0lEO1xuICAgIH1cbn0iLCJpbXBvcnQge1BSRVNFTlRBVElPTl9NT0RFTF9ERUxFVEVEX0NPTU1BTkRfSUR9IGZyb20gJy4uL2NvbW1hbmRDb25zdGFudHMnO1xuaW1wb3J0IHtjaGVja01ldGhvZCwgY2hlY2tQYXJhbX0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVzZW50YXRpb25Nb2RlbERlbGV0ZWRDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkID0gUFJFU0VOVEFUSU9OX01PREVMX0RFTEVURURfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KHBtSWQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ1ByZXNlbnRhdGlvbk1vZGVsRGVsZXRlZENvbW1hbmQuaW5pdCgpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0ocG1JZCwgJ3BtSWQnKTtcblxuICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgIH1cbn0iLCJpbXBvcnQge1NUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFydExvbmdQb2xsQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IFNUQVJUX0xPTkdfUE9MTF9DT01NQU5EX0lEO1xuICAgIH1cbn1cbiIsImltcG9ydCB7VkFMVUVfQ0hBTkdFRF9DT01NQU5EX0lEfSBmcm9tICcuLi9jb21tYW5kQ29uc3RhbnRzJztcbmltcG9ydCB7Y2hlY2tNZXRob2QsIGNoZWNrUGFyYW19IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFsdWVDaGFuZ2VkQ29tbWFuZCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pZCA9IFZBTFVFX0NIQU5HRURfQ09NTUFORF9JRDtcbiAgICB9XG5cbiAgICBpbml0KGF0dHJpYnV0ZUlkLCBuZXdWYWx1ZSkge1xuICAgICAgICBjaGVja01ldGhvZCgnVmFsdWVDaGFuZ2VkQ29tbWFuZC5pbml0KCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShhdHRyaWJ1dGVJZCwgJ2F0dHJpYnV0ZUlkJyk7XG5cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICB0aGlzLm5ld1ZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxufSIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBQcm9taXNlIGZyb20gJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnO1xuaW1wb3J0IHtleGlzdHN9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IENvbW1hbmRGYWN0b3J5IGZyb20gJy4vY29tbWFuZHMvY29tbWFuZEZhY3RvcnknO1xuaW1wb3J0IHtBRERFRF9UWVBFLCBSRU1PVkVEX1RZUEV9IGZyb20gJy4vY29uc3RhbnRzJztcblxuXG5jb25zdCBET0xQSElOX0JFQU4gPSAnQEBAIERPTFBISU5fQkVBTiBAQEAnO1xuY29uc3QgQUNUSU9OX0NBTExfQkVBTiA9ICdAQEAgQ09OVFJPTExFUl9BQ1RJT05fQ0FMTF9CRUFOIEBAQCc7XG5jb25zdCBISUdITEFOREVSX0JFQU4gPSAnQEBAIEhJR0hMQU5ERVJfQkVBTiBAQEAnO1xuY29uc3QgRE9MUEhJTl9MSVNUX1NQTElDRSA9ICdARFA6TFNAJztcbmNvbnN0IFNPVVJDRV9TWVNURU0gPSAnQEBAIFNPVVJDRV9TWVNURU0gQEBAJztcbmNvbnN0IFNPVVJDRV9TWVNURU1fQ0xJRU5UID0gJ2NsaWVudCc7XG5jb25zdCBTT1VSQ0VfU1lTVEVNX1NFUlZFUiA9ICdzZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25uZWN0b3J7XG5cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyknKTtcbiAgICAgICAgY2hlY2tQYXJhbSh1cmwsICd1cmwnKTtcbiAgICAgICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgICAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgc2VsZi5oaWdobGFuZGVyUE1SZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLm9uTW9kZWxTdG9yZUNoYW5nZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IGV2ZW50LmNsaWVudFByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICAgICAgbGV0IHNvdXJjZVN5c3RlbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShTT1VSQ0VfU1lTVEVNKTtcbiAgICAgICAgICAgIGlmIChleGlzdHMoc291cmNlU3lzdGVtKSAmJiBzb3VyY2VTeXN0ZW0udmFsdWUgPT09IFNPVVJDRV9TWVNURU1fU0VSVkVSKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmV2ZW50VHlwZSA9PT0gQURERURfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxBZGRlZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5ldmVudFR5cGUgPT09IFJFTU9WRURfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTW9kZWxSZW1vdmVkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25uZWN0KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5kb2xwaGluLnN0YXJ0UHVzaExpc3RlbmluZyhDb21tYW5kRmFjdG9yeS5jcmVhdGVTdGFydExvbmdQb2xsQ29tbWFuZCgpLCBDb21tYW5kRmFjdG9yeS5jcmVhdGVJbnRlcnJ1cHRMb25nUG9sbENvbW1hbmQoKSk7XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIG9uTW9kZWxBZGRlZChtb2RlbCkge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yLm9uTW9kZWxBZGRlZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBBQ1RJT05fQ0FMTF9CRUFOOlxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBET0xQSElOX0JFQU46XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkucmVnaXN0ZXJDbGFzcyhtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEhJR0hMQU5ERVJfQkVBTjpcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsYW5kZXJQTVJlc29sdmVyKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX1NQTElDRTpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5zcGxpY2VMaXN0RW50cnkobW9kZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9scGhpbi5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb2RlbFJlbW92ZWQobW9kZWwpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5vbk1vZGVsUmVtb3ZlZChtb2RlbCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgICAgIGxldCB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnVucmVnaXN0ZXJDbGFzcyhtb2RlbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW52b2tlKGNvbW1hbmQpIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0Nvbm5lY3Rvci5pbnZva2UoY29tbWFuZCknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb21tYW5kLCAnY29tbWFuZCcpO1xuXG4gICAgICAgIHZhciBkb2xwaGluID0gdGhpcy5kb2xwaGluO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGRvbHBoaW4uc2VuZChjb21tYW5kLCB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEhpZ2hsYW5kZXJQTSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaGxhbmRlclBNUHJvbWlzZTtcbiAgICB9XG59XG5cbmV4cG9ydHMuU09VUkNFX1NZU1RFTSA9IFNPVVJDRV9TWVNURU07XG5leHBvcnRzLlNPVVJDRV9TWVNURU1fQ0xJRU5UID0gU09VUkNFX1NZU1RFTV9DTElFTlQ7XG5leHBvcnRzLlNPVVJDRV9TWVNURU1fU0VSVkVSID0gU09VUkNFX1NZU1RFTV9TRVJWRVI7XG5leHBvcnRzLkFDVElPTl9DQUxMX0JFQU4gPSBBQ1RJT05fQ0FMTF9CRUFOO1xuIiwiZXhwb3J0IGNvbnN0IEpTX1NUUklOR19UWVBFID0gJ3N0cmluZyc7XG5cbmV4cG9ydCBjb25zdCBET0xQSElOX0JFQU4gPSAwO1xuZXhwb3J0IGNvbnN0IEJZVEUgPSAxO1xuZXhwb3J0IGNvbnN0IFNIT1JUID0gMjtcbmV4cG9ydCBjb25zdCBJTlQgPSAzO1xuZXhwb3J0IGNvbnN0IExPTkcgPSA0O1xuZXhwb3J0IGNvbnN0IEZMT0FUID0gNTtcbmV4cG9ydCBjb25zdCBET1VCTEUgPSA2O1xuZXhwb3J0IGNvbnN0IEJPT0xFQU4gPSA3O1xuZXhwb3J0IGNvbnN0IFNUUklORyA9IDg7XG5leHBvcnQgY29uc3QgREFURSA9IDk7XG5leHBvcnQgY29uc3QgRU5VTSA9IDEwO1xuZXhwb3J0IGNvbnN0IENBTEVOREFSID0gMTE7XG5leHBvcnQgY29uc3QgTE9DQUxfREFURV9GSUVMRF9UWVBFID0gNTU7XG5leHBvcnQgY29uc3QgTE9DQUxfREFURV9USU1FX0ZJRUxEX1RZUEUgPSA1MjtcbmV4cG9ydCBjb25zdCBaT05FRF9EQVRFX1RJTUVfRklFTERfVFlQRSA9IDU0O1xuXG5cbmV4cG9ydCBjb25zdCBBRERFRF9UWVBFID0gXCJBRERFRFwiO1xuZXhwb3J0IGNvbnN0IFJFTU9WRURfVFlQRSA9IFwiUkVNT1ZFRFwiO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFByb21pc2UgZnJvbSAnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZSc7XG5pbXBvcnQgU2V0IGZyb20nLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0JztcbmltcG9ydCB7ZXhpc3RzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7Y2hlY2tNZXRob2R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtjaGVja1BhcmFtfSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IENvbnRyb2xsZXJQcm94eSBmcm9tICcuL2NvbnRyb2xsZXJwcm94eS5qcyc7XG5cbmltcG9ydCBDb21tYW5kRmFjdG9yeSBmcm9tICcuL2NvbW1hbmRzL2NvbW1hbmRGYWN0b3J5LmpzJztcblxuXG5pbXBvcnQgeyBTT1VSQ0VfU1lTVEVNIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuaW1wb3J0IHsgU09VUkNFX1NZU1RFTV9DTElFTlQgfSBmcm9tICcuL2Nvbm5lY3Rvci5qcyc7XG5pbXBvcnQgeyBBQ1RJT05fQ0FMTF9CRUFOIH0gZnJvbSAnLi9jb25uZWN0b3IuanMnO1xuXG5jb25zdCBDT05UUk9MTEVSX0lEID0gJ2NvbnRyb2xsZXJJZCc7XG5jb25zdCBNT0RFTCA9ICdtb2RlbCc7XG5jb25zdCBFUlJPUl9DT0RFID0gJ2Vycm9yQ29kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJNYW5hZ2Vye1xuXG4gICAgY29uc3RydWN0b3IoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3Ipe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICAgICAgY2hlY2tQYXJhbShjbGFzc1JlcG9zaXRvcnksICdjbGFzc1JlcG9zaXRvcnknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb25uZWN0b3IsICdjb25uZWN0b3InKTtcblxuICAgICAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IgPSBjb25uZWN0b3I7XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udHJvbGxlcihuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVDb250cm9sbGVyKG5hbWUsIG51bGwpXG4gICAgfVxuXG4gICAgX2NyZWF0ZUNvbnRyb2xsZXIobmFtZSwgcGFyZW50Q29udHJvbGxlcklkKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBjb250cm9sbGVySWQsIG1vZGVsSWQsIG1vZGVsLCBjb250cm9sbGVyO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oKGhpZ2hsYW5kZXJQTSkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVDcmVhdGVDb250cm9sbGVyQ29tbWFuZChuYW1lLCBwYXJlbnRDb250cm9sbGVySWQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcklkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbElkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShNT0RFTCkuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBEb2xwaGluVG9CZWFuKG1vZGVsSWQpO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250cm9sbGVycy5hZGQoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW52b2tlQWN0aW9uKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyTWFuYWdlci5pbnZva2VBY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oYWN0aW9uTmFtZSwgJ2FjdGlvbk5hbWUnKTtcblxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PntcblxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShTT1VSQ0VfU1lTVEVNLCBudWxsLCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCksXG4gICAgICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShFUlJPUl9DT0RFKVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgbGV0IHBtID0gc2VsZi5kb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KHNlbGYuZG9scGhpbiwgW251bGwsIEFDVElPTl9DQUxMX0JFQU5dLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG5cbiAgICAgICAgICAgIGxldCBhY3Rpb25QYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGlmKGV4aXN0cyhwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkocGFyYW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBQYXJhbVRvRG9scGhpbihwYXJhbXNbcGFyYW1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblBhcmFtcy5wdXNoKHtuYW1lOiBwYXJhbSwgdmFsdWU6IHZhbHVlfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShDb21tYW5kRmFjdG9yeS5jcmVhdGVDYWxsQWN0aW9uQ29tbWFuZChjb250cm9sbGVySWQsIGFjdGlvbk5hbWUsIGFjdGlvblBhcmFtcykpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBpc0Vycm9yID0gcG0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKEVSUk9SX0NPREUpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlNlcnZlciBzaWRlIENvbnRyb2xsZXJBY3Rpb24gXCIgKyBhY3Rpb25OYW1lICsgXCIgY2F1c2VkIGFuIGVycm9yLiBQbGVhc2Ugc2VlIHNlcnZlciBsb2cgZm9yIGRldGFpbHMuXCIpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuZG9scGhpbi5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChwbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVzdHJveUNvbnRyb2xsZXIoY29udHJvbGxlcikge1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIuZGVzdHJveUNvbnRyb2xsZXIoY29udHJvbGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShjb250cm9sbGVyLCAnY29udHJvbGxlcicpO1xuXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5nZXRIaWdobGFuZGVyUE0oKS50aGVuKChoaWdobGFuZGVyUE0pID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRyb2xsZXJzLmRlbGV0ZShjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLnNldFZhbHVlKGNvbnRyb2xsZXIuY29udHJvbGxlcklkKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoQ29tbWFuZEZhY3RvcnkuY3JlYXRlRGVzdHJveUNvbnRyb2xsZXJDb21tYW5kKGNvbnRyb2xsZXIuZ2V0SWQoKSkpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJzQ29weSA9IHRoaXMuY29udHJvbGxlcnM7XG4gICAgICAgIGxldCBwcm9taXNlcyA9IFtdO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzID0gbmV3IFNldCgpO1xuICAgICAgICBjb250cm9sbGVyc0NvcHkuZm9yRWFjaCgoY29udHJvbGxlcikgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKGNvbnRyb2xsZXIuZGVzdHJveSgpKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxufVxuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFNldCBmcm9tICcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9zZXQnO1xuaW1wb3J0IHtjaGVja01ldGhvZH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge2NoZWNrUGFyYW19IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyUHJveHl7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVySWQsIG1vZGVsLCBtYW5hZ2VyKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBtYW5hZ2VyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGNvbnRyb2xsZXJJZCwgJ2NvbnRyb2xsZXJJZCcpO1xuICAgICAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcbiAgICAgICAgY2hlY2tQYXJhbShtYW5hZ2VyLCAnbWFuYWdlcicpO1xuXG4gICAgICAgIHRoaXMuY29udHJvbGxlcklkID0gY29udHJvbGxlcklkO1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBnZXRNb2RlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWw7XG4gICAgfVxuXG4gICAgZ2V0SWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJJZDtcbiAgICB9XG5cbiAgICBpbnZva2UobmFtZSwgcGFyYW1zKXtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJQcm94eS5pbnZva2UobmFtZSwgcGFyYW1zKScpO1xuICAgICAgICBjaGVja1BhcmFtKG5hbWUsICduYW1lJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb250cm9sbGVyIHdhcyBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm1hbmFnZXIuaW52b2tlQWN0aW9uKHRoaXMuY29udHJvbGxlcklkLCBuYW1lLCBwYXJhbXMpO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xsZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLl9jcmVhdGVDb250cm9sbGVyKG5hbWUsIHRoaXMuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpe1xuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRyb2xsZXIgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkRlc3Ryb3llZC1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmRlc3Ryb3lDb250cm9sbGVyKHRoaXMpO1xuICAgIH1cblxuICAgIG9uRGVzdHJveWVkKGhhbmRsZXIpe1xuICAgICAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lm9uRGVzdHJveWVkKGhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5hZGQoaGFuZGxlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYub25EZXN0cm95ZWRIYW5kbGVycy5kZWxldGUoaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIERvbHBoaW5SZW1vdGluZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ1JlbW90aW5nIEVycm9yJywgZGV0YWlsKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5kZXRhaWwgPSBkZXRhaWwgfHwgdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2xwaGluU2Vzc2lvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ1Nlc3Npb24gRXJyb3InKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEh0dHBSZXNwb25zZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlID0gJ0h0dHAgUmVzcG9uc2UgRXJyb3InKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEh0dHBOZXR3b3JrRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSA9ICdIdHRwIE5ldHdvcmsgRXJyb3InKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIH1cbn0iLCIvKiBDb3B5cmlnaHQgMjAxNiBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZW1pdHRlci1jb21wb25lbnQnO1xuXG5cbmltcG9ydCB7IGV4aXN0cyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRG9scGhpblJlbW90aW5nRXJyb3IsIEh0dHBOZXR3b3JrRXJyb3IsIERvbHBoaW5TZXNzaW9uRXJyb3IsIEh0dHBSZXNwb25zZUVycm9yIH0gZnJvbSAnLi9lcnJvcnMuanMnO1xuaW1wb3J0IENvZGVjIGZyb20gJy4vY29tbWFuZHMvY29kZWMuanMnO1xuaW1wb3J0IFJlbW90aW5nRXJyb3JIYW5kbGVyIGZyb20gJy4vcmVtb3RpbmdFcnJvckhhbmRsZXInO1xuXG5cbmNvbnN0IEZJTklTSEVEID0gNDtcbmNvbnN0IFNVQ0NFU1MgPSAyMDA7XG5jb25zdCBSRVFVRVNUX1RJTUVPVVQgPSA0MDg7XG5cbmNvbnN0IERPTFBISU5fUExBVEZPUk1fUFJFRklYID0gJ2RvbHBoaW5fcGxhdGZvcm1faW50ZXJuXyc7XG5jb25zdCBDTElFTlRfSURfSFRUUF9IRUFERVJfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2RvbHBoaW5DbGllbnRJZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHVybCwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5oZWFkZXJzSW5mbyA9IGV4aXN0cyhjb25maWcpID8gY29uZmlnLmhlYWRlcnNJbmZvIDogbnVsbDtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb25Db25maWcgPSBleGlzdHMoY29uZmlnKSA/IGNvbmZpZy5jb25uZWN0aW9uIDogbnVsbDtcbiAgICAgICAgdGhpcy5tYXhSZXRyeSA9IGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnKSAmJiBleGlzdHMoY29ubmVjdGlvbkNvbmZpZy5tYXhSZXRyeSk/Y29ubmVjdGlvbkNvbmZpZy5tYXhSZXRyeTogMztcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLnRpbWVvdXQpP2Nvbm5lY3Rpb25Db25maWcudGltZW91dDogNTAwMDtcbiAgICAgICAgdGhpcy5mYWlsZWRfYXR0ZW1wdCA9IDA7XG4gICAgfVxuXG4gICAgX2hhbmRsZUVycm9yKHJlamVjdCwgZXJyb3IpIHtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb25Db25maWcgPSBleGlzdHModGhpcy5jb25maWcpID8gdGhpcy5jb25maWcuY29ubmVjdGlvbiA6IG51bGw7XG4gICAgICAgIGxldCBlcnJvckhhbmRsZXJzID0gZXhpc3RzKGNvbm5lY3Rpb25Db25maWcpICYmIGV4aXN0cyhjb25uZWN0aW9uQ29uZmlnLmVycm9ySGFuZGxlcnMpP2Nvbm5lY3Rpb25Db25maWcuZXJyb3JIYW5kbGVyczogW25ldyBSZW1vdGluZ0Vycm9ySGFuZGxlcigpXTtcbiAgICAgICAgZXJyb3JIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIub25FcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgIH1cblxuICAgIF9zZW5kKGNvbW1hbmRzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICBodHRwLm9uZXJyb3IgPSAoZXJyb3JDb250ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgSHR0cE5ldHdvcmtFcnJvcignUGxhdGZvcm1IdHRwVHJhbnNtaXR0ZXI6IE5ldHdvcmsgZXJyb3InLCBlcnJvckNvbnRlbnQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGh0dHAucmVhZHlTdGF0ZSA9PT0gRklOSVNIRUQpe1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGh0dHAuc3RhdHVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgU1VDQ0VTUzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWxlZF9hdHRlbXB0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q2xpZW50SWQgPSBodHRwLmdldFJlc3BvbnNlSGVhZGVyKENMSUVOVF9JRF9IVFRQX0hFQURFUl9OQU1FKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGN1cnJlbnRDbGllbnRJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmNsaWVudElkKSAmJiB0aGlzLmNsaWVudElkICE9PSBjdXJyZW50Q2xpZW50SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBDbGllbnRJZCBvZiB0aGUgcmVzcG9uc2UgZGlkIG5vdCBtYXRjaCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudElkID0gY3VycmVudENsaWVudElkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKHJlamVjdCwgbmV3IERvbHBoaW5TZXNzaW9uRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBTZXJ2ZXIgZGlkIG5vdCBzZW5kIGEgY2xpZW50SWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaHR0cC5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFJFUVVFU1RfVElNRU9VVDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihyZWplY3QsIG5ldyBEb2xwaGluU2Vzc2lvbkVycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogU2Vzc2lvbiBUaW1lb3V0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZmFpbGVkX2F0dGVtcHQgPD0gdGhpcy5tYXhSZXRyeSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbGVkX2F0dGVtcHQgPSB0aGlzLmZhaWxlZF9hdHRlbXB0ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IocmVqZWN0LCBuZXcgSHR0cFJlc3BvbnNlRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBIVFRQIFN0YXR1cyAhPSAyMDAgKCcgKyBodHRwLnN0YXR1cyArICcpJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0aGlzLmNsaWVudElkKSkge1xuICAgICAgICAgICAgICAgIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihDTElFTlRfSURfSFRUUF9IRUFERVJfTkFNRSwgdGhpcy5jbGllbnRJZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleGlzdHModGhpcy5oZWFkZXJzSW5mbykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuaGVhZGVyc0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyc0luZm8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihpLCB0aGlzLmhlYWRlcnNJbmZvW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZhaWxlZF9hdHRlbXB0ID4gdGhpcy5tYXhSZXRyeSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHAuc2VuZChDb2RlYy5lbmNvZGUoY29tbWFuZHMpKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaHR0cC5zZW5kKENvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRyYW5zbWl0KGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgdGhpcy5fc2VuZChjb21tYW5kcylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlVGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVGV4dC50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VDb21tYW5kcyA9IENvZGVjLmRlY29kZShyZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKHJlc3BvbnNlQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRG9scGhpblJlbW90aW5nRXJyb3IoJ1BsYXRmb3JtSHR0cFRyYW5zbWl0dGVyOiBQYXJzZSBlcnJvcjogKEluY29ycmVjdCByZXNwb25zZSA9ICcgKyByZXNwb25zZVRleHQgKyAnKScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IERvbHBoaW5SZW1vdGluZ0Vycm9yKCdQbGF0Zm9ybUh0dHBUcmFuc21pdHRlcjogRW1wdHkgcmVzcG9uc2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2lnbmFsKGNvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5fc2VuZChbY29tbWFuZF0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKSk7XG4gICAgfVxufVxuXG5FbWl0dGVyKFBsYXRmb3JtSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZSk7XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90aW5nRXJyb3JIYW5kbGVyIHtcblxuICAgIG9uRXJyb3IoZXJyb3IpIHtcbiAgICAgICAgd2luZG93LmNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cblxufSIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY2hlY2tNZXRob2ROYW1lO1xuXG52YXIgZXhpc3RzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcblxubW9kdWxlLmV4cG9ydHMuY2hlY2tNZXRob2QgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgX2NoZWNrTWV0aG9kTmFtZSA9IG5hbWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5jaGVja1BhcmFtID0gZnVuY3Rpb24ocGFyYW0sIHBhcmFtZXRlck5hbWUpIHtcbiAgICBpZiAoIWV4aXN0cyhwYXJhbSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcGFyYW1ldGVyICcgKyBwYXJhbWV0ZXJOYW1lICsgJyBpcyBtYW5kYXRvcnkgaW4gJyArIF9jaGVja01ldGhvZE5hbWUpO1xuICAgIH1cbn07XG4iXX0=
