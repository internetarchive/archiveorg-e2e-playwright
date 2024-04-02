![Build Status](https://github.com/internetarchive/archiveorg-e2e-tests/actions/workflows/main.yml/badge.svg)

# End to end tests for Archive.org using [Playwright](https://playwright.dev/)

## (Optional) BrowserStack Local Setup

- login to BrowserStack and retrieve the account username and access key, see documentation [here](https://www.browserstack.com/docs/automate/playwright/getting-started/nodejs/test-runner)


## Running tests locally

- install dependencies:

    `npm i`

- install Playwright browser libs:

    `npx playwright install`

- run all the tests in headless mode and generate 1 whole test report: 
    
    `npm run test`

- run all the tests in headless mode by each category and generate test report by category:

    `./run-tests.sh`

- run all the tests in headed mode (this will load multiple browsers):

    `npm run test:headed`

- create a `.env` file by copying the contents from `.env.sample` and add the respective values you want to use for testing 


## Running individual tests by category (headless mode)

- run about tests: `npm run test:about`
- run books tests: `npm run test:books`
- run collection tests: `npm run test:collection`
- run details tests: `npm run test:details`
- run home tests: `npm run test:home`
- run login tests: `npm run test:login`
- run music tests: `npm run test:music`
- run search tests: `npm run test:search`


## Running individual tests by category (headed mode)

- run about tests: `npm run test:about:headed`
- run books tests: `npm run test:books:headed`
- run collection tests: `npm run test:collection:headed`
- run details tests: `npm run test:details:headed`
- run home tests: `npm run test:home:headed`
- run login tests: `npm run test:login:headed`
- run music tests: `npm run test:music:headed`
- run search tests: `npm run test:search:headed`


## Running tests using VSCode Playwright plugin

- install [VSCode Playwright plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) to run specific tests using VSCode


## Running specific test spec by file:

- run command format: `npx playwright test <test-file-path>`
- sample: `npx playwright test tests/search/search-layout.spec.ts`
- headed: `npx playwright test tests/search/search-layout.spec.ts --headed`


## Running specific test spec by file in debug mode:

- run command format: `npx playwright test <test-file-path> --debug`
- sample: `npx playwright test tests/search/search-layout.spec.ts --debug`


## View tests execution result

- run: `npm run show:report`


## Reference guide for writing tests

- https://playwright.dev/docs/pom
- https://ray.run/blog/mastering-poms
