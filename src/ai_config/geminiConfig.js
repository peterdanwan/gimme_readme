// src/ai_model_config/geminiConfig.js

// Reference: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Make values from .env available
dotenv.config({ path: '.gimme_readme_config' });

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Export function to handle Gemini-specific prompting
export async function promptGemini(prompt, model, temperature = 0.5) {
  try {
    // Dynamically initialize the Gemini model based on user input
    const generativeModel = genAI.getGenerativeModel({ model, temperature });
    const result = await generativeModel.generateContent(prompt);
    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    throw new Error(`Error prompting Gemini: ${error.message}`);
  }
}
