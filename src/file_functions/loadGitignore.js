// src/file_functions/loadGitignore.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Reference: https://www.npmjs.com/package/ignore
import ignore from 'ignore';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadGitignore() {
  const gitignorePath = path.resolve(__dirname, '../.gitignore');

  // If the file doesn't exist, return an empty instance of ignore();
  if (!fs.existsSync(gitignorePath)) {
    return ignore();
  }

  // If the file does exist, configure the ignore object appropriately
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  return ignore().add(gitignoreContent);
}
