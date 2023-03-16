/**
 * @jest-environment node
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import cache, { forTests } from './cache';
const { cleanBySize, cleanByTTL } = forTests;

const createPromise = (value) => new Promise((resolve) => setImmediate(() => resolve(value)));

describe('cache', () => {
  beforeEach(() => {
    cleanBySize(0);
  });

  it('should support one key without array', () => {
    const expected = 15;
    const actual = cache('key', () => expected);
    expect(actual).toBe(expected);
  });

  it('should support one key in array', () => {
    const expected = 51;
    const actual = cache(['keys'], () => expected);
    expect(actual).toBe(expected);
  });

  it('should save the value for one key', async () => {
    const expected = 1;
    const another = 2;

    cache(['expected-key'], () => createPromise(expected));
    cache(['another-key'], () => createPromise(another));

    const actual = await cache(['expected-key']);

    expect(actual).toBe(expected);
  });

  it('should run cached function only once', async () => {
    const fn = jest.fn().mockReturnValue(22);

    await Promise.all([cache('my-key', fn), cache('my-key', fn), cache('my-key', fn)]);

    expect(fn).toBeCalledTimes(1);
  });

  it('should save the value for multiple keys', async () => {
    const expected = 33;

    cache(['a', 'b', 'c'], () => expected);
    cache(['hi'], () => 2);
    cache(['a', 'b', 'd'], () => 2);

    const actual = cache(['a', 'b', 'c']);

    expect(actual).toBe(expected);
  });

  it('should return undefined when key is sub-array', async () => {
    cache(['e', 'f', 'g'], () => 2);
    cache(['hi'], () => 2);
    cache(['e', 'f', 'h'], () => 2);

    expect(cache(['e', 'f'], () => {})).toBeUndefined();
  });

  describe('cleaning', () => {
    it('should remove expired keys by TTL', () => {
      const expired = -1;
      const notExpired = 1000 * 60 * 5;

      cache(['expired'], () => 1, expired);
      cache(['not-expired'], () => 2, notExpired);

      cleanByTTL();

      expect(cache(['expired'], () => {})).toBeUndefined();
      expect(cache(['not-expired'], () => {})).toBe(2);
    });

    it('should remove the oldest TTLs', () => {
      cache(['a'], () => 1, 1200);
      cache(['b'], () => 2, 1100);
      cache(['c'], () => 3, 1000);
      cache(['d'], () => 4, 900);

      cleanBySize(2);

      expect(cache(['a'], () => {})).toBe(1);
      expect(cache(['b'], () => {})).toBe(2);

      expect(cache(['c'], () => {})).toBeUndefined();
      expect(cache(['d'], () => {})).toBeUndefined();
    });
  });
});
