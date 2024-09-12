#!/usr/bin/env node

// src/_gr.js

import program from './commanderProgram.js';
import getFileContent from './getFileContent.js';
import promptAI from './ai.js';
import defaultPrompt from './defaultPrompt.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';

// Load .gimme_readme_config as environment variables
dotenv.config({ path: '.gimme_readme_config' });

async function main() {
  const args = process.argv;
  program.parse(args);

  const options = program.opts();

  if (args.length == 2) {
    console.log(program.help());
    process.exit(0);
  }

  // Handle the config option
  if (options.config) {
    // Determine the config file path in the user's home directory
    const configFilePath = path.join(os.homedir(), '.gimme_readme_config');
    if (!fs.existsSync(configFilePath)) {
      // Create a default config file if it doesn't exist
      fs.writeFileSync(
        configFilePath,
        'GEMINI_KEY=your-gemini-api-key\nOPENAI_KEY=your-openai-api-key\nMODEL=gemini\nCUSTOM_PROMPT=Your custom prompt here'
      );
      console.log(`Configuration file created at: ${configFilePath}`);
    } else {
      console.log(`Configuration file located at: ${configFilePath}`);
    }

    console.log(
      'Please refer to the `gimme_readme` repository for examples on how to configure this file: https://github.com/peterdanwan/gimme_readme'
    );

    process.exit(0);
  }

  if (options.file) {
    const files = options['file'];

    // Let the user specify their own prompt, or use the prompt that we have engineered
    let prompt = options.prompt || process.env.CUSTOM_PROMPT || defaultPrompt;
    const model = options.model || process.env.MODEL || 'gemini-1.5-flash';
    const outputFile = options.outputFile || null;
    const temperature = options.temperature || null;

    const validFiles = [];

    for (const file of files) {
      try {
        const content = getFileContent(file);
        prompt += content + '\n\n';
        validFiles.push(file);
      } catch (error) {
        // Catch the error that's thrown if the file could not be read properly.
        console.error(error);
        process.exit(1);
      }
    }

    if (validFiles.length > 1) {
      console.log(chalk.blue('Sending files:'));
      for (const validFile of validFiles) {
        console.log(`- ${validFile}`);
      }
    } else {
      console.log(`${chalk.blue('Sending file')}: ${validFiles[0]}`);
    }

    const spinner = ora(` Waiting for a response from the ${chalk.blue(model)} model...\n`).start();

    try {
      await promptAI(prompt, model, temperature, outputFile);
      spinner.succeed(` Response received from ${chalk.blue(model)} model`);
    } catch (error) {
      spinner.fail(` Failed to receive response from ${chalk.red(model)} model`);
      console.error(error);
      process.exit(1);
    }
  }

  process.exit(0);
}

main();
