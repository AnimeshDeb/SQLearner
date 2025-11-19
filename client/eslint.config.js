import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // --- ADDED THIS 'rules' SECTION ---
    rules: {
      // Configuration to ignore variables starting with an underscore (_)
      // This allows you to use `node: _node` in your destructured function arguments.
      '@typescript-eslint/no-unused-vars': [
        'warn', // Use 'warn' or 'error'
        { 
          'argsIgnorePattern': '^_', // Ignore unused function arguments starting with '_'
          'varsIgnorePattern': '^_',  // Ignore unused variables starting with '_'
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    }
    // ----------------------------------
  },
])