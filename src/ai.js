// src/ai.js

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

/**************************** API imports ***********************************/
// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';

// Make values from .env available
dotenv.config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // can provide system instruction

// Publicly available function
export default async function promptAI(prompt, model, outputFile) {
  if (model == null) {
    // Set the model to whatever is configured in their .env (default to gemini) and if that isn't set, set it to 'gemini'
    model = 'gemini';
  }

  switch (model) {
    case 'gemini':
      await promptGemini(prompt, outputFile);
      break;
    case 'openai':
      await promptOpenAi(prompt, outputFile);
      break;
    case 'claude':
      break;
    default:
      break;
  }
}

// Helpers
async function promptGemini(prompt, outputFile) {
  // Depending on the outputFlag, output to stdout or paste the content into a file.

  try {
    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    handleOutput(responseText, outputFile);
  } catch (error) {
    // Error will propagate to _gr.js
    throw Error(`Error prompting Gemini ${error}`);
  }
}

// eslint-disable-next-line no-unused-vars
async function promptOpenAi(prompt, outputFile) {
  try {
    // prompt OpenAI
  } catch (error) {
    throw Error(`Error prompting OpenAI ${error}`);
  }
}

// handleOutput
function handleOutput(responseText, outputFile) {
  if (outputFile == null) {
    console.log(responseText);
    return;
  }

  let filePath = path.resolve(outputFile);
  let fileExists = fs.existsSync(filePath);

  // If the file exists, modify the filename slightly
  if (fileExists) {
    const ext = path.extname(outputFile);
    const baseName = path.basename(outputFile, ext);
    const dirName = path.dirname(outputFile);

    // Append a number to the filename to create a unique file
    let counter = 1;

    while (fileExists) {
      filePath = path.join(dirName, `${baseName}_${counter}${ext}`);
      fileExists = fs.existsSync(filePath);
      counter++;
    }

    console.warn(`${outputFile} already exists. Writing to new file: ${filePath}`);
  } else {
    console.log(`Writing output to file: ${filePath}`);
  }

  // Write the content to the file
  fs.writeFileSync(filePath, responseText, 'utf-8');
  console.log(`Output successfully written to ${filePath}`);
}
