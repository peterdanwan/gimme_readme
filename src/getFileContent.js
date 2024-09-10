// src/getFileContent.js

import fs from 'fs';
import path from 'path';

export default function getFileContent(filePath) {
  // Gets the absolute path of the file (this isn't sent to OpenAI)
  const resolvedPath = path.resolve(filePath);

  // Check if the file exists
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: The file "${resolvedPath}" does not exist.`);
    return null;
  }

  // Read file content
  try {
    let fileContent = resolvedPath + '\n';

    fileContent += fs.readFileSync(resolvedPath, 'utf-8');

    console.log(`Resolved path is: ${resolvedPath}`);
    console.log(fileContent);
    console.log('\n');

    return fileContent;
  } catch (error) {
    console.error(`Error reading file "${resolvedPath}": ${error.message}`);
    return null;
  }
}
