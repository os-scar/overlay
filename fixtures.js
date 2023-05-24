//This file is needed to use the tests with the extension installed and running
import { test as base, chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const test = base.extend({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, 'dist', 'chrome');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      // To run and debug the extension in head mode remove `--headless=new` from args
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
      // remove the comment below to slow down the tests
      // slowMo: 500
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const Expect = test.expect;
