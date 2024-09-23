// src/file_functions/getFileContent.js

import fs from 'fs';
import path from 'path';

export default function getFileContent(filePath) {
  // Gets the absolute path of the file (this isn't sent to OpenAI)
  const resolvedPath = path.resolve(filePath);

  try {
    // Read file content and prepend the resolved path
    let fileContent = resolvedPath + '\n';
    fileContent += fs.readFileSync(resolvedPath, 'utf-8');
    return fileContent;
  } catch (error) {
    // Throw a custom error message or rethrow the error
    throw new Error(`Error reading file "${resolvedPath}": ${error.message}`);
  }
}
