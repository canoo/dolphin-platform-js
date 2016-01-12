(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dolphin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/$.core').Map;
},{"../modules/$.core":11,"../modules/es6.map":55,"../modules/es6.object.to-string":56,"../modules/es6.string.iterator":58,"../modules/es7.map.to-json":59,"../modules/web.dom.iterable":60}],2:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
module.exports = _dereq_('../modules/$.core').Promise;
},{"../modules/$.core":11,"../modules/es6.object.to-string":56,"../modules/es6.promise":57,"../modules/es6.string.iterator":58,"../modules/web.dom.iterable":60}],3:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],4:[function(_dereq_,module,exports){
module.exports = function(){ /* empty */ };
},{}],5:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":26}],6:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./$.cof')
  , TAG = _dereq_('./$.wks')('toStringTag')
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
},{"./$.cof":7,"./$.wks":52}],7:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],8:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_('./$')
  , hide         = _dereq_('./$.hide')
  , redefineAll  = _dereq_('./$.redefine-all')
  , ctx          = _dereq_('./$.ctx')
  , strictNew    = _dereq_('./$.strict-new')
  , defined      = _dereq_('./$.defined')
  , forOf        = _dereq_('./$.for-of')
  , $iterDefine  = _dereq_('./$.iter-define')
  , step         = _dereq_('./$.iter-step')
  , ID           = _dereq_('./$.uid')('id')
  , $has         = _dereq_('./$.has')
  , isObject     = _dereq_('./$.is-object')
  , setSpecies   = _dereq_('./$.set-species')
  , DESCRIPTORS  = _dereq_('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

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
      strictNew(that, C, NAME);
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
},{"./$":33,"./$.ctx":12,"./$.defined":13,"./$.descriptors":14,"./$.for-of":18,"./$.has":20,"./$.hide":21,"./$.is-object":26,"./$.iter-define":29,"./$.iter-step":31,"./$.redefine-all":37,"./$.set-species":41,"./$.strict-new":45,"./$.uid":51}],9:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = _dereq_('./$.for-of')
  , classof = _dereq_('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":6,"./$.for-of":18}],10:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./$')
  , global         = _dereq_('./$.global')
  , $export        = _dereq_('./$.export')
  , fails          = _dereq_('./$.fails')
  , hide           = _dereq_('./$.hide')
  , redefineAll    = _dereq_('./$.redefine-all')
  , forOf          = _dereq_('./$.for-of')
  , strictNew      = _dereq_('./$.strict-new')
  , isObject       = _dereq_('./$.is-object')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , DESCRIPTORS    = _dereq_('./$.descriptors');

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
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
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
},{"./$":33,"./$.descriptors":14,"./$.export":16,"./$.fails":17,"./$.for-of":18,"./$.global":19,"./$.hide":21,"./$.is-object":26,"./$.redefine-all":37,"./$.set-to-string-tag":42,"./$.strict-new":45}],11:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],12:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./$.a-function');
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
},{"./$.a-function":3}],13:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],14:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":17}],15:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object')
  , document = _dereq_('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":19,"./$.is-object":26}],16:[function(_dereq_,module,exports){
var global    = _dereq_('./$.global')
  , core      = _dereq_('./$.core')
  , ctx       = _dereq_('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":11,"./$.ctx":12,"./$.global":19}],17:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],18:[function(_dereq_,module,exports){
var ctx         = _dereq_('./$.ctx')
  , call        = _dereq_('./$.iter-call')
  , isArrayIter = _dereq_('./$.is-array-iter')
  , anObject    = _dereq_('./$.an-object')
  , toLength    = _dereq_('./$.to-length')
  , getIterFn   = _dereq_('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
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
},{"./$.an-object":5,"./$.ctx":12,"./$.is-array-iter":25,"./$.iter-call":27,"./$.to-length":50,"./core.get-iterator-method":53}],19:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],20:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],21:[function(_dereq_,module,exports){
var $          = _dereq_('./$')
  , createDesc = _dereq_('./$.property-desc');
module.exports = _dereq_('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":33,"./$.descriptors":14,"./$.property-desc":36}],22:[function(_dereq_,module,exports){
module.exports = _dereq_('./$.global').document && document.documentElement;
},{"./$.global":19}],23:[function(_dereq_,module,exports){
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
},{}],24:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":7}],25:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators  = _dereq_('./$.iterators')
  , ITERATOR   = _dereq_('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":32,"./$.wks":52}],26:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],27:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_('./$.an-object');
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
},{"./$.an-object":5}],28:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./$')
  , descriptor     = _dereq_('./$.property-desc')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./$.hide')(IteratorPrototype, _dereq_('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":33,"./$.hide":21,"./$.property-desc":36,"./$.set-to-string-tag":42,"./$.wks":52}],29:[function(_dereq_,module,exports){
'use strict';
var LIBRARY        = _dereq_('./$.library')
  , $export        = _dereq_('./$.export')
  , redefine       = _dereq_('./$.redefine')
  , hide           = _dereq_('./$.hide')
  , has            = _dereq_('./$.has')
  , Iterators      = _dereq_('./$.iterators')
  , $iterCreate    = _dereq_('./$.iter-create')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , getProto       = _dereq_('./$').getProto
  , ITERATOR       = _dereq_('./$.wks')('iterator')
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
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
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
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":33,"./$.export":16,"./$.has":20,"./$.hide":21,"./$.iter-create":28,"./$.iterators":32,"./$.library":34,"./$.redefine":38,"./$.set-to-string-tag":42,"./$.wks":52}],30:[function(_dereq_,module,exports){
var ITERATOR     = _dereq_('./$.wks')('iterator')
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
},{"./$.wks":52}],31:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],32:[function(_dereq_,module,exports){
module.exports = {};
},{}],33:[function(_dereq_,module,exports){
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
},{}],34:[function(_dereq_,module,exports){
module.exports = true;
},{}],35:[function(_dereq_,module,exports){
var global    = _dereq_('./$.global')
  , macrotask = _dereq_('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = _dereq_('./$.cof')(process) == 'process'
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
},{"./$.cof":7,"./$.global":19,"./$.task":47}],36:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],37:[function(_dereq_,module,exports){
var redefine = _dereq_('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":38}],38:[function(_dereq_,module,exports){
module.exports = _dereq_('./$.hide');
},{"./$.hide":21}],39:[function(_dereq_,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],40:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = _dereq_('./$').getDesc
  , isObject = _dereq_('./$.is-object')
  , anObject = _dereq_('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _dereq_('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
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
},{"./$":33,"./$.an-object":5,"./$.ctx":12,"./$.is-object":26}],41:[function(_dereq_,module,exports){
'use strict';
var core        = _dereq_('./$.core')
  , $           = _dereq_('./$')
  , DESCRIPTORS = _dereq_('./$.descriptors')
  , SPECIES     = _dereq_('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":33,"./$.core":11,"./$.descriptors":14,"./$.wks":52}],42:[function(_dereq_,module,exports){
var def = _dereq_('./$').setDesc
  , has = _dereq_('./$.has')
  , TAG = _dereq_('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":33,"./$.has":20,"./$.wks":52}],43:[function(_dereq_,module,exports){
var global = _dereq_('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":19}],44:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = _dereq_('./$.an-object')
  , aFunction = _dereq_('./$.a-function')
  , SPECIES   = _dereq_('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":3,"./$.an-object":5,"./$.wks":52}],45:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],46:[function(_dereq_,module,exports){
var toInteger = _dereq_('./$.to-integer')
  , defined   = _dereq_('./$.defined');
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
},{"./$.defined":13,"./$.to-integer":48}],47:[function(_dereq_,module,exports){
var ctx                = _dereq_('./$.ctx')
  , invoke             = _dereq_('./$.invoke')
  , html               = _dereq_('./$.html')
  , cel                = _dereq_('./$.dom-create')
  , global             = _dereq_('./$.global')
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
  if(_dereq_('./$.cof')(process) == 'process'){
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
},{"./$.cof":7,"./$.ctx":12,"./$.dom-create":15,"./$.global":19,"./$.html":22,"./$.invoke":23}],48:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],49:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./$.iobject')
  , defined = _dereq_('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":13,"./$.iobject":24}],50:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":48}],51:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],52:[function(_dereq_,module,exports){
var store  = _dereq_('./$.shared')('wks')
  , uid    = _dereq_('./$.uid')
  , Symbol = _dereq_('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":19,"./$.shared":43,"./$.uid":51}],53:[function(_dereq_,module,exports){
var classof   = _dereq_('./$.classof')
  , ITERATOR  = _dereq_('./$.wks')('iterator')
  , Iterators = _dereq_('./$.iterators');
module.exports = _dereq_('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":6,"./$.core":11,"./$.iterators":32,"./$.wks":52}],54:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./$.add-to-unscopables')
  , step             = _dereq_('./$.iter-step')
  , Iterators        = _dereq_('./$.iterators')
  , toIObject        = _dereq_('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./$.iter-define')(Array, 'Array', function(iterated, kind){
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
},{"./$.add-to-unscopables":4,"./$.iter-define":29,"./$.iter-step":31,"./$.iterators":32,"./$.to-iobject":49}],55:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./$.collection-strong');

// 23.1 Map Objects
_dereq_('./$.collection')('Map', function(get){
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
},{"./$.collection":10,"./$.collection-strong":8}],56:[function(_dereq_,module,exports){

},{}],57:[function(_dereq_,module,exports){
'use strict';
var $          = _dereq_('./$')
  , LIBRARY    = _dereq_('./$.library')
  , global     = _dereq_('./$.global')
  , ctx        = _dereq_('./$.ctx')
  , classof    = _dereq_('./$.classof')
  , $export    = _dereq_('./$.export')
  , isObject   = _dereq_('./$.is-object')
  , anObject   = _dereq_('./$.an-object')
  , aFunction  = _dereq_('./$.a-function')
  , strictNew  = _dereq_('./$.strict-new')
  , forOf      = _dereq_('./$.for-of')
  , setProto   = _dereq_('./$.set-proto').set
  , same       = _dereq_('./$.same-value')
  , SPECIES    = _dereq_('./$.wks')('species')
  , speciesConstructor = _dereq_('./$.species-constructor')
  , asap       = _dereq_('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && _dereq_('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
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
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  _dereq_('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
_dereq_('./$.set-to-string-tag')(P, PROMISE);
_dereq_('./$.set-species')(PROMISE);
Wrapper = _dereq_('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
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
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
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
},{"./$":33,"./$.a-function":3,"./$.an-object":5,"./$.classof":6,"./$.core":11,"./$.ctx":12,"./$.descriptors":14,"./$.export":16,"./$.for-of":18,"./$.global":19,"./$.is-object":26,"./$.iter-detect":30,"./$.library":34,"./$.microtask":35,"./$.redefine-all":37,"./$.same-value":39,"./$.set-proto":40,"./$.set-species":41,"./$.set-to-string-tag":42,"./$.species-constructor":44,"./$.strict-new":45,"./$.wks":52}],58:[function(_dereq_,module,exports){
'use strict';
var $at  = _dereq_('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./$.iter-define')(String, 'String', function(iterated){
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
},{"./$.iter-define":29,"./$.string-at":46}],59:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = _dereq_('./$.export');

$export($export.P, 'Map', {toJSON: _dereq_('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":9,"./$.export":16}],60:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var Iterators = _dereq_('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":32,"./es6.array.iterator":54}],61:[function(_dereq_,module,exports){
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
    })();
    opendolphin.Attribute = Attribute;
})(opendolphin || (opendolphin = {}));
var opendolphin;
(function (opendolphin) {
    var Command = (function () {
        function Command() {
            this.id = "dolphin-core-command";
        }
        return Command;
    })();
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
    })();
    opendolphin.Tag = Tag;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
/// <reference path="Tag.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
    opendolphin.AttributeMetadataChangedCommand = AttributeMetadataChangedCommand;
})(opendolphin || (opendolphin = {}));
/// <reference path="Command.ts" />
var opendolphin;
(function (opendolphin) {
    var BaseValueChangedCommand = (function (_super) {
        __extends(BaseValueChangedCommand, _super);
        function BaseValueChangedCommand(attributeId) {
            _super.call(this);
            this.attributeId = attributeId;
            this.id = 'BaseValueChanged';
            this.className = "org.opendolphin.core.comm.BaseValueChangedCommand";
        }
        return BaseValueChangedCommand;
    })(opendolphin.Command);
    opendolphin.BaseValueChangedCommand = BaseValueChangedCommand;
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })();
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
    })();
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
    })();
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })();
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
    })();
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
    })();
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })();
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
/// <reference path="BaseValueChangedCommand.ts"/>
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
                var baseValueChangeCommand = new opendolphin.BaseValueChangedCommand(attribute.id);
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
    })();
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
    })();
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
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
/// <reference path="BaseValueChangedCommand.ts" />
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
            else if (command.id == "BaseValueChanged") {
                return this.handleBaseValueChangedCommand(command);
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
        ClientConnector.prototype.handleBaseValueChangedCommand = function (serverCommand) {
            var clientAttribute = this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);
            if (!clientAttribute) {
                console.log("attribute with id " + serverCommand.attributeId + " not found, cannot set base value.");
                return null;
            }
            clientAttribute.rebase();
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
    })();
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
        return NoTransmitter;
    })();
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
        HttpTransmitter.prototype.invalidate = function () {
            this.http.open('POST', this.url + 'invalidate?', false);
            this.http.send();
        };
        return HttpTransmitter;
    })();
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
    })();
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
    })(opendolphin.Command);
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
    })(opendolphin.Command);
    opendolphin.ResetPresentationModelCommand = ResetPresentationModelCommand;
})(opendolphin || (opendolphin = {}));

module.exports = opendolphin;
},{}],62:[function(_dereq_,module,exports){
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
var exists = _dereq_('./utils.js').exists;


function BeanManager(classRepository) {
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
                handler(bean);
            });
        }
        self.allAddedHandlers.forEach(function (handler) {
            handler(bean);
        });
    });
    this.classRepository.onBeanRemoved(function(type, bean) {
        var handlerList = self.removedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function(handler) {
                handler(bean);
            });
        }
        self.allRemovedHandlers.forEach(function(handler) {
            handler(bean);
        });
    });
    this.classRepository.onBeanUpdate(function(type, bean, propertyName, newValue, oldValue) {
        var handlerList = self.updatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                handler(bean, propertyName, newValue, oldValue);
            });
        }
        self.allUpdatedHandlers.forEach(function (handler) {
            handler(bean, propertyName, newValue, oldValue);
        });
    });
    this.classRepository.onArrayUpdate(function(type, bean, propertyName, index, count, newElement) {
        var handlerList = self.arrayUpdatedHandlers.get(type);
        if (exists(handlerList)) {
            handlerList.forEach(function (handler) {
                handler(bean, propertyName, index, count, newElement);
            });
        }
        self.allArrayUpdatedHandlers.forEach(function (handler) {
            handler(bean, propertyName, index, count, newElement);
        });
    });

}


BeanManager.prototype.notifyBeanChange = function(bean, propertyName, newValue) {
    return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
};


BeanManager.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
};


BeanManager.prototype.isManaged = function(bean) {
    // TODO: Implement dolphin.isManaged() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.create = function(type) {
    // TODO: Implement dolphin.create() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.add = function(type, bean) {
    // TODO: Implement dolphin.add() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.addAll = function(type, collection) {
    // TODO: Implement dolphin.addAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.remove = function(bean) {
    // TODO: Implement dolphin.remove() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeAll = function(collection) {
    // TODO: Implement dolphin.removeAll() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.removeIf = function(predicate) {
    // TODO: Implement dolphin.removeIf() [DP-7]
    throw new Error("Not implemented yet");
};


