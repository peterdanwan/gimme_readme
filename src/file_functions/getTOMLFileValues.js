// src/file_functions/getTOMLFileValues.js

import fs from 'fs';
import path from 'path';
import os from 'os';
import { getStaticTOMLValue, parseTOML } from 'toml-eslint-parser';

const __homeDir = os.homedir();

// Function to handle TOML by default
export default function getTOMLFileValues() {
  const tomlFile = path.join(__homeDir, '.gimme_readme_config');

  if (!fs.existsSync(tomlFile)) {
    return null;
  }

  try {
    const configContent = fs.readFileSync(tomlFile, 'utf-8');
    const tomlParser = parseTOML(configContent);
    const config = getStaticTOMLValue(tomlParser);
    return config;
  } catch (error) {
    console.error(
      `Error parsing .gimme_readme_config. File is not formatted using TOML syntax: ${error}`
    );
    process.exit(1);
  }
}
