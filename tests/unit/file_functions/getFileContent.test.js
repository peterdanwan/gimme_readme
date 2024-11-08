// tests/unit/file_functions/getFileContent.test.js

import { jest } from '@jest/globals';

// Reference: https://jestjs.io/docs/ecmascript-modules

// STEP 1: Create mock objects BEFORE module mocking
// We create these mock objects first so we can:
//   1. Configure them in our tests
//   2. Use them in our module mocks
//   3. Access them directly in our assertions
const mockFs = {
  readFileSync: jest.fn(), // Create a Jest mock function for fs.readFileSync
};

const mockPath = {
  resolve: jest.fn(), // Create a Jest mock function for fs.resolve
};

// STEP 2: Mock the modules BEFORE importing the code under test
// This is crucial because when our tested code imports 'fs' and 'path',
// it needs to receive our mocked versions instead of the real modules

// Mock the 'fs' module
jest.unstable_mockModule('fs', () => ({
  // The default export (for `import fs from 'fs'`)
  default: mockFs,
  // Spread the mock object (for `import { readFileSync } from 'fs'`)
  // This handles named imports
  ...mockFs,
}));

// Mock the 'path' module
jest.unstable_mockModule('path', () => ({
  default: mockPath,
  ...mockPath,
}));

// STEP 3: Import the code under test AFTER setting up all mocks
// This is important because the imports in our tested code will now
// receive the MOCKED modules we defined above
const getFileContentPromise = await import('../../../src/file_functions/getFileContent.js');
const getFileContent = getFileContentPromise.default;

// STEP 4: Define our test suite
describe('src/file_functions/getFileContent.js tests', () => {
  // STEP 5: Before each test, reset all mocks to their initial state
  // This ensures each test starts with clean mocks (we can check for specific calls to our mock functions)
  beforeEach(() => {
    jest.clearAllMocks(); // Clears the history of all mock function calls
  });

  // STEP 6: Individual test cases
  test('should read file content and prepend resolved path', async () => {
    // STEP 6a: Set up test data
    const mockResolvedPath = '/absolute/path/to/file.txt';
    const mockContent = 'This is the file content';

    // STEP 6b: Configure mock behavior BEFORE calling the function under test
    // Tell the mock functions what to return when they're called
    mockPath.resolve.mockReturnValue(mockResolvedPath);
    mockFs.readFileSync.mockReturnValue(mockContent);

    // STEP 6c: Call the function under test
    const result = getFileContent('file.txt');

    // STEP 6d: Verify the function behaved correctly
    // Check that our mock functions were called with the expected arguments
    expect(mockPath.resolve).toHaveBeenCalledWith('file.txt');
    expect(mockFs.readFileSync).toHaveBeenCalledWith(mockResolvedPath, 'utf-8');

    // Check that the function returned the expected result
    expect(result).toBe(`${mockResolvedPath}\n${mockContent}`);
  });

  test('should throw an error when file reading fails', async () => {
    // STEP 7a: Set up test data for error case
    const mockResolvedPath = '/absolute/path/to/nonexistent.txt';
    const mockError = new Error('File not found');

    // STEP 7b: Configure mocks to simulate error condition
    mockPath.resolve.mockReturnValue(mockResolvedPath);
    // Use mockImplementation for more complex mock behavior (throwing an error)
    mockFs.readFileSync.mockImplementation(() => {
      throw mockError;
    });

    // STEP 7c: Verify error handling
    // Wrap the function call in another function for Jest's error assertion
    expect(() => getFileContent('nonexistent.txt')).toThrow(
      `Error reading file "${mockResolvedPath}": File not found`
    );

    // STEP 7d: Verify mock was called even in error case
    expect(mockPath.resolve).toHaveBeenCalledWith('nonexistent.txt');
  });
});

/*
TEST LIFECYCLE SUMMARY:

1. Import jest utilities first
2. Create mock objects that we'll use throughout our tests
3. Mock modules using jest.unstable_mockModule BEFORE any imports of tested code
4. Import the code under test AFTER all mocks are set up
5. Define test suite with describe()
6. Set up beforeEach hooks to clean mocks between tests
7. Write individual test cases that:
   - Set up test data
   - Configure mock behavior
   - Call the function
   - Verify results

KEY POINTS:
- Order matters! Mocks must be set up before importing tested code
- Each test should start with clean mocks (hence beforeEach)
- Mock configuration should happen before calling tested function
- Verifications (expects) should happen after calling tested function
- Always verify both happy path and error cases
*/
