// apps/admin-panel/eslint.config.mjs
// Assuming FlatCompat setup is standard across apps
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Use the shared eslint-config-custom which extends next/core-web-vitals etc.
  // Adjust if you need admin-panel specific overrides
  ...compat.extends("custom"),
];

export default eslintConfig;