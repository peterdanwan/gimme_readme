// tests/unit/ai/models/index.test.js
import modelsString from '../../../../src/ai/models/index.js';
import groqModels from '../../../../src/ai/models/groqModels.js';
import geminiModels from '../../../../src/ai/models/geminiModels.js';

describe('src/ai/models/index.js tests', () => {
  describe('Should return a string with all the models inside', () => {
    test("typeof modelsString === 'string'", () => {
      expect(typeof modelsString).toBe('string');
    });

    test('modelsString should include all models from geminiModels and groqModels', () => {
      // Combine models from geminiModels and groqModels for the expected result
      const expectedModelsString = [...geminiModels, ...groqModels].join(', ');

      // Check that modelsString matches the expected combined string
      expect(modelsString).toBe(expectedModelsString);
    });

    test('modelsString should contain specific model names', () => {
      // Check for individual models
      geminiModels.forEach((model) => {
        expect(modelsString).toContain(model);
      });

      groqModels.forEach((model) => {
        expect(modelsString).toContain(model);
      });
    });
  });
});
