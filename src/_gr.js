#!/usr/bin/env node

// src/_gr.js
import program from './commanderProgram.js';

// Option handlers
import handleConfigOption from './option_handlers/handleConfigOption.js';
import handleHelpOption from './option_handlers/handleHelpOption.js';
import handleFilesOption from './option_handlers/handleFilesOption.js';
import handleNoFilesOption from './option_handlers/handleNoFilesOption.js';

async function main() {
  const args = process.argv;
  program.parse(args);

  const options = program.opts();

  if (args.length == 2) {
    handleHelpOption(program);
  }

  if (options.config) {
    handleConfigOption();
  }

  if (options.files) {
    const files = options['files'];
    await handleFilesOption(files, options);
  } else {
    await handleNoFilesOption(options);
  }
}

main();
