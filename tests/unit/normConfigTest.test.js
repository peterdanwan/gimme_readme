// tests/unit/normConfigCase.test.js

import normConfigCase from '../../src/option_handlers/handleConfigCase';

describe('normConfigCase', () => {
  it('should convert all keys to lowercase', () => {
    const input = {
      API_KEY: '12345',
      Model: 'gpt-4',
      Temperature: 0.7,
    };
    const expectedOutput = {
      api_key: '12345',
      model: 'gpt-4',
      temperature: 0.7,
    };
    expect(normConfigCase(input)).toEqual(expectedOutput);
  });

  it('should handle an empty configuration object', () => {
    const input = {};
    const expectedOutput = {};
    expect(normConfigCase(input)).toEqual(expectedOutput);
  });

  it('should not modify values, only keys', () => {
    const input = {
      KEY1: 'test1',
      ANOTHER_KEY1: 12345,
    };
    const expectedOutput = {
      key1: 'test1',
      another_key1: 12345,
    };
    expect(normConfigCase(input)).toEqual(expectedOutput);
  });
});