import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import grafanaConfig from '@grafana/eslint-config/flat.js';

export default defineConfig([
  ...grafanaConfig,
  {
    files: ['src/**/*.{ts,tsx}'],

    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },
  {
    files: ['./tests/**/*'],

    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    ignores: [
      '**/logs',
      '**/*.log',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*',
      '**/.pnpm-debug.log*',
      '**/node_modules/',
      '**/pids',
      '**/*.pid',
      '**/*.seed',
      '**/*.pid.lock',
      '**/lib-cov',
      '**/coverage',
      '**/compiled/',
      '**/dist/',
      '**/artifacts/',
      '**/work/',
      '**/test-results/',
      '**/playwright-report/',
      '**/blob-report/',
      'playwright/.cache/',
      'playwright/.auth/',
      '**/.idea',
      '**/.eslintcache',
    ],
  },
  {
    plugins: {
      prettier: prettier,
    },

    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
