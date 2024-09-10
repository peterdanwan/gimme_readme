// tests/unit/commanderProgram.test.js

import program from '../../src/commanderProgram.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name, version, description } = require('../../package.json');

describe('commanderProgram.js tests', () => {
  test("The program's name, description, and version match what's in package.json", () => {
    expect(program.name()).toBe(name);
    expect(program.version()).toBe(version);
    expect(program.description()).toBe(description);
  });
});
