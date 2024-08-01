const { execSync } = require('child_process');

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

const buildCommand = (options) => {
  const { category, trace, headed, debug, ui, title, browser, platform } = options;

  let command = `CATEGORY=${category} npx playwright test`;

  if (category !== 'all' && category !== 'grep') {
    command += ` tests/${category}`;
  }

  if (trace) command += ' --trace on';
  if (headed) command += ' --headed';
  if (debug) command += ' --debug';
  if (ui) command += ' --ui';
  if (title) command += ` -g "${title}"`;
  if (browser) {
    const capitalizedBrowser = capitalizeFirstLetter(browser);
    const capitalizedPlatform = capitalizeFirstLetter(platform);
    command += ` --project='${capitalizedPlatform} - ${capitalizedBrowser}'`;
  }

  return command;
}

const parseArguments = (args) => {
  const validCategories = ['about', 'av', 'books', 'collection', 'details', 'donation', 'home', 'login', 'music', 'profile', 'search'];
  const validBrowserDevices = ['chromium', 'firefox', 'webkit'];
  const validPlatforms = ['mobile', 'desktop'];

  const { test: testCategory, browser, title, headed, trace, debug, ui, device } = args;

  let category = testCategory && validCategories.includes(testCategory) ? testCategory : 'all';
  let selectedBrowser = validBrowserDevices.includes(browser) ? browser : '';
  let platform = validPlatforms.includes(device) ? device : 'desktop';

  if (title) category = 'grep';

  return {
    category,
    browser: selectedBrowser,
    title,
    headed: !!headed,
    trace: !!trace,
    debug: !!debug,
    ui: !!ui,
    platform
  };
}

const executeCommand = (command) => {
  try {
    console.log(`Executing command: ${command}`);
    const output = execSync(command, { stdio: 'inherit' });
    if (output !== null) {
      console.log(output.toString());
    }
  } catch (error) {
    console.error('Error:', error.stderr ? error.stderr.toString() : error.toString());
    process.exit(1);
  }
}

const executeTests = (options) => {
  executeCommand(buildCommand(options));
}

const args = require('minimist')(process.argv.slice(2));
const parsedArgs = parseArguments(args);
executeTests(parsedArgs);
