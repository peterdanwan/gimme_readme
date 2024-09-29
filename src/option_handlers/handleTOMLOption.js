// src/option_handlers/handleConfigOption.js
import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

// issue31 toml
import { getStaticTOMLValue, parseTOML } from 'toml-eslint-parser';

const __homeDir = os.homedir();
const filesInHomeDirectory = fs.readdirSync(__homeDir);

// Function to handle TOML by default
export default function handleTOMLOption() {
  // issue31 toml
  const tomlFile = filesInHomeDirectory.find((file) => {
    // console.log(file)  un comment this line to debug file on home directory.
    return /\.toml$/.test(file);
  });

  // issue31 toml
  if (tomlFile) {
    // using var to reuse in this scope only.
    var configTOMLPath = path.join(__homeDir, tomlFile);
    console.log(chalk.blue(`Found toml file at home directory ${configTOMLPath}`));
  } else {
    console.error(chalk.red(`No TOML File available on home directory.`));
  }

  try {
    // issue31 toml
    console.log(`${chalk.blue(`checking toml file path' ${configTOMLPath}`)}`);
    var configContent = fs.readFileSync(configTOMLPath, 'utf-8');
    var ast = parseTOML(configContent);
    var config = getStaticTOMLValue(ast);
    //console.log(`Configuration file loaded at : ${chalk.blue(JSON.stringify(config))}`)
    return config;
  } catch (err) {
    console.error(
      `Error at handleConfigOption when system is reading TOML at ${configTOMLPath} with error ${err}`
    );
  }
  process.exit(0);
}
