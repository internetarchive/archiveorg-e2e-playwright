const { execSync } = require('child_process');

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

const buildCommand = (options) => {
  let command = `CATEGORY=${options.category} npx playwright test`;

  if (options.category !== 'all' && options.category !== 'grep') {
    command += ` tests/${options.category}`;
  }

  if (options.trace) {
    command += ' --trace on';
  }

  if (options.browser) {
    command += ` --project='Desktop - ${capitalizeFirstLetter(options.browser)}'`;
  }

  command += options.additionalArgs.map(arg => {
    return (arg.startsWith('-g')) ? ` ${arg} "${options.title}"` : ` ${arg}`;
  }).join(''); 

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
  let categories = [
    'about',
    'av',
    'books',
    'collection',
    'details',
    'donation',
    'home',
    'login',
    'music',
    'profile',
    'search'
  ];
  let trace = false;
  let browser = '';
  let category = '';
  let title = '';
  const additionalArgs = [];

  args.forEach(arg => {
    if(arg.startsWith('-g')) {
      additionalArgs.push(arg);
      category = 'grep';
    } else if (arg.startsWith('--')) {
      additionalArgs.push(arg);
    } else if (arg === 'trace') {
      trace = true;
    } else if (['chromium', 'firefox', 'webkit'].includes(arg)) {
      browser = arg;
    } else if (categories.includes(arg)){
      category = arg;
    } else {
      title = arg;
    }
  });

  return { category, browser, trace, title, additionalArgs };
}

const executeTests = ({ category, browser, trace, title, additionalArgs }) => {
  const options = { category, browser, trace, title, additionalArgs };
  const command = buildCommand(options);
  executeCommand(command);
}

const args = process.argv.slice(2);
const parsedArgs = parseArguments(args);
executeTests(parsedArgs);
