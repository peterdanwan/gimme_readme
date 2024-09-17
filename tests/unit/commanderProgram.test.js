// tests/unit/commanderProgram.test.js

import program from '../../src/commanderProgram.js';
import modelsString from '../../src/ai_models/index.js';
import { createRequire } from 'module';
import chalk from 'chalk';

const require = createRequire(import.meta.url);
const { name, version, description } = require('../../package.json');

describe('src/commanderProgram.js tests', () => {
  test("The program's name, description, and version match what's in package.json", () => {
    const colourizedVersion = `${chalk.blue('gimme_readme')}: ${version}`;

    const colourizedDescription = description.replace('gimme_readme', chalk.blue('gimme_readme'));

    expect(program.name()).toBe(name);
    expect(program.version()).toBe(colourizedVersion);
    expect(program.description()).toBe(colourizedDescription);
  });

  describe('gimme_readme supports the following option flags', () => {
    // Expected options as an array of objects with flags and descriptions
    const expectedOptions = [
      {
        flags: '-v, --version',
        description: 'output the current version',
      },
      {
        flags: '-f, --file [files...]',
        description: 'specify the files you wish to get explanations for',
      },
      { flags: '-o, --outputFile <string>', description: 'specify the file you wish to output to' },
      {
        flags: '-m, --model <string>',
        description: `specify which free-tier model you'd want to use \ne.g., ${modelsString}`,
      },
      { flags: '-p, --prompt <string>', description: 'specify a custom prompt' },
      {
        flags: '-c, --config',
        description:
          "makes a .gimme_readme_config file if it doesn't exist and/or shows the location of this config file",
      },
      {
        flags: '-t, --temperature <number>',
        description:
          'specify how deterministic you want your AI to be (values should be between 0 to 1)',
      },
    ];

    // Fetch all options defined in the program
    const actualOptions = program.options.map((opt) => ({
      flags: opt.flags,
      description: opt.description,
    }));

    // Check that the number of options matches
    test(`Number of options should be ${actualOptions.length}`, () => {
      expect(expectedOptions.length).toBe(actualOptions.length);
    });

    // Dynamically create a test for each expected option
    expectedOptions.forEach(({ flags, description }) => {
      test(`${flags} - ${description}`, () => {
        // Find the matching option in the actual options array
        const matchingOption = actualOptions.find((opt) => opt.flags === flags);

        // Assert that the option exists and has the correct description
        expect(matchingOption).toBeDefined();
        expect(matchingOption.description).toBe(description);
      });
    });
  });
});
