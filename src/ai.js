// src/ai.js

import fs from 'fs';
import path from 'path';
import groqModels from './ai_models/groqModels.js';
import geminiModels from './ai_models/geminiModels.js';
import chalk from 'chalk';

// function call flow is as follows
// 1. promptAI
// 2. promptAI calls initialize model
// 3. initialize model calls promptGemini or promptGroq based on the parameters
// 4. After the text is recieved , the output is written back to the file specified

// Publicly available function
export default async function promptAI(prompt, model, temperature, outputFile, needToken, apiKey = "") {
  if (model === null) {
    // Set the model to whatever is configured in their .env (default to gemini) and if that isn't set, set it to 'gemini'
    model = 'gemini-1.5-flash';
  }

  if (typeof temperature === 'string') {
    // Attempt to convert temperature string into a number
    // If this fails, throw an error
    const tempNumber = parseFloat(temperature);
    if (isNaN(tempNumber)) {
      throw new Error(
        `Invalid temperature value: '${temperature}'. It must be a number or a string that can be converted to a number.`
      );
    }
    temperature = tempNumber;
  }

  try {
    const promptResult = await initializeModel(prompt, model, temperature, apiKey);
    handleOutput(promptResult, outputFile, needToken);
  } catch (error) {
    throw new Error(error);
  }
}

// this function is used to initialize the client based on the model chosen by the user
async function initializeModel(prompt, model, temperature, apiKey = "") {
  if (geminiModels.includes(model)) {
    // Dynamically import geminiProvider.js and call promptGemini
    const { promptGemini } = await import('./ai_config/geminiConfig.js');
    return await promptGemini(prompt, model, temperature, apiKey);
  } else if (groqModels.includes(model)) {
    // Dynamically import groqProvider.js and call promptGroq
    const { promptGroq } =  await import('./ai_config/groqConfig.js');
    return await promptGroq(prompt, model, temperature, apiKey);
  } else {
    throw new Error(`${model} is an unsupported model`);
  }
}

// handleOutput - function used to write response back to the files specified by output
function handleOutput(promptResult, outputFile, needToken) {
  if (outputFile === null) {
    if (needToken && promptResult.usage) {
      displayTokens(promptResult.usage);
      // const totalTokens = promptResult.usage.totalTokenCount;
      // const completionTokens = promptResult.usage.candidatesTokenCount;
      // const promptTokens = promptResult.usage.promptTokenCount;

      // console.log('\nTokens Used:');
      // console.log(`${chalk.yellow('Prompt Tokens:')} ${promptTokens})}`);
      // console.log(`${chalk.yellow('Completion Tokens:')} ${completionTokens}`);
      // console.log(`${chalk.yellow('Total tokens:')} ${totalTokens}`);
    }
    console.log('Result: ' + promptResult.responseText);
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
  if (needToken && promptResult.usage) {
    displayTokens(promptResult.usage);
  }
  fs.writeFileSync(filePath, promptResult.responseText, 'utf-8');
  console.log(`Output successfully written to ${filePath}`);
}

// Helper function to display token information with chalk formatting
function displayTokens(usage) {
  const totalTokens = usage.totalTokenCount || 0;
  const completionTokens = usage.candidatesTokenCount || 0;
  const promptTokens = usage.promptTokenCount || 0;

  console.error();
  console.error(chalk.blue('Tokens Used:'));
  console.error(`${chalk.yellow('Prompt Tokens:')} ${promptTokens}`);
  console.error(`${chalk.yellow('Completion Tokens:')} ${completionTokens}`);
  console.error(`${chalk.yellow('Total Tokens:')} ${totalTokens}`);
}
