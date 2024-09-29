// src/ai_model_config/geminiConfig.js

// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';

// Make values from .env available
const configFilePath = path.join(os.homedir(), '.gimme_readme_config');
dotenv.config({ path: configFilePath });

// Initialize Google Generative AI client

// Export function to handle Gemini-specific prompting
export async function promptGemini(prompt, model, temperature = 0.5, apiKey) {
  try {
    // Dynamically initialize the Gemini model based on user input
    // issue-31 dynamic get apikey from .toml config
    const genAIAPI = apiKey ? apiKey : process.env.GEMINI_KEY
    const genAI = new GoogleGenerativeAI(genAIAPI);

    const generativeModel = genAI.getGenerativeModel({ model, temperature });
    const result = await generativeModel.generateContent(prompt);
    const responseText = result.response.text();
    const usage = result.response.usageMetadata;
    return { responseText, usage };
  } catch (error) {
    throw new Error(`Error prompting Gemini: ${error.message}`);
  }
}
