/**
 * @jest-environment node
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import cache, { forTests } from './cache';

const createPromise = (value) => new Promise((resolve) => setImmediate(() => resolve(value)));

describe('cache', () => {
  beforeEach(() => {
    forTests.clean();
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

    cache('my-key', fn);
    cache('my-key', fn);
    cache('my-key', fn);

    expect(fn).toBeCalledTimes(1);
  });

  it('should run the function again when TTL is expired', async () => {
    const ttl = 1;
    const fn = jest.fn().mockImplementation(() => console.log('fn called') || 22);

    cache('my-key', fn, ttl);
    expect(fn).toBeCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, ttl * 10));

    cache('my-key', fn);
    expect(fn).toBeCalledTimes(2);
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

  it('should remove the oldest TTLs', () => {
    const fn = jest.fn().mockReturnValue('value');

    cache('first', fn);

    for (let i = 0; i < 9999; i++) {
      cache(`key-${i}`, () => i);
    }

    cache('first', fn);
    expect(fn).toBeCalledTimes(2);
  });
});
