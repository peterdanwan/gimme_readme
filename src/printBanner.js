import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { version, author } = require('../package.json');

const printBanner = () => {
  console.log(
    `\x1b[34m********************** gimme_readme (version: ${version}) ***********************\x1b[0m`
  );
  console.log(`Author: ${author}`);
  console.log('Usage: gr [options] <file>');
  console.log('Options:');
  console.log('  -v, --version      Output the version number');
  console.log('  -t, --temperature  Change how deterministic response is (0-10)');
  console.log('  <file>             Source file to be explained');
  process.exit(1); // Exit with an error code
};

export default printBanner;
