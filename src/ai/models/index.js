// src/ai/models/index.js

import geminiModels from './geminiModels.js';
import groqModels from './groqModels.js';

// Combine the two arrays and flatten them
const combinedModels = [...geminiModels, ...groqModels].flat();

// Convert the combined array to a comma-separated string
const modelsString = combinedModels.join(', ');

export default modelsString;
