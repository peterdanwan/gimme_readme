#!/usr/bin/env node

/**
 * Imports
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';

// Reference: https://www.npmjs.com/package/ora
// import ora from 'ora';

// Reference: https://github.com/yargs/yargs
// import yargs from 'yargs';

import printBanner from './printBanner';

// Make values from .env available
dotenv.config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Main function
async function main() {
  // Read command-line arguments
  const args = process.argv;
  if (args.length == 2) {
    printBanner();
  }
  // Might be -v or -v or --version
  const filePath = args[2]; // File path provided as argument
  // Resolve the file path to an absolute path
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

// Run the main function
main();
