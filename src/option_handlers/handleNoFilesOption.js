// src/option_handlers/handleNoFilesOption.js

import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

import getFileContent from '../file_functions/getFileContent.js';
import promptAI from '../ai/ai.js';
import defaultPrompt from '../prompt/defaultPrompt.js';
import getUserOptions from '../commander/getUserOptions.js';

export default async function handleNoFilesOption(options) {
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
  } else {
    prompt = defaultPrompt;
  }

  const { model, outputFile, temperature, needToken } = getUserOptions(options);

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
