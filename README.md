![Build Status](https://github.com/internetarchive/archiveorg-e2e-tests/actions/workflows/main.yml/badge.svg)

# End to end tests for Archive.org using [Playwright](https://playwright.dev/)

## (Optional) BrowserStack Local Setup

- login to BrowserStack and retrieve the account username and access key, see documentation [here](https://www.browserstack.com/docs/automate/playwright/getting-started/nodejs/test-runner)


## Running tests locally

- run command to install dependencies: `npm i`
- run command to install Playwright browser libs: `npx install playwright`
- run command to run all the tests: `npm run test`


## Running individual tests by category

- run books tests: `npm run test:books`
- run login tests: `npm run test:login`
- run music tests: `npm run test:music`
- run search tests: `npm run test:search`


## Running tests using VSCode Playwright plugin

- install [VSCode Playwright plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) to run specific tests using VSCode

## Running specific test spec by file:

- run command format: `npx playwright test <test-file-path>`
- sample: `npx playwright test tests/search/search-layout.spec.ts`


## Running specific test spec by file in debug mode:

- run command format: `npx playwright test <test-file-path> --debug`
- sample: `npx playwright test tests/search/search-layout.spec.ts --debug`


## View tests execution result

- run: `npm run show:report`


## Reference guide for writing tests

- https://playwright.dev/docs/pom
- https://ray.run/blog/mastering-poms
