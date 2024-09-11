// tests/unit/commanderProgram.test.js

import program from '../../src/commanderProgram.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name, version, description } = require('../../package.json');

describe('commanderProgram.js tests', () => {
  test("The program's name, description, and version match what's in package.json", () => {
    expect(program.name()).toBe(name);
    expect(program.version()).toBe(version);

    const colourizedDescription = description.replace(
      'gimme_readme',
      '\x1b[34mgimme_readme\x1b[0m'
    );
    expect(program.description()).toBe(colourizedDescription);
  });
});
