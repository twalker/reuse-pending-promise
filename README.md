# reuse-pending-promise

Reuses a promise by reference until it's settled (resolved or rejected).
It helps ensure only one fetch is made at a time--preventing
multiple simultaneous fetches for the same data.

It decorates the `fn` (a thennable) with a cache of pending promises.
The cached promise is returned until it has been fulfilled.

```javascript
reusePendingPromise(fn[, getKey])
```

## Install

```sh
npm install reuse-pending-promise
```

## Basic Usage
```javascript
const { reusePendingPromise } = require('reuse-pending-promise')

let callCount = 0;
// A promise-returning function
const MyFn = () => {
  callCount++
  return new Promise(resolve => {
    // Wait 10 seconds before resolving
    setTimeout(() => {
      resolve(callCount)
    }, 10 * 1000)
  })
}

// Wrap the promise returning function
const reusedMyFn = reusePendingPromise(MyFn)

Promise
  // Call the reused function 3 times in parallel
  .all([reusedMyFn(), reusedMyFn(), reusedMyFn()])
  .then(() => console.log(`callCount: ${callCount}`))
  // now that the first promise has resolved...
  .then(reusedMyFn)
  .then(() => console.log(`callCount: ${callCount}`))

// 10 seconds later, the initial three calls resolve but the `myFn` is only invoked once:
// // callCount: 1

// 20 seconds later, the last call will resolve, having invoked `myFn` is a second time.
// // callCount: 2
```
## Advanced Usage
The `getKey` argument can be used to cache variations, similar to the `resolver`
argument in [lodash.memoize](https://lodash.com/docs/4.17.11#memoize).
By default the first argument is used as the cache key.

```javascript
const fetchData = (lang, country) => fetch(`http://example.com/${country}/${lang}`)
const getCacheKey = (lang, country) => `${lang}${region}`

const reusedFetchData = reusePendingPromise(fetchData, getCacheKey)
// promise1 and promise2 will share the same promise returned by fetch,
// since they share a cache key.
const promise1 = reusedFetchData('en', 'canada')
const promise2 = reusedFetchData('en', 'canada')
// promise1 === promise2

// promise3 will be a different cache key, thus will be a new promise for
// a second second fetch call.
const promise3 = reusedFetchData('fr', 'canada')
// promise3 !== promise1
```

Additional examples are in the [unit test](./test/reuse-pending-promise.test.js)

## Contributing
Fork and create a PR.

## License

This project is [MIT](https://github.com/twalker/reuse-pending-promise/blob/master/LICENSE) licensed.
