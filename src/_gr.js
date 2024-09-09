#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';

// Reference: https://www.npmjs.com/package/ora
// import ora from 'ora';

// Lets us use commonjs require syntax for older modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name, version, description } = require('../package.json');

// Reference: https://github.com/tj/commander.js
const { Command } = require('commander');
const program = new Command();

// Make values from .env available
dotenv.config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Initialize a different AI client

// Main function
async function main() {
  const args = process.argv;

  program.name(name);
  program.description(description);
  program.version(version);

  program.option('-f, --file [files...]', 'specify files');
  program.parse(args);

  const options = program.opts();

  if (args.length == 2 || options.help) {
    console.log(program.help());
  }

  if (options.version) {
    console.log(version);
  }

  if (options.description) {
    console.log(description);
  }

  if (options.file) {
    const argumentsJSON = program.opts();
    const files = argumentsJSON['file'];

    let prompt = '';

    for (let file of files) {
      // appendFileToPrompt();

      prompt += '3';
      console.log(prompt);

      // Paste file content
      console.log(file);
    }

    // console.log(argumentsJSON['file']);
  }

  process.exit(1);
}

// Run the main function
main();

// eslint-disable-next-line no-unused-vars
async function appendFileToPrompt(filePath) {
  const resolvedPath = path.resolve(filePath);
  console.log(resolvedPath);
  // Check if the file exists
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: The file "${resolvedPath}" does not exist.`);
    process.exit(1);
  }
  // Read file content
  const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
  // Create the prompt with the file content
  const prompt = `Take the following code and produce a README.md style response that explains the code (please have code snippets with comments):\n\n${fileContent}`;
  try {
    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error('Error generating content:', error);
  }
}
