import { describe, expect, it } from '@jest/globals';
import debricked from './debricked.js';

describe('debricked', () => {
  it('should return details for package', async () => {
    const res = await debricked({ type: 'npm', name: 'react' });

    expect(res).toStrictEqual({
      issues: expect.any(Number),
      reportUrl: expect.any(String),
      summary: expect.any(String),
      data: {
        Contributors: {
          description: expect.any(String),
          score: expect.any(Number),
          level: expect.stringMatching(/^BAD|WARNING|GOOD$/),
        },
        Popularity: {
          description: expect.any(String),
          score: expect.any(Number),
          level: expect.stringMatching(/^BAD|WARNING|GOOD$/),
        },
        Security: {
          description: expect.any(String),
          score: expect.any(Number),
          level: expect.stringMatching(/^BAD|WARNING|GOOD$/),
        },
      },
    });
  });
});
