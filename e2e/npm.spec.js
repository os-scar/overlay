import { Expect, test } from '../fixtures.js';
import { packageReportTagName } from '../src/globals.js';

test.describe('npm', () => {
  test('Package Report is visible in npmjs.com', async ({ page }) => {
    const packageName = '@ngneat/spectator';

    const url = `https://www.npmjs.com/package/${packageName}`;

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    // get the package name from overlay popup
    const overlayPackageInfoComponent = page.locator(packageReportTagName);
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', packageName);
  });

  test('detect url change when using the searh bar in npmjs.com/package', async ({ page }) => {
    let packageName = '@ngneat/spectator';
    const url = `https://www.npmjs.com/package/${packageName}`;

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    // get the package name from overlay popup
    let overlayPackageInfoComponent = page.locator(packageReportTagName);
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', packageName);

    // use the search bar to find the @angular/cli package
    packageName = `@angular/cli`;
    const searchBar = page.locator('[name=q]');
    await searchBar.fill(packageName);

    // find the list item that links to the desired package
    const getSearchResultInDropDown = page.locator(`li[aria-label="${packageName}"]`);
    await getSearchResultInDropDown.click();

    // check that overlay's title has changed to @angular/cli
    overlayPackageInfoComponent = page.locator(packageReportTagName);
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', packageName);
  });

  test('detect url change when using the searh bar in npmjs.com', async ({ page }) => {
    const packageName = '@ngneat/spectator';
    const baseURL = `https://www.npmjs.com/`;

    await page.goto(baseURL, {
      waitUntil: 'domcontentloaded',
    });

    // use the search bar to find the@ngneat/spectator
    const searchBar = page.locator('[name=q]');
    await searchBar.fill(packageName);

    // find the list item that links to the desired package
    const getSearchResultInDropDown = page.locator(`li[aria-label="${packageName}"]`);
    await getSearchResultInDropDown.click();

    // check that overlay's title is "@ngneat/spectator"
    const overlayPackageInfoComponent = page.locator(packageReportTagName);
    await Expect(overlayPackageInfoComponent).toHaveAttribute('package-name', packageName);
  });
});
