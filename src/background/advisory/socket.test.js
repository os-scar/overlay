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
      isBad: expect.any(Boolean),
      scores: {
        license: expectScore,
        maintenance: expectScore,
        quality: expectScore,
        supplyChainRisk: expectScore,
        vulnerability: expectScore,
      },
    });

    expect(res.isBad).toBe(Object.values(res.scores).some(({ level }) => level === 'BAD'));
  });

  it('should return scores between 0-100', async () => {
    const res = await socket({ type: 'npm', name: 'react' });

    Object.values(res.scores).forEach(({ score }) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it.skip('should not consider null score as bad', () => {});
});
