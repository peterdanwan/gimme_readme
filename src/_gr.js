#!/usr/bin/env node

// src/_gr.js

import program from './commanderProgram.js';
import getFileContent from './getFileContent.js';
import promptAI from './ai.js';

async function main() {
  const args = process.argv;

  program.parse(args);

  const options = program.opts();

  if (args.length == 2) {
    // Prints general usage of tool (not all sub-commands and their options are shown)
    console.log(program.help());
  }

  if (options.file) {
    const files = options['file'];

    let prompt =
      'Take the following code and produce a README.md style response based on each file sent that explains the code (please have code snippets with comments):\n\n';

    const modelFlag = options.model || null;
    const outputFlag = options.output || null;

    for (const file of files) {
      console.log('Sending file: ');
      console.log(file);
      console.log('\n');

      const content = getFileContent(file, modelFlag, outputFlag);

      if (content) {
        prompt += content + '\n\n';
      }

      // perhaps should throw an error if they can't read a file.
      // if the error is thrown, then don't bother prompting AI at all and advise that a file could not be found.
    }

    try {
      await promptAI(prompt);

    } catch (err) {
      console.error("Throw");
    }
  }

  process.exit(1);
}

main();
