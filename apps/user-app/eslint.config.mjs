// apps/user-app/eslint.config.mjs
import { defineConfig } from 'eslint/config'; // Import the helper
import eslintConfigRepo from '@repo/eslint-config'; // Import the shared config array

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // Spread the shared configurations defined in @repo/eslint-config
  ...eslintConfigRepo,

  // --- User App Specific Overrides ---
  // Apply overrides *after* spreading the base config
  // Example:
  // {
  //   files: ["_components/player/**/*.tsx"],
  //   rules: {
  //       "@typescript-eslint/no-explicit-any": "error",
  //   },
  // },
]);