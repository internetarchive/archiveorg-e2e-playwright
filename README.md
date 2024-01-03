![Build Status](https://github.com/internetarchive/archiveorg-e2e-tests/actions/workflows/main.yml/badge.svg)

# End to end tests for Archive.org using [Playwright](https://playwright.dev/)

## (Optional) BrowserStack Local Setup

- login to BrowserStack and retrieve the account username and access key, see documentation [here](https://www.browserstack.com/docs/automate/playwright/getting-started/nodejs/test-runner)


## Running tests locally

- run command to install dependencies: `npm i`
- run command to install Playwright browser libs: `npx install playwright`
- run command to run all the tests: `npm run test`

## Running individual tests

- run books tests: `npm run test:books`
- run login tests: `npm run test:login`
- run music tests: `npm run test:music`
- run search tests: `npm run test:search`

## View tests execution result

- run: `npm run show:report`
