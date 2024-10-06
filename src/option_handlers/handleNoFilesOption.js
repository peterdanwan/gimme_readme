// src/option_handlers/handleNoFilesOption.js

import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

import getFileContent from '../file_functions/getFileContent.js';
import getTOMLFileValues from '../file_functions/getTOMLFileValues.js';
import promptAI from '../ai.js';
import defaultPrompt from '../defaultPrompt.js';

export default async function handleNoFilesOption(options) {
  const toml = getTOMLFileValues();

  let prompt;

  // Check if both -p and -pf are used
  if (options.prompt && options.promptFile) {
    console.error(chalk.red("Error: Cannot use both '-p' and '-pf' options simultaneously."));
    process.exit(1);
  }

  if (options.promptFile) {
    const promptFilePath = path.resolve(process.cwd(), options.promptFile);
    try {
      prompt = getFileContent(promptFilePath);
    } catch (error) {
      console.error(chalk.red(`Error reading prompt file: ${error.message}`));
      process.exit(1);
    }
  } else if (options.prompt) {
    prompt = options.prompt || defaultPrompt;
  }

  const model = options.model || toml?.preferences.MODEL || process.env.MODEL || 'gemini-1.5-flash';
  const outputFile = options.outputFile || toml?.OUTPUT_FILE || process.env.OUTPUT_FILE || null;
  const temperature =
    options.temperature || toml?.preferences.TEMPERATURE || process.env.TEMPERATURE || 0.5;
  const needToken = options.token || toml?.TOKEN || false;

  console.log(chalk.blue('Sending prompt to the model...'));

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
