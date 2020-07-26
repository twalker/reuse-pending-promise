'use strict'

const defaultOptions = {
  getCacheKey: (...args) => args[0] || 'noargs'
}

const reusePendingPromise = (fn, options = {}) => (...args) => {
  const options_ = {...defaultOptions, ...options}
  const cacheKey = options_.getCacheKey(...args)

  fn.pending = fn.pending || new Map()
  if (!fn.pending.has(cacheKey)) {
    fn.pending.set(
      cacheKey,
      fn(...args).finally(() => fn.pending.delete(cacheKey))
    )
  }

  return fn.pending.get(cacheKey)
}

module.exports = {reusePendingPromise}
