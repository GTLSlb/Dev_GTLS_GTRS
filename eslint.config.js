// eslint.config.js

import globals from 'globals';
import react from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
  {
    ignores: ['vendor/**/*', 'node_modules/**/*', 'public/**/*', 'storage/**/*'],
  },
  {
    files: ['*.config.js', 'tailwind.config.js', '**/*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // or 'script' if not using ESM in config files
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      'react/no-unescaped-entities': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
