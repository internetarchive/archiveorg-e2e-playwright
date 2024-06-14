const generateCommand = (args) => {
  // Format the arguments into a command string
  const commandArgs = Object.entries(args)
    .filter(([_, value]) => {
      // Remove blank arguments
      if (value === '' || value === undefined || value === false) {
        return false;
      }
      return true;
    })
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? `--${key}` : '';
      } else {
        // If the argument is a title, surround it with ""
        if (key === 'title') {
          return `--${key}="${value}"`;
        } else {
          return `--${key}=${value}`;
        }
      }
    })
    .join(' '); // Join the arguments with a space

  // Return the formatted command
  return `npm run execute -- ${commandArgs}`;
};

/**
 * Test category options: 'about', 'av', 'books', 'collection', 'details', 'donation', 'home', 'login', 'music', 'profile', 'search'
 * Browser options: 'chromium', 'firefox', 'webkit'
 * Device options: 'mobile', 'desktop'
 * Title: '<test case title description; see *.spec.ts files to get the titles>'
 */
const sampleArgs = {
  test: 'books',
  browser: 'chromium', // default/blank: all browsers
  title: '',
  headed: false,
  trace: false,
  debug: false,
  ui: true,
  device: '' // default/blank: desktop
};

const sampleCommand = generateCommand(sampleArgs);
console.log('Generated command:', sampleCommand);
