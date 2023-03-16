const _cache = {};

function cleanByTTL() {
  const now = Date.now();
  Object.keys(_cache).forEach((key) => {
    if (_cache[key].ttl && now > _cache[key].ttl) {
      delete _cache[key];
    }
  });
}

const cleanBySize = (size) => {
  const keys = Object.keys(_cache);
  if (keys.length > size) {
    keys
      .sort((a, b) => _cache[a].ttl - _cache[b].ttl)
      .slice(0, size)
      .forEach((key) => {
        delete _cache[key];
      });
  }
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
setInterval(() => {
  cleanByTTL();
  cleanBySize(1000);
}, MINUTE);

export default (keys, action, TTL = 15 * MINUTE) => {
  const key = typeof keys === 'string' ? keys : keys.join('.');
  if (!_cache[key])
    _cache[key] = {
      ttl: Date.now() + TTL,
      value: action(),
    };
  return _cache[key].value;
};

export const forTests = {
  cleanByTTL,
  cleanBySize,
};
