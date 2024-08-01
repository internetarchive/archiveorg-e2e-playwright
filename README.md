![Build Status](https://github.com/internetarchive/archiveorg-e2e-tests/actions/workflows/main.yml/badge.svg)

# End to end tests for Archive.org using [Playwright](https://playwright.dev/)


## (Optional) BrowserStack Local Setup

- Login to BrowserStack and retrieve the account username and access key, see documentation [here](https://www.browserstack.com/docs/automate/playwright/getting-started/nodejs/test-runner)


## Local Setup

- Install dependencies:

    ```bash
    npm i
    ```

- Install Playwright browser libs:

    ```bash
    npx playwright install
    ```

- Create a `.env` file by copying the contents from `.env.sample` and add the respective values you want to use for testing. This is required to run tests with loggedIn flows


## Run all tests

- Run command:

    ```bash
    npm run test
    ```


## Running Tests with Custom Parameters

- To run a custom script with flexible shell script arguments/parameters, follow these steps:

    1. **Command Structure:**
        - Ensure to use the `--` convention after the npm command to separate npm-specific arguments from those intended for the Node.js script
        - Without `--`, arguments may not pass correctly to the script

    2. **Flexibility in Argument Order:**
        - You can pass script arguments in any order to suit your needs for flexibility and customization


    ### Test Category (by Folder Structure)

    - Running tests from specific categories in the `tests` directory (except `tests/page-objects`):
    - If no category is specified, all tests will run by default.
    - Parameter: `--test`
    - Example usage:
        ```bash
        npm run test -- --test=about
        npm run test -- --test=books
        npm run test -- --test=donation
        npm run test -- --test=profile
        ```

    ### Test Execution Modes

    - **Headed Mode:**
        - Executes tests with a browser window visible on screen.
        - Parameter: `--headed`
        - Example usage:
            ```bash
            npm run test -- --test=about --headed
            npm run test -- --headed --test=about
            ```

    - **Debug Mode:**
        - Executes tests with Playwright Inspector for step-by-step debugging.
        - Parameter: `--debug`
        - Example usage:
            ```bash
            npm run test -- --test=about --debug
            npm run test -- --debug --test=books
            ```

    - **UI Mode:**
        - Executes tests with Playwright Inspector for UI-based debugging.
        - Parameter: `--ui`
        - Example usage:
            ```bash
            npm run test -- --test=about --ui
            ```

    - **Trace Viewer Mode:**
        - Records test runs for inclusion in the Playwright report.
        - Parameter: `--trace`
        - Example usage:
            ```bash
            npm run test -- --test=about --trace
            ```

    ### Test Execution by Browser

    - Running tests in specific browsers:
    - By default, tests run in all available browsers.
    - Parameter: `--browser`
    - Accepted parameters: `chromium`, `firefox`, `webkit`
    - Example usage:
        ```bash
        npm run test -- --test=about --browser=chromium
        npm run test -- --test=about --browser=firefox --debug
        npm run test -- --test=about --browser=webkit --headed
        ```

    ### Test Execution by Test Title

    - Running tests matching specific test case titles:
    - Searches for test titles within `.spec.ts` files.
    - Parameter: `--title`
    - Example usage:
        ```bash
        npm run test -- --title="TV has borrow button"
        npm run test -- --title="Canonical About page has correct title and text" --browser=chromium
        npm run test -- --title="Canonical About page has correct title and text" --debug
        ```

    ### Use helper function to generate custom test commands

    - To generate and execute custom test commands using the `generateCommand.js` script, follow these steps:

    - **Setup script configuration:**
        - Ensure you have `generateCommand.js` configured with the desired parameters (`test`, `browser`, `title`, `headed`, `trace`, `debug`, `ui`, `device`)
    
        - Adjust these parameters as needed for your specific testing scenarios

        Example configuration:
        ```javascript
        const sampleArgs = {
            test: 'books',
            browser: 'chromium', // Options: 'chromium', 'firefox', 'webkit'; default: all browsers
            title: '', // Specify a test case title within ""
            headed: false, // Set to true for headed mode
            trace: false, // Set to true to enable trace mode
            debug: false, // Set to true to enable debug mode
            ui: true, // Set to true to enable UI mode
            device: '' // Options: 'mobile', 'desktop'; default: desktop
        };
        ```

    - **Generating custom test command:**

        - Run the script to generate a command string that includes the specified parameters:

            ```bash
            npm run generate-command
            ```

        - This will output a generated command that can be used to execute specific tests based on your configuration:

            ```bash
            ➜ npm run generate:command

            > iaux-e2e-playwright-tests@1.0.0 generate:command
            > node scripts/generateCommand.js

            Generated command: npm run test -- --test=books --browser=chromium --ui
            ```

        - Copy the generated command and execute it in your terminal to run tests with the specified configurations


## Running tests using VSCode Playwright plugin

- install [VSCode Playwright plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) to run specific tests using VSCode


## Running specific test spec by file:

- Command format: `npx playwright test <test-file-path>`

- Sample (headless): 
    ```bash
    npx playwright test tests/search/search-layout.spec.ts
    ```

- Sample (headed): 
    ```bash
    npx playwright test tests/search/search-layout.spec.ts --headed
    ```

## Running specific test spec by file in debug mode:

- Command format: `npx playwright test <test-file-path> --debug`

- Sample: 
    ```bash
    npx playwright test tests/search/search-layout.spec.ts --debug
    ```


## Running specific test case title:

- Command format: `npx playwright test -g "<test-case-title>"`

- Sample: 
    ```bash
    npx playwright test -g "TV has borrow button"
    ```


## View tests execution result

- Run command: 
    
    ```bash
    npm run show:report
    ```


## Reference guide for writing tests

- https://playwright.dev/docs/pom
- https://ray.run/blog/mastering-poms
