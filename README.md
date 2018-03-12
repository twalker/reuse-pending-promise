# reuse-pending-promise

Reuses a promise by reference until it resolves or rejects.
It helps ensure only one fetch is made at a time--preventing
multiple simultaneous fetches for the same data.

It decorates the `fn` (a thennable) with a cache of pending promises.
The cached promise is returned until it has been fulfilled.

The `getKey` argument can be used to cache variations, similar to the resolver
argument in lodash.memoize. By default the first argument is used as the cache key.

Example usage:
```javascript
const fetchData = () => new Promise(...a fetch that takes 10 seconds...);
const reusedFetchData = reusePendingPromise(fetchData)
reusedFetchData() // fetch is made
reusedFetchData() // re-uses the promise returned by 1st fetch
reusedFetchData() // re-uses the promise returned by 1st fetch

// 10 seconds later, after the 1st fetch has resolved or rejected.
reusedFetchData() // fetch is made
// The function is called 4 times, but the only 2 fetches are made.
```
See the unit test for usage examples.
