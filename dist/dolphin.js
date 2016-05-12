(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/_core').Map;
},{"../modules/_core":15,"../modules/es6.map":57,"../modules/es6.object.to-string":58,"../modules/es6.string.iterator":61,"../modules/es7.map.to-json":62,"../modules/web.dom.iterable":64}],2:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
module.exports = _dereq_('../modules/_core').Promise;
},{"../modules/_core":15,"../modules/es6.object.to-string":58,"../modules/es6.promise":59,"../modules/es6.string.iterator":61,"../modules/web.dom.iterable":64}],3:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
module.exports = _dereq_('../modules/_core').Set;
},{"../modules/_core":15,"../modules/es6.object.to-string":58,"../modules/es6.set":60,"../modules/es6.string.iterator":61,"../modules/es7.set.to-json":63,"../modules/web.dom.iterable":64}],4:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],5:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(_dereq_,module,exports){
module.exports = function(){ /* empty */ };
},{}],7:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],8:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":30}],9:[function(_dereq_,module,exports){
var forOf = _dereq_('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":22}],10:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof')
  , TAG = _dereq_('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":11,"./_wks":54}],11:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],12:[function(_dereq_,module,exports){
'use strict';
var $           = _dereq_('./_')
  , hide        = _dereq_('./_hide')
  , redefineAll = _dereq_('./_redefine-all')
  , ctx         = _dereq_('./_ctx')
  , anInstance  = _dereq_('./_an-instance')
  , defined     = _dereq_('./_defined')
  , forOf       = _dereq_('./_for-of')
  , $iterDefine = _dereq_('./_iter-define')
  , step        = _dereq_('./_iter-step')
  , setSpecies  = _dereq_('./_set-species')
  , DESCRIPTORS = _dereq_('./_descriptors')
  , fastKey     = _dereq_('./_meta').fastKey
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
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
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
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
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
},{"./_":4,"./_an-instance":7,"./_ctx":16,"./_defined":17,"./_descriptors":18,"./_for-of":22,"./_hide":25,"./_iter-define":33,"./_iter-step":35,"./_meta":38,"./_redefine-all":41,"./_set-species":44}],13:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof')
  , from    = _dereq_('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":9,"./_classof":10}],14:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./_')
  , global         = _dereq_('./_global')
  , $export        = _dereq_('./_export')
  , meta           = _dereq_('./_meta')
  , fails          = _dereq_('./_fails')
  , hide           = _dereq_('./_hide')
  , redefineAll    = _dereq_('./_redefine-all')
  , forOf          = _dereq_('./_for-of')
  , anInstance     = _dereq_('./_an-instance')
  , isObject       = _dereq_('./_is-object')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , DESCRIPTORS    = _dereq_('./_descriptors');

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
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
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
},{"./_":4,"./_an-instance":7,"./_descriptors":18,"./_export":20,"./_fails":21,"./_for-of":22,"./_global":23,"./_hide":25,"./_is-object":30,"./_meta":38,"./_redefine-all":41,"./_set-to-string-tag":45}],15:[function(_dereq_,module,exports){
var core = module.exports = {version: '2.0.3'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],16:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./_a-function');
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
},{"./_a-function":5}],17:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],18:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":21}],19:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object')
  , document = _dereq_('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":23,"./_is-object":30}],20:[function(_dereq_,module,exports){
var global    = _dereq_('./_global')
  , core      = _dereq_('./_core')
  , ctx       = _dereq_('./_ctx')
  , hide      = _dereq_('./_hide')
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
},{"./_core":15,"./_ctx":16,"./_global":23,"./_hide":25}],21:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],22:[function(_dereq_,module,exports){
var ctx         = _dereq_('./_ctx')
  , call        = _dereq_('./_iter-call')
  , isArrayIter = _dereq_('./_is-array-iter')
  , anObject    = _dereq_('./_an-object')
  , toLength    = _dereq_('./_to-length')
  , getIterFn   = _dereq_('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./_an-object":8,"./_ctx":16,"./_is-array-iter":29,"./_iter-call":31,"./_to-length":52,"./core.get-iterator-method":55}],23:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],24:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],25:[function(_dereq_,module,exports){
var $          = _dereq_('./_')
  , createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_":4,"./_descriptors":18,"./_property-desc":40}],26:[function(_dereq_,module,exports){
module.exports = _dereq_('./_global').document && document.documentElement;
},{"./_global":23}],27:[function(_dereq_,module,exports){
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
},{}],28:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":11}],29:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators  = _dereq_('./_iterators')
  , ITERATOR   = _dereq_('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":36,"./_wks":54}],30:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],31:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_('./_an-object');
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
},{"./_an-object":8}],32:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./_')
  , descriptor     = _dereq_('./_property-desc')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_":4,"./_hide":25,"./_property-desc":40,"./_set-to-string-tag":45,"./_wks":54}],33:[function(_dereq_,module,exports){
'use strict';
var LIBRARY        = _dereq_('./_library')
  , $export        = _dereq_('./_export')
  , redefine       = _dereq_('./_redefine')
  , hide           = _dereq_('./_hide')
  , has            = _dereq_('./_has')
  , Iterators      = _dereq_('./_iterators')
  , $iterCreate    = _dereq_('./_iter-create')
  , setToStringTag = _dereq_('./_set-to-string-tag')
  , getProto       = _dereq_('./_').getProto
  , ITERATOR       = _dereq_('./_wks')('iterator')
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
    IteratorPrototype = getProto($anyNative.call(new Base));
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
},{"./_":4,"./_export":20,"./_has":24,"./_hide":25,"./_iter-create":32,"./_iterators":36,"./_library":37,"./_redefine":42,"./_set-to-string-tag":45,"./_wks":54}],34:[function(_dereq_,module,exports){
var ITERATOR     = _dereq_('./_wks')('iterator')
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
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":54}],35:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],36:[function(_dereq_,module,exports){
module.exports = {};
},{}],37:[function(_dereq_,module,exports){
module.exports = true;
},{}],38:[function(_dereq_,module,exports){
var META     = _dereq_('./_uid')('meta')
  , isObject = _dereq_('./_is-object')
  , has      = _dereq_('./_has')
  , setDesc  = _dereq_('./_').setDesc
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !_dereq_('./_fails')(function(){
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
},{"./_":4,"./_fails":21,"./_has":24,"./_is-object":30,"./_uid":53}],39:[function(_dereq_,module,exports){
var global    = _dereq_('./_global')
  , macrotask = _dereq_('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = _dereq_('./_cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
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
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
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

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./_cof":11,"./_global":23,"./_task":49}],40:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],41:[function(_dereq_,module,exports){
var hide = _dereq_('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":25}],42:[function(_dereq_,module,exports){
module.exports = _dereq_('./_hide');
},{"./_hide":25}],43:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = _dereq_('./_').getDesc
  , isObject = _dereq_('./_is-object')
  , anObject = _dereq_('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _dereq_('./_ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_":4,"./_an-object":8,"./_ctx":16,"./_is-object":30}],44:[function(_dereq_,module,exports){
'use strict';
var core        = _dereq_('./_core')
  , $           = _dereq_('./_')
  , DESCRIPTORS = _dereq_('./_descriptors')
  , SPECIES     = _dereq_('./_wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_":4,"./_core":15,"./_descriptors":18,"./_wks":54}],45:[function(_dereq_,module,exports){
var def = _dereq_('./_').setDesc
  , has = _dereq_('./_has')
  , TAG = _dereq_('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_":4,"./_has":24,"./_wks":54}],46:[function(_dereq_,module,exports){
var global = _dereq_('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":23}],47:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = _dereq_('./_an-object')
  , aFunction = _dereq_('./_a-function')
  , SPECIES   = _dereq_('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":5,"./_an-object":8,"./_wks":54}],48:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer')
  , defined   = _dereq_('./_defined');
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
},{"./_defined":17,"./_to-integer":50}],49:[function(_dereq_,module,exports){
var ctx                = _dereq_('./_ctx')
  , invoke             = _dereq_('./_invoke')
  , html               = _dereq_('./_html')
  , cel                = _dereq_('./_dom-create')
  , global             = _dereq_('./_global')
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
var listner = function(event){
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
  if(_dereq_('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
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
},{"./_cof":11,"./_ctx":16,"./_dom-create":19,"./_global":23,"./_html":26,"./_invoke":27}],50:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],51:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject')
  , defined = _dereq_('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":17,"./_iobject":28}],52:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":50}],53:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],54:[function(_dereq_,module,exports){
var store      = _dereq_('./_shared')('wks')
  , uid        = _dereq_('./_uid')
  , Symbol     = _dereq_('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';
module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};
},{"./_global":23,"./_shared":46,"./_uid":53}],55:[function(_dereq_,module,exports){
var classof   = _dereq_('./_classof')
  , ITERATOR  = _dereq_('./_wks')('iterator')
  , Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":10,"./_core":15,"./_iterators":36,"./_wks":54}],56:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./_add-to-unscopables')
  , step             = _dereq_('./_iter-step')
  , Iterators        = _dereq_('./_iterators')
  , toIObject        = _dereq_('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./_iter-define')(Array, 'Array', function(iterated, kind){
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
},{"./_add-to-unscopables":6,"./_iter-define":33,"./_iter-step":35,"./_iterators":36,"./_to-iobject":51}],57:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');

// 23.1 Map Objects
module.exports = _dereq_('./_collection')('Map', function(get){
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
},{"./_collection":14,"./_collection-strong":12}],58:[function(_dereq_,module,exports){

},{}],59:[function(_dereq_,module,exports){
'use strict';
var $                  = _dereq_('./_')
  , LIBRARY            = _dereq_('./_library')
  , global             = _dereq_('./_global')
  , ctx                = _dereq_('./_ctx')
  , classof            = _dereq_('./_classof')
  , $export            = _dereq_('./_export')
  , isObject           = _dereq_('./_is-object')
  , anObject           = _dereq_('./_an-object')
  , aFunction          = _dereq_('./_a-function')
  , anInstance         = _dereq_('./_an-instance')
  , forOf              = _dereq_('./_for-of')
  , from               = _dereq_('./_array-from-iterable')
  , setProto           = _dereq_('./_set-proto').set
  , speciesConstructor = _dereq_('./_species-constructor')
  , task               = _dereq_('./_task').set
  , microtask          = _dereq_('./_microtask')
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var testResolve = function(sub){
  var test = new $Promise(empty), promise;
  if(sub)test.constructor = function(exec){
    exec(empty, empty);
  };
  (promise = $Promise.resolve(test))['catch'](empty);
  return promise === test;
};

var USE_NATIVE = function(){
  var works = false;
  var SubPromise = function(x){
    var self = new $Promise(x);
    setProto(self, SubPromise.prototype);
    return self;
  };
  try {
    works = $Promise && $Promise.resolve && testResolve();
    setProto(SubPromise, $Promise);
    SubPromise.prototype = $.create($Promise.prototype, {constructor: {value: SubPromise}});
    // actual Firefox has broken subclass support, test that
    if(!(SubPromise.resolve(5).then(empty) instanceof SubPromise)){
      works = false;
    }
    // V8 4.8- bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && _dereq_('./_descriptors')){
      var thenableThenGotten = false;
      $Promise.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return !!works;
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
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          result = handler === true ? value : handler(value);
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
    if(isUnhandled(promise)){
      var value = promise._v
        , handler, console;
      if(isNode){
        process.emit('unhandledRejection', value, promise);
      } else if(handler = global.onunhandledrejection){
        handler({promise: promise, reason: value});
      } else if((console = global.console) && console.error){
        console.error('Unhandled promise rejection', value);
      } promise._h = 2;
    } promise._a = undefined;
  });
};
var isUnhandled = function(promise){
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  if(promise._h == 1)return false;
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
  Internal.prototype = _dereq_('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
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
_dereq_('./_set-to-string-tag')($Promise, PROMISE);
_dereq_('./_set-species')(PROMISE);
Wrapper = _dereq_('./_core')[PROMISE];

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
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE || testResolve(true)), PROMISE, {
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
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = from(iterable)
        , remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
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
},{"./_":4,"./_a-function":5,"./_an-instance":7,"./_an-object":8,"./_array-from-iterable":9,"./_classof":10,"./_core":15,"./_ctx":16,"./_descriptors":18,"./_export":20,"./_for-of":22,"./_global":23,"./_is-object":30,"./_iter-detect":34,"./_library":37,"./_microtask":39,"./_redefine-all":41,"./_set-proto":43,"./_set-species":44,"./_set-to-string-tag":45,"./_species-constructor":47,"./_task":49}],60:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');

// 23.2 Set Objects
module.exports = _dereq_('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":14,"./_collection-strong":12}],61:[function(_dereq_,module,exports){
'use strict';
var $at  = _dereq_('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./_iter-define')(String, 'String', function(iterated){
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
},{"./_iter-define":33,"./_string-at":48}],62:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = _dereq_('./_export');

$export($export.P + $export.R, 'Map', {toJSON: _dereq_('./_collection-to-json')('Map')});
},{"./_collection-to-json":13,"./_export":20}],63:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = _dereq_('./_export');

$export($export.P + $export.R, 'Set', {toJSON: _dereq_('./_collection-to-json')('Set')});
},{"./_collection-to-json":13,"./_export":20}],64:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var global        = _dereq_('./_global')
  , hide          = _dereq_('./_hide')
  , Iterators     = _dereq_('./_iterators')
  , TO_STRING_TAG = _dereq_('./_wks')('toStringTag')
  , ArrayValues   = Iterators.Array;

_dereq_('./_').each.call(['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], function(NAME){
  var Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = ArrayValues;
});
},{"./_":4,"./_global":23,"./_hide":25,"./_iterators":36,"./_wks":54,"./es6.array.iterator":56}],65:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var opendolphin;
(function (opendolphin) {
    var Attribute = (function () {
        function Attribute() {
        }
        Attribute.QUALIFIER_PROPERTY = "qualifier";
        Attribute.DIRTY_PROPERTY = "dirty";
        Attribute.BASE_VALUE = "baseValue";
        Attribute.VALUE = "value";
        Attribute.TAG = "tag";
        return Attribute;
    }());
    opendolphin.Attribute = Attribute;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Command = (function () {
        function Command() {
            this.id = "dolphin-core-command";
        }
        return Command;
    }());
    opendolphin.Command = Command;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Tag = (function () {
        function Tag() {
        }
        //Implemented as function so that it will never be changed from outside
        /** The actual value of the attribute. This is the default if no tag is given.*/
        Tag.value = function () {
            return "VALUE";
        };
        /** the to-be-displayed String, not the key. I18N happens on the server. */
        Tag.label = function () {
            return "LABEL";
        };
        /** If the attribute represent tooltip**/
        Tag.tooltip = function () {
            return "TOOLTIP";
        };
        /** "true" or "false", maps to Grails constraint nullable:false */
        Tag.mandatory = function () {
            return "MANDATORY";
        };
        /** "true" or "false", maps to Grails constraint display:true */
        Tag.visible = function () {
            return "VISIBLE";
        };
        /** "true" or "false" */
        Tag.enabled = function () {
            return "ENABLED";
        };
        /** regular expression for local, syntactical constraints like in "rejectField" */
        Tag.regex = function () {
            return "REGEX";
        };
        /** a single text; e.g. "textArea" if the String value should be displayed in a text area instead of a textField */
        Tag.widgetHint = function () {
            return "WIDGET_HINT";
        };
        /** a single text; e.g. "java.util.Date" if the value String represents a date */
        Tag.valueType = function () {
            return "VALUE_TYPE";
        };
        return Tag;
    }());
    opendolphin.Tag = Tag;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var AttributeCreatedNotification = (function (_super) {
        __extends(AttributeCreatedNotification, _super);
        function AttributeCreatedNotification(pmId, attributeId, propertyName, newValue, qualifier, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            _super.call(this);
            this.pmId = pmId;
            this.attributeId = attributeId;
            this.propertyName = propertyName;
            this.newValue = newValue;
            this.qualifier = qualifier;
            this.tag = tag;
            this.id = 'AttributeCreated';
            this.className = "org.opendolphin.core.comm.AttributeCreatedNotification";
        }
        return AttributeCreatedNotification;
    }(opendolphin.Command));
    opendolphin.AttributeCreatedNotification = AttributeCreatedNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var AttributeMetadataChangedCommand = (function (_super) {
        __extends(AttributeMetadataChangedCommand, _super);
        function AttributeMetadataChangedCommand(attributeId, metadataName, value) {
            _super.call(this);
            this.attributeId = attributeId;
            this.metadataName = metadataName;
            this.value = value;
            this.id = 'AttributeMetadataChanged';
            this.className = "org.opendolphin.core.comm.AttributeMetadataChangedCommand";
        }
        return AttributeMetadataChangedCommand;
    }(opendolphin.Command));
    opendolphin.AttributeMetadataChangedCommand = AttributeMetadataChangedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var CallNamedActionCommand = (function (_super) {
        __extends(CallNamedActionCommand, _super);
        function CallNamedActionCommand(actionName) {
            _super.call(this);
            this.actionName = actionName;
            this.id = 'CallNamedAction';
            this.className = "org.opendolphin.core.comm.CallNamedActionCommand";
        }
        return CallNamedActionCommand;
    }(opendolphin.Command));
    opendolphin.CallNamedActionCommand = CallNamedActionCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var ChangeAttributeMetadataCommand = (function (_super) {
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
    }(opendolphin.Command));
    opendolphin.ChangeAttributeMetadataCommand = ChangeAttributeMetadataCommand;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var EventBus = (function () {
        function EventBus() {
            this.eventHandlers = [];
        }
        EventBus.prototype.onEvent = function (eventHandler) {
            this.eventHandlers.push(eventHandler);
        };
        EventBus.prototype.trigger = function (event) {
            this.eventHandlers.forEach(function (handle) { return handle(event); });
        };
        return EventBus;
    }());
    opendolphin.EventBus = EventBus;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientAttribute.ts" />
/// <reference path="EventBus.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var presentationModelInstanceCount = 0; // todo dk: consider making this static in class
    var ClientPresentationModel = (function () {
        function ClientPresentationModel(id, presentationModelType) {
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
            this.invalidBus = new opendolphin.EventBus();
            this.dirtyValueChangeBus = new opendolphin.EventBus();
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
            if (!attributes || attributes.length < 1)
                return;
            attributes.forEach(function (attr) {
                _this.addAttribute(attr);
            });
        };
        ClientPresentationModel.prototype.addAttribute = function (attribute) {
            var _this = this;
            if (!attribute || (this.attributes.indexOf(attribute) > -1)) {
                return;
            }
            if (this.findAttributeByPropertyNameAndTag(attribute.propertyName, attribute.tag)) {
                throw new Error("There already is an attribute with property name: " + attribute.propertyName
                    + " and tag: " + attribute.tag + " in presentation model with id: " + this.id);
            }
            if (attribute.getQualifier() && this.findAttributeByQualifier(attribute.getQualifier())) {
                throw new Error("There already is an attribute with qualifier: " + attribute.getQualifier()
                    + " in presentation model with id: " + this.id);
            }
            attribute.setPresentationModel(this);
            this.attributes.push(attribute);
            if (attribute.tag == opendolphin.Tag.value()) {
                this.updateDirty();
            }
            attribute.onValueChange(function (evt) {
                _this.invalidBus.trigger({ source: _this });
            });
        };
        ClientPresentationModel.prototype.updateDirty = function () {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].isDirty()) {
                    this.setDirty(true);
                    return;
                }
            }
            ;
            this.setDirty(false);
        };
        ClientPresentationModel.prototype.updateAttributeDirtyness = function () {
            for (var i = 0; i < this.attributes.length; i++) {
                this.attributes[i].updateDirty();
            }
        };
        ClientPresentationModel.prototype.isDirty = function () {
            return this.dirty;
        };
        ClientPresentationModel.prototype.setDirty = function (dirty) {
            var oldVal = this.dirty;
            this.dirty = dirty;
            this.dirtyValueChangeBus.trigger({ 'oldValue': oldVal, 'newValue': this.dirty });
        };
        ClientPresentationModel.prototype.reset = function () {
            this.attributes.forEach(function (attribute) {
                attribute.reset();
            });
        };
        ClientPresentationModel.prototype.rebase = function () {
            this.attributes.forEach(function (attribute) {
                attribute.rebase();
            });
        };
        ClientPresentationModel.prototype.onDirty = function (eventHandler) {
            this.dirtyValueChangeBus.onEvent(eventHandler);
        };
        ClientPresentationModel.prototype.onInvalidated = function (handleInvalidate) {
            this.invalidBus.onEvent(handleInvalidate);
        };
        /** returns a copy of the internal state */
        ClientPresentationModel.prototype.getAttributes = function () {
            return this.attributes.slice(0);
        };
        ClientPresentationModel.prototype.getAt = function (propertyName, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            return this.findAttributeByPropertyNameAndTag(propertyName, tag);
        };
        ClientPresentationModel.prototype.findAttributeByPropertyName = function (propertyName) {
            return this.findAttributeByPropertyNameAndTag(propertyName, opendolphin.Tag.value());
        };
        ClientPresentationModel.prototype.findAllAttributesByPropertyName = function (propertyName) {
            var result = [];
            if (!propertyName)
                return null;
            this.attributes.forEach(function (attribute) {
                if (attribute.propertyName == propertyName) {
                    result.push(attribute);
                }
            });
            return result;
        };
        ClientPresentationModel.prototype.findAttributeByPropertyNameAndTag = function (propertyName, tag) {
            if (!propertyName || !tag)
                return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if ((this.attributes[i].propertyName == propertyName) && (this.attributes[i].tag == tag)) {
                    return this.attributes[i];
                }
            }
            return null;
        };
        ClientPresentationModel.prototype.findAttributeByQualifier = function (qualifier) {
            if (!qualifier)
                return null;
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].getQualifier() == qualifier) {
                    return this.attributes[i];
                }
            }
            ;
            return null;
        };
        ClientPresentationModel.prototype.findAttributeById = function (id) {
            if (!id)
                return null;
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
                var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName, targetAttribute.tag);
                if (sourceAttribute) {
                    targetAttribute.syncWith(sourceAttribute);
                }
            });
        };
        return ClientPresentationModel;
    }());
    opendolphin.ClientPresentationModel = ClientPresentationModel;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="EventBus.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var ClientAttribute = (function () {
        function ClientAttribute(propertyName, qualifier, value, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            this.propertyName = propertyName;
            this.tag = tag;
            this.dirty = false;
            this.id = "" + (ClientAttribute.clientAttributeInstanceCount++) + "C";
            this.valueChangeBus = new opendolphin.EventBus();
            this.qualifierChangeBus = new opendolphin.EventBus();
            this.dirtyValueChangeBus = new opendolphin.EventBus();
            this.baseValueChangeBus = new opendolphin.EventBus();
            this.setValue(value);
            this.setBaseValue(value);
            this.setQualifier(qualifier);
        }
        /** a copy constructor with new id and no presentation model */
        ClientAttribute.prototype.copy = function () {
            var result = new ClientAttribute(this.propertyName, this.getQualifier(), this.getValue(), this.tag);
            result.setBaseValue(this.getBaseValue());
            return result;
        };
        ClientAttribute.prototype.isDirty = function () {
            return this.dirty;
        };
        ClientAttribute.prototype.getBaseValue = function () {
            return this.baseValue;
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
            if (this.value == verifiedValue)
                return;
            var oldValue = this.value;
            this.value = verifiedValue;
            this.setDirty(this.calculateDirty(this.baseValue, verifiedValue));
            this.valueChangeBus.trigger({ 'oldValue': oldValue, 'newValue': verifiedValue });
        };
        ClientAttribute.prototype.calculateDirty = function (baseValue, value) {
            if (baseValue == null) {
                return value != null;
            }
            else {
                return baseValue != value;
            }
        };
        ClientAttribute.prototype.updateDirty = function () {
            this.setDirty(this.calculateDirty(this.baseValue, this.value));
        };
        ClientAttribute.prototype.setDirty = function (dirty) {
            var oldVal = this.dirty;
            this.dirty = dirty;
            this.dirtyValueChangeBus.trigger({ 'oldValue': oldVal, 'newValue': this.dirty });
            if (this.presentationModel)
                this.presentationModel.updateDirty();
        };
        ClientAttribute.prototype.setQualifier = function (newQualifier) {
            if (this.qualifier == newQualifier)
                return;
            var oldQualifier = this.qualifier;
            this.qualifier = newQualifier;
            this.qualifierChangeBus.trigger({ 'oldValue': oldQualifier, 'newValue': newQualifier });
        };
        ClientAttribute.prototype.getQualifier = function () {
            return this.qualifier;
        };
        ClientAttribute.prototype.setBaseValue = function (baseValue) {
            if (this.baseValue == baseValue)
                return;
            var oldBaseValue = this.baseValue;
            this.baseValue = baseValue;
            this.setDirty(this.calculateDirty(baseValue, this.value));
            this.baseValueChangeBus.trigger({ 'oldValue': oldBaseValue, 'newValue': baseValue });
        };
        ClientAttribute.prototype.rebase = function () {
            this.setBaseValue(this.value);
            this.setDirty(false); // this is not superfluous!
        };
        ClientAttribute.prototype.reset = function () {
            this.setValue(this.baseValue);
            this.setDirty(false); // this is not superfluous!
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
            if (this.SUPPORTED_VALUE_TYPES.indexOf(typeof result) > -1 || result instanceof Date) {
                ok = true;
            }
            if (!ok) {
                throw new Error("Attribute values of this type are not allowed: " + typeof value);
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
        ClientAttribute.prototype.onDirty = function (eventHandler) {
            this.dirtyValueChangeBus.onEvent(eventHandler);
        };
        ClientAttribute.prototype.onBaseValueChange = function (eventHandler) {
            this.baseValueChangeBus.onEvent(eventHandler);
        };
        ClientAttribute.prototype.syncWith = function (sourceAttribute) {
            if (sourceAttribute) {
                this.setQualifier(sourceAttribute.getQualifier()); // sequence is important
                this.setBaseValue(sourceAttribute.getBaseValue());
                this.setValue(sourceAttribute.value);
            }
        };
        ClientAttribute.SUPPORTED_VALUE_TYPES = ["string", "number", "boolean"];
        ClientAttribute.clientAttributeInstanceCount = 0;
        return ClientAttribute;
    }());
    opendolphin.ClientAttribute = ClientAttribute;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var ValueChangedCommand = (function (_super) {
        __extends(ValueChangedCommand, _super);
        function ValueChangedCommand(attributeId, oldValue, newValue) {
            _super.call(this);
            this.attributeId = attributeId;
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.id = "ValueChanged";
            this.className = "org.opendolphin.core.comm.ValueChangedCommand";
        }
        return ValueChangedCommand;
    }(opendolphin.Command));
    opendolphin.ValueChangedCommand = ValueChangedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var NamedCommand = (function (_super) {
        __extends(NamedCommand, _super);
        function NamedCommand(name) {
            _super.call(this);
            this.id = name;
            this.className = "org.opendolphin.core.comm.NamedCommand";
        }
        return NamedCommand;
    }(opendolphin.Command));
    opendolphin.NamedCommand = NamedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var EmptyNotification = (function (_super) {
        __extends(EmptyNotification, _super);
        function EmptyNotification() {
            _super.call(this);
            this.id = "Empty";
            this.className = "org.opendolphin.core.comm.EmptyNotification";
        }
        return EmptyNotification;
    }(opendolphin.Command));
    opendolphin.EmptyNotification = EmptyNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="ValueChangedCommand.ts"/>
