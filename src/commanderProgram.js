// src/commanderProgram.js

// Lets us use commonjs require syntax for older modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name, version, description } = require('../package.json');

// Reference: https://github.com/tj/commander.js
const { Command } = require('commander');
const program = new Command();

// Custom Banner
program.addHelpText(
  'beforeAll',
  `\x1b[34m********************** gimme_readme (version: ${version}) ***********************\x1b[0m`
);

// Colourized Description using ANSI escape codes
const colourizedDescription = description.replace('gimme_readme', '\x1b[34mgimme_readme\x1b[0m');

// Metadata
program.name(name);
program.description(colourizedDescription);
program.version(
  `\x1b[34mgimme_readme\x1b[0m: ${version}`,
  '-v, --version',
  'output the current version'
);

// Options
program.option('-f, --file [files...]', 'specify the files you wish to get explanations for');
program.option('-o, --outputFile <string>', 'specify the file you wish to output to');
program.option(
  '-m, --model <string>',
  "specify which free-tier model you'd want to use (e.g., gemini, openai, grok)"
);
program.option('-p, --prompt <string>', 'specify a custom prompt');

// Exports the configured program
export default program;
