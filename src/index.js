'use strict'

module.exports = (fn, getKey) => (...args) => {
  const cacheKey =
    typeof getKey === 'function' ? getKey(...args) : args[0] || 'noargs'
  fn.pending = fn.pending || new Map()
  if (!fn.pending.has(cacheKey)) {
    fn.pending.set(
      cacheKey,
      fn(...args).finally(() => fn.pending.delete(cacheKey))
    )
  }

  return fn.pending.get(cacheKey)
}
