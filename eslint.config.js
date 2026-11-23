import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import cypress from 'eslint-plugin-cypress';
import daStyle from 'eslint-config-dicodingacademy';

export default [
  { ignores: ['dist', 'storybook-static'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  daStyle,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'indent': ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': 'off',
      'no-alert': 'off',
    },
  },
  {
    ...cypress.configs.recommended,
    files: ['cypress/**/*.js'],
  },
];
