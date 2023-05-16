import { test, Expect } from '../fixtures.js';

test.describe('npm', () => {
  test('check for overlay and tooltip', async ({ page }) => {
    await page.goto('https://stackoverflow.com/questions/9023672/how-do-i-resolve-cannot-find-module-error-using-node-js', {
      waitUntil: 'domcontentloaded',
    });
    const moduleNameLink = page.locator('overlay-indicator[overlay-indicator-package-name=module_name]');
    await moduleNameLink.scrollIntoViewIfNeeded();
    await moduleNameLink.hover();
    const overlayModuleName = page.locator('.overlay-tooltip__tooltip#module_name');
    await Expect(overlayModuleName).toBeVisible();
  });
});
