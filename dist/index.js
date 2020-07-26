'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var defaultOptions = {
  getCacheKey: function getCacheKey() {
    return (arguments.length <= 0 ? undefined : arguments[0]) || 'noargs';
  }
};

var reusePendingPromise = function reusePendingPromise(fn) {
  var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function () {
    var options = _objectSpread2(_objectSpread2({}, defaultOptions), userOptions);

    var cacheKey = options.getCacheKey.apply(options, arguments);
    fn.pending = fn.pending || new Map();

    if (!fn.pending.has(cacheKey)) {
      fn.pending.set(cacheKey, fn.apply(void 0, arguments)["finally"](function () {
        return fn.pending["delete"](cacheKey);
      }));
    }

    return fn.pending.get(cacheKey);
  };
};

module.exports = {
  reusePendingPromise: reusePendingPromise
};
