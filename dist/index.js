'use strict';

module.exports = function (fn, getKey) {
  return function () {
    var cacheKey = typeof getKey === 'function' ? getKey.apply(void 0, arguments) : (arguments.length <= 0 ? undefined : arguments[0]) || 'noargs';
    fn.pending = fn.pending || new Map();

    if (!fn.pending.has(cacheKey)) {
      fn.pending.set(cacheKey, fn.apply(void 0, arguments).then(function (value) {
        fn.pending["delete"](cacheKey);
        return value;
      })["catch"](function (error) {
        fn.pending["delete"](cacheKey);
        throw error;
      }));
    }

    return fn.pending.get(cacheKey);
  };
};
