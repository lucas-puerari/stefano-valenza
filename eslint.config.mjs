import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist/', '.astro/', 'node_modules/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    files: ['scripts/**/*.mjs', '*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.astro', 'src/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },
);
