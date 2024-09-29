// src/ai_config/groqConfig.js

// Reference: https://console.groq.com/docs/text-chat#performing-a-basic-chat-completion
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';

// Make values from .env available
const configFilePath = path.join(os.homedir(), '.gimme_readme_config');
dotenv.config({ path: configFilePath });



// Export function to handle Groq-specific prompting
export async function promptGroq(prompt, model, temperature = 0.5, apiKey = "") {
  try {
    // Use provided apiKey, otherwise fall back to environment variable
    const groqApiKey = apiKey || process.env.GROQ_KEY;

    // Initialize Groq AI client with the provided APIKEY either on the TOML or env or argument.
    const groq = new Groq({ apiKey: groqApiKey });
    // Dynamically initialize the Groq model based on user input
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'you are a helpful assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model, // Using dynamic model name passed by the user
      temperature,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '';
    const tokenUsage = chatCompletion.usage || '';
    return {
      responseText,
      usage: {
        totalTokenCount: tokenUsage.total_tokens,
        candidatesTokenCount: tokenUsage.completion_tokens,
        promptTokenCount: tokenUsage.prompt_tokens,
      },
    };
  } catch (error) {
    throw new Error(`Error prompting Groq: ${error.message}`);
  }
}
