// tests/unit/ai/config/groqConfig.test.js
import { jest } from '@jest/globals';
import nock from 'nock';
import { promptGroq } from '../../../../src/ai/config/groqConfig.js';

// Mock the TOML file reader
jest.mock('../../../../src/file_functions/getTOMLFileValues.js', () => ({
  __esModule: true,
  default: () => ({ api_keys: { GROQ_KEY: null } }),
}));

describe('src/ai/config/groqConfig.js tests', () => {
  const apiKey = 'test-api-key';
  const baseUrl = 'https://api.groq.com';
  const endpoint = '/openai/v1/chat/completions';

  // Store original env var if it exists
  const originalGroqKey = process.env.GROQ_KEY;

  beforeAll(() => {
    // Ensure clean environment
    delete process.env.GROQ_KEY;
    process.env.GROQ_KEY = apiKey;
  });

  afterAll(() => {
    // Restore original env var state
    if (originalGroqKey) {
      process.env.GROQ_KEY = originalGroqKey;
    } else {
      delete process.env.GROQ_KEY;
    }
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  test('should return a valid response from Groq API', async () => {
    const prompt = 'Hello, how are you?';
    const model = 'test-model';
    const temperature = 0.7;

    const mockResponse = {
      choices: [
        {
          message: {
            content: 'I am fine, thank you!',
          },
        },
      ],
      usage: {
        total_tokens: 10,
        completion_tokens: 5,
        prompt_tokens: 5,
      },
    };

    nock(baseUrl).post(endpoint).reply(200, mockResponse);

    const result = await promptGroq(prompt, model, temperature);

    expect(result.responseText).toBe('I am fine, thank you!');
    expect(result.usage.totalTokenCount).toBe(10);
    expect(result.usage.candidatesTokenCount).toBe(5);
    expect(result.usage.promptTokenCount).toBe(5);
  });

  test('should handle network errors', async () => {
    const prompt = 'Hello, how are you?';
    const model = 'test-model';
    const temperature = 0.7;

    nock(baseUrl).post(endpoint).replyWithError('Connection error');

    await expect(promptGroq(prompt, model, temperature)).rejects.toThrow(
      'Error prompting Groq: Connection error'
    );
  });

  test('should use default temperature when not provided', async () => {
    const prompt = 'Hello';
    const model = 'test-model';

    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Hi',
          },
        },
      ],
      usage: {
        total_tokens: 2,
        completion_tokens: 1,
        prompt_tokens: 1,
      },
    };

    nock(baseUrl)
      .post(endpoint, (body) => body.temperature === 0.5)
      .reply(200, mockResponse);

    const result = await promptGroq(prompt, model);
    expect(result.responseText).toBe('Hi');
  });

  test('should handle API rate limit errors', async () => {
    const prompt = 'Hello';
    const model = 'test-model';

    nock(baseUrl).post(endpoint).replyWithError('Connection error');

    await expect(promptGroq(prompt, model)).rejects.toThrow(
      'Error prompting Groq: Connection error'
    );
  });

  test('should handle empty response choices from API', async () => {
    const prompt = 'Hello';
    const model = 'test-model';

    const mockResponse = {
      choices: [
        {
          message: {
            content: '',
          },
        },
      ],
      usage: {
        total_tokens: 1,
        completion_tokens: 0,
        prompt_tokens: 1,
      },
    };

    nock(baseUrl).post(endpoint).reply(200, mockResponse);

    const result = await promptGroq(prompt, model);
    expect(result.responseText).toBe('');
    expect(result.usage.totalTokenCount).toBe(1);
    expect(result.usage.promptTokenCount).toBe(1);
    expect(result.usage.candidatesTokenCount).toBe(0);
  });

  test('should verify request parameters', async () => {
    const prompt = 'Test prompt';
    const model = 'test-model';
    const temperature = 0.7;

    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Response',
          },
        },
      ],
      usage: {
        total_tokens: 2,
        completion_tokens: 1,
        prompt_tokens: 1,
      },
    };

    nock(baseUrl)
      .post(endpoint, (body) => {
        return (
          body.messages[0].role === 'system' &&
          body.messages[0].content === 'you are a helpful assistant.' &&
          body.messages[1].role === 'user' &&
          body.messages[1].content === prompt &&
          body.model === model &&
          body.temperature === temperature &&
          body.max_tokens === 1024 &&
          body.top_p === 1 &&
          body.stop === null &&
          body.stream === false
        );
      })
      .reply(200, mockResponse);

    await promptGroq(prompt, model, temperature);
  });
});
