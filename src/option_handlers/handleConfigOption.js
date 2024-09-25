// src/option_handlers/handleConfigOption.js
import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to handle config option
export default function handleConfigOption() {
  const configFilePath = path.join(os.homedir(), '.gimme_readme_config');

  if (!fs.existsSync(configFilePath)) {
    // Construct the path to env.sample within the gimme_readme project directory
    const sampleFilePath = path.resolve(__dirname, '../../env.sample');

    let sampleContent;
    try {
      sampleContent = fs.readFileSync(sampleFilePath, 'utf-8');
    } catch (err) {
      console.error(`Could not find env.sample in the project directory: ${err.message}`);
      process.exit(1);
    }

    // Create a new config file with the sample content
    fs.writeFileSync(configFilePath, sampleContent);
    console.log(`Configuration file created at: ${chalk.blue(configFilePath)}`);
  } else {
    console.log(`Configuration file located at: ${chalk.blue(configFilePath)}`);
  }

  console.log(
    `Please refer to the ${chalk.blue('gimme_readme')} repository for examples on how to configure this file: ${chalk.blue('https://github.com/peterdanwan/gimme_readme')}`
  );

  process.exit(0);
}
