// tests/unit/commanderProgram.test.js

import program from '../../src/commanderProgram.js';
import { createRequire } from 'module';
import chalk from 'chalk';

const require = createRequire(import.meta.url);
const { name, version, description } = require('../../package.json');

describe('commanderProgram.js tests', () => {
  test("The program's name, description, and version match what's in package.json", () => {
    const colourizedVersion = `${chalk.blue('gimme_readme')}: ${version}`;

    const colourizedDescription = description.replace('gimme_readme', chalk.blue('gimme_readme'));

    expect(program.name()).toBe(name);
    expect(program.version()).toBe(colourizedVersion);
    expect(program.description()).toBe(colourizedDescription);
  });
});
