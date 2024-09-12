// src/ai.js

import fs from 'fs';
import path from 'path';

import groqModels from './ai_models/groqModels.js';
import geminiModels from './ai_models/geminiModels.js';

// Publicly available function
export default async function promptAI(prompt, model, temperature, outputFile) {
  if (model == null) {
    // Set the model to whatever is configured in their .env (default to gemini) and if that isn't set, set it to 'gemini'
    model = 'gemini-1.5-flash';
  }

  try {
    const responseText = await initializeModel(prompt, model, temperature);
    handleOutput(responseText, outputFile);
  } catch (error) {
    throw new Error(error);
  }
}

async function initializeModel(prompt, model, temperature) {
  if (geminiModels.includes(model)) {
    // Dynamically import geminiProvider.js and call promptGemini
    const { promptGemini } = await import('./ai_config/geminiConfig.js');
    return await promptGemini(prompt, model, temperature);
  } else if (groqModels.includes(model)) {
    // Dynamically import groqProvider.js and call promptGroq
    const { promptGroq } = await import('./ai_config/groqConfig.js');
    return await promptGroq(prompt, model, temperature);
  } else {
    throw new Error(`${model} is an unsupported model`);
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
