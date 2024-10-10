// tests/unit/ai_config/geminiModel.test.js

import geminiModels from '../../../../src/ai/models/geminiModels.js';

describe('src/ai/models/geminiModels.js tests ', () => {
  test("Supported models in test match what's exported from the geminiModels.js module", () => {
    const expectedModels = ['gemini-1.5-flash'];
    expect(geminiModels).toEqual(expectedModels);
  });
});
