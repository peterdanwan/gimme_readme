// src/file_functions/loadGitignore.js

import fs from 'fs';
import path from 'path';

// Reference: https://www.npmjs.com/package/ignore
import ignore from 'ignore';

// Publicly available function
export default function loadGitignore() {
  // Resolve .gitignore relative to the current working directory
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');

  // If the file doesn't exist, return an empty instance of ignore();
  if (!fs.existsSync(gitignorePath)) {
    return ignore();
  }

  // If the file does exist, configure the ignore object appropriately
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  return ignore().add(gitignoreContent);
}
