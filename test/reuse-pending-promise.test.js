const reuse = require('../src');

describe('src/shared/universal/reuse-pending-promise', () => {
  const createFetchData = ({ success = true }) => () => {
    return success ? Promise.resolve() : Promise.reject();
  };

  it('reuses existing promises that are still pending', () => {
    const fetchData = createFetchData({ success: true });
    const reusedFetchData = reuse(fetchData);
    const promise1 = reusedFetchData();
    const promise2 = reusedFetchData();

    return Promise.all([promise1, promise2]).then(() => {
      expect(promise1).toBe(promise2);
    });
  });

  it('returns a new promise when the previous succeeded', () => {
    const fetchData = createFetchData({ success: true });
    const reusedFetchData = reuse(fetchData);
    const promise1 = reusedFetchData();
    return promise1.then(() => {
      const promise2 = reusedFetchData();
      expect(promise1).not.toBe(promise2);
    });
  });

  it('returns a new promise when the previous failed', () => {
    const fetchData = createFetchData({ success: false });
    const reusedFetchData = reuse(fetchData);
    const promise1 = reusedFetchData();
    return promise1.catch(() => {
      const promise2 = reusedFetchData().catch(() => {
        /* Prevent UnhandledPromiseRejectionWarning */
      });
      expect(promise1).not.toBe(promise2);
    });
  });

  it('uses first argument as a cache key by default', () => {
    const fetchData = createFetchData({ success: true });
    const reusedFetchData = reuse(fetchData);
    const promise1 = reusedFetchData('foo');
    const promise2 = reusedFetchData('bar');
    return Promise.all([promise1, promise2]).then(() => {
      expect(promise1).not.toBe(promise2);
    });
  });

  it('uses result of getKey as cache key if provided', () => {
    const fetchData = createFetchData({ success: true });
    const getCacheKey = ({ lang, region }) => `${lang}${region}`;
    const reusedFetchData = reuse(fetchData, getCacheKey);
    const promise1 = reusedFetchData({ lang: 'foo', region: 'bar' });
    const promise2 = reusedFetchData({ lang: 'baz', region: 'qux' });
    return Promise.all([promise1, promise2]).then(() => {
      expect(promise1).not.toBe(promise2);
    });
  });
});
