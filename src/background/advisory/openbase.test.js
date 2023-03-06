import { describe, expect, test } from '@jest/globals';
import openbase from './openbase.js';

describe('openbase', () => {
  test('should return details for package', async () => {
    const expectedBadgesCount = 5;
    const res = await openbase({ type: 'npm', name: 'react' });

    expect(res).toStrictEqual({
      issues: expect.any(Number),
      data: {
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
      },
    });

    const badges = res.data.badges;
    expect(badges).toHaveLength(expectedBadgesCount);

    for (let i = 1; i < badges.length; i++) {
      const prev = badges[i - 1];
      const current = badges[i];
      expect(prev.voteCount).toBeGreaterThanOrEqual(current.voteCount);
    }
  });
});
