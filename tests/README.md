# Real Examples Tests

These tests are _Integration Tests_ that are used to check our code against real target websites.

To avoid _Too Many Requests_ block, we are saving the webpages snapshot by running the `yarn update-webpages-snapshot` command manually.

Then, we are running our code against the local snapshots.

# Manual Test Script

## What we testing

- The extension is able to detect the packages in the page
- The page contacting with the background script
- The background script is able to fetch the advisories from the API
- The popup is working correctly
- Changes in the popup affect the indicator immediately

## Prerequisites

- Install the extension on _Chrome_ and _Firefox_ browsers
- Have a test page ready (e.g. https://stackoverflow.com/questions/33527653)

## Steps

1. Open the test page on both browsers
2. Verify that the indicator appears on the packages in the page and shows the number of issues
3. Click on the extension logo to open his popup
4. Verify that the popup shows the details of the advisories and has a toggle button to enable or disable them
5. Click on the toggle button to disable the advisories
6. Verify that the indicator updates and shows zero issues
7. Refresh the page and verify that the indicator is still zero
