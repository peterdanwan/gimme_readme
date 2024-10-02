// src/ai_model_config/geminiConfig.js

// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';
import getTOMLFileValues from '../file_functions/getTOMLFileValues';

const toml = getTOMLFileValues();
const geminiKey = toml.api_keys.GEMINI_KEY || process.env.GEMINI_KEY;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(geminiKey);

// Export function to handle Gemini-specific prompting
export async function promptGemini(prompt, model, temperature = 0.5) {
  try {
    // Dynamically initialize the Gemini model based on user input
    const generativeModel = genAI.getGenerativeModel({ model, temperature });
    const result = await generativeModel.generateContent(prompt);
    const responseText = result.response.text();
    const usage = result.response.usageMetadata;
    return { responseText, usage };
  } catch (error) {
    throw new Error(`Error prompting Gemini: ${error.message}`);
  }
}
