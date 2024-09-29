import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'module' } },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    // add for issue 31 - TOML configuration
    files: ['*.gr.toml'],
    languageOptions: {
      parser: 'toml-eslint-parser',
    },
  },
];
