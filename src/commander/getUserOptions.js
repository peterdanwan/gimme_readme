// src/commander/getUserOptions.js
import getTOMLFileValues from '../file_functions/getTOMLFileValues.js';

function getOptions(options) {
  const toml = getTOMLFileValues();

  return {
    model: options.model || toml?.preferences.MODEL || process.env.MODEL || 'gemini-1.5-flash',
    outputFile: options.outputFile || toml?.OUTPUT_FILE || process.env.OUTPUT_FILE || null,
    temperature:
      options.temperature || toml?.preferences.TEMPERATURE || process.env.TEMPERATURE || 0.5,
    needToken: options.token || toml?.TOKEN || false,
  };
}

export default getOptions;
