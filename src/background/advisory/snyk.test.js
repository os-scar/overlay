import { describe, expect, test } from '@jest/globals';
import snyk from './snyk.js';

describe('snyk', () => {
  test('should return details for package', async () => {
    const res = await snyk({ type: 'npm', name: 'react' });

    expect(res).toStrictEqual({
      issues: expect.any(Number),
      data: {
        score: expect.any(Number),
        maxScore: 100,
        level: expect.stringMatching(/^GOOD|WARNING|BAD$/),
        badges: {
          security: {
            level: expect.stringMatching(/^GOOD|WARNING|BAD$/),
            description: 'No known security issues',
          },
          popularity: {
            level: expect.stringMatching(/^GOOD|WARNING|BAD$/),
            description: 'Key ecosystem project',
          },
          maintenance: {
            level: expect.stringMatching(/^GOOD|WARNING|BAD$/),
            description: 'Sustainable',
          },
          community: {
            level: expect.stringMatching(/^GOOD|WARNING|BAD$/),
            description: 'Active',
          },
        },
      },
    });
  });
});
