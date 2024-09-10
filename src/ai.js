// src/ai.js

import dotenv from 'dotenv';

/**************************** API imports ***********************************/
// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';

// Make values from .env available
dotenv.config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // can provide system instruction

// Publicly available function
export default async function promptAI(prompt, modelFlag = 'gemini', outputFlag = 'cmd') {
  // Depending on which model is specified in modelFlag, call the right API's logic

  switch (modelFlag) {
    case 'gemini':
      await promptGemini(prompt, outputFlag);
      break;
    case 'openai':
      await promptOpenAi(prompt, outputFlag);
      break;
    case 'claude':
    default:
      break;
  }
}

// Helpers
async function promptGemini(prompt, outputFlag) {
  // Depending on the outputFlag, output to stdout or paste the content into a file.

  try {
    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();


    console.log(result.response.text());
  } catch (error) {
    // Error will propagate to _gr.js
    throw Error(`Error prompting Gemini ${error}`);
  }
}

async function promptOpenAi(prompt, outputFlag) {
  try {
    
  } catch (error) {
    
  }
}

// handleOutput
function handleOutput(outputFlag) {
  if (outputFlag == 'cmd') {
  } else {
    // output content into a README.md file
  }
}
