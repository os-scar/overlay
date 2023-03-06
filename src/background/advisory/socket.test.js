import { describe, expect, it } from '@jest/globals';
import socket from './socket.js';

describe('socket', () => {
  it('should return details for package', async () => {
    const res = await socket({ type: 'npm', name: 'react' });

    const expectScore = expect.objectContaining({
      score: expect.any(Number),
      level: expect.stringMatching(/^GOOD|WARNING|BAD$/),
    });
    expect(res).toStrictEqual({
      issues: expect.any(Number),
      data: {
        license: expectScore,
        maintenance: expectScore,
        quality: expectScore,
        supplyChainRisk: expectScore,
        vulnerability: expectScore,
      },
    });

    expect(res.issues).toBe(Object.values(res.data).filter(({ level }) => level === 'BAD').length);
  });

  it('should return scores between 0-100', async () => {
    const res = await socket({ type: 'npm', name: 'react' });

    Object.values(res.data).forEach(({ score }) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it.skip('should not consider null score as bad', () => {});
});
