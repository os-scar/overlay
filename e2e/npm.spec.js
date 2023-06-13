import { test, Expect } from '../fixtures.js';

test.describe('npm', () => {
  test('check for overlay and tooltip', async ({ page }) => {
    await page.goto('https://stackoverflow.com/questions/9023672/how-do-i-resolve-cannot-find-module-error-using-node-js', {
      waitUntil: 'domcontentloaded',
    });
    const moduleNameLink = page.locator('overlay-indicator[package-name="module_name"]');
    await moduleNameLink.scrollIntoViewIfNeeded();
    await moduleNameLink.hover();
    const overlayModuleName = page.locator('.overlay-tooltip__tooltip .overlay-indicator__tooltip[data-testid="module_name"]');
    await Expect(overlayModuleName).toBeVisible();
  });

  test('detect url change when using the searh bar in npmjs.com', async ({ page }) => {
    let packageName = '@ngneat/spectator';
    const url = `https://www.npmjs.com/package/${packageName}`;

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    // get the package name from overlay popup
    let overlayPackageInfoComponent = page.locator('overlay-package-report');
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', packageName);

    // use the search bar to find the @angular/cli package
    packageName = `@angular/cli`;
    const searchBar = page.locator('[name=q]');
    await searchBar.fill(packageName);

    // find the list item that links to the desired package
    const getSearchResultInDropDown = page.locator(`li[aria-label="${packageName}"]`);
    await getSearchResultInDropDown.click();

    // check that overlay's title has changed to @angular/cli
    overlayPackageInfoComponent = page.locator('overlay-package-report');
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', packageName);
  });
});
