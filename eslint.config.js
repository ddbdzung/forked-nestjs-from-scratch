/* eslint-disable */
// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  ignores: ['node_modules', 'dist', 'coverage', 'public', 'static', 'vendor'],
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
    },
  },
});
