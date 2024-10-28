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
    ignores: [
      '_examples/**',
      '.git/**',
      '.github/**',
      '.husky/**',
      '.vscode/**',
      'node_modules/**',
      'package.json',
      'package-lock.json',
    ],
  },
];
