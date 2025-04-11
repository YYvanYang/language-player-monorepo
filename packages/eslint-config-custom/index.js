// packages/eslint-config-custom/index.js

// Import necessary plugins and parsers for flat config
// Note: Adjust plugin/parser names if they change in future versions
// Check compatibility of plugins with ESLint v9 flat config.
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const nextPlugin = require('@next/eslint-plugin-next');
const reactPlugin = require('eslint-plugin-react');
const hooksPlugin = require('eslint-plugin-react-hooks');
const tailwindPlugin = require('eslint-plugin-tailwindcss');
// Ensure prettier setup is compatible if used (prettier as formatter is preferred over eslint-config-prettier)

// Base configuration reusable across apps/packages
const baseConfig = {
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], // Apply to all relevant files
  languageOptions: {
    // Specify globals (e.g., browser, node) - inherited or specified per section
    globals: {
      React: 'readonly', // Define React global if needed, though import is preferred
      browser: true,
      node: true,
      es2021: true,
    },
    parser: tseslint.parser, // Use TypeScript parser
    parserOptions: {
      ecmaFeatures: { jsx: true }, // Enable JSX parsing
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    react: reactPlugin,
    'react-hooks': hooksPlugin,
    tailwindcss: tailwindPlugin,
    '@next/next': nextPlugin, // Next.js specific plugin
  },
  rules: {
    // --- ESLint Recommended ---
    ...eslint.configs.recommended.rules,
    // --- TypeScript Recommended ---
    ...tseslint.configs.recommended.rules, // Use recommended rules from typescript-eslint
    // --- React Recommended ---
    ...reactPlugin.configs.recommended.rules,
    // --- React Hooks ---
    ...hooksPlugin.configs.recommended.rules,
    // --- Tailwind ---
    ...tailwindPlugin.configs.recommended.rules,
    // --- Next.js ---
    ...nextPlugin.configs['core-web-vitals'].rules, // Use Next.js core web vitals preset

    // --- Custom Overrides ---
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn', // Keep warning on 'any'
    "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
    "react/prop-types": "off", // Not needed with TypeScript
    // Keep Tailwind overrides if necessary
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "warn",
    // Next.js override example
    "@next/next/no-img-element": "warn", // Prefer next/image

    // Add any other project-specific rules
  },
  settings: {
    react: {
      version: 'detect', // Detect React version automatically
    },
  },
  ignores: [
    // Keep ignore patterns consistent
    "node_modules/",
    ".turbo/",
    "dist/",
    ".next/",
    "out/",
    "coverage/",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts", // Ignore TS config files too
    "**/generated/**", // Example: ignore generated files
  ],
};

// Export the configuration array directly for flat config
module.exports = [
    // Apply the base configuration
    baseConfig,
    // Add other configurations if needed (e.g., for specific file types or overrides)
];