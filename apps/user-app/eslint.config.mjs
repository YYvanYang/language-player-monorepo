// apps/user-app/eslint.config.mjs
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
   ...compat.extends("custom"),
   // Add any user-app specific overrides here if needed
   // {
   //   files: ["_components/player/**/*.tsx"],
   //   rules: { ... }
   // }
];

export default eslintConfig;