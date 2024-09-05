/* eslint-disable */
// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
// const eslintJest = require('eslint-plugin-jest');

module.exports = tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    // ...eslintJest.configs.recommended,
  ],
  ignores: ['node_modules', 'dist', 'coverage', 'public', 'static', 'vendor'],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.json', './tsconfig.test.json'],
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': 'error',
  },
});
