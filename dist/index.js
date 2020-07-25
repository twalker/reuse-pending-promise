'use strict';

var reuse = function reuse(fn, getKey) {
  return function () {
    var cacheKey = typeof getKey === 'function' ? getKey.apply(void 0, arguments) : (arguments.length <= 0 ? undefined : arguments[0]) || 'noargs';
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
  reusePendingPromise: reuse
};
