(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":2,"ieee754":3,"isarray":4}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],4:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],5:[function(require,module,exports){
module.exports = require('./lib/chai');

},{"./lib/chai":6}],6:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var used = []
  , exports = module.exports = {};

/*!
 * Chai version
 */

exports.version = '3.5.0';

/*!
 * Assertion Error
 */

exports.AssertionError = require('assertion-error');

/*!
 * Utils for plugins (not exported)
 */

var util = require('./chai/utils');

/**
 * # .use(function)
 *
 * Provides a way to extend the internals of Chai
 *
 * @param {Function}
 * @returns {this} for chaining
 * @api public
 */

exports.use = function (fn) {
  if (!~used.indexOf(fn)) {
    fn(this, util);
    used.push(fn);
  }

  return this;
};

/*!
 * Utility Functions
 */

exports.util = util;

/*!
 * Configuration
 */

var config = require('./chai/config');
exports.config = config;

/*!
 * Primary `Assertion` prototype
 */

var assertion = require('./chai/assertion');
exports.use(assertion);

/*!
 * Core Assertions
 */

var core = require('./chai/core/assertions');
exports.use(core);

/*!
 * Expect interface
 */

var expect = require('./chai/interface/expect');
exports.use(expect);

/*!
 * Should interface
 */

var should = require('./chai/interface/should');
exports.use(should);

/*!
 * Assert interface
 */

var assert = require('./chai/interface/assert');
exports.use(assert);

},{"./chai/assertion":7,"./chai/config":8,"./chai/core/assertions":9,"./chai/interface/assert":10,"./chai/interface/expect":11,"./chai/interface/should":12,"./chai/utils":26,"assertion-error":34}],7:[function(require,module,exports){
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = require('./config');

module.exports = function (_chai, util) {
  /*!
   * Module dependencies.
   */

  var AssertionError = _chai.AssertionError
    , flag = util.flag;

  /*!
   * Module export.
   */

  _chai.Assertion = Assertion;

  /*!
   * Assertion Constructor
   *
   * Creates object for chaining.
   *
   * @api private
   */

  function Assertion (obj, msg, stack) {
    flag(this, 'ssfi', stack || arguments.callee);
    flag(this, 'object', obj);
    flag(this, 'message', msg);
  }

  Object.defineProperty(Assertion, 'includeStack', {
    get: function() {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      return config.includeStack;
    },
    set: function(value) {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      config.includeStack = value;
    }
  });

  Object.defineProperty(Assertion, 'showDiff', {
    get: function() {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      return config.showDiff;
    },
    set: function(value) {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      config.showDiff = value;
    }
  });

  Assertion.addProperty = function (name, fn) {
    util.addProperty(this.prototype, name, fn);
  };

  Assertion.addMethod = function (name, fn) {
    util.addMethod(this.prototype, name, fn);
  };

  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  Assertion.overwriteProperty = function (name, fn) {
    util.overwriteProperty(this.prototype, name, fn);
  };

  Assertion.overwriteMethod = function (name, fn) {
    util.overwriteMethod(this.prototype, name, fn);
  };

  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  /**
   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
   *
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
   *
   * @name assert
   * @param {Philosophical} expression to be tested
   * @param {String|Function} message or function that returns message to display if expression fails
   * @param {String|Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
   * @param {Mixed} expected value (remember to check for negation)
   * @param {Mixed} actual (optional) will default to `this.obj`
   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
   * @api private
   */

  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
    var ok = util.test(this, arguments);
    if (true !== showDiff) showDiff = false;
    if (true !== config.showDiff) showDiff = false;

    if (!ok) {
      var msg = util.getMessage(this, arguments)
        , actual = util.getActual(this, arguments);
      throw new AssertionError(msg, {
          actual: actual
        , expected: expected
        , showDiff: showDiff
      }, (config.includeStack) ? this.assert : flag(this, 'ssfi'));
    }
  };

  /*!
   * ### ._obj
   *
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @api private
   */

  Object.defineProperty(Assertion.prototype, '_obj',
    { get: function () {
        return flag(this, 'object');
      }
    , set: function (val) {
        flag(this, 'object', val);
      }
  });
};

},{"./config":8}],8:[function(require,module,exports){
module.exports = {

  /**
   * ### config.includeStack
   *
   * User configurable property, influences whether stack trace
   * is included in Assertion error message. Default of false
   * suppresses stack trace in the error message.
   *
   *     chai.config.includeStack = true;  // enable stack on error
   *
   * @param {Boolean}
   * @api public
   */

   includeStack: false,

  /**
   * ### config.showDiff
   *
   * User configurable property, influences whether or not
   * the `showDiff` flag should be included in the thrown
   * AssertionErrors. `false` will always be `false`; `true`
   * will be true when the assertion has requested a diff
   * be shown.
   *
   * @param {Boolean}
   * @api public
   */

  showDiff: true,

  /**
   * ### config.truncateThreshold
   *
   * User configurable property, sets length threshold for actual and
   * expected values in assertion errors. If this threshold is exceeded, for
   * example for large data structures, the value is replaced with something
   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
   *
   * Set it to zero if you want to disable truncating altogether.
   *
   * This is especially userful when doing assertions on arrays: having this
   * set to a reasonable large value makes the failure messages readily
   * inspectable.
   *
   *     chai.config.truncateThreshold = 0;  // disable truncating
   *
   * @param {Number}
   * @api public
   */

  truncateThreshold: 40

};

},{}],9:[function(require,module,exports){
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, _) {
  var Assertion = chai.Assertion
    , toString = Object.prototype.toString
    , flag = _.flag;

  /**
   * ### Language Chains
   *
   * The following are provided as chainable getters to
   * improve the readability of your assertions. They
   * do not provide testing capabilities unless they
   * have been overwritten by a plugin.
   *
   * **Chains**
   *
   * - to
   * - be
   * - been
   * - is
   * - that
   * - which
   * - and
   * - has
   * - have
   * - with
   * - at
   * - of
   * - same
   *
   * @name language chains
   * @namespace BDD
   * @api public
   */

  [ 'to', 'be', 'been'
  , 'is', 'and', 'has', 'have'
  , 'with', 'that', 'which', 'at'
  , 'of', 'same' ].forEach(function (chain) {
    Assertion.addProperty(chain, function () {
      return this;
    });
  });

  /**
   * ### .not
   *
   * Negates any of assertions following in the chain.
   *
   *     expect(foo).to.not.equal('bar');
   *     expect(goodFn).to.not.throw(Error);
   *     expect({ foo: 'baz' }).to.have.property('foo')
   *       .and.not.equal('bar');
   *
   * @name not
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('not', function () {
    flag(this, 'negate', true);
  });

  /**
   * ### .deep
   *
   * Sets the `deep` flag, later used by the `equal` and
   * `property` assertions.
   *
   *     expect(foo).to.deep.equal({ bar: 'baz' });
   *     expect({ foo: { bar: { baz: 'quux' } } })
   *       .to.have.deep.property('foo.bar.baz', 'quux');
   *
   * `.deep.property` special characters can be escaped
   * by adding two slashes before the `.` or `[]`.
   *
   *     var deepCss = { '.link': { '[target]': 42 }};
   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
   *
   * @name deep
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('deep', function () {
    flag(this, 'deep', true);
  });

  /**
   * ### .any
   *
   * Sets the `any` flag, (opposite of the `all` flag)
   * later used in the `keys` assertion.
   *
   *     expect(foo).to.have.any.keys('bar', 'baz');
   *
   * @name any
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('any', function () {
    flag(this, 'any', true);
    flag(this, 'all', false)
  });


  /**
   * ### .all
   *
   * Sets the `all` flag (opposite of the `any` flag)
   * later used by the `keys` assertion.
   *
   *     expect(foo).to.have.all.keys('bar', 'baz');
   *
   * @name all
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('all', function () {
    flag(this, 'all', true);
    flag(this, 'any', false);
  });

  /**
   * ### .a(type)
   *
   * The `a` and `an` assertions are aliases that can be
   * used either as language chains or to assert a value's
   * type.
   *
   *     // typeof
   *     expect('test').to.be.a('string');
   *     expect({ foo: 'bar' }).to.be.an('object');
   *     expect(null).to.be.a('null');
   *     expect(undefined).to.be.an('undefined');
   *     expect(new Error).to.be.an('error');
   *     expect(new Promise).to.be.a('promise');
   *     expect(new Float32Array()).to.be.a('float32array');
   *     expect(Symbol()).to.be.a('symbol');
   *
   *     // es6 overrides
   *     expect({[Symbol.toStringTag]:()=>'foo'}).to.be.a('foo');
   *
   *     // language chain
   *     expect(foo).to.be.an.instanceof(Foo);
   *
   * @name a
   * @alias an
   * @param {String} type
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function an (type, msg) {
    if (msg) flag(this, 'message', msg);
    type = type.toLowerCase();
    var obj = flag(this, 'object')
      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

    this.assert(
        type === _.type(obj)
      , 'expected #{this} to be ' + article + type
      , 'expected #{this} not to be ' + article + type
    );
  }

  Assertion.addChainableMethod('an', an);
  Assertion.addChainableMethod('a', an);

  /**
   * ### .include(value)
   *
   * The `include` and `contain` assertions can be used as either property
   * based language chains or as methods to assert the inclusion of an object
   * in an array or a substring in a string. When used as language chains,
   * they toggle the `contains` flag for the `keys` assertion.
   *
   *     expect([1,2,3]).to.include(2);
   *     expect('foobar').to.contain('foo');
   *     expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');
   *
   * @name include
   * @alias contain
   * @alias includes
   * @alias contains
   * @param {Object|String|Number} obj
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function includeChainingBehavior () {
    flag(this, 'contains', true);
  }

  function include (val, msg) {
    _.expectTypes(this, ['array', 'object', 'string']);

    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var expected = false;

    if (_.type(obj) === 'array' && _.type(val) === 'object') {
      for (var i in obj) {
        if (_.eql(obj[i], val)) {
          expected = true;
          break;
        }
      }
    } else if (_.type(val) === 'object') {
      if (!flag(this, 'negate')) {
        for (var k in val) new Assertion(obj).property(k, val[k]);
        return;
      }
      var subset = {};
      for (var k in val) subset[k] = obj[k];
      expected = _.eql(subset, val);
    } else {
      expected = (obj != undefined) && ~obj.indexOf(val);
    }
    this.assert(
        expected
      , 'expected #{this} to include ' + _.inspect(val)
      , 'expected #{this} to not include ' + _.inspect(val));
  }

  Assertion.addChainableMethod('include', include, includeChainingBehavior);
  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

  /**
   * ### .ok
   *
   * Asserts that the target is truthy.
   *
   *     expect('everything').to.be.ok;
   *     expect(1).to.be.ok;
   *     expect(false).to.not.be.ok;
   *     expect(undefined).to.not.be.ok;
   *     expect(null).to.not.be.ok;
   *
   * @name ok
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('ok', function () {
    this.assert(
        flag(this, 'object')
      , 'expected #{this} to be truthy'
      , 'expected #{this} to be falsy');
  });

  /**
   * ### .true
   *
   * Asserts that the target is `true`.
   *
   *     expect(true).to.be.true;
   *     expect(1).to.not.be.true;
   *
   * @name true
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('true', function () {
    this.assert(
        true === flag(this, 'object')
      , 'expected #{this} to be true'
      , 'expected #{this} to be false'
      , this.negate ? false : true
    );
  });

  /**
   * ### .false
   *
   * Asserts that the target is `false`.
   *
   *     expect(false).to.be.false;
   *     expect(0).to.not.be.false;
   *
   * @name false
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('false', function () {
    this.assert(
        false === flag(this, 'object')
      , 'expected #{this} to be false'
      , 'expected #{this} to be true'
      , this.negate ? true : false
    );
  });

  /**
   * ### .null
   *
   * Asserts that the target is `null`.
   *
   *     expect(null).to.be.null;
   *     expect(undefined).to.not.be.null;
   *
   * @name null
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('null', function () {
    this.assert(
        null === flag(this, 'object')
      , 'expected #{this} to be null'
      , 'expected #{this} not to be null'
    );
  });

  /**
   * ### .undefined
   *
   * Asserts that the target is `undefined`.
   *
   *     expect(undefined).to.be.undefined;
   *     expect(null).to.not.be.undefined;
   *
   * @name undefined
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('undefined', function () {
    this.assert(
        undefined === flag(this, 'object')
      , 'expected #{this} to be undefined'
      , 'expected #{this} not to be undefined'
    );
  });

  /**
   * ### .NaN
   * Asserts that the target is `NaN`.
   *
   *     expect('foo').to.be.NaN;
   *     expect(4).not.to.be.NaN;
   *
   * @name NaN
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('NaN', function () {
    this.assert(
        isNaN(flag(this, 'object'))
        , 'expected #{this} to be NaN'
        , 'expected #{this} not to be NaN'
    );
  });

  /**
   * ### .exist
   *
   * Asserts that the target is neither `null` nor `undefined`.
   *
   *     var foo = 'hi'
   *       , bar = null
   *       , baz;
   *
   *     expect(foo).to.exist;
   *     expect(bar).to.not.exist;
   *     expect(baz).to.not.exist;
   *
   * @name exist
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('exist', function () {
    this.assert(
        null != flag(this, 'object')
      , 'expected #{this} to exist'
      , 'expected #{this} to not exist'
    );
  });


  /**
   * ### .empty
   *
   * Asserts that the target's length is `0`. For arrays and strings, it checks
   * the `length` property. For objects, it gets the count of
   * enumerable keys.
   *
   *     expect([]).to.be.empty;
   *     expect('').to.be.empty;
   *     expect({}).to.be.empty;
   *
   * @name empty
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('empty', function () {
    var obj = flag(this, 'object')
      , expected = obj;

    if (Array.isArray(obj) || 'string' === typeof object) {
      expected = obj.length;
    } else if (typeof obj === 'object') {
      expected = Object.keys(obj).length;
    }

    this.assert(
        !expected
      , 'expected #{this} to be empty'
      , 'expected #{this} not to be empty'
    );
  });

  /**
   * ### .arguments
   *
   * Asserts that the target is an arguments object.
   *
   *     function test () {
   *       expect(arguments).to.be.arguments;
   *     }
   *
   * @name arguments
   * @alias Arguments
   * @namespace BDD
   * @api public
   */

  function checkArguments () {
    var obj = flag(this, 'object')
      , type = Object.prototype.toString.call(obj);
    this.assert(
        '[object Arguments]' === type
      , 'expected #{this} to be arguments but got ' + type
      , 'expected #{this} to not be arguments'
    );
  }

  Assertion.addProperty('arguments', checkArguments);
  Assertion.addProperty('Arguments', checkArguments);

  /**
   * ### .equal(value)
   *
   * Asserts that the target is strictly equal (`===`) to `value`.
   * Alternately, if the `deep` flag is set, asserts that
   * the target is deeply equal to `value`.
   *
   *     expect('hello').to.equal('hello');
   *     expect(42).to.equal(42);
   *     expect(1).to.not.equal(true);
   *     expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
   *     expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
   *
   * @name equal
   * @alias equals
   * @alias eq
   * @alias deep.equal
   * @param {Mixed} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertEqual (val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'deep')) {
      return this.eql(val);
    } else {
      this.assert(
          val === obj
        , 'expected #{this} to equal #{exp}'
        , 'expected #{this} to not equal #{exp}'
        , val
        , this._obj
        , true
      );
    }
  }

  Assertion.addMethod('equal', assertEqual);
  Assertion.addMethod('equals', assertEqual);
  Assertion.addMethod('eq', assertEqual);

  /**
   * ### .eql(value)
   *
   * Asserts that the target is deeply equal to `value`.
   *
   *     expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
   *     expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);
   *
   * @name eql
   * @alias eqls
   * @param {Mixed} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertEql(obj, msg) {
    if (msg) flag(this, 'message', msg);
    this.assert(
        _.eql(obj, flag(this, 'object'))
      , 'expected #{this} to deeply equal #{exp}'
      , 'expected #{this} to not deeply equal #{exp}'
      , obj
      , this._obj
      , true
    );
  }

  Assertion.addMethod('eql', assertEql);
  Assertion.addMethod('eqls', assertEql);

  /**
   * ### .above(value)
   *
   * Asserts that the target is greater than `value`.
   *
   *     expect(10).to.be.above(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *
   * @name above
   * @alias gt
   * @alias greaterThan
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertAbove (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len > n
        , 'expected #{this} to have a length above #{exp} but got #{act}'
        , 'expected #{this} to not have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj > n
        , 'expected #{this} to be above ' + n
        , 'expected #{this} to be at most ' + n
      );
    }
  }

  Assertion.addMethod('above', assertAbove);
  Assertion.addMethod('gt', assertAbove);
  Assertion.addMethod('greaterThan', assertAbove);

  /**
   * ### .least(value)
   *
   * Asserts that the target is greater than or equal to `value`.
   *
   *     expect(10).to.be.at.least(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.least(2);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);
   *
   * @name least
   * @alias gte
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertLeast (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= n
        , 'expected #{this} to have a length at least #{exp} but got #{act}'
        , 'expected #{this} to have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj >= n
        , 'expected #{this} to be at least ' + n
        , 'expected #{this} to be below ' + n
      );
    }
  }

  Assertion.addMethod('least', assertLeast);
  Assertion.addMethod('gte', assertLeast);

  /**
   * ### .below(value)
   *
   * Asserts that the target is less than `value`.
   *
   *     expect(5).to.be.below(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *
   * @name below
   * @alias lt
   * @alias lessThan
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertBelow (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len < n
        , 'expected #{this} to have a length below #{exp} but got #{act}'
        , 'expected #{this} to not have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj < n
        , 'expected #{this} to be below ' + n
        , 'expected #{this} to be at least ' + n
      );
    }
  }

  Assertion.addMethod('below', assertBelow);
  Assertion.addMethod('lt', assertBelow);
  Assertion.addMethod('lessThan', assertBelow);

  /**
   * ### .most(value)
   *
   * Asserts that the target is less than or equal to `value`.
   *
   *     expect(5).to.be.at.most(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.most(4);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);
   *
   * @name most
   * @alias lte
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertMost (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len <= n
        , 'expected #{this} to have a length at most #{exp} but got #{act}'
        , 'expected #{this} to have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj <= n
        , 'expected #{this} to be at most ' + n
        , 'expected #{this} to be above ' + n
      );
    }
  }

  Assertion.addMethod('most', assertMost);
  Assertion.addMethod('lte', assertMost);

  /**
   * ### .within(start, finish)
   *
   * Asserts that the target is within a range.
   *
   *     expect(7).to.be.within(5,10);
   *
   * Can also be used in conjunction with `length` to
   * assert a length range. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * @name within
   * @param {Number} start lowerbound inclusive
   * @param {Number} finish upperbound inclusive
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('within', function (start, finish, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , range = start + '..' + finish;
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= start && len <= finish
        , 'expected #{this} to have a length within ' + range
        , 'expected #{this} to not have a length within ' + range
      );
    } else {
      this.assert(
          obj >= start && obj <= finish
        , 'expected #{this} to be within ' + range
        , 'expected #{this} to not be within ' + range
      );
    }
  });

  /**
   * ### .instanceof(constructor)
   *
   * Asserts that the target is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , Chai = new Tea('chai');
   *
   *     expect(Chai).to.be.an.instanceof(Tea);
   *     expect([ 1, 2, 3 ]).to.be.instanceof(Array);
   *
   * @name instanceof
   * @param {Constructor} constructor
   * @param {String} message _optional_
   * @alias instanceOf
   * @namespace BDD
   * @api public
   */

  function assertInstanceOf (constructor, msg) {
    if (msg) flag(this, 'message', msg);
    var name = _.getName(constructor);
    this.assert(
        flag(this, 'object') instanceof constructor
      , 'expected #{this} to be an instance of ' + name
      , 'expected #{this} to not be an instance of ' + name
    );
  };

  Assertion.addMethod('instanceof', assertInstanceOf);
  Assertion.addMethod('instanceOf', assertInstanceOf);

  /**
   * ### .property(name, [value])
   *
   * Asserts that the target has a property `name`, optionally asserting that
   * the value of that property is strictly equal to  `value`.
   * If the `deep` flag is set, you can use dot- and bracket-notation for deep
   * references into objects and arrays.
   *
   *     // simple referencing
   *     var obj = { foo: 'bar' };
   *     expect(obj).to.have.property('foo');
   *     expect(obj).to.have.property('foo', 'bar');
   *
   *     // deep referencing
   *     var deepObj = {
   *         green: { tea: 'matcha' }
   *       , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
   *     };
   *
   *     expect(deepObj).to.have.deep.property('green.tea', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[1]', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');
   *
   * You can also use an array as the starting point of a `deep.property`
   * assertion, or traverse nested arrays.
   *
   *     var arr = [
   *         [ 'chai', 'matcha', 'konacha' ]
   *       , [ { tea: 'chai' }
   *         , { tea: 'matcha' }
   *         , { tea: 'konacha' } ]
   *     ];
   *
   *     expect(arr).to.have.deep.property('[0][1]', 'matcha');
   *     expect(arr).to.have.deep.property('[1][2].tea', 'konacha');
   *
   * Furthermore, `property` changes the subject of the assertion
   * to be the value of that property from the original object. This
   * permits for further chainable assertions on that property.
   *
   *     expect(obj).to.have.property('foo')
   *       .that.is.a('string');
   *     expect(deepObj).to.have.property('green')
   *       .that.is.an('object')
   *       .that.deep.equals({ tea: 'matcha' });
   *     expect(deepObj).to.have.property('teas')
   *       .that.is.an('array')
   *       .with.deep.property('[2]')
   *         .that.deep.equals({ tea: 'konacha' });
   *
   * Note that dots and bracket in `name` must be backslash-escaped when
   * the `deep` flag is set, while they must NOT be escaped when the `deep`
   * flag is not set.
   *
   *     // simple referencing
   *     var css = { '.link[target]': 42 };
   *     expect(css).to.have.property('.link[target]', 42);
   *
   *     // deep referencing
   *     var deepCss = { '.link': { '[target]': 42 }};
   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
   *
   * @name property
   * @alias deep.property
   * @param {String} name
   * @param {Mixed} value (optional)
   * @param {String} message _optional_
   * @returns value of property for chaining
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('property', function (name, val, msg) {
    if (msg) flag(this, 'message', msg);

    var isDeep = !!flag(this, 'deep')
      , descriptor = isDeep ? 'deep property ' : 'property '
      , negate = flag(this, 'negate')
      , obj = flag(this, 'object')
      , pathInfo = isDeep ? _.getPathInfo(name, obj) : null
      , hasProperty = isDeep
        ? pathInfo.exists
        : _.hasProperty(name, obj)
      , value = isDeep
        ? pathInfo.value
        : obj[name];

    if (negate && arguments.length > 1) {
      if (undefined === value) {
        msg = (msg != null) ? msg + ': ' : '';
        throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));
      }
    } else {
      this.assert(
          hasProperty
        , 'expected #{this} to have a ' + descriptor + _.inspect(name)
        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
    }

    if (arguments.length > 1) {
      this.assert(
          val === value
        , 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
        , 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}'
        , val
        , value
      );
    }

    flag(this, 'object', value);
  });


  /**
   * ### .ownProperty(name)
   *
   * Asserts that the target has an own property `name`.
   *
   *     expect('test').to.have.ownProperty('length');
   *
   * @name ownProperty
   * @alias haveOwnProperty
   * @param {String} name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertOwnProperty (name, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        obj.hasOwnProperty(name)
      , 'expected #{this} to have own property ' + _.inspect(name)
      , 'expected #{this} to not have own property ' + _.inspect(name)
    );
  }

  Assertion.addMethod('ownProperty', assertOwnProperty);
  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

  /**
   * ### .ownPropertyDescriptor(name[, descriptor[, message]])
   *
   * Asserts that the target has an own property descriptor `name`, that optionally matches `descriptor`.
   *
   *     expect('test').to.have.ownPropertyDescriptor('length');
   *     expect('test').to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 4 });
   *     expect('test').not.to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 3 });
   *     expect('test').ownPropertyDescriptor('length').to.have.property('enumerable', false);
   *     expect('test').ownPropertyDescriptor('length').to.have.keys('value');
   *
   * @name ownPropertyDescriptor
   * @alias haveOwnPropertyDescriptor
   * @param {String} name
   * @param {Object} descriptor _optional_
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertOwnPropertyDescriptor (name, descriptor, msg) {
    if (typeof descriptor === 'string') {
      msg = descriptor;
      descriptor = null;
    }
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
    if (actualDescriptor && descriptor) {
      this.assert(
          _.eql(descriptor, actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
        , descriptor
        , actualDescriptor
        , true
      );
    } else {
      this.assert(
          actualDescriptor
        , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
        , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
      );
    }
    flag(this, 'object', actualDescriptor);
  }

  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

  /**
   * ### .length
   *
   * Sets the `doLength` flag later used as a chain precursor to a value
   * comparison for the `length` property.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * *Deprecation notice:* Using `length` as an assertion will be deprecated
   * in version 2.4.0 and removed in 3.0.0. Code using the old style of
   * asserting for `length` property value using `length(value)` should be
   * switched to use `lengthOf(value)` instead.
   *
   * @name length
   * @namespace BDD
   * @api public
   */

  /**
   * ### .lengthOf(value[, message])
   *
   * Asserts that the target's `length` property has
   * the expected value.
   *
   *     expect([ 1, 2, 3]).to.have.lengthOf(3);
   *     expect('foobar').to.have.lengthOf(6);
   *
   * @name lengthOf
   * @param {Number} length
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertLengthChain () {
    flag(this, 'doLength', true);
  }

  function assertLength (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).to.have.property('length');
    var len = obj.length;

    this.assert(
        len == n
      , 'expected #{this} to have a length of #{exp} but got #{act}'
      , 'expected #{this} to not have a length of #{act}'
      , n
      , len
    );
  }

  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
  Assertion.addMethod('lengthOf', assertLength);

  /**
   * ### .match(regexp)
   *
   * Asserts that the target matches a regular expression.
   *
   *     expect('foobar').to.match(/^foo/);
   *
   * @name match
   * @alias matches
   * @param {RegExp} RegularExpression
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */
  function assertMatch(re, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        re.exec(obj)
      , 'expected #{this} to match ' + re
      , 'expected #{this} not to match ' + re
    );
  }

  Assertion.addMethod('match', assertMatch);
  Assertion.addMethod('matches', assertMatch);

  /**
   * ### .string(string)
   *
   * Asserts that the string target contains another string.
   *
   *     expect('foobar').to.have.string('bar');
   *
   * @name string
   * @param {String} string
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('string', function (str, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('string');

    this.assert(
        ~obj.indexOf(str)
      , 'expected #{this} to contain ' + _.inspect(str)
      , 'expected #{this} to not contain ' + _.inspect(str)
    );
  });


  /**
   * ### .keys(key1, [key2], [...])
   *
   * Asserts that the target contains any or all of the passed-in keys.
   * Use in combination with `any`, `all`, `contains`, or `have` will affect
   * what will pass.
   *
   * When used in conjunction with `any`, at least one key that is passed
   * in must exist in the target object. This is regardless whether or not
   * the `have` or `contain` qualifiers are used. Note, either `any` or `all`
   * should be used in the assertion. If neither are used, the assertion is
   * defaulted to `all`.
   *
   * When both `all` and `contain` are used, the target object must have at
   * least all of the passed-in keys but may have more keys not listed.
   *
   * When both `all` and `have` are used, the target object must both contain
   * all of the passed-in keys AND the number of keys in the target object must
   * match the number of keys passed in (in other words, a target object must
   * have all and only all of the passed-in keys).
   *
   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');
   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys({'foo': 6});
   *     expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);
   *     expect({ foo: 1, bar: 2 }).to.have.all.keys({'bar': 6, 'foo': 7});
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys({'bar': 6});
   *
   *
   * @name keys
   * @alias key
   * @param {...String|Array|Object} keys
   * @namespace BDD
   * @api public
   */

  function assertKeys (keys) {
    var obj = flag(this, 'object')
      , str
      , ok = true
      , mixedArgsMsg = 'keys must be given single argument of Array|Object|String, or multiple String arguments';

    switch (_.type(keys)) {
      case "array":
        if (arguments.length > 1) throw (new Error(mixedArgsMsg));
        break;
      case "object":
        if (arguments.length > 1) throw (new Error(mixedArgsMsg));
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }

    if (!keys.length) throw new Error('keys required');

    var actual = Object.keys(obj)
      , expected = keys
      , len = keys.length
      , any = flag(this, 'any')
      , all = flag(this, 'all');

    if (!any && !all) {
      all = true;
    }

    // Has any
    if (any) {
      var intersection = expected.filter(function(key) {
        return ~actual.indexOf(key);
      });
      ok = intersection.length > 0;
    }

    // Has all
    if (all) {
      ok = keys.every(function(key){
        return ~actual.indexOf(key);
      });
      if (!flag(this, 'negate') && !flag(this, 'contains')) {
        ok = ok && keys.length == actual.length;
      }
    }

    // Key string
    if (len > 1) {
      keys = keys.map(function(key){
        return _.inspect(key);
      });
      var last = keys.pop();
      if (all) {
        str = keys.join(', ') + ', and ' + last;
      }
      if (any) {
        str = keys.join(', ') + ', or ' + last;
      }
    } else {
      str = _.inspect(keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

    // Assertion
    this.assert(
        ok
      , 'expected #{this} to ' + str
      , 'expected #{this} to not ' + str
      , expected.slice(0).sort()
      , actual.sort()
      , true
    );
  }

  Assertion.addMethod('keys', assertKeys);
  Assertion.addMethod('key', assertKeys);

  /**
   * ### .throw(constructor)
   *
   * Asserts that the function target will throw a specific error, or specific type of error
   * (as determined using `instanceof`), optionally with a RegExp or string inclusion test
   * for the error's message.
   *
   *     var err = new ReferenceError('This is a bad function.');
   *     var fn = function () { throw err; }
   *     expect(fn).to.throw(ReferenceError);
   *     expect(fn).to.throw(Error);
   *     expect(fn).to.throw(/bad function/);
   *     expect(fn).to.not.throw('good function');
   *     expect(fn).to.throw(ReferenceError, /bad function/);
   *     expect(fn).to.throw(err);
   *
   * Please note that when a throw expectation is negated, it will check each
   * parameter independently, starting with error constructor type. The appropriate way
   * to check for the existence of a type of error but for a message that does not match
   * is to use `and`.
   *
   *     expect(fn).to.throw(ReferenceError)
   *        .and.not.throw(/good function/);
   *
   * @name throw
   * @alias throws
   * @alias Throw
   * @param {ErrorConstructor} constructor
   * @param {String|RegExp} expected error message
   * @param {String} message _optional_
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @returns error for chaining (null if no error)
   * @namespace BDD
   * @api public
   */

  function assertThrows (constructor, errMsg, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('function');

    var thrown = false
      , desiredError = null
      , name = null
      , thrownError = null;

    if (arguments.length === 0) {
      errMsg = null;
      constructor = null;
    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
      errMsg = constructor;
      constructor = null;
    } else if (constructor && constructor instanceof Error) {
      desiredError = constructor;
      constructor = null;
      errMsg = null;
    } else if (typeof constructor === 'function') {
      name = constructor.prototype.name;
      if (!name || (name === 'Error' && constructor !== Error)) {
        name = constructor.name || (new constructor()).name;
      }
    } else {
      constructor = null;
    }

    try {
      obj();
    } catch (err) {
      // first, check desired error
      if (desiredError) {
        this.assert(
            err === desiredError
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp}'
          , (desiredError instanceof Error ? desiredError.toString() : desiredError)
          , (err instanceof Error ? err.toString() : err)
        );

        flag(this, 'object', err);
        return this;
      }

      // next, check constructor
      if (constructor) {
        this.assert(
            err instanceof constructor
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp} but #{act} was thrown'
          , name
          , (err instanceof Error ? err.toString() : err)
        );

        if (!errMsg) {
          flag(this, 'object', err);
          return this;
        }
      }

      // next, check message
      var message = 'error' === _.type(err) && "message" in err
        ? err.message
        : '' + err;

      if ((message != null) && errMsg && errMsg instanceof RegExp) {
        this.assert(
            errMsg.exec(message)
          , 'expected #{this} to throw error matching #{exp} but got #{act}'
          , 'expected #{this} to throw error not matching #{exp}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else if ((message != null) && errMsg && 'string' === typeof errMsg) {
        this.assert(
            ~message.indexOf(errMsg)
          , 'expected #{this} to throw error including #{exp} but got #{act}'
          , 'expected #{this} to throw error not including #{act}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else {
        thrown = true;
        thrownError = err;
      }
    }

    var actuallyGot = ''
      , expectedThrown = name !== null
        ? name
        : desiredError
          ? '#{exp}' //_.inspect(desiredError)
          : 'an error';

    if (thrown) {
      actuallyGot = ' but #{act} was thrown'
    }

    this.assert(
        thrown === true
      , 'expected #{this} to throw ' + expectedThrown + actuallyGot
      , 'expected #{this} to not throw ' + expectedThrown + actuallyGot
      , (desiredError instanceof Error ? desiredError.toString() : desiredError)
      , (thrownError instanceof Error ? thrownError.toString() : thrownError)
    );

    flag(this, 'object', thrownError);
  };

  Assertion.addMethod('throw', assertThrows);
  Assertion.addMethod('throws', assertThrows);
  Assertion.addMethod('Throw', assertThrows);

  /**
   * ### .respondTo(method)
   *
   * Asserts that the object or class target will respond to a method.
   *
   *     Klass.prototype.bar = function(){};
   *     expect(Klass).to.respondTo('bar');
   *     expect(obj).to.respondTo('bar');
   *
   * To check if a constructor will respond to a static function,
   * set the `itself` flag.
   *
   *     Klass.baz = function(){};
   *     expect(Klass).itself.to.respondTo('baz');
   *
   * @name respondTo
   * @alias respondsTo
   * @param {String} method
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function respondTo (method, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , itself = flag(this, 'itself')
      , context = ('function' === _.type(obj) && !itself)
        ? obj.prototype[method]
        : obj[method];

    this.assert(
        'function' === typeof context
      , 'expected #{this} to respond to ' + _.inspect(method)
      , 'expected #{this} to not respond to ' + _.inspect(method)
    );
  }

  Assertion.addMethod('respondTo', respondTo);
  Assertion.addMethod('respondsTo', respondTo);

  /**
   * ### .itself
   *
   * Sets the `itself` flag, later used by the `respondTo` assertion.
   *
   *     function Foo() {}
   *     Foo.bar = function() {}
   *     Foo.prototype.baz = function() {}
   *
   *     expect(Foo).itself.to.respondTo('bar');
   *     expect(Foo).itself.not.to.respondTo('baz');
   *
   * @name itself
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('itself', function () {
    flag(this, 'itself', true);
  });

  /**
   * ### .satisfy(method)
   *
   * Asserts that the target passes a given truth test.
   *
   *     expect(1).to.satisfy(function(num) { return num > 0; });
   *
   * @name satisfy
   * @alias satisfies
   * @param {Function} matcher
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function satisfy (matcher, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var result = matcher(obj);
    this.assert(
        result
      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
      , this.negate ? false : true
      , result
    );
  }

  Assertion.addMethod('satisfy', satisfy);
  Assertion.addMethod('satisfies', satisfy);

  /**
   * ### .closeTo(expected, delta)
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     expect(1.5).to.be.closeTo(1, 0.5);
   *
   * @name closeTo
   * @alias approximately
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function closeTo(expected, delta, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj, msg).is.a('number');
    if (_.type(expected) !== 'number' || _.type(delta) !== 'number') {
      throw new Error('the arguments to closeTo or approximately must be numbers');
    }

    this.assert(
        Math.abs(obj - expected) <= delta
      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
    );
  }

  Assertion.addMethod('closeTo', closeTo);
  Assertion.addMethod('approximately', closeTo);

  function isSubsetOf(subset, superset, cmp) {
    return subset.every(function(elem) {
      if (!cmp) return superset.indexOf(elem) !== -1;

      return superset.some(function(elem2) {
        return cmp(elem, elem2);
      });
    })
  }

  /**
   * ### .members(set)
   *
   * Asserts that the target is a superset of `set`,
   * or that the target and `set` have the same strictly-equal (===) members.
   * Alternately, if the `deep` flag is set, set members are compared for deep
   * equality.
   *
   *     expect([1, 2, 3]).to.include.members([3, 2]);
   *     expect([1, 2, 3]).to.not.include.members([3, 2, 8]);
   *
   *     expect([4, 2]).to.have.members([2, 4]);
   *     expect([5, 2]).to.not.have.members([5, 2, 1]);
   *
   *     expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);
   *
   * @name members
   * @param {Array} set
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('members', function (subset, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj).to.be.an('array');
    new Assertion(subset).to.be.an('array');

    var cmp = flag(this, 'deep') ? _.eql : undefined;

    if (flag(this, 'contains')) {
      return this.assert(
          isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to be a superset of #{act}'
        , 'expected #{this} to not be a superset of #{act}'
        , obj
        , subset
      );
    }

    this.assert(
        isSubsetOf(obj, subset, cmp) && isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to have the same members as #{act}'
        , 'expected #{this} to not have the same members as #{act}'
        , obj
        , subset
    );
  });

  /**
   * ### .oneOf(list)
   *
   * Assert that a value appears somewhere in the top level of array `list`.
   *
   *     expect('a').to.be.oneOf(['a', 'b', 'c']);
   *     expect(9).to.not.be.oneOf(['z']);
   *     expect([3]).to.not.be.oneOf([1, 2, [3]]);
   *
   *     var three = [3];
   *     // for object-types, contents are not compared
   *     expect(three).to.not.be.oneOf([1, 2, [3]]);
   *     // comparing references works
   *     expect(three).to.be.oneOf([1, 2, three]);
   *
   * @name oneOf
   * @param {Array<*>} list
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function oneOf (list, msg) {
    if (msg) flag(this, 'message', msg);
    var expected = flag(this, 'object');
    new Assertion(list).to.be.an('array');

    this.assert(
        list.indexOf(expected) > -1
      , 'expected #{this} to be one of #{exp}'
      , 'expected #{this} to not be one of #{exp}'
      , list
      , expected
    );
  }

  Assertion.addMethod('oneOf', oneOf);


  /**
   * ### .change(function)
   *
   * Asserts that a function changes an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val += 3 };
   *     var noChangeFn = function() { return 'foo' + 'bar'; }
   *     expect(fn).to.change(obj, 'val');
   *     expect(noChangeFn).to.not.change(obj, 'val')
   *
   * @name change
   * @alias changes
   * @alias Change
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertChanges (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      initial !== object[prop]
      , 'expected .' + prop + ' to change'
      , 'expected .' + prop + ' to not change'
    );
  }

  Assertion.addChainableMethod('change', assertChanges);
  Assertion.addChainableMethod('changes', assertChanges);

  /**
   * ### .increase(function)
   *
   * Asserts that a function increases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     expect(fn).to.increase(obj, 'val');
   *
   * @name increase
   * @alias increases
   * @alias Increase
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertIncreases (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      object[prop] - initial > 0
      , 'expected .' + prop + ' to increase'
      , 'expected .' + prop + ' to not increase'
    );
  }

  Assertion.addChainableMethod('increase', assertIncreases);
  Assertion.addChainableMethod('increases', assertIncreases);

  /**
   * ### .decrease(function)
   *
   * Asserts that a function decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     expect(fn).to.decrease(obj, 'val');
   *
   * @name decrease
   * @alias decreases
   * @alias Decrease
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertDecreases (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      object[prop] - initial < 0
      , 'expected .' + prop + ' to decrease'
      , 'expected .' + prop + ' to not decrease'
    );
  }

  Assertion.addChainableMethod('decrease', assertDecreases);
  Assertion.addChainableMethod('decreases', assertDecreases);

  /**
   * ### .extensible
   *
   * Asserts that the target is extensible (can have new properties added to
   * it).
   *
   *     var nonExtensibleObject = Object.preventExtensions({});
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     expect({}).to.be.extensible;
   *     expect(nonExtensibleObject).to.not.be.extensible;
   *     expect(sealedObject).to.not.be.extensible;
   *     expect(frozenObject).to.not.be.extensible;
   *
   * @name extensible
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('extensible', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isExtensible;

    try {
      isExtensible = Object.isExtensible(obj);
    } catch (err) {
      if (err instanceof TypeError) isExtensible = false;
      else throw err;
    }

    this.assert(
      isExtensible
      , 'expected #{this} to be extensible'
      , 'expected #{this} to not be extensible'
    );
  });

  /**
   * ### .sealed
   *
   * Asserts that the target is sealed (cannot have new properties added to it
   * and its existing properties cannot be removed).
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     expect(sealedObject).to.be.sealed;
   *     expect(frozenObject).to.be.sealed;
   *     expect({}).to.not.be.sealed;
   *
   * @name sealed
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('sealed', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isSealed;

    try {
      isSealed = Object.isSealed(obj);
    } catch (err) {
      if (err instanceof TypeError) isSealed = true;
      else throw err;
    }

    this.assert(
      isSealed
      , 'expected #{this} to be sealed'
      , 'expected #{this} to not be sealed'
    );
  });

  /**
   * ### .frozen
   *
   * Asserts that the target is frozen (cannot have new properties added to it
   * and its existing properties cannot be modified).
   *
   *     var frozenObject = Object.freeze({});
   *
   *     expect(frozenObject).to.be.frozen;
   *     expect({}).to.not.be.frozen;
   *
   * @name frozen
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('frozen', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isFrozen;

    try {
      isFrozen = Object.isFrozen(obj);
    } catch (err) {
      if (err instanceof TypeError) isFrozen = true;
      else throw err;
    }

    this.assert(
      isFrozen
      , 'expected #{this} to be frozen'
      , 'expected #{this} to not be frozen'
    );
  });
};

},{}],10:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


module.exports = function (chai, util) {

  /*!
   * Chai dependencies.
   */

  var Assertion = chai.Assertion
    , flag = util.flag;

  /*!
   * Module export.
   */

  /**
   * ### assert(expression, message)
   *
   * Write your own test expressions.
   *
   *     assert('foo' !== 'bar', 'foo is not bar');
   *     assert(Array.isArray([]), 'empty arrays are arrays');
   *
   * @param {Mixed} expression to test for truthiness
   * @param {String} message to display on error
   * @name assert
   * @namespace Assert
   * @api public
   */

  var assert = chai.assert = function (express, errmsg) {
    var test = new Assertion(null, null, chai.assert);
    test.assert(
        express
      , errmsg
      , '[ negation message unavailable ]'
    );
  };

  /**
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure. Node.js `assert` module-compatible.
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace Assert
   * @api public
   */

  assert.fail = function (actual, expected, message, operator) {
    message = message || 'assert.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, assert.fail);
  };

  /**
   * ### .isOk(object, [message])
   *
   * Asserts that `object` is truthy.
   *
   *     assert.isOk('everything', 'everything is ok');
   *     assert.isOk(false, 'this will fail');
   *
   * @name isOk
   * @alias ok
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isOk = function (val, msg) {
    new Assertion(val, msg).is.ok;
  };

  /**
   * ### .isNotOk(object, [message])
   *
   * Asserts that `object` is falsy.
   *
   *     assert.isNotOk('everything', 'this will fail');
   *     assert.isNotOk(false, 'this will pass');
   *
   * @name isNotOk
   * @alias notOk
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotOk = function (val, msg) {
    new Assertion(val, msg).is.not.ok;
  };

  /**
   * ### .equal(actual, expected, [message])
   *
   * Asserts non-strict equality (`==`) of `actual` and `expected`.
   *
   *     assert.equal(3, '3', '== coerces values to strings');
   *
   * @name equal
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.equal = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.equal);

    test.assert(
        exp == flag(test, 'object')
      , 'expected #{this} to equal #{exp}'
      , 'expected #{this} to not equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .notEqual(actual, expected, [message])
   *
   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
   *
   *     assert.notEqual(3, 4, 'these numbers are not equal');
   *
   * @name notEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notEqual = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.notEqual);

    test.assert(
        exp != flag(test, 'object')
      , 'expected #{this} to not equal #{exp}'
      , 'expected #{this} to equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .strictEqual(actual, expected, [message])
   *
   * Asserts strict equality (`===`) of `actual` and `expected`.
   *
   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
   *
   * @name strictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.strictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.equal(exp);
  };

  /**
   * ### .notStrictEqual(actual, expected, [message])
   *
   * Asserts strict inequality (`!==`) of `actual` and `expected`.
   *
   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
   *
   * @name notStrictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.equal(exp);
  };

  /**
   * ### .deepEqual(actual, expected, [message])
   *
   * Asserts that `actual` is deeply equal to `expected`.
   *
   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
   *
   * @name deepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.eql(exp);
  };

  /**
   * ### .notDeepEqual(actual, expected, [message])
   *
   * Assert that `actual` is not deeply equal to `expected`.
   *
   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
   *
   * @name notDeepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.eql(exp);
  };

   /**
   * ### .isAbove(valueToCheck, valueToBeAbove, [message])
   *
   * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`
   *
   *     assert.isAbove(5, 2, '5 is strictly greater than 2');
   *
   * @name isAbove
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAbove
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAbove = function (val, abv, msg) {
    new Assertion(val, msg).to.be.above(abv);
  };

   /**
   * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
   *
   * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`
   *
   *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
   *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
   *
   * @name isAtLeast
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtLeast
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtLeast = function (val, atlst, msg) {
    new Assertion(val, msg).to.be.least(atlst);
  };

   /**
   * ### .isBelow(valueToCheck, valueToBeBelow, [message])
   *
   * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`
   *
   *     assert.isBelow(3, 6, '3 is strictly less than 6');
   *
   * @name isBelow
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeBelow
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBelow = function (val, blw, msg) {
    new Assertion(val, msg).to.be.below(blw);
  };

   /**
   * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
   *
   * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`
   *
   *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
   *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
   *
   * @name isAtMost
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtMost
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtMost = function (val, atmst, msg) {
    new Assertion(val, msg).to.be.most(atmst);
  };

  /**
   * ### .isTrue(value, [message])
   *
   * Asserts that `value` is true.
   *
   *     var teaServed = true;
   *     assert.isTrue(teaServed, 'the tea has been served');
   *
   * @name isTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isTrue = function (val, msg) {
    new Assertion(val, msg).is['true'];
  };

  /**
   * ### .isNotTrue(value, [message])
   *
   * Asserts that `value` is not true.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotTrue(tea, 'great, time for tea!');
   *
   * @name isNotTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotTrue = function (val, msg) {
    new Assertion(val, msg).to.not.equal(true);
  };

  /**
   * ### .isFalse(value, [message])
   *
   * Asserts that `value` is false.
   *
   *     var teaServed = false;
   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
   *
   * @name isFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFalse = function (val, msg) {
    new Assertion(val, msg).is['false'];
  };

  /**
   * ### .isNotFalse(value, [message])
   *
   * Asserts that `value` is not false.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotFalse(tea, 'great, time for tea!');
   *
   * @name isNotFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFalse = function (val, msg) {
    new Assertion(val, msg).to.not.equal(false);
  };

  /**
   * ### .isNull(value, [message])
   *
   * Asserts that `value` is null.
   *
   *     assert.isNull(err, 'there was no error');
   *
   * @name isNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNull = function (val, msg) {
    new Assertion(val, msg).to.equal(null);
  };

  /**
   * ### .isNotNull(value, [message])
   *
   * Asserts that `value` is not null.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotNull(tea, 'great, time for tea!');
   *
   * @name isNotNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNull = function (val, msg) {
    new Assertion(val, msg).to.not.equal(null);
  };

  /**
   * ### .isNaN
   * Asserts that value is NaN
   *
   *    assert.isNaN('foo', 'foo is NaN');
   *
   * @name isNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNaN = function (val, msg) {
    new Assertion(val, msg).to.be.NaN;
  };

  /**
   * ### .isNotNaN
   * Asserts that value is not NaN
   *
   *    assert.isNotNaN(4, '4 is not NaN');
   *
   * @name isNotNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */
  assert.isNotNaN = function (val, msg) {
    new Assertion(val, msg).not.to.be.NaN;
  };

  /**
   * ### .isUndefined(value, [message])
   *
   * Asserts that `value` is `undefined`.
   *
   *     var tea;
   *     assert.isUndefined(tea, 'no tea defined');
   *
   * @name isUndefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isUndefined = function (val, msg) {
    new Assertion(val, msg).to.equal(undefined);
  };

  /**
   * ### .isDefined(value, [message])
   *
   * Asserts that `value` is not `undefined`.
   *
   *     var tea = 'cup of chai';
   *     assert.isDefined(tea, 'tea has been defined');
   *
   * @name isDefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isDefined = function (val, msg) {
    new Assertion(val, msg).to.not.equal(undefined);
  };

  /**
   * ### .isFunction(value, [message])
   *
   * Asserts that `value` is a function.
   *
   *     function serveTea() { return 'cup of tea'; };
   *     assert.isFunction(serveTea, 'great, we can have tea now');
   *
   * @name isFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFunction = function (val, msg) {
    new Assertion(val, msg).to.be.a('function');
  };

  /**
   * ### .isNotFunction(value, [message])
   *
   * Asserts that `value` is _not_ a function.
   *
   *     var serveTea = [ 'heat', 'pour', 'sip' ];
   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
   *
   * @name isNotFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFunction = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('function');
  };

  /**
   * ### .isObject(value, [message])
   *
   * Asserts that `value` is an object of type 'Object' (as revealed by `Object.prototype.toString`).
   * _The assertion does not match subclassed objects._
   *
   *     var selection = { name: 'Chai', serve: 'with spices' };
   *     assert.isObject(selection, 'tea selection is an object');
   *
   * @name isObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isObject = function (val, msg) {
    new Assertion(val, msg).to.be.a('object');
  };

  /**
   * ### .isNotObject(value, [message])
   *
   * Asserts that `value` is _not_ an object of type 'Object' (as revealed by `Object.prototype.toString`).
   *
   *     var selection = 'chai'
   *     assert.isNotObject(selection, 'tea selection is not an object');
   *     assert.isNotObject(null, 'null is not an object');
   *
   * @name isNotObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotObject = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('object');
  };

  /**
   * ### .isArray(value, [message])
   *
   * Asserts that `value` is an array.
   *
   *     var menu = [ 'green', 'chai', 'oolong' ];
   *     assert.isArray(menu, 'what kind of tea do we want?');
   *
   * @name isArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isArray = function (val, msg) {
    new Assertion(val, msg).to.be.an('array');
  };

  /**
   * ### .isNotArray(value, [message])
   *
   * Asserts that `value` is _not_ an array.
   *
   *     var menu = 'green|chai|oolong';
   *     assert.isNotArray(menu, 'what kind of tea do we want?');
   *
   * @name isNotArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotArray = function (val, msg) {
    new Assertion(val, msg).to.not.be.an('array');
  };

  /**
   * ### .isString(value, [message])
   *
   * Asserts that `value` is a string.
   *
   *     var teaOrder = 'chai';
   *     assert.isString(teaOrder, 'order placed');
   *
   * @name isString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isString = function (val, msg) {
    new Assertion(val, msg).to.be.a('string');
  };

  /**
   * ### .isNotString(value, [message])
   *
   * Asserts that `value` is _not_ a string.
   *
   *     var teaOrder = 4;
   *     assert.isNotString(teaOrder, 'order placed');
   *
   * @name isNotString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotString = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('string');
  };

  /**
   * ### .isNumber(value, [message])
   *
   * Asserts that `value` is a number.
   *
   *     var cups = 2;
   *     assert.isNumber(cups, 'how many cups');
   *
   * @name isNumber
   * @param {Number} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNumber = function (val, msg) {
    new Assertion(val, msg).to.be.a('number');
  };

  /**
   * ### .isNotNumber(value, [message])
   *
   * Asserts that `value` is _not_ a number.
   *
   *     var cups = '2 cups please';
   *     assert.isNotNumber(cups, 'how many cups');
   *
   * @name isNotNumber
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNumber = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('number');
  };

  /**
   * ### .isBoolean(value, [message])
   *
   * Asserts that `value` is a boolean.
   *
   *     var teaReady = true
   *       , teaServed = false;
   *
   *     assert.isBoolean(teaReady, 'is the tea ready');
   *     assert.isBoolean(teaServed, 'has tea been served');
   *
   * @name isBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBoolean = function (val, msg) {
    new Assertion(val, msg).to.be.a('boolean');
  };

  /**
   * ### .isNotBoolean(value, [message])
   *
   * Asserts that `value` is _not_ a boolean.
   *
   *     var teaReady = 'yep'
   *       , teaServed = 'nope';
   *
   *     assert.isNotBoolean(teaReady, 'is the tea ready');
   *     assert.isNotBoolean(teaServed, 'has tea been served');
   *
   * @name isNotBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotBoolean = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('boolean');
  };

  /**
   * ### .typeOf(value, name, [message])
   *
   * Asserts that `value`'s type is `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
   *     assert.typeOf('tea', 'string', 'we have a string');
   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
   *     assert.typeOf(null, 'null', 'we have a null');
   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
   *
   * @name typeOf
   * @param {Mixed} value
   * @param {String} name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.typeOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.a(type);
  };

  /**
   * ### .notTypeOf(value, name, [message])
   *
   * Asserts that `value`'s type is _not_ `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
   *
   * @name notTypeOf
   * @param {Mixed} value
   * @param {String} typeof name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notTypeOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.a(type);
  };

  /**
   * ### .instanceOf(object, constructor, [message])
   *
   * Asserts that `value` is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new Tea('chai');
   *
   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
   *
   * @name instanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.instanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.instanceOf(type);
  };

  /**
   * ### .notInstanceOf(object, constructor, [message])
   *
   * Asserts `value` is not an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new String('chai');
   *
   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
   *
   * @name notInstanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInstanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.instanceOf(type);
  };

  /**
   * ### .include(haystack, needle, [message])
   *
   * Asserts that `haystack` includes `needle`. Works
   * for strings and arrays.
   *
   *     assert.include('foobar', 'bar', 'foobar contains string "bar"');
   *     assert.include([ 1, 2, 3 ], 3, 'array contains value');
   *
   * @name include
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.include = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.include).include(inc);
  };

  /**
   * ### .notInclude(haystack, needle, [message])
   *
   * Asserts that `haystack` does not include `needle`. Works
   * for strings and arrays.
   *
   *     assert.notInclude('foobar', 'baz', 'string not include substring');
   *     assert.notInclude([ 1, 2, 3 ], 4, 'array not include contain value');
   *
   * @name notInclude
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notInclude).not.include(inc);
  };

  /**
   * ### .match(value, regexp, [message])
   *
   * Asserts that `value` matches the regular expression `regexp`.
   *
   *     assert.match('foobar', /^foo/, 'regexp matches');
   *
   * @name match
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.match = function (exp, re, msg) {
    new Assertion(exp, msg).to.match(re);
  };

  /**
   * ### .notMatch(value, regexp, [message])
   *
   * Asserts that `value` does not match the regular expression `regexp`.
   *
   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
   *
   * @name notMatch
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notMatch = function (exp, re, msg) {
    new Assertion(exp, msg).to.not.match(re);
  };

  /**
   * ### .property(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`.
   *
   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
   *
   * @name property
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.property = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.property(prop);
  };

  /**
   * ### .notProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`.
   *
   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
   *
   * @name notProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.property(prop);
  };

  /**
   * ### .deepProperty(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`, which can be a
   * string using dot- and bracket-notation for deep reference.
   *
   *     assert.deepProperty({ tea: { green: 'matcha' }}, 'tea.green');
   *
   * @name deepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop);
  };

  /**
   * ### .notDeepProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`, which
   * can be a string using dot- and bracket-notation for deep reference.
   *
   *     assert.notDeepProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
   *
   * @name notDeepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop);
  };

  /**
   * ### .propertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`.
   *
   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
   *
   * @name propertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.propertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.property(prop, val);
  };

  /**
   * ### .propertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`.
   *
   *     assert.propertyNotVal({ tea: 'is good' }, 'tea', 'is bad');
   *
   * @name propertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.propertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.property(prop, val);
  };

  /**
   * ### .deepPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`. `property` can use dot- and bracket-notation for deep
   * reference.
   *
   *     assert.deepPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
   *
   * @name deepPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop, val);
  };

  /**
   * ### .deepPropertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`. `property` can use dot- and
   * bracket-notation for deep reference.
   *
   *     assert.deepPropertyNotVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
   *
   * @name deepPropertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepPropertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop, val);
  };

  /**
   * ### .lengthOf(object, length, [message])
   *
   * Asserts that `object` has a `length` property with the expected value.
   *
   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
   *     assert.lengthOf('foobar', 6, 'string has length of 6');
   *
   * @name lengthOf
   * @param {Mixed} object
   * @param {Number} length
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.lengthOf = function (exp, len, msg) {
    new Assertion(exp, msg).to.have.length(len);
  };

  /**
   * ### .throws(function, [constructor/string/regexp], [string/regexp], [message])
   *
   * Asserts that `function` will throw an error that is an instance of
   * `constructor`, or alternately that it will throw an error with message
   * matching `regexp`.
   *
   *     assert.throws(fn, 'function throws a reference error');
   *     assert.throws(fn, /function throws a reference error/);
   *     assert.throws(fn, ReferenceError);
   *     assert.throws(fn, ReferenceError, 'function throws a reference error');
   *     assert.throws(fn, ReferenceError, /function throws a reference error/);
   *
   * @name throws
   * @alias throw
   * @alias Throw
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.throws = function (fn, errt, errs, msg) {
    if ('string' === typeof errt || errt instanceof RegExp) {
      errs = errt;
      errt = null;
    }

    var assertErr = new Assertion(fn, msg).to.throw(errt, errs);
    return flag(assertErr, 'object');
  };

  /**
   * ### .doesNotThrow(function, [constructor/regexp], [message])
   *
   * Asserts that `function` will _not_ throw an error that is an instance of
   * `constructor`, or alternately that it will not throw an error with message
   * matching `regexp`.
   *
   *     assert.doesNotThrow(fn, Error, 'function does not throw');
   *
   * @name doesNotThrow
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.doesNotThrow = function (fn, type, msg) {
    if ('string' === typeof type) {
      msg = type;
      type = null;
    }

    new Assertion(fn, msg).to.not.Throw(type);
  };

  /**
   * ### .operator(val1, operator, val2, [message])
   *
   * Compares two values using `operator`.
   *
   *     assert.operator(1, '<', 2, 'everything is ok');
   *     assert.operator(1, '>', 2, 'this will fail');
   *
   * @name operator
   * @param {Mixed} val1
   * @param {String} operator
   * @param {Mixed} val2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.operator = function (val, operator, val2, msg) {
    var ok;
    switch(operator) {
      case '==':
        ok = val == val2;
        break;
      case '===':
        ok = val === val2;
        break;
      case '>':
        ok = val > val2;
        break;
      case '>=':
        ok = val >= val2;
        break;
      case '<':
        ok = val < val2;
        break;
      case '<=':
        ok = val <= val2;
        break;
      case '!=':
        ok = val != val2;
        break;
      case '!==':
        ok = val !== val2;
        break;
      default:
        throw new Error('Invalid operator "' + operator + '"');
    }
    var test = new Assertion(ok, msg);
    test.assert(
        true === flag(test, 'object')
      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
  };

  /**
   * ### .closeTo(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
   *
   * @name closeTo
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.closeTo = function (act, exp, delta, msg) {
    new Assertion(act, msg).to.be.closeTo(exp, delta);
  };

  /**
   * ### .approximately(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.approximately(1.5, 1, 0.5, 'numbers are close');
   *
   * @name approximately
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.approximately = function (act, exp, delta, msg) {
    new Assertion(act, msg).to.be.approximately(exp, delta);
  };

  /**
   * ### .sameMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members.
   * Order is not taken into account.
   *
   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
   *
   * @name sameMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg).to.have.same.members(set2);
  }

  /**
   * ### .sameDeepMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members - using a deep equality checking.
   * Order is not taken into account.
   *
   *     assert.sameDeepMembers([ {b: 3}, {a: 2}, {c: 5} ], [ {c: 5}, {b: 3}, {a: 2} ], 'same deep members');
   *
   * @name sameDeepMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameDeepMembers = function (set1, set2, msg) {
    new Assertion(set1, msg).to.have.same.deep.members(set2);
  }

  /**
   * ### .includeMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset`.
   * Order is not taken into account.
   *
   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1 ], 'include members');
   *
   * @name includeMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg).to.include.members(subset);
  }

  /**
   * ### .includeDeepMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset` - using deep equality checking.
   * Order is not taken into account.
   * Duplicates are ignored.
   *
   *     assert.includeDeepMembers([ {a: 1}, {b: 2}, {c: 3} ], [ {b: 2}, {a: 1}, {b: 2} ], 'include deep members');
   *
   * @name includeDeepMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeDeepMembers = function (superset, subset, msg) {
    new Assertion(superset, msg).to.include.deep.members(subset);
  }

  /**
   * ### .oneOf(inList, list, [message])
   *
   * Asserts that non-object, non-array value `inList` appears in the flat array `list`.
   *
   *     assert.oneOf(1, [ 2, 1 ], 'Not found in list');
   *
   * @name oneOf
   * @param {*} inList
   * @param {Array<*>} list
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.oneOf = function (inList, list, msg) {
    new Assertion(inList, msg).to.be.oneOf(list);
  }

   /**
   * ### .changes(function, object, property)
   *
   * Asserts that a function changes the value of a property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 22 };
   *     assert.changes(fn, obj, 'val');
   *
   * @name changes
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.changes = function (fn, obj, prop) {
    new Assertion(fn).to.change(obj, prop);
  }

   /**
   * ### .doesNotChange(function, object, property)
   *
   * Asserts that a function does not changes the value of a property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { console.log('foo'); };
   *     assert.doesNotChange(fn, obj, 'val');
   *
   * @name doesNotChange
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotChange = function (fn, obj, prop) {
    new Assertion(fn).to.not.change(obj, prop);
  }

   /**
   * ### .increases(function, object, property)
   *
   * Asserts that a function increases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 13 };
   *     assert.increases(fn, obj, 'val');
   *
   * @name increases
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.increases = function (fn, obj, prop) {
    new Assertion(fn).to.increase(obj, prop);
  }

   /**
   * ### .doesNotIncrease(function, object, property)
   *
   * Asserts that a function does not increase object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 8 };
   *     assert.doesNotIncrease(fn, obj, 'val');
   *
   * @name doesNotIncrease
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotIncrease = function (fn, obj, prop) {
    new Assertion(fn).to.not.increase(obj, prop);
  }

   /**
   * ### .decreases(function, object, property)
   *
   * Asserts that a function decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     assert.decreases(fn, obj, 'val');
   *
   * @name decreases
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.decreases = function (fn, obj, prop) {
    new Assertion(fn).to.decrease(obj, prop);
  }

   /**
   * ### .doesNotDecrease(function, object, property)
   *
   * Asserts that a function does not decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     assert.doesNotDecrease(fn, obj, 'val');
   *
   * @name doesNotDecrease
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotDecrease = function (fn, obj, prop) {
    new Assertion(fn).to.not.decrease(obj, prop);
  }

  /*!
   * ### .ifError(object)
   *
   * Asserts if value is not a false value, and throws if it is a true value.
   * This is added to allow for chai to be a drop-in replacement for Node's
   * assert class.
   *
   *     var err = new Error('I am a custom error');
   *     assert.ifError(err); // Rethrows err!
   *
   * @name ifError
   * @param {Object} object
   * @namespace Assert
   * @api public
   */

  assert.ifError = function (val) {
    if (val) {
      throw(val);
    }
  };

  /**
   * ### .isExtensible(object)
   *
   * Asserts that `object` is extensible (can have new properties added to it).
   *
   *     assert.isExtensible({});
   *
   * @name isExtensible
   * @alias extensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isExtensible = function (obj, msg) {
    new Assertion(obj, msg).to.be.extensible;
  };

  /**
   * ### .isNotExtensible(object)
   *
   * Asserts that `object` is _not_ extensible.
   *
   *     var nonExtensibleObject = Object.preventExtensions({});
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freese({});
   *
   *     assert.isNotExtensible(nonExtensibleObject);
   *     assert.isNotExtensible(sealedObject);
   *     assert.isNotExtensible(frozenObject);
   *
   * @name isNotExtensible
   * @alias notExtensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotExtensible = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.extensible;
  };

  /**
   * ### .isSealed(object)
   *
   * Asserts that `object` is sealed (cannot have new properties added to it
   * and its existing properties cannot be removed).
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.seal({});
   *
   *     assert.isSealed(sealedObject);
   *     assert.isSealed(frozenObject);
   *
   * @name isSealed
   * @alias sealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isSealed = function (obj, msg) {
    new Assertion(obj, msg).to.be.sealed;
  };

  /**
   * ### .isNotSealed(object)
   *
   * Asserts that `object` is _not_ sealed.
   *
   *     assert.isNotSealed({});
   *
   * @name isNotSealed
   * @alias notSealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotSealed = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.sealed;
  };

  /**
   * ### .isFrozen(object)
   *
   * Asserts that `object` is frozen (cannot have new properties added to it
   * and its existing properties cannot be modified).
   *
   *     var frozenObject = Object.freeze({});
   *     assert.frozen(frozenObject);
   *
   * @name isFrozen
   * @alias frozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isFrozen = function (obj, msg) {
    new Assertion(obj, msg).to.be.frozen;
  };

  /**
   * ### .isNotFrozen(object)
   *
   * Asserts that `object` is _not_ frozen.
   *
   *     assert.isNotFrozen({});
   *
   * @name isNotFrozen
   * @alias notFrozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotFrozen = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.frozen;
  };

  /*!
   * Aliases.
   */

  (function alias(name, as){
    assert[as] = assert[name];
    return alias;
  })
  ('isOk', 'ok')
  ('isNotOk', 'notOk')
  ('throws', 'throw')
  ('throws', 'Throw')
  ('isExtensible', 'extensible')
  ('isNotExtensible', 'notExtensible')
  ('isSealed', 'sealed')
  ('isNotSealed', 'notSealed')
  ('isFrozen', 'frozen')
  ('isNotFrozen', 'notFrozen');
};

},{}],11:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  chai.expect = function (val, message) {
    return new chai.Assertion(val, message);
  };

  /**
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure.
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace Expect
   * @api public
   */

  chai.expect.fail = function (actual, expected, message, operator) {
    message = message || 'expect.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, chai.expect.fail);
  };
};

},{}],12:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  var Assertion = chai.Assertion;

  function loadShould () {
    // explicitly define this method as function as to have it's name to include as `ssfi`
    function shouldGetter() {
      if (this instanceof String || this instanceof Number || this instanceof Boolean ) {
        return new Assertion(this.valueOf(), null, shouldGetter);
      }
      return new Assertion(this, null, shouldGetter);
    }
    function shouldSetter(value) {
      // See https://github.com/chaijs/chai/issues/86: this makes
      // `whatever.should = someValue` actually set `someValue`, which is
      // especially useful for `global.should = require('chai').should()`.
      //
      // Note that we have to use [[DefineProperty]] instead of [[Put]]
      // since otherwise we would trigger this very setter!
      Object.defineProperty(this, 'should', {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    // modify Object.prototype to have `should`
    Object.defineProperty(Object.prototype, 'should', {
      set: shouldSetter
      , get: shouldGetter
      , configurable: true
    });

    var should = {};

    /**
     * ### .fail(actual, expected, [message], [operator])
     *
     * Throw a failure.
     *
     * @name fail
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @param {String} operator
     * @namespace Should
     * @api public
     */

    should.fail = function (actual, expected, message, operator) {
      message = message || 'should.fail()';
      throw new chai.AssertionError(message, {
          actual: actual
        , expected: expected
        , operator: operator
      }, should.fail);
    };

    /**
     * ### .equal(actual, expected, [message])
     *
     * Asserts non-strict equality (`==`) of `actual` and `expected`.
     *
     *     should.equal(3, '3', '== coerces values to strings');
     *
     * @name equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/string/regexp], [string/regexp], [message])
     *
     * Asserts that `function` will throw an error that is an instance of
     * `constructor`, or alternately that it will throw an error with message
     * matching `regexp`.
     *
     *     should.throw(fn, 'function throws a reference error');
     *     should.throw(fn, /function throws a reference error/);
     *     should.throw(fn, ReferenceError);
     *     should.throw(fn, ReferenceError, 'function throws a reference error');
     *     should.throw(fn, ReferenceError, /function throws a reference error/);
     *
     * @name throw
     * @alias Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.Throw(errt, errs);
    };

    /**
     * ### .exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var foo = 'hi';
     *
     *     should.exist(foo, 'foo exists');
     *
     * @name exist
     * @namespace Should
     * @api public
     */

    should.exist = function (val, msg) {
      new Assertion(val, msg).to.exist;
    }

    // negation
    should.not = {}

    /**
     * ### .not.equal(actual, expected, [message])
     *
     * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
     *
     *     should.not.equal(3, 4, 'these numbers are not equal');
     *
     * @name not.equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.not.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.not.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/regexp], [message])
     *
     * Asserts that `function` will _not_ throw an error that is an instance of
     * `constructor`, or alternately that it will not throw an error with message
     * matching `regexp`.
     *
     *     should.not.throw(fn, Error, 'function does not throw');
     *
     * @name not.throw
     * @alias not.Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.not.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.not.Throw(errt, errs);
    };

    /**
     * ### .not.exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var bar = null;
     *
     *     should.not.exist(bar, 'bar does not exist');
     *
     * @name not.exist
     * @namespace Should
     * @api public
     */

    should.not.exist = function (val, msg) {
      new Assertion(val, msg).to.not.exist;
    }

    should['throw'] = should['Throw'];
    should.not['throw'] = should.not['Throw'];

    return should;
  };

  chai.should = loadShould;
  chai.Should = loadShould;
};

},{}],13:[function(require,module,exports){
/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var transferFlags = require('./transferFlags');
var flag = require('./flag');
var config = require('../config');

/*!
 * Module variables
 */

// Check whether `__proto__` is supported
var hasProtoSupport = '__proto__' in Object;

// Without `__proto__` support, this module will need to add properties to a function.
// However, some Function.prototype methods cannot be overwritten,
// and there seems no easy cross-platform way to detect them (@see chaijs/chai/issues/69).
var excludeNames = /^(?:length|name|arguments|caller)$/;

// Cache `Function` properties
var call  = Function.prototype.call,
    apply = Function.prototype.apply;

/**
 * ### addChainableMethod (ctx, name, method, chainingBehavior)
 *
 * Adds a method to an object, such that the method can also be chained.
 *
 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
 *
 * The result can then be used as both a method assertion, executing both `method` and
 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
 *
 *     expect(fooStr).to.be.foo('bar');
 *     expect(fooStr).to.be.foo.equal('foo');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for `name`, when called
 * @param {Function} chainingBehavior function to be called every time the property is accessed
 * @namespace Utils
 * @name addChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== 'function') {
    chainingBehavior = function () { };
  }

  var chainableBehavior = {
      method: method
    , chainingBehavior: chainingBehavior
  };

  // save the methods so we can overwrite them later, if we need to.
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;

  Object.defineProperty(ctx, name,
    { get: function () {
        chainableBehavior.chainingBehavior.call(this);

        var assert = function assert() {
          var old_ssfi = flag(this, 'ssfi');
          if (old_ssfi && config.includeStack === false)
            flag(this, 'ssfi', assert);
          var result = chainableBehavior.method.apply(this, arguments);
          return result === undefined ? this : result;
        };

        // Use `__proto__` if available
        if (hasProtoSupport) {
          // Inherit all properties from the object by replacing the `Function` prototype
          var prototype = assert.__proto__ = Object.create(this);
          // Restore the `call` and `apply` methods from `Function`
          prototype.call = call;
          prototype.apply = apply;
        }
        // Otherwise, redefine all properties (slow!)
        else {
          var asserterNames = Object.getOwnPropertyNames(ctx);
          asserterNames.forEach(function (asserterName) {
            if (!excludeNames.test(asserterName)) {
              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
              Object.defineProperty(assert, asserterName, pd);
            }
          });
        }

        transferFlags(this, assert);
        return assert;
      }
    , configurable: true
  });
};

},{"../config":8,"./flag":17,"./transferFlags":33}],14:[function(require,module,exports){
/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = require('../config');

/**
 * ### .addMethod (ctx, name, method)
 *
 * Adds a method to the prototype of an object.
 *
 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(fooStr).to.be.foo('bar');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for name
 * @namespace Utils
 * @name addMethod
 * @api public
 */
var flag = require('./flag');

module.exports = function (ctx, name, method) {
  ctx[name] = function () {
    var old_ssfi = flag(this, 'ssfi');
    if (old_ssfi && config.includeStack === false)
      flag(this, 'ssfi', ctx[name]);
    var result = method.apply(this, arguments);
    return result === undefined ? this : result;
  };
};

},{"../config":8,"./flag":17}],15:[function(require,module,exports){
/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = require('../config');
var flag = require('./flag');

/**
 * ### addProperty (ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @namespace Utils
 * @name addProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  Object.defineProperty(ctx, name,
    { get: function addProperty() {
        var old_ssfi = flag(this, 'ssfi');
        if (old_ssfi && config.includeStack === false)
          flag(this, 'ssfi', addProperty);

        var result = getter.call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};

},{"../config":8,"./flag":17}],16:[function(require,module,exports){
/*!
 * Chai - expectTypes utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### expectTypes(obj, types)
 *
 * Ensures that the object being tested against is of a valid type.
 *
 *     utils.expectTypes(this, ['array', 'object', 'string']);
 *
 * @param {Mixed} obj constructed Assertion
 * @param {Array} type A list of allowed types for this assertion
 * @namespace Utils
 * @name expectTypes
 * @api public
 */

var AssertionError = require('assertion-error');
var flag = require('./flag');
var type = require('type-detect');

module.exports = function (obj, types) {
  var obj = flag(obj, 'object');
  types = types.map(function (t) { return t.toLowerCase(); });
  types.sort();

  // Transforms ['lorem', 'ipsum'] into 'a lirum, or an ipsum'
  var str = types.map(function (t, index) {
    var art = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(t.charAt(0)) ? 'an' : 'a';
    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
    return or + art + ' ' + t;
  }).join(', ');

  if (!types.some(function (expected) { return type(obj) === expected; })) {
    throw new AssertionError(
      'object tested must be ' + str + ', but ' + type(obj) + ' given'
    );
  }
};

},{"./flag":17,"assertion-error":34,"type-detect":39}],17:[function(require,module,exports){
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### flag(object, key, [value])
 *
 * Get or set a flag value on an object. If a
 * value is provided it will be set, else it will
 * return the currently set value or `undefined` if
 * the value is not set.
 *
 *     utils.flag(this, 'foo', 'bar'); // setter
 *     utils.flag(this, 'foo'); // getter, returns `bar`
 *
 * @param {Object} object constructed Assertion
 * @param {String} key
 * @param {Mixed} value (optional)
 * @namespace Utils
 * @name flag
 * @api private
 */

module.exports = function (obj, key, value) {
  var flags = obj.__flags || (obj.__flags = Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
};

},{}],18:[function(require,module,exports){
/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getActual(object, [actual])
 *
 * Returns the `actual` value for an Assertion
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getActual
 */

module.exports = function (obj, args) {
  return args.length > 4 ? args[4] : obj._obj;
};

},{}],19:[function(require,module,exports){
/*!
 * Chai - getEnumerableProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getEnumerableProperties(object)
 *
 * This allows the retrieval of enumerable property names of an object,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getEnumerableProperties
 * @api public
 */

module.exports = function getEnumerableProperties(object) {
  var result = [];
  for (var name in object) {
    result.push(name);
  }
  return result;
};

},{}],20:[function(require,module,exports){
/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = require('./flag')
  , getActual = require('./getActual')
  , inspect = require('./inspect')
  , objDisplay = require('./objDisplay');

/**
 * ### .getMessage(object, message, negateMessage)
 *
 * Construct the error message based on flags
 * and template tags. Template tags will return
 * a stringified inspection of the object referenced.
 *
 * Message template tags:
 * - `#{this}` current asserted object
 * - `#{act}` actual value
 * - `#{exp}` expected value
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getMessage
 * @api public
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , val = flag(obj, 'object')
    , expected = args[3]
    , actual = getActual(obj, args)
    , msg = negate ? args[2] : args[1]
    , flagMsg = flag(obj, 'message');

  if(typeof msg === "function") msg = msg();
  msg = msg || '';
  msg = msg
    .replace(/#\{this\}/g, function () { return objDisplay(val); })
    .replace(/#\{act\}/g, function () { return objDisplay(actual); })
    .replace(/#\{exp\}/g, function () { return objDisplay(expected); });

  return flagMsg ? flagMsg + ': ' + msg : msg;
};

},{"./flag":17,"./getActual":18,"./inspect":27,"./objDisplay":28}],21:[function(require,module,exports){
/*!
 * Chai - getName utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getName(func)
 *
 * Gets the name of a function, in a cross-browser way.
 *
 * @param {Function} a function (usually a constructor)
 * @namespace Utils
 * @name getName
 */

module.exports = function (func) {
  if (func.name) return func.name;

  var match = /^\s?function ([^(]*)\(/.exec(func);
  return match && match[1] ? match[1] : "";
};

},{}],22:[function(require,module,exports){
/*!
 * Chai - getPathInfo utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var hasProperty = require('./hasProperty');

/**
 * ### .getPathInfo(path, object)
 *
 * This allows the retrieval of property info in an
 * object given a string path.
 *
 * The path info consists of an object with the
 * following properties:
 *
 * * parent - The parent object of the property referenced by `path`
 * * name - The name of the final property, a number if it was an array indexer
 * * value - The value of the property, if it exists, otherwise `undefined`
 * * exists - Whether the property exists or not
 *
 * @param {String} path
 * @param {Object} object
 * @returns {Object} info
 * @namespace Utils
 * @name getPathInfo
 * @api public
 */

module.exports = function getPathInfo(path, obj) {
  var parsed = parsePath(path),
      last = parsed[parsed.length - 1];

  var info = {
    parent: parsed.length > 1 ? _getPathValue(parsed, obj, parsed.length - 1) : obj,
    name: last.p || last.i,
    value: _getPathValue(parsed, obj)
  };
  info.exists = hasProperty(info.name, info.parent);

  return info;
};


/*!
 * ## parsePath(path)
 *
 * Helper function used to parse string object
 * paths. Use in conjunction with `_getPathValue`.
 *
 *      var parsed = parsePath('myobject.property.subprop');
 *
 * ### Paths:
 *
 * * Can be as near infinitely deep and nested
 * * Arrays are also valid using the formal `myobject.document[3].property`.
 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
 *
 * @param {String} path
 * @returns {Object} parsed
 * @api private
 */

function parsePath (path) {
  var str = path.replace(/([^\\])\[/g, '$1.[')
    , parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function (value) {
    var re = /^\[(\d+)\]$/
      , mArr = re.exec(value);
    if (mArr) return { i: parseFloat(mArr[1]) };
    else return { p: value.replace(/\\([.\[\]])/g, '$1') };
  });
}


/*!
 * ## _getPathValue(parsed, obj)
 *
 * Helper companion function for `.parsePath` that returns
 * the value located at the parsed address.
 *
 *      var value = getPathValue(parsed, obj);
 *
 * @param {Object} parsed definition from `parsePath`.
 * @param {Object} object to search against
 * @param {Number} object to search against
 * @returns {Object|Undefined} value
 * @api private
 */

function _getPathValue (parsed, obj, index) {
  var tmp = obj
    , res;

  index = (index === undefined ? parsed.length : index);

  for (var i = 0, l = index; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('undefined' !== typeof part.p)
        tmp = tmp[part.p];
      else if ('undefined' !== typeof part.i)
        tmp = tmp[part.i];
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
}

},{"./hasProperty":25}],23:[function(require,module,exports){
/*!
 * Chai - getPathValue utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * @see https://github.com/logicalparadox/filtr
 * MIT Licensed
 */

var getPathInfo = require('./getPathInfo');

/**
 * ### .getPathValue(path, object)
 *
 * This allows the retrieval of values in an
 * object given a string path.
 *
 *     var obj = {
 *         prop1: {
 *             arr: ['a', 'b', 'c']
 *           , str: 'Hello'
 *         }
 *       , prop2: {
 *             arr: [ { nested: 'Universe' } ]
 *           , str: 'Hello again!'
 *         }
 *     }
 *
 * The following would be the results.
 *
 *     getPathValue('prop1.str', obj); // Hello
 *     getPathValue('prop1.att[2]', obj); // b
 *     getPathValue('prop2.arr[0].nested', obj); // Universe
 *
 * @param {String} path
 * @param {Object} object
 * @returns {Object} value or `undefined`
 * @namespace Utils
 * @name getPathValue
 * @api public
 */
module.exports = function(path, obj) {
  var info = getPathInfo(path, obj);
  return info.value;
};

},{"./getPathInfo":22}],24:[function(require,module,exports){
/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getProperties(object)
 *
 * This allows the retrieval of property names of an object, enumerable or not,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getProperties
 * @api public
 */

module.exports = function getProperties(object) {
  var result = Object.getOwnPropertyNames(object);

  function addProperty(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }

  var proto = Object.getPrototypeOf(object);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty);
    proto = Object.getPrototypeOf(proto);
  }

  return result;
};

},{}],25:[function(require,module,exports){
/*!
 * Chai - hasProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var type = require('type-detect');

/**
 * ### .hasProperty(object, name)
 *
 * This allows checking whether an object has
 * named property or numeric array index.
 *
 * Basically does the same thing as the `in`
 * operator but works properly with natives
 * and null/undefined values.
 *
 *     var obj = {
 *         arr: ['a', 'b', 'c']
 *       , str: 'Hello'
 *     }
 *
 * The following would be the results.
 *
 *     hasProperty('str', obj);  // true
 *     hasProperty('constructor', obj);  // true
 *     hasProperty('bar', obj);  // false
 *
 *     hasProperty('length', obj.str); // true
 *     hasProperty(1, obj.str);  // true
 *     hasProperty(5, obj.str);  // false
 *
 *     hasProperty('length', obj.arr);  // true
 *     hasProperty(2, obj.arr);  // true
 *     hasProperty(3, obj.arr);  // false
 *
 * @param {Objuect} object
 * @param {String|Number} name
 * @returns {Boolean} whether it exists
 * @namespace Utils
 * @name getPathInfo
 * @api public
 */

var literals = {
    'number': Number
  , 'string': String
};

module.exports = function hasProperty(name, obj) {
  var ot = type(obj);

  // Bad Object, obviously no props at all
  if(ot === 'null' || ot === 'undefined')
    return false;

  // The `in` operator does not work with certain literals
  // box these before the check
  if(literals[ot] && typeof obj !== 'object')
    obj = new literals[ot](obj);

  return name in obj;
};

},{"type-detect":39}],26:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Main exports
 */

var exports = module.exports = {};

/*!
 * test utility
 */

exports.test = require('./test');

/*!
 * type utility
 */

exports.type = require('type-detect');

/*!
 * expectTypes utility
 */
exports.expectTypes = require('./expectTypes');

/*!
 * message utility
 */

exports.getMessage = require('./getMessage');

/*!
 * actual utility
 */

exports.getActual = require('./getActual');

/*!
 * Inspect util
 */

exports.inspect = require('./inspect');

/*!
 * Object Display util
 */

exports.objDisplay = require('./objDisplay');

/*!
 * Flag utility
 */

exports.flag = require('./flag');

/*!
 * Flag transferring utility
 */

exports.transferFlags = require('./transferFlags');

/*!
 * Deep equal utility
 */

exports.eql = require('deep-eql');

/*!
 * Deep path value
 */

exports.getPathValue = require('./getPathValue');

/*!
 * Deep path info
 */

exports.getPathInfo = require('./getPathInfo');

/*!
 * Check if a property exists
 */

exports.hasProperty = require('./hasProperty');

/*!
 * Function name
 */

exports.getName = require('./getName');

/*!
 * add Property
 */

exports.addProperty = require('./addProperty');

/*!
 * add Method
 */

exports.addMethod = require('./addMethod');

/*!
 * overwrite Property
 */

exports.overwriteProperty = require('./overwriteProperty');

/*!
 * overwrite Method
 */

exports.overwriteMethod = require('./overwriteMethod');

/*!
 * Add a chainable method
 */

exports.addChainableMethod = require('./addChainableMethod');

/*!
 * Overwrite chainable method
 */

exports.overwriteChainableMethod = require('./overwriteChainableMethod');

},{"./addChainableMethod":13,"./addMethod":14,"./addProperty":15,"./expectTypes":16,"./flag":17,"./getActual":18,"./getMessage":20,"./getName":21,"./getPathInfo":22,"./getPathValue":23,"./hasProperty":25,"./inspect":27,"./objDisplay":28,"./overwriteChainableMethod":29,"./overwriteMethod":30,"./overwriteProperty":31,"./test":32,"./transferFlags":33,"deep-eql":35,"type-detect":39}],27:[function(require,module,exports){
// This is (almost) directly from Node.js utils
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

var getName = require('./getName');
var getProperties = require('./getProperties');
var getEnumerableProperties = require('./getEnumerableProperties');

module.exports = inspect;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 * @namespace Utils
 * @name inspect
 */
function inspect(obj, showHidden, depth, colors) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: function (str) { return str; }
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}

// Returns true if object is a DOM element.
var isDOMElement = function (object) {
  if (typeof HTMLElement === 'object') {
    return object instanceof HTMLElement;
  } else {
    return object &&
      typeof object === 'object' &&
      object.nodeType === 1 &&
      typeof object.nodeName === 'string';
  }
};

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (typeof ret !== 'string') {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // If this is a DOM element, try to get the outer HTML.
  if (isDOMElement(value)) {
    if ('outerHTML' in value) {
      return value.outerHTML;
      // This value does not have an outerHTML attribute,
      //   it could still be an XML element
    } else {
      // Attempt to serialize it
      try {
        if (document.xmlVersion) {
          var xmlSerializer = new XMLSerializer();
          return xmlSerializer.serializeToString(value);
        } else {
          // Firefox 11- do not support outerHTML
          //   It does, however, support innerHTML
          //   Use the following to render the element
          var ns = "http://www.w3.org/1999/xhtml";
          var container = document.createElementNS(ns, '_');

          container.appendChild(value.cloneNode(false));
          html = container.innerHTML
            .replace('><', '>' + value.innerHTML + '<');
          container.innerHTML = '';
          return html;
        }
      } catch (err) {
        // This could be a non-native DOM implementation,
        //   continue with the normal flow:
        //   printing the element as if it is an object.
      }
    }
  }

  // Look up the keys of the object.
  var visibleKeys = getEnumerableProperties(value);
  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;

  // Some type of object without properties can be shortcutted.
  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,
  // a `stack` plus `description` property; ignore those for consistency.
  if (keys.length === 0 || (isError(value) && (
      (keys.length === 1 && keys[0] === 'stack') ||
      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')
     ))) {
    if (typeof value === 'function') {
      var name = getName(value);
      var nameSuffix = name ? ': ' + name : '';
      return ctx.stylize('[Function' + nameSuffix + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (typeof value === 'function') {
    var name = getName(value);
    var nameSuffix = name ? ': ' + name : '';
    base = ' [Function' + nameSuffix + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    return formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      if (value === 0 && (1/value) === -Infinity) {
        return ctx.stylize('-0', 'number');
      }
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str;
  if (value.__lookupGetter__) {
    if (value.__lookupGetter__(key)) {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
  }
  if (visibleKeys.indexOf(key) < 0) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(value[key]) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, value[key], null);
      } else {
        str = formatValue(ctx, value[key], recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}

function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}

function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

},{"./getEnumerableProperties":19,"./getName":21,"./getProperties":24}],28:[function(require,module,exports){
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var inspect = require('./inspect');
var config = require('../config');

/**
 * ### .objDisplay (object)
 *
 * Determines if an object or an array matches
 * criteria to be inspected in-line for error
 * messages or should be truncated.
 *
 * @param {Mixed} javascript object to inspect
 * @name objDisplay
 * @namespace Utils
 * @api public
 */

module.exports = function (obj) {
  var str = inspect(obj)
    , type = Object.prototype.toString.call(obj);

  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type === '[object Function]') {
      return !obj.name || obj.name === ''
        ? '[Function]'
        : '[Function: ' + obj.name + ']';
    } else if (type === '[object Array]') {
      return '[ Array(' + obj.length + ') ]';
    } else if (type === '[object Object]') {
      var keys = Object.keys(obj)
        , kstr = keys.length > 2
          ? keys.splice(0, 2).join(', ') + ', ...'
          : keys.join(', ');
      return '{ Object (' + kstr + ') }';
    } else {
      return str;
    }
  } else {
    return str;
  }
};

},{"../config":8,"./inspect":27}],29:[function(require,module,exports){
/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteChainableMethod (ctx, name, method, chainingBehavior)
 *
 * Overwites an already existing chainable method
 * and provides access to the previous function or
 * property.  Must return functions to be used for
 * name.
 *
 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'length',
 *       function (_super) {
 *       }
 *     , function (_super) {
 *       }
 *     );
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.have.length(3);
 *     expect(myFoo).to.have.length.above(3);
 *
 * @param {Object} ctx object whose method / property is to be overwritten
 * @param {String} name of method / property to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @param {Function} chainingBehavior function that returns a function to be used for property
 * @namespace Utils
 * @name overwriteChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  var chainableBehavior = ctx.__methods[name];

  var _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = function () {
    var result = chainingBehavior(_chainingBehavior).call(this);
    return result === undefined ? this : result;
  };

  var _method = chainableBehavior.method;
  chainableBehavior.method = function () {
    var result = method(_method).apply(this, arguments);
    return result === undefined ? this : result;
  };
};

},{}],30:[function(require,module,exports){
/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteMethod (ctx, name, fn)
 *
 * Overwites an already existing method and provides
 * access to previous function. Must return function
 * to be used for name.
 *
 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
 *       return function (str) {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.value).to.equal(str);
 *         } else {
 *           _super.apply(this, arguments);
 *         }
 *       }
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.equal('bar');
 *
 * @param {Object} ctx object whose method is to be overwritten
 * @param {String} name of method to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @namespace Utils
 * @name overwriteMethod
 * @api public
 */

module.exports = function (ctx, name, method) {
  var _method = ctx[name]
    , _super = function () { return this; };

  if (_method && 'function' === typeof _method)
    _super = _method;

  ctx[name] = function () {
    var result = method(_super).apply(this, arguments);
    return result === undefined ? this : result;
  }
};

},{}],31:[function(require,module,exports){
/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteProperty (ctx, name, fn)
 *
 * Overwites an already existing property getter and provides
 * access to previous value. Must return function to use as getter.
 *
 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
 *       return function () {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.name).to.equal('bar');
 *         } else {
 *           _super.call(this);
 *         }
 *       }
 *     });
 *
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.ok;
 *
 * @param {Object} ctx object whose property is to be overwritten
 * @param {String} name of property to overwrite
 * @param {Function} getter function that returns a getter function to be used for name
 * @namespace Utils
 * @name overwriteProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  var _get = Object.getOwnPropertyDescriptor(ctx, name)
    , _super = function () {};

  if (_get && 'function' === typeof _get.get)
    _super = _get.get

  Object.defineProperty(ctx, name,
    { get: function () {
        var result = getter(_super).call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};

},{}],32:[function(require,module,exports){
/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = require('./flag');

/**
 * # test(object, expression)
 *
 * Test and object for expression.
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name test
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , expr = args[0];
  return negate ? !expr : expr;
};

},{"./flag":17}],33:[function(require,module,exports){
/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### transferFlags(assertion, object, includeAll = true)
 *
 * Transfer all the flags for `assertion` to `object`. If
 * `includeAll` is set to `false`, then the base Chai
 * assertion flags (namely `object`, `ssfi`, and `message`)
 * will not be transferred.
 *
 *
 *     var newAssertion = new Assertion();
 *     utils.transferFlags(assertion, newAssertion);
 *
 *     var anotherAsseriton = new Assertion(myObj);
 *     utils.transferFlags(assertion, anotherAssertion, false);
 *
 * @param {Assertion} assertion the assertion to transfer the flags from
 * @param {Object} object the object to transfer the flags to; usually a new assertion
 * @param {Boolean} includeAll
 * @namespace Utils
 * @name transferFlags
 * @api private
 */

module.exports = function (assertion, object, includeAll) {
  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

  if (!object.__flags) {
    object.__flags = Object.create(null);
  }

  includeAll = arguments.length === 3 ? includeAll : true;

  for (var flag in flags) {
    if (includeAll ||
        (flag !== 'object' && flag !== 'ssfi' && flag != 'message')) {
      object.__flags[flag] = flags[flag];
    }
  }
};

},{}],34:[function(require,module,exports){
/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */

function exclude () {
  var excludes = [].slice.call(arguments);

  function excludeProps (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
};

/*!
 * Primary Exports
 */

module.exports = AssertionError;

/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param {String} message
 * @param {Object} properties to include (optional)
 * @param {callee} start stack function (optional)
 */

function AssertionError (message, _props, ssf) {
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
    , props = extend(_props || {});

  // default values
  this.message = message || 'Unspecified AssertionError';
  this.showDiff = false;

  // copy from properties
  for (var key in props) {
    this[key] = props[key];
  }

  // capture stack trace
  ssf = ssf || arguments.callee;
  if (ssf && Error.captureStackTrace) {
    Error.captureStackTrace(this, ssf);
  } else {
    try {
      throw new Error();
    } catch(e) {
      this.stack = e.stack;
    }
  }
}

/*!
 * Inherit from Error.prototype
 */

AssertionError.prototype = Object.create(Error.prototype);

/*!
 * Statically set name
 */

AssertionError.prototype.name = 'AssertionError';

/*!
 * Ensure correct constructor
 */

AssertionError.prototype.constructor = AssertionError;

/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param {Boolean} include stack (default: `true`)
 * @return {Object} object that can be `JSON.stringify`
 */

AssertionError.prototype.toJSON = function (stack) {
  var extend = exclude('constructor', 'toJSON', 'stack')
    , props = extend({ name: this.name }, this);

  // include stack if exists and not turned off
  if (false !== stack && this.stack) {
    props.stack = this.stack;
  }

  return props;
};

},{}],35:[function(require,module,exports){
module.exports = require('./lib/eql');

},{"./lib/eql":36}],36:[function(require,module,exports){
/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var type = require('type-detect');

/*!
 * Buffer.isBuffer browser shim
 */

var Buffer;
try { Buffer = require('buffer').Buffer; }
catch(ex) {
  Buffer = {};
  Buffer.isBuffer = function() { return false; }
}

/*!
 * Primary Export
 */

module.exports = deepEqual;

/**
 * Assert super-strict (egal) equality between
 * two objects of any type.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @param {Array} memoised (optional)
 * @return {Boolean} equal match
 */

function deepEqual(a, b, m) {
  if (sameValue(a, b)) {
    return true;
  } else if ('date' === type(a)) {
    return dateEqual(a, b);
  } else if ('regexp' === type(a)) {
    return regexpEqual(a, b);
  } else if (Buffer.isBuffer(a)) {
    return bufferEqual(a, b);
  } else if ('arguments' === type(a)) {
    return argumentsEqual(a, b, m);
  } else if (!typeEqual(a, b)) {
    return false;
  } else if (('object' !== type(a) && 'object' !== type(b))
  && ('array' !== type(a) && 'array' !== type(b))) {
    return sameValue(a, b);
  } else {
    return objectEqual(a, b, m);
  }
}

/*!
 * Strict (egal) equality test. Ensures that NaN always
 * equals NaN and `-0` does not equal `+0`.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} equal match
 */

function sameValue(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  return a !== a && b !== b;
}

/*!
 * Compare the types of two given objects and
 * return if they are equal. Note that an Array
 * has a type of `array` (not `object`) and arguments
 * have a type of `arguments` (not `array`/`object`).
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function typeEqual(a, b) {
  return type(a) === type(b);
}

/*!
 * Compare two Date objects by asserting that
 * the time values are equal using `saveValue`.
 *
 * @param {Date} a
 * @param {Date} b
 * @return {Boolean} result
 */

function dateEqual(a, b) {
  if ('date' !== type(b)) return false;
  return sameValue(a.getTime(), b.getTime());
}

/*!
 * Compare two regular expressions by converting them
 * to string and checking for `sameValue`.
 *
 * @param {RegExp} a
 * @param {RegExp} b
 * @return {Boolean} result
 */

function regexpEqual(a, b) {
  if ('regexp' !== type(b)) return false;
  return sameValue(a.toString(), b.toString());
}

/*!
 * Assert deep equality of two `arguments` objects.
 * Unfortunately, these must be sliced to arrays
 * prior to test to ensure no bad behavior.
 *
 * @param {Arguments} a
 * @param {Arguments} b
 * @param {Array} memoize (optional)
 * @return {Boolean} result
 */

function argumentsEqual(a, b, m) {
  if ('arguments' !== type(b)) return false;
  a = [].slice.call(a);
  b = [].slice.call(b);
  return deepEqual(a, b, m);
}

/*!
 * Get enumerable properties of a given object.
 *
 * @param {Object} a
 * @return {Array} property names
 */

function enumerable(a) {
  var res = [];
  for (var key in a) res.push(key);
  return res;
}

/*!
 * Simple equality for flat iterable objects
 * such as Arrays or Node.js buffers.
 *
 * @param {Iterable} a
 * @param {Iterable} b
 * @return {Boolean} result
 */

function iterableEqual(a, b) {
  if (a.length !==  b.length) return false;

  var i = 0;
  var match = true;

  for (; i < a.length; i++) {
    if (a[i] !== b[i]) {
      match = false;
      break;
    }
  }

  return match;
}

/*!
 * Extension to `iterableEqual` specifically
 * for Node.js Buffers.
 *
 * @param {Buffer} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function bufferEqual(a, b) {
  if (!Buffer.isBuffer(b)) return false;
  return iterableEqual(a, b);
}

/*!
 * Block for `objectEqual` ensuring non-existing
 * values don't get in.
 *
 * @param {Mixed} object
 * @return {Boolean} result
 */

function isValue(a) {
  return a !== null && a !== undefined;
}

/*!
 * Recursively check the equality of two objects.
 * Once basic sameness has been established it will
 * defer to `deepEqual` for each enumerable key
 * in the object.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function objectEqual(a, b, m) {
  if (!isValue(a) || !isValue(b)) {
    return false;
  }

  if (a.prototype !== b.prototype) {
    return false;
  }

  var i;
  if (m) {
    for (i = 0; i < m.length; i++) {
      if ((m[i][0] === a && m[i][1] === b)
      ||  (m[i][0] === b && m[i][1] === a)) {
        return true;
      }
    }
  } else {
    m = [];
  }

  try {
    var ka = enumerable(a);
    var kb = enumerable(b);
  } catch (ex) {
    return false;
  }

  ka.sort();
  kb.sort();

  if (!iterableEqual(ka, kb)) {
    return false;
  }

  m.push([ a, b ]);

  var key;
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], m)) {
      return false;
    }
  }

  return true;
}

},{"buffer":1,"type-detect":37}],37:[function(require,module,exports){
module.exports = require('./lib/type');

},{"./lib/type":38}],38:[function(require,module,exports){
/*!
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Exports
 */

var exports = module.exports = getType;

/*!
 * Detectable javascript natives
 */

var natives = {
    '[object Array]': 'array'
  , '[object RegExp]': 'regexp'
  , '[object Function]': 'function'
  , '[object Arguments]': 'arguments'
  , '[object Date]': 'date'
};

/**
 * ### typeOf (obj)
 *
 * Use several different techniques to determine
 * the type of object being tested.
 *
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */

function getType (obj) {
  var str = Object.prototype.toString.call(obj);
  if (natives[str]) return natives[str];
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (obj === Object(obj)) return 'object';
  return typeof obj;
}

exports.Library = Library;

/**
 * ### Library
 *
 * Create a repository for custom type detection.
 *
 * ```js
 * var lib = new type.Library;
 * ```
 *
 */

function Library () {
  this.tests = {};
}

/**
 * #### .of (obj)
 *
 * Expose replacement `typeof` detection to the library.
 *
 * ```js
 * if ('string' === lib.of('hello world')) {
 *   // ...
 * }
 * ```
 *
 * @param {Mixed} object to test
 * @return {String} type
 */

Library.prototype.of = getType;

/**
 * #### .define (type, test)
 *
 * Add a test to for the `.test()` assertion.
 *
 * Can be defined as a regular expression:
 *
 * ```js
 * lib.define('int', /^[0-9]+$/);
 * ```
 *
 * ... or as a function:
 *
 * ```js
 * lib.define('bln', function (obj) {
 *   if ('boolean' === lib.of(obj)) return true;
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
 *   return !! ~blns.indexOf(obj);
 * });
 * ```
 *
 * @param {String} type
 * @param {RegExp|Function} test
 * @api public
 */

Library.prototype.define = function (type, test) {
  if (arguments.length === 1) return this.tests[type];
  this.tests[type] = test;
  return this;
};

/**
 * #### .test (obj, test)
 *
 * Assert that an object is of type. Will first
 * check natives, and if that does not pass it will
 * use the user defined custom tests.
 *
 * ```js
 * assert(lib.test('1', 'int'));
 * assert(lib.test('yes', 'bln'));
 * ```
 *
 * @param {Mixed} object
 * @param {String} type
 * @return {Boolean} result
 * @api public
 */

Library.prototype.test = function (obj, type) {
  if (type === getType(obj)) return true;
  var test = this.tests[type];

  if (test && 'regexp' === getType(test)) {
    return test.test(obj);
  } else if (test && 'function' === getType(test)) {
    return test(obj);
  } else {
    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
  }
};

},{}],39:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"./lib/type":40,"dup":37}],40:[function(require,module,exports){
/*!
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Exports
 */

var exports = module.exports = getType;

/**
 * ### typeOf (obj)
 *
 * Use several different techniques to determine
 * the type of object being tested.
 *
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */
var objectTypeRegexp = /^\[object (.*)\]$/;

function getType(obj) {
  var type = Object.prototype.toString.call(obj).match(objectTypeRegexp)[1].toLowerCase();
  // Let "new String('')" return 'object'
  if (typeof Promise === 'function' && obj instanceof Promise) return 'promise';
  // PhantomJS has type "DOMWindow" for null
  if (obj === null) return 'null';
  // PhantomJS has type "DOMWindow" for undefined
  if (obj === undefined) return 'undefined';
  return type;
}

exports.Library = Library;

/**
 * ### Library
 *
 * Create a repository for custom type detection.
 *
 * ```js
 * var lib = new type.Library;
 * ```
 *
 */

function Library() {
  if (!(this instanceof Library)) return new Library();
  this.tests = {};
}

/**
 * #### .of (obj)
 *
 * Expose replacement `typeof` detection to the library.
 *
 * ```js
 * if ('string' === lib.of('hello world')) {
 *   // ...
 * }
 * ```
 *
 * @param {Mixed} object to test
 * @return {String} type
 */

Library.prototype.of = getType;

/**
 * #### .define (type, test)
 *
 * Add a test to for the `.test()` assertion.
 *
 * Can be defined as a regular expression:
 *
 * ```js
 * lib.define('int', /^[0-9]+$/);
 * ```
 *
 * ... or as a function:
 *
 * ```js
 * lib.define('bln', function (obj) {
 *   if ('boolean' === lib.of(obj)) return true;
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
 *   return !! ~blns.indexOf(obj);
 * });
 * ```
 *
 * @param {String} type
 * @param {RegExp|Function} test
 * @api public
 */

Library.prototype.define = function(type, test) {
  if (arguments.length === 1) return this.tests[type];
  this.tests[type] = test;
  return this;
};

/**
 * #### .test (obj, test)
 *
 * Assert that an object is of type. Will first
 * check natives, and if that does not pass it will
 * use the user defined custom tests.
 *
 * ```js
 * assert(lib.test('1', 'int'));
 * assert(lib.test('yes', 'bln'));
 * ```
 *
 * @param {Mixed} object
 * @param {String} type
 * @return {Boolean} result
 * @api public
 */

Library.prototype.test = function(obj, type) {
  if (type === getType(obj)) return true;
  var test = this.tests[type];

  if (test && 'regexp' === getType(test)) {
    return test.test(obj);
  } else if (test && 'function' === getType(test)) {
    return test(obj);
  } else {
    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
  }
};

},{}],41:[function(require,module,exports){
"use strict";
var __cov_0q_cZiLgq0kxGbW3gkWuxA = (Function('return this'))();
if (!__cov_0q_cZiLgq0kxGbW3gkWuxA.__coverage__) { __cov_0q_cZiLgq0kxGbW3gkWuxA.__coverage__ = {}; }
__cov_0q_cZiLgq0kxGbW3gkWuxA = __cov_0q_cZiLgq0kxGbW3gkWuxA.__coverage__;
if (!(__cov_0q_cZiLgq0kxGbW3gkWuxA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Attribute.ts'])) {
   __cov_0q_cZiLgq0kxGbW3gkWuxA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Attribute.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Attribute.ts","s":{"1":0,"2":0,"3":1,"4":0,"5":0,"6":0,"7":0},"b":{},"f":{"1":0,"2":0},"fnMap":{"1":{"name":"(anonymous_1)","line":3,"loc":{"start":{"line":3,"column":17},"end":{"line":3,"column":29}}},"2":{"name":"Attribute","line":4,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":25}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":7,"column":5}},"3":{"start":{"line":4,"column":4},"end":{"line":5,"column":5}},"4":{"start":{"line":6,"column":4},"end":{"line":6,"column":21}},"5":{"start":{"line":8,"column":0},"end":{"line":8,"column":43}},"6":{"start":{"line":9,"column":0},"end":{"line":9,"column":26}},"7":{"start":{"line":10,"column":0},"end":{"line":10,"column":31}}},"branchMap":{}};
}
__cov_0q_cZiLgq0kxGbW3gkWuxA = __cov_0q_cZiLgq0kxGbW3gkWuxA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Attribute.ts'];
__cov_0q_cZiLgq0kxGbW3gkWuxA.s['1']++;exports.__esModule=true;__cov_0q_cZiLgq0kxGbW3gkWuxA.s['2']++;var Attribute=function(){__cov_0q_cZiLgq0kxGbW3gkWuxA.f['1']++;function Attribute(){__cov_0q_cZiLgq0kxGbW3gkWuxA.f['2']++;}__cov_0q_cZiLgq0kxGbW3gkWuxA.s['4']++;return Attribute;}();__cov_0q_cZiLgq0kxGbW3gkWuxA.s['5']++;Attribute.QUALIFIER_PROPERTY='qualifier';__cov_0q_cZiLgq0kxGbW3gkWuxA.s['6']++;Attribute.VALUE='value';__cov_0q_cZiLgq0kxGbW3gkWuxA.s['7']++;exports['default']=Attribute;

},{}],42:[function(require,module,exports){
"use strict";
var __cov_n2M0rD7lWAHhFgU0c1Yyvw = (Function('return this'))();
if (!__cov_n2M0rD7lWAHhFgU0c1Yyvw.__coverage__) { __cov_n2M0rD7lWAHhFgU0c1Yyvw.__coverage__ = {}; }
__cov_n2M0rD7lWAHhFgU0c1Yyvw = __cov_n2M0rD7lWAHhFgU0c1Yyvw.__coverage__;
if (!(__cov_n2M0rD7lWAHhFgU0c1Yyvw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeCreatedNotification.ts'])) {
   __cov_n2M0rD7lWAHhFgU0c1Yyvw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeCreatedNotification.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeCreatedNotification.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":36},"end":{"line":14,"column":54}}},"7":{"name":"AttributeCreatedNotification","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":96}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":28,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":52}},"16":{"start":{"line":16,"column":4},"end":{"line":26,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":26}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":40}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":42}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":34}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":36}},"23":{"start":{"line":23,"column":8},"end":{"line":23,"column":38}},"24":{"start":{"line":24,"column":8},"end":{"line":24,"column":83}},"25":{"start":{"line":25,"column":8},"end":{"line":25,"column":21}},"26":{"start":{"line":27,"column":4},"end":{"line":27,"column":40}},"27":{"start":{"line":29,"column":0},"end":{"line":29,"column":50}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_n2M0rD7lWAHhFgU0c1Yyvw = __cov_n2M0rD7lWAHhFgU0c1Yyvw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeCreatedNotification.ts'];
__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['1']++;var __extends=(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['1'][0]++,this)&&(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['1'][1]++,this.__extends)||(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['1'][2]++,function(){__cov_n2M0rD7lWAHhFgU0c1Yyvw.f['1']++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['2']++;var extendStatics=(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['2'][0]++,Object.setPrototypeOf)||(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['2'][2]++,function(d,b){__cov_n2M0rD7lWAHhFgU0c1Yyvw.f['2']++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['3']++;d.__proto__=b;})||(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['2'][3]++,function(d,b){__cov_n2M0rD7lWAHhFgU0c1Yyvw.f['3']++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['4']++;for(var p in b){__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['5']++;if(b.hasOwnProperty(p)){__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['3'][0]++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['6']++;d[p]=b[p];}else{__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['3'][1]++;}}});__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['7']++;return function(d,b){__cov_n2M0rD7lWAHhFgU0c1Yyvw.f['4']++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['8']++;extendStatics(d,b);function __(){__cov_n2M0rD7lWAHhFgU0c1Yyvw.f['5']++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['10']++;this.constructor=d;}__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['11']++;d.prototype=b===null?(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['4'][0]++,Object.create(b)):(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['12']++;exports.__esModule=true;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['13']++;var Command_1=require('./Command');__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['14']++;var AttributeCreatedNotification=function(_super){__cov_n2M0rD7lWAHhFgU0c1Yyvw.f['6']++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['15']++;__extends(AttributeCreatedNotification,_super);function AttributeCreatedNotification(pmId,attributeId,propertyName,newValue,qualifier){__cov_n2M0rD7lWAHhFgU0c1Yyvw.f['7']++;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['17']++;var _this=(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['5'][0]++,_super.call(this))||(__cov_n2M0rD7lWAHhFgU0c1Yyvw.b['5'][1]++,this);__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['18']++;_this.pmId=pmId;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['19']++;_this.attributeId=attributeId;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['20']++;_this.propertyName=propertyName;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['21']++;_this.newValue=newValue;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['22']++;_this.qualifier=qualifier;__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['23']++;_this.id='AttributeCreated';__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['24']++;_this.className='org.opendolphin.core.comm.AttributeCreatedNotification';__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['25']++;return _this;}__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['26']++;return AttributeCreatedNotification;}(Command_1['default']);__cov_n2M0rD7lWAHhFgU0c1Yyvw.s['27']++;exports['default']=AttributeCreatedNotification;

},{"./Command":52}],43:[function(require,module,exports){
"use strict";
var __cov_kFUIuHuOky$fF6vJyzb8ZA = (Function('return this'))();
if (!__cov_kFUIuHuOky$fF6vJyzb8ZA.__coverage__) { __cov_kFUIuHuOky$fF6vJyzb8ZA.__coverage__ = {}; }
__cov_kFUIuHuOky$fF6vJyzb8ZA = __cov_kFUIuHuOky$fF6vJyzb8ZA.__coverage__;
if (!(__cov_kFUIuHuOky$fF6vJyzb8ZA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeMetadataChangedCommand.ts'])) {
   __cov_kFUIuHuOky$fF6vJyzb8ZA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeMetadataChangedCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeMetadataChangedCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":39},"end":{"line":14,"column":57}}},"7":{"name":"AttributeMetadataChangedCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":79}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":26,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":55}},"16":{"start":{"line":16,"column":4},"end":{"line":24,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":40}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":42}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":28}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":46}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":86}},"23":{"start":{"line":23,"column":8},"end":{"line":23,"column":21}},"24":{"start":{"line":25,"column":4},"end":{"line":25,"column":43}},"25":{"start":{"line":27,"column":0},"end":{"line":27,"column":53}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_kFUIuHuOky$fF6vJyzb8ZA = __cov_kFUIuHuOky$fF6vJyzb8ZA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/AttributeMetadataChangedCommand.ts'];
__cov_kFUIuHuOky$fF6vJyzb8ZA.s['1']++;var __extends=(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['1'][0]++,this)&&(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['1'][1]++,this.__extends)||(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['1'][2]++,function(){__cov_kFUIuHuOky$fF6vJyzb8ZA.f['1']++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['2']++;var extendStatics=(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['2'][0]++,Object.setPrototypeOf)||(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['2'][2]++,function(d,b){__cov_kFUIuHuOky$fF6vJyzb8ZA.f['2']++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['3']++;d.__proto__=b;})||(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['2'][3]++,function(d,b){__cov_kFUIuHuOky$fF6vJyzb8ZA.f['3']++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['4']++;for(var p in b){__cov_kFUIuHuOky$fF6vJyzb8ZA.s['5']++;if(b.hasOwnProperty(p)){__cov_kFUIuHuOky$fF6vJyzb8ZA.b['3'][0]++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['6']++;d[p]=b[p];}else{__cov_kFUIuHuOky$fF6vJyzb8ZA.b['3'][1]++;}}});__cov_kFUIuHuOky$fF6vJyzb8ZA.s['7']++;return function(d,b){__cov_kFUIuHuOky$fF6vJyzb8ZA.f['4']++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['8']++;extendStatics(d,b);function __(){__cov_kFUIuHuOky$fF6vJyzb8ZA.f['5']++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['10']++;this.constructor=d;}__cov_kFUIuHuOky$fF6vJyzb8ZA.s['11']++;d.prototype=b===null?(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['4'][0]++,Object.create(b)):(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_kFUIuHuOky$fF6vJyzb8ZA.s['12']++;exports.__esModule=true;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['13']++;var Command_1=require('./Command');__cov_kFUIuHuOky$fF6vJyzb8ZA.s['14']++;var AttributeMetadataChangedCommand=function(_super){__cov_kFUIuHuOky$fF6vJyzb8ZA.f['6']++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['15']++;__extends(AttributeMetadataChangedCommand,_super);function AttributeMetadataChangedCommand(attributeId,metadataName,value){__cov_kFUIuHuOky$fF6vJyzb8ZA.f['7']++;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['17']++;var _this=(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['5'][0]++,_super.call(this))||(__cov_kFUIuHuOky$fF6vJyzb8ZA.b['5'][1]++,this);__cov_kFUIuHuOky$fF6vJyzb8ZA.s['18']++;_this.attributeId=attributeId;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['19']++;_this.metadataName=metadataName;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['20']++;_this.value=value;__cov_kFUIuHuOky$fF6vJyzb8ZA.s['21']++;_this.id='AttributeMetadataChanged';__cov_kFUIuHuOky$fF6vJyzb8ZA.s['22']++;_this.className='org.opendolphin.core.comm.AttributeMetadataChangedCommand';__cov_kFUIuHuOky$fF6vJyzb8ZA.s['23']++;return _this;}__cov_kFUIuHuOky$fF6vJyzb8ZA.s['24']++;return AttributeMetadataChangedCommand;}(Command_1['default']);__cov_kFUIuHuOky$fF6vJyzb8ZA.s['25']++;exports['default']=AttributeMetadataChangedCommand;

},{"./Command":52}],44:[function(require,module,exports){
"use strict";
var __cov_AaVz7HKwkE2KPAGhUucb4Q = (Function('return this'))();
if (!__cov_AaVz7HKwkE2KPAGhUucb4Q.__coverage__) { __cov_AaVz7HKwkE2KPAGhUucb4Q.__coverage__ = {}; }
__cov_AaVz7HKwkE2KPAGhUucb4Q = __cov_AaVz7HKwkE2KPAGhUucb4Q.__coverage__;
if (!(__cov_AaVz7HKwkE2KPAGhUucb4Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CallNamedActionCommand.ts'])) {
   __cov_AaVz7HKwkE2KPAGhUucb4Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CallNamedActionCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CallNamedActionCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":30},"end":{"line":14,"column":48}}},"7":{"name":"CallNamedActionCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":48}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":24,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":46}},"16":{"start":{"line":16,"column":4},"end":{"line":22,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":38}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":37}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":77}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":21}},"22":{"start":{"line":23,"column":4},"end":{"line":23,"column":34}},"23":{"start":{"line":25,"column":0},"end":{"line":25,"column":44}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_AaVz7HKwkE2KPAGhUucb4Q = __cov_AaVz7HKwkE2KPAGhUucb4Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CallNamedActionCommand.ts'];
__cov_AaVz7HKwkE2KPAGhUucb4Q.s['1']++;var __extends=(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['1'][0]++,this)&&(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['1'][1]++,this.__extends)||(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['1'][2]++,function(){__cov_AaVz7HKwkE2KPAGhUucb4Q.f['1']++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['2']++;var extendStatics=(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['2'][0]++,Object.setPrototypeOf)||(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['2'][2]++,function(d,b){__cov_AaVz7HKwkE2KPAGhUucb4Q.f['2']++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['3']++;d.__proto__=b;})||(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['2'][3]++,function(d,b){__cov_AaVz7HKwkE2KPAGhUucb4Q.f['3']++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['4']++;for(var p in b){__cov_AaVz7HKwkE2KPAGhUucb4Q.s['5']++;if(b.hasOwnProperty(p)){__cov_AaVz7HKwkE2KPAGhUucb4Q.b['3'][0]++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['6']++;d[p]=b[p];}else{__cov_AaVz7HKwkE2KPAGhUucb4Q.b['3'][1]++;}}});__cov_AaVz7HKwkE2KPAGhUucb4Q.s['7']++;return function(d,b){__cov_AaVz7HKwkE2KPAGhUucb4Q.f['4']++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['8']++;extendStatics(d,b);function __(){__cov_AaVz7HKwkE2KPAGhUucb4Q.f['5']++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['10']++;this.constructor=d;}__cov_AaVz7HKwkE2KPAGhUucb4Q.s['11']++;d.prototype=b===null?(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['4'][0]++,Object.create(b)):(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_AaVz7HKwkE2KPAGhUucb4Q.s['12']++;exports.__esModule=true;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['13']++;var Command_1=require('./Command');__cov_AaVz7HKwkE2KPAGhUucb4Q.s['14']++;var CallNamedActionCommand=function(_super){__cov_AaVz7HKwkE2KPAGhUucb4Q.f['6']++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['15']++;__extends(CallNamedActionCommand,_super);function CallNamedActionCommand(actionName){__cov_AaVz7HKwkE2KPAGhUucb4Q.f['7']++;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['17']++;var _this=(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['5'][0]++,_super.call(this))||(__cov_AaVz7HKwkE2KPAGhUucb4Q.b['5'][1]++,this);__cov_AaVz7HKwkE2KPAGhUucb4Q.s['18']++;_this.actionName=actionName;__cov_AaVz7HKwkE2KPAGhUucb4Q.s['19']++;_this.id='CallNamedAction';__cov_AaVz7HKwkE2KPAGhUucb4Q.s['20']++;_this.className='org.opendolphin.core.comm.CallNamedActionCommand';__cov_AaVz7HKwkE2KPAGhUucb4Q.s['21']++;return _this;}__cov_AaVz7HKwkE2KPAGhUucb4Q.s['22']++;return CallNamedActionCommand;}(Command_1['default']);__cov_AaVz7HKwkE2KPAGhUucb4Q.s['23']++;exports['default']=CallNamedActionCommand;

},{"./Command":52}],45:[function(require,module,exports){
"use strict";
var __cov_MBv39ygfyujvs5eJpY9wRQ = (Function('return this'))();
if (!__cov_MBv39ygfyujvs5eJpY9wRQ.__coverage__) { __cov_MBv39ygfyujvs5eJpY9wRQ.__coverage__ = {}; }
__cov_MBv39ygfyujvs5eJpY9wRQ = __cov_MBv39ygfyujvs5eJpY9wRQ.__coverage__;
if (!(__cov_MBv39ygfyujvs5eJpY9wRQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ChangeAttributeMetadataCommand.ts'])) {
   __cov_MBv39ygfyujvs5eJpY9wRQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ChangeAttributeMetadataCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ChangeAttributeMetadataCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":38},"end":{"line":14,"column":56}}},"7":{"name":"ChangeAttributeMetadataCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":78}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":26,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":54}},"16":{"start":{"line":16,"column":4},"end":{"line":24,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":40}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":42}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":28}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":45}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":85}},"23":{"start":{"line":23,"column":8},"end":{"line":23,"column":21}},"24":{"start":{"line":25,"column":4},"end":{"line":25,"column":42}},"25":{"start":{"line":27,"column":0},"end":{"line":27,"column":52}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_MBv39ygfyujvs5eJpY9wRQ = __cov_MBv39ygfyujvs5eJpY9wRQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ChangeAttributeMetadataCommand.ts'];
__cov_MBv39ygfyujvs5eJpY9wRQ.s['1']++;var __extends=(__cov_MBv39ygfyujvs5eJpY9wRQ.b['1'][0]++,this)&&(__cov_MBv39ygfyujvs5eJpY9wRQ.b['1'][1]++,this.__extends)||(__cov_MBv39ygfyujvs5eJpY9wRQ.b['1'][2]++,function(){__cov_MBv39ygfyujvs5eJpY9wRQ.f['1']++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['2']++;var extendStatics=(__cov_MBv39ygfyujvs5eJpY9wRQ.b['2'][0]++,Object.setPrototypeOf)||(__cov_MBv39ygfyujvs5eJpY9wRQ.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_MBv39ygfyujvs5eJpY9wRQ.b['2'][2]++,function(d,b){__cov_MBv39ygfyujvs5eJpY9wRQ.f['2']++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['3']++;d.__proto__=b;})||(__cov_MBv39ygfyujvs5eJpY9wRQ.b['2'][3]++,function(d,b){__cov_MBv39ygfyujvs5eJpY9wRQ.f['3']++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['4']++;for(var p in b){__cov_MBv39ygfyujvs5eJpY9wRQ.s['5']++;if(b.hasOwnProperty(p)){__cov_MBv39ygfyujvs5eJpY9wRQ.b['3'][0]++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['6']++;d[p]=b[p];}else{__cov_MBv39ygfyujvs5eJpY9wRQ.b['3'][1]++;}}});__cov_MBv39ygfyujvs5eJpY9wRQ.s['7']++;return function(d,b){__cov_MBv39ygfyujvs5eJpY9wRQ.f['4']++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['8']++;extendStatics(d,b);function __(){__cov_MBv39ygfyujvs5eJpY9wRQ.f['5']++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['10']++;this.constructor=d;}__cov_MBv39ygfyujvs5eJpY9wRQ.s['11']++;d.prototype=b===null?(__cov_MBv39ygfyujvs5eJpY9wRQ.b['4'][0]++,Object.create(b)):(__cov_MBv39ygfyujvs5eJpY9wRQ.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_MBv39ygfyujvs5eJpY9wRQ.s['12']++;exports.__esModule=true;__cov_MBv39ygfyujvs5eJpY9wRQ.s['13']++;var Command_1=require('./Command');__cov_MBv39ygfyujvs5eJpY9wRQ.s['14']++;var ChangeAttributeMetadataCommand=function(_super){__cov_MBv39ygfyujvs5eJpY9wRQ.f['6']++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['15']++;__extends(ChangeAttributeMetadataCommand,_super);function ChangeAttributeMetadataCommand(attributeId,metadataName,value){__cov_MBv39ygfyujvs5eJpY9wRQ.f['7']++;__cov_MBv39ygfyujvs5eJpY9wRQ.s['17']++;var _this=(__cov_MBv39ygfyujvs5eJpY9wRQ.b['5'][0]++,_super.call(this))||(__cov_MBv39ygfyujvs5eJpY9wRQ.b['5'][1]++,this);__cov_MBv39ygfyujvs5eJpY9wRQ.s['18']++;_this.attributeId=attributeId;__cov_MBv39ygfyujvs5eJpY9wRQ.s['19']++;_this.metadataName=metadataName;__cov_MBv39ygfyujvs5eJpY9wRQ.s['20']++;_this.value=value;__cov_MBv39ygfyujvs5eJpY9wRQ.s['21']++;_this.id='ChangeAttributeMetadata';__cov_MBv39ygfyujvs5eJpY9wRQ.s['22']++;_this.className='org.opendolphin.core.comm.ChangeAttributeMetadataCommand';__cov_MBv39ygfyujvs5eJpY9wRQ.s['23']++;return _this;}__cov_MBv39ygfyujvs5eJpY9wRQ.s['24']++;return ChangeAttributeMetadataCommand;}(Command_1['default']);__cov_MBv39ygfyujvs5eJpY9wRQ.s['25']++;exports['default']=ChangeAttributeMetadataCommand;

},{"./Command":52}],46:[function(require,module,exports){
"use strict";
var __cov_A_0RP5n2OzxLXfMABzPTRA = (Function('return this'))();
if (!__cov_A_0RP5n2OzxLXfMABzPTRA.__coverage__) { __cov_A_0RP5n2OzxLXfMABzPTRA.__coverage__ = {}; }
__cov_A_0RP5n2OzxLXfMABzPTRA = __cov_A_0RP5n2OzxLXfMABzPTRA.__coverage__;
if (!(__cov_A_0RP5n2OzxLXfMABzPTRA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientAttribute.ts'])) {
   __cov_A_0RP5n2OzxLXfMABzPTRA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientAttribute.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientAttribute.ts","s":{"1":0,"2":0,"3":0,"4":1,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0],"12":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0},"fnMap":{"1":{"name":"(anonymous_1)","line":4,"loc":{"start":{"line":4,"column":23},"end":{"line":4,"column":35}}},"2":{"name":"ClientAttribute","line":5,"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":61}}},"3":{"name":"(anonymous_3)","line":14,"loc":{"start":{"line":14,"column":37},"end":{"line":14,"column":49}}},"4":{"name":"(anonymous_4)","line":18,"loc":{"start":{"line":18,"column":53},"end":{"line":18,"column":82}}},"5":{"name":"(anonymous_5)","line":24,"loc":{"start":{"line":24,"column":53},"end":{"line":24,"column":65}}},"6":{"name":"(anonymous_6)","line":27,"loc":{"start":{"line":27,"column":41},"end":{"line":27,"column":53}}},"7":{"name":"(anonymous_7)","line":30,"loc":{"start":{"line":30,"column":41},"end":{"line":30,"column":61}}},"8":{"name":"(anonymous_8)","line":38,"loc":{"start":{"line":38,"column":45},"end":{"line":38,"column":69}}},"9":{"name":"(anonymous_9)","line":45,"loc":{"start":{"line":45,"column":45},"end":{"line":45,"column":57}}},"10":{"name":"(anonymous_10)","line":48,"loc":{"start":{"line":48,"column":33},"end":{"line":48,"column":50}}},"11":{"name":"(anonymous_11)","line":69,"loc":{"start":{"line":69,"column":46},"end":{"line":69,"column":70}}},"12":{"name":"(anonymous_12)","line":73,"loc":{"start":{"line":73,"column":50},"end":{"line":73,"column":74}}},"13":{"name":"(anonymous_13)","line":76,"loc":{"start":{"line":76,"column":41},"end":{"line":76,"column":68}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":39}},"3":{"start":{"line":4,"column":0},"end":{"line":84,"column":5}},"4":{"start":{"line":5,"column":4},"end":{"line":12,"column":5}},"5":{"start":{"line":6,"column":8},"end":{"line":6,"column":41}},"6":{"start":{"line":7,"column":8},"end":{"line":7,"column":78}},"7":{"start":{"line":8,"column":8},"end":{"line":8,"column":58}},"8":{"start":{"line":9,"column":8},"end":{"line":9,"column":62}},"9":{"start":{"line":10,"column":8},"end":{"line":10,"column":29}},"10":{"start":{"line":11,"column":8},"end":{"line":11,"column":37}},"11":{"start":{"line":14,"column":4},"end":{"line":17,"column":6}},"12":{"start":{"line":15,"column":8},"end":{"line":15,"column":98}},"13":{"start":{"line":16,"column":8},"end":{"line":16,"column":22}},"14":{"start":{"line":18,"column":4},"end":{"line":23,"column":6}},"15":{"start":{"line":19,"column":8},"end":{"line":21,"column":9}},"16":{"start":{"line":20,"column":12},"end":{"line":20,"column":98}},"17":{"start":{"line":22,"column":8},"end":{"line":22,"column":51}},"18":{"start":{"line":24,"column":4},"end":{"line":26,"column":6}},"19":{"start":{"line":25,"column":8},"end":{"line":25,"column":38}},"20":{"start":{"line":27,"column":4},"end":{"line":29,"column":6}},"21":{"start":{"line":28,"column":8},"end":{"line":28,"column":26}},"22":{"start":{"line":30,"column":4},"end":{"line":37,"column":6}},"23":{"start":{"line":31,"column":8},"end":{"line":31,"column":65}},"24":{"start":{"line":32,"column":8},"end":{"line":33,"column":19}},"25":{"start":{"line":33,"column":12},"end":{"line":33,"column":19}},"26":{"start":{"line":34,"column":8},"end":{"line":34,"column":34}},"27":{"start":{"line":35,"column":8},"end":{"line":35,"column":35}},"28":{"start":{"line":36,"column":8},"end":{"line":36,"column":89}},"29":{"start":{"line":38,"column":4},"end":{"line":44,"column":6}},"30":{"start":{"line":39,"column":8},"end":{"line":40,"column":19}},"31":{"start":{"line":40,"column":12},"end":{"line":40,"column":19}},"32":{"start":{"line":41,"column":8},"end":{"line":41,"column":42}},"33":{"start":{"line":42,"column":8},"end":{"line":42,"column":38}},"34":{"start":{"line":43,"column":8},"end":{"line":43,"column":96}},"35":{"start":{"line":45,"column":4},"end":{"line":47,"column":6}},"36":{"start":{"line":46,"column":8},"end":{"line":46,"column":30}},"37":{"start":{"line":48,"column":4},"end":{"line":68,"column":6}},"38":{"start":{"line":49,"column":8},"end":{"line":51,"column":9}},"39":{"start":{"line":50,"column":12},"end":{"line":50,"column":24}},"40":{"start":{"line":52,"column":8},"end":{"line":52,"column":27}},"41":{"start":{"line":53,"column":8},"end":{"line":55,"column":9}},"42":{"start":{"line":54,"column":12},"end":{"line":54,"column":37}},"43":{"start":{"line":56,"column":8},"end":{"line":59,"column":9}},"44":{"start":{"line":57,"column":12},"end":{"line":57,"column":123}},"45":{"start":{"line":58,"column":12},"end":{"line":58,"column":50}},"46":{"start":{"line":60,"column":8},"end":{"line":60,"column":23}},"47":{"start":{"line":61,"column":8},"end":{"line":63,"column":9}},"48":{"start":{"line":62,"column":12},"end":{"line":62,"column":22}},"49":{"start":{"line":64,"column":8},"end":{"line":66,"column":9}},"50":{"start":{"line":65,"column":12},"end":{"line":65,"column":94}},"51":{"start":{"line":67,"column":8},"end":{"line":67,"column":22}},"52":{"start":{"line":69,"column":4},"end":{"line":72,"column":6}},"53":{"start":{"line":70,"column":8},"end":{"line":70,"column":50}},"54":{"start":{"line":71,"column":8},"end":{"line":71,"column":73}},"55":{"start":{"line":73,"column":4},"end":{"line":75,"column":6}},"56":{"start":{"line":74,"column":8},"end":{"line":74,"column":54}},"57":{"start":{"line":76,"column":4},"end":{"line":82,"column":6}},"58":{"start":{"line":77,"column":8},"end":{"line":81,"column":9}},"59":{"start":{"line":78,"column":12},"end":{"line":78,"column":62}},"60":{"start":{"line":79,"column":12},"end":{"line":79,"column":49}},"61":{"start":{"line":83,"column":4},"end":{"line":83,"column":27}},"62":{"start":{"line":85,"column":0},"end":{"line":85,"column":72}},"63":{"start":{"line":86,"column":0},"end":{"line":86,"column":49}},"64":{"start":{"line":87,"column":0},"end":{"line":87,"column":42}}},"branchMap":{"1":{"line":19,"type":"if","locations":[{"start":{"line":19,"column":8},"end":{"line":19,"column":8}},{"start":{"line":19,"column":8},"end":{"line":19,"column":8}}]},"2":{"line":32,"type":"if","locations":[{"start":{"line":32,"column":8},"end":{"line":32,"column":8}},{"start":{"line":32,"column":8},"end":{"line":32,"column":8}}]},"3":{"line":39,"type":"if","locations":[{"start":{"line":39,"column":8},"end":{"line":39,"column":8}},{"start":{"line":39,"column":8},"end":{"line":39,"column":8}}]},"4":{"line":49,"type":"if","locations":[{"start":{"line":49,"column":8},"end":{"line":49,"column":8}},{"start":{"line":49,"column":8},"end":{"line":49,"column":8}}]},"5":{"line":49,"type":"binary-expr","locations":[{"start":{"line":49,"column":12},"end":{"line":49,"column":25}},{"start":{"line":49,"column":29},"end":{"line":49,"column":47}}]},"6":{"line":53,"type":"if","locations":[{"start":{"line":53,"column":8},"end":{"line":53,"column":8}},{"start":{"line":53,"column":8},"end":{"line":53,"column":8}}]},"7":{"line":53,"type":"binary-expr","locations":[{"start":{"line":53,"column":12},"end":{"line":53,"column":36}},{"start":{"line":53,"column":40},"end":{"line":53,"column":65}},{"start":{"line":53,"column":69},"end":{"line":53,"column":93}}]},"8":{"line":56,"type":"if","locations":[{"start":{"line":56,"column":8},"end":{"line":56,"column":8}},{"start":{"line":56,"column":8},"end":{"line":56,"column":8}}]},"9":{"line":61,"type":"if","locations":[{"start":{"line":61,"column":8},"end":{"line":61,"column":8}},{"start":{"line":61,"column":8},"end":{"line":61,"column":8}}]},"10":{"line":61,"type":"binary-expr","locations":[{"start":{"line":61,"column":12},"end":{"line":61,"column":66}},{"start":{"line":61,"column":70},"end":{"line":61,"column":92}}]},"11":{"line":64,"type":"if","locations":[{"start":{"line":64,"column":8},"end":{"line":64,"column":8}},{"start":{"line":64,"column":8},"end":{"line":64,"column":8}}]},"12":{"line":77,"type":"if","locations":[{"start":{"line":77,"column":8},"end":{"line":77,"column":8}},{"start":{"line":77,"column":8},"end":{"line":77,"column":8}}]}}};
}
__cov_A_0RP5n2OzxLXfMABzPTRA = __cov_A_0RP5n2OzxLXfMABzPTRA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientAttribute.ts'];
__cov_A_0RP5n2OzxLXfMABzPTRA.s['1']++;exports.__esModule=true;__cov_A_0RP5n2OzxLXfMABzPTRA.s['2']++;var EventBus_1=require('./EventBus');__cov_A_0RP5n2OzxLXfMABzPTRA.s['3']++;var ClientAttribute=function(){__cov_A_0RP5n2OzxLXfMABzPTRA.f['1']++;function ClientAttribute(propertyName,qualifier,value){__cov_A_0RP5n2OzxLXfMABzPTRA.f['2']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['5']++;this.propertyName=propertyName;__cov_A_0RP5n2OzxLXfMABzPTRA.s['6']++;this.id=''+ClientAttribute.clientAttributeInstanceCount++ +'C';__cov_A_0RP5n2OzxLXfMABzPTRA.s['7']++;this.valueChangeBus=new EventBus_1['default']();__cov_A_0RP5n2OzxLXfMABzPTRA.s['8']++;this.qualifierChangeBus=new EventBus_1['default']();__cov_A_0RP5n2OzxLXfMABzPTRA.s['9']++;this.setValue(value);__cov_A_0RP5n2OzxLXfMABzPTRA.s['10']++;this.setQualifier(qualifier);}__cov_A_0RP5n2OzxLXfMABzPTRA.s['11']++;ClientAttribute.prototype.copy=function(){__cov_A_0RP5n2OzxLXfMABzPTRA.f['3']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['12']++;var result=new ClientAttribute(this.propertyName,this.getQualifier(),this.getValue());__cov_A_0RP5n2OzxLXfMABzPTRA.s['13']++;return result;};__cov_A_0RP5n2OzxLXfMABzPTRA.s['14']++;ClientAttribute.prototype.setPresentationModel=function(presentationModel){__cov_A_0RP5n2OzxLXfMABzPTRA.f['4']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['15']++;if(this.presentationModel){__cov_A_0RP5n2OzxLXfMABzPTRA.b['1'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['16']++;alert('You can not set a presentation model for an attribute that is already bound.');}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['1'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['17']++;this.presentationModel=presentationModel;};__cov_A_0RP5n2OzxLXfMABzPTRA.s['18']++;ClientAttribute.prototype.getPresentationModel=function(){__cov_A_0RP5n2OzxLXfMABzPTRA.f['5']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['19']++;return this.presentationModel;};__cov_A_0RP5n2OzxLXfMABzPTRA.s['20']++;ClientAttribute.prototype.getValue=function(){__cov_A_0RP5n2OzxLXfMABzPTRA.f['6']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['21']++;return this.value;};__cov_A_0RP5n2OzxLXfMABzPTRA.s['22']++;ClientAttribute.prototype.setValue=function(newValue){__cov_A_0RP5n2OzxLXfMABzPTRA.f['7']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['23']++;var verifiedValue=ClientAttribute.checkValue(newValue);__cov_A_0RP5n2OzxLXfMABzPTRA.s['24']++;if(this.value==verifiedValue){__cov_A_0RP5n2OzxLXfMABzPTRA.b['2'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['25']++;return;}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['2'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['26']++;var oldValue=this.value;__cov_A_0RP5n2OzxLXfMABzPTRA.s['27']++;this.value=verifiedValue;__cov_A_0RP5n2OzxLXfMABzPTRA.s['28']++;this.valueChangeBus.trigger({'oldValue':oldValue,'newValue':verifiedValue});};__cov_A_0RP5n2OzxLXfMABzPTRA.s['29']++;ClientAttribute.prototype.setQualifier=function(newQualifier){__cov_A_0RP5n2OzxLXfMABzPTRA.f['8']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['30']++;if(this.qualifier==newQualifier){__cov_A_0RP5n2OzxLXfMABzPTRA.b['3'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['31']++;return;}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['3'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['32']++;var oldQualifier=this.qualifier;__cov_A_0RP5n2OzxLXfMABzPTRA.s['33']++;this.qualifier=newQualifier;__cov_A_0RP5n2OzxLXfMABzPTRA.s['34']++;this.qualifierChangeBus.trigger({'oldValue':oldQualifier,'newValue':newQualifier});};__cov_A_0RP5n2OzxLXfMABzPTRA.s['35']++;ClientAttribute.prototype.getQualifier=function(){__cov_A_0RP5n2OzxLXfMABzPTRA.f['9']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['36']++;return this.qualifier;};__cov_A_0RP5n2OzxLXfMABzPTRA.s['37']++;ClientAttribute.checkValue=function(value){__cov_A_0RP5n2OzxLXfMABzPTRA.f['10']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['38']++;if((__cov_A_0RP5n2OzxLXfMABzPTRA.b['5'][0]++,value==null)||(__cov_A_0RP5n2OzxLXfMABzPTRA.b['5'][1]++,value==undefined)){__cov_A_0RP5n2OzxLXfMABzPTRA.b['4'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['39']++;return null;}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['4'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['40']++;var result=value;__cov_A_0RP5n2OzxLXfMABzPTRA.s['41']++;if((__cov_A_0RP5n2OzxLXfMABzPTRA.b['7'][0]++,result instanceof String)||(__cov_A_0RP5n2OzxLXfMABzPTRA.b['7'][1]++,result instanceof Boolean)||(__cov_A_0RP5n2OzxLXfMABzPTRA.b['7'][2]++,result instanceof Number)){__cov_A_0RP5n2OzxLXfMABzPTRA.b['6'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['42']++;result=value.valueOf();}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['6'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['43']++;if(result instanceof ClientAttribute){__cov_A_0RP5n2OzxLXfMABzPTRA.b['8'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['44']++;console.log('An Attribute may not itself contain an attribute as a value. Assuming you forgot to call value.');__cov_A_0RP5n2OzxLXfMABzPTRA.s['45']++;result=this.checkValue(value.value);}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['8'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['46']++;var ok=false;__cov_A_0RP5n2OzxLXfMABzPTRA.s['47']++;if((__cov_A_0RP5n2OzxLXfMABzPTRA.b['10'][0]++,this.SUPPORTED_VALUE_TYPES.indexOf(typeof result)>-1)||(__cov_A_0RP5n2OzxLXfMABzPTRA.b['10'][1]++,result instanceof Date)){__cov_A_0RP5n2OzxLXfMABzPTRA.b['9'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['48']++;ok=true;}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['9'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['49']++;if(!ok){__cov_A_0RP5n2OzxLXfMABzPTRA.b['11'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['50']++;throw new Error('Attribute values of this type are not allowed: '+typeof value);}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['11'][1]++;}__cov_A_0RP5n2OzxLXfMABzPTRA.s['51']++;return result;};__cov_A_0RP5n2OzxLXfMABzPTRA.s['52']++;ClientAttribute.prototype.onValueChange=function(eventHandler){__cov_A_0RP5n2OzxLXfMABzPTRA.f['11']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['53']++;this.valueChangeBus.onEvent(eventHandler);__cov_A_0RP5n2OzxLXfMABzPTRA.s['54']++;eventHandler({'oldValue':this.value,'newValue':this.value});};__cov_A_0RP5n2OzxLXfMABzPTRA.s['55']++;ClientAttribute.prototype.onQualifierChange=function(eventHandler){__cov_A_0RP5n2OzxLXfMABzPTRA.f['12']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['56']++;this.qualifierChangeBus.onEvent(eventHandler);};__cov_A_0RP5n2OzxLXfMABzPTRA.s['57']++;ClientAttribute.prototype.syncWith=function(sourceAttribute){__cov_A_0RP5n2OzxLXfMABzPTRA.f['13']++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['58']++;if(sourceAttribute){__cov_A_0RP5n2OzxLXfMABzPTRA.b['12'][0]++;__cov_A_0RP5n2OzxLXfMABzPTRA.s['59']++;this.setQualifier(sourceAttribute.getQualifier());__cov_A_0RP5n2OzxLXfMABzPTRA.s['60']++;this.setValue(sourceAttribute.value);}else{__cov_A_0RP5n2OzxLXfMABzPTRA.b['12'][1]++;}};__cov_A_0RP5n2OzxLXfMABzPTRA.s['61']++;return ClientAttribute;}();__cov_A_0RP5n2OzxLXfMABzPTRA.s['62']++;ClientAttribute.SUPPORTED_VALUE_TYPES=['string','number','boolean'];__cov_A_0RP5n2OzxLXfMABzPTRA.s['63']++;ClientAttribute.clientAttributeInstanceCount=0;__cov_A_0RP5n2OzxLXfMABzPTRA.s['64']++;exports.ClientAttribute=ClientAttribute;

},{"./EventBus":62}],47:[function(require,module,exports){
"use strict";
var __cov_gyMepB3y087B_fjjWg2TUA = (Function('return this'))();
if (!__cov_gyMepB3y087B_fjjWg2TUA.__coverage__) { __cov_gyMepB3y087B_fjjWg2TUA.__coverage__ = {}; }
__cov_gyMepB3y087B_fjjWg2TUA = __cov_gyMepB3y087B_fjjWg2TUA.__coverage__;
if (!(__cov_gyMepB3y087B_fjjWg2TUA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientConnector.ts'])) {
   __cov_gyMepB3y087B_fjjWg2TUA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientConnector.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientConnector.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":1,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"79":0,"80":0,"81":0,"82":0,"83":0,"84":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"100":0,"101":0,"102":0,"103":0,"104":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"119":0,"120":0,"121":0,"122":0,"123":0,"124":0,"125":0,"126":0,"127":0,"128":0,"129":0,"130":0,"131":0,"132":0,"133":0,"134":0,"135":0,"136":0,"137":0,"138":0,"139":0,"140":0,"141":0,"142":0,"143":0,"144":0,"145":0,"146":0,"147":0,"148":0,"149":0,"150":0,"151":0,"152":0,"153":0,"154":0,"155":0,"156":0,"157":0,"158":0,"159":0,"160":0,"161":0,"162":0,"163":0,"164":0,"165":0,"166":0,"167":0,"168":0,"169":0,"170":0,"171":0,"172":0,"173":0,"174":0,"175":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0],"12":[0,0],"13":[0,0],"14":[0,0],"15":[0,0],"16":[0,0],"17":[0,0],"18":[0,0],"19":[0,0],"20":[0,0],"21":[0,0],"22":[0,0],"23":[0,0],"24":[0,0],"25":[0,0],"26":[0,0],"27":[0,0],"28":[0,0],"29":[0,0],"30":[0,0],"31":[0,0],"32":[0,0],"33":[0,0],"34":[0,0],"35":[0,0],"36":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0},"fnMap":{"1":{"name":"(anonymous_1)","line":7,"loc":{"start":{"line":7,"column":23},"end":{"line":7,"column":35}}},"2":{"name":"ClientConnector","line":8,"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":80}}},"3":{"name":"(anonymous_3)","line":21,"loc":{"start":{"line":21,"column":50},"end":{"line":21,"column":72}}},"4":{"name":"(anonymous_4)","line":24,"loc":{"start":{"line":24,"column":47},"end":{"line":24,"column":66}}},"5":{"name":"(anonymous_5)","line":27,"loc":{"start":{"line":27,"column":48},"end":{"line":27,"column":71}}},"6":{"name":"(anonymous_6)","line":30,"loc":{"start":{"line":30,"column":50},"end":{"line":30,"column":72}}},"7":{"name":"(anonymous_7)","line":33,"loc":{"start":{"line":33,"column":38},"end":{"line":33,"column":64}}},"8":{"name":"(anonymous_8)","line":36,"loc":{"start":{"line":36,"column":37},"end":{"line":36,"column":68}}},"9":{"name":"(anonymous_9)","line":44,"loc":{"start":{"line":44,"column":43},"end":{"line":44,"column":55}}},"10":{"name":"(anonymous_10)","line":58,"loc":{"start":{"line":58,"column":43},"end":{"line":58,"column":58}}},"11":{"name":"(anonymous_11)","line":59,"loc":{"start":{"line":59,"column":44},"end":{"line":59,"column":64}}},"12":{"name":"(anonymous_12)","line":62,"loc":{"start":{"line":62,"column":29},"end":{"line":62,"column":48}}},"13":{"name":"(anonymous_13)","line":73,"loc":{"start":{"line":73,"column":23},"end":{"line":73,"column":35}}},"14":{"name":"(anonymous_14)","line":76,"loc":{"start":{"line":76,"column":39},"end":{"line":76,"column":58}}},"15":{"name":"(anonymous_15)","line":109,"loc":{"start":{"line":109,"column":50},"end":{"line":109,"column":75}}},"16":{"name":"(anonymous_16)","line":112,"loc":{"start":{"line":112,"column":69},"end":{"line":112,"column":94}}},"17":{"name":"(anonymous_17)","line":119,"loc":{"start":{"line":119,"column":78},"end":{"line":119,"column":103}}},"18":{"name":"(anonymous_18)","line":123,"loc":{"start":{"line":123,"column":69},"end":{"line":123,"column":94}}},"19":{"name":"(anonymous_19)","line":129,"loc":{"start":{"line":129,"column":41},"end":{"line":129,"column":57}}},"20":{"name":"(anonymous_20)","line":145,"loc":{"start":{"line":145,"column":58},"end":{"line":145,"column":83}}},"21":{"name":"(anonymous_21)","line":165,"loc":{"start":{"line":165,"column":69},"end":{"line":165,"column":94}}},"22":{"name":"(anonymous_22)","line":179,"loc":{"start":{"line":179,"column":65},"end":{"line":179,"column":90}}},"23":{"name":"(anonymous_23)","line":191,"loc":{"start":{"line":191,"column":43},"end":{"line":191,"column":59}}},"24":{"name":"(anonymous_24)","line":209,"loc":{"start":{"line":209,"column":70},"end":{"line":209,"column":95}}},"25":{"name":"(anonymous_25)","line":216,"loc":{"start":{"line":216,"column":61},"end":{"line":216,"column":86}}},"26":{"name":"(anonymous_26)","line":221,"loc":{"start":{"line":221,"column":39},"end":{"line":221,"column":51}}},"27":{"name":"(anonymous_27)","line":231,"loc":{"start":{"line":231,"column":51},"end":{"line":231,"column":63}}},"28":{"name":"(anonymous_28)","line":237,"loc":{"start":{"line":237,"column":28},"end":{"line":237,"column":46}}},"29":{"name":"(anonymous_29)","line":242,"loc":{"start":{"line":242,"column":40},"end":{"line":242,"column":52}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":53}},"3":{"start":{"line":4,"column":0},"end":{"line":4,"column":69}},"4":{"start":{"line":5,"column":0},"end":{"line":5,"column":33}},"5":{"start":{"line":6,"column":0},"end":{"line":6,"column":51}},"6":{"start":{"line":7,"column":0},"end":{"line":250,"column":5}},"7":{"start":{"line":8,"column":4},"end":{"line":20,"column":5}},"8":{"start":{"line":9,"column":8},"end":{"line":9,"column":48}},"9":{"start":{"line":9,"column":34},"end":{"line":9,"column":46}},"10":{"start":{"line":10,"column":8},"end":{"line":10,"column":59}},"11":{"start":{"line":10,"column":39},"end":{"line":10,"column":57}},"12":{"start":{"line":11,"column":8},"end":{"line":11,"column":31}},"13":{"start":{"line":12,"column":8},"end":{"line":12,"column":38}},"14":{"start":{"line":13,"column":8},"end":{"line":13,"column":33}},"15":{"start":{"line":14,"column":8},"end":{"line":14,"column":29}},"16":{"start":{"line":15,"column":8},"end":{"line":15,"column":39}},"17":{"start":{"line":16,"column":8},"end":{"line":16,"column":43}},"18":{"start":{"line":17,"column":8},"end":{"line":17,"column":31}},"19":{"start":{"line":18,"column":8},"end":{"line":18,"column":46}},"20":{"start":{"line":19,"column":8},"end":{"line":19,"column":91}},"21":{"start":{"line":21,"column":4},"end":{"line":23,"column":6}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":41}},"23":{"start":{"line":24,"column":4},"end":{"line":26,"column":6}},"24":{"start":{"line":25,"column":8},"end":{"line":25,"column":35}},"25":{"start":{"line":27,"column":4},"end":{"line":29,"column":6}},"26":{"start":{"line":28,"column":8},"end":{"line":28,"column":40}},"27":{"start":{"line":30,"column":4},"end":{"line":32,"column":6}},"28":{"start":{"line":31,"column":8},"end":{"line":31,"column":41}},"29":{"start":{"line":33,"column":4},"end":{"line":35,"column":6}},"30":{"start":{"line":34,"column":8},"end":{"line":34,"column":47}},"31":{"start":{"line":36,"column":4},"end":{"line":43,"column":6}},"32":{"start":{"line":37,"column":8},"end":{"line":37,"column":74}},"33":{"start":{"line":38,"column":8},"end":{"line":41,"column":9}},"34":{"start":{"line":39,"column":12},"end":{"line":39,"column":27}},"35":{"start":{"line":40,"column":12},"end":{"line":40,"column":19}},"36":{"start":{"line":42,"column":8},"end":{"line":42,"column":26}},"37":{"start":{"line":44,"column":4},"end":{"line":75,"column":6}},"38":{"start":{"line":45,"column":8},"end":{"line":45,"column":25}},"39":{"start":{"line":46,"column":8},"end":{"line":54,"column":9}},"40":{"start":{"line":47,"column":12},"end":{"line":53,"column":13}},"41":{"start":{"line":48,"column":16},"end":{"line":48,"column":42}},"42":{"start":{"line":51,"column":16},"end":{"line":51,"column":46}},"43":{"start":{"line":52,"column":16},"end":{"line":52,"column":23}},"44":{"start":{"line":55,"column":8},"end":{"line":55,"column":37}},"45":{"start":{"line":56,"column":8},"end":{"line":56,"column":75}},"46":{"start":{"line":57,"column":8},"end":{"line":57,"column":75}},"47":{"start":{"line":58,"column":8},"end":{"line":58,"column":83}},"48":{"start":{"line":58,"column":60},"end":{"line":58,"column":79}},"49":{"start":{"line":59,"column":8},"end":{"line":74,"column":11}},"50":{"start":{"line":61,"column":12},"end":{"line":61,"column":32}},"51":{"start":{"line":62,"column":12},"end":{"line":66,"column":15}},"52":{"start":{"line":63,"column":16},"end":{"line":63,"column":52}},"53":{"start":{"line":64,"column":16},"end":{"line":65,"column":45}},"54":{"start":{"line":65,"column":20},"end":{"line":65,"column":45}},"55":{"start":{"line":67,"column":12},"end":{"line":70,"column":13}},"56":{"start":{"line":68,"column":16},"end":{"line":68,"column":48}},"57":{"start":{"line":73,"column":12},"end":{"line":73,"column":82}},"58":{"start":{"line":73,"column":37},"end":{"line":73,"column":63}},"59":{"start":{"line":76,"column":4},"end":{"line":108,"column":6}},"60":{"start":{"line":77,"column":8},"end":{"line":106,"column":9}},"61":{"start":{"line":78,"column":12},"end":{"line":78,"column":51}},"62":{"start":{"line":80,"column":13},"end":{"line":106,"column":9}},"63":{"start":{"line":81,"column":12},"end":{"line":81,"column":70}},"64":{"start":{"line":83,"column":13},"end":{"line":106,"column":9}},"65":{"start":{"line":84,"column":12},"end":{"line":84,"column":79}},"66":{"start":{"line":86,"column":13},"end":{"line":106,"column":9}},"67":{"start":{"line":87,"column":12},"end":{"line":87,"column":70}},"68":{"start":{"line":89,"column":13},"end":{"line":106,"column":9}},"69":{"start":{"line":90,"column":12},"end":{"line":90,"column":59}},"70":{"start":{"line":92,"column":13},"end":{"line":106,"column":9}},"71":{"start":{"line":93,"column":12},"end":{"line":93,"column":70}},"72":{"start":{"line":95,"column":13},"end":{"line":106,"column":9}},"73":{"start":{"line":96,"column":12},"end":{"line":96,"column":66}},"74":{"start":{"line":98,"column":13},"end":{"line":106,"column":9}},"75":{"start":{"line":99,"column":12},"end":{"line":99,"column":71}},"76":{"start":{"line":101,"column":13},"end":{"line":106,"column":9}},"77":{"start":{"line":102,"column":12},"end":{"line":102,"column":62}},"78":{"start":{"line":105,"column":12},"end":{"line":105,"column":69}},"79":{"start":{"line":107,"column":8},"end":{"line":107,"column":20}},"80":{"start":{"line":109,"column":4},"end":{"line":111,"column":6}},"81":{"start":{"line":110,"column":8},"end":{"line":110,"column":34}},"82":{"start":{"line":112,"column":4},"end":{"line":118,"column":6}},"83":{"start":{"line":113,"column":8},"end":{"line":113,"column":85}},"84":{"start":{"line":114,"column":8},"end":{"line":115,"column":24}},"85":{"start":{"line":115,"column":12},"end":{"line":115,"column":24}},"86":{"start":{"line":116,"column":8},"end":{"line":116,"column":86}},"87":{"start":{"line":117,"column":8},"end":{"line":117,"column":21}},"88":{"start":{"line":119,"column":4},"end":{"line":122,"column":6}},"89":{"start":{"line":120,"column":8},"end":{"line":120,"column":82}},"90":{"start":{"line":121,"column":8},"end":{"line":121,"column":20}},"91":{"start":{"line":123,"column":4},"end":{"line":144,"column":6}},"92":{"start":{"line":124,"column":8},"end":{"line":124,"column":25}},"93":{"start":{"line":125,"column":8},"end":{"line":127,"column":9}},"94":{"start":{"line":126,"column":12},"end":{"line":126,"column":126}},"95":{"start":{"line":128,"column":8},"end":{"line":128,"column":28}},"96":{"start":{"line":129,"column":8},"end":{"line":135,"column":11}},"97":{"start":{"line":130,"column":12},"end":{"line":130,"column":111}},"98":{"start":{"line":131,"column":12},"end":{"line":133,"column":13}},"99":{"start":{"line":132,"column":16},"end":{"line":132,"column":45}},"100":{"start":{"line":134,"column":12},"end":{"line":134,"column":45}},"101":{"start":{"line":136,"column":8},"end":{"line":136,"column":119}},"102":{"start":{"line":137,"column":8},"end":{"line":137,"column":43}},"103":{"start":{"line":138,"column":8},"end":{"line":140,"column":9}},"104":{"start":{"line":139,"column":12},"end":{"line":139,"column":43}},"105":{"start":{"line":141,"column":8},"end":{"line":141,"column":63}},"106":{"start":{"line":142,"column":8},"end":{"line":142,"column":70}},"107":{"start":{"line":143,"column":8},"end":{"line":143,"column":24}},"108":{"start":{"line":145,"column":4},"end":{"line":164,"column":6}},"109":{"start":{"line":146,"column":8},"end":{"line":146,"column":116}},"110":{"start":{"line":147,"column":8},"end":{"line":150,"column":9}},"111":{"start":{"line":148,"column":12},"end":{"line":148,"column":184}},"112":{"start":{"line":149,"column":12},"end":{"line":149,"column":24}},"113":{"start":{"line":151,"column":8},"end":{"line":154,"column":9}},"114":{"start":{"line":153,"column":12},"end":{"line":153,"column":24}},"115":{"start":{"line":162,"column":8},"end":{"line":162,"column":57}},"116":{"start":{"line":163,"column":8},"end":{"line":163,"column":20}},"117":{"start":{"line":165,"column":4},"end":{"line":178,"column":6}},"118":{"start":{"line":166,"column":8},"end":{"line":166,"column":110}},"119":{"start":{"line":167,"column":8},"end":{"line":170,"column":9}},"120":{"start":{"line":168,"column":12},"end":{"line":168,"column":101}},"121":{"start":{"line":169,"column":12},"end":{"line":169,"column":24}},"122":{"start":{"line":171,"column":8},"end":{"line":171,"column":116}},"123":{"start":{"line":172,"column":8},"end":{"line":175,"column":9}},"124":{"start":{"line":173,"column":12},"end":{"line":173,"column":107}},"125":{"start":{"line":174,"column":12},"end":{"line":174,"column":24}},"126":{"start":{"line":176,"column":8},"end":{"line":176,"column":36}},"127":{"start":{"line":177,"column":8},"end":{"line":177,"column":24}},"128":{"start":{"line":179,"column":4},"end":{"line":208,"column":6}},"129":{"start":{"line":180,"column":8},"end":{"line":180,"column":139}},"130":{"start":{"line":181,"column":8},"end":{"line":196,"column":9}},"131":{"start":{"line":182,"column":12},"end":{"line":182,"column":128}},"132":{"start":{"line":183,"column":12},"end":{"line":195,"column":13}},"133":{"start":{"line":184,"column":16},"end":{"line":194,"column":17}},"134":{"start":{"line":185,"column":20},"end":{"line":185,"column":54}},"135":{"start":{"line":186,"column":20},"end":{"line":188,"column":21}},"136":{"start":{"line":187,"column":24},"end":{"line":187,"column":60}},"137":{"start":{"line":191,"column":20},"end":{"line":193,"column":23}},"138":{"start":{"line":192,"column":24},"end":{"line":192,"column":60}},"139":{"start":{"line":197,"column":8},"end":{"line":197,"column":30}},"140":{"start":{"line":198,"column":8},"end":{"line":200,"column":9}},"141":{"start":{"line":199,"column":12},"end":{"line":199,"column":119}},"142":{"start":{"line":201,"column":8},"end":{"line":204,"column":9}},"143":{"start":{"line":202,"column":12},"end":{"line":202,"column":128}},"144":{"start":{"line":203,"column":12},"end":{"line":203,"column":76}},"145":{"start":{"line":205,"column":8},"end":{"line":205,"column":77}},"146":{"start":{"line":206,"column":8},"end":{"line":206,"column":79}},"147":{"start":{"line":207,"column":8},"end":{"line":207,"column":33}},"148":{"start":{"line":209,"column":4},"end":{"line":215,"column":6}},"149":{"start":{"line":210,"column":8},"end":{"line":210,"column":116}},"150":{"start":{"line":211,"column":8},"end":{"line":212,"column":24}},"151":{"start":{"line":212,"column":12},"end":{"line":212,"column":24}},"152":{"start":{"line":213,"column":8},"end":{"line":213,"column":74}},"153":{"start":{"line":214,"column":8},"end":{"line":214,"column":20}},"154":{"start":{"line":216,"column":4},"end":{"line":219,"column":6}},"155":{"start":{"line":217,"column":8},"end":{"line":217,"column":64}},"156":{"start":{"line":218,"column":8},"end":{"line":218,"column":20}},"157":{"start":{"line":221,"column":4},"end":{"line":230,"column":6}},"158":{"start":{"line":222,"column":8},"end":{"line":223,"column":19}},"159":{"start":{"line":223,"column":12},"end":{"line":223,"column":19}},"160":{"start":{"line":224,"column":8},"end":{"line":225,"column":19}},"161":{"start":{"line":225,"column":12},"end":{"line":225,"column":19}},"162":{"start":{"line":227,"column":8},"end":{"line":229,"column":9}},"163":{"start":{"line":228,"column":12},"end":{"line":228,"column":30}},"164":{"start":{"line":231,"column":4},"end":{"line":241,"column":6}},"165":{"start":{"line":232,"column":8},"end":{"line":232,"column":22}},"166":{"start":{"line":233,"column":8},"end":{"line":233,"column":28}},"167":{"start":{"line":234,"column":8},"end":{"line":240,"column":11}},"168":{"start":{"line":237,"column":48},"end":{"line":237,"column":67}},"169":{"start":{"line":242,"column":4},"end":{"line":248,"column":6}},"170":{"start":{"line":243,"column":8},"end":{"line":244,"column":19}},"171":{"start":{"line":244,"column":12},"end":{"line":244,"column":19}},"172":{"start":{"line":245,"column":8},"end":{"line":245,"column":29}},"173":{"start":{"line":247,"column":8},"end":{"line":247,"column":53}},"174":{"start":{"line":249,"column":4},"end":{"line":249,"column":27}},"175":{"start":{"line":251,"column":0},"end":{"line":251,"column":42}}},"branchMap":{"1":{"line":9,"type":"if","locations":[{"start":{"line":9,"column":8},"end":{"line":9,"column":8}},{"start":{"line":9,"column":8},"end":{"line":9,"column":8}}]},"2":{"line":10,"type":"if","locations":[{"start":{"line":10,"column":8},"end":{"line":10,"column":8}},{"start":{"line":10,"column":8},"end":{"line":10,"column":8}}]},"3":{"line":38,"type":"if","locations":[{"start":{"line":38,"column":8},"end":{"line":38,"column":8}},{"start":{"line":38,"column":8},"end":{"line":38,"column":8}}]},"4":{"line":46,"type":"if","locations":[{"start":{"line":46,"column":8},"end":{"line":46,"column":8}},{"start":{"line":46,"column":8},"end":{"line":46,"column":8}}]},"5":{"line":47,"type":"if","locations":[{"start":{"line":47,"column":12},"end":{"line":47,"column":12}},{"start":{"line":47,"column":12},"end":{"line":47,"column":12}}]},"6":{"line":64,"type":"if","locations":[{"start":{"line":64,"column":16},"end":{"line":64,"column":16}},{"start":{"line":64,"column":16},"end":{"line":64,"column":16}}]},"7":{"line":67,"type":"if","locations":[{"start":{"line":67,"column":12},"end":{"line":67,"column":12}},{"start":{"line":67,"column":12},"end":{"line":67,"column":12}}]},"8":{"line":77,"type":"if","locations":[{"start":{"line":77,"column":8},"end":{"line":77,"column":8}},{"start":{"line":77,"column":8},"end":{"line":77,"column":8}}]},"9":{"line":80,"type":"if","locations":[{"start":{"line":80,"column":13},"end":{"line":80,"column":13}},{"start":{"line":80,"column":13},"end":{"line":80,"column":13}}]},"10":{"line":83,"type":"if","locations":[{"start":{"line":83,"column":13},"end":{"line":83,"column":13}},{"start":{"line":83,"column":13},"end":{"line":83,"column":13}}]},"11":{"line":86,"type":"if","locations":[{"start":{"line":86,"column":13},"end":{"line":86,"column":13}},{"start":{"line":86,"column":13},"end":{"line":86,"column":13}}]},"12":{"line":89,"type":"if","locations":[{"start":{"line":89,"column":13},"end":{"line":89,"column":13}},{"start":{"line":89,"column":13},"end":{"line":89,"column":13}}]},"13":{"line":92,"type":"if","locations":[{"start":{"line":92,"column":13},"end":{"line":92,"column":13}},{"start":{"line":92,"column":13},"end":{"line":92,"column":13}}]},"14":{"line":95,"type":"if","locations":[{"start":{"line":95,"column":13},"end":{"line":95,"column":13}},{"start":{"line":95,"column":13},"end":{"line":95,"column":13}}]},"15":{"line":98,"type":"if","locations":[{"start":{"line":98,"column":13},"end":{"line":98,"column":13}},{"start":{"line":98,"column":13},"end":{"line":98,"column":13}}]},"16":{"line":101,"type":"if","locations":[{"start":{"line":101,"column":13},"end":{"line":101,"column":13}},{"start":{"line":101,"column":13},"end":{"line":101,"column":13}}]},"17":{"line":114,"type":"if","locations":[{"start":{"line":114,"column":8},"end":{"line":114,"column":8}},{"start":{"line":114,"column":8},"end":{"line":114,"column":8}}]},"18":{"line":125,"type":"if","locations":[{"start":{"line":125,"column":8},"end":{"line":125,"column":8}},{"start":{"line":125,"column":8},"end":{"line":125,"column":8}}]},"19":{"line":131,"type":"if","locations":[{"start":{"line":131,"column":12},"end":{"line":131,"column":12}},{"start":{"line":131,"column":12},"end":{"line":131,"column":12}}]},"20":{"line":131,"type":"binary-expr","locations":[{"start":{"line":131,"column":16},"end":{"line":131,"column":23}},{"start":{"line":131,"column":27},"end":{"line":131,"column":48}}]},"21":{"line":138,"type":"if","locations":[{"start":{"line":138,"column":8},"end":{"line":138,"column":8}},{"start":{"line":138,"column":8},"end":{"line":138,"column":8}}]},"22":{"line":147,"type":"if","locations":[{"start":{"line":147,"column":8},"end":{"line":147,"column":8}},{"start":{"line":147,"column":8},"end":{"line":147,"column":8}}]},"23":{"line":151,"type":"if","locations":[{"start":{"line":151,"column":8},"end":{"line":151,"column":8}},{"start":{"line":151,"column":8},"end":{"line":151,"column":8}}]},"24":{"line":167,"type":"if","locations":[{"start":{"line":167,"column":8},"end":{"line":167,"column":8}},{"start":{"line":167,"column":8},"end":{"line":167,"column":8}}]},"25":{"line":172,"type":"if","locations":[{"start":{"line":172,"column":8},"end":{"line":172,"column":8}},{"start":{"line":172,"column":8},"end":{"line":172,"column":8}}]},"26":{"line":181,"type":"if","locations":[{"start":{"line":181,"column":8},"end":{"line":181,"column":8}},{"start":{"line":181,"column":8},"end":{"line":181,"column":8}}]},"27":{"line":183,"type":"if","locations":[{"start":{"line":183,"column":12},"end":{"line":183,"column":12}},{"start":{"line":183,"column":12},"end":{"line":183,"column":12}}]},"28":{"line":184,"type":"if","locations":[{"start":{"line":184,"column":16},"end":{"line":184,"column":16}},{"start":{"line":184,"column":16},"end":{"line":184,"column":16}}]},"29":{"line":186,"type":"if","locations":[{"start":{"line":186,"column":20},"end":{"line":186,"column":20}},{"start":{"line":186,"column":20},"end":{"line":186,"column":20}}]},"30":{"line":198,"type":"if","locations":[{"start":{"line":198,"column":8},"end":{"line":198,"column":8}},{"start":{"line":198,"column":8},"end":{"line":198,"column":8}}]},"31":{"line":201,"type":"if","locations":[{"start":{"line":201,"column":8},"end":{"line":201,"column":8}},{"start":{"line":201,"column":8},"end":{"line":201,"column":8}}]},"32":{"line":211,"type":"if","locations":[{"start":{"line":211,"column":8},"end":{"line":211,"column":8}},{"start":{"line":211,"column":8},"end":{"line":211,"column":8}}]},"33":{"line":222,"type":"if","locations":[{"start":{"line":222,"column":8},"end":{"line":222,"column":8}},{"start":{"line":222,"column":8},"end":{"line":222,"column":8}}]},"34":{"line":224,"type":"if","locations":[{"start":{"line":224,"column":8},"end":{"line":224,"column":8}},{"start":{"line":224,"column":8},"end":{"line":224,"column":8}}]},"35":{"line":227,"type":"if","locations":[{"start":{"line":227,"column":8},"end":{"line":227,"column":8}},{"start":{"line":227,"column":8},"end":{"line":227,"column":8}}]},"36":{"line":243,"type":"if","locations":[{"start":{"line":243,"column":8},"end":{"line":243,"column":8}},{"start":{"line":243,"column":8},"end":{"line":243,"column":8}}]}}};
}
__cov_gyMepB3y087B_fjjWg2TUA = __cov_gyMepB3y087B_fjjWg2TUA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientConnector.ts'];
__cov_gyMepB3y087B_fjjWg2TUA.s['1']++;exports.__esModule=true;__cov_gyMepB3y087B_fjjWg2TUA.s['2']++;var ClientAttribute_1=require('./ClientAttribute');__cov_gyMepB3y087B_fjjWg2TUA.s['3']++;var ClientPresentationModel_1=require('./ClientPresentationModel');__cov_gyMepB3y087B_fjjWg2TUA.s['4']++;var Codec_1=require('./Codec');__cov_gyMepB3y087B_fjjWg2TUA.s['5']++;var CommandBatcher_1=require('./CommandBatcher');__cov_gyMepB3y087B_fjjWg2TUA.s['6']++;var ClientConnector=function(){__cov_gyMepB3y087B_fjjWg2TUA.f['1']++;function ClientConnector(transmitter,clientDolphin,slackMS,maxBatchSize){__cov_gyMepB3y087B_fjjWg2TUA.f['2']++;__cov_gyMepB3y087B_fjjWg2TUA.s['8']++;if(slackMS===void 0){__cov_gyMepB3y087B_fjjWg2TUA.b['1'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['9']++;slackMS=0;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['1'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['10']++;if(maxBatchSize===void 0){__cov_gyMepB3y087B_fjjWg2TUA.b['2'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['11']++;maxBatchSize=50;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['2'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['12']++;this.commandQueue=[];__cov_gyMepB3y087B_fjjWg2TUA.s['13']++;this.currentlySending=false;__cov_gyMepB3y087B_fjjWg2TUA.s['14']++;this.pushEnabled=false;__cov_gyMepB3y087B_fjjWg2TUA.s['15']++;this.waiting=false;__cov_gyMepB3y087B_fjjWg2TUA.s['16']++;this.transmitter=transmitter;__cov_gyMepB3y087B_fjjWg2TUA.s['17']++;this.clientDolphin=clientDolphin;__cov_gyMepB3y087B_fjjWg2TUA.s['18']++;this.slackMS=slackMS;__cov_gyMepB3y087B_fjjWg2TUA.s['19']++;this.codec=new Codec_1['default']();__cov_gyMepB3y087B_fjjWg2TUA.s['20']++;this.commandBatcher=new CommandBatcher_1.BlindCommandBatcher(true,maxBatchSize);}__cov_gyMepB3y087B_fjjWg2TUA.s['21']++;ClientConnector.prototype.setCommandBatcher=function(newBatcher){__cov_gyMepB3y087B_fjjWg2TUA.f['3']++;__cov_gyMepB3y087B_fjjWg2TUA.s['22']++;this.commandBatcher=newBatcher;};__cov_gyMepB3y087B_fjjWg2TUA.s['23']++;ClientConnector.prototype.setPushEnabled=function(enabled){__cov_gyMepB3y087B_fjjWg2TUA.f['4']++;__cov_gyMepB3y087B_fjjWg2TUA.s['24']++;this.pushEnabled=enabled;};__cov_gyMepB3y087B_fjjWg2TUA.s['25']++;ClientConnector.prototype.setPushListener=function(newListener){__cov_gyMepB3y087B_fjjWg2TUA.f['5']++;__cov_gyMepB3y087B_fjjWg2TUA.s['26']++;this.pushListener=newListener;};__cov_gyMepB3y087B_fjjWg2TUA.s['27']++;ClientConnector.prototype.setReleaseCommand=function(newCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['6']++;__cov_gyMepB3y087B_fjjWg2TUA.s['28']++;this.releaseCommand=newCommand;};__cov_gyMepB3y087B_fjjWg2TUA.s['29']++;ClientConnector.prototype.reset=function(successHandler){__cov_gyMepB3y087B_fjjWg2TUA.f['7']++;__cov_gyMepB3y087B_fjjWg2TUA.s['30']++;this.transmitter.reset(successHandler);};__cov_gyMepB3y087B_fjjWg2TUA.s['31']++;ClientConnector.prototype.send=function(command,onFinished){__cov_gyMepB3y087B_fjjWg2TUA.f['8']++;__cov_gyMepB3y087B_fjjWg2TUA.s['32']++;this.commandQueue.push({command:command,handler:onFinished});__cov_gyMepB3y087B_fjjWg2TUA.s['33']++;if(this.currentlySending){__cov_gyMepB3y087B_fjjWg2TUA.b['3'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['34']++;this.release();__cov_gyMepB3y087B_fjjWg2TUA.s['35']++;return;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['3'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['36']++;this.doSendNext();};__cov_gyMepB3y087B_fjjWg2TUA.s['37']++;ClientConnector.prototype.doSendNext=function(){__cov_gyMepB3y087B_fjjWg2TUA.f['9']++;__cov_gyMepB3y087B_fjjWg2TUA.s['38']++;var _this=this;__cov_gyMepB3y087B_fjjWg2TUA.s['39']++;if(this.commandQueue.length<1){__cov_gyMepB3y087B_fjjWg2TUA.b['4'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['40']++;if(this.pushEnabled){__cov_gyMepB3y087B_fjjWg2TUA.b['5'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['41']++;this.enqueuePushCommand();}else{__cov_gyMepB3y087B_fjjWg2TUA.b['5'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['42']++;this.currentlySending=false;__cov_gyMepB3y087B_fjjWg2TUA.s['43']++;return;}}else{__cov_gyMepB3y087B_fjjWg2TUA.b['4'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['44']++;this.currentlySending=true;__cov_gyMepB3y087B_fjjWg2TUA.s['45']++;var cmdsAndHandlers=this.commandBatcher.batch(this.commandQueue);__cov_gyMepB3y087B_fjjWg2TUA.s['46']++;var callback=cmdsAndHandlers[cmdsAndHandlers.length-1].handler;__cov_gyMepB3y087B_fjjWg2TUA.s['47']++;var commands=cmdsAndHandlers.map(function(cah){__cov_gyMepB3y087B_fjjWg2TUA.f['10']++;__cov_gyMepB3y087B_fjjWg2TUA.s['48']++;return cah.command;});__cov_gyMepB3y087B_fjjWg2TUA.s['49']++;this.transmitter.transmit(commands,function(response){__cov_gyMepB3y087B_fjjWg2TUA.f['11']++;__cov_gyMepB3y087B_fjjWg2TUA.s['50']++;var touchedPMs=[];__cov_gyMepB3y087B_fjjWg2TUA.s['51']++;response.forEach(function(command){__cov_gyMepB3y087B_fjjWg2TUA.f['12']++;__cov_gyMepB3y087B_fjjWg2TUA.s['52']++;var touched=_this.handle(command);__cov_gyMepB3y087B_fjjWg2TUA.s['53']++;if(touched){__cov_gyMepB3y087B_fjjWg2TUA.b['6'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['54']++;touchedPMs.push(touched);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['6'][1]++;}});__cov_gyMepB3y087B_fjjWg2TUA.s['55']++;if(callback){__cov_gyMepB3y087B_fjjWg2TUA.b['7'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['56']++;callback.onFinished(touchedPMs);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['7'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['57']++;setTimeout(function(){__cov_gyMepB3y087B_fjjWg2TUA.f['13']++;__cov_gyMepB3y087B_fjjWg2TUA.s['58']++;return _this.doSendNext();},_this.slackMS);});};__cov_gyMepB3y087B_fjjWg2TUA.s['59']++;ClientConnector.prototype.handle=function(command){__cov_gyMepB3y087B_fjjWg2TUA.f['14']++;__cov_gyMepB3y087B_fjjWg2TUA.s['60']++;if(command.id=='Data'){__cov_gyMepB3y087B_fjjWg2TUA.b['8'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['61']++;return this.handleDataCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['8'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['62']++;if(command.id=='DeletePresentationModel'){__cov_gyMepB3y087B_fjjWg2TUA.b['9'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['63']++;return this.handleDeletePresentationModelCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['9'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['64']++;if(command.id=='DeleteAllPresentationModelsOfType'){__cov_gyMepB3y087B_fjjWg2TUA.b['10'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['65']++;return this.handleDeleteAllPresentationModelOfTypeCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['10'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['66']++;if(command.id=='CreatePresentationModel'){__cov_gyMepB3y087B_fjjWg2TUA.b['11'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['67']++;return this.handleCreatePresentationModelCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['11'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['68']++;if(command.id=='ValueChanged'){__cov_gyMepB3y087B_fjjWg2TUA.b['12'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['69']++;return this.handleValueChangedCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['12'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['70']++;if(command.id=='SwitchPresentationModel'){__cov_gyMepB3y087B_fjjWg2TUA.b['13'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['71']++;return this.handleSwitchPresentationModelCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['13'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['72']++;if(command.id=='InitializeAttribute'){__cov_gyMepB3y087B_fjjWg2TUA.b['14'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['73']++;return this.handleInitializeAttributeCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['14'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['74']++;if(command.id=='AttributeMetadataChanged'){__cov_gyMepB3y087B_fjjWg2TUA.b['15'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['75']++;return this.handleAttributeMetadataChangedCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['15'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['76']++;if(command.id=='CallNamedAction'){__cov_gyMepB3y087B_fjjWg2TUA.b['16'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['77']++;return this.handleCallNamedActionCommand(command);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['16'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['78']++;console.log('Cannot handle, unknown command '+command);}}}}}}}}}__cov_gyMepB3y087B_fjjWg2TUA.s['79']++;return null;};__cov_gyMepB3y087B_fjjWg2TUA.s['80']++;ClientConnector.prototype.handleDataCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['15']++;__cov_gyMepB3y087B_fjjWg2TUA.s['81']++;return serverCommand.data;};__cov_gyMepB3y087B_fjjWg2TUA.s['82']++;ClientConnector.prototype.handleDeletePresentationModelCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['16']++;__cov_gyMepB3y087B_fjjWg2TUA.s['83']++;var model=this.clientDolphin.findPresentationModelById(serverCommand.pmId);__cov_gyMepB3y087B_fjjWg2TUA.s['84']++;if(!model){__cov_gyMepB3y087B_fjjWg2TUA.b['17'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['85']++;return null;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['17'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['86']++;this.clientDolphin.getClientModelStore().deletePresentationModel(model,true);__cov_gyMepB3y087B_fjjWg2TUA.s['87']++;return model;};__cov_gyMepB3y087B_fjjWg2TUA.s['88']++;ClientConnector.prototype.handleDeleteAllPresentationModelOfTypeCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['17']++;__cov_gyMepB3y087B_fjjWg2TUA.s['89']++;this.clientDolphin.deleteAllPresentationModelOfType(serverCommand.pmType);__cov_gyMepB3y087B_fjjWg2TUA.s['90']++;return null;};__cov_gyMepB3y087B_fjjWg2TUA.s['91']++;ClientConnector.prototype.handleCreatePresentationModelCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['18']++;__cov_gyMepB3y087B_fjjWg2TUA.s['92']++;var _this=this;__cov_gyMepB3y087B_fjjWg2TUA.s['93']++;if(this.clientDolphin.getClientModelStore().containsPresentationModel(serverCommand.pmId)){__cov_gyMepB3y087B_fjjWg2TUA.b['18'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['94']++;throw new Error('There already is a presentation model with id '+serverCommand.pmId+'  known to the client.');}else{__cov_gyMepB3y087B_fjjWg2TUA.b['18'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['95']++;var attributes=[];__cov_gyMepB3y087B_fjjWg2TUA.s['96']++;serverCommand.attributes.forEach(function(attr){__cov_gyMepB3y087B_fjjWg2TUA.f['19']++;__cov_gyMepB3y087B_fjjWg2TUA.s['97']++;var clientAttribute=_this.clientDolphin.attribute(attr.propertyName,attr.qualifier,attr.value);__cov_gyMepB3y087B_fjjWg2TUA.s['98']++;if((__cov_gyMepB3y087B_fjjWg2TUA.b['20'][0]++,attr.id)&&(__cov_gyMepB3y087B_fjjWg2TUA.b['20'][1]++,attr.id.match('.*S$'))){__cov_gyMepB3y087B_fjjWg2TUA.b['19'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['99']++;clientAttribute.id=attr.id;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['19'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['100']++;attributes.push(clientAttribute);});__cov_gyMepB3y087B_fjjWg2TUA.s['101']++;var clientPm=new ClientPresentationModel_1.ClientPresentationModel(serverCommand.pmId,serverCommand.pmType);__cov_gyMepB3y087B_fjjWg2TUA.s['102']++;clientPm.addAttributes(attributes);__cov_gyMepB3y087B_fjjWg2TUA.s['103']++;if(serverCommand.clientSideOnly){__cov_gyMepB3y087B_fjjWg2TUA.b['21'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['104']++;clientPm.clientSideOnly=true;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['21'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['105']++;this.clientDolphin.getClientModelStore().add(clientPm);__cov_gyMepB3y087B_fjjWg2TUA.s['106']++;this.clientDolphin.updatePresentationModelQualifier(clientPm);__cov_gyMepB3y087B_fjjWg2TUA.s['107']++;return clientPm;};__cov_gyMepB3y087B_fjjWg2TUA.s['108']++;ClientConnector.prototype.handleValueChangedCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['20']++;__cov_gyMepB3y087B_fjjWg2TUA.s['109']++;var clientAttribute=this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);__cov_gyMepB3y087B_fjjWg2TUA.s['110']++;if(!clientAttribute){__cov_gyMepB3y087B_fjjWg2TUA.b['22'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['111']++;console.log('attribute with id '+serverCommand.attributeId+' not found, cannot update old value '+serverCommand.oldValue+' to new value '+serverCommand.newValue);__cov_gyMepB3y087B_fjjWg2TUA.s['112']++;return null;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['22'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['113']++;if(clientAttribute.getValue()==serverCommand.newValue){__cov_gyMepB3y087B_fjjWg2TUA.b['23'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['114']++;return null;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['23'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['115']++;clientAttribute.setValue(serverCommand.newValue);__cov_gyMepB3y087B_fjjWg2TUA.s['116']++;return null;};__cov_gyMepB3y087B_fjjWg2TUA.s['117']++;ClientConnector.prototype.handleSwitchPresentationModelCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['21']++;__cov_gyMepB3y087B_fjjWg2TUA.s['118']++;var switchPm=this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);__cov_gyMepB3y087B_fjjWg2TUA.s['119']++;if(!switchPm){__cov_gyMepB3y087B_fjjWg2TUA.b['24'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['120']++;console.log('switch model with id '+serverCommand.pmId+' not found, cannot switch.');__cov_gyMepB3y087B_fjjWg2TUA.s['121']++;return null;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['24'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['122']++;var sourcePm=this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.sourcePmId);__cov_gyMepB3y087B_fjjWg2TUA.s['123']++;if(!sourcePm){__cov_gyMepB3y087B_fjjWg2TUA.b['25'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['124']++;console.log('source model with id '+serverCommand.sourcePmId+' not found, cannot switch.');__cov_gyMepB3y087B_fjjWg2TUA.s['125']++;return null;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['25'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['126']++;switchPm.syncWith(sourcePm);__cov_gyMepB3y087B_fjjWg2TUA.s['127']++;return switchPm;};__cov_gyMepB3y087B_fjjWg2TUA.s['128']++;ClientConnector.prototype.handleInitializeAttributeCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['22']++;__cov_gyMepB3y087B_fjjWg2TUA.s['129']++;var attribute=new ClientAttribute_1.ClientAttribute(serverCommand.propertyName,serverCommand.qualifier,serverCommand.newValue);__cov_gyMepB3y087B_fjjWg2TUA.s['130']++;if(serverCommand.qualifier){__cov_gyMepB3y087B_fjjWg2TUA.b['26'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['131']++;var attributesCopy=this.clientDolphin.getClientModelStore().findAllAttributesByQualifier(serverCommand.qualifier);__cov_gyMepB3y087B_fjjWg2TUA.s['132']++;if(attributesCopy){__cov_gyMepB3y087B_fjjWg2TUA.b['27'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['133']++;if(!serverCommand.newValue){__cov_gyMepB3y087B_fjjWg2TUA.b['28'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['134']++;var attr=attributesCopy.shift();__cov_gyMepB3y087B_fjjWg2TUA.s['135']++;if(attr){__cov_gyMepB3y087B_fjjWg2TUA.b['29'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['136']++;attribute.setValue(attr.getValue());}else{__cov_gyMepB3y087B_fjjWg2TUA.b['29'][1]++;}}else{__cov_gyMepB3y087B_fjjWg2TUA.b['28'][1]++;__cov_gyMepB3y087B_fjjWg2TUA.s['137']++;attributesCopy.forEach(function(attr){__cov_gyMepB3y087B_fjjWg2TUA.f['23']++;__cov_gyMepB3y087B_fjjWg2TUA.s['138']++;attr.setValue(attribute.getValue());});}}else{__cov_gyMepB3y087B_fjjWg2TUA.b['27'][1]++;}}else{__cov_gyMepB3y087B_fjjWg2TUA.b['26'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['139']++;var presentationModel;__cov_gyMepB3y087B_fjjWg2TUA.s['140']++;if(serverCommand.pmId){__cov_gyMepB3y087B_fjjWg2TUA.b['30'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['141']++;presentationModel=this.clientDolphin.getClientModelStore().findPresentationModelById(serverCommand.pmId);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['30'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['142']++;if(!presentationModel){__cov_gyMepB3y087B_fjjWg2TUA.b['31'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['143']++;presentationModel=new ClientPresentationModel_1.ClientPresentationModel(serverCommand.pmId,serverCommand.pmType);__cov_gyMepB3y087B_fjjWg2TUA.s['144']++;this.clientDolphin.getClientModelStore().add(presentationModel);}else{__cov_gyMepB3y087B_fjjWg2TUA.b['31'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['145']++;this.clientDolphin.addAttributeToModel(presentationModel,attribute);__cov_gyMepB3y087B_fjjWg2TUA.s['146']++;this.clientDolphin.updatePresentationModelQualifier(presentationModel);__cov_gyMepB3y087B_fjjWg2TUA.s['147']++;return presentationModel;};__cov_gyMepB3y087B_fjjWg2TUA.s['148']++;ClientConnector.prototype.handleAttributeMetadataChangedCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['24']++;__cov_gyMepB3y087B_fjjWg2TUA.s['149']++;var clientAttribute=this.clientDolphin.getClientModelStore().findAttributeById(serverCommand.attributeId);__cov_gyMepB3y087B_fjjWg2TUA.s['150']++;if(!clientAttribute){__cov_gyMepB3y087B_fjjWg2TUA.b['32'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['151']++;return null;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['32'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['152']++;clientAttribute[serverCommand.metadataName]=serverCommand.value;__cov_gyMepB3y087B_fjjWg2TUA.s['153']++;return null;};__cov_gyMepB3y087B_fjjWg2TUA.s['154']++;ClientConnector.prototype.handleCallNamedActionCommand=function(serverCommand){__cov_gyMepB3y087B_fjjWg2TUA.f['25']++;__cov_gyMepB3y087B_fjjWg2TUA.s['155']++;this.clientDolphin.send(serverCommand.actionName,null);__cov_gyMepB3y087B_fjjWg2TUA.s['156']++;return null;};__cov_gyMepB3y087B_fjjWg2TUA.s['157']++;ClientConnector.prototype.listen=function(){__cov_gyMepB3y087B_fjjWg2TUA.f['26']++;__cov_gyMepB3y087B_fjjWg2TUA.s['158']++;if(!this.pushEnabled){__cov_gyMepB3y087B_fjjWg2TUA.b['33'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['159']++;return;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['33'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['160']++;if(this.waiting){__cov_gyMepB3y087B_fjjWg2TUA.b['34'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['161']++;return;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['34'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['162']++;if(!this.currentlySending){__cov_gyMepB3y087B_fjjWg2TUA.b['35'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['163']++;this.doSendNext();}else{__cov_gyMepB3y087B_fjjWg2TUA.b['35'][1]++;}};__cov_gyMepB3y087B_fjjWg2TUA.s['164']++;ClientConnector.prototype.enqueuePushCommand=function(){__cov_gyMepB3y087B_fjjWg2TUA.f['27']++;__cov_gyMepB3y087B_fjjWg2TUA.s['165']++;var me=this;__cov_gyMepB3y087B_fjjWg2TUA.s['166']++;this.waiting=true;__cov_gyMepB3y087B_fjjWg2TUA.s['167']++;this.commandQueue.push({command:this.pushListener,handler:{onFinished:function(models){__cov_gyMepB3y087B_fjjWg2TUA.f['28']++;__cov_gyMepB3y087B_fjjWg2TUA.s['168']++;me.waiting=false;},onFinishedData:null}});};__cov_gyMepB3y087B_fjjWg2TUA.s['169']++;ClientConnector.prototype.release=function(){__cov_gyMepB3y087B_fjjWg2TUA.f['29']++;__cov_gyMepB3y087B_fjjWg2TUA.s['170']++;if(!this.waiting){__cov_gyMepB3y087B_fjjWg2TUA.b['36'][0]++;__cov_gyMepB3y087B_fjjWg2TUA.s['171']++;return;}else{__cov_gyMepB3y087B_fjjWg2TUA.b['36'][1]++;}__cov_gyMepB3y087B_fjjWg2TUA.s['172']++;this.waiting=false;__cov_gyMepB3y087B_fjjWg2TUA.s['173']++;this.transmitter.signal(this.releaseCommand);};__cov_gyMepB3y087B_fjjWg2TUA.s['174']++;return ClientConnector;}();__cov_gyMepB3y087B_fjjWg2TUA.s['175']++;exports.ClientConnector=ClientConnector;

},{"./ClientAttribute":46,"./ClientPresentationModel":50,"./Codec":51,"./CommandBatcher":53}],48:[function(require,module,exports){
"use strict";
var __cov_wQZQHXUSJIpKlvH2ZJnP9Q = (Function('return this'))();
if (!__cov_wQZQHXUSJIpKlvH2ZJnP9Q.__coverage__) { __cov_wQZQHXUSJIpKlvH2ZJnP9Q.__coverage__ = {}; }
__cov_wQZQHXUSJIpKlvH2ZJnP9Q = __cov_wQZQHXUSJIpKlvH2ZJnP9Q.__coverage__;
if (!(__cov_wQZQHXUSJIpKlvH2ZJnP9Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientDolphin.ts'])) {
   __cov_wQZQHXUSJIpKlvH2ZJnP9Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientDolphin.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientDolphin.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"73":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0},"fnMap":{"1":{"name":"(anonymous_1)","line":9,"loc":{"start":{"line":9,"column":21},"end":{"line":9,"column":33}}},"2":{"name":"ClientDolphin","line":10,"loc":{"start":{"line":10,"column":4},"end":{"line":10,"column":29}}},"3":{"name":"(anonymous_3)","line":12,"loc":{"start":{"line":12,"column":49},"end":{"line":12,"column":76}}},"4":{"name":"(anonymous_4)","line":15,"loc":{"start":{"line":15,"column":49},"end":{"line":15,"column":61}}},"5":{"name":"(anonymous_5)","line":18,"loc":{"start":{"line":18,"column":35},"end":{"line":18,"column":70}}},"6":{"name":"(anonymous_6)","line":21,"loc":{"start":{"line":21,"column":36},"end":{"line":21,"column":62}}},"7":{"name":"(anonymous_7)","line":24,"loc":{"start":{"line":24,"column":40},"end":{"line":24,"column":62}}},"8":{"name":"(anonymous_8)","line":28,"loc":{"start":{"line":28,"column":40},"end":{"line":28,"column":82}}},"9":{"name":"(anonymous_9)","line":32,"loc":{"start":{"line":32,"column":48},"end":{"line":32,"column":68}}},"10":{"name":"(anonymous_10)","line":39,"loc":{"start":{"line":39,"column":31},"end":{"line":39,"column":52}}},"11":{"name":"(anonymous_11)","line":46,"loc":{"start":{"line":46,"column":50},"end":{"line":46,"column":78}}},"12":{"name":"(anonymous_12)","line":49,"loc":{"start":{"line":49,"column":50},"end":{"line":49,"column":62}}},"13":{"name":"(anonymous_13)","line":52,"loc":{"start":{"line":52,"column":55},"end":{"line":52,"column":67}}},"14":{"name":"(anonymous_14)","line":55,"loc":{"start":{"line":55,"column":53},"end":{"line":55,"column":65}}},"15":{"name":"(anonymous_15)","line":58,"loc":{"start":{"line":58,"column":61},"end":{"line":58,"column":94}}},"16":{"name":"(anonymous_16)","line":61,"loc":{"start":{"line":61,"column":36},"end":{"line":61,"column":50}}},"17":{"name":"(anonymous_17)","line":64,"loc":{"start":{"line":64,"column":56},"end":{"line":64,"column":70}}},"18":{"name":"(anonymous_18)","line":67,"loc":{"start":{"line":67,"column":54},"end":{"line":67,"column":79}}},"19":{"name":"(anonymous_19)","line":70,"loc":{"start":{"line":70,"column":63},"end":{"line":70,"column":96}}},"20":{"name":"(anonymous_20)","line":73,"loc":{"start":{"line":73,"column":63},"end":{"line":73,"column":92}}},"21":{"name":"(anonymous_21)","line":75,"loc":{"start":{"line":75,"column":50},"end":{"line":75,"column":77}}},"22":{"name":"(anonymous_22)","line":79,"loc":{"start":{"line":79,"column":55},"end":{"line":79,"column":82}}},"23":{"name":"(anonymous_23)","line":83,"loc":{"start":{"line":83,"column":27},"end":{"line":83,"column":54}}},"24":{"name":"(anonymous_24)","line":87,"loc":{"start":{"line":87,"column":50},"end":{"line":87,"column":96}}},"25":{"name":"(anonymous_25)","line":95,"loc":{"start":{"line":95,"column":49},"end":{"line":95,"column":94}}},"26":{"name":"(anonymous_26)","line":101,"loc":{"start":{"line":101,"column":48},"end":{"line":101,"column":60}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":79}},"3":{"start":{"line":4,"column":0},"end":{"line":4,"column":53}},"4":{"start":{"line":5,"column":0},"end":{"line":5,"column":69}},"5":{"start":{"line":6,"column":0},"end":{"line":6,"column":57}},"6":{"start":{"line":7,"column":0},"end":{"line":7,"column":47}},"7":{"start":{"line":8,"column":0},"end":{"line":8,"column":49}},"8":{"start":{"line":9,"column":0},"end":{"line":105,"column":5}},"9":{"start":{"line":10,"column":4},"end":{"line":11,"column":5}},"10":{"start":{"line":12,"column":4},"end":{"line":14,"column":6}},"11":{"start":{"line":13,"column":8},"end":{"line":13,"column":47}},"12":{"start":{"line":15,"column":4},"end":{"line":17,"column":6}},"13":{"start":{"line":16,"column":8},"end":{"line":16,"column":36}},"14":{"start":{"line":18,"column":4},"end":{"line":20,"column":6}},"15":{"start":{"line":19,"column":8},"end":{"line":19,"column":90}},"16":{"start":{"line":21,"column":4},"end":{"line":23,"column":6}},"17":{"start":{"line":22,"column":8},"end":{"line":22,"column":51}},"18":{"start":{"line":24,"column":4},"end":{"line":26,"column":6}},"19":{"start":{"line":25,"column":8},"end":{"line":25,"column":84}},"20":{"start":{"line":28,"column":4},"end":{"line":30,"column":6}},"21":{"start":{"line":29,"column":8},"end":{"line":29,"column":85}},"22":{"start":{"line":32,"column":4},"end":{"line":45,"column":6}},"23":{"start":{"line":33,"column":8},"end":{"line":33,"column":28}},"24":{"start":{"line":34,"column":8},"end":{"line":36,"column":9}},"25":{"start":{"line":35,"column":12},"end":{"line":35,"column":47}},"26":{"start":{"line":37,"column":8},"end":{"line":37,"column":84}},"27":{"start":{"line":38,"column":8},"end":{"line":42,"column":9}},"28":{"start":{"line":39,"column":12},"end":{"line":41,"column":15}},"29":{"start":{"line":40,"column":16},"end":{"line":40,"column":46}},"30":{"start":{"line":43,"column":8},"end":{"line":43,"column":46}},"31":{"start":{"line":44,"column":8},"end":{"line":44,"column":21}},"32":{"start":{"line":46,"column":4},"end":{"line":48,"column":6}},"33":{"start":{"line":47,"column":8},"end":{"line":47,"column":49}},"34":{"start":{"line":49,"column":4},"end":{"line":51,"column":6}},"35":{"start":{"line":50,"column":8},"end":{"line":50,"column":37}},"36":{"start":{"line":52,"column":4},"end":{"line":54,"column":6}},"37":{"start":{"line":53,"column":8},"end":{"line":53,"column":69}},"38":{"start":{"line":55,"column":4},"end":{"line":57,"column":6}},"39":{"start":{"line":56,"column":8},"end":{"line":56,"column":67}},"40":{"start":{"line":58,"column":4},"end":{"line":60,"column":6}},"41":{"start":{"line":59,"column":8},"end":{"line":59,"column":96}},"42":{"start":{"line":61,"column":4},"end":{"line":63,"column":6}},"43":{"start":{"line":62,"column":8},"end":{"line":62,"column":50}},"44":{"start":{"line":64,"column":4},"end":{"line":66,"column":6}},"45":{"start":{"line":65,"column":8},"end":{"line":65,"column":72}},"46":{"start":{"line":67,"column":4},"end":{"line":69,"column":6}},"47":{"start":{"line":68,"column":8},"end":{"line":68,"column":80}},"48":{"start":{"line":70,"column":4},"end":{"line":72,"column":6}},"49":{"start":{"line":71,"column":8},"end":{"line":71,"column":91}},"50":{"start":{"line":73,"column":4},"end":{"line":78,"column":6}},"51":{"start":{"line":74,"column":8},"end":{"line":74,"column":25}},"52":{"start":{"line":75,"column":8},"end":{"line":77,"column":11}},"53":{"start":{"line":76,"column":12},"end":{"line":76,"column":60}},"54":{"start":{"line":79,"column":4},"end":{"line":86,"column":6}},"55":{"start":{"line":80,"column":8},"end":{"line":81,"column":19}},"56":{"start":{"line":81,"column":12},"end":{"line":81,"column":19}},"57":{"start":{"line":82,"column":8},"end":{"line":82,"column":113}},"58":{"start":{"line":83,"column":8},"end":{"line":85,"column":11}},"59":{"start":{"line":84,"column":12},"end":{"line":84,"column":65}},"60":{"start":{"line":87,"column":4},"end":{"line":93,"column":6}},"61":{"start":{"line":88,"column":8},"end":{"line":88,"column":56}},"62":{"start":{"line":89,"column":8},"end":{"line":89,"column":70}},"63":{"start":{"line":90,"column":8},"end":{"line":92,"column":9}},"64":{"start":{"line":91,"column":12},"end":{"line":91,"column":223}},"65":{"start":{"line":95,"column":4},"end":{"line":100,"column":6}},"66":{"start":{"line":96,"column":8},"end":{"line":96,"column":92}},"67":{"start":{"line":97,"column":8},"end":{"line":97,"column":98}},"68":{"start":{"line":98,"column":8},"end":{"line":98,"column":50}},"69":{"start":{"line":99,"column":8},"end":{"line":99,"column":38}},"70":{"start":{"line":101,"column":4},"end":{"line":103,"column":6}},"71":{"start":{"line":102,"column":8},"end":{"line":102,"column":51}},"72":{"start":{"line":104,"column":4},"end":{"line":104,"column":25}},"73":{"start":{"line":106,"column":0},"end":{"line":106,"column":35}}},"branchMap":{"1":{"line":38,"type":"if","locations":[{"start":{"line":38,"column":8},"end":{"line":38,"column":8}},{"start":{"line":38,"column":8},"end":{"line":38,"column":8}}]},"2":{"line":38,"type":"binary-expr","locations":[{"start":{"line":38,"column":12},"end":{"line":38,"column":22}},{"start":{"line":38,"column":26},"end":{"line":38,"column":47}}]},"3":{"line":80,"type":"if","locations":[{"start":{"line":80,"column":8},"end":{"line":80,"column":8}},{"start":{"line":80,"column":8},"end":{"line":80,"column":8}}]},"4":{"line":90,"type":"if","locations":[{"start":{"line":90,"column":8},"end":{"line":90,"column":8}},{"start":{"line":90,"column":8},"end":{"line":90,"column":8}}]}}};
}
__cov_wQZQHXUSJIpKlvH2ZJnP9Q = __cov_wQZQHXUSJIpKlvH2ZJnP9Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientDolphin.ts'];
__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['1']++;exports.__esModule=true;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['2']++;var AttributeCreatedNotification_1=require('./AttributeCreatedNotification');__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['3']++;var ClientAttribute_1=require('./ClientAttribute');__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['4']++;var ClientPresentationModel_1=require('./ClientPresentationModel');__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['5']++;var EmptyNotification_1=require('./EmptyNotification');__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['6']++;var NamedCommand_1=require('./NamedCommand');__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['7']++;var SignalCommand_1=require('./SignalCommand');__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['8']++;var ClientDolphin=function(){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['1']++;function ClientDolphin(){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['2']++;}__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['10']++;ClientDolphin.prototype.setClientConnector=function(clientConnector){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['3']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['11']++;this.clientConnector=clientConnector;};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['12']++;ClientDolphin.prototype.getClientConnector=function(){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['4']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['13']++;return this.clientConnector;};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['14']++;ClientDolphin.prototype.send=function(commandName,onFinished){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['5']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['15']++;this.clientConnector.send(new NamedCommand_1['default'](commandName),onFinished);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['16']++;ClientDolphin.prototype.reset=function(successHandler){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['6']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['17']++;this.clientConnector.reset(successHandler);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['18']++;ClientDolphin.prototype.sendEmpty=function(onFinished){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['7']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['19']++;this.clientConnector.send(new EmptyNotification_1['default'](),onFinished);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['20']++;ClientDolphin.prototype.attribute=function(propertyName,qualifier,value){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['8']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['21']++;return new ClientAttribute_1.ClientAttribute(propertyName,qualifier,value);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['22']++;ClientDolphin.prototype.presentationModel=function(id,type){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['9']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['23']++;var attributes=[];__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['24']++;for(var _i=2;_i<arguments.length;_i++){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['25']++;attributes[_i-2]=arguments[_i];}__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['26']++;var model=new ClientPresentationModel_1.ClientPresentationModel(id,type);__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['27']++;if((__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['2'][0]++,attributes)&&(__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['2'][1]++,attributes.length>0)){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['1'][0]++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['28']++;attributes.forEach(function(attribute){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['10']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['29']++;model.addAttribute(attribute);});}else{__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['1'][1]++;}__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['30']++;this.getClientModelStore().add(model);__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['31']++;return model;};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['32']++;ClientDolphin.prototype.setClientModelStore=function(clientModelStore){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['11']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['33']++;this.clientModelStore=clientModelStore;};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['34']++;ClientDolphin.prototype.getClientModelStore=function(){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['12']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['35']++;return this.clientModelStore;};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['36']++;ClientDolphin.prototype.listPresentationModelIds=function(){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['13']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['37']++;return this.getClientModelStore().listPresentationModelIds();};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['38']++;ClientDolphin.prototype.listPresentationModels=function(){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['14']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['39']++;return this.getClientModelStore().listPresentationModels();};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['40']++;ClientDolphin.prototype.findAllPresentationModelByType=function(presentationModelType){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['15']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['41']++;return this.getClientModelStore().findAllPresentationModelByType(presentationModelType);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['42']++;ClientDolphin.prototype.getAt=function(id){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['16']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['43']++;return this.findPresentationModelById(id);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['44']++;ClientDolphin.prototype.findPresentationModelById=function(id){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['17']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['45']++;return this.getClientModelStore().findPresentationModelById(id);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['46']++;ClientDolphin.prototype.deletePresentationModel=function(modelToDelete){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['18']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['47']++;this.getClientModelStore().deletePresentationModel(modelToDelete,true);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['48']++;ClientDolphin.prototype.deleteAllPresentationModelOfType=function(presentationModelType){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['19']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['49']++;this.getClientModelStore().deleteAllPresentationModelOfType(presentationModelType);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['50']++;ClientDolphin.prototype.updatePresentationModelQualifier=function(presentationModel){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['20']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['51']++;var _this=this;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['52']++;presentationModel.getAttributes().forEach(function(sourceAttribute){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['21']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['53']++;_this.updateAttributeQualifier(sourceAttribute);});};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['54']++;ClientDolphin.prototype.updateAttributeQualifier=function(sourceAttribute){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['22']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['55']++;if(!sourceAttribute.getQualifier()){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['3'][0]++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['56']++;return;}else{__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['3'][1]++;}__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['57']++;var attributes=this.getClientModelStore().findAllAttributesByQualifier(sourceAttribute.getQualifier());__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['58']++;attributes.forEach(function(targetAttribute){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['23']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['59']++;targetAttribute.setValue(sourceAttribute.getValue());});};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['60']++;ClientDolphin.prototype.addAttributeToModel=function(presentationModel,clientAttribute){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['24']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['61']++;presentationModel.addAttribute(clientAttribute);__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['62']++;this.getClientModelStore().registerAttribute(clientAttribute);__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['63']++;if(!presentationModel.clientSideOnly){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['4'][0]++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['64']++;this.clientConnector.send(new AttributeCreatedNotification_1['default'](presentationModel.id,clientAttribute.id,clientAttribute.propertyName,clientAttribute.getValue(),clientAttribute.getQualifier()),null);}else{__cov_wQZQHXUSJIpKlvH2ZJnP9Q.b['4'][1]++;}};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['65']++;ClientDolphin.prototype.startPushListening=function(pushActionName,releaseActionName){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['25']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['66']++;this.clientConnector.setPushListener(new NamedCommand_1['default'](pushActionName));__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['67']++;this.clientConnector.setReleaseCommand(new SignalCommand_1['default'](releaseActionName));__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['68']++;this.clientConnector.setPushEnabled(true);__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['69']++;this.clientConnector.listen();};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['70']++;ClientDolphin.prototype.stopPushListening=function(){__cov_wQZQHXUSJIpKlvH2ZJnP9Q.f['26']++;__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['71']++;this.clientConnector.setPushEnabled(false);};__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['72']++;return ClientDolphin;}();__cov_wQZQHXUSJIpKlvH2ZJnP9Q.s['73']++;exports['default']=ClientDolphin;

},{"./AttributeCreatedNotification":42,"./ClientAttribute":46,"./ClientPresentationModel":50,"./EmptyNotification":61,"./NamedCommand":66,"./SignalCommand":68}],49:[function(require,module,exports){
"use strict";
var __cov_0MjpvFxcVY1n9$6KwaReMA = (Function('return this'))();
if (!__cov_0MjpvFxcVY1n9$6KwaReMA.__coverage__) { __cov_0MjpvFxcVY1n9$6KwaReMA.__coverage__ = {}; }
__cov_0MjpvFxcVY1n9$6KwaReMA = __cov_0MjpvFxcVY1n9$6KwaReMA.__coverage__;
if (!(__cov_0MjpvFxcVY1n9$6KwaReMA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientModelStore.ts'])) {
   __cov_0MjpvFxcVY1n9$6KwaReMA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientModelStore.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientModelStore.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":1,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"79":0,"80":0,"81":0,"82":0,"83":0,"84":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"100":0,"101":0,"102":0,"103":0,"104":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"119":0,"120":0,"121":0,"122":0,"123":0,"124":0,"125":0,"126":0,"127":0,"128":0,"129":0,"130":0,"131":0,"132":0,"133":0,"134":0,"135":0,"136":0,"137":0,"138":0,"139":0,"140":0,"141":0,"142":0,"143":0,"144":0,"145":0,"146":0,"147":0,"148":0,"149":0,"150":0,"151":0,"152":0,"153":0,"154":0,"155":0,"156":0,"157":0,"158":0,"159":0,"160":0,"161":0,"162":0,"163":0,"164":0,"165":0,"166":0,"167":0,"168":0,"169":0,"170":0,"171":0,"172":0,"173":0,"174":0,"175":0,"176":0,"177":0,"178":0,"179":0,"180":0,"181":0,"182":0,"183":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0],"12":[0,0],"13":[0,0],"14":[0,0],"15":[0,0],"16":[0,0],"17":[0,0],"18":[0,0],"19":[0,0],"20":[0,0],"21":[0,0],"22":[0,0],"23":[0,0],"24":[0,0],"25":[0,0],"26":[0,0],"27":[0,0],"28":[0,0],"29":[0,0],"30":[0,0],"31":[0,0],"32":[0,0],"33":[0,0],"34":[0,0],"35":[0,0],"36":[0,0],"37":[0,0],"38":[0,0],"39":[0,0],"40":[0,0],"41":[0,0],"42":[0,0],"43":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0},"fnMap":{"1":{"name":"(anonymous_1)","line":12,"loc":{"start":{"line":12,"column":1},"end":{"line":12,"column":17}}},"2":{"name":"(anonymous_2)","line":16,"loc":{"start":{"line":16,"column":24},"end":{"line":16,"column":36}}},"3":{"name":"ClientModelStore","line":17,"loc":{"start":{"line":17,"column":4},"end":{"line":17,"column":45}}},"4":{"name":"(anonymous_4)","line":25,"loc":{"start":{"line":25,"column":50},"end":{"line":25,"column":62}}},"5":{"name":"(anonymous_5)","line":28,"loc":{"start":{"line":28,"column":47},"end":{"line":28,"column":64}}},"6":{"name":"(anonymous_6)","line":36,"loc":{"start":{"line":36,"column":38},"end":{"line":36,"column":59}}},"7":{"name":"(anonymous_7)","line":40,"loc":{"start":{"line":40,"column":51},"end":{"line":40,"column":72}}},"8":{"name":"(anonymous_8)","line":48,"loc":{"start":{"line":48,"column":32},"end":{"line":48,"column":47}}},"9":{"name":"(anonymous_9)","line":52,"loc":{"start":{"line":52,"column":57},"end":{"line":52,"column":73}}},"10":{"name":"(anonymous_10)","line":55,"loc":{"start":{"line":55,"column":30},"end":{"line":55,"column":46}}},"11":{"name":"(anonymous_11)","line":60,"loc":{"start":{"line":60,"column":36},"end":{"line":60,"column":51}}},"12":{"name":"(anonymous_12)","line":65,"loc":{"start":{"line":65,"column":37},"end":{"line":65,"column":54}}},"13":{"name":"(anonymous_13)","line":82,"loc":{"start":{"line":82,"column":40},"end":{"line":82,"column":57}}},"14":{"name":"(anonymous_14)","line":91,"loc":{"start":{"line":91,"column":42},"end":{"line":91,"column":63}}},"15":{"name":"(anonymous_15)","line":102,"loc":{"start":{"line":102,"column":56},"end":{"line":102,"column":74}}},"16":{"name":"(anonymous_16)","line":104,"loc":{"start":{"line":104,"column":40},"end":{"line":104,"column":57}}},"17":{"name":"(anonymous_17)","line":105,"loc":{"start":{"line":105,"column":42},"end":{"line":105,"column":58}}},"18":{"name":"(anonymous_18)","line":113,"loc":{"start":{"line":113,"column":60},"end":{"line":113,"column":77}}},"19":{"name":"(anonymous_19)","line":130,"loc":{"start":{"line":130,"column":63},"end":{"line":130,"column":80}}},"20":{"name":"(anonymous_20)","line":145,"loc":{"start":{"line":145,"column":58},"end":{"line":145,"column":70}}},"21":{"name":"(anonymous_21)","line":155,"loc":{"start":{"line":155,"column":56},"end":{"line":155,"column":68}}},"22":{"name":"(anonymous_22)","line":165,"loc":{"start":{"line":165,"column":59},"end":{"line":165,"column":73}}},"23":{"name":"(anonymous_23)","line":168,"loc":{"start":{"line":168,"column":64},"end":{"line":168,"column":80}}},"24":{"name":"(anonymous_24)","line":174,"loc":{"start":{"line":174,"column":66},"end":{"line":174,"column":99}}},"25":{"name":"(anonymous_25)","line":177,"loc":{"start":{"line":177,"column":35},"end":{"line":177,"column":49}}},"26":{"name":"(anonymous_26)","line":182,"loc":{"start":{"line":182,"column":57},"end":{"line":182,"column":82}}},"27":{"name":"(anonymous_27)","line":194,"loc":{"start":{"line":194,"column":59},"end":{"line":194,"column":73}}},"28":{"name":"(anonymous_28)","line":197,"loc":{"start":{"line":197,"column":50},"end":{"line":197,"column":71}}},"29":{"name":"(anonymous_29)","line":203,"loc":{"start":{"line":203,"column":53},"end":{"line":203,"column":74}}},"30":{"name":"(anonymous_30)","line":209,"loc":{"start":{"line":209,"column":51},"end":{"line":209,"column":65}}},"31":{"name":"(anonymous_31)","line":212,"loc":{"start":{"line":212,"column":57},"end":{"line":212,"column":78}}},"32":{"name":"(anonymous_32)","line":225,"loc":{"start":{"line":225,"column":60},"end":{"line":225,"column":81}}},"33":{"name":"(anonymous_33)","line":240,"loc":{"start":{"line":240,"column":62},"end":{"line":240,"column":83}}},"34":{"name":"(anonymous_34)","line":246,"loc":{"start":{"line":246,"column":52},"end":{"line":246,"column":76}}},"35":{"name":"(anonymous_35)","line":249,"loc":{"start":{"line":249,"column":59},"end":{"line":249,"column":106}}},"36":{"name":"(anonymous_36)","line":250,"loc":{"start":{"line":250,"column":41},"end":{"line":250,"column":65}}}},"statementMap":{"1":{"start":{"line":3,"column":0},"end":{"line":3,"column":26}},"2":{"start":{"line":4,"column":0},"end":{"line":4,"column":41}},"3":{"start":{"line":5,"column":0},"end":{"line":5,"column":83}},"4":{"start":{"line":6,"column":0},"end":{"line":6,"column":83}},"5":{"start":{"line":7,"column":0},"end":{"line":7,"column":115}},"6":{"start":{"line":8,"column":0},"end":{"line":8,"column":95}},"7":{"start":{"line":9,"column":0},"end":{"line":9,"column":39}},"8":{"start":{"line":10,"column":0},"end":{"line":10,"column":61}},"9":{"start":{"line":11,"column":0},"end":{"line":11,"column":9}},"10":{"start":{"line":12,"column":0},"end":{"line":15,"column":47}},"11":{"start":{"line":13,"column":4},"end":{"line":13,"column":44}},"12":{"start":{"line":14,"column":4},"end":{"line":14,"column":50}},"13":{"start":{"line":16,"column":0},"end":{"line":257,"column":5}},"14":{"start":{"line":17,"column":4},"end":{"line":24,"column":5}},"15":{"start":{"line":18,"column":8},"end":{"line":18,"column":43}},"16":{"start":{"line":19,"column":8},"end":{"line":19,"column":44}},"17":{"start":{"line":20,"column":8},"end":{"line":20,"column":51}},"18":{"start":{"line":21,"column":8},"end":{"line":21,"column":41}},"19":{"start":{"line":22,"column":8},"end":{"line":22,"column":48}},"20":{"start":{"line":23,"column":8},"end":{"line":23,"column":63}},"21":{"start":{"line":25,"column":4},"end":{"line":27,"column":6}},"22":{"start":{"line":26,"column":8},"end":{"line":26,"column":34}},"23":{"start":{"line":28,"column":4},"end":{"line":39,"column":6}},"24":{"start":{"line":29,"column":8},"end":{"line":29,"column":25}},"25":{"start":{"line":30,"column":8},"end":{"line":32,"column":9}},"26":{"start":{"line":31,"column":12},"end":{"line":31,"column":19}},"27":{"start":{"line":33,"column":8},"end":{"line":33,"column":64}},"28":{"start":{"line":34,"column":8},"end":{"line":34,"column":85}},"29":{"start":{"line":35,"column":8},"end":{"line":35,"column":46}},"30":{"start":{"line":36,"column":8},"end":{"line":38,"column":11}},"31":{"start":{"line":37,"column":12},"end":{"line":37,"column":47}},"32":{"start":{"line":40,"column":4},"end":{"line":64,"column":6}},"33":{"start":{"line":41,"column":8},"end":{"line":41,"column":25}},"34":{"start":{"line":42,"column":8},"end":{"line":42,"column":41}},"35":{"start":{"line":43,"column":8},"end":{"line":45,"column":9}},"36":{"start":{"line":44,"column":12},"end":{"line":44,"column":52}},"37":{"start":{"line":48,"column":8},"end":{"line":59,"column":11}},"38":{"start":{"line":49,"column":12},"end":{"line":49,"column":116}},"39":{"start":{"line":50,"column":12},"end":{"line":50,"column":84}},"40":{"start":{"line":51,"column":12},"end":{"line":58,"column":13}},"41":{"start":{"line":52,"column":16},"end":{"line":54,"column":19}},"42":{"start":{"line":53,"column":20},"end":{"line":53,"column":97}},"43":{"start":{"line":55,"column":16},"end":{"line":57,"column":19}},"44":{"start":{"line":56,"column":20},"end":{"line":56,"column":56}},"45":{"start":{"line":60,"column":8},"end":{"line":63,"column":11}},"46":{"start":{"line":61,"column":12},"end":{"line":61,"column":159}},"47":{"start":{"line":62,"column":12},"end":{"line":62,"column":87}},"48":{"start":{"line":65,"column":4},"end":{"line":81,"column":6}},"49":{"start":{"line":66,"column":8},"end":{"line":68,"column":9}},"50":{"start":{"line":67,"column":12},"end":{"line":67,"column":25}},"51":{"start":{"line":69,"column":8},"end":{"line":71,"column":9}},"52":{"start":{"line":70,"column":12},"end":{"line":70,"column":69}},"53":{"start":{"line":72,"column":8},"end":{"line":72,"column":26}},"54":{"start":{"line":73,"column":8},"end":{"line":79,"column":9}},"55":{"start":{"line":74,"column":12},"end":{"line":74,"column":57}},"56":{"start":{"line":75,"column":12},"end":{"line":75,"column":51}},"57":{"start":{"line":76,"column":12},"end":{"line":76,"column":38}},"58":{"start":{"line":77,"column":12},"end":{"line":77,"column":108}},"59":{"start":{"line":78,"column":12},"end":{"line":78,"column":25}},"60":{"start":{"line":80,"column":8},"end":{"line":80,"column":21}},"61":{"start":{"line":82,"column":4},"end":{"line":101,"column":6}},"62":{"start":{"line":83,"column":8},"end":{"line":83,"column":25}},"63":{"start":{"line":84,"column":8},"end":{"line":86,"column":9}},"64":{"start":{"line":85,"column":12},"end":{"line":85,"column":25}},"65":{"start":{"line":87,"column":8},"end":{"line":87,"column":28}},"66":{"start":{"line":88,"column":8},"end":{"line":99,"column":9}},"67":{"start":{"line":89,"column":12},"end":{"line":89,"column":54}},"68":{"start":{"line":90,"column":12},"end":{"line":90,"column":56}},"69":{"start":{"line":91,"column":12},"end":{"line":96,"column":15}},"70":{"start":{"line":92,"column":16},"end":{"line":92,"column":53}},"71":{"start":{"line":93,"column":16},"end":{"line":95,"column":17}},"72":{"start":{"line":94,"column":20},"end":{"line":94,"column":64}},"73":{"start":{"line":97,"column":12},"end":{"line":97,"column":110}},"74":{"start":{"line":98,"column":12},"end":{"line":98,"column":27}},"75":{"start":{"line":100,"column":8},"end":{"line":100,"column":23}},"76":{"start":{"line":102,"column":4},"end":{"line":112,"column":6}},"77":{"start":{"line":103,"column":8},"end":{"line":103,"column":25}},"78":{"start":{"line":104,"column":8},"end":{"line":110,"column":11}},"79":{"start":{"line":105,"column":12},"end":{"line":109,"column":15}},"80":{"start":{"line":106,"column":16},"end":{"line":108,"column":17}},"81":{"start":{"line":107,"column":20},"end":{"line":107,"column":39}},"82":{"start":{"line":111,"column":8},"end":{"line":111,"column":23}},"83":{"start":{"line":113,"column":4},"end":{"line":129,"column":6}},"84":{"start":{"line":114,"column":8},"end":{"line":116,"column":9}},"85":{"start":{"line":115,"column":12},"end":{"line":115,"column":19}},"86":{"start":{"line":117,"column":8},"end":{"line":117,"column":47}},"87":{"start":{"line":118,"column":8},"end":{"line":120,"column":9}},"88":{"start":{"line":119,"column":12},"end":{"line":119,"column":19}},"89":{"start":{"line":121,"column":8},"end":{"line":121,"column":74}},"90":{"start":{"line":122,"column":8},"end":{"line":125,"column":9}},"91":{"start":{"line":123,"column":12},"end":{"line":123,"column":36}},"92":{"start":{"line":124,"column":12},"end":{"line":124,"column":73}},"93":{"start":{"line":126,"column":8},"end":{"line":128,"column":9}},"94":{"start":{"line":127,"column":12},"end":{"line":127,"column":43}},"95":{"start":{"line":130,"column":4},"end":{"line":144,"column":6}},"96":{"start":{"line":131,"column":8},"end":{"line":133,"column":9}},"97":{"start":{"line":132,"column":12},"end":{"line":132,"column":19}},"98":{"start":{"line":134,"column":8},"end":{"line":134,"column":97}},"99":{"start":{"line":135,"column":8},"end":{"line":137,"column":9}},"100":{"start":{"line":136,"column":12},"end":{"line":136,"column":19}},"101":{"start":{"line":138,"column":8},"end":{"line":140,"column":9}},"102":{"start":{"line":139,"column":12},"end":{"line":139,"column":76}},"103":{"start":{"line":141,"column":8},"end":{"line":143,"column":9}},"104":{"start":{"line":142,"column":12},"end":{"line":142,"column":82}},"105":{"start":{"line":145,"column":4},"end":{"line":154,"column":6}},"106":{"start":{"line":146,"column":8},"end":{"line":146,"column":24}},"107":{"start":{"line":147,"column":8},"end":{"line":147,"column":50}},"108":{"start":{"line":148,"column":8},"end":{"line":148,"column":31}},"109":{"start":{"line":149,"column":8},"end":{"line":152,"column":9}},"110":{"start":{"line":150,"column":12},"end":{"line":150,"column":36}},"111":{"start":{"line":151,"column":12},"end":{"line":151,"column":31}},"112":{"start":{"line":153,"column":8},"end":{"line":153,"column":22}},"113":{"start":{"line":155,"column":4},"end":{"line":164,"column":6}},"114":{"start":{"line":156,"column":8},"end":{"line":156,"column":24}},"115":{"start":{"line":157,"column":8},"end":{"line":157,"column":52}},"116":{"start":{"line":158,"column":8},"end":{"line":158,"column":31}},"117":{"start":{"line":159,"column":8},"end":{"line":162,"column":9}},"118":{"start":{"line":160,"column":12},"end":{"line":160,"column":36}},"119":{"start":{"line":161,"column":12},"end":{"line":161,"column":31}},"120":{"start":{"line":163,"column":8},"end":{"line":163,"column":22}},"121":{"start":{"line":165,"column":4},"end":{"line":167,"column":6}},"122":{"start":{"line":166,"column":8},"end":{"line":166,"column":47}},"123":{"start":{"line":168,"column":4},"end":{"line":173,"column":6}},"124":{"start":{"line":169,"column":8},"end":{"line":171,"column":9}},"125":{"start":{"line":170,"column":12},"end":{"line":170,"column":22}},"126":{"start":{"line":172,"column":8},"end":{"line":172,"column":65}},"127":{"start":{"line":174,"column":4},"end":{"line":181,"column":6}},"128":{"start":{"line":175,"column":8},"end":{"line":175,"column":25}},"129":{"start":{"line":176,"column":8},"end":{"line":176,"column":92}},"130":{"start":{"line":177,"column":8},"end":{"line":179,"column":11}},"131":{"start":{"line":178,"column":12},"end":{"line":178,"column":53}},"132":{"start":{"line":180,"column":8},"end":{"line":180,"column":152}},"133":{"start":{"line":182,"column":4},"end":{"line":193,"column":6}},"134":{"start":{"line":183,"column":8},"end":{"line":185,"column":9}},"135":{"start":{"line":184,"column":12},"end":{"line":184,"column":19}},"136":{"start":{"line":186,"column":8},"end":{"line":192,"column":9}},"137":{"start":{"line":187,"column":12},"end":{"line":187,"column":31}},"138":{"start":{"line":188,"column":12},"end":{"line":190,"column":13}},"139":{"start":{"line":189,"column":16},"end":{"line":189,"column":23}},"140":{"start":{"line":191,"column":12},"end":{"line":191,"column":128}},"141":{"start":{"line":194,"column":4},"end":{"line":196,"column":6}},"142":{"start":{"line":195,"column":8},"end":{"line":195,"column":47}},"143":{"start":{"line":197,"column":4},"end":{"line":202,"column":6}},"144":{"start":{"line":198,"column":8},"end":{"line":200,"column":9}},"145":{"start":{"line":199,"column":12},"end":{"line":199,"column":19}},"146":{"start":{"line":201,"column":8},"end":{"line":201,"column":58}},"147":{"start":{"line":203,"column":4},"end":{"line":208,"column":6}},"148":{"start":{"line":204,"column":8},"end":{"line":206,"column":9}},"149":{"start":{"line":205,"column":12},"end":{"line":205,"column":19}},"150":{"start":{"line":207,"column":8},"end":{"line":207,"column":53}},"151":{"start":{"line":209,"column":4},"end":{"line":211,"column":6}},"152":{"start":{"line":210,"column":8},"end":{"line":210,"column":44}},"153":{"start":{"line":212,"column":4},"end":{"line":224,"column":6}},"154":{"start":{"line":213,"column":8},"end":{"line":215,"column":9}},"155":{"start":{"line":214,"column":12},"end":{"line":214,"column":19}},"156":{"start":{"line":216,"column":8},"end":{"line":216,"column":83}},"157":{"start":{"line":217,"column":8},"end":{"line":220,"column":9}},"158":{"start":{"line":218,"column":12},"end":{"line":218,"column":28}},"159":{"start":{"line":219,"column":12},"end":{"line":219,"column":82}},"160":{"start":{"line":221,"column":8},"end":{"line":223,"column":9}},"161":{"start":{"line":222,"column":12},"end":{"line":222,"column":39}},"162":{"start":{"line":225,"column":4},"end":{"line":239,"column":6}},"163":{"start":{"line":226,"column":8},"end":{"line":228,"column":9}},"164":{"start":{"line":227,"column":12},"end":{"line":227,"column":19}},"165":{"start":{"line":229,"column":8},"end":{"line":229,"column":83}},"166":{"start":{"line":230,"column":8},"end":{"line":232,"column":9}},"167":{"start":{"line":231,"column":12},"end":{"line":231,"column":19}},"168":{"start":{"line":233,"column":8},"end":{"line":235,"column":9}},"169":{"start":{"line":234,"column":12},"end":{"line":234,"column":64}},"170":{"start":{"line":236,"column":8},"end":{"line":238,"column":9}},"171":{"start":{"line":237,"column":12},"end":{"line":237,"column":76}},"172":{"start":{"line":240,"column":4},"end":{"line":245,"column":6}},"173":{"start":{"line":241,"column":8},"end":{"line":243,"column":9}},"174":{"start":{"line":242,"column":12},"end":{"line":242,"column":22}},"175":{"start":{"line":244,"column":8},"end":{"line":244,"column":67}},"176":{"start":{"line":246,"column":4},"end":{"line":248,"column":6}},"177":{"start":{"line":247,"column":8},"end":{"line":247,"column":55}},"178":{"start":{"line":249,"column":4},"end":{"line":255,"column":6}},"179":{"start":{"line":250,"column":8},"end":{"line":254,"column":11}},"180":{"start":{"line":251,"column":12},"end":{"line":253,"column":13}},"181":{"start":{"line":252,"column":16},"end":{"line":252,"column":43}},"182":{"start":{"line":256,"column":4},"end":{"line":256,"column":28}},"183":{"start":{"line":258,"column":0},"end":{"line":258,"column":44}}},"branchMap":{"1":{"line":15,"type":"binary-expr","locations":[{"start":{"line":15,"column":10},"end":{"line":15,"column":22}},{"start":{"line":15,"column":27},"end":{"line":15,"column":44}}]},"2":{"line":30,"type":"if","locations":[{"start":{"line":30,"column":8},"end":{"line":30,"column":8}},{"start":{"line":30,"column":8},"end":{"line":30,"column":8}}]},"3":{"line":43,"type":"if","locations":[{"start":{"line":43,"column":8},"end":{"line":43,"column":8}},{"start":{"line":43,"column":8},"end":{"line":43,"column":8}}]},"4":{"line":51,"type":"if","locations":[{"start":{"line":51,"column":12},"end":{"line":51,"column":12}},{"start":{"line":51,"column":12},"end":{"line":51,"column":12}}]},"5":{"line":53,"type":"binary-expr","locations":[{"start":{"line":53,"column":27},"end":{"line":53,"column":45}},{"start":{"line":53,"column":49},"end":{"line":53,"column":96}}]},"6":{"line":66,"type":"if","locations":[{"start":{"line":66,"column":8},"end":{"line":66,"column":8}},{"start":{"line":66,"column":8},"end":{"line":66,"column":8}}]},"7":{"line":69,"type":"if","locations":[{"start":{"line":69,"column":8},"end":{"line":69,"column":8}},{"start":{"line":69,"column":8},"end":{"line":69,"column":8}}]},"8":{"line":73,"type":"if","locations":[{"start":{"line":73,"column":8},"end":{"line":73,"column":8}},{"start":{"line":73,"column":8},"end":{"line":73,"column":8}}]},"9":{"line":84,"type":"if","locations":[{"start":{"line":84,"column":8},"end":{"line":84,"column":8}},{"start":{"line":84,"column":8},"end":{"line":84,"column":8}}]},"10":{"line":88,"type":"if","locations":[{"start":{"line":88,"column":8},"end":{"line":88,"column":8}},{"start":{"line":88,"column":8},"end":{"line":88,"column":8}}]},"11":{"line":93,"type":"if","locations":[{"start":{"line":93,"column":16},"end":{"line":93,"column":16}},{"start":{"line":93,"column":16},"end":{"line":93,"column":16}}]},"12":{"line":106,"type":"if","locations":[{"start":{"line":106,"column":16},"end":{"line":106,"column":16}},{"start":{"line":106,"column":16},"end":{"line":106,"column":16}}]},"13":{"line":114,"type":"if","locations":[{"start":{"line":114,"column":8},"end":{"line":114,"column":8}},{"start":{"line":114,"column":8},"end":{"line":114,"column":8}}]},"14":{"line":118,"type":"if","locations":[{"start":{"line":118,"column":8},"end":{"line":118,"column":8}},{"start":{"line":118,"column":8},"end":{"line":118,"column":8}}]},"15":{"line":122,"type":"if","locations":[{"start":{"line":122,"column":8},"end":{"line":122,"column":8}},{"start":{"line":122,"column":8},"end":{"line":122,"column":8}}]},"16":{"line":126,"type":"if","locations":[{"start":{"line":126,"column":8},"end":{"line":126,"column":8}},{"start":{"line":126,"column":8},"end":{"line":126,"column":8}}]},"17":{"line":131,"type":"if","locations":[{"start":{"line":131,"column":8},"end":{"line":131,"column":8}},{"start":{"line":131,"column":8},"end":{"line":131,"column":8}}]},"18":{"line":131,"type":"binary-expr","locations":[{"start":{"line":131,"column":12},"end":{"line":131,"column":18}},{"start":{"line":131,"column":22},"end":{"line":131,"column":52}}]},"19":{"line":135,"type":"if","locations":[{"start":{"line":135,"column":8},"end":{"line":135,"column":8}},{"start":{"line":135,"column":8},"end":{"line":135,"column":8}}]},"20":{"line":138,"type":"if","locations":[{"start":{"line":138,"column":8},"end":{"line":138,"column":8}},{"start":{"line":138,"column":8},"end":{"line":138,"column":8}}]},"21":{"line":141,"type":"if","locations":[{"start":{"line":141,"column":8},"end":{"line":141,"column":8}},{"start":{"line":141,"column":8},"end":{"line":141,"column":8}}]},"22":{"line":169,"type":"if","locations":[{"start":{"line":169,"column":8},"end":{"line":169,"column":8}},{"start":{"line":169,"column":8},"end":{"line":169,"column":8}}]},"23":{"line":169,"type":"binary-expr","locations":[{"start":{"line":169,"column":12},"end":{"line":169,"column":17}},{"start":{"line":169,"column":21},"end":{"line":169,"column":62}}]},"24":{"line":183,"type":"if","locations":[{"start":{"line":183,"column":8},"end":{"line":183,"column":8}},{"start":{"line":183,"column":8},"end":{"line":183,"column":8}}]},"25":{"line":186,"type":"if","locations":[{"start":{"line":186,"column":8},"end":{"line":186,"column":8}},{"start":{"line":186,"column":8},"end":{"line":186,"column":8}}]},"26":{"line":188,"type":"if","locations":[{"start":{"line":188,"column":12},"end":{"line":188,"column":12}},{"start":{"line":188,"column":12},"end":{"line":188,"column":12}}]},"27":{"line":188,"type":"binary-expr","locations":[{"start":{"line":188,"column":16},"end":{"line":188,"column":23}},{"start":{"line":188,"column":27},"end":{"line":188,"column":47}}]},"28":{"line":198,"type":"if","locations":[{"start":{"line":198,"column":8},"end":{"line":198,"column":8}},{"start":{"line":198,"column":8},"end":{"line":198,"column":8}}]},"29":{"line":198,"type":"binary-expr","locations":[{"start":{"line":198,"column":12},"end":{"line":198,"column":22}},{"start":{"line":198,"column":26},"end":{"line":198,"column":64}}]},"30":{"line":204,"type":"if","locations":[{"start":{"line":204,"column":8},"end":{"line":204,"column":8}},{"start":{"line":204,"column":8},"end":{"line":204,"column":8}}]},"31":{"line":204,"type":"binary-expr","locations":[{"start":{"line":204,"column":12},"end":{"line":204,"column":22}},{"start":{"line":204,"column":26},"end":{"line":204,"column":65}}]},"32":{"line":213,"type":"if","locations":[{"start":{"line":213,"column":8},"end":{"line":213,"column":8}},{"start":{"line":213,"column":8},"end":{"line":213,"column":8}}]},"33":{"line":213,"type":"binary-expr","locations":[{"start":{"line":213,"column":12},"end":{"line":213,"column":22}},{"start":{"line":213,"column":26},"end":{"line":213,"column":51}}]},"34":{"line":217,"type":"if","locations":[{"start":{"line":217,"column":8},"end":{"line":217,"column":8}},{"start":{"line":217,"column":8},"end":{"line":217,"column":8}}]},"35":{"line":221,"type":"if","locations":[{"start":{"line":221,"column":8},"end":{"line":221,"column":8}},{"start":{"line":221,"column":8},"end":{"line":221,"column":8}}]},"36":{"line":226,"type":"if","locations":[{"start":{"line":226,"column":8},"end":{"line":226,"column":8}},{"start":{"line":226,"column":8},"end":{"line":226,"column":8}}]},"37":{"line":226,"type":"binary-expr","locations":[{"start":{"line":226,"column":12},"end":{"line":226,"column":22}},{"start":{"line":226,"column":26},"end":{"line":226,"column":51}}]},"38":{"line":230,"type":"if","locations":[{"start":{"line":230,"column":8},"end":{"line":230,"column":8}},{"start":{"line":230,"column":8},"end":{"line":230,"column":8}}]},"39":{"line":233,"type":"if","locations":[{"start":{"line":233,"column":8},"end":{"line":233,"column":8}},{"start":{"line":233,"column":8},"end":{"line":233,"column":8}}]},"40":{"line":236,"type":"if","locations":[{"start":{"line":236,"column":8},"end":{"line":236,"column":8}},{"start":{"line":236,"column":8},"end":{"line":236,"column":8}}]},"41":{"line":241,"type":"if","locations":[{"start":{"line":241,"column":8},"end":{"line":241,"column":8}},{"start":{"line":241,"column":8},"end":{"line":241,"column":8}}]},"42":{"line":241,"type":"binary-expr","locations":[{"start":{"line":241,"column":12},"end":{"line":241,"column":22}},{"start":{"line":241,"column":26},"end":{"line":241,"column":69}}]},"43":{"line":251,"type":"if","locations":[{"start":{"line":251,"column":12},"end":{"line":251,"column":12}},{"start":{"line":251,"column":12},"end":{"line":251,"column":12}}]}}};
}
__cov_0MjpvFxcVY1n9$6KwaReMA = __cov_0MjpvFxcVY1n9$6KwaReMA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientModelStore.ts'];
__cov_0MjpvFxcVY1n9$6KwaReMA.s['1']++;exports.__esModule=true;__cov_0MjpvFxcVY1n9$6KwaReMA.s['2']++;var Attribute_1=require('./Attribute');__cov_0MjpvFxcVY1n9$6KwaReMA.s['3']++;var ChangeAttributeMetadataCommand_1=require('./ChangeAttributeMetadataCommand');__cov_0MjpvFxcVY1n9$6KwaReMA.s['4']++;var CreatePresentationModelCommand_1=require('./CreatePresentationModelCommand');__cov_0MjpvFxcVY1n9$6KwaReMA.s['5']++;var DeletedAllPresentationModelsOfTypeNotification_1=require('./DeletedAllPresentationModelsOfTypeNotification');__cov_0MjpvFxcVY1n9$6KwaReMA.s['6']++;var DeletedPresentationModelNotification_1=require('./DeletedPresentationModelNotification');__cov_0MjpvFxcVY1n9$6KwaReMA.s['7']++;var EventBus_1=require('./EventBus');__cov_0MjpvFxcVY1n9$6KwaReMA.s['8']++;var ValueChangedCommand_1=require('./ValueChangedCommand');__cov_0MjpvFxcVY1n9$6KwaReMA.s['9']++;var Type;__cov_0MjpvFxcVY1n9$6KwaReMA.s['10']++;(function(Type){__cov_0MjpvFxcVY1n9$6KwaReMA.f['1']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['11']++;Type[Type['ADDED']='ADDED']='ADDED';__cov_0MjpvFxcVY1n9$6KwaReMA.s['12']++;Type[Type['REMOVED']='REMOVED']='REMOVED';}(Type=(__cov_0MjpvFxcVY1n9$6KwaReMA.b['1'][0]++,exports.Type)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['1'][1]++,exports.Type={})));__cov_0MjpvFxcVY1n9$6KwaReMA.s['13']++;var ClientModelStore=function(){__cov_0MjpvFxcVY1n9$6KwaReMA.f['2']++;function ClientModelStore(clientDolphin){__cov_0MjpvFxcVY1n9$6KwaReMA.f['3']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['15']++;this.clientDolphin=clientDolphin;__cov_0MjpvFxcVY1n9$6KwaReMA.s['16']++;this.presentationModels=new Map();__cov_0MjpvFxcVY1n9$6KwaReMA.s['17']++;this.presentationModelsPerType=new Map();__cov_0MjpvFxcVY1n9$6KwaReMA.s['18']++;this.attributesPerId=new Map();__cov_0MjpvFxcVY1n9$6KwaReMA.s['19']++;this.attributesPerQualifier=new Map();__cov_0MjpvFxcVY1n9$6KwaReMA.s['20']++;this.modelStoreChangeBus=new EventBus_1['default']();}__cov_0MjpvFxcVY1n9$6KwaReMA.s['21']++;ClientModelStore.prototype.getClientDolphin=function(){__cov_0MjpvFxcVY1n9$6KwaReMA.f['4']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['22']++;return this.clientDolphin;};__cov_0MjpvFxcVY1n9$6KwaReMA.s['23']++;ClientModelStore.prototype.registerModel=function(model){__cov_0MjpvFxcVY1n9$6KwaReMA.f['5']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['24']++;var _this=this;__cov_0MjpvFxcVY1n9$6KwaReMA.s['25']++;if(model.clientSideOnly){__cov_0MjpvFxcVY1n9$6KwaReMA.b['2'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['26']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['2'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['27']++;var connector=this.clientDolphin.getClientConnector();__cov_0MjpvFxcVY1n9$6KwaReMA.s['28']++;var createPMCommand=new CreatePresentationModelCommand_1['default'](model);__cov_0MjpvFxcVY1n9$6KwaReMA.s['29']++;connector.send(createPMCommand,null);__cov_0MjpvFxcVY1n9$6KwaReMA.s['30']++;model.getAttributes().forEach(function(attribute){__cov_0MjpvFxcVY1n9$6KwaReMA.f['6']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['31']++;_this.registerAttribute(attribute);});};__cov_0MjpvFxcVY1n9$6KwaReMA.s['32']++;ClientModelStore.prototype.registerAttribute=function(attribute){__cov_0MjpvFxcVY1n9$6KwaReMA.f['7']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['33']++;var _this=this;__cov_0MjpvFxcVY1n9$6KwaReMA.s['34']++;this.addAttributeById(attribute);__cov_0MjpvFxcVY1n9$6KwaReMA.s['35']++;if(attribute.getQualifier()){__cov_0MjpvFxcVY1n9$6KwaReMA.b['3'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['36']++;this.addAttributeByQualifier(attribute);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['3'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['37']++;attribute.onValueChange(function(evt){__cov_0MjpvFxcVY1n9$6KwaReMA.f['8']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['38']++;var valueChangeCommand=new ValueChangedCommand_1['default'](attribute.id,evt.oldValue,evt.newValue);__cov_0MjpvFxcVY1n9$6KwaReMA.s['39']++;_this.clientDolphin.getClientConnector().send(valueChangeCommand,null);__cov_0MjpvFxcVY1n9$6KwaReMA.s['40']++;if(attribute.getQualifier()){__cov_0MjpvFxcVY1n9$6KwaReMA.b['4'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['41']++;var attrs=_this.findAttributesByFilter(function(attr){__cov_0MjpvFxcVY1n9$6KwaReMA.f['9']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['42']++;return(__cov_0MjpvFxcVY1n9$6KwaReMA.b['5'][0]++,attr!==attribute)&&(__cov_0MjpvFxcVY1n9$6KwaReMA.b['5'][1]++,attr.getQualifier()==attribute.getQualifier());});__cov_0MjpvFxcVY1n9$6KwaReMA.s['43']++;attrs.forEach(function(attr){__cov_0MjpvFxcVY1n9$6KwaReMA.f['10']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['44']++;attr.setValue(attribute.getValue());});}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['4'][1]++;}});__cov_0MjpvFxcVY1n9$6KwaReMA.s['45']++;attribute.onQualifierChange(function(evt){__cov_0MjpvFxcVY1n9$6KwaReMA.f['11']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['46']++;var changeAttrMetadataCmd=new ChangeAttributeMetadataCommand_1['default'](attribute.id,Attribute_1['default'].QUALIFIER_PROPERTY,evt.newValue);__cov_0MjpvFxcVY1n9$6KwaReMA.s['47']++;_this.clientDolphin.getClientConnector().send(changeAttrMetadataCmd,null);});};__cov_0MjpvFxcVY1n9$6KwaReMA.s['48']++;ClientModelStore.prototype.add=function(model){__cov_0MjpvFxcVY1n9$6KwaReMA.f['12']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['49']++;if(!model){__cov_0MjpvFxcVY1n9$6KwaReMA.b['6'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['50']++;return false;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['6'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['51']++;if(this.presentationModels.has(model.id)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['7'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['52']++;console.log('There already is a PM with id '+model.id);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['7'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['53']++;var added=false;__cov_0MjpvFxcVY1n9$6KwaReMA.s['54']++;if(!this.presentationModels.has(model.id)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['8'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['55']++;this.presentationModels.set(model.id,model);__cov_0MjpvFxcVY1n9$6KwaReMA.s['56']++;this.addPresentationModelByType(model);__cov_0MjpvFxcVY1n9$6KwaReMA.s['57']++;this.registerModel(model);__cov_0MjpvFxcVY1n9$6KwaReMA.s['58']++;this.modelStoreChangeBus.trigger({'eventType':Type.ADDED,'clientPresentationModel':model});__cov_0MjpvFxcVY1n9$6KwaReMA.s['59']++;added=true;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['8'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['60']++;return added;};__cov_0MjpvFxcVY1n9$6KwaReMA.s['61']++;ClientModelStore.prototype.remove=function(model){__cov_0MjpvFxcVY1n9$6KwaReMA.f['13']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['62']++;var _this=this;__cov_0MjpvFxcVY1n9$6KwaReMA.s['63']++;if(!model){__cov_0MjpvFxcVY1n9$6KwaReMA.b['9'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['64']++;return false;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['9'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['65']++;var removed=false;__cov_0MjpvFxcVY1n9$6KwaReMA.s['66']++;if(this.presentationModels.has(model.id)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['10'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['67']++;this.removePresentationModelByType(model);__cov_0MjpvFxcVY1n9$6KwaReMA.s['68']++;this.presentationModels['delete'](model.id);__cov_0MjpvFxcVY1n9$6KwaReMA.s['69']++;model.getAttributes().forEach(function(attribute){__cov_0MjpvFxcVY1n9$6KwaReMA.f['14']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['70']++;_this.removeAttributeById(attribute);__cov_0MjpvFxcVY1n9$6KwaReMA.s['71']++;if(attribute.getQualifier()){__cov_0MjpvFxcVY1n9$6KwaReMA.b['11'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['72']++;_this.removeAttributeByQualifier(attribute);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['11'][1]++;}});__cov_0MjpvFxcVY1n9$6KwaReMA.s['73']++;this.modelStoreChangeBus.trigger({'eventType':Type.REMOVED,'clientPresentationModel':model});__cov_0MjpvFxcVY1n9$6KwaReMA.s['74']++;removed=true;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['10'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['75']++;return removed;};__cov_0MjpvFxcVY1n9$6KwaReMA.s['76']++;ClientModelStore.prototype.findAttributesByFilter=function(filter){__cov_0MjpvFxcVY1n9$6KwaReMA.f['15']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['77']++;var matches=[];__cov_0MjpvFxcVY1n9$6KwaReMA.s['78']++;this.presentationModels.forEach(function(model){__cov_0MjpvFxcVY1n9$6KwaReMA.f['16']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['79']++;model.getAttributes().forEach(function(attr){__cov_0MjpvFxcVY1n9$6KwaReMA.f['17']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['80']++;if(filter(attr)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['12'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['81']++;matches.push(attr);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['12'][1]++;}});});__cov_0MjpvFxcVY1n9$6KwaReMA.s['82']++;return matches;};__cov_0MjpvFxcVY1n9$6KwaReMA.s['83']++;ClientModelStore.prototype.addPresentationModelByType=function(model){__cov_0MjpvFxcVY1n9$6KwaReMA.f['18']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['84']++;if(!model){__cov_0MjpvFxcVY1n9$6KwaReMA.b['13'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['85']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['13'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['86']++;var type=model.presentationModelType;__cov_0MjpvFxcVY1n9$6KwaReMA.s['87']++;if(!type){__cov_0MjpvFxcVY1n9$6KwaReMA.b['14'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['88']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['14'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['89']++;var presentationModels=this.presentationModelsPerType.get(type);__cov_0MjpvFxcVY1n9$6KwaReMA.s['90']++;if(!presentationModels){__cov_0MjpvFxcVY1n9$6KwaReMA.b['15'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['91']++;presentationModels=[];__cov_0MjpvFxcVY1n9$6KwaReMA.s['92']++;this.presentationModelsPerType.set(type,presentationModels);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['15'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['93']++;if(!(presentationModels.indexOf(model)>-1)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['16'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['94']++;presentationModels.push(model);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['16'][1]++;}};__cov_0MjpvFxcVY1n9$6KwaReMA.s['95']++;ClientModelStore.prototype.removePresentationModelByType=function(model){__cov_0MjpvFxcVY1n9$6KwaReMA.f['19']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['96']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['18'][0]++,!model)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['18'][1]++,!model.presentationModelType)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['17'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['97']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['17'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['98']++;var presentationModels=this.presentationModelsPerType.get(model.presentationModelType);__cov_0MjpvFxcVY1n9$6KwaReMA.s['99']++;if(!presentationModels){__cov_0MjpvFxcVY1n9$6KwaReMA.b['19'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['100']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['19'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['101']++;if(presentationModels.length>-1){__cov_0MjpvFxcVY1n9$6KwaReMA.b['20'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['102']++;presentationModels.splice(presentationModels.indexOf(model),1);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['20'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['103']++;if(presentationModels.length===0){__cov_0MjpvFxcVY1n9$6KwaReMA.b['21'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['104']++;this.presentationModelsPerType['delete'](model.presentationModelType);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['21'][1]++;}};__cov_0MjpvFxcVY1n9$6KwaReMA.s['105']++;ClientModelStore.prototype.listPresentationModelIds=function(){__cov_0MjpvFxcVY1n9$6KwaReMA.f['20']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['106']++;var result=[];__cov_0MjpvFxcVY1n9$6KwaReMA.s['107']++;var iter=this.presentationModels.keys();__cov_0MjpvFxcVY1n9$6KwaReMA.s['108']++;var next=iter.next();__cov_0MjpvFxcVY1n9$6KwaReMA.s['109']++;while(!next.done){__cov_0MjpvFxcVY1n9$6KwaReMA.s['110']++;result.push(next.value);__cov_0MjpvFxcVY1n9$6KwaReMA.s['111']++;next=iter.next();}__cov_0MjpvFxcVY1n9$6KwaReMA.s['112']++;return result;};__cov_0MjpvFxcVY1n9$6KwaReMA.s['113']++;ClientModelStore.prototype.listPresentationModels=function(){__cov_0MjpvFxcVY1n9$6KwaReMA.f['21']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['114']++;var result=[];__cov_0MjpvFxcVY1n9$6KwaReMA.s['115']++;var iter=this.presentationModels.values();__cov_0MjpvFxcVY1n9$6KwaReMA.s['116']++;var next=iter.next();__cov_0MjpvFxcVY1n9$6KwaReMA.s['117']++;while(!next.done){__cov_0MjpvFxcVY1n9$6KwaReMA.s['118']++;result.push(next.value);__cov_0MjpvFxcVY1n9$6KwaReMA.s['119']++;next=iter.next();}__cov_0MjpvFxcVY1n9$6KwaReMA.s['120']++;return result;};__cov_0MjpvFxcVY1n9$6KwaReMA.s['121']++;ClientModelStore.prototype.findPresentationModelById=function(id){__cov_0MjpvFxcVY1n9$6KwaReMA.f['22']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['122']++;return this.presentationModels.get(id);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['123']++;ClientModelStore.prototype.findAllPresentationModelByType=function(type){__cov_0MjpvFxcVY1n9$6KwaReMA.f['23']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['124']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['23'][0]++,!type)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['23'][1]++,!this.presentationModelsPerType.has(type))){__cov_0MjpvFxcVY1n9$6KwaReMA.b['22'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['125']++;return[];}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['22'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['126']++;return this.presentationModelsPerType.get(type).slice(0);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['127']++;ClientModelStore.prototype.deleteAllPresentationModelOfType=function(presentationModelType){__cov_0MjpvFxcVY1n9$6KwaReMA.f['24']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['128']++;var _this=this;__cov_0MjpvFxcVY1n9$6KwaReMA.s['129']++;var presentationModels=this.findAllPresentationModelByType(presentationModelType);__cov_0MjpvFxcVY1n9$6KwaReMA.s['130']++;presentationModels.forEach(function(pm){__cov_0MjpvFxcVY1n9$6KwaReMA.f['25']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['131']++;_this.deletePresentationModel(pm,false);});__cov_0MjpvFxcVY1n9$6KwaReMA.s['132']++;this.clientDolphin.getClientConnector().send(new DeletedAllPresentationModelsOfTypeNotification_1['default'](presentationModelType),undefined);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['133']++;ClientModelStore.prototype.deletePresentationModel=function(model,notify){__cov_0MjpvFxcVY1n9$6KwaReMA.f['26']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['134']++;if(!model){__cov_0MjpvFxcVY1n9$6KwaReMA.b['24'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['135']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['24'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['136']++;if(this.containsPresentationModel(model.id)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['25'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['137']++;this.remove(model);__cov_0MjpvFxcVY1n9$6KwaReMA.s['138']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['27'][0]++,!notify)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['27'][1]++,model.clientSideOnly)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['26'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['139']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['26'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['140']++;this.clientDolphin.getClientConnector().send(new DeletedPresentationModelNotification_1['default'](model.id),null);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['25'][1]++;}};__cov_0MjpvFxcVY1n9$6KwaReMA.s['141']++;ClientModelStore.prototype.containsPresentationModel=function(id){__cov_0MjpvFxcVY1n9$6KwaReMA.f['27']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['142']++;return this.presentationModels.has(id);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['143']++;ClientModelStore.prototype.addAttributeById=function(attribute){__cov_0MjpvFxcVY1n9$6KwaReMA.f['28']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['144']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['29'][0]++,!attribute)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['29'][1]++,this.attributesPerId.has(attribute.id))){__cov_0MjpvFxcVY1n9$6KwaReMA.b['28'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['145']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['28'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['146']++;this.attributesPerId.set(attribute.id,attribute);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['147']++;ClientModelStore.prototype.removeAttributeById=function(attribute){__cov_0MjpvFxcVY1n9$6KwaReMA.f['29']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['148']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['31'][0]++,!attribute)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['31'][1]++,!this.attributesPerId.has(attribute.id))){__cov_0MjpvFxcVY1n9$6KwaReMA.b['30'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['149']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['30'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['150']++;this.attributesPerId['delete'](attribute.id);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['151']++;ClientModelStore.prototype.findAttributeById=function(id){__cov_0MjpvFxcVY1n9$6KwaReMA.f['30']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['152']++;return this.attributesPerId.get(id);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['153']++;ClientModelStore.prototype.addAttributeByQualifier=function(attribute){__cov_0MjpvFxcVY1n9$6KwaReMA.f['31']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['154']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['33'][0]++,!attribute)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['33'][1]++,!attribute.getQualifier())){__cov_0MjpvFxcVY1n9$6KwaReMA.b['32'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['155']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['32'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['156']++;var attributes=this.attributesPerQualifier.get(attribute.getQualifier());__cov_0MjpvFxcVY1n9$6KwaReMA.s['157']++;if(!attributes){__cov_0MjpvFxcVY1n9$6KwaReMA.b['34'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['158']++;attributes=[];__cov_0MjpvFxcVY1n9$6KwaReMA.s['159']++;this.attributesPerQualifier.set(attribute.getQualifier(),attributes);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['34'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['160']++;if(!(attributes.indexOf(attribute)>-1)){__cov_0MjpvFxcVY1n9$6KwaReMA.b['35'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['161']++;attributes.push(attribute);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['35'][1]++;}};__cov_0MjpvFxcVY1n9$6KwaReMA.s['162']++;ClientModelStore.prototype.removeAttributeByQualifier=function(attribute){__cov_0MjpvFxcVY1n9$6KwaReMA.f['32']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['163']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['37'][0]++,!attribute)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['37'][1]++,!attribute.getQualifier())){__cov_0MjpvFxcVY1n9$6KwaReMA.b['36'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['164']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['36'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['165']++;var attributes=this.attributesPerQualifier.get(attribute.getQualifier());__cov_0MjpvFxcVY1n9$6KwaReMA.s['166']++;if(!attributes){__cov_0MjpvFxcVY1n9$6KwaReMA.b['38'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['167']++;return;}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['38'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['168']++;if(attributes.length>-1){__cov_0MjpvFxcVY1n9$6KwaReMA.b['39'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['169']++;attributes.splice(attributes.indexOf(attribute),1);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['39'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['170']++;if(attributes.length===0){__cov_0MjpvFxcVY1n9$6KwaReMA.b['40'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['171']++;this.attributesPerQualifier['delete'](attribute.getQualifier());}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['40'][1]++;}};__cov_0MjpvFxcVY1n9$6KwaReMA.s['172']++;ClientModelStore.prototype.findAllAttributesByQualifier=function(qualifier){__cov_0MjpvFxcVY1n9$6KwaReMA.f['33']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['173']++;if((__cov_0MjpvFxcVY1n9$6KwaReMA.b['42'][0]++,!qualifier)||(__cov_0MjpvFxcVY1n9$6KwaReMA.b['42'][1]++,!this.attributesPerQualifier.has(qualifier))){__cov_0MjpvFxcVY1n9$6KwaReMA.b['41'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['174']++;return[];}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['41'][1]++;}__cov_0MjpvFxcVY1n9$6KwaReMA.s['175']++;return this.attributesPerQualifier.get(qualifier).slice(0);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['176']++;ClientModelStore.prototype.onModelStoreChange=function(eventHandler){__cov_0MjpvFxcVY1n9$6KwaReMA.f['34']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['177']++;this.modelStoreChangeBus.onEvent(eventHandler);};__cov_0MjpvFxcVY1n9$6KwaReMA.s['178']++;ClientModelStore.prototype.onModelStoreChangeForType=function(presentationModelType,eventHandler){__cov_0MjpvFxcVY1n9$6KwaReMA.f['35']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['179']++;this.modelStoreChangeBus.onEvent(function(pmStoreEvent){__cov_0MjpvFxcVY1n9$6KwaReMA.f['36']++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['180']++;if(pmStoreEvent.clientPresentationModel.presentationModelType==presentationModelType){__cov_0MjpvFxcVY1n9$6KwaReMA.b['43'][0]++;__cov_0MjpvFxcVY1n9$6KwaReMA.s['181']++;eventHandler(pmStoreEvent);}else{__cov_0MjpvFxcVY1n9$6KwaReMA.b['43'][1]++;}});};__cov_0MjpvFxcVY1n9$6KwaReMA.s['182']++;return ClientModelStore;}();__cov_0MjpvFxcVY1n9$6KwaReMA.s['183']++;exports.ClientModelStore=ClientModelStore;

},{"./Attribute":41,"./ChangeAttributeMetadataCommand":45,"./CreatePresentationModelCommand":54,"./DeletedAllPresentationModelsOfTypeNotification":58,"./DeletedPresentationModelNotification":59,"./EventBus":62,"./ValueChangedCommand":70}],50:[function(require,module,exports){
"use strict";
var __cov_e7oERuE9_42XjbcvNQz_Qw = (Function('return this'))();
if (!__cov_e7oERuE9_42XjbcvNQz_Qw.__coverage__) { __cov_e7oERuE9_42XjbcvNQz_Qw.__coverage__ = {}; }
__cov_e7oERuE9_42XjbcvNQz_Qw = __cov_e7oERuE9_42XjbcvNQz_Qw.__coverage__;
if (!(__cov_e7oERuE9_42XjbcvNQz_Qw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientPresentationModel.ts'])) {
   __cov_e7oERuE9_42XjbcvNQz_Qw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientPresentationModel.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientPresentationModel.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":1,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"79":0,"80":0,"81":0,"82":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0],"12":[0,0],"13":[0,0],"14":[0,0],"15":[0,0],"16":[0,0],"17":[0,0],"18":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0},"fnMap":{"1":{"name":"(anonymous_1)","line":5,"loc":{"start":{"line":5,"column":31},"end":{"line":5,"column":43}}},"2":{"name":"ClientPresentationModel","line":6,"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":64}}},"3":{"name":"(anonymous_3)","line":23,"loc":{"start":{"line":23,"column":45},"end":{"line":23,"column":57}}},"4":{"name":"(anonymous_4)","line":26,"loc":{"start":{"line":26,"column":37},"end":{"line":26,"column":58}}},"5":{"name":"(anonymous_5)","line":33,"loc":{"start":{"line":33,"column":54},"end":{"line":33,"column":76}}},"6":{"name":"(anonymous_6)","line":37,"loc":{"start":{"line":37,"column":27},"end":{"line":37,"column":43}}},"7":{"name":"(anonymous_7)","line":41,"loc":{"start":{"line":41,"column":53},"end":{"line":41,"column":74}}},"8":{"name":"(anonymous_8)","line":56,"loc":{"start":{"line":56,"column":32},"end":{"line":56,"column":47}}},"9":{"name":"(anonymous_9)","line":60,"loc":{"start":{"line":60,"column":54},"end":{"line":60,"column":82}}},"10":{"name":"(anonymous_10)","line":64,"loc":{"start":{"line":64,"column":54},"end":{"line":64,"column":66}}},"11":{"name":"(anonymous_11)","line":67,"loc":{"start":{"line":67,"column":46},"end":{"line":67,"column":70}}},"12":{"name":"(anonymous_12)","line":70,"loc":{"start":{"line":70,"column":72},"end":{"line":70,"column":96}}},"13":{"name":"(anonymous_13)","line":74,"loc":{"start":{"line":74,"column":32},"end":{"line":74,"column":53}}},"14":{"name":"(anonymous_14)","line":81,"loc":{"start":{"line":81,"column":68},"end":{"line":81,"column":92}}},"15":{"name":"(anonymous_15)","line":91,"loc":{"start":{"line":91,"column":65},"end":{"line":91,"column":86}}},"16":{"name":"(anonymous_16)","line":102,"loc":{"start":{"line":102,"column":58},"end":{"line":102,"column":72}}},"17":{"name":"(anonymous_17)","line":113,"loc":{"start":{"line":113,"column":49},"end":{"line":113,"column":84}}},"18":{"name":"(anonymous_18)","line":114,"loc":{"start":{"line":114,"column":32},"end":{"line":114,"column":59}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":39}},"3":{"start":{"line":4,"column":0},"end":{"line":4,"column":39}},"4":{"start":{"line":5,"column":0},"end":{"line":122,"column":5}},"5":{"start":{"line":6,"column":4},"end":{"line":20,"column":5}},"6":{"start":{"line":7,"column":8},"end":{"line":7,"column":21}},"7":{"start":{"line":8,"column":8},"end":{"line":8,"column":59}},"8":{"start":{"line":9,"column":8},"end":{"line":9,"column":29}},"9":{"start":{"line":10,"column":8},"end":{"line":10,"column":36}},"10":{"start":{"line":11,"column":8},"end":{"line":11,"column":27}},"11":{"start":{"line":12,"column":8},"end":{"line":17,"column":9}},"12":{"start":{"line":13,"column":12},"end":{"line":13,"column":25}},"13":{"start":{"line":16,"column":12},"end":{"line":16,"column":68}},"14":{"start":{"line":18,"column":8},"end":{"line":18,"column":54}},"15":{"start":{"line":19,"column":8},"end":{"line":19,"column":63}},"16":{"start":{"line":23,"column":4},"end":{"line":31,"column":6}},"17":{"start":{"line":24,"column":8},"end":{"line":24,"column":83}},"18":{"start":{"line":25,"column":8},"end":{"line":25,"column":37}},"19":{"start":{"line":26,"column":8},"end":{"line":29,"column":11}},"20":{"start":{"line":27,"column":12},"end":{"line":27,"column":49}},"21":{"start":{"line":28,"column":12},"end":{"line":28,"column":47}},"22":{"start":{"line":30,"column":8},"end":{"line":30,"column":22}},"23":{"start":{"line":33,"column":4},"end":{"line":40,"column":6}},"24":{"start":{"line":34,"column":8},"end":{"line":34,"column":25}},"25":{"start":{"line":35,"column":8},"end":{"line":36,"column":19}},"26":{"start":{"line":36,"column":12},"end":{"line":36,"column":19}},"27":{"start":{"line":37,"column":8},"end":{"line":39,"column":11}},"28":{"start":{"line":38,"column":12},"end":{"line":38,"column":37}},"29":{"start":{"line":41,"column":4},"end":{"line":59,"column":6}},"30":{"start":{"line":42,"column":8},"end":{"line":42,"column":25}},"31":{"start":{"line":43,"column":8},"end":{"line":45,"column":9}},"32":{"start":{"line":44,"column":12},"end":{"line":44,"column":19}},"33":{"start":{"line":46,"column":8},"end":{"line":49,"column":9}},"34":{"start":{"line":47,"column":12},"end":{"line":48,"column":64}},"35":{"start":{"line":50,"column":8},"end":{"line":53,"column":9}},"36":{"start":{"line":51,"column":12},"end":{"line":52,"column":64}},"37":{"start":{"line":54,"column":8},"end":{"line":54,"column":45}},"38":{"start":{"line":55,"column":8},"end":{"line":55,"column":40}},"39":{"start":{"line":56,"column":8},"end":{"line":58,"column":11}},"40":{"start":{"line":57,"column":12},"end":{"line":57,"column":56}},"41":{"start":{"line":60,"column":4},"end":{"line":62,"column":6}},"42":{"start":{"line":61,"column":8},"end":{"line":61,"column":50}},"43":{"start":{"line":64,"column":4},"end":{"line":66,"column":6}},"44":{"start":{"line":65,"column":8},"end":{"line":65,"column":40}},"45":{"start":{"line":67,"column":4},"end":{"line":69,"column":6}},"46":{"start":{"line":68,"column":8},"end":{"line":68,"column":62}},"47":{"start":{"line":70,"column":4},"end":{"line":80,"column":6}},"48":{"start":{"line":71,"column":8},"end":{"line":71,"column":24}},"49":{"start":{"line":72,"column":8},"end":{"line":73,"column":24}},"50":{"start":{"line":73,"column":12},"end":{"line":73,"column":24}},"51":{"start":{"line":74,"column":8},"end":{"line":78,"column":11}},"52":{"start":{"line":75,"column":12},"end":{"line":77,"column":13}},"53":{"start":{"line":76,"column":16},"end":{"line":76,"column":39}},"54":{"start":{"line":79,"column":8},"end":{"line":79,"column":22}},"55":{"start":{"line":81,"column":4},"end":{"line":90,"column":6}},"56":{"start":{"line":82,"column":8},"end":{"line":83,"column":24}},"57":{"start":{"line":83,"column":12},"end":{"line":83,"column":24}},"58":{"start":{"line":84,"column":8},"end":{"line":88,"column":9}},"59":{"start":{"line":85,"column":12},"end":{"line":87,"column":13}},"60":{"start":{"line":86,"column":16},"end":{"line":86,"column":42}},"61":{"start":{"line":89,"column":8},"end":{"line":89,"column":20}},"62":{"start":{"line":91,"column":4},"end":{"line":101,"column":6}},"63":{"start":{"line":92,"column":8},"end":{"line":93,"column":24}},"64":{"start":{"line":93,"column":12},"end":{"line":93,"column":24}},"65":{"start":{"line":94,"column":8},"end":{"line":98,"column":9}},"66":{"start":{"line":95,"column":12},"end":{"line":97,"column":13}},"67":{"start":{"line":96,"column":16},"end":{"line":96,"column":42}},"68":{"start":{"line":100,"column":8},"end":{"line":100,"column":20}},"69":{"start":{"line":102,"column":4},"end":{"line":112,"column":6}},"70":{"start":{"line":103,"column":8},"end":{"line":104,"column":24}},"71":{"start":{"line":104,"column":12},"end":{"line":104,"column":24}},"72":{"start":{"line":105,"column":8},"end":{"line":109,"column":9}},"73":{"start":{"line":106,"column":12},"end":{"line":108,"column":13}},"74":{"start":{"line":107,"column":16},"end":{"line":107,"column":42}},"75":{"start":{"line":111,"column":8},"end":{"line":111,"column":20}},"76":{"start":{"line":113,"column":4},"end":{"line":120,"column":6}},"77":{"start":{"line":114,"column":8},"end":{"line":119,"column":11}},"78":{"start":{"line":115,"column":12},"end":{"line":115,"column":94}},"79":{"start":{"line":116,"column":12},"end":{"line":118,"column":13}},"80":{"start":{"line":117,"column":16},"end":{"line":117,"column":58}},"81":{"start":{"line":121,"column":4},"end":{"line":121,"column":35}},"82":{"start":{"line":123,"column":0},"end":{"line":123,"column":58}}},"branchMap":{"1":{"line":12,"type":"if","locations":[{"start":{"line":12,"column":8},"end":{"line":12,"column":8}},{"start":{"line":12,"column":8},"end":{"line":12,"column":8}}]},"2":{"line":12,"type":"binary-expr","locations":[{"start":{"line":12,"column":12},"end":{"line":12,"column":37}},{"start":{"line":12,"column":41},"end":{"line":12,"column":51}}]},"3":{"line":35,"type":"if","locations":[{"start":{"line":35,"column":8},"end":{"line":35,"column":8}},{"start":{"line":35,"column":8},"end":{"line":35,"column":8}}]},"4":{"line":35,"type":"binary-expr","locations":[{"start":{"line":35,"column":12},"end":{"line":35,"column":23}},{"start":{"line":35,"column":27},"end":{"line":35,"column":48}}]},"5":{"line":43,"type":"if","locations":[{"start":{"line":43,"column":8},"end":{"line":43,"column":8}},{"start":{"line":43,"column":8},"end":{"line":43,"column":8}}]},"6":{"line":43,"type":"binary-expr","locations":[{"start":{"line":43,"column":12},"end":{"line":43,"column":22}},{"start":{"line":43,"column":27},"end":{"line":43,"column":66}}]},"7":{"line":46,"type":"if","locations":[{"start":{"line":46,"column":8},"end":{"line":46,"column":8}},{"start":{"line":46,"column":8},"end":{"line":46,"column":8}}]},"8":{"line":50,"type":"if","locations":[{"start":{"line":50,"column":8},"end":{"line":50,"column":8}},{"start":{"line":50,"column":8},"end":{"line":50,"column":8}}]},"9":{"line":50,"type":"binary-expr","locations":[{"start":{"line":50,"column":12},"end":{"line":50,"column":36}},{"start":{"line":50,"column":40},"end":{"line":50,"column":95}}]},"10":{"line":72,"type":"if","locations":[{"start":{"line":72,"column":8},"end":{"line":72,"column":8}},{"start":{"line":72,"column":8},"end":{"line":72,"column":8}}]},"11":{"line":75,"type":"if","locations":[{"start":{"line":75,"column":12},"end":{"line":75,"column":12}},{"start":{"line":75,"column":12},"end":{"line":75,"column":12}}]},"12":{"line":82,"type":"if","locations":[{"start":{"line":82,"column":8},"end":{"line":82,"column":8}},{"start":{"line":82,"column":8},"end":{"line":82,"column":8}}]},"13":{"line":85,"type":"if","locations":[{"start":{"line":85,"column":12},"end":{"line":85,"column":12}},{"start":{"line":85,"column":12},"end":{"line":85,"column":12}}]},"14":{"line":92,"type":"if","locations":[{"start":{"line":92,"column":8},"end":{"line":92,"column":8}},{"start":{"line":92,"column":8},"end":{"line":92,"column":8}}]},"15":{"line":95,"type":"if","locations":[{"start":{"line":95,"column":12},"end":{"line":95,"column":12}},{"start":{"line":95,"column":12},"end":{"line":95,"column":12}}]},"16":{"line":103,"type":"if","locations":[{"start":{"line":103,"column":8},"end":{"line":103,"column":8}},{"start":{"line":103,"column":8},"end":{"line":103,"column":8}}]},"17":{"line":106,"type":"if","locations":[{"start":{"line":106,"column":12},"end":{"line":106,"column":12}},{"start":{"line":106,"column":12},"end":{"line":106,"column":12}}]},"18":{"line":116,"type":"if","locations":[{"start":{"line":116,"column":12},"end":{"line":116,"column":12}},{"start":{"line":116,"column":12},"end":{"line":116,"column":12}}]}}};
}
__cov_e7oERuE9_42XjbcvNQz_Qw = __cov_e7oERuE9_42XjbcvNQz_Qw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ClientPresentationModel.ts'];
__cov_e7oERuE9_42XjbcvNQz_Qw.s['1']++;exports.__esModule=true;__cov_e7oERuE9_42XjbcvNQz_Qw.s['2']++;var EventBus_1=require('./EventBus');__cov_e7oERuE9_42XjbcvNQz_Qw.s['3']++;var presentationModelInstanceCount=0;__cov_e7oERuE9_42XjbcvNQz_Qw.s['4']++;var ClientPresentationModel=function(){__cov_e7oERuE9_42XjbcvNQz_Qw.f['1']++;function ClientPresentationModel(id,presentationModelType){__cov_e7oERuE9_42XjbcvNQz_Qw.f['2']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['6']++;this.id=id;__cov_e7oERuE9_42XjbcvNQz_Qw.s['7']++;this.presentationModelType=presentationModelType;__cov_e7oERuE9_42XjbcvNQz_Qw.s['8']++;this.attributes=[];__cov_e7oERuE9_42XjbcvNQz_Qw.s['9']++;this.clientSideOnly=false;__cov_e7oERuE9_42XjbcvNQz_Qw.s['10']++;this.dirty=false;__cov_e7oERuE9_42XjbcvNQz_Qw.s['11']++;if((__cov_e7oERuE9_42XjbcvNQz_Qw.b['2'][0]++,typeof id!=='undefined')&&(__cov_e7oERuE9_42XjbcvNQz_Qw.b['2'][1]++,id!=null)){__cov_e7oERuE9_42XjbcvNQz_Qw.b['1'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['12']++;this.id=id;}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['1'][1]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['13']++;this.id=(presentationModelInstanceCount++).toString();}__cov_e7oERuE9_42XjbcvNQz_Qw.s['14']++;this.invalidBus=new EventBus_1['default']();__cov_e7oERuE9_42XjbcvNQz_Qw.s['15']++;this.dirtyValueChangeBus=new EventBus_1['default']();}__cov_e7oERuE9_42XjbcvNQz_Qw.s['16']++;ClientPresentationModel.prototype.copy=function(){__cov_e7oERuE9_42XjbcvNQz_Qw.f['3']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['17']++;var result=new ClientPresentationModel(null,this.presentationModelType);__cov_e7oERuE9_42XjbcvNQz_Qw.s['18']++;result.clientSideOnly=true;__cov_e7oERuE9_42XjbcvNQz_Qw.s['19']++;this.getAttributes().forEach(function(attribute){__cov_e7oERuE9_42XjbcvNQz_Qw.f['4']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['20']++;var attributeCopy=attribute.copy();__cov_e7oERuE9_42XjbcvNQz_Qw.s['21']++;result.addAttribute(attributeCopy);});__cov_e7oERuE9_42XjbcvNQz_Qw.s['22']++;return result;};__cov_e7oERuE9_42XjbcvNQz_Qw.s['23']++;ClientPresentationModel.prototype.addAttributes=function(attributes){__cov_e7oERuE9_42XjbcvNQz_Qw.f['5']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['24']++;var _this=this;__cov_e7oERuE9_42XjbcvNQz_Qw.s['25']++;if((__cov_e7oERuE9_42XjbcvNQz_Qw.b['4'][0]++,!attributes)||(__cov_e7oERuE9_42XjbcvNQz_Qw.b['4'][1]++,attributes.length<1)){__cov_e7oERuE9_42XjbcvNQz_Qw.b['3'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['26']++;return;}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['3'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['27']++;attributes.forEach(function(attr){__cov_e7oERuE9_42XjbcvNQz_Qw.f['6']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['28']++;_this.addAttribute(attr);});};__cov_e7oERuE9_42XjbcvNQz_Qw.s['29']++;ClientPresentationModel.prototype.addAttribute=function(attribute){__cov_e7oERuE9_42XjbcvNQz_Qw.f['7']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['30']++;var _this=this;__cov_e7oERuE9_42XjbcvNQz_Qw.s['31']++;if((__cov_e7oERuE9_42XjbcvNQz_Qw.b['6'][0]++,!attribute)||(__cov_e7oERuE9_42XjbcvNQz_Qw.b['6'][1]++,this.attributes.indexOf(attribute)>-1)){__cov_e7oERuE9_42XjbcvNQz_Qw.b['5'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['32']++;return;}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['5'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['33']++;if(this.findAttributeByPropertyName(attribute.propertyName)){__cov_e7oERuE9_42XjbcvNQz_Qw.b['7'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['34']++;throw new Error('There already is an attribute with property name: '+attribute.propertyName+' in presentation model with id: '+this.id);}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['7'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['35']++;if((__cov_e7oERuE9_42XjbcvNQz_Qw.b['9'][0]++,attribute.getQualifier())&&(__cov_e7oERuE9_42XjbcvNQz_Qw.b['9'][1]++,this.findAttributeByQualifier(attribute.getQualifier()))){__cov_e7oERuE9_42XjbcvNQz_Qw.b['8'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['36']++;throw new Error('There already is an attribute with qualifier: '+attribute.getQualifier()+' in presentation model with id: '+this.id);}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['8'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['37']++;attribute.setPresentationModel(this);__cov_e7oERuE9_42XjbcvNQz_Qw.s['38']++;this.attributes.push(attribute);__cov_e7oERuE9_42XjbcvNQz_Qw.s['39']++;attribute.onValueChange(function(evt){__cov_e7oERuE9_42XjbcvNQz_Qw.f['8']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['40']++;_this.invalidBus.trigger({source:_this});});};__cov_e7oERuE9_42XjbcvNQz_Qw.s['41']++;ClientPresentationModel.prototype.onInvalidated=function(handleInvalidate){__cov_e7oERuE9_42XjbcvNQz_Qw.f['9']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['42']++;this.invalidBus.onEvent(handleInvalidate);};__cov_e7oERuE9_42XjbcvNQz_Qw.s['43']++;ClientPresentationModel.prototype.getAttributes=function(){__cov_e7oERuE9_42XjbcvNQz_Qw.f['10']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['44']++;return this.attributes.slice(0);};__cov_e7oERuE9_42XjbcvNQz_Qw.s['45']++;ClientPresentationModel.prototype.getAt=function(propertyName){__cov_e7oERuE9_42XjbcvNQz_Qw.f['11']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['46']++;return this.findAttributeByPropertyName(propertyName);};__cov_e7oERuE9_42XjbcvNQz_Qw.s['47']++;ClientPresentationModel.prototype.findAllAttributesByPropertyName=function(propertyName){__cov_e7oERuE9_42XjbcvNQz_Qw.f['12']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['48']++;var result=[];__cov_e7oERuE9_42XjbcvNQz_Qw.s['49']++;if(!propertyName){__cov_e7oERuE9_42XjbcvNQz_Qw.b['10'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['50']++;return null;}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['10'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['51']++;this.attributes.forEach(function(attribute){__cov_e7oERuE9_42XjbcvNQz_Qw.f['13']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['52']++;if(attribute.propertyName==propertyName){__cov_e7oERuE9_42XjbcvNQz_Qw.b['11'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['53']++;result.push(attribute);}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['11'][1]++;}});__cov_e7oERuE9_42XjbcvNQz_Qw.s['54']++;return result;};__cov_e7oERuE9_42XjbcvNQz_Qw.s['55']++;ClientPresentationModel.prototype.findAttributeByPropertyName=function(propertyName){__cov_e7oERuE9_42XjbcvNQz_Qw.f['14']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['56']++;if(!propertyName){__cov_e7oERuE9_42XjbcvNQz_Qw.b['12'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['57']++;return null;}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['12'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['58']++;for(var i=0;i<this.attributes.length;i++){__cov_e7oERuE9_42XjbcvNQz_Qw.s['59']++;if(this.attributes[i].propertyName==propertyName){__cov_e7oERuE9_42XjbcvNQz_Qw.b['13'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['60']++;return this.attributes[i];}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['13'][1]++;}}__cov_e7oERuE9_42XjbcvNQz_Qw.s['61']++;return null;};__cov_e7oERuE9_42XjbcvNQz_Qw.s['62']++;ClientPresentationModel.prototype.findAttributeByQualifier=function(qualifier){__cov_e7oERuE9_42XjbcvNQz_Qw.f['15']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['63']++;if(!qualifier){__cov_e7oERuE9_42XjbcvNQz_Qw.b['14'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['64']++;return null;}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['14'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['65']++;for(var i=0;i<this.attributes.length;i++){__cov_e7oERuE9_42XjbcvNQz_Qw.s['66']++;if(this.attributes[i].getQualifier()==qualifier){__cov_e7oERuE9_42XjbcvNQz_Qw.b['15'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['67']++;return this.attributes[i];}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['15'][1]++;}};__cov_e7oERuE9_42XjbcvNQz_Qw.s['68']++;return null;};__cov_e7oERuE9_42XjbcvNQz_Qw.s['69']++;ClientPresentationModel.prototype.findAttributeById=function(id){__cov_e7oERuE9_42XjbcvNQz_Qw.f['16']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['70']++;if(!id){__cov_e7oERuE9_42XjbcvNQz_Qw.b['16'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['71']++;return null;}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['16'][1]++;}__cov_e7oERuE9_42XjbcvNQz_Qw.s['72']++;for(var i=0;i<this.attributes.length;i++){__cov_e7oERuE9_42XjbcvNQz_Qw.s['73']++;if(this.attributes[i].id==id){__cov_e7oERuE9_42XjbcvNQz_Qw.b['17'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['74']++;return this.attributes[i];}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['17'][1]++;}};__cov_e7oERuE9_42XjbcvNQz_Qw.s['75']++;return null;};__cov_e7oERuE9_42XjbcvNQz_Qw.s['76']++;ClientPresentationModel.prototype.syncWith=function(sourcePresentationModel){__cov_e7oERuE9_42XjbcvNQz_Qw.f['17']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['77']++;this.attributes.forEach(function(targetAttribute){__cov_e7oERuE9_42XjbcvNQz_Qw.f['18']++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['78']++;var sourceAttribute=sourcePresentationModel.getAt(targetAttribute.propertyName);__cov_e7oERuE9_42XjbcvNQz_Qw.s['79']++;if(sourceAttribute){__cov_e7oERuE9_42XjbcvNQz_Qw.b['18'][0]++;__cov_e7oERuE9_42XjbcvNQz_Qw.s['80']++;targetAttribute.syncWith(sourceAttribute);}else{__cov_e7oERuE9_42XjbcvNQz_Qw.b['18'][1]++;}});};__cov_e7oERuE9_42XjbcvNQz_Qw.s['81']++;return ClientPresentationModel;}();__cov_e7oERuE9_42XjbcvNQz_Qw.s['82']++;exports.ClientPresentationModel=ClientPresentationModel;

},{"./EventBus":62}],51:[function(require,module,exports){
"use strict";
var __cov_XvJhEjy_OElyUfW$ELOyng = (Function('return this'))();
if (!__cov_XvJhEjy_OElyUfW$ELOyng.__coverage__) { __cov_XvJhEjy_OElyUfW$ELOyng.__coverage__ = {}; }
__cov_XvJhEjy_OElyUfW$ELOyng = __cov_XvJhEjy_OElyUfW$ELOyng.__coverage__;
if (!(__cov_XvJhEjy_OElyUfW$ELOyng['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Codec.ts'])) {
   __cov_XvJhEjy_OElyUfW$ELOyng['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Codec.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Codec.ts","s":{"1":0,"2":0,"3":1,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0},"b":{"1":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0},"fnMap":{"1":{"name":"(anonymous_1)","line":3,"loc":{"start":{"line":3,"column":13},"end":{"line":3,"column":25}}},"2":{"name":"Codec","line":4,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":21}}},"3":{"name":"(anonymous_3)","line":6,"loc":{"start":{"line":6,"column":29},"end":{"line":6,"column":49}}},"4":{"name":"(anonymous_4)","line":9,"loc":{"start":{"line":9,"column":29},"end":{"line":9,"column":52}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":18,"column":5}},"3":{"start":{"line":4,"column":4},"end":{"line":5,"column":5}},"4":{"start":{"line":6,"column":4},"end":{"line":8,"column":6}},"5":{"start":{"line":7,"column":8},"end":{"line":7,"column":40}},"6":{"start":{"line":9,"column":4},"end":{"line":16,"column":6}},"7":{"start":{"line":10,"column":8},"end":{"line":15,"column":9}},"8":{"start":{"line":11,"column":12},"end":{"line":11,"column":43}},"9":{"start":{"line":14,"column":12},"end":{"line":14,"column":31}},"10":{"start":{"line":17,"column":4},"end":{"line":17,"column":17}},"11":{"start":{"line":19,"column":0},"end":{"line":19,"column":27}}},"branchMap":{"1":{"line":10,"type":"if","locations":[{"start":{"line":10,"column":8},"end":{"line":10,"column":8}},{"start":{"line":10,"column":8},"end":{"line":10,"column":8}}]}}};
}
__cov_XvJhEjy_OElyUfW$ELOyng = __cov_XvJhEjy_OElyUfW$ELOyng['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Codec.ts'];
__cov_XvJhEjy_OElyUfW$ELOyng.s['1']++;exports.__esModule=true;__cov_XvJhEjy_OElyUfW$ELOyng.s['2']++;var Codec=function(){__cov_XvJhEjy_OElyUfW$ELOyng.f['1']++;function Codec(){__cov_XvJhEjy_OElyUfW$ELOyng.f['2']++;}__cov_XvJhEjy_OElyUfW$ELOyng.s['4']++;Codec.prototype.encode=function(commands){__cov_XvJhEjy_OElyUfW$ELOyng.f['3']++;__cov_XvJhEjy_OElyUfW$ELOyng.s['5']++;return JSON.stringify(commands);};__cov_XvJhEjy_OElyUfW$ELOyng.s['6']++;Codec.prototype.decode=function(transmitted){__cov_XvJhEjy_OElyUfW$ELOyng.f['4']++;__cov_XvJhEjy_OElyUfW$ELOyng.s['7']++;if(typeof transmitted=='string'){__cov_XvJhEjy_OElyUfW$ELOyng.b['1'][0]++;__cov_XvJhEjy_OElyUfW$ELOyng.s['8']++;return JSON.parse(transmitted);}else{__cov_XvJhEjy_OElyUfW$ELOyng.b['1'][1]++;__cov_XvJhEjy_OElyUfW$ELOyng.s['9']++;return transmitted;}};__cov_XvJhEjy_OElyUfW$ELOyng.s['10']++;return Codec;}();__cov_XvJhEjy_OElyUfW$ELOyng.s['11']++;exports['default']=Codec;

},{}],52:[function(require,module,exports){
"use strict";
var __cov_i4BQMFOWQzVMTUcRnXoNMQ = (Function('return this'))();
if (!__cov_i4BQMFOWQzVMTUcRnXoNMQ.__coverage__) { __cov_i4BQMFOWQzVMTUcRnXoNMQ.__coverage__ = {}; }
__cov_i4BQMFOWQzVMTUcRnXoNMQ = __cov_i4BQMFOWQzVMTUcRnXoNMQ.__coverage__;
if (!(__cov_i4BQMFOWQzVMTUcRnXoNMQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Command.ts'])) {
   __cov_i4BQMFOWQzVMTUcRnXoNMQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Command.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Command.ts","s":{"1":0,"2":0,"3":1,"4":0,"5":0,"6":0},"b":{},"f":{"1":0,"2":0},"fnMap":{"1":{"name":"(anonymous_1)","line":3,"loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":27}}},"2":{"name":"Command","line":4,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":23}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":8,"column":5}},"3":{"start":{"line":4,"column":4},"end":{"line":6,"column":5}},"4":{"start":{"line":5,"column":8},"end":{"line":5,"column":41}},"5":{"start":{"line":7,"column":4},"end":{"line":7,"column":19}},"6":{"start":{"line":9,"column":0},"end":{"line":9,"column":29}}},"branchMap":{}};
}
__cov_i4BQMFOWQzVMTUcRnXoNMQ = __cov_i4BQMFOWQzVMTUcRnXoNMQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/Command.ts'];
__cov_i4BQMFOWQzVMTUcRnXoNMQ.s['1']++;exports.__esModule=true;__cov_i4BQMFOWQzVMTUcRnXoNMQ.s['2']++;var Command=function(){__cov_i4BQMFOWQzVMTUcRnXoNMQ.f['1']++;function Command(){__cov_i4BQMFOWQzVMTUcRnXoNMQ.f['2']++;__cov_i4BQMFOWQzVMTUcRnXoNMQ.s['4']++;this.id='dolphin-core-command';}__cov_i4BQMFOWQzVMTUcRnXoNMQ.s['5']++;return Command;}();__cov_i4BQMFOWQzVMTUcRnXoNMQ.s['6']++;exports['default']=Command;

},{}],53:[function(require,module,exports){
"use strict";
var __cov_eOxwnXh2Ykq$YpusZTnYfQ = (Function('return this'))();
if (!__cov_eOxwnXh2Ykq$YpusZTnYfQ.__coverage__) { __cov_eOxwnXh2Ykq$YpusZTnYfQ.__coverage__ = {}; }
__cov_eOxwnXh2Ykq$YpusZTnYfQ = __cov_eOxwnXh2Ykq$YpusZTnYfQ.__coverage__;
if (!(__cov_eOxwnXh2Ykq$YpusZTnYfQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CommandBatcher.ts'])) {
   __cov_eOxwnXh2Ykq$YpusZTnYfQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CommandBatcher.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CommandBatcher.ts","s":{"1":0,"2":0,"3":0,"4":1,"5":0,"6":0,"7":0,"8":0,"9":0,"10":1,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},"fnMap":{"1":{"name":"(anonymous_1)","line":5,"loc":{"start":{"line":5,"column":24},"end":{"line":5,"column":36}}},"2":{"name":"NoCommandBatcher","line":6,"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":32}}},"3":{"name":"(anonymous_3)","line":8,"loc":{"start":{"line":8,"column":39},"end":{"line":8,"column":56}}},"4":{"name":"(anonymous_4)","line":15,"loc":{"start":{"line":15,"column":27},"end":{"line":15,"column":39}}},"5":{"name":"BlindCommandBatcher","line":17,"loc":{"start":{"line":17,"column":4},"end":{"line":17,"column":56}}},"6":{"name":"(anonymous_6)","line":23,"loc":{"start":{"line":23,"column":42},"end":{"line":23,"column":59}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":61}},"3":{"start":{"line":5,"column":0},"end":{"line":12,"column":5}},"4":{"start":{"line":6,"column":4},"end":{"line":7,"column":5}},"5":{"start":{"line":8,"column":4},"end":{"line":10,"column":6}},"6":{"start":{"line":9,"column":8},"end":{"line":9,"column":31}},"7":{"start":{"line":11,"column":4},"end":{"line":11,"column":28}},"8":{"start":{"line":13,"column":0},"end":{"line":13,"column":44}},"9":{"start":{"line":15,"column":0},"end":{"line":59,"column":5}},"10":{"start":{"line":17,"column":4},"end":{"line":22,"column":5}},"11":{"start":{"line":18,"column":8},"end":{"line":18,"column":51}},"12":{"start":{"line":18,"column":34},"end":{"line":18,"column":49}},"13":{"start":{"line":19,"column":8},"end":{"line":19,"column":59}},"14":{"start":{"line":19,"column":39},"end":{"line":19,"column":57}},"15":{"start":{"line":20,"column":8},"end":{"line":20,"column":31}},"16":{"start":{"line":21,"column":8},"end":{"line":21,"column":41}},"17":{"start":{"line":23,"column":4},"end":{"line":57,"column":6}},"18":{"start":{"line":24,"column":8},"end":{"line":24,"column":23}},"19":{"start":{"line":25,"column":8},"end":{"line":25,"column":58}},"20":{"start":{"line":26,"column":8},"end":{"line":55,"column":9}},"21":{"start":{"line":27,"column":12},"end":{"line":27,"column":42}},"22":{"start":{"line":28,"column":12},"end":{"line":48,"column":13}},"23":{"start":{"line":29,"column":16},"end":{"line":29,"column":33}},"24":{"start":{"line":30,"column":16},"end":{"line":30,"column":47}},"25":{"start":{"line":31,"column":16},"end":{"line":38,"column":17}},"26":{"start":{"line":32,"column":20},"end":{"line":37,"column":21}},"27":{"start":{"line":33,"column":24},"end":{"line":33,"column":56}},"28":{"start":{"line":34,"column":24},"end":{"line":36,"column":25}},"29":{"start":{"line":35,"column":28},"end":{"line":35,"column":45}},"30":{"start":{"line":39,"column":16},"end":{"line":44,"column":17}},"31":{"start":{"line":40,"column":20},"end":{"line":40,"column":53}},"32":{"start":{"line":43,"column":20},"end":{"line":43,"column":42}},"33":{"start":{"line":47,"column":16},"end":{"line":47,"column":38}},"34":{"start":{"line":49,"column":12},"end":{"line":54,"column":13}},"35":{"start":{"line":53,"column":16},"end":{"line":53,"column":22}},"36":{"start":{"line":56,"column":8},"end":{"line":56,"column":21}},"37":{"start":{"line":58,"column":4},"end":{"line":58,"column":31}},"38":{"start":{"line":60,"column":0},"end":{"line":60,"column":50}}},"branchMap":{"1":{"line":18,"type":"if","locations":[{"start":{"line":18,"column":8},"end":{"line":18,"column":8}},{"start":{"line":18,"column":8},"end":{"line":18,"column":8}}]},"2":{"line":19,"type":"if","locations":[{"start":{"line":19,"column":8},"end":{"line":19,"column":8}},{"start":{"line":19,"column":8},"end":{"line":19,"column":8}}]},"3":{"line":28,"type":"if","locations":[{"start":{"line":28,"column":12},"end":{"line":28,"column":12}},{"start":{"line":28,"column":12},"end":{"line":28,"column":12}}]},"4":{"line":28,"type":"binary-expr","locations":[{"start":{"line":28,"column":16},"end":{"line":28,"column":28}},{"start":{"line":28,"column":32},"end":{"line":28,"column":93}},{"start":{"line":28,"column":98},"end":{"line":28,"column":116}}]},"5":{"line":31,"type":"binary-expr","locations":[{"start":{"line":31,"column":32},"end":{"line":31,"column":48}},{"start":{"line":31,"column":52},"end":{"line":31,"column":65}}]},"6":{"line":32,"type":"if","locations":[{"start":{"line":32,"column":20},"end":{"line":32,"column":20}},{"start":{"line":32,"column":20},"end":{"line":32,"column":20}}]},"7":{"line":34,"type":"if","locations":[{"start":{"line":34,"column":24},"end":{"line":34,"column":24}},{"start":{"line":34,"column":24},"end":{"line":34,"column":24}}]},"8":{"line":34,"type":"binary-expr","locations":[{"start":{"line":34,"column":28},"end":{"line":34,"column":70}},{"start":{"line":34,"column":74},"end":{"line":34,"column":110}}]},"9":{"line":39,"type":"if","locations":[{"start":{"line":39,"column":16},"end":{"line":39,"column":16}},{"start":{"line":39,"column":16},"end":{"line":39,"column":16}}]},"10":{"line":49,"type":"if","locations":[{"start":{"line":49,"column":12},"end":{"line":49,"column":12}},{"start":{"line":49,"column":12},"end":{"line":49,"column":12}}]},"11":{"line":49,"type":"binary-expr","locations":[{"start":{"line":49,"column":16},"end":{"line":49,"column":33}},{"start":{"line":50,"column":17},"end":{"line":50,"column":91}},{"start":{"line":51,"column":17},"end":{"line":51,"column":96}}]}}};
}
__cov_eOxwnXh2Ykq$YpusZTnYfQ = __cov_eOxwnXh2Ykq$YpusZTnYfQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CommandBatcher.ts'];
__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['1']++;exports.__esModule=true;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['2']++;var ValueChangedCommand_1=require('./ValueChangedCommand');__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['3']++;var NoCommandBatcher=function(){__cov_eOxwnXh2Ykq$YpusZTnYfQ.f['1']++;function NoCommandBatcher(){__cov_eOxwnXh2Ykq$YpusZTnYfQ.f['2']++;}__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['5']++;NoCommandBatcher.prototype.batch=function(queue){__cov_eOxwnXh2Ykq$YpusZTnYfQ.f['3']++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['6']++;return[queue.shift()];};__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['7']++;return NoCommandBatcher;}();__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['8']++;exports.NoCommandBatcher=NoCommandBatcher;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['9']++;var BlindCommandBatcher=function(){__cov_eOxwnXh2Ykq$YpusZTnYfQ.f['4']++;function BlindCommandBatcher(folding,maxBatchSize){__cov_eOxwnXh2Ykq$YpusZTnYfQ.f['5']++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['11']++;if(folding===void 0){__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['1'][0]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['12']++;folding=true;}else{__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['1'][1]++;}__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['13']++;if(maxBatchSize===void 0){__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['2'][0]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['14']++;maxBatchSize=50;}else{__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['2'][1]++;}__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['15']++;this.folding=folding;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['16']++;this.maxBatchSize=maxBatchSize;}__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['17']++;BlindCommandBatcher.prototype.batch=function(queue){__cov_eOxwnXh2Ykq$YpusZTnYfQ.f['6']++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['18']++;var batch=[];__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['19']++;var n=Math.min(queue.length,this.maxBatchSize);__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['20']++;for(var counter=0;counter<n;counter++){__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['21']++;var candidate=queue.shift();__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['22']++;if((__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['4'][0]++,this.folding)&&(__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['4'][1]++,candidate.command instanceof ValueChangedCommand_1['default'])&&(__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['4'][2]++,!candidate.handler)){__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['3'][0]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['23']++;var found=null;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['24']++;var canCmd=candidate.command;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['25']++;for(var i=0;(__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['5'][0]++,i<batch.length)&&(__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['5'][1]++,found==null);i++){__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['26']++;if(batch[i].command instanceof ValueChangedCommand_1['default']){__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['6'][0]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['27']++;var batchCmd=batch[i].command;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['28']++;if((__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['8'][0]++,canCmd.attributeId==batchCmd.attributeId)&&(__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['8'][1]++,batchCmd.newValue==canCmd.oldValue)){__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['7'][0]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['29']++;found=batchCmd;}else{__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['7'][1]++;}}else{__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['6'][1]++;}}__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['30']++;if(found){__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['9'][0]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['31']++;found.newValue=canCmd.newValue;}else{__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['9'][1]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['32']++;batch.push(candidate);}}else{__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['3'][1]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['33']++;batch.push(candidate);}__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['34']++;if((__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['11'][0]++,candidate.handler)||(__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['11'][1]++,candidate.command['className']=='org.opendolphin.core.comm.NamedCommand')||(__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['11'][2]++,candidate.command['className']=='org.opendolphin.core.comm.EmptyNotification')){__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['10'][0]++;__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['35']++;break;}else{__cov_eOxwnXh2Ykq$YpusZTnYfQ.b['10'][1]++;}}__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['36']++;return batch;};__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['37']++;return BlindCommandBatcher;}();__cov_eOxwnXh2Ykq$YpusZTnYfQ.s['38']++;exports.BlindCommandBatcher=BlindCommandBatcher;

},{"./ValueChangedCommand":70}],54:[function(require,module,exports){
"use strict";
var __cov_sfm2OpQ47AXMHhLYmhqHQw = (Function('return this'))();
if (!__cov_sfm2OpQ47AXMHhLYmhqHQw.__coverage__) { __cov_sfm2OpQ47AXMHhLYmhqHQw.__coverage__ = {}; }
__cov_sfm2OpQ47AXMHhLYmhqHQw = __cov_sfm2OpQ47AXMHhLYmhqHQw.__coverage__;
if (!(__cov_sfm2OpQ47AXMHhLYmhqHQw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CreatePresentationModelCommand.ts'])) {
   __cov_sfm2OpQ47AXMHhLYmhqHQw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CreatePresentationModelCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CreatePresentationModelCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":38},"end":{"line":14,"column":56}}},"7":{"name":"CreatePresentationModelCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":63}}},"8":{"name":"(anonymous_8)","line":25,"loc":{"start":{"line":25,"column":50},"end":{"line":25,"column":66}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":36,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":54}},"16":{"start":{"line":16,"column":4},"end":{"line":34,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":30}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":37}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":45}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":85}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":42}},"23":{"start":{"line":23,"column":8},"end":{"line":23,"column":63}},"24":{"start":{"line":24,"column":8},"end":{"line":24,"column":37}},"25":{"start":{"line":25,"column":8},"end":{"line":32,"column":11}},"26":{"start":{"line":26,"column":12},"end":{"line":31,"column":15}},"27":{"start":{"line":33,"column":8},"end":{"line":33,"column":21}},"28":{"start":{"line":35,"column":4},"end":{"line":35,"column":42}},"29":{"start":{"line":37,"column":0},"end":{"line":37,"column":52}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_sfm2OpQ47AXMHhLYmhqHQw = __cov_sfm2OpQ47AXMHhLYmhqHQw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/CreatePresentationModelCommand.ts'];
__cov_sfm2OpQ47AXMHhLYmhqHQw.s['1']++;var __extends=(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['1'][0]++,this)&&(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['1'][1]++,this.__extends)||(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['1'][2]++,function(){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['1']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['2']++;var extendStatics=(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['2'][0]++,Object.setPrototypeOf)||(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['2'][2]++,function(d,b){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['2']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['3']++;d.__proto__=b;})||(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['2'][3]++,function(d,b){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['3']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['4']++;for(var p in b){__cov_sfm2OpQ47AXMHhLYmhqHQw.s['5']++;if(b.hasOwnProperty(p)){__cov_sfm2OpQ47AXMHhLYmhqHQw.b['3'][0]++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['6']++;d[p]=b[p];}else{__cov_sfm2OpQ47AXMHhLYmhqHQw.b['3'][1]++;}}});__cov_sfm2OpQ47AXMHhLYmhqHQw.s['7']++;return function(d,b){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['4']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['8']++;extendStatics(d,b);function __(){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['5']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['10']++;this.constructor=d;}__cov_sfm2OpQ47AXMHhLYmhqHQw.s['11']++;d.prototype=b===null?(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['4'][0]++,Object.create(b)):(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_sfm2OpQ47AXMHhLYmhqHQw.s['12']++;exports.__esModule=true;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['13']++;var Command_1=require('./Command');__cov_sfm2OpQ47AXMHhLYmhqHQw.s['14']++;var CreatePresentationModelCommand=function(_super){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['6']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['15']++;__extends(CreatePresentationModelCommand,_super);function CreatePresentationModelCommand(presentationModel){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['7']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['17']++;var _this=(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['5'][0]++,_super.call(this))||(__cov_sfm2OpQ47AXMHhLYmhqHQw.b['5'][1]++,this);__cov_sfm2OpQ47AXMHhLYmhqHQw.s['18']++;_this.attributes=[];__cov_sfm2OpQ47AXMHhLYmhqHQw.s['19']++;_this.clientSideOnly=false;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['20']++;_this.id='CreatePresentationModel';__cov_sfm2OpQ47AXMHhLYmhqHQw.s['21']++;_this.className='org.opendolphin.core.comm.CreatePresentationModelCommand';__cov_sfm2OpQ47AXMHhLYmhqHQw.s['22']++;_this.pmId=presentationModel.id;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['23']++;_this.pmType=presentationModel.presentationModelType;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['24']++;var attrs=_this.attributes;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['25']++;presentationModel.getAttributes().forEach(function(attr){__cov_sfm2OpQ47AXMHhLYmhqHQw.f['8']++;__cov_sfm2OpQ47AXMHhLYmhqHQw.s['26']++;attrs.push({propertyName:attr.propertyName,id:attr.id,qualifier:attr.getQualifier(),value:attr.getValue()});});__cov_sfm2OpQ47AXMHhLYmhqHQw.s['27']++;return _this;}__cov_sfm2OpQ47AXMHhLYmhqHQw.s['28']++;return CreatePresentationModelCommand;}(Command_1['default']);__cov_sfm2OpQ47AXMHhLYmhqHQw.s['29']++;exports['default']=CreatePresentationModelCommand;

},{"./Command":52}],55:[function(require,module,exports){
"use strict";
var __cov_h$dr9w$CPUlBYC$TyFFtLg = (Function('return this'))();
if (!__cov_h$dr9w$CPUlBYC$TyFFtLg.__coverage__) { __cov_h$dr9w$CPUlBYC$TyFFtLg.__coverage__ = {}; }
__cov_h$dr9w$CPUlBYC$TyFFtLg = __cov_h$dr9w$CPUlBYC$TyFFtLg.__coverage__;
if (!(__cov_h$dr9w$CPUlBYC$TyFFtLg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DataCommand.ts'])) {
   __cov_h$dr9w$CPUlBYC$TyFFtLg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DataCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DataCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":19},"end":{"line":14,"column":37}}},"7":{"name":"DataCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":31}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":24,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":35}},"16":{"start":{"line":16,"column":4},"end":{"line":22,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":26}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":26}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":66}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":21}},"22":{"start":{"line":23,"column":4},"end":{"line":23,"column":23}},"23":{"start":{"line":25,"column":0},"end":{"line":25,"column":33}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_h$dr9w$CPUlBYC$TyFFtLg = __cov_h$dr9w$CPUlBYC$TyFFtLg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DataCommand.ts'];
__cov_h$dr9w$CPUlBYC$TyFFtLg.s['1']++;var __extends=(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['1'][0]++,this)&&(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['1'][1]++,this.__extends)||(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['1'][2]++,function(){__cov_h$dr9w$CPUlBYC$TyFFtLg.f['1']++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['2']++;var extendStatics=(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['2'][0]++,Object.setPrototypeOf)||(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['2'][2]++,function(d,b){__cov_h$dr9w$CPUlBYC$TyFFtLg.f['2']++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['3']++;d.__proto__=b;})||(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['2'][3]++,function(d,b){__cov_h$dr9w$CPUlBYC$TyFFtLg.f['3']++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['4']++;for(var p in b){__cov_h$dr9w$CPUlBYC$TyFFtLg.s['5']++;if(b.hasOwnProperty(p)){__cov_h$dr9w$CPUlBYC$TyFFtLg.b['3'][0]++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['6']++;d[p]=b[p];}else{__cov_h$dr9w$CPUlBYC$TyFFtLg.b['3'][1]++;}}});__cov_h$dr9w$CPUlBYC$TyFFtLg.s['7']++;return function(d,b){__cov_h$dr9w$CPUlBYC$TyFFtLg.f['4']++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['8']++;extendStatics(d,b);function __(){__cov_h$dr9w$CPUlBYC$TyFFtLg.f['5']++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['10']++;this.constructor=d;}__cov_h$dr9w$CPUlBYC$TyFFtLg.s['11']++;d.prototype=b===null?(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['4'][0]++,Object.create(b)):(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_h$dr9w$CPUlBYC$TyFFtLg.s['12']++;exports.__esModule=true;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['13']++;var Command_1=require('./Command');__cov_h$dr9w$CPUlBYC$TyFFtLg.s['14']++;var DataCommand=function(_super){__cov_h$dr9w$CPUlBYC$TyFFtLg.f['6']++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['15']++;__extends(DataCommand,_super);function DataCommand(data){__cov_h$dr9w$CPUlBYC$TyFFtLg.f['7']++;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['17']++;var _this=(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['5'][0]++,_super.call(this))||(__cov_h$dr9w$CPUlBYC$TyFFtLg.b['5'][1]++,this);__cov_h$dr9w$CPUlBYC$TyFFtLg.s['18']++;_this.data=data;__cov_h$dr9w$CPUlBYC$TyFFtLg.s['19']++;_this.id='Data';__cov_h$dr9w$CPUlBYC$TyFFtLg.s['20']++;_this.className='org.opendolphin.core.comm.DataCommand';__cov_h$dr9w$CPUlBYC$TyFFtLg.s['21']++;return _this;}__cov_h$dr9w$CPUlBYC$TyFFtLg.s['22']++;return DataCommand;}(Command_1['default']);__cov_h$dr9w$CPUlBYC$TyFFtLg.s['23']++;exports['default']=DataCommand;

},{"./Command":52}],56:[function(require,module,exports){
"use strict";
var __cov_izvP2PUXJpEuP5FMziwYqg = (Function('return this'))();
if (!__cov_izvP2PUXJpEuP5FMziwYqg.__coverage__) { __cov_izvP2PUXJpEuP5FMziwYqg.__coverage__ = {}; }
__cov_izvP2PUXJpEuP5FMziwYqg = __cov_izvP2PUXJpEuP5FMziwYqg.__coverage__;
if (!(__cov_izvP2PUXJpEuP5FMziwYqg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeleteAllPresentationModelsOfTypeCommand.ts'])) {
   __cov_izvP2PUXJpEuP5FMziwYqg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeleteAllPresentationModelsOfTypeCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeleteAllPresentationModelsOfTypeCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":48},"end":{"line":14,"column":66}}},"7":{"name":"DeleteAllPresentationModelsOfTypeCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":62}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":24,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":64}},"16":{"start":{"line":16,"column":4},"end":{"line":22,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":30}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":55}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":95}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":21}},"22":{"start":{"line":23,"column":4},"end":{"line":23,"column":52}},"23":{"start":{"line":25,"column":0},"end":{"line":25,"column":62}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_izvP2PUXJpEuP5FMziwYqg = __cov_izvP2PUXJpEuP5FMziwYqg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeleteAllPresentationModelsOfTypeCommand.ts'];
__cov_izvP2PUXJpEuP5FMziwYqg.s['1']++;var __extends=(__cov_izvP2PUXJpEuP5FMziwYqg.b['1'][0]++,this)&&(__cov_izvP2PUXJpEuP5FMziwYqg.b['1'][1]++,this.__extends)||(__cov_izvP2PUXJpEuP5FMziwYqg.b['1'][2]++,function(){__cov_izvP2PUXJpEuP5FMziwYqg.f['1']++;__cov_izvP2PUXJpEuP5FMziwYqg.s['2']++;var extendStatics=(__cov_izvP2PUXJpEuP5FMziwYqg.b['2'][0]++,Object.setPrototypeOf)||(__cov_izvP2PUXJpEuP5FMziwYqg.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_izvP2PUXJpEuP5FMziwYqg.b['2'][2]++,function(d,b){__cov_izvP2PUXJpEuP5FMziwYqg.f['2']++;__cov_izvP2PUXJpEuP5FMziwYqg.s['3']++;d.__proto__=b;})||(__cov_izvP2PUXJpEuP5FMziwYqg.b['2'][3]++,function(d,b){__cov_izvP2PUXJpEuP5FMziwYqg.f['3']++;__cov_izvP2PUXJpEuP5FMziwYqg.s['4']++;for(var p in b){__cov_izvP2PUXJpEuP5FMziwYqg.s['5']++;if(b.hasOwnProperty(p)){__cov_izvP2PUXJpEuP5FMziwYqg.b['3'][0]++;__cov_izvP2PUXJpEuP5FMziwYqg.s['6']++;d[p]=b[p];}else{__cov_izvP2PUXJpEuP5FMziwYqg.b['3'][1]++;}}});__cov_izvP2PUXJpEuP5FMziwYqg.s['7']++;return function(d,b){__cov_izvP2PUXJpEuP5FMziwYqg.f['4']++;__cov_izvP2PUXJpEuP5FMziwYqg.s['8']++;extendStatics(d,b);function __(){__cov_izvP2PUXJpEuP5FMziwYqg.f['5']++;__cov_izvP2PUXJpEuP5FMziwYqg.s['10']++;this.constructor=d;}__cov_izvP2PUXJpEuP5FMziwYqg.s['11']++;d.prototype=b===null?(__cov_izvP2PUXJpEuP5FMziwYqg.b['4'][0]++,Object.create(b)):(__cov_izvP2PUXJpEuP5FMziwYqg.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_izvP2PUXJpEuP5FMziwYqg.s['12']++;exports.__esModule=true;__cov_izvP2PUXJpEuP5FMziwYqg.s['13']++;var Command_1=require('./Command');__cov_izvP2PUXJpEuP5FMziwYqg.s['14']++;var DeleteAllPresentationModelsOfTypeCommand=function(_super){__cov_izvP2PUXJpEuP5FMziwYqg.f['6']++;__cov_izvP2PUXJpEuP5FMziwYqg.s['15']++;__extends(DeleteAllPresentationModelsOfTypeCommand,_super);function DeleteAllPresentationModelsOfTypeCommand(pmType){__cov_izvP2PUXJpEuP5FMziwYqg.f['7']++;__cov_izvP2PUXJpEuP5FMziwYqg.s['17']++;var _this=(__cov_izvP2PUXJpEuP5FMziwYqg.b['5'][0]++,_super.call(this))||(__cov_izvP2PUXJpEuP5FMziwYqg.b['5'][1]++,this);__cov_izvP2PUXJpEuP5FMziwYqg.s['18']++;_this.pmType=pmType;__cov_izvP2PUXJpEuP5FMziwYqg.s['19']++;_this.id='DeleteAllPresentationModelsOfType';__cov_izvP2PUXJpEuP5FMziwYqg.s['20']++;_this.className='org.opendolphin.core.comm.DeleteAllPresentationModelsOfTypeCommand';__cov_izvP2PUXJpEuP5FMziwYqg.s['21']++;return _this;}__cov_izvP2PUXJpEuP5FMziwYqg.s['22']++;return DeleteAllPresentationModelsOfTypeCommand;}(Command_1['default']);__cov_izvP2PUXJpEuP5FMziwYqg.s['23']++;exports['default']=DeleteAllPresentationModelsOfTypeCommand;

},{"./Command":52}],57:[function(require,module,exports){
"use strict";
var __cov_2TBXgWBRerpAhm$_EcYbtQ = (Function('return this'))();
if (!__cov_2TBXgWBRerpAhm$_EcYbtQ.__coverage__) { __cov_2TBXgWBRerpAhm$_EcYbtQ.__coverage__ = {}; }
__cov_2TBXgWBRerpAhm$_EcYbtQ = __cov_2TBXgWBRerpAhm$_EcYbtQ.__coverage__;
if (!(__cov_2TBXgWBRerpAhm$_EcYbtQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletePresentationModelCommand.ts'])) {
   __cov_2TBXgWBRerpAhm$_EcYbtQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletePresentationModelCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletePresentationModelCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":38},"end":{"line":14,"column":56}}},"7":{"name":"DeletePresentationModelCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":50}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":24,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":54}},"16":{"start":{"line":16,"column":4},"end":{"line":22,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":26}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":45}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":85}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":21}},"22":{"start":{"line":23,"column":4},"end":{"line":23,"column":42}},"23":{"start":{"line":25,"column":0},"end":{"line":25,"column":52}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_2TBXgWBRerpAhm$_EcYbtQ = __cov_2TBXgWBRerpAhm$_EcYbtQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletePresentationModelCommand.ts'];
__cov_2TBXgWBRerpAhm$_EcYbtQ.s['1']++;var __extends=(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['1'][0]++,this)&&(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['1'][1]++,this.__extends)||(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['1'][2]++,function(){__cov_2TBXgWBRerpAhm$_EcYbtQ.f['1']++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['2']++;var extendStatics=(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['2'][0]++,Object.setPrototypeOf)||(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['2'][2]++,function(d,b){__cov_2TBXgWBRerpAhm$_EcYbtQ.f['2']++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['3']++;d.__proto__=b;})||(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['2'][3]++,function(d,b){__cov_2TBXgWBRerpAhm$_EcYbtQ.f['3']++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['4']++;for(var p in b){__cov_2TBXgWBRerpAhm$_EcYbtQ.s['5']++;if(b.hasOwnProperty(p)){__cov_2TBXgWBRerpAhm$_EcYbtQ.b['3'][0]++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['6']++;d[p]=b[p];}else{__cov_2TBXgWBRerpAhm$_EcYbtQ.b['3'][1]++;}}});__cov_2TBXgWBRerpAhm$_EcYbtQ.s['7']++;return function(d,b){__cov_2TBXgWBRerpAhm$_EcYbtQ.f['4']++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['8']++;extendStatics(d,b);function __(){__cov_2TBXgWBRerpAhm$_EcYbtQ.f['5']++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['10']++;this.constructor=d;}__cov_2TBXgWBRerpAhm$_EcYbtQ.s['11']++;d.prototype=b===null?(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['4'][0]++,Object.create(b)):(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_2TBXgWBRerpAhm$_EcYbtQ.s['12']++;exports.__esModule=true;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['13']++;var Command_1=require('./Command');__cov_2TBXgWBRerpAhm$_EcYbtQ.s['14']++;var DeletePresentationModelCommand=function(_super){__cov_2TBXgWBRerpAhm$_EcYbtQ.f['6']++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['15']++;__extends(DeletePresentationModelCommand,_super);function DeletePresentationModelCommand(pmId){__cov_2TBXgWBRerpAhm$_EcYbtQ.f['7']++;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['17']++;var _this=(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['5'][0]++,_super.call(this))||(__cov_2TBXgWBRerpAhm$_EcYbtQ.b['5'][1]++,this);__cov_2TBXgWBRerpAhm$_EcYbtQ.s['18']++;_this.pmId=pmId;__cov_2TBXgWBRerpAhm$_EcYbtQ.s['19']++;_this.id='DeletePresentationModel';__cov_2TBXgWBRerpAhm$_EcYbtQ.s['20']++;_this.className='org.opendolphin.core.comm.DeletePresentationModelCommand';__cov_2TBXgWBRerpAhm$_EcYbtQ.s['21']++;return _this;}__cov_2TBXgWBRerpAhm$_EcYbtQ.s['22']++;return DeletePresentationModelCommand;}(Command_1['default']);__cov_2TBXgWBRerpAhm$_EcYbtQ.s['23']++;exports['default']=DeletePresentationModelCommand;

},{"./Command":52}],58:[function(require,module,exports){
"use strict";
var __cov_du5NUL7r5gZHGqpDFPpJIA = (Function('return this'))();
if (!__cov_du5NUL7r5gZHGqpDFPpJIA.__coverage__) { __cov_du5NUL7r5gZHGqpDFPpJIA.__coverage__ = {}; }
__cov_du5NUL7r5gZHGqpDFPpJIA = __cov_du5NUL7r5gZHGqpDFPpJIA.__coverage__;
if (!(__cov_du5NUL7r5gZHGqpDFPpJIA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedAllPresentationModelsOfTypeNotification.ts'])) {
   __cov_du5NUL7r5gZHGqpDFPpJIA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedAllPresentationModelsOfTypeNotification.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedAllPresentationModelsOfTypeNotification.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":54},"end":{"line":14,"column":72}}},"7":{"name":"DeletedAllPresentationModelsOfTypeNotification","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":68}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":24,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":70}},"16":{"start":{"line":16,"column":4},"end":{"line":22,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":30}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":56}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":101}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":21}},"22":{"start":{"line":23,"column":4},"end":{"line":23,"column":58}},"23":{"start":{"line":25,"column":0},"end":{"line":25,"column":68}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_du5NUL7r5gZHGqpDFPpJIA = __cov_du5NUL7r5gZHGqpDFPpJIA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedAllPresentationModelsOfTypeNotification.ts'];
__cov_du5NUL7r5gZHGqpDFPpJIA.s['1']++;var __extends=(__cov_du5NUL7r5gZHGqpDFPpJIA.b['1'][0]++,this)&&(__cov_du5NUL7r5gZHGqpDFPpJIA.b['1'][1]++,this.__extends)||(__cov_du5NUL7r5gZHGqpDFPpJIA.b['1'][2]++,function(){__cov_du5NUL7r5gZHGqpDFPpJIA.f['1']++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['2']++;var extendStatics=(__cov_du5NUL7r5gZHGqpDFPpJIA.b['2'][0]++,Object.setPrototypeOf)||(__cov_du5NUL7r5gZHGqpDFPpJIA.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_du5NUL7r5gZHGqpDFPpJIA.b['2'][2]++,function(d,b){__cov_du5NUL7r5gZHGqpDFPpJIA.f['2']++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['3']++;d.__proto__=b;})||(__cov_du5NUL7r5gZHGqpDFPpJIA.b['2'][3]++,function(d,b){__cov_du5NUL7r5gZHGqpDFPpJIA.f['3']++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['4']++;for(var p in b){__cov_du5NUL7r5gZHGqpDFPpJIA.s['5']++;if(b.hasOwnProperty(p)){__cov_du5NUL7r5gZHGqpDFPpJIA.b['3'][0]++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['6']++;d[p]=b[p];}else{__cov_du5NUL7r5gZHGqpDFPpJIA.b['3'][1]++;}}});__cov_du5NUL7r5gZHGqpDFPpJIA.s['7']++;return function(d,b){__cov_du5NUL7r5gZHGqpDFPpJIA.f['4']++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['8']++;extendStatics(d,b);function __(){__cov_du5NUL7r5gZHGqpDFPpJIA.f['5']++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['10']++;this.constructor=d;}__cov_du5NUL7r5gZHGqpDFPpJIA.s['11']++;d.prototype=b===null?(__cov_du5NUL7r5gZHGqpDFPpJIA.b['4'][0]++,Object.create(b)):(__cov_du5NUL7r5gZHGqpDFPpJIA.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_du5NUL7r5gZHGqpDFPpJIA.s['12']++;exports.__esModule=true;__cov_du5NUL7r5gZHGqpDFPpJIA.s['13']++;var Command_1=require('./Command');__cov_du5NUL7r5gZHGqpDFPpJIA.s['14']++;var DeletedAllPresentationModelsOfTypeNotification=function(_super){__cov_du5NUL7r5gZHGqpDFPpJIA.f['6']++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['15']++;__extends(DeletedAllPresentationModelsOfTypeNotification,_super);function DeletedAllPresentationModelsOfTypeNotification(pmType){__cov_du5NUL7r5gZHGqpDFPpJIA.f['7']++;__cov_du5NUL7r5gZHGqpDFPpJIA.s['17']++;var _this=(__cov_du5NUL7r5gZHGqpDFPpJIA.b['5'][0]++,_super.call(this))||(__cov_du5NUL7r5gZHGqpDFPpJIA.b['5'][1]++,this);__cov_du5NUL7r5gZHGqpDFPpJIA.s['18']++;_this.pmType=pmType;__cov_du5NUL7r5gZHGqpDFPpJIA.s['19']++;_this.id='DeletedAllPresentationModelsOfType';__cov_du5NUL7r5gZHGqpDFPpJIA.s['20']++;_this.className='org.opendolphin.core.comm.DeletedAllPresentationModelsOfTypeNotification';__cov_du5NUL7r5gZHGqpDFPpJIA.s['21']++;return _this;}__cov_du5NUL7r5gZHGqpDFPpJIA.s['22']++;return DeletedAllPresentationModelsOfTypeNotification;}(Command_1['default']);__cov_du5NUL7r5gZHGqpDFPpJIA.s['23']++;exports['default']=DeletedAllPresentationModelsOfTypeNotification;

},{"./Command":52}],59:[function(require,module,exports){
"use strict";
var __cov_VYn2ly4Vl_cCL2Z7OsmN4Q = (Function('return this'))();
if (!__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.__coverage__) { __cov_VYn2ly4Vl_cCL2Z7OsmN4Q.__coverage__ = {}; }
__cov_VYn2ly4Vl_cCL2Z7OsmN4Q = __cov_VYn2ly4Vl_cCL2Z7OsmN4Q.__coverage__;
if (!(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedPresentationModelNotification.ts'])) {
   __cov_VYn2ly4Vl_cCL2Z7OsmN4Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedPresentationModelNotification.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedPresentationModelNotification.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":44},"end":{"line":14,"column":62}}},"7":{"name":"DeletedPresentationModelNotification","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":56}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":24,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":60}},"16":{"start":{"line":16,"column":4},"end":{"line":22,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":26}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":46}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":91}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":21}},"22":{"start":{"line":23,"column":4},"end":{"line":23,"column":48}},"23":{"start":{"line":25,"column":0},"end":{"line":25,"column":58}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_VYn2ly4Vl_cCL2Z7OsmN4Q = __cov_VYn2ly4Vl_cCL2Z7OsmN4Q['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DeletedPresentationModelNotification.ts'];
__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['1']++;var __extends=(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['1'][0]++,this)&&(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['1'][1]++,this.__extends)||(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['1'][2]++,function(){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.f['1']++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['2']++;var extendStatics=(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['2'][0]++,Object.setPrototypeOf)||(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['2'][2]++,function(d,b){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.f['2']++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['3']++;d.__proto__=b;})||(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['2'][3]++,function(d,b){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.f['3']++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['4']++;for(var p in b){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['5']++;if(b.hasOwnProperty(p)){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['3'][0]++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['6']++;d[p]=b[p];}else{__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['3'][1]++;}}});__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['7']++;return function(d,b){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.f['4']++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['8']++;extendStatics(d,b);function __(){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.f['5']++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['10']++;this.constructor=d;}__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['11']++;d.prototype=b===null?(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['4'][0]++,Object.create(b)):(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['12']++;exports.__esModule=true;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['13']++;var Command_1=require('./Command');__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['14']++;var DeletedPresentationModelNotification=function(_super){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.f['6']++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['15']++;__extends(DeletedPresentationModelNotification,_super);function DeletedPresentationModelNotification(pmId){__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.f['7']++;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['17']++;var _this=(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['5'][0]++,_super.call(this))||(__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.b['5'][1]++,this);__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['18']++;_this.pmId=pmId;__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['19']++;_this.id='DeletedPresentationModel';__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['20']++;_this.className='org.opendolphin.core.comm.DeletedPresentationModelNotification';__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['21']++;return _this;}__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['22']++;return DeletedPresentationModelNotification;}(Command_1['default']);__cov_VYn2ly4Vl_cCL2Z7OsmN4Q.s['23']++;exports['default']=DeletedPresentationModelNotification;

},{"./Command":52}],60:[function(require,module,exports){
"use strict";
var __cov_J3eMBCfLZk$KqEl5mA$sWQ = (Function('return this'))();
if (!__cov_J3eMBCfLZk$KqEl5mA$sWQ.__coverage__) { __cov_J3eMBCfLZk$KqEl5mA$sWQ.__coverage__ = {}; }
__cov_J3eMBCfLZk$KqEl5mA$sWQ = __cov_J3eMBCfLZk$KqEl5mA$sWQ.__coverage__;
if (!(__cov_J3eMBCfLZk$KqEl5mA$sWQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DolphinBuilder.ts'])) {
   __cov_J3eMBCfLZk$KqEl5mA$sWQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DolphinBuilder.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DolphinBuilder.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":1,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0},"fnMap":{"1":{"name":"(anonymous_1)","line":8,"loc":{"start":{"line":8,"column":22},"end":{"line":8,"column":34}}},"2":{"name":"DolphinBuilder","line":9,"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":30}}},"3":{"name":"(anonymous_3)","line":15,"loc":{"start":{"line":15,"column":35},"end":{"line":15,"column":50}}},"4":{"name":"(anonymous_4)","line":19,"loc":{"start":{"line":19,"column":37},"end":{"line":19,"column":54}}},"5":{"name":"(anonymous_5)","line":23,"loc":{"start":{"line":23,"column":39},"end":{"line":23,"column":58}}},"6":{"name":"(anonymous_6)","line":27,"loc":{"start":{"line":27,"column":44},"end":{"line":27,"column":68}}},"7":{"name":"(anonymous_7)","line":31,"loc":{"start":{"line":31,"column":43},"end":{"line":31,"column":66}}},"8":{"name":"(anonymous_8)","line":35,"loc":{"start":{"line":35,"column":44},"end":{"line":35,"column":68}}},"9":{"name":"(anonymous_9)","line":39,"loc":{"start":{"line":39,"column":43},"end":{"line":39,"column":66}}},"10":{"name":"(anonymous_10)","line":43,"loc":{"start":{"line":43,"column":37},"end":{"line":43,"column":49}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":53}},"3":{"start":{"line":4,"column":0},"end":{"line":4,"column":49}},"4":{"start":{"line":5,"column":0},"end":{"line":5,"column":55}},"5":{"start":{"line":6,"column":0},"end":{"line":6,"column":53}},"6":{"start":{"line":7,"column":0},"end":{"line":7,"column":49}},"7":{"start":{"line":8,"column":0},"end":{"line":59,"column":5}},"8":{"start":{"line":9,"column":4},"end":{"line":14,"column":5}},"9":{"start":{"line":10,"column":8},"end":{"line":10,"column":28}},"10":{"start":{"line":11,"column":8},"end":{"line":11,"column":28}},"11":{"start":{"line":12,"column":8},"end":{"line":12,"column":32}},"12":{"start":{"line":13,"column":8},"end":{"line":13,"column":34}},"13":{"start":{"line":15,"column":4},"end":{"line":18,"column":6}},"14":{"start":{"line":16,"column":8},"end":{"line":16,"column":24}},"15":{"start":{"line":17,"column":8},"end":{"line":17,"column":20}},"16":{"start":{"line":19,"column":4},"end":{"line":22,"column":6}},"17":{"start":{"line":20,"column":8},"end":{"line":20,"column":28}},"18":{"start":{"line":21,"column":8},"end":{"line":21,"column":20}},"19":{"start":{"line":23,"column":4},"end":{"line":26,"column":6}},"20":{"start":{"line":24,"column":8},"end":{"line":24,"column":32}},"21":{"start":{"line":25,"column":8},"end":{"line":25,"column":20}},"22":{"start":{"line":27,"column":4},"end":{"line":30,"column":6}},"23":{"start":{"line":28,"column":8},"end":{"line":28,"column":42}},"24":{"start":{"line":29,"column":8},"end":{"line":29,"column":20}},"25":{"start":{"line":31,"column":4},"end":{"line":34,"column":6}},"26":{"start":{"line":32,"column":8},"end":{"line":32,"column":40}},"27":{"start":{"line":33,"column":8},"end":{"line":33,"column":20}},"28":{"start":{"line":35,"column":4},"end":{"line":38,"column":6}},"29":{"start":{"line":36,"column":8},"end":{"line":36,"column":42}},"30":{"start":{"line":37,"column":8},"end":{"line":37,"column":20}},"31":{"start":{"line":39,"column":4},"end":{"line":42,"column":6}},"32":{"start":{"line":40,"column":8},"end":{"line":40,"column":40}},"33":{"start":{"line":41,"column":8},"end":{"line":41,"column":20}},"34":{"start":{"line":43,"column":4},"end":{"line":57,"column":6}},"35":{"start":{"line":44,"column":8},"end":{"line":44,"column":44}},"36":{"start":{"line":45,"column":8},"end":{"line":45,"column":61}},"37":{"start":{"line":46,"column":8},"end":{"line":46,"column":24}},"38":{"start":{"line":47,"column":8},"end":{"line":52,"column":9}},"39":{"start":{"line":48,"column":12},"end":{"line":48,"column":150}},"40":{"start":{"line":51,"column":12},"end":{"line":51,"column":59}},"41":{"start":{"line":53,"column":8},"end":{"line":53,"column":143}},"42":{"start":{"line":54,"column":8},"end":{"line":54,"column":98}},"43":{"start":{"line":55,"column":8},"end":{"line":55,"column":49}},"44":{"start":{"line":56,"column":8},"end":{"line":56,"column":29}},"45":{"start":{"line":58,"column":4},"end":{"line":58,"column":26}},"46":{"start":{"line":60,"column":0},"end":{"line":60,"column":36}}},"branchMap":{"1":{"line":47,"type":"if","locations":[{"start":{"line":47,"column":8},"end":{"line":47,"column":8}},{"start":{"line":47,"column":8},"end":{"line":47,"column":8}}]},"2":{"line":47,"type":"binary-expr","locations":[{"start":{"line":47,"column":12},"end":{"line":47,"column":29}},{"start":{"line":47,"column":33},"end":{"line":47,"column":53}}]}}};
}
__cov_J3eMBCfLZk$KqEl5mA$sWQ = __cov_J3eMBCfLZk$KqEl5mA$sWQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/DolphinBuilder.ts'];
__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['1']++;exports.__esModule=true;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['2']++;var ClientConnector_1=require('./ClientConnector');__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['3']++;var ClientDolphin_1=require('./ClientDolphin');__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['4']++;var ClientModelStore_1=require('./ClientModelStore');__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['5']++;var HttpTransmitter_1=require('./HttpTransmitter');__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['6']++;var NoTransmitter_1=require('./NoTransmitter');__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['7']++;var DolphinBuilder=function(){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['1']++;function DolphinBuilder(){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['2']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['9']++;this.reset_=false;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['10']++;this.slackMS_=300;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['11']++;this.maxBatchSize_=50;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['12']++;this.supportCORS_=false;}__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['13']++;DolphinBuilder.prototype.url=function(url){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['3']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['14']++;this.url_=url;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['15']++;return this;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['16']++;DolphinBuilder.prototype.reset=function(reset){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['4']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['17']++;this.reset_=reset;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['18']++;return this;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['19']++;DolphinBuilder.prototype.slackMS=function(slackMS){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['5']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['20']++;this.slackMS_=slackMS;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['21']++;return this;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['22']++;DolphinBuilder.prototype.maxBatchSize=function(maxBatchSize){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['6']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['23']++;this.maxBatchSize_=maxBatchSize;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['24']++;return this;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['25']++;DolphinBuilder.prototype.supportCORS=function(supportCORS){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['7']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['26']++;this.supportCORS_=supportCORS;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['27']++;return this;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['28']++;DolphinBuilder.prototype.errorHandler=function(errorHandler){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['8']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['29']++;this.errorHandler_=errorHandler;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['30']++;return this;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['31']++;DolphinBuilder.prototype.headersInfo=function(headersInfo){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['9']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['32']++;this.headersInfo_=headersInfo;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['33']++;return this;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['34']++;DolphinBuilder.prototype.build=function(){__cov_J3eMBCfLZk$KqEl5mA$sWQ.f['10']++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['35']++;console.log('OpenDolphin js found');__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['36']++;var clientDolphin=new ClientDolphin_1['default']();__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['37']++;var transmitter;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['38']++;if((__cov_J3eMBCfLZk$KqEl5mA$sWQ.b['2'][0]++,this.url_!=null)&&(__cov_J3eMBCfLZk$KqEl5mA$sWQ.b['2'][1]++,this.url_.length>0)){__cov_J3eMBCfLZk$KqEl5mA$sWQ.b['1'][0]++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['39']++;transmitter=new HttpTransmitter_1['default'](this.url_,this.reset_,'UTF-8',this.errorHandler_,this.supportCORS_,this.headersInfo_);}else{__cov_J3eMBCfLZk$KqEl5mA$sWQ.b['1'][1]++;__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['40']++;transmitter=new NoTransmitter_1['default']();}__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['41']++;clientDolphin.setClientConnector(new ClientConnector_1.ClientConnector(transmitter,clientDolphin,this.slackMS_,this.maxBatchSize_));__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['42']++;clientDolphin.setClientModelStore(new ClientModelStore_1.ClientModelStore(clientDolphin));__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['43']++;console.log('ClientDolphin initialized');__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['44']++;return clientDolphin;};__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['45']++;return DolphinBuilder;}();__cov_J3eMBCfLZk$KqEl5mA$sWQ.s['46']++;exports['default']=DolphinBuilder;

},{"./ClientConnector":47,"./ClientDolphin":48,"./ClientModelStore":49,"./HttpTransmitter":64,"./NoTransmitter":67}],61:[function(require,module,exports){
"use strict";
var __cov_xCJ_8IypMUK0viC0VwkCHw = (Function('return this'))();
if (!__cov_xCJ_8IypMUK0viC0VwkCHw.__coverage__) { __cov_xCJ_8IypMUK0viC0VwkCHw.__coverage__ = {}; }
__cov_xCJ_8IypMUK0viC0VwkCHw = __cov_xCJ_8IypMUK0viC0VwkCHw.__coverage__;
if (!(__cov_xCJ_8IypMUK0viC0VwkCHw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EmptyNotification.ts'])) {
   __cov_xCJ_8IypMUK0viC0VwkCHw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EmptyNotification.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EmptyNotification.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":25},"end":{"line":14,"column":43}}},"7":{"name":"EmptyNotification","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":33}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":23,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":41}},"16":{"start":{"line":16,"column":4},"end":{"line":21,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":27}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":72}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":21}},"21":{"start":{"line":22,"column":4},"end":{"line":22,"column":29}},"22":{"start":{"line":24,"column":0},"end":{"line":24,"column":39}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_xCJ_8IypMUK0viC0VwkCHw = __cov_xCJ_8IypMUK0viC0VwkCHw['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EmptyNotification.ts'];
__cov_xCJ_8IypMUK0viC0VwkCHw.s['1']++;var __extends=(__cov_xCJ_8IypMUK0viC0VwkCHw.b['1'][0]++,this)&&(__cov_xCJ_8IypMUK0viC0VwkCHw.b['1'][1]++,this.__extends)||(__cov_xCJ_8IypMUK0viC0VwkCHw.b['1'][2]++,function(){__cov_xCJ_8IypMUK0viC0VwkCHw.f['1']++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['2']++;var extendStatics=(__cov_xCJ_8IypMUK0viC0VwkCHw.b['2'][0]++,Object.setPrototypeOf)||(__cov_xCJ_8IypMUK0viC0VwkCHw.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_xCJ_8IypMUK0viC0VwkCHw.b['2'][2]++,function(d,b){__cov_xCJ_8IypMUK0viC0VwkCHw.f['2']++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['3']++;d.__proto__=b;})||(__cov_xCJ_8IypMUK0viC0VwkCHw.b['2'][3]++,function(d,b){__cov_xCJ_8IypMUK0viC0VwkCHw.f['3']++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['4']++;for(var p in b){__cov_xCJ_8IypMUK0viC0VwkCHw.s['5']++;if(b.hasOwnProperty(p)){__cov_xCJ_8IypMUK0viC0VwkCHw.b['3'][0]++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['6']++;d[p]=b[p];}else{__cov_xCJ_8IypMUK0viC0VwkCHw.b['3'][1]++;}}});__cov_xCJ_8IypMUK0viC0VwkCHw.s['7']++;return function(d,b){__cov_xCJ_8IypMUK0viC0VwkCHw.f['4']++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['8']++;extendStatics(d,b);function __(){__cov_xCJ_8IypMUK0viC0VwkCHw.f['5']++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['10']++;this.constructor=d;}__cov_xCJ_8IypMUK0viC0VwkCHw.s['11']++;d.prototype=b===null?(__cov_xCJ_8IypMUK0viC0VwkCHw.b['4'][0]++,Object.create(b)):(__cov_xCJ_8IypMUK0viC0VwkCHw.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_xCJ_8IypMUK0viC0VwkCHw.s['12']++;exports.__esModule=true;__cov_xCJ_8IypMUK0viC0VwkCHw.s['13']++;var Command_1=require('./Command');__cov_xCJ_8IypMUK0viC0VwkCHw.s['14']++;var EmptyNotification=function(_super){__cov_xCJ_8IypMUK0viC0VwkCHw.f['6']++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['15']++;__extends(EmptyNotification,_super);function EmptyNotification(){__cov_xCJ_8IypMUK0viC0VwkCHw.f['7']++;__cov_xCJ_8IypMUK0viC0VwkCHw.s['17']++;var _this=(__cov_xCJ_8IypMUK0viC0VwkCHw.b['5'][0]++,_super.call(this))||(__cov_xCJ_8IypMUK0viC0VwkCHw.b['5'][1]++,this);__cov_xCJ_8IypMUK0viC0VwkCHw.s['18']++;_this.id='Empty';__cov_xCJ_8IypMUK0viC0VwkCHw.s['19']++;_this.className='org.opendolphin.core.comm.EmptyNotification';__cov_xCJ_8IypMUK0viC0VwkCHw.s['20']++;return _this;}__cov_xCJ_8IypMUK0viC0VwkCHw.s['21']++;return EmptyNotification;}(Command_1['default']);__cov_xCJ_8IypMUK0viC0VwkCHw.s['22']++;exports['default']=EmptyNotification;

},{"./Command":52}],62:[function(require,module,exports){
"use strict";
var __cov_bQ2OCZ0TJRGF62MBDeKY7g = (Function('return this'))();
if (!__cov_bQ2OCZ0TJRGF62MBDeKY7g.__coverage__) { __cov_bQ2OCZ0TJRGF62MBDeKY7g.__coverage__ = {}; }
__cov_bQ2OCZ0TJRGF62MBDeKY7g = __cov_bQ2OCZ0TJRGF62MBDeKY7g.__coverage__;
if (!(__cov_bQ2OCZ0TJRGF62MBDeKY7g['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EventBus.ts'])) {
   __cov_bQ2OCZ0TJRGF62MBDeKY7g['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EventBus.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EventBus.ts","s":{"1":0,"2":0,"3":1,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0},"b":{},"f":{"1":0,"2":0,"3":0,"4":0,"5":0},"fnMap":{"1":{"name":"(anonymous_1)","line":3,"loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":28}}},"2":{"name":"EventBus","line":4,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":24}}},"3":{"name":"(anonymous_3)","line":7,"loc":{"start":{"line":7,"column":33},"end":{"line":7,"column":57}}},"4":{"name":"(anonymous_4)","line":10,"loc":{"start":{"line":10,"column":33},"end":{"line":10,"column":50}}},"5":{"name":"(anonymous_5)","line":11,"loc":{"start":{"line":11,"column":35},"end":{"line":11,"column":53}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":14,"column":5}},"3":{"start":{"line":4,"column":4},"end":{"line":6,"column":5}},"4":{"start":{"line":5,"column":8},"end":{"line":5,"column":32}},"5":{"start":{"line":7,"column":4},"end":{"line":9,"column":6}},"6":{"start":{"line":8,"column":8},"end":{"line":8,"column":46}},"7":{"start":{"line":10,"column":4},"end":{"line":12,"column":6}},"8":{"start":{"line":11,"column":8},"end":{"line":11,"column":80}},"9":{"start":{"line":11,"column":55},"end":{"line":11,"column":76}},"10":{"start":{"line":13,"column":4},"end":{"line":13,"column":20}},"11":{"start":{"line":15,"column":0},"end":{"line":15,"column":30}}},"branchMap":{}};
}
__cov_bQ2OCZ0TJRGF62MBDeKY7g = __cov_bQ2OCZ0TJRGF62MBDeKY7g['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/EventBus.ts'];
__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['1']++;exports.__esModule=true;__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['2']++;var EventBus=function(){__cov_bQ2OCZ0TJRGF62MBDeKY7g.f['1']++;function EventBus(){__cov_bQ2OCZ0TJRGF62MBDeKY7g.f['2']++;__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['4']++;this.eventHandlers=[];}__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['5']++;EventBus.prototype.onEvent=function(eventHandler){__cov_bQ2OCZ0TJRGF62MBDeKY7g.f['3']++;__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['6']++;this.eventHandlers.push(eventHandler);};__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['7']++;EventBus.prototype.trigger=function(event){__cov_bQ2OCZ0TJRGF62MBDeKY7g.f['4']++;__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['8']++;this.eventHandlers.forEach(function(handle){__cov_bQ2OCZ0TJRGF62MBDeKY7g.f['5']++;__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['9']++;return handle(event);});};__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['10']++;return EventBus;}();__cov_bQ2OCZ0TJRGF62MBDeKY7g.s['11']++;exports['default']=EventBus;

},{}],63:[function(require,module,exports){
"use strict";
var __cov_TQW118OyAFQIymPABMHOOQ = (Function('return this'))();
if (!__cov_TQW118OyAFQIymPABMHOOQ.__coverage__) { __cov_TQW118OyAFQIymPABMHOOQ.__coverage__ = {}; }
__cov_TQW118OyAFQIymPABMHOOQ = __cov_TQW118OyAFQIymPABMHOOQ.__coverage__;
if (!(__cov_TQW118OyAFQIymPABMHOOQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/GetPresentationModelCommand.ts'])) {
   __cov_TQW118OyAFQIymPABMHOOQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/GetPresentationModelCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/GetPresentationModelCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":35},"end":{"line":14,"column":53}}},"7":{"name":"GetPresentationModelCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":47}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":24,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":51}},"16":{"start":{"line":16,"column":4},"end":{"line":22,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":26}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":42}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":82}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":21}},"22":{"start":{"line":23,"column":4},"end":{"line":23,"column":39}},"23":{"start":{"line":25,"column":0},"end":{"line":25,"column":49}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_TQW118OyAFQIymPABMHOOQ = __cov_TQW118OyAFQIymPABMHOOQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/GetPresentationModelCommand.ts'];
__cov_TQW118OyAFQIymPABMHOOQ.s['1']++;var __extends=(__cov_TQW118OyAFQIymPABMHOOQ.b['1'][0]++,this)&&(__cov_TQW118OyAFQIymPABMHOOQ.b['1'][1]++,this.__extends)||(__cov_TQW118OyAFQIymPABMHOOQ.b['1'][2]++,function(){__cov_TQW118OyAFQIymPABMHOOQ.f['1']++;__cov_TQW118OyAFQIymPABMHOOQ.s['2']++;var extendStatics=(__cov_TQW118OyAFQIymPABMHOOQ.b['2'][0]++,Object.setPrototypeOf)||(__cov_TQW118OyAFQIymPABMHOOQ.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_TQW118OyAFQIymPABMHOOQ.b['2'][2]++,function(d,b){__cov_TQW118OyAFQIymPABMHOOQ.f['2']++;__cov_TQW118OyAFQIymPABMHOOQ.s['3']++;d.__proto__=b;})||(__cov_TQW118OyAFQIymPABMHOOQ.b['2'][3]++,function(d,b){__cov_TQW118OyAFQIymPABMHOOQ.f['3']++;__cov_TQW118OyAFQIymPABMHOOQ.s['4']++;for(var p in b){__cov_TQW118OyAFQIymPABMHOOQ.s['5']++;if(b.hasOwnProperty(p)){__cov_TQW118OyAFQIymPABMHOOQ.b['3'][0]++;__cov_TQW118OyAFQIymPABMHOOQ.s['6']++;d[p]=b[p];}else{__cov_TQW118OyAFQIymPABMHOOQ.b['3'][1]++;}}});__cov_TQW118OyAFQIymPABMHOOQ.s['7']++;return function(d,b){__cov_TQW118OyAFQIymPABMHOOQ.f['4']++;__cov_TQW118OyAFQIymPABMHOOQ.s['8']++;extendStatics(d,b);function __(){__cov_TQW118OyAFQIymPABMHOOQ.f['5']++;__cov_TQW118OyAFQIymPABMHOOQ.s['10']++;this.constructor=d;}__cov_TQW118OyAFQIymPABMHOOQ.s['11']++;d.prototype=b===null?(__cov_TQW118OyAFQIymPABMHOOQ.b['4'][0]++,Object.create(b)):(__cov_TQW118OyAFQIymPABMHOOQ.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_TQW118OyAFQIymPABMHOOQ.s['12']++;exports.__esModule=true;__cov_TQW118OyAFQIymPABMHOOQ.s['13']++;var Command_1=require('./Command');__cov_TQW118OyAFQIymPABMHOOQ.s['14']++;var GetPresentationModelCommand=function(_super){__cov_TQW118OyAFQIymPABMHOOQ.f['6']++;__cov_TQW118OyAFQIymPABMHOOQ.s['15']++;__extends(GetPresentationModelCommand,_super);function GetPresentationModelCommand(pmId){__cov_TQW118OyAFQIymPABMHOOQ.f['7']++;__cov_TQW118OyAFQIymPABMHOOQ.s['17']++;var _this=(__cov_TQW118OyAFQIymPABMHOOQ.b['5'][0]++,_super.call(this))||(__cov_TQW118OyAFQIymPABMHOOQ.b['5'][1]++,this);__cov_TQW118OyAFQIymPABMHOOQ.s['18']++;_this.pmId=pmId;__cov_TQW118OyAFQIymPABMHOOQ.s['19']++;_this.id='GetPresentationModel';__cov_TQW118OyAFQIymPABMHOOQ.s['20']++;_this.className='org.opendolphin.core.comm.GetPresentationModelCommand';__cov_TQW118OyAFQIymPABMHOOQ.s['21']++;return _this;}__cov_TQW118OyAFQIymPABMHOOQ.s['22']++;return GetPresentationModelCommand;}(Command_1['default']);__cov_TQW118OyAFQIymPABMHOOQ.s['23']++;exports['default']=GetPresentationModelCommand;

},{"./Command":52}],64:[function(require,module,exports){
"use strict";
var __cov_Q19HP751RRJdCKeH85GxAQ = (Function('return this'))();
if (!__cov_Q19HP751RRJdCKeH85GxAQ.__coverage__) { __cov_Q19HP751RRJdCKeH85GxAQ.__coverage__ = {}; }
__cov_Q19HP751RRJdCKeH85GxAQ = __cov_Q19HP751RRJdCKeH85GxAQ.__coverage__;
if (!(__cov_Q19HP751RRJdCKeH85GxAQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/HttpTransmitter.ts'])) {
   __cov_Q19HP751RRJdCKeH85GxAQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/HttpTransmitter.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/HttpTransmitter.ts","s":{"1":0,"2":0,"3":0,"4":1,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"79":0,"80":0,"81":0,"82":0,"83":0,"84":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0],"12":[0,0],"13":[0,0],"14":[0,0],"15":[0,0],"16":[0,0],"17":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0},"fnMap":{"1":{"name":"(anonymous_1)","line":4,"loc":{"start":{"line":4,"column":23},"end":{"line":4,"column":35}}},"2":{"name":"HttpTransmitter","line":5,"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":90}}},"3":{"name":"(anonymous_3)","line":36,"loc":{"start":{"line":36,"column":41},"end":{"line":36,"column":69}}},"4":{"name":"(anonymous_4)","line":38,"loc":{"start":{"line":38,"column":28},"end":{"line":38,"column":43}}},"5":{"name":"(anonymous_5)","line":42,"loc":{"start":{"line":42,"column":39},"end":{"line":42,"column":54}}},"6":{"name":"(anonymous_6)","line":76,"loc":{"start":{"line":76,"column":43},"end":{"line":76,"column":62}}},"7":{"name":"(anonymous_7)","line":85,"loc":{"start":{"line":85,"column":44},"end":{"line":85,"column":69}}},"8":{"name":"(anonymous_8)","line":94,"loc":{"start":{"line":94,"column":39},"end":{"line":94,"column":58}}},"9":{"name":"(anonymous_9)","line":100,"loc":{"start":{"line":100,"column":43},"end":{"line":100,"column":55}}},"10":{"name":"(anonymous_10)","line":104,"loc":{"start":{"line":104,"column":38},"end":{"line":104,"column":64}}},"11":{"name":"(anonymous_11)","line":106,"loc":{"start":{"line":106,"column":39},"end":{"line":106,"column":54}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":3,"column":0},"end":{"line":3,"column":33}},"3":{"start":{"line":4,"column":0},"end":{"line":120,"column":5}},"4":{"start":{"line":5,"column":4},"end":{"line":35,"column":5}},"5":{"start":{"line":6,"column":8},"end":{"line":6,"column":47}},"6":{"start":{"line":6,"column":32},"end":{"line":6,"column":45}},"7":{"start":{"line":7,"column":8},"end":{"line":7,"column":54}},"8":{"start":{"line":7,"column":34},"end":{"line":7,"column":52}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":61}},"10":{"start":{"line":8,"column":39},"end":{"line":8,"column":59}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":60}},"12":{"start":{"line":9,"column":38},"end":{"line":9,"column":58}},"13":{"start":{"line":10,"column":8},"end":{"line":10,"column":59}},"14":{"start":{"line":10,"column":38},"end":{"line":10,"column":57}},"15":{"start":{"line":11,"column":8},"end":{"line":11,"column":23}},"16":{"start":{"line":12,"column":8},"end":{"line":12,"column":31}},"17":{"start":{"line":13,"column":8},"end":{"line":16,"column":10}},"18":{"start":{"line":17,"column":8},"end":{"line":17,"column":41}},"19":{"start":{"line":18,"column":8},"end":{"line":18,"column":39}},"20":{"start":{"line":19,"column":8},"end":{"line":19,"column":39}},"21":{"start":{"line":20,"column":8},"end":{"line":20,"column":41}},"22":{"start":{"line":21,"column":8},"end":{"line":21,"column":40}},"23":{"start":{"line":22,"column":8},"end":{"line":29,"column":9}},"24":{"start":{"line":23,"column":12},"end":{"line":26,"column":13}},"25":{"start":{"line":24,"column":16},"end":{"line":24,"column":49}},"26":{"start":{"line":25,"column":16},"end":{"line":25,"column":48}},"27":{"start":{"line":30,"column":8},"end":{"line":30,"column":46}},"28":{"start":{"line":31,"column":8},"end":{"line":34,"column":9}},"29":{"start":{"line":32,"column":12},"end":{"line":32,"column":121}},"30":{"start":{"line":33,"column":12},"end":{"line":33,"column":30}},"31":{"start":{"line":36,"column":4},"end":{"line":75,"column":6}},"32":{"start":{"line":37,"column":8},"end":{"line":37,"column":25}},"33":{"start":{"line":38,"column":8},"end":{"line":41,"column":10}},"34":{"start":{"line":39,"column":12},"end":{"line":39,"column":45}},"35":{"start":{"line":40,"column":12},"end":{"line":40,"column":23}},"36":{"start":{"line":42,"column":8},"end":{"line":68,"column":10}},"37":{"start":{"line":43,"column":12},"end":{"line":67,"column":13}},"38":{"start":{"line":44,"column":16},"end":{"line":66,"column":17}},"39":{"start":{"line":45,"column":20},"end":{"line":45,"column":63}},"40":{"start":{"line":46,"column":20},"end":{"line":61,"column":21}},"41":{"start":{"line":47,"column":24},"end":{"line":56,"column":25}},"42":{"start":{"line":48,"column":28},"end":{"line":48,"column":84}},"43":{"start":{"line":49,"column":28},"end":{"line":49,"column":53}},"44":{"start":{"line":52,"column":28},"end":{"line":52,"column":86}},"45":{"start":{"line":53,"column":28},"end":{"line":53,"column":82}},"46":{"start":{"line":54,"column":28},"end":{"line":54,"column":121}},"47":{"start":{"line":55,"column":28},"end":{"line":55,"column":39}},"48":{"start":{"line":59,"column":24},"end":{"line":59,"column":96}},"49":{"start":{"line":60,"column":24},"end":{"line":60,"column":35}},"50":{"start":{"line":64,"column":20},"end":{"line":64,"column":92}},"51":{"start":{"line":65,"column":20},"end":{"line":65,"column":31}},"52":{"start":{"line":69,"column":8},"end":{"line":69,"column":47}},"53":{"start":{"line":70,"column":8},"end":{"line":70,"column":35}},"54":{"start":{"line":71,"column":8},"end":{"line":73,"column":9}},"55":{"start":{"line":72,"column":12},"end":{"line":72,"column":84}},"56":{"start":{"line":74,"column":8},"end":{"line":74,"column":52}},"57":{"start":{"line":76,"column":4},"end":{"line":84,"column":6}},"58":{"start":{"line":77,"column":8},"end":{"line":83,"column":9}},"59":{"start":{"line":78,"column":12},"end":{"line":82,"column":13}},"60":{"start":{"line":79,"column":16},"end":{"line":81,"column":17}},"61":{"start":{"line":80,"column":20},"end":{"line":80,"column":69}},"62":{"start":{"line":85,"column":4},"end":{"line":93,"column":6}},"63":{"start":{"line":86,"column":8},"end":{"line":86,"column":103}},"64":{"start":{"line":87,"column":8},"end":{"line":92,"column":9}},"65":{"start":{"line":88,"column":12},"end":{"line":88,"column":42}},"66":{"start":{"line":91,"column":12},"end":{"line":91,"column":56}},"67":{"start":{"line":94,"column":4},"end":{"line":98,"column":6}},"68":{"start":{"line":95,"column":8},"end":{"line":95,"column":46}},"69":{"start":{"line":96,"column":8},"end":{"line":96,"column":34}},"70":{"start":{"line":97,"column":8},"end":{"line":97,"column":52}},"71":{"start":{"line":100,"column":4},"end":{"line":103,"column":6}},"72":{"start":{"line":101,"column":8},"end":{"line":101,"column":64}},"73":{"start":{"line":102,"column":8},"end":{"line":102,"column":25}},"74":{"start":{"line":104,"column":4},"end":{"line":118,"column":6}},"75":{"start":{"line":105,"column":8},"end":{"line":105,"column":25}},"76":{"start":{"line":106,"column":8},"end":{"line":115,"column":10}},"77":{"start":{"line":107,"column":12},"end":{"line":114,"column":13}},"78":{"start":{"line":108,"column":16},"end":{"line":113,"column":17}},"79":{"start":{"line":109,"column":20},"end":{"line":109,"column":47}},"80":{"start":{"line":112,"column":20},"end":{"line":112,"column":100}},"81":{"start":{"line":116,"column":8},"end":{"line":116,"column":63}},"82":{"start":{"line":117,"column":8},"end":{"line":117,"column":25}},"83":{"start":{"line":119,"column":4},"end":{"line":119,"column":27}},"84":{"start":{"line":121,"column":0},"end":{"line":121,"column":37}}},"branchMap":{"1":{"line":6,"type":"if","locations":[{"start":{"line":6,"column":8},"end":{"line":6,"column":8}},{"start":{"line":6,"column":8},"end":{"line":6,"column":8}}]},"2":{"line":7,"type":"if","locations":[{"start":{"line":7,"column":8},"end":{"line":7,"column":8}},{"start":{"line":7,"column":8},"end":{"line":7,"column":8}}]},"3":{"line":8,"type":"if","locations":[{"start":{"line":8,"column":8},"end":{"line":8,"column":8}},{"start":{"line":8,"column":8},"end":{"line":8,"column":8}}]},"4":{"line":9,"type":"if","locations":[{"start":{"line":9,"column":8},"end":{"line":9,"column":8}},{"start":{"line":9,"column":8},"end":{"line":9,"column":8}}]},"5":{"line":10,"type":"if","locations":[{"start":{"line":10,"column":8},"end":{"line":10,"column":8}},{"start":{"line":10,"column":8},"end":{"line":10,"column":8}}]},"6":{"line":22,"type":"if","locations":[{"start":{"line":22,"column":8},"end":{"line":22,"column":8}},{"start":{"line":22,"column":8},"end":{"line":22,"column":8}}]},"7":{"line":23,"type":"if","locations":[{"start":{"line":23,"column":12},"end":{"line":23,"column":12}},{"start":{"line":23,"column":12},"end":{"line":23,"column":12}}]},"8":{"line":31,"type":"if","locations":[{"start":{"line":31,"column":8},"end":{"line":31,"column":8}},{"start":{"line":31,"column":8},"end":{"line":31,"column":8}}]},"9":{"line":43,"type":"if","locations":[{"start":{"line":43,"column":12},"end":{"line":43,"column":12}},{"start":{"line":43,"column":12},"end":{"line":43,"column":12}}]},"10":{"line":44,"type":"if","locations":[{"start":{"line":44,"column":16},"end":{"line":44,"column":16}},{"start":{"line":44,"column":16},"end":{"line":44,"column":16}}]},"11":{"line":46,"type":"if","locations":[{"start":{"line":46,"column":20},"end":{"line":46,"column":20}},{"start":{"line":46,"column":20},"end":{"line":46,"column":20}}]},"12":{"line":71,"type":"if","locations":[{"start":{"line":71,"column":8},"end":{"line":71,"column":8}},{"start":{"line":71,"column":8},"end":{"line":71,"column":8}}]},"13":{"line":77,"type":"if","locations":[{"start":{"line":77,"column":8},"end":{"line":77,"column":8}},{"start":{"line":77,"column":8},"end":{"line":77,"column":8}}]},"14":{"line":79,"type":"if","locations":[{"start":{"line":79,"column":16},"end":{"line":79,"column":16}},{"start":{"line":79,"column":16},"end":{"line":79,"column":16}}]},"15":{"line":87,"type":"if","locations":[{"start":{"line":87,"column":8},"end":{"line":87,"column":8}},{"start":{"line":87,"column":8},"end":{"line":87,"column":8}}]},"16":{"line":107,"type":"if","locations":[{"start":{"line":107,"column":12},"end":{"line":107,"column":12}},{"start":{"line":107,"column":12},"end":{"line":107,"column":12}}]},"17":{"line":108,"type":"if","locations":[{"start":{"line":108,"column":16},"end":{"line":108,"column":16}},{"start":{"line":108,"column":16},"end":{"line":108,"column":16}}]}}};
}
__cov_Q19HP751RRJdCKeH85GxAQ = __cov_Q19HP751RRJdCKeH85GxAQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/HttpTransmitter.ts'];
__cov_Q19HP751RRJdCKeH85GxAQ.s['1']++;exports.__esModule=true;__cov_Q19HP751RRJdCKeH85GxAQ.s['2']++;var Codec_1=require('./Codec');__cov_Q19HP751RRJdCKeH85GxAQ.s['3']++;var HttpTransmitter=function(){__cov_Q19HP751RRJdCKeH85GxAQ.f['1']++;function HttpTransmitter(url,reset,charset,errorHandler,supportCORS,headersInfo){__cov_Q19HP751RRJdCKeH85GxAQ.f['2']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['5']++;if(reset===void 0){__cov_Q19HP751RRJdCKeH85GxAQ.b['1'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['6']++;reset=true;}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['1'][1]++;}__cov_Q19HP751RRJdCKeH85GxAQ.s['7']++;if(charset===void 0){__cov_Q19HP751RRJdCKeH85GxAQ.b['2'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['8']++;charset='UTF-8';}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['2'][1]++;}__cov_Q19HP751RRJdCKeH85GxAQ.s['9']++;if(errorHandler===void 0){__cov_Q19HP751RRJdCKeH85GxAQ.b['3'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['10']++;errorHandler=null;}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['3'][1]++;}__cov_Q19HP751RRJdCKeH85GxAQ.s['11']++;if(supportCORS===void 0){__cov_Q19HP751RRJdCKeH85GxAQ.b['4'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['12']++;supportCORS=false;}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['4'][1]++;}__cov_Q19HP751RRJdCKeH85GxAQ.s['13']++;if(headersInfo===void 0){__cov_Q19HP751RRJdCKeH85GxAQ.b['5'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['14']++;headersInfo=null;}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['5'][1]++;}__cov_Q19HP751RRJdCKeH85GxAQ.s['15']++;this.url=url;__cov_Q19HP751RRJdCKeH85GxAQ.s['16']++;this.charset=charset;__cov_Q19HP751RRJdCKeH85GxAQ.s['17']++;this.HttpCodes={finished:4,success:200};__cov_Q19HP751RRJdCKeH85GxAQ.s['18']++;this.errorHandler=errorHandler;__cov_Q19HP751RRJdCKeH85GxAQ.s['19']++;this.supportCORS=supportCORS;__cov_Q19HP751RRJdCKeH85GxAQ.s['20']++;this.headersInfo=headersInfo;__cov_Q19HP751RRJdCKeH85GxAQ.s['21']++;this.http=new XMLHttpRequest();__cov_Q19HP751RRJdCKeH85GxAQ.s['22']++;this.sig=new XMLHttpRequest();__cov_Q19HP751RRJdCKeH85GxAQ.s['23']++;if(this.supportCORS){__cov_Q19HP751RRJdCKeH85GxAQ.b['6'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['24']++;if('withCredentials'in this.http){__cov_Q19HP751RRJdCKeH85GxAQ.b['7'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['25']++;this.http.withCredentials=true;__cov_Q19HP751RRJdCKeH85GxAQ.s['26']++;this.sig.withCredentials=true;}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['7'][1]++;}}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['6'][1]++;}__cov_Q19HP751RRJdCKeH85GxAQ.s['27']++;this.codec=new Codec_1['default']();__cov_Q19HP751RRJdCKeH85GxAQ.s['28']++;if(reset){__cov_Q19HP751RRJdCKeH85GxAQ.b['8'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['29']++;console.log('HttpTransmitter.invalidate() is deprecated. Use ClientDolphin.reset(OnSuccessHandler) instead');__cov_Q19HP751RRJdCKeH85GxAQ.s['30']++;this.invalidate();}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['8'][1]++;}}__cov_Q19HP751RRJdCKeH85GxAQ.s['31']++;HttpTransmitter.prototype.transmit=function(commands,onDone){__cov_Q19HP751RRJdCKeH85GxAQ.f['3']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['32']++;var _this=this;__cov_Q19HP751RRJdCKeH85GxAQ.s['33']++;this.http.onerror=function(evt){__cov_Q19HP751RRJdCKeH85GxAQ.f['4']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['34']++;_this.handleError('onerror','');__cov_Q19HP751RRJdCKeH85GxAQ.s['35']++;onDone([]);};__cov_Q19HP751RRJdCKeH85GxAQ.s['36']++;this.http.onreadystatechange=function(evt){__cov_Q19HP751RRJdCKeH85GxAQ.f['5']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['37']++;if(_this.http.readyState==_this.HttpCodes.finished){__cov_Q19HP751RRJdCKeH85GxAQ.b['9'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['38']++;if(_this.http.status==_this.HttpCodes.success){__cov_Q19HP751RRJdCKeH85GxAQ.b['10'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['39']++;var responseText=_this.http.responseText;__cov_Q19HP751RRJdCKeH85GxAQ.s['40']++;if(responseText.trim().length>0){__cov_Q19HP751RRJdCKeH85GxAQ.b['11'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['41']++;try{__cov_Q19HP751RRJdCKeH85GxAQ.s['42']++;var responseCommands=_this.codec.decode(responseText);__cov_Q19HP751RRJdCKeH85GxAQ.s['43']++;onDone(responseCommands);}catch(err){__cov_Q19HP751RRJdCKeH85GxAQ.s['44']++;console.log('Error occurred parsing responseText: ',err);__cov_Q19HP751RRJdCKeH85GxAQ.s['45']++;console.log('Incorrect responseText: ',responseText);__cov_Q19HP751RRJdCKeH85GxAQ.s['46']++;_this.handleError('application','HttpTransmitter: Incorrect responseText: '+responseText);__cov_Q19HP751RRJdCKeH85GxAQ.s['47']++;onDone([]);}}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['11'][1]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['48']++;_this.handleError('application','HttpTransmitter: empty responseText');__cov_Q19HP751RRJdCKeH85GxAQ.s['49']++;onDone([]);}}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['10'][1]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['50']++;_this.handleError('application','HttpTransmitter: HTTP Status != 200');__cov_Q19HP751RRJdCKeH85GxAQ.s['51']++;onDone([]);}}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['9'][1]++;}};__cov_Q19HP751RRJdCKeH85GxAQ.s['52']++;this.http.open('POST',this.url,true);__cov_Q19HP751RRJdCKeH85GxAQ.s['53']++;this.setHeaders(this.http);__cov_Q19HP751RRJdCKeH85GxAQ.s['54']++;if('overrideMimeType'in this.http){__cov_Q19HP751RRJdCKeH85GxAQ.b['12'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['55']++;this.http.overrideMimeType('application/json; charset='+this.charset);}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['12'][1]++;}__cov_Q19HP751RRJdCKeH85GxAQ.s['56']++;this.http.send(this.codec.encode(commands));};__cov_Q19HP751RRJdCKeH85GxAQ.s['57']++;HttpTransmitter.prototype.setHeaders=function(httpReq){__cov_Q19HP751RRJdCKeH85GxAQ.f['6']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['58']++;if(this.headersInfo){__cov_Q19HP751RRJdCKeH85GxAQ.b['13'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['59']++;for(var i in this.headersInfo){__cov_Q19HP751RRJdCKeH85GxAQ.s['60']++;if(this.headersInfo.hasOwnProperty(i)){__cov_Q19HP751RRJdCKeH85GxAQ.b['14'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['61']++;httpReq.setRequestHeader(i,this.headersInfo[i]);}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['14'][1]++;}}}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['13'][1]++;}};__cov_Q19HP751RRJdCKeH85GxAQ.s['62']++;HttpTransmitter.prototype.handleError=function(kind,message){__cov_Q19HP751RRJdCKeH85GxAQ.f['7']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['63']++;var errorEvent={kind:kind,url:this.url,httpStatus:this.http.status,message:message};__cov_Q19HP751RRJdCKeH85GxAQ.s['64']++;if(this.errorHandler){__cov_Q19HP751RRJdCKeH85GxAQ.b['15'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['65']++;this.errorHandler(errorEvent);}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['15'][1]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['66']++;console.log('Error occurred: ',errorEvent);}};__cov_Q19HP751RRJdCKeH85GxAQ.s['67']++;HttpTransmitter.prototype.signal=function(command){__cov_Q19HP751RRJdCKeH85GxAQ.f['8']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['68']++;this.sig.open('POST',this.url,true);__cov_Q19HP751RRJdCKeH85GxAQ.s['69']++;this.setHeaders(this.sig);__cov_Q19HP751RRJdCKeH85GxAQ.s['70']++;this.sig.send(this.codec.encode([command]));};__cov_Q19HP751RRJdCKeH85GxAQ.s['71']++;HttpTransmitter.prototype.invalidate=function(){__cov_Q19HP751RRJdCKeH85GxAQ.f['9']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['72']++;this.http.open('POST',this.url+'invalidate?',false);__cov_Q19HP751RRJdCKeH85GxAQ.s['73']++;this.http.send();};__cov_Q19HP751RRJdCKeH85GxAQ.s['74']++;HttpTransmitter.prototype.reset=function(successHandler){__cov_Q19HP751RRJdCKeH85GxAQ.f['10']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['75']++;var _this=this;__cov_Q19HP751RRJdCKeH85GxAQ.s['76']++;this.http.onreadystatechange=function(evt){__cov_Q19HP751RRJdCKeH85GxAQ.f['11']++;__cov_Q19HP751RRJdCKeH85GxAQ.s['77']++;if(_this.http.readyState==_this.HttpCodes.finished){__cov_Q19HP751RRJdCKeH85GxAQ.b['16'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['78']++;if(_this.http.status==_this.HttpCodes.success){__cov_Q19HP751RRJdCKeH85GxAQ.b['17'][0]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['79']++;successHandler.onSuccess();}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['17'][1]++;__cov_Q19HP751RRJdCKeH85GxAQ.s['80']++;_this.handleError('application','HttpTransmitter.reset(): HTTP Status != 200');}}else{__cov_Q19HP751RRJdCKeH85GxAQ.b['16'][1]++;}};__cov_Q19HP751RRJdCKeH85GxAQ.s['81']++;this.http.open('POST',this.url+'invalidate?',true);__cov_Q19HP751RRJdCKeH85GxAQ.s['82']++;this.http.send();};__cov_Q19HP751RRJdCKeH85GxAQ.s['83']++;return HttpTransmitter;}();__cov_Q19HP751RRJdCKeH85GxAQ.s['84']++;exports['default']=HttpTransmitter;

},{"./Codec":51}],65:[function(require,module,exports){
"use strict";
var __cov_FwlB1Kkc1v5L$0ygTodong = (Function('return this'))();
if (!__cov_FwlB1Kkc1v5L$0ygTodong.__coverage__) { __cov_FwlB1Kkc1v5L$0ygTodong.__coverage__ = {}; }
__cov_FwlB1Kkc1v5L$0ygTodong = __cov_FwlB1Kkc1v5L$0ygTodong.__coverage__;
if (!(__cov_FwlB1Kkc1v5L$0ygTodong['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/InitializeAttributeCommand.ts'])) {
   __cov_FwlB1Kkc1v5L$0ygTodong['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/InitializeAttributeCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/InitializeAttributeCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":34},"end":{"line":14,"column":52}}},"7":{"name":"InitializeAttributeCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":89}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":28,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":50}},"16":{"start":{"line":16,"column":4},"end":{"line":26,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":26}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":30}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":42}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":36}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":34}},"23":{"start":{"line":23,"column":8},"end":{"line":23,"column":41}},"24":{"start":{"line":24,"column":8},"end":{"line":24,"column":81}},"25":{"start":{"line":25,"column":8},"end":{"line":25,"column":21}},"26":{"start":{"line":27,"column":4},"end":{"line":27,"column":38}},"27":{"start":{"line":29,"column":0},"end":{"line":29,"column":48}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_FwlB1Kkc1v5L$0ygTodong = __cov_FwlB1Kkc1v5L$0ygTodong['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/InitializeAttributeCommand.ts'];
__cov_FwlB1Kkc1v5L$0ygTodong.s['1']++;var __extends=(__cov_FwlB1Kkc1v5L$0ygTodong.b['1'][0]++,this)&&(__cov_FwlB1Kkc1v5L$0ygTodong.b['1'][1]++,this.__extends)||(__cov_FwlB1Kkc1v5L$0ygTodong.b['1'][2]++,function(){__cov_FwlB1Kkc1v5L$0ygTodong.f['1']++;__cov_FwlB1Kkc1v5L$0ygTodong.s['2']++;var extendStatics=(__cov_FwlB1Kkc1v5L$0ygTodong.b['2'][0]++,Object.setPrototypeOf)||(__cov_FwlB1Kkc1v5L$0ygTodong.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_FwlB1Kkc1v5L$0ygTodong.b['2'][2]++,function(d,b){__cov_FwlB1Kkc1v5L$0ygTodong.f['2']++;__cov_FwlB1Kkc1v5L$0ygTodong.s['3']++;d.__proto__=b;})||(__cov_FwlB1Kkc1v5L$0ygTodong.b['2'][3]++,function(d,b){__cov_FwlB1Kkc1v5L$0ygTodong.f['3']++;__cov_FwlB1Kkc1v5L$0ygTodong.s['4']++;for(var p in b){__cov_FwlB1Kkc1v5L$0ygTodong.s['5']++;if(b.hasOwnProperty(p)){__cov_FwlB1Kkc1v5L$0ygTodong.b['3'][0]++;__cov_FwlB1Kkc1v5L$0ygTodong.s['6']++;d[p]=b[p];}else{__cov_FwlB1Kkc1v5L$0ygTodong.b['3'][1]++;}}});__cov_FwlB1Kkc1v5L$0ygTodong.s['7']++;return function(d,b){__cov_FwlB1Kkc1v5L$0ygTodong.f['4']++;__cov_FwlB1Kkc1v5L$0ygTodong.s['8']++;extendStatics(d,b);function __(){__cov_FwlB1Kkc1v5L$0ygTodong.f['5']++;__cov_FwlB1Kkc1v5L$0ygTodong.s['10']++;this.constructor=d;}__cov_FwlB1Kkc1v5L$0ygTodong.s['11']++;d.prototype=b===null?(__cov_FwlB1Kkc1v5L$0ygTodong.b['4'][0]++,Object.create(b)):(__cov_FwlB1Kkc1v5L$0ygTodong.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_FwlB1Kkc1v5L$0ygTodong.s['12']++;exports.__esModule=true;__cov_FwlB1Kkc1v5L$0ygTodong.s['13']++;var Command_1=require('./Command');__cov_FwlB1Kkc1v5L$0ygTodong.s['14']++;var InitializeAttributeCommand=function(_super){__cov_FwlB1Kkc1v5L$0ygTodong.f['6']++;__cov_FwlB1Kkc1v5L$0ygTodong.s['15']++;__extends(InitializeAttributeCommand,_super);function InitializeAttributeCommand(pmId,pmType,propertyName,qualifier,newValue){__cov_FwlB1Kkc1v5L$0ygTodong.f['7']++;__cov_FwlB1Kkc1v5L$0ygTodong.s['17']++;var _this=(__cov_FwlB1Kkc1v5L$0ygTodong.b['5'][0]++,_super.call(this))||(__cov_FwlB1Kkc1v5L$0ygTodong.b['5'][1]++,this);__cov_FwlB1Kkc1v5L$0ygTodong.s['18']++;_this.pmId=pmId;__cov_FwlB1Kkc1v5L$0ygTodong.s['19']++;_this.pmType=pmType;__cov_FwlB1Kkc1v5L$0ygTodong.s['20']++;_this.propertyName=propertyName;__cov_FwlB1Kkc1v5L$0ygTodong.s['21']++;_this.qualifier=qualifier;__cov_FwlB1Kkc1v5L$0ygTodong.s['22']++;_this.newValue=newValue;__cov_FwlB1Kkc1v5L$0ygTodong.s['23']++;_this.id='InitializeAttribute';__cov_FwlB1Kkc1v5L$0ygTodong.s['24']++;_this.className='org.opendolphin.core.comm.InitializeAttributeCommand';__cov_FwlB1Kkc1v5L$0ygTodong.s['25']++;return _this;}__cov_FwlB1Kkc1v5L$0ygTodong.s['26']++;return InitializeAttributeCommand;}(Command_1['default']);__cov_FwlB1Kkc1v5L$0ygTodong.s['27']++;exports['default']=InitializeAttributeCommand;

},{"./Command":52}],66:[function(require,module,exports){
"use strict";
var __cov_$n$D$o8Z$nG8ehM64wbLTA = (Function('return this'))();
if (!__cov_$n$D$o8Z$nG8ehM64wbLTA.__coverage__) { __cov_$n$D$o8Z$nG8ehM64wbLTA.__coverage__ = {}; }
__cov_$n$D$o8Z$nG8ehM64wbLTA = __cov_$n$D$o8Z$nG8ehM64wbLTA.__coverage__;
if (!(__cov_$n$D$o8Z$nG8ehM64wbLTA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NamedCommand.ts'])) {
   __cov_$n$D$o8Z$nG8ehM64wbLTA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NamedCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NamedCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":20},"end":{"line":14,"column":38}}},"7":{"name":"NamedCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":32}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":23,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":36}},"16":{"start":{"line":16,"column":4},"end":{"line":21,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":24}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":67}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":21}},"21":{"start":{"line":22,"column":4},"end":{"line":22,"column":24}},"22":{"start":{"line":24,"column":0},"end":{"line":24,"column":34}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_$n$D$o8Z$nG8ehM64wbLTA = __cov_$n$D$o8Z$nG8ehM64wbLTA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NamedCommand.ts'];
__cov_$n$D$o8Z$nG8ehM64wbLTA.s['1']++;var __extends=(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['1'][0]++,this)&&(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['1'][1]++,this.__extends)||(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['1'][2]++,function(){__cov_$n$D$o8Z$nG8ehM64wbLTA.f['1']++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['2']++;var extendStatics=(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['2'][0]++,Object.setPrototypeOf)||(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['2'][2]++,function(d,b){__cov_$n$D$o8Z$nG8ehM64wbLTA.f['2']++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['3']++;d.__proto__=b;})||(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['2'][3]++,function(d,b){__cov_$n$D$o8Z$nG8ehM64wbLTA.f['3']++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['4']++;for(var p in b){__cov_$n$D$o8Z$nG8ehM64wbLTA.s['5']++;if(b.hasOwnProperty(p)){__cov_$n$D$o8Z$nG8ehM64wbLTA.b['3'][0]++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['6']++;d[p]=b[p];}else{__cov_$n$D$o8Z$nG8ehM64wbLTA.b['3'][1]++;}}});__cov_$n$D$o8Z$nG8ehM64wbLTA.s['7']++;return function(d,b){__cov_$n$D$o8Z$nG8ehM64wbLTA.f['4']++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['8']++;extendStatics(d,b);function __(){__cov_$n$D$o8Z$nG8ehM64wbLTA.f['5']++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['10']++;this.constructor=d;}__cov_$n$D$o8Z$nG8ehM64wbLTA.s['11']++;d.prototype=b===null?(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['4'][0]++,Object.create(b)):(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_$n$D$o8Z$nG8ehM64wbLTA.s['12']++;exports.__esModule=true;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['13']++;var Command_1=require('./Command');__cov_$n$D$o8Z$nG8ehM64wbLTA.s['14']++;var NamedCommand=function(_super){__cov_$n$D$o8Z$nG8ehM64wbLTA.f['6']++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['15']++;__extends(NamedCommand,_super);function NamedCommand(name){__cov_$n$D$o8Z$nG8ehM64wbLTA.f['7']++;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['17']++;var _this=(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['5'][0]++,_super.call(this))||(__cov_$n$D$o8Z$nG8ehM64wbLTA.b['5'][1]++,this);__cov_$n$D$o8Z$nG8ehM64wbLTA.s['18']++;_this.id=name;__cov_$n$D$o8Z$nG8ehM64wbLTA.s['19']++;_this.className='org.opendolphin.core.comm.NamedCommand';__cov_$n$D$o8Z$nG8ehM64wbLTA.s['20']++;return _this;}__cov_$n$D$o8Z$nG8ehM64wbLTA.s['21']++;return NamedCommand;}(Command_1['default']);__cov_$n$D$o8Z$nG8ehM64wbLTA.s['22']++;exports['default']=NamedCommand;

},{"./Command":52}],67:[function(require,module,exports){
"use strict";
var __cov_W5V18lDlWfr5GxfaSMHdTA = (Function('return this'))();
if (!__cov_W5V18lDlWfr5GxfaSMHdTA.__coverage__) { __cov_W5V18lDlWfr5GxfaSMHdTA.__coverage__ = {}; }
__cov_W5V18lDlWfr5GxfaSMHdTA = __cov_W5V18lDlWfr5GxfaSMHdTA.__coverage__;
if (!(__cov_W5V18lDlWfr5GxfaSMHdTA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NoTransmitter.ts'])) {
   __cov_W5V18lDlWfr5GxfaSMHdTA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NoTransmitter.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NoTransmitter.ts","s":{"1":0,"2":0,"3":1,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"b":{},"f":{"1":0,"2":0,"3":0,"4":0,"5":0},"fnMap":{"1":{"name":"(anonymous_1)","line":7,"loc":{"start":{"line":7,"column":21},"end":{"line":7,"column":33}}},"2":{"name":"NoTransmitter","line":8,"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":29}}},"3":{"name":"(anonymous_3)","line":10,"loc":{"start":{"line":10,"column":39},"end":{"line":10,"column":67}}},"4":{"name":"(anonymous_4)","line":14,"loc":{"start":{"line":14,"column":37},"end":{"line":14,"column":56}}},"5":{"name":"(anonymous_5)","line":17,"loc":{"start":{"line":17,"column":36},"end":{"line":17,"column":62}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":2,"column":26}},"2":{"start":{"line":7,"column":0},"end":{"line":21,"column":5}},"3":{"start":{"line":8,"column":4},"end":{"line":9,"column":5}},"4":{"start":{"line":10,"column":4},"end":{"line":13,"column":6}},"5":{"start":{"line":12,"column":8},"end":{"line":12,"column":19}},"6":{"start":{"line":14,"column":4},"end":{"line":16,"column":6}},"7":{"start":{"line":17,"column":4},"end":{"line":19,"column":6}},"8":{"start":{"line":20,"column":4},"end":{"line":20,"column":25}},"9":{"start":{"line":22,"column":0},"end":{"line":22,"column":35}}},"branchMap":{}};
}
__cov_W5V18lDlWfr5GxfaSMHdTA = __cov_W5V18lDlWfr5GxfaSMHdTA['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/NoTransmitter.ts'];
__cov_W5V18lDlWfr5GxfaSMHdTA.s['1']++;exports.__esModule=true;__cov_W5V18lDlWfr5GxfaSMHdTA.s['2']++;var NoTransmitter=function(){__cov_W5V18lDlWfr5GxfaSMHdTA.f['1']++;function NoTransmitter(){__cov_W5V18lDlWfr5GxfaSMHdTA.f['2']++;}__cov_W5V18lDlWfr5GxfaSMHdTA.s['4']++;NoTransmitter.prototype.transmit=function(commands,onDone){__cov_W5V18lDlWfr5GxfaSMHdTA.f['3']++;__cov_W5V18lDlWfr5GxfaSMHdTA.s['5']++;onDone([]);};__cov_W5V18lDlWfr5GxfaSMHdTA.s['6']++;NoTransmitter.prototype.signal=function(command){__cov_W5V18lDlWfr5GxfaSMHdTA.f['4']++;};__cov_W5V18lDlWfr5GxfaSMHdTA.s['7']++;NoTransmitter.prototype.reset=function(successHandler){__cov_W5V18lDlWfr5GxfaSMHdTA.f['5']++;};__cov_W5V18lDlWfr5GxfaSMHdTA.s['8']++;return NoTransmitter;}();__cov_W5V18lDlWfr5GxfaSMHdTA.s['9']++;exports['default']=NoTransmitter;

},{}],68:[function(require,module,exports){
"use strict";
var __cov_FOUAFt8T4lhf3T5m$MbjKQ = (Function('return this'))();
if (!__cov_FOUAFt8T4lhf3T5m$MbjKQ.__coverage__) { __cov_FOUAFt8T4lhf3T5m$MbjKQ.__coverage__ = {}; }
__cov_FOUAFt8T4lhf3T5m$MbjKQ = __cov_FOUAFt8T4lhf3T5m$MbjKQ.__coverage__;
if (!(__cov_FOUAFt8T4lhf3T5m$MbjKQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SignalCommand.ts'])) {
   __cov_FOUAFt8T4lhf3T5m$MbjKQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SignalCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SignalCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":21},"end":{"line":14,"column":39}}},"7":{"name":"SignalCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":33}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":23,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":37}},"16":{"start":{"line":16,"column":4},"end":{"line":21,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":24}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":68}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":21}},"21":{"start":{"line":22,"column":4},"end":{"line":22,"column":25}},"22":{"start":{"line":24,"column":0},"end":{"line":24,"column":35}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_FOUAFt8T4lhf3T5m$MbjKQ = __cov_FOUAFt8T4lhf3T5m$MbjKQ['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SignalCommand.ts'];
__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['1']++;var __extends=(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['1'][0]++,this)&&(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['1'][1]++,this.__extends)||(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['1'][2]++,function(){__cov_FOUAFt8T4lhf3T5m$MbjKQ.f['1']++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['2']++;var extendStatics=(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['2'][0]++,Object.setPrototypeOf)||(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['2'][2]++,function(d,b){__cov_FOUAFt8T4lhf3T5m$MbjKQ.f['2']++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['3']++;d.__proto__=b;})||(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['2'][3]++,function(d,b){__cov_FOUAFt8T4lhf3T5m$MbjKQ.f['3']++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['4']++;for(var p in b){__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['5']++;if(b.hasOwnProperty(p)){__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['3'][0]++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['6']++;d[p]=b[p];}else{__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['3'][1]++;}}});__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['7']++;return function(d,b){__cov_FOUAFt8T4lhf3T5m$MbjKQ.f['4']++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['8']++;extendStatics(d,b);function __(){__cov_FOUAFt8T4lhf3T5m$MbjKQ.f['5']++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['10']++;this.constructor=d;}__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['11']++;d.prototype=b===null?(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['4'][0]++,Object.create(b)):(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['12']++;exports.__esModule=true;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['13']++;var Command_1=require('./Command');__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['14']++;var SignalCommand=function(_super){__cov_FOUAFt8T4lhf3T5m$MbjKQ.f['6']++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['15']++;__extends(SignalCommand,_super);function SignalCommand(name){__cov_FOUAFt8T4lhf3T5m$MbjKQ.f['7']++;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['17']++;var _this=(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['5'][0]++,_super.call(this))||(__cov_FOUAFt8T4lhf3T5m$MbjKQ.b['5'][1]++,this);__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['18']++;_this.id=name;__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['19']++;_this.className='org.opendolphin.core.comm.SignalCommand';__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['20']++;return _this;}__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['21']++;return SignalCommand;}(Command_1['default']);__cov_FOUAFt8T4lhf3T5m$MbjKQ.s['22']++;exports['default']=SignalCommand;

},{"./Command":52}],69:[function(require,module,exports){
"use strict";
var __cov_YKIyrg5fFDMXGw_d7ZQo4A = (Function('return this'))();
if (!__cov_YKIyrg5fFDMXGw_d7ZQo4A.__coverage__) { __cov_YKIyrg5fFDMXGw_d7ZQo4A.__coverage__ = {}; }
__cov_YKIyrg5fFDMXGw_d7ZQo4A = __cov_YKIyrg5fFDMXGw_d7ZQo4A.__coverage__;
if (!(__cov_YKIyrg5fFDMXGw_d7ZQo4A['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SwitchPresentationModelCommand.ts'])) {
   __cov_YKIyrg5fFDMXGw_d7ZQo4A['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SwitchPresentationModelCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SwitchPresentationModelCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":38},"end":{"line":14,"column":56}}},"7":{"name":"SwitchPresentationModelCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":62}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":25,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":54}},"16":{"start":{"line":16,"column":4},"end":{"line":23,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":26}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":38}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":45}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":85}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":21}},"23":{"start":{"line":24,"column":4},"end":{"line":24,"column":42}},"24":{"start":{"line":26,"column":0},"end":{"line":26,"column":52}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_YKIyrg5fFDMXGw_d7ZQo4A = __cov_YKIyrg5fFDMXGw_d7ZQo4A['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/SwitchPresentationModelCommand.ts'];
__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['1']++;var __extends=(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['1'][0]++,this)&&(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['1'][1]++,this.__extends)||(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['1'][2]++,function(){__cov_YKIyrg5fFDMXGw_d7ZQo4A.f['1']++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['2']++;var extendStatics=(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['2'][0]++,Object.setPrototypeOf)||(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['2'][2]++,function(d,b){__cov_YKIyrg5fFDMXGw_d7ZQo4A.f['2']++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['3']++;d.__proto__=b;})||(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['2'][3]++,function(d,b){__cov_YKIyrg5fFDMXGw_d7ZQo4A.f['3']++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['4']++;for(var p in b){__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['5']++;if(b.hasOwnProperty(p)){__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['3'][0]++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['6']++;d[p]=b[p];}else{__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['3'][1]++;}}});__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['7']++;return function(d,b){__cov_YKIyrg5fFDMXGw_d7ZQo4A.f['4']++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['8']++;extendStatics(d,b);function __(){__cov_YKIyrg5fFDMXGw_d7ZQo4A.f['5']++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['10']++;this.constructor=d;}__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['11']++;d.prototype=b===null?(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['4'][0]++,Object.create(b)):(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['12']++;exports.__esModule=true;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['13']++;var Command_1=require('./Command');__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['14']++;var SwitchPresentationModelCommand=function(_super){__cov_YKIyrg5fFDMXGw_d7ZQo4A.f['6']++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['15']++;__extends(SwitchPresentationModelCommand,_super);function SwitchPresentationModelCommand(pmId,sourcePmId){__cov_YKIyrg5fFDMXGw_d7ZQo4A.f['7']++;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['17']++;var _this=(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['5'][0]++,_super.call(this))||(__cov_YKIyrg5fFDMXGw_d7ZQo4A.b['5'][1]++,this);__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['18']++;_this.pmId=pmId;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['19']++;_this.sourcePmId=sourcePmId;__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['20']++;_this.id='SwitchPresentationModel';__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['21']++;_this.className='org.opendolphin.core.comm.SwitchPresentationModelCommand';__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['22']++;return _this;}__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['23']++;return SwitchPresentationModelCommand;}(Command_1['default']);__cov_YKIyrg5fFDMXGw_d7ZQo4A.s['24']++;exports['default']=SwitchPresentationModelCommand;

},{"./Command":52}],70:[function(require,module,exports){
"use strict";
var __cov_wUP7ohBe1MLIF8_LQf3BJg = (Function('return this'))();
if (!__cov_wUP7ohBe1MLIF8_LQf3BJg.__coverage__) { __cov_wUP7ohBe1MLIF8_LQf3BJg.__coverage__ = {}; }
__cov_wUP7ohBe1MLIF8_LQf3BJg = __cov_wUP7ohBe1MLIF8_LQf3BJg.__coverage__;
if (!(__cov_wUP7ohBe1MLIF8_LQf3BJg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ValueChangedCommand.ts'])) {
   __cov_wUP7ohBe1MLIF8_LQf3BJg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ValueChangedCommand.ts'] = {"path":"/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ValueChangedCommand.ts","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":1,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0},"b":{"1":[0,0,0],"2":[0,0,0,0],"3":[0,0],"4":[0,0],"5":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0},"fnMap":{"1":{"name":"(anonymous_1)","line":2,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":57}}},"2":{"name":"(anonymous_2)","line":4,"loc":{"start":{"line":4,"column":47},"end":{"line":4,"column":63}}},"3":{"name":"(anonymous_3)","line":5,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":24}}},"4":{"name":"(anonymous_4)","line":6,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":27}}},"5":{"name":"__","line":8,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":22}}},"6":{"name":"(anonymous_6)","line":14,"loc":{"start":{"line":14,"column":27},"end":{"line":14,"column":45}}},"7":{"name":"ValueChangedCommand","line":16,"loc":{"start":{"line":16,"column":4},"end":{"line":16,"column":66}}}},"statementMap":{"1":{"start":{"line":2,"column":0},"end":{"line":11,"column":5}},"2":{"start":{"line":3,"column":4},"end":{"line":5,"column":83}},"3":{"start":{"line":4,"column":65},"end":{"line":4,"column":81}},"4":{"start":{"line":5,"column":26},"end":{"line":5,"column":80}},"5":{"start":{"line":5,"column":43},"end":{"line":5,"column":80}},"6":{"start":{"line":5,"column":68},"end":{"line":5,"column":80}},"7":{"start":{"line":6,"column":4},"end":{"line":10,"column":6}},"8":{"start":{"line":7,"column":8},"end":{"line":7,"column":28}},"9":{"start":{"line":8,"column":8},"end":{"line":8,"column":47}},"10":{"start":{"line":8,"column":24},"end":{"line":8,"column":45}},"11":{"start":{"line":9,"column":8},"end":{"line":9,"column":93}},"12":{"start":{"line":12,"column":0},"end":{"line":12,"column":26}},"13":{"start":{"line":13,"column":0},"end":{"line":13,"column":37}},"14":{"start":{"line":14,"column":0},"end":{"line":26,"column":25}},"15":{"start":{"line":15,"column":4},"end":{"line":15,"column":43}},"16":{"start":{"line":16,"column":4},"end":{"line":24,"column":5}},"17":{"start":{"line":17,"column":8},"end":{"line":17,"column":46}},"18":{"start":{"line":18,"column":8},"end":{"line":18,"column":40}},"19":{"start":{"line":19,"column":8},"end":{"line":19,"column":34}},"20":{"start":{"line":20,"column":8},"end":{"line":20,"column":34}},"21":{"start":{"line":21,"column":8},"end":{"line":21,"column":34}},"22":{"start":{"line":22,"column":8},"end":{"line":22,"column":74}},"23":{"start":{"line":23,"column":8},"end":{"line":23,"column":21}},"24":{"start":{"line":25,"column":4},"end":{"line":25,"column":31}},"25":{"start":{"line":27,"column":0},"end":{"line":27,"column":41}}},"branchMap":{"1":{"line":2,"type":"binary-expr","locations":[{"start":{"line":2,"column":17},"end":{"line":2,"column":21}},{"start":{"line":2,"column":25},"end":{"line":2,"column":39}},{"start":{"line":2,"column":44},"end":{"line":11,"column":4}}]},"2":{"line":3,"type":"binary-expr","locations":[{"start":{"line":3,"column":24},"end":{"line":3,"column":45}},{"start":{"line":4,"column":9},"end":{"line":4,"column":43}},{"start":{"line":4,"column":47},"end":{"line":4,"column":83}},{"start":{"line":5,"column":8},"end":{"line":5,"column":82}}]},"3":{"line":5,"type":"if","locations":[{"start":{"line":5,"column":43},"end":{"line":5,"column":43}},{"start":{"line":5,"column":43},"end":{"line":5,"column":43}}]},"4":{"line":9,"type":"cond-expr","locations":[{"start":{"line":9,"column":35},"end":{"line":9,"column":51}},{"start":{"line":9,"column":55},"end":{"line":9,"column":91}}]},"5":{"line":17,"type":"binary-expr","locations":[{"start":{"line":17,"column":20},"end":{"line":17,"column":37}},{"start":{"line":17,"column":41},"end":{"line":17,"column":45}}]}}};
}
__cov_wUP7ohBe1MLIF8_LQf3BJg = __cov_wUP7ohBe1MLIF8_LQf3BJg['/Users/kunal/dolphin-platform-js/opendolphin/js/dolphin/ValueChangedCommand.ts'];
__cov_wUP7ohBe1MLIF8_LQf3BJg.s['1']++;var __extends=(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['1'][0]++,this)&&(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['1'][1]++,this.__extends)||(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['1'][2]++,function(){__cov_wUP7ohBe1MLIF8_LQf3BJg.f['1']++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['2']++;var extendStatics=(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['2'][0]++,Object.setPrototypeOf)||(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['2'][1]++,{__proto__:[]}instanceof Array)&&(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['2'][2]++,function(d,b){__cov_wUP7ohBe1MLIF8_LQf3BJg.f['2']++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['3']++;d.__proto__=b;})||(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['2'][3]++,function(d,b){__cov_wUP7ohBe1MLIF8_LQf3BJg.f['3']++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['4']++;for(var p in b){__cov_wUP7ohBe1MLIF8_LQf3BJg.s['5']++;if(b.hasOwnProperty(p)){__cov_wUP7ohBe1MLIF8_LQf3BJg.b['3'][0]++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['6']++;d[p]=b[p];}else{__cov_wUP7ohBe1MLIF8_LQf3BJg.b['3'][1]++;}}});__cov_wUP7ohBe1MLIF8_LQf3BJg.s['7']++;return function(d,b){__cov_wUP7ohBe1MLIF8_LQf3BJg.f['4']++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['8']++;extendStatics(d,b);function __(){__cov_wUP7ohBe1MLIF8_LQf3BJg.f['5']++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['10']++;this.constructor=d;}__cov_wUP7ohBe1MLIF8_LQf3BJg.s['11']++;d.prototype=b===null?(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['4'][0]++,Object.create(b)):(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['4'][1]++,(__.prototype=b.prototype,new __()));};}());__cov_wUP7ohBe1MLIF8_LQf3BJg.s['12']++;exports.__esModule=true;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['13']++;var Command_1=require('./Command');__cov_wUP7ohBe1MLIF8_LQf3BJg.s['14']++;var ValueChangedCommand=function(_super){__cov_wUP7ohBe1MLIF8_LQf3BJg.f['6']++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['15']++;__extends(ValueChangedCommand,_super);function ValueChangedCommand(attributeId,oldValue,newValue){__cov_wUP7ohBe1MLIF8_LQf3BJg.f['7']++;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['17']++;var _this=(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['5'][0]++,_super.call(this))||(__cov_wUP7ohBe1MLIF8_LQf3BJg.b['5'][1]++,this);__cov_wUP7ohBe1MLIF8_LQf3BJg.s['18']++;_this.attributeId=attributeId;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['19']++;_this.oldValue=oldValue;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['20']++;_this.newValue=newValue;__cov_wUP7ohBe1MLIF8_LQf3BJg.s['21']++;_this.id='ValueChanged';__cov_wUP7ohBe1MLIF8_LQf3BJg.s['22']++;_this.className='org.opendolphin.core.comm.ValueChangedCommand';__cov_wUP7ohBe1MLIF8_LQf3BJg.s['23']++;return _this;}__cov_wUP7ohBe1MLIF8_LQf3BJg.s['24']++;return ValueChangedCommand;}(Command_1['default']);__cov_wUP7ohBe1MLIF8_LQf3BJg.s['25']++;exports['default']=ValueChangedCommand;

},{"./Command":52}],71:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ChangeAttributeMetadataCommand_1 = require("../../js/dolphin/ChangeAttributeMetadataCommand");
var chai_1 = require("chai");
describe('ChangeAttributeMetadataCommandTests', function () {
    var changedAttrMDCommand;
    beforeEach(function () {
        changedAttrMDCommand = new ChangeAttributeMetadataCommand_1["default"]("10", "MDName", 20);
    });
    it('id should  be equal to ChangeAttributeMetadata', function () {
        chai_1.expect(changedAttrMDCommand.id).to.equal('ChangeAttributeMetadata');
    });
    it('className should  be equal to org.opendolphin.core.comm.ChangeAttributeMetadataCommand', function () {
        chai_1.expect(changedAttrMDCommand.className).to.equal('org.opendolphin.core.comm.ChangeAttributeMetadataCommand');
    });
    it('attributeId should  be equal to 10', function () {
        chai_1.expect(changedAttrMDCommand.attributeId).to.equal('10');
    });
    it('metadataName should  be equal to MDName', function () {
        chai_1.expect(changedAttrMDCommand.metadataName).to.equal('MDName');
    });
    it('value should be equal to 20', function () {
        chai_1.expect(changedAttrMDCommand.value).to.equal(20);
    });
});

},{"../../js/dolphin/ChangeAttributeMetadataCommand":45,"chai":5}],72:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ClientAttribute_1 = require("../../js/dolphin/ClientAttribute");
var ClientPresentationModel_1 = require("../../js/dolphin/ClientPresentationModel");
var chai_1 = require("chai");
describe('ClientAttributeTests', function () {
    it('attributes should get uniqueIds', function () {
        var ca1 = new ClientAttribute_1.ClientAttribute("prop", "qual", "value");
        var ca2 = new ClientAttribute_1.ClientAttribute("prop", "qual", "value");
        chai_1.assert.notEqual(ca1.id, ca2.id);
    });
    it('value listeners are called', function () {
        var attr = new ClientAttribute_1.ClientAttribute("prop", "qual", 0);
        var spoofedOld = -1;
        var spoofedNew = -1;
        attr.onValueChange(function (evt) {
            spoofedOld = evt.oldValue;
            spoofedNew = evt.newValue;
        });
        chai_1.assert.equal(spoofedOld, 0);
        chai_1.assert.equal(spoofedNew, 0);
        attr.setValue(1);
        chai_1.assert.equal(spoofedOld, 0);
        chai_1.assert.equal(spoofedNew, 1);
    });
    it('attribute listeners are called', function () {
        var attr = new ClientAttribute_1.ClientAttribute("prop", "qual", 0);
        var spoofedOldQfr;
        var spoofedNewQfr;
        attr.onQualifierChange(function (evt) {
            spoofedOldQfr = evt.oldValue;
            spoofedNewQfr = evt.newValue;
        });
        attr.setQualifier("qual_change");
        chai_1.assert.equal(spoofedOldQfr, "qual");
        chai_1.assert.equal(spoofedNewQfr, "qual_change");
    });
    it('value listeners do not interfere', function () {
        var attr1 = new ClientAttribute_1.ClientAttribute("prop", "qual1", 0);
        var attr2 = new ClientAttribute_1.ClientAttribute("prop", "qual2", 0);
        var spoofedNew1 = -1;
        attr1.onValueChange(function (evt) {
            spoofedNew1 = evt.newValue;
        });
        attr1.setValue(1);
        var spoofedNew2 = -1;
        attr2.onValueChange(function (evt) {
            spoofedNew2 = evt.newValue;
        });
        attr2.setValue(2);
        chai_1.assert.equal(spoofedNew1, 1);
        chai_1.assert.equal(spoofedNew2, 2);
    });
    it('check value', function () {
        //valid values
        chai_1.assert.equal(5, ClientAttribute_1.ClientAttribute.checkValue(5));
        chai_1.assert.equal(0, ClientAttribute_1.ClientAttribute.checkValue(0));
        chai_1.assert.equal("test", ClientAttribute_1.ClientAttribute.checkValue("test"));
        var date = new Date();
        chai_1.assert.equal(date, ClientAttribute_1.ClientAttribute.checkValue(date));
        var attr = new ClientAttribute_1.ClientAttribute("prop", "qual1", 0);
        attr.setValue(15);
        chai_1.assert.equal(15, ClientAttribute_1.ClientAttribute.checkValue(attr));
        //Wrapper classes
        chai_1.assert.equal("test", ClientAttribute_1.ClientAttribute.checkValue(new String("test")));
        chai_1.assert.equal(false, ClientAttribute_1.ClientAttribute.checkValue(new Boolean(false)));
        chai_1.assert.equal(15, ClientAttribute_1.ClientAttribute.checkValue(new Number(15)));
        //invalid values
        chai_1.assert.equal(null, ClientAttribute_1.ClientAttribute.checkValue(null));
        chai_1.assert.equal(null, ClientAttribute_1.ClientAttribute.checkValue(undefined)); // null is treated as undefined
        try {
            ClientAttribute_1.ClientAttribute.checkValue(new ClientPresentationModel_1.ClientPresentationModel(undefined, "type"));
            chai_1.assert.fail();
        }
        catch (error) {
            chai_1.assert.isTrue(error instanceof Error);
        }
    });
    it('simple copy', function () {
        var ca1 = new ClientAttribute_1.ClientAttribute("prop", "qual", "value");
        var ca2 = ca1.copy();
        chai_1.assert.notEqual(ca1.id, ca2.id); // id must not be copied
        chai_1.assert.equal(undefined, ca2.getPresentationModel()); // no pm must be set
        chai_1.assert.equal(ca1.getValue(), ca2.getValue());
        chai_1.assert.equal(ca1.getQualifier(), ca2.getQualifier());
        chai_1.assert.equal(ca1.propertyName, ca2.propertyName); // todo dk: for consistency, there should be getPropertyName()
    });
});

},{"../../js/dolphin/ClientAttribute":46,"../../js/dolphin/ClientPresentationModel":50,"chai":5}],73:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ClientConnector_1 = require("../../js/dolphin/ClientConnector");
var ClientAttribute_1 = require("../../js/dolphin/ClientAttribute");
var ClientDolphin_1 = require("../../js/dolphin/ClientDolphin");
var ClientModelStore_1 = require("../../js/dolphin/ClientModelStore");
var Command_1 = require("../../js/dolphin/Command");
var DeleteAllPresentationModelsOfTypeCommand_1 = require("../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand");
var DeletePresentationModelCommand_1 = require("../../js/dolphin/DeletePresentationModelCommand");
var InitializeAttributeCommand_1 = require("../../js/dolphin/InitializeAttributeCommand");
var SwitchPresentationModelCommand_1 = require("../../js/dolphin/SwitchPresentationModelCommand");
var ValueChangedCommand_1 = require("../../js/dolphin/ValueChangedCommand");
var chai_1 = require("chai");
var TestTransmitter = (function () {
    function TestTransmitter(clientCommands, serverCommands) {
        this.clientCommands = clientCommands;
        this.serverCommands = serverCommands;
    }
    TestTransmitter.prototype.transmit = function (commands, onDone) {
        this.clientCommands = commands;
        onDone(this.serverCommands);
    };
    TestTransmitter.prototype.signal = function (command) { };
    TestTransmitter.prototype.reset = function (successHandler) { };
    return TestTransmitter;
}());
describe('DolphinBuilderTest', function () {
    it('sending one command must call the Transmission', function () {
        var singleCommand = new Command_1["default"]();
        var serverCommand = [];
        var transmitter = new TestTransmitter(singleCommand, serverCommand);
        var clientConnector = new ClientConnector_1.ClientConnector(transmitter, null);
        clientConnector.send(singleCommand, undefined);
        chai_1.assert.equal(transmitter.clientCommands.length, 1);
        chai_1.assert.equal(transmitter.clientCommands[0], singleCommand);
    });
    it('sending multiple commands', function () {
        var singleCommand = new Command_1["default"]();
        var serverCommand = [];
        var lastCommand = new Command_1["default"]();
        var transmitter = new TestTransmitter(undefined, serverCommand);
        var clientConnector = new ClientConnector_1.ClientConnector(transmitter, null);
        clientConnector.send(singleCommand, undefined);
        clientConnector.send(singleCommand, undefined);
        clientConnector.send(lastCommand, undefined);
        chai_1.assert.equal(transmitter.clientCommands.length, 1);
        chai_1.assert.equal(transmitter.clientCommands[0].id, lastCommand.id);
    });
    it('handle DeletePresentationModelCommand', function () {
        TestHelper.initialize();
        var serverCommand = new DeletePresentationModelCommand_1["default"]("pmId1");
        //before calling DeletePresentationModelCommand
        var pm1 = TestHelper.clientDolphin.findPresentationModelById("pmId1");
        chai_1.assert.equal(pm1.id, "pmId1");
        //call DeletePresentationModelCommand
        TestHelper.clientConnector.handle(serverCommand);
        pm1 = TestHelper.clientDolphin.findPresentationModelById("pmId1");
        chai_1.assert.equal(pm1, undefined); // should be undefined
        //other PM should be unaffected
        var pm2 = TestHelper.clientDolphin.findPresentationModelById("pmId2");
        chai_1.assert.equal(pm2.id, "pmId2");
        //deleting with dummyId
        serverCommand = new DeletePresentationModelCommand_1["default"]("dummyId");
        var result = TestHelper.clientConnector.handle(serverCommand);
        chai_1.assert.equal(result, null); // there is no pm with dummyId
    });
    it('handle delete all PresentationModel of type command', function () {
        TestHelper.initialize();
        var serverCommand = new DeleteAllPresentationModelsOfTypeCommand_1["default"]("pmType");
        //before calling DeleteAllPresentationModelsOfTypeCommand
        var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        chai_1.assert.equal(pms.length, 2);
        //call DeleteAllPresentationModelsOfTypeCommand
        TestHelper.clientConnector.handle(serverCommand);
        pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        chai_1.assert.equal(pms.length, 0); //both pm of pmType is deleted
        //initialize again
        TestHelper.initialize();
        //sending dummyType
        serverCommand = new DeleteAllPresentationModelsOfTypeCommand_1["default"]("dummyType");
        TestHelper.clientConnector.handle(serverCommand);
        var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        chai_1.assert.equal(pms.length, 2); // nothing is deleted
    });
    it('handle ValueChangedCommand', function () {
        TestHelper.initialize();
        var serverCommand = new ValueChangedCommand_1["default"](TestHelper.attr1.id, 0, 10);
        //before calling ValueChangedCommand
        var attribute = TestHelper.clientDolphin.getClientModelStore().findAttributeById(TestHelper.attr1.id);
        chai_1.assert.equal(attribute.getValue, TestHelper.attr1.getValue);
        chai_1.assert.equal(attribute.getValue(), 0);
        //call ValueChangedCommand
        TestHelper.clientConnector.handle(serverCommand);
        attribute = TestHelper.clientDolphin.getClientModelStore().findAttributeById(TestHelper.attr1.id);
        chai_1.assert.equal(attribute.getValue(), TestHelper.attr1.getValue());
        chai_1.assert.equal(attribute.getValue(), 10);
    });
    it('handle switch PresentationModelCommand', function () {
        TestHelper.initialize();
        var serverCommand = new SwitchPresentationModelCommand_1["default"]("pmId1", "pmId2");
        //before calling SwitchPresentationModelCommand
        var pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        chai_1.assert.notEqual(pms[0].getAttributes()[0].getValue(), pms[1].getAttributes()[0].getValue());
        //call SwitchPresentationModelCommand
        TestHelper.clientConnector.handle(serverCommand);
        pms = TestHelper.clientDolphin.findAllPresentationModelByType("pmType");
        // Attribute of same property ("prop1", )  should be equal
        chai_1.assert.equal(pms[0].getAttributes()[0].getValue(), pms[1].getAttributes()[0].getValue());
        //other attributes should be unaffected
        chai_1.assert.notEqual(pms[0].getAttributes()[1].getValue(), pms[1].getAttributes()[1].getValue());
    });
    it('handle initialize attribute command', function () {
        TestHelper.initialize();
        //new PM with existing attribute qualifier
        var serverCommand = new InitializeAttributeCommand_1["default"]("newPm", "newPmType", "newProp", "qual1", "newValue");
        //before calling InitializeAttributeCommand
        var attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual1");
        chai_1.assert.equal(attribute[0].getValue(), 0);
        chai_1.assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 2);
        //call InitializeAttributeCommand
        TestHelper.clientConnector.handle(serverCommand);
        attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual1");
        chai_1.assert.equal(attribute[0].getValue(), "newValue"); // same attribute value will change
        chai_1.assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 3);
        //existing PM with existing attribute qualifier
        var serverCommand = new InitializeAttributeCommand_1["default"]("pmId1", "pmType1", "newProp", "qual3", "newValue");
        //before calling InitializeAttributeCommand
        var attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual3");
        chai_1.assert.equal(attribute[0].getValue(), 5);
        chai_1.assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 3);
        //call InitializeAttributeCommand
        TestHelper.clientConnector.handle(serverCommand);
        attribute = TestHelper.clientDolphin.getClientModelStore().findAllAttributesByQualifier("qual3");
        chai_1.assert.equal(attribute[0].getValue(), "newValue"); // same attribute value will change
        chai_1.assert.equal(TestHelper.clientDolphin.listPresentationModelIds().length, 3); // no PM added
    });
});
var TestHelper = (function () {
    function TestHelper() {
    }
    TestHelper.initialize = function () {
        var serverCommand = []; //to test
        this.transmitter = new TestTransmitter(undefined, serverCommand);
        this.clientDolphin = new ClientDolphin_1["default"]();
        this.clientConnector = new ClientConnector_1.ClientConnector(this.transmitter, this.clientDolphin);
        this.clientModelStore = new ClientModelStore_1.ClientModelStore(this.clientDolphin);
        this.clientDolphin.setClientModelStore(this.clientModelStore);
        this.clientDolphin.setClientConnector(this.clientConnector);
        this.attr1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", 0);
        var attr2 = new ClientAttribute_1.ClientAttribute("prop2", "qual2", 0);
        this.attr3 = new ClientAttribute_1.ClientAttribute("prop1", "qual3", 5);
        var attr4 = new ClientAttribute_1.ClientAttribute("prop4", "qual4", 5);
        this.clientDolphin.presentationModel("pmId1", "pmType", this.attr1, attr2);
        this.clientDolphin.presentationModel("pmId2", "pmType", this.attr3, attr4);
    };
    return TestHelper;
}());

},{"../../js/dolphin/ClientAttribute":46,"../../js/dolphin/ClientConnector":47,"../../js/dolphin/ClientDolphin":48,"../../js/dolphin/ClientModelStore":49,"../../js/dolphin/Command":52,"../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand":56,"../../js/dolphin/DeletePresentationModelCommand":57,"../../js/dolphin/InitializeAttributeCommand":65,"../../js/dolphin/SwitchPresentationModelCommand":69,"../../js/dolphin/ValueChangedCommand":70,"chai":5}],74:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ClientAttribute_1 = require("../../js/dolphin/ClientAttribute");
var ClientConnector_1 = require("../../js/dolphin/ClientConnector");
var ClientDolphin_1 = require("../../js/dolphin/ClientDolphin");
var ClientModelStore_1 = require("../../js/dolphin/ClientModelStore");
var NoTransmitter_1 = require("../../js/dolphin/NoTransmitter");
var chai_1 = require("chai");
describe('ClientDolphinTests', function () {
    var clientDolphin;
    beforeEach(function () {
        clientDolphin = new ClientDolphin_1["default"]();
        var clientModelStore = new ClientModelStore_1.ClientModelStore(clientDolphin);
        clientDolphin.setClientModelStore(clientModelStore);
        clientDolphin.setClientConnector(new ClientConnector_1.ClientConnector(new NoTransmitter_1["default"](), clientDolphin));
    });
    it('Attributes length should be equal to 0', function () {
        var pm1 = clientDolphin.presentationModel("myId1", "myType");
        chai_1.expect(pm1.id).to.equal('myId1');
        chai_1.expect(pm1.getAttributes().length).to.equal(0);
    });
    it('Attributes length should be equal to 2', function () {
        var ca1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", "val");
        var ca2 = new ClientAttribute_1.ClientAttribute("prop2", "qual2", "val");
        var pm2 = clientDolphin.presentationModel("myId2", "myType", ca1, ca2);
        chai_1.expect(pm2.id).to.equal('myId2');
        chai_1.expect(pm2.getAttributes().length).to.equal(2);
    });
});

},{"../../js/dolphin/ClientAttribute":46,"../../js/dolphin/ClientConnector":47,"../../js/dolphin/ClientDolphin":48,"../../js/dolphin/ClientModelStore":49,"../../js/dolphin/NoTransmitter":67,"chai":5}],75:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ClientAttribute_1 = require("../../js/dolphin/ClientAttribute");
var ClientConnector_1 = require("../../js/dolphin/ClientConnector");
var ClientDolphin_1 = require("../../js/dolphin/ClientDolphin");
var ClientModelStore_1 = require("../../js/dolphin/ClientModelStore");
var ClientPresentationModel_1 = require("../../js/dolphin/ClientPresentationModel");
var chai_1 = require("chai");
var TestTransmitter = (function () {
    function TestTransmitter(clientCommands, serverCommands) {
        this.clientCommands = clientCommands;
        this.serverCommands = serverCommands;
    }
    TestTransmitter.prototype.signal = function (command) { /* do nothing */ ; };
    TestTransmitter.prototype.reset = function (successHandler) { };
    TestTransmitter.prototype.transmit = function (commands, onDone) {
        this.clientCommands = commands;
        onDone(this.serverCommands);
    };
    return TestTransmitter;
}());
describe('ClientModelStoreTests', function () {
    var clientDolphin;
    var clientModelStore;
    beforeEach(function () {
        clientDolphin = new ClientDolphin_1["default"]();
        var serverCommand = []; //to test
        var transmitter = new TestTransmitter(undefined, serverCommand);
        var clientConnector = new ClientConnector_1.ClientConnector(transmitter, clientDolphin);
        clientModelStore = new ClientModelStore_1.ClientModelStore(clientDolphin);
        clientDolphin.setClientConnector(clientConnector);
        clientDolphin.setClientModelStore(clientModelStore);
    });
    it('should be abel add and remove PresentationModel', function () {
        var type;
        var pm;
        clientModelStore.onModelStoreChange(function (evt) {
            type = evt.eventType;
            pm = evt.clientPresentationModel;
        });
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel("id1", "type");
        var pm2 = new ClientPresentationModel_1.ClientPresentationModel("id2", "type");
        clientModelStore.add(pm1);
        chai_1.expect(type).to.equal(ClientModelStore_1.Type.ADDED);
        chai_1.expect(pm).to.equal(pm1);
        clientModelStore.add(pm2);
        chai_1.expect(type).to.equal(ClientModelStore_1.Type.ADDED);
        chai_1.expect(pm).to.equal(pm2);
        var ids = clientModelStore.listPresentationModelIds();
        chai_1.expect(ids.length).to.equal(2);
        chai_1.expect(ids[1]).to.equal("id2");
        var pms = clientModelStore.listPresentationModels();
        chai_1.expect(pms.length).to.equal(2);
        chai_1.expect(pms[0]).to.equal(pm1);
        var pm = clientModelStore.findPresentationModelById("id2");
        chai_1.expect(pm).to.equal(pm2);
        chai_1.expect(clientModelStore.containsPresentationModel("id1")).to.be["true"];
        clientModelStore.remove(pm1);
        chai_1.expect(type).to.equal(ClientModelStore_1.Type.REMOVED);
        chai_1.expect(pm).to.equal(pm1);
        var ids = clientModelStore.listPresentationModelIds();
        chai_1.expect(ids.length).to.equal(1);
        chai_1.expect(ids[0]).to.equal("id2");
        var pms = clientModelStore.listPresentationModels();
        chai_1.expect(pms.length).to.equal(1);
        chai_1.expect(pms[0]).to.equal(pm2);
        chai_1.expect(clientModelStore.containsPresentationModel("id1")).to.be["false"];
    });
    it('should be listen for PresentationModel changes by type', function () {
        var type;
        var pm;
        // only listen for a specific type
        clientModelStore.onModelStoreChangeForType("type", function (evt) {
            type = evt.eventType;
            pm = evt.clientPresentationModel;
        });
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel("id1", "type");
        var pm2 = new ClientPresentationModel_1.ClientPresentationModel("id2", "type");
        var pm3 = new ClientPresentationModel_1.ClientPresentationModel("id3", "some other type");
        clientModelStore.add(pm1);
        chai_1.expect(type).to.equal(ClientModelStore_1.Type.ADDED);
        chai_1.expect(pm).to.equal(pm1);
        clientModelStore.add(pm2);
        chai_1.expect(type).to.equal(ClientModelStore_1.Type.ADDED);
        chai_1.expect(pm).to.equal(pm2);
        clientModelStore.add(pm3);
        chai_1.expect(pm).to.equal(pm2); // adding pm3 did not change the last pm !!!
        // but it is in the model store
        var ids = clientModelStore.listPresentationModelIds();
        chai_1.expect(ids.length).to.equal(3);
        chai_1.expect(ids[2]).to.equal("id3");
        var pms = clientModelStore.listPresentationModels();
        chai_1.expect(pms.length).to.equal(3);
        chai_1.expect(pms[0]).to.equal(pm1);
        var pm = clientModelStore.findPresentationModelById("id3");
        chai_1.expect(pm).to.equal(pm3);
        chai_1.expect(clientModelStore.containsPresentationModel("id3")).to.be["true"];
        clientModelStore.remove(pm1);
        chai_1.expect(type).to.equal(ClientModelStore_1.Type.REMOVED);
        chai_1.expect(pm).to.equal(pm1);
        clientModelStore.remove(pm3); // listener ist _not_ triggered!
        chai_1.expect(pm).to.equal(pm1);
    });
    it('should be add and remove PresentationModel by type', function () {
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel("id1", "type");
        var pm2 = new ClientPresentationModel_1.ClientPresentationModel("id2", "type");
        clientModelStore.addPresentationModelByType(pm1);
        var pms = clientModelStore.findAllPresentationModelByType(pm1.presentationModelType);
        chai_1.expect(pms.length).to.equal(1);
        chai_1.expect(pms[0].id).to.equal("id1");
        clientModelStore.addPresentationModelByType(pm2);
        var pms = clientModelStore.findAllPresentationModelByType(pm1.presentationModelType);
        chai_1.expect(pms.length).to.equal(2);
        chai_1.expect(pms[0].id).to.equal("id1");
        chai_1.expect(pms[1].id).to.equal("id2");
        clientModelStore.removePresentationModelByType(pm1);
        var pms = clientModelStore.findAllPresentationModelByType(pm1.presentationModelType);
        chai_1.expect(pms.length).to.equal(1);
        chai_1.expect(pms[0].id).to.equal("id2");
    });
    it('should be add and remove AttributeById', function () {
        var attr1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", 0);
        var attr2 = new ClientAttribute_1.ClientAttribute("prop2", "qual2", 0);
        clientModelStore.addAttributeById(attr1);
        clientModelStore.addAttributeById(attr2);
        var result1 = clientModelStore.findAttributeById(attr1.id);
        chai_1.expect(result1).to.equal(attr1);
        var result2 = clientModelStore.findAttributeById(attr2.id);
        chai_1.expect(result2).to.equal(attr2);
        clientModelStore.removeAttributeById(attr1);
        var result1 = clientModelStore.findAttributeById(attr1.id);
        chai_1.expect(result1).to.equal(undefined);
    });
    it('should be add and remove ClientAttribute by qualifier', function () {
        var attr1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", 0);
        var attr2 = new ClientAttribute_1.ClientAttribute("prop2", "qual2", 0);
        var attr3 = new ClientAttribute_1.ClientAttribute("prop3", "qual1", 0);
        var attr4 = new ClientAttribute_1.ClientAttribute("prop4", "qual2", 0);
        clientModelStore.addAttributeByQualifier(attr1);
        clientModelStore.addAttributeByQualifier(attr2);
        clientModelStore.addAttributeByQualifier(attr3);
        clientModelStore.addAttributeByQualifier(attr4);
        var clientAttrs1 = clientModelStore.findAllAttributesByQualifier("qual1");
        chai_1.expect(clientAttrs1.length).to.equal(2);
        chai_1.expect(clientAttrs1[0].getQualifier()).to.equal("qual1");
        chai_1.expect(clientAttrs1[1].getQualifier()).to.equal("qual1");
        var clientAttrs2 = clientModelStore.findAllAttributesByQualifier("qual2");
        chai_1.expect(clientAttrs2.length).to.equal(2);
        chai_1.expect(clientAttrs2[0].getQualifier()).to.equal("qual2");
        chai_1.expect(clientAttrs2[1].getQualifier()).to.equal("qual2");
        clientModelStore.removeAttributeByQualifier(attr1);
        var clientAttrs1 = clientModelStore.findAllAttributesByQualifier("qual1");
        chai_1.expect(clientAttrs1.length).to.equal(1);
        chai_1.expect(clientAttrs1[0].getQualifier()).to.equal("qual1");
        chai_1.expect(clientAttrs1[1]).to.equal(undefined);
    });
});

},{"../../js/dolphin/ClientAttribute":46,"../../js/dolphin/ClientConnector":47,"../../js/dolphin/ClientDolphin":48,"../../js/dolphin/ClientModelStore":49,"../../js/dolphin/ClientPresentationModel":50,"chai":5}],76:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ClientAttribute_1 = require("../../js/dolphin/ClientAttribute");
var ClientPresentationModel_1 = require("../../js/dolphin/ClientPresentationModel");
var chai_1 = require("chai");
describe('ClientPresentationModelTests', function () {
    it('create pm with automatic id', function () {
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel(undefined, undefined);
        var pm2 = new ClientPresentationModel_1.ClientPresentationModel(undefined, undefined);
        chai_1.assert.notEqual(pm1.id, pm2.id);
    });
    it('create pm with given id', function () {
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel("MyId", undefined);
        chai_1.assert.equal(pm1.id, "MyId");
    });
    it('create pm with given type', function () {
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel(undefined, "MyType");
        chai_1.assert.equal(pm1.presentationModelType, "MyType");
    });
    it('adding client attributes', function () {
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel(undefined, undefined);
        chai_1.assert.equal(pm1.getAttributes().length, 0);
        var firstAttribute = new ClientAttribute_1.ClientAttribute("prop", "qual", 0);
        pm1.addAttribute(firstAttribute);
        chai_1.assert.equal(pm1.getAttributes().length, 1);
        chai_1.assert.equal(pm1.getAttributes()[0], firstAttribute);
    });
    it('invalidate ClientPresentationModel event', function () {
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel(undefined, undefined);
        var clientAttribute = new ClientAttribute_1.ClientAttribute("prop", "qual", 0);
        pm1.addAttribute(clientAttribute);
        var source;
        pm1.onInvalidated(function (event) {
            source = event.source;
        });
        clientAttribute.setValue("newValue");
        chai_1.assert.equal(pm1, source);
    });
    it('find attribute by id', function () {
        var pm = new ClientPresentationModel_1.ClientPresentationModel(undefined, undefined);
        var ca1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", "value1");
        pm.addAttribute(ca1);
        var result = pm.findAttributeById(ca1.id);
        chai_1.assert.equal(ca1, result);
        // find by invalid id
        result = pm.findAttributeById("no-such-id");
        chai_1.assert.equal(result, null);
    });
    it('find attribute by qualifier', function () {
        var pm = new ClientPresentationModel_1.ClientPresentationModel(undefined, undefined);
        var ca1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", "value1");
        pm.addAttribute(ca1);
        var result = pm.findAttributeByQualifier("qual1");
        chai_1.assert.equal(ca1, result);
        // find by invalid qualifier
        result = pm.findAttributeByQualifier("dummy");
        chai_1.assert.equal(result, null);
    });
    it('simple copy', function () {
        var ca1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", "value1");
        var ca2 = new ClientAttribute_1.ClientAttribute("prop2", "qual2", "value2");
        var pm1 = new ClientPresentationModel_1.ClientPresentationModel("pmId", "pmType");
        pm1.addAttribute(ca1);
        pm1.addAttribute(ca2);
        var pm2 = pm1.copy();
        chai_1.assert.notEqual(pm1.id, pm2.id);
        chai_1.assert.equal(true, pm2.clientSideOnly);
        chai_1.assert.equal(pm1.presentationModelType, pm2.presentationModelType); // not sure this is a good idea
        chai_1.assert.equal(pm1.getAttributes().length, pm2.getAttributes().length);
        chai_1.assert.equal(pm1.getAt('prop2').getValue(), pm2.getAt('prop2').getValue()); // a spy would be nice here
    });
});

},{"../../js/dolphin/ClientAttribute":46,"../../js/dolphin/ClientPresentationModel":50,"chai":5}],77:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var AttributeCreatedNotification_1 = require("../../js/dolphin/AttributeCreatedNotification");
var AttributeMetadataChangedCommand_1 = require("../../js/dolphin/AttributeMetadataChangedCommand");
var CallNamedActionCommand_1 = require("../../js/dolphin/CallNamedActionCommand");
var ChangeAttributeMetadataCommand_1 = require("../../js/dolphin/ChangeAttributeMetadataCommand");
var ClientAttribute_1 = require("../../js/dolphin/ClientAttribute");
var ClientPresentationModel_1 = require("../../js/dolphin/ClientPresentationModel");
var Codec_1 = require("../../js/dolphin/Codec");
var CreatePresentationModelCommand_1 = require("../../js/dolphin/CreatePresentationModelCommand");
var GetPresentationModelCommand_1 = require("../../js/dolphin/GetPresentationModelCommand");
var DataCommand_1 = require("../../js/dolphin/DataCommand");
var DeleteAllPresentationModelsOfTypeCommand_1 = require("../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand");
var DeletedAllPresentationModelsOfTypeNotification_1 = require("../../js/dolphin/DeletedAllPresentationModelsOfTypeNotification");
var DeletedPresentationModelNotification_1 = require("../../js/dolphin/DeletedPresentationModelNotification");
var DeletePresentationModelCommand_1 = require("../../js/dolphin/DeletePresentationModelCommand");
var EmptyNotification_1 = require("../../js/dolphin/EmptyNotification");
var InitializeAttributeCommand_1 = require("../../js/dolphin/InitializeAttributeCommand");
var NamedCommand_1 = require("../../js/dolphin/NamedCommand");
var SignalCommand_1 = require("../../js/dolphin/SignalCommand");
var SwitchPresentationModelCommand_1 = require("../../js/dolphin/SwitchPresentationModelCommand");
var ValueChangedCommand_1 = require("../../js/dolphin/ValueChangedCommand");
var chai_1 = require("chai");
describe('Codec Test', function () {
    it('test codec create PresentationModel', function () {
        var pm = new ClientPresentationModel_1.ClientPresentationModel("MyId", "MyType");
        var clientAttribute1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", 0);
        var clientAttribute2 = new ClientAttribute_1.ClientAttribute("prop2", "qual2", 0);
        pm.addAttribute(clientAttribute1);
        pm.addAttribute(clientAttribute2);
        var createPMCommand = new CreatePresentationModelCommand_1["default"](pm);
        var codec = new Codec_1["default"]();
        var coded = codec.encode(createPMCommand);
        var decoded = codec.decode(coded);
        chai_1.expect(createPMCommand.toString() === decoded.toString()).to.be["true"];
    });
    it('test empty', function () {
        chai_1.expect(CodecTestHelper.testSoManyCommandsEncoding(0)).to.be["true"];
    });
    it('test one', function () {
        chai_1.expect(CodecTestHelper.testSoManyCommandsEncoding(1)).to.be["true"];
    });
    it('test many', function () {
        chai_1.expect(CodecTestHelper.testSoManyCommandsEncoding(10)).to.be["true"];
    });
    it('test coding commands', function () {
        chai_1.expect(CodecTestHelper.testCodingCommand(new AttributeCreatedNotification_1["default"]("pmId", "5", "prop", "äöüéàè", "qualifier"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new AttributeMetadataChangedCommand_1["default"]("5", "name", "value"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new CallNamedActionCommand_1["default"]("some-action"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new CreatePresentationModelCommand_1["default"](new ClientPresentationModel_1.ClientPresentationModel("MyId", "MyType")))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new ChangeAttributeMetadataCommand_1["default"]("5", "name", "value"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new GetPresentationModelCommand_1["default"]("pmId"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new DataCommand_1["default"]("test")));
        chai_1.expect(CodecTestHelper.testCodingCommand(new DeleteAllPresentationModelsOfTypeCommand_1["default"]("type"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new DeletedAllPresentationModelsOfTypeNotification_1["default"]("type"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new DeletedPresentationModelNotification_1["default"]("pmId"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new DeletePresentationModelCommand_1["default"]("pmId"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new EmptyNotification_1["default"]())).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new InitializeAttributeCommand_1["default"]("pmId", "prop", "qualifier", "value", "pmType"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new NamedCommand_1["default"]("name"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new SignalCommand_1["default"]("signal"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new SwitchPresentationModelCommand_1["default"]("pmId", "sourcePmId"))).to.be["true"];
        chai_1.expect(CodecTestHelper.testCodingCommand(new ValueChangedCommand_1["default"]("5", "oldValue", "newValue"))).to.be["true"];
    });
});
var CodecTestHelper = (function () {
    function CodecTestHelper() {
    }
    CodecTestHelper.testSoManyCommandsEncoding = function (count) {
        var codec = new Codec_1["default"]();
        var commands = [];
        for (var i = 0; i < count; i++) {
            commands.push(new AttributeCreatedNotification_1["default"](i.toString(), "" + i * count, "prop" + i, "value" + i, null));
        }
        var coded = codec.encode(commands);
        var decoded = codec.decode(coded);
        if (commands.toString() === decoded.toString()) {
            return true;
        }
        else {
            return false;
        }
    };
    CodecTestHelper.testCodingCommand = function (command) {
        var codec = new Codec_1["default"]();
        var coded = codec.encode(command);
        var decoded = codec.decode(coded);
        if (command.toString() === decoded.toString()) {
            return true;
        }
        else {
            return false;
        }
    };
    return CodecTestHelper;
}());

},{"../../js/dolphin/AttributeCreatedNotification":42,"../../js/dolphin/AttributeMetadataChangedCommand":43,"../../js/dolphin/CallNamedActionCommand":44,"../../js/dolphin/ChangeAttributeMetadataCommand":45,"../../js/dolphin/ClientAttribute":46,"../../js/dolphin/ClientPresentationModel":50,"../../js/dolphin/Codec":51,"../../js/dolphin/CreatePresentationModelCommand":54,"../../js/dolphin/DataCommand":55,"../../js/dolphin/DeleteAllPresentationModelsOfTypeCommand":56,"../../js/dolphin/DeletePresentationModelCommand":57,"../../js/dolphin/DeletedAllPresentationModelsOfTypeNotification":58,"../../js/dolphin/DeletedPresentationModelNotification":59,"../../js/dolphin/EmptyNotification":61,"../../js/dolphin/GetPresentationModelCommand":63,"../../js/dolphin/InitializeAttributeCommand":65,"../../js/dolphin/NamedCommand":66,"../../js/dolphin/SignalCommand":68,"../../js/dolphin/SwitchPresentationModelCommand":69,"../../js/dolphin/ValueChangedCommand":70,"chai":5}],78:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var CommandBatcher_1 = require("../../js/dolphin/CommandBatcher");
var ValueChangedCommand_1 = require("../../js/dolphin/ValueChangedCommand");
var chai_1 = require("chai");
describe('CommandBatcherTests', function () {
    it('Batcher Does Not Batch', function () {
        var whateverCommandAndHandler = { command: null, handler: null };
        var queue = [whateverCommandAndHandler, whateverCommandAndHandler, whateverCommandAndHandler];
        var batcher = new CommandBatcher_1.NoCommandBatcher();
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(1);
        chai_1.expect(queue.length).to.equal(2);
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(1);
        chai_1.expect(queue.length).to.equal(1);
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(1);
        chai_1.expect(queue.length).to.equal(0);
    });
    it('Simple Blind Batching', function () {
        var whateverCommandAndHandler = { command: { id: "x" }, handler: null };
        var queue = [whateverCommandAndHandler, whateverCommandAndHandler, whateverCommandAndHandler];
        var batcher = new CommandBatcher_1.BlindCommandBatcher();
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(3);
        chai_1.expect(queue.length).to.equal(0);
    });
    it('Blind Batching With Non Blind', function () {
        var blind = { command: { id: "x" }, handler: null };
        var finisher = { onFinished: null, onFinishedData: null };
        var handled = { command: { id: "x" }, handler: finisher };
        var queue = [handled, blind, blind, handled, blind, handled]; // batch sizes 1, 3, 2
        var batcher = new CommandBatcher_1.BlindCommandBatcher();
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(1);
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(3);
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(2);
        chai_1.expect(result[0]).to.equal(blind); // make sure we have the right sequence
        chai_1.expect(result[1]).to.equal(handled);
        chai_1.expect(queue.length).to.equal(0);
    });
    it('Blind Folding', function () {
        var cmd1 = new ValueChangedCommand_1["default"]("1", 0, 1);
        var cmd2 = new ValueChangedCommand_1["default"]("2", 0, 1); // other id, will be batched
        var cmd3 = new ValueChangedCommand_1["default"]("1", 1, 2); // will be folded
        var queue = [
            { command: cmd1, handler: null },
            { command: cmd2, handler: null },
            { command: cmd3, handler: null }
        ];
        var unfolded = queue[1];
        var batcher = new CommandBatcher_1.BlindCommandBatcher();
        var result = batcher.batch(queue);
        chai_1.expect(result.length).to.equal(2);
        chai_1.expect(result[0].command['attributeId']).to.equal("1");
        chai_1.expect(result[0].command['oldValue']).to.equal(0);
        chai_1.expect(result[0].command['newValue']).to.equal(2);
        chai_1.expect(result[1]).to.equal(unfolded);
        chai_1.expect(queue.length).to.equal(0);
    });
});

},{"../../js/dolphin/CommandBatcher":53,"../../js/dolphin/ValueChangedCommand":70,"chai":5}],79:[function(require,module,exports){
// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ClientAttribute_1 = require("../../js/dolphin/ClientAttribute");
var ClientPresentationModel_1 = require("../../js/dolphin/ClientPresentationModel");
var CreatePresentationModelCommand_1 = require("../../js/dolphin/CreatePresentationModelCommand");
var chai_1 = require("chai");
describe('CreatePresentationModelCommandTests', function () {
    it('create PresentationModelCommand with given parameter', function () {
        var pm = new ClientPresentationModel_1.ClientPresentationModel("MyId", "MyType");
        var clientAttribute1 = new ClientAttribute_1.ClientAttribute("prop1", "qual1", 0);
        var clientAttribute2 = new ClientAttribute_1.ClientAttribute("prop2", "qual2", 0);
        pm.addAttribute(clientAttribute1);
        pm.addAttribute(clientAttribute2);
        var createPMCommand = new CreatePresentationModelCommand_1["default"](pm);
        chai_1.assert.equal(createPMCommand.id, "CreatePresentationModel");
        chai_1.assert.equal(createPMCommand.className, "org.opendolphin.core.comm.CreatePresentationModelCommand");
        chai_1.assert.equal(createPMCommand.pmId, "MyId");
        chai_1.assert.equal(createPMCommand.pmType, "MyType");
        chai_1.assert.equal(createPMCommand.attributes.length, 2);
        chai_1.assert.equal(createPMCommand.attributes[0].propertyName, "prop1");
        chai_1.assert.equal(createPMCommand.attributes[1].propertyName, "prop2");
    });
});

},{"../../js/dolphin/ClientAttribute":46,"../../js/dolphin/ClientPresentationModel":50,"../../js/dolphin/CreatePresentationModelCommand":54,"chai":5}],80:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var DolphinBuilder_1 = require("../../js/dolphin/DolphinBuilder");
var chai_1 = require("chai");
describe('DolphinBuilderTest', function () {
    it('defaults values', function () {
        var builder = new DolphinBuilder_1["default"]();
        chai_1.assert.equal(builder.url_, undefined, "ERROR: url_ must be 'undefined'");
        chai_1.assert.equal(builder.reset_, false, "ERROR: reset_ must be 'false'");
        chai_1.assert.equal(builder.slackMS_, 300, "ERROR: slackMS_ must be '300'");
        chai_1.assert.equal(builder.maxBatchSize_, 50, "ERROR: maxBatchSize_ must be '50'");
        chai_1.assert.equal(builder.errorHandler_, undefined, "ERROR: errorHandler_ must be 'undefined'");
        chai_1.assert.equal(builder.supportCORS_, false, "ERROR: supportCORS_ must be 'false'");
    });
    it('url', function () {
        var url = 'http:8080//mydolphinapp';
        var builder = new DolphinBuilder_1["default"]().url(url);
        chai_1.assert.equal(builder.url_, url, "ERROR: url_ must be '" + url + "'");
    });
    it('reset', function () {
        var reset = true;
        var builder = new DolphinBuilder_1["default"]().reset(reset);
        chai_1.assert.equal(builder.reset_, reset, "ERROR: reset_ must be '" + reset + "'");
    });
    it('slackMS', function () {
        var slackMS = 400;
        var builder = new DolphinBuilder_1["default"]().slackMS(slackMS);
        chai_1.assert.equal(builder.slackMS_, slackMS, "ERROR: slackMS_ must be '" + slackMS + "'");
    });
    it('max batch size', function () {
        var maxBatchSize = 60;
        var builder = new DolphinBuilder_1["default"]().maxBatchSize(maxBatchSize);
        chai_1.assert.equal(builder.maxBatchSize_, maxBatchSize, "ERROR: maxBatchSize_ must be '" + maxBatchSize + "'");
    });
    it('support CORS', function () {
        var supportCORS = true;
        var builder = new DolphinBuilder_1["default"]().supportCORS(supportCORS);
        chai_1.assert.equal(builder.supportCORS_, supportCORS, "ERROR: supportCORS_ must be '" + supportCORS + "'");
    });
    it('error handler', function () {
        var errorHandler = function (evt) { };
        var builder = new DolphinBuilder_1["default"]().errorHandler(errorHandler);
        chai_1.assert.equal(builder.errorHandler_, errorHandler, "ERROR: errorHandler_ must be '" + errorHandler + "'");
    });
    it('built client dolphin', function () {
        var dolphin = new DolphinBuilder_1["default"]().build();
        chai_1.assert.notEqual(dolphin.getClientConnector(), undefined, "ERROR: dolphin.clientConnector must be initialized");
        chai_1.assert.notEqual(dolphin.getClientModelStore(), undefined, "ERROR: dolphin.clientModelStore must be initialized");
        // TODO: how to test if 'HttpTransmitter' or 'NoTransmitter' is created when 'ClientTransmitter.transmitter' is private ?
    });
});

},{"../../js/dolphin/DolphinBuilder":60,"chai":5}],81:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var EmptyNotification_1 = require("../../js/dolphin/EmptyNotification");
var chai_1 = require("chai");
describe('EmptyNotificationTests', function () {
    var emptyNotification;
    beforeEach(function () {
        emptyNotification = new EmptyNotification_1["default"]();
    });
    it('id should  be equal to Empty', function () {
        chai_1.expect(emptyNotification.id).to.equal('Empty');
    });
    it('className should  be equal to org.opendolphin.core.comm.EmptyNotification', function () {
        chai_1.expect(emptyNotification.className).to.equal('org.opendolphin.core.comm.EmptyNotification');
    });
});

},{"../../js/dolphin/EmptyNotification":61,"chai":5}],82:[function(require,module,exports){
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var NamedCommand_1 = require("../../js/dolphin/NamedCommand");
var chai_1 = require("chai");
describe('NamedCommandTests', function () {
    var namedCommand;
    beforeEach(function () {
        namedCommand = new NamedCommand_1["default"]("CustomId");
    });
    it('id should be equal to CustomId', function () {
        chai_1.expect(namedCommand.id).to.equal('CustomId');
    });
    it('className should be equal to org.opendolphin.core.comm.NamedCommand', function () {
        chai_1.expect(namedCommand.className).to.equal('org.opendolphin.core.comm.NamedCommand');
    });
});

},{"../../js/dolphin/NamedCommand":66,"chai":5}],83:[function(require,module,exports){
// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
"use strict";
exports.__esModule = true;
var ValueChangedCommand_1 = require("../../js/dolphin/ValueChangedCommand");
var chai_1 = require("chai");
describe('ValueChangedCommandTests', function () {
    var valueChangedCommand;
    beforeEach(function () {
        valueChangedCommand = new ValueChangedCommand_1["default"]("10", 10, 20);
        ;
    });
    it('should create ValueChangedCommand with given parameter', function () {
        chai_1.expect(valueChangedCommand.id).to.equal('ValueChanged');
        chai_1.expect(valueChangedCommand.className).to.equal('org.opendolphin.core.comm.ValueChangedCommand');
        chai_1.expect(valueChangedCommand.attributeId).to.equal('10');
        chai_1.expect(valueChangedCommand.oldValue).to.equal(10);
        chai_1.expect(valueChangedCommand.newValue).to.equal(20);
    });
});

},{"../../js/dolphin/ValueChangedCommand":70,"chai":5}]},{},[71,72,73,74,75,76,77,78,79,80,81,82,83])


//# sourceMappingURL=test-bundle.js.map
