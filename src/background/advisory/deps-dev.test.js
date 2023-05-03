import { describe, expect, test } from '@jest/globals';
import depsDev from './deps-dev.js';

describe('deps-dev', () => {
  test('should find exact version', async () => {
    const res = await depsDev({ type: 'npm', name: 'react' });

    expect(res).toStrictEqual({
      issues: expect.any(Number),
      reportUrl: expect.any(String),
      summary: expect.any(String),
      data: {
        latestVersion: '18.2.0',
        repo: 'https://github.com/facebook/react',
        scorecard: {
          score: 6.1,
          metrics: expect.objectContaining({
            'Binary-Artifacts': 10,
          }),
        },
        licenses: ['MIT'],
        stars: expect.any(Number),
      },
    });
  });
});
