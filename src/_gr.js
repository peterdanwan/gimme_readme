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
import { fileURLToPath } from 'url';
import { packageDirectory as pkgDir } from 'pkg-dir';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .gimme_readme_config as environment variables
const configFilePath = path.join(os.homedir(), '.gimme_readme_config');
dotenv.config({ path: configFilePath });

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
    if (!fs.existsSync(configFilePath)) {
      // Find the root directory of the project
      const rootDir = await pkgDir(__dirname);
      if (!rootDir) {
        console.error('Unable to locate the root directory of the project.');
        process.exit(1);
      }

      // Construct the path to env.sample at the root of the project
      const sampleFilePath = path.resolve(rootDir, 'env.sample');
      let sampleContent;

      try {
        sampleContent = fs.readFileSync(sampleFilePath, 'utf-8');
      } catch (err) {
        console.error(`Could not find env.sample: ${err.message}`);
        process.exit(1);
      }

      // Create a new config file with the sample content
      fs.writeFileSync(configFilePath, sampleContent);
      console.log(`Configuration file created at: ${chalk.blue(configFilePath)}`);
    } else {
      console.log(`Configuration file located at: ${chalk.blue(configFilePath)}`);
    }

    console.log(
      `Please refer to the ${chalk.blue('gimme_readme')} repository for examples on how to configure this file: ${chalk.blue('https://github.com/peterdanwan/gimme_readme')}`
    );

    process.exit(0);
  }

  if (options.file) {
    const files = options['file'];

    // Let the user specify their own prompt, or use the prompt that we have engineered
    let prompt = options.prompt || process.env.CUSTOM_PROMPT || defaultPrompt;
    const model = options.model || process.env.MODEL || 'gemini-1.5-flash';
    const outputFile = options.outputFile || process.env.OUTPUT_FILE || null;
    const temperature = options.temperature || process.env.TEMPERATURE || 0.5;

    const validFiles = [];

    // Check if files is an array and has at least one entry
    if (!Array.isArray(files)) {
      console.log("error: option '-f, --file [files...]' argument missing ");
      process.exit(1);
    }

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
