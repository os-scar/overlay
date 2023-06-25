import { test, Expect } from '../fixtures.js';
import { advisoriesCount, tooltipSourceSelector } from '../src/globals.js';

const stackOverflowLink = 'https://stackoverflow.com/questions/9023672/how-do-i-resolve-cannot-find-module-error-using-node-js';

test.describe('stackoverflow', () => {
  test('check for overlay and tooltip visibility and validate there are advisories loaded into the list', async ({ page }) => {
    await page.goto(stackOverflowLink, {
      waitUntil: 'domcontentloaded',
    });

    // check that overlay's tooltip is visible when hovering over a package name
    const moduleNameLink = page.locator('overlay-indicator[package-name="module_name"]');
    await moduleNameLink.scrollIntoViewIfNeeded();
    await moduleNameLink.hover();
    const overlayModuleName = page.locator('.overlay-tooltip__tooltip .overlay-indicator__tooltip[data-testid="module_name"]');
    await Expect(overlayModuleName).toBeVisible();

    // check that all advisories are shown in the tooltip's advisories list
    const advisories = overlayModuleName.locator(tooltipSourceSelector);
    await Expect(advisories).toHaveCount(advisoriesCount);
  });

  test('popup page', async ({ page, extensionId }) => {
    // find chrome extension popup
    await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
    const advisoroes = page.locator('main > div');
    await Expect(advisoroes).toHaveCount(advisoriesCount);

    // find snyk's checkbox and uncheck it
    const snykCheckbox = advisoroes.getByText('Show snyk').locator('input');
    await snykCheckbox.uncheck();

    // navigate to stackOverflow and find the tooltip
    await page.goto(stackOverflowLink, {
      waitUntil: 'domcontentloaded',
    });
    const moduleNameLink = page.locator('overlay-indicator[package-name="module_name"]');
    await moduleNameLink.scrollIntoViewIfNeeded();
    await moduleNameLink.hover();

    const overlayModuleName = page.locator('.overlay-tooltip__tooltip .overlay-indicator__tooltip[data-testid="module_name"]');
    const advisories = overlayModuleName.locator(tooltipSourceSelector);

    // check that snyk is not shown in the advisories list
    await Expect(advisories).toHaveCount(advisoriesCount - 1);
  });
});