BeanManager.prototype.onAdded = function(type, eventHandler) {
    var self = this;
    if (!exists(eventHandler)) {
        eventHandler = type;
        self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allAddedHandlers = self.allAddedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
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
        self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allRemovedHandlers = self.allRemovedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
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
        self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allUpdatedHandlers = self.allUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
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
        self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
        return {
            unsubscribe: function() {
                self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter(function(value) {
                    return value !== eventHandler;
                });
            }
        };
    } else {
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
},{"../bower_components/core.js/library/fn/map":1,"./polyfills.js":69,"./utils.js":70}],63:[function(_dereq_,module,exports){
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
var opendolphin = _dereq_('../libsrc/opendolphin.js');

var exists = _dereq_('./utils.js').exists;

var UNKNOWN = 0,
    BASIC_TYPE = 1,
    DOLPHIN_BEAN = 2;

var blocked = null;

function fromDolphin(classRepository, type, value) {
    return ! exists(value)? null
        : type === DOLPHIN_BEAN? classRepository.beanFromDolphin.get(value) : value;
}

function toDolphin(classRepository, value) {
    return typeof value === 'object'? classRepository.beanToDolphin.get(value) : value;
}

function sendListAdd(dolphin, modelId, propertyName, pos, element) {
    var attributes = [
        dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'),
        dolphin.attribute('source', null, modelId),
        dolphin.attribute('attribute', null, propertyName),
        dolphin.attribute('pos', null, pos),
        dolphin.attribute('element', null, element)
    ];
    dolphin.presentationModel.apply(dolphin, [null, '@@@ LIST_ADD @@@'].concat(attributes));
}

function sendListRemove(dolphin, modelId, propertyName, from, to) {
    var attributes = [
        dolphin.attribute('@@@ SOURCE_SYSTEM @@@', null, 'client'),
        dolphin.attribute('source', null, modelId),
        dolphin.attribute('attribute', null, propertyName),
        dolphin.attribute('from', null, from),
        dolphin.attribute('to', null, to)
    ];
    dolphin.presentationModel.apply(dolphin, [null, '@@@ LIST_DEL @@@'].concat(attributes));
}

function validateList(classRepository, type, bean, propertyName) {
    var list = bean[propertyName];
    if (!exists(list)) {
        classRepository.propertyUpdateHandlers.forEach(function(handler) {
            handler(type, bean, propertyName, [], undefined);
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
    var modelId = this.beanToDolphin.get(bean);
    if (exists(modelId)) {
        var model = this.dolphin.findPresentationModelById(modelId);
        if (exists(model)) {
            var classInfo = this.classes.get(model.presentationModelType);
            var type = classInfo[propertyName];
            var attribute = model.findAttributeByPropertyName(propertyName);
            if (exists(type) && exists(attribute)) {
                var oldValue = attribute.getValue();
                attribute.setValue(toDolphin(this, newValue));
                return fromDolphin(this, type, oldValue);
            }
        }
    }
};


ClassRepository.prototype.notifyArrayChange = function(bean, propertyName, index, count, removedElements) {
    if (isBlocked(bean, propertyName)) {
        return;
    }
    var modelId = this.beanToDolphin.get(bean);
    var array = bean[propertyName];
    if (exists(modelId) && exists(array)) {
        if (Array.isArray(removedElements) && removedElements.length > 0) {
            sendListRemove(this.dolphin, modelId, propertyName, index, index + removedElements.length);
        }
        for (var i = index; i < index + count; i++) {
            sendListAdd(this.dolphin, modelId, propertyName, i, toDolphin(this, array[i]));
        }
    }
};


ClassRepository.prototype.onBeanAdded = function(handler) {
    this.beanAddedHandlers.push(handler);
};


ClassRepository.prototype.onBeanRemoved = function(handler) {
    this.beanRemovedHandlers.push(handler);
};


ClassRepository.prototype.onBeanUpdate = function(handler) {
    this.propertyUpdateHandlers.push(handler);
};


ClassRepository.prototype.onArrayUpdate = function(handler) {
    this.arrayUpdateHandlers.push(handler);
};


ClassRepository.prototype.registerClass = function (model) {
    if (this.classes.has(model.id)) {
        return;
    }

    var classInfo = {};
    model.attributes.filter(function(attribute) {
        return attribute.propertyName.search(/^@@@ /) < 0;
    }).forEach(function (attribute) {
        classInfo[attribute.propertyName] = UNKNOWN;

        attribute.onValueChange(function (event) {
            classInfo[attribute.propertyName] = event.newValue;
        });
    });
    this.classes.set(model.id, classInfo);
};


ClassRepository.prototype.unregisterClass = function (model) {
    this.classes['delete'](model.id);
};


ClassRepository.prototype.load = function (model) {
    var self = this;
    var classInfo = this.classes.get(model.presentationModelType);
    var bean = {};
    model.attributes.filter(function (attribute) {
        return (attribute.tag === opendolphin.Tag.value()) && (attribute.propertyName.search(/^@@@ /) < 0);
    }).forEach(function (attribute) {
        bean[attribute.propertyName] = null;
        attribute.onValueChange(function (event) {
            if (event.oldValue !== event.newValue) {
                var oldValue = fromDolphin(self, classInfo[attribute.propertyName], event.oldValue);
                var newValue = fromDolphin(self, classInfo[attribute.propertyName], event.newValue);
                self.propertyUpdateHandlers.forEach(function(handler) {
                    handler(model.presentationModelType, bean, attribute.propertyName, newValue, oldValue);
                });
            }
        });
    });
    this.beanFromDolphin.set(model.id, bean);
    this.beanToDolphin.set(bean, model.id);
    this.classInfos.set(model.id, classInfo);
    this.beanAddedHandlers.forEach(function(handler) {
        handler(model.presentationModelType, bean);
    });
    return bean;
};


ClassRepository.prototype.unload = function(model) {
    var bean = this.beanFromDolphin.get(model.id);
    this.beanFromDolphin['delete'](model.id);
    this.beanToDolphin['delete'](bean);
    this.classInfos['delete'](model.id);
    if (exists(bean)) {
        this.beanRemovedHandlers.forEach(function(handler) {
            handler(model.presentationModelType, bean);
        });
    }
    return bean;
};


ClassRepository.prototype.addListEntry = function(model) {
    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var pos = model.findAttributeByPropertyName('pos');
    var element = model.findAttributeByPropertyName('element');

    if (exists(source) && exists(attribute) && exists(pos) && exists(element)) {
        var classInfo = this.classInfos.get(source.value);
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean) && exists(classInfo)) {
            var type = model.presentationModelType;
            var entry = fromDolphin(this, classInfo[attribute.value], element.value);
            validateList(this, type, bean, attribute.value);
            try {
                block(bean, attribute.value);
                this.arrayUpdateHandlers.forEach(function (handler) {
                    handler(type, bean, attribute.value, pos.value, 0, entry);
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


ClassRepository.prototype.delListEntry = function(model) {
    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var from = model.findAttributeByPropertyName('from');
    var to = model.findAttributeByPropertyName('to');

    if (exists(source) && exists(attribute) && exists(from) && exists(to)) {
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean)) {
            var type = model.presentationModelType;
            validateList(this, type, bean, attribute.value);
            try {
                block(bean, attribute.value);
                this.arrayUpdateHandlers.forEach(function (handler) {
                    handler(type, bean, attribute.value, from.value, to.value - from.value);
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


ClassRepository.prototype.setListEntry = function(model) {
    var source = model.findAttributeByPropertyName('source');
    var attribute = model.findAttributeByPropertyName('attribute');
    var pos = model.findAttributeByPropertyName('pos');
    var element = model.findAttributeByPropertyName('element');

    if (exists(source) && exists(attribute) && exists(pos) && exists(element)) {
        var classInfo = this.classInfos.get(source.value);
        var bean = this.beanFromDolphin.get(source.value);
        if (exists(bean) && exists(classInfo)) {
            var type = model.presentationModelType;
            var entry = fromDolphin(this, classInfo[attribute.value], element.value);
            validateList(this, type, bean, attribute.value);
            try {
                block(bean, attribute.value);
                this.arrayUpdateHandlers.forEach(function (handler) {
                    handler(type, bean, attribute.value, pos.value, 1, entry);
                });
            } finally {
                unblock();
            }
        } else {
            throw new Error("Invalid list modification update received. Source bean unknown.");
        }
    }else {
        throw new Error("Invalid list modification update received");
    }
};


ClassRepository.prototype.mapParamToDolphin = function(param) {
    if (!exists(param)) {
        return {value: param, type: UNKNOWN};
    }
    var type = typeof param;
    if (type === 'object') {
        var value = this.beanToDolphin.get(param);
        if (exists(value)) {
            return {value: value, type: DOLPHIN_BEAN};
        }
        throw new TypeError("Only managed Dolphin Beans can be used");
    }
    if (type === 'string' || type === 'number' || type === 'boolean') {
        return {value: param, type: BASIC_TYPE};
    }
    throw new TypeError("Only managed Dolphin Beans and primitive types can be used");
};


ClassRepository.prototype.mapDolphinToBean = function(value, type) {
    return fromDolphin(this, type, value);
};



exports.ClassRepository = ClassRepository;
exports.UNKNOWN = UNKNOWN;
exports.BASIC_TYPE = BASIC_TYPE;
exports.DOLPHIN_BEAN = DOLPHIN_BEAN;

},{"../bower_components/core.js/library/fn/map":1,"../libsrc/opendolphin.js":61,"./polyfills.js":69,"./utils.js":70}],64:[function(_dereq_,module,exports){
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
var exists = _dereq_('./utils.js').exists;



function ClientContext(dolphin, beanManager, controllerManager) {
    this.dolphin = dolphin;
    this.beanManager = beanManager;
    this._controllerManager = controllerManager;
}


ClientContext.prototype.createController = function(name) {
    return this._controllerManager.createController(name);
};


ClientContext.prototype.disconnect = function() {
    // TODO: Implement ClientContext.disconnect [DP-46]
    this.dolphin.stopPushListening();
};



exports.ClientContext = ClientContext;
},{"../bower_components/core.js/library/fn/promise":2,"./polyfills.js":69,"./utils.js":70}],65:[function(_dereq_,module,exports){
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
var opendolphin = _dereq_('../libsrc/opendolphin.js');
var exists = _dereq_('./utils.js').exists;


var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var POLL_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'longPoll';
var RELEASE_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'release';

var DOLPHIN_BEAN = '@@@ DOLPHIN_BEAN @@@';
var ACTION_CALL_BEAN = '@@@ CONTROLLER_ACTION_CALL_BEAN @@@';
var HIGHLANDER_BEAN = '@@@ HIGHLANDER_BEAN @@@';
var DOLPHIN_LIST_ADD = '@@@ LIST_ADD @@@';
var DOLPHIN_LIST_DEL = '@@@ LIST_DEL @@@';
var DOLPHIN_LIST_SET = '@@@ LIST_SET @@@';
var SOURCE_SYSTEM = '@@@ SOURCE_SYSTEM @@@';
var SOURCE_SYSTEM_CLIENT = 'client';
var SOURCE_SYSTEM_SERVER = 'server';



var initializer;

function Connector(url, dolphin, classRepository, config) {
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
        case DOLPHIN_LIST_ADD:
            this.classRepository.addListEntry(model);
            this.dolphin.deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_DEL:
            this.classRepository.delListEntry(model);
            this.dolphin.deletePresentationModel(model);
            break;
        case DOLPHIN_LIST_SET:
            this.classRepository.setListEntry(model);
            this.dolphin.deletePresentationModel(model);
            break;
        default:
            this.classRepository.load(model);
            break;
    }
};


Connector.prototype.onModelRemoved = function(model) {
    var type = model.presentationModelType;
    switch (type) {
        case DOLPHIN_BEAN:
            this.classRepository.unregisterClass(model);
            break;
        case DOLPHIN_LIST_ADD:
        case DOLPHIN_LIST_DEL:
        case DOLPHIN_LIST_SET:
            // do nothing
            break;
        default:
            this.classRepository.unload(model);
            break;
    }
};


Connector.prototype.invoke = function(command) {
    var dolphin = this.dolphin;
    return new Promise(function(resolve) {
        // TODO: This needs to be synchronized with changes pushed via BeanManager
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

},{"../bower_components/core.js/library/fn/promise":2,"../libsrc/opendolphin.js":61,"./polyfills.js":69,"./utils.js":70}],66:[function(_dereq_,module,exports){
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
var exists = _dereq_('./utils.js').exists;
var ControllerProxy = _dereq_('./controllerproxy.js').ControllerProxy;

var DOLPHIN_BEAN_TYPE = _dereq_('./classrepo.js').DOLPHIN_BEAN;

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
    this.dolphin = dolphin;
    this.classRepository = classRepository;
    this.connector = connector;
}


ControllerManager.prototype.createController = function(name) {
    var self = this;
    var controllerId, modelId, model;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            highlanderPM.findAttributeByPropertyName(CONTROLLER_NAME).setValue(name);
            self.connector.invoke(REGISTER_CONTROLLER_COMMAND_NAME).then(function() {
                controllerId = highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).getValue();
                modelId = highlanderPM.findAttributeByPropertyName(MODEL).getValue();
                model = self.classRepository.mapDolphinToBean(modelId, DOLPHIN_BEAN_TYPE);
                resolve(new ControllerProxy(controllerId, model, self));
            });
        });
    });
};


ControllerManager.prototype.invokeAction = function(controllerId, actionName, params) {
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
                    attributes.push(self.dolphin.attribute(PARAM_PREFIX + prop, null, param.value, 'VALUE'));
                    attributes.push(self.dolphin.attribute(PARAM_PREFIX + prop, null, param.type, 'VALUE_TYPE'));
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


ControllerManager.prototype.destroyController = function(controllerId) {
    var self = this;
    return new Promise(function(resolve) {
        self.connector.getHighlanderPM().then(function (highlanderPM) {
            highlanderPM.findAttributeByPropertyName(CONTROLLER_ID).setValue(controllerId);
            self.connector.invoke(DESTROY_CONTROLLER_COMMAND_NAME).then(resolve);
        });
    });
};



exports.ControllerManager = ControllerManager;

},{"../bower_components/core.js/library/fn/promise":2,"./classrepo.js":63,"./connector.js":65,"./controllerproxy.js":67,"./polyfills.js":69,"./utils.js":70}],67:[function(_dereq_,module,exports){
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
var exists = _dereq_('./utils.js').exists;



function ControllerProxy(controllerId, model, manager) {
    this.controllerId = controllerId;
    this.model = model;
    this.manager = manager;
    this.destroyed = false;
}


ControllerProxy.prototype.invoke = function(name, params) {
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
    return this.manager.destroyController(this);
};



exports.ControllerProxy = ControllerProxy;

},{"../bower_components/core.js/library/fn/promise":2,"./polyfills.js":69,"./utils.js":70}],68:[function(_dereq_,module,exports){
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
var opendolphin = _dereq_('../libsrc/opendolphin.js');

var exists = _dereq_('./utils.js').exists;
var Connector = _dereq_('./connector.js').Connector;
var BeanManager = _dereq_('./beanmanager.js').BeanManager;
var ClassRepository = _dereq_('./classrepo.js').ClassRepository;
var ControllerManager = _dereq_('./controllermanager.js').ControllerManager;
var ClientContext = _dereq_('./clientcontext.js').ClientContext;

var DOLPHIN_PLATFORM_PREFIX = 'dolphin_platform_intern_';
var INIT_COMMAND_NAME = DOLPHIN_PLATFORM_PREFIX + 'initClientContext';

exports.connect = function(url, config) {
    var builder = opendolphin.makeDolphin().url(url).reset(false).slackMS(4).supportCORS(true);
    if (exists(config) && exists(config.errorHandler)) {
        builder.errorHandler(config.errorHandler);
    }
    var dolphin = builder.build();

    var classRepository = new ClassRepository(dolphin);
    var beanManager = new BeanManager(classRepository);
    var connector = new Connector(url, dolphin, classRepository, config);
    var controllerManager = new ControllerManager(dolphin, classRepository, connector);

    var clientContext = new ClientContext(dolphin, beanManager, controllerManager);

    connector.invoke(INIT_COMMAND_NAME);

    return clientContext;
};

},{"../libsrc/opendolphin.js":61,"./beanmanager.js":62,"./classrepo.js":63,"./clientcontext.js":64,"./connector.js":65,"./controllermanager.js":66,"./polyfills.js":69,"./utils.js":70}],69:[function(_dereq_,module,exports){
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
},{}],70:[function(_dereq_,module,exports){
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

module.exports.exists = function(object) {
    return typeof object !== 'undefined' && object !== null;
};

},{}]},{},[68])(68)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmEtZnVuY3Rpb24uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmFuLW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5jbGFzc29mLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXN0cm9uZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuY29sbGVjdGlvbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5jb3JlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmN0eC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5kZWZpbmVkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlc2NyaXB0b3JzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmRvbS1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuZXhwb3J0LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmZhaWxzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmZvci1vZi5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaGFzLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmhpZGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaHRtbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5pbnZva2UuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLmlzLW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1jcmVhdGUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1zdGVwLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXJhdG9ycy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5saWJyYXJ5LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLm1pY3JvdGFzay5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnJlZGVmaW5lLWFsbC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5yZWRlZmluZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLXZhbHVlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnNldC1wcm90by5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtc3BlY2llcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtdG8tc3RyaW5nLXRhZy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5zaGFyZWQuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQuc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnN0cmluZy1hdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC50YXNrLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQudG8taW9iamVjdC5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvJC50by1sZW5ndGguanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy8kLndrcy5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5tYXAuanMiLCJib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsImJvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwiYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibGlic3JjL29wZW5kb2xwaGluLmpzIiwic3JjL2JlYW5tYW5hZ2VyLmpzIiwic3JjL2NsYXNzcmVwby5qcyIsInNyYy9jbGllbnRjb250ZXh0LmpzIiwic3JjL2Nvbm5lY3Rvci5qcyIsInNyYy9jb250cm9sbGVybWFuYWdlci5qcyIsInNyYy9jb250cm9sbGVycHJveHkuanMiLCJzcmMvZG9scGhpbi5qcyIsInNyYy9wb2x5ZmlsbHMuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0dkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzLyQuY29yZScpLk1hcDsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYucHJvbWlzZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzLyQuY29yZScpLlByb21pc2U7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBoaWRlICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGlkZScpXG4gICwgcmVkZWZpbmVBbGwgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lLWFsbCcpXG4gICwgY3R4ICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgc3RyaWN0TmV3ICAgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGRlZmluZWQgICAgICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCAkaXRlckRlZmluZSAgPSByZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKVxuICAsIHN0ZXAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLXN0ZXAnKVxuICAsIElEICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKSgnaWQnKVxuICAsICRoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIGlzT2JqZWN0ICAgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIHNldFNwZWNpZXMgICA9IHJlcXVpcmUoJy4vJC5zZXQtc3BlY2llcycpXG4gICwgREVTQ1JJUFRPUlMgID0gcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJylcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgU0laRSAgICAgICAgID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnXG4gICwgaWQgICAgICAgICAgID0gMDtcblxudmFyIGZhc3RLZXkgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCEkaGFzKGl0LCBJRCkpe1xuICAgIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcbiAgICBoaWRlKGl0LCBJRCwgKytpZCk7XG4gIC8vIHJldHVybiBvYmplY3QgaWQgd2l0aCBwcmVmaXhcbiAgfSByZXR1cm4gJ08nICsgaXRbSURdO1xufTtcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24odGhhdCwga2V5KXtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XG4gIGlmKGluZGV4ICE9PSAnRicpcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBzdHJpY3ROZXcodGhhdCwgQywgTkFNRSk7XG4gICAgICB0aGF0Ll9pID0gJC5jcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXQuX2YgPT0gZW50cnkpdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdC5fbCA9PSBlbnRyeSl0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZil7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZihERVNDUklQVE9SUykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgZm9yT2YgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIGNsYXNzb2YgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRvSlNPTigpe1xuICAgIGlmKGNsYXNzb2YodGhpcykgIT0gTkFNRSl0aHJvdyBUeXBlRXJyb3IoTkFNRSArIFwiI3RvSlNPTiBpc24ndCBnZW5lcmljXCIpO1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICBmb3JPZih0aGlzLCBmYWxzZSwgYXJyLnB1c2gsIGFycik7XG4gICAgcmV0dXJuIGFycjtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIHJlZGVmaW5lQWxsICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lLWFsbCcpXG4gICwgZm9yT2YgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzdHJpY3ROZXcgICAgICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBpc09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24oKXtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgIHN0cmljdE5ldyh0YXJnZXQsIEMsIE5BTUUpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICAkLmVhY2guY2FsbCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMnLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSloaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICBpZighSVNfQURERVIgJiYgSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkpcmV0dXJuIEtFWSA9PSAnZ2V0JyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBJU19BRERFUiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pJC5zZXREZXNjKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiwgTyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuNid9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICBpZihJU19QUk9UTykoZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSkpW2tleV0gPSBvdXQ7XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7IC8vIHdyYXBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XG4gIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3I7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLmhpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90byAgICAgICA9IHJlcXVpcmUoJy4vJCcpLmdldFByb3RvXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCBtZXRob2RzLCBrZXk7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJG5hdGl2ZSl7XG4gICAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8oJGRlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xuICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAvLyBGRiBmaXhcbiAgICBpZighTElCUkFSWSAmJiBoYXMocHJvdG8sIEZGX0lURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICAgIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICAgIH1cbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJylcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgc2FmZSA9IHRydWU7IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgbWFjcm90YXNrID0gcmVxdWlyZSgnLi8kLnRhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG52YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICB2YXIgcGFyZW50LCBkb21haW4sIGZuO1xuICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSl7XG4gICAgcHJvY2Vzcy5kb21haW4gPSBudWxsO1xuICAgIHBhcmVudC5leGl0KCk7XG4gIH1cbiAgd2hpbGUoaGVhZCl7XG4gICAgZG9tYWluID0gaGVhZC5kb21haW47XG4gICAgZm4gICAgID0gaGVhZC5mbjtcbiAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgZm4oKTsgLy8gPC0gY3VycmVudGx5IHdlIHVzZSBpdCBvbmx5IGZvciBQcm9taXNlIC0gdHJ5IC8gY2F0Y2ggbm90IHJlcXVpcmVkXG4gICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG59O1xuXG4vLyBOb2RlLmpzXG5pZihpc05vZGUpe1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xuLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG59IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICB2YXIgdG9nZ2xlID0gMVxuICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAtdG9nZ2xlO1xuICB9O1xuLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2Vcbn0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmbHVzaCk7XG4gIH07XG4vLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuLy8gLSBzZXRJbW1lZGlhdGVcbi8vIC0gTWVzc2FnZUNoYW5uZWxcbi8vIC0gd2luZG93LnBvc3RNZXNzYWdcbi8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4vLyAtIHNldFRpbWVvdXRcbn0gZWxzZSB7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFzYXAoZm4pe1xuICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZCwgZG9tYWluOiBpc05vZGUgJiYgcHJvY2Vzcy5kb21haW59O1xuICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gIGlmKCFoZWFkKXtcbiAgICBoZWFkID0gdGFzaztcbiAgICBub3RpZnkoKTtcbiAgfSBsYXN0ID0gdGFzaztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYyl7XG4gIGZvcih2YXIga2V5IGluIHNyYylyZWRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5oaWRlJyk7IiwiLy8gNy4yLjkgU2FtZVZhbHVlKHgsIHkpXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5pcyB8fCBmdW5jdGlvbiBpcyh4LCB5KXtcbiAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBnZXREZXNjICA9IHJlcXVpcmUoJy4vJCcpLmdldERlc2NcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBnZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvcmUgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IGNvcmVbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi8kJykuc2V0RGVzY1xuICAsIGhhcyA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIEQpe1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yLCBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl0aHJvdyBUeXBlRXJyb3IobmFtZSArIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi8kLnRvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBpbnZva2UgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcbiAgLCBodG1sICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0bmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vJC5jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmKE1lc3NhZ2VDaGFubmVsKXtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdG5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vJC5pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vJC5hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTsiLCIiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgTElCUkFSWSAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY3R4ICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNsYXNzb2YgICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJylcbiAgLCBzdHJpY3ROZXcgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGZvck9mICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzZXRQcm90byAgID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldFxuICAsIHNhbWUgICAgICAgPSByZXF1aXJlKCcuLyQuc2FtZS12YWx1ZScpXG4gICwgU1BFQ0lFUyAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIGFzYXAgICAgICAgPSByZXF1aXJlKCcuLyQubWljcm90YXNrJylcbiAgLCBQUk9NSVNFICAgID0gJ1Byb21pc2UnXG4gICwgcHJvY2VzcyAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgUCAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIFdyYXBwZXI7XG5cbnZhciB0ZXN0UmVzb2x2ZSA9IGZ1bmN0aW9uKHN1Yil7XG4gIHZhciB0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBPYmplY3Q7XG4gIHJldHVybiBQLnJlc29sdmUodGVzdCkgPT09IHRlc3Q7XG59O1xuXG52YXIgVVNFX05BVElWRSA9IGZ1bmN0aW9uKCl7XG4gIHZhciB3b3JrcyA9IGZhbHNlO1xuICBmdW5jdGlvbiBQMih4KXtcbiAgICB2YXIgc2VsZiA9IG5ldyBQKHgpO1xuICAgIHNldFByb3RvKHNlbGYsIFAyLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgdHJ5IHtcbiAgICB3b3JrcyA9IFAgJiYgUC5yZXNvbHZlICYmIHRlc3RSZXNvbHZlKCk7XG4gICAgc2V0UHJvdG8oUDIsIFApO1xuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFAyLnJlc29sdmUoNSkudGhlbihmdW5jdGlvbigpe30pIGluc3RhbmNlb2YgUDIpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGFjdHVhbCBWOCBidWcsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTYyXG4gICAgaWYod29ya3MgJiYgcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJykpe1xuICAgICAgdmFyIHRoZW5hYmxlVGhlbkdvdHRlbiA9IGZhbHNlO1xuICAgICAgUC5yZXNvbHZlKCQuc2V0RGVzYyh7fSwgJ3RoZW4nLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhlbmFibGVUaGVuR290dGVuID0gdHJ1ZTsgfVxuICAgICAgfSkpO1xuICAgICAgd29ya3MgPSB0aGVuYWJsZVRoZW5Hb3R0ZW47XG4gICAgfVxuICB9IGNhdGNoKGUpeyB3b3JrcyA9IGZhbHNlOyB9XG4gIHJldHVybiB3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIGlmKExJQlJBUlkgJiYgYSA9PT0gUCAmJiBiID09PSBXcmFwcGVyKXJldHVybiB0cnVlO1xuICByZXR1cm4gc2FtZShhLCBiKTtcbn07XG52YXIgZ2V0Q29uc3RydWN0b3IgPSBmdW5jdGlvbihDKXtcbiAgdmFyIFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXTtcbiAgcmV0dXJuIFMgIT0gdW5kZWZpbmVkID8gUyA6IEM7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSksXG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpXG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocmVjb3JkLCBpc1JlamVjdCl7XG4gIGlmKHJlY29yZC5uKXJldHVybjtcbiAgcmVjb3JkLm4gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSByZWNvcmQuYztcbiAgYXNhcChmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XG4gICAgICAsIG9rICAgID0gcmVjb3JkLnMgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIgPT09IHRydWUgPyB2YWx1ZSA6IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBjaGFpbi5sZW5ndGggPSAwO1xuICAgIHJlY29yZC5uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3Qpc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgdmFyIHByb21pc2UgPSByZWNvcmQucFxuICAgICAgICAsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gcmVjb3JkLmEgPSB1bmRlZmluZWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB2YXIgcmVjb3JkID0gcHJvbWlzZS5fZFxuICAgICwgY2hhaW4gID0gcmVjb3JkLmEgfHwgcmVjb3JkLmNcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICBpZihyZWNvcmQuaClyZXR1cm4gZmFsc2U7XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgcmVjb3JkLnMgPSAyO1xuICByZWNvcmQuYSA9IHJlY29yZC5jLnNsaWNlKCk7XG4gIG5vdGlmeShyZWNvcmQsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHJlY29yZCA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHJlY29yZC5kKXJldHVybjtcbiAgcmVjb3JkLmQgPSB0cnVlO1xuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHJlY29yZC5wID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgYXNhcChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xuICAgICAgcmVjb3JkLnMgPSAxO1xuICAgICAgbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe3I6IHJlY29yZCwgZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICBQID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICB2YXIgcmVjb3JkID0gdGhpcy5fZCA9IHtcbiAgICAgIHA6IHN0cmljdE5ldyh0aGlzLCBQLCBQUk9NSVNFKSwgICAgICAgICAvLyA8LSBwcm9taXNlXG4gICAgICBjOiBbXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgICBhOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICAgIHY6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgaDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICBuOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgoJHJlamVjdCwgcmVjb3JkLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcbiAgICB9XG4gIH07XG4gIHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKShQLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIFApKVxuICAgICAgICAsIHByb21pc2UgID0gcmVhY3Rpb24ucHJvbWlzZVxuICAgICAgICAsIHJlY29yZCAgID0gdGhpcy5fZDtcbiAgICAgIHJlYWN0aW9uLm9rICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWNvcmQuYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHJlY29yZC5hKXJlY29yZC5hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYocmVjb3JkLnMpbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiBQfSk7XG5yZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKShQLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vJC5zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vJC5jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgdGVzdFJlc29sdmUodHJ1ZSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgUCAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgUC5hbGwoaXRlcilbJ2NhdGNoJ10oZnVuY3Rpb24oKXt9KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdFxuICAgICAgLCB2YWx1ZXMgICAgID0gW107XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XG4gICAgICAgIHZhciBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIGVsc2UgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdNYXAnLCB7dG9KU09OOiByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpfSk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJyk7XG5JdGVyYXRvcnMuTm9kZUxpc3QgPSBJdGVyYXRvcnMuSFRNTENvbGxlY3Rpb24gPSBJdGVyYXRvcnMuQXJyYXk7IiwidmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBBdHRyaWJ1dGUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBBdHRyaWJ1dGUoKSB7XG4gICAgICAgIH1cbiAgICAgICAgQXR0cmlidXRlLlFVQUxJRklFUl9QUk9QRVJUWSA9IFwicXVhbGlmaWVyXCI7XG4gICAgICAgIEF0dHJpYnV0ZS5ESVJUWV9QUk9QRVJUWSA9IFwiZGlydHlcIjtcbiAgICAgICAgQXR0cmlidXRlLkJBU0VfVkFMVUUgPSBcImJhc2VWYWx1ZVwiO1xuICAgICAgICBBdHRyaWJ1dGUuVkFMVUUgPSBcInZhbHVlXCI7XG4gICAgICAgIEF0dHJpYnV0ZS5UQUcgPSBcInRhZ1wiO1xuICAgICAgICByZXR1cm4gQXR0cmlidXRlO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uQXR0cmlidXRlID0gQXR0cmlidXRlO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ29tbWFuZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENvbW1hbmQoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJkb2xwaGluLWNvcmUtY29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb21tYW5kO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uQ29tbWFuZCA9IENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBUYWcgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBUYWcoKSB7XG4gICAgICAgIH1cbiAgICAgICAgLy9JbXBsZW1lbnRlZCBhcyBmdW5jdGlvbiBzbyB0aGF0IGl0IHdpbGwgbmV2ZXIgYmUgY2hhbmdlZCBmcm9tIG91dHNpZGVcbiAgICAgICAgLyoqIFRoZSBhY3R1YWwgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS4gVGhpcyBpcyB0aGUgZGVmYXVsdCBpZiBubyB0YWcgaXMgZ2l2ZW4uKi9cbiAgICAgICAgVGFnLnZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVkFMVUVcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIHRoZSB0by1iZS1kaXNwbGF5ZWQgU3RyaW5nLCBub3QgdGhlIGtleS4gSTE4TiBoYXBwZW5zIG9uIHRoZSBzZXJ2ZXIuICovXG4gICAgICAgIFRhZy5sYWJlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIkxBQkVMXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiBJZiB0aGUgYXR0cmlidXRlIHJlcHJlc2VudCB0b29sdGlwKiovXG4gICAgICAgIFRhZy50b29sdGlwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVE9PTFRJUFwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogXCJ0cnVlXCIgb3IgXCJmYWxzZVwiLCBtYXBzIHRvIEdyYWlscyBjb25zdHJhaW50IG51bGxhYmxlOmZhbHNlICovXG4gICAgICAgIFRhZy5tYW5kYXRvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJNQU5EQVRPUllcIjtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqIFwidHJ1ZVwiIG9yIFwiZmFsc2VcIiwgbWFwcyB0byBHcmFpbHMgY29uc3RyYWludCBkaXNwbGF5OnRydWUgKi9cbiAgICAgICAgVGFnLnZpc2libGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJWSVNJQkxFXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiBcInRydWVcIiBvciBcImZhbHNlXCIgKi9cbiAgICAgICAgVGFnLmVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJFTkFCTEVEXCI7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiByZWd1bGFyIGV4cHJlc3Npb24gZm9yIGxvY2FsLCBzeW50YWN0aWNhbCBjb25zdHJhaW50cyBsaWtlIGluIFwicmVqZWN0RmllbGRcIiAqL1xuICAgICAgICBUYWcucmVnZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJSRUdFWFwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogYSBzaW5nbGUgdGV4dDsgZS5nLiBcInRleHRBcmVhXCIgaWYgdGhlIFN0cmluZyB2YWx1ZSBzaG91bGQgYmUgZGlzcGxheWVkIGluIGEgdGV4dCBhcmVhIGluc3RlYWQgb2YgYSB0ZXh0RmllbGQgKi9cbiAgICAgICAgVGFnLndpZGdldEhpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJXSURHRVRfSElOVFwiO1xuICAgICAgICB9O1xuICAgICAgICAvKiogYSBzaW5nbGUgdGV4dDsgZS5nLiBcImphdmEudXRpbC5EYXRlXCIgaWYgdGhlIHZhbHVlIFN0cmluZyByZXByZXNlbnRzIGEgZGF0ZSAqL1xuICAgICAgICBUYWcudmFsdWVUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVkFMVUVfVFlQRVwiO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gVGFnO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uVGFnID0gVGFnO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJUYWcudHNcIiAvPlxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgIGQucHJvdG90eXBlID0gbmV3IF9fKCk7XG59O1xudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBBdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb24sIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb24ocG1JZCwgYXR0cmlidXRlSWQsIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIHF1YWxpZmllciwgdGFnKSB7XG4gICAgICAgICAgICBpZiAodGFnID09PSB2b2lkIDApIHsgdGFnID0gb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCk7IH1cbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgdGhpcy5uZXdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy5xdWFsaWZpZXIgPSBxdWFsaWZpZXI7XG4gICAgICAgICAgICB0aGlzLnRhZyA9IHRhZztcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnQXR0cmlidXRlQ3JlYXRlZCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5BdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb247XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbiA9IEF0dHJpYnV0ZUNyZWF0ZWROb3RpZmljYXRpb247XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlSWQsIG1ldGFkYXRhTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICAgICAgdGhpcy5tZXRhZGF0YU5hbWUgPSBtZXRhZGF0YU5hbWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0F0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5BdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkQ29tbWFuZCA9IEF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBCYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhCYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQmFzZVZhbHVlQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVJZCA9IGF0dHJpYnV0ZUlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdCYXNlVmFsdWVDaGFuZ2VkJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kID0gQmFzZVZhbHVlQ2hhbmdlZENvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBDYWxsTmFtZWRBY3Rpb25Db21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKENhbGxOYW1lZEFjdGlvbkNvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIENhbGxOYW1lZEFjdGlvbkNvbW1hbmQoYWN0aW9uTmFtZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmFjdGlvbk5hbWUgPSBhY3Rpb25OYW1lO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdDYWxsTmFtZWRBY3Rpb24nO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDYWxsTmFtZWRBY3Rpb25Db21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkNhbGxOYW1lZEFjdGlvbkNvbW1hbmQgPSBDYWxsTmFtZWRBY3Rpb25Db21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kKGF0dHJpYnV0ZUlkLCBtZXRhZGF0YU5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlSWQgPSBhdHRyaWJ1dGVJZDtcbiAgICAgICAgICAgIHRoaXMubWV0YWRhdGFOYW1lID0gbWV0YWRhdGFOYW1lO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YSc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ2hhbmdlQXR0cmlidXRlTWV0YWRhdGFDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZCA9IENoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEV2ZW50QnVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gRXZlbnRCdXMoKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBFdmVudEJ1cy5wcm90b3R5cGUub25FdmVudCA9IGZ1bmN0aW9uIChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5wdXNoKGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50QnVzLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7IHJldHVybiBoYW5kbGUoZXZlbnQpOyB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEV2ZW50QnVzO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uRXZlbnRCdXMgPSBFdmVudEJ1cztcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFdmVudEJ1cy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVGFnLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxJbnN0YW5jZUNvdW50ID0gMDsgLy8gdG9kbyBkazogY29uc2lkZXIgbWFraW5nIHRoaXMgc3RhdGljIGluIGNsYXNzXG4gICAgdmFyIENsaWVudFByZXNlbnRhdGlvbk1vZGVsID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoaWQsIHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbFR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50U2lkZU9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaWQgIT09ICd1bmRlZmluZWQnICYmIGlkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlkID0gKHByZXNlbnRhdGlvbk1vZGVsSW5zdGFuY2VDb3VudCsrKS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkQnVzID0gbmV3IG9wZW5kb2xwaGluLkV2ZW50QnVzKCk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMgPSBuZXcgb3BlbmRvbHBoaW4uRXZlbnRCdXMoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0b2RvIGRrOiBhbGlnbiB3aXRoIEphdmEgdmVyc2lvbjogbW92ZSB0byBDbGllbnREb2xwaGluIGFuZCBhdXRvLWFkZCB0byBtb2RlbCBzdG9yZVxuICAgICAgICAvKiogYSBjb3B5IGNvbnN0cnVjdG9yIGZvciBhbnl0aGluZyBidXQgSURzLiBQZXIgZGVmYXVsdCwgY29waWVzIGFyZSBjbGllbnQgc2lkZSBvbmx5LCBubyBhdXRvbWF0aWMgdXBkYXRlIGFwcGxpZXMuICovXG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDbGllbnRQcmVzZW50YXRpb25Nb2RlbChudWxsLCB0aGlzLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICByZXN1bHQuY2xpZW50U2lkZU9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZUNvcHkgPSBhdHRyaWJ1dGUuY29weSgpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRBdHRyaWJ1dGUoYXR0cmlidXRlQ29weSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIC8vYWRkIGFycmF5IG9mIGF0dHJpYnV0ZXNcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmFkZEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlcyB8fCBhdHRyaWJ1dGVzLmxlbmd0aCA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuYWRkQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgKHRoaXMuYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWVBbmRUYWcoYXR0cmlidXRlLnByb3BlcnR5TmFtZSwgYXR0cmlidXRlLnRhZykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGFuIGF0dHJpYnV0ZSB3aXRoIHByb3BlcnR5IG5hbWU6IFwiICsgYXR0cmlidXRlLnByb3BlcnR5TmFtZVxuICAgICAgICAgICAgICAgICAgICArIFwiIGFuZCB0YWc6IFwiICsgYXR0cmlidXRlLnRhZyArIFwiIGluIHByZXNlbnRhdGlvbiBtb2RlbCB3aXRoIGlkOiBcIiArIHRoaXMuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSAmJiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgYWxyZWFkeSBpcyBhbiBhdHRyaWJ1dGUgd2l0aCBxdWFsaWZpZXI6IFwiICsgYXR0cmlidXRlLmdldFF1YWxpZmllcigpXG4gICAgICAgICAgICAgICAgICAgICsgXCIgaW4gcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQ6IFwiICsgdGhpcy5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGUuc2V0UHJlc2VudGF0aW9uTW9kZWwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS50YWcgPT0gb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZURpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGUub25WYWx1ZUNoYW5nZShmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW52YWxpZEJ1cy50cmlnZ2VyKHsgc291cmNlOiBfdGhpcyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUudXBkYXRlRGlydHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uaXNEaXJ0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGlydHkodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICB0aGlzLnNldERpcnR5KGZhbHNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLnVwZGF0ZUF0dHJpYnV0ZURpcnR5bmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW2ldLnVwZGF0ZURpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5pc0RpcnR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlydHk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5zZXREaXJ0eSA9IGZ1bmN0aW9uIChkaXJ0eSkge1xuICAgICAgICAgICAgdmFyIG9sZFZhbCA9IHRoaXMuZGlydHk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gZGlydHk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFZhbCwgJ25ld1ZhbHVlJzogdGhpcy5kaXJ0eSB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5yZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5yZWJhc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlLnJlYmFzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5vbkRpcnR5ID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eVZhbHVlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLm9uSW52YWxpZGF0ZWQgPSBmdW5jdGlvbiAoaGFuZGxlSW52YWxpZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkQnVzLm9uRXZlbnQoaGFuZGxlSW52YWxpZGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKiByZXR1cm5zIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgc3RhdGUgKi9cbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmdldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnNsaWNlKDApO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZ2V0QXQgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lLCB0YWcpIHtcbiAgICAgICAgICAgIGlmICh0YWcgPT09IHZvaWQgMCkgeyB0YWcgPSBvcGVuZG9scGhpbi5UYWcudmFsdWUoKTsgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lQW5kVGFnKHByb3BlcnR5TmFtZSwgdGFnKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZUFuZFRhZyhwcm9wZXJ0eU5hbWUsIG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBbGxBdHRyaWJ1dGVzQnlQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudFByZXNlbnRhdGlvbk1vZGVsLnByb3RvdHlwZS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWVBbmRUYWcgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lLCB0YWcpIHtcbiAgICAgICAgICAgIGlmICghcHJvcGVydHlOYW1lIHx8ICF0YWcpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgodGhpcy5hdHRyaWJ1dGVzW2ldLnByb3BlcnR5TmFtZSA9PSBwcm9wZXJ0eU5hbWUpICYmICh0aGlzLmF0dHJpYnV0ZXNbaV0udGFnID09IHRhZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLmZpbmRBdHRyaWJ1dGVCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChxdWFsaWZpZXIpIHtcbiAgICAgICAgICAgIGlmICghcXVhbGlmaWVyKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzW2ldLmdldFF1YWxpZmllcigpID09IHF1YWxpZmllcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRQcmVzZW50YXRpb25Nb2RlbC5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZUJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIGlmICghaWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXNbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJvdG90eXBlLnN5bmNXaXRoID0gZnVuY3Rpb24gKHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZUF0dHJpYnV0ZSA9IHNvdXJjZVByZXNlbnRhdGlvbk1vZGVsLmdldEF0KHRhcmdldEF0dHJpYnV0ZS5wcm9wZXJ0eU5hbWUsIHRhcmdldEF0dHJpYnV0ZS50YWcpO1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QXR0cmlidXRlLnN5bmNXaXRoKHNvdXJjZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBDbGllbnRQcmVzZW50YXRpb25Nb2RlbDtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkNsaWVudFByZXNlbnRhdGlvbk1vZGVsID0gQ2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFdmVudEJ1cy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVGFnLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ2xpZW50QXR0cmlidXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gQ2xpZW50QXR0cmlidXRlKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSwgdGFnKSB7XG4gICAgICAgICAgICBpZiAodGFnID09PSB2b2lkIDApIHsgdGFnID0gb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCk7IH1cbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgdGhpcy50YWcgPSB0YWc7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJcIiArIChDbGllbnRBdHRyaWJ1dGUuY2xpZW50QXR0cmlidXRlSW5zdGFuY2VDb3VudCsrKSArIFwiQ1wiO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZUJ1cyA9IG5ldyBvcGVuZG9scGhpbi5FdmVudEJ1cygpO1xuICAgICAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMgPSBuZXcgb3BlbmRvbHBoaW4uRXZlbnRCdXMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHlWYWx1ZUNoYW5nZUJ1cyA9IG5ldyBvcGVuZG9scGhpbi5FdmVudEJ1cygpO1xuICAgICAgICAgICAgdGhpcy5iYXNlVmFsdWVDaGFuZ2VCdXMgPSBuZXcgb3BlbmRvbHBoaW4uRXZlbnRCdXMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zZXRCYXNlVmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zZXRRdWFsaWZpZXIocXVhbGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgICAvKiogYSBjb3B5IGNvbnN0cnVjdG9yIHdpdGggbmV3IGlkIGFuZCBubyBwcmVzZW50YXRpb24gbW9kZWwgKi9cbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDbGllbnRBdHRyaWJ1dGUodGhpcy5wcm9wZXJ0eU5hbWUsIHRoaXMuZ2V0UXVhbGlmaWVyKCksIHRoaXMuZ2V0VmFsdWUoKSwgdGhpcy50YWcpO1xuICAgICAgICAgICAgcmVzdWx0LnNldEJhc2VWYWx1ZSh0aGlzLmdldEJhc2VWYWx1ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuaXNEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpcnR5O1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmdldEJhc2VWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhc2VWYWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXRQcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIllvdSBjYW4gbm90IHNldCBhIHByZXNlbnRhdGlvbiBtb2RlbCBmb3IgYW4gYXR0cmlidXRlIHRoYXQgaXMgYWxyZWFkeSBib3VuZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsID0gcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0UHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW50YXRpb25Nb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdmVyaWZpZWRWYWx1ZSA9IENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09IHZlcmlmaWVkVmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2ZXJpZmllZFZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXREaXJ0eSh0aGlzLmNhbGN1bGF0ZURpcnR5KHRoaXMuYmFzZVZhbHVlLCB2ZXJpZmllZFZhbHVlKSk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnb2xkVmFsdWUnOiBvbGRWYWx1ZSwgJ25ld1ZhbHVlJzogdmVyaWZpZWRWYWx1ZSB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5jYWxjdWxhdGVEaXJ0eSA9IGZ1bmN0aW9uIChiYXNlVmFsdWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoYmFzZVZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlVmFsdWUgIT0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5wcm90b3R5cGUudXBkYXRlRGlydHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNldERpcnR5KHRoaXMuY2FsY3VsYXRlRGlydHkodGhpcy5iYXNlVmFsdWUsIHRoaXMudmFsdWUpKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXREaXJ0eSA9IGZ1bmN0aW9uIChkaXJ0eSkge1xuICAgICAgICAgICAgdmFyIG9sZFZhbCA9IHRoaXMuZGlydHk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gZGlydHk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFZhbCwgJ25ld1ZhbHVlJzogdGhpcy5kaXJ0eSB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNlbnRhdGlvbk1vZGVsKVxuICAgICAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWwudXBkYXRlRGlydHkoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXRRdWFsaWZpZXIgPSBmdW5jdGlvbiAobmV3UXVhbGlmaWVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5xdWFsaWZpZXIgPT0gbmV3UXVhbGlmaWVyKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBvbGRRdWFsaWZpZXIgPSB0aGlzLnF1YWxpZmllcjtcbiAgICAgICAgICAgIHRoaXMucXVhbGlmaWVyID0gbmV3UXVhbGlmaWVyO1xuICAgICAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZFF1YWxpZmllciwgJ25ld1ZhbHVlJzogbmV3UXVhbGlmaWVyIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLmdldFF1YWxpZmllciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnF1YWxpZmllcjtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLnByb3RvdHlwZS5zZXRCYXNlVmFsdWUgPSBmdW5jdGlvbiAoYmFzZVZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iYXNlVmFsdWUgPT0gYmFzZVZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBvbGRCYXNlVmFsdWUgPSB0aGlzLmJhc2VWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVZhbHVlID0gYmFzZVZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXREaXJ0eSh0aGlzLmNhbGN1bGF0ZURpcnR5KGJhc2VWYWx1ZSwgdGhpcy52YWx1ZSkpO1xuICAgICAgICAgICAgdGhpcy5iYXNlVmFsdWVDaGFuZ2VCdXMudHJpZ2dlcih7ICdvbGRWYWx1ZSc6IG9sZEJhc2VWYWx1ZSwgJ25ld1ZhbHVlJzogYmFzZVZhbHVlIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnJlYmFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QmFzZVZhbHVlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zZXREaXJ0eShmYWxzZSk7IC8vIHRoaXMgaXMgbm90IHN1cGVyZmx1b3VzIVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmJhc2VWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldERpcnR5KGZhbHNlKTsgLy8gdGhpcyBpcyBub3Qgc3VwZXJmbHVvdXMhXG4gICAgICAgIH07XG4gICAgICAgIENsaWVudEF0dHJpYnV0ZS5jaGVja1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBTdHJpbmcgfHwgcmVzdWx0IGluc3RhbmNlb2YgQm9vbGVhbiB8fCByZXN1bHQgaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQ2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbiBBdHRyaWJ1dGUgbWF5IG5vdCBpdHNlbGYgY29udGFpbiBhbiBhdHRyaWJ1dGUgYXMgYSB2YWx1ZS4gQXNzdW1pbmcgeW91IGZvcmdvdCB0byBjYWxsIHZhbHVlLlwiKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLmNoZWNrVmFsdWUodmFsdWUudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG9rID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5TVVBQT1JURURfVkFMVUVfVFlQRVMuaW5kZXhPZih0eXBlb2YgcmVzdWx0KSA+IC0xIHx8IHJlc3VsdCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXR0cmlidXRlIHZhbHVlcyBvZiB0aGlzIHR5cGUgYXJlIG5vdCBhbGxvd2VkOiBcIiArIHR5cGVvZiB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLm9uVmFsdWVDaGFuZ2UgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcih7IFwib2xkVmFsdWVcIjogdGhpcy52YWx1ZSwgXCJuZXdWYWx1ZVwiOiB0aGlzLnZhbHVlIH0pO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLm9uUXVhbGlmaWVyQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5xdWFsaWZpZXJDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLm9uRGlydHkgPSBmdW5jdGlvbiAoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmRpcnR5VmFsdWVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLm9uQmFzZVZhbHVlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5iYXNlVmFsdWVDaGFuZ2VCdXMub25FdmVudChldmVudEhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUucHJvdG90eXBlLnN5bmNXaXRoID0gZnVuY3Rpb24gKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7IC8vIHNlcXVlbmNlIGlzIGltcG9ydGFudFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QmFzZVZhbHVlKHNvdXJjZUF0dHJpYnV0ZS5nZXRCYXNlVmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShzb3VyY2VBdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRBdHRyaWJ1dGUuU1VQUE9SVEVEX1ZBTFVFX1RZUEVTID0gW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwiYm9vbGVhblwiXTtcbiAgICAgICAgQ2xpZW50QXR0cmlidXRlLmNsaWVudEF0dHJpYnV0ZUluc3RhbmNlQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gQ2xpZW50QXR0cmlidXRlO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uQ2xpZW50QXR0cmlidXRlID0gQ2xpZW50QXR0cmlidXRlO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBWYWx1ZUNoYW5nZWRDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKFZhbHVlQ2hhbmdlZENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIFZhbHVlQ2hhbmdlZENvbW1hbmQoYXR0cmlidXRlSWQsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZUlkID0gYXR0cmlidXRlSWQ7XG4gICAgICAgICAgICB0aGlzLm9sZFZhbHVlID0gb2xkVmFsdWU7XG4gICAgICAgICAgICB0aGlzLm5ld1ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJWYWx1ZUNoYW5nZWRcIjtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlZhbHVlQ2hhbmdlZENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gVmFsdWVDaGFuZ2VkQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5WYWx1ZUNoYW5nZWRDb21tYW5kID0gVmFsdWVDaGFuZ2VkQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgTmFtZWRDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKE5hbWVkQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gTmFtZWRDb21tYW5kKG5hbWUpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IG5hbWU7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5OYW1lZENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTmFtZWRDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLk5hbWVkQ29tbWFuZCA9IE5hbWVkQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRW1wdHlOb3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRW1wdHlOb3RpZmljYXRpb24sIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEVtcHR5Tm90aWZpY2F0aW9uKCkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJFbXB0eVwiO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uRW1wdHlOb3RpZmljYXRpb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRW1wdHlOb3RpZmljYXRpb247XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uRW1wdHlOb3RpZmljYXRpb24gPSBFbXB0eU5vdGlmaWNhdGlvbjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRDb25uZWN0b3IudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVmFsdWVDaGFuZ2VkQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYW1lZENvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRW1wdHlOb3RpZmljYXRpb24udHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgLyoqIEEgQmF0Y2hlciB0aGF0IGRvZXMgbm8gYmF0Y2hpbmcgYnV0IG1lcmVseSB0YWtlcyB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgcXVldWUgYXMgdGhlIHNpbmdsZSBpdGVtIGluIHRoZSBiYXRjaCAqL1xuICAgIHZhciBOb0NvbW1hbmRCYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gTm9Db21tYW5kQmF0Y2hlcigpIHtcbiAgICAgICAgfVxuICAgICAgICBOb0NvbW1hbmRCYXRjaGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uIChxdWV1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtxdWV1ZS5zaGlmdCgpXTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIE5vQ29tbWFuZEJhdGNoZXI7XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5Ob0NvbW1hbmRCYXRjaGVyID0gTm9Db21tYW5kQmF0Y2hlcjtcbiAgICAvKiogQSBiYXRjaGVyIHRoYXQgYmF0Y2hlcyB0aGUgYmxpbmRzIChjb21tYW5kcyB3aXRoIG5vIGNhbGxiYWNrKSBhbmQgb3B0aW9uYWxseSBhbHNvIGZvbGRzIHZhbHVlIGNoYW5nZXMgKi9cbiAgICB2YXIgQmxpbmRDb21tYW5kQmF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qKiBmb2xkaW5nOiB3aGV0aGVyIHdlIHNob3VsZCB0cnkgZm9sZGluZyBWYWx1ZUNoYW5nZWRDb21tYW5kcyAqL1xuICAgICAgICBmdW5jdGlvbiBCbGluZENvbW1hbmRCYXRjaGVyKGZvbGRpbmcsIG1heEJhdGNoU2l6ZSkge1xuICAgICAgICAgICAgaWYgKGZvbGRpbmcgPT09IHZvaWQgMCkgeyBmb2xkaW5nID0gdHJ1ZTsgfVxuICAgICAgICAgICAgaWYgKG1heEJhdGNoU2l6ZSA9PT0gdm9pZCAwKSB7IG1heEJhdGNoU2l6ZSA9IDUwOyB9XG4gICAgICAgICAgICB0aGlzLmZvbGRpbmcgPSBmb2xkaW5nO1xuICAgICAgICAgICAgdGhpcy5tYXhCYXRjaFNpemUgPSBtYXhCYXRjaFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgQmxpbmRDb21tYW5kQmF0Y2hlci5wcm90b3R5cGUuYmF0Y2ggPSBmdW5jdGlvbiAocXVldWUpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc05leHQodGhpcy5tYXhCYXRjaFNpemUsIHF1ZXVlLCByZXN1bHQpOyAvLyBkbyBub3QgYmF0Y2ggbW9yZSB0aGFuIHRoaXMubWF4QmF0Y2hTaXplIGNvbW1hbmRzIHRvIGF2b2lkIHN0YWNrIG92ZXJmbG93IG9uIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIC8vIHJlY3Vyc2l2ZSBpbXBsIG1ldGhvZCB0byBzaWRlLWVmZmVjdCBib3RoIHF1ZXVlIGFuZCBiYXRjaFxuICAgICAgICBCbGluZENvbW1hbmRCYXRjaGVyLnByb3RvdHlwZS5wcm9jZXNzTmV4dCA9IGZ1bmN0aW9uIChtYXhCYXRjaFNpemUsIHF1ZXVlLCBiYXRjaCkge1xuICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA8IDEgfHwgbWF4QmF0Y2hTaXplIDwgMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgY2FuZGlkYXRlID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbGRpbmcgJiYgY2FuZGlkYXRlLmNvbW1hbmQgaW5zdGFuY2VvZiBvcGVuZG9scGhpbi5WYWx1ZUNoYW5nZWRDb21tYW5kICYmICghY2FuZGlkYXRlLmhhbmRsZXIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgY2FuQ21kID0gY2FuZGlkYXRlLmNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXRjaC5sZW5ndGggJiYgZm91bmQgPT0gbnVsbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXRjaFtpXS5jb21tYW5kIGluc3RhbmNlb2Ygb3BlbmRvbHBoaW4uVmFsdWVDaGFuZ2VkQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJhdGNoQ21kID0gYmF0Y2hbaV0uY29tbWFuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYW5DbWQuYXR0cmlidXRlSWQgPT0gYmF0Y2hDbWQuYXR0cmlidXRlSWQgJiYgYmF0Y2hDbWQubmV3VmFsdWUgPT0gY2FuQ21kLm9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBiYXRjaENtZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQubmV3VmFsdWUgPSBjYW5DbWQubmV3VmFsdWU7IC8vIGNoYW5nZSBleGlzdGluZyB2YWx1ZSwgZG8gbm90IGJhdGNoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBiYXRjaC5wdXNoKGNhbmRpZGF0ZSk7IC8vIHdlIGNhbm5vdCBtZXJnZSwgc28gYmF0Y2ggdGhlIGNhbmRpZGF0ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJhdGNoLnB1c2goY2FuZGlkYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY2FuZGlkYXRlLmhhbmRsZXIgJiZcbiAgICAgICAgICAgICAgICAhKGNhbmRpZGF0ZS5jb21tYW5kWydjbGFzc05hbWUnXSA9PSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uTmFtZWRDb21tYW5kXCIpICYmXG4gICAgICAgICAgICAgICAgIShjYW5kaWRhdGUuY29tbWFuZFsnY2xhc3NOYW1lJ10gPT0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkVtcHR5Tm90aWZpY2F0aW9uXCIpIC8vIGFuZCBubyB1bmtub3duIGNsaWVudCBzaWRlIGVmZmVjdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTmV4dChtYXhCYXRjaFNpemUgLSAxLCBxdWV1ZSwgYmF0Y2gpOyAvLyB0aGVuIHdlIGNhbiBwcm9jZWVkIHdpdGggYmF0Y2hpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEJsaW5kQ29tbWFuZEJhdGNoZXI7XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5CbGluZENvbW1hbmRCYXRjaGVyID0gQmxpbmRDb21tYW5kQmF0Y2hlcjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENvZGVjID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gQ29kZWMoKSB7XG4gICAgICAgIH1cbiAgICAgICAgQ29kZWMucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uIChjb21tYW5kcykge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGNvbW1hbmRzKTsgLy8gdG9kbyBkazogbG9vayBmb3IgcG9zc2libGUgQVBJIHN1cHBvcnQgZm9yIGNoYXJhY3RlciBlbmNvZGluZ1xuICAgICAgICB9O1xuICAgICAgICBDb2RlYy5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gKHRyYW5zbWl0dGVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRyYW5zbWl0dGVkID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodHJhbnNtaXR0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zbWl0dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ29kZWM7XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5Db2RlYyA9IENvZGVjO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBTaWduYWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKFNpZ25hbENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIFNpZ25hbENvbW1hbmQobmFtZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmlkID0gbmFtZTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlNpZ25hbENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU2lnbmFsQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5TaWduYWxDb21tYW5kID0gU2lnbmFsQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwcmVzZW50YXRpb25Nb2RlbCkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50U2lkZU9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCI7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5DcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmRcIjtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHByZXNlbnRhdGlvbk1vZGVsLmlkO1xuICAgICAgICAgICAgdGhpcy5wbVR5cGUgPSBwcmVzZW50YXRpb25Nb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IGF0dHIucHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICBpZDogYXR0ci5pZCxcbiAgICAgICAgICAgICAgICAgICAgcXVhbGlmaWVyOiBhdHRyLmdldFF1YWxpZmllcigpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0ci5nZXRWYWx1ZSgpLFxuICAgICAgICAgICAgICAgICAgICB0YWc6IGF0dHIudGFnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IENyZWF0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIE1hcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIE1hcCgpIHtcbiAgICAgICAgICAgIHRoaXMua2V5cyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgIH1cbiAgICAgICAgTWFwLnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kYXRhW3RoaXMua2V5cy5pbmRleE9mKGtleSldID0gdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmtleXMuaW5kZXhPZihrZXkpXTtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250YWluc0tleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5rZXlzLmluZGV4T2Yoa2V5KTtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5cy5sZW5ndGggPT0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rZXlzLmxlbmd0aDtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcih0aGlzLmtleXNbaV0sIHRoaXMuZGF0YVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIE1hcC5wcm90b3R5cGUuY29udGFpbnNLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rZXlzLmluZGV4T2Yoa2V5KSA+IC0xO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLmNvbnRhaW5zVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuaW5kZXhPZih2YWx1ZSkgPiAtMTtcbiAgICAgICAgfTtcbiAgICAgICAgTWFwLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNsaWNlKDApO1xuICAgICAgICB9O1xuICAgICAgICBNYXAucHJvdG90eXBlLmtleVNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmtleXMuc2xpY2UoMCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBNYXA7XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5NYXAgPSBNYXA7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBEZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKERlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb24sIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIERlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb24ocG1UeXBlKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1UeXBlID0gcG1UeXBlO1xuICAgICAgICAgICAgdGhpcy5pZCA9ICdEZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZWRBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVOb3RpZmljYXRpb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbjtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5EZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uID0gRGVsZXRlZEFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZU5vdGlmaWNhdGlvbjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24sIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbihwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0RlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGVsZXRlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkRlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiA9IERlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50RG9scGhpbi50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRDb25uZWN0b3IudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiVmFsdWVDaGFuZ2VkQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDaGFuZ2VBdHRyaWJ1dGVNZXRhZGF0YUNvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQXR0cmlidXRlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk1hcC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV2ZW50QnVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRlbGV0ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbi50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJCYXNlVmFsdWVDaGFuZ2VkQ29tbWFuZC50c1wiLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICAoZnVuY3Rpb24gKFR5cGUpIHtcbiAgICAgICAgVHlwZVtUeXBlW1wiQURERURcIl0gPSAnQURERUQnXSA9IFwiQURERURcIjtcbiAgICAgICAgVHlwZVtUeXBlW1wiUkVNT1ZFRFwiXSA9ICdSRU1PVkVEJ10gPSBcIlJFTU9WRURcIjtcbiAgICB9KShvcGVuZG9scGhpbi5UeXBlIHx8IChvcGVuZG9scGhpbi5UeXBlID0ge30pKTtcbiAgICB2YXIgVHlwZSA9IG9wZW5kb2xwaGluLlR5cGU7XG4gICAgdmFyIENsaWVudE1vZGVsU3RvcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDbGllbnRNb2RlbFN0b3JlKGNsaWVudERvbHBoaW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbiA9IGNsaWVudERvbHBoaW47XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscyA9IG5ldyBvcGVuZG9scGhpbi5NYXAoKTtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZSA9IG5ldyBvcGVuZG9scGhpbi5NYXAoKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1BlcklkID0gbmV3IG9wZW5kb2xwaGluLk1hcCgpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyID0gbmV3IG9wZW5kb2xwaGluLk1hcCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzID0gbmV3IG9wZW5kb2xwaGluLkV2ZW50QnVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZ2V0Q2xpZW50RG9scGhpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudERvbHBoaW47XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlZ2lzdGVyTW9kZWwgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAobW9kZWwuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29ubmVjdG9yID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpO1xuICAgICAgICAgICAgdmFyIGNyZWF0ZVBNQ29tbWFuZCA9IG5ldyBvcGVuZG9scGhpbi5DcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQobW9kZWwpO1xuICAgICAgICAgICAgY29ubmVjdG9yLnNlbmQoY3JlYXRlUE1Db21tYW5kLCBudWxsKTtcbiAgICAgICAgICAgIG1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZWdpc3RlckF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLnJlZ2lzdGVyQXR0cmlidXRlID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuYWRkQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkQXR0cmlidXRlQnlRdWFsaWZpZXIoYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdoZW5ldmVyIGFuIGF0dHJpYnV0ZSBjaGFuZ2VzIGl0cyB2YWx1ZSwgdGhlIHNlcnZlciBuZWVkcyB0byBiZSBub3RpZmllZFxuICAgICAgICAgICAgLy8gYW5kIGFsbCBvdGhlciBhdHRyaWJ1dGVzIHdpdGggdGhlIHNhbWUgcXVhbGlmaWVyIGFyZSBnaXZlbiB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZUNoYW5nZUNvbW1hbmQgPSBuZXcgb3BlbmRvbHBoaW4uVmFsdWVDaGFuZ2VkQ29tbWFuZChhdHRyaWJ1dGUuaWQsIGV2dC5vbGRWYWx1ZSwgZXZ0Lm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudENvbm5lY3RvcigpLnNlbmQodmFsdWVDaGFuZ2VDb21tYW5kLCBudWxsKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IF90aGlzLmZpbmRBdHRyaWJ1dGVzQnlGaWx0ZXIoZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRyICE9PSBhdHRyaWJ1dGUgJiYgYXR0ci5nZXRRdWFsaWZpZXIoKSA9PSBhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyLnNldFZhbHVlKGF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBhbGwgYXR0cmlidXRlcyB3aXRoIHRoZSBzYW1lIHF1YWxpZmllciBzaG91bGQgaGF2ZSB0aGUgc2FtZSBiYXNlIHZhbHVlXG4gICAgICAgICAgICBhdHRyaWJ1dGUub25CYXNlVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIHZhciBiYXNlVmFsdWVDaGFuZ2VDb21tYW5kID0gbmV3IG9wZW5kb2xwaGluLkJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kKGF0dHJpYnV0ZS5pZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKGJhc2VWYWx1ZUNoYW5nZUNvbW1hbmQsIG51bGwpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gX3RoaXMuZmluZEF0dHJpYnV0ZXNCeUZpbHRlcihmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHIgIT09IGF0dHJpYnV0ZSAmJiBhdHRyLmdldFF1YWxpZmllcigpID09IGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIuc2V0QmFzZVZhbHVlKGF0dHJpYnV0ZS5nZXRCYXNlVmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXR0cmlidXRlLm9uUXVhbGlmaWVyQ2hhbmdlKGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlQXR0ck1ldGFkYXRhQ21kID0gbmV3IG9wZW5kb2xwaGluLkNoYW5nZUF0dHJpYnV0ZU1ldGFkYXRhQ29tbWFuZChhdHRyaWJ1dGUuaWQsIG9wZW5kb2xwaGluLkF0dHJpYnV0ZS5RVUFMSUZJRVJfUFJPUEVSVFksIGV2dC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKGNoYW5nZUF0dHJNZXRhZGF0YUNtZCwgbnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmNvbnRhaW5zS2V5KG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYWxyZWFkeSBpcyBhIFBNIHdpdGggaWQgXCIgKyBtb2RlbC5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuY29udGFpbnNWYWx1ZShtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5wdXQobW9kZWwuaWQsIG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWxTdG9yZUNoYW5nZUJ1cy50cmlnZ2VyKHsgJ2V2ZW50VHlwZSc6IFR5cGUuQURERUQsICdjbGllbnRQcmVzZW50YXRpb25Nb2RlbCc6IG1vZGVsIH0pO1xuICAgICAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhZGRlZDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzZW50YXRpb25Nb2RlbHMuY29udGFpbnNWYWx1ZShtb2RlbCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVByZXNlbnRhdGlvbk1vZGVsQnlUeXBlKG1vZGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5yZW1vdmUobW9kZWwuaWQpO1xuICAgICAgICAgICAgICAgIG1vZGVsLmdldEF0dHJpYnV0ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQXR0cmlidXRlQnlJZChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLnRyaWdnZXIoeyAnZXZlbnRUeXBlJzogVHlwZS5SRU1PVkVELCAnY2xpZW50UHJlc2VudGF0aW9uTW9kZWwnOiBtb2RlbCB9KTtcbiAgICAgICAgICAgICAgICByZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQXR0cmlidXRlc0J5RmlsdGVyID0gZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgbW9kZWwpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKGF0dHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goYXR0cik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmFkZFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldCh0eXBlKTtcbiAgICAgICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWxzKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLnB1dCh0eXBlLCBwcmVzZW50YXRpb25Nb2RlbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJlc2VudGF0aW9uTW9kZWxzLmluZGV4T2YobW9kZWwpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgaWYgKCFtb2RlbCB8fCAhKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5wcmVzZW50YXRpb25Nb2RlbHNQZXJUeXBlLmdldChtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICAgICAgaWYgKCFwcmVzZW50YXRpb25Nb2RlbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJlc2VudGF0aW9uTW9kZWxzLmxlbmd0aCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWxzLnNwbGljZShwcmVzZW50YXRpb25Nb2RlbHMuaW5kZXhPZihtb2RlbCksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNlbnRhdGlvbk1vZGVscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUucmVtb3ZlKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy5rZXlTZXQoKS5zbGljZSgwKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVscy52YWx1ZXMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmdldChpZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgICAgICBpZiAoIXR5cGUgfHwgIXRoaXMucHJlc2VudGF0aW9uTW9kZWxzUGVyVHlwZS5jb250YWluc0tleSh0eXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXNlbnRhdGlvbk1vZGVsc1BlclR5cGUuZ2V0KHR5cGUpLnNsaWNlKDApOyAvLyBzbGljZSBpcyB1c2VkIHRvIGNsb25lIHRoZSBhcnJheVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5kZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbE9mVHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWxzID0gdGhpcy5maW5kQWxsUHJlc2VudGF0aW9uTW9kZWxCeVR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgICAgIHByZXNlbnRhdGlvbk1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChwbSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsKHBtLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKG5ldyBvcGVuZG9scGhpbi5EZWxldGVkQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlTm90aWZpY2F0aW9uKHByZXNlbnRhdGlvbk1vZGVsVHlwZSksIHVuZGVmaW5lZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudE1vZGVsU3RvcmUucHJvdG90eXBlLmRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKG1vZGVsLCBub3RpZnkpIHtcbiAgICAgICAgICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKG1vZGVsLmlkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKG1vZGVsKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5vdGlmeSB8fCBtb2RlbC5jbGllbnRTaWRlT25seSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRDb25uZWN0b3IoKS5zZW5kKG5ldyBvcGVuZG9scGhpbi5EZWxldGVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24obW9kZWwuaWQpLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuY29udGFpbnNQcmVzZW50YXRpb25Nb2RlbCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGF0aW9uTW9kZWxzLmNvbnRhaW5zS2V5KGlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuYWRkQXR0cmlidXRlQnlJZCA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8IHRoaXMuYXR0cmlidXRlc1BlcklkLmNvbnRhaW5zS2V5KGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5wdXQoYXR0cmlidXRlLmlkLCBhdHRyaWJ1dGUpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVCeUlkID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIXRoaXMuYXR0cmlidXRlc1BlcklkLmNvbnRhaW5zS2V5KGF0dHJpYnV0ZS5pZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5yZW1vdmUoYXR0cmlidXRlLmlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUuZmluZEF0dHJpYnV0ZUJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNQZXJJZC5nZXQoaWQpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5hZGRBdHRyaWJ1dGVCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNQZXJRdWFsaWZpZXIucHV0KGF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSwgYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShhdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVCeVF1YWxpZmllciA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlIHx8ICFhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQoYXR0cmlidXRlLmdldFF1YWxpZmllcigpKTtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5zcGxpY2UoYXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZSksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzUGVyUXVhbGlmaWVyLnJlbW92ZShhdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRNb2RlbFN0b3JlLnByb3RvdHlwZS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyID0gZnVuY3Rpb24gKHF1YWxpZmllcikge1xuICAgICAgICAgICAgaWYgKCFxdWFsaWZpZXIgfHwgIXRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5jb250YWluc0tleShxdWFsaWZpZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1BlclF1YWxpZmllci5nZXQocXVhbGlmaWVyKS5zbGljZSgwKTsgLy8gc2xpY2UgaXMgdXNlZCB0byBjbG9uZSB0aGUgYXJyYXlcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUub25Nb2RlbFN0b3JlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50TW9kZWxTdG9yZS5wcm90b3R5cGUub25Nb2RlbFN0b3JlQ2hhbmdlRm9yVHlwZSA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbFR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbFN0b3JlQ2hhbmdlQnVzLm9uRXZlbnQoZnVuY3Rpb24gKHBtU3RvcmVFdmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChwbVN0b3JlRXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlID09IHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIocG1TdG9yZUV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIENsaWVudE1vZGVsU3RvcmU7XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5DbGllbnRNb2RlbFN0b3JlID0gQ2xpZW50TW9kZWxTdG9yZTtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmFtZWRDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaWduYWxDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFbXB0eU5vdGlmaWNhdGlvbi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudE1vZGVsU3RvcmUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudENvbm5lY3Rvci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdHRyaWJ1dGVDcmVhdGVkTm90aWZpY2F0aW9uLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgQ2xpZW50RG9scGhpbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIENsaWVudERvbHBoaW4oKSB7XG4gICAgICAgIH1cbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuc2V0Q2xpZW50Q29ubmVjdG9yID0gZnVuY3Rpb24gKGNsaWVudENvbm5lY3Rvcikge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IgPSBjbGllbnRDb25uZWN0b3I7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmdldENsaWVudENvbm5lY3RvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWVudENvbm5lY3RvcjtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIChjb21tYW5kTmFtZSwgb25GaW5pc2hlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChuZXcgb3BlbmRvbHBoaW4uTmFtZWRDb21tYW5kKGNvbW1hbmROYW1lKSwgb25GaW5pc2hlZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnNlbmRFbXB0eSA9IGZ1bmN0aW9uIChvbkZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZW5kKG5ldyBvcGVuZG9scGhpbi5FbXB0eU5vdGlmaWNhdGlvbigpLCBvbkZpbmlzaGVkKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gZmFjdG9yeSBtZXRob2QgZm9yIGF0dHJpYnV0ZXNcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuYXR0cmlidXRlID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgcXVhbGlmaWVyLCB2YWx1ZSwgdGFnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IG9wZW5kb2xwaGluLkNsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgdmFsdWUsIHRhZyk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGZhY3RvcnkgbWV0aG9kIGZvciBwcmVzZW50YXRpb24gbW9kZWxzXG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnByZXNlbnRhdGlvbk1vZGVsID0gZnVuY3Rpb24gKGlkLCB0eXBlKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1vZGVsID0gbmV3IG9wZW5kb2xwaGluLkNsaWVudFByZXNlbnRhdGlvbk1vZGVsKGlkLCB0eXBlKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLmFkZEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuYWRkKG1vZGVsKTtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuc2V0Q2xpZW50TW9kZWxTdG9yZSA9IGZ1bmN0aW9uIChjbGllbnRNb2RlbFN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudE1vZGVsU3RvcmUgPSBjbGllbnRNb2RlbFN0b3JlO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5nZXRDbGllbnRNb2RlbFN0b3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50TW9kZWxTdG9yZTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUubGlzdFByZXNlbnRhdGlvbk1vZGVsSWRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbElkcygpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5saXN0UHJlc2VudGF0aW9uTW9kZWxzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmxpc3RQcmVzZW50YXRpb25Nb2RlbHMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZmluZEFsbFByZXNlbnRhdGlvbk1vZGVsQnlUeXBlID0gZnVuY3Rpb24gKHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBbGxQcmVzZW50YXRpb25Nb2RlbEJ5VHlwZShwcmVzZW50YXRpb25Nb2RlbFR5cGUpO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5nZXRBdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChpZCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKGlkKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwgPSBmdW5jdGlvbiAobW9kZWxUb0RlbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWxUb0RlbGV0ZSwgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLmRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsT2ZUeXBlID0gZnVuY3Rpb24gKHByZXNlbnRhdGlvbk1vZGVsVHlwZSkge1xuICAgICAgICAgICAgdGhpcy5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxPZlR5cGUocHJlc2VudGF0aW9uTW9kZWxUeXBlKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUudXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIgPSBmdW5jdGlvbiAocHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5nZXRBdHRyaWJ1dGVzKCkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlQXR0cmlidXRlUXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUudXBkYXRlQXR0cmlidXRlUXVhbGlmaWVyID0gZnVuY3Rpb24gKHNvdXJjZUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgaWYgKCFzb3VyY2VBdHRyaWJ1dGUuZ2V0UXVhbGlmaWVyKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyKHNvdXJjZUF0dHJpYnV0ZS5nZXRRdWFsaWZpZXIoKSk7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRBdHRyaWJ1dGUudGFnICE9IHNvdXJjZUF0dHJpYnV0ZS50YWcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gYXR0cmlidXRlcyB3aXRoIHNhbWUgcXVhbGlmaWVyIGFuZCB0YWdcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc2V0VmFsdWUoc291cmNlQXR0cmlidXRlLmdldFZhbHVlKCkpOyAvLyBzaG91bGQgYWx3YXlzIGhhdmUgdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRyaWJ1dGUuc2V0QmFzZVZhbHVlKHNvdXJjZUF0dHJpYnV0ZS5nZXRCYXNlVmFsdWUoKSk7IC8vIGFuZCBzYW1lIGJhc2UgdmFsdWUgYW5kIHNvIGRpcnR5bmVzc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnRhZyA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCwgcHJvcGVydHlOYW1lLCB2YWx1ZSwgdGFnKSB7XG4gICAgICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gbmV3IG9wZW5kb2xwaGluLkNsaWVudEF0dHJpYnV0ZShwcm9wZXJ0eU5hbWUsIG51bGwsIHZhbHVlLCB0YWcpO1xuICAgICAgICAgICAgdGhpcy5hZGRBdHRyaWJ1dGVUb01vZGVsKHByZXNlbnRhdGlvbk1vZGVsLCBjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudEF0dHJpYnV0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50RG9scGhpbi5wcm90b3R5cGUuYWRkQXR0cmlidXRlVG9Nb2RlbCA9IGZ1bmN0aW9uIChwcmVzZW50YXRpb25Nb2RlbCwgY2xpZW50QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbC5hZGRBdHRyaWJ1dGUoY2xpZW50QXR0cmlidXRlKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLnJlZ2lzdGVyQXR0cmlidXRlKGNsaWVudEF0dHJpYnV0ZSk7XG4gICAgICAgICAgICBpZiAoIXByZXNlbnRhdGlvbk1vZGVsLmNsaWVudFNpZGVPbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2VuZChuZXcgb3BlbmRvbHBoaW4uQXR0cmlidXRlQ3JlYXRlZE5vdGlmaWNhdGlvbihwcmVzZW50YXRpb25Nb2RlbC5pZCwgY2xpZW50QXR0cmlidXRlLmlkLCBjbGllbnRBdHRyaWJ1dGUucHJvcGVydHlOYW1lLCBjbGllbnRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSwgY2xpZW50QXR0cmlidXRlLmdldFF1YWxpZmllcigpLCBjbGllbnRBdHRyaWJ1dGUudGFnKSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vLy8vLyBwdXNoIHN1cHBvcnQgLy8vLy8vL1xuICAgICAgICBDbGllbnREb2xwaGluLnByb3RvdHlwZS5zdGFydFB1c2hMaXN0ZW5pbmcgPSBmdW5jdGlvbiAocHVzaEFjdGlvbk5hbWUsIHJlbGVhc2VBY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudENvbm5lY3Rvci5zZXRQdXNoTGlzdGVuZXIobmV3IG9wZW5kb2xwaGluLk5hbWVkQ29tbWFuZChwdXNoQWN0aW9uTmFtZSkpO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UmVsZWFzZUNvbW1hbmQobmV3IG9wZW5kb2xwaGluLlNpZ25hbENvbW1hbmQocmVsZWFzZUFjdGlvbk5hbWUpKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50Q29ubmVjdG9yLnNldFB1c2hFbmFibGVkKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3IubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudERvbHBoaW4ucHJvdG90eXBlLnN0b3BQdXNoTGlzdGVuaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnRDb25uZWN0b3Iuc2V0UHVzaEVuYWJsZWQoZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ2xpZW50RG9scGhpbjtcbiAgICB9KSgpO1xuICAgIG9wZW5kb2xwaGluLkNsaWVudERvbHBoaW4gPSBDbGllbnREb2xwaGluO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kKHBtSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5QcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kID0gUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIFNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbihwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ1NhdmVkUHJlc2VudGF0aW9uTW9kZWwnO1xuICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9yZy5vcGVuZG9scGhpbi5jb3JlLmNvbW0uU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTYXZlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLlNhdmVkUHJlc2VudGF0aW9uTW9kZWxOb3RpZmljYXRpb24gPSBTYXZlZFByZXNlbnRhdGlvbk1vZGVsTm90aWZpY2F0aW9uO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRQcmVzZW50YXRpb25Nb2RlbC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJUYWcudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQocG1JZCwgcG1UeXBlLCBwcm9wZXJ0eU5hbWUsIHF1YWxpZmllciwgbmV3VmFsdWUsIHRhZykge1xuICAgICAgICAgICAgaWYgKHRhZyA9PT0gdm9pZCAwKSB7IHRhZyA9IG9wZW5kb2xwaGluLlRhZy52YWx1ZSgpOyB9XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLnBtVHlwZSA9IHBtVHlwZTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgdGhpcy5xdWFsaWZpZXIgPSBxdWFsaWZpZXI7XG4gICAgICAgICAgICB0aGlzLm5ld1ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnRhZyA9IHRhZztcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnSW5pdGlhbGl6ZUF0dHJpYnV0ZSc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5Jbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBJbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5Jbml0aWFsaXplQXR0cmlidXRlQ29tbWFuZCA9IEluaXRpYWxpemVBdHRyaWJ1dGVDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKFN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHBtSWQsIHNvdXJjZVBtSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuc291cmNlUG1JZCA9IHNvdXJjZVBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ1N3aXRjaFByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLlN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gU3dpdGNoUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kKHBtVHlwZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBtVHlwZSA9IHBtVHlwZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZUNvbW1hbmRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5EZWxldGVBbGxQcmVzZW50YXRpb25Nb2RlbHNPZlR5cGVDb21tYW5kID0gRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxzT2ZUeXBlQ29tbWFuZDtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIERlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0RlbGV0ZVByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBEZWxldGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgRGF0YUNvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGF0YUNvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIERhdGFDb21tYW5kKGRhdGEpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcIkRhdGFcIjtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkRhdGFDb21tYW5kXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERhdGFDb21tYW5kO1xuICAgIH0pKG9wZW5kb2xwaGluLkNvbW1hbmQpO1xuICAgIG9wZW5kb2xwaGluLkRhdGFDb21tYW5kID0gRGF0YUNvbW1hbmQ7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudFByZXNlbnRhdGlvbk1vZGVsLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kQmF0Y2hlci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29kZWMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNhbGxOYW1lZEFjdGlvbkNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudERvbHBoaW4udHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF0dHJpYnV0ZU1ldGFkYXRhQ2hhbmdlZENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudEF0dHJpYnV0ZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiUHJlc2VudGF0aW9uTW9kZWxSZXNldGVkQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQmFzZVZhbHVlQ2hhbmdlZENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlZhbHVlQ2hhbmdlZENvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZUNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZUNvbW1hbmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEYXRhQ29tbWFuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmFtZWRDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaWduYWxDb21tYW5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJUYWcudHNcIiAvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBDbGllbnRDb25uZWN0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDbGllbnRDb25uZWN0b3IodHJhbnNtaXR0ZXIsIGNsaWVudERvbHBoaW4sIHNsYWNrTVMsIG1heEJhdGNoU2l6ZSkge1xuICAgICAgICAgICAgaWYgKHNsYWNrTVMgPT09IHZvaWQgMCkgeyBzbGFja01TID0gMDsgfVxuICAgICAgICAgICAgaWYgKG1heEJhdGNoU2l6ZSA9PT0gdm9pZCAwKSB7IG1heEJhdGNoU2l6ZSA9IDUwOyB9XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnB1c2hFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXR0ZXIgPSB0cmFuc21pdHRlcjtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbiA9IGNsaWVudERvbHBoaW47XG4gICAgICAgICAgICB0aGlzLnNsYWNrTVMgPSBzbGFja01TO1xuICAgICAgICAgICAgdGhpcy5jb2RlYyA9IG5ldyBvcGVuZG9scGhpbi5Db2RlYygpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kQmF0Y2hlciA9IG5ldyBvcGVuZG9scGhpbi5CbGluZENvbW1hbmRCYXRjaGVyKHRydWUsIG1heEJhdGNoU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5zZXRDb21tYW5kQmF0Y2hlciA9IGZ1bmN0aW9uIChuZXdCYXRjaGVyKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRCYXRjaGVyID0gbmV3QmF0Y2hlcjtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5zZXRQdXNoRW5hYmxlZCA9IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5zZXRQdXNoTGlzdGVuZXIgPSBmdW5jdGlvbiAobmV3TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaExpc3RlbmVyID0gbmV3TGlzdGVuZXI7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2V0UmVsZWFzZUNvbW1hbmQgPSBmdW5jdGlvbiAobmV3Q29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlQ29tbWFuZCA9IG5ld0NvbW1hbmQ7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIChjb21tYW5kLCBvbkZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKHsgY29tbWFuZDogY29tbWFuZCwgaGFuZGxlcjogb25GaW5pc2hlZCB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVNlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTsgLy8gdGhlcmUgaXMgbm90IHBvaW50IGluIHJlbGVhc2luZyBpZiB3ZSBkbyBub3Qgc2VuZCBhdG1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRvU2VuZE5leHQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5kb1NlbmROZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbW1hbmRRdWV1ZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHVzaEVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbnF1ZXVlUHVzaENvbW1hbmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5U2VuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlTZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBjbWRzQW5kSGFuZGxlcnMgPSB0aGlzLmNvbW1hbmRCYXRjaGVyLmJhdGNoKHRoaXMuY29tbWFuZFF1ZXVlKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNtZHNBbmRIYW5kbGVyc1tjbWRzQW5kSGFuZGxlcnMubGVuZ3RoIC0gMV0uaGFuZGxlcjtcbiAgICAgICAgICAgIHZhciBjb21tYW5kcyA9IGNtZHNBbmRIYW5kbGVycy5tYXAoZnVuY3Rpb24gKGNhaCkgeyByZXR1cm4gY2FoLmNvbW1hbmQ7IH0pO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pdHRlci50cmFuc21pdChjb21tYW5kcywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlcnZlciByZXNwb25zZTogW1wiICsgcmVzcG9uc2UubWFwKGl0ID0+IGl0LmlkKS5qb2luKFwiLCBcIikgKyBcIl0gXCIpO1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaGVkUE1zID0gW107XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG91Y2hlZCA9IF90aGlzLmhhbmRsZShjb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdWNoZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaGVkUE1zLnB1c2godG91Y2hlZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLm9uRmluaXNoZWQodG91Y2hlZFBNcyk7IC8vIHRvZG86IG1ha2UgdGhlbSB1bmlxdWU/XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZSBjYWxsOiBmZXRjaCB0aGUgbmV4dCBpbiBsaW5lIGJ1dCBhbGxvdyBhIGJpdCBvZiBzbGFjayBzdWNoIHRoYXRcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudCBldmVudHMgY2FuIGZpcmUsIHJlbmRlcmluZyBpcyBkb25lIGFuZCBjb21tYW5kcyBjYW4gYmF0Y2ggdXBcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmRvU2VuZE5leHQoKTsgfSwgX3RoaXMuc2xhY2tNUyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGUgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQuaWQgPT0gXCJEYXRhXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVEYXRhQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJEZWxldGVQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRGVsZXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkRlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsc09mVHlwZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxPZlR5cGVDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNyZWF0ZVByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDcmVhdGVQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiVmFsdWVDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkJhc2VWYWx1ZUNoYW5nZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIlN3aXRjaFByZXNlbnRhdGlvbk1vZGVsXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVTd2l0Y2hQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiSW5pdGlhbGl6ZUF0dHJpYnV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlSW5pdGlhbGl6ZUF0dHJpYnV0ZUNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiU2F2ZWRQcmVzZW50YXRpb25Nb2RlbFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbihjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQuaWQgPT0gXCJQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVByZXNlbnRhdGlvbk1vZGVsUmVzZXRlZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kLmlkID09IFwiQXR0cmlidXRlTWV0YWRhdGFDaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZC5pZCA9PSBcIkNhbGxOYW1lZEFjdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ2FsbE5hbWVkQWN0aW9uQ29tbWFuZChjb21tYW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2Fubm90IGhhbmRsZSwgdW5rbm93biBjb21tYW5kIFwiICsgY29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVEYXRhQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VydmVyQ29tbWFuZC5kYXRhO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZURlbGV0ZVByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSB0aGlzLmNsaWVudERvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnBtSWQpO1xuICAgICAgICAgICAgaWYgKCFtb2RlbClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZURlbGV0ZUFsbFByZXNlbnRhdGlvbk1vZGVsT2ZUeXBlQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZGVsZXRlQWxsUHJlc2VudGF0aW9uTW9kZWxPZlR5cGUoc2VydmVyQ29tbWFuZC5wbVR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlQ3JlYXRlUHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5jb250YWluc1ByZXNlbnRhdGlvbk1vZGVsKHNlcnZlckNvbW1hbmQucG1JZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhbHJlYWR5IGlzIGEgcHJlc2VudGF0aW9uIG1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnBtSWQgKyBcIiAga25vd24gdG8gdGhlIGNsaWVudC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50QXR0cmlidXRlID0gX3RoaXMuY2xpZW50RG9scGhpbi5hdHRyaWJ1dGUoYXR0ci5wcm9wZXJ0eU5hbWUsIGF0dHIucXVhbGlmaWVyLCBhdHRyLnZhbHVlLCBhdHRyLnRhZyA/IGF0dHIudGFnIDogb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRCYXNlVmFsdWUoYXR0ci5iYXNlVmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyLmlkICYmIGF0dHIuaWQubWF0Y2goXCIuKlMkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5pZCA9IGF0dHIuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChjbGllbnRBdHRyaWJ1dGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2xpZW50UG0gPSBuZXcgb3BlbmRvbHBoaW4uQ2xpZW50UHJlc2VudGF0aW9uTW9kZWwoc2VydmVyQ29tbWFuZC5wbUlkLCBzZXJ2ZXJDb21tYW5kLnBtVHlwZSk7XG4gICAgICAgICAgICBjbGllbnRQbS5hZGRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQuY2xpZW50U2lkZU9ubHkpIHtcbiAgICAgICAgICAgICAgICBjbGllbnRQbS5jbGllbnRTaWRlT25seSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChjbGllbnRQbSk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4udXBkYXRlUHJlc2VudGF0aW9uTW9kZWxRdWFsaWZpZXIoY2xpZW50UG0pO1xuICAgICAgICAgICAgY2xpZW50UG0udXBkYXRlQXR0cmlidXRlRGlydHluZXNzKCk7XG4gICAgICAgICAgICBjbGllbnRQbS51cGRhdGVEaXJ0eSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudFBtO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZVZhbHVlQ2hhbmdlZENvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgdmFyIGNsaWVudEF0dHJpYnV0ZSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZEF0dHJpYnV0ZUJ5SWQoc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCk7XG4gICAgICAgICAgICBpZiAoIWNsaWVudEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXR0cmlidXRlIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3QgdXBkYXRlIG9sZCB2YWx1ZSBcIiArIHNlcnZlckNvbW1hbmQub2xkVmFsdWUgKyBcIiB0byBuZXcgdmFsdWUgXCIgKyBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjbGllbnRBdHRyaWJ1dGUuZ2V0VmFsdWUoKSA9PSBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm5vdGhpbmcgdG8gZG8uIG5ldyB2YWx1ZSA9PSBvbGQgdmFsdWVcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBCZWxvdyB3YXMgdGhlIGNvZGUgdGhhdCB3b3VsZCBlbmZvcmNlIHRoYXQgdmFsdWUgY2hhbmdlcyBvbmx5IGFwcGVhciB3aGVuIHRoZSBwcm9wZXIgb2xkVmFsdWUgaXMgZ2l2ZW4uXG4gICAgICAgICAgICAvLyBXaGlsZSB0aGF0IHNlZW1lZCBhcHByb3ByaWF0ZSBhdCBmaXJzdCwgdGhlcmUgYXJlIGFjdHVhbGx5IHZhbGlkIGNvbW1hbmQgc2VxdWVuY2VzIHdoZXJlIHRoZSBvbGRWYWx1ZSBpcyBub3QgcHJvcGVybHkgc2V0LlxuICAgICAgICAgICAgLy8gV2UgbGVhdmUgdGhlIGNvbW1lbnRlZCBjb2RlIGluIHRoZSBjb2RlYmFzZSB0byBhbGxvdyBmb3IgbG9nZ2luZy9kZWJ1Z2dpbmcgc3VjaCBjYXNlcy5cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgaWYoY2xpZW50QXR0cmlidXRlLmdldFZhbHVlKCkgIT0gc2VydmVyQ29tbWFuZC5vbGRWYWx1ZSkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdHRyaWJ1dGUgd2l0aCBpZCBcIitzZXJ2ZXJDb21tYW5kLmF0dHJpYnV0ZUlkK1wiIGFuZCB2YWx1ZSBcIiArIGNsaWVudEF0dHJpYnV0ZS5nZXRWYWx1ZSgpICtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIHdhcyBzZXQgdG8gdmFsdWUgXCIgKyBzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlICsgXCIgZXZlbiB0aG91Z2ggdGhlIGNoYW5nZSB3YXMgYmFzZWQgb24gYW4gb3V0ZGF0ZWQgb2xkIHZhbHVlIG9mIFwiICsgc2VydmVyQ29tbWFuZC5vbGRWYWx1ZSk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5zZXRWYWx1ZShzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUJhc2VWYWx1ZUNoYW5nZWRDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF0dHJpYnV0ZSB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5hdHRyaWJ1dGVJZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHNldCBiYXNlIHZhbHVlLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsaWVudEF0dHJpYnV0ZS5yZWJhc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZVN3aXRjaFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICB2YXIgc3dpdGNoUG0gPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgICAgIGlmICghc3dpdGNoUG0pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN3aXRjaCBtb2RlbCB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5wbUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3Qgc3dpdGNoLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzb3VyY2VQbSA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnNvdXJjZVBtSWQpO1xuICAgICAgICAgICAgaWYgKCFzb3VyY2VQbSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic291cmNlIG1vZGVsIHdpdGggaWQgXCIgKyBzZXJ2ZXJDb21tYW5kLnNvdXJjZVBtSWQgKyBcIiBub3QgZm91bmQsIGNhbm5vdCBzd2l0Y2guXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoUG0uc3luY1dpdGgoc291cmNlUG0pO1xuICAgICAgICAgICAgcmV0dXJuIHN3aXRjaFBtO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUluaXRpYWxpemVBdHRyaWJ1dGVDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBuZXcgb3BlbmRvbHBoaW4uQ2xpZW50QXR0cmlidXRlKHNlcnZlckNvbW1hbmQucHJvcGVydHlOYW1lLCBzZXJ2ZXJDb21tYW5kLnF1YWxpZmllciwgc2VydmVyQ29tbWFuZC5uZXdWYWx1ZSwgc2VydmVyQ29tbWFuZC50YWcpO1xuICAgICAgICAgICAgaWYgKHNlcnZlckNvbW1hbmQucXVhbGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXNDb3B5ID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kQWxsQXR0cmlidXRlc0J5UXVhbGlmaWVyKHNlcnZlckNvbW1hbmQucXVhbGlmaWVyKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc0NvcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXJ2ZXJDb21tYW5kLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IGF0dHJpYnV0ZXNDb3B5LnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZShhdHRyLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlc0NvcHkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIuc2V0VmFsdWUoYXR0cmlidXRlLmdldFZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgICAgICBpZiAoc2VydmVyQ29tbWFuZC5wbUlkKSB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGF0aW9uTW9kZWwgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRQcmVzZW50YXRpb25Nb2RlbEJ5SWQoc2VydmVyQ29tbWFuZC5wbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJlc2VudGF0aW9uTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBwcmVzZW50YXRpb25Nb2RlbCA9IG5ldyBvcGVuZG9scGhpbi5DbGllbnRQcmVzZW50YXRpb25Nb2RlbChzZXJ2ZXJDb21tYW5kLnBtSWQsIHNlcnZlckNvbW1hbmQucG1UeXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmFkZChwcmVzZW50YXRpb25Nb2RlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsaWVudERvbHBoaW4uYWRkQXR0cmlidXRlVG9Nb2RlbChwcmVzZW50YXRpb25Nb2RlbCwgYXR0cmlidXRlKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50RG9scGhpbi51cGRhdGVQcmVzZW50YXRpb25Nb2RlbFF1YWxpZmllcihwcmVzZW50YXRpb25Nb2RlbCk7XG4gICAgICAgICAgICByZXR1cm4gcHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgIH07XG4gICAgICAgIENsaWVudENvbm5lY3Rvci5wcm90b3R5cGUuaGFuZGxlU2F2ZWRQcmVzZW50YXRpb25Nb2RlbE5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uIChzZXJ2ZXJDb21tYW5kKSB7XG4gICAgICAgICAgICBpZiAoIXNlcnZlckNvbW1hbmQucG1JZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY2xpZW50RG9scGhpbi5nZXRDbGllbnRNb2RlbFN0b3JlKCkuZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChzZXJ2ZXJDb21tYW5kLnBtSWQpO1xuICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibW9kZWwgd2l0aCBpZCBcIiArIHNlcnZlckNvbW1hbmQucG1JZCArIFwiIG5vdCBmb3VuZCwgY2Fubm90IHJlYmFzZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtb2RlbC5yZWJhc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVQcmVzZW50YXRpb25Nb2RlbFJlc2V0ZWRDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIGlmICghc2VydmVyQ29tbWFuZC5wbUlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gdGhpcy5jbGllbnREb2xwaGluLmdldENsaWVudE1vZGVsU3RvcmUoKS5maW5kUHJlc2VudGF0aW9uTW9kZWxCeUlkKHNlcnZlckNvbW1hbmQucG1JZCk7XG4gICAgICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtb2RlbCB3aXRoIGlkIFwiICsgc2VydmVyQ29tbWFuZC5wbUlkICsgXCIgbm90IGZvdW5kLCBjYW5ub3QgcmVzZXQuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9kZWwucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5oYW5kbGVBdHRyaWJ1dGVNZXRhZGF0YUNoYW5nZWRDb21tYW5kID0gZnVuY3Rpb24gKHNlcnZlckNvbW1hbmQpIHtcbiAgICAgICAgICAgIHZhciBjbGllbnRBdHRyaWJ1dGUgPSB0aGlzLmNsaWVudERvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLmZpbmRBdHRyaWJ1dGVCeUlkKHNlcnZlckNvbW1hbmQuYXR0cmlidXRlSWQpO1xuICAgICAgICAgICAgaWYgKCFjbGllbnRBdHRyaWJ1dGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjbGllbnRBdHRyaWJ1dGVbc2VydmVyQ29tbWFuZC5tZXRhZGF0YU5hbWVdID0gc2VydmVyQ29tbWFuZC52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmhhbmRsZUNhbGxOYW1lZEFjdGlvbkNvbW1hbmQgPSBmdW5jdGlvbiAoc2VydmVyQ29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnREb2xwaGluLnNlbmQoc2VydmVyQ29tbWFuZC5hY3Rpb25OYW1lLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICAvLy8vLy8vLy8vLy8vIHB1c2ggc3VwcG9ydCAvLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHVzaEVuYWJsZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHRoaXMud2FpdGluZylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHB1c2hMaXN0ZW5lciBpcyBzZXQ/XG4gICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudGx5U2VuZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9TZW5kTmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBDbGllbnRDb25uZWN0b3IucHJvdG90eXBlLmVucXVldWVQdXNoQ29tbWFuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLndhaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaCh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogdGhpcy5wdXNoTGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgaGFuZGxlcjoge1xuICAgICAgICAgICAgICAgICAgICBvbkZpbmlzaGVkOiBmdW5jdGlvbiAobW9kZWxzKSB7IG1lLndhaXRpbmcgPSBmYWxzZTsgfSxcbiAgICAgICAgICAgICAgICAgICAgb25GaW5pc2hlZERhdGE6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgQ2xpZW50Q29ubmVjdG9yLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndhaXRpbmcpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy53YWl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAvLyB0b2RvOiBob3cgdG8gaXNzdWUgYSB3YXJuaW5nIGlmIG5vIHJlbGVhc2VDb21tYW5kIGlzIHNldD9cbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXR0ZXIuc2lnbmFsKHRoaXMucmVsZWFzZUNvbW1hbmQpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ2xpZW50Q29ubmVjdG9yO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uQ2xpZW50Q29ubmVjdG9yID0gQ2xpZW50Q29ubmVjdG9yO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEb2xwaGluQnVpbGRlci50c1wiLz5cbi8qKlxuICogSlMtZnJpZW5kbHkgZmFjYWRlIHRvIGF2b2lkIHRvbyBtYW55IGRlcGVuZGVuY2llcyBpbiBwbGFpbiBKUyBjb2RlLlxuICogVGhlIG5hbWUgb2YgdGhpcyBmaWxlIGlzIGFsc28gdXNlZCBmb3IgdGhlIGluaXRpYWwgbG9va3VwIG9mIHRoZVxuICogb25lIGphdmFzY3JpcHQgZmlsZSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgZG9scGhpbiBjb2RlLlxuICogQ2hhbmdpbmcgdGhlIG5hbWUgcmVxdWlyZXMgdGhlIGJ1aWxkIHN1cHBvcnQgYW5kIGFsbCB1c2Vyc1xuICogdG8gYmUgdXBkYXRlZCBhcyB3ZWxsLlxuICogRGllcmsgS29lbmlnXG4gKi9cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICAvLyBmYWN0b3J5IG1ldGhvZCBmb3IgdGhlIGluaXRpYWxpemVkIGRvbHBoaW5cbiAgICAvLyBEZXByZWNhdGVkICEgVXNlICdtYWtlRG9scGhpbigpIGluc3RlYWRcbiAgICBmdW5jdGlvbiBkb2xwaGluKHVybCwgcmVzZXQsIHNsYWNrTVMpIHtcbiAgICAgICAgaWYgKHNsYWNrTVMgPT09IHZvaWQgMCkgeyBzbGFja01TID0gMzAwOyB9XG4gICAgICAgIHJldHVybiBtYWtlRG9scGhpbigpLnVybCh1cmwpLnJlc2V0KHJlc2V0KS5zbGFja01TKHNsYWNrTVMpLmJ1aWxkKCk7XG4gICAgfVxuICAgIG9wZW5kb2xwaGluLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgIC8vIGZhY3RvcnkgbWV0aG9kIHRvIGJ1aWxkIGFuIGluaXRpYWxpemVkIGRvbHBoaW5cbiAgICBmdW5jdGlvbiBtYWtlRG9scGhpbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBvcGVuZG9scGhpbi5Eb2xwaGluQnVpbGRlcigpO1xuICAgIH1cbiAgICBvcGVuZG9scGhpbi5tYWtlRG9scGhpbiA9IG1ha2VEb2xwaGluO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNpZ25hbENvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50Q29ubmVjdG9yLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIC8qKlxuICAgICAqIEEgdHJhbnNtaXR0ZXIgdGhhdCBpcyBub3QgdHJhbnNtaXR0aW5nIGF0IGFsbC5cbiAgICAgKiBJdCBtYXkgc2VydmUgYXMgYSBzdGFuZC1pbiB3aGVuIG5vIHJlYWwgdHJhbnNtaXR0ZXIgaXMgbmVlZGVkLlxuICAgICAqL1xuICAgIHZhciBOb1RyYW5zbWl0dGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gTm9UcmFuc21pdHRlcigpIHtcbiAgICAgICAgfVxuICAgICAgICBOb1RyYW5zbWl0dGVyLnByb3RvdHlwZS50cmFuc21pdCA9IGZ1bmN0aW9uIChjb21tYW5kcywgb25Eb25lKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIHNwZWNpYWxcbiAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgIH07XG4gICAgICAgIE5vVHJhbnNtaXR0ZXIucHJvdG90eXBlLnNpZ25hbCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBOb1RyYW5zbWl0dGVyO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uTm9UcmFuc21pdHRlciA9IE5vVHJhbnNtaXR0ZXI7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbW1hbmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2lnbmFsQ29tbWFuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDbGllbnRDb25uZWN0b3IudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29kZWMudHNcIi8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEh0dHBUcmFuc21pdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEh0dHBUcmFuc21pdHRlcih1cmwsIHJlc2V0LCBjaGFyc2V0LCBlcnJvckhhbmRsZXIsIHN1cHBvcnRDT1JTKSB7XG4gICAgICAgICAgICBpZiAocmVzZXQgPT09IHZvaWQgMCkgeyByZXNldCA9IHRydWU7IH1cbiAgICAgICAgICAgIGlmIChjaGFyc2V0ID09PSB2b2lkIDApIHsgY2hhcnNldCA9IFwiVVRGLThcIjsgfVxuICAgICAgICAgICAgaWYgKGVycm9ySGFuZGxlciA9PT0gdm9pZCAwKSB7IGVycm9ySGFuZGxlciA9IG51bGw7IH1cbiAgICAgICAgICAgIGlmIChzdXBwb3J0Q09SUyA9PT0gdm9pZCAwKSB7IHN1cHBvcnRDT1JTID0gZmFsc2U7IH1cbiAgICAgICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICAgICAgdGhpcy5jaGFyc2V0ID0gY2hhcnNldDtcbiAgICAgICAgICAgIHRoaXMuSHR0cENvZGVzID0ge1xuICAgICAgICAgICAgICAgIGZpbmlzaGVkOiA0LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IDIwMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyID0gZXJyb3JIYW5kbGVyO1xuICAgICAgICAgICAgdGhpcy5zdXBwb3J0Q09SUyA9IHN1cHBvcnRDT1JTO1xuICAgICAgICAgICAgdGhpcy5odHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB0aGlzLnNpZyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3VwcG9ydENPUlMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB0aGlzLmh0dHApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwLndpdGhDcmVkZW50aWFscyA9IHRydWU7IC8vIE5PVEU6IGRvaW5nIHRoaXMgZm9yIG5vbiBDT1JTIHJlcXVlc3RzIGhhcyBubyBpbXBhY3RcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaWcud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvZGVjID0gbmV3IG9wZW5kb2xwaGluLkNvZGVjKCk7XG4gICAgICAgICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLnRyYW5zbWl0ID0gZnVuY3Rpb24gKGNvbW1hbmRzLCBvbkRvbmUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmh0dHAub25lcnJvciA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVFcnJvcignb25lcnJvcicsIFwiXCIpO1xuICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5odHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuaHR0cC5yZWFkeVN0YXRlID09IF90aGlzLkh0dHBDb2Rlcy5maW5pc2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuaHR0cC5zdGF0dXMgPT0gX3RoaXMuSHR0cENvZGVzLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZVRleHQgPSBfdGhpcy5odHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZVRleHQudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VDb21tYW5kcyA9IF90aGlzLmNvZGVjLmRlY29kZShyZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUocmVzcG9uc2VDb21tYW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZCBwYXJzaW5nIHJlc3BvbnNlVGV4dDogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5jb3JyZWN0IHJlc3BvbnNlVGV4dDogXCIsIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmhhbmRsZUVycm9yKCdhcHBsaWNhdGlvbicsIFwiSHR0cFRyYW5zbWl0dGVyOiBJbmNvcnJlY3QgcmVzcG9uc2VUZXh0OiBcIiArIHJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IGVtcHR5IHJlc3BvbnNlVGV4dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkRvbmUoW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlRXJyb3IoJ2FwcGxpY2F0aW9uJywgXCJIdHRwVHJhbnNtaXR0ZXI6IEhUVFAgU3RhdHVzICE9IDIwMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRG9uZShbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoXCJvdmVycmlkZU1pbWVUeXBlXCIgaW4gdGhpcy5odHRwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVwiICsgdGhpcy5jaGFyc2V0KTsgLy8gdG9kbyBtYWtlIGluamVjdGFibGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaHR0cC5zZW5kKHRoaXMuY29kZWMuZW5jb2RlKGNvbW1hbmRzKSk7XG4gICAgICAgIH07XG4gICAgICAgIEh0dHBUcmFuc21pdHRlci5wcm90b3R5cGUuaGFuZGxlRXJyb3IgPSBmdW5jdGlvbiAoa2luZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgdmFyIGVycm9yRXZlbnQgPSB7IGtpbmQ6IGtpbmQsIHVybDogdGhpcy51cmwsIGh0dHBTdGF0dXM6IHRoaXMuaHR0cC5zdGF0dXMsIG1lc3NhZ2U6IG1lc3NhZ2UgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVycm9ySGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyKGVycm9yRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBvY2N1cnJlZDogXCIsIGVycm9yRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBIdHRwVHJhbnNtaXR0ZXIucHJvdG90eXBlLnNpZ25hbCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLnNpZy5vcGVuKCdQT1NUJywgdGhpcy51cmwsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5zaWcuc2VuZCh0aGlzLmNvZGVjLmVuY29kZShbY29tbWFuZF0pKTtcbiAgICAgICAgfTtcbiAgICAgICAgSHR0cFRyYW5zbWl0dGVyLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5odHRwLm9wZW4oJ1BPU1QnLCB0aGlzLnVybCArICdpbnZhbGlkYXRlPycsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5zZW5kKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBIdHRwVHJhbnNtaXR0ZXI7XG4gICAgfSkoKTtcbiAgICBvcGVuZG9scGhpbi5IdHRwVHJhbnNtaXR0ZXIgPSBIdHRwVHJhbnNtaXR0ZXI7XG59KShvcGVuZG9scGhpbiB8fCAob3BlbmRvbHBoaW4gPSB7fSkpO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudERvbHBoaW4udHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiT3BlbkRvbHBoaW4udHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50Q29ubmVjdG9yLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNsaWVudE1vZGVsU3RvcmUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTm9UcmFuc21pdHRlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJIdHRwVHJhbnNtaXR0ZXIudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ2xpZW50QXR0cmlidXRlLnRzXCIvPlxudmFyIG9wZW5kb2xwaGluO1xuKGZ1bmN0aW9uIChvcGVuZG9scGhpbikge1xuICAgIHZhciBEb2xwaGluQnVpbGRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIERvbHBoaW5CdWlsZGVyKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldF8gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2xhY2tNU18gPSAzMDA7XG4gICAgICAgICAgICB0aGlzLm1heEJhdGNoU2l6ZV8gPSA1MDtcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydENPUlNfID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLnVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgIHRoaXMudXJsXyA9IHVybDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAocmVzZXQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRfID0gcmVzZXQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLnNsYWNrTVMgPSBmdW5jdGlvbiAoc2xhY2tNUykge1xuICAgICAgICAgICAgdGhpcy5zbGFja01TXyA9IHNsYWNrTVM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLm1heEJhdGNoU2l6ZSA9IGZ1bmN0aW9uIChtYXhCYXRjaFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMubWF4QmF0Y2hTaXplXyA9IG1heEJhdGNoU2l6ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuc3VwcG9ydENPUlMgPSBmdW5jdGlvbiAoc3VwcG9ydENPUlMpIHtcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydENPUlNfID0gc3VwcG9ydENPUlM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgRG9scGhpbkJ1aWxkZXIucHJvdG90eXBlLmVycm9ySGFuZGxlciA9IGZ1bmN0aW9uIChlcnJvckhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyXyA9IGVycm9ySGFuZGxlcjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBEb2xwaGluQnVpbGRlci5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW5Eb2xwaGluIGpzIGZvdW5kXCIpO1xuICAgICAgICAgICAgdmFyIGNsaWVudERvbHBoaW4gPSBuZXcgb3BlbmRvbHBoaW4uQ2xpZW50RG9scGhpbigpO1xuICAgICAgICAgICAgdmFyIHRyYW5zbWl0dGVyO1xuICAgICAgICAgICAgaWYgKHRoaXMudXJsXyAhPSBudWxsICYmIHRoaXMudXJsXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNtaXR0ZXIgPSBuZXcgb3BlbmRvbHBoaW4uSHR0cFRyYW5zbWl0dGVyKHRoaXMudXJsXywgdGhpcy5yZXNldF8sIFwiVVRGLThcIiwgdGhpcy5lcnJvckhhbmRsZXJfLCB0aGlzLnN1cHBvcnRDT1JTXyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFuc21pdHRlciA9IG5ldyBvcGVuZG9scGhpbi5Ob1RyYW5zbWl0dGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGllbnREb2xwaGluLnNldENsaWVudENvbm5lY3RvcihuZXcgb3BlbmRvbHBoaW4uQ2xpZW50Q29ubmVjdG9yKHRyYW5zbWl0dGVyLCBjbGllbnREb2xwaGluLCB0aGlzLnNsYWNrTVNfLCB0aGlzLm1heEJhdGNoU2l6ZV8pKTtcbiAgICAgICAgICAgIGNsaWVudERvbHBoaW4uc2V0Q2xpZW50TW9kZWxTdG9yZShuZXcgb3BlbmRvbHBoaW4uQ2xpZW50TW9kZWxTdG9yZShjbGllbnREb2xwaGluKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsaWVudERvbHBoaW4gaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgICByZXR1cm4gY2xpZW50RG9scGhpbjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIERvbHBoaW5CdWlsZGVyO1xuICAgIH0pKCk7XG4gICAgb3BlbmRvbHBoaW4uRG9scGhpbkJ1aWxkZXIgPSBEb2xwaGluQnVpbGRlcjtcbn0pKG9wZW5kb2xwaGluIHx8IChvcGVuZG9scGhpbiA9IHt9KSk7XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tbWFuZC50c1wiIC8+XG52YXIgb3BlbmRvbHBoaW47XG4oZnVuY3Rpb24gKG9wZW5kb2xwaGluKSB7XG4gICAgdmFyIEdldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhHZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEdldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZChwbUlkKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucG1JZCA9IHBtSWQ7XG4gICAgICAgICAgICB0aGlzLmlkID0gJ0dldFByZXNlbnRhdGlvbk1vZGVsJztcbiAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcmcub3BlbmRvbHBoaW4uY29yZS5jb21tLkdldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQ7XG4gICAgfSkob3BlbmRvbHBoaW4uQ29tbWFuZCk7XG4gICAgb3BlbmRvbHBoaW4uR2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kID0gR2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21tYW5kLnRzXCIgLz5cbnZhciBvcGVuZG9scGhpbjtcbihmdW5jdGlvbiAob3BlbmRvbHBoaW4pIHtcbiAgICB2YXIgUmVzZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoUmVzZXRQcmVzZW50YXRpb25Nb2RlbENvbW1hbmQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIFJlc2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kKHBtSWQpIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbUlkID0gcG1JZDtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAnUmVzZXRQcmVzZW50YXRpb25Nb2RlbCc7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3JnLm9wZW5kb2xwaGluLmNvcmUuY29tbS5SZXNldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSZXNldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZDtcbiAgICB9KShvcGVuZG9scGhpbi5Db21tYW5kKTtcbiAgICBvcGVuZG9scGhpbi5SZXNldFByZXNlbnRhdGlvbk1vZGVsQ29tbWFuZCA9IFJlc2V0UHJlc2VudGF0aW9uTW9kZWxDb21tYW5kO1xufSkob3BlbmRvbHBoaW4gfHwgKG9wZW5kb2xwaGluID0ge30pKTtcblxubW9kdWxlLmV4cG9ydHMgPSBvcGVuZG9scGhpbjsiLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIE1hcCA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL21hcCcpO1xudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKS5leGlzdHM7XG5cblxuZnVuY3Rpb24gQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KSB7XG4gICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgdGhpcy5hZGRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMucmVtb3ZlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMudXBkYXRlZEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5hbGxBZGRlZEhhbmRsZXJzID0gW107XG4gICAgdGhpcy5hbGxSZW1vdmVkSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLmFsbFVwZGF0ZWRIYW5kbGVycyA9IFtdO1xuICAgIHRoaXMuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMgPSBbXTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5BZGRlZChmdW5jdGlvbih0eXBlLCBiZWFuKSB7XG4gICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICBoYW5kbGVyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGJlYW4pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkJlYW5SZW1vdmVkKGZ1bmN0aW9uKHR5cGUsIGJlYW4pIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlcihiZWFuKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkub25CZWFuVXBkYXRlKGZ1bmN0aW9uKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgIGhhbmRsZXJMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5vbkFycmF5VXBkYXRlKGZ1bmN0aW9uKHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50KSB7XG4gICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIoYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIG5ld0VsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCBuZXdFbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn1cblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUubm90aWZ5QmVhbkNoYW5nZSA9IGZ1bmN0aW9uKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc1JlcG9zaXRvcnkubm90aWZ5QmVhbkNoYW5nZShiZWFuLCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlKTtcbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm5vdGlmeUFycmF5Q2hhbmdlID0gZnVuY3Rpb24oYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5Lm5vdGlmeUFycmF5Q2hhbmdlKGJlYW4sIHByb3BlcnR5TmFtZSwgaW5kZXgsIGNvdW50LCByZW1vdmVkRWxlbWVudHMpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuaXNNYW5hZ2VkID0gZnVuY3Rpb24oYmVhbikge1xuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmlzTWFuYWdlZCgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4uY3JlYXRlKCkgW0RQLTddXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHR5cGUsIGJlYW4pIHtcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5hZGQoKSBbRFAtN11cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUuYWRkQWxsID0gZnVuY3Rpb24odHlwZSwgY29sbGVjdGlvbikge1xuICAgIC8vIFRPRE86IEltcGxlbWVudCBkb2xwaGluLmFkZEFsbCgpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihiZWFuKSB7XG4gICAgLy8gVE9ETzogSW1wbGVtZW50IGRvbHBoaW4ucmVtb3ZlKCkgW0RQLTddXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVBbGwoKSBbRFAtN11cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlSWYgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgZG9scGhpbi5yZW1vdmVJZigpIFtEUC03XVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5vbkFkZGVkID0gZnVuY3Rpb24odHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgc2VsZi5hbGxBZGRlZEhhbmRsZXJzID0gc2VsZi5hbGxBZGRlZEhhbmRsZXJzLmNvbmNhdChldmVudEhhbmRsZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWxsQWRkZWRIYW5kbGVycyA9IHNlbGYuYWxsQWRkZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5hZGRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKCFleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICBoYW5kbGVyTGlzdCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuYWRkZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYWRkZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRlZEhhbmRsZXJzLnNldCh0eXBlLCBoYW5kbGVyTGlzdC5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cblxuQmVhbk1hbmFnZXIucHJvdG90eXBlLm9uUmVtb3ZlZCA9IGZ1bmN0aW9uKHR5cGUsIGV2ZW50SGFuZGxlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIWV4aXN0cyhldmVudEhhbmRsZXIpKSB7XG4gICAgICAgIGV2ZW50SGFuZGxlciA9IHR5cGU7XG4gICAgICAgIHNlbGYuYWxsUmVtb3ZlZEhhbmRsZXJzID0gc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hbGxSZW1vdmVkSGFuZGxlcnMgPSBzZWxmLmFsbFJlbW92ZWRIYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGhhbmRsZXJMaXN0ID0gc2VsZi5yZW1vdmVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmNvbmNhdChldmVudEhhbmRsZXIpKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnJlbW92ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuXG5CZWFuTWFuYWdlci5wcm90b3R5cGUub25CZWFuVXBkYXRlID0gZnVuY3Rpb24odHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgc2VsZi5hbGxVcGRhdGVkSGFuZGxlcnMgPSBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycy5jb25jYXQoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFsbFVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsVXBkYXRlZEhhbmRsZXJzLmZpbHRlcihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaGFuZGxlckxpc3QgPSBzZWxmLnVwZGF0ZWRIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgICAgIGlmICghZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgaGFuZGxlckxpc3QgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYudXBkYXRlZEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKGhhbmRsZXJMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IGV2ZW50SGFuZGxlcjtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5cbkJlYW5NYW5hZ2VyLnByb3RvdHlwZS5vbkFycmF5VXBkYXRlID0gZnVuY3Rpb24odHlwZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghZXhpc3RzKGV2ZW50SGFuZGxlcikpIHtcbiAgICAgICAgZXZlbnRIYW5kbGVyID0gdHlwZTtcbiAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuY29uY2F0KGV2ZW50SGFuZGxlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hbGxBcnJheVVwZGF0ZWRIYW5kbGVycyA9IHNlbGYuYWxsQXJyYXlVcGRhdGVkSGFuZGxlcnMuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gZXZlbnRIYW5kbGVyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAoIWV4aXN0cyhoYW5kbGVyTGlzdCkpIHtcbiAgICAgICAgICAgIGhhbmRsZXJMaXN0ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5hcnJheVVwZGF0ZWRIYW5kbGVycy5zZXQodHlwZSwgaGFuZGxlckxpc3QuY29uY2F0KGV2ZW50SGFuZGxlcikpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyTGlzdCA9IHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuZ2V0KHR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdHMoaGFuZGxlckxpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXJyYXlVcGRhdGVkSGFuZGxlcnMuc2V0KHR5cGUsIGhhbmRsZXJMaXN0LmZpbHRlcihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuXG5cbmV4cG9ydHMuQmVhbk1hbmFnZXIgPSBCZWFuTWFuYWdlcjsiLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuLyogZ2xvYmFsIFBsYXRmb3JtLCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBNYXAgPSByZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2NvcmUuanMvbGlicmFyeS9mbi9tYXAnKTtcbnZhciBvcGVuZG9scGhpbiA9IHJlcXVpcmUoJy4uL2xpYnNyYy9vcGVuZG9scGhpbi5qcycpO1xuXG52YXIgZXhpc3RzID0gcmVxdWlyZSgnLi91dGlscy5qcycpLmV4aXN0cztcblxudmFyIFVOS05PV04gPSAwLFxuICAgIEJBU0lDX1RZUEUgPSAxLFxuICAgIERPTFBISU5fQkVBTiA9IDI7XG5cbnZhciBibG9ja2VkID0gbnVsbDtcblxuZnVuY3Rpb24gZnJvbURvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB0eXBlLCB2YWx1ZSkge1xuICAgIHJldHVybiAhIGV4aXN0cyh2YWx1ZSk/IG51bGxcbiAgICAgICAgOiB0eXBlID09PSBET0xQSElOX0JFQU4/IGNsYXNzUmVwb3NpdG9yeS5iZWFuRnJvbURvbHBoaW4uZ2V0KHZhbHVlKSA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0b0RvbHBoaW4oY2xhc3NSZXBvc2l0b3J5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnPyBjbGFzc1JlcG9zaXRvcnkuYmVhblRvRG9scGhpbi5nZXQodmFsdWUpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHNlbmRMaXN0QWRkKGRvbHBoaW4sIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgcG9zLCBlbGVtZW50KSB7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBbXG4gICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdAQEAgU09VUkNFX1NZU1RFTSBAQEAnLCBudWxsLCAnY2xpZW50JyksXG4gICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdzb3VyY2UnLCBudWxsLCBtb2RlbElkKSxcbiAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG51bGwsIHByb3BlcnR5TmFtZSksXG4gICAgICAgIGRvbHBoaW4uYXR0cmlidXRlKCdwb3MnLCBudWxsLCBwb3MpLFxuICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnZWxlbWVudCcsIG51bGwsIGVsZW1lbnQpXG4gICAgXTtcbiAgICBkb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KGRvbHBoaW4sIFtudWxsLCAnQEBAIExJU1RfQUREIEBAQCddLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRMaXN0UmVtb3ZlKGRvbHBoaW4sIG1vZGVsSWQsIHByb3BlcnR5TmFtZSwgZnJvbSwgdG8pIHtcbiAgICB2YXIgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ0BAQCBTT1VSQ0VfU1lTVEVNIEBAQCcsIG51bGwsICdjbGllbnQnKSxcbiAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3NvdXJjZScsIG51bGwsIG1vZGVsSWQpLFxuICAgICAgICBkb2xwaGluLmF0dHJpYnV0ZSgnYXR0cmlidXRlJywgbnVsbCwgcHJvcGVydHlOYW1lKSxcbiAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ2Zyb20nLCBudWxsLCBmcm9tKSxcbiAgICAgICAgZG9scGhpbi5hdHRyaWJ1dGUoJ3RvJywgbnVsbCwgdG8pXG4gICAgXTtcbiAgICBkb2xwaGluLnByZXNlbnRhdGlvbk1vZGVsLmFwcGx5KGRvbHBoaW4sIFtudWxsLCAnQEBAIExJU1RfREVMIEBAQCddLmNvbmNhdChhdHRyaWJ1dGVzKSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGlzdChjbGFzc1JlcG9zaXRvcnksIHR5cGUsIGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgIHZhciBsaXN0ID0gYmVhbltwcm9wZXJ0eU5hbWVdO1xuICAgIGlmICghZXhpc3RzKGxpc3QpKSB7XG4gICAgICAgIGNsYXNzUmVwb3NpdG9yeS5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBwcm9wZXJ0eU5hbWUsIFtdLCB1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJsb2NrKGJlYW4sIHByb3BlcnR5TmFtZSkge1xuICAgIGlmIChleGlzdHMoYmxvY2tlZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gY3JlYXRlIGEgYmxvY2sgd2hpbGUgYW5vdGhlciBibG9jayBleGlzdHMnKTtcbiAgICB9XG4gICAgYmxvY2tlZCA9IHtcbiAgICAgICAgYmVhbjogYmVhbixcbiAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBpc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSB7XG4gICAgcmV0dXJuIGV4aXN0cyhibG9ja2VkKSAmJiBibG9ja2VkLmJlYW4gPT09IGJlYW4gJiYgYmxvY2tlZC5wcm9wZXJ0eU5hbWUgPT09IHByb3BlcnR5TmFtZTtcbn1cblxuZnVuY3Rpb24gdW5ibG9jaygpIHtcbiAgICBibG9ja2VkID0gbnVsbDtcbn1cblxuXG5mdW5jdGlvbiBDbGFzc1JlcG9zaXRvcnkoZG9scGhpbikge1xuICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgdGhpcy5jbGFzc2VzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmVhbkZyb21Eb2xwaGluID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYmVhblRvRG9scGhpbiA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmNsYXNzSW5mb3MgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5iZWFuQWRkZWRIYW5kbGVycyA9IFtdO1xuICAgIHRoaXMuYmVhblJlbW92ZWRIYW5kbGVycyA9IFtdO1xuICAgIHRoaXMucHJvcGVydHlVcGRhdGVIYW5kbGVycyA9IFtdO1xuICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycyA9IFtdO1xufVxuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUubm90aWZ5QmVhbkNoYW5nZSA9IGZ1bmN0aW9uKGJlYW4sIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUpIHtcbiAgICB2YXIgbW9kZWxJZCA9IHRoaXMuYmVhblRvRG9scGhpbi5nZXQoYmVhbik7XG4gICAgaWYgKGV4aXN0cyhtb2RlbElkKSkge1xuICAgICAgICB2YXIgbW9kZWwgPSB0aGlzLmRvbHBoaW4uZmluZFByZXNlbnRhdGlvbk1vZGVsQnlJZChtb2RlbElkKTtcbiAgICAgICAgaWYgKGV4aXN0cyhtb2RlbCkpIHtcbiAgICAgICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNsYXNzSW5mb1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0cyh0eXBlKSAmJiBleGlzdHMoYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGF0dHJpYnV0ZS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5zZXRWYWx1ZSh0b0RvbHBoaW4odGhpcywgbmV3VmFsdWUpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbURvbHBoaW4odGhpcywgdHlwZSwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm5vdGlmeUFycmF5Q2hhbmdlID0gZnVuY3Rpb24oYmVhbiwgcHJvcGVydHlOYW1lLCBpbmRleCwgY291bnQsIHJlbW92ZWRFbGVtZW50cykge1xuICAgIGlmIChpc0Jsb2NrZWQoYmVhbiwgcHJvcGVydHlOYW1lKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBtb2RlbElkID0gdGhpcy5iZWFuVG9Eb2xwaGluLmdldChiZWFuKTtcbiAgICB2YXIgYXJyYXkgPSBiZWFuW3Byb3BlcnR5TmFtZV07XG4gICAgaWYgKGV4aXN0cyhtb2RlbElkKSAmJiBleGlzdHMoYXJyYXkpKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlbW92ZWRFbGVtZW50cykgJiYgcmVtb3ZlZEVsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlbmRMaXN0UmVtb3ZlKHRoaXMuZG9scGhpbiwgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBpbmRleCwgaW5kZXggKyByZW1vdmVkRWxlbWVudHMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gaW5kZXg7IGkgPCBpbmRleCArIGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHNlbmRMaXN0QWRkKHRoaXMuZG9scGhpbiwgbW9kZWxJZCwgcHJvcGVydHlOYW1lLCBpLCB0b0RvbHBoaW4odGhpcywgYXJyYXlbaV0pKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5vbkJlYW5BZGRlZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICB0aGlzLmJlYW5BZGRlZEhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUub25CZWFuUmVtb3ZlZCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5vbkJlYW5VcGRhdGUgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgdGhpcy5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUub25BcnJheVVwZGF0ZSA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICB0aGlzLmFycmF5VXBkYXRlSGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5yZWdpc3RlckNsYXNzID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgaWYgKHRoaXMuY2xhc3Nlcy5oYXMobW9kZWwuaWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2xhc3NJbmZvID0ge307XG4gICAgbW9kZWwuYXR0cmlidXRlcy5maWx0ZXIoZnVuY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGUucHJvcGVydHlOYW1lLnNlYXJjaCgvXkBAQCAvKSA8IDA7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGNsYXNzSW5mb1thdHRyaWJ1dGUucHJvcGVydHlOYW1lXSA9IFVOS05PV047XG5cbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBjbGFzc0luZm9bYXR0cmlidXRlLnByb3BlcnR5TmFtZV0gPSBldmVudC5uZXdWYWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5jbGFzc2VzLnNldChtb2RlbC5pZCwgY2xhc3NJbmZvKTtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS51bnJlZ2lzdGVyQ2xhc3MgPSBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICB0aGlzLmNsYXNzZXNbJ2RlbGV0ZSddKG1vZGVsLmlkKTtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzZXMuZ2V0KG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSk7XG4gICAgdmFyIGJlYW4gPSB7fTtcbiAgICBtb2RlbC5hdHRyaWJ1dGVzLmZpbHRlcihmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIHJldHVybiAoYXR0cmlidXRlLnRhZyA9PT0gb3BlbmRvbHBoaW4uVGFnLnZhbHVlKCkpICYmIChhdHRyaWJ1dGUucHJvcGVydHlOYW1lLnNlYXJjaCgvXkBAQCAvKSA8IDApO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICBiZWFuW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdID0gbnVsbDtcbiAgICAgICAgYXR0cmlidXRlLm9uVmFsdWVDaGFuZ2UoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQub2xkVmFsdWUgIT09IGV2ZW50Lm5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gZnJvbURvbHBoaW4oc2VsZiwgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdLCBldmVudC5vbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gZnJvbURvbHBoaW4oc2VsZiwgY2xhc3NJbmZvW2F0dHJpYnV0ZS5wcm9wZXJ0eU5hbWVdLCBldmVudC5uZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgc2VsZi5wcm9wZXJ0eVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbiwgYXR0cmlidXRlLnByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5iZWFuRnJvbURvbHBoaW4uc2V0KG1vZGVsLmlkLCBiZWFuKTtcbiAgICB0aGlzLmJlYW5Ub0RvbHBoaW4uc2V0KGJlYW4sIG1vZGVsLmlkKTtcbiAgICB0aGlzLmNsYXNzSW5mb3Muc2V0KG1vZGVsLmlkLCBjbGFzc0luZm8pO1xuICAgIHRoaXMuYmVhbkFkZGVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgIGhhbmRsZXIobW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlLCBiZWFuKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYmVhbjtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS51bmxvYWQgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHZhciBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KG1vZGVsLmlkKTtcbiAgICB0aGlzLmJlYW5Gcm9tRG9scGhpblsnZGVsZXRlJ10obW9kZWwuaWQpO1xuICAgIHRoaXMuYmVhblRvRG9scGhpblsnZGVsZXRlJ10oYmVhbik7XG4gICAgdGhpcy5jbGFzc0luZm9zWydkZWxldGUnXShtb2RlbC5pZCk7XG4gICAgaWYgKGV4aXN0cyhiZWFuKSkge1xuICAgICAgICB0aGlzLmJlYW5SZW1vdmVkSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyKG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZSwgYmVhbik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYmVhbjtcbn07XG5cblxuQ2xhc3NSZXBvc2l0b3J5LnByb3RvdHlwZS5hZGRMaXN0RW50cnkgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHZhciBzb3VyY2UgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3NvdXJjZScpO1xuICAgIHZhciBhdHRyaWJ1dGUgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ2F0dHJpYnV0ZScpO1xuICAgIHZhciBwb3MgPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoJ3BvcycpO1xuICAgIHZhciBlbGVtZW50ID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdlbGVtZW50Jyk7XG5cbiAgICBpZiAoZXhpc3RzKHNvdXJjZSkgJiYgZXhpc3RzKGF0dHJpYnV0ZSkgJiYgZXhpc3RzKHBvcykgJiYgZXhpc3RzKGVsZW1lbnQpKSB7XG4gICAgICAgIHZhciBjbGFzc0luZm8gPSB0aGlzLmNsYXNzSW5mb3MuZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgIHZhciBiZWFuID0gdGhpcy5iZWFuRnJvbURvbHBoaW4uZ2V0KHNvdXJjZS52YWx1ZSk7XG4gICAgICAgIGlmIChleGlzdHMoYmVhbikgJiYgZXhpc3RzKGNsYXNzSW5mbykpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gbW9kZWwucHJlc2VudGF0aW9uTW9kZWxUeXBlO1xuICAgICAgICAgICAgdmFyIGVudHJ5ID0gZnJvbURvbHBoaW4odGhpcywgY2xhc3NJbmZvW2F0dHJpYnV0ZS52YWx1ZV0sIGVsZW1lbnQudmFsdWUpO1xuICAgICAgICAgICAgdmFsaWRhdGVMaXN0KHRoaXMsIHR5cGUsIGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJsb2NrKGJlYW4sIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheVVwZGF0ZUhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcih0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUsIHBvcy52YWx1ZSwgMCwgZW50cnkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB1bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZC4gU291cmNlIGJlYW4gdW5rbm93bi5cIik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICB9XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUuZGVsTGlzdEVudHJ5ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB2YXIgc291cmNlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdzb3VyY2UnKTtcbiAgICB2YXIgYXR0cmlidXRlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdhdHRyaWJ1dGUnKTtcbiAgICB2YXIgZnJvbSA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnZnJvbScpO1xuICAgIHZhciB0byA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgndG8nKTtcblxuICAgIGlmIChleGlzdHMoc291cmNlKSAmJiBleGlzdHMoYXR0cmlidXRlKSAmJiBleGlzdHMoZnJvbSkgJiYgZXhpc3RzKHRvKSkge1xuICAgICAgICB2YXIgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICBpZiAoZXhpc3RzKGJlYW4pKSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgIHZhbGlkYXRlTGlzdCh0aGlzLCB0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBibG9jayhiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlLCBmcm9tLnZhbHVlLCB0by52YWx1ZSAtIGZyb20udmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB1bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZC4gU291cmNlIGJlYW4gdW5rbm93bi5cIik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICB9XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUuc2V0TGlzdEVudHJ5ID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB2YXIgc291cmNlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdzb3VyY2UnKTtcbiAgICB2YXIgYXR0cmlidXRlID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdhdHRyaWJ1dGUnKTtcbiAgICB2YXIgcG9zID0gbW9kZWwuZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKCdwb3MnKTtcbiAgICB2YXIgZWxlbWVudCA9IG1vZGVsLmZpbmRBdHRyaWJ1dGVCeVByb3BlcnR5TmFtZSgnZWxlbWVudCcpO1xuXG4gICAgaWYgKGV4aXN0cyhzb3VyY2UpICYmIGV4aXN0cyhhdHRyaWJ1dGUpICYmIGV4aXN0cyhwb3MpICYmIGV4aXN0cyhlbGVtZW50KSkge1xuICAgICAgICB2YXIgY2xhc3NJbmZvID0gdGhpcy5jbGFzc0luZm9zLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICB2YXIgYmVhbiA9IHRoaXMuYmVhbkZyb21Eb2xwaGluLmdldChzb3VyY2UudmFsdWUpO1xuICAgICAgICBpZiAoZXhpc3RzKGJlYW4pICYmIGV4aXN0cyhjbGFzc0luZm8pKSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGZyb21Eb2xwaGluKHRoaXMsIGNsYXNzSW5mb1thdHRyaWJ1dGUudmFsdWVdLCBlbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICAgIHZhbGlkYXRlTGlzdCh0aGlzLCB0eXBlLCBiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBibG9jayhiZWFuLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlVcGRhdGVIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIodHlwZSwgYmVhbiwgYXR0cmlidXRlLnZhbHVlLCBwb3MudmFsdWUsIDEsIGVudHJ5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdW5ibG9jaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsaXN0IG1vZGlmaWNhdGlvbiB1cGRhdGUgcmVjZWl2ZWQuIFNvdXJjZSBiZWFuIHVua25vd24uXCIpO1xuICAgICAgICB9XG4gICAgfWVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxpc3QgbW9kaWZpY2F0aW9uIHVwZGF0ZSByZWNlaXZlZFwiKTtcbiAgICB9XG59O1xuXG5cbkNsYXNzUmVwb3NpdG9yeS5wcm90b3R5cGUubWFwUGFyYW1Ub0RvbHBoaW4gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgIGlmICghZXhpc3RzKHBhcmFtKSkge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBwYXJhbSwgdHlwZTogVU5LTk9XTn07XG4gICAgfVxuICAgIHZhciB0eXBlID0gdHlwZW9mIHBhcmFtO1xuICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmJlYW5Ub0RvbHBoaW4uZ2V0KHBhcmFtKTtcbiAgICAgICAgaWYgKGV4aXN0cyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6IHZhbHVlLCB0eXBlOiBET0xQSElOX0JFQU59O1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBjYW4gYmUgdXNlZFwiKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBwYXJhbSwgdHlwZTogQkFTSUNfVFlQRX07XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPbmx5IG1hbmFnZWQgRG9scGhpbiBCZWFucyBhbmQgcHJpbWl0aXZlIHR5cGVzIGNhbiBiZSB1c2VkXCIpO1xufTtcblxuXG5DbGFzc1JlcG9zaXRvcnkucHJvdG90eXBlLm1hcERvbHBoaW5Ub0JlYW4gPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSkge1xuICAgIHJldHVybiBmcm9tRG9scGhpbih0aGlzLCB0eXBlLCB2YWx1ZSk7XG59O1xuXG5cblxuZXhwb3J0cy5DbGFzc1JlcG9zaXRvcnkgPSBDbGFzc1JlcG9zaXRvcnk7XG5leHBvcnRzLlVOS05PV04gPSBVTktOT1dOO1xuZXhwb3J0cy5CQVNJQ19UWVBFID0gQkFTSUNfVFlQRTtcbmV4cG9ydHMuRE9MUEhJTl9CRUFOID0gRE9MUEhJTl9CRUFOO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZScpO1xudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKS5leGlzdHM7XG5cblxuXG5mdW5jdGlvbiBDbGllbnRDb250ZXh0KGRvbHBoaW4sIGJlYW5NYW5hZ2VyLCBjb250cm9sbGVyTWFuYWdlcikge1xuICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgdGhpcy5iZWFuTWFuYWdlciA9IGJlYW5NYW5hZ2VyO1xuICAgIHRoaXMuX2NvbnRyb2xsZXJNYW5hZ2VyID0gY29udHJvbGxlck1hbmFnZXI7XG59XG5cblxuQ2xpZW50Q29udGV4dC5wcm90b3R5cGUuY3JlYXRlQ29udHJvbGxlciA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udHJvbGxlck1hbmFnZXIuY3JlYXRlQ29udHJvbGxlcihuYW1lKTtcbn07XG5cblxuQ2xpZW50Q29udGV4dC5wcm90b3R5cGUuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IEltcGxlbWVudCBDbGllbnRDb250ZXh0LmRpc2Nvbm5lY3QgW0RQLTQ2XVxuICAgIHRoaXMuZG9scGhpbi5zdG9wUHVzaExpc3RlbmluZygpO1xufTtcblxuXG5cbmV4cG9ydHMuQ2xpZW50Q29udGV4dCA9IENsaWVudENvbnRleHQ7IiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZScpO1xudmFyIG9wZW5kb2xwaGluID0gcmVxdWlyZSgnLi4vbGlic3JjL29wZW5kb2xwaGluLmpzJyk7XG52YXIgZXhpc3RzID0gcmVxdWlyZSgnLi91dGlscy5qcycpLmV4aXN0cztcblxuXG52YXIgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbnZhciBQT0xMX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2xvbmdQb2xsJztcbnZhciBSRUxFQVNFX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ3JlbGVhc2UnO1xuXG52YXIgRE9MUEhJTl9CRUFOID0gJ0BAQCBET0xQSElOX0JFQU4gQEBAJztcbnZhciBBQ1RJT05fQ0FMTF9CRUFOID0gJ0BAQCBDT05UUk9MTEVSX0FDVElPTl9DQUxMX0JFQU4gQEBAJztcbnZhciBISUdITEFOREVSX0JFQU4gPSAnQEBAIEhJR0hMQU5ERVJfQkVBTiBAQEAnO1xudmFyIERPTFBISU5fTElTVF9BREQgPSAnQEBAIExJU1RfQUREIEBAQCc7XG52YXIgRE9MUEhJTl9MSVNUX0RFTCA9ICdAQEAgTElTVF9ERUwgQEBAJztcbnZhciBET0xQSElOX0xJU1RfU0VUID0gJ0BAQCBMSVNUX1NFVCBAQEAnO1xudmFyIFNPVVJDRV9TWVNURU0gPSAnQEBAIFNPVVJDRV9TWVNURU0gQEBAJztcbnZhciBTT1VSQ0VfU1lTVEVNX0NMSUVOVCA9ICdjbGllbnQnO1xudmFyIFNPVVJDRV9TWVNURU1fU0VSVkVSID0gJ3NlcnZlcic7XG5cblxuXG52YXIgaW5pdGlhbGl6ZXI7XG5cbmZ1bmN0aW9uIENvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZG9scGhpbiA9IGRvbHBoaW47XG4gICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkgPSBjbGFzc1JlcG9zaXRvcnk7XG4gICAgdGhpcy5oaWdobGFuZGVyUE1SZXNvbHZlciA9IGZ1bmN0aW9uKCkge307XG4gICAgdGhpcy5oaWdobGFuZGVyUE1Qcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBzZWxmLmhpZ2hsYW5kZXJQTVJlc29sdmVyID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIGRvbHBoaW4uZ2V0Q2xpZW50TW9kZWxTdG9yZSgpLm9uTW9kZWxTdG9yZUNoYW5nZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gZXZlbnQuY2xpZW50UHJlc2VudGF0aW9uTW9kZWw7XG4gICAgICAgIHZhciBzb3VyY2VTeXN0ZW0gPSBtb2RlbC5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoU09VUkNFX1NZU1RFTSk7XG4gICAgICAgIGlmIChleGlzdHMoc291cmNlU3lzdGVtKSAmJiBzb3VyY2VTeXN0ZW0udmFsdWUgPT09IFNPVVJDRV9TWVNURU1fU0VSVkVSKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZXZlbnRUeXBlID09PSBvcGVuZG9scGhpbi5UeXBlLkFEREVEKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vbk1vZGVsQWRkZWQobW9kZWwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5ldmVudFR5cGUgPT09IG9wZW5kb2xwaGluLlR5cGUuUkVNT1ZFRCkge1xuICAgICAgICAgICAgICAgIHNlbGYub25Nb2RlbFJlbW92ZWQobW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIWV4aXN0cyhjb25maWcpIHx8ICFleGlzdHMoY29uZmlnLnNlcnZlclB1c2gpIHx8IGNvbmZpZy5zZXJ2ZXJQdXNoID09PSB0cnVlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb2xwaGluLnN0YXJ0UHVzaExpc3RlbmluZyhQT0xMX0NPTU1BTkRfTkFNRSwgUkVMRUFTRV9DT01NQU5EX05BTUUpO1xuICAgICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcmVxLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgICAgICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlcS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZWplY3QoRXJyb3IoXCJOZXR3b3JrIEVycm9yXCIpKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXEub3BlbignUE9TVCcsIHVybCArICdpbnZhbGlkYXRlPycpO1xuICAgICAgICByZXEuc2VuZCgpO1xuICAgIH0pO1xufVxuXG5cbkNvbm5lY3Rvci5wcm90b3R5cGUub25Nb2RlbEFkZGVkID0gZnVuY3Rpb24obW9kZWwpIHtcbiAgICB2YXIgdHlwZSA9IG1vZGVsLnByZXNlbnRhdGlvbk1vZGVsVHlwZTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBBQ1RJT05fQ0FMTF9CRUFOOlxuICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBET0xQSElOX0JFQU46XG4gICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5yZWdpc3RlckNsYXNzKG1vZGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEhJR0hMQU5ERVJfQkVBTjpcbiAgICAgICAgICAgIHRoaXMuaGlnaGxhbmRlclBNUmVzb2x2ZXIobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX0FERDpcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LmFkZExpc3RFbnRyeShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX0RFTDpcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LmRlbExpc3RFbnRyeShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX1NFVDpcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5LnNldExpc3RFbnRyeShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLmRvbHBoaW4uZGVsZXRlUHJlc2VudGF0aW9uTW9kZWwobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS5sb2FkKG1vZGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG5cblxuQ29ubmVjdG9yLnByb3RvdHlwZS5vbk1vZGVsUmVtb3ZlZCA9IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgdmFyIHR5cGUgPSBtb2RlbC5wcmVzZW50YXRpb25Nb2RlbFR5cGU7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRE9MUEhJTl9CRUFOOlxuICAgICAgICAgICAgdGhpcy5jbGFzc1JlcG9zaXRvcnkudW5yZWdpc3RlckNsYXNzKG1vZGVsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERPTFBISU5fTElTVF9BREQ6XG4gICAgICAgIGNhc2UgRE9MUEhJTl9MSVNUX0RFTDpcbiAgICAgICAgY2FzZSBET0xQSElOX0xJU1RfU0VUOlxuICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLmNsYXNzUmVwb3NpdG9yeS51bmxvYWQobW9kZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufTtcblxuXG5Db25uZWN0b3IucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICB2YXIgZG9scGhpbiA9IHRoaXMuZG9scGhpbjtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAvLyBUT0RPOiBUaGlzIG5lZWRzIHRvIGJlIHN5bmNocm9uaXplZCB3aXRoIGNoYW5nZXMgcHVzaGVkIHZpYSBCZWFuTWFuYWdlclxuICAgICAgICAvL2luaXRpYWxpemVyLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZG9scGhpbi5zZW5kKGNvbW1hbmQsIHtcbiAgICAgICAgICAgICAgICBvbkZpbmlzaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAvL30pO1xuICAgIH0pO1xufTtcblxuXG5Db25uZWN0b3IucHJvdG90eXBlLmdldEhpZ2hsYW5kZXJQTSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsYW5kZXJQTVByb21pc2U7XG59O1xuXG5cblxuZXhwb3J0cy5Db25uZWN0b3IgPSBDb25uZWN0b3I7XG5leHBvcnRzLlNPVVJDRV9TWVNURU0gPSBTT1VSQ0VfU1lTVEVNO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX0NMSUVOVCA9IFNPVVJDRV9TWVNURU1fQ0xJRU5UO1xuZXhwb3J0cy5TT1VSQ0VfU1lTVEVNX1NFUlZFUiA9IFNPVVJDRV9TWVNURU1fU0VSVkVSO1xuZXhwb3J0cy5BQ1RJT05fQ0FMTF9CRUFOID0gQUNUSU9OX0NBTExfQkVBTjtcbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoJy4vcG9seWZpbGxzLmpzJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvY29yZS5qcy9saWJyYXJ5L2ZuL3Byb21pc2UnKTtcbnZhciBleGlzdHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJykuZXhpc3RzO1xudmFyIENvbnRyb2xsZXJQcm94eSA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnByb3h5LmpzJykuQ29udHJvbGxlclByb3h5O1xuXG52YXIgRE9MUEhJTl9CRUFOX1RZUEUgPSByZXF1aXJlKCcuL2NsYXNzcmVwby5qcycpLkRPTFBISU5fQkVBTjtcblxudmFyIFNPVVJDRV9TWVNURU0gPSByZXF1aXJlKCcuL2Nvbm5lY3Rvci5qcycpLlNPVVJDRV9TWVNURU07XG52YXIgU09VUkNFX1NZU1RFTV9DTElFTlQgPSByZXF1aXJlKCcuL2Nvbm5lY3Rvci5qcycpLlNPVVJDRV9TWVNURU1fQ0xJRU5UO1xudmFyIEFDVElPTl9DQUxMX0JFQU4gPSByZXF1aXJlKCcuL2Nvbm5lY3Rvci5qcycpLkFDVElPTl9DQUxMX0JFQU47XG5cbnZhciBET0xQSElOX1BMQVRGT1JNX1BSRUZJWCA9ICdkb2xwaGluX3BsYXRmb3JtX2ludGVybl8nO1xudmFyIFJFR0lTVEVSX0NPTlRST0xMRVJfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAncmVnaXN0ZXJDb250cm9sbGVyJztcbnZhciBDQUxMX0NPTlRST0xMRVJfQUNUSU9OX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2NhbGxDb250cm9sbGVyQWN0aW9uJztcbnZhciBERVNUUk9ZX0NPTlRST0xMRVJfQ09NTUFORF9OQU1FID0gRE9MUEhJTl9QTEFURk9STV9QUkVGSVggKyAnZGVzdHJveUNvbnRyb2xsZXInO1xuXG52YXIgQ09OVFJPTExFUl9OQU1FID0gJ2NvbnRyb2xsZXJOYW1lJztcbnZhciBDT05UUk9MTEVSX0lEID0gJ2NvbnRyb2xsZXJJZCc7XG52YXIgTU9ERUwgPSAnbW9kZWwnO1xudmFyIEFDVElPTl9OQU1FID0gJ2FjdGlvbk5hbWUnO1xudmFyIEVSUk9SX0NPREUgPSAnZXJyb3JDb2RlJztcbnZhciBQQVJBTV9QUkVGSVggPSAnXyc7XG5cblxuZnVuY3Rpb24gQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpIHtcbiAgICB0aGlzLmRvbHBoaW4gPSBkb2xwaGluO1xuICAgIHRoaXMuY2xhc3NSZXBvc2l0b3J5ID0gY2xhc3NSZXBvc2l0b3J5O1xuICAgIHRoaXMuY29ubmVjdG9yID0gY29ubmVjdG9yO1xufVxuXG5cbkNvbnRyb2xsZXJNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVDb250cm9sbGVyID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY29udHJvbGxlcklkLCBtb2RlbElkLCBtb2RlbDtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBzZWxmLmNvbm5lY3Rvci5nZXRIaWdobGFuZGVyUE0oKS50aGVuKGZ1bmN0aW9uIChoaWdobGFuZGVyUE0pIHtcbiAgICAgICAgICAgIGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoQ09OVFJPTExFUl9OQU1FKS5zZXRWYWx1ZShuYW1lKTtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdG9yLmludm9rZShSRUdJU1RFUl9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVySWQgPSBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgbW9kZWxJZCA9IGhpZ2hsYW5kZXJQTS5maW5kQXR0cmlidXRlQnlQcm9wZXJ0eU5hbWUoTU9ERUwpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgbW9kZWwgPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBEb2xwaGluVG9CZWFuKG1vZGVsSWQsIERPTFBISU5fQkVBTl9UWVBFKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgc2VsZikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG5Db250cm9sbGVyTWFuYWdlci5wcm90b3R5cGUuaW52b2tlQWN0aW9uID0gZnVuY3Rpb24oY29udHJvbGxlcklkLCBhY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gW1xuICAgICAgICAgICAgc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShTT1VSQ0VfU1lTVEVNLCBudWxsLCBTT1VSQ0VfU1lTVEVNX0NMSUVOVCksXG4gICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKENPTlRST0xMRVJfSUQsIG51bGwsIGNvbnRyb2xsZXJJZCksXG4gICAgICAgICAgICBzZWxmLmRvbHBoaW4uYXR0cmlidXRlKEFDVElPTl9OQU1FLCBudWxsLCBhY3Rpb25OYW1lKSxcbiAgICAgICAgICAgIHNlbGYuZG9scGhpbi5hdHRyaWJ1dGUoRVJST1JfQ09ERSlcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAoZXhpc3RzKHBhcmFtcykpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW0gPSBzZWxmLmNsYXNzUmVwb3NpdG9yeS5tYXBQYXJhbVRvRG9scGhpbihwYXJhbXNbcHJvcF0pO1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShQQVJBTV9QUkVGSVggKyBwcm9wLCBudWxsLCBwYXJhbS52YWx1ZSwgJ1ZBTFVFJykpO1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goc2VsZi5kb2xwaGluLmF0dHJpYnV0ZShQQVJBTV9QUkVGSVggKyBwcm9wLCBudWxsLCBwYXJhbS50eXBlLCAnVkFMVUVfVFlQRScpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcG0gPSBzZWxmLmRvbHBoaW4ucHJlc2VudGF0aW9uTW9kZWwuYXBwbHkoc2VsZi5kb2xwaGluLCBbbnVsbCwgQUNUSU9OX0NBTExfQkVBTl0uY29uY2F0KGF0dHJpYnV0ZXMpKTtcblxuICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoQ0FMTF9DT05UUk9MTEVSX0FDVElPTl9DT01NQU5EX05BTUUsIHBhcmFtcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpc0Vycm9yID0gcG0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKEVSUk9SX0NPREUpLmdldFZhbHVlKCk7XG4gICAgICAgICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJDb250cm9sbGVyQWN0aW9uIGNhdXNlZCBhbiBlcnJvclwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuZG9scGhpbi5kZWxldGVQcmVzZW50YXRpb25Nb2RlbChwbSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG5Db250cm9sbGVyTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveUNvbnRyb2xsZXIgPSBmdW5jdGlvbihjb250cm9sbGVySWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgc2VsZi5jb25uZWN0b3IuZ2V0SGlnaGxhbmRlclBNKCkudGhlbihmdW5jdGlvbiAoaGlnaGxhbmRlclBNKSB7XG4gICAgICAgICAgICBoaWdobGFuZGVyUE0uZmluZEF0dHJpYnV0ZUJ5UHJvcGVydHlOYW1lKENPTlRST0xMRVJfSUQpLnNldFZhbHVlKGNvbnRyb2xsZXJJZCk7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rvci5pbnZva2UoREVTVFJPWV9DT05UUk9MTEVSX0NPTU1BTkRfTkFNRSkudGhlbihyZXNvbHZlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5cblxuZXhwb3J0cy5Db250cm9sbGVyTWFuYWdlciA9IENvbnRyb2xsZXJNYW5hZ2VyO1xuIiwiLyogQ29weXJpZ2h0IDIwMTUgQ2Fub28gRW5naW5lZXJpbmcgQUcuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qanNsaW50IGJyb3dzZXJpZnk6IHRydWUgKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG5cInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9jb3JlLmpzL2xpYnJhcnkvZm4vcHJvbWlzZScpO1xudmFyIGV4aXN0cyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKS5leGlzdHM7XG5cblxuXG5mdW5jdGlvbiBDb250cm9sbGVyUHJveHkoY29udHJvbGxlcklkLCBtb2RlbCwgbWFuYWdlcikge1xuICAgIHRoaXMuY29udHJvbGxlcklkID0gY29udHJvbGxlcklkO1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2U7XG59XG5cblxuQ29udHJvbGxlclByb3h5LnByb3RvdHlwZS5pbnZva2UgPSBmdW5jdGlvbihuYW1lLCBwYXJhbXMpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udHJvbGxlciB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubWFuYWdlci5pbnZva2VBY3Rpb24odGhpcy5jb250cm9sbGVySWQsIG5hbWUsIHBhcmFtcyk7XG59O1xuXG5cbkNvbnRyb2xsZXJQcm94eS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb250cm9sbGVyIHdhcyBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMubWFuYWdlci5kZXN0cm95Q29udHJvbGxlcih0aGlzKTtcbn07XG5cblxuXG5leHBvcnRzLkNvbnRyb2xsZXJQcm94eSA9IENvbnRyb2xsZXJQcm94eTtcbiIsIi8qIENvcHlyaWdodCAyMDE1IENhbm9vIEVuZ2luZWVyaW5nIEFHLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyaWZ5OiB0cnVlICovXG4vKiBnbG9iYWwgUGxhdGZvcm0sIGNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpO1xudmFyIG9wZW5kb2xwaGluID0gcmVxdWlyZSgnLi4vbGlic3JjL29wZW5kb2xwaGluLmpzJyk7XG5cbnZhciBleGlzdHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJykuZXhpc3RzO1xudmFyIENvbm5lY3RvciA9IHJlcXVpcmUoJy4vY29ubmVjdG9yLmpzJykuQ29ubmVjdG9yO1xudmFyIEJlYW5NYW5hZ2VyID0gcmVxdWlyZSgnLi9iZWFubWFuYWdlci5qcycpLkJlYW5NYW5hZ2VyO1xudmFyIENsYXNzUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4vY2xhc3NyZXBvLmpzJykuQ2xhc3NSZXBvc2l0b3J5O1xudmFyIENvbnRyb2xsZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi9jb250cm9sbGVybWFuYWdlci5qcycpLkNvbnRyb2xsZXJNYW5hZ2VyO1xudmFyIENsaWVudENvbnRleHQgPSByZXF1aXJlKCcuL2NsaWVudGNvbnRleHQuanMnKS5DbGllbnRDb250ZXh0O1xuXG52YXIgRE9MUEhJTl9QTEFURk9STV9QUkVGSVggPSAnZG9scGhpbl9wbGF0Zm9ybV9pbnRlcm5fJztcbnZhciBJTklUX0NPTU1BTkRfTkFNRSA9IERPTFBISU5fUExBVEZPUk1fUFJFRklYICsgJ2luaXRDbGllbnRDb250ZXh0JztcblxuZXhwb3J0cy5jb25uZWN0ID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICB2YXIgYnVpbGRlciA9IG9wZW5kb2xwaGluLm1ha2VEb2xwaGluKCkudXJsKHVybCkucmVzZXQoZmFsc2UpLnNsYWNrTVMoNCkuc3VwcG9ydENPUlModHJ1ZSk7XG4gICAgaWYgKGV4aXN0cyhjb25maWcpICYmIGV4aXN0cyhjb25maWcuZXJyb3JIYW5kbGVyKSkge1xuICAgICAgICBidWlsZGVyLmVycm9ySGFuZGxlcihjb25maWcuZXJyb3JIYW5kbGVyKTtcbiAgICB9XG4gICAgdmFyIGRvbHBoaW4gPSBidWlsZGVyLmJ1aWxkKCk7XG5cbiAgICB2YXIgY2xhc3NSZXBvc2l0b3J5ID0gbmV3IENsYXNzUmVwb3NpdG9yeShkb2xwaGluKTtcbiAgICB2YXIgYmVhbk1hbmFnZXIgPSBuZXcgQmVhbk1hbmFnZXIoY2xhc3NSZXBvc2l0b3J5KTtcbiAgICB2YXIgY29ubmVjdG9yID0gbmV3IENvbm5lY3Rvcih1cmwsIGRvbHBoaW4sIGNsYXNzUmVwb3NpdG9yeSwgY29uZmlnKTtcbiAgICB2YXIgY29udHJvbGxlck1hbmFnZXIgPSBuZXcgQ29udHJvbGxlck1hbmFnZXIoZG9scGhpbiwgY2xhc3NSZXBvc2l0b3J5LCBjb25uZWN0b3IpO1xuXG4gICAgdmFyIGNsaWVudENvbnRleHQgPSBuZXcgQ2xpZW50Q29udGV4dChkb2xwaGluLCBiZWFuTWFuYWdlciwgY29udHJvbGxlck1hbmFnZXIpO1xuXG4gICAgY29ubmVjdG9yLmludm9rZShJTklUX0NPTU1BTkRfTkFNRSk7XG5cbiAgICByZXR1cm4gY2xpZW50Q29udGV4dDtcbn07XG4iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuXG4gLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEFycmF5LmZvckVhY2goKVxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcblxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcblxuICAgICAgICB2YXIgVCwgaztcblxuICAgICAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcgdGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZyB0aGUgfHRoaXN8IHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cbiAgICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG5cbiAgICAgICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgICAgIC8vIDMuIExldCBsZW4gYmUgVG9VaW50MzIobGVuVmFsdWUpLlxuICAgICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gNC4gSWYgSXNDYWxsYWJsZShjYWxsYmFjaykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgLy8gU2VlOiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjExXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDUuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldCBUIGJlIHVuZGVmaW5lZC5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBUID0gdGhpc0FyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDYuIExldCBrIGJlIDBcbiAgICAgICAgayA9IDA7XG5cbiAgICAgICAgLy8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG4gICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG5cbiAgICAgICAgICAgIHZhciBrVmFsdWU7XG5cbiAgICAgICAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cbiAgICAgICAgICAgIC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxuICAgICAgICAgICAgLy8gYi4gTGV0IGtQcmVzZW50IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgSGFzUHJvcGVydHkgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgICAgIC8vICAgVGhpcyBzdGVwIGNhbiBiZSBjb21iaW5lZCB3aXRoIGNcbiAgICAgICAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cbiAgICAgICAgICAgIGlmIChrIGluIE8pIHtcblxuICAgICAgICAgICAgICAgIC8vIGkuIExldCBrVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgICAgICAgICBrVmFsdWUgPSBPW2tdO1xuXG4gICAgICAgICAgICAgICAgLy8gaWkuIENhbGwgdGhlIENhbGwgaW50ZXJuYWwgbWV0aG9kIG9mIGNhbGxiYWNrIHdpdGggVCBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAvLyBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcga1ZhbHVlLCBrLCBhbmQgTy5cbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkLiBJbmNyZWFzZSBrIGJ5IDEuXG4gICAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICAgICAgLy8gOC4gcmV0dXJuIHVuZGVmaW5lZFxuICAgIH07XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQXJyYXkuZmlsdGVyKClcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXG5pZiAoIUFycmF5LnByb3RvdHlwZS5maWx0ZXIpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24oZnVuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgaWYgKHRoaXMgPT09IHZvaWQgMCB8fCB0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuICAgICAgICBpZiAodHlwZW9mIGZ1biAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMiA/IGFyZ3VtZW50c1sxXSA6IHZvaWQgMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gdCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0W2ldO1xuXG4gICAgICAgICAgICAgICAgLy8gTk9URTogVGVjaG5pY2FsbHkgdGhpcyBzaG91bGQgT2JqZWN0LmRlZmluZVByb3BlcnR5IGF0XG4gICAgICAgICAgICAgICAgLy8gICAgICAgdGhlIG5leHQgaW5kZXgsIGFzIHB1c2ggY2FuIGJlIGFmZmVjdGVkIGJ5XG4gICAgICAgICAgICAgICAgLy8gICAgICAgcHJvcGVydGllcyBvbiBPYmplY3QucHJvdG90eXBlIGFuZCBBcnJheS5wcm90b3R5cGUuXG4gICAgICAgICAgICAgICAgLy8gICAgICAgQnV0IHRoYXQgbWV0aG9kJ3MgbmV3LCBhbmQgY29sbGlzaW9ucyBzaG91bGQgYmVcbiAgICAgICAgICAgICAgICAvLyAgICAgICByYXJlLCBzbyB1c2UgdGhlIG1vcmUtY29tcGF0aWJsZSBhbHRlcm5hdGl2ZS5cbiAgICAgICAgICAgICAgICBpZiAoZnVuLmNhbGwodGhpc0FyZywgdmFsLCBpLCB0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbn0iLCIvKiBDb3B5cmlnaHQgMjAxNSBDYW5vbyBFbmdpbmVlcmluZyBBRy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLypqc2xpbnQgYnJvd3NlcmlmeTogdHJ1ZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzLmV4aXN0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgIT09IG51bGw7XG59O1xuIl19
