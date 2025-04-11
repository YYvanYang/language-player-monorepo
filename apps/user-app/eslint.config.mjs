// apps/user-app/eslint.config.mjs
import eslintConfigCustom from '@repo/eslint-config-custom'; // Import the shared flat config array

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Spread the shared configurations
  ...eslintConfigCustom,

  // Add user-app specific overrides or configurations here
  // Example: Stricter rules for player components
  // {
  //   files: ["_components/player/**/*.tsx"],
  //   rules: {
  //       "@typescript-eslint/no-explicit-any": "error", // Make 'any' an error here
  //   },
  // },
];

export default eslintConfig;