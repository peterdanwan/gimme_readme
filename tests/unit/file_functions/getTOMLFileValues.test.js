// tests/unit/file_functions/getTOMLFileValues.test.js

import { jest } from '@jest/globals';

const mockFs = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
};

const mockPath = {
  join: jest.fn(),
};

const mockOs = {
  homedir: jest.fn(),
};

const mockTomlParser = {
  parseTOML: jest.fn(),
  getStaticTOMLValue: jest.fn(),
};

// Mock modules using jest.unstable_mockModule
jest.unstable_mockModule('fs', () => ({
  default: mockFs,
  ...mockFs,
}));

jest.unstable_mockModule('path', () => ({
  default: mockPath,
  ...mockPath,
}));

jest.unstable_mockModule('os', () => ({
  default: mockOs,
  ...mockOs,
}));

jest.unstable_mockModule('toml-eslint-parser', () => ({
  default: mockTomlParser,
  ...mockTomlParser,
}));

// Import the module under test after mocking
const getTOMLFileValuesPromise = await import('../../../src/file_functions/getTOMLFileValues.js');
const getTOMLFileValues = getTOMLFileValuesPromise.default;

describe('getTOMLFileValues', () => {
  let mockConsoleError;
  let mockExit;

  beforeEach(() => {
    jest.clearAllMocks();

    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    // Set up a proper home directory
    mockOs.homedir.mockReturnValue('/home/user');

    // Make path.join behave more like the real one
    mockPath.join.mockImplementation((...args) => {
      // Log the arguments to see what's being passed to path.join
      console.log('path.join called with:', args);
      return args.join('/');
    });
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
    mockExit.mockRestore();
  });

  test('should return null when config file does not exist', () => {
    mockFs.existsSync.mockReturnValue(false);

    const result = getTOMLFileValues();

    // Log what os.homedir was called and what it returned
    console.log('os.homedir was called:', mockOs.homedir.mock.calls.length, 'times');
    console.log(
      'os.homedir returned:',
      mockOs.homedir.mock.results.map((r) => r.value)
    );

    expect(mockFs.existsSync).toHaveBeenCalledWith('/.gimme_readme_config');
    expect(result).toBeNull();
  });

  test('should parse and return TOML config when file exists', () => {
    mockFs.existsSync.mockReturnValue(true);
    const mockTOMLContent = 'key = "value"';
    mockFs.readFileSync.mockReturnValue(mockTOMLContent);

    const mockParsedTOML = { type: 'Program', body: [] };
    const mockConfig = { key: 'value' };

    mockTomlParser.parseTOML.mockReturnValue(mockParsedTOML);
    mockTomlParser.getStaticTOMLValue.mockReturnValue(mockConfig);

    const result = getTOMLFileValues();

    expect(mockFs.existsSync).toHaveBeenCalledWith('/.gimme_readme_config');
    expect(mockFs.readFileSync).toHaveBeenCalledWith('/.gimme_readme_config', 'utf-8');
    expect(mockTomlParser.parseTOML).toHaveBeenCalledWith(mockTOMLContent);
    expect(mockTomlParser.getStaticTOMLValue).toHaveBeenCalledWith(mockParsedTOML);
    expect(result).toEqual(mockConfig);
  });

  test('should exit process when TOML parsing fails', () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue('invalid TOML');

    mockTomlParser.parseTOML.mockImplementation(() => {
      throw new Error('Invalid TOML syntax');
    });

    getTOMLFileValues();

    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Error parsing .gimme_readme_config')
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
