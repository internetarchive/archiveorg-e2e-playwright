const { execSync } = require('child_process');

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

function runTest(category = 'all', headed = false, browser = 'chromium') {
  // Construct the npm run test command based on parameters
  let command = `CATEGORY=${category} npx playwright test`;

  if (category !== 'all') {
    command += ` tests/${category}`;
  }

  if (headed) {
    command += ` --headed`;
  }

  if (browser !== 'chromium') {
    command += ` --project='Desktop - ${capitalizeFirstLetter(browser)}'`;
  }

  // Execute the command
  try {
    console.log(`Executing command: ${command}`);
    const output = execSync(command, { stdio: 'inherit' });
    if (output !== null) {
      console.log(output.toString());
    }
  } catch (error) {
    console.log('error: ', error);
    console.error(error.stderr ? error.stderr.toString() : error.toString());
    process.exit(1);
  }
}

// Extract parameters from command line arguments
const args = process.argv.slice(2);
let category = 'all';
let headed = false;
let browser = 'chromium';

// Iterate through arguments to parse them
args.forEach(arg => {
  if (arg === 'headed') {
    headed = true;
  } else if (arg === 'chromium' || arg === 'firefox' || arg === 'webkit') {
    browser = arg;
  } else {
    category = arg;
  }
});

try {
  runTest(category, headed, browser);
} catch (error) {
  console.log('error: ', error);
  console.error(error.stderr ? error.stderr.toString() : error.toString());
  process.exit(1);
}
