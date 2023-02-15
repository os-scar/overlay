import { describe, expect, test } from '@jest/globals';
import openbase from './openbase.js';

describe('openbase', () => {
  test('should return details for package', async () => {
    const expectedBadgesCount = 5;
    const res = await openbase({ type: 'npm', name: 'react' });

    expect(res).toStrictEqual({
      isBad: expect.any(Boolean),
      starRating: expect.any(Number),
      starRatingCount: expect.any(Number),
      badges: expect.arrayContaining([
        {
          name: expect.any(String),
          urlSlug: expect.any(String),
          isPositive: expect.any(Boolean),
          voteCount: expect.any(Number),
        },
      ]),
    });

    expect(res.badges).toHaveLength(expectedBadgesCount);

    for (let i = 1; i < res.badges.length; i++) {
      const prev = res.badges[i - 1];
      const current = res.badges[i];
      expect(prev.voteCount).toBeGreaterThanOrEqual(current.voteCount);
    }
  });
});
