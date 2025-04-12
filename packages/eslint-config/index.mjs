// packages/eslint-config/index.mjs
import { defineConfig } from 'eslint/config'; // ESLint v9.6+ helper
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // 1. Global ignores (remains the same)
  {
    ignores: [
      "**/node_modules/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.ts",
      "**/generated/**",
      ".eslintrc.json",
    ],
  },

  // 2. Base configuration object using extends
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Standard browser globals
        ...globals.node,   // Standard Node.js globals
        ...globals.es2022, // Modern ECMAScript features
        React: 'readonly', // Optional React global
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        // project: true, // Enable if using typed rules that require tsconfig.json
        // tsconfigRootDir: process.cwd(), // Set root directory for tsconfig resolution
      },
    },
    // Define all plugins used in this configuration object
    plugins: {
      '@typescript-eslint': tseslint,
      'react': reactPlugin,
      'react-hooks': hooksPlugin,
      'tailwindcss': tailwindPlugin,
      '@next/next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      tailwindcss: {
        // config: 'tailwind.config.js', // Uncomment if not standard name/location
      },
    },
    // Use extends to incorporate recommended rule sets
    // Note: tseslint.configs.recommended is an array, so spread it here
    // Other plugin configs are objects and can be directly referenced
    extends: [
      eslintJs.configs.recommended,
      // tseslint.configs.recommended, // Spread this below instead
      reactPlugin.configs.recommended,
      hooksPlugin.configs.recommended,
      tailwindPlugin.configs.recommended,
      nextPlugin.configs['core-web-vitals'],
    ],
    // Rules defined here will apply on top of the extended configurations
    rules: {
      // --- Custom Overrides/Additions ---
      // These rules will override any conflicting rules from the 'extends' array
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-key": "warn",

      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "warn",

      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",

      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-debugger": "warn",

      // Add other shared rules or overrides here
    },
  },

  // 3. Spread the TypeScript recommended config array
  // This ensures TS rules are applied correctly after JS/React rules
  ...tseslint.configs.recommended,

  // 4. Optional: Further specific overrides
  // {
  //   files: ["**/*.test.{ts,tsx}"],
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "off",
  //   }
  // }
]);