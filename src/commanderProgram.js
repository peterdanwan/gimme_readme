// src/commanderProgram.js

// Lets us use commonjs require syntax for older modules
import { createRequire } from 'module';
import chalk from 'chalk';
import modelsString from './ai_models/index.js';

const require = createRequire(import.meta.url);
const { name, version, description } = require('../package.json');

// Reference: https://github.com/tj/commander.js
const { Command } = require('commander');
const program = new Command();

// Custom Banner
program.addHelpText(
  'beforeAll',
  chalk.blue(`********************** gimme_readme (version: ${version}) ***********************`)
);

// Colourized Description using ANSI escape codes
const colourizedDescription = description.replace('gimme_readme', chalk.blue('gimme_readme'));

// Metadata
program.name(name);
program.description(colourizedDescription);
program.version(
  `${chalk.blue('gimme_readme')}: ${version}`,
  '-v, --version',
  'output the current version'
);

// Options
program.option('-f, --files [files...]', 'specify the files you wish to get explanations for');
program.option('-o, --outputFile <string>', 'specify the file you wish to output to');
program.option(
  '-m, --model <string>',
  `specify which free-tier model you'd want to use \ne.g., ${modelsString}`
);
program.option('-p, --prompt <string>', 'specify a custom prompt');
program.option('-pf, --promptFile <string>', 'specify a prompt file');
program.option(
  '-c, --config',
  "makes a .gimme_readme_config file if it doesn't exist and/or shows the location of this config file"
);
program.option(
  '-t, --temperature <number>',
  'specify how deterministic you want your AI to be (values should be between 0 to 1)'
);
program.option(
  '-tkn, --token',
  'get information on the tokens consumed (i.e., prompt, completion, & total tokens)'
);

// Exports the configured program
export default program;
