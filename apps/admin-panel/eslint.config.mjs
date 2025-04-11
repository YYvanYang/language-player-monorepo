// apps/admin-panel/eslint.config.mjs
import eslintConfigCustom from '@repo/eslint-config-custom'; // Import the shared flat config array

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Spread the shared configurations
  ...eslintConfigCustom,

  // Add admin-panel specific overrides or configurations here
  // Example: Allow console logs in admin actions
  // {
  //   files: ["_actions/**/*.ts"],
  //   rules: {
  //     "no-console": "off",
  //   },
  // },
  // Example: Ignore specific admin files
  // {
  //   ignores: ["_components/legacy/**"],
  // }
];

export default eslintConfig;