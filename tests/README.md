# Real Examples Tests

These tests are _Integration Tests_ that are used to check our code against real target websites.

To avoid _Too Many Requests_ block, we are saving the webpages snapshot by running the `yarn update-webpages-snapshot` command manually.

Then, we are running our code against the local snapshots.
