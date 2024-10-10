// tests/unit/ai/models/groqModels.test.js

import groqModels from '../../../../src/ai/models/groqModels.js';

describe('src/ai/models/groqModels.js tests ', () => {
  test("Supported models in test match what's exported from the groqModels.js module", () => {
    const expectedModels = ['llama3-8b-8192'];
    expect(groqModels).toEqual(expectedModels);
  });
});
