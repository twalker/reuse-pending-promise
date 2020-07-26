const {reusePendingPromise: reuse} = require('../src')

describe('reuse-pending-promise', () => {
  const createFetchData = ({success = true, result = {}}) => () => {
    return success ? Promise.resolve(result) : Promise.reject(result)
  }

  it('reuses existing promises that are still pending', () => {
    const fetchData = createFetchData({success: true})
    const reusedFetchData = reuse(fetchData)
    const promise1 = reusedFetchData()
    const promise2 = reusedFetchData()

    return Promise.all([promise1, promise2]).then(() => {
      expect(promise1).toBe(promise2)
    })
  })

  it('returns a new promise when the previous succeeded', () => {
    const fetchData = createFetchData({success: true})
    const reusedFetchData = reuse(fetchData)
    const promise1 = reusedFetchData()
    return promise1.then(() => {
      const promise2 = reusedFetchData()
      expect(promise1).not.toBe(promise2)
    })
  })

  it('returns a new promise when the previous failed', () => {
    const fetchData = createFetchData({success: false})
    const reusedFetchData = reuse(fetchData)
    const promise1 = reusedFetchData()
    return promise1.catch(() => {
      const promise2 = reusedFetchData().catch(() => {
        /* Prevent UnhandledPromiseRejectionWarning */
      })
      expect(promise1).not.toBe(promise2)
    })
  })

  it('uses first argument as a cache key by default', () => {
    const fetchData = createFetchData({success: true})
    const reusedFetchData = reuse(fetchData)
    const promise1 = reusedFetchData('foo')
    const promise2 = reusedFetchData('bar')
    return Promise.all([promise1, promise2]).then(() => {
      expect(promise1).not.toBe(promise2)
    })
  })

  it('uses result of getKey as cache key if provided', () => {
    const fetchData = createFetchData({success: true})
    const getCacheKey = ({lang, region}) => `${lang}${region}`
    const reusedFetchData = reuse(fetchData, {getKey: getCacheKey})
    const promise1 = reusedFetchData({lang: 'foo', region: 'bar'})
    const promise2 = reusedFetchData({lang: 'baz', region: 'qux'})
    return Promise.all([promise1, promise2]).then(() => {
      expect(promise1).not.toBe(promise2)
    })
  })

  it('resolves with original result', () => {
    const expected = {data: 'foobar'}
    const fetchData = createFetchData({success: true, result: expected})
    const reusedFetchData = reuse(fetchData)
    return reusedFetchData().then((data) => {
      expect(data).toEqual(expected)
    })
  })

  it('rejects with original error', () => {
    const expected = new Error('Bang!')
    const fetchData = createFetchData({success: false, result: expected})
    const reusedFetchData = reuse(fetchData)
    return reusedFetchData().catch((error) => {
      expect(error).toEqual(expected)
    })
  })
})
