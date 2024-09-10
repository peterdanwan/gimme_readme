#!/usr/bin/env node

// src/_gr.js

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';

// Reference: https://www.npmjs.com/package/ora
// import ora from 'ora';

import program from './commanderProgram.js';

// Make values from .env available
dotenv.config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Initialize a different AI client

// Main function
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

    console.log(files);
    for (let file of files) {
      console.log(file);

      const content = getFileContent(file);

      if (content) {
        prompt += content + '\n\n';
      }
    }

    await promptAI(prompt);
  }

  process.exit(1);
}

// Run the main function
main();

function getFileContent(filePath) {
  // Gets the absolute path of the file (this isn't sent to OpenAI)
  const resolvedPath = path.resolve(filePath);

  // Check if the file exists
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: The file "${resolvedPath}" does not exist.`);
    return null;
  }

  // Read file content
  try {
    let fileContent = resolvedPath + '\n';

    fileContent += fs.readFileSync(resolvedPath, 'utf-8');

    console.log(`Resolved path is: ${resolvedPath}`);
    console.log(fileContent);
    console.log('\n');

    return fileContent;
  } catch (error) {
    console.error(`Error reading file "${resolvedPath}": ${error.message}`);
    return null;
  }
}

async function promptAI(prompt) {
  try {
    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error('Error generating content:', error);
  }
}
