const defaultOptions = {
  getCacheKey: (...args) => args[0] || 'noargs'
}

export const reusePendingPromise = (fn, userOptions = {}) => (...args) => {
  const options = {...defaultOptions, ...userOptions}
  const cacheKey = options.getCacheKey(...args)

  fn.pending = fn.pending || new Map()
  if (!fn.pending.has(cacheKey)) {
    fn.pending.set(
      cacheKey,
      fn(...args).finally(() => fn.pending.delete(cacheKey))
    )
  }

  return fn.pending.get(cacheKey)
}
