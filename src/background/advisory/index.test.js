import { describe, it, expect } from '@jest/globals';
import advisory from '.';

describe('advisory', () => {
  it(`should contain shared properties in each advisory`, async () => {
    const results = await advisory({ type: 'npm', name: 'react' });

    Object.entries(results).forEach(([_name, advisor]) => {
      expect(advisor).toEqual(
        expect.objectContaining({
          issues: expect.any(Number),
          data: expect.any(Object),
        })
      );
    });
  });
});
