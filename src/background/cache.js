import LRUCache from 'lru-cache';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const _cache = new LRUCache({
  max: 500,
  ttl: 15 * MINUTE,
});

export default (keys, action, ttl) => {
  const key = typeof keys === 'string' ? keys : keys.join('.');
  if (!_cache.get(key)) _cache.set(key, action(), { ttl });
  return _cache.get(key);
};

export const forTests = {
  clean: () => _cache.clear(),
};
