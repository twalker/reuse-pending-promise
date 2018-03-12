'use strict'

module.exports = (fn, getKey) => (...args) => {
  const cacheKey = typeof getKey === 'function' ? getKey(...args) : args[0] || 'noargs'
  fn.pending = fn.pending || new Map()
  if (!fn.pending.has(cacheKey)) {
    fn.pending.set(cacheKey,
      fn(...args)
          .then(value => {
            fn.pending.delete(cacheKey)
            return value
        })
          .catch(error => {
            fn.pending.delete(cacheKey)
            throw error
        })
    )
  }
  return fn.pending.get(cacheKey)
}
