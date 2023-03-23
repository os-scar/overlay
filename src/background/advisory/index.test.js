import { describe, it, expect } from '@jest/globals';
import advisory from '.';

describe('advisory', () => {
  it(`should contain shared properties in each advisory`, async () => {
    const { info, ...advisories } = await advisory({ type: 'npm', name: 'react' });

    const { latest, licenses, stars } = await info;
    expect(latest).toEqual(expect.any(String));
    expect(licenses).toEqual(expect.any(Array));
    expect(stars).toEqual(expect.any(Number));

    for (const name in advisories) {
      const { issues, data } = await advisories[name];
      expect(issues).toEqual(expect.any(Number));
      expect(data).toEqual(expect.any(Object));
    }
  });
});
