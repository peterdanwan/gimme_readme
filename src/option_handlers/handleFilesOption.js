// src/option_handlers/handleFilesOption.js

import path from 'path';

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';

import getFileContent from '../file_functions/getFileContent.js';
import loadGitignore from '../file_functions/loadGitignore.js';
import promptAI from '../ai/ai.js';
import defaultPrompt from '../prompt/defaultPrompt.js';
import { glob } from 'glob'; // Add glob for pattern matching
import getUserOptions from '../commander/getUserOptions.js';

export default async function handleFilesOption(files, options) {
  let prompt;

  // Check if both -p and -pf are used
  if (options.prompt && options.promptFile) {
    console.error(chalk.red("Error: Cannot use both '-p' and '-pf' simultaneously"));
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

  const validFiles = [];
  const ignoredFiles = [];

  // Check if files is an array and has at least one entry
  if (!Array.isArray(files) || files.length === 0) {
    console.log("error: option '-f, --files [files...]' argument missing ");
    process.exit(1);
  }

  // Load .gitignore and create an ignore object
  const ig = loadGitignore();

  // Process each file: filter based on .gitignore and collect valid/ignored files
  // Function to handle directories and add files within them
  const addFilesFromDir = (directory) => {
    const matchedFiles = glob.sync(`${directory}/**/*`);
    for (const file of matchedFiles) {
      if (fs.statSync(file).isFile()) {
        const relativeFilePath = path.relative(process.cwd(), file);
        if (ig.ignores(relativeFilePath)) {
          ignoredFiles.push(file);
        } else {
          try {
            const content = getFileContent(file);
            prompt += content + '\n\n';
            validFiles.push(file);
          } catch (error) {
            console.error(`Error processing file: ${file}`);
            console.error(error);
          }
        }
      }
    }
  };

  for (const filePattern of files) {
    if (fs.existsSync(filePattern) && fs.statSync(filePattern).isDirectory()) {
      addFilesFromDir(filePattern);
    } else {
      const matchedFiles = glob.sync(filePattern);

      if (matchedFiles.length === 0) {
        console.log(`No files matched the pattern: ${filePattern}`);
        continue;
      }

      for (const file of matchedFiles) {
        if (fs.statSync(file).isFile()) {
          const relativeFilePath = path.relative(process.cwd(), file);
          if (ig.ignores(relativeFilePath)) {
            ignoredFiles.push(file);
          } else {
            try {
              const content = getFileContent(file);
              prompt += content + '\n\n';
              validFiles.push(file);
            } catch (error) {
              console.error(`Error processing file: ${file}`);
              console.error(error);
            }
          }
        }
      }
    }
  }

  if (ignoredFiles.length > 0) {
    console.warn(
      chalk.yellow(`Ignoring the following files due to ${chalk.blue('.gitignore')} patterns:`)
    );
    ignoredFiles.forEach((file) => console.warn(`${chalk.white(' -')} ${chalk.yellow(file)}`));
    console.log();
  }

  if (validFiles.length === 0) {
    console.error(chalk.red('No valid files to process.'));
    process.exit(1);
  }

  if (validFiles.length > 1) {
    console.log(chalk.blue('Sending files:'));
    validFiles.forEach((file) => console.log(`- ${file}`));
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
