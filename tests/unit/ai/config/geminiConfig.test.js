// tests/unit/ai/config/geminiConfig.test.js
import { jest } from '@jest/globals';

// Mock objects
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({
  generateContent: mockGenerateContent,
}));

// Export GoogleGenerativeAI as both default and named export
const MockGoogleGenerativeAI = jest.fn(() => ({
  getGenerativeModel: mockGetGenerativeModel,
}));

// Mock the module with both default and named exports
jest.unstable_mockModule('@google/generative-ai', () => ({
  default: MockGoogleGenerativeAI,
  GoogleGenerativeAI: MockGoogleGenerativeAI,
}));

const apiKey = 'test-api-key';
process.env.GEMINI_KEY = apiKey;

// Import the module under test after mocking
const { promptGemini } = await import('../../../../src/ai/config/geminiConfig.js');

describe('src/ai/config/geminiConfig.js tests', () => {
  const model = 'gemini-pro';

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock implementations
    MockGoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));

    mockGetGenerativeModel.mockImplementation(() => ({
      generateContent: mockGenerateContent,
    }));
  });

  // TODO: Fix this test
  // test('should return a valid response from Gemini API', async () => {
  //   const prompt = 'Hello, how are you?';
  //   const temperature = 0.7;

  //   mockGenerateContent.mockResolvedValue({
  //     response: {
  //       text: () => 'I am fine, thank you!',
  //       usageMetadata: {
  //         promptTokenCount: 5,
  //         candidatesTokenCount: 5,
  //         totalTokenCount: 10,
  //       },
  //     },
  //   });

  //   const result = await promptGemini(prompt, model, temperature);

  //   expect(result.responseText).toBe('I am fine, thank you!');
  //   expect(MockGoogleGenerativeAI).toHaveBeenCalledWith(apiKey); // Why isn't this called
  //   expect(mockGetGenerativeModel).toHaveBeenCalledWith({
  //     model,
  //     temperature,
  //   });
  // });

  test('should handle API errors gracefully', async () => {
    const prompt = 'Hello, how are you?';
    const temperature = 0.7;

    mockGenerateContent.mockRejectedValue(new Error('Invalid request'));

    await expect(promptGemini(prompt, model, temperature)).rejects.toThrow(
      'Error prompting Gemini: Invalid request'
    );
  });

  test('should use default temperature when not provided', async () => {
    const prompt = 'Hello';
    const defaultTemperature = 0.5;

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Hi',
        usageMetadata: {
          promptTokenCount: 1,
          candidatesTokenCount: 1,
          totalTokenCount: 2,
        },
      },
    });

    const result = await promptGemini(prompt, model);

    expect(result.responseText).toBe('Hi');
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({
      model,
      temperature: defaultTemperature,
    });
  });

  test('should handle empty response from API', async () => {
    const prompt = 'Hello';

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => '',
        usageMetadata: {
          promptTokenCount: 1,
          candidatesTokenCount: 0,
          totalTokenCount: 1,
        },
      },
    });

    const result = await promptGemini(prompt, model);
    expect(result.responseText).toBe('');
  });

  test('should handle network errors', async () => {
    const prompt = 'Hello';

    mockGenerateContent.mockRejectedValue(new Error('Connection refused'));

    await expect(promptGemini(prompt, model)).rejects.toThrow(
      'Error prompting Gemini: Connection refused'
    );
  });
});
