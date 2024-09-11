// jest.config.js

// Import necessary modules
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the path to your environment file
const envFile = path.join(__dirname, 'env.jest');

// Load environment variables from the env.jest file
dotenv.config({ path: envFile });

// Set Jest options
export default {
  verbose: true,
  testTimeout: 5000,
  transform: {},
};
