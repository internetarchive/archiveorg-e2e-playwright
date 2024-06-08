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

- Run tests by category:

    - This will run a custom script that can take different shell arguments/parameters for the following:
        > Note:
        >   - The arrangement/order for passing of arguments can be jumbled for flexibility
        >   - The script is somewhat patterned with the current Playwright commands that uses `--` convention
        >   - It's important to add `--` convention in CLI to separate the arguments from the `npm script` to be passed to the custom script
        
        - Test category (by folder structure):
            - It will run all tests if you didn't specify the test category you want to test
            - This can only execute 1 category in 1 command
            - Refer to the folder names in `tests` directory (`tests/*`), except for `tests/page-objects`
            - Sample parameters: `about, av, books, collection, details, donation, home, login, music, profile, search`
            - Sample execution:

                `npm run test about`

                `npm run test books`

                `npm run test donation`

                `npm run test profile`

        - Test execution mode:
            - The tests will run in headless mode by __default__ which will execute the tests in terminal only
            - Headed mode will spawn a browser window in the screen and execute the tests
            - Accepted parameters: `--headed`
            - Sample execution:

                `npm run test -- about --headed`

                `npm run test about -- --headed`

        - Test execution - [debug mode](https://playwright.dev/docs/running-tests#debug-tests-with-the-playwright-inspector):
            - This will spawn a browser window and Playwright Inspector window in the screen which will help on inspecting the whole test execution flow step by step
            - Accepted parameters: `--debug`
            - Sample execution:

                `npm run test -- about --debug`

                `npm run test about -- --debug`

        - Test execution - [UI mode](https://playwright.dev/docs/running-tests#debug-tests-in-ui-mode):
            - This will spawn a browser window and Playwright Inspector window in the screen which will help on inspecting the whole test execution flow step by step
            - Accepted parameters: `--ui`
            - Sample execution:

                `npm run test -- about --ui`

        - Test execution with [Trace viewer](https://playwright.dev/docs/trace-viewer) mode:
            - Trace viewer will record the test run which will be included in the Playwright report
            - It is disabled by default, you can enable it with the command below
            - Accepted parameters: `trace`
            - Sample execution:

                `npm run test about trace`

        - Test execution by browser:
            - Tests will run in all browsers by default if you didn't specify the browser
            - Accepted parameters: `chromium, firefox, webkit`
            - Sample execution:

                `npm run test about chromium`

                `npm run test about firefox -- --debug`

                `npm run test about webkit -- --headed`

        - Test execution by test title:
            - This command will grep for test title specified in `.spec.ts` test description
            - This param is annotated as `-g`; similar to how Playwright does it
            - Tests will run in all browsers by default if you didn't specify the browser
            - This can be combined with other commands if needed
            - Sample execution:

                `npm run test -- -g "TV has borrow button"`

                `npm run test -- -g "Canonical About page has correct title and text" chromium`

                `npm run test -- -g "Canonical About page has correct title and text" --debug`


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
