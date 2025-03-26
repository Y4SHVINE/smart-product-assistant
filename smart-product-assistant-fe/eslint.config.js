import nextPlugin from '@next/eslint-plugin-next';
import nextConfig from 'eslint-config-next';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...nextConfig,
  {
    ignores: ['.next/**', 'node_modules/**', 'build/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-types': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]; 