/// <reference path="NamedCommand.ts"/>
/// <reference path="EmptyNotification.ts"/>
var opendolphin;
(function (opendolphin) {
    /** A Batcher that does no batching but merely takes the first element of the queue as the single item in the batch */
    var NoCommandBatcher = (function () {
        function NoCommandBatcher() {
        }
        NoCommandBatcher.prototype.batch = function (queue) {
            return [queue.shift()];
        };
        return NoCommandBatcher;
    }());
    opendolphin.NoCommandBatcher = NoCommandBatcher;
    /** A batcher that batches the blinds (commands with no callback) and optionally also folds value changes */
    var BlindCommandBatcher = (function () {
        /** folding: whether we should try folding ValueChangedCommands */
        function BlindCommandBatcher(folding, maxBatchSize) {
            if (folding === void 0) { folding = true; }
            if (maxBatchSize === void 0) { maxBatchSize = 50; }
            this.folding = folding;
            this.maxBatchSize = maxBatchSize;
        }
        BlindCommandBatcher.prototype.batch = function (queue) {
            var result = [];
            this.processNext(this.maxBatchSize, queue, result); // do not batch more than this.maxBatchSize commands to avoid stack overflow on recursion.
            return result;
        };
        // recursive impl method to side-effect both queue and batch
        BlindCommandBatcher.prototype.processNext = function (maxBatchSize, queue, batch) {
            if (queue.length < 1 || maxBatchSize < 1)
                return;
            var candidate = queue.shift();
            if (this.folding && candidate.command instanceof opendolphin.ValueChangedCommand && (!candidate.handler)) {
                var found = null;
                var canCmd = candidate.command;
                for (var i = 0; i < batch.length && found == null; i++) {
                    if (batch[i].command instanceof opendolphin.ValueChangedCommand) {
                        var batchCmd = batch[i].command;
                        if (canCmd.attributeId == batchCmd.attributeId && batchCmd.newValue == canCmd.oldValue) {
                            found = batchCmd;
                        }
                    }
                }
                if (found) {
                    found.newValue = canCmd.newValue; // change existing value, do not batch
                }
                else {
                    batch.push(candidate); // we cannot merge, so batch the candidate
                }
            }
            else {
                batch.push(candidate);
            }
            if (!candidate.handler &&
                !(candidate.command['className'] == "org.opendolphin.core.comm.NamedCommand") &&
                !(candidate.command['className'] == "org.opendolphin.core.comm.EmptyNotification") // and no unknown client side effect
            ) {
                this.processNext(maxBatchSize - 1, queue, batch); // then we can proceed with batching
            }
        };
        return BlindCommandBatcher;
    }());
    opendolphin.BlindCommandBatcher = BlindCommandBatcher;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Codec = (function () {
        function Codec() {
        }
        Codec.prototype.encode = function (commands) {
            return JSON.stringify(commands); // todo dk: look for possible API support for character encoding
        };
        Codec.prototype.decode = function (transmitted) {
            if (typeof transmitted == 'string') {
                return JSON.parse(transmitted);
            }
            else {
                return transmitted;
            }
        };
        return Codec;
    }());
    opendolphin.Codec = Codec;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
var opendolphin;
(function (opendolphin) {
    var SignalCommand = (function (_super) {
        __extends(SignalCommand, _super);
        function SignalCommand(name) {
            _super.call(this);
            this.id = name;
            this.className = "org.opendolphin.core.comm.SignalCommand";
        }
        return SignalCommand;
    }(opendolphin.Command));
    opendolphin.SignalCommand = SignalCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var CreatePresentationModelCommand = (function (_super) {
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
                    value: attr.getValue(),
                    tag: attr.tag
                });
            });
        }
        return CreatePresentationModelCommand;
    }(opendolphin.Command));
    opendolphin.CreatePresentationModelCommand = CreatePresentationModelCommand;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Map = (function () {
        function Map() {
            this.keys = [];
            this.data = [];
        }
        Map.prototype.put = function (key, value) {
            if (!this.containsKey(key)) {
                this.keys.push(key);
            }
            this.data[this.keys.indexOf(key)] = value;
        };
        Map.prototype.get = function (key) {
            return this.data[this.keys.indexOf(key)];
        };
        Map.prototype.remove = function (key) {
            if (this.containsKey(key)) {
                var index = this.keys.indexOf(key);
                this.keys.splice(index, 1);
                this.data.splice(index, 1);
                return true;
            }
            return false;
        };
        Map.prototype.isEmpty = function () {
            return this.keys.length == 0;
        };
        Map.prototype.length = function () {
            return this.keys.length;
        };
        Map.prototype.forEach = function (handler) {
            for (var i = 0; i < this.keys.length; i++) {
                handler(this.keys[i], this.data[i]);
            }
        };
        Map.prototype.containsKey = function (key) {
            return this.keys.indexOf(key) > -1;
        };
        Map.prototype.containsValue = function (value) {
            return this.data.indexOf(value) > -1;
        };
        Map.prototype.values = function () {
            return this.data.slice(0);
        };
        Map.prototype.keySet = function () {
            return this.keys.slice(0);
        };
        return Map;
    }());
    opendolphin.Map = Map;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeletedAllPresentationModelsOfTypeNotification = (function (_super) {
        __extends(DeletedAllPresentationModelsOfTypeNotification, _super);
        function DeletedAllPresentationModelsOfTypeNotification(pmType) {
            _super.call(this);
            this.pmType = pmType;
            this.id = 'DeletedAllPresentationModelsOfType';
            this.className = "org.opendolphin.core.comm.DeletedAllPresentationModelsOfTypeNotification";
        }
        return DeletedAllPresentationModelsOfTypeNotification;
    }(opendolphin.Command));
    opendolphin.DeletedAllPresentationModelsOfTypeNotification = DeletedAllPresentationModelsOfTypeNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeletedPresentationModelNotification = (function (_super) {
        __extends(DeletedPresentationModelNotification, _super);
        function DeletedPresentationModelNotification(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'DeletedPresentationModel';
            this.className = "org.opendolphin.core.comm.DeletedPresentationModelNotification";
        }
        return DeletedPresentationModelNotification;
    }(opendolphin.Command));
    opendolphin.DeletedPresentationModelNotification = DeletedPresentationModelNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts"/>
/// <reference path="ClientDolphin.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="CreatePresentationModelCommand.ts"/>
/// <reference path="ClientAttribute.ts" />
/// <reference path="ValueChangedCommand.ts"/>
/// <reference path="ChangeAttributeMetadataCommand.ts"/>
/// <reference path="Attribute.ts"/>
/// <reference path="Map.ts"/>
/// <reference path="DeletedAllPresentationModelsOfTypeNotification.ts"/>
/// <reference path="EventBus.ts"/>
/// <reference path="ClientPresentationModel.ts"/>
/// <reference path="DeletedPresentationModelNotification.ts"/>
var opendolphin;
(function (opendolphin) {
    (function (Type) {
        Type[Type["ADDED"] = 'ADDED'] = "ADDED";
        Type[Type["REMOVED"] = 'REMOVED'] = "REMOVED";
    })(opendolphin.Type || (opendolphin.Type = {}));
    var Type = opendolphin.Type;
    var ClientModelStore = (function () {
        function ClientModelStore(clientDolphin) {
            this.clientDolphin = clientDolphin;
            this.presentationModels = new opendolphin.Map();
            this.presentationModelsPerType = new opendolphin.Map();
            this.attributesPerId = new opendolphin.Map();
            this.attributesPerQualifier = new opendolphin.Map();
            this.modelStoreChangeBus = new opendolphin.EventBus();
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
            var createPMCommand = new opendolphin.CreatePresentationModelCommand(model);
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
                var valueChangeCommand = new opendolphin.ValueChangedCommand(attribute.id, evt.oldValue, evt.newValue);
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
            // all attributes with the same qualifier should have the same base value
            attribute.onBaseValueChange(function (evt) {
                var baseValueChangeCommand = new opendolphin.ChangeAttributeMetadataCommand(attribute.id, opendolphin.Attribute.BASE_VALUE, evt.newValue);
                _this.clientDolphin.getClientConnector().send(baseValueChangeCommand, null);
                if (attribute.getQualifier()) {
                    var attrs = _this.findAttributesByFilter(function (attr) {
                        return attr !== attribute && attr.getQualifier() == attribute.getQualifier();
                    });
                    attrs.forEach(function (attr) {
                        attr.setBaseValue(attribute.getBaseValue());
                    });
                }
            });
            attribute.onQualifierChange(function (evt) {
                var changeAttrMetadataCmd = new opendolphin.ChangeAttributeMetadataCommand(attribute.id, opendolphin.Attribute.QUALIFIER_PROPERTY, evt.newValue);
                _this.clientDolphin.getClientConnector().send(changeAttrMetadataCmd, null);
            });
        };
        ClientModelStore.prototype.add = function (model) {
            if (!model) {
                return false;
            }
            if (this.presentationModels.containsKey(model.id)) {
                console.log("There already is a PM with id " + model.id);
            }
            var added = false;
            if (!this.presentationModels.containsValue(model)) {
                this.presentationModels.put(model.id, model);
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
            if (this.presentationModels.containsValue(model)) {
                this.removePresentationModelByType(model);
                this.presentationModels.remove(model.id);
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
            this.presentationModels.forEach(function (key, model) {
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
                this.presentationModelsPerType.put(type, presentationModels);
            }
            if (!(presentationModels.indexOf(model) > -1)) {
                presentationModels.push(model);
            }
        };
        ClientModelStore.prototype.removePresentationModelByType = function (model) {
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
                this.presentationModelsPerType.remove(model.presentationModelType);
            }
        };
        ClientModelStore.prototype.listPresentationModelIds = function () {
            return this.presentationModels.keySet().slice(0);
        };
        ClientModelStore.prototype.listPresentationModels = function () {
            return this.presentationModels.values();
        };
        ClientModelStore.prototype.findPresentationModelById = function (id) {
            return this.presentationModels.get(id);
        };
        ClientModelStore.prototype.findAllPresentationModelByType = function (type) {
            if (!type || !this.presentationModelsPerType.containsKey(type)) {
                return [];
            }
            return this.presentationModelsPerType.get(type).slice(0); // slice is used to clone the array
        };
        ClientModelStore.prototype.deleteAllPresentationModelOfType = function (presentationModelType) {
            var _this = this;
            var presentationModels = this.findAllPresentationModelByType(presentationModelType);
            presentationModels.forEach(function (pm) {
                _this.deletePresentationModel(pm, false);
            });
            this.clientDolphin.getClientConnector().send(new opendolphin.DeletedAllPresentationModelsOfTypeNotification(presentationModelType), undefined);
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
                this.clientDolphin.getClientConnector().send(new opendolphin.DeletedPresentationModelNotification(model.id), null);
            }
        };
        ClientModelStore.prototype.containsPresentationModel = function (id) {
            return this.presentationModels.containsKey(id);
        };
        ClientModelStore.prototype.addAttributeById = function (attribute) {
            if (!attribute || this.attributesPerId.containsKey(attribute.id)) {
                return;
            }
            this.attributesPerId.put(attribute.id, attribute);
        };
        ClientModelStore.prototype.removeAttributeById = function (attribute) {
            if (!attribute || !this.attributesPerId.containsKey(attribute.id)) {
                return;
            }
            this.attributesPerId.remove(attribute.id);
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
                this.attributesPerQualifier.put(attribute.getQualifier(), attributes);
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
                this.attributesPerQualifier.remove(attribute.getQualifier());
            }
        };
        ClientModelStore.prototype.findAllAttributesByQualifier = function (qualifier) {
            if (!qualifier || !this.attributesPerQualifier.containsKey(qualifier)) {
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
    }());
    opendolphin.ClientModelStore = ClientModelStore;
})(opendolphin || (opendolphin = {}));
/// <reference path="NamedCommand.ts" />
/// <reference path="SignalCommand.ts" />
/// <reference path="EmptyNotification.ts" />
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientModelStore.ts" />
/// <reference path="ClientConnector.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="AttributeCreatedNotification.ts" />
var opendolphin;
(function (opendolphin) {
    var ClientDolphin = (function () {
        function ClientDolphin() {
        }
        ClientDolphin.prototype.setClientConnector = function (clientConnector) {
            this.clientConnector = clientConnector;
        };
        ClientDolphin.prototype.getClientConnector = function () {
            return this.clientConnector;
        };
        ClientDolphin.prototype.send = function (commandName, onFinished) {
            this.clientConnector.send(new opendolphin.NamedCommand(commandName), onFinished);
        };
        ClientDolphin.prototype.reset = function (successHandler) {
            this.clientConnector.reset(successHandler);
        };
        ClientDolphin.prototype.sendEmpty = function (onFinished) {
            this.clientConnector.send(new opendolphin.EmptyNotification(), onFinished);
        };
        // factory method for attributes
        ClientDolphin.prototype.attribute = function (propertyName, qualifier, value, tag) {
            return new opendolphin.ClientAttribute(propertyName, qualifier, value, tag);
        };
        // factory method for presentation models
        ClientDolphin.prototype.presentationModel = function (id, type) {
            var attributes = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                attributes[_i - 2] = arguments[_i];
            }
            var model = new opendolphin.ClientPresentationModel(id, type);
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
        ClientDolphin.prototype.deleteAllPresentationModelOfType = function (presentationModelType) {
            this.getClientModelStore().deleteAllPresentationModelOfType(presentationModelType);
        };
        ClientDolphin.prototype.updatePresentationModelQualifier = function (presentationModel) {
            var _this = this;
            presentationModel.getAttributes().forEach(function (sourceAttribute) {
                _this.updateAttributeQualifier(sourceAttribute);
            });
        };
        ClientDolphin.prototype.updateAttributeQualifier = function (sourceAttribute) {
            if (!sourceAttribute.getQualifier())
                return;
            var attributes = this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());
            attributes.forEach(function (targetAttribute) {
                if (targetAttribute.tag != sourceAttribute.tag)
                    return; // attributes with same qualifier and tag
                targetAttribute.setValue(sourceAttribute.getValue()); // should always have the same value
                targetAttribute.setBaseValue(sourceAttribute.getBaseValue()); // and same base value and so dirtyness
            });
        };
        ClientDolphin.prototype.tag = function (presentationModel, propertyName, value, tag) {
            var clientAttribute = new opendolphin.ClientAttribute(propertyName, null, value, tag);
            this.addAttributeToModel(presentationModel, clientAttribute);
            return clientAttribute;
        };
        ClientDolphin.prototype.addAttributeToModel = function (presentationModel, clientAttribute) {
            presentationModel.addAttribute(clientAttribute);
            this.getClientModelStore().registerAttribute(clientAttribute);
            if (!presentationModel.clientSideOnly) {
                this.clientConnector.send(new opendolphin.AttributeCreatedNotification(presentationModel.id, clientAttribute.id, clientAttribute.propertyName, clientAttribute.getValue(), clientAttribute.getQualifier(), clientAttribute.tag), null);
            }
        };
        ////// push support ///////
        ClientDolphin.prototype.startPushListening = function (pushActionName, releaseActionName) {
            this.clientConnector.setPushListener(new opendolphin.NamedCommand(pushActionName));
            this.clientConnector.setReleaseCommand(new opendolphin.SignalCommand(releaseActionName));
            this.clientConnector.setPushEnabled(true);
            this.clientConnector.listen();
        };
        ClientDolphin.prototype.stopPushListening = function () {
            this.clientConnector.setPushEnabled(false);
        };
        return ClientDolphin;
    }());
    opendolphin.ClientDolphin = ClientDolphin;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var PresentationModelResetedCommand = (function (_super) {
        __extends(PresentationModelResetedCommand, _super);
        function PresentationModelResetedCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'PresentationModelReseted';
            this.className = "org.opendolphin.core.comm.PresentationModelResetedCommand";
        }
        return PresentationModelResetedCommand;
    }(opendolphin.Command));
    opendolphin.PresentationModelResetedCommand = PresentationModelResetedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var SavedPresentationModelNotification = (function (_super) {
        __extends(SavedPresentationModelNotification, _super);
        function SavedPresentationModelNotification(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'SavedPresentationModel';
            this.className = "org.opendolphin.core.comm.SavedPresentationModelNotification";
        }
        return SavedPresentationModelNotification;
    }(opendolphin.Command));
    opendolphin.SavedPresentationModelNotification = SavedPresentationModelNotification;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="Command.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var InitializeAttributeCommand = (function (_super) {
        __extends(InitializeAttributeCommand, _super);
        function InitializeAttributeCommand(pmId, pmType, propertyName, qualifier, newValue, tag) {
            if (tag === void 0) { tag = opendolphin.Tag.value(); }
            _super.call(this);
            this.pmId = pmId;
            this.pmType = pmType;
            this.propertyName = propertyName;
            this.qualifier = qualifier;
            this.newValue = newValue;
            this.tag = tag;
            this.id = 'InitializeAttribute';
            this.className = "org.opendolphin.core.comm.InitializeAttributeCommand";
        }
        return InitializeAttributeCommand;
    }(opendolphin.Command));
    opendolphin.InitializeAttributeCommand = InitializeAttributeCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var SwitchPresentationModelCommand = (function (_super) {
        __extends(SwitchPresentationModelCommand, _super);
        function SwitchPresentationModelCommand(pmId, sourcePmId) {
            _super.call(this);
            this.pmId = pmId;
            this.sourcePmId = sourcePmId;
            this.id = 'SwitchPresentationModel';
            this.className = "org.opendolphin.core.comm.SwitchPresentationModelCommand";
        }
        return SwitchPresentationModelCommand;
    }(opendolphin.Command));
    opendolphin.SwitchPresentationModelCommand = SwitchPresentationModelCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeleteAllPresentationModelsOfTypeCommand = (function (_super) {
        __extends(DeleteAllPresentationModelsOfTypeCommand, _super);
        function DeleteAllPresentationModelsOfTypeCommand(pmType) {
            _super.call(this);
            this.pmType = pmType;
            this.id = 'DeleteAllPresentationModelsOfType';
            this.className = "org.opendolphin.core.comm.DeleteAllPresentationModelsOfTypeCommand";
        }
        return DeleteAllPresentationModelsOfTypeCommand;
    }(opendolphin.Command));
    opendolphin.DeleteAllPresentationModelsOfTypeCommand = DeleteAllPresentationModelsOfTypeCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DeletePresentationModelCommand = (function (_super) {
        __extends(DeletePresentationModelCommand, _super);
        function DeletePresentationModelCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'DeletePresentationModel';
            this.className = "org.opendolphin.core.comm.DeletePresentationModelCommand";
        }
        return DeletePresentationModelCommand;
    }(opendolphin.Command));
    opendolphin.DeletePresentationModelCommand = DeletePresentationModelCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var DataCommand = (function (_super) {
        __extends(DataCommand, _super);
        function DataCommand(data) {
            _super.call(this);
            this.data = data;
            this.id = "Data";
            this.className = "org.opendolphin.core.comm.DataCommand";
        }
        return DataCommand;
    }(opendolphin.Command));
    opendolphin.DataCommand = DataCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientPresentationModel.ts" />
/// <reference path="Command.ts" />
/// <reference path="CommandBatcher.ts" />
/// <reference path="Codec.ts" />
/// <reference path="CallNamedActionCommand.ts" />
/// <reference path="ClientDolphin.ts" />
/// <reference path="AttributeMetadataChangedCommand.ts" />
/// <reference path="ClientAttribute.ts" />
/// <reference path="PresentationModelResetedCommand.ts" />
/// <reference path="SavedPresentationModelNotification.ts" />
/// <reference path="InitializeAttributeCommand.ts" />
/// <reference path="SwitchPresentationModelCommand.ts" />
/// <reference path="ValueChangedCommand.ts" />
/// <reference path="DeleteAllPresentationModelsOfTypeCommand.ts" />
/// <reference path="DeleteAllPresentationModelsOfTypeCommand.ts" />
/// <reference path="DeletePresentationModelCommand.ts" />
/// <reference path="CreatePresentationModelCommand.ts" />
/// <reference path="DataCommand.ts" />
/// <reference path="NamedCommand.ts" />
/// <reference path="SignalCommand.ts" />
/// <reference path="Tag.ts" />
var opendolphin;
(function (opendolphin) {
    var ClientConnector = (function () {
        function ClientConnector(transmitter, clientDolphin, slackMS, maxBatchSize) {
            if (slackMS === void 0) { slackMS = 0; }
            if (maxBatchSize === void 0) { maxBatchSize = 50; }
            this.commandQueue = [];
            this.currentlySending = false;
            this.pushEnabled = false;
            this.waiting = false;
            this.transmitter = transmitter;
            this.clientDolphin = clientDolphin;
            this.slackMS = slackMS;
            this.codec = new opendolphin.Codec();
            this.commandBatcher = new opendolphin.BlindCommandBatcher(true, maxBatchSize);
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
        ClientConnector.prototype.reset = function (successHandler) {
            this.transmitter.reset(successHandler);
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
                }
                else {
                    this.currentlySending = false;
                    return;
                }
            }
            this.currentlySending = true;
            var cmdsAndHandlers = this.commandBatcher.batch(this.commandQueue);
            var callback = cmdsAndHandlers[cmdsAndHandlers.length - 1].handler;
            var commands = cmdsAndHandlers.map(function (cah) { return cah.command; });
            this.transmitter.transmit(commands, function (response) {
                //console.log("server response: [" + response.map(it => it.id).join(", ") + "] ");
                var touchedPMs = [];
                response.forEach(function (command) {
                    var touched = _this.handle(command);
                    if (touched)
                        touchedPMs.push(touched);
                });
                if (callback) {
                    callback.onFinished(touchedPMs); // todo: make them unique?
                }
                // recursive call: fetch the next in line but allow a bit of slack such that
                // document events can fire, rendering is done and commands can batch up
                setTimeout(function () { return _this.doSendNext(); }, _this.slackMS);
            });
        };
        ClientConnector.prototype.handle = function (command) {
            if (command.id == "Data") {
                return this.handleDataCommand(command);
            }
            else if (command.id == "DeletePresentationModel") {
                return this.handleDeletePresentationModelCommand(command);
            }
            else if (command.id == "DeleteAllPresentationModelsOfType") {
                return this.handleDeleteAllPresentationModelOfTypeCommand(command);
            }
            else if (command.id == "CreatePresentationModel") {
                return this.handleCreatePresentationModelCommand(command);
            }
            else if (command.id == "ValueChanged") {
                return this.handleValueChangedCommand(command);
            }
            else if (command.id == "SwitchPresentationModel") {
                return this.handleSwitchPresentationModelCommand(command);
            }
            else if (command.id == "InitializeAttribute") {
                return this.handleInitializeAttributeCommand(command);
            }
            else if (command.id == "SavedPresentationModel") {
                return this.handleSavedPresentationModelNotification(command);
            }
            else if (command.id == "PresentationModelReseted") {
                return this.handlePresentationModelResetedCommand(command);
            }
            else if (command.id == "AttributeMetadataChanged") {
                return this.handleAttributeMetadataChangedCommand(command);
            }
            else if (command.id == "CallNamedAction") {
                return this.handleCallNamedActionCommand(command);
            }
            else {
                console.log("Cannot handle, unknown command " + command);
            }
            return null;
        };
        ClientConnector.prototype.handleDataCommand = function (serverCommand) {
            return serverCommand.data;
        };
        ClientConnector.prototype.handleDeletePresentationModelCommand = function (serverCommand) {
            var model = this.clientDolphin.findPresentationModelById(serverCommand.pmId);
            if (!model)
                return null;
            this.clientDolphin.getClientModelStore().deletePresentationModel(model, true);
            return model;
        };
        ClientConnector.prototype.handleDeleteAllPresentationModelOfTypeCommand = function (serverCommand) {
            this.clientDolphin.deleteAllPresentationModelOfType(serverCommand.pmType);
            return null;
        };
        ClientConnector.prototype.handleCreatePresentationModelCommand = function (serverCommand) {
            var _this = this;
            if (this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)) {
                throw new Error("There already is a presentation model with id " + serverCommand.pmId + "  known to the client.");
            }
            var attributes = [];
            serverCommand.attributes.forEach(function (attr) {
                var clientAttribute = _this.clientDolphin.attribute(attr.propertyName, attr.qualifier, attr.value, attr.tag ? attr.tag : opendolphin.Tag.value());
                clientAttribute.setBaseValue(attr.baseValue);
                if (attr.id && attr.id.match(".*S$")) {
                    clientAttribute.id = attr.id;
                }
                attributes.push(clientAttribute);
            });
            var clientPm = new opendolphin.ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
            clientPm.addAttributes(attributes);
            if (serverCommand.clientSideOnly) {
                clientPm.clientSideOnly = true;
            }
            this.clientDolphin.getClientModelStore().add(clientPm);
            this.clientDolphin.updatePresentationModelQualifier(clientPm);
            clientPm.updateAttributeDirtyness();
            clientPm.updateDirty();
            return clientPm;
        };
        ClientConnector.prototype.handleValueChangedCommand = function (serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                console.log("attribute with id " + serverCommand.attributeId + " not found, cannot update old value " + serverCommand.oldValue + " to new value " + serverCommand.newValue);
                return null;
            }
            if (clientAttribute.getValue() == serverCommand.newValue) {
                //console.log("nothing to do. new value == old value");
                return null;
            }
            // Below was the code that would enforce that value changes only appear when the proper oldValue is given.
            // While that seemed appropriate at first, there are actually valid command sequences where the oldValue is not properly set.
            // We leave the commented code in the codebase to allow for logging/debugging such cases.
            //            if(clientAttribute.getValue() != serverCommand.oldValue) {
            //                console.log("attribute with id "+serverCommand.attributeId+" and value " + clientAttribute.getValue() +
            //                            " was set to value " + serverCommand.newValue + " even though the change was based on an outdated old value of " + serverCommand.oldValue);
            //            }
            clientAttribute.setValue(serverCommand.newValue);
            return null;
        };
        ClientConnector.prototype.handleSwitchPresentationModelCommand = function (serverCommand) {
            var switchPm = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            if (!switchPm) {
                console.log("switch model with id " + serverCommand.pmId + " not found, cannot switch.");
                return null;
            }
            var sourcePm = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.sourcePmId);
            if (!sourcePm) {
                console.log("source model with id " + serverCommand.sourcePmId + " not found, cannot switch.");
                return null;
            }
            switchPm.syncWith(sourcePm);
            return switchPm;
        };
        ClientConnector.prototype.handleInitializeAttributeCommand = function (serverCommand) {
            var attribute = new opendolphin.ClientAttribute(serverCommand.propertyName, serverCommand.qualifier, serverCommand.newValue, serverCommand.tag);
            if (serverCommand.qualifier) {
                var attributesCopy = this.clientDolphin.getClientModelStore().findAllAttributesByQualifier(serverCommand.qualifier);
                if (attributesCopy) {
                    if (!serverCommand.newValue) {
                        var attr = attributesCopy.shift();
                        if (attr) {
                            attribute.setValue(attr.getValue());
                        }
                    }
                    else {
                        attributesCopy.forEach(function (attr) {
                            attr.setValue(attribute.getValue());
                        });
                    }
                }
            }
            var presentationModel;
            if (serverCommand.pmId) {
                presentationModel = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            }
            if (!presentationModel) {
                presentationModel = new opendolphin.ClientPresentationModel(serverCommand.pmId, serverCommand.pmType);
                this.clientDolphin.getClientModelStore().add(presentationModel);
            }
            this.clientDolphin.addAttributeToModel(presentationModel, attribute);
            this.clientDolphin.updatePresentationModelQualifier(presentationModel);
            return presentationModel;
        };
        ClientConnector.prototype.handleSavedPresentationModelNotification = function (serverCommand) {
            if (!serverCommand.pmId)
                return null;
            var model = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            if (!model) {
                console.log("model with id " + serverCommand.pmId + " not found, cannot rebase.");
                return null;
            }
            model.rebase();
            return model;
        };
        ClientConnector.prototype.handlePresentationModelResetedCommand = function (serverCommand) {
            if (!serverCommand.pmId)
                return null;
            var model = this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);
            if (!model) {
                console.log("model with id " + serverCommand.pmId + " not found, cannot reset.");
                return null;
            }
            model.reset();
            return model;
        };
        ClientConnector.prototype.handleAttributeMetadataChangedCommand = function (serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute)
                return null;
            clientAttribute[serverCommand.metadataName] = serverCommand.value;
            return null;
        };
        ClientConnector.prototype.handleCallNamedActionCommand = function (serverCommand) {
            this.clientDolphin.send(serverCommand.actionName, null);
            return null;
        };
        ///////////// push support ///////////////
        ClientConnector.prototype.listen = function () {
            if (!this.pushEnabled)
                return;
            if (this.waiting)
                return;
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
                    onFinished: function (models) { me.waiting = false; },
                    onFinishedData: null
                }
            });
        };
        ClientConnector.prototype.release = function () {
            if (!this.waiting)
                return;
            this.waiting = false;
            // todo: how to issue a warning if no releaseCommand is set?
            this.transmitter.signal(this.releaseCommand);
        };
        return ClientConnector;
    }());
    opendolphin.ClientConnector = ClientConnector;
})(opendolphin || (opendolphin = {}));
/// <reference path="DolphinBuilder.ts"/>
/**
 * JS-friendly facade to avoid too many dependencies in plain JS code.
 * The name of this file is also used for the initial lookup of the
 * one javascript file that contains all the dolphin code.
 * Changing the name requires the build support and all users
 * to be updated as well.
 * Dierk Koenig
 */
