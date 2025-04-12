// apps/admin-panel/eslint.config.mjs
import { defineConfig } from 'eslint/config'; // Import the helper
import eslintConfigRepo from '@repo/eslint-config'; // Import the shared config array

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // Spread the shared configurations defined in @repo/eslint-config
  ...eslintConfigRepo,

  // --- Admin Panel Specific Overrides ---
  // Apply overrides *after* spreading the base config
  {
    files: ["_actions/**/*.ts"],
    rules: {
      "no-console": "off", // Allow console.log/warn/error in admin actions
    },
  },
  // Add more admin-specific rules or overrides here
]);