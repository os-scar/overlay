const _cache = {};

const buildNewKeys = (keys) =>
  keys.reduce((acc, currentKey) => {
    if (!acc[currentKey]) {
      acc[currentKey] = {};
    }
    return acc[currentKey];
  }, _cache);

export default (keys, action) => {
  const lastKey = typeof keys === 'string' ? keys : keys.pop();
  const objectForKey = typeof keys === 'string' ? _cache : buildNewKeys(keys);
  if (!objectForKey[lastKey]) objectForKey[lastKey] = action();
  return objectForKey[lastKey];
};