var opendolphin;
(function (opendolphin) {
    // factory method for the initialized dolphin
    // Deprecated ! Use 'makeDolphin() instead
    function dolphin(url, reset, slackMS) {
        if (slackMS === void 0) { slackMS = 300; }
        return makeDolphin().url(url).reset(reset).slackMS(slackMS).build();
    }
    opendolphin.dolphin = dolphin;
    // factory method to build an initialized dolphin
    function makeDolphin() {
        return new opendolphin.DolphinBuilder();
    }
    opendolphin.makeDolphin = makeDolphin;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
/// <reference path="SignalCommand.ts"/>
/// <reference path="ClientConnector.ts"/>
var opendolphin;
(function (opendolphin) {
    /**
     * A transmitter that is not transmitting at all.
     * It may serve as a stand-in when no real transmitter is needed.
     */
    var NoTransmitter = (function () {
        function NoTransmitter() {
        }
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
    }());
    opendolphin.NoTransmitter = NoTransmitter;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts"/>
/// <reference path="SignalCommand.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="Codec.ts"/>
var opendolphin;
(function (opendolphin) {
    var HttpTransmitter = (function () {
        function HttpTransmitter(url, reset, charset, errorHandler, supportCORS) {
            if (reset === void 0) { reset = true; }
            if (charset === void 0) { charset = "UTF-8"; }
            if (errorHandler === void 0) { errorHandler = null; }
            if (supportCORS === void 0) { supportCORS = false; }
            this.url = url;
            this.charset = charset;
            this.HttpCodes = {
                finished: 4,
                success: 200
            };
            this.errorHandler = errorHandler;
            this.supportCORS = supportCORS;
            this.http = new XMLHttpRequest();
            this.sig = new XMLHttpRequest();
            if (this.supportCORS) {
                if ("withCredentials" in this.http) {
                    this.http.withCredentials = true; // NOTE: doing this for non CORS requests has no impact
                    this.sig.withCredentials = true;
                }
            }
            this.codec = new opendolphin.Codec();
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
                            }
                            catch (err) {
                                console.log("Error occurred parsing responseText: ", err);
                                console.log("Incorrect responseText: ", responseText);
                                _this.handleError('application', "HttpTransmitter: Incorrect responseText: " + responseText);
                                onDone([]);
                            }
                        }
                        else {
                            _this.handleError('application', "HttpTransmitter: empty responseText");
                            onDone([]);
                        }
                    }
                    else {
                        _this.handleError('application', "HttpTransmitter: HTTP Status != 200");
                        onDone([]);
                    }
                }
            };
            this.http.open('POST', this.url, true);
            if ("overrideMimeType" in this.http) {
                this.http.overrideMimeType("application/json; charset=" + this.charset); // todo make injectable
            }
            this.http.send(this.codec.encode(commands));
        };
        HttpTransmitter.prototype.handleError = function (kind, message) {
            var errorEvent = { kind: kind, url: this.url, httpStatus: this.http.status, message: message };
            if (this.errorHandler) {
                this.errorHandler(errorEvent);
            }
            else {
                console.log("Error occurred: ", errorEvent);
            }
        };
        HttpTransmitter.prototype.signal = function (command) {
            this.sig.open('POST', this.url, true);
            this.sig.send(this.codec.encode([command]));
        };
        // Deprecated ! Use 'reset(OnSuccessHandler) instead
        HttpTransmitter.prototype.invalidate = function () {
            this.http.open('POST', this.url + 'invalidate?', false);
            this.http.send();
        };
        HttpTransmitter.prototype.reset = function (successHandler) {
            var _this = this;
            this.http.onreadystatechange = function (evt) {
                if (_this.http.readyState == _this.HttpCodes.finished) {
                    if (_this.http.status == _this.HttpCodes.success) {
                        successHandler.onSuccess();
                    }
                    else {
                        _this.handleError('application', "HttpTransmitter.reset(): HTTP Status != 200");
                    }
                }
            };
            this.http.open('POST', this.url + 'invalidate?', true);
            this.http.send();
        };
        return HttpTransmitter;
    }());
    opendolphin.HttpTransmitter = HttpTransmitter;
})(opendolphin || (opendolphin = {}));
/// <reference path="ClientDolphin.ts"/>
/// <reference path="OpenDolphin.ts"/>
/// <reference path="ClientConnector.ts"/>
/// <reference path="ClientModelStore.ts"/>
/// <reference path="NoTransmitter.ts"/>
/// <reference path="HttpTransmitter.ts"/>
/// <reference path="ClientAttribute.ts"/>
var opendolphin;
(function (opendolphin) {
    var DolphinBuilder = (function () {
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
        DolphinBuilder.prototype.build = function () {
            console.log("OpenDolphin js found");
            var clientDolphin = new opendolphin.ClientDolphin();
            var transmitter;
            if (this.url_ != null && this.url_.length > 0) {
                transmitter = new opendolphin.HttpTransmitter(this.url_, this.reset_, "UTF-8", this.errorHandler_, this.supportCORS_);
            }
            else {
                transmitter = new opendolphin.NoTransmitter();
            }
            clientDolphin.setClientConnector(new opendolphin.ClientConnector(transmitter, clientDolphin, this.slackMS_, this.maxBatchSize_));
            clientDolphin.setClientModelStore(new opendolphin.ClientModelStore(clientDolphin));
            console.log("ClientDolphin initialized");
            return clientDolphin;
        };
        return DolphinBuilder;
    }());
    opendolphin.DolphinBuilder = DolphinBuilder;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var GetPresentationModelCommand = (function (_super) {
        __extends(GetPresentationModelCommand, _super);
        function GetPresentationModelCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'GetPresentationModel';
            this.className = "org.opendolphin.core.comm.GetPresentationModelCommand";
        }
        return GetPresentationModelCommand;
    }(opendolphin.Command));
    opendolphin.GetPresentationModelCommand = GetPresentationModelCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var ResetPresentationModelCommand = (function (_super) {
        __extends(ResetPresentationModelCommand, _super);
        function ResetPresentationModelCommand(pmId) {
            _super.call(this);
            this.pmId = pmId;
            this.id = 'ResetPresentationModel';
            this.className = "org.opendolphin.core.comm.ResetPresentationModelCommand";
        }
        return ResetPresentationModelCommand;
    }(opendolphin.Command));
    opendolphin.ResetPresentationModelCommand = ResetPresentationModelCommand;
})(opendolphin || (opendolphin = {}));

},{}],66:[function(_dereq_,module,exports){
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

_dereq_('./polyfills.js');
var Map = _dereq_('../bower_components/core.js/library/fn/map');
var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;


function BeanManager(classRepository) {
    checkMethod('BeanManager(classRepository)');
    checkParam(classRepository, 'classRepository');

    this.classRepository = classRepository;
    this.addedHandlers = new Map();
    this.removedHandlers = new Map();
    this.updatedHandlers = new Map();
    this.arrayUpdatedHandlers = new Map();
    this.allAddedHandlers = [];
    this.allRemovedHandlers = [];
    this.allUpdatedHandlers = [];
    this.allArrayUpdatedHandlers = [];

    var self = this;
    this.classRepository.onBeanAdded(function(type, bean) {
        var handlerList = self.addedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                }
            });
        }
        self.allAddedHandlers.forEach(function (handler) {
            try {
                handler(bean);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanAdded-handler', e);
            }
        });
    });
    this.classRepository.onBeanRemoved(function(type, bean) {
        var handlerList = self.removedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function(handler) {
                try {
                    handler(bean);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                }
            });
        }
        self.allRemovedHandlers.forEach(function(handler) {
            try {
                handler(bean);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanRemoved-handler', e);
            }
        });
    });
    this.classRepository.onBeanUpdate(function(type, bean, propertyName, newValue, oldValue) {
        var handlerList = self.updatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch(e) {
                    console.warn('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                }
            });
        }
        self.allUpdatedHandlers.forEach(function (handler) {
            try {
                handler(bean, propertyName, newValue, oldValue);
            } catch(e) {
                console.warn('An exception occurred while calling a general onBeanUpdate-handler', e);
            }
        });
    });
    this.classRepository.onArrayUpdate(function(type, bean, propertyName, index, count, newElements) {
        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch(e) {
                    console.warn('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                }
            });
        }
        self.allArrayUpdatedHandlers.forEach(function (handler) {
            try {
                handler(bean, propertyName, index, count, newElements);
            } catch(e) {
                console.warn('An exception occurred while calling a general onArrayUpdate-handler', e);
            }
        });
    });

}


BeanManager.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    checkMethod('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');

    return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
};


BeanManager.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    checkMethod('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');
    checkParam(index, 'index');
    checkParam(count, 'count');
    checkParam(removedElements, 'removedElements');

    this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
};


