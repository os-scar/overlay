import { Expect, test } from '../fixtures.js';
import { packageReportTagName } from '../src/globals.js';
import { tooltipSourceSelector } from './selectors.js';

test.describe('pypi', () => {
  test('Package Report is visible in PyPI.org', async ({ page }) => {
    await page.goto('https://pypi.org/project/pandas/', {
      waitUntil: 'domcontentloaded',
    });

    const overlayPackageInfoComponent = page.locator(packageReportTagName);
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', 'pandas');
  });

  test('validating there are advisories loaded into the list', async ({ page }) => {
    await page.goto('https://pypi.org/project/pandas/', {
      waitUntil: 'domcontentloaded',
    });

    const overlayPackageInfoComponent = page.locator(packageReportTagName);
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', 'pandas');

    // check that overlay display 3 advisories in pypi - OpenSSF Scorecard, Snyk, and Debricked (currently Socket.dev not working)
    const overlayTooltipSources = page.locator(tooltipSourceSelector);
    await overlayTooltipSources.highlight();
    await Expect(overlayTooltipSources).toHaveCount(3);
  });
});
