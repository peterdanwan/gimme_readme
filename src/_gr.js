#!/usr/bin/env node

// src/_gr.js

import program from './commanderProgram.js';

// Option handlers
import handleConfigOption from './option_handlers/handleConfigOption.js';
import handleHelpOption from './option_handlers/handleHelpOption.js';
import handleFilesOption from './option_handlers/handleFilesOption.js';

// issue-31
import handleTOMLOption from './option_handlers/handleTOMLOption.js';
import normConfigCase from './option_handlers/handleConfigCase.js';

async function main() {
  // issue-31
  const TOML_CONFIG = handleTOMLOption();

  const args = process.argv;
  program.parse(args);

  const options = program.opts();

  // issue-31
  let mergeOptions = {
    ...TOML_CONFIG,
    ...options,
  };

  // perform normalize the case because the config can be upper or lower.
  // issue-31
  mergeOptions = normConfigCase(mergeOptions)


  if (args.length == 2) {
    handleHelpOption(program);
  }

  if (options.config) {
    handleConfigOption();
  }

  if (options.files) {
    //const files = options['files'];
    //await handleFilesOption(files, options);

    // issue-31
    const files = mergeOptions['files'];
    await handleFilesOption(files, mergeOptions);
  }
}

main();
