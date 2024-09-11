#!/usr/bin/env node

// src/_gr.js

import program from './commanderProgram.js';
import getFileContent from './getFileContent.js';
import promptAI from './ai.js';
import defaultPrompt from './defaultPrompt.js';

async function main() {
  const args = process.argv;
  program.parse(args);

  const options = program.opts();

  if (args.length == 2) {
    console.log(program.help());
  }

  if (options.file) {
    const files = options['file'];

    // Let the user specify their own prompt, or use the prompt that we have engineered
    let prompt = options.prompt || defaultPrompt;

    const model = options.model || null;
    const outputFile = options.outputFile || null;

    for (const file of files) {
      console.log('Sending file: ');
      console.log(file);

      try {
        const content = getFileContent(file);
        prompt += content + '\n\n';
      } catch (error) {
        // Catch the error that's thrown if the file could not be read properly.
        console.error(error);
      }
    }

    try {
      await promptAI(prompt, model, outputFile);
    } catch (error) {
      console.error(error);
    }
  }

  process.exit(1);
}

main();
