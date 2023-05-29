# End-to-End Testing with Playwright

## Creating a test

1. Go to the right e2e file and add a test with specific name.
2. create the test with minimal overhead(less locators, less API calls etc.).

## Run and Debug a test

1. download playwright test for vscode extension
2. You will see a small green play button near the test you created or want to run.
3. If the test failed you need to debug it.
4. Go to the fixtures file and remove the --headless=new from args(this will run the test on a browser in your computer), you can also uncomment the slowMo for seeing each step.
5. run in your terminal yarn e2e:debug it will open a playwright modal with a browser so you can see and debug each step.
6. fix the problems and run also in headless mode(undo step 4)

## Problems?

Ask around, check the Playwright docs.
https://playwright.dev/docs/intro

Found an issue? Did we miss a case?

talk to us https://github.com/os-scar/overlay/
