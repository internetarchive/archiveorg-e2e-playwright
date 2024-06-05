const { execSync } = require('child_process');

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

const buildCommand = (options) => {
  let command = `CATEGORY=${options.category} npx playwright test`;

  if (options.category !== 'all') {
    command += ` tests/${options.category}`;
  }

  if (options.trace) {
    command += ' --trace on';
  }

  if (options.browser) {
    command += ` --project='Desktop - ${capitalizeFirstLetter(options.browser)}'`;
  }

  command += options.additionalArgs.map(arg => ` ${arg}`).join('');

  return command;
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

const parseArguments = (args) => {
  let category = 'all';
  let trace = false;
  let browser = '';
  const additionalArgs = [];

  args.forEach(arg => {
    if (arg.startsWith('--')) {
      additionalArgs.push(arg);
    } else if (arg === 'trace') {
      trace = true;
    } else if (['chromium', 'firefox', 'webkit'].includes(arg)) {
      browser = arg;
    } else {
      category = arg;
    }
  });

  return { category, browser, trace, additionalArgs };
}

const executeTests = ({ category, browser, trace, additionalArgs }) => {
  const options = { category, browser, trace, additionalArgs };
  const command = buildCommand(options);
  executeCommand(command);
}

const args = process.argv.slice(2);
const parsedArgs = parseArguments(args);
executeTests(parsedArgs);