BeanManager.prototype.isManaged = function(bean) {
    checkMethod('BeanManager.isManaged(bean)');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.isManaged() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.create = function(type) {
    checkMethod('BeanManager.create(type)');
    checkParam(type, 'type');

    // TODO: Implement dolphin.create() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.add = function(type, bean) {
    checkMethod('BeanManager.add(type, bean)');
    checkParam(type, 'type');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.add() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.addAll = function(type, collection) {
    checkMethod('BeanManager.addAll(type, collection)');
    checkParam(type, 'type');
    checkParam(collection, 'collection');

    // TODO: Implement dolphin.addAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.remove = function(bean) {
    checkMethod('BeanManager.remove(bean)');
    checkParam(bean, 'bean');

    // TODO: Implement dolphin.remove() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeAll = function(collection) {
    checkMethod('BeanManager.removeAll(collection)');
    checkParam(collection, 'collection');

    // TODO: Implement dolphin.removeAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeIf = function(predicate) {
    checkMethod('BeanManager.removeIf(predicate)');
    checkParam(predicate, 'predicate');

    // TODO: Implement dolphin.removeIf() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.onAdded = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onAdded(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allAddedHandlers = self.allAddedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onAdded(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.addedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.addedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.addedHandlers.get(type);
                if (exists(handlerList)) {
                    self.addedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onRemoved = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onRemoved(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allRemovedHandlers = self.allRemovedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onRemoved(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.removedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.removedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.removedHandlers.get(type);
                if (exists(handlerList)) {
                    self.removedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onBeanUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onBeanUpdate(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onBeanUpdate(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.updatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.updatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.updatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.updatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};


BeanManager.prototype.onArrayUpdate = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        checkMethod('BeanManager.onArrayUpdate(eventHandler)');
        checkParam(eventHandler, 'eventHandler');

        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
        checkMethod('BeanManager.onArrayUpdate(type, eventHandler)');
        checkParam(type, 'type');
        checkParam(eventHandler, 'eventHandler');

        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (!exists(handlerList)) {
            handlerList = [];
        }
        self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
        return {
            unsubscribe: function() {
                var handlerList = self.arrayUpdatedHandlers.get(type);
                if (exists(handlerList)) {
                    self.arrayUpdatedHandlers.set(type, handlerList.filter(function(value) {
                        return value !== eventHandler;
                    }));
                }
            }
        };
    }
};



exports.BeanManager = BeanManager;
},{"../bower_components/core.js/library/fn/map":1,"./polyfills.js":75,"./utils.js":76}],67:[function(_dereq_,module,exports){
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
/* global Platform, console */
"use strict";

_dereq_('./polyfills.js');
var Map = _dereq_('../bower_components/core.js/library/fn/map');
var opendolphin = _dereq_('../opendolphin/build/opendolphin.js');

var consts = _dereq_('./constants');

var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;

var blocked = null;

function fixType(type, value) {
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

function fromDolphin(classRepository, type, value) {
    if (! exists(value)) {
        return null;
    }
    switch (type) {
        case consts.DOLPHIN_BEAN:
            return classRepository.beanFromDolphin.get(String(value));
        case consts.DATE:
            return new Date(String(value));
        default:
            return fixType(type, value);
    }
}

function toDolphin(classRepository, type, value) {
    if (! exists(value)) {
        return null;
    }
    switch (type) {
        case consts.DOLPHIN_BEAN:
            return classRepository.beanToDolphin.get(value);
        case consts.DATE:
            return value instanceof Date? value.toISOString() : value;
        default:
            return fixType(type, value);
    }
}

function sendListSplice(classRepository, modelId, propertyName, from, to, newElements) {
    var dolphin = classRepository.dolphin;
    var model = dolphin.findPresentationModelById(modelId);
    if (exists(model)) {
        var classInfo = classRepository.classes.get(model.presentationModelType);
        var type = classInfo[propertyName];
        if (exists(type)) {

            var attributes = [
                dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'),
                dolphin.attribute('source', null, modelId),
                dolphin.attribute('attribute', null, propertyName),
                dolphin.attribute('from', null, from),
                dolphin.attribute('to', null, to),
                dolphin.attribute('count', null, newElements.length)
            ];
            newElements.forEach(function(element, index) {
                attributes.push(dolphin.attribute(index.toString(), null, toDolphin(classRepository, type, element)));
            });
            dolphin.presentationModel.apply(dolphin, [null, '@DP:LS@'].concat(attributes));
        }
    }
}

function validateList(classRepository, type, bean, propertyName) {
    var list = bean[propertyName];
    if (!exists(list)) {
        classRepository.propertyUpdateHandlers.forEach(function(handler) {
            try {
                handler(type, bean, propertyName, [], undefined);
            } catch(e) {
                console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
            }
        });
    }
}

function block(bean, propertyName) {
    if (exists(blocked)) {
        throw new Error('Trying to create a block while another block exists');
    }
    blocked = {
        bean: bean,
        propertyName: propertyName
    };
}

function isBlocked(bean, propertyName) {
    return exists(blocked) && blocked.bean === bean && blocked.propertyName === propertyName;
}

function unblock() {
    blocked = null;
}


function ClassRepository(dolphin) {
    checkMethod('ClassRepository(dolphin)');
    checkParam(dolphin, 'dolphin');

    this.dolphin = dolphin;
    this.classes = new Map();
    this.beanFromDolphin = new Map();
    this.beanToDolphin = new Map();
    this.classInfos = new Map();
    this.beanAddedHandlers = [];
    this.beanRemovedHandlers = [];
    this.propertyUpdateHandlers = [];
    this.arrayUpdateHandlers = [];
}


ClassRepository.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    checkMethod('ClassRepository.notifyBeanChange(bean, propertyName, newValue)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');

    var modelId = this.beanToDolphin.get(bean);
    if (exists(modelId)) {
        var model = this.dolphin.findPresentationModelById(modelId);
        if (exists(model)) {
            var classInfo = this.classes.get(model.presentationModelType);
            var type = classInfo[propertyName];
            var attribute = model.findAttributeByPropertyName(propertyName);
            if (exists(type) && exists(attribute)) {
                var oldValue = attribute.getValue();
                attribute.setValue(toDolphin(this, type, newValue));
                return fromDolphin(this, type, oldValue);
            }
        }
    }
};


ClassRepository.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    checkMethod('ClassRepository.notifyArrayChange(bean, propertyName, index, count, removedElements)');
    checkParam(bean, 'bean');
    checkParam(propertyName, 'propertyName');
    checkParam(index, 'index');
    checkParam(count, 'count');
    checkParam(removedElements, 'removedElements');

    if (isBlocked(bean, propertyName)) {
        return;
    }
    var modelId = this.beanToDolphin.get(bean);
    var array = bean[propertyName];
    if (exists(modelId) && exists(array)) {
        var removedElementsCount = Array.isArray(removedElements)? removedElements.length : 0;
        sendListSplice(this, modelId, propertyName, index, index + removedElementsCount, array.slice(index, index + count));
    }
};


ClassRepository.prototype.onBeanAdded = function(handler) {
    checkMethod('ClassRepository.onBeanAdded(handler)');
    checkParam(handler, 'handler');
    this.beanAddedHandlers.push(handler);
};


ClassRepository.prototype.onBeanRemoved = function(handler) {
    checkMethod('ClassRepository.onBeanRemoved(handler)');
    checkParam(handler, 'handler');
    this.beanRemovedHandlers.push(handler);
};


ClassRepository.prototype.onBeanUpdate = function(handler) {
    checkMethod('ClassRepository.onBeanUpdate(handler)');
    checkParam(handler, 'handler');
    this.propertyUpdateHandlers.push(handler);
};


ClassRepository.prototype.onArrayUpdate = function(handler) {
    checkMethod('ClassRepository.onArrayUpdate(handler)');
    checkParam(handler, 'handler');
    this.arrayUpdateHandlers.push(handler);
};


ClassRepository.prototype.registerClass = function (model) {
    checkMethod('ClassRepository.registerClass(model)');
    checkParam(model, 'model');

    if (this.classes.has(model.id)) {
        return;
    }

    var classInfo = {};
    model.attributes.filter(function(attribute) {
        return attribute.propertyName.search(/^@/) < 0;
    }).forEach(function (attribute) {
        classInfo[attribute.propertyName] = attribute.value;
    });
    this.classes.set(model.id, classInfo);
};


ClassRepository.prototype.unregisterClass = function (model) {
    checkMethod('ClassRepository.unregisterClass(model)');
    checkParam(model, 'model');

    this.classes['delete'](model.id);
};


ClassRepository.prototype.load = function (model) {
    checkMethod('ClassRepository.load(model)');
    checkParam(model, 'model');

    var self = this;
    var classInfo = this.classes.get(model.presentationModelType);
    var bean = {};
    model.attributes.filter(function (attribute) {
        return (attribute.tag === opendolphin.Tag.value()) && (attribute.propertyName.search(/^@/) < 0);
    }).forEach(function (attribute) {
        bean[attribute.propertyName] = null;
        attribute.onValueChange(function (event) {
            if (event.oldValue !== event.newValue) {
                var oldValue = fromDolphin(self, classInfo[attribute.propertyName], event.oldValue);
                var newValue = fromDolphin(self, classInfo[attribute.propertyName], event.newValue);
                self.propertyUpdateHandlers.forEach(function(handler) {
                    try {
                        handler(model.presentationModelType, bean, attribute.propertyName, newValue, oldValue);
                    } catch(e) {
                        console.warn('An exception occurred while calling an onBeanUpdate-handler', e);
                    }
                });
            }
        });
    });
    this.beanFromDolphin.set(model.id, bean);
    this.beanToDolphin.set(bean, model.id);
    this.classInfos.set(model.id, classInfo);
    this.beanAddedHandlers.forEach(function(handler) {
        try {
            handler(model.presentationModelType, bean);
        } catch(e) {
            console.warn('An exception occurred while calling an onBeanAdded-handler', e);
        }
    });
    return bean;
};


ClassRepository.prototype.unload = function(model) {
    checkMethod('ClassRepository.unload(model)');
    checkParam(model, 'model');

    var bean = this.beanFromDolphin.get(model.id);
    this.beanFromDolphin['delete'](model.id);
    this.beanToDolphin['delete'](bean);
    this.classInfos['delete'](model.id);
    if (exists(bean)) {
        this.beanRemovedHandlers.forEach(function(handler) {
            try {
                handler(model.presentationModelType, bean);
            } catch(e) {
                console.warn('An exception occurred while calling an onBeanRemoved-handler', e);
            }
        });
    }
    return bean;
};


ClassRepository.prototype.spliceListEntry = function(model) {
    checkMethod('ClassRepository.spliceListEntry(model)');
    checkParam(model, 'model');

    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var from = model.findAttributeByPropertyName('from');
    var to = model.findAttributeByPropertyName('to');
    var count = model.findAttributeByPropertyName('count');

    if (exists(source) && exists(attribute) && exists(from) && exists(to) && exists(count)) {
        var classInfo = this.classInfos.get(source.value);
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean) && exists(classInfo)) {
            var type = model.presentationModelType;
            //var entry = fromDolphin(this, classInfo[attribute.value], element.value);
            validateList(this, type, bean, attribute.value);
            var newElements = [],
                element = null;
            for (var i = 0; i < count.value; i++) {
                element = model.findAttributeByPropertyName(i.toString());
                if (! exists(element)) {
                    throw new Error("Invalid list modification update received");
                }
                newElements.push(fromDolphin(this, classInfo[attribute.value], element.value));
            }
            try {
                block(bean, attribute.value);
                this.arrayUpdateHandlers.forEach(function (handler) {
                    try {
                        handler(type, bean, attribute.value, from.value, to.value - from.value, newElements);
                    } catch(e) {
                        console.warn('An exception occurred while calling an onArrayUpdate-handler', e);
                    }
                });
            } finally {
                unblock();
            }
        } else {
            throw new Error("Invalid list modification update received. Source bean unknown.");
        }
    } else {
        throw new Error("Invalid list modification update received");
    }
};


ClassRepository.prototype.mapParamToDolphin = function(param) {
    if (!exists(param)) {
        return param;
    }
    var type = typeof param;
    if (type === 'object') {
        if (param instanceof Date) {
            return param.toISOString();
        } else {
            var value = this.beanToDolphin.get(param);
            if (exists(value)) {
                return value;
            }
            throw new TypeError("Only managed Dolphin Beans can be used");
        }
    }
    if (type === 'string' || type === 'number' || type === 'boolean') {
        return param;
    }
    throw new TypeError("Only managed Dolphin Beans and primitive types can be used");
};


ClassRepository.prototype.mapDolphinToBean = function(value) {
    return fromDolphin(this, consts.DOLPHIN_BEAN, value);
};



exports.ClassRepository = ClassRepository;

},{"../bower_components/core.js/library/fn/map":1,"../opendolphin/build/opendolphin.js":65,"./constants":71,"./polyfills.js":75,"./utils.js":76}],68:[function(_dereq_,module,exports){
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

_dereq_('./polyfills.js');
var utils = _dereq_('./utils.js');
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var INIT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'initClientContext';
var DISCONNECT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'disconnectClientContext';

function ClientContext(dolphin, beanManager, controllerManager, connector) {
    checkMethod('ClientContext(dolphin, beanManager, controllerManager, connector)');
    checkParam(dolphin, 'dolphin');
    checkParam(beanManager, 'beanManager');
    checkParam(controllerManager, 'controllerManager');
    checkParam(connector, 'connector');

    this.dolphin = dolphin;
    this.beanManager = beanManager;
    this._controllerManager = controllerManager;
    this._connector = connector;

    this._connector.invoke(INIT_COMMAND_NAME);
}


ClientContext.prototype.createController = function(name) {
    checkMethod('ClientContext.createController(name)');
    checkParam(name, 'name');

    return this._controllerManager.createController(name);
};


ClientContext.prototype.disconnect = function() {
    // TODO: Implement ClientContext.disconnect [DP-46]
    var self = this;
    this.dolphin.stopPushListening();
    this._controllerManager.destroy().then(function() {
        self._connector.invoke(DISCONNECT_COMMAND_NAME);
        self.dolphin = null;
        self.beanManager = null;
        self._controllerManager = null;
        self._connector = null;
    });
};


exports.ClientContext = ClientContext;
},{"./polyfills.js":75,"./utils.js":76}],69:[function(_dereq_,module,exports){
/* Copyright 2016 Canoo Engineering AG.
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


var exists = _dereq_('./utils.js').exists;


function encodeCreatePresentationModelCommand(command) {
    return {
        'p': command.pmId,
        't': command.pmType,
        'a': command.attributes.map(function (attribute) {
            var result = {
                'n': attribute.propertyName,
                'i': attribute.id
            };
            if (exists(attribute.value)) {
                result.v = attribute.value;
            }
            if (exists(attribute.tag) && attribute.tag !== 'VALUE') {
                result.t = attribute.tag;
            }
            return result;
        }),
        'id': 'CreatePresentationModel'
    };
}

function decodeCreatePresentationModelCommand(command) {
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
                'value': exists(attribute.v)? attribute.v : null,
                'baseValue': exists(attribute.v)? attribute.v : null,
                'qualifier': null,
                'tag': exists(attribute.t)? attribute.t : 'VALUE'
            };
        })
    };
}


function encodeValueChangedCommand(command) {
    var result = {
        'a': command.attributeId
    };
    if (exists(command.oldValue)) {
        result.o = command.oldValue;
    }
    if (exists(command.newValue)) {
        result.n = command.newValue;
    }
    result.id = 'ValueChanged';
    return result;
}

function decodeValueChangedCommand(command) {
    return {
        'id': 'ValueChanged',
        'className': "org.opendolphin.core.comm.ValueChangedCommand",
        'attributeId': command.a,
        'oldValue': exists(command.o)? command.o : null,
        'newValue': exists(command.n)? command.n : null
    };
}


exports.Codec = {
    encode: function (commands) {
        return JSON.stringify(commands.map(function (command) {
            if (command.id === 'CreatePresentationModel') {
                return encodeCreatePresentationModelCommand(command);
            } else if (command.id === 'ValueChanged') {
                return encodeValueChangedCommand(command);
            }
            return command;
        }));
    },
    decode: function (transmitted) {
        if (typeof transmitted == 'string') {
            return JSON.parse(transmitted).map(function (command) {
                if (command.id === 'CreatePresentationModel') {
                    return decodeCreatePresentationModelCommand(command);
                } else if (command.id === 'ValueChanged') {
                    return decodeValueChangedCommand(command);
                }
                return command;
            });
        }
        else {
            return transmitted;
        }
    }
};
},{"./utils.js":76}],70:[function(_dereq_,module,exports){
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

_dereq_('./polyfills.js');
var Promise = _dereq_('../bower_components/core.js/library/fn/promise');
var opendolphin = _dereq_('../opendolphin/build/opendolphin.js');
var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;


var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var POLL_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'longPoll';
var RELEASE_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'release';

var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var ACTION_CALL_BEAN = '@@@ CONTROLLER_ACTION_CALL_BEAN @@@';
var HIGHLANDER_BEAN = '@@@ HIGHLANDER_BEAN @@@';
var DOLPHIN_LIST_SPLICE = '@DP:LS@';
var SOURCE_SYSTEM = '@@@ SOURCE_SYSTEM @@@';
var SOURCE_SYSTEM_CLIENT = 'client';
var SOURCE_SYSTEM_SERVER = 'server';



var initializer;

function Connector(url, dolphin, classRepository, config) {
    checkMethod('Connector(url, dolphin, classRepository, config)');
    checkParam(url, 'url');
    checkParam(dolphin, 'dolphin');
    checkParam(classRepository, 'classRepository');

    var self = this;
    this.dolphin = dolphin;
    this.classRepository = classRepository;
    this.highlanderPMResolver = function() {};
    this.highlanderPMPromise = new Promise(function(resolve) {
        self.highlanderPMResolver = resolve;
    });

    dolphin.getClientModelStore().onModelStoreChange(function (event) {
        var model = event.clientPresentationModel;
        var sourceSystem = model.findAttributeByPropertyName(SOURCE_SYSTEM);
        if (exists(sourceSystem) && sourceSystem.value === SOURCE_SYSTEM_SERVER) {
            if (event.eventType === opendolphin.Type.ADDED) {
                self.onModelAdded(model);
            } else if (event.eventType === opendolphin.Type.REMOVED) {
                self.onModelRemoved(model);
            }
        }
    });

    if (!exists(config) || !exists(config.serverPush) || config.serverPush === true) {
        setTimeout(function() {
            dolphin.startPushListening(POLL_COMMAND_NAME, RELEASE_COMMAND_NAME);
        }, 500);
    }

    initializer = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.withCredentials = true;

        req.onload = function() {
            if (req.status === 200) {
                resolve();
            }
            else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function() {
            reject(Error("Network Error"));
        };

        req.open('POST', url + 'invalidate?');
        req.send();
    });
}


Connector.prototype.onModelAdded = function(model) {
    checkMethod('Connector.onModelAdded(model)');
    checkParam(model, 'model');

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
};


Connector.prototype.onModelRemoved = function(model) {
    checkMethod('Connector.onModelRemoved(model)');
    checkParam(model, 'model');

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
};


Connector.prototype.invoke = function(command) {
    checkMethod('Connector.invoke(command)');
    checkParam(command, 'command');

    var dolphin = this.dolphin;
    return new Promise(function(resolve) {
        //initializer.then(function () {
            dolphin.send(command, {
                onFinished: function() {
                    resolve();
                }
            });
        //});
    });
};


Connector.prototype.getHighlanderPM = function() {
    return this.highlanderPMPromise;
};



exports.Connector = Connector;
exports.SOURCE_SYSTEM = SOURCE_SYSTEM;
exports.SOURCE_SYSTEM_CLIENT = SOURCE_SYSTEM_CLIENT;
exports.SOURCE_SYSTEM_SERVER = SOURCE_SYSTEM_SERVER;
exports.ACTION_CALL_BEAN = ACTION_CALL_BEAN;

},{"../bower_components/core.js/library/fn/promise":2,"../opendolphin/build/opendolphin.js":65,"./polyfills.js":75,"./utils.js":76}],71:[function(_dereq_,module,exports){
exports.DOLPHIN_BEAN = 0;
exports.BYTE = 1;
exports.SHORT = 2;
exports.INT = 3;
exports.LONG = 4;
exports.FLOAT = 5;
exports.DOUBLE = 6;
exports.BOOLEAN = 7;
exports.STRING = 8;
exports.DATE = 9;
exports.ENUM = 10;

},{}],72:[function(_dereq_,module,exports){
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

_dereq_('./polyfills.js');
var Promise = _dereq_('../bower_components/core.js/library/fn/promise');
var Set = _dereq_('../bower_components/core.js/library/fn/set');
var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;

var ControllerProxy = _dereq_('./controllerproxy.js').ControllerProxy;

var SOURCE_SYSTEM = _dereq_('./connector.js').SOURCE_SYSTEM;
var SOURCE_SYSTEM_CLIENT = _dereq_('./connector.js').SOURCE_SYSTEM_CLIENT;
var ACTION_CALL_BEAN = _dereq_('./connector.js').ACTION_CALL_BEAN;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var REGISTER_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'registerController';
var CALL_CONTROLLER_ACTION_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'callControllerAction';
var DESTROY_CONTROLLER_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'destroyController';

var CONTROLLER_NAME = 'controllerName';
var CONTROLLER_ID = 'controllerId';
var MODEL = 'model';
var ACTION_NAME = 'actionName';
var ERROR_CODE = 'errorCode';
var PARAM_PREFIX = '_';


function ControllerManager(dolphin, classRepository, connector) {
    checkMethod('ControllerManager(dolphin, classRepository, connector)');
    checkParam(dolphin, 'dolphin');
    checkParam(classRepository, 'classRepository');
    checkParam(connector, 'connector');

    this.dolphin = dolphin;
    this.classRepository = classRepository;
    this.connector = connector;
    this.controllers = new Set();
}


ControllerManager.prototype.createController = function(name) {
    checkMethod('ControllerManager.createController(name)');
    checkParam(name, 'name');

    var self = this;
    var controllerId, modelId, model, controller;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            highlanderPM.findAttributeByPropertyName(CONTROLLER_NAME).setValue(name);
            self.connector.invoke(REGISTER_CONTROLLER_COMMAND_NAME).then(function() {
                controllerId = highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).getValue();
                modelId = highlanderPM.findAttributeByPropertyName(MODEL).getValue();
                model = self.classRepository.mapDolphinToBean(modelId);
                controller = new ControllerProxy(controllerId, model, self);
                self.controllers.add(controller);
                resolve(controller);
            });
        });
    });
};


ControllerManager.prototype.invokeAction = function(controllerId, actionName, params) {
    checkMethod('ControllerManager.invokeAction(controllerId, actionName, params)');
    checkParam(controllerId, 'controllerId');
    checkParam(actionName, 'actionName');

    var self = this;
    return new Promise(function(resolve, reject) {

        var attributes = [
            self.dolphin.attribute(SOURCE_SYSTEM, null, SOURCE_SYSTEM_CLIENT),
            self.dolphin.attribute(CONTROLLER_ID, null, controllerId),
            self.dolphin.attribute(ACTION_NAME, null, actionName),
            self.dolphin.attribute(ERROR_CODE)
        ];

        if (exists(params)) {
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    var param = self.classRepository.mapParamToDolphin(params[prop]);
                    attributes.push(self.dolphin.attribute(PARAM_PREFIX + prop, null, param, 'VALUE'));
                }
            }
        }

        var pm = self.dolphin.presentationModel.apply(self.dolphin, [null, ACTION_CALL_BEAN].concat(attributes));

        self.connector.invoke(CALL_CONTROLLER_ACTION_COMMAND_NAME, params).then(function() {
            var isError = pm.findAttributeByPropertyName(ERROR_CODE).getValue();
            if (isError) {
                reject(new Error("ControllerAction caused an error"));
            } else {
                resolve();
            }
            self.dolphin.deletePresentationModel(pm);
        });
    });
};


ControllerManager.prototype.destroyController = function(controller) {
    checkMethod('ControllerManager.destroyController(controller)');
    checkParam(controller, 'controller');

    var self = this;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            self.controllers.delete(controller);
            highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).setValue(controller.controllerId);
            self.connector.invoke(DESTROY_CONTROLLER_COMMAND_NAME).then(resolve);
        });
    });
};


ControllerManager.prototype.destroy = function() {
    var controllersCopy = this.controllers;
    var promises = [];
    this.controllers = new Set();
    controllersCopy.forEach(function (controller) {
        try {
            promises.push(controller.destroy());
        } catch (e) {
            // ignore
        }
    });
    return Promise.all(promises);
};



exports.ControllerManager = ControllerManager;

},{"../bower_components/core.js/library/fn/promise":2,"../bower_components/core.js/library/fn/set":3,"./connector.js":70,"./controllerproxy.js":73,"./polyfills.js":75,"./utils.js":76}],73:[function(_dereq_,module,exports){
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

_dereq_('./polyfills.js');
var Set = _dereq_('../bower_components/core.js/library/fn/set');
var utils = _dereq_('./utils.js');
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;



function ControllerProxy(controllerId, model, manager) {
    checkMethod('ControllerProxy(controllerId, model, manager)');
    checkParam(controllerId, 'controllerId');
    checkParam(model, 'model');
    checkParam(manager, 'manager');

    this.controllerId = controllerId;
    this.model = model;
    this.manager = manager;
    this.destroyed = false;
    this.onDestroyedHandlers = new Set();
}


ControllerProxy.prototype.invoke = function(name, params) {
    checkMethod('ControllerProxy.invoke(name, params)');
    checkParam(name, 'name');

    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    return this.manager.invokeAction(this.controllerId, name, params);
};


ControllerProxy.prototype.destroy = function() {
    if (this.destroyed) {
        throw new Error('The controller was already destroyed');
    }
    this.destroyed = true;
    this.onDestroyedHandlers.forEach(function(handler) {
        try {
            handler(this);
        } catch(e) {
            console.warn('An exception occurred while calling an onDestroyed-handler', e);
        }
    }, this);
    return this.manager.destroyController(this);
};


ControllerProxy.prototype.onDestroyed = function(handler) {
    checkMethod('ControllerProxy.onDestroyed(handler)');
    checkParam(handler, 'handler');

    var self = this;
    this.onDestroyedHandlers.add(handler);
    return {
        unsubscribe: function() {
            self.onDestroyedHandlers.delete(handler);
        }
    };
};



exports.ControllerProxy = ControllerProxy;

},{"../bower_components/core.js/library/fn/set":3,"./polyfills.js":75,"./utils.js":76}],74:[function(_dereq_,module,exports){
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

_dereq_('./polyfills.js');
var opendolphin = _dereq_('../opendolphin/build/opendolphin.js');

var utils = _dereq_('./utils.js');
var exists = utils.exists;
var checkMethod = utils.checkMethod;
var checkParam = utils.checkParam;
var Connector = _dereq_('./connector.js').Connector;
var BeanManager = _dereq_('./beanmanager.js').BeanManager;
var ClassRepository = _dereq_('./classrepo.js').ClassRepository;
var ControllerManager = _dereq_('./controllermanager.js').ControllerManager;
var ClientContext = _dereq_('./clientcontext.js').ClientContext;
var Codec = _dereq_('./codec.js').Codec;

exports.connect = function(url, config) {
    checkMethod('connect(url, config)');
    checkParam(url, 'url');

    var builder = opendolphin.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true);
    if (exists(config) && exists(config.errorHandler)) {
        builder.errorHandler(config.errorHandler);
    }
    var dolphin = builder.build();
    dolphin.clientConnector.transmitter.codec = Codec;

    var classRepository = new ClassRepository(dolphin);
    var beanManager = new BeanManager(classRepository);
    var connector = new Connector(url, dolphin, classRepository, config);
    var controllerManager = new ControllerManager(dolphin, classRepository, connector);

    return new ClientContext(dolphin, beanManager, controllerManager, connector);
};

},{"../opendolphin/build/opendolphin.js":65,"./beanmanager.js":66,"./classrepo.js":67,"./clientcontext.js":68,"./codec.js":69,"./connector.js":70,"./controllermanager.js":72,"./polyfills.js":75,"./utils.js":76}],75:[function(_dereq_,module,exports){
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


 ////////////////////
// Array.forEach()
////////////////////
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}



////////////////////
// Array.filter()
////////////////////
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}
},{}],76:[function(_dereq_,module,exports){
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

var exists = function(object) {
    return typeof object !== 'undefined' && object !== null;
};

module.exports.exists = exists;

module.exports.checkMethod = function(name) {
    checkMethodName = name;
};

module.exports.checkParam = function(param, parameterName) {
    if (!exists(param)) {
        throw new Error('The parameter ' + parameterName + ' is mandatory in ' + checkMethodName);
    }
};

},{}]},{},[74])(74)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2FuLWluc3RhbmNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZm9yLW9mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19tZXRhLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fbWljcm90YXNrLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXByb3RvLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190YXNrLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwib3BlbmRvbHBoaW4vYnVpbGQvb3BlbmRvbHBoaW4uanMiLCJzcmMvYmVhbm1hbmFnZXIuanMiLCJzcmMvY2xhc3NyZXBvLmpzIiwic3JjL2NsaWVudGNvbnRleHQuanMiLCJzcmMvY29kZWMuanMiLCJzcmMvY29ubmVjdG9yLmpzIiwic3JjL2NvbnN0YW50cy5qcyIsInNyYy9jb250cm9sbGVybWFuYWdlci5qcyIsInNyYy9jb250cm9sbGVycHJveHkuanMiLCJzcmMvZG9scGhpbi5qcyIsInNyYy9wb2x5ZmlsbHMuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDanZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDallBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLk1hcDsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYucHJvbWlzZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuU2V0OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXIsIElURVJBVE9SKXtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCcuL18nKVxuICAsIGhpZGUgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKVxuICAsIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBhbkluc3RhbmNlICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBkZWZpbmVkICAgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKVxuICAsIGZvck9mICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJylcbiAgLCBzdGVwICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgc2V0U3BlY2llcyAgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgZmFzdEtleSAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleVxuICAsIFNJWkUgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbih0aGF0LCBrZXkpe1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcbiAgaWYoaW5kZXggIT09ICdGJylyZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll9pID0gJC5jcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXQuX2YgPT0gZW50cnkpdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdC5fbCA9PSBlbnRyeSl0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgJ2ZvckVhY2gnKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpXG4gICAgICAgICAgLCBlbnRyeTtcbiAgICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKERFU0NSSVBUT1JTKSQuc2V0RGVzYyhDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBkZWZpbmVkKHRoaXNbU0laRV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcbiAgICAgICwgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYoZW50cnkpe1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYoIXRoYXQuX2YpdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT09ICdGJyl0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbihDLCBOQU1FLCBJU19NQVApe1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICB0aGlzLl90ID0gaXRlcmF0ZWQ7ICAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7IC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgLCBraW5kICA9IHRoYXQuX2tcbiAgICAgICAgLCBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpe1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJyAsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgZnJvbSAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWZyb20taXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICBpZihjbGFzc29mKHRoaXMpICE9IE5BTUUpdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICByZXR1cm4gZnJvbSh0aGlzKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fJylcbiAgLCBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIG1ldGEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCByZWRlZmluZUFsbCAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpXG4gICwgZm9yT2YgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIGFuSW5zdGFuY2UgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSBnbG9iYWxbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIGlmKCFERVNDUklQVE9SUyB8fCB0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGFyZ2V0LCBpdGVyYWJsZSl7XG4gICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSwgJ19jJyk7XG4gICAgICB0YXJnZXQuX2MgPSBuZXcgQmFzZTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0YXJnZXRbQURERVJdLCB0YXJnZXQpO1xuICAgIH0pO1xuICAgICQuZWFjaC5jYWxsKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcyx0b0pTT04nLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSloaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICBhbkluc3RhbmNlKHRoaXMsIEMsIEtFWSk7XG4gICAgICAgIGlmKCFJU19BRERFUiAmJiBJU19XRUFLICYmICFpc09iamVjdChhKSlyZXR1cm4gS0VZID09ICdnZXQnID8gdW5kZWZpbmVkIDogZmFsc2U7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9jW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIElTX0FEREVSID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKCdzaXplJyBpbiBwcm90bykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYy5zaXplO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GLCBPKTtcblxuICBpZighSVNfV0VBSyljb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuMC4zJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKXtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi9fJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL18nKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90byAgICAgICA9IHJlcXVpcmUoJy4vXycpLmdldFByb3RvXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fJykuc2V0RGVzY1xuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbnZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBwYXJlbnQsIGRvbWFpbiwgZm47XG4gIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXtcbiAgICBwcm9jZXNzLmRvbWFpbiA9IG51bGw7XG4gICAgcGFyZW50LmV4aXQoKTtcbiAgfVxuICB3aGlsZShoZWFkKXtcbiAgICBkb21haW4gPSBoZWFkLmRvbWFpbjtcbiAgICBmbiAgICAgPSBoZWFkLmZuO1xuICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICBmbigpOyAvLyA8LSBjdXJyZW50bHkgd2UgdXNlIGl0IG9ubHkgZm9yIFByb21pc2UgLSB0cnkgLyBjYXRjaCBub3QgcmVxdWlyZWRcbiAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICBoZWFkID0gaGVhZC5uZXh0O1xuICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbn07XG5cbi8vIE5vZGUuanNcbmlmKGlzTm9kZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG4vLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbn0gZWxzZSBpZihPYnNlcnZlcil7XG4gIHZhciB0b2dnbGUgPSAxXG4gICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9IC10b2dnbGU7XG4gIH07XG4vLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxufSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZsdXNoKTtcbiAgfTtcbi8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4vLyAtIHNldEltbWVkaWF0ZVxuLy8gLSBNZXNzYWdlQ2hhbm5lbFxuLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2Vcbi8vIC0gc2V0VGltZW91dFxufSBlbHNlIHtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXNhcChmbil7XG4gIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkLCBkb21haW46IGlzTm9kZSAmJiBwcm9jZXNzLmRvbWFpbn07XG4gIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgaWYoIWhlYWQpe1xuICAgIGhlYWQgPSB0YXNrO1xuICAgIG5vdGlmeSgpO1xuICB9IGxhc3QgPSB0YXNrO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwidmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjLCBzYWZlKXtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKXtcbiAgICBpZihzYWZlICYmIHRhcmdldFtrZXldKXRhcmdldFtrZXldID0gc3JjW2tleV07XG4gICAgZWxzZSBoaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIH0gcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7IiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGdldERlc2MgID0gcmVxdWlyZSgnLi9fJykuZ2V0RGVzY1xuICAsIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vX2N0eCcpKEZ1bmN0aW9uLmNhbGwsIGdldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY29yZSAgICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vXycpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciBDID0gY29yZVtLRVldO1xuICBpZihERVNDUklQVE9SUyAmJiBDICYmICFDW1NQRUNJRVNdKSQuc2V0RGVzYyhDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59OyIsInZhciBkZWYgPSByZXF1aXJlKCcuL18nKS5zZXREZXNjXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59OyIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywgRCl7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3IsIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwidmFyIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faW52b2tlJylcbiAgLCBodG1sICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19odG1sJylcbiAgLCBjZWwgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0bmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoTWVzc2FnZUNoYW5uZWwpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0bmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZihPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogICBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vXycpXG4gICwgTElCUkFSWSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNsYXNzb2YgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsICRleHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaXNPYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCAgICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKVxuICAsIGFuSW5zdGFuY2UgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJylcbiAgLCBmb3JPZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19mb3Itb2YnKVxuICAsIGZyb20gICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FycmF5LWZyb20taXRlcmFibGUnKVxuICAsIHNldFByb3RvICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldFxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIHRhc2sgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBtaWNyb3Rhc2sgICAgICAgICAgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKVxuICAsIFBST01JU0UgICAgICAgICAgICA9ICdQcm9taXNlJ1xuICAsIFR5cGVFcnJvciAgICAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsICRQcm9taXNlICAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIGlzTm9kZSAgICAgICAgICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgZW1wdHkgICAgICAgICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIEludGVybmFsLCBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG5cbnZhciB0ZXN0UmVzb2x2ZSA9IGZ1bmN0aW9uKHN1Yil7XG4gIHZhciB0ZXN0ID0gbmV3ICRQcm9taXNlKGVtcHR5KSwgcHJvbWlzZTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBmdW5jdGlvbihleGVjKXtcbiAgICBleGVjKGVtcHR5LCBlbXB0eSk7XG4gIH07XG4gIChwcm9taXNlID0gJFByb21pc2UucmVzb2x2ZSh0ZXN0KSlbJ2NhdGNoJ10oZW1wdHkpO1xuICByZXR1cm4gcHJvbWlzZSA9PT0gdGVzdDtcbn07XG5cbnZhciBVU0VfTkFUSVZFID0gZnVuY3Rpb24oKXtcbiAgdmFyIHdvcmtzID0gZmFsc2U7XG4gIHZhciBTdWJQcm9taXNlID0gZnVuY3Rpb24oeCl7XG4gICAgdmFyIHNlbGYgPSBuZXcgJFByb21pc2UoeCk7XG4gICAgc2V0UHJvdG8oc2VsZiwgU3ViUHJvbWlzZS5wcm90b3R5cGUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuICB0cnkge1xuICAgIHdvcmtzID0gJFByb21pc2UgJiYgJFByb21pc2UucmVzb2x2ZSAmJiB0ZXN0UmVzb2x2ZSgpO1xuICAgIHNldFByb3RvKFN1YlByb21pc2UsICRQcm9taXNlKTtcbiAgICBTdWJQcm9taXNlLnByb3RvdHlwZSA9ICQuY3JlYXRlKCRQcm9taXNlLnByb3RvdHlwZSwge2NvbnN0cnVjdG9yOiB7dmFsdWU6IFN1YlByb21pc2V9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFN1YlByb21pc2UucmVzb2x2ZSg1KS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIFN1YlByb21pc2UpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIFY4IDQuOC0gYnVnLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDE2MlxuICAgIGlmKHdvcmtzICYmIHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykpe1xuICAgICAgdmFyIHRoZW5hYmxlVGhlbkdvdHRlbiA9IGZhbHNlO1xuICAgICAgJFByb21pc2UucmVzb2x2ZSgkLnNldERlc2Moe30sICd0aGVuJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRoZW5hYmxlVGhlbkdvdHRlbiA9IHRydWU7IH1cbiAgICAgIH0pKTtcbiAgICAgIHdvcmtzID0gdGhlbmFibGVUaGVuR290dGVuO1xuICAgIH1cbiAgfSBjYXRjaChlKXsgd29ya3MgPSBmYWxzZTsgfVxuICByZXR1cm4gISF3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyB3aXRoIGxpYnJhcnkgd3JhcHBlciBzcGVjaWFsIGNhc2VcbiAgcmV0dXJuIGEgPT09IGIgfHwgYSA9PT0gJFByb21pc2UgJiYgYiA9PT0gV3JhcHBlcjtcbn07XG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgcmV0dXJuIHNhbWVDb25zdHJ1Y3RvcigkUHJvbWlzZSwgQylcbiAgICA/IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgIDogbmV3IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG52YXIgUHJvbWlzZUNhcGFiaWxpdHkgPSBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24oJCRyZXNvbHZlLCAkJHJlamVjdCl7XG4gICAgaWYocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCAgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocHJvbWlzZSwgaXNSZWplY3Qpe1xuICBpZihwcm9taXNlLl9uKXJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgb2sgICAgPSBwcm9taXNlLl9zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXtcbiAgICAgICAgICAgIGlmKHByb21pc2UuX2ggPT0gMilvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyID09PSB0cnVlID8gdmFsdWUgOiBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZihpc1JlamVjdCAmJiAhcHJvbWlzZS5faClvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgICAsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgICBpZihpc05vZGUpe1xuICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgfSBlbHNlIGlmKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3Ipe1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICB9IHByb21pc2UuX2ggPSAyO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2EgfHwgcHJvbWlzZS5fY1xuICAgICwgaSAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgaWYocHJvbWlzZS5faCA9PSAxKXJldHVybiBmYWxzZTtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3Rpb24gPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0aW9uLmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0aW9uLnByb21pc2UpKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZihpc05vZGUpe1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKXtcbiAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdn0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYoIXByb21pc2UuX2EpcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHByb21pc2UgPT09IHZhbHVlKXRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7X3c6IHByb21pc2UsIF9kOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe193OiBwcm9taXNlLCBfZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgICA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9hKXRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9zKW5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwcm9taXNlICA9IG5ldyBJbnRlcm5hbDtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogJFByb21pc2V9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlamVjdCAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFIHx8IHRlc3RSZXNvbHZlKHRydWUpKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mICRQcm9taXNlICYmIHNhbWVDb25zdHJ1Y3Rvcih4LmNvbnN0cnVjdG9yLCB0aGlzKSlyZXR1cm4geDtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWx1ZXMgICAgPSBmcm9tKGl0ZXJhYmxlKVxuICAgICAgICAsIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcbiAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xuICAgICAgaWYocmVtYWluaW5nKSQuZWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICBlbHNlIHJlc29sdmUocmVzdWx0cyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoJ1NldCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjIuMy4xIFNldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnTWFwJywge3RvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpfSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnU2V0Jywge3RvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ1NldCcpfSk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gICwgQXJyYXlWYWx1ZXMgICA9IEl0ZXJhdG9ycy5BcnJheTtcblxucmVxdWlyZSgnLi9fJykuZWFjaC5jYWxsKFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBmdW5jdGlvbihOQU1FKXtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEFycmF5VmFsdWVzO1xufSk7IiwidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEF0dHJpYnV0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEF0dHJpYnV0ZSgpIHtcbiAgICAgICAgfVxuICAgICAgICBBdHRyaWJ1dGUuUVVBTElGSUVSX1BST1BFUlRZID0gXCJxdWFsaWZpZXJcIjtcbiAgICAgICAgQXR0cmlidXRlLkRJUlRZX1BST1BFUlRZID0gXCJkaXJ0eVwiO1xuICAgICAgICBBdHRyaWJ1dGUuQkFTRV9WQUxVRSA9IFwiYmFzZVZhbHVlXCI7XG4gICAgICAgIEF0dHJpYnV0ZS5WQUxVRSA9IFwidmFsdWVcIjtcbiAgICAgICAgQXR0cmlidXRlLlRBRyA9IFwidGFnXCI7XG4gICAgICAgIHJldHVybiBBdHRyaWJ1dGU7XG4gICAgfSgpKTtcbiAgICBvcGVuZG9scGhpbi5BdHRyaWJ1dGUgPSBBdHRyaWJ1dGU7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBDb21tYW5kID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gQ29tbWFuZCgpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcImRvbHBoaW4tY29yZS1jb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENvbW1hbmQ7XG4gICAgfSgpKTtcbiAgICBvcGVuZG9scGhpbi5Db21tYW5kID0gQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFRhZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFRhZygpIHtcbiAgICAgICAgfVxuICAgICAgICAvL0ltcGxlbWVudGVkIGFzIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCBuZXZlciBiZSBjaGFuZ2VkIGZyb20gb3V0c2lkZVxuICAgICAgICAvKiogVGhlIGFjdHVhbCB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLiBUaGlzIGlzIHRoZSBkZWZhdWx0IGlmIG5vIHRhZyBpcyBnaXZlbi4qL1xuICAgICAgICBUYWcudmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJWQUxVRVwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogdGhlIHRvLWJlLWRpc3BsYXllZCBTdHJpbmcsIG5vdCB0aGUga2V5LiBJMThOIGhhcHBlbnMgb24gdGhlIHNlcnZlci4gKi9cbiAgICAgICAgVGFnLmxhYmVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTEFCRUxcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIElmIHRoZSBhdHRyaWJ1dGUgcmVwcmVzZW50IHRvb2x0aXAqKi9cbiAgICAgICAgVGFnLnRvb2x0aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJUT09MVElQXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiBcInRydWVcIiBvciBcImZhbHNlXCIsIG1hcHMgdG8gR3JhaWxzIGNvbnN0cmFpbnQgbnVsbGFibGU6ZmFsc2UgKi9cbiAgICAgICAgVGFnLm1hbmRhdG9yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIk1BTkRBVE9SWVwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogXCJ0cnVlXCIgb3IgXCJmYWxzZVwiLCBtYXBzIHRvIEdyYWlscyBjb25zdHJhaW50IGRpc3BsYXk6dHJ1ZSAqL1xuICAgICAgICBUYWcudmlzaWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlZJU0lCTEVcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIFwidHJ1ZVwiIG9yIFwiZmFsc2VcIiAqL1xuICAgICAgICBUYWcuZW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIkVOQUJMRURcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIHJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgbG9jYWwsIHN5bnRhY3RpY2FsIGNvbnN0cmFpbnRzIGxpa2UgaW4gXCJyZWplY3RGaWVsZFwiICovXG4gICAgICAgIFRhZy5yZWdleCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlJFR0VYXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiBhIHNpbmdsZSB0ZXh0OyBlLmcuIFwidGV4dEFyZWFcIiBpZiB0aGUgU3RyaW5nIHZhbHVlIHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gYSB0ZXh0IGFyZWEgaW5zdGVhZCBvZiBhIHRleHRGaWVsZCAqL1xuICAgICAgICBUYWcud2lkZ2V0SGludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIldJREdFVF9ISU5UXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiBhIHNpbmdsZSB0ZXh0OyBlLmcuIFwiamF2YS51dGlsLkRhdGVcIiBpZiB0aGUgdmFsdWUgU3RyaW5nIHJlcHJlc2VudHMgYSBkYXRlICovXG4gICAgICAgIFRhZy52YWx1ZVR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJWQUxVRV9UWVBFXCI7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBUYWc7XG4gICAgfSgpKTtcbiAgICBvcGVuZG9scGhpbi5UYWcgPSBUYWc7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlRhZy50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbiwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbihwbUlkLCBhdHRyaWJ1dGVJZCwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgcXVhbGlmaWVyLCB0YWcpIHtcbiAgICAgICAgICAgIGlmICh0YWcgPT09IHZvaWQgMCkgeyB0YWcgPSBvcGVuZG9scGhpbi5UYWcudmFsdWUoKTsgfVxuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWU7XG4gICAgICAgICAgICB0aGlzLm5ld1ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnF1YWxpZmllciA9IHF1YWxpZmllcjtcbiAgICAgICAgICAgIHRoaXMudGFnID0gdGFnO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdBdHRyaWJ1dGVDcmVhdGVkJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbjtcbiAgICB9KG9wZW5kb2xwaGluLkNvbW1hbmQpKTtcbiAgICBvcGVuZG9scGhpbi5BdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uID0gQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGVJZCwgbWV0YWRhdGFOYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgICAgICB0aGlzLm1ldGFkYXRhTmFtZSA9IG1ldGFkYXRhTmFtZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZDtcbiAgICB9KG9wZW5kb2xwaGluLkNvbW1hbmQpKTtcbiAgICBvcGVuZG9scGhpbi5BdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kID0gQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENhbGxOYW1lZEFjdGlvbkNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZChhY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uTmFtZSA9IGFjdGlvbk5hbWU7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0NhbGxOYW1lZEFjdGlvbic7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DYWxsTmFtZWRBY3Rpb25Db21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENhbGxOYW1lZEFjdGlvbkNvbW1hbmQ7XG4gICAgfShvcGVuZG9scGhpbi5Db21tYW5kKSk7XG4gICAgb3BlbmRvbHBoaW4uQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZCA9IENhbGxOYW1lZEFjdGlvbkNvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICAgICAgdGhpcy5tZXRhZGF0YU5hbWUgPSBtZXRhZGF0YU5hbWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0NoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQ7XG4gICAgfShvcGVuZG9scGhpbi5Db21tYW5kKSk7XG4gICAgb3BlbmRvbHBoaW4uQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kID0gQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRXZlbnRCdXMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBFdmVudEJ1cygpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIEV2ZW50QnVzLnByb3RvdHlwZS5vbkV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLnB1c2goZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnRCdXMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHsgcmV0dXJuIGhhbmRsZShldmVudCk7IH0pO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gRXZlbnRCdXM7XG4gICAgfSgpKTtcbiAgICBvcGVuZG9scGhpbi5FdmVudEJ1cyA9IEV2ZW50QnVzO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRBdHRyaWJ1dGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV2ZW50QnVzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJUYWcudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBwcmVzZW50YXRpb25Nb2RlbEluc3RhbmNlQ291bnQgPSAwOyAvLyB0b2RvIGRrOiBjb25zaWRlciBtYWtpbmcgdGhpcyBzdGF0aWMgaW4gY2xhc3NcbiAgICB2YXIgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChpZCwgcHJlc2VudGF0aW9uTW9kZWxUeXBlKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRTaWRlT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3VuZGVmaW5lZCcgJiYgaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaWQgPSAocHJlc2VudGF0aW9uTW9kZWxJbnN0YW5jZUNvdW50KyspLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmludmFsaWRCdXMgPSBuZXcgb3BlbmRvbHBoaW4uRXZlbnRCdXMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cyA9IG5ldyBvcGVuZG9scGhpbi5FdmVudEJ1cygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRvZG8gZGs6IGFsaWduIHdpdGggSmF2YSB2ZXJzaW9uOiBtb3ZlIHRvIENsaWVudERvbHBoaW4gYW5kIGF1dG8tYWRkIHRvIG1vZGVsIHN0b3JlXG4gICAgICAgIC8qKiBhIGNvcHkgY29uc3RydWN0b3IgZm9yIGFueXRoaW5nIGJ1dCBJRHMuIFBlciBkZWZhdWx0LCBjb3BpZXMgYXJlIGNsaWVudCBzaWRlIG9ubHksIG5vIGF1dG9tYXRpYyB1cGRhdGUgYXBwbGllcy4gKi9cbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IENsaWVudFByZXNlbnRhdGlvbk1vZGVsKG51bGwsIHRoaXMucHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgIHJlc3VsdC5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlQ29weSA9IGF0dHJpYnV0ZS5jb3B5KCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGVDb3B5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgLy9hZGQgYXJyYXkgb2YgYXR0cmlidXRlc1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuYWRkQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzIHx8IGF0dHJpYnV0ZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5hZGRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAodGhpcy5hdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZUFuZFRhZyhhdHRyaWJ1dGUucHJvcGVydHlOYW1lLCBhdHRyaWJ1dGUudGFnKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGFscmVhZHkgaXMgYW4gYXR0cmlidXRlIHdpdGggcHJvcGVydHkgbmFtZTogXCIgKyBhdHRyaWJ1dGUucHJvcGVydHlOYW1lXG4gICAgICAgICAgICAgICAgICAgICsgXCIgYW5kIHRhZzogXCIgKyBhdHRyaWJ1dGUudGFnICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpICYmIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHF1YWxpZmllcjogXCIgKyBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKClcbiAgICAgICAgICAgICAgICAgICAgKyBcIiBpbiBwcmVzZW50YXRpb24gbW9kZWwgd2l0aCBpZDogXCIgKyB0aGlzLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRQcmVzZW50YXRpb25Nb2RlbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlLnRhZyA9PSBvcGVuZG9scGhpbi5UYWcudmFsdWUoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbnZhbGlkQnVzLnRyaWdnZXIoeyBzb3VyY2U6IF90aGlzIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS51cGRhdGVEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlc1tpXS5pc0RpcnR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREaXJ0eSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlydHkoZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUudXBkYXRlQXR0cmlidXRlRGlydHluZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbaV0udXBkYXRlRGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmlzRGlydHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaXJ0eTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLnNldERpcnR5ID0gZnVuY3Rpb24gKGRpcnR5KSB7XG4gICAgICAgICAgICB2YXIgb2xkVmFsID0gdGhpcy5kaXJ0eTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBkaXJ0eTtcbiAgICAgICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkVmFsLCAnbmV3VmFsdWUnOiB0aGlzLmRpcnR5IH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlLnJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLnJlYmFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUucmViYXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLm9uRGlydHkgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUub25JbnZhbGlkYXRlZCA9IGZ1bmN0aW9uIChoYW5kbGVJbnZhbGlkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRCdXMub25FdmVudChoYW5kbGVJbnZhbGlkYXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIHJldHVybnMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBzdGF0ZSAqL1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2xpY2UoMCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5nZXRBdCA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUsIHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZyA9PT0gdm9pZCAwKSB7IHRhZyA9IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpOyB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWVBbmRUYWcocHJvcGVydHlOYW1lLCB0YWcpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lQW5kVGFnKHByb3BlcnR5TmFtZSwgb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCkpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZmluZEFsbEF0dHJpYnV0ZXNCeVByb3BlcnR5TmFtZSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGlmICghcHJvcGVydHlOYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUucHJvcGVydHlOYW1lID09IHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZUFuZFRhZyA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUsIHRhZykge1xuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUgfHwgIXRhZylcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLmF0dHJpYnV0ZXNbaV0ucHJvcGVydHlOYW1lID09IHByb3BlcnR5TmFtZSkgJiYgKHRoaXMuYXR0cmlidXRlc1tpXS50YWcgPT0gdGFnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZUJ5UXVhbGlmaWVyID0gZnVuY3Rpb24gKHF1YWxpZmllcikge1xuICAgICAgICAgICAgaWYgKCFxdWFsaWZpZXIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uZ2V0UXVhbGlmaWVyKCkgPT0gcXVhbGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgaWYgKCFpZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlc1tpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuc3luY1dpdGggPSBmdW5jdGlvbiAoc291cmNlUHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlQXR0cmlidXRlID0gc291cmNlUHJlc2VudGF0aW9uTW9kZWwuZ2V0QXQodGFyZ2V0QXR0cmlidXRlLnByb3BlcnR5TmFtZSwgdGFyZ2V0QXR0cmlidXRlLnRhZyk7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc3luY1dpdGgoc291cmNlQXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIENsaWVudFByZXNlbnRhdGlvbk1vZGVsO1xuICAgIH0oKSk7XG4gICAgb3BlbmRvbHBoaW4uQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwgPSBDbGllbnRQcmVzZW50YXRpb25Nb2RlbDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV2ZW50QnVzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJUYWcudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBDbGllbnRBdHRyaWJ1dGUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDbGllbnRBdHRyaWJ1dGUocHJvcGVydHlOYW1lLCBxdWFsaWZpZXIsIHZhbHVlLCB0YWcpIHtcbiAgICAgICAgICAgIGlmICh0YWcgPT09IHZvaWQgMCkgeyB0YWcgPSBvcGVuZG9scGhpbi5UYWcudmFsdWUoKTsgfVxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWU7XG4gICAgICAgICAgICB0aGlzLnRhZyA9IHRhZztcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcIlwiICsgKENsaWVudEF0dHJpYnV0ZS5jbGllbnRBdHRyaWJ1dGVJbnN0YW5jZUNvdW50KyspICsgXCJDXCI7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzID0gbmV3IG9wZW5kb2xwaGluLkV2ZW50QnVzKCk7XG4gICAgICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cyA9IG5ldyBvcGVuZG9scGhpbi5FdmVudEJ1cygpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzID0gbmV3IG9wZW5kb2xwaGluLkV2ZW50QnVzKCk7XG4gICAgICAgICAgICB0aGlzLmJhc2VWYWx1ZUNoYW5nZUJ1cyA9IG5ldyBvcGVuZG9scGhpbi5FdmVudEJ1cygpO1xuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldEJhc2VWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldFF1YWxpZmllcihxdWFsaWZpZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8qKiBhIGNvcHkgY29uc3RydWN0b3Igd2l0aCBuZXcgaWQgYW5kIG5vIHByZXNlbnRhdGlvbiBtb2RlbCAqL1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IENsaWVudEF0dHJpYnV0ZSh0aGlzLnByb3BlcnR5TmFtZSwgdGhpcy5nZXRRdWFsaWZpZXIoKSwgdGhpcy5nZXRWYWx1ZSgpLCB0aGlzLnRhZyk7XG4gICAgICAgICAgICByZXN1bHQuc2V0QmFzZVZhbHVlKHRoaXMuZ2V0QmFzZVZhbHVlKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5pc0RpcnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlydHk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0QmFzZVZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnNldFByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiWW91IGNhbiBub3Qgc2V0IGEgcHJlc2VudGF0aW9uIG1vZGVsIGZvciBhbiBhdHRyaWJ1dGUgdGhhdCBpcyBhbHJlYWR5IGJvdW5kLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWwgPSBwcmVzZW50YXRpb25Nb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5nZXRQcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB2ZXJpZmllZFZhbHVlID0gQ2xpZW50QXR0cmlidXRlLmNoZWNrVmFsdWUobmV3VmFsdWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gdmVyaWZpZWRWYWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZlcmlmaWVkVmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNldERpcnR5KHRoaXMuY2FsY3VsYXRlRGlydHkodGhpcy5iYXNlVmFsdWUsIHZlcmlmaWVkVmFsdWUpKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFZhbHVlLCAnbmV3VmFsdWUnOiB2ZXJpZmllZFZhbHVlIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmNhbGN1bGF0ZURpcnR5ID0gZnVuY3Rpb24gKGJhc2VWYWx1ZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChiYXNlVmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJhc2VWYWx1ZSAhPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS51cGRhdGVEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlydHkodGhpcy5jYWxjdWxhdGVEaXJ0eSh0aGlzLmJhc2VWYWx1ZSwgdGhpcy52YWx1ZSkpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnNldERpcnR5ID0gZnVuY3Rpb24gKGRpcnR5KSB7XG4gICAgICAgICAgICB2YXIgb2xkVmFsID0gdGhpcy5kaXJ0eTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBkaXJ0eTtcbiAgICAgICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkVmFsLCAnbmV3VmFsdWUnOiB0aGlzLmRpcnR5IH0pO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWwpXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbC51cGRhdGVEaXJ0eSgpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnNldFF1YWxpZmllciA9IGZ1bmN0aW9uIChuZXdRdWFsaWZpZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnF1YWxpZmllciA9PSBuZXdRdWFsaWZpZXIpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIG9sZFF1YWxpZmllciA9IHRoaXMucXVhbGlmaWVyO1xuICAgICAgICAgICAgdGhpcy5xdWFsaWZpZXIgPSBuZXdRdWFsaWZpZXI7XG4gICAgICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkUXVhbGlmaWVyLCAnbmV3VmFsdWUnOiBuZXdRdWFsaWZpZXIgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0UXVhbGlmaWVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVhbGlmaWVyO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnNldEJhc2VWYWx1ZSA9IGZ1bmN0aW9uIChiYXNlVmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2VWYWx1ZSA9PSBiYXNlVmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIG9sZEJhc2VWYWx1ZSA9IHRoaXMuYmFzZVZhbHVlO1xuICAgICAgICAgICAgdGhpcy5iYXNlVmFsdWUgPSBiYXNlVmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNldERpcnR5KHRoaXMuY2FsY3VsYXRlRGlydHkoYmFzZVZhbHVlLCB0aGlzLnZhbHVlKSk7XG4gICAgICAgICAgICB0aGlzLmJhc2VWYWx1ZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ29sZFZhbHVlJzogb2xkQmFzZVZhbHVlLCAnbmV3VmFsdWUnOiBiYXNlVmFsdWUgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUucmViYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRCYXNlVmFsdWUodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldERpcnR5KGZhbHNlKTsgLy8gdGhpcyBpcyBub3Qgc3VwZXJmbHVvdXMhXG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuYmFzZVZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlydHkoZmFsc2UpOyAvLyB0aGlzIGlzIG5vdCBzdXBlcmZsdW91cyFcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLmNoZWNrVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFN0cmluZyB8fCByZXN1bHQgaW5zdGFuY2VvZiBCb29sZWFuIHx8IHJlc3VsdCBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBDbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFuIEF0dHJpYnV0ZSBtYXkgbm90IGl0c2VsZiBjb250YWluIGFuIGF0dHJpYnV0ZSBhcyBhIHZhbHVlLiBBc3N1bWluZyB5b3UgZm9yZ290IHRvIGNhbGwgdmFsdWUuXCIpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuY2hlY2tWYWx1ZSh2YWx1ZS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLlNVUFBPUlRFRF9WQUxVRV9UWVBFUy5pbmRleE9mKHR5cGVvZiByZXN1bHQpID4gLTEgfHwgcmVzdWx0IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRyaWJ1dGUgdmFsdWVzIG9mIHRoaXMgdHlwZSBhcmUgbm90IGFsbG93ZWQ6IFwiICsgdHlwZW9mIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUub25WYWx1ZUNoYW5nZSA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyKHsgXCJvbGRWYWx1ZVwiOiB0aGlzLnZhbHVlLCBcIm5ld1ZhbHVlXCI6IHRoaXMudmFsdWUgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUub25RdWFsaWZpZXJDaGFuZ2UgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnF1YWxpZmllckNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUub25EaXJ0eSA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUub25CYXNlVmFsdWVDaGFuZ2UgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmJhc2VWYWx1ZUNoYW5nZUJ1cy5vbkV2ZW50KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuc3luY1dpdGggPSBmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIoc291cmNlQXR0cmlidXRlLmdldFF1YWxpZmllcigpKTsgLy8gc2VxdWVuY2UgaXMgaW1wb3J0YW50XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRCYXNlVmFsdWUoc291cmNlQXR0cmlidXRlLmdldEJhc2VWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlKHNvdXJjZUF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5TVVBQT1JURURfVkFMVUVfVFlQRVMgPSBbXCJzdHJpbmdcIiwgXCJudW1iZXJcIiwgXCJib29sZWFuXCJdO1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiBDbGllbnRBdHRyaWJ1dGU7XG4gICAgfSgpKTtcbiAgICBvcGVuZG9scGhpbi5DbGllbnRBdHRyaWJ1dGUgPSBDbGllbnRBdHRyaWJ1dGU7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFZhbHVlQ2hhbmdlZENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoVmFsdWVDaGFuZ2VkQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gVmFsdWVDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGVJZCwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgICAgIHRoaXMub2xkVmFsdWUgPSBvbGRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMubmV3VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcIlZhbHVlQ2hhbmdlZFwiO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uVmFsdWVDaGFuZ2VkQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBWYWx1ZUNoYW5nZWRDb21tYW5kO1xuICAgIH0ob3BlbmRvbHBoaW4uQ29tbWFuZCkpO1xuICAgIG9wZW5kb2xwaGluLlZhbHVlQ2hhbmdlZENvbW1hbmQgPSBWYWx1ZUNoYW5nZWRDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBOYW1lZENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoTmFtZWRDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBOYW1lZENvbW1hbmQobmFtZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gbmFtZTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLk5hbWVkQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBOYW1lZENvbW1hbmQ7XG4gICAgfShvcGVuZG9scGhpbi5Db21tYW5kKSk7XG4gICAgb3BlbmRvbHBoaW4uTmFtZWRDb21tYW5kID0gTmFtZWRDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBFbXB0eU5vdGlmaWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhFbXB0eU5vdGlmaWNhdGlvbiwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRW1wdHlOb3RpZmljYXRpb24oKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcIkVtcHR5XCI7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5FbXB0eU5vdGlmaWNhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFbXB0eU5vdGlmaWNhdGlvbjtcbiAgICB9KG9wZW5kb2xwaGluLkNvbW1hbmQpKTtcbiAgICBvcGVuZG9scGhpbi5FbXB0eU5vdGlmaWNhdGlvbiA9IEVtcHR5Tm90aWZpY2F0aW9uO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudENvbm5lY3Rvci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJWYWx1ZUNoYW5nZWRDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk5hbWVkQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFbXB0eU5vdGlmaWNhdGlvbi50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICAvKiogQSBCYXRjaGVyIHRoYXQgZG9lcyBubyBiYXRjaGluZyBidXQgbWVyZWx5IHRha2VzIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBxdWV1ZSBhcyB0aGUgc2luZ2xlIGl0ZW0gaW4gdGhlIGJhdGNoICovXG4gICAgdmFyIE5vQ29tbWFuZEJhdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOb0NvbW1hbmRCYXRjaGVyKCkge1xuICAgICAgICB9XG4gICAgICAgIE5vQ29tbWFuZEJhdGNoZXIucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKHF1ZXVlKSB7XG4gICAgICAgICAgICByZXR1cm4gW3F1ZXVlLnNoaWZ0KCldO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gTm9Db21tYW5kQmF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIG9wZW5kb2xwaGluLk5vQ29tbWFuZEJhdGNoZXIgPSBOb0NvbW1hbmRCYXRjaGVyO1xuICAgIC8qKiBBIGJhdGNoZXIgdGhhdCBiYXRjaGVzIHRoZSBibGluZHMgKGNvbW1hbmRzIHdpdGggbm8gY2FsbGJhY2spIGFuZCBvcHRpb25hbGx5IGFsc28gZm9sZHMgdmFsdWUgY2hhbmdlcyAqL1xuICAgIHZhciBCbGluZENvbW1hbmRCYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyoqIGZvbGRpbmc6IHdoZXRoZXIgd2Ugc2hvdWxkIHRyeSBmb2xkaW5nIFZhbHVlQ2hhbmdlZENvbW1hbmRzICovXG4gICAgICAgIGZ1bmN0aW9uIEJsaW5kQ29tbWFuZEJhdGNoZXIoZm9sZGluZywgbWF4QmF0Y2hTaXplKSB7XG4gICAgICAgICAgICBpZiAoZm9sZGluZyA9PT0gdm9pZCAwKSB7IGZvbGRpbmcgPSB0cnVlOyB9XG4gICAgICAgICAgICBpZiAobWF4QmF0Y2hTaXplID09PSB2b2lkIDApIHsgbWF4QmF0Y2hTaXplID0gNTA7IH1cbiAgICAgICAgICAgIHRoaXMuZm9sZGluZyA9IGZvbGRpbmc7XG4gICAgICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZSA9IG1heEJhdGNoU2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBCbGluZENvbW1hbmRCYXRjaGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uIChxdWV1ZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTmV4dCh0aGlzLm1heEJhdGNoU2l6ZSwgcXVldWUsIHJlc3VsdCk7IC8vIGRvIG5vdCBiYXRjaCBtb3JlIHRoYW4gdGhpcy5tYXhCYXRjaFNpemUgY29tbWFuZHMgdG8gYXZvaWQgc3RhY2sgb3ZlcmZsb3cgb24gcmVjdXJzaW9uLlxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcmVjdXJzaXZlIGltcGwgbWV0aG9kIHRvIHNpZGUtZWZmZWN0IGJvdGggcXVldWUgYW5kIGJhdGNoXG4gICAgICAgIEJsaW5kQ29tbWFuZEJhdGNoZXIucHJvdG90eXBlLnByb2Nlc3NOZXh0ID0gZnVuY3Rpb24gKG1heEJhdGNoU2l6ZSwgcXVldWUsIGJhdGNoKSB7XG4gICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoIDwgMSB8fCBtYXhCYXRjaFNpemUgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBjYW5kaWRhdGUgPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9sZGluZyAmJiBjYW5kaWRhdGUuY29tbWFuZCBpbnN0YW5jZW9mIG9wZW5kb2xwaGluLlZhbHVlQ2hhbmdlZENvbW1hbmQgJiYgKCFjYW5kaWRhdGUuaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBjYW5DbWQgPSBjYW5kaWRhdGUuY29tbWFuZDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhdGNoLmxlbmd0aCAmJiBmb3VuZCA9PSBudWxsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhdGNoW2ldLmNvbW1hbmQgaW5zdGFuY2VvZiBvcGVuZG9scGhpbi5WYWx1ZUNoYW5nZWRDb21tYW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmF0Y2hDbWQgPSBiYXRjaFtpXS5jb21tYW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbkNtZC5hdHRyaWJ1dGVJZCA9PSBiYXRjaENtZC5hdHRyaWJ1dGVJZCAmJiBiYXRjaENtZC5uZXdWYWx1ZSA9PSBjYW5DbWQub2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGJhdGNoQ21kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZC5uZXdWYWx1ZSA9IGNhbkNtZC5uZXdWYWx1ZTsgLy8gY2hhbmdlIGV4aXN0aW5nIHZhbHVlLCBkbyBub3QgYmF0Y2hcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJhdGNoLnB1c2goY2FuZGlkYXRlKTsgLy8gd2UgY2Fubm90IG1lcmdlLCBzbyBiYXRjaCB0aGUgY2FuZGlkYXRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYmF0Y2gucHVzaChjYW5kaWRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjYW5kaWRhdGUuaGFuZGxlciAmJlxuICAgICAgICAgICAgICAgICEoY2FuZGlkYXRlLmNvbW1hbmRbJ2NsYXNzTmFtZSddID09IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5OYW1lZENvbW1hbmRcIikgJiZcbiAgICAgICAgICAgICAgICAhKGNhbmRpZGF0ZS5jb21tYW5kWydjbGFzc05hbWUnXSA9PSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uRW1wdHlOb3RpZmljYXRpb25cIikgLy8gYW5kIG5vIHVua25vd24gY2xpZW50IHNpZGUgZWZmZWN0XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NOZXh0KG1heEJhdGNoU2l6ZSAtIDEsIHF1ZXVlLCBiYXRjaCk7IC8vIHRoZW4gd2UgY2FuIHByb2NlZWQgd2l0aCBiYXRjaGluZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQmxpbmRDb21tYW5kQmF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIG9wZW5kb2xwaGluLkJsaW5kQ29tbWFuZEJhdGNoZXIgPSBCbGluZENvbW1hbmRCYXRjaGVyO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ29kZWMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDb2RlYygpIHtcbiAgICAgICAgfVxuICAgICAgICBDb2RlYy5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gKGNvbW1hbmRzKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29tbWFuZHMpOyAvLyB0b2RvIGRrOiBsb29rIGZvciBwb3NzaWJsZSBBUEkgc3VwcG9ydCBmb3IgY2hhcmFjdGVyIGVuY29kaW5nXG4gICAgICAgIH07XG4gICAgICAgIENvZGVjLnByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbiAodHJhbnNtaXR0ZWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHJhbnNtaXR0ZWQgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0cmFuc21pdHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNtaXR0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBDb2RlYztcbiAgICB9KCkpO1xuICAgIG9wZW5kb2xwaGluLkNvZGVjID0gQ29kZWM7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFNpZ25hbENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoU2lnbmFsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gU2lnbmFsQ29tbWFuZChuYW1lKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uU2lnbmFsQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTaWduYWxDb21tYW5kO1xuICAgIH0ob3BlbmRvbHBoaW4uQ29tbWFuZCkpO1xuICAgIG9wZW5kb2xwaGluLlNpZ25hbENvbW1hbmQgPSBTaWduYWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRQcmVzZW50YXRpb25Nb2RlbC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRTaWRlT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxcIjtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcHJlc2VudGF0aW9uTW9kZWwuaWQ7XG4gICAgICAgICAgICB0aGlzLnBtVHlwZSA9IHByZXNlbnRhdGlvbk1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogYXR0ci5wcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBhdHRyLmlkLFxuICAgICAgICAgICAgICAgICAgICBxdWFsaWZpZXI6IGF0dHIuZ2V0UXVhbGlmaWVyKCksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyLmdldFZhbHVlKCksXG4gICAgICAgICAgICAgICAgICAgIHRhZzogYXR0ci50YWdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG4gICAgfShvcGVuZG9scGhpbi5Db21tYW5kKSk7XG4gICAgb3BlbmRvbHBoaW4uQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgTWFwID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gTWFwKCkge1xuICAgICAgICAgICAgdGhpcy5rZXlzID0gW107XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBNYXAucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGFpbnNLZXkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRhdGFbdGhpcy5rZXlzLmluZGV4T2Yoa2V5KV0gPSB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMua2V5cy5pbmRleE9mKGtleSldO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5zS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmtleXMuaW5kZXhPZihrZXkpO1xuICAgICAgICAgICAgICAgIHRoaXMua2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rZXlzLmxlbmd0aCA9PSAwO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmtleXMubGVuZ3RoO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKHRoaXMua2V5c1tpXSwgdGhpcy5kYXRhW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5jb250YWluc0tleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmtleXMuaW5kZXhPZihrZXkpID4gLTE7XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUuY29udGFpbnNWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5pbmRleE9mKHZhbHVlKSA+IC0xO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2xpY2UoMCk7XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUua2V5U2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5cy5zbGljZSgwKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIE1hcDtcbiAgICB9KCkpO1xuICAgIG9wZW5kb2xwaGluLk1hcCA9IE1hcDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIERlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbiwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbihwbVR5cGUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbVR5cGUgPSBwbVR5cGU7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0RlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGUnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBEZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uO1xuICAgIH0ob3BlbmRvbHBoaW4uQ29tbWFuZCkpO1xuICAgIG9wZW5kb2xwaGluLkRlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb24gPSBEZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uKHBtSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb247XG4gICAgfShvcGVuZG9scGhpbi5Db21tYW5kKSk7XG4gICAgb3BlbmRvbHBoaW4uRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uID0gRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRQcmVzZW50YXRpb25Nb2RlbC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnREb2xwaGluLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudENvbm5lY3Rvci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJWYWx1ZUNoYW5nZWRDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdHRyaWJ1dGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTWFwLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb24udHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXZlbnRCdXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIChmdW5jdGlvbiAoVHlwZSkge1xuICAgICAgICBUeXBlW1R5cGVbXCJBRERFRFwiXSA9ICdBRERFRCddID0gXCJBRERFRFwiO1xuICAgICAgICBUeXBlW1R5cGVbXCJSRU1PVkVEXCJdID0gJ1JFTU9WRUQnXSA9IFwiUkVNT1ZFRFwiO1xuICAgIH0pKG9wZW5kb2xwaGluLlR5cGUgfHwgKG9wZW5kb2xwaGluLlR5cGUgPSB7fSkpO1xuICAgIHZhciBUeXBlID0gb3BlbmRvbHBoaW4uVHlwZTtcbiAgICB2YXIgQ2xpZW50TW9kZWxTdG9yZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENsaWVudE1vZGVsU3RvcmUoY2xpZW50RG9scGhpbikge1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluID0gY2xpZW50RG9scGhpbjtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzID0gbmV3IG9wZW5kb2xwaGluLk1hcCgpO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlID0gbmV3IG9wZW5kb2xwaGluLk1hcCgpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVySWQgPSBuZXcgb3BlbmRvbHBoaW4uTWFwKCk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIgPSBuZXcgb3BlbmRvbHBoaW4uTWFwKCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsU3RvcmVDaGFuZ2VCdXMgPSBuZXcgb3BlbmRvbHBoaW4uRXZlbnRCdXMoKTtcbiAgICAgICAgfVxuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5nZXRDbGllbnREb2xwaGluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50RG9scGhpbjtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVnaXN0ZXJNb2RlbCA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIGlmIChtb2RlbC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb25uZWN0b3IgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCk7XG4gICAgICAgICAgICB2YXIgY3JlYXRlUE1Db21tYW5kID0gbmV3IG9wZW5kb2xwaGluLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChtb2RlbCk7XG4gICAgICAgICAgICBjb25uZWN0b3Iuc2VuZChjcmVhdGVQTUNvbW1hbmQsIG51bGwpO1xuICAgICAgICAgICAgbW9kZWwuZ2V0QXR0cmlidXRlcygpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnJlZ2lzdGVyQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVnaXN0ZXJBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVCeUlkKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2hlbmV2ZXIgYW4gYXR0cmlidXRlIGNoYW5nZXMgaXRzIHZhbHVlLCB0aGUgc2VydmVyIG5lZWRzIHRvIGJlIG5vdGlmaWVkXG4gICAgICAgICAgICAvLyBhbmQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgd2l0aCB0aGUgc2FtZSBxdWFsaWZpZXIgYXJlIGdpdmVuIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZShmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlQ2hhbmdlQ29tbWFuZCA9IG5ldyBvcGVuZG9scGhpbi5WYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZS5pZCwgZXZ0Lm9sZFZhbHVlLCBldnQubmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50Q29ubmVjdG9yKCkuc2VuZCh2YWx1ZUNoYW5nZUNvbW1hbmQsIG51bGwpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gX3RoaXMuZmluZEF0dHJpYnV0ZXNCeUZpbHRlcihmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHIgIT09IGF0dHJpYnV0ZSAmJiBhdHRyLmdldFF1YWxpZmllcigpID09IGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIuc2V0VmFsdWUoYXR0cmlidXRlLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGFsbCBhdHRyaWJ1dGVzIHdpdGggdGhlIHNhbWUgcXVhbGlmaWVyIHNob3VsZCBoYXZlIHRoZSBzYW1lIGJhc2UgdmFsdWVcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5vbkJhc2VWYWx1ZUNoYW5nZShmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VWYWx1ZUNoYW5nZUNvbW1hbmQgPSBuZXcgb3BlbmRvbHBoaW4uQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGF0dHJpYnV0ZS5pZCwgb3BlbmRvbHBoaW4uQXR0cmlidXRlLkJBU0VfVkFMVUUsIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKGJhc2VWYWx1ZUNoYW5nZUNvbW1hbmQsIG51bGwpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gX3RoaXMuZmluZEF0dHJpYnV0ZXNCeUZpbHRlcihmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHIgIT09IGF0dHJpYnV0ZSAmJiBhdHRyLmdldFF1YWxpZmllcigpID09IGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIuc2V0QmFzZVZhbHVlKGF0dHJpYnV0ZS5nZXRCYXNlVmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXR0cmlidXRlLm9uUXVhbGlmaWVyQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlQXR0ck1ldGFkYXRhQ21kID0gbmV3IG9wZW5kb2xwaGluLkNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChhdHRyaWJ1dGUuaWQsIG9wZW5kb2xwaGluLkF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFksIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKGNoYW5nZUF0dHJNZXRhZGF0YUNtZCwgbnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmNvbnRhaW5zS2V5KG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYWxyZWFkeSBpcyBhIFBNIHdpdGggaWQgXCIgKyBtb2RlbC5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuY29udGFpbnNWYWx1ZShtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5wdXQobW9kZWwuaWQsIG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ2V2ZW50VHlwZSc6IFR5cGUuQURERUQsICdjbGllbnRQcmVzZW50YXRpb25Nb2RlbCc6IG1vZGVsIH0pO1xuICAgICAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhZGRlZDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuY29udGFpbnNWYWx1ZShtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5yZW1vdmUobW9kZWwuaWQpO1xuICAgICAgICAgICAgICAgIG1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogVHlwZS5SRU1PVkVELCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgICAgICByZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQXR0cmlidXRlc0J5RmlsdGVyID0gZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgbW9kZWwpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKGF0dHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goYXR0cik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWxzKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLnB1dCh0eXBlLCBwcmVzZW50YXRpb25Nb2RlbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgaWYgKCFtb2RlbCB8fCAhKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnNwbGljZShwcmVzZW50YXRpb25Nb2RlbHMuaW5kZXhPZihtb2RlbCksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNlbnRhdGlvbk1vZGVscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUucmVtb3ZlKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5rZXlTZXQoKS5zbGljZSgwKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy52YWx1ZXMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmdldChpZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgICAgICBpZiAoIXR5cGUgfHwgIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5jb250YWluc0tleSh0eXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5kZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbE9mVHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5maW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChwbSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKHBtLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKG5ldyBvcGVuZG9scGhpbi5EZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uKHByZXNlbnRhdGlvbk1vZGVsVHlwZSksIHVuZGVmaW5lZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKG1vZGVsLCBub3RpZnkpIHtcbiAgICAgICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5vdGlmeSB8fCBtb2RlbC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKG5ldyBvcGVuZG9scGhpbi5EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24obW9kZWwuaWQpLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmNvbnRhaW5zS2V5KGlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8IHRoaXMuYXR0cmlidXRlc1BlcklkLmNvbnRhaW5zS2V5KGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5wdXQoYXR0cmlidXRlLmlkLCBhdHRyaWJ1dGUpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIXRoaXMuYXR0cmlidXRlc1BlcklkLmNvbnRhaW5zS2V5KGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5yZW1vdmUoYXR0cmlidXRlLmlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZUJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5nZXQoaWQpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5hZGRBdHRyaWJ1dGVCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIucHV0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSwgYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShhdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5zcGxpY2UoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLnJlbW92ZShhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyID0gZnVuY3Rpb24gKHF1YWxpZmllcikge1xuICAgICAgICAgICAgaWYgKCFxdWFsaWZpZXIgfHwgIXRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5jb250YWluc0tleShxdWFsaWZpZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQocXVhbGlmaWVyKS5zbGljZSgwKTsgLy8gc2xpY2UgaXMgdXNlZCB0byBjbG9uZSB0aGUgYXJyYXlcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUub25Nb2RlbFN0b3JlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUub25Nb2RlbFN0b3JlQ2hhbmdlRm9yVHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZnVuY3Rpb24gKHBtU3RvcmVFdmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChwbVN0b3JlRXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlID09IHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIocG1TdG9yZUV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIENsaWVudE1vZGVsU3RvcmU7XG4gICAgfSgpKTtcbiAgICBvcGVuZG9scGhpbi5DbGllbnRNb2RlbFN0b3JlID0gQ2xpZW50TW9kZWxTdG9yZTtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmFtZWRDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaWduYWxDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFbXB0eU5vdGlmaWNhdGlvbi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudE1vZGVsU3RvcmUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudENvbm5lY3Rvci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ2xpZW50RG9scGhpbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENsaWVudERvbHBoaW4oKSB7XG4gICAgICAgIH1cbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuc2V0Q2xpZW50Q29ubmVjdG9yID0gZnVuY3Rpb24gKGNsaWVudENvbm5lY3Rvcikge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IgPSBjbGllbnRDb25uZWN0b3I7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmdldENsaWVudENvbm5lY3RvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudENvbm5lY3RvcjtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIChjb21tYW5kTmFtZSwgb25GaW5pc2hlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChuZXcgb3BlbmRvbHBoaW4uTmFtZWRDb21tYW5kKGNvbW1hbmROYW1lKSwgb25GaW5pc2hlZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKHN1Y2Nlc3NIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5yZXNldChzdWNjZXNzSGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnNlbmRFbXB0eSA9IGZ1bmN0aW9uIChvbkZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZW5kKG5ldyBvcGVuZG9scGhpbi5FbXB0eU5vdGlmaWNhdGlvbigpLCBvbkZpbmlzaGVkKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gZmFjdG9yeSBtZXRob2QgZm9yIGF0dHJpYnV0ZXNcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuYXR0cmlidXRlID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSwgdGFnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IG9wZW5kb2xwaGluLkNsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUsIHRhZyk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGZhY3RvcnkgbWV0aG9kIGZvciBwcmVzZW50YXRpb24gbW9kZWxzXG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKGlkLCB0eXBlKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1vZGVsID0gbmV3IG9wZW5kb2xwaGluLkNsaWVudFByZXNlbnRhdGlvbk1vZGVsKGlkLCB0eXBlKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuYWRkKG1vZGVsKTtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuc2V0Q2xpZW50TW9kZWxTdG9yZSA9IGZ1bmN0aW9uIChjbGllbnRNb2RlbFN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudE1vZGVsU3RvcmUgPSBjbGllbnRNb2RlbFN0b3JlO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5nZXRDbGllbnRNb2RlbFN0b3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50TW9kZWxTdG9yZTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5saXN0UHJlc2VudGF0aW9uTW9kZWxzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlID0gZnVuY3Rpb24gKHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5nZXRBdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAobW9kZWxUb0RlbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWxUb0RlbGV0ZSwgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsT2ZUeXBlID0gZnVuY3Rpb24gKHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxPZlR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUudXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlQXR0cmlidXRlUXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUudXBkYXRlQXR0cmlidXRlUXVhbGlmaWVyID0gZnVuY3Rpb24gKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgaWYgKCFzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRBdHRyaWJ1dGUudGFnICE9IHNvdXJjZUF0dHJpYnV0ZS50YWcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gYXR0cmlidXRlcyB3aXRoIHNhbWUgcXVhbGlmaWVyIGFuZCB0YWdcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc2V0VmFsdWUoc291cmNlQXR0cmlidXRlLmdldFZhbHVlKCkpOyAvLyBzaG91bGQgYWx3YXlzIGhhdmUgdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc2V0QmFzZVZhbHVlKHNvdXJjZUF0dHJpYnV0ZS5nZXRCYXNlVmFsdWUoKSk7IC8vIGFuZCBzYW1lIGJhc2UgdmFsdWUgYW5kIHNvIGRpcnR5bmVzc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnRhZyA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCwgcHJvcGVydHlOYW1lLCB2YWx1ZSwgdGFnKSB7XG4gICAgICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gbmV3IG9wZW5kb2xwaGluLkNsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIG51bGwsIHZhbHVlLCB0YWcpO1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVUb01vZGVsKHByZXNlbnRhdGlvbk1vZGVsLCBjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudEF0dHJpYnV0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuYWRkQXR0cmlidXRlVG9Nb2RlbCA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCwgY2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5hZGRBdHRyaWJ1dGUoY2xpZW50QXR0cmlidXRlKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLnJlZ2lzdGVyQXR0cmlidXRlKGNsaWVudEF0dHJpYnV0ZSk7XG4gICAgICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChuZXcgb3BlbmRvbHBoaW4uQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbihwcmVzZW50YXRpb25Nb2RlbC5pZCwgY2xpZW50QXR0cmlidXRlLmlkLCBjbGllbnRBdHRyaWJ1dGUucHJvcGVydHlOYW1lLCBjbGllbnRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSwgY2xpZW50QXR0cmlidXRlLmdldFF1YWxpZmllcigpLCBjbGllbnRBdHRyaWJ1dGUudGFnKSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vLy8vLyBwdXNoIHN1cHBvcnQgLy8vLy8vL1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zdGFydFB1c2hMaXN0ZW5pbmcgPSBmdW5jdGlvbiAocHVzaEFjdGlvbk5hbWUsIHJlbGVhc2VBY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoTGlzdGVuZXIobmV3IG9wZW5kb2xwaGluLk5hbWVkQ29tbWFuZChwdXNoQWN0aW9uTmFtZSkpO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UmVsZWFzZUNvbW1hbmQobmV3IG9wZW5kb2xwaGluLlNpZ25hbENvbW1hbmQocmVsZWFzZUFjdGlvbk5hbWUpKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnN0b3BQdXNoTGlzdGVuaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQoZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ2xpZW50RG9scGhpbjtcbiAgICB9KCkpO1xuICAgIG9wZW5kb2xwaGluLkNsaWVudERvbHBoaW4gPSBDbGllbnREb2xwaGluO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kKHBtSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZDtcbiAgICB9KG9wZW5kb2xwaGluLkNvbW1hbmQpKTtcbiAgICBvcGVuZG9scGhpbi5QcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kID0gUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbihwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ1NhdmVkUHJlc2VudGF0aW9uTW9kZWwnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTYXZlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xuICAgIH0ob3BlbmRvbHBoaW4uQ29tbWFuZCkpO1xuICAgIG9wZW5kb2xwaGluLlNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gPSBTYXZlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRQcmVzZW50YXRpb25Nb2RlbC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJUYWcudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQocG1JZCwgcG1UeXBlLCBwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgbmV3VmFsdWUsIHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZyA9PT0gdm9pZCAwKSB7IHRhZyA9IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpOyB9XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLnBtVHlwZSA9IHBtVHlwZTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgdGhpcy5xdWFsaWZpZXIgPSBxdWFsaWZpZXI7XG4gICAgICAgICAgICB0aGlzLm5ld1ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnRhZyA9IHRhZztcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnSW5pdGlhbGl6ZUF0dHJpYnV0ZSc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5Jbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZDtcbiAgICB9KG9wZW5kb2xwaGluLkNvbW1hbmQpKTtcbiAgICBvcGVuZG9scGhpbi5Jbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZCA9IEluaXRpYWxpemVBdHRyaWJ1dGVDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKFN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHBtSWQsIHNvdXJjZVBtSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuc291cmNlUG1JZCA9IHNvdXJjZVBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ1N3aXRjaFByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG4gICAgfShvcGVuZG9scGhpbi5Db21tYW5kKSk7XG4gICAgb3BlbmRvbHBoaW4uU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kKHBtVHlwZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtVHlwZSA9IHBtVHlwZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZUNvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZDtcbiAgICB9KG9wZW5kb2xwaGluLkNvbW1hbmQpKTtcbiAgICBvcGVuZG9scGhpbi5EZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kID0gRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0RlbGV0ZVByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG4gICAgfShvcGVuZG9scGhpbi5Db21tYW5kKSk7XG4gICAgb3BlbmRvbHBoaW4uRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRGF0YUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGF0YUNvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIERhdGFDb21tYW5kKGRhdGEpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcIkRhdGFcIjtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRhdGFDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERhdGFDb21tYW5kO1xuICAgIH0ob3BlbmRvbHBoaW4uQ29tbWFuZCkpO1xuICAgIG9wZW5kb2xwaGluLkRhdGFDb21tYW5kID0gRGF0YUNvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kQmF0Y2hlci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29kZWMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNhbGxOYW1lZEFjdGlvbkNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudERvbHBoaW4udHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVmFsdWVDaGFuZ2VkQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRhdGFDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYW1lZENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNpZ25hbENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlRhZy50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENsaWVudENvbm5lY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENsaWVudENvbm5lY3Rvcih0cmFuc21pdHRlciwgY2xpZW50RG9scGhpbiwgc2xhY2tNUywgbWF4QmF0Y2hTaXplKSB7XG4gICAgICAgICAgICBpZiAoc2xhY2tNUyA9PT0gdm9pZCAwKSB7IHNsYWNrTVMgPSAwOyB9XG4gICAgICAgICAgICBpZiAobWF4QmF0Y2hTaXplID09PSB2b2lkIDApIHsgbWF4QmF0Y2hTaXplID0gNTA7IH1cbiAgICAgICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gW107XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRseVNlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHVzaEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMud2FpdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pdHRlciA9IHRyYW5zbWl0dGVyO1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluID0gY2xpZW50RG9scGhpbjtcbiAgICAgICAgICAgIHRoaXMuc2xhY2tNUyA9IHNsYWNrTVM7XG4gICAgICAgICAgICB0aGlzLmNvZGVjID0gbmV3IG9wZW5kb2xwaGluLkNvZGVjKCk7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3IG9wZW5kb2xwaGluLkJsaW5kQ29tbWFuZEJhdGNoZXIodHJ1ZSwgbWF4QmF0Y2hTaXplKTtcbiAgICAgICAgfVxuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldENvbW1hbmRCYXRjaGVyID0gZnVuY3Rpb24gKG5ld0JhdGNoZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZEJhdGNoZXIgPSBuZXdCYXRjaGVyO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldFB1c2hFbmFibGVkID0gZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLnNldFB1c2hMaXN0ZW5lciA9IGZ1bmN0aW9uIChuZXdMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5wdXNoTGlzdGVuZXIgPSBuZXdMaXN0ZW5lcjtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5zZXRSZWxlYXNlQ29tbWFuZCA9IGZ1bmN0aW9uIChuZXdDb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGVhc2VDb21tYW5kID0gbmV3Q29tbWFuZDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIChzdWNjZXNzSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy50cmFuc21pdHRlci5yZXNldChzdWNjZXNzSGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIChjb21tYW5kLCBvbkZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHsgY29tbWFuZDogY29tbWFuZCwgaGFuZGxlcjogb25GaW5pc2hlZCB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVNlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTsgLy8gdGhlcmUgaXMgbm90IHBvaW50IGluIHJlbGVhc2luZyBpZiB3ZSBkbyBub3Qgc2VuZCBhdG1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRvU2VuZE5leHQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5kb1NlbmROZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbW1hbmRRdWV1ZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHVzaEVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbnF1ZXVlUHVzaENvbW1hbmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBjbWRzQW5kSGFuZGxlcnMgPSB0aGlzLmNvbW1hbmRCYXRjaGVyLmJhdGNoKHRoaXMuY29tbWFuZFF1ZXVlKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNtZHNBbmRIYW5kbGVyc1tjbWRzQW5kSGFuZGxlcnMubGVuZ3RoIC0gMV0uaGFuZGxlcjtcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IGNtZHNBbmRIYW5kbGVycy5tYXAoZnVuY3Rpb24gKGNhaCkgeyByZXR1cm4gY2FoLmNvbW1hbmQ7IH0pO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pdHRlci50cmFuc21pdChjb21tYW5kcywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlcnZlciByZXNwb25zZTogW1wiICsgcmVzcG9uc2UubWFwKGl0ID0+IGl0LmlkKS5qb2luKFwiLCBcIikgKyBcIl0gXCIpO1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaGVkUE1zID0gW107XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG91Y2hlZCA9IF90aGlzLmhhbmRsZShjb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdWNoZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaGVkUE1zLnB1c2godG91Y2hlZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLm9uRmluaXNoZWQodG91Y2hlZFBNcyk7IC8vIHRvZG86IG1ha2UgdGhlbSB1bmlxdWU/XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZSBjYWxsOiBmZXRjaCB0aGUgbmV4dCBpbiBsaW5lIGJ1dCBhbGxvdyBhIGJpdCBvZiBzbGFjayBzdWNoIHRoYXRcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudCBldmVudHMgY2FuIGZpcmUsIHJlbmRlcmluZyBpcyBkb25lIGFuZCBjb21tYW5kcyBjYW4gYmF0Y2ggdXBcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmRvU2VuZE5leHQoKTsgfSwgX3RoaXMuc2xhY2tNUyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGUgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT0gXCJEYXRhXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVEYXRhQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxPZlR5cGVDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiVmFsdWVDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIlN3aXRjaFByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiSW5pdGlhbGl6ZUF0dHJpYnV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiU2F2ZWRQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbihjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNhbGxOYW1lZEFjdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2Fubm90IGhhbmRsZSwgdW5rbm93biBjb21tYW5kIFwiICsgY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVEYXRhQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVyQ29tbWFuZC5kYXRhO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSB0aGlzLmNsaWVudERvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnBtSWQpO1xuICAgICAgICAgICAgaWYgKCFtb2RlbClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZURlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsT2ZUeXBlQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxPZlR5cGUoc2VydmVyQ29tbWFuZC5wbVR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGEgcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnBtSWQgKyBcIiAga25vd24gdG8gdGhlIGNsaWVudC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gX3RoaXMuY2xpZW50RG9scGhpbi5hdHRyaWJ1dGUoYXR0ci5wcm9wZXJ0eU5hbWUsIGF0dHIucXVhbGlmaWVyLCBhdHRyLnZhbHVlLCBhdHRyLnRhZyA/IGF0dHIudGFnIDogb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRCYXNlVmFsdWUoYXR0ci5iYXNlVmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyLmlkICYmIGF0dHIuaWQubWF0Y2goXCIuKlMkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5pZCA9IGF0dHIuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2xpZW50UG0gPSBuZXcgb3BlbmRvbHBoaW4uQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoc2VydmVyQ29tbWFuZC5wbUlkLCBzZXJ2ZXJDb21tYW5kLnBtVHlwZSk7XG4gICAgICAgICAgICBjbGllbnRQbS5hZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQbS5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChjbGllbnRQbSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4udXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIoY2xpZW50UG0pO1xuICAgICAgICAgICAgY2xpZW50UG0udXBkYXRlQXR0cmlidXRlRGlydHluZXNzKCk7XG4gICAgICAgICAgICBjbGllbnRQbS51cGRhdGVEaXJ0eSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudFBtO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgICAgICBpZiAoIWNsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXR0cmlidXRlIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3QgdXBkYXRlIG9sZCB2YWx1ZSBcIiArIHNlcnZlckNvbW1hbmQub2xkVmFsdWUgKyBcIiB0byBuZXcgdmFsdWUgXCIgKyBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSA9PSBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm5vdGhpbmcgdG8gZG8uIG5ldyB2YWx1ZSA9PSBvbGQgdmFsdWVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBCZWxvdyB3YXMgdGhlIGNvZGUgdGhhdCB3b3VsZCBlbmZvcmNlIHRoYXQgdmFsdWUgY2hhbmdlcyBvbmx5IGFwcGVhciB3aGVuIHRoZSBwcm9wZXIgb2xkVmFsdWUgaXMgZ2l2ZW4uXG4gICAgICAgICAgICAvLyBXaGlsZSB0aGF0IHNlZW1lZCBhcHByb3ByaWF0ZSBhdCBmaXJzdCwgdGhlcmUgYXJlIGFjdHVhbGx5IHZhbGlkIGNvbW1hbmQgc2VxdWVuY2VzIHdoZXJlIHRoZSBvbGRWYWx1ZSBpcyBub3QgcHJvcGVybHkgc2V0LlxuICAgICAgICAgICAgLy8gV2UgbGVhdmUgdGhlIGNvbW1lbnRlZCBjb2RlIGluIHRoZSBjb2RlYmFzZSB0byBhbGxvdyBmb3IgbG9nZ2luZy9kZWJ1Z2dpbmcgc3VjaCBjYXNlcy5cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgaWYoY2xpZW50QXR0cmlidXRlLmdldFZhbHVlKCkgIT0gc2VydmVyQ29tbWFuZC5vbGRWYWx1ZSkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdHRyaWJ1dGUgd2l0aCBpZCBcIitzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkK1wiIGFuZCB2YWx1ZSBcIiArIGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpICtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIHdhcyBzZXQgdG8gdmFsdWUgXCIgKyBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlICsgXCIgZXZlbiB0aG91Z2ggdGhlIGNoYW5nZSB3YXMgYmFzZWQgb24gYW4gb3V0ZGF0ZWQgb2xkIHZhbHVlIG9mIFwiICsgc2VydmVyQ29tbWFuZC5vbGRWYWx1ZSk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRWYWx1ZShzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZVN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgc3dpdGNoUG0gPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgICAgIGlmICghc3dpdGNoUG0pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN3aXRjaCBtb2RlbCB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5wbUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3Qgc3dpdGNoLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzb3VyY2VQbSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnNvdXJjZVBtSWQpO1xuICAgICAgICAgICAgaWYgKCFzb3VyY2VQbSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic291cmNlIG1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnNvdXJjZVBtSWQgKyBcIiBub3QgZm91bmQsIGNhbm5vdCBzd2l0Y2guXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoUG0uc3luY1dpdGgoc291cmNlUG0pO1xuICAgICAgICAgICAgcmV0dXJuIHN3aXRjaFBtO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUluaXRpYWxpemVBdHRyaWJ1dGVDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBuZXcgb3BlbmRvbHBoaW4uQ2xpZW50QXR0cmlidXRlKHNlcnZlckNvbW1hbmQucHJvcGVydHlOYW1lLCBzZXJ2ZXJDb21tYW5kLnF1YWxpZmllciwgc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSwgc2VydmVyQ29tbWFuZC50YWcpO1xuICAgICAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQucXVhbGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXNDb3B5ID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyKHNlcnZlckNvbW1hbmQucXVhbGlmaWVyKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc0NvcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IGF0dHJpYnV0ZXNDb3B5LnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZShhdHRyLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlc0NvcHkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIuc2V0VmFsdWUoYXR0cmlidXRlLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgICAgICBpZiAoc2VydmVyQ29tbWFuZC5wbUlkKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbCA9IG5ldyBvcGVuZG9scGhpbi5DbGllbnRQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQsIHNlcnZlckNvbW1hbmQucG1UeXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChwcmVzZW50YXRpb25Nb2RlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uYWRkQXR0cmlidXRlVG9Nb2RlbChwcmVzZW50YXRpb25Nb2RlbCwgYXR0cmlidXRlKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi51cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllcihwcmVzZW50YXRpb25Nb2RlbCk7XG4gICAgICAgICAgICByZXR1cm4gcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICBpZiAoIXNlcnZlckNvbW1hbmQucG1JZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnBtSWQpO1xuICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHJlYmFzZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtb2RlbC5yZWJhc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIGlmICghc2VydmVyQ29tbWFuZC5wbUlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKHNlcnZlckNvbW1hbmQucG1JZCk7XG4gICAgICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtb2RlbCB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5wbUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3QgcmVzZXQuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9kZWwucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGVbc2VydmVyQ29tbWFuZC5tZXRhZGF0YU5hbWVdID0gc2VydmVyQ29tbWFuZC52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUNhbGxOYW1lZEFjdGlvbkNvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLnNlbmQoc2VydmVyQ29tbWFuZC5hY3Rpb25OYW1lLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICAvLy8vLy8vLy8vLy8vIHB1c2ggc3VwcG9ydCAvLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHVzaEVuYWJsZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHRoaXMud2FpdGluZylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHB1c2hMaXN0ZW5lciBpcyBzZXQ/XG4gICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9TZW5kTmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmVucXVldWVQdXNoQ29tbWFuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLndhaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaCh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogdGhpcy5wdXNoTGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgaGFuZGxlcjoge1xuICAgICAgICAgICAgICAgICAgICBvbkZpbmlzaGVkOiBmdW5jdGlvbiAobW9kZWxzKSB7IG1lLndhaXRpbmcgPSBmYWxzZTsgfSxcbiAgICAgICAgICAgICAgICAgICAgb25GaW5pc2hlZERhdGE6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndhaXRpbmcpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHJlbGVhc2VDb21tYW5kIGlzIHNldD9cbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXR0ZXIuc2lnbmFsKHRoaXMucmVsZWFzZUNvbW1hbmQpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ2xpZW50Q29ubmVjdG9yO1xuICAgIH0oKSk7XG4gICAgb3BlbmRvbHBoaW4uQ2xpZW50Q29ubmVjdG9yID0gQ2xpZW50Q29ubmVjdG9yO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEb2xwaGluQnVpbGRlci50c1wiLz5cbi8qKlxuICogSlMtZnJpZW5kbHkgZmFjYWRlIHRvIGF2b2lkIHRvbyBtYW55IGRlcGVuZGVuY2llcyBpbiBwbGFpbiBKUyBjb2RlLlxuICogVGhlIG5hbWUgb2YgdGhpcyBmaWxlIGlzIGFsc28gdXNlZCBmb3IgdGhlIGluaXRpYWwgbG9va3VwIG9mIHRoZVxuICogb25lIGphdmFzY3JpcHQgZmlsZSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgZG9scGhpbiBjb2RlLlxuICogQ2hhbmdpbmcgdGhlIG5hbWUgcmVxdWlyZXMgdGhlIGJ1aWxkIHN1cHBvcnQgYW5kIGFsbCB1c2Vyc1xuICogdG8gYmUgdXBkYXRlZCBhcyB3ZWxsLlxuICogRGllcmsgS29lbmlnXG4gKi9cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICAvLyBmYWN0b3J5IG1ldGhvZCBmb3IgdGhlIGluaXRpYWxpemVkIGRvbHBoaW5cbiAgICAvLyBEZXByZWNhdGVkICEgVXNlICdtYWtlRG9scGhpbigpIGluc3RlYWRcbiAgICBmdW5jdGlvbiBkb2xwaGluKHVybCwgcmVzZXQsIHNsYWNrTVMpIHtcbiAgICAgICAgaWYgKHNsYWNrTVMgPT09IHZvaWQgMCkgeyBzbGFja01TID0gMzAwOyB9XG4gICAgICAgIHJldHVybiBtYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KHJlc2V0KS5zbGFja01TKHNsYWNrTVMpLmJ1aWxkKCk7XG4gICAgfVxuICAgIG9wZW5kb2xwaGluLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgIC8vIGZhY3RvcnkgbWV0aG9kIHRvIGJ1aWxkIGFuIGluaXRpYWxpemVkIGRvbHBoaW5cbiAgICBmdW5jdGlvbiBtYWtlRG9scGhpbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBvcGVuZG9scGhpbi5Eb2xwaGluQnVpbGRlcigpO1xuICAgIH1cbiAgICBvcGVuZG9scGhpbi5tYWtlRG9scGhpbiA9IG1ha2VEb2xwaGluO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNpZ25hbENvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50Q29ubmVjdG9yLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIC8qKlxuICAgICAqIEEgdHJhbnNtaXR0ZXIgdGhhdCBpcyBub3QgdHJhbnNtaXR0aW5nIGF0IGFsbC5cbiAgICAgKiBJdCBtYXkgc2VydmUgYXMgYSBzdGFuZC1pbiB3aGVuIG5vIHJlYWwgdHJhbnNtaXR0ZXIgaXMgbmVlZGVkLlxuICAgICAqL1xuICAgIHZhciBOb1RyYW5zbWl0dGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gTm9UcmFuc21pdHRlcigpIHtcbiAgICAgICAgfVxuICAgICAgICBOb1RyYW5zbWl0dGVyLnByb3RvdHlwZS50cmFuc21pdCA9IGZ1bmN0aW9uIChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIHNwZWNpYWxcbiAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgIH07XG4gICAgICAgIE5vVHJhbnNtaXR0ZXIucHJvdG90eXBlLnNpZ25hbCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIH07XG4gICAgICAgIE5vVHJhbnNtaXR0ZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKHN1Y2Nlc3NIYW5kbGVyKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBOb1RyYW5zbWl0dGVyO1xuICAgIH0oKSk7XG4gICAgb3BlbmRvbHBoaW4uTm9UcmFuc21pdHRlciA9IE5vVHJhbnNtaXR0ZXI7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2lnbmFsQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRDb25uZWN0b3IudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29kZWMudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEh0dHBUcmFuc21pdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEh0dHBUcmFuc21pdHRlcih1cmwsIHJlc2V0LCBjaGFyc2V0LCBlcnJvckhhbmRsZXIsIHN1cHBvcnRDT1JTKSB7XG4gICAgICAgICAgICBpZiAocmVzZXQgPT09IHZvaWQgMCkgeyByZXNldCA9IHRydWU7IH1cbiAgICAgICAgICAgIGlmIChjaGFyc2V0ID09PSB2b2lkIDApIHsgY2hhcnNldCA9IFwiVVRGLThcIjsgfVxuICAgICAgICAgICAgaWYgKGVycm9ySGFuZGxlciA9PT0gdm9pZCAwKSB7IGVycm9ySGFuZGxlciA9IG51bGw7IH1cbiAgICAgICAgICAgIGlmIChzdXBwb3J0Q09SUyA9PT0gdm9pZCAwKSB7IHN1cHBvcnRDT1JTID0gZmFsc2U7IH1cbiAgICAgICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICAgICAgdGhpcy5jaGFyc2V0ID0gY2hhcnNldDtcbiAgICAgICAgICAgIHRoaXMuSHR0cENvZGVzID0ge1xuICAgICAgICAgICAgICAgIGZpbmlzaGVkOiA0LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IDIwMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICAgICAgdGhpcy5zdXBwb3J0Q09SUyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICAgICAgdGhpcy5odHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB0aGlzLnNpZyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3VwcG9ydENPUlMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB0aGlzLmh0dHApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7IC8vIE5PVEU6IGRvaW5nIHRoaXMgZm9yIG5vbiBDT1JTIHJlcXVlc3RzIGhhcyBubyBpbXBhY3RcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaWcud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvZGVjID0gbmV3IG9wZW5kb2xwaGluLkNvZGVjKCk7XG4gICAgICAgICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSHR0cFRyYW5zbWl0dGVyLmludmFsaWRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2UgQ2xpZW50RG9scGhpbi5yZXNldChPblN1Y2Nlc3NIYW5kbGVyKSBpbnN0ZWFkJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS50cmFuc21pdCA9IGZ1bmN0aW9uIChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5odHRwLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlRXJyb3IoJ29uZXJyb3InLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmh0dHAucmVhZHlTdGF0ZSA9PSBfdGhpcy5IdHRwQ29kZXMuZmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmh0dHAuc3RhdHVzID09IF90aGlzLkh0dHBDb2Rlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VUZXh0ID0gX3RoaXMuaHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlQ29tbWFuZHMgPSBfdGhpcy5jb2RlYy5kZWNvZGUocmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKHJlc3BvbnNlQ29tbWFuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXJyZWQgcGFyc2luZyByZXNwb25zZVRleHQ6IFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluY29ycmVjdCByZXNwb25zZVRleHQ6IFwiLCByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlcjogSW5jb3JyZWN0IHJlc3BvbnNlVGV4dDogXCIgKyByZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBlbXB0eSByZXNwb25zZVRleHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb25lKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBIVFRQIFN0YXR1cyAhPSAyMDBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICAgICAgaWYgKFwib3ZlcnJpZGVNaW1lVHlwZVwiIGluIHRoaXMuaHR0cCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaHR0cC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1cIiArIHRoaXMuY2hhcnNldCk7IC8vIHRvZG8gbWFrZSBpbmplY3RhYmxlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmh0dHAuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShjb21tYW5kcykpO1xuICAgICAgICB9O1xuICAgICAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLmhhbmRsZUVycm9yID0gZnVuY3Rpb24gKGtpbmQsIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHZhciBlcnJvckV2ZW50ID0geyBraW5kOiBraW5kLCB1cmw6IHRoaXMudXJsLCBodHRwU3RhdHVzOiB0aGlzLmh0dHAuc3RhdHVzLCBtZXNzYWdlOiBtZXNzYWdlIH07XG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlcihlcnJvckV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnJvckV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS5zaWduYWwgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5zaWcub3BlbignUE9TVCcsIHRoaXMudXJsLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc2lnLnNlbmQodGhpcy5jb2RlYy5lbmNvZGUoW2NvbW1hbmRdKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIERlcHJlY2F0ZWQgISBVc2UgJ3Jlc2V0KE9uU3VjY2Vzc0hhbmRsZXIpIGluc3RlYWRcbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCArICdpbnZhbGlkYXRlPycsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5zZW5kKCk7XG4gICAgICAgIH07XG4gICAgICAgIEh0dHBUcmFuc21pdHRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoc3VjY2Vzc0hhbmRsZXIpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5odHRwLnJlYWR5U3RhdGUgPT0gX3RoaXMuSHR0cENvZGVzLmZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5odHRwLnN0YXR1cyA9PSBfdGhpcy5IdHRwQ29kZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc0hhbmRsZXIub25TdWNjZXNzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignYXBwbGljYXRpb24nLCBcIkh0dHBUcmFuc21pdHRlci5yZXNldCgpOiBIVFRQIFN0YXR1cyAhPSAyMDBcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCArICdpbnZhbGlkYXRlPycsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5odHRwLnNlbmQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEh0dHBUcmFuc21pdHRlcjtcbiAgICB9KCkpO1xuICAgIG9wZW5kb2xwaGluLkh0dHBUcmFuc21pdHRlciA9IEh0dHBUcmFuc21pdHRlcjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50RG9scGhpbi50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJPcGVuRG9scGhpbi50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRDb25uZWN0b3IudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50TW9kZWxTdG9yZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOb1RyYW5zbWl0dGVyLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkh0dHBUcmFuc21pdHRlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRBdHRyaWJ1dGUudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIERvbHBoaW5CdWlsZGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gRG9scGhpbkJ1aWxkZXIoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0XyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zbGFja01TXyA9IDMwMDtcbiAgICAgICAgICAgIHRoaXMubWF4QmF0Y2hTaXplXyA9IDUwO1xuICAgICAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUudXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgdGhpcy51cmxfID0gdXJsO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIChyZXNldCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldF8gPSByZXNldDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuc2xhY2tNUyA9IGZ1bmN0aW9uIChzbGFja01TKSB7XG4gICAgICAgICAgICB0aGlzLnNsYWNrTVNfID0gc2xhY2tNUztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUubWF4QmF0Y2hTaXplID0gZnVuY3Rpb24gKG1heEJhdGNoU2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5tYXhCYXRjaFNpemVfID0gbWF4QmF0Y2hTaXplO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5zdXBwb3J0Q09SUyA9IGZ1bmN0aW9uIChzdXBwb3J0Q09SUykge1xuICAgICAgICAgICAgdGhpcy5zdXBwb3J0Q09SU18gPSBzdXBwb3J0Q09SUztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKGVycm9ySGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5lcnJvckhhbmRsZXJfID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIERvbHBoaW5CdWlsZGVyLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT3BlbkRvbHBoaW4ganMgZm91bmRcIik7XG4gICAgICAgICAgICB2YXIgY2xpZW50RG9scGhpbiA9IG5ldyBvcGVuZG9scGhpbi5DbGllbnREb2xwaGluKCk7XG4gICAgICAgICAgICB2YXIgdHJhbnNtaXR0ZXI7XG4gICAgICAgICAgICBpZiAodGhpcy51cmxfICE9IG51bGwgJiYgdGhpcy51cmxfLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBvcGVuZG9scGhpbi5IdHRwVHJhbnNtaXR0ZXIodGhpcy51cmxfLCB0aGlzLnJlc2V0XywgXCJVVEYtOFwiLCB0aGlzLmVycm9ySGFuZGxlcl8sIHRoaXMuc3VwcG9ydENPUlNfKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zbWl0dGVyID0gbmV3IG9wZW5kb2xwaGluLk5vVHJhbnNtaXR0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50Q29ubmVjdG9yKG5ldyBvcGVuZG9scGhpbi5DbGllbnRDb25uZWN0b3IodHJhbnNtaXR0ZXIsIGNsaWVudERvbHBoaW4sIHRoaXMuc2xhY2tNU18sIHRoaXMubWF4QmF0Y2hTaXplXykpO1xuICAgICAgICAgICAgY2xpZW50RG9scGhpbi5zZXRDbGllbnRNb2RlbFN0b3JlKG5ldyBvcGVuZG9scGhpbi5DbGllbnRNb2RlbFN0b3JlKGNsaWVudERvbHBoaW4pKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50RG9scGhpbiBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgICAgIHJldHVybiBjbGllbnREb2xwaGluO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gRG9scGhpbkJ1aWxkZXI7XG4gICAgfSgpKTtcbiAgICBvcGVuZG9scGhpbi5Eb2xwaGluQnVpbGRlciA9IERvbHBoaW5CdWlsZGVyO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgR2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEdldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gR2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHBtSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnR2V0UHJlc2VudGF0aW9uTW9kZWwnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uR2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEdldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbiAgICB9KG9wZW5kb2xwaGluLkNvbW1hbmQpKTtcbiAgICBvcGVuZG9scGhpbi5HZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSBHZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBSZXNldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhSZXNldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gUmVzZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQocG1JZCkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtSWQgPSBwbUlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdSZXNldFByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlJlc2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlc2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xuICAgIH0ob3BlbmRvbHBoaW4uQ29tbWFuZCkpO1xuICAgIG9wZW5kb2xwaGluLlJlc2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gUmVzZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBNYXAgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbnZhciBleGlzdHMgPSB1dGlscy5leGlzdHM7XG52YXIgY2hlY2tNZXRob2QgPSB1dGlscy5jaGVja01ldGhvZDtcbnZhciBjaGVja1BhcmFtID0gdXRpbHMuY2hlY2tQYXJhbTtcblxuXG5mdW5jdGlvbiBCZWFuTWFuYWdlcihjbGFzc1JlcG9zaXRvcnkpIHtcbiAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KScpO1xuICAgIGNoZWNrUGFyYW0oY2xhc3NSZXBvc2l0b3J5LCAnY2xhc3NSZXBvc2l0b3J5Jyk7XG5cbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeSA9IGNsYXNzUmVwb3NpdG9yeTtcbiAgICB0aGlzLmFkZGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5yZW1vdmVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy51cGRhdGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5hcnJheVVwZGF0ZWRIYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmFsbEFkZGVkSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLmFsbFJlbW92ZWRIYW5kbGVycyA9IFtdO1xuICAgIHRoaXMuYWxsVXBkYXRlZEhhbmRsZXJzID0gW107XG4gICAgdGhpcy5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IFtdO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQmVhbkFkZGVkKGZ1bmN0aW9uKHR5cGUsIGJlYW4pIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFsbEFkZGVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25CZWFuQWRkZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKGZ1bmN0aW9uKHR5cGUsIGJlYW4pIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkJlYW5SZW1vdmVkLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5VcGRhdGUoZnVuY3Rpb24odHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblVwZGF0ZS1oYW5kbGVyIGZvciB0eXBlJywgdHlwZSwgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYSBnZW5lcmFsIG9uQmVhblVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm9uQXJyYXlVcGRhdGUoZnVuY3Rpb24odHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKSB7XG4gICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkFycmF5VXBkYXRlLWhhbmRsZXIgZm9yIHR5cGUnLCB0eXBlLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgbmV3RWxlbWVudHMpO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhIGdlbmVyYWwgb25BcnJheVVwZGF0ZS1oYW5kbGVyJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm5vdGlmeUJlYW5DaGFuZ2UgPSBmdW5jdGlvbihiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUJlYW5DaGFuZ2UoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSknKTtcbiAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG4gICAgY2hlY2tQYXJhbShwcm9wZXJ0eU5hbWUsICdwcm9wZXJ0eU5hbWUnKTtcblxuICAgIHJldHVybiB0aGlzLmNsYXNzUmVwb3NpdG9yeS5ub3RpZnlCZWFuQ2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUubm90aWZ5QXJyYXlDaGFuZ2UgPSBmdW5jdGlvbihiZWFuLCBwcm9wZXJ0eU5hbWUsIGluZGV4LCBjb3VudCwgcmVtb3ZlZEVsZW1lbnRzKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG4gICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgY2hlY2tQYXJhbShjb3VudCwgJ2NvdW50Jyk7XG4gICAgY2hlY2tQYXJhbShyZW1vdmVkRWxlbWVudHMsICdyZW1vdmVkRWxlbWVudHMnKTtcblxuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuaXNNYW5hZ2VkID0gZnVuY3Rpb24oYmVhbikge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5pc01hbmFnZWQoYmVhbiknKTtcbiAgICBjaGVja1BhcmFtKGJlYW4sICdiZWFuJyk7XG5cbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5pc01hbmFnZWQoKSBbRFAtN11cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24odHlwZSkge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5jcmVhdGUodHlwZSknKTtcbiAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG5cbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5jcmVhdGUoKSBbRFAtN11cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odHlwZSwgYmVhbikge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5hZGQodHlwZSwgYmVhbiknKTtcbiAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuXG4gICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uYWRkKCkgW0RQLTddXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLmFkZEFsbCA9IGZ1bmN0aW9uKHR5cGUsIGNvbGxlY3Rpb24pIHtcbiAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIuYWRkQWxsKHR5cGUsIGNvbGxlY3Rpb24pJyk7XG4gICAgY2hlY2tQYXJhbSh0eXBlLCAndHlwZScpO1xuICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZEFsbCgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihiZWFuKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZShiZWFuKScpO1xuICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZSgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLnJlbW92ZUFsbChjb2xsZWN0aW9uKScpO1xuICAgIGNoZWNrUGFyYW0oY29sbGVjdGlvbiwgJ2NvbGxlY3Rpb24nKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUFsbCgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVJZiA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5yZW1vdmVJZihwcmVkaWNhdGUpJyk7XG4gICAgY2hlY2tQYXJhbShwcmVkaWNhdGUsICdwcmVkaWNhdGUnKTtcblxuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLnJlbW92ZUlmKCkgW0RQLTddXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm9uQWRkZWQgPSBmdW5jdGlvbih0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25BZGRlZChldmVudEhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzID0gc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQWRkZWQodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuYWRkZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm9uUmVtb3ZlZCA9IGZ1bmN0aW9uKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vblJlbW92ZWQoZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKGV2ZW50SGFuZGxlciwgJ2V2ZW50SGFuZGxlcicpO1xuXG4gICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzID0gc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMgPSBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uUmVtb3ZlZCh0eXBlLCBldmVudEhhbmRsZXIpJyk7XG4gICAgICAgIGNoZWNrUGFyYW0odHlwZSwgJ3R5cGUnKTtcbiAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYucmVtb3ZlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbW92ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5vbkJlYW5VcGRhdGUgPSBmdW5jdGlvbih0eXBlLCBldmVudEhhbmRsZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFleGlzdHMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICBldmVudEhhbmRsZXIgPSB0eXBlO1xuICAgICAgICBjaGVja01ldGhvZCgnQmVhbk1hbmFnZXIub25CZWFuVXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkJlYW5VcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi51cGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUub25BcnJheVVwZGF0ZSA9IGZ1bmN0aW9uKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgIGNoZWNrTWV0aG9kKCdCZWFuTWFuYWdlci5vbkFycmF5VXBkYXRlKGV2ZW50SGFuZGxlciknKTtcbiAgICAgICAgY2hlY2tQYXJhbShldmVudEhhbmRsZXIsICdldmVudEhhbmRsZXInKTtcblxuICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFsbEFycmF5VXBkYXRlZEhhbmRsZXJzID0gc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2tNZXRob2QoJ0JlYW5NYW5hZ2VyLm9uQXJyYXlVcGRhdGUodHlwZSwgZXZlbnRIYW5kbGVyKScpO1xuICAgICAgICBjaGVja1BhcmFtKHR5cGUsICd0eXBlJyk7XG4gICAgICAgIGNoZWNrUGFyYW0oZXZlbnRIYW5kbGVyLCAnZXZlbnRIYW5kbGVyJyk7XG5cbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmFycmF5VXBkYXRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5jb25jYXQoZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5cblxuZXhwb3J0cy5CZWFuTWFuYWdlciA9IEJlYW5NYW5hZ2VyOyIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgUGxhdGZvcm0sIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIE1hcCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCcpO1xudmFyIG9wZW5kb2xwaGluID0gcmVxdWlyZSgnLi4vb3BlbmRvbHBoaW4vYnVpbGQvb3BlbmRvbHBoaW4uanMnKTtcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcbnZhciBleGlzdHMgPSB1dGlscy5leGlzdHM7XG52YXIgY2hlY2tNZXRob2QgPSB1dGlscy5jaGVja01ldGhvZDtcbnZhciBjaGVja1BhcmFtID0gdXRpbHMuY2hlY2tQYXJhbTtcblxudmFyIGJsb2NrZWQgPSBudWxsO1xuXG5mdW5jdGlvbiBmaXhUeXBlKHR5cGUsIHZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgY29uc3RzLkJZVEU6XG4gICAgICAgIGNhc2UgY29uc3RzLlNIT1JUOlxuICAgICAgICBjYXNlIGNvbnN0cy5JTlQ6XG4gICAgICAgIGNhc2UgY29uc3RzLkxPTkc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgICBjYXNlIGNvbnN0cy5GTE9BVDpcbiAgICAgICAgY2FzZSBjb25zdHMuRE9VQkxFOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICBjYXNlIGNvbnN0cy5CT09MRUFOOlxuICAgICAgICAgICAgcmV0dXJuICd0cnVlJyA9PT0gU3RyaW5nKHZhbHVlKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjYXNlIGNvbnN0cy5TVFJJTkc6XG4gICAgICAgIGNhc2UgY29uc3RzLkVOVU06XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZyb21Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICBpZiAoISBleGlzdHModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBjb25zdHMuRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuRnJvbURvbHBoaW4uZ2V0KFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICBjYXNlIGNvbnN0cy5EQVRFOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZpeFR5cGUodHlwZSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdG9Eb2xwaGluKGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgdmFsdWUpIHtcbiAgICBpZiAoISBleGlzdHModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBjb25zdHMuRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgcmV0dXJuIGNsYXNzUmVwb3NpdG9yeS5iZWFuVG9Eb2xwaGluLmdldCh2YWx1ZSk7XG4gICAgICAgIGNhc2UgY29uc3RzLkRBVEU6XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlPyB2YWx1ZS50b0lTT1N0cmluZygpIDogdmFsdWU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZml4VHlwZSh0eXBlLCB2YWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZW5kTGlzdFNwbGljZShjbGFzc1JlcG9zaXRvcnksIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgZnJvbSwgdG8sIG5ld0VsZW1lbnRzKSB7XG4gICAgdmFyIGRvbHBoaW4gPSBjbGFzc1JlcG9zaXRvcnkuZG9scGhpbjtcbiAgICB2YXIgbW9kZWwgPSBkb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQobW9kZWxJZCk7XG4gICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgdmFyIGNsYXNzSW5mbyA9IGNsYXNzUmVwb3NpdG9yeS5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB2YXIgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAoZXhpc3RzKHR5cGUpKSB7XG5cbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gW1xuICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdAQEAgU09VUkNFX1NZU1RFTSBAQEAnLCBudWxsLCAnY2xpZW50JyksXG4gICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3NvdXJjZScsIG51bGwsIG1vZGVsSWQpLFxuICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBudWxsLCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdmcm9tJywgbnVsbCwgZnJvbSksXG4gICAgICAgICAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3RvJywgbnVsbCwgdG8pLFxuICAgICAgICAgICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdjb3VudCcsIG51bGwsIG5ld0VsZW1lbnRzLmxlbmd0aClcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBuZXdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGRvbHBoaW4uYXR0cmlidXRlKGluZGV4LnRvU3RyaW5nKCksIG51bGwsIHRvRG9scGhpbihjbGFzc1JlcG9zaXRvcnksIHR5cGUsIGVsZW1lbnQpKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoZG9scGhpbiwgW251bGwsICdARFA6TFNAJ10uY29uY2F0KGF0dHJpYnV0ZXMpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVMaXN0KGNsYXNzUmVwb3NpdG9yeSwgdHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgdmFyIGxpc3QgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgaWYgKCFleGlzdHMobGlzdCkpIHtcbiAgICAgICAgY2xhc3NSZXBvc2l0b3J5LnByb3BlcnR5VXBkYXRlSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgcHJvcGVydHlOYW1lLCBbXSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBibG9jayhiZWFuLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICBpZiAoZXhpc3RzKGJsb2NrZWQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGNyZWF0ZSBhIGJsb2NrIHdoaWxlIGFub3RoZXIgYmxvY2sgZXhpc3RzJyk7XG4gICAgfVxuICAgIGJsb2NrZWQgPSB7XG4gICAgICAgIGJlYW46IGJlYW4sXG4gICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaXNCbG9ja2VkKGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgIHJldHVybiBleGlzdHMoYmxvY2tlZCkgJiYgYmxvY2tlZC5iZWFuID09PSBiZWFuICYmIGJsb2NrZWQucHJvcGVydHlOYW1lID09PSBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIHVuYmxvY2soKSB7XG4gICAgYmxvY2tlZCA9IG51bGw7XG59XG5cblxuZnVuY3Rpb24gQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pIHtcbiAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5KGRvbHBoaW4pJyk7XG4gICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuXG4gICAgdGhpcy5kb2xwaGluID0gZG9scGhpbjtcbiAgICB0aGlzLmNsYXNzZXMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5iZWFuRnJvbURvbHBoaW4gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5iZWFuVG9Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuY2xhc3NJbmZvcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzID0gW107XG4gICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzID0gW107XG4gICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzID0gW107XG4gICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzID0gW107XG59XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5ub3RpZnlCZWFuQ2hhbmdlID0gZnVuY3Rpb24oYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSkge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKScpO1xuICAgIGNoZWNrUGFyYW0oYmVhbiwgJ2JlYW4nKTtcbiAgICBjaGVja1BhcmFtKHByb3BlcnR5TmFtZSwgJ3Byb3BlcnR5TmFtZScpO1xuXG4gICAgdmFyIG1vZGVsSWQgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KGJlYW4pO1xuICAgIGlmIChleGlzdHMobW9kZWxJZCkpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gdGhpcy5kb2xwaGluLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQobW9kZWxJZCk7XG4gICAgICAgIGlmIChleGlzdHMobW9kZWwpKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBjbGFzc0luZm9bcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgIGlmIChleGlzdHModHlwZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBhdHRyaWJ1dGUuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUuc2V0VmFsdWUodG9Eb2xwaGluKHRoaXMsIHR5cGUsIG5ld1ZhbHVlKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb21Eb2xwaGluKHRoaXMsIHR5cGUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5ub3RpZnlBcnJheUNoYW5nZSA9IGZ1bmN0aW9uKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpIHtcbiAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpJyk7XG4gICAgY2hlY2tQYXJhbShiZWFuLCAnYmVhbicpO1xuICAgIGNoZWNrUGFyYW0ocHJvcGVydHlOYW1lLCAncHJvcGVydHlOYW1lJyk7XG4gICAgY2hlY2tQYXJhbShpbmRleCwgJ2luZGV4Jyk7XG4gICAgY2hlY2tQYXJhbShjb3VudCwgJ2NvdW50Jyk7XG4gICAgY2hlY2tQYXJhbShyZW1vdmVkRWxlbWVudHMsICdyZW1vdmVkRWxlbWVudHMnKTtcblxuICAgIGlmIChpc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBtb2RlbElkID0gdGhpcy5iZWFuVG9Eb2xwaGluLmdldChiZWFuKTtcbiAgICB2YXIgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgaWYgKGV4aXN0cyhtb2RlbElkKSAmJiBleGlzdHMoYXJyYXkpKSB7XG4gICAgICAgIHZhciByZW1vdmVkRWxlbWVudHNDb3VudCA9IEFycmF5LmlzQXJyYXkocmVtb3ZlZEVsZW1lbnRzKT8gcmVtb3ZlZEVsZW1lbnRzLmxlbmd0aCA6IDA7XG4gICAgICAgIHNlbmRMaXN0U3BsaWNlKHRoaXMsIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgaW5kZXgsIGluZGV4ICsgcmVtb3ZlZEVsZW1lbnRzQ291bnQsIGFycmF5LnNsaWNlKGluZGV4LCBpbmRleCArIGNvdW50KSk7XG4gICAgfVxufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm9uQmVhbkFkZGVkID0gZnVuY3Rpb24oaGFuZGxlcikge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25CZWFuQWRkZWQoaGFuZGxlciknKTtcbiAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG4gICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm9uQmVhblJlbW92ZWQgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKGhhbmRsZXIpJyk7XG4gICAgY2hlY2tQYXJhbShoYW5kbGVyLCAnaGFuZGxlcicpO1xuICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm9uQmVhblVwZGF0ZSA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5Lm9uQmVhblVwZGF0ZShoYW5kbGVyKScpO1xuICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICB0aGlzLnByb3BlcnR5VXBkYXRlSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5vbkFycmF5VXBkYXRlID0gZnVuY3Rpb24oaGFuZGxlcikge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkub25BcnJheVVwZGF0ZShoYW5kbGVyKScpO1xuICAgIGNoZWNrUGFyYW0oaGFuZGxlciwgJ2hhbmRsZXInKTtcbiAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5yZWdpc3RlckNsYXNzID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgaWYgKHRoaXMuY2xhc3Nlcy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2xhc3NJbmZvID0ge307XG4gICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLnNlYXJjaCgvXkAvKSA8IDA7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzZXMuc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLnVucmVnaXN0ZXJDbGFzcyA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkudW5yZWdpc3RlckNsYXNzKG1vZGVsKScpO1xuICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgdGhpcy5jbGFzc2VzWydkZWxldGUnXShtb2RlbC5pZCk7XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIGNoZWNrTWV0aG9kKCdDbGFzc1JlcG9zaXRvcnkubG9hZChtb2RlbCknKTtcbiAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc2VzLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgIHZhciBiZWFuID0ge307XG4gICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICByZXR1cm4gKGF0dHJpYnV0ZS50YWcgPT09IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpKSAmJiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZS5zZWFyY2goL15ALykgPCAwKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgYmVhblthdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IG51bGw7XG4gICAgICAgIGF0dHJpYnV0ZS5vblZhbHVlQ2hhbmdlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50Lm9sZFZhbHVlICE9PSBldmVudC5uZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQub2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGZyb21Eb2xwaGluKHNlbGYsIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSwgZXZlbnQubmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIHNlbGYucHJvcGVydHlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuLCBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQW4gZXhjZXB0aW9uIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgYW4gb25CZWFuVXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmJlYW5Gcm9tRG9scGhpbi5zZXQobW9kZWwuaWQsIGJlYW4pO1xuICAgIHRoaXMuYmVhblRvRG9scGhpbi5zZXQoYmVhbiwgbW9kZWwuaWQpO1xuICAgIHRoaXMuY2xhc3NJbmZvcy5zZXQobW9kZWwuaWQsIGNsYXNzSW5mbyk7XG4gICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhbkFkZGVkLWhhbmRsZXInLCBlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBiZWFuO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLnVubG9hZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpJyk7XG4gICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG5cbiAgICB2YXIgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChtb2RlbC5pZCk7XG4gICAgdGhpcy5iZWFuRnJvbURvbHBoaW5bJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbiAgICB0aGlzLmJlYW5Ub0RvbHBoaW5bJ2RlbGV0ZSddKGJlYW4pO1xuICAgIHRoaXMuY2xhc3NJbmZvc1snZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgIGlmIChleGlzdHMoYmVhbikpIHtcbiAgICAgICAgdGhpcy5iZWFuUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbik7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FuIGV4Y2VwdGlvbiBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIGFuIG9uQmVhblJlbW92ZWQtaGFuZGxlcicsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGJlYW47XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUuc3BsaWNlTGlzdEVudHJ5ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICBjaGVja01ldGhvZCgnQ2xhc3NSZXBvc2l0b3J5LnNwbGljZUxpc3RFbnRyeShtb2RlbCknKTtcbiAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgIHZhciBzb3VyY2UgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3NvdXJjZScpO1xuICAgIHZhciBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2F0dHJpYnV0ZScpO1xuICAgIHZhciBmcm9tID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdmcm9tJyk7XG4gICAgdmFyIHRvID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCd0bycpO1xuICAgIHZhciBjb3VudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnY291bnQnKTtcblxuICAgIGlmIChleGlzdHMoc291cmNlKSAmJiBleGlzdHMoYXR0cmlidXRlKSAmJiBleGlzdHMoZnJvbSkgJiYgZXhpc3RzKHRvKSAmJiBleGlzdHMoY291bnQpKSB7XG4gICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzSW5mb3MuZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgIHZhciBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgZXhpc3RzKGNsYXNzSW5mbykpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgLy92YXIgZW50cnkgPSBmcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgICB2YWxpZGF0ZUxpc3QodGhpcywgdHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICAgIHZhciBuZXdFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudC52YWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIGlmICghIGV4aXN0cyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudHMucHVzaChmcm9tRG9scGhpbih0aGlzLCBjbGFzc0luZm9bYXR0cmlidXRlLnZhbHVlXSwgZWxlbWVudC52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBibG9jayhiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHR5cGUsIGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSwgZnJvbS52YWx1ZSwgdG8udmFsdWUgLSBmcm9tLnZhbHVlLCBuZXdFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkFycmF5VXBkYXRlLWhhbmRsZXInLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB1bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZC4gU291cmNlIGJlYW4gdW5rbm93bi5cIik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICB9XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUubWFwUGFyYW1Ub0RvbHBoaW4gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgfVxuICAgIHZhciB0eXBlID0gdHlwZW9mIHBhcmFtO1xuICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW0udG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQocGFyYW0pO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT25seSBtYW5hZ2VkIERvbHBoaW4gQmVhbnMgY2FuIGJlIHVzZWRcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBhbmQgcHJpbWl0aXZlIHR5cGVzIGNhbiBiZSB1c2VkXCIpO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm1hcERvbHBoaW5Ub0JlYW4gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmcm9tRG9scGhpbih0aGlzLCBjb25zdHMuRE9MUEhJTl9CRUFOLCB2YWx1ZSk7XG59O1xuXG5cblxuZXhwb3J0cy5DbGFzc1JlcG9zaXRvcnkgPSBDbGFzc1JlcG9zaXRvcnk7XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xudmFyIGNoZWNrTWV0aG9kID0gdXRpbHMuY2hlY2tNZXRob2Q7XG52YXIgY2hlY2tQYXJhbSA9IHV0aWxzLmNoZWNrUGFyYW07XG5cbnZhciBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCA9ICdkb2xwaGluX3BsYXRmb3JtX2ludGVybl8nO1xudmFyIElOSVRfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnaW5pdENsaWVudENvbnRleHQnO1xudmFyIERJU0NPTk5FQ1RfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnZGlzY29ubmVjdENsaWVudENvbnRleHQnO1xuXG5mdW5jdGlvbiBDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlciwgY29ubmVjdG9yKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQoZG9scGhpbiwgYmVhbk1hbmFnZXIsIGNvbnRyb2xsZXJNYW5hZ2VyLCBjb25uZWN0b3IpJyk7XG4gICAgY2hlY2tQYXJhbShkb2xwaGluLCAnZG9scGhpbicpO1xuICAgIGNoZWNrUGFyYW0oYmVhbk1hbmFnZXIsICdiZWFuTWFuYWdlcicpO1xuICAgIGNoZWNrUGFyYW0oY29udHJvbGxlck1hbmFnZXIsICdjb250cm9sbGVyTWFuYWdlcicpO1xuICAgIGNoZWNrUGFyYW0oY29ubmVjdG9yLCAnY29ubmVjdG9yJyk7XG5cbiAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgIHRoaXMuYmVhbk1hbmFnZXIgPSBiZWFuTWFuYWdlcjtcbiAgICB0aGlzLl9jb250cm9sbGVyTWFuYWdlciA9IGNvbnRyb2xsZXJNYW5hZ2VyO1xuICAgIHRoaXMuX2Nvbm5lY3RvciA9IGNvbm5lY3RvcjtcblxuICAgIHRoaXMuX2Nvbm5lY3Rvci5pbnZva2UoSU5JVF9DT01NQU5EX05BTUUpO1xufVxuXG5cbkNsaWVudENvbnRleHQucHJvdG90eXBlLmNyZWF0ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NsaWVudENvbnRleHQuY3JlYXRlQ29udHJvbGxlcihuYW1lKScpO1xuICAgIGNoZWNrUGFyYW0obmFtZSwgJ25hbWUnKTtcblxuICAgIHJldHVybiB0aGlzLl9jb250cm9sbGVyTWFuYWdlci5jcmVhdGVDb250cm9sbGVyKG5hbWUpO1xufTtcblxuXG5DbGllbnRDb250ZXh0LnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogSW1wbGVtZW50IENsaWVudENvbnRleHQuZGlzY29ubmVjdCBbRFAtNDZdXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZG9scGhpbi5zdG9wUHVzaExpc3RlbmluZygpO1xuICAgIHRoaXMuX2NvbnRyb2xsZXJNYW5hZ2VyLmRlc3Ryb3koKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLl9jb25uZWN0b3IuaW52b2tlKERJU0NPTk5FQ1RfQ09NTUFORF9OQU1FKTtcbiAgICAgICAgc2VsZi5kb2xwaGluID0gbnVsbDtcbiAgICAgICAgc2VsZi5iZWFuTWFuYWdlciA9IG51bGw7XG4gICAgICAgIHNlbGYuX2NvbnRyb2xsZXJNYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgc2VsZi5fY29ubmVjdG9yID0gbnVsbDtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0cy5DbGllbnRDb250ZXh0ID0gQ2xpZW50Q29udGV4dDsiLCIvKiBDb3B5cmlnaHQgMjAxNiBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKS5leGlzdHM7XG5cblxuZnVuY3Rpb24gZW5jb2RlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICAncCc6IGNvbW1hbmQucG1JZCxcbiAgICAgICAgJ3QnOiBjb21tYW5kLnBtVHlwZSxcbiAgICAgICAgJ2EnOiBjb21tYW5kLmF0dHJpYnV0ZXMubWFwKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgJ24nOiBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICdpJzogYXR0cmlidXRlLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGV4aXN0cyhhdHRyaWJ1dGUudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnYgPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXhpc3RzKGF0dHJpYnV0ZS50YWcpICYmIGF0dHJpYnV0ZS50YWcgIT09ICdWQUxVRScpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQudCA9IGF0dHJpYnV0ZS50YWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KSxcbiAgICAgICAgJ2lkJzogJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJ1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgJ2lkJzogJ0NyZWF0ZVByZXNlbnRhdGlvbk1vZGVsJyxcbiAgICAgICAgJ2NsYXNzTmFtZSc6IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIixcbiAgICAgICAgJ2NsaWVudFNpZGVPbmx5JzogZmFsc2UsXG4gICAgICAgICdwbUlkJzogY29tbWFuZC5wLFxuICAgICAgICAncG1UeXBlJzogY29tbWFuZC50LFxuICAgICAgICAnYXR0cmlidXRlcyc6IGNvbW1hbmQuYS5tYXAoZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAncHJvcGVydHlOYW1lJzogYXR0cmlidXRlLm4sXG4gICAgICAgICAgICAgICAgJ2lkJzogYXR0cmlidXRlLmksXG4gICAgICAgICAgICAgICAgJ3ZhbHVlJzogZXhpc3RzKGF0dHJpYnV0ZS52KT8gYXR0cmlidXRlLnYgOiBudWxsLFxuICAgICAgICAgICAgICAgICdiYXNlVmFsdWUnOiBleGlzdHMoYXR0cmlidXRlLnYpPyBhdHRyaWJ1dGUudiA6IG51bGwsXG4gICAgICAgICAgICAgICAgJ3F1YWxpZmllcic6IG51bGwsXG4gICAgICAgICAgICAgICAgJ3RhZyc6IGV4aXN0cyhhdHRyaWJ1dGUudCk/IGF0dHJpYnV0ZS50IDogJ1ZBTFVFJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICB9O1xufVxuXG5cbmZ1bmN0aW9uIGVuY29kZVZhbHVlQ2hhbmdlZENvbW1hbmQoY29tbWFuZCkge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICdhJzogY29tbWFuZC5hdHRyaWJ1dGVJZFxuICAgIH07XG4gICAgaWYgKGV4aXN0cyhjb21tYW5kLm9sZFZhbHVlKSkge1xuICAgICAgICByZXN1bHQubyA9IGNvbW1hbmQub2xkVmFsdWU7XG4gICAgfVxuICAgIGlmIChleGlzdHMoY29tbWFuZC5uZXdWYWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0Lm4gPSBjb21tYW5kLm5ld1ZhbHVlO1xuICAgIH1cbiAgICByZXN1bHQuaWQgPSAnVmFsdWVDaGFuZ2VkJztcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBkZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICAnaWQnOiAnVmFsdWVDaGFuZ2VkJyxcbiAgICAgICAgJ2NsYXNzTmFtZSc6IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5WYWx1ZUNoYW5nZWRDb21tYW5kXCIsXG4gICAgICAgICdhdHRyaWJ1dGVJZCc6IGNvbW1hbmQuYSxcbiAgICAgICAgJ29sZFZhbHVlJzogZXhpc3RzKGNvbW1hbmQubyk/IGNvbW1hbmQubyA6IG51bGwsXG4gICAgICAgICduZXdWYWx1ZSc6IGV4aXN0cyhjb21tYW5kLm4pPyBjb21tYW5kLm4gOiBudWxsXG4gICAgfTtcbn1cblxuXG5leHBvcnRzLkNvZGVjID0ge1xuICAgIGVuY29kZTogZnVuY3Rpb24gKGNvbW1hbmRzKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShjb21tYW5kcy5tYXAoZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kLmlkID09PSAnQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZC5pZCA9PT0gJ1ZhbHVlQ2hhbmdlZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlVmFsdWVDaGFuZ2VkQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21tYW5kO1xuICAgICAgICB9KSk7XG4gICAgfSxcbiAgICBkZWNvZGU6IGZ1bmN0aW9uICh0cmFuc21pdHRlZCkge1xuICAgICAgICBpZiAodHlwZW9mIHRyYW5zbWl0dGVkID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0cmFuc21pdHRlZCkubWFwKGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT09ICdDcmVhdGVQcmVzZW50YXRpb25Nb2RlbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZUNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQuaWQgPT09ICdWYWx1ZUNoYW5nZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tbWFuZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbWl0dGVkO1xuICAgICAgICB9XG4gICAgfVxufTsiLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlJyk7XG52YXIgb3BlbmRvbHBoaW4gPSByZXF1aXJlKCcuLi9vcGVuZG9scGhpbi9idWlsZC9vcGVuZG9scGhpbi5qcycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xudmFyIGV4aXN0cyA9IHV0aWxzLmV4aXN0cztcbnZhciBjaGVja01ldGhvZCA9IHV0aWxzLmNoZWNrTWV0aG9kO1xudmFyIGNoZWNrUGFyYW0gPSB1dGlscy5jaGVja1BhcmFtO1xuXG5cbnZhciBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCA9ICdkb2xwaGluX3BsYXRmb3JtX2ludGVybl8nO1xudmFyIFBPTExfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnbG9uZ1BvbGwnO1xudmFyIFJFTEVBU0VfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAncmVsZWFzZSc7XG5cbnZhciBET0xQSElOX0JFQU4gPSAnQEBAIERPTFBISU5fQkVBTiBAQEAnO1xudmFyIEFDVElPTl9DQUxMX0JFQU4gPSAnQEBAIENPTlRST0xMRVJfQUNUSU9OX0NBTExfQkVBTiBAQEAnO1xudmFyIEhJR0hMQU5ERVJfQkVBTiA9ICdAQEAgSElHSExBTkRFUl9CRUFOIEBAQCc7XG52YXIgRE9MUEhJTl9MSVNUX1NQTElDRSA9ICdARFA6TFNAJztcbnZhciBTT1VSQ0VfU1lTVEVNID0gJ0BAQCBTT1VSQ0VfU1lTVEVNIEBAQCc7XG52YXIgU09VUkNFX1NZU1RFTV9DTElFTlQgPSAnY2xpZW50JztcbnZhciBTT1VSQ0VfU1lTVEVNX1NFUlZFUiA9ICdzZXJ2ZXInO1xuXG5cblxudmFyIGluaXRpYWxpemVyO1xuXG5mdW5jdGlvbiBDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZykge1xuICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyknKTtcbiAgICBjaGVja1BhcmFtKHVybCwgJ3VybCcpO1xuICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlciA9IGZ1bmN0aW9uKCkge307XG4gICAgdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBzZWxmLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIGRvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLm9uTW9kZWxTdG9yZUNoYW5nZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gZXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgIHZhciBzb3VyY2VTeXN0ZW0gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoU09VUkNFX1NZU1RFTSk7XG4gICAgICAgIGlmIChleGlzdHMoc291cmNlU3lzdGVtKSAmJiBzb3VyY2VTeXN0ZW0udmFsdWUgPT09IFNPVVJDRV9TWVNURU1fU0VSVkVSKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBvcGVuZG9scGhpbi5UeXBlLkFEREVEKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsQWRkZWQobW9kZWwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5ldmVudFR5cGUgPT09IG9wZW5kb2xwaGluLlR5cGUuUkVNT1ZFRCkge1xuICAgICAgICAgICAgICAgIHNlbGYub25Nb2RlbFJlbW92ZWQobW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIWV4aXN0cyhjb25maWcpIHx8ICFleGlzdHMoY29uZmlnLnNlcnZlclB1c2gpIHx8IGNvbmZpZy5zZXJ2ZXJQdXNoID09PSB0cnVlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb2xwaGluLnN0YXJ0UHVzaExpc3RlbmluZyhQT0xMX0NPTU1BTkRfTkFNRSwgUkVMRUFTRV9DT01NQU5EX05BTUUpO1xuICAgICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcmVxLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgICAgICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlcS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZWplY3QoRXJyb3IoXCJOZXR3b3JrIEVycm9yXCIpKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXEub3BlbignUE9TVCcsIHVybCArICdpbnZhbGlkYXRlPycpO1xuICAgICAgICByZXEuc2VuZCgpO1xuICAgIH0pO1xufVxuXG5cbkNvbm5lY3Rvci5wcm90b3R5cGUub25Nb2RlbEFkZGVkID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yLm9uTW9kZWxBZGRlZChtb2RlbCknKTtcbiAgICBjaGVja1BhcmFtKG1vZGVsLCAnbW9kZWwnKTtcblxuICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIEFDVElPTl9DQUxMX0JFQU46XG4gICAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERPTFBISU5fQkVBTjpcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnJlZ2lzdGVyQ2xhc3MobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgSElHSExBTkRFUl9CRUFOOlxuICAgICAgICAgICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlcihtb2RlbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBET0xQSElOX0xJU1RfU1BMSUNFOlxuICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkuc3BsaWNlTGlzdEVudHJ5KG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMuZG9scGhpbi5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChtb2RlbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufTtcblxuXG5Db25uZWN0b3IucHJvdG90eXBlLm9uTW9kZWxSZW1vdmVkID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICBjaGVja01ldGhvZCgnQ29ubmVjdG9yLm9uTW9kZWxSZW1vdmVkKG1vZGVsKScpO1xuICAgIGNoZWNrUGFyYW0obW9kZWwsICdtb2RlbCcpO1xuXG4gICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5yZWdpc3RlckNsYXNzKG1vZGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERPTFBISU5fTElTVF9TUExJQ0U6XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnVubG9hZChtb2RlbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuXG5cbkNvbm5lY3Rvci5wcm90b3R5cGUuaW52b2tlID0gZnVuY3Rpb24oY29tbWFuZCkge1xuICAgIGNoZWNrTWV0aG9kKCdDb25uZWN0b3IuaW52b2tlKGNvbW1hbmQpJyk7XG4gICAgY2hlY2tQYXJhbShjb21tYW5kLCAnY29tbWFuZCcpO1xuXG4gICAgdmFyIGRvbHBoaW4gPSB0aGlzLmRvbHBoaW47XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgLy9pbml0aWFsaXplci50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRvbHBoaW4uc2VuZChjb21tYW5kLCB7XG4gICAgICAgICAgICAgICAgb25GaW5pc2hlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy99KTtcbiAgICB9KTtcbn07XG5cblxuQ29ubmVjdG9yLnByb3RvdHlwZS5nZXRIaWdobGFuZGVyUE0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlO1xufTtcblxuXG5cbmV4cG9ydHMuQ29ubmVjdG9yID0gQ29ubmVjdG9yO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNID0gU09VUkNFX1NZU1RFTTtcbmV4cG9ydHMuU09VUkNFX1NZU1RFTV9DTElFTlQgPSBTT1VSQ0VfU1lTVEVNX0NMSUVOVDtcbmV4cG9ydHMuU09VUkNFX1NZU1RFTV9TRVJWRVIgPSBTT1VSQ0VfU1lTVEVNX1NFUlZFUjtcbmV4cG9ydHMuQUNUSU9OX0NBTExfQkVBTiA9IEFDVElPTl9DQUxMX0JFQU47XG4iLCJleHBvcnRzLkRPTFBISU5fQkVBTiA9IDA7XG5leHBvcnRzLkJZVEUgPSAxO1xuZXhwb3J0cy5TSE9SVCA9IDI7XG5leHBvcnRzLklOVCA9IDM7XG5leHBvcnRzLkxPTkcgPSA0O1xuZXhwb3J0cy5GTE9BVCA9IDU7XG5leHBvcnRzLkRPVUJMRSA9IDY7XG5leHBvcnRzLkJPT0xFQU4gPSA3O1xuZXhwb3J0cy5TVFJJTkcgPSA4O1xuZXhwb3J0cy5EQVRFID0gOTtcbmV4cG9ydHMuRU5VTSA9IDEwO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZScpO1xudmFyIFNldCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3NldCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xudmFyIGV4aXN0cyA9IHV0aWxzLmV4aXN0cztcbnZhciBjaGVja01ldGhvZCA9IHV0aWxzLmNoZWNrTWV0aG9kO1xudmFyIGNoZWNrUGFyYW0gPSB1dGlscy5jaGVja1BhcmFtO1xuXG52YXIgQ29udHJvbGxlclByb3h5ID0gcmVxdWlyZSgnLi9jb250cm9sbGVycHJveHkuanMnKS5Db250cm9sbGVyUHJveHk7XG5cbnZhciBTT1VSQ0VfU1lTVEVNID0gcmVxdWlyZSgnLi9jb25uZWN0b3IuanMnKS5TT1VSQ0VfU1lTVEVNO1xudmFyIFNPVVJDRV9TWVNURU1fQ0xJRU5UID0gcmVxdWlyZSgnLi9jb25uZWN0b3IuanMnKS5TT1VSQ0VfU1lTVEVNX0NMSUVOVDtcbnZhciBBQ1RJT05fQ0FMTF9CRUFOID0gcmVxdWlyZSgnLi9jb25uZWN0b3IuanMnKS5BQ1RJT05fQ0FMTF9CRUFOO1xuXG52YXIgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbnZhciBSRUdJU1RFUl9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ3JlZ2lzdGVyQ29udHJvbGxlcic7XG52YXIgQ0FMTF9DT05UUk9MTEVSX0FDVElPTl9DT01NQU5EX05BTUUgPSBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCArICdjYWxsQ29udHJvbGxlckFjdGlvbic7XG52YXIgREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2Rlc3Ryb3lDb250cm9sbGVyJztcblxudmFyIENPTlRST0xMRVJfTkFNRSA9ICdjb250cm9sbGVyTmFtZSc7XG52YXIgQ09OVFJPTExFUl9JRCA9ICdjb250cm9sbGVySWQnO1xudmFyIE1PREVMID0gJ21vZGVsJztcbnZhciBBQ1RJT05fTkFNRSA9ICdhY3Rpb25OYW1lJztcbnZhciBFUlJPUl9DT0RFID0gJ2Vycm9yQ29kZSc7XG52YXIgUEFSQU1fUFJFRklYID0gJ18nO1xuXG5cbmZ1bmN0aW9uIENvbnRyb2xsZXJNYW5hZ2VyKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKScpO1xuICAgIGNoZWNrUGFyYW0oZG9scGhpbiwgJ2RvbHBoaW4nKTtcbiAgICBjaGVja1BhcmFtKGNsYXNzUmVwb3NpdG9yeSwgJ2NsYXNzUmVwb3NpdG9yeScpO1xuICAgIGNoZWNrUGFyYW0oY29ubmVjdG9yLCAnY29ubmVjdG9yJyk7XG5cbiAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgIHRoaXMuY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSBuZXcgU2V0KCk7XG59XG5cblxuQ29udHJvbGxlck1hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUNvbnRyb2xsZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmNyZWF0ZUNvbnRyb2xsZXIobmFtZSknKTtcbiAgICBjaGVja1BhcmFtKG5hbWUsICduYW1lJyk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNvbnRyb2xsZXJJZCwgbW9kZWxJZCwgbW9kZWwsIGNvbnRyb2xsZXI7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgc2VsZi5jb25uZWN0b3IuZ2V0SGlnaGxhbmRlclBNKCkudGhlbihmdW5jdGlvbiAoaGlnaGxhbmRlclBNKSB7XG4gICAgICAgICAgICBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfTkFNRSkuc2V0VmFsdWUobmFtZSk7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoUkVHSVNURVJfQ09OVFJPTExFUl9DT01NQU5EX05BTUUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcklkID0gaGlnaGxhbmRlclBNLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShDT05UUk9MTEVSX0lEKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIG1vZGVsSWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKE1PREVMKS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIG1vZGVsID0gc2VsZi5jbGFzc1JlcG9zaXRvcnkubWFwRG9scGhpblRvQmVhbihtb2RlbElkKTtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBzZWxmKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRyb2xsZXJzLmFkZChjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG5Db250cm9sbGVyTWFuYWdlci5wcm90b3R5cGUuaW52b2tlQWN0aW9uID0gZnVuY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlck1hbmFnZXIuaW52b2tlQWN0aW9uKGNvbnRyb2xsZXJJZCwgYWN0aW9uTmFtZSwgcGFyYW1zKScpO1xuICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgY2hlY2tQYXJhbShhY3Rpb25OYW1lLCAnYWN0aW9uTmFtZScpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgICAgIHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoU09VUkNFX1NZU1RFTSwgbnVsbCwgU09VUkNFX1NZU1RFTV9DTElFTlQpLFxuICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShDT05UUk9MTEVSX0lELCBudWxsLCBjb250cm9sbGVySWQpLFxuICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShBQ1RJT05fTkFNRSwgbnVsbCwgYWN0aW9uTmFtZSksXG4gICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKEVSUk9SX0NPREUpXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKGV4aXN0cyhwYXJhbXMpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtID0gc2VsZi5jbGFzc1JlcG9zaXRvcnkubWFwUGFyYW1Ub0RvbHBoaW4ocGFyYW1zW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoUEFSQU1fUFJFRklYICsgcHJvcCwgbnVsbCwgcGFyYW0sICdWQUxVRScpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcG0gPSBzZWxmLmRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoc2VsZi5kb2xwaGluLCBbbnVsbCwgQUNUSU9OX0NBTExfQkVBTl0uY29uY2F0KGF0dHJpYnV0ZXMpKTtcblxuICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoQ0FMTF9DT05UUk9MTEVSX0FDVElPTl9DT01NQU5EX05BTUUsIHBhcmFtcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpc0Vycm9yID0gcG0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKEVSUk9SX0NPREUpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJDb250cm9sbGVyQWN0aW9uIGNhdXNlZCBhbiBlcnJvclwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuZG9scGhpbi5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChwbSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG5Db250cm9sbGVyTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveUNvbnRyb2xsZXIgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJNYW5hZ2VyLmRlc3Ryb3lDb250cm9sbGVyKGNvbnRyb2xsZXIpJyk7XG4gICAgY2hlY2tQYXJhbShjb250cm9sbGVyLCAnY29udHJvbGxlcicpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHNlbGYuY29ubmVjdG9yLmdldEhpZ2hsYW5kZXJQTSgpLnRoZW4oZnVuY3Rpb24gKGhpZ2hsYW5kZXJQTSkge1xuICAgICAgICAgICAgc2VsZi5jb250cm9sbGVycy5kZWxldGUoY29udHJvbGxlcik7XG4gICAgICAgICAgICBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLnNldFZhbHVlKGNvbnRyb2xsZXIuY29udHJvbGxlcklkKTtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9OQU1FKS50aGVuKHJlc29sdmUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cblxuQ29udHJvbGxlck1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udHJvbGxlcnNDb3B5ID0gdGhpcy5jb250cm9sbGVycztcbiAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gbmV3IFNldCgpO1xuICAgIGNvbnRyb2xsZXJzQ29weS5mb3JFYWNoKGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKGNvbnRyb2xsZXIuZGVzdHJveSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcblxuXG5cbmV4cG9ydHMuQ29udHJvbGxlck1hbmFnZXIgPSBDb250cm9sbGVyTWFuYWdlcjtcbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoJy4vcG9seWZpbGxzLmpzJyk7XG52YXIgU2V0ID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vc2V0Jyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XG52YXIgY2hlY2tNZXRob2QgPSB1dGlscy5jaGVja01ldGhvZDtcbnZhciBjaGVja1BhcmFtID0gdXRpbHMuY2hlY2tQYXJhbTtcblxuXG5cbmZ1bmN0aW9uIENvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBtYW5hZ2VyKSB7XG4gICAgY2hlY2tNZXRob2QoJ0NvbnRyb2xsZXJQcm94eShjb250cm9sbGVySWQsIG1vZGVsLCBtYW5hZ2VyKScpO1xuICAgIGNoZWNrUGFyYW0oY29udHJvbGxlcklkLCAnY29udHJvbGxlcklkJyk7XG4gICAgY2hlY2tQYXJhbShtb2RlbCwgJ21vZGVsJyk7XG4gICAgY2hlY2tQYXJhbShtYW5hZ2VyLCAnbWFuYWdlcicpO1xuXG4gICAgdGhpcy5jb250cm9sbGVySWQgPSBjb250cm9sbGVySWQ7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm9uRGVzdHJveWVkSGFuZGxlcnMgPSBuZXcgU2V0KCk7XG59XG5cblxuQ29udHJvbGxlclByb3h5LnByb3RvdHlwZS5pbnZva2UgPSBmdW5jdGlvbihuYW1lLCBwYXJhbXMpIHtcbiAgICBjaGVja01ldGhvZCgnQ29udHJvbGxlclByb3h5Lmludm9rZShuYW1lLCBwYXJhbXMpJyk7XG4gICAgY2hlY2tQYXJhbShuYW1lLCAnbmFtZScpO1xuXG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRyb2xsZXIgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1hbmFnZXIuaW52b2tlQWN0aW9uKHRoaXMuY29udHJvbGxlcklkLCBuYW1lLCBwYXJhbXMpO1xufTtcblxuXG5Db250cm9sbGVyUHJveHkucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMub25EZXN0cm95ZWRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGhhbmRsZXIodGhpcyk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBhbiBvbkRlc3Ryb3llZC1oYW5kbGVyJywgZSk7XG4gICAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmRlc3Ryb3lDb250cm9sbGVyKHRoaXMpO1xufTtcblxuXG5Db250cm9sbGVyUHJveHkucHJvdG90eXBlLm9uRGVzdHJveWVkID0gZnVuY3Rpb24oaGFuZGxlcikge1xuICAgIGNoZWNrTWV0aG9kKCdDb250cm9sbGVyUHJveHkub25EZXN0cm95ZWQoaGFuZGxlciknKTtcbiAgICBjaGVja1BhcmFtKGhhbmRsZXIsICdoYW5kbGVyJyk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5vbkRlc3Ryb3llZEhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLm9uRGVzdHJveWVkSGFuZGxlcnMuZGVsZXRlKGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cblxuXG5leHBvcnRzLkNvbnRyb2xsZXJQcm94eSA9IENvbnRyb2xsZXJQcm94eTtcbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoJy4vcG9seWZpbGxzLmpzJyk7XG52YXIgb3BlbmRvbHBoaW4gPSByZXF1aXJlKCcuLi9vcGVuZG9scGhpbi9idWlsZC9vcGVuZG9scGhpbi5qcycpO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XG52YXIgZXhpc3RzID0gdXRpbHMuZXhpc3RzO1xudmFyIGNoZWNrTWV0aG9kID0gdXRpbHMuY2hlY2tNZXRob2Q7XG52YXIgY2hlY2tQYXJhbSA9IHV0aWxzLmNoZWNrUGFyYW07XG52YXIgQ29ubmVjdG9yID0gcmVxdWlyZSgnLi9jb25uZWN0b3IuanMnKS5Db25uZWN0b3I7XG52YXIgQmVhbk1hbmFnZXIgPSByZXF1aXJlKCcuL2JlYW5tYW5hZ2VyLmpzJykuQmVhbk1hbmFnZXI7XG52YXIgQ2xhc3NSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi9jbGFzc3JlcG8uanMnKS5DbGFzc1JlcG9zaXRvcnk7XG52YXIgQ29udHJvbGxlck1hbmFnZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJtYW5hZ2VyLmpzJykuQ29udHJvbGxlck1hbmFnZXI7XG52YXIgQ2xpZW50Q29udGV4dCA9IHJlcXVpcmUoJy4vY2xpZW50Y29udGV4dC5qcycpLkNsaWVudENvbnRleHQ7XG52YXIgQ29kZWMgPSByZXF1aXJlKCcuL2NvZGVjLmpzJykuQ29kZWM7XG5cbmV4cG9ydHMuY29ubmVjdCA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgY2hlY2tNZXRob2QoJ2Nvbm5lY3QodXJsLCBjb25maWcpJyk7XG4gICAgY2hlY2tQYXJhbSh1cmwsICd1cmwnKTtcblxuICAgIHZhciBidWlsZGVyID0gb3BlbmRvbHBoaW4ubWFrZURvbHBoaW4oKS51cmwodXJsKS5yZXNldChmYWxzZSkuc2xhY2tNUyg0KS5zdXBwb3J0Q09SUyh0cnVlKTtcbiAgICBpZiAoZXhpc3RzKGNvbmZpZykgJiYgZXhpc3RzKGNvbmZpZy5lcnJvckhhbmRsZXIpKSB7XG4gICAgICAgIGJ1aWxkZXIuZXJyb3JIYW5kbGVyKGNvbmZpZy5lcnJvckhhbmRsZXIpO1xuICAgIH1cbiAgICB2YXIgZG9scGhpbiA9IGJ1aWxkZXIuYnVpbGQoKTtcbiAgICBkb2xwaGluLmNsaWVudENvbm5lY3Rvci50cmFuc21pdHRlci5jb2RlYyA9IENvZGVjO1xuXG4gICAgdmFyIGNsYXNzUmVwb3NpdG9yeSA9IG5ldyBDbGFzc1JlcG9zaXRvcnkoZG9scGhpbik7XG4gICAgdmFyIGJlYW5NYW5hZ2VyID0gbmV3IEJlYW5NYW5hZ2VyKGNsYXNzUmVwb3NpdG9yeSk7XG4gICAgdmFyIGNvbm5lY3RvciA9IG5ldyBDb25uZWN0b3IodXJsLCBkb2xwaGluLCBjbGFzc1JlcG9zaXRvcnksIGNvbmZpZyk7XG4gICAgdmFyIGNvbnRyb2xsZXJNYW5hZ2VyID0gbmV3IENvbnRyb2xsZXJNYW5hZ2VyKGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29ubmVjdG9yKTtcblxuICAgIHJldHVybiBuZXcgQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIsIGNvbm5lY3Rvcik7XG59O1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cblxuIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBBcnJheS5mb3JFYWNoKClcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXG5pZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG5cbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cbiAgICAgICAgdmFyIFQsIGs7XG5cbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignIHRoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG4gICAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuXG4gICAgICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgICAgICAvLyAzLiBMZXQgbGVuIGJlIFRvVWludDMyKGxlblZhbHVlKS5cbiAgICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIC8vIDQuIElmIElzQ2FsbGFibGUoY2FsbGJhY2spIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgIC8vIFNlZTogaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS4xMVxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA1LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXQgVCBiZSB1bmRlZmluZWQuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgVCA9IHRoaXNBcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA2LiBMZXQgayBiZSAwXG4gICAgICAgIGsgPSAwO1xuXG4gICAgICAgIC8vIDcuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxuICAgICAgICB3aGlsZSAoayA8IGxlbikge1xuXG4gICAgICAgICAgICB2YXIga1ZhbHVlO1xuXG4gICAgICAgICAgICAvLyBhLiBMZXQgUGsgYmUgVG9TdHJpbmcoaykuXG4gICAgICAgICAgICAvLyAgIFRoaXMgaXMgaW1wbGljaXQgZm9yIExIUyBvcGVyYW5kcyBvZiB0aGUgaW4gb3BlcmF0b3JcbiAgICAgICAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgICAgICAvLyAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjXG4gICAgICAgICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXG4gICAgICAgICAgICBpZiAoayBpbiBPKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgICAgICAgICAga1ZhbHVlID0gT1trXTtcblxuICAgICAgICAgICAgICAgIC8vIGlpLiBDYWxsIHRoZSBDYWxsIGludGVybmFsIG1ldGhvZCBvZiBjYWxsYmFjayB3aXRoIFQgYXMgdGhlIHRoaXMgdmFsdWUgYW5kXG4gICAgICAgICAgICAgICAgLy8gYXJndW1lbnQgbGlzdCBjb250YWluaW5nIGtWYWx1ZSwgaywgYW5kIE8uXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChULCBrVmFsdWUsIGssIE8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgICAgICAgaysrO1xuICAgICAgICB9XG4gICAgICAgIC8vIDguIHJldHVybiB1bmRlZmluZWRcbiAgICB9O1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEFycmF5LmZpbHRlcigpXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xuaWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uKGZ1bi8qLCB0aGlzQXJnKi8pIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIGlmICh0aGlzID09PSB2b2lkIDAgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXMgPSBbXTtcbiAgICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID49IDIgPyBhcmd1bWVudHNbMV0gOiB2b2lkIDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gdFtpXTtcblxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IFRlY2huaWNhbGx5IHRoaXMgc2hvdWxkIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBhdFxuICAgICAgICAgICAgICAgIC8vICAgICAgIHRoZSBuZXh0IGluZGV4LCBhcyBwdXNoIGNhbiBiZSBhZmZlY3RlZCBieVxuICAgICAgICAgICAgICAgIC8vICAgICAgIHByb3BlcnRpZXMgb24gT2JqZWN0LnByb3RvdHlwZSBhbmQgQXJyYXkucHJvdG90eXBlLlxuICAgICAgICAgICAgICAgIC8vICAgICAgIEJ1dCB0aGF0IG1ldGhvZCdzIG5ldywgYW5kIGNvbGxpc2lvbnMgc2hvdWxkIGJlXG4gICAgICAgICAgICAgICAgLy8gICAgICAgcmFyZSwgc28gdXNlIHRoZSBtb3JlLWNvbXBhdGlibGUgYWx0ZXJuYXRpdmUuXG4gICAgICAgICAgICAgICAgaWYgKGZ1bi5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2godmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH07XG59IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY2hlY2tNZXRob2ROYW1lO1xuXG52YXIgZXhpc3RzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnICYmIG9iamVjdCAhPT0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcblxubW9kdWxlLmV4cG9ydHMuY2hlY2tNZXRob2QgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgY2hlY2tNZXRob2ROYW1lID0gbmFtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNoZWNrUGFyYW0gPSBmdW5jdGlvbihwYXJhbSwgcGFyYW1ldGVyTmFtZSkge1xuICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwYXJhbWV0ZXIgJyArIHBhcmFtZXRlck5hbWUgKyAnIGlzIG1hbmRhdG9yeSBpbiAnICsgY2hlY2tNZXRob2ROYW1lKTtcbiAgICB9XG59O1xuIl19
