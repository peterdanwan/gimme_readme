// tests/unit/file_functions/loadGitignore.test.js

import { jest } from '@jest/globals';

// Create mock objects
const mockFs = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
};

const mockPath = {
  resolve: jest.fn(),
};

// Create mock for ignore package
const mockIgnoreInstance = {
  add: jest.fn(),
};

const mockIgnore = jest.fn(() => mockIgnoreInstance);

// Mock modules
jest.unstable_mockModule('fs', () => ({
  default: mockFs,
  ...mockFs,
}));

jest.unstable_mockModule('path', () => ({
  default: mockPath,
  ...mockPath,
}));

jest.unstable_mockModule('ignore', () => ({
  default: mockIgnore,
}));

// Import the module under test after mocking
const loadGitignorePromise = await import('../../../src/file_functions/loadGitignore.js');
const loadGitignore = loadGitignorePromise.default;

describe('loadGitignore', () => {
  const mockCwd = '/current/working/dir';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock process.cwd()
    jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

    // Setup default path.resolve behavior
    mockPath.resolve.mockImplementation((...args) => args.join('/'));

    // Make mockIgnore return the mockIgnoreInstance by default
    mockIgnore.mockReturnValue(mockIgnoreInstance);

    // Make mockIgnoreInstance.add return itself by default (for chaining)
    mockIgnoreInstance.add.mockReturnValue(mockIgnoreInstance);
  });

  test('should create empty ignore instance when .gitignore does not exist', () => {
    // Setup
    mockFs.existsSync.mockReturnValue(false);

    // Execute
    const result = loadGitignore();

    // Verify
    expect(mockPath.resolve).toHaveBeenCalledWith(mockCwd, '.gitignore');
    expect(mockFs.existsSync).toHaveBeenCalledWith(`${mockCwd}/.gitignore`);
    expect(mockIgnore).toHaveBeenCalled();
    expect(mockFs.readFileSync).not.toHaveBeenCalled();
    expect(mockIgnoreInstance.add).not.toHaveBeenCalled();
    expect(result).toBe(mockIgnoreInstance);
  });

  test('should load and parse .gitignore when it exists', () => {
    // Setup
    const mockGitignoreContent = 'node_modules/\n.env\n*.log';
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(mockGitignoreContent);

    // Execute
    const result = loadGitignore();

    // Verify
    expect(mockPath.resolve).toHaveBeenCalledWith(mockCwd, '.gitignore');
    expect(mockFs.existsSync).toHaveBeenCalledWith(`${mockCwd}/.gitignore`);
    expect(mockFs.readFileSync).toHaveBeenCalledWith(`${mockCwd}/.gitignore`, 'utf-8');
    expect(mockIgnore).toHaveBeenCalled();
    expect(mockIgnoreInstance.add).toHaveBeenCalledWith(mockGitignoreContent);
    expect(result).toBe(mockIgnoreInstance);
  });

  test('should handle file reading errors', () => {
    // Setup
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error('Permission denied');
    });

    // Execute and verify
    expect(() => loadGitignore()).toThrow('Permission denied');

    // Verify the attempt was made to read the file
    expect(mockFs.readFileSync).toHaveBeenCalledWith(`${mockCwd}/.gitignore`, 'utf-8');
  });
});
