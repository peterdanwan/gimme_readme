#!/usr/bin/env node

// src/_gr.js

import program from './commanderProgram.js';

// Option handlers
import handleConfigOption from './option_handlers/handleConfigOption.js';
import handleHelpOption from './option_handlers/handleHelpOption.js';
import handleFilesOption from './option_handlers/handleFilesOption.js';
import handleTOMLOption from './option_handlers/handleTOMLOption.js';

async function main() {

  const TOML_CONFIG = handleTOMLOption()

  const args = process.argv;
  program.parse(args);

  const options = program.opts();

  const mergeOptions = {
    ...TOML_CONFIG,
    ...options
  }
  console.log(mergeOptions)

  if (args.length == 2) {
    handleHelpOption(program);
  }

  if (options.config) {
    handleConfigOption();
  }

  if (options.files) {
    //const files = options['files'];
    //await handleFilesOption(files, options);

    const files = mergeOptions['files'];
    await handleFilesOption(files, mergeOptions)
  }
}

main();
