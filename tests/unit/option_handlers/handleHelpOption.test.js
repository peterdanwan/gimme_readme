// tests/unit/option_handlers/handleHelpOption.test.js
import { jest } from '@jest/globals';
import handleHelpOption from '../../../src/option_handlers/handleHelpOption.js';
import commanderProgram from '../../../src/commander/commanderProgram.js';

describe('src/option_handlers/handleHelpOption.js tests', () => {
  test("handleHelpOption() invokes the commander program's help method", () => {
    const helpSpy = jest.spyOn(commanderProgram, 'help').mockImplementation(() => {});

    handleHelpOption(commanderProgram);

    // Proves that passing the commanderProgram to handleHelpOption calls the help
    // method on the commanderProgram
    expect(helpSpy).toHaveBeenCalled();
    helpSpy.mockRestore();
  });
});
