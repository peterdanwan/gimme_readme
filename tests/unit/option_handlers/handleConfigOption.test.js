// tests/unit/option_handlers/handleConfigOption.test.js
import fs from 'fs';
import path from 'path';
import os from 'os';
import { jest } from '@jest/globals';
import handleConfigOption from '../../../src/option_handlers/handleConfigOption.js';
import chalk from 'chalk';

// https://builtin.com/articles/check-log-error-jest

describe('src/option_handlers/handleConfigOption.js tests', () => {
  const realHomeDir = os.homedir();
  const realConfigPath = path.join(realHomeDir, '.gimme_readme_config');
  const mockSamplePath = '/mock/gimme_readme/env.sample';
  const mockSampleContent = 'sample config content';

  beforeEach(() => {
    // Clears the mock.calls, mock.instances, mock.contexts and mock.results properties of all mocks. Equivalent to calling .mockClear() on every mocked function.
    jest.clearAllMocks();

    // Common mocks for all tests
    jest.spyOn(path, 'join').mockImplementation(() => realConfigPath);
    jest.spyOn(path, 'resolve').mockImplementation(() => mockSamplePath);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  test('should call path.join with the home directory and .gimme_readme_config', () => {
    handleConfigOption();
    expect(path.join).toHaveBeenCalledWith(realHomeDir, '.gimme_readme_config');
  });

  describe('config file does not exist', () => {
    beforeEach(() => {
      // Setup for config not existing
      jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    });

    describe('& sample file is read', () => {
      beforeEach(() => {
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => mockSampleContent);
      });

      test('creates new config file with sample content', () => {
        handleConfigOption();

        expect(fs.existsSync).toHaveBeenCalledWith(realConfigPath);
        expect(fs.readFileSync).toHaveBeenCalledWith(mockSamplePath, 'utf-8');
        expect(fs.writeFileSync).toHaveBeenCalledWith(realConfigPath, mockSampleContent);
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining(`Configuration file created at: ${chalk.blue(realConfigPath)}`)
        );
        expect(process.exit).toHaveBeenCalledWith(0);
      });
    });

    describe('& sample file cannot be read', () => {
      beforeEach(() => {
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
          throw new Error('Sample file not found');
        });
      });

      test('logs error and exits with code 1', () => {
        handleConfigOption();

        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('Could not find env.sample')
        );
        expect(process.exit).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('when config file exists', () => {
    beforeEach(() => {
      // Setup for config existing
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => mockSampleContent);
    });

    test('does not create new config file and exits normally', () => {
      handleConfigOption();

      expect(fs.existsSync).toHaveBeenCalledWith(realConfigPath);
      expect(fs.readFileSync).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Configuration file located at:')
      );
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });
});
