![Build Status](https://github.com/internetarchive/archiveorg-e2e-tests/actions/workflows/main.yml/badge.svg)

# End to end tests for Archive.org using [Playwright](https://playwright.dev/)


## (Optional) BrowserStack Local Setup

- Login to BrowserStack and retrieve the account username and access key, see documentation [here](https://www.browserstack.com/docs/automate/playwright/getting-started/nodejs/test-runner)


## Local Setup

- Install dependencies:

    `npm i`

- Install Playwright browser libs:

    `npx playwright install`

- Create a `.env` file by copying the contents from `.env.sample` and add the respective values you want to use for testing

    - this is required to run tests with loggedIn flows


## Running tests

- Run all tests: `npm run test`

- Run test by category (sample):

    - This will run a custom script that can take different shell arguments/parameters for the following (arguments arrangement can be jumbled or not in proper order):
        
        - test category (by folder structure): 
            - `about, av, books, collection, details, donation, etc...`
            - default value: `all`

        - test execution mode: 
            - `headless/headed`
            - default value: `headless`

        - browser: 
            - `chromium, firefox, webkit`
            - default value: `chromium`

    - Sample:

        - run all "books" tests in headless mode: `npm run test books`
        - run all "about" tests in headed mode webkit browser: `npm run test about headed webkit`


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
