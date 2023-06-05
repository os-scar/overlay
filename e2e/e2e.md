# End-to-End Testing with Playwright

## Creating a test

1. Go to the right e2e file and add a test with specific name.
2. create the test with minimal overhead (fewer locators, fewer API calls, etc).

## Run and Debug a test

1. download the [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension.
2. You will see a small green play button near the test you created or want to run.
3. If the test failed you need to debug it.
4. Go to the fixtures file and remove the `--headless=new` from args (this will run the test on a browser on your computer), you can also uncomment the `slowMo` for seeing each step.
5. Run in your terminal `yarn e2e:debug`. It will open a Playwright modal with a browser so you can see and debug each step.
6. Fix the problems and run also in headless mode (undo step 4)

## Problems?

Ask around, and check the [Playwright docs](https://playwright.dev/docs/intro).
Found an issue? Did we miss a case?
You're welcome to open an issue or talk with us on [Discord](https://discord.gg/H2SMbzh5).
