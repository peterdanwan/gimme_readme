// src/option_handlers/handleFilesOption.js

import path from 'path';
import os from 'os';
import dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';

import getFileContent from '../file_functions/getFileContent.js';
import promptAI from '../ai.js';
import defaultPrompt from '../defaultPrompt.js';

// Attempt to load .gimme_readme_config's environment variables
const configFilePath = path.join(os.homedir(), '.gimme_readme_config');
dotenv.config({ path: configFilePath });

export default async function handleFilesOption(files, options) {
  // Let the user specify their own prompt, or use the prompt that we have engineered
  let prompt = options.prompt || process.env.CUSTOM_PROMPT || defaultPrompt;
  const model = options.model || process.env.MODEL || 'gemini-1.5-flash';
  const outputFile = options.outputFile || process.env.OUTPUT_FILE || null; // if no options are being specified, the option would be null, which means it will go out to terminal in the console
  const temperature = options.temperature || process.env.TEMPERATURE || 0.5;
  const needToken = options.token || false;

  const validFiles = [];

  // Check if files is an array and has at least one entry
  if (!Array.isArray(files)) {
    console.log("error: option '-f, --files [files...]' argument missing ");
    process.exit(1);
  }

  for (const file of files) {
    try {
      const content = getFileContent(file);
      prompt += content + '\n\n';
      validFiles.push(file);
    } catch (error) {
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
    await promptAI(prompt, model, temperature, outputFile, needToken);
    spinner.succeed(` Response received from ${chalk.blue(model)} model`);
  } catch (error) {
    spinner.fail(` Failed to receive response from ${chalk.red(model)} model`);
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}
